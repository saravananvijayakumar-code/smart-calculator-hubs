import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';

describe('Pay Calculator Integration Tests - 2024-25', () => {
  it('should calculate accurate pay for $75,000 resident claiming TFT', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 75000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(75000);
    expect(result.incomeTax).toBe(13288);
    expect(result.lito).toBe(0);
    expect(result.medicareLevy).toBe(1500);
    expect(result.medicareLevySurcharge).toBe(0);
    expect(result.helpRepayment).toBe(0);
    expect(result.totalTax).toBe(14788);
    expect(result.netAnnual).toBe(60212);
    expect(result.netPeriod).toBeCloseTo(60212 / 26, 2);
    expect(result.superannuation).toBe(8625);
    expect(result.effectiveTaxRate).toBeCloseTo(19.72, 1);
    expect(result.marginalTaxRate).toBe(30);
  });

  it('should calculate accurate pay for $50,000 resident with LITO', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 50000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(50000);
    expect(result.incomeTax).toBe(5013);
    expect(result.lito).toBe(75);
    expect(result.medicareLevy).toBe(1000);
    expect(result.totalTax).toBe(6013);
    expect(result.netAnnual).toBe(43987);
  });

  it('should calculate accurate pay for $120,000 resident with HELP debt', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 120000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: true,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(120000);
    expect(result.incomeTax).toBe(26788);
    expect(result.lito).toBe(0);
    expect(result.medicareLevy).toBe(2400);
    expect(result.helpRepayment).toBe(8400);
    expect(result.totalTax).toBe(37588);
    expect(result.netAnnual).toBe(82412);
    expect(result.effectiveTaxRate).toBeCloseTo(31.32, 1);
  });

  it('should calculate accurate pay for $100,000 without private health cover (MLS)', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 100000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: false,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(100000);
    expect(result.incomeTax).toBe(21288);
    expect(result.medicareLevy).toBe(2000);
    expect(result.medicareLevySurcharge).toBe(1000);
    expect(result.totalTax).toBe(24288);
    expect(result.netAnnual).toBe(75712);
  });

  it('should handle salary sacrifice correctly', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 80000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 10000,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(70000);
    expect(result.incomeTax).toBe(11788);
  });

  it('should handle package including super correctly', async () => {
    const packageAmount = 80000;
    const result = await calculate({
      year: '2024-25',
      grossAnnual: packageAmount,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: true,
      isSenior: false,
    });

    const ordinaryTimeEarnings = packageAmount / 1.115;
    const super11_5 = ordinaryTimeEarnings * 0.115;
    
    expect(result.superannuation).toBeCloseTo(super11_5, 2);
    expect(result.grossAnnual).toBeCloseTo(ordinaryTimeEarnings, 2);
  });

  it('should calculate non-resident tax correctly', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 75000,
      period: 'fortnightly',
      residency: 'non-resident',
      claimTaxFreeThreshold: false,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(75000);
    expect(result.incomeTax).toBe(22500);
    expect(result.lito).toBe(0);
    expect(result.medicareLevy).toBe(0);
    expect(result.medicareLevySurcharge).toBe(0);
    expect(result.totalTax).toBe(22500);
    expect(result.netAnnual).toBe(52500);
  });

  it('should handle low income earner below tax-free threshold', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 18200,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.incomeTax).toBe(0);
    expect(result.medicareLevy).toBe(0);
    expect(result.totalTax).toBe(0);
    expect(result.netAnnual).toBe(18200);
  });

  it('should handle high income earner in 45% bracket', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 200000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossAnnual).toBe(200000);
    expect(result.incomeTax).toBe(56138);
    expect(result.medicareLevy).toBe(4000);
    expect(result.totalTax).toBe(60138);
    expect(result.netAnnual).toBe(139862);
    expect(result.marginalTaxRate).toBe(45);
  });

  it('should calculate fortnightly pay period correctly', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 52000,
      period: 'fortnightly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossPeriod).toBe(2000);
    expect(result.grossAnnual).toBe(52000);
  });

  it('should calculate weekly pay period correctly', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 52000,
      period: 'weekly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossPeriod).toBe(1000);
  });

  it('should calculate monthly pay period correctly', async () => {
    const result = await calculate({
      year: '2024-25',
      grossAnnual: 60000,
      period: 'monthly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      hasHelp: false,
      privateCover: true,
      dependants: 0,
      spouseIncome: 0,
      salarySacrifice: 0,
      includeSuper: false,
      isSenior: false,
    });

    expect(result.grossPeriod).toBe(5000);
  });
});
