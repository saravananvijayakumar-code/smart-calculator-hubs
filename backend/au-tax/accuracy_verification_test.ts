import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';

describe('Australian Pay Calculator - 100% Accuracy Verification', () => {
  describe('Comprehensive Real-World Scenarios 2024-25', () => {
    it('Test Case 1: Minimum wage earner ($45,000)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 45000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(result.grossAnnual).toBe(45000);
      expect(result.incomeTax).toBe(3588);
      expect(result.lito).toBe(700);
      expect(result.medicareLevy).toBe(900);
      expect(result.totalTax).toBe(4488);
      expect(result.netAnnual).toBe(40512);
      expect(result.effectiveTaxRate).toBeCloseTo(9.97, 1);
      expect(result.superannuation).toBe(5175);
    });

    it('Test Case 2: Median wage earner ($68,000)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 68000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const expectedTax = 4288 + (68000 - 45000) * 0.30;
      const expectedLITO = 700 - (68000 - 37500) * 0.05;
      
      expect(result.incomeTax).toBe(expectedTax - expectedLITO);
      expect(result.medicareLevy).toBe(1360);
      expect(result.netAnnual).toBeCloseTo(54515, 0);
    });

    it('Test Case 3: Average wage earner ($75,000) with HELP debt', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 75000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: true,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(result.incomeTax).toBe(13288);
      expect(result.medicareLevy).toBe(1500);
      expect(result.helpRepayment).toBe(2250);
      expect(result.totalTax).toBe(17038);
      expect(result.netAnnual).toBe(57962);
    });

    it('Test Case 4: Higher income ($120,000) without private health insurance', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 120000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: true,
        privateCover: false,
        dependants: 0,
        includeSuper: false,
      });

      const expectedTax = 4288 + (120000 - 45000) * 0.30;
      const expectedMedicare = 120000 * 0.02;
      const expectedMLS = 120000 * 0.0125;
      const expectedHELP = 120000 * 0.07;

      expect(result.incomeTax).toBe(expectedTax);
      expect(result.medicareLevy).toBe(expectedMedicare);
      expect(result.medicareLevySurcharge).toBe(expectedMLS);
      expect(result.helpRepayment).toBe(expectedHELP);
      expect(result.totalTax).toBe(expectedTax + expectedMedicare + expectedMLS + expectedHELP);
    });

    it('Test Case 5: Top earner ($250,000) with all deductions', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 250000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: true,
        privateCover: false,
        dependants: 0,
        salarySacrifice: 20000,
        includeSuper: false,
      });

      const taxableIncome = 250000 - 20000;
      const expectedTax = 51638 + (taxableIncome - 190000) * 0.45;
      const mlsIncome = taxableIncome + 20000;
      const expectedMLS = mlsIncome * 0.015;

      expect(result.grossAnnual).toBe(taxableIncome);
      expect(result.incomeTax).toBe(expectedTax);
      expect(result.medicareLevySurcharge).toBe(expectedMLS);
    });

    it('Test Case 6: Non-resident worker ($90,000)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 90000,
        period: 'fortnightly',
        residency: 'non-resident',
        claimTaxFreeThreshold: false,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const expectedTax = 90000 * 0.30;
      expect(result.incomeTax).toBe(expectedTax);
      expect(result.medicareLevy).toBe(0);
      expect(result.lito).toBe(0);
      expect(result.netAnnual).toBe(63000);
    });

    it('Test Case 7: Working holiday maker ($55,000)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 55000,
        period: 'fortnightly',
        residency: 'whm',
        claimTaxFreeThreshold: false,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const expectedTax = 6750 + (55000 - 45000) * 0.30;
      expect(result.incomeTax).toBe(expectedTax);
      expect(result.medicareLevy).toBe(0);
      expect(result.netAnnual).toBe(45250);
    });

    it('Test Case 8: Package including super ($100,000 package)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 100000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: true,
      });

      const ordinaryTime = 100000 / 1.115;
      const super115 = ordinaryTime * 0.115;

      expect(result.grossAnnual).toBeCloseTo(ordinaryTime, 2);
      expect(result.superannuation).toBeCloseTo(super115, 2);
    });

    it('Test Case 9: Low income with Medicare levy shade-in ($24,000)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 24000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const expectedTax = (24000 - 18200) * 0.16;
      const expectedLITO = 700;
      
      expect(result.incomeTax).toBe(Math.max(0, expectedTax - expectedLITO));
      expect(result.medicareLevy).toBeGreaterThan(0);
      expect(result.medicareLevy).toBeLessThan(480);
    });

    it('Test Case 10: Senior with higher thresholds ($40,000)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 40000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        isSenior: true,
        includeSuper: false,
      });

      expect(result.medicareLevy).toBe(0);
    });

    it('Test Case 11: Family with dependants and spouse income', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 50000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 2,
        spouseIncome: 20000,
        includeSuper: false,
      });

      const familyThreshold = 43846 + (2 * 4027);
      const familyIncome = 50000 + 20000;
      
      expect(result.medicareLevy).toBe(1000);
    });

    it('Test Case 12: Salary sacrifice with MLS implications ($110,000 base, $10k sacrifice)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 110000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: false,
        dependants: 0,
        salarySacrifice: 10000,
        includeSuper: false,
      });

      const taxableIncome = 100000;
      const mlsIncome = 110000;
      
      expect(result.grossAnnual).toBe(taxableIncome);
      expect(result.medicareLevySurcharge).toBe(mlsIncome * 0.01);
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('Should handle exactly $18,200 (tax-free threshold)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 18200,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(result.incomeTax).toBe(0);
      expect(result.totalTax).toBe(0);
    });

    it('Should handle $18,201 (first dollar taxed)', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 18201,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(result.incomeTax).toBeCloseTo(0, 0);
    });

    it('Should handle bracket transition at $45,000', async () => {
      const result45k = await calculate({
        year: '2024-25',
        grossAnnual: 45000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const result45k1 = await calculate({
        year: '2024-25',
        grossAnnual: 45001,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const taxDiff = result45k1.trace.grossIncomeTax - result45k.trace.grossIncomeTax;
      expect(taxDiff).toBeCloseTo(0.30, 2);
    });

    it('Should handle HELP threshold exactly at $54,435', async () => {
      const resultBelow = await calculate({
        year: '2024-25',
        grossAnnual: 54434,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: true,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const resultAbove = await calculate({
        year: '2024-25',
        grossAnnual: 54435,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: true,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(resultBelow.helpRepayment).toBe(0);
      expect(resultAbove.helpRepayment).toBeGreaterThan(0);
    });

    it('Should handle MLS threshold exactly at $97,000', async () => {
      const resultBelow = await calculate({
        year: '2024-25',
        grossAnnual: 97000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: false,
        dependants: 0,
        includeSuper: false,
      });

      const resultAbove = await calculate({
        year: '2024-25',
        grossAnnual: 97001,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: false,
        dependants: 0,
        includeSuper: false,
      });

      expect(resultBelow.medicareLevySurcharge).toBe(0);
      expect(resultAbove.medicareLevySurcharge).toBeGreaterThan(0);
    });
  });

  describe('Period Calculation Accuracy', () => {
    it('Should calculate identical annual amounts regardless of period', async () => {
      const weekly = await calculate({
        year: '2024-25',
        grossAnnual: 75000,
        period: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const fortnightly = await calculate({
        year: '2024-25',
        grossAnnual: 75000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      const monthly = await calculate({
        year: '2024-25',
        grossAnnual: 75000,
        period: 'monthly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(weekly.netAnnual).toBe(fortnightly.netAnnual);
      expect(fortnightly.netAnnual).toBe(monthly.netAnnual);
      expect(weekly.totalTax).toBe(fortnightly.totalTax);
      expect(fortnightly.totalTax).toBe(monthly.totalTax);
    });

    it('Should calculate period amounts correctly', async () => {
      const result = await calculate({
        year: '2024-25',
        grossAnnual: 52000,
        period: 'fortnightly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        hasHelp: false,
        privateCover: true,
        dependants: 0,
        includeSuper: false,
      });

      expect(result.grossPeriod).toBe(2000);
      expect(result.grossAnnual).toBe(52000);
      expect(Math.round(result.netPeriod * 26)).toBeCloseTo(result.netAnnual, 0);
    });
  });
});
