import { api, APIError } from "encore.dev/api";
import db from "../db";
import { UpdateBlogStatusRequest } from "./types";
import log from "encore.dev/log";

export const updateStatus = api(
  { method: "POST", path: "/blog-v2/update-status", expose: true, auth: true },
  async (req: UpdateBlogStatusRequest): Promise<{ success: boolean }> => {
    const { blog_id, status } = req;

    log.info("Updating blog status", { blog_id, status });

    const updates: Record<string, any> = {
      status,
      updated_at: new Date(),
    };

    if (status === "PUBLISHED") {
      const existing = await db.queryRow<{ published_at: Date | null }>`
        SELECT published_at FROM blogs_v2 WHERE id = ${blog_id}
      `;

      if (!existing?.published_at) {
        updates.published_at = new Date();
      }
    }

    const result = await db.queryRow<{ id: number }>`
      UPDATE blogs_v2
      SET status = ${status},
          published_at = ${updates.published_at || null},
          updated_at = NOW()
      WHERE id = ${blog_id}
      RETURNING id
    `;

    if (!result) {
      throw APIError.notFound("Blog not found");
    }

    log.info("Blog status updated", { blog_id, status });

    return { success: true };
  }
);
