import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch scheduled posts that are due to publish but have scheduled status
    const { data: postsToPublish, error: fetchError } = await supabase
      .from("scheduled_posts")
      .select("id, post_id, social_account_id, posts(content, target_platforms), social_accounts(platform, access_token)")
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString());

    if (fetchError) throw fetchError;

    const results = [];

    for (const entry of (postsToPublish || [])) {
      // Mark as publishing to prevent race conditions
      await supabase
        .from("scheduled_posts")
        .update({ status: "publishing" })
        .eq("id", entry.id);

      try {
        // Trigger simulated or live publish post edge function
        const publishResponse = await fetch(`${supabaseUrl}/functions/v1/publish-post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({
            scheduled_post_id: entry.id,
            post_id: entry.post_id,
            content: entry.posts.content,
            platform: entry.social_accounts.platform,
            access_token: entry.social_accounts.access_token
          })
        });

        const publishData = await publishResponse.json();
        results.push({ id: entry.id, success: publishResponse.ok, data: publishData });
      } catch (pubErr) {
        await supabase
          .from("scheduled_posts")
          .update({ status: "failed", error_message: pubErr.message })
          .eq("id", entry.id);
        results.push({ id: entry.id, success: false, error: pubErr.message });
      }
    }

    return new Response(
      JSON.stringify({ processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
