import { api } from "encore.dev/api";
import db from "../db";
import type { UpdateBlogRequest, BlogPost } from "./types";

export const update = api(
  { method: "PUT", path: "/blog/:slug", expose: true },
  async (req: UpdateBlogRequest): Promise<BlogPost> => {
    const updatedAt = new Date();
    
    const sets: string[] = ["updated_at = " + `'${updatedAt.toISOString()}'`];
    const values: any[] = [];
    
    if (req.title !== undefined) {
      sets.push(`title = $${values.length + 1}`);
      values.push(req.title);
    }
    if (req.content !== undefined) {
      sets.push(`content = $${values.length + 1}`);
      values.push(req.content);
    }
    if (req.excerpt !== undefined) {
      sets.push(`excerpt = $${values.length + 1}`);
      values.push(req.excerpt);
    }
    if (req.author !== undefined) {
      sets.push(`author = $${values.length + 1}`);
      values.push(req.author);
    }
    if (req.published !== undefined) {
      sets.push(`published = $${values.length + 1}`);
      values.push(req.published);
    }
    
    values.push(req.slug);
    
    const query = `UPDATE blog_posts SET ${sets.join(", ")} WHERE slug = $${values.length} RETURNING *`;
    
    const rows: BlogPost[] = [];
    for await (const row of db.rawQuery<BlogPost>(query, ...values)) {
      rows.push(row);
    }
    
    if (rows.length === 0) {
      throw new Error("Blog post not found");
    }
    
    return rows[0];
  }
);
