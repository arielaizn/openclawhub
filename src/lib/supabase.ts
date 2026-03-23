import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return { url, key };
}

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const { url, key } = getSupabaseConfig();
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Keep backward-compatible export as a getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

export function createAuthClient(accessToken: string): SupabaseClient {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, {
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
