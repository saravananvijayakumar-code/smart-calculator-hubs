export type BlogStatus = "DRAFT" | "APPROVED" | "PUBLISHED" | "FAILED";
export type SourceKind = "calculator" | "tool" | "ai_hub" | "other";
export type BlogTone = "informative" | "friendly" | "professional" | "casual" | "technical";
export type BlogAudience = "general" | "beginners" | "professionals" | "students" | "seniors";

export interface SourceCatalog {
  id: number;
  source_url: string;
  title?: string;
  kind: SourceKind;
  eligible: boolean;
  blog_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Blog {
  id: number;
  source_url: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_desc?: string;
  content_md: string;
  html: string;
  json_ld?: any;
  keywords: string[];
  tone: BlogTone;
  audience: BlogAudience;
  kind: SourceKind;
  status: BlogStatus;
  scheduled_for?: Date;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface BlogV2Settings {
  id: number;
  default_tone: BlogTone;
  default_model: string;
  schedule_hour: number;
  schedule_timezone: string;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GenerateBlogRequest {
  source_url: string;
  tone?: BlogTone;
  audience?: BlogAudience;
  force?: boolean;
}

export interface GenerateBlogResponse {
  blog: Blog;
  created: boolean;
}

export interface DiscoverSourcesResponse {
  discovered: number;
  new_sources: number;
  updated: number;
}

export interface ListBlogsRequest {
  status?: BlogStatus;
  kind?: SourceKind;
  page?: number;
  limit?: number;
}

export interface ListBlogsResponse {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface UpdateBlogStatusRequest {
  blog_id: number;
  status: BlogStatus;
}

export interface DeleteBlogRequest {
  blog_id: number;
}

export interface UpdateSettingsRequest {
  default_tone?: BlogTone;
  default_model?: string;
  schedule_hour?: number;
  enabled?: boolean;
}

export interface SourceRegistryEntry {
  url: string;
  title: string;
  kind: SourceKind;
  region?: string;
}

export interface SourceRegistry {
  sources: SourceRegistryEntry[];
}

export interface GenerationContext {
  source_url: string;
  title: string;
  kind: SourceKind;
  tone: BlogTone;
  audience: BlogAudience;
  region?: string;
}
