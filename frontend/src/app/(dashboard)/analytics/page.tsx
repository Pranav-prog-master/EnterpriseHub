"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
} from "recharts";
import { BrutalTicker } from "@/components/ui/BrutalTicker";
import { TrendingUp, Users, FolderKanban, DollarSign, ArrowUpRight } from "lucide-react";

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#111",
    border: "2px solid #2a2a2a",
    borderRadius: 0,
    fontFamily: "var(--font-space-mono)",
    fontSize: 10,
    color: "#f0f0eb",
    boxShadow: "3px 3px 0 #ff3b00",
  },
  cursor: { fill: "rgba(255,59,0,0.04)" },
};

const AXIS_TICK = { fontFamily: "var(--font-space-mono)", fontSize: 10, fill: "#555" };

const REVENUE_DATA = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 19000 },
  { month: "Mar", value: 15000 },
  { month: "Apr", value: 28000 },
  { month: "May", value: 22000 },
  { month: "Jun", value: 35000 },
  { month: "Jul", value: 31000 },
];

export default function AnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: analyticsService.getDashboard,
  });
  const { data: hr } = useQuery({
    queryKey: ["hr-analytics"],
    queryFn: analyticsService.getHR,
  });

  const deptData = hr?.department_breakdown ?? [];
  const total    = dashboard?.projects?.total ?? 1;

  const projectData = [
    { name: "Active",   value: dashboard?.projects?.active    ?? 0, fill: "#00c853" },
    { name: "Planning", value: dashboard?.projects?.planning  ?? 0, fill: "#0057ff" },
    { name: "On Hold",  value: dashboard?.projects?.on_hold   ?? 0, fill: "#ffd600" },
    { name: "Done",     value: dashboard?.projects?.completed ?? 0, fill: "#444" },
  ];

  const kpis = [
    {
      label: "Total Employees",
      value: dashboard?.hr?.total_employees ?? "—",
      icon: Users,
      accent: "#0057ff",
      border: "border-l-[#0057ff]",
      shadow: "shadow-[3px_3px_0_#002280]",
    },
    {
      label: "Active Projects",
      value: dashboard?.projects?.active ?? "—",
      icon: FolderKanban,
      accent: "#00c853",
      border: "border-l-[#00c853]",
      shadow: "shadow-[3px_3px_0_#006128]",
    },
    {
      label: "Open Leads",
      value: dashboard?.crm?.leads ?? "—",
      icon: TrendingUp,
      accent: "#ff3b00",
      border: "border-l-[#ff3b00]",
      shadow: "shadow-[3px_3px_0_#7a1c00]",
    },
    {
      label: "Revenue Won",
      value: dashboard?.crm?.revenue
        ? `$${Number(dashboard.crm.revenue).toLocaleString()}`
        : "—",
      icon: DollarSign,
      accent: "#ffd600",
      border: "border-l-[#ffd600]",
      shadow: "shadow-[3px_3px_0_#7a6600]",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-slide-in">

      {/* ── Ticker ── */}
      <div className="-mx-6">
        <BrutalTicker
          items={["BUSINESS INTELLIGENCE", "REAL-TIME DATA", "HR ANALYTICS", "CRM METRICS", "PROJECT STATUS", "REVENUE TRENDS"]}
          accentColor="#ffd600"
          speed={25}
        />
      </div>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-[#ffd600]" />
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.3em]">Intelligence</p>
          </div>
          <h1 className="font-display text-8xl uppercase text-white leading-none tracking-wider">
            Analytics
          </h1>
          <p className="font-mono text-[11px] text-[#555] mt-2 uppercase tracking-wider">
            Business intelligence overview
          </p>
        </div>
        <div className="flex items-center gap-2 border-2 border-[#1e1e1e] px-4 py-2 pb-3">
          <p className="font-mono text-[10px] text-[#555] uppercase tracking-widest">Period:</p>
          <p className="font-mono text-[10px] text-white uppercase tracking-widest">This Month</p>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`border-2 border-[#1e1e1e] border-l-4 ${kpi.border} bg-[#111] p-5 ${kpi.shadow} transition-all duration-150`}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em]">{kpi.label}</p>
              <kpi.icon size={13} style={{ color: kpi.accent }} className="shrink-0" />
            </div>
            <p className="font-display text-6xl text-white leading-none">{kpi.value}</p>
            <div className="flex items-center gap-1.5 mt-3">
              <ArrowUpRight size={10} style={{ color: kpi.accent }} />
              <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Dept Bar Chart */}
        <div className="border-2 border-[#1e1e1e] bg-[#111]">
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#1e1e1e]">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#0057ff]" />
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">Employees by Dept</h3>
            </div>
            <span className="tag-brutal text-[#0057ff] border-[#0057ff] text-[9px]">HR</span>
          </div>
          <div className="p-5">
            {deptData.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-2">
                <p className="font-display text-4xl text-[#2a2a2a] uppercase">No Data</p>
                <p className="font-mono text-[10px] text-[#444] uppercase tracking-widest">Connect your HR system</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptData} barSize={24}>
                  <XAxis dataKey="department" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="#0057ff" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Project Status */}
        <div className="border-2 border-[#1e1e1e] bg-[#111]">
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#1e1e1e]">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#00c853]" />
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">Project Status</h3>
            </div>
            <span className="tag-brutal text-[#00c853] border-[#00c853] text-[9px]">Projects</span>
          </div>
          <div className="p-5 space-y-5">
            {projectData.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 shrink-0" style={{ backgroundColor: item.fill }} />
                    <span className="font-mono text-[10px] text-[#666] uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="font-display text-2xl text-white leading-none">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-[#1a1a1a]">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${Math.min((item.value / total) * 100, 100)}%`,
                      background: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Revenue Trend ── */}
      <div className="border-2 border-[#1e1e1e] bg-[#111]">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#1e1e1e]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#ffd600]" />
            <h3 className="font-display text-2xl uppercase tracking-wider text-white">Revenue Trend</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-px bg-[#ff3b00]" />
              <span className="font-mono text-[9px] text-[#555] uppercase">Revenue</span>
            </div>
            <span className="tag-brutal text-[#ffd600] border-[#ffd600] text-[9px]">CRM</span>
          </div>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid stroke="#1a1a1a" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#ff3b00"
                strokeWidth={2}
                dot={{ fill: "#ff3b00", r: 4, strokeWidth: 2, stroke: "#0a0a0a" }}
                activeDot={{ r: 6, fill: "#ff3b00", stroke: "#ffd600", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
