"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { clsx } from "clsx";

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarPage() {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
  const firstDay    = new Date(cur.year, cur.month, 1).getDay();
  const cells       = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const prev = () => setCur((c) => c.month === 0  ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCur((c) => c.month === 11 ? { year: c.year + 1, month: 0  } : { ...c, month: c.month + 1 });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Schedule</p>
          <h1 className="section-title">Calendar</h1>
        </div>
        <button className="btn-brutal-accent"><Plus size={13} /> New Event</button>
      </div>

      <div className="border-2 border-border bg-surface">
        {/* Nav */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
          <button onClick={prev} className="w-8 h-8 border-2 border-border flex items-center justify-center hover:border-white transition-colors">
            <ChevronLeft size={14} className="text-white" />
          </button>
          <h2 className="font-display text-3xl uppercase tracking-wider">
            {MONTHS[cur.month]} <span className="text-accent">{cur.year}</span>
          </h2>
          <button onClick={next} className="w-8 h-8 border-2 border-border flex items-center justify-center hover:border-white transition-colors">
            <ChevronRight size={14} className="text-white" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b-2 border-border">
          {DAYS.map((d) => (
            <div key={d} className="px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-fg border-r-2 border-border last:border-r-0">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const isToday = day === today.getDate() && cur.month === today.getMonth() && cur.year === today.getFullYear();
            return (
              <div
                key={i}
                className={clsx(
                  "min-h-[80px] p-2 border-r-2 border-b-2 border-border last:border-r-0 transition-colors",
                  day ? "hover:bg-white/3 cursor-pointer" : "bg-black/20",
                  isToday && "bg-accent/5"
                )}
              >
                {day && (
                  <span className={clsx("font-mono text-xs font-bold inline-flex items-center justify-center w-5 h-5",
                    isToday ? "bg-accent text-black" : "text-muted-fg"
                  )}>
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
