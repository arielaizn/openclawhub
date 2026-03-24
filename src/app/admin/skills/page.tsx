"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Loader2, Check, X, Puzzle, Download, Star, Search } from "lucide-react";
import Link from "next/link";

interface Skill {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  downloads: number;
  rating: number;
  rating_count: number;
  is_approved: boolean;
  created_at: string;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSkills();
  }, [router]);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills?all=true");
      const data = await response.json();
      if (data.success) {
        setSkills(data.data.skills || []);
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
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_approved: true } : s))
        );
      } else {
        alert("שגיאה באישור הסקיל");
      }
    } catch {
      alert("שגיאת רשת");
    }
  };

  const handleReject = async (id: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_approved: false }),
      });
      const data = await response.json();
      if (data.success) {
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_approved: false } : s))
        );
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
      });
    } catch {
      return dateString;
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (filter === "approved" && !s.is_approved) return false;
    if (filter === "pending" && s.is_approved) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const approvedCount = skills.filter((s) => s.is_approved).length;
  const pendingCount = skills.filter((s) => !s.is_approved).length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">סקילים</h1>
            <p className="text-gray-400">Skills Management</p>
          </div>
          <Link
            href="/admin/skills/new"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            סקיל חדש
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <Puzzle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{skills.length}</p>
            <p className="text-gray-400 text-sm">סה״כ סקילים</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{approvedCount}</p>
            <p className="text-gray-400 text-sm">מאושרים</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Loader2 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{pendingCount}</p>
            <p className="text-gray-400 text-sm">ממתינים לאישור</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(["all", "approved", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                {f === "all" ? "הכל" : f === "approved" ? "מאושרים" : "ממתינים"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Puzzle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">אין סקילים להצגה</p>
            <Link
              href="/admin/skills/new"
              className="inline-block mt-4 text-cyan-400 hover:underline"
            >
              הוסף סקיל ראשון
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">שם</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">מחבר</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">קטגוריה</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">סטטוס</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">הורדות</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">דירוג</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">תאריך</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/skills/${skill.slug}`}
                          className="text-white font-medium hover:text-cyan-400 transition-colors"
                        >
                          {skill.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{skill.author}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs bg-white/10 text-gray-300">
                          {skill.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            skill.is_approved
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {skill.is_approved ? "מאושר" : "ממתין"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {skill.downloads}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          {Number(skill.rating).toFixed(1)} ({skill.rating_count})
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(skill.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {!skill.is_approved && (
                            <button
                              onClick={() => handleApprove(skill.id)}
                              className="p-2 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors"
                              title="אשר"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {skill.is_approved && (
                            <button
                              onClick={() => handleReject(skill.id)}
                              className="p-2 rounded-lg text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                              title="בטל אישור"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                            title="מחק"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
