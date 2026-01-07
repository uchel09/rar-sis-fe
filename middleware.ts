import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type JwtPayload = { role?: string; exp?: number };

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;
  return exp * 1000 <= Date.now();
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;
  const requiresAuth = pathname.startsWith("/dashboard");

  // belum login → cuma boleh ke login
  if (!token) {
    if (requiresAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = decodeJwtPayload(token);
    const role = payload?.role;
    if (!payload || !role || isTokenExpired(payload.exp)) {
      const res = requiresAuth
        ? NextResponse.redirect(new URL("/login", req.url))
        : NextResponse.next();
      res.cookies.set("access_token", "", { path: "/", maxAge: 0 });
      return res;
    }

    // =========================
    // MAP ROLE → DASHBOARD
    // =========================
    const roleDashboardMap: Record<string, string | null> = {
      SCHOOL_ADMIN: "/dashboardxzx",
      TEACHER: "/dashboard/teacher",
      STUDENT: "/dashboard/student",
      SUPERADMIN: null,
      PARENT: null,
      STAFF: null,
    };

    const allowedBasePath = roleDashboardMap[role];

    // =========================
    // 1. AKSES /LOGIN
    // =========================
    if (pathname.startsWith("/login")) {
      if (allowedBasePath) {
        return NextResponse.redirect(new URL(allowedBasePath, req.url));
      }
      if (allowedBasePath === null) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (allowedBasePath === null) {
      if (requiresAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (!allowedBasePath) {
      if (requiresAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // =========================
    // 2. AKSES DASHBOARD SALAH ROLE
    // =========================
    if (
      requiresAuth &&
      !pathname.startsWith(allowedBasePath)
    ) {
      return NextResponse.redirect(new URL(allowedBasePath, req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*", "/dashboardxzx/:path*"],
};
