export interface DetectRequest {
  text: string;
}

export interface DetectResponse {
  aiProbability: number;
  confidence: number;
  burstiness: number;
  perplexity: number;
  verdict: string;
  details: {
    sentenceCount: number;
    averageLength: number;
    vocabularyRichness: number;
    patternScore: number;
  };
}
