import { api } from "encore.dev/api";
import db from "../db";
import log from "encore.dev/log";
import type { GetStatsResponse, PWAInstallRecord, PWAInstallStats } from "./types";

export const getStats = api(
  { method: "GET", path: "/pwa-install/stats", expose: true, auth: false },
  async (): Promise<GetStatsResponse> => {
    try {
      const totalResult = await db.queryRow<{ count: number }>`
        SELECT COUNT(*) as count FROM pwa_installs
      `;
      const totalInstalls = totalResult?.count || 0;

      const last7DaysData: PWAInstallStats[] = [];
      for await (const row of db.query<PWAInstallStats>`
        SELECT date::text, installs
        FROM pwa_install_stats
        WHERE date >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY date DESC
      `) {
        last7DaysData.push(row);
      }

      const last30DaysData: PWAInstallStats[] = [];
      for await (const row of db.query<PWAInstallStats>`
        SELECT date::text, installs
        FROM pwa_install_stats
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY date DESC
      `) {
        last30DaysData.push(row);
      }

      const platformData: { platform: string; count: string }[] = [];
      for await (const row of db.query<{ platform: string; count: string }>`
        SELECT platform, COUNT(*) as count
        FROM pwa_installs
        WHERE platform IS NOT NULL
        GROUP BY platform
        ORDER BY count DESC
        LIMIT 10
      `) {
        platformData.push(row);
      }
      const byPlatform = platformData.map(row => ({
        platform: row.platform || "Unknown",
        count: parseInt(row.count),
      }));

      const countryData: { country: string; count: string }[] = [];
      for await (const row of db.query<{ country: string; count: string }>`
        SELECT country, COUNT(*) as count
        FROM pwa_installs
        WHERE country IS NOT NULL
        GROUP BY country
        ORDER BY count DESC
        LIMIT 10
      `) {
        countryData.push(row);
      }
      const byCountry = countryData.map(row => ({
        country: row.country || "Unknown",
        count: parseInt(row.count),
      }));

      const recentInstallsData: PWAInstallRecord[] = [];
      for await (const row of db.query<PWAInstallRecord>`
        SELECT id, user_id, user_agent, country, city, platform, installed_at
        FROM pwa_installs
        ORDER BY installed_at DESC
        LIMIT 50
      `) {
        recentInstallsData.push(row);
      }

      log.info("PWA install stats retrieved", { totalInstalls });

      return {
        totalInstalls,
        last7Days: last7DaysData,
        last30Days: last30DaysData,
        byPlatform,
        byCountry,
        recentInstalls: recentInstallsData,
      };
    } catch (error) {
      log.error("Error fetching PWA install stats", { error });
      return {
        totalInstalls: 0,
        last7Days: [],
        last30Days: [],
        byPlatform: [],
        byCountry: [],
        recentInstalls: [],
      };
    }
  }
);
