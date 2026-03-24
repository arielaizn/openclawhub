"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Loader2, CheckCircle, Package } from "lucide-react";

export default function SubmitSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [readme, setReadme] = useState("");
  const [category, setCategory] = useState("automation");
  const [installCommand, setInstallCommand] = useState("");
  const [tags, setTags] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [version, setVersion] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [dependencies, setDependencies] = useState("");

  const categories = [
    { value: "automation", label: "אוטומציה / Automation" },
    { value: "communication", label: "תקשורת / Communication" },
    { value: "data", label: "נתונים / Data" },
    { value: "utilities", label: "כלי עזר / Utilities" },
    { value: "integrations", label: "אינטגרציות / Integrations" },
    { value: "ai", label: "בינה מלאכותית / AI" },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          readme: readme || undefined,
          category,
          install_command: installCommand,
          tags: tags || undefined,
          github_url: githubUrl || undefined,
          author: author || "Anonymous",
          version: version || "1.0.0",
          screenshot_url: screenshotUrl || undefined,
          dependencies: dependencies || undefined,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error?.message || "שגיאה בשליחת הסקיל");
      }
    } catch (err) {
      setError("שגיאת רשת - נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full glass-card p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            הסקיל נשלח לבדיקה!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            תודה על התרומה לקהילת OpenClaw. הסקיל יופיע באתר לאחר אישור.
          </p>
          <Link
            href="/skills"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה לרשימת Skills
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              שלח Skill חדש
            </h1>
            <p className="text-gray-400">
              שתף את ה-Skills שלך עם קהילת OpenClaw
            </p>
          </div>
          <Link
            href="/skills"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="glass-card p-4 border-red-500/50 bg-red-500/10">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              שם הסקיל
              <span className="text-red-400 mr-1">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                text-white placeholder-gray-500
                focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                transition-all"
              placeholder="שם ייחודי לסקיל שלך"
            />
          </div>

          {/* Description */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              תיאור קצר
              <span className="text-red-400 mr-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                text-white placeholder-gray-500
                focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                transition-all resize-none"
              placeholder="תאר בקצרה מה הסקיל עושה ואיך הוא יכול לעזור"
            />
          </div>

          {/* README */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                תיעוד מלא (README)
              </label>
              <p className="text-xs text-gray-500">תומך בסימון Markdown</p>
            </div>
            <textarea
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                text-white placeholder-gray-500 font-mono text-sm
                focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                transition-all resize-none"
              placeholder="# הוראות התקנה&#10;&#10;## דוגמאות שימוש&#10;&#10;## פרמטרים&#10;&#10;## פלט"
            />
          </div>

          {/* Category and Install Command */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                קטגוריה
                <span className="text-red-400 mr-1">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Install Command */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                פקודת התקנה
                <span className="text-red-400 mr-1">*</span>
              </label>
              <input
                type="text"
                value={installCommand}
                onChange={(e) => setInstallCommand(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500 font-mono text-sm
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="npx openclaw install skill-name"
              />
            </div>
          </div>

          {/* Tags and GitHub URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                תגיות
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {/* GitHub URL */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                קישור GitHub
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          {/* Author and Version */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Author */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                שם המפתח
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="Anonymous"
              />
            </div>

            {/* Version */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                גרסה
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="1.0.0"
              />
            </div>
          </div>

          {/* Screenshot URL and Dependencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Screenshot URL */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                תמונת מסך URL
              </label>
              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="https://example.com/screenshot.png"
              />
            </div>

            {/* Dependencies */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                תלויות
              </label>
              <input
                type="text"
                value={dependencies}
                onChange={(e) => setDependencies(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                  transition-all"
                placeholder="package1, package2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="glass-card p-6 bg-gradient-to-br from-red-500/5 to-orange-500/5">
            <div className="flex items-start gap-4 mb-4">
              <Package className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">לפני השליחה</h3>
                <p className="text-gray-400 text-sm">
                  הסקיל שלך יעבור בדיקה לפני שיופיע באתר. ודא שהתיעוד ברור ופקודת
                  ההתקנה עובדת כראוי.
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>שולח...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>שלח לאישור</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
