export type CalculatorType =
  | 'mortgage'
  | 'loan'
  | 'bmi'
  | 'retirement'
  | 'investment'
  | 'compound-interest'
  | 'credit-card'
  | 'emergency-fund'
  | 'roi'
  | 'simple-interest'
  | 'calorie'
  | 'weight-loss'
  | 'age'
  | 'percentage'
  | 'unit-converter'
  | 'currency'
  | 'tip'
  | 'love-compatibility'
  | 'auto-loan'
  | 'business-loan'
  | 'debt-consolidation'
  | 'federal-tax'
  | 'heloc'
  | 'loan-affordability'
  | 'mortgage-us'
  | 'retirement-401k'
  | 'state-tax'
  | 'student-loan'
  | 'gst-india'
  | 'income-tax-india'
  | 'home-loan-india'
  | 'sip-india'
  | 'epf-india'
  | 'ppf-india'
  | 'stamp-duty-uk'
  | 'pension-uk'
  | 'national-insurance-uk'
  | 'isa-uk'
  | 'btl-mortgage-uk'
  | 'superannuation-au'
  | 'property-tax-au'
  | 'negative-gearing-au'
  | 'first-home-buyer-au'
  | 'fbt-au'
  | 'cgt-au'
  | 'car-insurance'
  | 'health-insurance'
  | 'life-insurance';

export interface CalculationInput {
  [key: string]: any;
}

export interface CalculationResult {
  [key: string]: any;
}

export interface CalculationHistoryEntry {
  id: string;
  calculatorType: CalculatorType;
  calculatorName: string;
  timestamp: number;
  inputs: CalculationInput;
  results: CalculationResult;
  notes?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface CalculatorStoreState {
  history: CalculationHistoryEntry[];
  selectedForComparison: string[];
  addCalculation: (entry: Omit<CalculationHistoryEntry, 'id' | 'timestamp'>) => string;
  deleteCalculation: (id: string) => void;
  deleteMultiple: (ids: string[]) => void;
  clearHistory: () => void;
  updateNotes: (id: string, notes: string) => void;
  updateTags: (id: string, tags: string[]) => void;
  toggleFavorite: (id: string) => void;
  toggleComparisonSelection: (id: string) => void;
  clearComparisonSelection: () => void;
  getCalculationById: (id: string) => CalculationHistoryEntry | undefined;
  getCalculationsByType: (type: CalculatorType) => CalculationHistoryEntry[];
  exportHistory: () => string;
}

export interface CalculatorMetadata {
  type: CalculatorType;
  name: string;
  category: string;
  icon?: string;
  color?: string;
}
