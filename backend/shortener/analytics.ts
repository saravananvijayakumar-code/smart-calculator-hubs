import { api } from "encore.dev/api";
import db from "../db";
import { URLAnalytics } from "./types";

interface AnalyticsRequest {
  shortCode: string;
}

export const analytics = api(
  { method: "GET", path: "/shortener/analytics/:shortCode", expose: true },
  async (req: AnalyticsRequest): Promise<URLAnalytics> => {
    const urlResult = await db.queryRow`
      SELECT original_url, created_at FROM short_urls WHERE short_code = ${req.shortCode}
    `;

    if (!urlResult) {
      throw new Error("Short URL not found");
    }

    const clicksResult = await db.queryRow`
      SELECT COUNT(*) as total FROM url_clicks WHERE short_code = ${req.shortCode}
    `;

    const recentClicksResult = await db.queryAll`
      SELECT clicked_at, country, city, referrer 
      FROM url_clicks 
      WHERE short_code = ${req.shortCode}
      ORDER BY clicked_at DESC 
      LIMIT 20
    `;

    return {
      shortCode: req.shortCode,
      originalUrl: urlResult.original_url,
      totalClicks: parseInt(clicksResult?.total || "0"),
      recentClicks: recentClicksResult.map((row: any) => ({
        clickedAt: row.clicked_at.toISOString(),
        country: row.country,
        city: row.city,
        referrer: row.referrer,
      })),
      createdAt: urlResult.created_at.toISOString(),
    };
  }
);
