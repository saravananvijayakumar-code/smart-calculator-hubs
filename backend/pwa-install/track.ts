import { api } from "encore.dev/api";
import db from "../db";
import log from "encore.dev/log";
import type { TrackInstallRequest, TrackInstallResponse } from "./types";

export const track = api(
  { method: "POST", path: "/pwa-install/track", expose: true, auth: false },
  async (req: TrackInstallRequest): Promise<TrackInstallResponse> => {
    try {
      const { userId, userAgent, country, city, platform } = req;

      await db.exec`
        INSERT INTO pwa_installs (user_id, user_agent, country, city, platform, installed_at)
        VALUES (${userId || null}, ${userAgent || null}, ${country || null}, ${city || null}, ${platform || null}, NOW())
      `;

      const today = new Date().toISOString().split('T')[0];
      await db.exec`
        INSERT INTO pwa_install_stats (date, installs)
        VALUES (${today}, 1)
        ON CONFLICT (date)
        DO UPDATE SET installs = pwa_install_stats.installs + 1
      `;

      log.info("PWA install tracked", { userId, platform, country });

      return {
        success: true,
        message: "PWA install tracked successfully",
      };
    } catch (error) {
      log.error("Error tracking PWA install", { error });
      return {
        success: false,
        message: "Failed to track PWA install",
      };
    }
  }
);
