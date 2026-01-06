import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type JwtPayload = { role?: string };

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

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;

  // belum login → cuma boleh ke login
  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = decodeJwtPayload(token);
    const role = payload?.role;
    if (!role) return NextResponse.next();

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
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (!allowedBasePath) {
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // =========================
    // 2. AKSES DASHBOARD SALAH ROLE
    // =========================
    if (
      pathname.startsWith("/dashboard") &&
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
