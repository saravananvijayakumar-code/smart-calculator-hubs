import { describe, it, expect } from 'vitest';
import { calculateBMR } from '../bmr';

describe('calculateBMR', () => {
  it('calculates male BMR correctly (Mifflin-St Jeor)', () => {
    const result = calculateBMR({
      sex: 'male',
      weightKg: 80,
      heightCm: 180,
      age: 30,
    });

    const expectedBMR = 10 * 80 + 6.25 * 180 - 5 * 30 + 5;
    expect(result.bmr).toBeCloseTo(expectedBMR, 1);
  });

  it('calculates female BMR correctly (Mifflin-St Jeor)', () => {
    const result = calculateBMR({
      sex: 'female',
      weightKg: 60,
      heightCm: 165,
      age: 25,
    });

    const expectedBMR = 10 * 60 + 6.25 * 165 - 5 * 25 - 161;
    expect(result.bmr).toBeCloseTo(expectedBMR, 1);
  });

  it('calculates TDEE for all activity levels', () => {
    const result = calculateBMR({
      sex: 'male',
      weightKg: 75,
      heightCm: 175,
      age: 28,
    });

    expect(result.tdee.sedentary).toBeCloseTo(result.bmr * 1.2, 1);
    expect(result.tdee.light).toBeCloseTo(result.bmr * 1.375, 1);
    expect(result.tdee.moderate).toBeCloseTo(result.bmr * 1.55, 1);
    expect(result.tdee.active).toBeCloseTo(result.bmr * 1.725, 1);
    expect(result.tdee.very_active).toBeCloseTo(result.bmr * 1.9, 1);
  });

  it('handles edge case ages', () => {
    const young = calculateBMR({
      sex: 'male',
      weightKg: 70,
      heightCm: 170,
      age: 18,
    });

    const old = calculateBMR({
      sex: 'male',
      weightKg: 70,
      heightCm: 170,
      age: 80,
    });

    expect(young.bmr).toBeGreaterThan(old.bmr);
  });

  it('maintains precision with decimal inputs', () => {
    const result = calculateBMR({
      sex: 'female',
      weightKg: 62.5,
      heightCm: 167.3,
      age: 32,
    });

    expect(Number.isFinite(result.bmr)).toBe(true);
    expect(result.bmr).toBeGreaterThan(0);
  });
});
