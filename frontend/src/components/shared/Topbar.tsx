"use client";

import { Bell, Search, LogOut, Command, Activity } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/features/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const ROUTE_LABELS: Record<string, string> = {
  dashboard:           "Dashboard",
  hr:                  "HR",
  employees:           "Employees",
  recruitment:         "Recruitment",
  attendance:          "Attendance",
  leave:               "Leave",
  payroll:             "Payroll",
  performance:         "Performance",
  projects:            "Projects",
  crm:                 "CRM",
  leads:               "Leads",
  deals:               "Deals",
  customers:           "Customers",
  pipeline:            "Pipeline",
  documents:           "Documents",
  "ai-assistant":      "AI Assistant",
  collaboration:       "Collaboration",
  channels:            "Channels",
  analytics:           "Analytics",
  finance:             "Finance",
  calendar:            "Calendar",
  reports:             "Reports",
  settings:            "Settings",
};

export function Topbar() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const crumbs = pathname.split("/").filter(Boolean).map((seg) => ROUTE_LABELS[seg] || seg);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header
      className="h-12 flex items-center px-5 gap-4 shrink-0 border-b-2"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em]">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="font-bold" style={{ color: "var(--accent)" }}>›</span>}
            <span style={{ color: i === crumbs.length - 1 ? "var(--text)" : "var(--text-muted)" }}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* Role badge */}
      <div
        className="hidden md:flex items-center border-2 px-2.5 py-1"
        style={{ borderColor: "var(--accent)", background: "var(--accent-glow)" }}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
          {isAdmin ? "ADMIN" : "Employee"}
        </span>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 border-2 px-3 py-1.5 transition-all duration-100 w-44 group"
        style={{ borderColor: "var(--border)" }}
      >
        <Search size={10} className="shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent font-mono text-[11px] focus:outline-none w-full"
          style={{ color: "var(--text)" }}
        />
        <div className="flex items-center gap-0.5 shrink-0 opacity-50">
          <Command size={9} style={{ color: "var(--text-muted)" }} />
          <span className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>K</span>
        </div>
      </div>

      {/* Live clock */}
      <div
        className="hidden md:flex items-center gap-2 border-2 px-3 py-1.5"
        style={{ borderColor: "var(--border)" }}
      >
        <Activity size={9} style={{ color: "#00c853" }} />
        <span className="font-mono text-[10px] tracking-wider tabular-nums" style={{ color: "var(--text-muted)" }}>
          {time}
        </span>
      </div>

      {/* Bell */}
      <button
        className="w-8 h-8 flex items-center justify-center border-2 border-transparent transition-colors relative"
        style={{ borderColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
      >
        <Bell size={13} style={{ color: "var(--text-muted)" }} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5" style={{ background: "var(--accent)" }} />
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-8 h-8 flex items-center justify-center border-2 border-transparent transition-colors"
        title="Logout"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          (e.currentTarget.querySelector("svg") as SVGElement).style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "transparent";
          (e.currentTarget.querySelector("svg") as SVGElement).style.color = "var(--text-muted)";
        }}
      >
        <LogOut size={13} style={{ color: "var(--text-muted)" }} />
      </button>
    </header>
  );
}
