import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/skills/[id]
 * Get a single skill by ID or slug
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    let query = supabase.from('skills').select('*');

    if (/^\d+$/.test(id)) {
      query = query.eq('id', parseInt(id, 10));
    } else {
      query = query.eq('slug', id);
    }

    const { data: skill, error } = await query.single();

    if (error || !skill) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Skill not found' } },
        { status: 404 }
      );
    }

    // Increment download count
    await supabase.rpc('increment_skill_downloads', { skill_id: skill.id });

    return NextResponse.json({
      success: true,
      data: { ...skill, downloads: skill.downloads + 1 },
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch skill' } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/skills/[id]
 * Update a skill (requires auth)
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error } },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const client = createAuthClient(authResult.accessToken!);

    const allowedFields = ['name', 'description', 'readme', 'category', 'tags', 'author', 'version', 'install_command', 'github_url', 'screenshot_url', 'dependencies', 'is_approved'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const { data, error } = await client
      .from('skills')
      .update(updates)
      .eq('id', parseInt(id, 10))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_ERROR', message: 'Failed to update skill' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/skills/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error } },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const client = createAuthClient(authResult.accessToken!);

    const { error } = await client
      .from('skills')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw error;

    return NextResponse.json({ success: true, data: { message: 'Skill deleted' } });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_ERROR', message: 'Failed to delete skill' } },
      { status: 500 }
    );
  }
}
