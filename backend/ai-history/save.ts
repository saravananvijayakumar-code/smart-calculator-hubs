import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { SaveAnalysisRequest, AIAnalysisHistoryEntry } from "./types";

export const save = api(
  { method: "POST", path: "/ai-history", expose: true, auth: false },
  async (req: SaveAnalysisRequest): Promise<AIAnalysisHistoryEntry> => {
    const authData = getAuthData();
    let userId: number | null = null;

    if (authData) {
      const userRow = await db.queryRow<{ id: number }>`
        SELECT id FROM users WHERE clerk_user_id = ${authData.userID}
      `;
      userId = userRow?.id || null;
    }

    const inputData = JSON.stringify(req.inputData);
    const analysisResult = JSON.stringify(req.analysisResult);

    const entry = await db.queryRow<AIAnalysisHistoryEntry>`
      INSERT INTO ai_analysis_history (
        user_id, session_id, calculator_name, analysis_type,
        input_data, analysis_result, model_used
      ) VALUES (
        ${userId},
        ${req.sessionId},
        ${req.calculatorName},
        ${req.analysisType},
        ${inputData},
        ${analysisResult},
        ${req.modelUsed || null}
      )
      RETURNING *
    `;

    if (!entry) {
      throw new Error("Failed to save AI analysis");
    }

    return {
      ...entry,
      inputData: JSON.parse(entry.inputData as any),
      analysisResult: JSON.parse(entry.analysisResult as any),
      createdAt: new Date(entry.createdAt),
    };
  }
);
