"use client";

import { useQuery } from "@tanstack/react-query";
import { crmService } from "@/services/crmService";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => crmService.listCustomers(),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">CRM</p>
          <h1 className="section-title">Customers</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">{data?.count ?? 0} total</p>
        </div>
        <button className="btn-brutal-accent"><Plus size={13} /> Add Customer</button>
      </div>

      <div className="border-2 border-border overflow-hidden">
        <table className="table-brutal">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Company</th><th>Revenue</th></tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(4)].map((_, j) => <td key={j}><div className="h-4 skeleton w-24" /></td>)}</tr>
                ))
              : !data?.results?.length
              ? <tr><td colSpan={4} className="text-center py-12"><p className="font-mono text-xs text-muted-fg uppercase">No customers yet</p></td></tr>
              : data.results.map((c: any) => (
                  <tr key={c.id}>
                    <td><p className="font-medium text-white">{c.name}</p></td>
                    <td><span className="font-mono text-xs text-muted-fg">{c.email}</span></td>
                    <td><span className="font-mono text-xs">{c.company_name || "—"}</span></td>
                    <td><span className="font-mono text-xs text-accent-green font-bold">${Number(c.total_revenue || 0).toLocaleString()}</span></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
