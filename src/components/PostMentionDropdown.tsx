"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Loader2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
}

interface PostMentionDropdownProps {
  searchTerm: string;
  isVisible: boolean;
  onSelect: (post: Post) => void;
  onClose: () => void;
  selectedIndex: number;
}

export default function PostMentionDropdown({
  searchTerm,
  isVisible,
  onSelect,
  onClose,
  selectedIndex,
}: PostMentionDropdownProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const fetchPosts = useCallback(async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const response = await fetch("/api/posts?limit=100");
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts || []);
        setFetched(true);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [fetched]);

  useEffect(() => {
    if (isVisible && !fetched) {
      fetchPosts();
    }
  }, [isVisible, fetched, fetchPosts]);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(posts);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(
        posts.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.slug.includes(term)
        )
      );
    }
  }, [searchTerm, posts]);

  // Scroll selected item into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Close on click outside
  useEffect(() => {
    if (!isVisible) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 w-80 max-h-64 overflow-y-auto
        bg-slate-800 border border-cyan-400/30 rounded-lg shadow-2xl"
      style={{ bottom: "100%", marginBottom: "4px", right: 0 }}
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-500">
        בחר פוסט לתיוג
      </div>

      {loading ? (
        <div className="p-4 text-center">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          לא נמצאו פוסטים
        </div>
      ) : (
        filtered.slice(0, 10).map((post, idx) => (
          <button
            key={post.id}
            ref={idx === selectedIndex ? selectedRef : null}
            onClick={() => onSelect(post)}
            className={`w-full text-right px-4 py-3 flex items-center gap-3
              transition-colors border-b border-white/5 last:border-b-0
              ${idx === selectedIndex ? "bg-cyan-400/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
          >
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt=""
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {post.title}
              </p>
              <p className="text-gray-500 text-xs truncate">
                /blog/{post.slug}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

export type { Post as MentionPost };
