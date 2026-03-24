"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Trash2, Loader2, Check, X, Clock, Eye } from "lucide-react";
import Link from "next/link";

interface Skill {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  author: string;
  install_command: string;
  github_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function AdminPendingSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchPendingSkills();
  }, [router]);

  const fetchPendingSkills = async () => {
    try {
      const response = await fetch("/api/skills?all=true");
      const data = await response.json();
      if (data.success) {
        const pending = (data.data.skills || []).filter(
          (s: Skill) => !s.is_approved
        );
        setSkills(pending);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_approved: true }),
      });
      const data = await response.json();
      if (data.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("שגיאה באישור הסקיל");
      }
    } catch {
      alert("שגיאת רשת");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הסקיל?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("שגיאה במחיקה");
      }
    } catch {
      alert("שגיאת רשת");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">סקילים ממתינים לאישור</h1>
          <p className="text-gray-400">Pending Skills Approval</p>
        </div>

        {/* Counter */}
        <div className="glass-card p-6 flex items-center gap-4">
          <Clock className="w-10 h-10 text-yellow-400" />
          <div>
            <p className="text-3xl font-bold text-white">{skills.length}</p>
            <p className="text-gray-400 text-sm">סקילים ממתינים לאישור</p>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          </div>
        ) : skills.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium mb-1">אין סקילים ממתינים</p>
            <p className="text-gray-400">כל הסקילים שנשלחו כבר טופלו</p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="glass-card p-6 border border-yellow-500/20"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                      <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300">
                        {skill.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                        ממתין לאישור
                      </span>
                    </div>

                    <p className="text-gray-400 mb-3">{skill.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>מחבר: <span className="text-gray-300">{skill.author}</span></span>
                      <span>נשלח: <span className="text-gray-300">{formatDate(skill.created_at)}</span></span>
                      {skill.github_url && (
                        <a
                          href={skill.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>

                    {skill.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {skill.tags.split(",").map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 p-3 rounded-lg bg-black/30 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">פקודת התקנה:</p>
                      <code className="text-sm text-cyan-400 font-mono">
                        {skill.install_command}
                      </code>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleApprove(skill.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-colors text-sm font-medium"
                    >
                      <Check className="w-4 h-4" />
                      אשר
                    </button>
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      צפה
                    </Link>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      מחק
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
