import { api } from "encore.dev/api";
import db from "../db";
import type { PWAStats, PWAStat } from "./types";

export const getStats = api(
  { method: "GET", path: "/pwa-stats/stats", expose: true, auth: false },
  async (): Promise<PWAStats> => {
    const installsResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pwa_stats WHERE event_type = 'install'
    `;
    const totalInstalls = installsResult?.count || 0;

    const sharesResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pwa_stats WHERE event_type = 'share'
    `;
    const totalShares = sharesResult?.count || 0;

    const offlineResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pwa_stats WHERE event_type = 'offline_access'
    `;
    const totalOfflineAccess = offlineResult?.count || 0;

    const recentResults = await db.queryAll<PWAStat>`
      SELECT * FROM pwa_stats
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const recentEvents = recentResults.map(stat => ({
      ...stat,
      metadata: stat.metadata ? JSON.parse(stat.metadata as any) : undefined,
      createdAt: new Date(stat.createdAt),
    }));

    return {
      totalInstalls,
      totalShares,
      totalOfflineAccess,
      recentEvents,
    };
  }
);
