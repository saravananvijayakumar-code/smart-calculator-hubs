CREATE TABLE IF NOT EXISTS source_catalog (
  id SERIAL PRIMARY KEY,
  source_url VARCHAR(500) UNIQUE NOT NULL,
  title VARCHAR(255),
  kind VARCHAR(50) DEFAULT 'other',
  eligible BOOLEAN DEFAULT true,
  blog_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs_v2 (
  id SERIAL PRIMARY KEY,
  source_url VARCHAR(500) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255),
  meta_desc TEXT,
  content_md TEXT NOT NULL,
  html TEXT NOT NULL,
  json_ld JSONB,
  keywords TEXT[] DEFAULT '{}',
  tone VARCHAR(50) DEFAULT 'informative',
  audience VARCHAR(50) DEFAULT 'general',
  kind VARCHAR(50) DEFAULT 'other',
  status VARCHAR(20) DEFAULT 'DRAFT',
  scheduled_for TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_source_catalog_url ON source_catalog(source_url);
CREATE INDEX IF NOT EXISTS idx_source_catalog_kind ON source_catalog(kind);
CREATE INDEX IF NOT EXISTS idx_source_catalog_eligible ON source_catalog(eligible);
CREATE INDEX IF NOT EXISTS idx_source_catalog_blog_id ON source_catalog(blog_id);

CREATE INDEX IF NOT EXISTS idx_blogs_v2_source_url ON blogs_v2(source_url);
CREATE INDEX IF NOT EXISTS idx_blogs_v2_slug ON blogs_v2(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_v2_status ON blogs_v2(status);
CREATE INDEX IF NOT EXISTS idx_blogs_v2_published_at ON blogs_v2(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_v2_kind ON blogs_v2(kind);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_source_catalog_blog' 
    AND table_name = 'source_catalog'
  ) THEN
    ALTER TABLE source_catalog ADD CONSTRAINT fk_source_catalog_blog
      FOREIGN KEY (blog_id) REFERENCES blogs_v2(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS blog_v2_settings (
  id SERIAL PRIMARY KEY,
  default_tone VARCHAR(50) DEFAULT 'informative',
  default_model VARCHAR(50) DEFAULT 'gpt-4o-mini',
  schedule_hour INTEGER DEFAULT 9,
  schedule_timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blog_v2_settings (default_tone, default_model, schedule_hour, schedule_timezone, enabled)
VALUES ('informative', 'gpt-4o-mini', 9, 'Australia/Sydney', true)
ON CONFLICT DO NOTHING;
