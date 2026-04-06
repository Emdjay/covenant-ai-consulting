"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

interface SidebarProps {
  clientName: string;
  latestAuditId?: string;
}

export function Sidebar({ clientName, latestAuditId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    {
      href: latestAuditId ? `/dashboard/analysis/${latestAuditId}` : "#",
      label: "Latest Analysis",
      icon: FileBarChart,
      disabled: !latestAuditId,
    },
    { href: "#", label: "Automations", icon: Zap, disabled: true },
    { href: "#", label: "Settings", icon: Settings, disabled: true },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = clientName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar-bg text-sidebar-text">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          C
        </div>
        <span className="text-lg font-semibold text-white">Covenant AI</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.disabled ? "#" : item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : isActive
                  ? "bg-sidebar-active/20 text-white"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/30 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">{clientName}</p>
            <p className="text-xs text-sidebar-text">Active Audit</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-text transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
