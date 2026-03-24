"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Copy,
  Check,
  Star,
  Download,
  ExternalLink,
  Package,
  Tag,
  User,
  Clock,
  Loader2,
} from "lucide-react";

interface Skill {
  id: number;
  name: string;
  slug: string;
  description: string;
  readme: string;
  category: string;
  tags: string;
  author: string;
  version: string;
  install_command: string;
  github_url: string | null;
  screenshot_url: string | null;
  dependencies: string | null;
  is_approved: boolean;
  downloads: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

function renderMarkdown(text: string): string {
  const lines = text.split('\n');
  const blocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${headingMatch[2]}</h${level}>`);
      i++;
      continue;
    }

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Collect paragraph lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,6}\s/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push(`<p>${paraLines.join('<br>')}</p>`);
    }
  }

  let html = blocks.join('\n');

  // Apply inline formatting
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(220,38,38,0.1);padding:2px 6px;border-radius:4px;font-size:0.9em;">$1</code>');

  return html;
}

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchSkill = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/skills/${slug}`);
        const result = await response.json();

        if (!result.success) {
          setError(result.error?.message || 'Failed to load skill');
          return;
        }

        setSkill(result.data);

        // Check if user has already rated this skill
        const ratedKey = `rated_skill_${result.data.id}`;
        const hasRatedBefore = localStorage.getItem(ratedKey) === 'true';
        setHasRated(hasRatedBefore);
      } catch (err) {
        setError('Failed to load skill');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [slug]);

  const handleCopyInstallCommand = () => {
    if (skill?.install_command) {
      navigator.clipboard.writeText(skill.install_command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRateSkill = async (rating: number) => {
    if (!skill || hasRated || submittingRating) return;

    try {
      setSubmittingRating(true);
      const response = await fetch(`/api/skills/${skill.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      const result = await response.json();

      if (result.success) {
        setSkill(result.data);
        setUserRating(rating);
        setHasRated(true);
        localStorage.setItem(`rated_skill_${skill.id}`, 'true');
      }
    } catch (err) {
      console.error('Failed to rate skill:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">טוען סקיל...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">סקיל לא נמצא</h1>
          <p className="text-gray-400 mb-6">{error || 'Skill not found'}</p>
          <button
            onClick={() => router.push('/skills')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה לסקילים
          </button>
        </div>
      </div>
    );
  }

  const tags = skill.tags ? skill.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const dependencies = skill.dependencies ? skill.dependencies.split(',').map(d => d.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <button onClick={() => router.push('/')} className="hover:text-red-400 transition-colors">
            בית
          </button>
          <span>/</span>
          <button onClick={() => router.push('/skills')} className="hover:text-red-400 transition-colors">
            סקילים
          </button>
          <span>/</span>
          <span className="text-white">{skill.name}</span>
        </nav>

        {/* Main Content */}
        <div className="glass-card p-8 mb-6 animate-slideUp">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-grow">
                <h1 className="text-4xl font-black text-gradient mb-2">{skill.name}</h1>
                <p className="text-xl text-gray-400">{skill.description}</p>
              </div>
              {skill.screenshot_url && (
                <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-red-500/20">
                  <img
                    src={skill.screenshot_url}
                    alt={skill.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium border border-red-500/20">
                <User className="w-4 h-4" />
                {skill.author}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-400/10 text-red-300 rounded-lg text-sm font-medium border border-red-400/20">
                <Clock className="w-4 h-4" />
                v{skill.version}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-400/10 text-orange-300 rounded-lg text-sm font-medium border border-orange-400/20">
                <Tag className="w-4 h-4" />
                {skill.category}
              </span>
            </div>
          </div>

          {/* Screenshot/Cover (if large display) */}
          {skill.screenshot_url && (
            <div className="mb-8 rounded-xl overflow-hidden border border-red-500/10">
              <img
                src={skill.screenshot_url}
                alt={`${skill.name} screenshot`}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Install Command Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-red-500" />
              התקנה
            </h2>
            <div className="relative">
              <pre className="bg-[#0a0a0a] border border-red-500/20 rounded-xl p-4 overflow-x-auto text-sm">
                <code className="text-gray-300 font-mono">{skill.install_command}</code>
              </pre>
              <button
                onClick={handleCopyInstallCommand}
                className="absolute top-4 left-4 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                title={copied ? 'הועתק!' : 'העתק'}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-red-400" />
                )}
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Download className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold text-white">{skill.downloads.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-400">הורדות</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(skill.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {skill.rating.toFixed(1)} ({skill.rating_count} דירוגים)
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-bold text-white">{skill.version}</span>
              </div>
              <p className="text-sm text-gray-400">גרסה</p>
            </div>
          </div>

          {/* Rate this skill */}
          <div className="mb-8 p-6 bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-3">דרג סקיל זה</h3>
            {hasRated ? (
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span>תודה על הדירוג שלך!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateSkill(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      disabled={submittingRating}
                      className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredStar || userRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600 hover:text-gray-500'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {submittingRating && (
                  <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                )}
              </div>
            )}
          </div>

          {/* README Section */}
          {skill.readme && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-red-500" />
                תיעוד
              </h2>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(skill.readme) }}
              />
            </div>
          )}

          {/* GitHub Link */}
          {skill.github_url && (
            <div className="mb-8">
              <a
                href={skill.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                צפה ב-GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Dependencies */}
          {dependencies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-red-500" />
                תלויות
              </h2>
              <div className="flex flex-wrap gap-2">
                {dependencies.map((dep, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg text-sm font-medium border border-gray-700/50"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6 text-red-500" />
                תגיות
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium border border-red-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-6 border-t border-red-500/10">
            <button
              onClick={() => router.push('/skills')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה לכל הסקילים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
