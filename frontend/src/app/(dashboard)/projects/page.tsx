"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import Link from "next/link";
import { Plus, AlertTriangle, Users, CheckSquare } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  active: "badge-green",
  planning: "badge-blue",
  on_hold: "badge-yellow",
  completed: "badge-gray",
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "text-accent border-accent",
  high: "text-accent-yellow border-accent-yellow",
  medium: "text-white border-white/30",
  low: "text-muted-fg border-muted",
};

const STATUSES = ["", "active", "planning", "on_hold", "completed"];

export default function ProjectsPage() {
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["projects", status],
    queryFn: () => projectService.list({ status: status || undefined }),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Work</p>
          <h1 className="section-title">Projects</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">{data?.count ?? 0} total</p>
        </div>
        <Link href="/projects/new" className="btn-brutal-accent">
          <Plus size={13} />
          New Project
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={clsx(
              "px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border-2 transition-all duration-75",
              status === s
                ? "border-accent bg-accent text-black"
                : "border-[#1a1a1a] text-muted-fg hover:border-white hover:text-white"
            )}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 skeleton border-2 border-[#1a1a1a]" />
          ))}
        </div>
      ) : data?.results?.length === 0 ? (
        <div className="border-2 border-[#1a1a1a] p-16 text-center">
          <p className="font-display text-3xl uppercase text-muted-fg tracking-wider">No Projects</p>
          <p className="font-mono text-xs text-muted-fg mt-2">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.results?.map((project: any) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="border-2 border-[#1a1a1a] bg-surface p-4 hover:border-white hover:shadow-[4px_4px_0px_#f5f5f0] transition-all duration-100 cursor-pointer group h-full flex flex-col">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <span className={clsx("badge", STATUS_STYLES[project.status] || "badge-gray")}>
                    {project.status?.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.ai_risk_score > 0.7 && (
                      <span title="High AI risk">
                        <AlertTriangle size={12} className="text-accent" />
                      </span>
                    )}
                    <span className={clsx("font-mono text-[10px] uppercase font-bold border px-1.5 py-0.5", PRIORITY_COLORS[project.priority] || "text-muted-fg border-muted")}>
                      {project.priority}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-accent transition-colors leading-tight mb-2">
                  {project.name}
                </h3>

                <p className="font-mono text-[11px] text-muted-fg line-clamp-2 flex-1 mb-4">
                  {project.description || "No description provided."}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-4 border-t-2 border-[#1a1a1a] pt-3">
                  <div className="flex items-center gap-1.5">
                    <CheckSquare size={11} className="text-muted-fg" />
                    <span className="font-mono text-[10px] text-muted-fg">{project.task_count ?? 0} tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={11} className="text-muted-fg" />
                    <span className="font-mono text-[10px] text-muted-fg">{project.member_count ?? 0} members</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
