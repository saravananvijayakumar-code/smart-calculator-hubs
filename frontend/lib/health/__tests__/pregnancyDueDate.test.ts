import { describe, it, expect } from 'vitest';
import { calculatePregnancyDueDate } from '../pregnancyDueDate';

describe('calculatePregnancyDueDate', () => {
  it('calculates EDD with standard 28-day cycle', () => {
    const lmp = new Date('2025-01-01');
    const result = calculatePregnancyDueDate({
      lmpDate: lmp,
      cycleLength: 28,
    });

    const expectedEDD = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    expect(result.edd.getTime()).toBe(expectedEDD.getTime());
  });

  it('adjusts for longer cycle', () => {
    const lmp = new Date('2025-01-01');
    const result = calculatePregnancyDueDate({
      lmpDate: lmp,
      cycleLength: 32,
    });

    const expectedEDD = new Date(lmp.getTime() + (280 + 4) * 24 * 60 * 60 * 1000);
    expect(result.edd.getTime()).toBe(expectedEDD.getTime());
  });

  it('adjusts for shorter cycle', () => {
    const lmp = new Date('2025-01-01');
    const result = calculatePregnancyDueDate({
      lmpDate: lmp,
      cycleLength: 25,
    });

    const expectedEDD = new Date(lmp.getTime() + (280 - 3) * 24 * 60 * 60 * 1000);
    expect(result.edd.getTime()).toBe(expectedEDD.getTime());
  });

  it('throws error for cycle length below 21 days', () => {
    expect(() => {
      calculatePregnancyDueDate({
        lmpDate: new Date('2025-01-01'),
        cycleLength: 20,
      });
    }).toThrow('Cycle length must be between 21 and 35 days');
  });

  it('throws error for cycle length above 35 days', () => {
    expect(() => {
      calculatePregnancyDueDate({
        lmpDate: new Date('2025-01-01'),
        cycleLength: 36,
      });
    }).toThrow('Cycle length must be between 21 and 35 days');
  });

  it('calculates correct trimester', () => {
    const lmp10WeeksAgo = new Date(Date.now() - 70 * 24 * 60 * 60 * 1000);
    const result = calculatePregnancyDueDate({
      lmpDate: lmp10WeeksAgo,
      cycleLength: 28,
    });

    expect(result.trimester).toBe(1);
  });

  it('calculates milestones correctly', () => {
    const lmp = new Date('2025-01-01');
    const result = calculatePregnancyDueDate({
      lmpDate: lmp,
      cycleLength: 28,
    });

    const week12 = new Date(lmp.getTime() + 12 * 7 * 24 * 60 * 60 * 1000);
    expect(result.milestones.week12.getTime()).toBe(week12.getTime());
  });

  it('handles leap year dates', () => {
    const lmp = new Date('2024-02-01');
    const result = calculatePregnancyDueDate({
      lmpDate: lmp,
      cycleLength: 28,
    });

    expect(result.edd.getFullYear()).toBe(2024);
  });
});
