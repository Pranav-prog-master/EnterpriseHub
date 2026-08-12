"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Activity,
  Terminal,
  ShieldAlert,
  Cpu,
  Users,
  FolderKanban,
  BarChart3,
  MessagesSquare,
} from "lucide-react";

const METRICS = [
  { value: "99.99%", label: "Uptime SLA",       desc: "Zero-latency orchestration" },
  { value: "12ms",    label: "Avg API Latency",  desc: "Edge-routed endpoints"       },
  { value: "15M+",    label: "Queries / Day",    desc: "AI assistant telemetry"     },
  { value: "0ms",     label: "CORS Restrictions", desc: "Proxied routing gateway"    },
];

const FEATURES = [
  {
    icon: Cpu,
    title: "AI Engine & RAG",
    desc: "Direct Retrieval-Augmented Generation context storage. Scan files, transcripts, and telemetry with instant intelligence.",
    color: "#ff3b00",
    border: "border-[#ff3b00]",
    shadow: "shadow-[4px_4px_0_#7a1c00]",
  },
  {
    icon: FolderKanban,
    title: "Agile Project Boards",
    desc: "Sprint lists, task milestones, priority states, comments, and automated time tracking with dynamic progress telemetry.",
    color: "#0057ff",
    border: "border-[#0057ff]",
    shadow: "shadow-[4px_4px_0_#002280]",
  },
  {
    icon: Users,
    title: "HR Suite & Rosters",
    desc: "Complete attendance, leave request pipelines, performance logs, and departmental breakdown stats out of the box.",
    color: "#00c853",
    border: "border-[#00c853]",
    shadow: "shadow-[4px_4px_0_#006128]",
  },
  {
    icon: MessagesSquare,
    title: "WebSocket Collaboration",
    desc: "Persistent chat channels and direct messages updating in real-time. No page refresh, instant messaging delivery.",
    color: "#ffd600",
    border: "border-[#ffd600]",
    shadow: "shadow-[4px_4px_0_#7a6600]",
  },
];

