import { api, APIError } from "encore.dev/api";
import db from "../db";
import { Blog } from "./types";

interface GetBySlugRequest {
  slug: string;
}

export const getBySlug = api(
  { method: "GET", path: "/blog-v2/:slug", expose: true, auth: false },
  async (req: GetBySlugRequest): Promise<Blog> => {
    const blog = await db.queryRow<Blog>`
      SELECT * FROM blogs_v2
      WHERE slug = ${req.slug} AND status = 'PUBLISHED'
    `;

    if (!blog) {
      throw APIError.notFound("Blog post not found");
    }

    return blog;
  }
);
