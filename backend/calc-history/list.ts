import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { ListHistoryRequest, ListHistoryResponse, CalculatorHistoryEntry } from "./types";

export const list = api(
  { method: "GET", path: "/calc-history", expose: true, auth: false },
  async (req: ListHistoryRequest): Promise<ListHistoryResponse> => {
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

    if (req.calculatorType) {
      conditions.push(`calculator_type = $${paramIndex++}`);
      params.push(req.calculatorType);
    }

    if (req.favoritesOnly) {
      conditions.push(`favorite = true`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as count FROM calculator_history ${whereClause}`;
    const countResult = await db.rawQueryRow<{ count: number }>(countQuery, ...params);
    const total = countResult?.count || 0;

    params.push(limit);
    params.push(offset);
    const query = `
      SELECT * FROM calculator_history
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    const entries = await db.rawQueryAll<CalculatorHistoryEntry>(query, ...params);

    return {
      entries: entries.map(entry => ({
        ...entry,
        inputs: JSON.parse(entry.inputs as any),
        results: JSON.parse(entry.results as any),
        tags: entry.tags ? JSON.parse(entry.tags as any) : [],
        createdAt: new Date(entry.createdAt),
      })),
      total,
    };
  }
);
