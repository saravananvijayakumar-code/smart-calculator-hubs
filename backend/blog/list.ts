import { api } from "encore.dev/api";
import db from "../db";
import type { ListBlogsRequest, ListBlogsResponse, BlogPost } from "./types";

export const list = api(
  { method: "GET", path: "/blog", expose: true },
  async (req: ListBlogsRequest): Promise<ListBlogsResponse> => {
    const limit = req.limit ?? 10;
    const offset = req.offset ?? 0;
    
    const posts: BlogPost[] = [];
    const countRows: any[] = [];
    
    if (req.published !== undefined) {
      for await (const row of db.query`SELECT * FROM blog_posts WHERE published = ${req.published} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`) {
        posts.push(row as BlogPost);
      }
      for await (const row of db.query`SELECT COUNT(*) FROM blog_posts WHERE published = ${req.published}`) {
        countRows.push(row);
      }
    } else {
      for await (const row of db.query`SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`) {
        posts.push(row as BlogPost);
      }
      for await (const row of db.query`SELECT COUNT(*) FROM blog_posts`) {
        countRows.push(row);
      }
    }
    
    return {
      posts,
      total: parseInt(countRows[0].count)
    };
  }
);
