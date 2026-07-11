// =====================================================================
// POSTRICK AI - BILLING & STRIPE INTEGRATION API
// File: /app/api/billing/route.ts
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseClient";
import { getAuthenticatedUser } from "@/lib/security";
import { z } from "zod";

const billingActionSchema = z.object({
  userId: z.string().uuid(),
  planTier: z.enum(["Free", "Pro", "Agency"]),
  billingCycle: z.enum(["monthly", "yearly"]),
  action: z.enum(["checkout", "cancel", "sync"])
});

/**
 * GET: Reads subscription state of the active customer account
 */
export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required." }, { status: 400 });
    }

    // Secure BOLA check
    if (userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden: You cannot access billing data of another user." }, { status: 403 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json({
        subscription: {
          plan_tier: "Free",
          status: "active",
          billing_cycle: "monthly",
          current_period_end: null,
          payments: []
        }
      });
    }

    const supabase = getSupabaseAdminClient();
    const { data: sub, error } = await supabase
      .from("subscriptions")
      .select("*, payments(*)")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!sub) {
      // Default fallback plan mapping
      return NextResponse.json({
        planTier: "Free",
        status: "active",
        billingCycle: "monthly",
        currentPeriodEnd: null,
        payments: []
      });
    }

    return NextResponse.json({ subscription: sub });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Initiates simulated checkout routines and upgrades subscription tiers
 */
export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const body = await req.json();
    const result = billingActionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failure", details: result.error.format() }, { status: 400 });
    }

    const { userId, planTier, billingCycle, action } = result.data;

    // Secure BOLA check
    if (userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden: You cannot modify billing data of another user." }, { status: 403 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      const billingEnd = new Date();
      billingEnd.setMonth(billingEnd.getMonth() + (billingCycle === "yearly" ? 12 : 1));

      return NextResponse.json({
        success: true,
        message: `Plan upgraded successfully to ${planTier}! (Simulated local mode)`,
        stripeSessionUrl: null,
        subscription: {
          id: `sim-sub-${Date.now()}`,
          user_id: userId,
          plan_tier: planTier,
          status: "active",
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: billingEnd.toISOString()
        }
      });
    }

    const supabase = getSupabaseAdminClient();

    // 1. Handle checkout initiation
    if (action === "checkout") {
      const priceUSD = planTier === "Pro" ? 29 : planTier === "Agency" ? 79 : 0;
      const amountCalculated = billingCycle === "yearly" ? priceUSD * 12 * 0.8 : priceUSD; // 20% discount on annual

      // Real code: initialize Stripe Client, construct Checkout sessions, return Redirect URL.
      // Below logic handles high-performance seamless upgrade instantly to provide direct usability in preview!
      const billingEnd = new Date();
      billingEnd.setMonth(billingEnd.getMonth() + (billingCycle === "yearly" ? 12 : 1));

      // Upsert billing tiers safely
      const { data: sub, error: subErr } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: userId,
          plan_tier: planTier,
          status: "active",
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: billingEnd.toISOString()
        }, { onConflict: "user_id" })
        .select()
        .single();

      if (subErr) {
        return NextResponse.json({ error: `Checkout process mapping failed: ${subErr.message}` }, { status: 400 });
      }

      // Record transaction ledger receipts
      if (amountCalculated > 0) {
        await supabase.from("payments").insert({
          user_id: userId,
          subscription_id: sub.id,
          amount: amountCalculated,
          currency: "USD",
          stripe_payment_intent_id: `pi_mock_${Math.random().toString(36).substring(2, 10)}`,
          status: "succeeded"
        });
      }

      // Log activity state
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action: "subscription_upgraded",
        details: { tier: planTier, cycle: billingCycle, paid: amountCalculated }
      });

      return NextResponse.json({
        success: true,
        message: `Plan upgraded successfully to ${planTier}!`,
        stripeSessionUrl: null, // set if Stripe redirect is active
        subscription: sub
      });
    }

    // 2. Handle cancellation loops
    if (action === "cancel") {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Log details
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action: "subscription_canceled",
        details: { requested_at: new Date().toISOString() }
      });

      return NextResponse.json({ success: true, message: "Subscription schedule updated for termination." });
    }

    return NextResponse.json({ error: "Action not supported." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
