CREATE TABLE IF NOT EXISTS pwa_installs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  platform TEXT,
  installed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pwa_install_stats (
  date DATE PRIMARY KEY,
  installs INT DEFAULT 0
);
