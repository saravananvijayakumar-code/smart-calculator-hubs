import Decimal from 'decimal.js';
import { safeDecimal, Sex, ActivityLevel, activityFactors } from './utils';

export interface BMRInput {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
}

export interface BMRResult {
  bmr: number;
  tdee: Record<ActivityLevel, number>;
}

export function calculateBMR(input: BMRInput): BMRResult {
  const { sex, weightKg, heightCm, age } = input;

  const w = safeDecimal(weightKg);
  const h = safeDecimal(heightCm);
  const a = safeDecimal(age);

  let bmr: Decimal;

  if (sex === 'male') {
    bmr = w.times(10)
      .plus(h.times(6.25))
      .minus(a.times(5))
      .plus(5);
  } else {
    bmr = w.times(10)
      .plus(h.times(6.25))
      .minus(a.times(5))
      .minus(161);
  }

  const bmrValue = bmr.toNumber();

  const tdee: Record<ActivityLevel, number> = {
    sedentary: bmr.times(activityFactors.sedentary).toNumber(),
    light: bmr.times(activityFactors.light).toNumber(),
    moderate: bmr.times(activityFactors.moderate).toNumber(),
    active: bmr.times(activityFactors.active).toNumber(),
    very_active: bmr.times(activityFactors.very_active).toNumber(),
  };

  return { bmr: bmrValue, tdee };
}
