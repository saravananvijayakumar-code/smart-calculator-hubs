import type { TaxYearData, ResidencyStatus, PayPeriod, PaygScaleName, PaygScale } from './types';

const taxYearDataMap: Record<string, TaxYearData> = {
  '2024-25': require('./data/2024-25.json'),
  '2025-26': require('./data/2025-26.json'),
};

export function getTaxYearData(year: string): TaxYearData {
  const data = taxYearDataMap[year];
  if (!data) {
    throw new Error(`Tax year ${year} not supported`);
  }
  return data;
}

export function calcResidentIncomeTax(year: string, taxableIncome: number): number {
  const data = getTaxYearData(year);
  const brackets = data.residentTaxBrackets;
  
  for (const bracket of brackets) {
    if (taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
      return bracket.baseAmount + (taxableIncome - bracket.min) * bracket.rate;
    }
  }
  
  return 0;
}

export function calcNonResidentTax(year: string, taxableIncome: number): number {
  const data = getTaxYearData(year);
  const brackets = data.nonResidentTaxBrackets;
  
  for (const bracket of brackets) {
    if (taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
      return bracket.baseAmount + (taxableIncome - bracket.min) * bracket.rate;
    }
  }
  
  return 0;
}

export function calcWHMTax(year: string, taxableIncome: number): number {
  const data = getTaxYearData(year);
  const brackets = data.whmTaxBrackets;
  
  for (const bracket of brackets) {
    if (taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
      return bracket.baseAmount + (taxableIncome - bracket.min) * bracket.rate;
    }
  }
  
  return 0;
}

export function calcLITO(year: string, taxableIncome: number): number {
  const data = getTaxYearData(year);
  const lito = data.lito;
  
  if (taxableIncome <= lito.shadeOutStart) {
    return lito.maxOffset;
  }
  
  if (taxableIncome >= lito.shadeOutEnd) {
    return 0;
  }
  
  const reduction = (taxableIncome - lito.shadeOutStart) * lito.shadeOutRate;
  return Math.max(0, lito.maxOffset - reduction);
}

export function calcMedicareLevy(
  year: string,
  taxableIncome: number,
  params: {
    isFamily?: boolean;
    dependants?: number;
    spouseIncome?: number;
    isSenior?: boolean;
  } = {}
): number {
  const data = getTaxYearData(year);
  const ml = data.medicareLevy;
  
  const { isFamily = false, dependants = 0, spouseIncome = 0, isSenior = false } = params;
  
  let threshold: number;
  let shadeInStart: number;
  
  if (isSenior) {
    if (isFamily) {
      threshold = ml.seniorsFamilyThreshold + (dependants * ml.seniorsDependantAdditional);
      shadeInStart = ml.seniorsFamilyShadeInStart + (dependants * ml.seniorsDependantAdditional);
    } else {
      threshold = ml.seniorsSingleThreshold;
      shadeInStart = ml.seniorsSingleShadeInStart;
    }
  } else {
    if (isFamily) {
      threshold = ml.familyThreshold + (dependants * ml.dependantAdditional);
      shadeInStart = ml.familyShadeInStart + (dependants * ml.dependantAdditional);
    } else {
      threshold = ml.singleThreshold;
      shadeInStart = ml.singleShadeInStart;
    }
  }
  
  const familyIncome = isFamily ? taxableIncome + spouseIncome : taxableIncome;
  
  if (familyIncome <= shadeInStart) {
    return 0;
  }
  
  if (familyIncome >= threshold) {
    return taxableIncome * ml.rate;
  }
  
  const shadeInRange = threshold - shadeInStart;
  const incomeAboveStart = familyIncome - shadeInStart;
  const shadeInRate = incomeAboveStart / shadeInRange;
  
  return Math.min(taxableIncome * ml.rate, taxableIncome * ml.rate * shadeInRate);
}

