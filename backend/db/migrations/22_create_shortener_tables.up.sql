CREATE TABLE IF NOT EXISTS short_urls (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  custom_alias BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  creator_ip VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_short_urls_short_code ON short_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_short_urls_created_at ON short_urls(created_at);

CREATE TABLE IF NOT EXISTS url_clicks (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(50) NOT NULL,
  clicked_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100),
  user_agent TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_url_clicks_short_code ON url_clicks(short_code);
CREATE INDEX IF NOT EXISTS idx_url_clicks_clicked_at ON url_clicks(clicked_at);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'url_clicks_short_code_fkey' 
    AND table_name = 'url_clicks'
  ) THEN
    ALTER TABLE url_clicks ADD CONSTRAINT url_clicks_short_code_fkey
      FOREIGN KEY (short_code) REFERENCES short_urls(short_code) ON DELETE CASCADE;
  END IF;
END $$;
