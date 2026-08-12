import { FileBarChart, Download, Plus } from "lucide-react";

const REPORT_TYPES = [
  { title: "HR Summary",        desc: "Employee headcount, attendance, and leave statistics",   tag: "HR",       color: "border-accent-blue" },
  { title: "Project Status",    desc: "Active projects, task completion, and milestone tracking", tag: "Projects", color: "border-accent-green" },
  { title: "CRM Pipeline",      desc: "Lead conversion rates, deal values, and revenue forecast", tag: "CRM",      color: "border-accent-yellow" },
  { title: "Financial Overview",desc: "Revenue, expenses, and net profit breakdown",              tag: "Finance",  color: "border-accent" },
  { title: "AI Usage",          desc: "AI assistant queries, document processing, and RAG stats", tag: "AI",       color: "border-accent-blue" },
  { title: "Attendance Report", desc: "Daily attendance, late arrivals, and absence tracking",    tag: "HR",       color: "border-accent-green" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Intelligence</p>
          <h1 className="section-title">Reports</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">Generated reports & exports</p>
        </div>
        <button className="btn-brutal-accent"><Plus size={13} /> Custom Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORT_TYPES.map(({ title, desc, tag, color }) => (
          <div key={title} className={`border-2 ${color} bg-surface p-4 hover:shadow-brutal transition-all duration-100 cursor-pointer group`}>
            <div className="flex items-start justify-between mb-3">
              <FileBarChart size={16} className="text-muted-fg group-hover:text-white transition-colors" />
              <span className="tag-brutal text-muted-fg border-muted-fg text-[9px]">{tag}</span>
            </div>
            <h3 className="font-display text-xl uppercase tracking-wider text-white group-hover:text-accent transition-colors mb-1">
              {title}
            </h3>
            <p className="font-mono text-[11px] text-muted-fg mb-4">{desc}</p>
            <button className="flex items-center gap-1.5 font-mono text-[10px] text-muted-fg hover:text-white uppercase tracking-widest transition-colors">
              <Download size={10} /> Export PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
