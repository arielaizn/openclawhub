import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient, Post } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

interface ViewsByDay {
  date: string;
  views: number;
}

interface CategoryDistribution {
  category: string;
  count: number;
}

interface TopPost {
  id: number;
  title: string;
  slug: string;
  views: number;
  category: string;
}

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalAnalyticsEvents: number;
  topPosts: TopPost[];
  recentPosts: Post[];
  viewsByDay: ViewsByDay[];
  categoryDistribution: CategoryDistribution[];
  avgScrollDepth: number;
  avgTimeSpent: number;
}

/**
 * GET /api/admin/stats
 * Get dashboard statistics (requires authentication)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: authResult.error || 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Create authenticated client
    const client = createAuthClient(authResult.accessToken!);

    // Run all queries in parallel
    const [
      totalPostsResult,
      publishedPostsResult,
      totalViewsResult,
      totalAnalyticsResult,
      topPostsResult,
      recentPostsResult,
      viewsByDayResult,
      categoryDistResult,
      avgScrollDepthResult,
      avgTimeSpentResult,
    ] = await Promise.all([
      // 1. Total posts count
      client.from('posts').select('*', { count: 'exact', head: true }),

      // 2. Published posts count
      client.from('posts').select('*', { count: 'exact', head: true }).eq('is_published', 1),

      // 3. Total views (sum of all post views)
      client.from('posts').select('views'),

      // 4. Total analytics events
      client.from('analytics').select('*', { count: 'exact', head: true }),

      // 5. Top 5 posts by views
      client
        .from('posts')
        .select('id, title, slug, views, category')
        .order('views', { ascending: false })
        .limit(5),

      // 6. Recent 5 posts
      client
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),

      // 7. Views by day for the last 30 days
      client.rpc('get_views_by_day'),

      // 8. Category distribution
      client.from('posts').select('category'),

      // 9. Average scroll depth
      client.from('analytics').select('scroll_depth').not('scroll_depth', 'is', null),

      // 10. Average time spent
      client.from('analytics').select('time_spent').not('time_spent', 'is', null),
    ]);

    // Process results
    const totalPosts = totalPostsResult.count || 0;
    const publishedPosts = publishedPostsResult.count || 0;

    // Calculate total views
    const totalViews = totalViewsResult.data
      ? totalViewsResult.data.reduce((sum, post) => sum + (post.views || 0), 0)
      : 0;

    const totalAnalyticsEvents = totalAnalyticsResult.count || 0;
    const topPosts = (topPostsResult.data || []) as TopPost[];
    const recentPosts = (recentPostsResult.data || []) as Post[];
    const viewsByDay = (viewsByDayResult.data || []) as ViewsByDay[];

    // Calculate category distribution
    const categoryMap: Record<string, number> = {};
    if (categoryDistResult.data) {
      categoryDistResult.data.forEach((post: { category: string }) => {
        categoryMap[post.category] = (categoryMap[post.category] || 0) + 1;
      });
    }
    const categoryDistribution: CategoryDistribution[] = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate average scroll depth
    let avgScrollDepth = 0;
    if (avgScrollDepthResult.data && avgScrollDepthResult.data.length > 0) {
      const scrollDepths = avgScrollDepthResult.data.map((a: { scroll_depth: number }) => a.scroll_depth);
      avgScrollDepth = Math.round((scrollDepths.reduce((sum, val) => sum + val, 0) / scrollDepths.length) * 100) / 100;
    }

    // Calculate average time spent
    let avgTimeSpent = 0;
    if (avgTimeSpentResult.data && avgTimeSpentResult.data.length > 0) {
      const timeSpents = avgTimeSpentResult.data.map((a: { time_spent: number }) => a.time_spent);
      avgTimeSpent = Math.round((timeSpents.reduce((sum, val) => sum + val, 0) / timeSpents.length) * 100) / 100;
    }

    const stats: DashboardStats = {
      totalPosts,
      publishedPosts,
      totalViews,
      totalAnalyticsEvents,
      topPosts,
      recentPosts,
      viewsByDay,
      categoryDistribution,
      avgScrollDepth,
      avgTimeSpent,
    };

    return NextResponse.json({
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: 'Failed to fetch admin statistics',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
