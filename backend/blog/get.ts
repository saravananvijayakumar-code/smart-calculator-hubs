import { api } from "encore.dev/api";
import db from "../db";
import type { GetBlogRequest, BlogPost } from "./types";

export const get = api(
  { method: "GET", path: "/blog/:slug", expose: true },
  async (req: GetBlogRequest): Promise<BlogPost> => {
    const rows: BlogPost[] = [];
    
    for await (const row of db.query`SELECT * FROM blog_posts WHERE slug = ${req.slug}`) {
      rows.push(row as BlogPost);
    }
    
    if (rows.length === 0) {
      throw new Error("Blog post not found");
    }
    
    return rows[0];
  }
);
