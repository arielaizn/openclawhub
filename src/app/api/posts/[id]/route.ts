import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient, Post } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/posts/[id]
 * Get a single post by ID or slug, and increment view count
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    let query = supabase.from('posts').select('*');

    // Check if id is numeric (post ID) or string (slug)
    if (/^\d+$/.test(id)) {
      query = query.eq('id', parseInt(id, 10));
    } else {
      query = query.eq('slug', id);
    }

    const { data: post, error } = await query.single();

    if (error || !post) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Increment view count using RPC
    await supabase.rpc('increment_views', { row_id: post.id });

    // Return post with incremented view count
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        views: post.views + 1,
      },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch post' } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * Update a post (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid post ID' } },
        { status: 400 }
      );
    }

    const postId = parseInt(id, 10);

    // Create authenticated client
    const client = createAuthClient(authResult.accessToken!);

    // Check if post exists
    const { data: existingPost, error: fetchError } = await client
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Build update object with allowed fields
    const allowedFields = ['title', 'content', 'excerpt', 'cover_image', 'category', 'tags', 'reading_time', 'voice_url', 'is_published'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'No valid fields provided' } },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    // Update the post
    const { data: updatedPost, error: updateError } = await client
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_ERROR', message: 'Failed to update post' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid post ID' } },
        { status: 400 }
      );
    }

    const postId = parseInt(id, 10);

    // Create authenticated client
    const client = createAuthClient(authResult.accessToken!);

    // Fetch the post before deletion
    const { data: existingPost, error: fetchError } = await client
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Delete the post
    const { error: deleteError } = await client
      .from('posts')
      .delete()
      .eq('id', postId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Post deleted successfully',
        deletedPost: existingPost,
      },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_ERROR', message: 'Failed to delete post' } },
      { status: 500 }
    );
  }
}
