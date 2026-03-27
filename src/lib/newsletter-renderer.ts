interface PostData {
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
}

const SITE_URL = 'https://openclawhub.vercel.app';

/**
 * Extract all post slugs referenced via {{post:slug}} in the content.
 */
export function extractPostSlugs(content: string): string[] {
  const slugs: string[] = [];
  const regex = /\{\{post:([a-z0-9-]+)\}\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return [...new Set(slugs)];
}

/**
 * Build a rich HTML card for a blog post embed in the email.
 */
function buildPostCardHtml(post: PostData): string {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  return `<div style="border:1px solid #333;border-radius:12px;overflow:hidden;margin:16px 0;background:#111;">
${post.cover_image ? `<a href="${postUrl}" style="display:block;"><img src="${post.cover_image}" alt="${post.title}" style="width:100%;max-height:220px;object-fit:cover;display:block;" /></a>` : ''}
<div style="padding:16px;">
<a href="${postUrl}" style="color:#ef4444;font-size:18px;font-weight:bold;text-decoration:none;">${post.title}</a>
<p style="color:#999;font-size:14px;margin-top:8px;line-height:1.5;">${post.excerpt || ''}</p>
<a href="${postUrl}" style="display:inline-block;margin-top:12px;padding:8px 20px;background:#dc2626;color:white;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">קרא עוד</a>
</div>
</div>`;
}

/**
 * Apply basic markdown conversions (headings, bold, italic, paragraphs).
 */
function markdownToHtml(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 style="color:#ef4444;font-size:20px;margin:16px 0 8px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#ef4444;font-size:24px;margin:20px 0 10px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#ef4444;font-size:28px;margin:24px 0 12px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p style="color:#d4d4d4;line-height:1.8;">')
    .replace(/\n/g, '<br>');
}

/**
 * Full pipeline: convert newsletter content to email-ready HTML.
 * Uses placeholder technique to prevent markdown parser from corrupting HTML blocks.
 */
export function renderContentToEmailHtml(
  content: string,
  postsMap: Map<string, PostData>
): string {
  const blocks: string[] = [];
  let idx = 0;

  // Replace {{post:slug}} with placeholders
  let processed = content.replace(/\{\{post:([a-z0-9-]+)\}\}/g, (_match, slug) => {
    const post = postsMap.get(slug);
    if (!post) return _match;
    const placeholder = `__BLOCK_${idx}__`;
    blocks[idx] = buildPostCardHtml(post);
    idx++;
    return `\n${placeholder}\n`;
  });

  // Replace ![alt](url) with placeholders
  processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const placeholder = `__BLOCK_${idx}__`;
    blocks[idx] = `<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;display:block;" />`;
    idx++;
    return `\n${placeholder}\n`;
  });

  // Apply markdown conversion on the remaining text
  processed = markdownToHtml(processed);

  // Wrap in paragraph
  processed = `<p style="color:#d4d4d4;line-height:1.8;">${processed}</p>`;

  // Restore HTML blocks
  for (let i = 0; i < blocks.length; i++) {
    processed = processed.replace(`__BLOCK_${i}__`, `</p>${blocks[i]}<p style="color:#d4d4d4;line-height:1.8;">`);
  }

  // Clean up empty paragraphs
  processed = processed.replace(/<p style="color:#d4d4d4;line-height:1\.8;"><\/p>/g, '');

  return processed;
}
