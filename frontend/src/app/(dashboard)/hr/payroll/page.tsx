import { DollarSign } from "lucide-react";

export default function PayrollPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">HR</p>
          <h1 className="section-title">Payroll</h1>
        </div>
      </div>
      <div className="border-2 border-border bg-surface p-16 flex flex-col items-center justify-center gap-4">
        <div className="border-2 border-accent-yellow p-4">
          <DollarSign size={32} className="text-accent-yellow" />
        </div>
        <p className="font-display text-3xl uppercase tracking-wider text-muted-fg">Payroll Module</p>
        <p className="font-mono text-xs text-muted-fg uppercase tracking-widest">Coming soon</p>
      </div>
    </div>
  );
}
