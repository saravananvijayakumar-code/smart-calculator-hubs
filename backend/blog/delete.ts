import { api } from "encore.dev/api";
import db from "../db";
import type { DeleteBlogRequest } from "./types";

export const remove = api(
  { method: "DELETE", path: "/blog/:slug", expose: true },
  async (req: DeleteBlogRequest): Promise<{ success: boolean }> => {
    const rows: any[] = [];
    
    for await (const row of db.query`DELETE FROM blog_posts WHERE slug = ${req.slug}`) {
      rows.push(row);
    }
    
    if (rows.length === 0) {
      throw new Error("Blog post not found");
    }
    
    return { success: true };
  }
);