export default function LandingPage() {
  return (
    <div data-scope="auth" className="min-h-screen bg-[#0a0a0a] text-[#f0f0eb] selection:bg-[#ff3b00] selection:text-white relative overflow-hidden" style={{
      backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}>

      {/* ── HEADER ── */}
      <header className="border-b-2 border-[#1e1e1e] bg-[#0d0d0d] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff3b00] flex items-center justify-center shadow-[3px_3px_0_#7a1c00]">
              <span className="font-display text-xl text-black leading-none">E</span>
            </div>
            <div>
              <p className="font-display text-2xl uppercase tracking-wider leading-none text-white">
                Enterprise<span className="text-[#ff3b00]">Hub</span>
              </p>
              <p className="font-mono text-[9px] text-[#555] uppercase tracking-widest mt-0.5">Management Platform v2</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="font-mono text-[11px] uppercase tracking-wider text-[#777] hover:text-white transition-colors">Features</a>
            <a href="#telemetry" className="font-mono text-[11px] uppercase tracking-wider text-[#777] hover:text-white transition-colors">System State</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-brutal text-[10px] py-1.5 px-4 shadow-[2px_2px_0_#f0f0eb]">
              Login
            </Link>
            <Link href="/register" className="btn-brutal-accent text-[10px] py-1.5 px-4 shadow-[2px_2px_0_#7a1c00] text-black">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 border border-[#ff3b00]/30 bg-[#ff3b00]/5 px-3 py-1.5 rounded-none">
            <Zap size={11} className="text-[#ff3b00] animate-pulse" />
            <span className="font-mono text-[10px] text-[#ff3b00] uppercase tracking-[0.25em]">Version 2.0.0 Now Online</span>
          </div>

          <h1 className="font-display text-8xl md:text-9xl uppercase leading-[0.85] tracking-wider text-white">
            Enterprise<br />
            Operations<br />
            <span className="text-[#ff3b00]">Accelerated</span>
          </h1>

          <p className="font-mono text-xs md:text-sm text-[#777] max-w-xl leading-relaxed">
            A high-performance operating system for businesses. Blazing fast, telemetry-driven, and AI-augmented dashboard built to orchestrate teams, codes, pipelines, and revenue.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/register" className="btn-brutal-accent text-xs py-3 px-8 text-black shadow-[4px_4px_0_#7a1c00] flex items-center gap-2">
              Launch Platform <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="btn-brutal text-xs py-3 px-8 text-white shadow-[4px_4px_0_#f0f0eb] flex items-center gap-2">
              Access Portal <Terminal size={14} />
            </Link>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="border-2 border-[#1e1e1e] bg-[#111] p-6 shadow-[8px_8px_0_#ff3b00] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b00]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd600]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c853]" />
              </div>
              <span className="font-mono text-[9px] text-[#444] uppercase tracking-widest">telemetry_terminal.sh</span>
            </div>

            <div className="space-y-2.5 font-mono text-[11px] text-[#777]">
              <p className="text-white">🚀 Initializing EnterpriseHub AI Core...</p>
              <p>✔ Checking SQLite connection: <span className="text-[#00c853]">OK</span></p>
              <p>✔ Handshaking Redis adapter: <span className="text-[#00c853]">Connected</span></p>
              <p>✔ Loading AI assistant vectors: <span className="text-[#ffd600]">Pinecone Active</span></p>
              <p>✔ Mounting Same-origin proxy: <span className="text-[#ff3b00]">Active on /api/v1/</span></p>
              <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[#ff3b00] animate-pulse">● System operational</span>
                <span className="text-white">v2.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS GRID ── */}
      <section className="border-y-2 border-[#1e1e1e] bg-[#0d0d0d] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map(({ value, label, desc }) => (
            <div key={label} className="space-y-1">
              <p className="font-display text-5xl md:text-6xl text-white leading-none tracking-wider">{value}</p>
              <p className="font-mono text-[10px] text-[#ff3b00] uppercase tracking-wider">{label}</p>
              <p className="font-mono text-[9px] text-[#555]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <div className="text-center space-y-2">
          <p className="font-mono text-[10px] text-[#ff3b00] uppercase tracking-[0.3em]">Architectural Features</p>
          <h2 className="font-display text-6xl uppercase tracking-wider text-white">Full Stack Ecosystem</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color, border, shadow }) => (
            <div key={title} className={`border-2 border-[#1e1e1e] hover:${border} bg-[#111] p-6 transition-all duration-150 flex flex-col justify-between ${shadow}`}>
              <div>
                <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center bg-[#0d0d0d] mb-6">
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="font-display text-2xl text-white uppercase tracking-wide mb-2">{title}</h3>
                <p className="font-mono text-[11px] text-[#555] leading-relaxed">{desc}</p>
              </div>
              <div className="pt-6 border-t border-[#1a1a1a] mt-6 flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#444] uppercase tracking-widest">Active Module</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TELEMETRY SYSTEM STATUS ── */}
      <section id="telemetry" className="border-t-2 border-[#1e1e1e] bg-[#0d0d0d]/40 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="font-mono text-[10px] text-[#00c853] uppercase tracking-[0.3em]">System Health Monitor</p>
            <h2 className="font-display text-5xl md:text-6xl uppercase text-white tracking-wider leading-none">
              Real-Time<br />
              Infrastructure
            </h2>
            <p className="font-mono text-xs text-[#555] leading-relaxed">
              We leverage clean ASGI channel configurations, redis pub-sub layers, and custom SQLite pipelines to provide lightning-fast, zero-overhead queries. No loading states, no bloated bundle size.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 border border-[#00c853]/30 bg-[#00c853]/5 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
                <span className="font-mono text-[10px] text-[#00c853] uppercase tracking-wider">WebSocket: Live</span>
              </div>
              <div className="flex items-center gap-2 border border-[#0057ff]/30 bg-[#0057ff]/5 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0057ff] animate-pulse" />
                <span className="font-mono text-[10px] text-[#0057ff] uppercase tracking-wider">Worker: Online</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#1e1e1e] bg-[#111] p-6 shadow-[6px_6px_0_#00c853] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-[#00c853]" />
                <span className="font-mono text-[10px] text-white uppercase tracking-wider">Gateway Status Telemetry</span>
              </div>
              <span className="tag-brutal text-[#00c853] border-[#00c853] text-[8px] px-1.5 py-0.5">HEALTHY</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "PostCSS Processor", state: "Active",    color: "#00c853" },
                { name: "Next.js Dev Server", state: "Port 3000", color: "#00c853" },
                { name: "Django ASGI Server", state: "Port 8000", color: "#00c853" },
                { name: "Redis Cache Queue",  state: "Port 6379", color: "#00c853" },
              ].map(({ name, state, color }) => (
                <div key={name} className="border border-[#1a1a1a] p-3 space-y-1 bg-[#0d0d0d]">
                  <p className="font-mono text-[9px] text-[#444] uppercase tracking-widest">{name}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] text-white">{state}</p>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-[#1e1e1e] bg-[#0d0d0d] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff3b00] flex items-center justify-center shadow-[2px_2px_0_#7a1c00]">
              <span className="font-display text-md text-black leading-none">E</span>
            </div>
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider">
              © {new Date().getFullYear()} EnterpriseHub. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="font-mono text-[10px] text-[#ff3b00] hover:underline uppercase tracking-widest">Sign In</Link>
            <Link href="/register" className="font-mono text-[10px] text-[#ffd600] hover:underline uppercase tracking-widest">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
