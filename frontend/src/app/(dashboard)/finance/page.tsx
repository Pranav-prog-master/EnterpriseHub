import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Finance</p>
          <h1 className="section-title">Finance</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">Budgets & expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: DollarSign,   label: "Total Revenue",  value: "—", color: "border-accent-green  text-accent-green" },
          { icon: TrendingUp,   label: "Income",         value: "—", color: "border-accent-blue   text-accent-blue" },
          { icon: TrendingDown, label: "Expenses",       value: "—", color: "border-accent        text-accent" },
          { icon: CreditCard,   label: "Net Profit",     value: "—", color: "border-accent-yellow text-accent-yellow" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`border-2 ${color.split(" ")[0]} bg-surface p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest">{label}</p>
              <Icon size={13} className={color.split(" ")[1]} />
            </div>
            <p className="font-display text-4xl text-white leading-none">{value}</p>
          </div>
        ))}
      </div>

      <div className="border-2 border-border bg-surface p-16 flex flex-col items-center justify-center gap-4">
        <div className="border-2 border-accent-yellow p-4">
          <DollarSign size={32} className="text-accent-yellow" />
        </div>
        <p className="font-display text-3xl uppercase tracking-wider text-muted-fg">Finance Module</p>
        <p className="font-mono text-xs text-muted-fg uppercase tracking-widest">Full module coming soon</p>
      </div>
    </div>
  );
}
