import { describe, it, expect } from 'vitest';
import { calculateSleep } from '../sleepCalculator';

describe('calculateSleep', () => {
  it('calculates wake times when sleeping at 10 PM', () => {
    const sleepTime = new Date('2025-01-01T22:00:00');
    const result = calculateSleep({
      mode: 'sleep_at',
      time: sleepTime,
      sleepLatencyMinutes: 15,
    });

    expect(result.suggestedTimes).toHaveLength(3);
    
    const firstWake = new Date('2025-01-02T04:15:00');
    expect(result.suggestedTimes[0].getTime()).toBe(firstWake.getTime());
  });

  it('calculates bed times when waking at 6 AM', () => {
    const wakeTime = new Date('2025-01-02T06:00:00');
    const result = calculateSleep({
      mode: 'wake_at',
      time: wakeTime,
      sleepLatencyMinutes: 15,
    });

    expect(result.suggestedTimes).toHaveLength(3);
    
    expect(result.suggestedTimes[0].getTime()).toBeLessThan(wakeTime.getTime());
    expect(result.suggestedTimes[1].getTime()).toBeLessThan(wakeTime.getTime());
    expect(result.suggestedTimes[2].getTime()).toBeLessThan(wakeTime.getTime());
  });

  it('respects custom sleep latency', () => {
    const sleepTime = new Date('2025-01-01T22:00:00');
    const result = calculateSleep({
      mode: 'sleep_at',
      time: sleepTime,
      sleepLatencyMinutes: 30,
    });

    const firstWake = new Date('2025-01-02T04:30:00');
    expect(result.suggestedTimes[0].getTime()).toBe(firstWake.getTime());
  });

  it('clamps latency to 0-30 minute range', () => {
    const sleepTime = new Date('2025-01-01T22:00:00');
    
    const tooLow = calculateSleep({
      mode: 'sleep_at',
      time: sleepTime,
      sleepLatencyMinutes: -10,
    });

    const tooHigh = calculateSleep({
      mode: 'sleep_at',
      time: sleepTime,
      sleepLatencyMinutes: 60,
    });

    expect(tooLow.suggestedTimes[0].getTime()).toBe(
      new Date('2025-01-02T04:00:00').getTime()
    );
    
    expect(tooHigh.suggestedTimes[0].getTime()).toBe(
      new Date('2025-01-02T04:30:00').getTime()
    );
  });

  it('handles date wrap-around correctly', () => {
    const sleepTime = new Date('2025-01-01T23:30:00');
    const result = calculateSleep({
      mode: 'sleep_at',
      time: sleepTime,
      sleepLatencyMinutes: 15,
    });

    expect(result.suggestedTimes[0].getDate()).toBe(2);
  });

  it('produces times in ascending order for sleep_at mode', () => {
    const sleepTime = new Date('2025-01-01T22:00:00');
    const result = calculateSleep({
      mode: 'sleep_at',
      time: sleepTime,
      sleepLatencyMinutes: 15,
    });

    for (let i = 1; i < result.suggestedTimes.length; i++) {
      expect(result.suggestedTimes[i].getTime()).toBeGreaterThan(
        result.suggestedTimes[i - 1].getTime()
      );
    }
  });

  it('produces times in descending order for wake_at mode', () => {
    const wakeTime = new Date('2025-01-02T06:00:00');
    const result = calculateSleep({
      mode: 'wake_at',
      time: wakeTime,
      sleepLatencyMinutes: 15,
    });

    for (let i = 1; i < result.suggestedTimes.length; i++) {
      expect(result.suggestedTimes[i].getTime()).toBeGreaterThan(
        result.suggestedTimes[i - 1].getTime()
      );
    }
  });
});
