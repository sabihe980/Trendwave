-- =====================================================================
-- SAVVYGROW AI - TRIGGERS, INDEXES & AUTOMATIC USER ONBOARDING
-- Migration: 20260623000002_triggers_and_indexes.sql
-- Description: Sets up high-performance indices and database-level triggers
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. DATABASE INDEXES FOR SPEED (Especially for Joins/Filtering)
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_workspace ON public.social_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_workspace ON public.posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_time ON public.scheduled_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON public.scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_analytics_account_date ON public.analytics(social_account_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON public.usage_tracking(user_id, month_year);

-- ---------------------------------------------------------------------
-- 2. AUTOMATIC UPDATED_AT TRIGGER DEFINITION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to every table (dropping if exists first for idempotency)
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER tr_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_social_accounts_updated_at ON public.social_accounts;
CREATE TRIGGER tr_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_posts_updated_at ON public.posts;
CREATE TRIGGER tr_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_scheduled_posts_updated_at ON public.scheduled_posts;
CREATE TRIGGER tr_scheduled_posts_updated_at BEFORE UPDATE ON public.scheduled_posts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_post_media_updated_at ON public.post_media;
CREATE TRIGGER tr_post_media_updated_at BEFORE UPDATE ON public.post_media FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_ai_generations_updated_at ON public.ai_generations;
CREATE TRIGGER tr_ai_generations_updated_at BEFORE UPDATE ON public.ai_generations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_caption_generations_updated_at ON public.caption_generations;
CREATE TRIGGER tr_caption_generations_updated_at BEFORE UPDATE ON public.caption_generations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_image_generations_updated_at ON public.image_generations;
CREATE TRIGGER tr_image_generations_updated_at BEFORE UPDATE ON public.image_generations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_analytics_updated_at ON public.analytics;
CREATE TRIGGER tr_analytics_updated_at BEFORE UPDATE ON public.analytics FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_payments_updated_at ON public.payments;
CREATE TRIGGER tr_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_notifications_updated_at ON public.notifications;
CREATE TRIGGER tr_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_activity_logs_updated_at ON public.activity_logs;
CREATE TRIGGER tr_activity_logs_updated_at BEFORE UPDATE ON public.activity_logs FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_audit_logs_updated_at ON public.audit_logs;
CREATE TRIGGER tr_audit_logs_updated_at BEFORE UPDATE ON public.audit_logs FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_usage_tracking_updated_at ON public.usage_tracking;
CREATE TRIGGER tr_usage_tracking_updated_at BEFORE UPDATE ON public.usage_tracking FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER tr_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ---------------------------------------------------------------------
-- 3. AUTO-ONBOARDING OF NEW USERS FROM AUTH.USERS
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_onboarding()
RETURNS TRIGGER AS $$
DECLARE
    default_workspace_id UUID;
    workspace_slug TEXT;
BEGIN
    -- 1. Create Profile first for newly registered auth.users account
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'User'::user_role
    );

    -- 2. Build unique URL Slug for user workspace
    workspace_slug := LOWER(SPLIT_PART(NEW.email, '@', 1)) || '-' || SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 6);

    -- 3. Provision Default SaaS Workspace
    INSERT INTO public.workspaces (name, slug, owner_id)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)) || ' Workspace',
        workspace_slug,
        NEW.id
    )
    RETURNING id INTO default_workspace_id;

    -- 4. Set Workspace as primary active option in user profile
    UPDATE public.profiles 
    SET current_workspace_id = default_workspace_id 
    WHERE id = NEW.id;

    -- 5. Seed initial Free Tier subscription level details
    INSERT INTO public.subscriptions (user_id, plan_tier, status)
    VALUES (NEW.id, 'Free'::subscription_tier, 'active'::subscription_status);

    -- 6. Initialize Usage quotas tracking for current month
    INSERT INTO public.usage_tracking (user_id, month_year, posts_count, ai_words_count, images_count)
    VALUES (NEW.id, TO_CHAR(NOW(), 'YYYY-MM'), 0, 0, 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Link trigger directly to auth.users table modifications inside Supabase auth
DROP TRIGGER IF EXISTS tr_auth_users_onboarding ON auth.users;
CREATE TRIGGER tr_auth_users_onboarding
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_onboarding();
