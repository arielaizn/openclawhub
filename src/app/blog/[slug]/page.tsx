"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Eye,
  User,
  ArrowRight,
  Share2,
  Link2,
  Volume2,
  Play,
  Pause,
  Loader2,
} from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  author_avatar: string;
  created_at: string;
  reading_time: number;
  views: number;
  cover_image: string;
  voice_url: string | null;
  title_en: string | null;
  content_en: string | null;
  excerpt_en: string | null;
}

/**
 * Parse a block of consecutive pipe-delimited lines into an HTML table.
 */
function parseTable(lines: string[]): string {
  // Filter out separator rows (|---|---|)
  const dataRows = lines.filter((line) => !/^\|[\s\-:|]+\|$/.test(line.trim()));
  if (dataRows.length === 0) return '';

  const parseRow = (line: string) =>
    line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());

  const headerCells = parseRow(dataRows[0]);
  const bodyRows = dataRows.slice(1);

  let table = '<div class="table-wrapper"><table>';
  table += '<thead><tr>';
  for (const cell of headerCells) {
    table += `<th>${cell}</th>`;
  }
  table += '</tr></thead>';

  if (bodyRows.length > 0) {
    table += '<tbody>';
    for (const row of bodyRows) {
      const cells = parseRow(row);
      table += '<tr>';
      for (const cell of cells) {
        table += `<td>${cell}</td>`;
      }
      table += '</tr>';
    }
    table += '</tbody>';
  }

  table += '</table></div>';
  return table;
}

/**
 * Convert basic markdown syntax to HTML.
 * Handles headings (#), bold (**), italic (*), tables (|), and line breaks.
 */
function renderMarkdown(text: string): string {
  // If content already looks like HTML (has tags) and no markdown markers, return as-is
  if (/<[a-z][\s\S]*>/i.test(text) && !text.startsWith('#') && !text.includes('**') && !text.includes('| ')) {
    return text;
  }

  const lines = text.split('\n');
  const processedBlocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect table: line starts and ends with |
    if (/^\|.+\|$/.test(line.trim())) {
      const tableLines: string[] = [];
      while (i < lines.length && /^\|.+\|$/.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }
      processedBlocks.push(parseTable(tableLines));
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      processedBlocks.push(`<h${level}>${headingMatch[2]}</h${level}>`);
      i++;
      continue;
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph: collect consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\|.+\|$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      processedBlocks.push(`<p>${paraLines.join('<br>')}</p>`);
    }
  }

  let html = processedBlocks.join('\n');

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* (but not inside ** pairs)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  return html;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { language } = useLanguage();

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollMilestones, setScrollMilestones] = useState<Set<number>>(
    new Set()
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
      startTimeRef.current = Date.now();
    }

    return () => {
      // Track time spent when leaving page
      if (post) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackAnalytics("time_spent", { time_spent: timeSpent });
      }
    };
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      setReadingProgress(Math.min(scrollPercentage, 100));

      // Track scroll depth milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !scrollMilestones.has(milestone) &&
          post
        ) {
          setScrollMilestones((prev) => new Set([...prev, milestone]));
          trackAnalytics("scroll", { scroll_depth: milestone });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post, scrollMilestones]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${slug}`);
      const data = await response.json();

      if (data.success) {
        setPost(data.data);
        trackAnalytics("view");
        fetchRelatedPosts(data.data.category, data.data.id);
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category: string, currentPostId: number) => {
    try {
      const response = await fetch(
        `/api/posts?category=${encodeURIComponent(category)}&limit=4`
      );
      const data = await response.json();

      if (data.success) {
        // Filter out current post and limit to 3
        const related = data.data.posts
          .filter((p: Post) => p.id !== currentPostId)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const trackAnalytics = async (
    eventType: string,
    extraData: Record<string, any> = {}
  ) => {
    if (!post) return;

    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.id,
          event_type: eventType,
          ...extraData,
        }),
      });
    } catch (error) {
      console.error("Error tracking analytics:", error);
    }
  };

  const handleAudioToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = post?.title || "";

    switch (platform) {
      case "copy":
        await navigator.clipboard.writeText(url);
        alert("הקישור הועתק בהצלחה!");
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank"
        );
        break;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">טוען מאמר...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Pick language-appropriate fields (fall back to Hebrew if no translation)
  const isEn = language === "en";
  const displayTitle = isEn && post.title_en ? post.title_en : post.title;
  const displayContent = isEn && post.content_en ? post.content_en : post.content;

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link
                href="/"
                className="hover:text-red-500 transition-colors"
              >
                בית
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-red-500 transition-colors"
              >
                בלוג
              </Link>
              <span>/</span>
              <span className="text-white">{displayTitle}</span>
            </div>
          </nav>

          {/* Hero Section */}
          <header className="mb-12">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {displayTitle}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-red-500" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-400" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span>{post.reading_time} דקות קריאה</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-500" />
                <span>{post.views.toLocaleString()} צפיות</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.cover_image}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent" />
              </div>
            )}

            {/* Author Card */}
            <div className="glass-card p-6 flex items-start gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {post.author}
                </h3>
                <p className="text-gray-400">Written by OpenClaw AI Bot</p>
              </div>
            </div>

            {/* Voice Section */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Volume2 className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1">
                    סקירה קולית
                  </h3>
                  {post.voice_url ? (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleAudioToggle}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-medium hover:shadow-lg transition-all"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4" />
                            השהה
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            שמע סקירה קולית
                          </>
                        )}
                      </button>
                      <audio
                        ref={audioRef}
                        src={post.voice_url}
                        onEnded={() => setIsPlaying(false)}
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400">סקירה קולית תתווסף בקרוב</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-medium">שתף:</span>
              <button
                onClick={() => handleShare("copy")}
                className="p-2 rounded-lg bg-slate-900/50 border border-red-500/20 text-red-500 hover:border-red-500 transition-colors"
                title="העתק קישור"
              >
                <Link2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="p-2 rounded-lg bg-slate-900/50 border border-red-500/20 text-red-500 hover:border-red-500 transition-colors"
                title="שתף בטוויטר"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="p-2 rounded-lg bg-slate-900/50 border border-red-500/20 text-red-500 hover:border-red-500 transition-colors"
                title="שתף בווצאפ"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
            </div>
          </header>

          {/* Content */}
          <div
            ref={contentRef}
            className="prose prose-invert max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(displayContent) }}
          />

          {/* Back to Blog Button */}
          <div className="mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-medium hover:shadow-lg transition-all"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה לבלוג
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-8">
                <span className="text-red-500">מאמרים</span> קשורים
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
