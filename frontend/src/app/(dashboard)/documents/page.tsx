"use client";

import { useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import { Upload, Search, FileText, File, FileImage, FileCode } from "lucide-react";
import { useState, useRef } from "react";
import { clsx } from "clsx";
import toast from "react-hot-toast";

const FILE_ICON: Record<string, any> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  js: FileCode,
  ts: FileCode,
  py: FileCode,
};

const FILE_COLOR: Record<string, string> = {
  pdf: "text-accent",
  doc: "text-accent-blue",
  docx: "text-accent-blue",
  png: "text-accent-green",
  jpg: "text-accent-green",
  jpeg: "text-accent-green",
};

function getExt(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents", search],
    queryFn: () => documentService.list({ search }),
  });

  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("name", file.name);
    try {
      await documentService.upload(form);
      toast.success("Uploaded. AI processing started.");
      refetch();
    } catch {
      toast.error("Upload failed.");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Knowledge Base</p>
          <h1 className="section-title">Documents</h1>
          <p className="font-mono text-[10px] text-muted-fg mt-1 uppercase">{data?.count ?? 0} files</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          <button onClick={() => fileRef.current?.click()} className="btn-brutal-accent">
            <Upload size={13} />
            Upload File
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border-2 border-[#1a1a1a] hover:border-white/30 px-3 py-2 max-w-sm transition-colors">
        <Search size={11} className="text-muted-fg" />
        <input
          type="text"
          placeholder="Semantic search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent font-mono text-xs text-white placeholder:text-muted-fg focus:outline-none w-full"
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleUpload(f);
        }}
        onClick={() => fileRef.current?.click()}
        className={clsx(
          "border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-100",
          dragging ? "border-accent bg-accent/5" : "border-[#1a1a1a] hover:border-white/30"
        )}
      >
        <Upload size={24} className={clsx("mx-auto mb-2 transition-colors", dragging ? "text-accent" : "text-muted-fg")} />
        <p className="font-mono text-[11px] text-muted-fg uppercase tracking-widest">
          Drop files here or click to upload
        </p>
        <p className="font-mono text-[10px] text-muted-fg/60 mt-1">PDF, DOCX, TXT, images supported</p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-36 skeleton border-2 border-[#1a1a1a]" />
          ))}
        </div>
      ) : data?.results?.length === 0 ? (
        <div className="border-2 border-[#1a1a1a] p-16 text-center">
          <p className="font-display text-3xl uppercase text-muted-fg tracking-wider">No Documents</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data?.results?.map((doc: any) => {
            const ext = getExt(doc.name);
            const Icon = FILE_ICON[ext] || File;
            const color = FILE_COLOR[ext] || "text-muted-fg";
            return (
              <div key={doc.id} className="border-2 border-[#1a1a1a] bg-surface p-4 hover:border-white hover:shadow-[3px_3px_0px_#f5f5f0] transition-all duration-100 cursor-pointer group flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Icon size={20} className={color} />
                  {doc.is_indexed && (
                    <span className="tag-brutal text-accent-green border-accent-green text-[8px]">AI</span>
                  )}
                </div>
                <p className="font-mono text-[11px] text-white truncate group-hover:text-accent transition-colors">
                  {doc.name}
                </p>
                <p className="font-mono text-[10px] text-muted-fg">{formatSize(doc.file_size)}</p>
                {doc.ai_summary && (
                  <p className="font-mono text-[9px] text-muted-fg line-clamp-2 border-t border-[#1a1a1a] pt-2 mt-auto">
                    {doc.ai_summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
