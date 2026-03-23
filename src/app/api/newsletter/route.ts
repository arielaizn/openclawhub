import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/newsletter
 * List all newsletters (requires auth)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error } },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch newsletters' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/newsletter
 * Create a new newsletter (requires auth)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Title and content are required' } },
        { status: 400 }
      );
    }

    const client = createAuthClient(authResult.accessToken!);

    const { data, error } = await client
      .from('newsletters')
      .insert({ title, content, status: 'draft' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating newsletter:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_ERROR', message: 'Failed to create newsletter' } },
      { status: 500 }
    );
  }
}
