import { api, APIError } from "encore.dev/api";
import db from "../db";

export const deleteEntry = api(
  { method: "DELETE", path: "/calc-history/:id", expose: true, auth: false },
  async ({ id }: { id: number }): Promise<void> => {
    const result = await db.queryRow<{ id: number }>`
      DELETE FROM calculator_history WHERE id = ${id} RETURNING id
    `;

    if (!result) {
      throw APIError.notFound("history entry not found");
    }
  }
);
