import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { processAutoBlog } from "./auto_generate";

export const testAutoBlogNow = api(
  { expose: true, method: "GET", path: "/blog-v2/test-auto-blog", auth: false },
  async (): Promise<{ success: boolean; message: string }> => {
    log.info("Testing auto blog generation cron job manually");
    try {
      await processAutoBlog();
      return { success: true, message: "Auto blog generation completed" };
    } catch (error) {
      log.error("Auto blog generation failed", { error });
      return { success: false, message: String(error) };
    }
  }
);
