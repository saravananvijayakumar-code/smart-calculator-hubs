// Types for AI analysis requests and responses

export type CalculatorType = 
  // Financial Calculators
  | "mortgage" 
  | "loan" 
  | "retirement" 
  | "investment" 
  | "compound-interest"
  | "simple-interest"
  | "roi"
  | "emergency-fund"
  | "credit-card-payoff"
  | "loan-affordability"
  | "401k-retirement"
  | "salary_calculator"
  | "profit_margin"
  | "paycheck_calculator"
  // US Calculators
  | "federal-tax"
  | "state-tax"
  | "student-loan"
  | "auto-loan"
  | "heloc"
  | "business-loan"
  | "debt-consolidation"
  | "mortgage-us"
  | "loan-us"
  // UK Calculators
  | "btl-mortgage-uk"
  | "isa-calculator-uk"
  | "national-insurance-uk"
  | "pension-calculator-uk"
  | "stamp-duty-uk"
  // India Calculators
  | "emi_india"
  | "epf-calculator-india"
  | "home-loan-calculator-india"
  | "income-tax-calculator-india"
  | "gst_india"
  | "ppf-calculator-india"
  | "sip-calculator-india"
  // Australia Calculators
  | "cgt-calculator-australia"
  | "fbt-calculator-australia"
  | "negative-gearing-australia"
  | "property-tax-australia"
  | "superannuation-australia"
  | "first-home-buyer-nsw"
  | "income-tax-australia"
  | "au-pay"
  // Health Calculators
  | "bmi"
  | "weight-loss-steps"
  | "calorie"
  | "waist-to-hip-ratio"
  // Math Calculators
  | "percentage"
  | "age-calculator"
  | "unit-converter"
  // Utility Calculators
  | "currency-converter"
  | "tip-calculator"
  // Viral Calculators
  | "love-compatibility"
  | "zodiac-compatibility"
  | "friend-compatibility"
  | "how-long-to-watch"
  | "life-path-number"
  // AI Tools
  | "profile-analyzer"
  | "instagram-bio-analyzer"
  | "tiktok-profile-score"
  | "audience-analyzer"
  // Utility Tools
  | "ip-lookup"
  // High-CPM Suite
  | "legal-settlement"
  | "solar-savings"
  | "car-insurance";

export interface MortgageAnalysisData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  propertyValue: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  pmi?: number;
  propertyTax?: number;
  insurance?: number;
}

export interface LoanAnalysisData {
  principal: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface InvestmentAnalysisData {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  finalAmount: number;
  totalContributions: number;
  totalReturn: number;
}

export interface RetirementAnalysisData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  retirementGoal: number;
  projectedSavings: number;
  monthlyIncomeNeeded: number;
}

export interface EmergencyFundAnalysisData {
  monthlyExpenses: number;
  targetMonths: number;
  currentSavings: number;
  targetAmount: number;
  shortfall: number;
  monthlyContribution: number;
}

export interface CreditCardAnalysisData {
  balance: number;
  apr: number;
  minimumPayment: number;
  paymentAmount: number;
  timeToPayoff: number;
  totalInterest: number;
  totalPayment: number;
}

export interface ROIAnalysisData {
  initialInvestment: number;
  finalValue: number;
  roi: number;
  annualizedReturn: number;
  profit: number;
  timeHeld: number;
}

export interface SalaryAnalysisData {
  grossAnnual: number;
  state: string;
  filingStatus: string;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  netAnnual: number;
  effectiveTaxRate: number;
}

export interface ProfitMarginAnalysisData {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  otherExpenses: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
}

export interface PaycheckAnalysisData {
  annualSalary: number;
  payFrequency: string;
  state: string;
  grossPerPaycheck: number;
  netPerPaycheck: number;
  federalWithholding: number;
  stateWithholding: number;
  ficaTotal: number;
  preTaxDeductions: number;
  postTaxDeductions: number;
  annualNetPay: number;
}



export interface PercentageAnalysisData {
  type: string;
  result1?: number;
  result2?: number;
  result3?: number;
  result4?: number;
  inputs: Record<string, number>;
}

export interface StudentLoanAnalysisData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  repaymentPlan: string;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface AutoLoanAnalysisData {
  vehiclePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  affordabilityRatio: number;
}

export interface HELOCAnalysisData {
  homeValue: number;
  mortgageBalance: number;
  maxCreditLine: number;
  interestRate: number;
  drawAmount: number;
  monthlyInterestOnly: number;
  monthlyPrincipalAndInterest: number;
  loanToValueRatio: number;
}

