import { api } from "encore.dev/api";
import db from "../db";
import { UpdateSettingsRequest, BlogV2Settings } from "./types";
import log from "encore.dev/log";

export const updateSettings = api(
  { method: "POST", path: "/blog-v2/settings/update", expose: true, auth: true },
  async (req: UpdateSettingsRequest): Promise<BlogV2Settings> => {
    const { default_tone, default_model, schedule_hour, enabled } = req;

    log.info("Updating blog settings", req);

    if (default_tone !== undefined) {
      await db.exec`
        UPDATE blog_v2_settings SET default_tone = ${default_tone}, updated_at = NOW()
      `;
    }

    if (default_model !== undefined) {
      await db.exec`
        UPDATE blog_v2_settings SET default_model = ${default_model}, updated_at = NOW()
      `;
    }

    if (schedule_hour !== undefined) {
      await db.exec`
        UPDATE blog_v2_settings SET schedule_hour = ${schedule_hour}, updated_at = NOW()
      `;
    }

    if (enabled !== undefined) {
      await db.exec`
        UPDATE blog_v2_settings SET enabled = ${enabled}, updated_at = NOW()
      `;
    }

    const settings = await db.queryRow<BlogV2Settings>`
      SELECT * FROM blog_v2_settings LIMIT 1
    `;

    log.info("Blog settings updated", settings);

    return settings!;
  }
);
