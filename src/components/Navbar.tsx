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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-card shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            {/* OpenClaw Logo - SVG Claw Icon */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:rotate-12"
            >
              {/* Claw design with gradient */}
              <defs>
                <linearGradient id="clawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Main claw shape */}
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

              {/* Accent lines for detail */}
              <path
                d="M50 15 L50 30"
                stroke="#2dd4bf"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="85" r="5" fill="#f59e0b" opacity="0.8" />
            </svg>

            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
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
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              aria-label="Toggle language"
            >
              {language === "he" ? "EN" : "HE"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold"
              aria-label="Toggle language"
            >
              {language === "he" ? "EN" : "HE"}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
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
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slideDown">
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-800">
              {navLinks[language].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, link.href);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