export interface BusinessLoanAnalysisData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  loanType: string;
  monthlyPayment: number;
  totalInterest: number;
  debtServiceCoverageRatio: number;
  monthlyRevenue: number;
}

export interface DebtConsolidationAnalysisData {
  currentTotalBalance: number;
  currentWeightedAPR: number;
  consolidationRate: number;
  consolidationTerm: number;
  currentTotalMinimumPayments: number;
  newMonthlyPayment: number;
  totalSavings: number;
  monthlySavings: number;
}

// UK Calculator Types
export interface BTLMortgageAnalysisData {
  propertyValue: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  monthlyPayment: number;
  rentalYield: number;
  ltvRatio: number;
  monthlyCashFlow: number;
}

export interface ISAAnalysisData {
  annualContribution: number;
  expectedReturn: number;
  years: number;
  isaType: string;
  finalAmount: number;
  totalContributions: number;
  totalReturns: number;
}

export interface NationalInsuranceAnalysisData {
  annualSalary: number;
  niContributions: number;
  employeeContributions: number;
  employerContributions: number;
  niCategory: string;
}

export interface PensionAnalysisData {
  currentAge: number;
  retirementAge: number;
  currentPension: number;
  monthlyContribution: number;
  expectedReturn: number;
  finalPensionPot: number;
  annualIncome: number;
}

export interface StampDutyAnalysisData {
  propertyValue: number;
  stampDuty: number;
  effectiveRate: number;
  buyerType: string;
  location: string;
}

// India Calculator Types
export interface EPFAnalysisData {
  monthlyBasicSalary: number;
  employeeContribution: number;
  employerContribution: number;
  currentAge: number;
  retirementAge: number;
  currentEPFBalance: number;
  finalBalance: number;
  monthlyPension: number;
}

export interface EMIAnalysisData {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

export interface HomeLoanAnalysisData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  emi: number;
}

export interface IncomeTaxAnalysisData {
  annualIncome: number;
  taxableIncome: number;
  taxLiability: number;
  effectiveTaxRate: number;
  regime: string;
  deductions: number;
}

export interface PPFAnalysisData {
  annualContribution: number;
  currentBalance: number;
  years: number;
  finalAmount: number;
  totalContributions: number;
  totalReturns: number;
}

export interface SIPAnalysisData {
  monthlyInvestment: number;
  expectedReturn: number;
  years: number;
  finalAmount: number;
  totalInvestment: number;
  wealthGained: number;
}

export interface GSTAnalysisData {
  transactionType: string;
  baseAmount: number;
  gstRate: number;
  gstAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalAmount: number;
}

// Australia Calculator Types
export interface CGTAnalysisData {
  purchasePrice: number;
  salePrice: number;
  capitalGain: number;
  cgtLiability: number;
  discount: number;
  netGain: number;
}

export interface FBTAnalysisData {
  benefitValue: number;
  fbtRate: number;
  fbtLiability: number;
  grossUpValue: number;
  effectiveRate: number;
}

export interface NegativeGearingAnalysisData {
  rentalIncome: number;
  propertyExpenses: number;
  interestExpenses: number;
  negativeGearing: number;
  taxSavings: number;
  netCashFlow: number;
}

export interface PropertyTaxAnalysisData {
  propertyValue: number;
  taxRate: number;
  annualTax: number;
  exemptions: number;
  netTax: number;
}

export interface SuperannuationAnalysisData {
  currentBalance: number;
  monthlyContribution: number;
  employerContribution: number;
  expectedReturn: number;
  years: number;
  finalBalance: number;
  retirementIncome: number;
}

export interface FirstHomeBuyerNSWAnalysisData {
  propertyValue: number;
  deposit: number;
  stampDuty: number;
  totalCosts: number;
  monthlyRepayment: number;
  benefits: number;
  lvrRatio: number;
}

