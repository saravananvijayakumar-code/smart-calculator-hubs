CREATE TABLE IF NOT EXISTS auto_blog_settings (
  id SERIAL PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  frequency VARCHAR(20) DEFAULT 'weekly',
  topics TEXT[] DEFAULT '{}',
  auto_publish BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auto_blog_queue (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  error TEXT,
  blog_post_id INTEGER REFERENCES blog_posts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auto_blog_queue_status ON auto_blog_queue(status);
CREATE INDEX IF NOT EXISTS idx_auto_blog_queue_created_at ON auto_blog_queue(created_at DESC);

INSERT INTO auto_blog_settings (enabled, frequency, topics, auto_publish)
VALUES (false, 'weekly', ARRAY['Health & Fitness', 'Personal Finance', 'Technology'], false)
ON CONFLICT DO NOTHING;
