import { describe, it, expect } from 'vitest';
import { calculateIdealWeight } from '../idealWeight';

describe('calculateIdealWeight', () => {
  it('calculates male ideal weight for 70 inches', () => {
    const result = calculateIdealWeight({
      sex: 'male',
      heightInches: 70,
    });

    expect(result.devine).toBeCloseTo(50 + 2.3 * 10, 1);
    expect(result.hamwi).toBeCloseTo(48.0 + 2.7 * 10, 1);
    expect(result.robinson).toBeCloseTo(52 + 1.9 * 10, 1);
    expect(result.miller).toBeCloseTo(56.2 + 1.41 * 10, 1);
  });

  it('calculates female ideal weight for 65 inches', () => {
    const result = calculateIdealWeight({
      sex: 'female',
      heightInches: 65,
    });

    expect(result.devine).toBeCloseTo(45.5 + 2.3 * 5, 1);
    expect(result.hamwi).toBeCloseTo(45.5 + 2.2 * 5, 1);
    expect(result.robinson).toBeCloseTo(49 + 1.7 * 5, 1);
    expect(result.miller).toBeCloseTo(53.1 + 1.36 * 5, 1);
  });

  it('calculates range correctly', () => {
    const result = calculateIdealWeight({
      sex: 'male',
      heightInches: 72,
    });

    const values = [result.devine, result.hamwi, result.robinson, result.miller];
    expect(result.range.min).toBe(Math.min(...values));
    expect(result.range.max).toBe(Math.max(...values));
  });

  it('throws error for height below 60 inches', () => {
    expect(() => {
      calculateIdealWeight({
        sex: 'male',
        heightInches: 59,
      });
    }).toThrow('Height must be at least 60 inches');
  });

  it('handles exactly 60 inches (base case)', () => {
    const male = calculateIdealWeight({
      sex: 'male',
      heightInches: 60,
    });

    expect(male.devine).toBeCloseTo(50, 1);
    expect(male.hamwi).toBeCloseTo(48.0, 1);
    expect(male.robinson).toBeCloseTo(52, 1);
    expect(male.miller).toBeCloseTo(56.2, 1);
  });

  it('maintains precision with decimal heights', () => {
    const result = calculateIdealWeight({
      sex: 'female',
      heightInches: 67.5,
    });

    expect(Number.isFinite(result.devine)).toBe(true);
    expect(Number.isFinite(result.hamwi)).toBe(true);
    expect(Number.isFinite(result.robinson)).toBe(true);
    expect(Number.isFinite(result.miller)).toBe(true);
  });
});
