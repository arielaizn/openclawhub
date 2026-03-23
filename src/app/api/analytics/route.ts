import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient, Analytics } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

/**
 * POST /api/analytics
 * Record an analytics event (public, no authentication required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.post_id || !body.event_type) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
            details: ['post_id and event_type are required'],
          },
        },
        { status: 400 }
      );
    }

    const {
      post_id,
      event_type,
      scroll_depth = null,
      time_spent = null,
      user_agent = null,
    } = body;

    // Verify post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Post not found',
          },
        },
        { status: 404 }
      );
    }

    // Insert analytics event
    const { data: analytics, error } = await supabase
      .from('analytics')
      .insert({
        post_id,
        event_type,
        scroll_depth,
        time_spent,
        user_agent,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data: analytics,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error recording analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ANALYTICS_ERROR',
          message: 'Failed to record analytics event',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics
 * Get analytics data (requires authentication)
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

    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');

    // Create authenticated client
    const client = createAuthClient(authResult.accessToken!);

    // Build query based on filters
    let query = client.from('analytics').select('*');

    if (post_id) {
      query = query.eq('post_id', parseInt(post_id, 10));
    }

    query = query.order('created_at', { ascending: false });

    // Get analytics records
    const { data: analytics, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate aggregated stats
    const stats = {
      total: analytics?.length || 0,
      byEventType: {} as Record<string, number>,
      avgScrollDepth: 0,
      avgTimeSpent: 0,
    };

    if (analytics && analytics.length > 0) {
      // Count by event type
      analytics.forEach(record => {
        stats.byEventType[record.event_type] = (stats.byEventType[record.event_type] || 0) + 1;
      });

      // Calculate average scroll depth
      const scrollDepths = analytics
        .filter(a => a.scroll_depth !== null)
        .map(a => a.scroll_depth as number);
      if (scrollDepths.length > 0) {
        stats.avgScrollDepth = scrollDepths.reduce((sum, val) => sum + val, 0) / scrollDepths.length;
      }

      // Calculate average time spent
      const timeSpents = analytics
        .filter(a => a.time_spent !== null)
        .map(a => a.time_spent as number);
      if (timeSpents.length > 0) {
        stats.avgTimeSpent = timeSpents.reduce((sum, val) => sum + val, 0) / timeSpents.length;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        stats,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch analytics data',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
