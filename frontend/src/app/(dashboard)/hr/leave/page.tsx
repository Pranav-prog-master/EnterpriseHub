"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hrService } from "@/services/hrService";
import { useForm } from "react-hook-form";
import { Plus, Check, X } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-yellow",
  approved: "badge-green",
  rejected: "badge-red",
};

export default function LeavePage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["leave-requests"],
    queryFn: () => hrService.listLeaveRequests(),
  });

  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: hrService.createLeaveRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request submitted.");
      reset();
      setShowForm(false);
    },
    onError: () => toast.error("Failed to submit request."),
  });

  const approveMutation = useMutation({
    mutationFn: hrService.approveLeave,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leave-requests"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: hrService.rejectLeave,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leave-requests"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b-2 border-border pb-4">
        <div>
          <h1 className="section-title">Leave Requests</h1>
          <p className="font-mono text-xs text-muted-fg mt-1 uppercase">{data?.count ?? 0} requests</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-brutal-accent">
          <Plus size={14} />
          Request Leave
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((d) => createMutation.mutate(d))}
          className="card-brutal-accent space-y-4"
        >
          <h3 className="font-display text-xl uppercase tracking-wider">New Leave Request</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase text-muted-fg mb-1">Start Date</label>
              <input {...register("start_date")} type="date" className="input-brutal" />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase text-muted-fg mb-1">End Date</label>
              <input {...register("end_date")} type="date" className="input-brutal" />
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs uppercase text-muted-fg mb-1">Reason</label>
            <textarea {...register("reason")} rows={3} className="input-brutal resize-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={createMutation.isPending} className="btn-brutal-accent">
              Submit
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-brutal">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card-brutal p-0 overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Period</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j}><div className="h-4 bg-muted animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              : data?.results?.map((req: any) => (
                  <tr key={req.id}>
                    <td><span className="font-mono text-xs">{req.employee}</span></td>
                    <td>
                      <span className="font-mono text-xs">
                        {req.start_date} → {req.end_date}
                      </span>
                    </td>
                    <td><span className="font-mono text-xs text-muted-fg">{req.reason}</span></td>
                    <td>
                      <span className={clsx("badge", STATUS_BADGE[req.status] || "badge-gray")}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => approveMutation.mutate(req.id)}
                            className="w-6 h-6 border border-accent-green flex items-center justify-center hover:bg-accent-green hover:text-black transition-colors"
                          >
                            <Check size={10} className="text-accent-green" />
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(req.id)}
                            className="w-6 h-6 border border-accent flex items-center justify-center hover:bg-accent hover:text-black transition-colors"
                          >
                            <X size={10} className="text-accent" />
                          </button>
                        </div>
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
