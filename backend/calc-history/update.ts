import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { UpdateHistoryRequest, CalculatorHistoryEntry } from "./types";

export const update = api(
  { method: "PUT", path: "/calc-history/:id", expose: true, auth: false },
  async (req: UpdateHistoryRequest): Promise<CalculatorHistoryEntry> => {
    const authData = getAuthData();
    let userId: number | null = null;

    if (authData) {
      const userRow = await db.queryRow<{ id: number }>`
        SELECT id FROM users WHERE clerk_user_id = ${authData.userID}
      `;
      userId = userRow?.id || null;
    }

    const existing = await db.queryRow<{ user_id?: number; session_id: string }>`
      SELECT user_id, session_id FROM calculator_history WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("history entry not found");
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(req.notes);
    }

    if (req.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(req.tags));
    }

    if (req.favorite !== undefined) {
      updates.push(`favorite = $${paramIndex++}`);
      values.push(req.favorite);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    values.push(req.id);
    const query = `
      UPDATE calculator_history
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const entry = await db.rawQueryRow<CalculatorHistoryEntry>(query, ...values);

    if (!entry) {
      throw APIError.internal("failed to update history entry");
    }

    return {
      ...entry,
      inputs: JSON.parse(entry.inputs as any),
      results: JSON.parse(entry.results as any),
      tags: entry.tags ? JSON.parse(entry.tags as any) : [],
      createdAt: new Date(entry.createdAt),
    };
  }
);
