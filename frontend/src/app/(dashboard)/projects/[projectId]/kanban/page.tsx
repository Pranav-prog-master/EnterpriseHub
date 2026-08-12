"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { clsx } from "clsx";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const COLUMNS = [
  { key: "todo",        label: "To Do",      color: "border-muted-fg" },
  { key: "in_progress", label: "In Progress", color: "border-accent-blue" },
  { key: "review",      label: "Review",      color: "border-accent-yellow" },
  { key: "done",        label: "Done",        color: "border-accent-green" },
];

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-accent",
  high:     "bg-accent-yellow",
  medium:   "bg-accent-blue",
  low:      "bg-muted-fg",
};

export default function KanbanPage({ params }: { params: { projectId: string } }) {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", params.projectId],
    queryFn: () => projectService.listTasks({ project: params.projectId, page_size: 100 }),
  });

  const byStatus = (status: string) =>
    tasks?.results?.filter((t: any) => t.status === status) ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Projects</p>
          <h1 className="section-title">Kanban Board</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${params.projectId}`} className="btn-brutal-ghost"><ArrowLeft size={13} /> Back</Link>
          <button className="btn-brutal-accent"><Plus size={13} /> Add Task</button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTasks = byStatus(col.key);
          return (
            <div key={col.key} className="shrink-0 w-60">
              <div className={clsx("border-2 px-3 py-2 mb-3 flex items-center justify-between", col.color)}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white">{col.label}</span>
                <span className="font-mono text-[10px] text-muted-fg">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {isLoading
                  ? [...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton border-2 border-border" />)
                  : colTasks.map((task: any) => (
                      <div key={task.id} className="border-2 border-border bg-surface p-3 hover:border-white transition-colors cursor-pointer group">
                        <div className="flex items-start gap-2 mb-2">
                          <span className={clsx("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", PRIORITY_DOT[task.priority] || "bg-muted-fg")} />
                          <p className="font-mono text-xs text-white group-hover:text-accent transition-colors leading-tight">{task.title}</p>
                        </div>
                        {task.assignee && (
                          <p className="font-mono text-[10px] text-muted-fg">{task.assignee}</p>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
