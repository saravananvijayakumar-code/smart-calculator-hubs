import { safeDecimal } from './utils';

export interface SleepInput {
  mode: 'sleep_at' | 'wake_at';
  time: Date;
  sleepLatencyMinutes: number;
  cycles?: number;
}

export interface SleepResult {
  suggestedTimes: Date[];
}

const CYCLE_MINUTES = 90;

export function calculateSleep(input: SleepInput): SleepResult {
  const { mode, time, sleepLatencyMinutes } = input;
  const latency = Math.max(0, Math.min(30, sleepLatencyMinutes));

  const suggestedTimes: Date[] = [];

  if (mode === 'sleep_at') {
    for (let cycles = 4; cycles <= 6; cycles++) {
      const sleepDurationMinutes = safeDecimal(cycles).times(CYCLE_MINUTES).toNumber();
      const totalMinutes = safeDecimal(sleepDurationMinutes).plus(latency).toNumber();
      
      const wakeTime = new Date(time.getTime() + totalMinutes * 60 * 1000);
      suggestedTimes.push(wakeTime);
    }
  } else {
    for (let cycles = 4; cycles <= 6; cycles++) {
      const sleepDurationMinutes = safeDecimal(cycles).times(CYCLE_MINUTES).toNumber();
      const totalMinutes = safeDecimal(sleepDurationMinutes).plus(latency).toNumber();
      
      const bedTime = new Date(time.getTime() - totalMinutes * 60 * 1000);
      suggestedTimes.push(bedTime);
    }
    suggestedTimes.reverse();
  }

  return { suggestedTimes };
}
