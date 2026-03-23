import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/newsletter/subscribe
 * Public endpoint - subscribe to the newsletter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name } = body;

    if (!email || !full_name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and full name are required' } },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid email format' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim(), full_name: full_name.trim() })
      .select()
      .single();

    if (error) {
      // Duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: { code: 'DUPLICATE', message: 'כתובת המייל הזו כבר רשומה' } },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SUBSCRIBE_ERROR', message: 'Failed to subscribe' } },
      { status: 500 }
    );
  }
}
