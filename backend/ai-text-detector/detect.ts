import { api } from "encore.dev/api";
import { DetectRequest, DetectResponse } from "./types";

export const detect = api(
  { method: "POST", path: "/ai-text-detector/detect", expose: true },
  async (req: DetectRequest): Promise<DetectResponse> => {
    const { text } = req;

    if (!text || text.trim().length < 50) {
      return {
        aiProbability: 0,
        confidence: 0,
        burstiness: 0,
        perplexity: 0,
        verdict: "Text too short for analysis (minimum 50 characters required)",
        details: {
          sentenceCount: 0,
          averageLength: 0,
          vocabularyRichness: 0,
          patternScore: 0
        }
      };
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));

    const sentenceCount = sentences.length;
    const averageLength = words.length / Math.max(sentenceCount, 1);
    const vocabularyRichness = (uniqueWords.size / Math.max(words.length, 1)) * 100;

    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const lengthVariance = calculateVariance(sentenceLengths);
    const burstiness = Math.min(100, (lengthVariance / 10) * 100);

    const wordLengths = words.map(w => w.length);
    const avgWordLength = wordLengths.reduce((a, b) => a + b, 0) / words.length;
    const perplexity = Math.min(100, (avgWordLength * 10 + vocabularyRichness) / 2);

    let aiProbability = 0;
    let patternScore = 0;

    if (averageLength > 18 && averageLength < 25) {
      aiProbability += 25;
      patternScore += 25;
    }

    if (vocabularyRichness > 50 && vocabularyRichness < 70) {
      aiProbability += 20;
      patternScore += 20;
    }

    if (burstiness < 30) {
      aiProbability += 35;
      patternScore += 35;
    }

    const commonAIPatterns = [
      /\b(furthermore|moreover|additionally|consequently|thus|hence|therefore|nonetheless)\b/gi,
      /\b(it is important to note|it should be noted|one might argue|it's worth noting|it's essential to)\b/gi,
      /\b(delve|leverage|utilize|facilitate|optimize|streamline|empower|robust|comprehensive|multifaceted)\b/gi,
      /\b(in conclusion|to sum up|in summary|to summarize|overall|ultimately)\b/gi,
      /\b(first and foremost|last but not least|it's crucial to|pivotal|paramount)\b/gi,
      /\b(myriad|plethora|endeavor|foster|cultivate|holistic|nuanced)\b/gi,
    ];

    let patternMatches = 0;
    commonAIPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        patternMatches += matches.length;
      }
    });

    const patternDensity = (patternMatches / Math.max(sentenceCount, 1)) * 100;

    if (patternMatches >= 2) {
      aiProbability += Math.min(40, patternMatches * 8);
      patternScore += Math.min(40, patternMatches * 8);
    }

    aiProbability = Math.min(100, aiProbability);
    patternScore = Math.min(100, patternScore);

    const confidence = Math.min(100, 60 + (sentenceCount / 2));

    let verdict: string;
    if (aiProbability >= 70) {
      verdict = "Likely AI-written";
    } else if (aiProbability >= 40) {
      verdict = "Mixed (may contain AI-generated content)";
    } else {
      verdict = "Likely Human-written";
    }

    return {
      aiProbability: Math.round(aiProbability),
      confidence: Math.round(confidence),
      burstiness: Math.round(burstiness),
      perplexity: Math.round(perplexity),
      verdict,
      details: {
        sentenceCount,
        averageLength: Math.round(averageLength * 10) / 10,
        vocabularyRichness: Math.round(vocabularyRichness),
        patternScore: Math.round(patternScore)
      }
    };
  }
);

function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}
