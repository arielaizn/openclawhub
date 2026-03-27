import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import { Resend } from 'resend';
import { extractPostSlugs, renderContentToEmailHtml } from '@/lib/newsletter-renderer';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/newsletter/[id]/send
 * Send newsletter to all active subscribers
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: authResult.error } },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const newsletterId = parseInt(id, 10);
    const client = createAuthClient(authResult.accessToken!);

    // Fetch newsletter
    const { data: newsletter, error: nlError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', newsletterId)
      .single();

    if (nlError || !newsletter) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Newsletter not found' } },
        { status: 404 }
      );
    }

    if (newsletter.status === 'sent') {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_SENT', message: 'Newsletter was already sent' } },
        { status: 400 }
      );
    }

    // Fetch all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email, full_name')
      .eq('is_active', true);

    if (subError) throw subError;

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_SUBSCRIBERS', message: 'No active subscribers found' } },
        { status: 400 }
      );
    }

    // Send via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: 'RESEND_API_KEY not configured' } },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    // Fetch referenced blog posts for {{post:slug}} markers
    const slugs = extractPostSlugs(newsletter.content);
    const postsMap = new Map<string, { title: string; slug: string; cover_image: string; excerpt: string }>();

    if (slugs.length > 0) {
      const { data: posts } = await supabase
        .from('posts')
        .select('title, slug, cover_image, excerpt')
        .in('slug', slugs);

      if (posts) {
        for (const post of posts) {
          postsMap.set(post.slug, post);
        }
      }
    }

    // Convert content to email HTML (handles {{post:slug}}, ![](url), and markdown)
    const htmlContent = renderContentToEmailHtml(newsletter.content, postsMap);

    const emailHtml = `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#0a0a0a;color:#f5f5f5;padding:32px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#ef4444;font-size:28px;margin:0;">OpenClaw Hub</h1>
          <p style="color:#737373;font-size:14px;">Newsletter</p>
        </div>
        <h2 style="color:#f5f5f5;font-size:24px;border-bottom:2px solid #dc2626;padding-bottom:12px;">
          ${newsletter.title}
        </h2>
        <div style="color:#d4d4d4;line-height:1.8;font-size:16px;">
          ${htmlContent}
        </div>
        <hr style="border:none;border-top:1px solid #333;margin:32px 0;">
        <p style="color:#737373;font-size:12px;text-align:center;">
          OpenClaw Hub Newsletter | <a href="https://openclawhub.vercel.app" style="color:#ef4444;">Visit Website</a>
        </p>
      </div>
    `;

    let sentCount = 0;
    const errors: string[] = [];

    // Send to each subscriber
    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: 'OpenClaw Hub <newsletter@openclawhub.com>',
          to: subscriber.email,
          subject: newsletter.title,
          html: emailHtml,
        });
        sentCount++;
      } catch (err) {
        errors.push(`Failed to send to ${subscriber.email}`);
        console.error(`Failed to send to ${subscriber.email}:`, err);
      }
    }

    // Update newsletter status
    await client
      .from('newsletters')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipients_count: sentCount,
      })
      .eq('id', newsletterId);

    return NextResponse.json({
      success: true,
      data: {
        message: `Newsletter sent to ${sentCount}/${subscribers.length} subscribers`,
        sent_count: sentCount,
        total_subscribers: subscribers.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SEND_ERROR', message: 'Failed to send newsletter' } },
      { status: 500 }
    );
  }
}
