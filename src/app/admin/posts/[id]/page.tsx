"use client";

import { useState, useEffect, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Save, Eye, ArrowRight, Trash2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  coverImage: string;
  voiceUrl: string;
  published: number;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("guides");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchPost(token);
  }, [router, resolvedParams.id]);

  const fetchPost = async (token: string) => {
    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt);
      setCategory(data.category);
      setTags(data.tags || "");
      setCoverImage(data.coverImage || "");
      setVoiceUrl(data.voiceUrl || "");
      setPublished(data.published === 1);
    } catch (err) {
      alert("שגיאה בטעינת הפוסט");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category,
          tags,
          coverImage,
          voiceUrl,
          published: published ? 1 : 0,
        }),
      });

      if (response.ok) {
        router.push("/admin/posts");
      } else {
        alert("שגיאה בעדכון הפוסט");
      }
    } catch (err) {
      alert("שגיאת רשת");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הפוסט? פעולה זו לא ניתנת לביטול.")) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/admin/posts");
      } else {
        alert("שגיאה במחיקת הפוסט");
      }
    } catch (err) {
      alert("שגיאת רשת");
    }
  };

  const categories = [
    { value: "guides", label: "מדריכים (Guides)" },
    { value: "news", label: "חדשות (News)" },
    { value: "tips", label: "טיפים (Tips)" },
    { value: "updates", label: "עדכונים (Updates)" },
    { value: "technical", label: "טכני (Technical)" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">טוען פוסט...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center text-red-400">פוסט לא נמצא</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">עריכת פוסט</h1>
            <p className="text-gray-400">Edit Post #{resolvedParams.id}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="btn-secondary inline-flex items-center gap-2 text-red-400 border-red-400 hover:bg-red-400"
            >
              <Trash2 className="w-5 h-5" />
              מחיקה
            </button>
            <button
              onClick={() => router.back()}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה
            </button>
          </div>
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

        {/* Form */}
        {!showPreview ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                כותרת
                <span className="text-gray-500 text-xs mr-2">(Title)</span>
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
                placeholder="הכנס כותרת מרשימה..."
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
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={16}
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white placeholder-gray-500 font-mono text-sm
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all resize-none"
                placeholder="כתוב את תוכן הפוסט כאן..."
              />
            </div>

            {/* Excerpt */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                תקציר
                <span className="text-gray-500 text-xs mr-2">(Excerpt)</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all resize-none"
                placeholder="תקציר קצר של הפוסט (1-2 משפטים)"
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  קטגוריה
                  <span className="text-gray-500 text-xs mr-2">(Category)</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                    text-white
                    focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                    transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  תגיות
                  <span className="text-gray-500 text-xs mr-2">(Tags)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                    transition-all"
                  placeholder="תגית1, תגית2, תגית3"
                />
              </div>
            </div>

            {/* Cover Image and Voice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  תמונת כיסוי
                  <span className="text-gray-500 text-xs mr-2">
                    (Cover Image URL)
                  </span>
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                    transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Voice URL */}
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  קובץ קול
                  <span className="text-gray-500 text-xs mr-2">
                    (Voice URL - ElevenLabs)
                  </span>
                </label>
                <input
                  type="url"
                  value={voiceUrl}
                  onChange={(e) => setVoiceUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                    transition-all"
                  placeholder="https://elevenlabs.io/..."
                />
              </div>
            </div>

            {/* Published Toggle */}
            <div className="glass-card p-6">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-gray-300">
                    פרסם מיד
                  </span>
                  <p className="text-xs text-gray-500">
                    Publish immediately or save as draft
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setPublished(!published)}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      published ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                        published ? "translate-x-7" : "translate-x-1"
                      } mt-1`}
                    />
                  </div>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>שומר...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>עדכן פוסט</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Preview */
          <div className="glass-card p-8 prose max-w-none">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <span className="px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full">
                {categories.find((c) => c.value === category)?.label}
              </span>
              {tags && (
                <span className="text-gray-500">תגיות: {tags}</span>
              )}
            </div>
            {excerpt && (
              <p className="text-xl text-gray-300 mb-8 italic">{excerpt}</p>
            )}
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="w-full rounded-lg mb-8"
              />
            )}
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
