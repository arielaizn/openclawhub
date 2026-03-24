import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/skills/[id]/rate
 * Rate a skill (1-5)
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Rating must be between 1 and 5' } },
        { status: 400 }
      );
    }

    const skillId = parseInt(id, 10);

    // Fetch current skill
    const { data: skill, error: fetchError } = await supabase
      .from('skills')
      .select('rating, rating_count')
      .eq('id', skillId)
      .single();

    if (fetchError || !skill) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Skill not found' } },
        { status: 404 }
      );
    }

    // Calculate new average
    const currentTotal = Number(skill.rating) * skill.rating_count;
    const newCount = skill.rating_count + 1;
    const newRating = (currentTotal + rating) / newCount;

    const { data, error } = await supabase
      .from('skills')
      .update({ rating: Math.round(newRating * 100) / 100, rating_count: newCount })
      .eq('id', skillId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error rating skill:', error);
    return NextResponse.json(
      { success: false, error: { code: 'RATE_ERROR', message: 'Failed to rate skill' } },
      { status: 500 }
    );
  }
}
