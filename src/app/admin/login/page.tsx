"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.data?.token) {
        localStorage.setItem("adminToken", result.data.token);
        router.push("/admin");
      } else {
        setError(result.error?.message || "שגיאת התחברות");
      }
    } catch (err) {
      setError("שגיאת רשת. אנא נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="loginLogoGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#loginLogoGradient)"
                  strokeWidth="3"
                  className="animate-pulse-slow"
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
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">כניסת מנהל</h1>
            <p className="text-gray-400">Admin Login</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                אימייל
                <span className="text-gray-500 text-xs mr-2">(Email)</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all"
                placeholder="הכנס אימייל"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                סיסמה
                <span className="text-gray-500 text-xs mr-2">(Password)</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/20 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
                  transition-all"
                placeholder="הכנס סיסמה"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>כניסה</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-cyan-400/20 text-center">
            <a
              href="/"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              חזרה לאתר הראשי
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
