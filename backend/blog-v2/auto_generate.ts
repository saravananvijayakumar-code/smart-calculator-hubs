import { api } from "encore.dev/api";
import { CronJob } from "encore.dev/cron";
import db from "../db";
import log from "encore.dev/log";
import { GenerationContext } from "./types";
import { secret } from "encore.dev/config";
import crypto from "crypto";
import { marked } from "marked";

const openaiKey = secret("OpenAIKey");

interface SourceInfo {
  url: string;
  title: string;
  kind: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

function generateHash(sourceUrl: string): string {
  return crypto.createHash("sha256").update(sourceUrl).digest("hex").substring(0, 16);
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
      temperature: BLOG_TEMPERATURE,
      max_tokens: BLOG_MAX_TOKENS,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    log.error("OpenAI API error", { status: response.status, error });
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data: any = await response.json();
  const content = JSON.parse(data.choices[0].message.content);

  return {
    title: content.title,
    metaTitle: content.metaTitle,
    metaDesc: content.metaDesc,
    contentMd: content.contentMd,
    keywords: content.keywords || [],
  };
}

function generateJsonLd(blog: {
  title: string;
  metaDesc?: string;
  slug: string;
  publishedAt?: Date;
  keywords: string[];
}): any {
  const baseUrl = "https://smartcalculatorhubs.com";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
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

async function discoverAllSources(): Promise<SourceInfo[]> {
  const sources: SourceInfo[] = [];

  const calculatorRoutes = [
    { url: "/calculators/health/bmi-calculator", title: "BMI Calculator", kind: "calculator" },
    { url: "/calculators/health/calorie-calculator", title: "Calorie Calculator", kind: "calculator" },
    { url: "/calculators/health/bmr-calculator", title: "BMR Calculator", kind: "calculator" },
    { url: "/calculators/health/body-fat-calculator", title: "Body Fat Calculator", kind: "calculator" },
    { url: "/calculators/health/ideal-weight-calculator", title: "Ideal Weight Calculator", kind: "calculator" },
    { url: "/calculators/health/water-intake-calculator", title: "Water Intake Calculator", kind: "calculator" },
    { url: "/calculators/health/heart-rate-zone-calculator", title: "Heart Rate Zone Calculator", kind: "calculator" },
    { url: "/calculators/health/sleep-calculator", title: "Sleep Calculator", kind: "calculator" },
    { url: "/calculators/health/waist-hip-ratio-calculator", title: "Waist to Hip Ratio Calculator", kind: "calculator" },
    { url: "/calculators/health/weight-loss-step-calculator", title: "Weight Loss Step Calculator", kind: "calculator" },
    { url: "/calculators/health/ovulation-calculator", title: "Ovulation Calculator", kind: "calculator" },
    { url: "/calculators/health/pregnancy-due-date-calculator", title: "Pregnancy Due Date Calculator", kind: "calculator" },
    { url: "/calculators/financial/mortgage-calculator", title: "Mortgage Calculator", kind: "calculator" },
    { url: "/calculators/financial/loan-calculator", title: "Loan Calculator", kind: "calculator" },
    { url: "/calculators/financial/investment-calculator", title: "Investment Calculator", kind: "calculator" },
    { url: "/calculators/financial/retirement-calculator", title: "Retirement Calculator", kind: "calculator" },
    { url: "/calculators/financial/emergency-fund-calculator", title: "Emergency Fund Calculator", kind: "calculator" },
    { url: "/calculators/australia/income-tax-calculator", title: "Income Tax Calculator Australia", kind: "calculator" },
    { url: "/calculators/australia/pay-calculator", title: "Pay Calculator Australia", kind: "calculator" },
    { url: "/calculators/australia/superannuation-calculator", title: "Superannuation Calculator", kind: "calculator" },
    { url: "/calculators/india/emi-calculator", title: "EMI Calculator India", kind: "calculator" },
    { url: "/calculators/india/gst-calculator", title: "GST Calculator India", kind: "calculator" },
    { url: "/calculators/india/income-tax-calculator", title: "Income Tax Calculator India", kind: "calculator" },
    { url: "/ai/tools/instagram-bio-analyzer", title: "Instagram Bio Analyzer", kind: "ai_hub" },
    { url: "/ai/tools/tiktok-profile-score", title: "TikTok Profile Score", kind: "ai_hub" },
    { url: "/ai/tools/caption-generator", title: "Caption Generator", kind: "ai_hub" },
    { url: "/ai/tools/profile-analyzer", title: "Profile Analyzer", kind: "ai_hub" },
    { url: "/ai/tools/audience-analyzer", title: "Audience Analyzer", kind: "ai_hub" },
    { url: "/finder/tools/pet-breed-finder", title: "Pet Breed Finder", kind: "tool" },
    { url: "/finder/tools/home-decor-style-finder", title: "Home Decor Style Finder", kind: "tool" },
    { url: "/tools/image-compressor", title: "Image Compressor", kind: "tool" },
    { url: "/tools/know-my-ip", title: "Know My IP", kind: "tool" },
  ];

  sources.push(...calculatorRoutes);

  return sources;
}

async function syncSourceCatalog(): Promise<number> {
  const sources = await discoverAllSources();
  
  log.info("Syncing source catalog", { count: sources.length });

  let synced = 0;
  for (const source of sources) {
    try {
      await db.exec`
        INSERT INTO source_catalog (source_url, title, kind, eligible)
        VALUES (${source.url}, ${source.title}, ${source.kind}, true)
        ON CONFLICT (source_url) DO UPDATE SET
          title = EXCLUDED.title,
          kind = EXCLUDED.kind,
          updated_at = NOW()
      `;
      synced++;
    } catch (err) {
      log.error("Failed to sync source", { source: source.url, error: err });
    }
  }

  log.info("Source catalog synced successfully", { synced, total: sources.length });
  return synced;
}

async function generateBlogForSource(sourceUrl: string): Promise<void> {
  log.info("Generating blog for source", { sourceUrl });

  const existingBlog = await db.queryRow<{ id: number }>`
    SELECT id FROM blogs_v2 WHERE source_url = ${sourceUrl}
  `;

  if (existingBlog) {
    log.info("Blog already exists, skipping", { sourceUrl });
    return;
  }

  const sourceRow = await db.queryRow<{
    title: string | null;
    kind: string;
  }>`
    SELECT title, kind FROM source_catalog WHERE source_url = ${sourceUrl}
  `;

  if (!sourceRow) {
    log.warn("Source not found in catalog", { sourceUrl });
    return;
  }

  const settings = await db.queryRow<{
    default_tone: string;
  }>`
    SELECT default_tone FROM blog_v2_settings LIMIT 1
  `;

  const context: GenerationContext = {
    source_url: sourceUrl,
    title: sourceRow.title || sourceUrl,
    kind: sourceRow.kind as any,
    tone: (settings?.default_tone as any) || "informative",
    audience: "general",
    region: sourceUrl.includes("/australia/") || sourceUrl.includes("/au/")
      ? "australia"
      : sourceUrl.includes("/uk/")
      ? "uk"
      : sourceUrl.includes("/india/")
      ? "india"
      : sourceUrl.includes("/us/")
      ? "us"
      : undefined,
  };

  try {
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
        ${sourceUrl}, ${slug}, ${generated.title}, ${generated.metaTitle},
        ${generated.metaDesc}, ${generated.contentMd}, ${html},
        ${JSON.stringify(jsonLd)}, ${generated.keywords}, ${context.tone},
        ${context.audience}, ${context.kind}, ${status}, ${publishedAt}
      )
      RETURNING id
    `;

    await db.exec`
      UPDATE source_catalog
      SET blog_id = ${blogResult!.id}, updated_at = NOW()
      WHERE source_url = ${sourceUrl}
    `;

    log.info("Blog generated successfully", { blogId: blogResult!.id, slug, sourceUrl });
  } catch (err) {
    log.error("Failed to generate blog", { sourceUrl, error: err });

    await db.exec`
      INSERT INTO blogs_v2 (
        source_url, slug, title, content_md, html, status
      ) VALUES (
        ${sourceUrl}, ${generateHash(sourceUrl)},
        'Failed to generate', '', '', 'FAILED'
      )
      ON CONFLICT (source_url) DO UPDATE SET status = 'FAILED'
    `;
  }
}

export const processAutoBlog = api(
  { expose: false },
  async (): Promise<void> => {
    log.info("====== AUTO BLOG GENERATION STARTED ======");

    try {
      const settings = await db.queryRow<{ enabled: boolean }>`
        SELECT enabled FROM blog_v2_settings LIMIT 1
      `;

      log.info("Settings loaded", { enabled: settings?.enabled });

      if (!settings?.enabled) {
        log.warn("Auto blog generation is disabled in settings");
        return;
      }

      const synced = await syncSourceCatalog();
      log.info("Source catalog sync complete", { synced });

      const unbloggedSourcesArray: { source_url: string }[] = [];
      for await (const row of db.query<{ source_url: string }>`
        SELECT sc.source_url
        FROM source_catalog sc
        LEFT JOIN blogs_v2 b ON sc.source_url = b.source_url
        WHERE sc.eligible = true
          AND (b.id IS NULL OR b.status = 'FAILED')
        ORDER BY sc.created_at ASC
        LIMIT 2
      `) {
        unbloggedSourcesArray.push(row);
      }

      log.info("Found unblogged sources", { count: unbloggedSourcesArray.length });

      if (unbloggedSourcesArray.length === 0) {
        log.info("No unblogged sources available for generation");
        return;
      }

      for (const source of unbloggedSourcesArray) {
        log.info("Generating blog for source", { sourceUrl: source.source_url });
        await generateBlogForSource(source.source_url);
      }

      log.info("====== AUTO BLOG GENERATION COMPLETED ======", { generated: unbloggedSourcesArray.length });
    } catch (err) {
      log.error("====== AUTO BLOG GENERATION FAILED ======", { error: err });
      throw err;
    }
  }
);

export const autoBlogCron = new CronJob("auto-blog-daily", {
  title: "Auto Blog Generator",
  schedule: "0 2 * * *",
  endpoint: processAutoBlog,
});


