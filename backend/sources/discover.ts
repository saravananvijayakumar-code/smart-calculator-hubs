import { api } from "encore.dev/api";
import db from "../db";
import { DiscoverSourcesResponse, SourceRegistry } from "../blog-v2/types";
import log from "encore.dev/log";
import * as fs from "fs";
import * as path from "path";

const SITEMAP_PATH = path.join(process.cwd(), "frontend/public/sitemap.xml");
const REGISTRY_PATH = path.join(process.cwd(), "config/sourceRegistry.json");

export const discover = api(
  { method: "POST", path: "/sources/discover", expose: true, auth: true },
  async (): Promise<DiscoverSourcesResponse> => {
    log.info("Starting source discovery...");

    const sources = new Map<string, { title?: string; kind: string }>();

    try {
      const registryData = fs.readFileSync(REGISTRY_PATH, "utf-8");
      const registry: SourceRegistry = JSON.parse(registryData);

      for (const entry of registry.sources) {
        sources.set(entry.url, {
          title: entry.title,
          kind: entry.kind,
        });
      }

      log.info(`Loaded ${sources.size} sources from registry`);
    } catch (err) {
      log.error("Failed to load source registry", { error: err });
    }

    if (fs.existsSync(SITEMAP_PATH)) {
      try {
        const sitemapData = fs.readFileSync(SITEMAP_PATH, "utf-8");
        const urlMatches = sitemapData.match(/<loc>(.*?)<\/loc>/g);

        if (urlMatches) {
          for (const match of urlMatches) {
            const url = match.replace(/<\/?loc>/g, "");
            const urlPath = new URL(url).pathname;

            if (!sources.has(urlPath)) {
              let kind = "other";

              if (
                urlPath.includes("/calculator") ||
                urlPath.includes("/au/") ||
                urlPath.includes("/uk/") ||
                urlPath.includes("/india/")
              ) {
                kind = "calculator";
              } else if (urlPath.includes("/ai/")) {
                kind = "ai_hub";
              } else if (urlPath.includes("/tools") || urlPath.includes("/finder")) {
                kind = "tool";
              }

              sources.set(urlPath, { kind });
            }
          }

          log.info(`Parsed ${urlMatches.length} URLs from sitemap`);
        }
      } catch (err) {
        log.error("Failed to parse sitemap", { error: err });
      }
    }

    let newSources = 0;
    let updated = 0;

    for (const [sourceUrl, data] of sources.entries()) {
      try {
        const existing = await db.queryRow`
          SELECT id, title, kind FROM source_catalog
          WHERE source_url = ${sourceUrl}
        `;

        if (existing) {
          if (data.title && existing.title !== data.title) {
            await db.exec`
              UPDATE source_catalog
              SET title = ${data.title}, kind = ${data.kind}, updated_at = NOW()
              WHERE source_url = ${sourceUrl}
            `;
            updated++;
          }
        } else {
          await db.exec`
            INSERT INTO source_catalog (source_url, title, kind, eligible)
            VALUES (${sourceUrl}, ${data.title || null}, ${data.kind}, true)
          `;
          newSources++;
        }
      } catch (err) {
        log.error("Failed to upsert source", { sourceUrl, error: err });
      }
    }

    log.info("Source discovery complete", { newSources, updated, total: sources.size });

    return {
      discovered: sources.size,
      new_sources: newSources,
      updated,
    };
  }
);
