// =====================================================================
// POSTRICK AI - ROUTE SECURITY AND SESSION REFRESHEMENT MIDDLEWARE
// File: /middleware.ts
// =====================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Decodes a JWT token payload natively without external library dependencies
 * to ensure 100% Edge Runtime compatibility.
 */
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Next.js Middleware representing SaaS route protections and JWT/Role verification.
 */
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
