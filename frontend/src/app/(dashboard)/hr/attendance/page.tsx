"use client";

import { useQuery } from "@tanstack/react-query";
import { hrService } from "@/services/hrService";
import { clsx } from "clsx";

const STATUS_BADGE: Record<string, string> = {
  present: "badge-green",
  absent: "badge-red",
  half_day: "badge-yellow",
  holiday: "badge-blue",
};

export default function AttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => hrService.listAttendance(),
  });

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-border pb-4">
        <h1 className="section-title">Attendance</h1>
        <p className="font-mono text-xs text-muted-fg mt-1 uppercase">{data?.count ?? 0} records</p>
      </div>

      <div className="card-brutal p-0 overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j}><div className="h-4 bg-muted animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              : data?.results?.map((rec: any) => (
                  <tr key={rec.id}>
                    <td><span className="font-mono text-xs">{rec.employee}</span></td>
                    <td><span className="font-mono text-xs">{rec.date}</span></td>
                    <td>
                      <span className="font-mono text-xs">
                        {rec.check_in ? new Date(rec.check_in).toLocaleTimeString() : "—"}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs">
                        {rec.check_out ? new Date(rec.check_out).toLocaleTimeString() : "—"}
                      </span>
                    </td>
                    <td>
                      <span className={clsx("badge", STATUS_BADGE[rec.status] || "badge-gray")}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
