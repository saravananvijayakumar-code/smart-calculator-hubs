import { api } from "encore.dev/api";
import db from "../db";
import log from "encore.dev/log";

export const testGenerate = api(
  { method: "GET", path: "/blog-v2/test", expose: true },
  async (): Promise<{ message: string; sources: number }> => {
    log.info("Test: Checking unblogged sources");

    const unbloggedSourcesArray: { source_url: string }[] = [];
    for await (const row of db.query<{ source_url: string }>`
      SELECT sc.source_url
      FROM source_catalog sc
      LEFT JOIN blogs_v2 b ON sc.source_url = b.source_url
      WHERE sc.eligible = true
        AND (b.id IS NULL OR b.status = 'FAILED')
      ORDER BY sc.created_at ASC
      LIMIT 10
    `) {
      unbloggedSourcesArray.push(row);
    }

    return { 
      message: `Found ${unbloggedSourcesArray.length} unblogged sources`, 
      sources: unbloggedSourcesArray.length
    };
  }
);
