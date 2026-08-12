"use client";

import { useQuery } from "@tanstack/react-query";
import { crmService } from "@/services/crmService";
import { Plus } from "lucide-react";
import { clsx } from "clsx";

const STATUS_BADGE: Record<string, string> = {
  open: "badge-blue",
  won:  "badge-green",
  lost: "badge-gray",
};

export default function DealsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: () => crmService.listDeals(),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">CRM</p>
          <h1 className="section-title">Deals</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">{data?.count ?? 0} total</p>
        </div>
        <button className="btn-brutal-accent"><Plus size={13} /> Add Deal</button>
      </div>

      <div className="border-2 border-border overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr><th>Title</th><th>Status</th><th>Value</th><th>Probability</th><th>Close Date</th></tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(5)].map((_, j) => <td key={j}><div className="h-4 skeleton w-20" /></td>)}</tr>
                ))
              : !data?.results?.length
              ? <tr><td colSpan={5} className="text-center py-12"><p className="font-mono text-xs text-muted-fg uppercase">No deals yet</p></td></tr>
              : data.results.map((d: any) => (
                  <tr key={d.id}>
                    <td><p className="font-medium text-white">{d.title}</p></td>
                    <td><span className={clsx("badge", STATUS_BADGE[d.status] || "badge-gray")}>{d.status}</span></td>
                    <td><span className="font-mono text-xs text-accent-green font-bold">${Number(d.value || 0).toLocaleString()}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted">
                          <div className="h-full bg-accent-blue" style={{ width: `${d.probability}%` }} />
                        </div>
                        <span className="font-mono text-[10px]">{d.probability}%</span>
                      </div>
                    </td>
                    <td><span className="font-mono text-[10px] text-muted-fg">{d.close_date || "—"}</span></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
