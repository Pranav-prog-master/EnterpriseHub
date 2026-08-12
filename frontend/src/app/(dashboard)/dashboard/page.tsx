"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ProjectsOverview } from "@/components/dashboard/ProjectsOverview";
import { BrutalTicker } from "@/components/ui/BrutalTicker";
import {
  Users, FolderKanban, UserCheck, TrendingUp,
  AlertTriangle, CheckCircle, Clock, Zap,
  Cpu, Database, Server, Wifi,
} from "lucide-react";

const SYSTEM_SERVICES = [
  { label: "API",        latency: "12ms",  icon: Wifi,     ok: true },
  { label: "Database",   latency: "3ms",   icon: Database, ok: true },
  { label: "AI Service", latency: "240ms", icon: Cpu,      ok: true },
  { label: "Cache",      latency: "1ms",   icon: Server,   ok: true },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: analyticsService.getDashboard,
  });

  const now = new Date();

  return (
    <div className="space-y-6 animate-fade-slide-in">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between border-b-2 border-[#1e1e1e] pb-5">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-[#ff3b00]" />
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.3em]">
              {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <h1 className="font-display text-8xl uppercase text-white leading-none tracking-wider">
            Dashboard
          </h1>
        </div>

        {/* Right badges */}
        <div className="flex items-center gap-2 pb-1">
          <div className="flex items-center gap-2 border-2 border-[#00c853] px-3 py-2 shadow-[2px_2px_0_#006128]">
            <span className="w-2 h-2 bg-[#00c853] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-[#00c853] uppercase tracking-[0.2em]">Live</span>
          </div>
          <div className="flex items-center gap-2 border-2 border-[#ff3b00] px-3 py-2 shadow-[2px_2px_0_#7a1c00]">
            <Zap size={10} className="text-[#ff3b00]" />
            <span className="font-mono text-[10px] text-[#ff3b00] uppercase tracking-[0.2em]">On</span>
          </div>
        </div>
      </div>

      {/* ── Primary Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Employees"
          value={data?.hr?.total_employees ?? "—"}
          icon={Users}
          accent="blue"
          loading={isLoading}
          delta="+12 this month"
        />
        <StatCard
          label="Active Projects"
          value={data?.projects?.active ?? "—"}
          icon={FolderKanban}
          accent="yellow"
          loading={isLoading}
          delta="+3 new"
        />
        <StatCard
          label="Open Leads"
          value={data?.crm?.leads ?? "—"}
          icon={UserCheck}
          accent="accent"
          loading={isLoading}
          delta="+8 this week"
        />
        <StatCard
          label="Revenue Won"
          value={data?.crm?.revenue ? `$${Number(data.crm.revenue).toLocaleString()}` : "—"}
          icon={TrendingUp}
          accent="green"
          loading={isLoading}
          delta="+18% vs last month"
        />
      </div>

      {/* ── Secondary Stats Row ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: CheckCircle, color: "#00c853", border: "border-l-[#00c853]", label: "Tasks Done",  value: data?.tasks?.done ?? "—" },
          { icon: Clock,       color: "#ffd600", border: "border-l-[#ffd600]", label: "On Leave",    value: data?.hr?.on_leave ?? "—" },
          { icon: FolderKanban,color: "#0057ff", border: "border-l-[#0057ff]", label: "Completed",   value: data?.projects?.completed ?? "—" },
          { icon: Zap,         color: "#ff3b00", border: "border-l-[#ff3b00]", label: "AI Queries",  value: "—" },
        ].map(({ icon: Icon, color, border, label, value }) => (
          <div key={label} className={`border-2 border-[#1e1e1e] border-l-4 ${border} bg-[#111] p-4 flex items-center gap-4`}>
            <div
              className="w-8 h-8 flex items-center justify-center shrink-0 border"
              style={{ background: `${color}15`, borderColor: `${color}30` }}
            >
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <p className="font-mono text-[9px] text-[#555] uppercase tracking-[0.2em]">{label}</p>
              <p className="font-display text-4xl text-white leading-none mt-0.5">
                {isLoading ? <span className="inline-block w-10 h-7 bg-[#1e1e1e] animate-pulse" /> : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Projects + Activity ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ProjectsOverview />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* ── System Status Bar ── */}
      <div className="border-2 border-[#1e1e1e] bg-[#0e0e0e] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#00c853]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555]">System Status</p>
          </div>
          <span className="tag-brutal text-[#00c853] border-[#00c853] text-[9px] px-2 py-0.5">
            All Operational
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {SYSTEM_SERVICES.map(({ label, latency, icon: SIcon, ok }) => (
            <div key={label} className="flex items-center gap-3 border border-[#1a1a1a] p-3">
              <SIcon size={12} className={ok ? "text-[#00c853]" : "text-[#ff3b00]"} />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-white uppercase tracking-wider truncate">{label}</p>
                <p className="font-mono text-[9px] text-[#555]">{latency}</p>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? "bg-[#00c853]" : "bg-[#ff3b00]"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
