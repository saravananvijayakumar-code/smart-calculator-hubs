import { api } from "encore.dev/api";
import db from "../db";
import { SourceCatalog } from "./types";

interface ListUnbloggedSourcesRequest {
  limit?: number;
}

interface ListUnbloggedSourcesResponse {
  sources: SourceCatalog[];
  total: number;
}

export const listUnbloggedSources = api(
  { method: "POST", path: "/blog-v2/unblogged-sources", expose: true, auth: true },
  async (req: ListUnbloggedSourcesRequest): Promise<ListUnbloggedSourcesResponse> => {
    const { limit = 100 } = req;

    const countResult = await db.queryRow<{ total: string }>`
      SELECT COUNT(*) as total FROM source_catalog
      WHERE eligible = true AND blog_id IS NULL
    `;
    const total = parseInt(countResult?.total || "0");

    const sourcesResult = await db.query<SourceCatalog>`
      SELECT * FROM source_catalog
      WHERE eligible = true AND blog_id IS NULL
      ORDER BY created_at ASC
      LIMIT ${limit}
    `;

    const sources = [];
    for await (const source of sourcesResult) {
      sources.push(source);
    }

    return { sources, total };
  }
);
