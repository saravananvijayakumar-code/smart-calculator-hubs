import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { SaveCalculationRequest, CalculatorHistoryEntry } from "./types";

export const save = api(
  { method: "POST", path: "/calc-history", expose: true, auth: false },
  async (req: SaveCalculationRequest): Promise<CalculatorHistoryEntry> => {
    const authData = getAuthData();
    let userId: number | null = null;

    if (authData) {
      const userRow = await db.queryRow<{ id: number }>`
        SELECT id FROM users WHERE clerk_user_id = ${authData.userID}
      `;
      userId = userRow?.id || null;
    }

    const inputs = JSON.stringify(req.inputs);
    const results = JSON.stringify(req.results);
    const tags = req.tags ? JSON.stringify(req.tags) : null;

    const entry = await db.queryRow<CalculatorHistoryEntry>`
      INSERT INTO calculator_history (
        user_id, session_id, calculator_type, calculator_name,
        inputs, results, notes, tags
      ) VALUES (
        ${userId},
        ${req.sessionId},
        ${req.calculatorType},
        ${req.calculatorName},
        ${inputs},
        ${results},
        ${req.notes || null},
        ${tags}
      )
      RETURNING *
    `;

    if (!entry) {
      throw new Error("Failed to save calculation");
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
