export type ResidencyStatus = 'resident' | 'non-resident' | 'whm';

export type PayPeriod = 'weekly' | 'fortnightly' | 'monthly' | 'annual';

export type PaygScaleName = 'scale2' | 'scale6';

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  baseAmount: number;
}

export interface PaygCoefficient {
  min: number;
  max: number | null;
  a: number;
  b: number;
}

export interface PaygScale {
  coefficients: PaygCoefficient[];
  helpCoefficient: number;
}

export interface LitoConfig {
  maxOffset: number;
  shadeOutStart: number;
  shadeOutEnd: number;
  shadeOutRate: number;
}

export interface MedicareLevyConfig {
  rate: number;
  singleThreshold: number;
  singleShadeInStart: number;
  familyThreshold: number;
  familyShadeInStart: number;
  dependantAdditional: number;
  seniorsSingleThreshold: number;
  seniorsSingleShadeInStart: number;
  seniorsFamilyThreshold: number;
  seniorsFamilyShadeInStart: number;
  seniorsDependantAdditional: number;
}

export interface MlsTier {
  singleMin: number;
  singleMax: number | null;
  familyMin: number;
  familyMax: number | null;
  rate: number;
}

export interface MlsConfig {
  tiers: MlsTier[];
  dependantIncrement: number;
}

export interface HelpThreshold {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxYearData {
  taxYear: string;
  financialYearStart: string;
  financialYearEnd: string;
  superGuaranteeRate: number;
  residentTaxBrackets: TaxBracket[];
  nonResidentTaxBrackets: TaxBracket[];
  whmTaxBrackets: TaxBracket[];
  lito: LitoConfig;
  medicareLevy: MedicareLevyConfig;
  medicareLevySurcharge: MlsConfig;
  helpRepaymentThresholds: HelpThreshold[];
  payg: {
    weekly: { scale2: PaygScale; scale6: PaygScale };
    fortnightly: { scale2: PaygScale; scale6: PaygScale };
    monthly: { scale2: PaygScale; scale6: PaygScale };
  };
}

export interface PayCalculatorRequest {
  year: string;
  grossAnnual: number;
  period: PayPeriod;
  residency: ResidencyStatus;
  claimTaxFreeThreshold: boolean;
  hasHelp: boolean;
  privateCover: boolean;
  dependants: number;
  spouseIncome?: number;
  salarySacrifice?: number;
  includeSuper: boolean;
  isSenior?: boolean;
}

export interface PayCalculatorResponse {
  grossAnnual: number;
  grossPeriod: number;
  incomeTax: number;
  incomeTaxPeriod: number;
  medicareLevy: number;
  medicareLevyPeriod: number;
  medicareLevySurcharge: number;
  medicareLevySurchargePeriod: number;
  helpRepayment: number;
  helpRepaymentPeriod: number;
  lito: number;
  totalTax: number;
  totalTaxPeriod: number;
  superannuation: number;
  superannuationPeriod: number;
  netAnnual: number;
  netPeriod: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  trace: CalculationTrace;
}

export interface CalculationTrace {
  taxableIncome: number;
  grossIncomeTax: number;
  litoApplied: number;
  netIncomeTax: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  helpRepayment: number;
  totalTax: number;
  superannuation: number;
  takeHome: number;
  references: TraceReference[];
}

export interface TraceReference {
  field: string;
  source: string;
  url: string;
}

export interface BonusWithholdingRequest {
  year: string;
  regularGross: number;
  payPeriod: PayPeriod;
  bonusAmount: number;
  residency: ResidencyStatus;
  claimTaxFreeThreshold: boolean;
  hasHelp: boolean;
  method?: 'A' | 'B';
}

export interface BonusWithholdingResponse {
  bonusAmount: number;
  withholdingAmount: number;
  netBonus: number;
  withholdingRate: number;
  method: 'A' | 'B';
  explanation: string;
}

export interface UnusedLeaveWithholdingRequest {
  year: string;
  unusedLeaveAmount: number;
  ytdGross: number;
  residency: ResidencyStatus;
  claimTaxFreeThreshold: boolean;
  hasHelp: boolean;
}

export interface UnusedLeaveWithholdingResponse {
  leaveAmount: number;
  withholdingAmount: number;
  netLeave: number;
  withholdingRate: number;
  explanation: string;
}

export interface StudentLoanProjectionRequest {
  year: string;
  currentBalance: number;
  annualIncome: number;
  incomeGrowthRate: number;
  indexationRate: number;
  voluntaryRepayment?: number;
}

export interface StudentLoanProjectionResponse {
  projections: YearProjection[];
  payoffYear: number | null;
  totalPaid: number;
  totalInterest: number;
}

export interface YearProjection {
  year: number;
  startingBalance: number;
  compulsoryRepayment: number;
  voluntaryRepayment: number;
  indexation: number;
  endingBalance: number;
  income: number;
}