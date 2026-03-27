import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error } },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_FILE', message: 'No file provided' } },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TYPE', message: 'Only JPEG, PNG, GIF, WebP allowed' } },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: { code: 'TOO_LARGE', message: 'File must be under 5MB' } },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const client = createAuthClient(authResult.accessToken!);
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await client.storage
      .from('newsletter-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload image' } },
        { status: 500 }
      );
    }

    const { data: urlData } = client.storage
      .from('newsletter-images')
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      data: { url: urlData.publicUrl },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
