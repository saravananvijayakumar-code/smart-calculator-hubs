import { api } from "encore.dev/api";
import db from "../db";
import type { PageViewStats } from "./types";

export const getStats = api(
  { method: "GET", path: "/pageviews/stats", expose: true, auth: false },
  async (): Promise<PageViewStats> => {
    const totalResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pageviews
    `;
    const totalViews = totalResult?.count || 0;

    const todayResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pageviews
      WHERE created_at >= CURRENT_DATE
    `;
    const todayViews = todayResult?.count || 0;

    const weekResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pageviews
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `;
    const thisWeekViews = weekResult?.count || 0;

    const monthResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM pageviews
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `;
    const thisMonthViews = monthResult?.count || 0;

    const uniqueResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(DISTINCT session_id) as count FROM pageviews
    `;
    const uniqueVisitors = uniqueResult?.count || 0;

    const pageResults = await db.queryAll<{ page_path: string; count: number }>`
      SELECT page_path, COUNT(*) as count
      FROM pageviews
      GROUP BY page_path
      ORDER BY count DESC
      LIMIT 10
    `;
    const viewsByPage: Record<string, number> = {};
    for (const row of pageResults) {
      viewsByPage[row.page_path] = row.count;
    }

    const countryResults = await db.queryAll<{ country: string; count: number }>`
      SELECT COALESCE(country, 'Unknown') as country, COUNT(*) as count
      FROM pageviews
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `;
    const viewsByCountry: Record<string, number> = {};
    for (const row of countryResults) {
      viewsByCountry[row.country] = row.count;
    }

    return {
      totalViews,
      todayViews,
      thisWeekViews,
      thisMonthViews,
      uniqueVisitors,
      viewsByPage,
      viewsByCountry,
    };
  }
);
