-- ==============================================
-- Migration: Add English translation fields
-- Run this in Supabase SQL Editor (one-time setup)
-- Dashboard: https://supabase.com/dashboard/project/whmglvksehlgmgtwnbzi/sql/new
-- ==============================================

-- Add English columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt_en TEXT;

-- Update the webhook RPC function to accept English fields
CREATE OR REPLACE FUNCTION create_webhook_post(
  p_title TEXT,
  p_slug TEXT,
  p_content TEXT,
  p_excerpt TEXT,
  p_cover_image TEXT DEFAULT '/default-cover.jpg',
  p_category TEXT DEFAULT 'guides',
  p_tags TEXT DEFAULT '',
  p_reading_time INT DEFAULT 5,
  p_voice_url TEXT DEFAULT NULL,
  p_is_published INT DEFAULT 1,
  p_title_en TEXT DEFAULT NULL,
  p_content_en TEXT DEFAULT NULL,
  p_excerpt_en TEXT DEFAULT NULL
)
RETURNS SETOF posts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO posts (title, slug, content, excerpt, cover_image, category, tags, reading_time, voice_url, is_published, author, author_avatar, title_en, content_en, excerpt_en)
  VALUES (p_title, p_slug, p_content, p_excerpt, p_cover_image, p_category, p_tags, p_reading_time, p_voice_url, p_is_published, 'OpenClaw Bot', '/bot-avatar.png', p_title_en, p_content_en, p_excerpt_en)
  RETURNING *;
END;
$$;
