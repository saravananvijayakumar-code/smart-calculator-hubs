import { api, Header } from "encore.dev/api";
import db from "../db";
import { RedirectRequest, RedirectResponse } from "./types";

export const redirect = api(
  { method: "GET", path: "/shortener/redirect/:shortCode", expose: true },
  async (req: RedirectRequest, ip?: Header<"x-forwarded-for">, userAgent?: Header<"user-agent">, referrer?: Header<"referer">): Promise<RedirectResponse> => {
    const result = await db.queryRow`
      SELECT original_url FROM short_urls WHERE short_code = ${req.shortCode}
    `;

    if (!result) {
      throw new Error("Short URL not found");
    }

    const clientIp = ip || "unknown";

    await db.exec`
      INSERT INTO url_clicks (short_code, ip_address, user_agent, referrer)
      VALUES (${req.shortCode}, ${clientIp}, ${userAgent || null}, ${referrer || null})
    `;

    return { url: result.original_url };
  }
);
