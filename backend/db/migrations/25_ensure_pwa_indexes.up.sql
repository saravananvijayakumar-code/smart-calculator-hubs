-- Ensure indexes exist for PWA install tracking (only if table and columns exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'pwa_installs' AND column_name = 'installed_at'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_pwa_installs_date ON pwa_installs(DATE(installed_at));
  END IF;
  
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'pwa_installs' AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_pwa_installs_user_id ON pwa_installs(user_id);
  END IF;
END $$;
