import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, BookOpen, FileEdit } from "lucide-react";
import { clearToken } from "@/lib/auth";

const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/leads", icon: Users, label: "Leads" },
  { href: "/chat", icon: MessageSquare, label: "Chat Messages" },
  { href: "/content", icon: FileEdit, label: "Content Editor" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [location] = useLocation();

  function handleLogout() {
    clearToken();
    onLogout();
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "#07082a", minHeight: "100vh" }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#f5c518" }}>
            <BookOpen className="w-5 h-5" style={{ color: "#07082a" }} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
            <p className="text-gray-400 text-xs">Book Founders</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = location === href;
          return (
            <Link key={href} href={href}>
              <a
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "text-navy font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/8"
                }`}
                style={active ? { background: "#f5c518", color: "#07082a" } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/8 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
