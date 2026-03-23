"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Save, Eye, ArrowRight } from "lucide-react";

export default function NewNewsletterPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

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
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={20}
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white placeholder-gray-500 font-mono text-sm
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all resize-none"
                placeholder="כתוב את תוכן הניוזלייטר כאן..."
              />
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
              <div
                style={{ color: "#d4d4d4", lineHeight: "1.8", fontSize: "16px" }}
                className="whitespace-pre-wrap"
              >
                {content || "תוכן הניוזלייטר יופיע כאן..."}
              </div>
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
