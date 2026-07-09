// =====================================================================
// POSTRICK AI - NOTIFICATIONS API
// File: /app/api/notifications/route.ts
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve list of notifications for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const token = req.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized user." }, { status: 401 });
    }

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Create a notification for a user (admin/system action)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, message, type } = body;

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing required fields: userId, title, message." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type: type || "general",
        is_read: false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notification });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH: Mark a notification as read or update fields
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationId, isRead } = body;

    if (!notificationId) {
      return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: notification, error } = await supabase
      .from("notifications")
      .update({ is_read: isRead ?? true, updated_at: new Date().toISOString() })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notification });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete a notification
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing notification id." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("notifications").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Notification deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
