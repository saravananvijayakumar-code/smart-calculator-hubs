import { api } from "encore.dev/api";
import db from "../db";
import { ListBlogsRequest, ListBlogsResponse, Blog } from "./types";

export const list = api(
  { method: "POST", path: "/blog-v2/list", expose: true, auth: false },
  async (req: ListBlogsRequest): Promise<ListBlogsResponse> => {
    const { status, kind, page = 1, limit = 20 } = req;

    const offset = (page - 1) * limit;

    let countResult: { total: string } | null;
    let blogsIterator: AsyncGenerator<Blog>;

    if (status && kind) {
      countResult = await db.queryRow<{ total: string }>`
        SELECT COUNT(*) as total FROM blogs_v2
        WHERE status = ${status} AND kind = ${kind}
      `;
      blogsIterator = db.query<Blog>`
        SELECT * FROM blogs_v2
        WHERE status = ${status} AND kind = ${kind}
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (status) {
      countResult = await db.queryRow<{ total: string }>`
        SELECT COUNT(*) as total FROM blogs_v2
        WHERE status = ${status}
      `;
      blogsIterator = db.query<Blog>`
        SELECT * FROM blogs_v2
        WHERE status = ${status}
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (kind) {
      countResult = await db.queryRow<{ total: string }>`
        SELECT COUNT(*) as total FROM blogs_v2
        WHERE kind = ${kind}
      `;
      blogsIterator = db.query<Blog>`
        SELECT * FROM blogs_v2
        WHERE kind = ${kind}
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      countResult = await db.queryRow<{ total: string }>`
        SELECT COUNT(*) as total FROM blogs_v2
      `;
      blogsIterator = db.query<Blog>`
        SELECT * FROM blogs_v2
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const total = parseInt(countResult?.total || "0");
    const blogs: Blog[] = [];
    for await (const blog of blogsIterator) {
      blogs.push(blog);
    }

    return {
      blogs,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
);
