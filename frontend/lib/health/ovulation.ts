import { safeDecimal } from './utils';

export interface OvulationInput {
  lmpDate: Date;
  cycleLength: number;
  lutealLength: number;
}

export interface OvulationResult {
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export function calculateOvulation(input: OvulationInput): OvulationResult {
  const { lmpDate, cycleLength, lutealLength } = input;

  if (cycleLength < 21 || cycleLength > 35) {
    throw new Error('Cycle length must be between 21 and 35 days');
  }

  if (lutealLength < 12 || lutealLength > 16) {
    throw new Error('Luteal phase length must be between 12 and 16 days');
  }

  const ovulationDay = safeDecimal(cycleLength).minus(lutealLength).toNumber();
  
  const ovulationDate = new Date(lmpDate.getTime() + ovulationDay * 24 * 60 * 60 * 1000);
  
  const fertileWindowStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
  const fertileWindowEnd = new Date(ovulationDate.getTime() + 1 * 24 * 60 * 60 * 1000);

  return {
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
  };
}
