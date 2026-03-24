"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Star,
  Package,
  Plus,
  Loader2,
  Tag,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  author: string;
  version: string;
  install_command: string;
  github_url: string | null;
  screenshot_url: string | null;
  downloads: number;
  rating: number;
  rating_count: number;
  created_at: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORIES = [
  { value: "all", label: "הכל" },
  { value: "automation", label: "אוטומציה" },
  { value: "communication", label: "תקשורת" },
  { value: "data", label: "נתונים" },
  { value: "utilities", label: "כלי עזר" },
  { value: "integrations", label: "אינטגרציות" },
  { value: "ai", label: "בינה מלאכותית" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, pagination.page]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/skills?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSkills(result.data.skills);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchSkills();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPagination({ ...pagination, page: 1 });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= roundedRating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          }`}
        />
      );
    }

    return stars;
  };

  const parseTags = (tagsString: string): string[] => {
    if (!tagsString) return [];
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16 animate-slideDown">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 mb-6">
            <Package className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-500">
              ספריית הסקילים
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gradient">
            גלה סקילים מדהימים
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            עיין בספריית הסקילים של הקהילה והוסף יכולות חדשות ל-OpenClaw שלך
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slideUp animate-stagger-1">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש סקילים לפי שם, תיאור או תגיות..."
                className="w-full pr-12 pl-4 py-4 bg-black/40 border border-red-600/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/40 focus:ring-2 focus:ring-red-600/20 transition-all"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
              >
                חפש
              </button>
            </div>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-12 animate-slideUp animate-stagger-2">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.value
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-black/40 text-gray-400 border border-red-600/20 hover:border-red-600/40 hover:text-white"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Skill Button */}
        <div className="mb-12 text-center animate-slideUp animate-stagger-3">
          <Link href="/skills/submit" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>שלח Skill</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && skills.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-300 mb-3">
              לא נמצאו סקילים
            </h3>
            <p className="text-gray-500 mb-8">
              נסה לשנות את הקטגוריה או את מילות החיפוש
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {!loading && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {skills.map((skill, index) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.slug}`}
                className={`glass-card p-6 group animate-slideUp animate-stagger-${
                  (index % 6) + 1
                }`}
              >
                {/* Screenshot */}
                {skill.screenshot_url && (
                  <div className="mb-4 overflow-hidden rounded-lg bg-black/40">
                    <img
                      src={skill.screenshot_url}
                      alt={skill.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
                    {
                      CATEGORIES.find((c) => c.value === skill.category)
                        ?.label || skill.category
                    }
                  </span>
                </div>

                {/* Skill Name */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {skill.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>

                {/* Author */}
                <div className="text-xs text-gray-500 mb-3">
                  by <span className="text-red-500 font-semibold">{skill.author}</span>
                </div>

                {/* Tags */}
                {skill.tags && parseTags(skill.tags).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parseTags(skill.tags).slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-black/40 text-gray-400 rounded border border-gray-700"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  {/* Downloads */}
                  <div className="flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">
                      {skill.downloads.toLocaleString()}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {renderStars(skill.rating)}
                    <span className="text-xs text-gray-500 mr-1">
                      ({skill.rating_count})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 animate-fadeIn">
            <button
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-black/40 border border-red-600/20 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-600/40 transition-all"
            >
              הקודם
            </button>

            <div className="flex gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const current = pagination.page;
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= current - 1 && page <= current + 1)
                  );
                })
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-2">
                      {showEllipsis && (
                        <span className="text-gray-500 px-2">...</span>
                      )}
                      <button
                        onClick={() =>
                          setPagination({ ...pagination, page })
                        }
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          pagination.page === page
                            ? "bg-red-600 text-white"
                            : "bg-black/40 border border-red-600/20 text-gray-400 hover:border-red-600/40 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-black/40 border border-red-600/20 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-600/40 transition-all"
            >
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
