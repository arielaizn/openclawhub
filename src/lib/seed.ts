import { supabase, createAuthClient } from "./supabase";

const samplePosts = [
  {
    title: "מבוא ל-OpenClaw: העוזר האישי AI שמשנה את הכללים",
    slug: "intro-to-openclaw",
    content: `<h2>מה זה OpenClaw?</h2>
<p>OpenClaw הוא פלטפורמת עוזר אישי AI רב-ערוצית שרצה על השרת שלכם. הוא מאזין להודעות מ-WhatsApp, Telegram, Discord, Slack ו-Gmail — ומשיב עליהן בעזרת Claude Agent SDK, הסוכן החכם ביותר הקיים כיום.</p>

<h3>מה שמייחד את OpenClaw</h3>
<p>מה שמייחד את OpenClaw: כל סוכן AI רץ <strong>בתוך קונטיינר Linux מבודד</strong> — לא רק מאחורי בדיקות הרשאות, אלא בבידוד אמיתי של מערכת ההפעלה.</p>

<h3>ההיסטוריה</h3>
<ul>
<li><strong>2022</strong> — הרקע: מודלי שפה גדולים מתחילים להיות שימושיים באמת</li>
<li><strong>2023</strong> — הצורך: החלטנו שאנחנו רוצים עוזר שעונה בוואטסאפ, זוכר הקשר, ומריץ קוד</li>
<li><strong>2024</strong> — פיתוח: OpenClaw גדל ל-500,000 שורות קוד</li>
<li><strong>2025-2026</strong> — בגרות: תמיכה ב-Agent Swarms ו-MCP</li>
</ul>

<h3>למי זה מיועד?</h3>
<p>בין אם אתם מפתחים, מנהלי מוצר, או סתם סקרנים — OpenClaw הוא נקודת ההתחלה שלכם למהפכת ה-AI הבאה.</p>`,
    excerpt: "גלו מה זה OpenClaw, למה הוא שונה מכל עוזר AI אחר, ואיך הוא יכול לשנות את הדרך שבה אתם עובדים.",
    category: "מדריכים",
    tags: "openclaw,introduction,ai,getting-started",
    reading_time: 5,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "איך להתקין OpenClaw על VPS בפחות מ-10 דקות",
    slug: "install-openclaw-vps",
    content: `<h2>התקנת OpenClaw על VPS</h2>
<p>ההתקנה של OpenClaw פשוטה ומהירה. בואו נעבור על השלבים אחד אחד.</p>

<h3>דרישות מערכת</h3>
<ul>
<li>שרת Linux (Ubuntu 22.04+ מומלץ)</li>
<li>Docker Engine מותקן</li>
<li>מינימום 2GB RAM</li>
<li>מפתח API של Anthropic (Claude)</li>
</ul>

<h3>שלב 1: התקנת Docker</h3>
<pre><code>curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER</code></pre>

<h3>שלב 2: הורדת OpenClaw</h3>
<pre><code>git clone https://github.com/openclaw/openclaw.git
cd openclaw</code></pre>

<h3>שלב 3: הגדרת קונפיגורציה</h3>
<pre><code>cp .env.example .env
nano .env
# הוסיפו את המפתחות שלכם</code></pre>

<h3>שלב 4: הפעלה</h3>
<pre><code>docker compose up -d</code></pre>

<p>זהו! OpenClaw רץ על השרת שלכם. עכשיו אפשר להתחבר דרך WhatsApp, Telegram, או כל ערוץ אחר.</p>`,
    excerpt: "מדריך צעד אחר צעד להתקנת OpenClaw על שרת VPS עם Docker. מההתקנה ועד ההודעה הראשונה בוואטסאפ.",
    category: "מדריכים",
    tags: "installation,vps,docker,setup",
    reading_time: 8,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "Agent Swarms: איך להריץ נחיל של סוכני AI",
    slug: "agent-swarms-guide",
    content: `<h2>מה זה Agent Swarms?</h2>
<p>Agent Swarms הוא אחד הפיצ'רים המתקדמים ביותר של OpenClaw. במקום סוכן AI בודד, אתם יכולים להריץ <strong>נחיל שלם של סוכנים</strong> שעובדים במקביל על משימות מורכבות.</p>

<h3>איך זה עובד?</h3>
<p>הארכיטקטורה של Swarms מבוססת על דפוס ה-Orchestrator:</p>
<ol>
<li><strong>Orchestrator Agent</strong> — מקבל את המשימה ומחלק אותה למשימות משנה</li>
<li><strong>Worker Agents</strong> — כל אחד מקבל משימת משנה ועובד עליה בקונטיינר מבודד</li>
<li><strong>Aggregator</strong> — מאגד את התוצאות ומחזיר תשובה מאוחדת</li>
</ol>

<h3>דוגמה מעשית</h3>
<pre><code>// הגדרת Swarm בקובץ swarm.config.json
{
  "name": "research-swarm",
  "agents": 5,
  "strategy": "parallel",
  "timeout": 300
}</code></pre>

<h3>מתי להשתמש ב-Swarms?</h3>
<ul>
<li>מחקר מעמיק שדורש מספר מקורות</li>
<li>ניתוח קוד בפרויקט גדול</li>
<li>עיבוד מסמכים בכמויות</li>
<li>משימות שדורשות מומחיות מגוונת</li>
</ul>`,
    excerpt: "למדו איך להריץ נחילי סוכנים (Agent Swarms) ב-OpenClaw — מהארכיטקטורה ועד הקונפיגורציה המעשית.",
    category: "טכני",
    tags: "agent-swarms,advanced,architecture,parallel",
    reading_time: 12,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "5 טיפים לשימוש יעיל ב-OpenClaw",
    slug: "5-tips-openclaw",
    content: `<h2>טיפים שיהפכו אתכם למומחי OpenClaw</h2>

<h3>1. השתמשו ב-CLAUDE.md לזיכרון קבוע</h3>
<p>קובץ CLAUDE.md הוא הדרך של OpenClaw לזכור מידע בין שיחות. כתבו בו הוראות ברורות, העדפות, וקונטקסט שחשוב לכם.</p>

<h3>2. ארגנו סקילס לפי קטגוריות</h3>
<p>מערכת הסקילס של OpenClaw מאפשרת לכם ליצור פקודות מותאמות אישית. ארגנו אותן בתיקיות לפי נושא.</p>

<h3>3. הגדירו משימות מתוזמנות</h3>
<p>השתמשו במערכת המשימות המתוזמנות כדי לקבל עדכונים אוטומטיים. למשל: סיכום יומי של מיילים, תזכורות, או דוחות.</p>

<h3>4. נצלו את MCP לאינטגרציות</h3>
<p>Model Context Protocol (MCP) מאפשר חיבור לכלים חיצוניים: Notion, GitHub, Airtable, ועוד. הגדירו שרתי MCP לפי הצורך.</p>

<h3>5. בנו Agent Swarms למשימות מורכבות</h3>
<p>כשמשימה גדולה מדי לסוכן בודד, השתמשו ב-Swarms. זה הכלי הכי חזק שיש ל-OpenClaw.</p>`,
    excerpt: "5 טיפים מעשיים שיעזרו לכם להפיק את המקסימום מ-OpenClaw — מזיכרון ועד נחילי סוכנים.",
    category: "טיפים",
    tags: "tips,productivity,best-practices",
    reading_time: 4,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "עדכון גרסה 2.5: תמיכה מלאה ב-MCP",
    slug: "version-25-mcp-support",
    content: `<h2>מה חדש בגרסה 2.5?</h2>
<p>אנחנו שמחים להכריז על גרסה 2.5 של OpenClaw עם תמיכה מלאה ב-Model Context Protocol (MCP)!</p>

<h3>חידושים עיקריים</h3>
<ul>
<li><strong>MCP Server מובנה</strong> — OpenClaw כולל עכשיו שרת MCP מובנה שמאפשר חיבור לכל כלי MCP תואם</li>
<li><strong>אינטגרציה עם Notion</strong> — גישה ישירה למסדי הנתונים שלכם ב-Notion</li>
<li><strong>אינטגרציה עם GitHub</strong> — ניהול issues, PRs, ו-repos ישירות מהצ'אט</li>
<li><strong>אינטגרציה עם Airtable</strong> — קריאה וכתיבה לטבלאות Airtable</li>
</ul>

<h3>איך לשדרג</h3>
<pre><code>cd openclaw
git pull origin main
docker compose down && docker compose up -d --build</code></pre>

<h3>תמיכה לאחור</h3>
<p>גרסה 2.5 תואמת לאחור לגמרי. כל הסקילס והקונפיגורציות הקיימות ימשיכו לעבוד.</p>`,
    excerpt: "גרסה 2.5 של OpenClaw מביאה תמיכה מלאה ב-MCP עם אינטגרציות ל-Notion, GitHub, ו-Airtable.",
    category: "עדכונים",
    tags: "update,mcp,notion,github,airtable",
    reading_time: 3,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "ערוצי תקשורת: איך לחבר WhatsApp ל-OpenClaw",
    slug: "connect-whatsapp-openclaw",
    content: `<h2>חיבור WhatsApp ל-OpenClaw</h2>
<p>WhatsApp הוא אחד הערוצים הפופולריים ביותר של OpenClaw. בואו נלמד איך לחבר אותו.</p>

<h3>דרישות מקדימות</h3>
<ul>
<li>חשבון WhatsApp Business API (או Baileys)</li>
<li>OpenClaw מותקן ורץ</li>
<li>מספר טלפון ייעודי</li>
</ul>

<h3>שלב 1: הגדרת ה-Channel</h3>
<pre><code># בקובץ channels/whatsapp.config.json
{
  "type": "whatsapp",
  "provider": "baileys",
  "phone": "+972XXXXXXXXX",
  "session_path": "./sessions/wa"
}</code></pre>

<h3>שלב 2: סריקת QR Code</h3>
<p>בהפעלה הראשונה, OpenClaw יציג QR Code בטרמינל. סרקו אותו עם WhatsApp שלכם.</p>

<h3>שלב 3: שליחת הודעה ראשונה</h3>
<p>שלחו הודעה לבוט מ-WhatsApp ותראו את התשובה תוך שניות.</p>

<h3>טיפים</h3>
<ul>
<li>השתמשו ב-groups כדי לתת לבוט גישה לקבוצות</li>
<li>הגדירו whitelist למספרים מורשים</li>
<li>צרו סקילס ייעודיים לוואטסאפ</li>
</ul>`,
    excerpt: "מדריך מלא לחיבור WhatsApp לפלטפורמת OpenClaw — מההגדרה ועד ההודעה הראשונה.",
    category: "מדריכים",
    tags: "whatsapp,channels,setup,communication",
    reading_time: 6,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "Container Isolation: הבטיחות שב-OpenClaw",
    slug: "container-isolation-security",
    content: `<h2>בידוד קונטיינרים ב-OpenClaw</h2>
<p>אחד העקרונות המרכזיים של OpenClaw הוא בטיחות. כל סוכן AI רץ בתוך קונטיינר Linux מבודד.</p>

<h3>למה זה חשוב?</h3>
<p>כשנותנים ל-AI סוכן יכולת לבצע פעולות אמיתיות — לפתוח קבצים, להריץ קוד, לגשת לאינטרנט — חייבים ודאות שהוא לא יכול לפגוע במערכת.</p>

<h3>איך זה עובד</h3>
<ul>
<li><strong>Namespace Isolation</strong> — כל קונטיינר רואה רק את עצמו</li>
<li><strong>Resource Limits</strong> — הגבלת CPU, זיכרון, ודיסק</li>
<li><strong>Network Rules</strong> — שליטה מלאה בתקשורת</li>
<li><strong>Read-Only Root</strong> — מערכת קבצים לקריאה בלבד</li>
</ul>

<h3>השוואה לאלטרנטיבות</h3>
<p>רוב העוזרים AI משתמשים ב-sandboxing ברמת אפליקציה. OpenClaw משתמש בבידוד ברמת מערכת ההפעלה — הרבה יותר בטוח.</p>`,
    excerpt: "למדו על מודל הבטיחות של OpenClaw ואיך בידוד קונטיינרים מגן על המערכת שלכם.",
    category: "טכני",
    tags: "security,containers,isolation,docker",
    reading_time: 7,
    is_published: 1,
    author: "OpenClaw Bot",
  },
  {
    title: "OpenClaw 2026: מה צפוי השנה",
    slug: "openclaw-2026-roadmap",
    content: `<h2>מפת הדרכים של OpenClaw ל-2026</h2>
<p>שנת 2026 מתחילה בגדול עבור OpenClaw. הנה מה שצפוי:</p>

<h3>Q1 2026</h3>
<ul>
<li>שחרור הספר המלא (עברית ואנגלית)</li>
<li>שדרוג מערכת הסקילס</li>
<li>תמיכה ב-Apple Container</li>
</ul>

<h3>Q2 2026</h3>
<ul>
<li>ממשק ווב מובנה</li>
<li>שוק סקילס (Skills Marketplace)</li>
<li>API ציבורי</li>
</ul>

<h3>Q3 2026</h3>
<ul>
<li>תמיכה במודלים נוספים (GPT, Gemini)</li>
<li>מערכת Plugins</li>
<li>שיפורי ביצועים</li>
</ul>

<h3>Q4 2026</h3>
<ul>
<li>Enterprise Edition</li>
<li>ניהול צוותים</li>
<li>SaaS אופציה</li>
</ul>

<p>עקבו אחרינו לעדכונים!</p>`,
    excerpt: "הצצה למפת הדרכים של OpenClaw ל-2026 — מ-Apple Container ועד Enterprise Edition.",
    category: "חדשות",
    tags: "roadmap,2026,future,updates",
    reading_time: 4,
    is_published: 1,
    author: "OpenClaw Bot",
  },
];

export async function seedDatabase() {
  // Authenticate as admin to bypass RLS
  const email = process.env.ADMIN_EMAIL || '';
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD env vars required for seeding');
  }
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.session) {
    throw new Error(`Auth failed: ${authError?.message || 'No session'}`);
  }

  const client = createAuthClient(authData.session.access_token);

  const { count } = await client
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    console.log('Database already has posts, skipping seed.');
    return;
  }

  const postsToInsert = samplePosts.map((post, i) => {
    const daysAgo = (samplePosts.length - i) * 3;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      reading_time: post.reading_time,
      is_published: post.is_published,
      author: post.author,
      views: Math.floor(Math.random() * 500) + 50,
      created_at: date.toISOString(),
    };
  });

  const { error } = await client.from('posts').insert(postsToInsert);
  if (error) throw error;

  console.log(`Seeded ${samplePosts.length} posts.`);
}
