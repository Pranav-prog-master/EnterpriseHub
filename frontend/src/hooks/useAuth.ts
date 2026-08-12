"use client";

import { useAppSelector } from "./useAppSelector";

export function useAuth() {
  const { user, accessToken, loading, error } = useAppSelector((s) => s.auth);
  return {
    user,
    accessToken,
    loading,
    error,
    isAuthenticated: !!accessToken,
    isAdmin: user?.role === "super_admin" || user?.role === "company_admin",
    isHR: user?.role === "hr" || user?.role === "company_admin" || user?.role === "super_admin",
  };
}
