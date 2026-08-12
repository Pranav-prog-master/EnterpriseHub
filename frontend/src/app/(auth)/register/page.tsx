"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";
import {
  ArrowRight, UserPlus, AlertCircle,
  Eye, EyeOff, ShieldCheck, UserCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";

const schema = z
  .object({
    first_name:       z.string().min(1, "First name is required"),
    last_name:        z.string().min(1, "Last name is required"),
    email:            z.string().email("Enter a valid email"),
    username:         z.string().min(3, "Username must be at least 3 characters"),
    role:             z.enum(["company_admin", "employee"]),
    password:         z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

const ROLES = [
  { value: "company_admin" as const, label: "Admin",    desc: "Manage the entire organisation", icon: ShieldCheck, color: "#ff3b00" },
  { value: "employee"      as const, label: "Employee", desc: "Access your personal workspace",  icon: UserCircle2, color: "#0057ff" },
];

const inputStyle = {
  background: "#0a0a0a",
  borderColor: "#1e1e1e",
  color: "#f5f5f0",
};

export default function RegisterPage() {
  const router = useRouter();
  const [apiError,    setApiError]    = useState<string | null>(null);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
  const activeColor  = selectedRole === "company_admin" ? "#ff3b00" : "#0057ff";
  const shadowColor  = selectedRole === "company_admin" ? "#7a1c00" : "#002280";

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const { confirm_password, ...payload } = data;
      await authService.register(payload);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      const d   = err?.response?.data;
      const msg =
        typeof d === "string" ? d
        : d?.detail ? d.detail
        : d ? `${Object.keys(d)[0]}: ${Object.values(d)[0]}`
        : "Registration failed. Please try again.";
      setApiError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      data-scope="auth"
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#0a0a0a", backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "28px 28px" }}
    >
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-px" style={{ background: "#ff3b00" }} />
            <p className="font-mono text-[9px] uppercase tracking-[0.35em]" style={{ color: "#ff3b00" }}>Create Account</p>
          </div>
          <h1 className="font-display text-7xl uppercase tracking-wider leading-none" style={{ color: "#f5f5f0" }}>
            Enter<span style={{ color: "#ff3b00" }}>prise</span>Hub
          </h1>
          <p className="font-mono text-[11px] mt-2" style={{ color: "#555" }}>Join the management platform</p>
        </div>

        {/* Card */}
        <div
          className="border-2"
          style={{ borderColor: "#2a2a2a", background: "#111111", boxShadow: `6px 6px 0 ${activeColor}`, transition: "box-shadow 0.15s ease" }}
        >
          {/* Card header */}
          <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: "2px solid #1e1e1e" }}>
            <UserPlus size={16} style={{ color: activeColor }} />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: activeColor }}>New User</p>
              <h2 className="font-display text-3xl uppercase tracking-wider" style={{ color: "#f5f5f0" }}>Register</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">

            {/* Role selector */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>I am a</p>
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

            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-3">
              {(["first_name", "last_name"] as const).map((field) => (
                <div key={field}>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>
                    {field.replace("_", " ")}
                  </label>
                  <input
                    {...register(field)}
                    type="text"
                    className="w-full border-2 px-3 py-2.5 font-mono text-sm focus:outline-none transition-colors"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = activeColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
                  />
                  {errors[field] && <p className="font-mono text-[10px] mt-1" style={{ color: "#ff3b00" }}>⚠ {errors[field]?.message}</p>}
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full border-2 px-3 py-2.5 font-mono text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = activeColor)}
                onBlur={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
              />
              {errors.email && <p className="font-mono text-[10px] mt-1" style={{ color: "#ff3b00" }}>⚠ {errors.email.message}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>Username</label>
              <input
                {...register("username")}
                type="text"
                placeholder="john_doe"
                className="w-full border-2 px-3 py-2.5 font-mono text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = activeColor)}
                onBlur={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
              />
              {errors.username && <p className="font-mono text-[10px] mt-1" style={{ color: "#ff3b00" }}>⚠ {errors.username.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full border-2 px-3 py-2.5 pr-10 font-mono text-sm focus:outline-none transition-colors"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = activeColor)}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
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
              {errors.password && <p className="font-mono text-[10px] mt-1" style={{ color: "#ff3b00" }}>⚠ {errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#555" }}>Confirm Password</label>
              <div className="relative">
                <input
                  {...register("confirm_password")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="w-full border-2 px-3 py-2.5 pr-10 font-mono text-sm focus:outline-none transition-colors"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = activeColor)}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#555" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f0")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirm_password && <p className="font-mono text-[10px] mt-1" style={{ color: "#ff3b00" }}>⚠ {errors.confirm_password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-100 mt-2 disabled:opacity-50"
              style={{
                background:  activeColor,
                borderColor: activeColor,
                color:       activeColor === "#ff3b00" ? "#000" : "#fff",
                boxShadow:   `4px 4px 0 ${shadowColor}`,
              }}
              onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowColor}`; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowColor}`; }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: activeColor === "#ff3b00" ? "#000" : "#fff" }}
                  />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={13} /></>
              )}
            </button>
          </form>

          <div className="px-6 py-4" style={{ borderTop: "2px solid #1e1e1e" }}>
            <p className="font-mono text-[10px] text-center" style={{ color: "#444" }}>
              Already have an account?{" "}
              <Link href="/login" className="hover:underline" style={{ color: "#ff3b00" }}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="font-mono text-[9px] text-center mt-4" style={{ color: "#333" }}>
          Protected by enterprise-grade encryption
        </p>
      </div>
    </div>
  );
}
