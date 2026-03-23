"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Shield,
  Users,
  Puzzle,
  Plug,
  Clock,
  Download,
  BookOpen,
  ChevronDown,
  Sparkles,
  Rocket,
  Code2,
  Globe,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [tocExpanded, setTocExpanded] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleDownload = (edition: string) => {
    console.log(`Downloading ${edition} edition`);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "download", { edition });
    }
  };

  const features = [
    {
      icon: MessageSquare,
      titleHe: "ערוצי תקשורת",
      titleEn: "Communication Channels",
      description:
        "WhatsApp, Telegram, Discord, Slack, Gmail - כל הערוצים במקום אחד",
      color: "cyan",
      number: "01",
    },
    {
      icon: Shield,
      titleHe: "בידוד קונטיינרים",
      titleEn: "Container Isolation",
      description: "כל סוכן רץ בקונטיינר Linux מבודד עם אבטחה מקסימלית",
      color: "purple",
      number: "02",
    },
    {
      icon: Users,
      titleHe: "נחילי סוכנים",
      titleEn: "Agent Swarms",
      description: "הרץ מספר סוכנים במקביל עם תיאום ושיתוף פעולה חכם",
      color: "orange",
      number: "03",
    },
    {
      icon: Puzzle,
      titleHe: "מערכת סקילס",
      titleEn: "Skills System",
      description: "הרחב את היכולות עם סקילים מותאמים אישית לכל צורך",
      color: "cyan",
      number: "04",
    },
    {
      icon: Plug,
      titleHe: "אינטגרציות MCP",
      titleEn: "MCP Integration",
      description: "התחבר לשירותים חיצוניים בקלות עם Model Context Protocol",
      color: "purple",
      number: "05",
    },
    {
      icon: Clock,
      titleHe: "משימות מתוזמנות",
      titleEn: "Scheduled Tasks",
      description: "הגדר משימות אוטומטיות שרצות בזמנים מוגדרים מראש",
      color: "orange",
      number: "06",
    },
  ];

  const tocItems = [
    { number: "00", title: "Introduction to OpenClaw", titleHe: "הקדמה" },
    { number: "01", title: "Installation & Configuration", titleHe: "התקנה והגדרות" },
    { number: "02", title: "Deep Architecture Dive", titleHe: "צלילה עמוקה לארכיטקטורה" },
    { number: "03", title: "Communication Channels", titleHe: "ערוצי תקשורת" },
    { number: "04", title: "Container Isolation & Security", titleHe: "בידוד ואבטחה" },
    { number: "05", title: "Memory & Context System", titleHe: "מערכת זיכרון והקשר" },
    { number: "06", title: "The Skills System", titleHe: "מערכת הסקילס" },
    { number: "07", title: "Scheduled Tasks", titleHe: "משימות מתוזמנות" },
    { number: "08", title: "Agent Swarms", titleHe: "נחילי סוכנים" },
    { number: "09", title: "Advanced Customization", titleHe: "התאמה אישית מתקדמת" },
    { number: "10", title: "Integrations & MCP", titleHe: "אינטגרציות ו-MCP" },
    { number: "11", title: "Contributing to OpenClaw", titleHe: "תרומה לפרויקט" },
    { number: "12", title: "Production Deployment", titleHe: "פריסה לפרודקשן" },
    { number: "13", title: "Troubleshooting", titleHe: "פתרון בעיות" },
    { number: "A", title: "Complete Command Reference", titleHe: "מדריך פקודות מלא" },
  ];

  const colorClasses: Record<string, { icon: string; bg: string; border: string; glow: string }> = {
    cyan: {
      icon: "text-cyan-400",
      bg: "bg-gradient-to-br from-cyan-400/15 to-cyan-400/5",
      border: "card-accent-cyan",
      glow: "group-hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]",
    },
    purple: {
      icon: "text-purple-400",
      bg: "bg-gradient-to-br from-purple-400/15 to-purple-400/5",
      border: "card-accent-purple",
      glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    },
    orange: {
      icon: "text-orange-400",
      bg: "bg-gradient-to-br from-orange-400/15 to-orange-400/5",
      border: "card-accent-orange",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    },
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section
        id="hero"
        data-animate
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
          visibleSections.has("hero") ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Morphing gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(45,212,191,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Floating badge */}
            <div className="mb-8 animate-slideDown">
              <span className="floating-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-cyan-300">
                <Zap className="w-4 h-4" />
                <span>The #1 AI Assistant Platform</span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              </span>
            </div>

            {/* Logo */}
            <div className="mb-10 flex justify-center animate-slideDown">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-orange-500/20 blur-xl animate-pulse-slow" />
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl relative z-10">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="url(#logoGradient)" strokeWidth="2" filter="url(#glow)" className="animate-spin-slow" strokeDasharray="8 4" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.3" />
                  <g transform="translate(100, 100)">
                    <circle cx="0" cy="0" r="15" fill="url(#logoGradient)" filter="url(#glow)" />
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <g key={i} transform={`rotate(${angle})`}>
                        <path d="M 0,-15 L 8,-70 L 0,-60 L -8,-70 Z" fill="url(#logoGradient)" opacity="0.8" filter="url(#glow)" />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 animate-slideUp tracking-tight">
              <span className="text-gradient">OpenClaw Hub</span>
            </h1>

            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-cyan-300/90 animate-slideUp">
              פלטפורמת העוזר האישי AI הכי חזקה בעולם
            </p>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 mb-14 animate-slideUp font-light">
              Multi-channel AI assistant with container-level security
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slideUp">
              <a href="#books" className="btn-primary inline-flex items-center justify-center gap-2.5 text-lg px-10 py-5">
                <Download className="w-5 h-5" />
                הורד את הספר בחינם
              </a>
              <a href="/blog" className="btn-secondary inline-flex items-center justify-center gap-2.5 text-lg px-10 py-5">
                <BookOpen className="w-5 h-5" />
                קרא בבלוג
              </a>
            </div>

            {/* Stats bar */}
            <div className="glass-card inline-block px-10 py-5 animate-slideUp animate-glow-pulse">
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm sm:text-base">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-400/10"><Code2 className="w-5 h-5 text-cyan-400" /></div>
                  <span className="text-white font-bold text-lg">500K+</span>
                  <span className="text-gray-400">שורות קוד</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-400/10"><Globe className="w-5 h-5 text-purple-400" /></div>
                  <span className="text-white font-bold text-lg">53</span>
                  <span className="text-gray-400">קבצי קונפיג</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent" />
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-400/10"><Puzzle className="w-5 h-5 text-orange-400" /></div>
                  <span className="text-white font-bold text-lg">70+</span>
                  <span className="text-gray-400">תלויות</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-orange-400/30 to-transparent" />
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-400/10"><Sparkles className="w-5 h-5 text-cyan-400" /></div>
                  <span className="text-white font-bold text-lg">&infin;</span>
                  <span className="text-gray-400">אפשרויות</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-gray-500 tracking-widest uppercase">scroll</span>
            <ChevronDown className="w-6 h-6 text-cyan-400/60" />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FEATURES SECTION */}
      <section
        id="features"
        data-animate
        className={`py-28 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight">
              <span className="text-cyan-400">למה</span>{" "}
              <span className="text-white">OpenClaw?</span>
            </h2>
            <p className="text-xl text-gray-500 font-light">Why OpenClaw?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = colorClasses[feature.color];
              return (
                <div
                  key={index}
                  className={`glass-card p-8 group ${colors.border} ${colors.glow} transition-all duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-start h-full">
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className={`p-3.5 rounded-xl ${colors.bg}`}>
                        <Icon className={`w-7 h-7 ${colors.icon} transition-colors`} />
                      </div>
                      <span className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                        {feature.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                      {feature.titleHe}
                    </h3>
                    <p className="text-base text-gray-500 mb-4 font-light">{feature.titleEn}</p>
                    <p className="text-gray-400 leading-relaxed flex-grow font-light">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* BOOKS SECTION */}
      <section
        id="books"
        data-animate
        className={`py-28 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("books") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight">
              <span className="text-gradient">הספרים</span>
            </h2>
            <p className="text-xl text-gray-500 font-light">The Books</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 max-w-5xl mx-auto">
            {/* Hebrew Edition */}
            <div className="group">
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(45,212,191,0.15)]">
                <div className="relative mb-8 aspect-[3/4] rounded-xl overflow-hidden">
                  <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-orange-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-gradient-to-br from-cyan-500 via-purple-600 to-orange-500 p-[2px] rounded-xl h-full">
                    <div className="w-full h-full bg-[#060a14] rounded-xl flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 mb-6 animate-float">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#logoGradient)" strokeWidth="3" />
                          <g transform="translate(100, 100)">
                            <circle cx="0" cy="0" r="15" fill="#2dd4bf" />
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                              <g key={i} transform={`rotate(${angle})`}>
                                <path d="M 0,-15 L 8,-70 L 0,-60 L -8,-70 Z" fill="#8b5cf6" opacity="0.8" />
                              </g>
                            ))}
                          </g>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">OpenClaw</h3>
                      <p className="text-lg text-cyan-300 mb-4 font-light">המדריך המקיף והשלם</p>
                      <p className="text-sm text-gray-500">מהדורת 2026</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300 rounded-full text-sm font-medium border border-cyan-400/20">עברית</span>
                  <span className="px-3 py-1 bg-purple-400/10 text-purple-300 rounded-full text-sm font-medium border border-purple-400/20">300+ עמודים</span>
                  <span className="px-3 py-1 bg-orange-400/10 text-orange-300 rounded-full text-sm font-medium border border-orange-400/20">מהדורת 2026</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow font-light">
                  המדריך המלא והמקיף ביותר ל-OpenClaw בעברית. כולל הסברים מפורטים, דוגמאות קוד, וכל מה שצריך כדי להפוך למומחה בפלטפורמה.
                </p>
                <a href="/books/OpenClaw_Complete_Guide_2026.pdf" onClick={() => handleDownload("hebrew")} className="btn-primary inline-flex items-center justify-center gap-2 w-full text-center">
                  <Download className="w-5 h-5" />
                  הורד גרסה עברית
                </a>
              </div>
            </div>

            {/* English Edition */}
            <div className="group">
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)]">
                <div className="relative mb-8 aspect-[3/4] rounded-xl overflow-hidden">
                  <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 via-cyan-600/20 to-orange-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-gradient-to-br from-purple-500 via-cyan-600 to-orange-500 p-[2px] rounded-xl h-full">
                    <div className="w-full h-full bg-[#060a14] rounded-xl flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 mb-6 animate-float" style={{ animationDelay: "-2s" }}>
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#logoGradient)" strokeWidth="3" />
                          <g transform="translate(100, 100)">
                            <circle cx="0" cy="0" r="15" fill="#8b5cf6" />
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                              <g key={i} transform={`rotate(${angle})`}>
                                <path d="M 0,-15 L 8,-70 L 0,-60 L -8,-70 Z" fill="#2dd4bf" opacity="0.8" />
                              </g>
                            ))}
                          </g>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">OpenClaw</h3>
                      <p className="text-lg text-purple-300 mb-4 font-light">The Complete Mastery Guide</p>
                      <p className="text-sm text-gray-500">2026 Edition</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-400/10 text-purple-300 rounded-full text-sm font-medium border border-purple-400/20">English</span>
                  <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300 rounded-full text-sm font-medium border border-cyan-400/20">300+ Pages</span>
                  <span className="px-3 py-1 bg-orange-400/10 text-orange-300 rounded-full text-sm font-medium border border-orange-400/20">2026 Edition</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow font-light">
                  The most comprehensive guide to OpenClaw in English. Includes detailed explanations, code examples, and everything you need to become an expert in the platform.
                </p>
                <a href="/books/OpenClaw_Complete_Guide_2026_EN.pdf" onClick={() => handleDownload("english")} className="btn-primary inline-flex items-center justify-center gap-2 w-full text-center">
                  <Download className="w-5 h-5" />
                  Download English Version
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* TABLE OF CONTENTS */}
      <section
        id="toc"
        data-animate
        className={`py-28 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("toc") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight">
              <span className="text-purple-400">תוכן</span>{" "}
              <span className="text-white">הספר</span>
            </h2>
            <p className="text-xl text-gray-500 font-light">Table of Contents</p>
          </div>

          <div className="glass-card p-8">
            <button onClick={() => setTocExpanded(!tocExpanded)} className="w-full flex items-center justify-between text-right mb-6 group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-400/15 to-purple-400/5 rounded-xl group-hover:from-purple-400/25 group-hover:to-purple-400/10 transition-all">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">15 פרקים מקיפים</h3>
                  <p className="text-gray-500 font-light">מהיסודות ועד התקדמות מקסימלית</p>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-cyan-400/10 transition-transform duration-300 ${tocExpanded ? "rotate-180" : ""}`}>
                <ChevronDown className="w-5 h-5 text-cyan-400" />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${tocExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="space-y-2 pt-4 border-t border-cyan-400/10">
                {tocItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all duration-300 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/10 to-purple-400/10 flex items-center justify-center group-hover:from-cyan-400/20 group-hover:to-purple-400/20 transition-all">
                      <span className="text-lg font-bold text-cyan-400">{item.number}</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-semibold text-white mb-0.5 group-hover:text-cyan-300 transition-colors">{item.titleHe}</h4>
                      <p className="text-gray-500 text-sm font-light">{item.title}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 -rotate-90 group-hover:text-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ABOUT SECTION */}
      <section
        id="about"
        data-animate
        className={`py-28 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight">
              <span className="text-orange-400">אודות</span>
            </h2>
            <p className="text-xl text-gray-500 font-light">About</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 card-accent-orange group hover:shadow-[0_20px_60px_rgba(245,158,11,0.1)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-400/15 to-orange-400/5 rounded-xl">
                  <Rocket className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">אריאל אייזנשטט</h3>
                  <p className="text-lg text-gray-400 font-light">Ariel Eisenstadt</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-400 leading-relaxed font-light">
                <p><span className="text-cyan-400 font-semibold">Founder of PixMind Studio</span> - אולפן ליצירת תוכן ויזואלי מבוסס AI</p>
                <p><span className="text-purple-400 font-semibold">Developer of PixiBot</span> - סטארטאפ AI לאוטומציה חכמה</p>
                <p><span className="text-orange-400 font-semibold">Software Engineering Student</span> - גיל 18, חלוץ בתחום ה-AI בישראל</p>
                <div className="pt-4 border-t border-orange-400/10">
                  <p>כתב את OpenClaw כפרויקט קוד פתוח למען הקהילה, עם למעלה מ-500,000 שורות קוד ומסמכים מקיפים.</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 card-accent-cyan group hover:shadow-[0_20px_60px_rgba(45,212,191,0.1)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-400/15 to-cyan-400/5 rounded-xl">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">OpenClaw Bot</h3>
                  <p className="text-lg text-gray-400 font-light">The AI Behind This Blog</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-400 leading-relaxed font-light">
                <p>הבלוג של האתר מופעל על ידי <span className="text-cyan-400 font-semibold">OpenClaw AI Bot</span> שרץ על שרת VPS.</p>
                <p>הבוט כותב פוסטים אוטומטיים, מנתח טרנדים, ומשתף תובנות טכנולוגיות חדשות בזמן אמת.</p>
                <p><span className="text-purple-400 font-semibold">Powered by Claude Agent SDK</span> - מערכת הסוכנים המתקדמת ביותר מבית Anthropic</p>
                <div className="pt-4 border-t border-cyan-400/10">
                  <p>כל פוסט בבלוג הוא הוכחה חיה ליכולות OpenClaw - יצירת תוכן אוטונומית ברמה גבוהה.</p>
                </div>
              </div>
              <a href="/blog" className="btn-secondary mt-6 inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                קרא את הבלוג
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA SECTION */}
      <section
        id="cta"
        data-animate
        className={`py-28 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border-card">
            <div className="p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 50%, rgba(45,212,191,0.15), transparent 60%), radial-gradient(circle at 70% 50%, rgba(139,92,246,0.15), transparent 60%)" }} />
              <div className="relative z-10">
                <div className="inline-block p-5 bg-gradient-to-br from-cyan-400/15 to-purple-400/15 rounded-2xl mb-8 animate-float">
                  <Rocket className="w-14 h-14 text-cyan-400" />
                </div>
                <h2 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight">
                  <span className="text-white">מוכנים</span>{" "}
                  <span className="text-gradient">להתחיל?</span>
                </h2>
                <p className="text-xl text-gray-400 mb-4 font-light">Ready to Start?</p>
                <p className="text-gray-500 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
                  הורד את הספר המלא בחינם והתחל לבנות את פלטפורמת ה-AI האישית שלך עוד היום. 300+ עמודים של ידע טכנולוגי מתקדם מחכים לך.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#books" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5">
                    <Download className="w-5 h-5" />
                    הורד את הספר עכשיו
                  </a>
                  <a href="/blog" className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-10 py-5">
                    <BookOpen className="w-5 h-5" />
                    חקור את הבלוג
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
