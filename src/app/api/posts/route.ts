import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient, Post } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

/**
 * Generate a URL-safe slug from a title
 */
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * GET /api/posts
 * List all published posts with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Check if authenticated to show drafts
    const authHeader = request.headers.get('Authorization');
    const isAuthenticated = authHeader && authHeader.startsWith('Bearer ');

    // Build query
    let query = supabase.from('posts').select('*', { count: 'exact' });

    // Filter by published status unless authenticated
    if (!isAuthenticated) {
      query = query.eq('is_published', 1);
    }

    // Filter by category
    if (category) {
      query = query.eq('category', category);
    }

    // Filter by search term
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        total,
        page,
        totalPages,
      },
      meta: {
        page,
        total,
        limit,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch posts',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new post (requires authentication)
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'content', 'excerpt', 'category', 'tags'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
            details: missingFields.map(field => `${field} is required`),
          },
        },
        { status: 400 }
      );
    }

    const {
      title,
      content,
      excerpt,
      cover_image = '/default-cover.jpg',
      category,
      tags,
      reading_time = Math.ceil(content.split(/\s+/).length / 200), // ~200 words per minute
      voice_url = null,
      is_published = 0,
    } = body;

    // Generate slug from title
    const slug = generateSlug(title);

    // Create authenticated client
    const client = createAuthClient(authResult.accessToken!);

    // Insert the post
    const { data: post, error } = await client
      .from('posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        cover_image,
        category,
        tags,
        reading_time,
        voice_url,
        is_published,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'DUPLICATE_ERROR',
              message: 'A post with this slug already exists',
            },
          },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create post',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
