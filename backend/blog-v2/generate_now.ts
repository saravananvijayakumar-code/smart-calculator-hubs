import { api } from "encore.dev/api";
import db from "../db";
import log from "encore.dev/log";
import { secret } from "encore.dev/config";
import { marked } from "marked";

const openaiKey = secret("OpenAIKey");

interface GenerateNowResponse {
  success: boolean;
  message: string;
  blogId?: number;
  slug?: string;
  title?: string;
  remaining: number;
  completed: number;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

export const generateNow = api(
  { expose: true, method: "POST", path: "/blog-v2/generate-now", auth: true },
  async (): Promise<GenerateNowResponse> => {
    log.info("Manual 'Generate Now' triggered");

    try {
      const settings = await db.queryRow<{
        enabled: boolean;
        default_tone: string;
      }>`
        SELECT enabled, default_tone FROM blog_v2_settings LIMIT 1
      `;

      const nextSource = await db.queryRow<{
        source_url: string;
        title: string | null;
        kind: string;
      }>`
        SELECT sc.source_url, sc.title, sc.kind
        FROM source_catalog sc
        LEFT JOIN blogs_v2 b ON sc.source_url = b.source_url
        WHERE sc.eligible = true
          AND (b.id IS NULL OR b.status = 'FAILED')
        ORDER BY sc.created_at ASC
        LIMIT 1
      `;

      if (!nextSource) {
        const completed = await db.queryRow<{ count: number }>`
          SELECT COUNT(*) as count FROM blogs_v2 WHERE status = 'PUBLISHED'
        `;

        return {
          success: false,
          message: "No pages waiting for blogs",
          remaining: 0,
          completed: completed?.count || 0,
        };
      }

      const context = {
        source_url: nextSource.source_url,
        title: nextSource.title || nextSource.source_url,
        kind: nextSource.kind,
        tone: settings?.default_tone || "informative",
        audience: "general",
        region: nextSource.source_url.includes("/australia/") || nextSource.source_url.includes("/au/")
          ? "australia"
          : nextSource.source_url.includes("/uk/")
          ? "uk"
          : nextSource.source_url.includes("/india/")
          ? "india"
          : nextSource.source_url.includes("/us/")
          ? "us"
          : undefined,
      };

      log.info("Generating blog for source", { source: nextSource.source_url });

      const { getBlogGenerationPrompt, BLOG_SYSTEM_MESSAGE, BLOG_TEMPERATURE, BLOG_MAX_TOKENS } = await import("./prompts");
      const prompt = getBlogGenerationPrompt(context);

      const apiKey = openaiKey();
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: BLOG_SYSTEM_MESSAGE,
            },
            { role: "user", content: prompt },
          ],
          temperature: BLOG_TEMPERATURE,
          max_tokens: BLOG_MAX_TOKENS,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        log.error("OpenAI API error", { status: response.status, error });
        throw new Error(`OpenAI error: ${response.status}`);
      }

      const data: any = await response.json();
      const generated = JSON.parse(data.choices[0].message.content);

      const slug = generateSlug(generated.title);
      const html = await marked(generated.contentMd);
      const publishedAt = new Date();

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: generated.title,
        description: generated.metaDesc || "",
        url: `https://smartcalculatorhubs.com/blog/${slug}`,
        datePublished: publishedAt.toISOString(),
        author: {
          "@type": "Organization",
          name: "SmartCalculatorHubs",
        },
        keywords: generated.keywords.join(", "),
      };

      const blogResult = await db.queryRow<{ id: number }>`
        INSERT INTO blogs_v2 (
          source_url, slug, title, meta_title, meta_desc,
          content_md, html, json_ld, keywords, tone, audience,
          kind, status, published_at
        ) VALUES (
          ${nextSource.source_url}, ${slug}, ${generated.title}, ${generated.metaTitle},
          ${generated.metaDesc}, ${generated.contentMd}, ${html},
          ${JSON.stringify(jsonLd)}, ${generated.keywords}, ${context.tone},
          ${context.audience}, ${context.kind}, 'PUBLISHED', ${publishedAt}
        )
        RETURNING id
      `;

      await db.exec`
        UPDATE source_catalog
        SET blog_id = ${blogResult!.id}, updated_at = NOW()
        WHERE source_url = ${nextSource.source_url}
      `;

      const remaining = await db.queryRow<{ count: number }>`
        SELECT COUNT(*) as count
        FROM source_catalog sc
        LEFT JOIN blogs_v2 b ON sc.source_url = b.source_url
        WHERE sc.eligible = true
          AND (b.id IS NULL OR b.status = 'FAILED')
      `;

      const completed = await db.queryRow<{ count: number }>`
        SELECT COUNT(*) as count FROM blogs_v2 WHERE status = 'PUBLISHED'
      `;

      log.info("Blog generated successfully", {
        blogId: blogResult!.id,
        slug,
        remaining: remaining?.count || 0,
        completed: completed?.count || 0,
      });

      return {
        success: true,
        message: "Blog created successfully",
        blogId: blogResult!.id,
        slug,
        title: generated.title,
        remaining: remaining?.count || 0,
        completed: completed?.count || 0,
      };
    } catch (err) {
      log.error("Failed to generate blog", { error: err });

      const completed = await db.queryRow<{ count: number }>`
        SELECT COUNT(*) as count FROM blogs_v2 WHERE status = 'PUBLISHED'
      `;

      const remaining = await db.queryRow<{ count: number }>`
        SELECT COUNT(*) as count
        FROM source_catalog sc
        LEFT JOIN blogs_v2 b ON sc.source_url = b.source_url
        WHERE sc.eligible = true
          AND (b.id IS NULL OR b.status = 'FAILED')
      `;

      return {
        success: false,
        message: `Failed to generate blog: ${err}`,
        remaining: remaining?.count || 0,
        completed: completed?.count || 0,
      };
    }
  }
);

export const getProgress = api(
  { expose: true, method: "GET", path: "/blog-v2/progress", auth: true },
  async (): Promise<{ remaining: number; completed: number; total: number }> => {
    const remaining = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM source_catalog sc
      LEFT JOIN blogs_v2 b ON sc.source_url = b.source_url
      WHERE sc.eligible = true
        AND (b.id IS NULL OR b.status = 'FAILED')
    `;

    const completed = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM blogs_v2 WHERE status = 'PUBLISHED'
    `;

    const total = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM source_catalog WHERE eligible = true
    `;

    return {
      remaining: remaining?.count || 0,
      completed: completed?.count || 0,
      total: total?.count || 0,
    };
  }
);