export interface IncomeTaxAustraliaAnalysisData {
  grossIncome: number;
  residencyStatus: string;
  hasMedicare: string;
  hasHELP: string;
  incomeTax: number;
  medicareLevy: number;
  helpRepayment: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface AUPayAnalysisData {
  grossAnnual: number;
  netAnnual: number;
  netPeriod: number;
  grossPeriod: number;
  incomeTax: number;
  medicareLevy: number;
  helpRepayment: number;
  medicareLevySurcharge: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  superannuation: number;
  lito: number;
  period: 'weekly' | 'fortnightly' | 'monthly' | 'annual';
  residency: 'resident' | 'non-resident' | 'whm';
  hasHelp: boolean;
  year: string;
}

// Health Calculator Types
export interface BMIAnalysisData {
  bmi: number;
  category: string;
  height: number;
  weight: number;
  unit: string;
  riskLevel: string;
  idealWeightRange: { min: number; max: number };
}

export interface WeightLossStepsAnalysisData {
  currentWeight: number;
  height: number;
  targetWeightLoss: number;
  timeframeDays: number;
  weightUnit: string;
  heightUnit: string;
  stepsPerDay: number;
  distancePerDay: number;
  caloriesPerDay: number;
  totalStepsRequired: number;
  strideLength: number;
  currentBMI: number;
  targetWeight: number;
  targetBMI: number;
  weeklyWeightLoss: number;
}

export interface CalorieAnalysisData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  weightUnit: string;
  heightUnit: string;
  bmr: number;
  tdee: number;
  maintenanceCalories: number;
  targetCalories: number;
  currentBMI: number;
  bmiCategory: string;
  proteinNeeds: number;
  carbNeeds: number;
  fatNeeds: number;
  waterNeeds: number;
}

export interface WaistToHipRatioAnalysisData {
  waist: number;
  hip: number;
  ratio: number;
  riskLevel: string;
  bodyShape: string;
  unit: string;
  gender?: string;
}

// Math Calculator Types
export interface PercentageAnalysisData {
  type: string;
  result1?: number;
  result2?: number;
  result3?: number;
  result4?: number;
  inputs: Record<string, number>;
}

export interface AgeAnalysisData {
  birthDate: Date;
  currentAge: { years: number; months: number; days: number };
  nextBirthday: Date;
  daysUntilBirthday: number;
  lifeMilestones: string[];
}

export interface UnitConverterAnalysisData {
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  category: string;
  conversionFactor: number;
}

// Utility Calculator Types
export interface CurrencyConverterAnalysisData {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  exchangeRate: number;
  rateDate: Date;
}

export interface TipAnalysisData {
  billAmount: number;
  tipPercentage: number;
  tipAmount: number;
  totalAmount: number;
  peopleCount: number;
  amountPerPerson: number;
}

export interface LoveCompatibilityAnalysisData {
  partner1Name: string;
  partner1Birthday: string;
  partner1StarSign: string;
  partner2Name: string;
  partner2Birthday: string;
  partner2StarSign: string;
  compatibilityPercentage: number;
  overallMatch: string;
  zodiacCompatibility: number;
  numerologyScore: number;
  birthdayHarmony: number;
  emotionalScore: number;
  communicationScore: number;
  lifeGoalsScore: number;
}

export interface FriendCompatibilityAnalysisData {
  friend1: {
    name: string;
    age: string;
    hobby: string;
  };
  friend2: {
    name: string;
    age: string;
    hobby: string;
  };
  results: {
    totalScore: number;
    compatibilityLevel: string;
    categoryScores: {
      communication: number;
      humor: number;
      loyalty: number;
      adventure: number;
      emotional: number;
      interests: number;
    };
    strengths: string[];
    potentialConflicts: string[];
    friendshipType: string;
    activities: string[];
    funFacts: string[];
  };
}

export interface ZodiacCompatibilityAnalysisData {
  yourSign: string;
  partnerSign: string;
  compatibilityScore: number;
  compatibilityLevel: string;
  elementMatch: boolean;
  yourElement: string;
  partnerElement: string;
}

export interface LifePathNumberAnalysisData {
  lifePathNumber: number;
  name: string;
  birthdate: string;
  personalityTraits: string[];
  strengths: string[];
  challenges: string[];
  careerPaths: string[];
}

export interface ProfileAnalysisData {
  platform: string;
  username: string;
  profileUrl: string;
  hasClearBio: boolean;
  hasProfilePhoto: boolean;
  hasLink: boolean;
  postFrequency: string;
  engagementRate: number;
  bioLength: number;
  hasKeywords: boolean;
  hasEmojis: boolean;
  hasCTA: boolean;
}

export interface InstagramBioAnalysisData {
  bio: string;
  username: string;
  bioLength: number;
  hasEmojis: boolean;
  hasHashtags: boolean;
  hasCTA: boolean;
  hasLink: boolean;
  hasLineBreaks: boolean;
}

export interface TikTokProfileAnalysisData {
  username: string;
  bio: string;
  videoCount: number;
  followerCount: number;
  followingCount: number;
  likeCount: number;
  hasProfilePhoto: boolean;
  hasLink: boolean;
  bioLength: number;
  postingFrequency: string;
}

export interface AudienceAnalysisData {
  followers: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  niche: string;
  platform?: string;
  contentType?: string;
  postingFrequency?: string;
  topCompetitors?: string;
  audienceGoals?: string;
  engagementRate: number;
}

