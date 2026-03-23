"use client";

import { useState, useEffect } from "react";
import { Mail, User, Loader2, CheckCircle } from "lucide-react";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const subscribed = localStorage.getItem("newsletter_subscribed");
    if (!subscribed) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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
        // Dismiss after showing success
        setTimeout(() => setShow(false), 2000);
      } else {
        setError(data.error?.message || "שגיאה בהרשמה, נסה שוב");
      }
    } catch {
      setError("שגיאת רשת, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - no click to close */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-[scaleIn_0.4s_ease-out]">
        <div className="glass-card p-8 border border-red-500/30 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                נרשמת בהצלחה!
              </h3>
              <p className="text-gray-400">תודה שהצטרפת לניוזלייטר של OpenClaw Hub</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  הצטרף לניוזלייטר שלנו
                </h3>
                <p className="text-gray-400 text-sm">
                  קבל עדכונים, מדריכים וטיפים ישירות למייל שלך
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-bold
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
                    "הרשם עכשיו"
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
