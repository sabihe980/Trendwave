-- =====================================================================
-- POSTRICK AI - ROW LEVEL SECURITY (RLS) & TENANT ISOLATION POLICIES
-- Migration: 20260623000001_rls_policies.sql
-- Description: Establishes column-level, row-level, and cross-workspace access locks
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caption_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (id = auth.uid());

DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (id = auth.uid());

-- ---------------------------------------------------------------------
-- 2. WORKSPACES POLICIES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view workspaces they own" ON public.workspaces;
CREATE POLICY "Users can view workspaces they own" 
ON public.workspaces FOR SELECT 
USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces" 
ON public.workspaces FOR INSERT 
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can update workspaces they own" ON public.workspaces;
CREATE POLICY "Users can update workspaces they own" 
ON public.workspaces FOR UPDATE 
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete workspaces they own" ON public.workspaces;
CREATE POLICY "Users can delete workspaces they own" 
ON public.workspaces FOR DELETE 
USING (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- 3. SOCIAL ACCOUNTS POLICIES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view social accounts linked to their workspaces" ON public.social_accounts;
CREATE POLICY "Users can view social accounts linked to their workspaces" 
ON public.social_accounts FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = social_accounts.workspace_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can link social accounts to their workspaces" ON public.social_accounts;
CREATE POLICY "Users can link social accounts to their workspaces" 
ON public.social_accounts FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = social_accounts.workspace_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update social accounts linked to their workspaces" ON public.social_accounts;
CREATE POLICY "Users can update social accounts linked to their workspaces" 
ON public.social_accounts FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = social_accounts.workspace_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can disconnect social accounts" ON public.social_accounts;
CREATE POLICY "Users can disconnect social accounts" 
ON public.social_accounts FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = social_accounts.workspace_id AND w.owner_id = auth.uid()
    )
);

-- ---------------------------------------------------------------------
-- 4. POSTS & POST MEDIA POLICIES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view posts from their workspaces" ON public.posts;
CREATE POLICY "Users can view posts from their workspaces" 
ON public.posts FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = posts.workspace_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can create posts in their workspaces" ON public.posts;
CREATE POLICY "Users can create posts in their workspaces" 
ON public.posts FOR INSERT 
WITH CHECK (
    user_id = auth.uid() AND 
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = posts.workspace_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update posts in their workspaces" ON public.posts;
CREATE POLICY "Users can update posts in their workspaces" 
ON public.posts FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = posts.workspace_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can delete posts in their workspaces" ON public.posts;
CREATE POLICY "Users can delete posts in their workspaces" 
ON public.posts FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces w 
        WHERE w.id = posts.workspace_id AND w.owner_id = auth.uid()
    )
);

-- Post media inherited policies
DROP POLICY IF EXISTS "Users can access media linked to their workspace posts" ON public.post_media;
CREATE POLICY "Users can access media linked to their workspace posts"
ON public.post_media FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.workspaces w ON w.id = p.workspace_id
        WHERE p.id = post_media.post_id AND w.owner_id = auth.uid()
    )
);

-- ---------------------------------------------------------------------
-- 5. SCHEDULED POSTS POLICIES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select scheduled posts in their workspace posts" ON public.scheduled_posts;
CREATE POLICY "Users can select scheduled posts in their workspace posts"
ON public.scheduled_posts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.workspaces w ON w.id = p.workspace_id
        WHERE p.id = scheduled_posts.post_id AND w.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert/modify scheduled entries" ON public.scheduled_posts;
CREATE POLICY "Users can insert/modify scheduled entries"
ON public.scheduled_posts FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.workspaces w ON w.id = p.workspace_id
        WHERE p.id = scheduled_posts.post_id AND w.owner_id = auth.uid()
    )
);

-- ---------------------------------------------------------------------
-- 6. AI & CREATIVE GENERATIONS POLICIES (Users manage their own archives)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select their own AI logs" ON public.ai_generations;
CREATE POLICY "Users can select their own AI logs"
ON public.ai_generations FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own AI logs" ON public.ai_generations;
CREATE POLICY "Users can create their own AI logs"
ON public.ai_generations FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their caption generations" ON public.caption_generations;
CREATE POLICY "Users can manage their caption generations"
ON public.caption_generations FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their image generations" ON public.image_generations;
CREATE POLICY "Users can manage their image generations"
ON public.image_generations FOR ALL USING (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 7. SUBSCRIPTIONS, PAYMENTS, NOTIFICATIONS, ACTIVITIES, AUDITING & METRIC STATS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can select their subscription details" ON public.subscriptions;
CREATE POLICY "Users can select their subscription details"
ON public.subscriptions FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can select their payment receipts" ON public.payments;
CREATE POLICY "Users can select their payment receipts"
ON public.payments FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their notification box" ON public.notifications;
CREATE POLICY "Users can manage their notification box"
ON public.notifications FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view activities in their workspace" ON public.activity_logs;
CREATE POLICY "Users can view activities in their workspace"
ON public.activity_logs FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can record their activities" ON public.activity_logs;
CREATE POLICY "Users can record their activities"
ON public.activity_logs FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their audit logs"
ON public.audit_logs FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their usage tracking counters" ON public.usage_tracking;
CREATE POLICY "Users can view their usage tracking counters"
ON public.usage_tracking FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their personal API keys" ON public.api_keys;
CREATE POLICY "Users can manage their personal API keys"
ON public.api_keys FOR ALL USING (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 8. ANALYTICS POLICIES
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view metrics for their connected social accounts" ON public.analytics;
CREATE POLICY "Users can view metrics for their connected social accounts"
ON public.analytics FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.social_accounts sa
        JOIN public.workspaces w ON w.id = sa.workspace_id
        WHERE sa.id = analytics.social_account_id AND w.owner_id = auth.uid()
    )
);