export interface IPLookupAnalysisData {
  ip: string;
  location?: string;
  isp?: string;
  ipVersion: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  postal?: string;
}

export interface LegalSettlementAnalysisData {
  medicalExpenses: number;
  lostWages: number;
  multiplier: number;
  state: string;
  faultPercentage: number;
  estimatedSettlement: number;
  lowRange: number;
  highRange: number;
  economicDamages: number;
  nonEconomicDamages: number;
}

export interface SolarSavingsAnalysisData {
  monthlyBill: number;
  state: string;
  systemSize: number;
  electricityRate: number;
  installationCost: number;
  annualSavings: number;
  paybackYears: number;
  totalSavings25Years: number;
  co2ReductionTons: number;
}

export interface CarInsuranceAnalysisData {
  age: number;
  vehicleType: string;
  vehicleValue: number;
  vehicleAge: number;
  state: string;
  estimatedPremium?: number;
  estimatedAnnualCost: number;
  coverageType: string;
  ncdYears: number;
  claimsHistory: number;
  parkingLocation: string;
  annualKm: number;
  excess: number;
  potentialSavings: number;
  gender?: string;
  comprehensivePremium?: number;
  thirdPartyProperty?: number;
  thirdPartyFireTheft?: number;
}

export interface StateTaxAnalysisData {
  grossIncome: number;
  filingStatus: string;
  state: string;
  federalTaxableIncome: number;
  stateTaxableIncome: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  afterTaxIncome: number;
  federalDeductions: number;
  stateDeductions: number;
  hasStateIncomeTax: boolean;
}

export type AnalysisData = 
  // Financial & US Calculators
  | MortgageAnalysisData
  | LoanAnalysisData 
  | InvestmentAnalysisData
  | RetirementAnalysisData
  | EmergencyFundAnalysisData
  | CreditCardAnalysisData
  | ROIAnalysisData
  | SalaryAnalysisData
  | ProfitMarginAnalysisData
  | PaycheckAnalysisData
  | StudentLoanAnalysisData
  | AutoLoanAnalysisData
  | HELOCAnalysisData
  | BusinessLoanAnalysisData
  | DebtConsolidationAnalysisData
  | StateTaxAnalysisData
  // UK Calculators
  | BTLMortgageAnalysisData
  | ISAAnalysisData
  | NationalInsuranceAnalysisData
  | PensionAnalysisData
  | StampDutyAnalysisData
  // India Calculators
  | EMIAnalysisData
  | EPFAnalysisData
  | HomeLoanAnalysisData
  | IncomeTaxAnalysisData
  | GSTAnalysisData
  | PPFAnalysisData
  | SIPAnalysisData
  // Australia Calculators
  | CGTAnalysisData
  | FBTAnalysisData
  | NegativeGearingAnalysisData
  | PropertyTaxAnalysisData
  | SuperannuationAnalysisData
  | FirstHomeBuyerNSWAnalysisData
  | IncomeTaxAustraliaAnalysisData
  | AUPayAnalysisData
  // Health & Math Calculators
  | BMIAnalysisData
  | WeightLossStepsAnalysisData
  | CalorieAnalysisData
  | WaistToHipRatioAnalysisData
  | PercentageAnalysisData
  | AgeAnalysisData
  | UnitConverterAnalysisData
  // Utility Calculators
  | CurrencyConverterAnalysisData
  | TipAnalysisData
  // Viral Calculators
  | LoveCompatibilityAnalysisData
  | FriendCompatibilityAnalysisData
  | ZodiacCompatibilityAnalysisData
  | LifePathNumberAnalysisData
  // AI Tools
  | ProfileAnalysisData
  | InstagramBioAnalysisData
  | TikTokProfileAnalysisData
  | AudienceAnalysisData
  // Utility Tools
  | IPLookupAnalysisData
  // High-CPM Suite
  | LegalSettlementAnalysisData
  | SolarSavingsAnalysisData
  | CarInsuranceAnalysisData;

export interface AnalysisRequest {
  calculatorType: CalculatorType;
  data: AnalysisData;
  userContext?: {
    age?: number;
    income?: number;
    location?: string;
    riskTolerance?: "low" | "medium" | "high";
  };
}

export interface Recommendation {
  type: "optimization" | "warning" | "opportunity" | "strategy" | "engagement" | "growth";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionItems: string[];
  potentialSavings?: number;
  estimatedImpact?: string;
}

export interface AnalysisResponse {
  summary: string;
  recommendations: Recommendation[];
  keyInsights: string[];
  riskFactors: string[];
  nextSteps: string[];
}