import { describe, it, expect } from 'vitest';
import { calculateHeartRateZones } from '../heartRateZone';

describe('calculateHeartRateZones', () => {
  it('calculates max HR using basic method (220 - age)', () => {
    const result = calculateHeartRateZones({
      age: 30,
      method: 'basic',
    });

    expect(result.maxHR).toBe(190);
  });

  it('calculates max HR using Tanaka method', () => {
    const result = calculateHeartRateZones({
      age: 30,
      method: 'tanaka',
    });

    const expected = 208 - 0.7 * 30;
    expect(result.maxHR).toBe(Math.round(expected));
  });

  it('calculates zones as percentage of max HR', () => {
    const result = calculateHeartRateZones({
      age: 30,
      method: 'basic',
    });

    expect(result.zones[0].min).toBe(Math.round(190 * 0.5));
    expect(result.zones[0].max).toBe(Math.round(190 * 0.6));
    expect(result.zones[4].min).toBe(Math.round(190 * 0.9));
    expect(result.zones[4].max).toBe(Math.round(190 * 1.0));
  });

  it('uses Karvonen method with resting HR', () => {
    const result = calculateHeartRateZones({
      age: 30,
      restingHR: 60,
      method: 'karvonen',
    });

    const maxHR = 190;
    const reserve = maxHR - 60;
    const expectedMin = Math.round(reserve * 0.5 + 60);
    const expectedMax = Math.round(reserve * 0.6 + 60);

    expect(result.zones[0].min).toBe(expectedMin);
    expect(result.zones[0].max).toBe(expectedMax);
  });

  it('returns 5 zones', () => {
    const result = calculateHeartRateZones({
      age: 30,
      method: 'basic',
    });

    expect(result.zones).toHaveLength(5);
  });

  it('zones have correct labels', () => {
    const result = calculateHeartRateZones({
      age: 30,
      method: 'basic',
    });

    expect(result.zones[0].name).toContain('Zone 1');
    expect(result.zones[4].name).toContain('Zone 5');
  });

  it('handles edge case ages', () => {
    const young = calculateHeartRateZones({
      age: 20,
      method: 'basic',
    });

    const old = calculateHeartRateZones({
      age: 70,
      method: 'basic',
    });

    expect(young.maxHR).toBeGreaterThan(old.maxHR);
  });

  it('zones are in ascending order', () => {
    const result = calculateHeartRateZones({
      age: 30,
      method: 'basic',
    });

    for (let i = 1; i < result.zones.length; i++) {
      expect(result.zones[i].min).toBeGreaterThanOrEqual(result.zones[i - 1].max);
    }
  });
});
