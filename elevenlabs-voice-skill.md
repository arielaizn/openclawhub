# ElevenLabs Voice Sync Skill

## Overview
This skill ensures that the ElevenLabs voice review (audio narration) for each blog post matches the actual content of the post. It generates or regenerates the voice URL when post content changes.

## Skill Name
`elevenlabs-voice-sync`

## Trigger
This skill should be triggered:
1. **After creating a new blog post** via webhook or admin panel
2. **After updating post content** via the admin panel
3. **Manually** via a WhatsApp command: `!voice-sync <post-id>`

## Required Environment Variables
```
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=your-preferred-voice-id
```

## Workflow

### Step 1: Extract Clean Text
Strip all markdown formatting from the post content to get clean narration text:
- Remove `#` heading markers
- Remove `**bold**` and `*italic*` markers
- Remove table markup (`|`, `---`)
- Keep paragraph breaks as natural pauses

```javascript
function stripMarkdown(content) {
  return content
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    // Remove table separators
    .replace(/^\|[\s\-:|]+\|$/gm, '')
    // Clean table pipes to readable text
    .replace(/\|/g, ', ')
    // Clean multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
```

### Step 2: Generate Voice via ElevenLabs API
Call the ElevenLabs Text-to-Speech API:

```javascript
async function generateVoice(text, voiceId) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Supports Hebrew
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response; // Returns audio stream (MP3)
}
```

### Step 3: Upload Audio to Storage
Upload the generated MP3 to Supabase Storage or any CDN:

```javascript
async function uploadAudio(audioBuffer, postSlug) {
  const fileName = `voice/${postSlug}-${Date.now()}.mp3`;

  const { data, error } = await supabase.storage
    .from('blog-audio')
    .upload(fileName, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('blog-audio')
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}
```

### Step 4: Update Post with Voice URL
Update the post's `voice_url` field in the database:

```javascript
async function updatePostVoiceUrl(postId, voiceUrl) {
  const { error } = await supabase
    .from('posts')
    .update({ voice_url: voiceUrl, updated_at: new Date().toISOString() })
    .eq('id', postId);

  if (error) throw error;
}
```

## Complete Skill Flow

```
1. Receive trigger (new post / content update / manual command)
2. Fetch post content from database
3. Strip markdown to get clean narration text
4. Call ElevenLabs API to generate voice
5. Upload MP3 to Supabase Storage
6. Update post record with new voice_url
7. Confirm success via webhook response or WhatsApp message
```

## Content Sync Validation
To ensure voice matches content, the skill should:

1. **Hash comparison**: Store a hash of the content used to generate the voice. On each page load or edit, compare the current content hash with the stored hash. If different, flag the post as "voice out of sync".

2. **Auto-regenerate**: When content is updated, automatically queue a voice regeneration job.

3. **WhatsApp notification**: After voice generation completes, send a WhatsApp message:
   ```
   ✅ Voice sync complete for post: "{title}"
   Duration: {duration}s
   URL: {voice_url}
   ```

## API Endpoint for Manual Sync

```
POST /api/voice-sync
Body: { "post_id": 123 }
Headers: { "Authorization": "Bearer <admin-token>" }
```

Response:
```json
{
  "success": true,
  "data": {
    "post_id": 123,
    "voice_url": "https://..../voice/post-slug-123456.mp3",
    "duration_seconds": 45,
    "content_hash": "abc123..."
  }
}
```

## Notes
- Use `eleven_multilingual_v2` model for Hebrew content support
- For English translations, generate a separate voice file and store in `voice_url_en` field
- Maximum text length for ElevenLabs API is ~5000 characters per request. For longer posts, split into chunks and concatenate the audio files.
- Consider caching: don't regenerate if content hasn't changed (use content hash)
