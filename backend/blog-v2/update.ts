import { api, APIError } from "encore.dev/api";
import db from "../db";
import { Blog } from "./types";
import log from "encore.dev/log";

export interface UpdateBlogRequest {
  blog_id: number;
  title?: string;
  meta_title?: string;
  meta_desc?: string;
  content_md?: string;
  keywords?: string[];
}

export const update = api(
  { method: "POST", path: "/blog-v2/update", expose: true, auth: true },
  async (req: UpdateBlogRequest): Promise<Blog> => {
    const { blog_id, title, meta_title, meta_desc, content_md, keywords } = req;

    log.info("Updating blog content", { blog_id });

    const existing = await db.queryRow<Blog>`
      SELECT * FROM blogs_v2 WHERE id = ${blog_id}
    `;

    if (!existing) {
      throw APIError.notFound("Blog not found");
    }

    const updates: any[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const result = await db.queryRow<Blog>`
      UPDATE blogs_v2
      SET 
        title = ${title ?? existing.title},
        meta_title = ${meta_title ?? existing.meta_title},
        meta_desc = ${meta_desc ?? existing.meta_desc},
        content_md = ${content_md ?? existing.content_md},
        keywords = ${keywords ?? existing.keywords},
        updated_at = NOW()
      WHERE id = ${blog_id}
      RETURNING *
    `;

    if (!result) {
      throw APIError.internal("Failed to update blog");
    }

    log.info("Blog updated successfully", { blog_id });

    return result;
  }
);
