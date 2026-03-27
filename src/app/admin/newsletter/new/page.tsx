"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Save, Eye, ArrowRight, ImageIcon, Loader2 } from "lucide-react";
import PostMentionDropdown, { type MentionPost } from "@/components/PostMentionDropdown";
import { extractPostSlugs, renderContentToEmailHtml } from "@/lib/newsletter-renderer";

interface PreviewPost {
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
}

export default function NewNewsletterPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  // @ mention state
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(null);
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Image upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview posts state
  const [previewPosts, setPreviewPosts] = useState<Map<string, PreviewPost>>(new Map());

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  // Fetch posts for preview when entering preview mode
  useEffect(() => {
    if (showPreview) {
      const slugs = extractPostSlugs(content);
      if (slugs.length > 0) {
        fetchPreviewPosts(slugs);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview]);

  const fetchPreviewPosts = async (slugs: string[]) => {
    try {
      const response = await fetch("/api/posts?limit=100");
      const data = await response.json();
      if (data.success) {
        const map = new Map<string, PreviewPost>();
        for (const post of data.data.posts) {
          if (slugs.includes(post.slug)) {
            map.set(post.slug, {
              title: post.title,
              slug: post.slug,
              cover_image: post.cover_image,
              excerpt: post.excerpt,
            });
          }
        }
        setPreviewPosts(map);
      }
    } catch (err) {
      console.error("Error fetching preview posts:", err);
    }
  };

  // @ mention detection in textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContent(value);

    const textBeforeCursor = value.substring(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@([^\s@]*)$/);

    if (atMatch) {
      setShowMentionDropdown(true);
      setMentionSearchTerm(atMatch[1]);
      setMentionStartIndex(cursorPos - atMatch[0].length);
      setMentionSelectedIndex(0);
    } else {
      setShowMentionDropdown(false);
      setMentionSearchTerm("");
      setMentionStartIndex(null);
    }
  };

  // Handle post selection from dropdown
  const handlePostSelect = useCallback((post: MentionPost) => {
    if (mentionStartIndex === null || !textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;
    const before = content.substring(0, mentionStartIndex);
    const after = content.substring(cursorPos);
    const marker = `{{post:${post.slug}}}`;

    setContent(before + marker + after);
    setShowMentionDropdown(false);
    setMentionSearchTerm("");
    setMentionStartIndex(null);

    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = before.length + marker.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }, [mentionStartIndex, content]);

  // Keyboard navigation for mention dropdown
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionDropdown) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setShowMentionDropdown(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setMentionSelectedIndex((prev) => Math.min(prev + 1, 9));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMentionSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/newsletter-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const textarea = textareaRef.current;
        const cursorPos = textarea?.selectionStart || content.length;
        const imageMarkdown = `\n![](${data.data.url})\n`;
        const before = content.substring(0, cursorPos);
        const after = content.substring(cursorPos);
        setContent(before + imageMarkdown + after);
      } else {
        alert(data.error?.message || "שגיאה בהעלאת תמונה");
      }
    } catch {
      alert("שגיאת רשת בהעלאת תמונה");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        router.push("/admin/newsletter");
      } else {
        alert("שגיאה בשמירת הניוזלייטר");
      }
    } catch {
      alert("שגיאת רשת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">ניוזלייטר חדש</h1>
            <p className="text-gray-400">Create New Newsletter</p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה
          </button>
        </div>

        {/* Preview Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 rounded-lg transition-all ${
                !showPreview
                  ? "bg-cyan-400/20 text-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              עריכה
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-lg transition-all ${
                showPreview
                  ? "bg-cyan-400/20 text-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-5 h-5 inline mr-1" />
              תצוגה מקדימה
            </button>
          </div>
        </div>

        {!showPreview ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                כותרת הניוזלייטר
                <span className="text-gray-500 text-xs mr-2">(Subject Line)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white text-xl font-bold placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all"
                placeholder="כותרת מושכת לניוזלייטר..."
              />
            </div>

            {/* Content */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  תוכן
                  <span className="text-gray-500 text-xs mr-2">(Content)</span>
                </label>
                <p className="text-xs text-gray-500">
                  Supports Markdown-like syntax
                </p>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 text-sm bg-slate-700 border border-cyan-400/20 rounded-lg
                    text-gray-300 hover:text-white hover:border-cyan-400/40 transition-all
                    disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span>העלאת תמונה</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="text-xs text-gray-500 mr-auto">
                  הקלד <code className="bg-slate-700 px-1 rounded text-cyan-400">@</code> כדי לתייג פוסט מהבלוג
                </span>
              </div>

              {/* Textarea with mention dropdown */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  onKeyDown={handleTextareaKeyDown}
                  required
                  rows={20}
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                    text-white placeholder-gray-500 font-mono text-sm
                    focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                    transition-all resize-none"
                  placeholder="כתוב את תוכן הניוזלייטר כאן... הקלד @ לתיוג פוסט"
                />
                <PostMentionDropdown
                  isVisible={showMentionDropdown}
                  searchTerm={mentionSearchTerm}
                  onSelect={handlePostSelect}
                  onClose={() => setShowMentionDropdown(false)}
                  selectedIndex={mentionSelectedIndex}
                />
              </div>

              {/* Content hints */}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                <span><code className="text-gray-500">**טקסט**</code> = <strong className="text-gray-400">מודגש</strong></span>
                <span><code className="text-gray-500">*טקסט*</code> = <em className="text-gray-400">נטוי</em></span>
                <span><code className="text-gray-500"># כותרת</code> = כותרת</span>
                <span><code className="text-gray-500">@</code> = תיוג פוסט</span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>שומר...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>שמור כטיוטה</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Preview */
          <div className="glass-card p-8">
            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                background: "#0a0a0a",
                color: "#f5f5f5",
                padding: "32px",
                borderRadius: "12px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <h2 style={{ color: "#ef4444", fontSize: "28px", margin: 0 }}>
                  OpenClaw Hub
                </h2>
                <p style={{ color: "#737373", fontSize: "14px" }}>Newsletter</p>
              </div>
              <h3
                style={{
                  color: "#f5f5f5",
                  fontSize: "24px",
                  borderBottom: "2px solid #dc2626",
                  paddingBottom: "12px",
                }}
              >
                {title || "כותרת הניוזלייטר"}
              </h3>
              {content ? (
                <div
                  style={{ color: "#d4d4d4", lineHeight: "1.8", fontSize: "16px" }}
                  dangerouslySetInnerHTML={{
                    __html: renderContentToEmailHtml(content, previewPosts),
                  }}
                />
              ) : (
                <div
                  style={{ color: "#d4d4d4", lineHeight: "1.8", fontSize: "16px" }}
                >
                  תוכן הניוזלייטר יופיע כאן...
                </div>
              )}
              <hr style={{ border: "none", borderTop: "1px solid #333", margin: "32px 0" }} />
              <p style={{ color: "#737373", fontSize: "12px", textAlign: "center" }}>
                OpenClaw Hub Newsletter
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
