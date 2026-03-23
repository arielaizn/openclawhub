"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, User, Loader2, CheckCircle, ArrowRight } from "lucide-react";

export default function NewsletterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name: fullName }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        localStorage.setItem("newsletter_subscribed", "true");
      } else {
        setError(data.error?.message || "שגיאה בהרשמה, נסה שוב");
      }
    } catch {
      setError("שגיאת רשת, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לדף הבית
        </Link>

        <div className="glass-card p-8 border border-red-500/20">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-3">נרשמת בהצלחה!</h1>
              <p className="text-gray-400 mb-8">
                תודה שהצטרפת לניוזלייטר של OpenClaw Hub. תקבל עדכונים ישירות למייל שלך.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-medium hover:shadow-lg transition-all"
              >
                <ArrowRight className="w-5 h-5" />
                חזרה לדף הבית
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  הצטרף לניוזלייטר
                </h1>
                <p className="text-gray-400">
                  קבל עדכונים, מדריכים, טיפים וחדשות מעולם ה-AI ישירות למייל שלך.
                  <br />
                  הרשם עכשיו וקבל גישה לתוכן בלעדי!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    שם מלא
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pr-10 pl-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                        text-white placeholder-gray-500
                        focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                        transition-all"
                      placeholder="הכנס את שמך המלא..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    אימייל
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      className="w-full pr-10 pl-4 py-3 bg-slate-800 border border-red-500/20 rounded-lg
                        text-white placeholder-gray-500
                        focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                        transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg
                    hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      נרשם...
                    </>
                  ) : (
                    "הרשם לניוזלייטר"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  לא נשלח ספאם. ניתן לבטל בכל עת.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
