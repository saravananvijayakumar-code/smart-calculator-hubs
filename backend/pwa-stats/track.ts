import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { TrackPWAEventRequest, PWAStat } from "./types";

export const track = api(
  { method: "POST", path: "/pwa-stats/track", expose: true, auth: false },
  async (req: TrackPWAEventRequest): Promise<PWAStat> => {
    const authData = getAuthData();
    let userId: number | null = null;

    if (authData) {
      const userRow = await db.queryRow<{ id: number }>`
        SELECT id FROM users WHERE clerk_user_id = ${authData.userID}
      `;
      userId = userRow?.id || null;
    }

    const metadata = req.metadata ? JSON.stringify(req.metadata) : null;

    const stat = await db.queryRow<PWAStat>`
      INSERT INTO pwa_stats (
        event_type, session_id, user_id, metadata
      ) VALUES (
        ${req.eventType},
        ${req.sessionId},
        ${userId},
        ${metadata}
      )
      RETURNING *
    `;

    if (!stat) {
      throw new Error("Failed to track PWA event");
    }

    return {
      ...stat,
      metadata: stat.metadata ? JSON.parse(stat.metadata as any) : undefined,
      createdAt: new Date(stat.createdAt),
    };
  }
);
