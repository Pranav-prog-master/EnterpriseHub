"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FolderKanban, UserCheck,
  FileText, MessageSquare, BarChart3, DollarSign,
  Calendar, FileBarChart, Settings, Building2,
  ChevronRight, Zap,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Role-based menu visibility
const roleMenuAccess: Record<string, string[]> = {
  company_admin: ["Dashboard", "Analytics", "Calendar", "HR", "Recruitment", "Projects", "CRM", "Documents", "Collaboration", "Finance", "Reports"],
  hr: ["Dashboard", "Calendar", "HR", "Recruitment", "Documents", "Collaboration"],
  project_manager: ["Dashboard", "Analytics", "Calendar", "Projects", "Documents", "Collaboration", "Reports"],
  team_lead: ["Dashboard", "Calendar", "Projects", "Documents", "Collaboration", "Reports"],
  employee: ["Dashboard", "Calendar", "Projects", "Documents", "Collaboration"],
  client: ["Dashboard", "Projects", "Documents", "Collaboration"],
};

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics",  href: "/analytics",  icon: BarChart3 },
      { label: "Calendar",   href: "/calendar",   icon: Calendar },
    ],
  },
  {
    label: "People",
    items: [
      { label: "HR",          href: "/hr/employees",   icon: Users },
      { label: "Recruitment", href: "/hr/recruitment", icon: UserCheck },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Projects",      href: "/projects",               icon: FolderKanban },
      { label: "CRM",           href: "/crm/leads",              icon: UserCheck },
      { label: "Documents",     href: "/documents",              icon: FileText },
      { label: "Collaboration", href: "/collaboration/channels", icon: MessageSquare },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Finance", href: "/finance", icon: DollarSign },
      { label: "Reports", href: "/reports", icon: FileBarChart },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, isHR } = useAuth();
  
  // Use state to handle client-side only data (prevents hydration errors)
  const [userRole, setUserRole] = useState<string>("employee");
  const [mounted, setMounted] = useState(false);

  // Only run on client side after mount
  useEffect(() => {
    setMounted(true);
    // Get role from cookies (more reliable than Redux on initial load)
    const role = Cookies.get("user_role") || user?.role || "employee";
    setUserRole(role);
  }, [user?.role]);

  const allowedMenus = roleMenuAccess[userRole] || roleMenuAccess.employee;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean).join("").toUpperCase() || "U";

  // Role display names
  const roleDisplayNames: Record<string, string> = {
    company_admin: "ADMIN",
    hr: "HR Manager",
    project_manager: "PM",
    team_lead: "Team Lead",
    employee: "Employee",
    client: "Client",
  };

  const roleLabel = mounted ? (roleDisplayNames[userRole] || "User") : "User";

  // Filter menu items based on role
  const filterMenuItems = (items: typeof NAV_GROUPS[0]["items"]) => {
    if (!mounted) return items; // Show all during SSR to prevent hydration mismatch
    return items.filter(item => allowedMenus.includes(item.label));
  };

  const filteredGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: filterMenuItems(group.items)
  })).filter(group => group.items.length > 0);

  return (
    <aside
      className="w-[210px] flex flex-col shrink-0 overflow-hidden border-r-2"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b-2 shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center shrink-0"
            style={{ background: "var(--accent)", boxShadow: "2px 2px 0 rgba(0,0,0,0.4)" }}
          >
            <Building2 size={15} style={{ color: "var(--bg)" }} />
          </div>
          <div>
            <p className="font-display text-2xl uppercase tracking-wider leading-none" style={{ color: "var(--text)" }}>
              Enterprise<span style={{ color: "var(--accent)" }}>Hub</span>
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.25em] mt-0.5" style={{ color: "var(--text-muted)" }}>
              Management Platform <span style={{ color: "var(--accent)" }}>v2</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status row */}
      <div
        className="px-4 py-2 border-b-2 flex items-center justify-between shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00c853" }} />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Online</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap size={9} style={{ color: "#ffd600" }} />
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#ffd600" }}>Active</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
              <div className="w-3 h-[2px]" style={{ background: "var(--accent)" }} />
              <p className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
                {group.label}
              </p>
            </div>

            {group.items.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] border-l-2 transition-all duration-75"
                  style={{
                    color:           active ? "var(--text)"       : "var(--text-muted)",
                    borderColor:     active ? "var(--accent)"     : "transparent",
                    backgroundColor: active ? "var(--accent-glow)": "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "var(--text)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--text-muted)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                    }
                  }}
                >
                  <Icon
                    size={13}
                    className="shrink-0"
                    style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {active && <ChevronRight size={9} style={{ color: "var(--accent)" }} className="shrink-0" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t-2 shrink-0" style={{ borderColor: "var(--border)" }}>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] border-l-2 transition-all duration-75"
          style={{
            color:           isActive("/settings") ? "var(--text)"       : "var(--text-muted)",
            borderColor:     isActive("/settings") ? "var(--accent)"     : "transparent",
            backgroundColor: isActive("/settings") ? "var(--accent-glow)": "transparent",
          }}
        >
          <Settings size={13} style={{ color: isActive("/settings") ? "var(--accent)" : "var(--text-muted)" }} />
          <span>Settings</span>
        </Link>

        {/* User card */}
        <div
          className="px-4 py-3 border-t-2 flex items-center gap-2.5"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-8 h-8 border-2 flex items-center justify-center font-display text-base font-bold shrink-0"
            style={{
              background:  "var(--accent)",
              borderColor: "var(--accent)",
              color:       "var(--bg)",
              boxShadow:   "2px 2px 0 rgba(0,0,0,0.4)",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] truncate leading-none" style={{ color: "var(--text)" }}>
              {user?.first_name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="font-mono text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "var(--accent)" }}>
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}