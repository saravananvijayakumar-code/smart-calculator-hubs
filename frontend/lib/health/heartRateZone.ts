import Decimal from 'decimal.js';
import { safeDecimal } from './utils';

export type HRMethod = 'basic' | 'tanaka' | 'karvonen';

export interface HeartRateInput {
  age: number;
  restingHR?: number;
  method: HRMethod;
}

export interface HeartRateZone {
  name: string;
  percentage: string;
  min: number;
  max: number;
}

export interface HeartRateResult {
  maxHR: number;
  zones: HeartRateZone[];
}

export function calculateHeartRateZones(input: HeartRateInput): HeartRateResult {
  const { age, restingHR = 60, method } = input;

  let maxHR: Decimal;

  if (method === 'basic') {
    maxHR = safeDecimal(220).minus(age);
  } else if (method === 'tanaka') {
    maxHR = safeDecimal(208).minus(safeDecimal(age).times(0.7));
  } else {
    maxHR = safeDecimal(220).minus(age);
  }

  const zones: HeartRateZone[] = [];
  const zoneDefinitions = [
    { name: 'Zone 1 (Recovery)', min: 0.50, max: 0.60 },
    { name: 'Zone 2 (Aerobic)', min: 0.60, max: 0.70 },
    { name: 'Zone 3 (Tempo)', min: 0.70, max: 0.80 },
    { name: 'Zone 4 (Threshold)', min: 0.80, max: 0.90 },
    { name: 'Zone 5 (VO2 Max)', min: 0.90, max: 1.00 },
  ];

  for (const zone of zoneDefinitions) {
    let minBPM: Decimal;
    let maxBPM: Decimal;

    if (method === 'karvonen' && restingHR) {
      const rhr = safeDecimal(restingHR);
      const reserve = maxHR.minus(rhr);
      minBPM = reserve.times(zone.min).plus(rhr);
      maxBPM = reserve.times(zone.max).plus(rhr);
    } else {
      minBPM = maxHR.times(zone.min);
      maxBPM = maxHR.times(zone.max);
    }

    zones.push({
      name: zone.name,
      percentage: `${zone.min * 100}-${zone.max * 100}%`,
      min: Math.round(minBPM.toNumber()),
      max: Math.round(maxBPM.toNumber()),
    });
  }

  return {
    maxHR: Math.round(maxHR.toNumber()),
    zones,
  };
}
