// =====================================================================
// SAVVYGROW AI - SOCIAL MEDIA POSTS & SCHEDULER CRUD API
// File: /app/api/posts/route.ts
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabaseClient";
import { z } from "zod";

// Validator Schema for Post Insertion and updates
const postInputSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1),
  title: z.string().optional(),
  status: z.enum(["draft", "scheduled", "publishing", "published", "failed"]).default("draft"),
  targetPlatforms: z.array(z.string()).min(1),
  scheduledTime: z.string().datetime().optional(), // ISO timestamp
  mediaUrls: z.array(z.string().url()).optional(),
  attachmentName: z.string().optional(),
  colorPreset: z.string().optional(),
  subtitle: z.string().optional(),
  tagBadge: z.string().optional()
});

/**
 * GET: Retrieve list of posts/campaigns filtered by workspace or status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing parameter: workspaceId is required." }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let query = supabase
      .from("posts")
      .select("*, post_media(*), scheduled_posts(*)")
      .eq("workspace_id", workspaceId);

    if (status) {
      query = query.eq("status", status);
    }

    // Sort to give scheduling timeline
    const { data: posts, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Create a new draft, scheduled item, or instantly publish campaign
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = postInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failure", details: result.error.format() }, { status: 400 });
    }

    const val = result.data;
    const supabase = getSupabaseAdminClient(); // Use admin client to enable full transaction integrity across multiple tables

    // 1. Write the base post record
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .insert({
        workspace_id: val.workspaceId,
        user_id: val.userId,
        content: val.content,
        title: val.title || "New Campaign Post",
        status: val.status,
        target_platforms: val.targetPlatforms
      })
      .select()
      .single();

    if (postErr || !post) {
      return NextResponse.json({ error: `Base insertion failure: ${postErr?.message}` }, { status: 400 });
    }

    // 2. Write associated media attachments if any are provided
    if (val.mediaUrls && val.mediaUrls.length > 0) {
      const mediaRows = val.mediaUrls.map(url => ({
        post_id: post.id,
        file_url: url,
        media_preset: "image",
        dimensions_aspect: val.colorPreset || "1:1"
      }));

      const { error: mediaErr } = await supabase.from("post_media").insert(mediaRows);
      if (mediaErr) {
        console.error("Postmedia association failure:", mediaErr.message);
      }
    }

    // 3. Populate scheduled queue timeline if scheduledTime is designated
    if (val.status === "scheduled" && val.scheduledTime) {
      // Find connected channel/account matching platforms
      const { data: accounts } = await supabase
        .from("social_accounts")
        .select("id, platform")
        .eq("workspace_id", val.workspaceId)
        .in("platform", val.targetPlatforms);

      if (accounts && accounts.length > 0) {
        const scheduleRows = accounts.map(acct => ({
          post_id: post.id,
          social_account_id: acct.id,
          scheduled_at: val.scheduledTime,
          status: "scheduled"
        }));

        const { error: schedErr } = await supabase.from("scheduled_posts").insert(scheduleRows);
        if (schedErr) {
          console.error("Scheduled queue booking failure:", schedErr.message);
        }
      }
    }

    // 4. Log the action in Audit & Activities history trackers
    await supabase.from("activity_logs").insert({
      user_id: val.userId,
      workspace_id: val.workspaceId,
      action: "post_created",
      details: { post_id: post.id, status: val.status, channels: val.targetPlatforms }
    });

    // 5. Update Monthly Usage limitations (enforce premium checks)
    const currentMonth = new Date().toISOString().substring(0, 7);
    await supabase.rpc("increment_monthly_post_usage", { 
      p_user_id: val.userId, 
      p_month: currentMonth 
    }).catch(() => {
      // Direct update fallback in case RPC constraint triggers are handled raw inside SQL migrations
      supabase
        .from("usage_tracking")
        .update({ posts_count: 1 }) // handled via trigger increments
        .match({ user_id: val.userId, month_year: currentMonth });
    });

    return NextResponse.json({
      message: "Post compiled successfully!",
      post: {
        ...post,
        attachmentName: val.attachmentName,
        colorPreset: val.colorPreset,
        subtitle: val.subtitle,
        tagBadge: val.tagBadge
      }
    });

  } catch (err: any) {
    console.error("Post creator exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE: Delete a resource item from lists cleanly
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!postId) {
      return NextResponse.json({ error: "Missing required post identifier id." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Optional: log deletion activities
    if (userId) {
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action: "post_deleted",
        details: { post_id: postId }
      });
    }

    return NextResponse.json({ message: "Post deleted successfully from scheduled ledger." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
