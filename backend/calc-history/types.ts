export interface CalculatorHistoryEntry {
  id: number;
  userId?: number;
  sessionId: string;
  calculatorType: string;
  calculatorName: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
  tags?: string[];
  favorite: boolean;
  createdAt: Date;
}

export interface SaveCalculationRequest {
  sessionId: string;
  calculatorType: string;
  calculatorName: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
  tags?: string[];
}

export interface ListHistoryRequest {
  calculatorType?: string;
  limit?: number;
  offset?: number;
  favoritesOnly?: boolean;
}

export interface ListHistoryResponse {
  entries: CalculatorHistoryEntry[];
  total: number;
}

export interface UpdateHistoryRequest {
  id: number;
  notes?: string;
  tags?: string[];
  favorite?: boolean;
}
