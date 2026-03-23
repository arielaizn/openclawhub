"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Eye,
  BarChart3,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  analyticsEvents: number;
  viewsByDay: Array<{ date: string; views: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  topPosts: Array<{
    id: number;
    title: string;
    views: number;
    category: string;
    createdAt: string;
  }>;
  recentPosts: Array<{
    id: number;
    title: string;
    published: number;
    createdAt: string;
  }>;
  avgScrollDepth: number;
  avgTimeSpent: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch("/api/admin/stats", {
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
      setStats(data);
    } catch (err) {
      setError("שגיאה בטעינת נתונים");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הפוסט?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh stats
      if (token) fetchStats(token);
    } catch (err) {
      alert("שגיאה במחיקת הפוסט");
    }
  };

  const COLORS = ["#2dd4bf", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981"];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">טוען נתונים...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="text-center text-red-400">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">דשבורד</h1>
          <p className="text-gray-400">Dashboard Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Posts */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-cyan-400/10 rounded-lg">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {stats.totalPosts}
                </p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              סה"כ פוסטים
            </h3>
            <p className="text-xs text-gray-500">Total Posts</p>
          </div>

          {/* Published Posts */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-400/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {stats.publishedPosts}
                </p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              פוסטים מפורסמים
            </h3>
            <p className="text-xs text-gray-500">Published</p>
          </div>

          {/* Total Views */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-400/10 rounded-lg">
                <Eye className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              סה"כ צפיות
            </h3>
            <p className="text-xs text-gray-500">Total Views</p>
          </div>

          {/* Analytics Events */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-cyan-400/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {stats.analyticsEvents.toLocaleString()}
                </p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              אירועי אנליטיקס
            </h3>
            <p className="text-xs text-gray-500">Analytics Events</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views by Day Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              צפיות לפי ימים
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Views by Day (Last 30 Days)
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf20" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #2dd4bf40",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#2dd4bf"
                  strokeWidth={2}
                  dot={{ fill: "#2dd4bf", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              התפלגות קטגוריות
            </h3>
            <p className="text-sm text-gray-400 mb-6">Category Distribution</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8b5cf620" />
                <XAxis
                  dataKey="category"
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #8b5cf640",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">סיכום אנליטיקס</h3>
          <p className="text-sm text-gray-400 mb-6">Analytics Summary</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avg Scroll Depth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">עומק גלילה ממוצע</span>
                <span className="text-lg font-bold text-cyan-400">
                  {Math.round(stats.avgScrollDepth)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.avgScrollDepth}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Average Scroll Depth</p>
            </div>

            {/* Avg Time Spent */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">זמן ממוצע באתר</span>
                <span className="text-lg font-bold text-purple-400">
                  {Math.floor(stats.avgTimeSpent / 60)}:
                  {String(Math.floor(stats.avgTimeSpent % 60)).padStart(2, "0")}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.avgTimeSpent / 300) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Average Time Spent (minutes)</p>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Posts */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">פוסטים מובילים</h3>
            <p className="text-sm text-gray-400 mb-6">Top Posts by Views</p>
            <div className="space-y-3">
              {stats.topPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-cyan-400/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1 line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded">
                          {post.category}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString("he-IL")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold">{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">פוסטים אחרונים</h3>
            <p className="text-sm text-gray-400 mb-6">Recent Posts</p>
            <div className="space-y-3">
              {stats.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-transparent hover:border-cyan-400/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1 line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span
                          className={`px-2 py-1 rounded ${
                            post.published
                              ? "bg-green-400/20 text-green-400"
                              : "bg-yellow-400/20 text-yellow-400"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString("he-IL")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="flex-1 px-3 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors text-center text-sm flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>עריכה</span>
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="flex-1 px-3 py-2 bg-red-400/10 text-red-400 rounded-lg hover:bg-red-400/20 transition-colors text-center text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>מחיקה</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
