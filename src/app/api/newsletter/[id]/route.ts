import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/newsletter/[id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Newsletter not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch newsletter' } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/newsletter/[id]
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

    const { data, error } = await client
      .from('newsletters')
      .update({ title: body.title, content: body.content })
      .eq('id', parseInt(id, 10))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating newsletter:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_ERROR', message: 'Failed to update newsletter' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/newsletter/[id]
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
      .from('newsletters')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw error;

    return NextResponse.json({ success: true, data: { message: 'Newsletter deleted' } });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_ERROR', message: 'Failed to delete newsletter' } },
      { status: 500 }
    );
  }
}
