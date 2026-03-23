import { NextRequest, NextResponse } from 'next/server';
import { supabase, Post } from '@/lib/supabase';

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
 * POST /api/webhook
 * WhatsApp bot webhook to create blog posts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate API key
    const expectedApiKey = process.env.WEBHOOK_API_KEY || 'openclaw-webhook-key';
    const providedApiKey = body.api_key;

    if (!providedApiKey || providedApiKey !== expectedApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_API_KEY',
            message: 'Invalid or missing API key',
          },
        },
        { status: 401 }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'content', 'category'];
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
      excerpt = content.substring(0, 200) + '...',
      category,
      tags = '',
      cover_image = '/default-cover.jpg',
      reading_time = Math.ceil(content.split(/\s+/).length / 200), // ~200 words per minute
      voice_url = null,
      is_published = 1, // Webhook posts are published by default
    } = body;

    // Generate slug from title
    const slug = generateSlug(title);

    // Insert the post using RPC function
    const { data, error } = await supabase.rpc('create_webhook_post', {
      p_title: title,
      p_slug: slug,
      p_content: content,
      p_excerpt: excerpt,
      p_cover_image: cover_image,
      p_category: category,
      p_tags: tags,
      p_reading_time: reading_time,
      p_voice_url: voice_url,
      p_is_published: is_published,
    });

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

    // The RPC returns an array, take the first element
    const post = Array.isArray(data) ? data[0] : data;

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Blog post created successfully via webhook',
          post,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'WEBHOOK_ERROR',
          message: 'Failed to process webhook',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
