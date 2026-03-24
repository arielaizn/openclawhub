import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

/**
 * GET /api/skills
 * List approved skills with optional search/filter/pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const all = searchParams.get('all'); // admin: get all including unapproved

    const offset = (page - 1) * limit;

    let query = supabase.from('skills').select('*', { count: 'exact' });

    // Only show approved unless "all" param (admin use)
    if (!all) {
      query = query.eq('is_approved', true);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('downloads', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        skills: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch skills' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/skills
 * Submit a new skill (public - unapproved by default)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, readme, category, tags, install_command, github_url, author, screenshot_url, dependencies, version, is_approved } = body;

    if (!name || !description || !category || !install_command) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, description, category, and install command are required' } },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    const { data, error } = await supabase
      .from('skills')
      .insert({
        name,
        slug,
        description,
        readme: readme || '',
        category,
        tags: tags || '',
        author: author || 'Anonymous',
        version: version || '1.0.0',
        install_command,
        github_url: github_url || null,
        screenshot_url: screenshot_url || null,
        dependencies: dependencies || null,
        is_approved: is_approved || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error submitting skill:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SUBMIT_ERROR', message: 'Failed to submit skill' } },
      { status: 500 }
    );
  }
}
