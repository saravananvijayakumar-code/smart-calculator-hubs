export interface AIAnalysisHistoryEntry {
  id: number;
  userId?: number;
  sessionId: string;
  calculatorName: string;
  analysisType: string;
  inputData: Record<string, any>;
  analysisResult: Record<string, any>;
  modelUsed?: string;
  createdAt: Date;
}

export interface SaveAnalysisRequest {
  sessionId: string;
  calculatorName: string;
  analysisType: string;
  inputData: Record<string, any>;
  analysisResult: Record<string, any>;
  modelUsed?: string;
}

export interface ListAnalysisRequest {
  calculatorName?: string;
  analysisType?: string;
  limit?: number;
  offset?: number;
}

export interface ListAnalysisResponse {
  entries: AIAnalysisHistoryEntry[];
  total: number;
}
