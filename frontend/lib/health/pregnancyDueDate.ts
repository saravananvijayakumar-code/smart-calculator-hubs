import { safeDecimal } from './utils';

export interface PregnancyInput {
  lmpDate: Date;
  cycleLength: number;
}

export interface PregnancyResult {
  edd: Date;
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: 1 | 2 | 3;
  milestones: {
    week12: Date;
    week20: Date;
    week28: Date;
    week36: Date;
  };
}

export function calculatePregnancyDueDate(input: PregnancyInput): PregnancyResult {
  const { lmpDate, cycleLength } = input;

  if (cycleLength < 21 || cycleLength > 35) {
    throw new Error('Cycle length must be between 21 and 35 days');
  }

  const adjustment = safeDecimal(cycleLength).minus(28).toNumber();
  const totalDays = safeDecimal(280).plus(adjustment).toNumber();
  
  const edd = new Date(lmpDate.getTime() + totalDays * 24 * 60 * 60 * 1000);

  const now = new Date();
  const diffMs = now.getTime() - lmpDate.getTime();
  const totalGestationalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  const gestationalWeeks = Math.floor(totalGestationalDays / 7);
  const gestationalDays = totalGestationalDays % 7;

  let trimester: 1 | 2 | 3;
  if (gestationalWeeks < 13) {
    trimester = 1;
  } else if (gestationalWeeks < 27) {
    trimester = 2;
  } else {
    trimester = 3;
  }

  const milestones = {
    week12: new Date(lmpDate.getTime() + (12 * 7 + adjustment) * 24 * 60 * 60 * 1000),
    week20: new Date(lmpDate.getTime() + (20 * 7 + adjustment) * 24 * 60 * 60 * 1000),
    week28: new Date(lmpDate.getTime() + (28 * 7 + adjustment) * 24 * 60 * 60 * 1000),
    week36: new Date(lmpDate.getTime() + (36 * 7 + adjustment) * 24 * 60 * 60 * 1000),
  };

  return {
    edd,
    gestationalWeeks,
    gestationalDays,
    trimester,
    milestones,
  };
}
