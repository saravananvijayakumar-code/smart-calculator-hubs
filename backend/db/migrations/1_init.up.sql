-- Initialize database schema
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  image_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  preferences JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  meta_description TEXT,
  meta_keywords TEXT,
  social_title TEXT,
  social_description TEXT,
  cover_image_url TEXT,
  tags JSONB,
  view_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS calculator_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  calculator_type TEXT NOT NULL,
  calculator_name TEXT NOT NULL,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  notes TEXT,
  tags JSONB,
  favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_analysis_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  calculator_name TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  analysis_result JSONB NOT NULL,
  model_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pageviews (
  id BIGSERIAL PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  country TEXT,
  city TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pwa_stats (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_blog_calculators (
  id BIGSERIAL PRIMARY KEY,
  calculator_path TEXT UNIQUE NOT NULL,
  calculator_name TEXT NOT NULL,
  calculator_type TEXT NOT NULL,
  description TEXT,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS auto_blog_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS auto_blog_queue (
  id BIGSERIAL PRIMARY KEY,
  calculator_id BIGINT REFERENCES auto_blog_calculators(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_blog_history (
  id BIGSERIAL PRIMARY KEY,
  calculator_id BIGINT REFERENCES auto_blog_calculators(id) ON DELETE CASCADE,
  blog_post_id BIGINT REFERENCES blog_posts(id) ON DELETE SET NULL,
  queue_item_id BIGINT REFERENCES auto_blog_queue(id) ON DELETE SET NULL,
  generation_status TEXT NOT NULL,
  word_count INTEGER,
  prompt_used TEXT,
  model_used TEXT,
  generation_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default auto blog settings
INSERT INTO auto_blog_settings (setting_key, setting_value)
VALUES
  ('enabled', '"false"'),
  ('generation_prompt', '"Generate a comprehensive, SEO-optimized blog post about this calculator."'),
  ('min_word_count', '500'),
  ('max_word_count', '1500'),
  ('include_examples', 'true'),
  ('include_faq', 'true'),
  ('auto_publish', 'false')
ON CONFLICT (setting_key) DO NOTHING;
