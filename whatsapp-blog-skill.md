# WhatsApp Bot Skill - Auto Blog Post Creator

## Skill Name
`openclaw-blog-poster`

## Description
Automatically creates and publishes blog posts on the OpenClaw Hub website via WhatsApp messages. The bot receives a message with post details and publishes it to the blog using the webhook API.

## Trigger
When a WhatsApp message matches the pattern:
- `/blog` or `/post` command prefix
- Or a message containing structured blog content

## Message Format

### Quick Post (Single Message)
```
/blog
title: כותרת הפוסט
category: guides
tags: tag1, tag2, tag3
---
תוכן הפוסט כאן...
ניתן לכתוב כמה שורות שרוצים.
```

### Full Post (With All Fields)
```
/blog
title: כותרת הפוסט
category: guides
tags: tag1, tag2, tag3
cover_image: https://example.com/image.jpg
voice_url: https://elevenlabs.io/audio/...
published: true
---
תוכן הפוסט כאן...
ניתן לכתוב כמה שורות שרוצים.
התוכן תומך ב-Markdown.

## כותרת משנה
- נקודה 1
- נקודה 2
```

### Draft Post
```
/blog draft
title: טיוטה לפוסט
category: news
tags: draft
---
תוכן שעדיין בעבודה...
```

## Available Categories
| Value | Label |
|-------|-------|
| `guides` | מדריכים (Guides) |
| `news` | חדשות (News) |
| `tips` | טיפים (Tips) |
| `updates` | עדכונים (Updates) |
| `technical` | טכני (Technical) |

## Webhook API Details

### Endpoint
```
POST https://your-domain.vercel.app/api/webhook
```

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "api_key": "openclaw-webhook-key",
  "title": "כותרת הפוסט",
  "content": "תוכן הפוסט בפורמט Markdown",
  "excerpt": "תקציר קצר (אופציונלי - נוצר אוטומטית מ-200 התווים הראשונים)",
  "category": "guides",
  "tags": "tag1, tag2, tag3",
  "cover_image": "https://example.com/image.jpg",
  "voice_url": "https://elevenlabs.io/audio/...",
  "is_published": 1
}
```

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `api_key` | string | Authentication key for webhook access |
| `title` | string | Post title (Hebrew supported) |
| `content` | string | Full post content (Markdown supported) |
| `category` | string | One of: guides, news, tips, updates, technical |

### Optional Fields
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `excerpt` | string | First 200 chars of content | Short summary |
| `tags` | string | `""` | Comma-separated tags |
| `cover_image` | string | `/default-cover.jpg` | Cover image URL |
| `voice_url` | string | `null` | ElevenLabs voice narration URL |
| `is_published` | number | `1` | 1 = published, 0 = draft |

### Success Response
```json
{
  "success": true,
  "data": {
    "message": "Blog post created successfully via webhook",
    "post": {
      "id": 1,
      "title": "...",
      "slug": "...",
      "created_at": "..."
    }
  }
}
```

### Error Responses
- `401` - Invalid or missing API key
- `400` - Missing required fields (title, content, category)
- `409` - Duplicate slug
- `500` - Server error

## Bot Implementation Logic

### Message Parser (Pseudocode)
```python
def parse_blog_command(message):
    lines = message.strip().split('\n')

    # Check if it starts with /blog
    if not lines[0].startswith('/blog'):
        return None

    # Check for draft flag
    is_draft = 'draft' in lines[0].lower()

    metadata = {}
    content_lines = []
    in_content = False

    for line in lines[1:]:
        if line.strip() == '---':
            in_content = True
            continue

        if not in_content:
            # Parse metadata (key: value)
            if ':' in line:
                key, value = line.split(':', 1)
                metadata[key.strip()] = value.strip()
        else:
            content_lines.append(line)

    return {
        'title': metadata.get('title', ''),
        'category': metadata.get('category', 'guides'),
        'tags': metadata.get('tags', ''),
        'cover_image': metadata.get('cover_image', ''),
        'voice_url': metadata.get('voice_url', ''),
        'content': '\n'.join(content_lines),
        'is_published': 0 if is_draft else 1,
    }
```

### Sending to Webhook (Pseudocode)
```python
import requests

def publish_blog_post(post_data):
    payload = {
        'api_key': 'openclaw-webhook-key',
        'title': post_data['title'],
        'content': post_data['content'],
        'category': post_data['category'],
        'tags': post_data['tags'],
        'cover_image': post_data.get('cover_image', '/default-cover.jpg'),
        'voice_url': post_data.get('voice_url'),
        'is_published': post_data.get('is_published', 1),
    }

    response = requests.post(
        'https://your-domain.vercel.app/api/webhook',
        json=payload
    )

    return response.json()
```

### Bot Response Messages

**On Success:**
```
Blog post published successfully!
Title: {title}
Category: {category}
URL: https://your-domain.vercel.app/blog/{slug}
```

**On Draft:**
```
Blog post saved as draft!
Title: {title}
You can publish it from the admin panel.
```

**On Error:**
```
Failed to publish blog post.
Error: {error_message}
Please check the format and try again.
```

## Example Usage

### Example 1: Quick Tech Post
```
/blog
title: 5 טיפים לשימוש ב-Claude Code
category: tips
tags: claude, ai, tips
---
הנה 5 טיפים שיעזרו לכם להפיק את המקסימום מ-Claude Code:

1. **השתמשו בקונטקסט** - תנו ל-Claude לקרוא את הקבצים הרלוונטיים לפני שאתם מבקשים שינויים
2. **בקשות ספציפיות** - ככל שתהיו יותר ספציפיים, התוצאות יהיו טובות יותר
3. **בדקו את הקוד** - תמיד בדקו את הקוד שנוצר לפני שאתם מאשרים
4. **עבודה איטרטיבית** - עדיף לעבוד בצעדים קטנים מאשר לבקש שינויים גדולים בבת אחת
5. **למדו מהתוצאות** - שימו לב לדפוסים שעובדים טוב ושחזרו עליהם
```

### Example 2: News Post with Cover Image
```
/blog
title: OpenClaw Hub 2.0 - השקה רשמית!
category: news
tags: openclaw, release, update
cover_image: https://images.unsplash.com/photo-launch.jpg
---
אנחנו שמחים להכריז על השקת OpenClaw Hub 2.0!

## מה חדש?
- ממשק ניהול מחודש
- תמיכה בסקירה קולית
- בוט WhatsApp לפרסום אוטומטי
- אנליטיקס מתקדמים

## איך להתחיל?
בקרו באתר שלנו והירשמו עוד היום!
```

### Example 3: Draft for Review
```
/blog draft
title: מדריך התקנת OpenClaw
category: guides
tags: installation, setup
---
מדריך זה עדיין בעבודה...
```

## Security Notes
- The `api_key` must match the `WEBHOOK_API_KEY` environment variable on the server
- Change the default key (`openclaw-webhook-key`) to a strong, unique key in production
- The webhook endpoint does not require user authentication - it uses API key auth
- Consider rate limiting the webhook endpoint to prevent abuse
- Consider adding IP whitelisting for the WhatsApp bot server

## Environment Variables Required
```
WEBHOOK_API_KEY=your-secure-api-key-here
```
