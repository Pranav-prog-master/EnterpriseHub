import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-based route access control
const roleAccessMap = {
  // Admin roles - full access
  company_admin: [
    "/dashboard",
    "/projects",
    "/tasks",
    "/hr",
    "/crm",
    "/analytics",
    "/reports",
    "/documents",
    "/calendar",
    "/finance",
    "/settings",
    "/collaboration",
  ],
  
  // HR role - HR + limited access
  hr: [
    "/dashboard",
    "/hr",
    "/employees",
    "/documents",
    "/calendar",
    "/settings",
    "/collaboration",
  ],
  
  // Project Manager - project management focus
  project_manager: [
    "/dashboard",
    "/projects",
    "/tasks",
    "/analytics",
    "/reports",
    "/documents",
    "/calendar",
    "/collaboration",
    "/settings",
  ],
  
  // Team Lead - similar to project manager
  team_lead: [
    "/dashboard",
    "/projects",
    "/tasks",
    "/reports",
    "/documents",
    "/calendar",
    "/collaboration",
    "/settings",
  ],
  
  // Employee - basic access
  employee: [
    "/dashboard",
    "/projects",
    "/tasks",
    "/documents",
    "/calendar",
    "/collaboration",
    "/settings",
  ],
  
  // Client - limited external access
  client: [
    "/dashboard",
    "/projects",
    "/documents",
    "/collaboration",
  ],
};

// Default dashboard by role
const roleDashboards: Record<string, string> = {
  company_admin: "/dashboard",
  hr: "/dashboard",
  project_manager: "/dashboard", 
  team_lead: "/dashboard",
  employee: "/dashboard",
  client: "/dashboard",
};

// Public routes that redirect based on role if already logged in
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication data from cookies
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("user_role")?.value as keyof typeof roleAccessMap;
  const isAuthenticated = !!token;

  // Check if current path is an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to role-based dashboard if trying to access auth routes while logged in
  if (isAuthRoute && isAuthenticated && userRole) {
    const defaultDashboard = roleDashboards[userRole] || "/dashboard";
    return NextResponse.redirect(new URL(defaultDashboard, request.url));
  }

  // Check if route requires authentication
  const requiresAuth = pathname.startsWith("/dashboard") || 
                       pathname.startsWith("/projects") ||
                       pathname.startsWith("/tasks") ||
                       pathname.startsWith("/hr") ||
                       pathname.startsWith("/crm") ||
                       pathname.startsWith("/analytics") ||
                       pathname.startsWith("/reports") ||
                       pathname.startsWith("/documents") ||
                       pathname.startsWith("/calendar") ||
                       pathname.startsWith("/finance") ||
                       pathname.startsWith("/settings") ||
                       pathname.startsWith("/collaboration");

  // Redirect to login if not authenticated
  if (requiresAuth && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (requiresAuth && isAuthenticated && userRole) {
    const allowedRoutes = roleAccessMap[userRole] || [];
    
    // Check if user has access to this route
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));
    
    if (!hasAccess) {
      // Redirect to their default dashboard with error message
      const defaultDashboard = roleDashboards[userRole] || "/dashboard";
      const url = new URL(defaultDashboard, request.url);
      url.searchParams.set("error", "access_denied");
      url.searchParams.set("message", "You don't have permission to access this page");
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|images|.*\\..*).*)"],
};
