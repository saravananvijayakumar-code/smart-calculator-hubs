import { api } from "encore.dev/api";
import db from "../db";
import log from "encore.dev/log";
import { secret } from "encore.dev/config";
import crypto from "crypto";
import { marked } from "marked";

const openaiKey = secret("OpenAIKey");

interface SourceInfo {
  url: string;
  title: string;
  kind: string;
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

export const manualSyncSources = api(
  { expose: true, method: "GET", path: "/blog-v2/manual-sync", auth: false },
  async (): Promise<{ synced: number; sources: SourceInfo[] }> => {
    log.info("Manual sync triggered");
    
    const sources = await discoverAllSources();
    
    log.info("Syncing source catalog", { count: sources.length });

    for (const source of sources) {
      await db.exec`
        INSERT INTO source_catalog (source_url, title, kind, eligible)
        VALUES (${source.url}, ${source.title}, ${source.kind}, true)
        ON CONFLICT (source_url) DO UPDATE SET
          title = EXCLUDED.title,
          kind = EXCLUDED.kind,
          updated_at = NOW()
      `;
    }

    log.info("Source catalog synced successfully");
    
    return { synced: sources.length, sources };
  }
);

export const manualGenerateBlog = api(
  { expose: true, method: "POST", path: "/blog-v2/manual-generate", auth: false },
  async (): Promise<{ success: boolean; message: string; blogId?: number; slug?: string }> => {
    log.info("Manual blog generation triggered");

    const settings = await db.queryRow<{ enabled: boolean; default_tone: string }>`
      SELECT enabled, default_tone FROM blog_v2_settings LIMIT 1
    `;

    const oldestSource = await db.queryRow<{
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

    if (!oldestSource) {
      log.info("No unblogged sources available");
      return {
        success: false,
        message: "No unblogged sources available",
      };
    }

    try {
      log.info("Generating blog", { source: oldestSource });

      const context = {
        source_url: oldestSource.source_url,
        title: oldestSource.title || oldestSource.source_url,
        kind: oldestSource.kind,
        tone: settings?.default_tone || "informative",
        audience: "general",
        region: oldestSource.source_url.includes("/australia/") || oldestSource.source_url.includes("/au/")
          ? "australia"
          : oldestSource.source_url.includes("/uk/")
          ? "uk"
          : oldestSource.source_url.includes("/india/")
          ? "india"
          : oldestSource.source_url.includes("/us/")
          ? "us"
          : undefined,
      };

      const prompt = `You are an expert content writer creating an SEO-optimized blog about: ${context.title} (${context.kind})

Write a comprehensive 5000+ word blog post with:
- Engaging title (50-60 chars)
- Meta title (50-60 chars)
- Meta description (150-160 chars)
- Full content in Markdown (5000+ words)
- 10-15 keywords

Use ${context.tone} tone for ${context.audience} audience.
${context.region ? `Focus on ${context.region} context.` : ''}

Link to: ${context.source_url}

Return JSON:
{
  "title": "...",
  "metaTitle": "...",
  "metaDesc": "...",
  "contentMd": "...",
  "keywords": ["..."]
}`;

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
            { role: "system", content: "You are an expert SEO content writer." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 16000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI error: ${response.status} - ${error}`);
      }

      const data: any = await response.json();
      const generated = JSON.parse(data.choices[0].message.content);

      const slug = generated.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 100);

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
          ${oldestSource.source_url}, ${slug}, ${generated.title}, ${generated.metaTitle},
          ${generated.metaDesc}, ${generated.contentMd}, ${html},
          ${JSON.stringify(jsonLd)}, ${generated.keywords}, ${context.tone},
          ${context.audience}, ${context.kind}, 'PUBLISHED', ${publishedAt}
        )
        RETURNING id
      `;

      await db.exec`
        UPDATE source_catalog
        SET blog_id = ${blogResult!.id}, updated_at = NOW()
        WHERE source_url = ${oldestSource.source_url}
      `;

      log.info("Blog generated", { blogId: blogResult!.id, slug });

      return {
        success: true,
        message: "Blog generated successfully",
        blogId: blogResult!.id,
        slug,
      };
    } catch (err) {
      log.error("Failed to generate blog", { error: err });
      return {
        success: false,
        message: `Failed: ${err}`,
      };
    }
  }
);
