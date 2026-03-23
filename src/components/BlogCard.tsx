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
  מדריכים: "bg-cyan-400/15 text-cyan-300 border-cyan-400/25",
  חדשות: "bg-purple-400/15 text-purple-300 border-purple-400/25",
  טיפים: "bg-orange-400/15 text-orange-300 border-orange-400/25",
  עדכונים: "bg-pink-400/15 text-pink-300 border-pink-400/25",
  טכני: "bg-blue-400/15 text-blue-300 border-blue-400/25",
  guides: "bg-cyan-400/15 text-cyan-300 border-cyan-400/25",
  news: "bg-purple-400/15 text-purple-300 border-purple-400/25",
  tips: "bg-orange-400/15 text-orange-300 border-orange-400/25",
  updates: "bg-pink-400/15 text-pink-300 border-pink-400/25",
  technical: "bg-blue-400/15 text-blue-300 border-blue-400/25",
  Guides: "bg-cyan-400/15 text-cyan-300 border-cyan-400/25",
  News: "bg-purple-400/15 text-purple-300 border-purple-400/25",
  Tips: "bg-orange-400/15 text-orange-300 border-orange-400/25",
  Updates: "bg-pink-400/15 text-pink-300 border-pink-400/25",
  Technical: "bg-blue-400/15 text-blue-300 border-blue-400/25",
};

export default function BlogCard({ post }: BlogCardProps) {
  const categoryColor = categoryColors[post.category] || "bg-gray-400/15 text-gray-300 border-gray-400/25";

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
      <article className="glass-card h-full flex flex-col group overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(45,212,191,0.1)]">
        {/* Cover Image with overlay */}
        <div className="relative w-full h-52 overflow-hidden bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-transparent opacity-60" />

          {/* Category badge on image */}
          <div className="absolute top-4 right-4 z-10">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${categoryColor}`}>
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 leading-relaxed mb-5 flex-grow line-clamp-2 text-sm font-light">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400/70" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400/70" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400/70" />
              <span>{post.reading_time} דקות</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400/70" />
              <span>{post.views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
