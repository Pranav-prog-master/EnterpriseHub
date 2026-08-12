"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { Bell } from "lucide-react";

function timeAgo(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return "";
  }
}

const TYPE_COLOR: Record<string, string> = {
  success: "border-accent-green",
  warning: "border-accent-yellow",
  error:   "border-accent",
  task:    "border-accent-blue",
  mention: "border-accent-yellow",
  info:    "border-border",
};

export function ActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.list,
  });

  return (
    <div className="border-2 border-white bg-surface p-4 shadow-brutal h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b-2 border-border pb-3 shrink-0">
        <h3 className="font-display text-2xl uppercase tracking-wider">Activity</h3>
        <Bell size={13} className="text-muted-fg" />
      </div>

      <div className="space-y-2 overflow-y-auto flex-1">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-12 skeleton" />
          ))
        ) : !data?.results?.length ? (
          <p className="font-mono text-xs text-muted-fg uppercase tracking-wider py-4 text-center">
            No recent activity
          </p>
        ) : (
          data.results.slice(0, 10).map((n: any) => (
            <div
              key={n.id}
              className={`border-l-2 ${TYPE_COLOR[n.notification_type] || "border-border"} pl-3 py-1.5`}
            >
              <p className="font-mono text-xs text-white leading-tight">{n.title}</p>
              <p className="font-mono text-[10px] text-muted-fg mt-0.5">{timeAgo(n.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
