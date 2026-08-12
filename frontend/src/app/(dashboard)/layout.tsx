"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for access denied error (only on client side)
    const error = searchParams?.get("error");
    const message = searchParams?.get("message");
    
    if (error === "access_denied") {
      setAccessDenied(true);
      setErrorMessage(message || "You don't have permission to access that page");
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setAccessDenied(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  return (
    <div data-scope="dashboard" data-fontsize="medium" data-density="comfortable" className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar />
        
        {/* Access Denied Alert - only render on client */}
        {mounted && accessDenied && (
          <div className="mx-6 mt-4 p-4 border-2 flex items-start gap-3 animate-fade-in" style={{ borderColor: "#ff3b00", background: "#ff3b0015" }}>
            <AlertCircle size={20} className="shrink-0 mt-0.5" style={{ color: "#ff3b00" }} />
            <div className="flex-1">
              <p className="font-mono text-sm font-medium" style={{ color: "#ff3b00" }}>Access Denied</p>
              <p className="font-mono text-xs mt-1" style={{ color: "#ff3b00", opacity: 0.8 }}>{errorMessage}</p>
            </div>
            <button 
              onClick={() => setAccessDenied(false)}
              className="shrink-0 transition-opacity hover:opacity-70"
              style={{ color: "#ff3b00" }}
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <main
          className="flex-1 overflow-y-auto p-6 animate-fade-in"
          style={{ background: "var(--bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
