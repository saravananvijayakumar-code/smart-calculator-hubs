import { api } from "encore.dev/api";
import db from "../db";
import { BlogV2Settings } from "./types";

export const getSettings = api(
  { method: "GET", path: "/blog-v2/settings", expose: true, auth: true },
  async (): Promise<BlogV2Settings> => {
    const settings = await db.queryRow<BlogV2Settings>`
      SELECT * FROM blog_v2_settings LIMIT 1
    `;

    if (!settings) {
      const defaultSettings: Partial<BlogV2Settings> = {
        default_tone: "informative",
        default_model: "gpt-4o-mini",
        schedule_hour: 9,
        schedule_timezone: "Australia/Sydney",
        enabled: true,
      };

      await db.exec`
        INSERT INTO blog_v2_settings (default_tone, default_model, schedule_hour, schedule_timezone, enabled)
        VALUES (${defaultSettings.default_tone}, ${defaultSettings.default_model}, ${defaultSettings.schedule_hour}, ${defaultSettings.schedule_timezone}, ${defaultSettings.enabled})
      `;

      return (await db.queryRow<BlogV2Settings>`SELECT * FROM blog_v2_settings LIMIT 1`)!;
    }

    return settings;
  }
);
