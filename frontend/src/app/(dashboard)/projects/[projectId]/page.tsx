"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import Link from "next/link";
import { LayoutGrid, List, Clock, Flag } from "lucide-react";
import { clsx } from "clsx";

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", params.projectId],
    queryFn: () => projectService.get(params.projectId),
  });

  if (isLoading) {
    return <div className="h-40 bg-muted animate-pulse border-2 border-border" />;
  }

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-border pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="section-title">{project?.name}</h1>
            <p className="font-mono text-xs text-muted-fg mt-1">{project?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-green">{project?.status}</span>
            <span className="font-mono text-xs text-muted-fg uppercase">{project?.priority}</span>
          </div>
        </div>
      </div>

      {/* Views */}
      <div className="flex gap-2">
        {[
          { label: "Kanban", href: `/projects/${params.projectId}/kanban`, icon: LayoutGrid },
          { label: "Tasks", href: `/projects/${params.projectId}/tasks`, icon: List },
          { label: "Timeline", href: `/projects/${params.projectId}/timeline`, icon: Clock },
          { label: "Milestones", href: `/projects/${params.projectId}/milestones`, icon: Flag },
        ].map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className="btn-brutal">
            <Icon size={12} />
            {label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: project?.task_count ?? 0 },
          { label: "Members", value: project?.member_count ?? 0 },
          { label: "Risk Score", value: project?.ai_risk_score != null ? `${Math.round(project.ai_risk_score * 100)}%` : "—" },
          { label: "Priority", value: project?.priority ?? "—" },
        ].map((stat) => (
          <div key={stat.label} className="card-brutal">
            <p className="font-mono text-xs text-muted-fg uppercase">{stat.label}</p>
            <p className="font-display text-3xl text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
