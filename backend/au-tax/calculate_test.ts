import { describe, it, expect } from 'vitest';
import {
  calcResidentIncomeTax,
  calcLITO,
  calcMedicareLevy,
  calcMLS,
  calcHELP,
  calcSG,
} from './engine';

describe('Australian Tax Calculator - 2024-25', () => {
  describe('Income Tax Calculations', () => {
    it('should calculate zero tax for income below tax-free threshold', () => {
      const tax = calcResidentIncomeTax('2024-25', 18200);
      expect(tax).toBe(0);
    });

    it('should calculate 16% tax on income between $18,201 and $45,000', () => {
      const tax = calcResidentIncomeTax('2024-25', 30000);
      expect(tax).toBe((30000 - 18200) * 0.16);
      expect(tax).toBe(1888);
    });

    it('should calculate tax correctly for $45,000', () => {
      const tax = calcResidentIncomeTax('2024-25', 45000);
      expect(tax).toBe((45000 - 18200) * 0.16);
      expect(tax).toBe(4288);
    });

    it('should calculate tax correctly for $75,000 (30% bracket)', () => {
      const tax = calcResidentIncomeTax('2024-25', 75000);
      const expected = 4288 + (75000 - 45000) * 0.30;
      expect(tax).toBe(expected);
      expect(tax).toBe(13288);
    });

    it('should calculate tax correctly for $135,000 (top of 30% bracket)', () => {
      const tax = calcResidentIncomeTax('2024-25', 135000);
      const expected = 4288 + (135000 - 45000) * 0.30;
      expect(tax).toBe(expected);
      expect(tax).toBe(31288);
    });

    it('should calculate tax correctly for $150,000 (37% bracket)', () => {
      const tax = calcResidentIncomeTax('2024-25', 150000);
      const expected = 31288 + (150000 - 135000) * 0.37;
      expect(tax).toBe(expected);
      expect(tax).toBe(36838);
    });

    it('should calculate tax correctly for $200,000 (45% bracket)', () => {
      const tax = calcResidentIncomeTax('2024-25', 200000);
      const expected = 51638 + (200000 - 190000) * 0.45;
      expect(tax).toBe(expected);
      expect(tax).toBe(56138);
    });
  });

  describe('LITO (Low Income Tax Offset)', () => {
    it('should provide full $700 offset for income <= $37,500', () => {
      expect(calcLITO('2024-25', 30000)).toBe(700);
      expect(calcLITO('2024-25', 37500)).toBe(700);
    });

    it('should shade out LITO between $37,500 and $66,667', () => {
      const lito = calcLITO('2024-25', 50000);
      const reduction = (50000 - 37500) * 0.05;
      expect(lito).toBe(700 - reduction);
      expect(lito).toBe(75);
    });

    it('should provide zero LITO for income >= $66,667', () => {
      expect(calcLITO('2024-25', 66667)).toBe(0);
      expect(calcLITO('2024-25', 80000)).toBe(0);
    });
  });

  describe('Medicare Levy', () => {
    it('should calculate 2% medicare levy for single above threshold', () => {
      const levy = calcMedicareLevy('2024-25', 50000);
      expect(levy).toBe(50000 * 0.02);
      expect(levy).toBe(1000);
    });

    it('should be zero for singles below shade-in start', () => {
      const levy = calcMedicareLevy('2024-25', 23000);
      expect(levy).toBe(0);
    });

    it('should shade in for singles between $23,226 and $26,000', () => {
      const levy = calcMedicareLevy('2024-25', 24000);
      expect(levy).toBeGreaterThan(0);
      expect(levy).toBeLessThan(24000 * 0.02);
    });

    it('should calculate full 2% levy at threshold', () => {
      const levy = calcMedicareLevy('2024-25', 26000);
      expect(levy).toBe(26000 * 0.02);
      expect(levy).toBe(520);
    });

    it('should handle family thresholds with dependants', () => {
      const levy = calcMedicareLevy('2024-25', 50000, {
        isFamily: true,
        dependants: 2,
        spouseIncome: 0,
      });
      expect(levy).toBe(50000 * 0.02);
    });
  });

  describe('Medicare Levy Surcharge (MLS)', () => {
    it('should be zero when private cover is held', () => {
      const mls = calcMLS('2024-25', 150000, true, 0);
      expect(mls).toBe(0);
    });

    it('should be zero for singles under $97,000', () => {
      const mls = calcMLS('2024-25', 90000, false, 0);
      expect(mls).toBe(0);
    });

    it('should be 1% for singles earning $97,001-$113,000', () => {
      const mls = calcMLS('2024-25', 100000, false, 0);
      expect(mls).toBe(100000 * 0.01);
      expect(mls).toBe(1000);
    });

    it('should be 1.25% for singles earning $113,001-$151,000', () => {
      const mls = calcMLS('2024-25', 120000, false, 0);
      expect(mls).toBe(120000 * 0.0125);
      expect(mls).toBe(1500);
    });

    it('should be 1.5% for singles earning over $151,000', () => {
      const mls = calcMLS('2024-25', 160000, false, 0);
      expect(mls).toBe(160000 * 0.015);
      expect(mls).toBe(2400);
    });
  });

  describe('HELP Repayment', () => {
    it('should be zero below $54,435 threshold', () => {
      const help = calcHELP('2024-25', 50000);
      expect(help).toBe(0);
    });

    it('should be 1% for income $54,435-$62,850', () => {
      const help = calcHELP('2024-25', 60000);
      expect(help).toBe(60000 * 0.01);
      expect(help).toBe(600);
    });

    it('should be 2% for income $62,851-$66,620', () => {
      const help = calcHELP('2024-25', 65000);
      expect(help).toBe(65000 * 0.02);
      expect(help).toBe(1300);
    });

    it('should be 10% for income above $159,664', () => {
      const help = calcHELP('2024-25', 200000);
      expect(help).toBe(200000 * 0.10);
      expect(help).toBe(20000);
    });
  });

  describe('Superannuation Guarantee', () => {
    it('should calculate 11.5% SG for 2024-25', () => {
      const sg = calcSG('2024-25', 75000);
      expect(sg).toBe(75000 * 0.115);
      expect(sg).toBe(8625);
    });

    it('should calculate 12% SG for 2025-26', () => {
      const sg = calcSG('2025-26', 75000);
      expect(sg).toBe(75000 * 0.12);
      expect(sg).toBe(9000);
    });
  });

  describe('Real-world Test Cases', () => {
    it('should calculate accurate take-home for $75,000 salary', () => {
      const income = 75000;
      const incomeTax = calcResidentIncomeTax('2024-25', income);
      const lito = calcLITO('2024-25', income);
      const medicareLevy = calcMedicareLevy('2024-25', income);
      
      const netTax = Math.max(0, incomeTax - lito);
      const totalTax = netTax + medicareLevy;
      const takeHome = income - totalTax;
      
      expect(incomeTax).toBe(13288);
      expect(lito).toBe(0);
      expect(medicareLevy).toBe(1500);
      expect(totalTax).toBe(14788);
      expect(takeHome).toBe(60212);
    });

    it('should calculate accurate take-home for $50,000 salary with LITO', () => {
      const income = 50000;
      const incomeTax = calcResidentIncomeTax('2024-25', income);
      const lito = calcLITO('2024-25', income);
      const medicareLevy = calcMedicareLevy('2024-25', income);
      
      const netTax = Math.max(0, incomeTax - lito);
      const totalTax = netTax + medicareLevy;
      const takeHome = income - totalTax;
      
      expect(incomeTax).toBe(5088);
      expect(lito).toBe(75);
      expect(netTax).toBe(5013);
      expect(medicareLevy).toBe(1000);
      expect(totalTax).toBe(6013);
      expect(takeHome).toBe(43987);
    });
  });
});
