import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import db from "../db";
import {
  GenerateBlogRequest,
  GenerateBlogResponse,
  GenerationContext,
  Blog,
} from "./types";
import log from "encore.dev/log";
import crypto from "crypto";
import { marked } from "marked";

const openaiKey = secret("OpenAIKey");

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

  const prompt = `You are an expert-level professional content writer creating an engaging, informative, and playful SEO-optimized blog post about a ${context.kind} tool.

Tool Information:
- URL: ${context.source_url}
- Tool Name: ${context.title}
- Type: ${context.kind}
${context.region ? `- Region: ${context.region}` : ""}

Write a comprehensive expert-level blog post with:
1. An engaging, catchy title (50-60 characters)
2. Meta title (50-60 characters, SEO-optimized)
3. Meta description (150-160 characters)
4. Full article content in Markdown format (5000+ words minimum)
5. 10-15 relevant keywords

IMPORTANT REQUIREMENTS:
- Target LENGTH: 5000-6000 words minimum
- TONE: Expert-level, informative, yet playful and engaging
- STYLE: Mix professional expertise with conversational, friendly language
- Add animated, fun examples and real-world scenarios
- Include emojis sparingly for visual engagement
- Use analogies and metaphors to explain complex concepts
- Add interesting facts, statistics, and industry insights
- Include practical tips, tricks, and expert hacks
- Create compelling section headers with personality

STRUCTURE (minimum):
1. Introduction (400-500 words) - Hook readers with an engaging story or question
2. What is this tool and why it matters (600-800 words)
3. Deep dive into features and capabilities (800-1000 words)
4. Step-by-step guide with examples (1000-1200 words)
5. Expert tips and best practices (600-800 words)
6. Common mistakes to avoid (400-500 words)
7. Advanced use cases and scenarios (600-800 words)
8. Future trends and insights (400-500 words)
9. Conclusion with strong CTA (200-300 words)

The tone should be ${context.tone} and targeted at ${context.audience} audience, but make it feel like a conversation with a knowledgeable friend who's also an expert.

Make it informative, playful, and thoroughly educational. Think of this as creating the definitive guide that users will bookmark and share.

Include:
- Captivating introduction with storytelling
- Detailed explanation of what the tool does
- Comprehensive feature breakdown
- Multiple real-world examples and scenarios
- Practical step-by-step tutorials
- Expert-level tips and insider knowledge
- Common pitfalls and how to avoid them
- Advanced strategies for power users
- Industry trends and future outlook
- Strong call-to-action linking back to ${context.source_url}

Format your response as JSON:
{
  "title": "...",
  "metaTitle": "...",
  "metaDesc": "...",
  "contentMd": "...",
  "keywords": ["keyword1", "keyword2", ...]
}`;

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
          content:
            "You are an expert content writer specializing in comprehensive, engaging, and SEO-optimized blog posts about web tools and calculators. You write 5000+ word articles that are both informative and entertaining, mixing expert knowledge with playful storytelling.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 16000,
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

export const generate = api(
  { method: "POST", path: "/blog-v2/generate", expose: true, auth: true },
  async (req: GenerateBlogRequest): Promise<GenerateBlogResponse> => {
    const { source_url, tone, audience, force } = req;

    log.info("Generating blog post", { source_url, tone, audience });

    const existingBlog = await db.queryRow<{ id: number }>`
      SELECT id FROM blogs_v2 WHERE source_url = ${source_url}
    `;

    if (existingBlog && !force) {
      throw APIError.alreadyExists("Blog already exists for this source URL");
    }

    const sourceRow = await db.queryRow<{
      title: string | null;
      kind: string;
    }>`
      SELECT title, kind FROM source_catalog WHERE source_url = ${source_url}
    `;

    if (!sourceRow) {
      throw APIError.notFound("Source not found in catalog");
    }

    const settings = await db.queryRow<{
      default_tone: string;
    }>`
      SELECT default_tone FROM blog_v2_settings LIMIT 1
    `;

    const context: GenerationContext = {
      source_url,
      title: sourceRow.title || source_url,
      kind: sourceRow.kind as any,
      tone: tone || (settings?.default_tone as any) || "informative",
      audience: audience || "general",
      region: source_url.includes("/australia/") || source_url.includes("/au/")
        ? "australia"
        : source_url.includes("/uk/")
        ? "uk"
        : source_url.includes("/india/")
        ? "india"
        : source_url.includes("/us/")
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
          ${source_url}, ${slug}, ${generated.title}, ${generated.metaTitle},
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
        WHERE source_url = ${source_url}
      `;

      const blog = await db.queryRow<Blog>`
        SELECT * FROM blogs_v2 WHERE id = ${blogResult!.id}
      `;

      log.info("Blog generated successfully", { blogId: blogResult!.id, slug });

      return {
        blog: blog!,
        created: !existingBlog,
      };
    } catch (err) {
      log.error("Failed to generate blog", { source_url, error: err });

      await db.exec`
        INSERT INTO blogs_v2 (
          source_url, slug, title, content_md, html, status
        ) VALUES (
          ${source_url}, ${generateHash(source_url)},
          'Failed to generate', '', '', 'FAILED'
        )
        ON CONFLICT (source_url) DO UPDATE SET status = 'FAILED'
      `;

      throw APIError.internal("Failed to generate blog content", err as Error);
    }
  }
);
