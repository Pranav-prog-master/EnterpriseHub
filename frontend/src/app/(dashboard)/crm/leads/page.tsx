"use client";

import { useQuery } from "@tanstack/react-query";
import { crmService } from "@/services/crmService";
import { Plus, TrendingUp } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  new: "badge-blue",
  contacted: "badge-yellow",
  qualified: "badge-green",
  proposal: "badge-yellow",
  negotiation: "badge-yellow",
  won: "badge-green",
  lost: "badge-gray",
};

const STATUSES = ["", "new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];

export default function LeadsPage() {
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["leads", status],
    queryFn: () => crmService.listLeads({ status: status || undefined }),
  });

  const totalValue = data?.results?.reduce(
    (sum: number, l: any) => sum + Number(l.estimated_value || 0), 0
  ) ?? 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">CRM</p>
          <h1 className="section-title">Leads</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">{data?.count ?? 0} total</p>
        </div>
        <button className="btn-brutal-accent">
          <Plus size={13} />
          Add Lead
        </button>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Pipeline", value: `$${totalValue.toLocaleString()}`, color: "border-accent" },
          { label: "New", value: data?.results?.filter((l: any) => l.status === "new").length ?? 0, color: "border-accent-blue" },
          { label: "Qualified", value: data?.results?.filter((l: any) => l.status === "qualified").length ?? 0, color: "border-accent-green" },
          { label: "Won", value: data?.results?.filter((l: any) => l.status === "won").length ?? 0, color: "border-accent-yellow" },
        ].map((item) => (
          <div key={item.label} className={`border-2 ${item.color} bg-surface p-4`}>
            <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest">{item.label}</p>
            <p className="font-display text-3xl text-white mt-1 leading-none">{item.value}</p>
          </div>
        ))}
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

      {/* Table */}
      <div className="border-2 border-[#1a1a1a] overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Company</th>
              <th>Status</th>
              <th>Value</th>
              <th>AI Score</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j}><div className="h-4 skeleton w-20" /></td>
                    ))}
                  </tr>
                ))
              : data?.results?.map((lead: any) => (
                  <tr key={lead.id}>
                    <td>
                      <p className="text-white font-medium">{lead.name}</p>
                      <p className="font-mono text-[10px] text-muted-fg">{lead.email}</p>
                    </td>
                    <td><span className="font-mono text-xs">{lead.company_name || "—"}</span></td>
                    <td>
                      <span className={clsx("badge", STATUS_STYLES[lead.status] || "badge-gray")}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-accent-green">
                        ${Number(lead.estimated_value || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {lead.ai_score != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted">
                            <div
                              className={clsx("h-full transition-all", lead.ai_score > 0.7 ? "bg-accent-green" : lead.ai_score > 0.4 ? "bg-accent-yellow" : "bg-accent")}
                              style={{ width: `${lead.ai_score * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-white">{Math.round(lead.ai_score * 100)}%</span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-muted-fg">—</span>
                      )}
                    </td>
                    <td><span className="font-mono text-[10px] text-muted-fg uppercase">{lead.source || "—"}</span></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
