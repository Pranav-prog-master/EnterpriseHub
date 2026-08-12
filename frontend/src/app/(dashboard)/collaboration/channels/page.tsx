"use client";

import { useQuery } from "@tanstack/react-query";
import { collaborationService } from "@/services/collaborationService";
import { Hash, Plus, Lock, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ChannelsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: collaborationService.listChannels,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Collaboration</p>
          <h1 className="section-title">Channels</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">Team communication</p>
        </div>
        <button className="btn-brutal-accent">
          <Plus size={13} />
          New Channel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Channels", value: data?.count ?? "—", color: "border-accent-blue" },
          { label: "Public", value: data?.results?.filter((c: any) => !c.is_private).length ?? "—", color: "border-accent-green" },
          { label: "Private", value: data?.results?.filter((c: any) => c.is_private).length ?? "—", color: "border-accent-yellow" },
        ].map((s) => (
          <div key={s.label} className={`border-2 ${s.color} bg-surface p-4`}>
            <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest">{s.label}</p>
            <p className="font-display text-4xl text-white mt-1 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Channels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 skeleton border-2 border-[#1a1a1a]" />
          ))}
        </div>
      ) : data?.results?.length === 0 ? (
        <div className="border-2 border-[#1a1a1a] p-16 text-center">
          <p className="font-display text-3xl uppercase text-muted-fg tracking-wider">No Channels Yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data?.results?.map((ch: any) => (
            <Link key={ch.id} href={`/collaboration/channels/${ch.id}`}>
              <div className="border-2 border-[#1a1a1a] bg-surface p-4 hover:border-white hover:shadow-[4px_4px_0px_#f5f5f0] transition-all duration-100 cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`border-2 p-1.5 ${ch.is_private ? "border-accent-yellow" : "border-accent-blue"}`}>
                    {ch.is_private
                      ? <Lock size={12} className="text-accent-yellow" />
                      : <Hash size={12} className="text-accent-blue" />
                    }
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-white group-hover:text-accent transition-colors">
                    {ch.name}
                  </h3>
                  {ch.is_private && (
                    <span className="ml-auto tag-brutal text-accent-yellow border-accent-yellow text-[8px]">Private</span>
                  )}
                </div>
                <p className="font-mono text-[11px] text-muted-fg line-clamp-2 mb-3">
                  {ch.description || "No description"}
                </p>
                <div className="flex items-center gap-3 border-t-2 border-[#1a1a1a] pt-2">
                  <div className="flex items-center gap-1">
                    <Users size={10} className="text-muted-fg" />
                    <span className="font-mono text-[10px] text-muted-fg">{ch.member_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={10} className="text-muted-fg" />
                    <span className="font-mono text-[10px] text-muted-fg">{ch.message_count ?? 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
