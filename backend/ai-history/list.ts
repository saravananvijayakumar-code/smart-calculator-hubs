import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { ListAnalysisRequest, ListAnalysisResponse, AIAnalysisHistoryEntry } from "./types";

export const list = api(
  { method: "GET", path: "/ai-history", expose: true, auth: false },
  async (req: ListAnalysisRequest): Promise<ListAnalysisResponse> => {
    const authData = getAuthData();
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let userId: number | null = null;
    if (authData) {
      const userRow = await db.queryRow<{ id: number }>`
        SELECT id FROM users WHERE clerk_user_id = ${authData.userID}
      `;
      userId = userRow?.id || null;
    }

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(userId);
    }

    if (req.calculatorName) {
      conditions.push(`calculator_name = $${paramIndex++}`);
      params.push(req.calculatorName);
    }

    if (req.analysisType) {
      conditions.push(`analysis_type = $${paramIndex++}`);
      params.push(req.analysisType);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as count FROM ai_analysis_history ${whereClause}`;
    const countResult = await db.rawQueryRow<{ count: number }>(countQuery, ...params);
    const total = countResult?.count || 0;

    params.push(limit);
    params.push(offset);
    const query = `
      SELECT * FROM ai_analysis_history
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    const entries = await db.rawQueryAll<AIAnalysisHistoryEntry>(query, ...params);

    return {
      entries: entries.map(entry => ({
        ...entry,
        inputData: JSON.parse(entry.inputData as any),
        analysisResult: JSON.parse(entry.analysisResult as any),
        createdAt: new Date(entry.createdAt),
      })),
      total,
    };
  }
);
