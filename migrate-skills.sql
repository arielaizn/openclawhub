-- Skills Library Migration
-- Run this in the Supabase SQL Editor

-- 1. Skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  readme TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  tags TEXT DEFAULT '',
  author TEXT DEFAULT 'Anonymous',
  version TEXT DEFAULT '1.0.0',
  install_command TEXT NOT NULL,
  github_url TEXT,
  screenshot_url TEXT,
  dependencies TEXT,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Public read approved skills"
  ON skills FOR SELECT
  USING (is_approved = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Anyone can submit skills"
  ON skills FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth update skills"
  ON skills FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete skills"
  ON skills FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. Grant permissions
GRANT SELECT, INSERT ON skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON skills TO authenticated;
GRANT USAGE ON SEQUENCE skills_id_seq TO anon;
GRANT USAGE ON SEQUENCE skills_id_seq TO authenticated;

-- 5. Download counter RPC
CREATE OR REPLACE FUNCTION increment_skill_downloads(skill_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE skills SET downloads = downloads + 1 WHERE id = skill_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
