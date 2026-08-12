"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import Link from "next/link";
import { clsx } from "clsx";

const STATUS_BADGE: Record<string, string> = {
  active:    "badge-green",
  planning:  "badge-blue",
  on_hold:   "badge-yellow",
  completed: "badge-gray",
};

export function ProjectsOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects-overview"],
    queryFn: () => projectService.list({ page_size: 6 }),
  });

  return (
    <div className="border-2 border-white bg-surface p-4 shadow-brutal">
      <div className="flex items-center justify-between mb-4 border-b-2 border-border pb-3">
        <h3 className="font-display text-2xl uppercase tracking-wider">Projects</h3>
        <Link href="/projects" className="font-mono text-[10px] text-accent hover:underline uppercase tracking-widest">
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-10 skeleton" />)}
        </div>
      ) : !data?.results?.length ? (
        <p className="font-mono text-xs text-muted-fg uppercase tracking-wider py-4 text-center">
          No projects yet
        </p>
      ) : (
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Tasks</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((p: any) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/projects/${p.id}`} className="hover:text-accent transition-colors font-medium">
                    {p.name}
                  </Link>
                </td>
                <td>
                  <span className={clsx("badge", STATUS_BADGE[p.status] || "badge-gray")}>
                    {p.status?.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[10px] text-muted-fg uppercase">{p.priority}</span>
                </td>
                <td>
                  <span className="font-mono text-xs">{p.task_count ?? 0}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
