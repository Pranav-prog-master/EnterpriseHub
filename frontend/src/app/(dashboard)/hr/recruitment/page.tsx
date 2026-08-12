"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hrService } from "@/services/hrService";
import { Bot, Plus } from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";

const STATUS_BADGE: Record<string, string> = {
  applied: "badge-blue",
  screening: "badge-yellow",
  interview: "badge-yellow",
  offered: "badge-green",
  hired: "badge-green",
  rejected: "badge-gray",
};

export default function RecruitmentPage() {
  const qc = useQueryClient();
  const { data: jobs } = useQuery({ queryKey: ["jobs"], queryFn: hrService.listJobs });
  const { data: candidates, isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: hrService.listCandidates,
  });

  const screenMutation = useMutation({
    mutationFn: hrService.aiScreenCandidate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["candidates"] });
      toast.success("AI screening started.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b-2 border-border pb-4">
        <div>
          <h1 className="section-title">Recruitment</h1>
          <p className="font-mono text-xs text-muted-fg mt-1 uppercase">
            {jobs?.count ?? 0} open positions · {candidates?.count ?? 0} candidates
          </p>
        </div>
        <button className="btn-brutal-accent">
          <Plus size={14} />
          Post Job
        </button>
      </div>

      {/* Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs?.results?.map((job: any) => (
          <div key={job.id} className="card-brutal">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-lg uppercase tracking-wider">{job.title}</h3>
              {job.is_open ? (
                <span className="badge-green badge">Open</span>
              ) : (
                <span className="badge-gray badge">Closed</span>
              )}
            </div>
            <p className="font-mono text-xs text-muted-fg">{job.department}</p>
            {job.deadline && (
              <p className="font-mono text-[10px] text-muted-fg mt-2">
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Candidates */}
      <div className="card-brutal p-0 overflow-hidden">
        <div className="px-4 py-3 border-b-2 border-border">
          <h3 className="font-display text-xl uppercase tracking-wider">Candidates</h3>
        </div>
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>AI Score</th>
              <th>AI Summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j}><div className="h-4 bg-muted animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              : candidates?.results?.map((c: any) => (
                  <tr key={c.id}>
                    <td><span className="font-medium text-white">{c.name}</span></td>
                    <td><span className="font-mono text-xs text-muted-fg">{c.email}</span></td>
                    <td>
                      <span className={clsx("badge", STATUS_BADGE[c.status] || "badge-gray")}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.ai_score != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted">
                            <div className="h-full bg-accent-green" style={{ width: `${c.ai_score * 100}%` }} />
                          </div>
                          <span className="font-mono text-xs">{Math.round(c.ai_score * 100)}%</span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-muted-fg">—</span>
                      )}
                    </td>
                    <td>
                      <span className="font-mono text-xs text-muted-fg line-clamp-1 max-w-xs">
                        {c.ai_summary || "—"}
                      </span>
                    </td>
                    <td>
                      {!c.ai_score && (
                        <button
                          onClick={() => screenMutation.mutate(c.id)}
                          disabled={screenMutation.isPending}
                          className="flex items-center gap-1 px-2 py-1 border border-accent-blue text-accent-blue font-mono text-[10px] uppercase hover:bg-accent-blue hover:text-black transition-colors"
                        >
                          <Bot size={10} />
                          AI Screen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
