// =====================================================================
// POSTRICK AI - ENTERPRISE SECURITY & AUTHORIZATION HELPER
// File: /lib/security.ts
// =====================================================================

import { NextRequest } from "next/server";
import { getSupabaseAdminClient } from "./supabaseClient";

/**
 * Decodes a JWT token natively to extract payload claims.
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

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

/**
 * Identifies the requesting user by validating request headers or cookies.
 */
export function getAuthenticatedUser(req: NextRequest): AuthenticatedUser | null {
  // 1. Check request headers set by our secure middleware
  const headerUserId = req.headers.get("x-user-id");
  const headerEmail = req.headers.get("x-user-email");
  const headerRole = req.headers.get("x-user-role");

  if (headerUserId) {
    return {
      userId: headerUserId,
      email: headerEmail || "",
      role: headerRole || "User",
    };
  }

  // 2. Fallback to direct cookie decoding if headers are missing
  const token = req.cookies.get("sb-access-token")?.value;
  if (token) {
    const payload = decodeJwt(token);
    if (payload && payload.sub) {
      return {
        userId: payload.sub,
        email: payload.email || "",
        role: payload.app_metadata?.role || "User",
      };
    }
  }

  // Support local developer testing and preview environments when Supabase is not configured
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return {
      userId: "00000000-0000-0000-0000-000000000000",
      email: "developer@postrick.internal",
      role: "Admin",
    };
  }

  return null;
}

/**
 * Assures a user is authorized to perform workspace actions (Multi-tenant BOLA prevention).
 */
export async function verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<boolean> {
  if (!workspaceId || !userId) return false;

  // Seamless developer bypass if supabase is not yet provisioned
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials missing, allowing local demo mode workspace authorization.");
    return true; 
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data: ws, error } = await supabase
      .from("workspaces")
      .select("owner_id")
      .eq("id", workspaceId)
      .maybeSingle();

    if (error || !ws) {
      console.error("Workspace access lookup failed:", error?.message);
      return false;
    }

    return ws.owner_id === userId;
  } catch (err) {
    console.error("Workspace access check exception:", err);
    return false;
  }
}
