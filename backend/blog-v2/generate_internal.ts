import db from "../db";
import log from "encore.dev/log";
import { secret } from "encore.dev/config";
import crypto from "crypto";
import { marked } from "marked";
import { GenerationContext, Blog } from "./types";

const openaiKey = secret("OpenAIKey");

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

function generateJsonLd(blog: {
  title: string;
  metaDesc: string;
  slug: string;
  publishedAt: Date;
  keywords: string[];
}) {
  const baseUrl = "https://smartcalculatorhub.com";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.metaDesc || "",
    url: `${baseUrl}/blog/${blog.slug}`,
    datePublished: blog.publishedAt?.toISOString() || new Date().toISOString(),
    dateModified: blog.publishedAt?.toISOString() || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "SmartCalculatorHubs",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "SmartCalculatorHubs",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icons/icon-512x512.png`,
      },
    },
    keywords: blog.keywords.join(", "),
  };
}

async function callOpenAI(context: GenerationContext): Promise<{
  title: string;
  metaTitle: string;
  metaDesc: string;
  contentMd: string;
  keywords: string[];
}> {
  const apiKey = openaiKey();
  const { getBlogGenerationPrompt, BLOG_SYSTEM_MESSAGE, BLOG_TEMPERATURE, BLOG_MAX_TOKENS } = await import("./prompts");
  const prompt = getBlogGenerationPrompt(context);

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
      response_format: { type: "json_object" },
      temperature: BLOG_TEMPERATURE,
      max_tokens: BLOG_MAX_TOKENS,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    log.error("OpenAI API error", { status: response.status, error: errorText });
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as any;
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from OpenAI");
  }

  const parsed = JSON.parse(content);

  return {
    title: parsed.title,
    metaTitle: parsed.metaTitle,
    metaDesc: parsed.metaDesc,
    contentMd: parsed.contentMd,
    keywords: parsed.keywords || [],
  };
}

export async function generateBlogInternal(): Promise<{
  success: boolean;
  message: string;
  blogId?: number;
  slug?: string;
}> {
  log.info("Starting internal blog generation");

  const settings = await db.queryRow<{
    enabled: boolean;
    schedule_hour: number;
    default_tone: string;
  }>`
    SELECT enabled, schedule_hour, default_tone FROM blog_v2_settings LIMIT 1
  `;

  if (!settings?.enabled) {
    log.info("Blog generation is disabled in settings");
    return {
      success: false,
      message: "Blog generation is disabled in settings",
    };
  }

  const oldestSource = await db.queryRow<{
    source_url: string;
    title: string | null;
    kind: string;
  }>`
    SELECT source_url, title, kind FROM source_catalog
    WHERE eligible = true AND blog_id IS NULL
    ORDER BY created_at ASC
    LIMIT 1
  `;

  if (!oldestSource) {
    log.info("No unblogged sources available");
    return {
      success: false,
      message: "No unblogged sources available",
    };
  }

  try {
    log.info("Generating blog for source", {
      sourceUrl: oldestSource.source_url,
      title: oldestSource.title,
    });

    const context: GenerationContext = {
      source_url: oldestSource.source_url,
      title: oldestSource.title || oldestSource.source_url,
      kind: oldestSource.kind as any,
      tone: (settings?.default_tone as any) || "informative",
      audience: "general",
      region: oldestSource.source_url.includes("/australia/") ||
        oldestSource.source_url.includes("/au/")
        ? "australia"
        : oldestSource.source_url.includes("/uk/")
        ? "uk"
        : oldestSource.source_url.includes("/india/")
        ? "india"
        : oldestSource.source_url.includes("/us/")
        ? "us"
        : undefined,
    };

    const generated = await callOpenAI(context);

    const slug = generateSlug(generated.title);
    const html = await marked(generated.contentMd);
    const status = "PUBLISHED";
    const publishedAt = new Date();

    const jsonLd = generateJsonLd({
      title: generated.title,
      metaDesc: generated.metaDesc,
      slug,
      publishedAt,
      keywords: generated.keywords,
    });

    const blogResult = await db.queryRow<{ id: number }>`
      INSERT INTO blogs_v2 (
        source_url, slug, title, meta_title, meta_desc,
        content_md, html, json_ld, keywords, tone, audience,
        kind, status, published_at
      ) VALUES (
        ${oldestSource.source_url}, ${slug}, ${generated.title}, ${generated.metaTitle},
        ${generated.metaDesc}, ${generated.contentMd}, ${html},
        ${JSON.stringify(jsonLd)}, ${generated.keywords}, ${context.tone},
        ${context.audience}, ${context.kind}, ${status}, ${publishedAt}
      )
      ON CONFLICT (source_url) DO UPDATE SET
        title = EXCLUDED.title,
        meta_title = EXCLUDED.meta_title,
        meta_desc = EXCLUDED.meta_desc,
        content_md = EXCLUDED.content_md,
        html = EXCLUDED.html,
        json_ld = EXCLUDED.json_ld,
        keywords = EXCLUDED.keywords,
        tone = EXCLUDED.tone,
        audience = EXCLUDED.audience,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING id
    `;

    await db.exec`
      UPDATE source_catalog
      SET blog_id = ${blogResult!.id}, updated_at = NOW()
      WHERE source_url = ${oldestSource.source_url}
    `;

    log.info("Blog generated successfully", {
      blogId: blogResult!.id,
      slug: slug,
    });

    return {
      success: true,
      message: "Blog generated successfully",
      blogId: blogResult!.id,
      slug: slug,
    };
  } catch (err) {
    log.error("Failed to generate blog", {
      sourceUrl: oldestSource.source_url,
      error: err,
    });

    return {
      success: false,
      message: `Failed to generate blog: ${err}`,
    };
  }
}
