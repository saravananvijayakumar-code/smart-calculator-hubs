import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { TrackPageViewRequest, PageView } from "./types";

export const track = api(
  { method: "POST", path: "/pageviews/track", expose: true, auth: false },
  async (req: TrackPageViewRequest): Promise<PageView> => {
    const authData = getAuthData();
    let userId: number | null = null;

    if (authData) {
      const userRow = await db.queryRow<{ id: number }>`
        SELECT id FROM users WHERE clerk_user_id = ${authData.userID}
      `;
      userId = userRow?.id || null;
    }

    const pageView = await db.queryRow<PageView>`
      INSERT INTO pageviews (
        page_path, user_agent, referrer, session_id, user_id
      ) VALUES (
        ${req.pagePath},
        ${req.userAgent || null},
        ${req.referrer || null},
        ${req.sessionId},
        ${userId}
      )
      RETURNING *
    `;

    if (!pageView) {
      throw new Error("Failed to track page view");
    }

    return {
      ...pageView,
      createdAt: new Date(pageView.createdAt),
    };
  }
);
