"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  Users,
  Puzzle,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const navItems = [
    {
      href: "/admin",
      label: "דשבורד",
      labelEn: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/posts",
      label: "פוסטים",
      labelEn: "Posts",
      icon: FileText,
    },
    {
      href: "/admin/posts/new",
      label: "פוסט חדש",
      labelEn: "New Post",
      icon: Plus,
    },
    {
      href: "/admin/newsletter",
      label: "ניוזלייטר",
      labelEn: "Newsletter",
      icon: Mail,
    },
    {
      href: "/admin/subscribers",
      label: "מנויים",
      labelEn: "Subscribers",
      icon: Users,
    },
    {
      href: "/admin/skills",
      label: "סקילים",
      labelEn: "Skills",
      icon: Puzzle,
    },
    {
      href: "/admin/settings",
      label: "הגדרות",
      labelEn: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-lg text-cyan-400 hover:bg-slate-700 transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 right-0 z-40
          w-64 bg-slate-900 border-l border-cyan-400/20
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-cyan-400/20">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="adminLogoGradient"
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
                  stroke="url(#adminLogoGradient)"
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
            <div>
              <h1 className="text-xl font-bold text-white">OpenClaw</h1>
              <p className="text-xs text-cyan-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs opacity-70">{item.labelEn}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-cyan-400/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
              text-red-400 hover:text-red-300 hover:bg-red-400/10
              transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">יציאה</span>
              <span className="text-xs opacity-70">Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
