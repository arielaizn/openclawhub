"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Send, Trash2, Loader2, Mail, FileText } from "lucide-react";
import Link from "next/link";

interface Newsletter {
  id: number;
  title: string;
  content: string;
  status: string;
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchNewsletters(token);
  }, [router]);

  const fetchNewsletters = async (token: string) => {
    try {
      const response = await fetch("/api/newsletter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setNewsletters(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching newsletters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm("האם אתה בטוח שברצונך לשלוח את הניוזלייטר לכל המנויים?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    setSending(id);
    try {
      const response = await fetch(`/api/newsletter/${id}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert(`נשלח בהצלחה ל-${data.data.sent_count} מנויים!`);
        fetchNewsletters(token);
      } else {
        alert(data.error?.message || "שגיאה בשליחה");
      }
    } catch {
      alert("שגיאת רשת");
    } finally {
      setSending(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הניוזלייטר?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setNewsletters((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert("שגיאה במחיקה");
      }
    } catch {
      alert("שגיאת רשת");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">ניוזלייטר</h1>
            <p className="text-gray-400">Newsletter Management</p>
          </div>
          <Link
            href="/admin/newsletter/new"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            ניוזלייטר חדש
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{newsletters.length}</p>
            <p className="text-gray-400 text-sm">סה״כ ניוזלייטרים</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Send className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">
              {newsletters.filter((n) => n.status === "sent").length}
            </p>
            <p className="text-gray-400 text-sm">נשלחו</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">
              {newsletters.filter((n) => n.status === "draft").length}
            </p>
            <p className="text-gray-400 text-sm">טיוטות</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          </div>
        ) : newsletters.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">אין ניוזלייטרים עדיין</p>
            <Link
              href="/admin/newsletter/new"
              className="inline-block mt-4 text-cyan-400 hover:underline"
            >
              צור ניוזלייטר ראשון
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-400/20">
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">כותרת</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">סטטוס</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">נמענים</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">תאריך</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((nl) => (
                  <tr key={nl.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{nl.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          nl.status === "sent"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {nl.status === "sent" ? "נשלח" : "טיוטה"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {nl.recipients_count > 0 ? nl.recipients_count : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {formatDate(nl.sent_at || nl.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {nl.status === "draft" && (
                          <button
                            onClick={() => handleSend(nl.id)}
                            disabled={sending === nl.id}
                            className="p-2 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50"
                            title="שלח"
                          >
                            {sending === nl.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(nl.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                          title="מחק"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
