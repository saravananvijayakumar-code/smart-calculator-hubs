import { api, APIError } from "encore.dev/api";
import db from "../db";
import { DeleteBlogRequest } from "./types";
import log from "encore.dev/log";

export const deleteBlog = api(
  { method: "POST", path: "/blog-v2/delete", expose: true, auth: true },
  async (req: DeleteBlogRequest): Promise<{ success: boolean }> => {
    const { blog_id } = req;

    log.info("Deleting blog", { blog_id });

    await db.exec`
      UPDATE source_catalog
      SET blog_id = NULL, updated_at = NOW()
      WHERE blog_id = ${blog_id}
    `;

    const result = await db.queryRow<{ id: number }>`
      DELETE FROM blogs_v2
      WHERE id = ${blog_id}
      RETURNING id
    `;

    if (!result) {
      throw APIError.notFound("Blog not found");
    }

    log.info("Blog deleted", { blog_id });

    return { success: true };
  }
);
