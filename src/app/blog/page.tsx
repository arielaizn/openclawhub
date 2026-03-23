"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
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
  { value: "", label: "הכל" },
  { value: "מדריכים", label: "מדריכים" },
  { value: "חדשות", label: "חדשות" },
  { value: "טיפים", label: "טיפים" },
  { value: "עדכונים", label: "עדכונים" },
  { value: "טכני", label: "טכני" },
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

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

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
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-l from-cyan-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              הבלוג
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">Blog</p>
          <p className="text-lg text-gray-400">
            מאמרים, מדריכים וחדשות על OpenClaw
          </p>
          <p className="text-base text-gray-500">
            Articles, guides and news about OpenClaw
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="חיפוש במאמרים..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-6 py-4 pr-12 bg-slate-900/50 border border-cyan-400/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/25"
                    : "bg-slate-900/50 text-gray-400 border border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-center text-gray-400">
            נמצאו {total.toLocaleString()} מאמרים
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-gray-400">טוען מאמרים...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 flex items-center justify-center">
              <Search className="w-16 h-16 text-cyan-400/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              אין פוסטים עדיין
            </h3>
            <p className="text-gray-400">
              נסה לשנות את קריטריוני החיפוש או הקטגוריה
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-900/50 border border-cyan-400/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-400 transition-colors"
            >
              הקודם
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                          : "bg-slate-900/50 border border-cyan-400/20 text-gray-400 hover:border-cyan-400 hover:text-cyan-400"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-600">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-slate-900/50 border border-cyan-400/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-400 transition-colors"
            >
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
