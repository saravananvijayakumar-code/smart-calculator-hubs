import { api } from "encore.dev/api";
import db from "../db";
import type { CreateBlogRequest, BlogPost } from "./types";

export const create = api(
  { method: "POST", path: "/blog", expose: true },
  async (req: CreateBlogRequest): Promise<BlogPost> => {
    const published = req.published ?? false;
    const now = new Date();
    
    const rows: BlogPost[] = [];
    for await (const row of db.query`
      INSERT INTO blog_posts (title, slug, content, excerpt, author, published, created_at, updated_at)
      VALUES (${req.title}, ${req.slug}, ${req.content}, ${req.excerpt}, ${req.author}, ${published}, ${now}, ${now})
      RETURNING *
    `) {
      rows.push(row as BlogPost);
    }
    
    return rows[0];
  }
);
