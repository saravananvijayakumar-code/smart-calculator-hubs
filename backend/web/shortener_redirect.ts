import { api } from "encore.dev/api";
import db from "../db";

interface ShortCodeRequest {
  shortCode: string;
}

export const getShortUrl = api(
  { method: "GET", path: "/s/:shortCode", expose: true },
  async (req: ShortCodeRequest): Promise<{ url: string }> => {
    const result = await db.queryRow`
      SELECT original_url FROM short_urls WHERE short_code = ${req.shortCode}
    `;

    if (!result) {
      throw new Error("Short URL not found");
    }

    await db.exec`
      INSERT INTO url_clicks (short_code) VALUES (${req.shortCode})
    `;

    return { url: result.original_url };
  }
);
