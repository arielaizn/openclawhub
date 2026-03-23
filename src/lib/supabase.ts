import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function createAuthClient(accessToken: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author: string;
  author_avatar: string;
  category: string;
  tags: string;
  reading_time: number;
  voice_url: string | null;
  is_published: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: number;
  post_id: number;
  event_type: string;
  scroll_depth: number | null;
  time_spent: number | null;
  user_agent: string | null;
  created_at: string;
}
