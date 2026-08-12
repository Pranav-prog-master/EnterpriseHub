"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginUser } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import {
  ArrowRight, Zap, Shield, BarChart3, Users,
  AlertCircle, Eye, EyeOff, ShieldCheck, UserCircle2,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";

const schema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role:     z.enum(["company_admin", "employee"]),
});

type FormData = z.infer<typeof schema>;

const ROLES = [
  { value: "company_admin" as const, label: "Admin",    desc: "Full platform access", icon: ShieldCheck, color: "#ff3b00" },
  { value: "employee"      as const, label: "Employee", desc: "Standard workspace",   icon: UserCircle2, color: "#0057ff" },
];

const FEATURES = [
  { icon: BarChart3, label: "Analytics",  desc: "Real-time business intelligence", color: "#ff3b00" },
  { icon: Users,     label: "HR Suite",   desc: "Complete workforce management",   color: "#0057ff" },
  { icon: Zap,       label: "AI Engine",  desc: "Intelligent automation",          color: "#ffd600" },
  { icon: Shield,    label: "Enterprise", desc: "Bank-grade security",             color: "#00c853" },
];

export default function LoginPage() {
  const router   = useRouter();
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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "employee" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      await dispatch(loginUser({ email: data.email, password: data.password, role: data.role })).unwrap();
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
      className="min-h-screen flex overflow-hidden"
      style={{ background: "#0a0a0a", backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "28px 28px" }}
    >
      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] border-r-2 p-12 relative overflow-hidden"
        style={{ background: "#0d0d0d", borderColor: "#1e1e1e" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 opacity-[0.07]" style={{ background: "#ff3b00", transform: "rotate(25deg)" }} />
        <div className="absolute bottom-24 -left-12 w-48 h-48 opacity-[0.04]" style={{ background: "#ffd600", transform: "rotate(-15deg)" }} />
        <div className="absolute top-1/2 right-8 w-px h-32 opacity-20" style={{ background: "linear-gradient(to bottom, transparent, #ff3b00, transparent)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 flex items-center justify-center shadow-[3px_3px_0_#7a1c00]" style={{ background: "#ff3b00" }}>
            <span className="font-display text-xl text-black leading-none">E</span>
          </div>
          <div>
            <p className="font-display text-2xl uppercase tracking-wider leading-none" style={{ color: "#f5f5f0" }}>
              Enterprise<span style={{ color: "#ff3b00" }}>Hub</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "#444" }}>Management Platform v2</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center relative z-10 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: "#ff3b00" }} />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: "#ff3b00" }}>Welcome back</p>
          </div>
          <h1
            className="font-display uppercase leading-[0.88] tracking-wider"
            style={{ fontSize: "clamp(60px, 7.5vw, 108px)", color: "#f5f5f0" }}
          >
            Enter<br />
            <span style={{ color: "#ff3b00" }}>prise</span><br />
            Hub
          </h1>
          <p className="font-mono text-[12px] mt-6 max-w-xs leading-relaxed" style={{ color: "#555" }}>
            The complete enterprise management platform.<br />
            Manage people, projects, and performance.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-2.5 mt-8">
            {FEATURES.map(({ icon: Icon, label, desc, color }) => (
              <div
                key={label}
                className="p-3 flex items-start gap-2.5 transition-all duration-150 group cursor-default"
                style={{ border: "1px solid #1e1e1e" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
              >
                <Icon size={12} className="shrink-0 mt-0.5 transition-colors" style={{ color }} />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#f5f5f0" }}>{label}</p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: "#444" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-3 pt-5 relative z-10" style={{ borderTop: "1px solid #1e1e1e" }}>
          <Activity size={10} style={{ color: "#00c853" }} />
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00c853" }} />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "#444" }}>All systems operational</span>
          <span className="ml-auto font-mono text-[9px]" style={{ color: "#333" }}>v2.0.0</span>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-display text-5xl uppercase tracking-wider" style={{ color: "#f5f5f0" }}>
              Enterprise<span style={{ color: "#ff3b00" }}>Hub</span>
            </h1>
            <p className="font-mono text-[10px] mt-1" style={{ color: "#555" }}>Management Platform v2</p>
          </div>

          {/* Card */}
          <div className="border-2" style={{ borderColor: "#2a2a2a", background: "#111111", boxShadow: "6px 6px 0 #ff3b00" }}>

            {/* Card header */}
            <div className="px-6 py-5" style={{ borderBottom: "2px solid #1e1e1e" }}>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: "#ff3b00" }}>Access Portal</p>
              <h2 className="font-display text-4xl uppercase tracking-wider" style={{ color: "#f5f5f0" }}>Sign In</h2>
              <p className="font-mono text-[11px] mt-1" style={{ color: "#555" }}>Select your role and enter credentials</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">

              {/* Role selector */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>Sign in as</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(({ value, label, desc, icon: Icon, color }) => {
                    const active = selectedRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue("role", value)}
                        className="flex flex-col items-start gap-1.5 p-3 border-2 transition-all duration-100"
                        style={{
                          borderColor: active ? color : "#2a2a2a",
                          background:  active ? `${color}12` : "transparent",
                          boxShadow:   active ? `3px 3px 0 ${color}` : "none",
                        }}
                      >
                        <Icon size={14} style={{ color: active ? color : "#555" }} />
                        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: active ? color : "#888" }}>
                          {label}
                        </span>
                        <span className="font-mono text-[9px]" style={{ color: "#444" }}>{desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.role && <p className="font-mono text-[10px] mt-1" style={{ color: "#ff3b00" }}>⚠ {errors.role.message}</p>}
              </div>

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
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full border-2 px-3 py-2.5 font-mono text-sm focus:outline-none transition-colors"
                  style={{ background: "#0a0a0a", borderColor: "#1e1e1e", color: "#f5f5f0" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#ff3b00")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#ff3b00" : "#1e1e1e")}
                />
                {errors.email && <p className="font-mono text-[10px] mt-1.5" style={{ color: "#ff3b00" }}>⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "#555" }}>Password</label>
                  <Link href="/forgot-password" className="font-mono text-[9px] uppercase transition-colors hover:underline" style={{ color: "#444" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ff3b00")}
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
                    onFocus={e => (e.currentTarget.style.borderColor = "#ff3b00")}
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
                style={{ background: "#ff3b00", borderColor: "#ff3b00", color: "#000", boxShadow: "4px 4px 0 #7a1c00" }}
                onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 #7a1c00"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 #7a1c00"; }}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign In <ArrowRight size={13} /></>
                )}
              </button>
            </form>

            <div className="px-6 py-4" style={{ borderTop: "2px solid #1e1e1e" }}>
              <p className="font-mono text-[10px] text-center" style={{ color: "#444" }}>
                No account?{" "}
                <Link href="/register" className="hover:underline" style={{ color: "#ffd600" }}>
                  Register here
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom hint */}
          <p className="font-mono text-[9px] text-center mt-4" style={{ color: "#333" }}>
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
}
