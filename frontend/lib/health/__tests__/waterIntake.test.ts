import { describe, it, expect } from 'vitest';
import { calculateWaterIntake } from '../waterIntake';

describe('calculateWaterIntake', () => {
  it('calculates base water intake correctly', () => {
    const result = calculateWaterIntake({
      weightKg: 70,
      exerciseMinutes: 0,
      hotClimate: false,
    });

    expect(result.baseLiters).toBeCloseTo(2.45, 2);
    expect(result.totalLiters).toBeCloseTo(2.45, 2);
  });

  it('adds exercise water correctly', () => {
    const result = calculateWaterIntake({
      weightKg: 70,
      exerciseMinutes: 60,
      hotClimate: false,
    });

    expect(result.exerciseAddLiters).toBeCloseTo(0.7, 2);
    expect(result.totalLiters).toBeCloseTo(2.45 + 0.7, 2);
  });

  it('adds climate adjustment correctly', () => {
    const result = calculateWaterIntake({
      weightKg: 70,
      exerciseMinutes: 0,
      hotClimate: true,
    });

    const baseTotal = 70 * 35 / 1000;
    const climateAdd = baseTotal * 0.1;
    expect(result.climateAddLiters).toBeCloseTo(climateAdd, 2);
    expect(result.totalLiters).toBeCloseTo(baseTotal + climateAdd, 2);
  });

  it('combines all factors correctly', () => {
    const result = calculateWaterIntake({
      weightKg: 80,
      exerciseMinutes: 90,
      hotClimate: true,
    });

    const base = 80 * 35 / 1000;
    const exercise = (90 / 30) * 350 / 1000;
    const beforeClimate = base + exercise;
    const climate = beforeClimate * 0.1;
    const total = beforeClimate + climate;

    expect(result.totalLiters).toBeCloseTo(total, 2);
  });

  it('converts to cups correctly', () => {
    const result = calculateWaterIntake({
      weightKg: 70,
      exerciseMinutes: 0,
      hotClimate: false,
    });

    expect(result.totalCups).toBeCloseTo(result.totalLiters * 4, 1);
  });

  it('handles zero weight edge case', () => {
    const result = calculateWaterIntake({
      weightKg: 0,
      exerciseMinutes: 0,
      hotClimate: false,
    });

    expect(result.totalLiters).toBe(0);
  });

  it('maintains precision with decimal inputs', () => {
    const result = calculateWaterIntake({
      weightKg: 72.5,
      exerciseMinutes: 45,
      hotClimate: true,
    });

    expect(Number.isFinite(result.totalLiters)).toBe(true);
    expect(result.totalLiters).toBeGreaterThan(0);
  });
});
