import Decimal from 'decimal.js';
import { safeDecimal } from './utils';

export interface WaterIntakeInput {
  weightKg: number;
  exerciseMinutes: number;
  hotClimate: boolean;
}

export interface WaterIntakeResult {
  totalLiters: number;
  totalCups: number;
  baseLiters: number;
  exerciseAddLiters: number;
  climateAddLiters: number;
}

export function calculateWaterIntake(input: WaterIntakeInput): WaterIntakeResult {
  const { weightKg, exerciseMinutes, hotClimate } = input;

  const baseMl = safeDecimal(weightKg).times(35);
  
  const exerciseSessions = safeDecimal(exerciseMinutes).dividedBy(30);
  const exerciseMl = exerciseSessions.times(350);
  
  let totalMl = baseMl.plus(exerciseMl);
  
  let climateMl = safeDecimal(0);
  if (hotClimate) {
    climateMl = totalMl.times(0.1);
    totalMl = totalMl.plus(climateMl);
  }

  const totalLiters = totalMl.dividedBy(1000).toNumber();
  const totalCups = totalMl.dividedBy(250).toNumber();

  return {
    totalLiters,
    totalCups,
    baseLiters: baseMl.dividedBy(1000).toNumber(),
    exerciseAddLiters: exerciseMl.dividedBy(1000).toNumber(),
    climateAddLiters: climateMl.dividedBy(1000).toNumber(),
  };
}
