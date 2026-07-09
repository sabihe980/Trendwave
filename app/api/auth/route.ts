// =====================================================================
// POSTRICK AI - COMPLETE SAAS AUTHENTICATION ENDPOINT
// File: /app/api/auth/route.ts
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabaseClient";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  action: z.enum(["login", "register", "logout", "session"])
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = authSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload parameters.", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password, fullName, action } = result.data;
    const supabase = getSupabaseClient();

    // -----------------------------------------------------------------
    // A. REGISTER/SIGN UP FLOW
    // -----------------------------------------------------------------
    if (action === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split("@")[0],
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || email)}`
          },
          emailRedirectTo: `${req.nextUrl.origin}/?app=true&onboarded=true`
        }
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: "Registration successful! Please confirm your email check.",
        user: data.user,
        session: data.session
      });
    }

    // -----------------------------------------------------------------
    // B. LOG IN FLOW
    // -----------------------------------------------------------------
    if (action === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      const res = NextResponse.json({
        message: "Login successful!",
        user: data.user,
        session: data.session
      });

      // Securely store credentials in cookie cookies for Middleware routing protection
      if (data.session) {
        res.cookies.set("sb-access-token", data.session.access_token, {
          path: "/",
          maxAge: data.session.expires_in,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax"
        });
        res.cookies.set("sb-refresh-token", data.session.refresh_token || "", {
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 Days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax"
        });
      }

      return res;
    }

    // -----------------------------------------------------------------
    // C. LOG OUT FLOW
    // -----------------------------------------------------------------
    if (action === "logout") {
      await supabase.auth.signOut();
      const res = NextResponse.json({ message: "Logout context cleared." });
      res.cookies.delete("sb-access-token");
      res.cookies.delete("sb-refresh-token");
      return res;
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error: any) {
    console.error("Auth Routine Error:", error);
    return NextResponse.json({ error: "Internal Server Error in authentication pipeline." }, { status: 500 });
  }
}

/**
 * GET route to read active user profile from current session header / cookie state
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const token = req.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    // Query profiles table to retrieve active tenant database parameters
    const adminClient = getSupabaseAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("*, workspaces(*)")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      authenticated: true,
      user,
      profile
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
