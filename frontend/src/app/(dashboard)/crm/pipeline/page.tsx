"use client";

import { useQuery } from "@tanstack/react-query";
import { crmService } from "@/services/crmService";
import { clsx } from "clsx";

const STAGES = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];

const STAGE_COLOR: Record<string, string> = {
  new:         "border-accent-blue   text-accent-blue",
  contacted:   "border-accent-yellow text-accent-yellow",
  qualified:   "border-accent-green  text-accent-green",
  proposal:    "border-accent-yellow text-accent-yellow",
  negotiation: "border-accent        text-accent",
  won:         "border-accent-green  text-accent-green",
  lost:        "border-muted-fg      text-muted-fg",
};

export default function PipelinePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leads-pipeline"],
    queryFn: () => crmService.listLeads({ page_size: 100 }),
  });

  const byStage = STAGES.reduce((acc, s) => {
    acc[s] = data?.results?.filter((l: any) => l.status === s) ?? [];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">CRM</p>
          <h1 className="section-title">Pipeline</h1>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage} className="shrink-0 w-48">
            <div className={clsx("border-2 px-3 py-2 mb-3 flex items-center justify-between", STAGE_COLOR[stage])}>
              <span className="font-mono text-[10px] uppercase tracking-widest">{stage}</span>
              <span className="font-mono text-[10px]">{byStage[stage].length}</span>
            </div>
            <div className="space-y-2">
              {isLoading
                ? [...Array(2)].map((_, i) => <div key={i} className="h-16 skeleton border-2 border-border" />)
                : byStage[stage].map((lead: any) => (
                    <div key={lead.id} className="border-2 border-border bg-surface p-3 hover:border-white transition-colors cursor-pointer">
                      <p className="font-mono text-xs text-white font-bold truncate">{lead.name}</p>
                      <p className="font-mono text-[10px] text-muted-fg truncate">{lead.company_name || "—"}</p>
                      <p className="font-mono text-[10px] text-accent-green mt-1">${Number(lead.estimated_value || 0).toLocaleString()}</p>
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
