import { api } from "encore.dev/api";
import db from "../db";
import { CreateShortURLRequest, CreateShortURLResponse } from "./types";

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const create = api(
  { method: "POST", path: "/shortener/create", expose: true },
  async (req: CreateShortURLRequest): Promise<CreateShortURLResponse> => {
    if (!req.url || !req.url.startsWith("http")) {
      throw new Error("Invalid URL. Must start with http:// or https://");
    }

    let shortCode = req.customAlias || generateShortCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        await db.exec`
          INSERT INTO short_urls (short_code, original_url, custom_alias)
          VALUES (${shortCode}, ${req.url}, ${!!req.customAlias})
        `;

        return {
          shortCode,
          shortUrl: `https://smartcalculatorhubs.com/s/${shortCode}`,
          originalUrl: req.url,
        };
      } catch (err: any) {
        if (err.code === "23505" && !req.customAlias) {
          shortCode = generateShortCode();
          attempts++;
        } else if (err.code === "23505" && req.customAlias) {
          throw new Error("Custom alias already taken");
        } else {
          throw err;
        }
      }
    }

    throw new Error("Failed to generate unique short code");
  }
);
