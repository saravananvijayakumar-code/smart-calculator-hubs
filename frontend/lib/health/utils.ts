import Decimal from 'decimal.js';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function safeDecimal(value: number | string): Decimal {
  return new Decimal(value);
}

export function cmToInches(cm: number): number {
  return safeDecimal(cm).dividedBy(2.54).toNumber();
}

export function inchesToCm(inches: number): number {
  return safeDecimal(inches).times(2.54).toNumber();
}

export function kgToLbs(kg: number): number {
  return safeDecimal(kg).times(2.20462).toNumber();
}

export function lbsToKg(lbs: number): number {
  return safeDecimal(lbs).dividedBy(2.20462).toNumber();
}

export function formatNumber(value: number, decimals: number = 2): string {
  return safeDecimal(value).toFixed(decimals);
}

export function formatNumberPrecise(value: number, sigFigs: number = 6): string {
  return safeDecimal(value).toPrecision(sigFigs);
}

export type UnitSystem = 'metric' | 'imperial';
export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const activityLabels: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (exercise 1-3 days/week)',
  moderate: 'Moderate (exercise 3-5 days/week)',
  active: 'Active (exercise 6-7 days/week)',
  very_active: 'Very Active (hard exercise daily)',
};
