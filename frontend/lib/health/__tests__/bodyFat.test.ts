import { describe, it, expect } from 'vitest';
import { calculateBodyFat } from '../bodyFat';

describe('calculateBodyFat', () => {
  it('calculates male body fat correctly', () => {
    const result = calculateBodyFat({
      sex: 'male',
      heightCm: 180,
      neckCm: 38,
      waistCm: 85,
      weightKg: 80,
    });

    expect(result.bodyFatPercentage).toBeCloseTo(16.1, 0);
    expect(result.fatMassKg).toBeCloseTo(12.88, 0);
    expect(result.leanMassKg).toBeCloseTo(67.12, 0);
  });

  it('calculates female body fat correctly', () => {
    const result = calculateBodyFat({
      sex: 'female',
      heightCm: 165,
      neckCm: 32,
      waistCm: 70,
      hipCm: 95,
      weightKg: 60,
    });

    expect(result.bodyFatPercentage).toBeCloseTo(24.9, 0);
    expect(result.fatMassKg).toBeCloseTo(14.9, 0);
    expect(result.leanMassKg).toBeCloseTo(45.1, 0);
  });

  it('throws error when waist <= neck for males', () => {
    expect(() => {
      calculateBodyFat({
        sex: 'male',
        heightCm: 180,
        neckCm: 90,
        waistCm: 85,
        weightKg: 80,
      });
    }).toThrow('Waist circumference must be greater than neck circumference');
  });

  it('throws error when waist + hip <= neck for females', () => {
    expect(() => {
      calculateBodyFat({
        sex: 'female',
        heightCm: 165,
        neckCm: 200,
        waistCm: 70,
        hipCm: 95,
        weightKg: 60,
      });
    }).toThrow('Waist + hip must be greater than neck circumference');
  });

  it('clamps body fat percentage to 0-100 range', () => {
    const result = calculateBodyFat({
      sex: 'male',
      heightCm: 180,
      neckCm: 38,
      waistCm: 85,
      weightKg: 80,
    });

    expect(result.bodyFatPercentage).toBeGreaterThanOrEqual(0);
    expect(result.bodyFatPercentage).toBeLessThanOrEqual(100);
  });

  it('maintains precision in calculations', () => {
    const result = calculateBodyFat({
      sex: 'male',
      heightCm: 175.5,
      neckCm: 37.2,
      waistCm: 82.8,
      weightKg: 75.3,
    });

    expect(typeof result.bodyFatPercentage).toBe('number');
    expect(Number.isFinite(result.bodyFatPercentage)).toBe(true);
  });
});
