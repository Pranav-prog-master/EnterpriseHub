"use client";

import { useQuery } from "@tanstack/react-query";
import { hrService } from "@/services/hrService";
import { Plus, Star } from "lucide-react";

export default function PerformancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["performance-reviews"],
    queryFn: () => hrService.listReviews(),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">HR</p>
          <h1 className="section-title">Performance</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">{data?.count ?? 0} reviews</p>
        </div>
        <button className="btn-brutal-accent"><Plus size={13} /> Add Review</button>
      </div>

      <div className="border-2 border-border overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr><th>Employee</th><th>Period</th><th>Rating</th><th>Feedback</th></tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(4)].map((_, j) => <td key={j}><div className="h-4 skeleton w-24" /></td>)}</tr>
                ))
              : !data?.results?.length
              ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <p className="font-mono text-xs text-muted-fg uppercase tracking-widest">No reviews yet</p>
                  </td>
                </tr>
              )
              : data.results.map((r: any) => (
                  <tr key={r.id}>
                    <td><span className="font-medium text-white">{r.employee}</span></td>
                    <td><span className="font-mono text-xs">{r.period}</span></td>
                    <td>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className={i < r.rating ? "text-accent-yellow fill-accent-yellow" : "text-muted"} />
                        ))}
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-muted-fg line-clamp-1 max-w-xs">{r.feedback}</span></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
