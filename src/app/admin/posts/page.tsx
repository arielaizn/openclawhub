"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Tag,
} from "lucide-react";

interface Post {
  id: number;
  title: string;
  category: string;
  published: number;
  views: number;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchPosts(token);
  }, [router]);

  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus === "published") {
      filtered = filtered.filter((post) => post.published === 1);
    } else if (filterStatus === "draft") {
      filtered = filtered.filter((post) => post.published === 0);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, filterStatus]);

  const fetchPosts = async (token: string) => {
    try {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      const result = await response.json();
      const rawPosts = result.data?.posts || result.posts || [];
      const mapped = rawPosts.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        published: p.is_published,
        views: p.views,
        createdAt: p.created_at,
      }));
      setPosts(mapped);
      setFilteredPosts(mapped);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const post = posts.find((p) => p.id === id);
      if (!post) return;

      await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: post.title,
          category: post.category,
          is_published: currentStatus === 1 ? 0 : 1,
        }),
      });

      // Refresh posts
      fetchPosts(token);
    } catch (err) {
      alert("שגיאה בעדכון סטטוס הפוסט");
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הפוסט?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh posts
      fetchPosts(token);
    } catch (err) {
      alert("שגיאה במחיקת הפוסט");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">טוען פוסטים...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">פוסטים</h1>
            <p className="text-gray-400">Manage Posts</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            פוסט חדש
          </Link>
        </div>

        {/* Filters */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="חפש פוסט..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                    : "bg-slate-800 text-gray-400 hover:text-white"
                }`}
              >
                הכל ({posts.length})
              </button>
              <button
                onClick={() => setFilterStatus("published")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  filterStatus === "published"
                    ? "bg-green-400/20 text-green-400 border border-green-400/30"
                    : "bg-slate-800 text-gray-400 hover:text-white"
                }`}
              >
                מפורסם ({posts.filter((p) => p.published === 1).length})
              </button>
              <button
                onClick={() => setFilterStatus("draft")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  filterStatus === "draft"
                    ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                    : "bg-slate-800 text-gray-400 hover:text-white"
                }`}
              >
                טיוטה ({posts.filter((p) => p.published === 0).length})
              </button>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="glass-card overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg">לא נמצאו פוסטים</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-cyan-400/20">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      כותרת
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      קטגוריה
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      סטטוס
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      צפיות
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      תאריך
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-400/10">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium max-w-md truncate">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full text-sm">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                            post.published
                              ? "bg-green-400/20 text-green-400"
                              : "bg-yellow-400/20 text-yellow-400"
                          }`}
                        >
                          {post.published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">
                            {post.views.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString("he-IL")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleTogglePublish(post.id, post.published)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              post.published
                                ? "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
                                : "bg-green-400/10 text-green-400 hover:bg-green-400/20"
                            }`}
                            title={post.published ? "Unpublish" : "Publish"}
                          >
                            {post.published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="p-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 bg-red-400/10 text-red-400 rounded-lg hover:bg-red-400/20 transition-colors"
                            title="Delete"
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
