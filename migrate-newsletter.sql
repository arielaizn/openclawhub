-- Newsletter System Migration
-- Run this in the Supabase SQL Editor

-- 1. Subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 2. Newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
  sent_at TIMESTAMPTZ,
  recipients_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- 4. Subscriber policies
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public read subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (true);

CREATE POLICY "Auth update subscribers"
  ON newsletter_subscribers FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete subscribers"
  ON newsletter_subscribers FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. Newsletter policies
CREATE POLICY "Auth manage newsletters"
  ON newsletters FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public read newsletters"
  ON newsletters FOR SELECT
  USING (true);
