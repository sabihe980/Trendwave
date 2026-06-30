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

    // Fetch connected social accounts to sync analytics metrics
    const { data: accounts, error: accountError } = await supabase
      .from("social_accounts")
      .select("id, platform, username");

    if (accountError) throw accountError;

    const todayStr = new Date().toISOString().substring(0, 10);
    const results = [];

    for (const account of (accounts || [])) {
      // In production, this pulls real-time metric increments from Facebook, LinkedIn, TikTok APIs.
      // Here we simulate the dynamic daily metrics sync.
      const followersCount = Math.floor(5000 + Math.random() * 50000);
      const impressions = Math.floor(1000 + Math.random() * 15000);
      const reach = Math.floor(800 + Math.random() * 12000);
      const likes = Math.floor(50 + Math.random() * 1200);
      const comments = Math.floor(5 + Math.random() * 300);
      const shares = Math.floor(2 + Math.random() * 150);
      const clicks = Math.floor(10 + Math.random() * 500);
      const totalEngagements = likes + comments + shares + clicks;
      const engagementRate = impressions > 0 ? parseFloat(((totalEngagements / impressions) * 100).toFixed(2)) : 0;

      const { data, error: upsertError } = await supabase
        .from("analytics")
        .upsert({
          social_account_id: account.id,
          recorded_date: todayStr,
          followers_count: followersCount,
          impressions: impressions,
          reach: reach,
          likes: likes,
          comments: comments,
          shares: shares,
          clicks: clicks,
          engagement_rate: engagementRate
        }, {
          onConflict: "social_account_id,recorded_date"
        })
        .select()
        .single();

      if (upsertError) {
        results.push({ account_id: account.id, success: false, error: upsertError.message });
      } else {
        results.push({ account_id: account.id, success: true, record: data });
      }
    }

    return new Response(
      JSON.stringify({ date: todayStr, processed: results.length, sync_results: results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
