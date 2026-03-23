"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronUp,
  Sparkles,
  Rocket,
  Code2,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [tocExpanded, setTocExpanded] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  // Intersection Observer for scroll animations
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
    // Track download clicks
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "download", {
        edition: edition,
      });
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
    },
    {
      icon: Shield,
      titleHe: "בידוד קונטיינרים",
      titleEn: "Container Isolation",
      description: "כל סוכן רץ בקונטיינר Linux מבודד עם אבטחה מקסימלית",
      color: "purple",
    },
    {
      icon: Users,
      titleHe: "נחילי סוכנים",
      titleEn: "Agent Swarms",
      description: "הרץ מספר סוכנים במקביל עם תיאום ושיתוף פעולה חכם",
      color: "orange",
    },
    {
      icon: Puzzle,
      titleHe: "מערכת סקילס",
      titleEn: "Skills System",
      description: "הרחב את היכולות עם סקילים מותאמים אישית לכל צורך",
      color: "cyan",
    },
    {
      icon: Plug,
      titleHe: "אינטגרציות MCP",
      titleEn: "MCP Integration",
      description: "התחבר לשירותים חיצוניים בקלות עם Model Context Protocol",
      color: "purple",
    },
    {
      icon: Clock,
      titleHe: "משימות מתוזמנות",
      titleEn: "Scheduled Tasks",
      description: "הגדר משימות אוטומטיות שרצות בזמנים מוגדרים מראש",
      color: "orange",
    },
  ];

  const tocItems = [
    { number: "00", title: "Introduction to OpenClaw", titleHe: "הקדמה" },
    {
      number: "01",
      title: "Installation & Configuration",
      titleHe: "התקנה והגדרות",
    },
    {
      number: "02",
      title: "Deep Architecture Dive",
      titleHe: "צלילה עמוקה לארכיטקטורה",
    },
    {
      number: "03",
      title: "Communication Channels",
      titleHe: "ערוצי תקשורת",
    },
    {
      number: "04",
      title: "Container Isolation & Security",
      titleHe: "בידוד ואבטחה",
    },
    {
      number: "05",
      title: "Memory & Context System",
      titleHe: "מערכת זיכרון והקשר",
    },
    { number: "06", title: "The Skills System", titleHe: "מערכת הסקילס" },
    { number: "07", title: "Scheduled Tasks", titleHe: "משימות מתוזמנות" },
    { number: "08", title: "Agent Swarms", titleHe: "נחילי סוכנים" },
    {
      number: "09",
      title: "Advanced Customization",
      titleHe: "התאמה אישית מתקדמת",
    },
    {
      number: "10",
      title: "Integrations & MCP",
      titleHe: "אינטגרציות ו-MCP",
    },
    {
      number: "11",
      title: "Contributing to OpenClaw",
      titleHe: "תרומה לפרויקט",
    },
    {
      number: "12",
      title: "Production Deployment",
      titleHe: "פריסה לפרודקשן",
    },
    { number: "13", title: "Troubleshooting", titleHe: "פתרון בעיות" },
    {
      number: "A",
      title: "Complete Command Reference",
      titleHe: "מדריך פקודות מלא",
    },
  ];

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
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="mb-8 flex justify-center animate-slideDown">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full drop-shadow-2xl"
                >
                  {/* Outer circle with gradient */}
                  <defs>
                    <linearGradient
                      id="logoGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
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
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="animate-pulse-slow"
                  />
                  {/* Compass/Claw design */}
                  <g transform="translate(100, 100)">
                    {/* Center circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="15"
                      fill="url(#logoGradient)"
                      filter="url(#glow)"
                    />
                    {/* Claw points */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <g key={i} transform={`rotate(${angle})`}>
                        <path
                          d="M 0,-15 L 8,-70 L 0,-60 L -8,-70 Z"
                          fill="url(#logoGradient)"
                          opacity="0.8"
                          filter="url(#glow)"
                        />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 animate-slideUp">
              <span className="bg-gradient-to-l from-cyan-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                OpenClaw Hub
              </span>
            </h1>

            {/* Hebrew subtitle */}
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-cyan-400 animate-slideUp">
              פלטפורמת העוזר האישי AI הכי חזקה בעולם
            </p>

            {/* English subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 animate-slideUp">
              Multi-channel AI assistant with container-level security
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slideUp">
              <a
                href="#books"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <Download className="w-5 h-5" />
                הורד את הספר בחינם
              </a>
              <a
                href="/blog"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <BookOpen className="w-5 h-5" />
                קרא בבלוג
              </a>
            </div>

            {/* Stats bar */}
            <div className="glass-card inline-block px-8 py-4 animate-slideUp">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold">500K+</span>
                  <span className="text-gray-400">שורות קוד</span>
                </div>
                <div className="hidden sm:block text-gray-600">|</div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-bold">53</span>
                  <span className="text-gray-400">קבצי קונפיג</span>
                </div>
                <div className="hidden sm:block text-gray-600">|</div>
                <div className="flex items-center gap-2">
                  <Puzzle className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-bold">70+</span>
                  <span className="text-gray-400">תלויות</span>
                </div>
                <div className="hidden sm:block text-gray-600">|</div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold">∞</span>
                  <span className="text-gray-400">אפשרויות</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        data-animate
        className={`py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("features")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          {/* Section title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-cyan-400">למה</span>{" "}
              <span className="text-white">OpenClaw?</span>
            </h2>
            <p className="text-xl text-gray-400">Why OpenClaw?</p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                cyan: "text-cyan-400 group-hover:text-cyan-300",
                purple: "text-purple-400 group-hover:text-purple-300",
                orange: "text-orange-400 group-hover:text-orange-300",
              };

              return (
                <div
                  key={index}
                  className="glass-card p-8 group"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex flex-col items-start h-full">
                    {/* Icon */}
                    <div
                      className={`mb-6 p-3 rounded-xl transition-all ${
                        feature.color === "cyan"
                          ? "bg-cyan-400/10"
                          : feature.color === "purple"
                          ? "bg-purple-400/10"
                          : "bg-orange-400/10"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          colorClasses[
                            feature.color as keyof typeof colorClasses
                          ]
                        } transition-colors`}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {feature.titleHe}
                    </h3>
                    <p className="text-lg text-gray-400 mb-4">
                      {feature.titleEn}
                    </p>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOKS SECTION */}
      <section
        id="books"
        data-animate
        className={`py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("books")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          {/* Section title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-l from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                הספרים
              </span>
            </h2>
            <p className="text-xl text-gray-400">The Books</p>
          </div>

          {/* Books grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Hebrew Edition */}
            <div className="glass-card p-8 group">
              <div className="flex flex-col h-full">
                {/* Book cover mockup */}
                <div className="relative mb-8 aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 via-purple-600 to-orange-500 p-1">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 mb-6">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="url(#logoGradient)"
                          strokeWidth="3"
                        />
                        <g transform="translate(100, 100)">
                          <circle cx="0" cy="0" r="15" fill="#2dd4bf" />
                          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                            <g key={i} transform={`rotate(${angle})`}>
                              <path
                                d="M 0,-15 L 8,-70 L 0,-60 L -8,-70 Z"
                                fill="#8b5cf6"
                                opacity="0.8"
                              />
                            </g>
                          ))}
                        </g>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      OpenClaw
                    </h3>
                    <p className="text-lg text-cyan-300 mb-4">
                      המדריך המקיף והשלם
                    </p>
                    <p className="text-sm text-gray-400">מהדורת 2026</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-sm font-medium">
                    עברית
                  </span>
                  <span className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-sm font-medium">
                    300+ עמודים
                  </span>
                  <span className="px-3 py-1 bg-orange-400/20 text-orange-300 rounded-full text-sm font-medium">
                    מהדורת 2026
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-8 flex-grow">
                  המדריך המלא והמקיף ביותר ל-OpenClaw בעברית. כולל הסברים
                  מפורטים, דוגמאות קוד, וכל מה שצריך כדי להפוך למומחה בפלטפורמה.
                </p>

                {/* Download button */}
                <a
                  href="/books/OpenClaw_Complete_Guide_2026.pdf"
                  onClick={() => handleDownload("hebrew")}
                  className="btn-primary inline-flex items-center justify-center gap-2 w-full"
                >
                  <Download className="w-5 h-5" />
                  הורד גרסה עברית
                </a>
              </div>
            </div>

            {/* English Edition */}
            <div className="glass-card p-8 group">
              <div className="flex flex-col h-full">
                {/* Book cover mockup */}
                <div className="relative mb-8 aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 via-cyan-600 to-orange-500 p-1">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 mb-6">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="url(#logoGradient)"
                          strokeWidth="3"
                        />
                        <g transform="translate(100, 100)">
                          <circle cx="0" cy="0" r="15" fill="#8b5cf6" />
                          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                            <g key={i} transform={`rotate(${angle})`}>
                              <path
                                d="M 0,-15 L 8,-70 L 0,-60 L -8,-70 Z"
                                fill="#2dd4bf"
                                opacity="0.8"
                              />
                            </g>
                          ))}
                        </g>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      OpenClaw
                    </h3>
                    <p className="text-lg text-purple-300 mb-4">
                      The Complete Mastery Guide
                    </p>
                    <p className="text-sm text-gray-400">2026 Edition</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-sm font-medium">
                    English
                  </span>
                  <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-sm font-medium">
                    300+ Pages
                  </span>
                  <span className="px-3 py-1 bg-orange-400/20 text-orange-300 rounded-full text-sm font-medium">
                    2026 Edition
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-8 flex-grow">
                  The most comprehensive guide to OpenClaw in English. Includes
                  detailed explanations, code examples, and everything you need
                  to become an expert in the platform.
                </p>

                {/* Download button */}
                <a
                  href="/books/OpenClaw_Complete_Guide_2026_EN.pdf"
                  onClick={() => handleDownload("english")}
                  className="btn-primary inline-flex items-center justify-center gap-2 w-full"
                >
                  <Download className="w-5 h-5" />
                  Download English Version
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS SECTION */}
      <section
        id="toc"
        data-animate
        className={`py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("toc")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-4xl">
          {/* Section title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-purple-400">תוכן</span>{" "}
              <span className="text-white">הספר</span>
            </h2>
            <p className="text-xl text-gray-400">Table of Contents</p>
          </div>

          {/* TOC Card */}
          <div className="glass-card p-8">
            {/* Toggle button */}
            <button
              onClick={() => setTocExpanded(!tocExpanded)}
              className="w-full flex items-center justify-between text-right mb-6 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-400/10 rounded-lg group-hover:bg-purple-400/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    15 פרקים מקיפים
                  </h3>
                  <p className="text-gray-400">
                    מהיסודות ועד התקדמות מקסימלית
                  </p>
                </div>
              </div>
              {tocExpanded ? (
                <ChevronUp className="w-6 h-6 text-cyan-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-cyan-400" />
              )}
            </button>

            {/* TOC List */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                tocExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3 pt-4 border-t border-cyan-400/20">
                {tocItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-cyan-400">
                        {item.number}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {item.titleHe}
                      </h4>
                      <p className="text-gray-400 text-sm">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        data-animate
        className={`py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("about")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          {/* Section title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-orange-400">אודות</span>
            </h2>
            <p className="text-xl text-gray-400">About</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Author */}
            <div className="glass-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-orange-400/10 rounded-xl">
                  <Rocket className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    אריאל אייזנשטט
                  </h3>
                  <p className="text-xl text-gray-300">Ariel Eisenstadt</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  <span className="text-cyan-400 font-semibold">
                    Founder of PixMind Studio
                  </span>{" "}
                  - אולפן ליצירת תוכן ויזואלי מבוסס AI
                </p>
                <p>
                  <span className="text-purple-400 font-semibold">
                    Developer of PixiBot
                  </span>{" "}
                  - סטארטאפ AI לאוטומציה חכמה
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">
                    Software Engineering Student
                  </span>{" "}
                  - גיל 18, חלוץ בתחום ה-AI בישראל
                </p>
                <p className="pt-4 border-t border-cyan-400/20">
                  כתב את OpenClaw כפרויקט קוד פתוח למען הקהילה, עם למעלה מ-500,000
                  שורות קוד ומסמכים מקיפים.
                </p>
              </div>
            </div>

            {/* About OpenClaw Bot */}
            <div className="glass-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-cyan-400/10 rounded-xl">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    OpenClaw Bot
                  </h3>
                  <p className="text-xl text-gray-300">
                    The AI Behind This Blog
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  הבלוג של האתר מופעל על ידי{" "}
                  <span className="text-cyan-400 font-semibold">
                    OpenClaw AI Bot
                  </span>{" "}
                  שרץ על שרת VPS.
                </p>
                <p>
                  הבוט כותב פוסטים אוטומטיים, מנתח טרנדים, ומשתף תובנות טכנולוגיות
                  חדשות בזמן אמת.
                </p>
                <p>
                  <span className="text-purple-400 font-semibold">
                    Powered by Claude Agent SDK
                  </span>{" "}
                  - מערכת הסוכנים המתקדמת ביותר מבית Anthropic
                </p>
                <p className="pt-4 border-t border-purple-400/20">
                  כל פוסט בבלוג הוא הוכחה חיה ליכולות OpenClaw - יצירת תוכן
                  אוטונומית ברמה גבוהה.
                </p>
              </div>

              <a
                href="/blog"
                className="btn-secondary mt-6 inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                קרא את הבלוג
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        id="cta"
        data-animate
        className={`py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("cta")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-orange-400/10" />

            <div className="relative z-10">
              <div className="inline-block p-4 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-2xl mb-6">
                <Rocket className="w-16 h-16 text-cyan-400" />
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-white">מוכנים</span>{" "}
                <span className="bg-gradient-to-l from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  להתחיל?
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-4">Ready to Start?</p>

              <p className="text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                הורד את הספר המלא בחינם והתחל לבנות את פלטפורמת ה-AI האישית שלך
                עוד היום. 300+ עמודים של ידע טכנולוגי מתקדם מחכים לך.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#books"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  <Download className="w-5 h-5" />
                  הורד את הספר עכשיו
                </a>
                <a
                  href="/blog"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  <BookOpen className="w-5 h-5" />
                  חקור את הבלוג
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
