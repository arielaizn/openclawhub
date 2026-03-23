"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Users, Loader2, UserCheck, UserX } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  full_name: string;
  subscribed_at: string;
  is_active: boolean;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSubscribers();
  }, [router]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/newsletter/subscribers");
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const activeCount = subscribers.filter((s) => s.is_active).length;
  const inactiveCount = subscribers.filter((s) => !s.is_active).length;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">מנויים</h1>
          <p className="text-gray-400">Newsletter Subscribers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{subscribers.length}</p>
            <p className="text-gray-400 text-sm">סה״כ מנויים</p>
          </div>
          <div className="glass-card p-6 text-center">
            <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{activeCount}</p>
            <p className="text-gray-400 text-sm">פעילים</p>
          </div>
          <div className="glass-card p-6 text-center">
            <UserX className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{inactiveCount}</p>
            <p className="text-gray-400 text-sm">לא פעילים</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">אין מנויים עדיין</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-400/20">
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">#</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">שם מלא</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">אימייל</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">תאריך הרשמה</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-white font-medium">{sub.full_name}</td>
                    <td className="px-6 py-4 text-gray-400" dir="ltr">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(sub.subscribed_at)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {sub.is_active ? "פעיל" : "לא פעיל"}
                      </span>
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
