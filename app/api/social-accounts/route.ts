// =====================================================================
// POSTRICK AI - SOCIAL ACCOUNTS INTEGRATION API
// File: /app/api/social-accounts/route.ts
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabaseClient";
import { getAuthenticatedUser, verifyWorkspaceAccess } from "@/lib/security";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve list of connected social accounts for a workspace
 */
export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing parameter: workspaceId is required." }, { status: 400 });
    }

    // Tenant boundary verification
    const hasAccess = await verifyWorkspaceAccess(workspaceId, user.userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You do not own this workspace." }, { status: 403 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json({ accounts: getMockSocialAccounts(workspaceId) });
    }

    const supabase = getSupabaseClient();
    const { data: accounts, error } = await supabase
      .from("social_accounts")
      .select("*")
      .eq("workspace_id", workspaceId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ accounts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Create or upsert a social account connection
 */
export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, platform, platformUserId, username, avatarUrl, accessToken } = body;

    if (!workspaceId || !platform || !platformUserId || !username || !accessToken) {
      return NextResponse.json({ error: "Missing required fields in payload." }, { status: 400 });
    }

    // Tenant boundary verification
    const hasAccess = await verifyWorkspaceAccess(workspaceId, user.userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You do not own this workspace." }, { status: 403 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json({
        account: {
          id: `sim-sa-${Date.now()}`,
          workspace_id: workspaceId,
          platform,
          platform_user_id: platformUserId,
          username,
          avatar_url: avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`,
          created_at: new Date().toISOString()
        }
      });
    }

    const supabase = getSupabaseAdminClient();
    const { data: account, error } = await supabase
      .from("social_accounts")
      .upsert({
        workspace_id: workspaceId,
        platform,
        platform_user_id: platformUserId,
        username,
        avatar_url: avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`,
        access_token: accessToken,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "workspace_id,platform,platform_user_id"
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ account });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE: Remove a social account connection
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing parameter: id is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // Verify tenant authorization before disconnecting
    const { data: acct, error: fetchErr } = await supabase
      .from("social_accounts")
      .select("workspace_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: "Error checking account safety: " + fetchErr.message }, { status: 400 });
    }

    if (acct) {
      const hasAccess = await verifyWorkspaceAccess(acct.workspace_id, user.userId);
      if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden: You do not own this workspace." }, { status: 403 });
      }
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json({ message: "Social account connection disconnected successfully." });
    }

    const { error } = await supabase.from("social_accounts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Social account connection disconnected successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function getMockSocialAccounts(workspaceId: string) {
  return [
    {
      id: "sa-1",
      workspace_id: workspaceId,
      platform: "instagram",
      platform_user_id: "ig_dev",
      username: "postrick_design",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=postrick_design",
      created_at: new Date().toISOString()
    },
    {
      id: "sa-2",
      workspace_id: workspaceId,
      platform: "linkedin",
      platform_user_id: "li_dev",
      username: "Postrick AI",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=PostrickAI",
      created_at: new Date().toISOString()
    },
    {
      id: "sa-3",
      workspace_id: workspaceId,
      platform: "facebook",
      platform_user_id: "fb_dev",
      username: "Postrick Studio",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=PostrickStudio",
      created_at: new Date().toISOString()
    }
  ];
}
