import Decimal from 'decimal.js';
import { safeDecimal, Sex } from './utils';

export interface IdealWeightInput {
  sex: Sex;
  heightInches: number;
}

export interface IdealWeightResult {
  devine: number;
  hamwi: number;
  robinson: number;
  miller: number;
  range: { min: number; max: number };
}

export function calculateIdealWeight(input: IdealWeightInput): IdealWeightResult {
  const { sex, heightInches } = input;

  if (heightInches < 60) {
    throw new Error('Height must be at least 60 inches (5 feet)');
  }

  const h = safeDecimal(heightInches);
  const base = h.minus(60);

  let devine: Decimal;
  let hamwi: Decimal;
  let robinson: Decimal;
  let miller: Decimal;

  if (sex === 'male') {
    devine = safeDecimal(50).plus(base.times(2.3));
    hamwi = safeDecimal(48.0).plus(base.times(2.7));
    robinson = safeDecimal(52).plus(base.times(1.9));
    miller = safeDecimal(56.2).plus(base.times(1.41));
  } else {
    devine = safeDecimal(45.5).plus(base.times(2.3));
    hamwi = safeDecimal(45.5).plus(base.times(2.2));
    robinson = safeDecimal(49).plus(base.times(1.7));
    miller = safeDecimal(53.1).plus(base.times(1.36));
  }

  const results = [
    devine.toNumber(),
    hamwi.toNumber(),
    robinson.toNumber(),
    miller.toNumber(),
  ];

  const min = Math.min(...results);
  const max = Math.max(...results);

  return {
    devine: devine.toNumber(),
    hamwi: hamwi.toNumber(),
    robinson: robinson.toNumber(),
    miller: miller.toNumber(),
    range: { min, max },
  };
}