export function calcMLS(
  year: string,
  mlsIncome: number,
  hasPrivateCover: boolean,
  dependants: number = 0
): number {
  if (hasPrivateCover) {
    return 0;
  }
  
  const data = getTaxYearData(year);
  const mls = data.medicareLevySurcharge;
  
  const isFamily = dependants > 0;
  const thresholdAdjustment = dependants * mls.dependantIncrement;
  
  for (const tier of mls.tiers) {
    const minThreshold = isFamily ? tier.familyMin + thresholdAdjustment : tier.singleMin;
    const maxThreshold = isFamily 
      ? (tier.familyMax === null ? null : tier.familyMax + thresholdAdjustment)
      : tier.singleMax;
    
    if (mlsIncome >= minThreshold && (maxThreshold === null || mlsIncome <= maxThreshold)) {
      return mlsIncome * tier.rate;
    }
  }
  
  return 0;
}

export function calcHELP(year: string, repaymentIncome: number): number {
  const data = getTaxYearData(year);
  const thresholds = data.helpRepaymentThresholds;
  
  for (const threshold of thresholds) {
    if (repaymentIncome >= threshold.min && (threshold.max === null || repaymentIncome <= threshold.max)) {
      return repaymentIncome * threshold.rate;
    }
  }
  
  return 0;
}

export function calcSG(year: string, ordinaryTimeEarnings: number): number {
  const data = getTaxYearData(year);
  return ordinaryTimeEarnings * data.superGuaranteeRate;
}

export function getMarginalTaxRate(year: string, taxableIncome: number, residency: ResidencyStatus): number {
  const data = getTaxYearData(year);
  
  let brackets;
  switch (residency) {
    case 'non-resident':
      brackets = data.nonResidentTaxBrackets;
      break;
    case 'whm':
      brackets = data.whmTaxBrackets;
      break;
    default:
      brackets = data.residentTaxBrackets;
  }
  
  for (const bracket of brackets) {
    if (taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
      return bracket.rate;
    }
  }
  
  return 0;
}

export function calcPAYGWithholding(
  year: string,
  grossEarnings: number,
  period: PayPeriod,
  claimTaxFreeThreshold: boolean,
  hasHelp: boolean,
  medicareExempt: boolean = false
): number {
  if (period === 'annual') {
    return 0;
  }
  
  const data = getTaxYearData(year);
  const scaleName: PaygScaleName = claimTaxFreeThreshold ? 'scale2' : 'scale6';
  const periodData = data.payg[period];
  const scaleData: PaygScale = periodData[scaleName];
  
  let withheld = 0;
  
  for (const coef of scaleData.coefficients) {
    if (grossEarnings >= coef.min && (coef.max === null || grossEarnings <= coef.max)) {
      withheld = coef.a * grossEarnings - coef.b;
      break;
    }
  }
  
  if (hasHelp && grossEarnings > 0) {
    withheld += grossEarnings * scaleData.helpCoefficient;
  }
  
  return Math.max(0, Math.round(withheld));
}

export function convertGrossToPeriod(grossAnnual: number, period: PayPeriod): number {
  switch (period) {
    case 'weekly':
      return grossAnnual / 52;
    case 'fortnightly':
      return grossAnnual / 26;
    case 'monthly':
      return grossAnnual / 12;
    case 'annual':
      return grossAnnual;
  }
}

export function convertPeriodToAnnual(grossPeriod: number, period: PayPeriod): number {
  switch (period) {
    case 'weekly':
      return grossPeriod * 52;
    case 'fortnightly':
      return grossPeriod * 26;
    case 'monthly':
      return grossPeriod * 12;
    case 'annual':
      return grossPeriod;
  }
}

export function calcIncomeTax(year: string, taxableIncome: number, residency: ResidencyStatus): number {
  switch (residency) {
    case 'non-resident':
      return calcNonResidentTax(year, taxableIncome);
    case 'whm':
      return calcWHMTax(year, taxableIncome);
    default:
      return calcResidentIncomeTax(year, taxableIncome);
  }
}