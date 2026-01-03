import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  // jika tidak ada token → biarkan lanjut ke login
  if (!token) return NextResponse.next();

  try {
    // decode token di edge runtime
    const payload = jwt.decode(token) as { role?: string } | null;

    if (!payload?.role) return NextResponse.next();

    const { role } = payload;

    // redirect default kalau user coba akses login
    if (req.nextUrl.pathname.startsWith("/login")) {
      let redirectUrl = "/dashboard";

      if (role === "TEACHER") redirectUrl = "/dashboard/teacher";
      if (role === "STUDENT") redirectUrl = "/dashboard/student";
      if (role === "ADMIN") redirectUrl = "/dashboardxyz/admin";

      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*"], // bisa custom sesuai kebutuhan
};
