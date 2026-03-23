"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<"he" | "en">("he");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "he" ? "en" : "he";
    setLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
  };

  const navLinks = {
    he: [
      { href: "/", label: "בית" },
      { href: "/blog", label: "בלוג" },
      { href: "#books", label: "הספרים" },
      { href: "#about", label: "אודות" },
    ],
    en: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
      { href: "#books", label: "Books" },
      { href: "#about", label: "About" },
    ],
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[rgba(6,10,20,0.85)] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-cyan-400/10"
          : "bg-transparent"
      }`}
    >
      {/* Animated gradient bottom border */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(90deg, transparent, #2dd4bf, #8b5cf6, #f59e0b, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-500 group-hover:rotate-12 group-hover:drop-shadow-[0_0_12px_rgba(45,212,191,0.5)]"
            >
              <defs>
                <linearGradient id="clawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path
                d="M50 10 C30 20, 20 30, 15 50 C15 60, 20 70, 30 75 L35 55 C35 45, 40 35, 50 30 L50 10 Z"
                fill="url(#clawGradient)"
                opacity="0.9"
              />
              <path
                d="M50 10 C70 20, 80 30, 85 50 C85 60, 80 70, 70 75 L65 55 C65 45, 60 35, 50 30 L50 10 Z"
                fill="url(#clawGradient)"
                opacity="0.9"
              />
              <path
                d="M50 30 C45 35, 40 45, 40 55 L35 75 C40 80, 45 85, 50 90 C55 85, 60 80, 65 75 L60 55 C60 45, 55 35, 50 30 Z"
                fill="url(#clawGradient)"
              />
              <circle cx="50" cy="85" r="5" fill="#f59e0b" opacity="0.8" />
            </svg>

            <span className="text-2xl font-extrabold text-gradient-static">
              OpenClaw Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks[language].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-gray-400 hover:text-white transition-all duration-300 font-medium relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-400 group-hover:w-full rounded-full" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 blur-sm transition-all duration-400 group-hover:w-full" />
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 font-bold border border-cyan-400/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:scale-105 transition-all duration-300"
              aria-label="Toggle language"
            >
              {language === "he" ? "EN" : "HE"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 text-sm font-bold border border-cyan-400/30"
              aria-label="Toggle language"
            >
              {language === "he" ? "EN" : "HE"}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors p-1"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-60 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-4 border-t border-cyan-400/10">
            {navLinks[language].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  handleSmoothScroll(e, link.href);
                  setIsMenuOpen(false);
                }}
                className="text-gray-400 hover:text-cyan-400 transition-all duration-300 font-medium px-3 py-2.5 rounded-lg hover:bg-cyan-400/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
