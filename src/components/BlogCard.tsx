"use client";

import Link from "next/link";
import { Calendar, Clock, Eye, User } from "lucide-react";

export interface BlogCardProps {
  post: {
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
  };
}

const categoryColors: Record<string, string> = {
  מדריכים: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  חדשות: "bg-purple-400/20 text-purple-300 border-purple-400/30",
  טיפים: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  עדכונים: "bg-pink-400/20 text-pink-300 border-pink-400/30",
  טכני: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  Guides: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  News: "bg-purple-400/20 text-purple-300 border-purple-400/30",
  Tips: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  Updates: "bg-pink-400/20 text-pink-300 border-pink-400/30",
  Technical: "bg-blue-400/20 text-blue-300 border-blue-400/30",
};

export default function BlogCard({ post }: BlogCardProps) {
  const categoryColor = categoryColors[post.category] || "bg-gray-400/20 text-gray-300 border-gray-400/30";

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="glass-card p-6 h-full flex flex-col group">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to gradient background if image fails
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Category Badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${categoryColor}`}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-400 leading-relaxed mb-4 flex-grow line-clamp-2">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cyan-400/20 text-sm text-gray-400">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>{post.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>{post.reading_time} דקות</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>{post.views.toLocaleString()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
