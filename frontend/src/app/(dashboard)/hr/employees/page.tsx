"use client";

import { useQuery } from "@tanstack/react-query";
import { hrService } from "@/services/hrService";
import Link from "next/link";
import { UserPlus, Search, Filter } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const STATUS_BADGE: Record<string, string> = {
  active: "badge-green",
  inactive: "badge-gray",
  on_leave: "badge-yellow",
};

const DEPT_COLORS: Record<string, string> = {
  Engineering: "text-accent-blue",
  HR: "text-accent-green",
  Sales: "text-accent-yellow",
  Marketing: "text-accent",
  Finance: "text-accent-green",
};

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["employees", search, status],
    queryFn: () => hrService.listEmployees({ search, status: status || undefined }),
  });

  const statuses = ["", "active", "inactive", "on_leave"];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Human Resources</p>
          <h1 className="section-title">Employees</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase tracking-wider">
            {isLoading ? "—" : data?.count ?? 0} total records
          </p>
        </div>
        <Link href="/hr/employees/new" className="btn-brutal-accent">
          <UserPlus size={13} />
          Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 border-2 border-[#1a1a1a] hover:border-white/30 px-3 py-2 transition-colors">
          <Search size={11} className="text-muted-fg" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent font-mono text-xs text-white placeholder:text-muted-fg focus:outline-none w-48"
          />
        </div>

        <div className="flex items-center gap-1">
          <Filter size={11} className="text-muted-fg" />
          {statuses.map((s) => (
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
      </div>

      {/* Table */}
      <div className="border-2 border-[#1a1a1a] overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Employee</th>
              <th>ID</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j}><div className="h-4 skeleton w-24" /></td>
                    ))}
                  </tr>
                ))
              : data?.results?.length === 0
              ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p className="font-mono text-xs text-muted-fg uppercase tracking-widest">No employees found</p>
                  </td>
                </tr>
              )
              : data?.results?.map((emp: any) => (
                <tr key={emp.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent-blue border-2 border-accent-blue flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                        {emp.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{emp.full_name}</p>
                        <p className="font-mono text-[10px] text-muted-fg">{emp.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs text-muted-fg">{emp.employee_id}</span></td>
                  <td>
                    <span className={clsx("font-mono text-xs font-bold", DEPT_COLORS[emp.department] || "text-white")}>
                      {emp.department}
                    </span>
                  </td>
                  <td><span className="font-mono text-xs">{emp.designation}</span></td>
                  <td>
                    <span className={clsx("badge", STATUS_BADGE[emp.status] || "badge-gray")}>
                      {emp.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-[10px] text-muted-fg">
                      {emp.date_of_joining ? new Date(emp.date_of_joining).toLocaleDateString() : "—"}
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
