import { describe, it, expect } from 'vitest';
import { calculateOvulation } from '../ovulation';

describe('calculateOvulation', () => {
  it('calculates ovulation with standard 28-day cycle and 14-day luteal', () => {
    const lmp = new Date('2025-01-01');
    const result = calculateOvulation({
      lmpDate: lmp,
      cycleLength: 28,
      lutealLength: 14,
    });

    const expectedOvulation = new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);
    expect(result.ovulationDate.getTime()).toBe(expectedOvulation.getTime());
  });

  it('adjusts for longer cycle', () => {
    const lmp = new Date('2025-01-01');
    const result = calculateOvulation({
      lmpDate: lmp,
      cycleLength: 32,
      lutealLength: 14,
    });

    const expectedOvulation = new Date(lmp.getTime() + 18 * 24 * 60 * 60 * 1000);
    expect(result.ovulationDate.getTime()).toBe(expectedOvulation.getTime());
  });

  it('adjusts for longer luteal phase', () => {
    const lmp = new Date('2025-01-01');
    const result = calculateOvulation({
      lmpDate: lmp,
      cycleLength: 28,
      lutealLength: 16,
    });

    const expectedOvulation = new Date(lmp.getTime() + 12 * 24 * 60 * 60 * 1000);
    expect(result.ovulationDate.getTime()).toBe(expectedOvulation.getTime());
  });

  it('calculates fertile window correctly', () => {
    const lmp = new Date('2025-01-01');
    const result = calculateOvulation({
      lmpDate: lmp,
      cycleLength: 28,
      lutealLength: 14,
    });

    const ovulation = new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);
    const expectedStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
    const expectedEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000);

    expect(result.fertileWindowStart.getTime()).toBe(expectedStart.getTime());
    expect(result.fertileWindowEnd.getTime()).toBe(expectedEnd.getTime());
  });

  it('throws error for cycle length below 21 days', () => {
    expect(() => {
      calculateOvulation({
        lmpDate: new Date('2025-01-01'),
        cycleLength: 20,
        lutealLength: 14,
      });
    }).toThrow('Cycle length must be between 21 and 35 days');
  });

  it('throws error for cycle length above 35 days', () => {
    expect(() => {
      calculateOvulation({
        lmpDate: new Date('2025-01-01'),
        cycleLength: 36,
        lutealLength: 14,
      });
    }).toThrow('Cycle length must be between 21 and 35 days');
  });

  it('throws error for luteal length below 12 days', () => {
    expect(() => {
      calculateOvulation({
        lmpDate: new Date('2025-01-01'),
        cycleLength: 28,
        lutealLength: 11,
      });
    }).toThrow('Luteal phase length must be between 12 and 16 days');
  });

  it('throws error for luteal length above 16 days', () => {
    expect(() => {
      calculateOvulation({
        lmpDate: new Date('2025-01-01'),
        cycleLength: 28,
        lutealLength: 17,
      });
    }).toThrow('Luteal phase length must be between 12 and 16 days');
  });

  it('handles date boundaries correctly', () => {
    const lmp = new Date('2025-01-28');
    const result = calculateOvulation({
      lmpDate: lmp,
      cycleLength: 28,
      lutealLength: 14,
    });

    expect(result.ovulationDate.getMonth()).toBe(1);
  });
});
