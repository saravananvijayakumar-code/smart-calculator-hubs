import Decimal from 'decimal.js';
import { safeDecimal, Sex } from './utils';

export interface BodyFatInput {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
  weightKg: number;
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
}

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const { sex, heightCm, neckCm, waistCm, hipCm = 0, weightKg } = input;

  const height = safeDecimal(heightCm);
  const neck = safeDecimal(neckCm);
  const waist = safeDecimal(waistCm);
  const hip = safeDecimal(hipCm);
  const weight = safeDecimal(weightKg);

  let bodyFatPercentage: Decimal;

  if (sex === 'male') {
    const diff = waist.minus(neck);
    if (diff.lte(0)) {
      throw new Error('Waist circumference must be greater than neck circumference');
    }
    
    const log10Diff = Decimal.log10(diff.toNumber());
    const log10Height = Decimal.log10(height.toNumber());
    
    const denominator = safeDecimal(1.0324)
      .minus(safeDecimal(0.19077).times(log10Diff))
      .plus(safeDecimal(0.15456).times(log10Height));
    
    bodyFatPercentage = safeDecimal(495).dividedBy(denominator).minus(450);
  } else {
    const sum = waist.plus(hip).minus(neck);
    if (sum.lte(0)) {
      throw new Error('Waist + hip must be greater than neck circumference');
    }
    
    const log10Sum = Decimal.log10(sum.toNumber());
    const log10Height = Decimal.log10(height.toNumber());
    
    const denominator = safeDecimal(1.29579)
      .minus(safeDecimal(0.35004).times(log10Sum))
      .plus(safeDecimal(0.22100).times(log10Height));
    
    bodyFatPercentage = safeDecimal(495).dividedBy(denominator).minus(450);
  }

  if (bodyFatPercentage.lt(0)) {
    bodyFatPercentage = safeDecimal(0);
  }
  if (bodyFatPercentage.gt(100)) {
    bodyFatPercentage = safeDecimal(100);
  }

  const fatMass = weight.times(bodyFatPercentage).dividedBy(100);
  const leanMass = weight.minus(fatMass);

  return {
    bodyFatPercentage: bodyFatPercentage.toNumber(),
    fatMassKg: fatMass.toNumber(),
    leanMassKg: leanMass.toNumber(),
  };
}
