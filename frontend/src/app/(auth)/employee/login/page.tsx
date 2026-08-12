"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginUser } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import { ArrowRight, Users, AlertCircle, Eye, EyeOff, UserCircle2, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function EmployeeLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      // Force employee role for employee login
      await dispatch(loginUser({ 
        email: data.email, 
        password: data.password, 
        role: "employee" 
      })).unwrap();
      
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.detail || err?.non_field_errors?.[0] || err?.message || "Login failed.";
      setApiError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      data-scope="auth"
      className="min-h-screen flex items-center justify-center overflow-hidden p-6"
      style={{ background: "#0a0a0a", backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "28px 28px" }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-[0.03]" style={{ background: "#0057ff", transform: "rotate(-45deg)" }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.02]" style={{ background: "#00c853", transform: "rotate(25deg)" }} />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 flex items-center justify-center shadow-[4px_4px_0_#002a7a]" style={{ background: "#0057ff" }}>
              <Briefcase size={24} style={{ color: "#fff" }} />
            </div>
            <div>
              <h1 className="font-display text-5xl uppercase tracking-wider leading-none" style={{ color: "#f5f5f0" }}>
                Enterprise<span style={{ color: "#0057ff" }}>Hub</span>
              </h1>
              <p className="font-mono text-[10px] mt-1" style={{ color: "#555" }}>Employee Access Portal</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="border-2" style={{ borderColor: "#2a2a2a", background: "#111111", boxShadow: "8px 8px 0 #0057ff" }}>
          
          {/* Header */}
          <div className="px-6 py-5 border-b-2 flex items-center gap-3" style={{ borderBottom: "2px solid #1e1e1e", background: "linear-gradient(to right, #0057ff08, transparent)" }}>
            <UserCircle2 size={24} style={{ color: "#0057ff" }} />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] mb-0.5" style={{ color: "#0057ff" }}>Team Member</p>
              <h2 className="font-display text-3xl uppercase tracking-wider" style={{ color: "#f5f5f0" }}>Employee Login</h2>
            </div>
          </div>

          {/* Info banner */}
          <div className="px-6 py-3 border-b-2 flex items-start gap-2.5" style={{ borderBottom: "2px solid #1e1e1e", background: "#00c85308" }}>
            <Users size={14} className="shrink-0 mt-0.5" style={{ color: "#00c853" }} />
            <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#888" }}>
              Access your workspace, projects, and collaborate with your team.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
            
            {/* API error */}
            {apiError && (
              <div className="flex items-start gap-2 border-2 p-3" style={{ borderColor: "#ff3b00", background: "#ff3b0012" }}>
                <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: "#ff3b00" }} />
                <p className="font-mono text-[10px]" style={{ color: "#ff3b00" }}>{apiError}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>
                Work Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full border-2 px-3 py-2.5 font-mono text-sm focus:outline-none transition-colors"
                style={{ background: "#0a0a0a", borderColor: "#1e1e1e", color: "#f5f5f0" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#0057ff")}
                onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#ff3b00" : "#1e1e1e")}
              />
              {errors.email && <p className="font-mono text-[10px] mt-1.5" style={{ color: "#ff3b00" }}>⚠ {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "#555" }}>
                  Password
                </label>
                <Link href="/forgot-password" className="font-mono text-[9px] uppercase transition-colors hover:underline" style={{ color: "#444" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057ff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full border-2 px-3 py-2.5 pr-10 font-mono text-sm focus:outline-none transition-colors"
                  style={{ background: "#0a0a0a", borderColor: "#1e1e1e", color: "#f5f5f0" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#0057ff")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#ff3b00" : "#1e1e1e")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#555" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f0")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="font-mono text-[10px] mt-1.5" style={{ color: "#ff3b00" }}>⚠ {errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-100 disabled:opacity-50"
              style={{ background: "#0057ff", borderColor: "#0057ff", color: "#fff", boxShadow: "5px 5px 0 #002a7a" }}
              onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "3px 3px 0 #002a7a"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 #002a7a"; }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <UserCircle2 size={14} />
                  Sign In
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t-2 flex items-center justify-between" style={{ borderTop: "2px solid #1e1e1e", background: "#0a0a0a" }}>
            <p className="font-mono text-[10px]" style={{ color: "#444" }}>
              Administrator? <Link href="/admin/login" className="hover:underline" style={{ color: "#ff3b00" }}>Login here</Link>
            </p>
            <Link href="/register" className="font-mono text-[10px] hover:underline" style={{ color: "#444" }}>
              Register
            </Link>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="font-mono text-[9px] text-center mt-4" style={{ color: "#333" }}>
          <Users size={10} className="inline mr-1" style={{ color: "#0057ff" }} />
          Secure workspace access
        </p>
      </div>
    </div>
  );
}
