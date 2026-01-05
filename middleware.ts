import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

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
    const payload = jwt.decode(token) as { role?: string } | null;
    if (!payload?.role) return NextResponse.next();

    const role = payload.role;

    // =========================
    // MAP ROLE → DASHBOARD
    // =========================
    const roleDashboardMap: Record<string, string> = {
      SCHOOL_ADMIN: "/dashboardxzx",
      TEACHER: "/dashboard/teacher",
      STUDENT: "/dashboard/student",
    };

    const allowedBasePath = roleDashboardMap[role];

    // =========================
    // 1. AKSES /LOGIN
    // =========================
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL(allowedBasePath, req.url));
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
