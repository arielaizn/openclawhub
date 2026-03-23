"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import BlogCard from "@/components/BlogCard";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  author_avatar: string;
  created_at: string;
  reading_time: number;
  views: number;
  cover_image: string;
}

interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  };
}

const categories = [
  { value: "", label: "הכל", color: "from-cyan-400 to-purple-500" },
  { value: "מדריכים", label: "מדריכים", color: "from-cyan-400 to-cyan-500" },
  { value: "חדשות", label: "חדשות", color: "from-purple-400 to-purple-500" },
  { value: "טיפים", label: "טיפים", color: "from-orange-400 to-orange-500" },
  { value: "עדכונים", label: "עדכונים", color: "from-pink-400 to-pink-500" },
  { value: "טכני", label: "טכני", color: "from-blue-400 to-blue-500" },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
      });

      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data: PostsResponse = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
        setTotalPages(data.data.totalPages);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl sm:text-7xl font-black mb-6 tracking-tight">
            <span className="text-gradient">הבלוג</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2 font-light">Blog</p>
          <p className="text-lg text-gray-500 font-light">
            מאמרים, מדריכים וחדשות על OpenClaw
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="חיפוש במאמרים..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-6 py-4 pr-14 bg-[rgba(12,20,40,0.6)] border border-cyan-400/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/40 focus:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all duration-300 font-light"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
                  selectedCategory === category.value
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-cyan-400/20`
                    : "bg-[rgba(12,20,40,0.5)] text-gray-500 border border-white/5 hover:border-cyan-400/20 hover:text-gray-300"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-8 text-center text-gray-500 text-sm font-light">
            נמצאו {total.toLocaleString()} מאמרים
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
            </div>
            <p className="text-gray-500 mt-6 font-light">טוען מאמרים...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="glass-card p-16 text-center">
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-cyan-400/40" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">אין פוסטים עדיין</h3>
            <p className="text-gray-500 font-light">נסה לשנות את קריטריוני החיפוש או הקטגוריה</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl bg-[rgba(12,20,40,0.5)] border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400/20 transition-all duration-300 text-sm"
            >
              הקודם
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 text-sm ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/20"
                          : "bg-[rgba(12,20,40,0.5)] border border-white/5 text-gray-500 hover:border-cyan-400/20 hover:text-cyan-400"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-600">...</span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-xl bg-[rgba(12,20,40,0.5)] border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400/20 transition-all duration-300 text-sm"
            >
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
