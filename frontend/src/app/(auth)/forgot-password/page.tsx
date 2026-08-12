"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent!");
    } catch {
      const msg = "Failed to send reset email. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-scope="auth"
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#0a0a0a", backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "28px 28px" }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-px" style={{ background: "#ff3b00" }} />
            <p className="font-mono text-[9px] uppercase tracking-[0.35em]" style={{ color: "#ff3b00" }}>Account Recovery</p>
          </div>
          <h1 className="font-display text-6xl uppercase tracking-wider leading-none" style={{ color: "#f5f5f0" }}>
            Enterprise<span style={{ color: "#ff3b00" }}>Hub</span>
          </h1>
        </div>

        {/* Card */}
        <div className="border-2" style={{ borderColor: "#2a2a2a", background: "#111111", boxShadow: "6px 6px 0 #ff3b00" }}>

          {/* Card header */}
          <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: "2px solid #1e1e1e" }}>
            <Mail size={16} style={{ color: "#ff3b00" }} />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: "#ff3b00" }}>Password Reset</p>
              <h2 className="font-display text-3xl uppercase tracking-wider" style={{ color: "#f5f5f0" }}>Forgot Password</h2>
            </div>
          </div>

          <div className="px-6 py-6">
            {sent ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 border-2 p-4" style={{ borderColor: "#00c853", background: "#00c85312" }}>
                  <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#00c853" }} />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: "#00c853" }}>Email Sent</p>
                    <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#555" }}>
                      A reset link has been sent to{" "}
                      <span style={{ color: "#f5f5f0" }}>{email}</span>.<br />
                      Check your inbox — link expires in 30 minutes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 font-mono text-[10px] uppercase tracking-wider transition-all"
                  style={{ borderColor: "#f5f5f0", color: "#f5f5f0", background: "transparent", boxShadow: "3px 3px 0 #f5f5f0" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #f5f5f0"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 #f5f5f0"; }}
                >
                  Send Another Link
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#555" }}>
                  Enter your account email and we'll send a password reset link.
                </p>

                {error && (
                  <div className="flex items-start gap-2 border-2 p-3" style={{ borderColor: "#ff3b00", background: "#ff3b0012" }}>
                    <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: "#ff3b00" }} />
                    <p className="font-mono text-[10px]" style={{ color: "#ff3b00" }}>{error}</p>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className="w-full border-2 px-3 py-2.5 font-mono text-sm focus:outline-none transition-colors"
                    style={{ background: "#0a0a0a", borderColor: "#1e1e1e", color: "#f5f5f0" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#ff3b00")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-100 disabled:opacity-50"
                  style={{ background: "#ff3b00", borderColor: "#ff3b00", color: "#000", boxShadow: "4px 4px 0 #7a1c00" }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 #7a1c00"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 #7a1c00"; }}
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>Send Reset Link <ArrowRight size={13} /></>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="px-6 py-4" style={{ borderTop: "2px solid #1e1e1e" }}>
            <Link
              href="/login"
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-colors"
              style={{ color: "#444" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffd600")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}
            >
              <ArrowLeft size={11} /> Back to Sign In
            </Link>
          </div>
        </div>

        <p className="font-mono text-[9px] text-center mt-4" style={{ color: "#333" }}>
          Protected by enterprise-grade encryption
        </p>
      </div>
    </div>
  );
}
