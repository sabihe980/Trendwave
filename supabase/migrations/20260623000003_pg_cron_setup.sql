-- =====================================================================
-- SAVVYGROW AI - AUTOMATED SCHEDULING & CRON BACKGROUND PROCESSORS
-- Migration: 20260623000003_pg_cron_setup.sql
-- Description: Sets up the pg_cron and pg_net extensions with highly resilient,
--              idempotent background triggers to automatically poll scheduled posts
--              and synchronize marketing analytics metrics once daily.
-- =====================================================================

-- 1. Enable pg_net and pg_cron extensions inside Postgres safely (handles restricted environments)
DO $$
BEGIN
    -- Enable pg_net for asynchronous non-blocking HTTP service-to-service communication
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_net;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Skipping pg_net enablement (optional or restricted): %', SQLERRM;
    END;

    -- Enable pg_cron for SQL-level cron jobs inside Postgres
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Skipping pg_cron enablement (optional or restricted): %', SQLERRM;
    END;
END$$;

-- ---------------------------------------------------------------------
-- 2. DYNAMIC WEB HOOK INVOCATION WRAPPERS
-- ---------------------------------------------------------------------

-- Create a table to store system environment URLs/keys dynamically for secure loopbacks
CREATE TABLE IF NOT EXISTS public.system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Seed defaults with loopback URLs for easy initial run
INSERT INTO public.system_config (key, value, description)
VALUES 
('SUPABASE_URL', 'http://localhost:54321', 'Root URL of the Supabase API stack'),
('SUPABASE_SERVICE_ROLE_KEY', '', 'Master service key with bypass RLS clearance')
ON CONFLICT (key) DO NOTHING;

-- Create dynamic helper functions to hit Edge Functions via SQL
CREATE OR REPLACE FUNCTION public.invoke_edge_function(function_name TEXT)
RETURNS TEXT AS $$
DECLARE
    target_url TEXT;
    service_key TEXT;
    request_id TEXT;
BEGIN
    -- 1. Grab settings from public.system_config
    SELECT value INTO target_url FROM public.system_config WHERE key = 'SUPABASE_URL';
    SELECT value INTO service_key FROM public.system_config WHERE key = 'SUPABASE_SERVICE_ROLE_KEY';

    IF target_url IS NULL OR target_url = '' THEN
        target_url := 'http://localhost:54321';
    END IF;

    -- Ensure correct functions/v1 syntax
    target_url := RTRIM(target_url, '/') || '/functions/v1/' || function_name;

    -- 2. Attempt invocation via pg_net (asynchronous call)
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
        IF service_key IS NOT NULL AND service_key <> '' THEN
            SELECT net.http_post(
                url := target_url,
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || service_key
                ),
                body := '{}'::jsonb
            )::TEXT INTO request_id;
        ELSE
            SELECT net.http_post(
                url := target_url,
                headers := '{"Content-Type": "application/json"}'::jsonb,
                body := '{}'::jsonb
            )::TEXT INTO request_id;
        END IF;
        
        RETURN 'Queued background request to ' || target_url || ' (Request ID: ' || COALESCE(request_id, 'Unknown') || ')';
    ELSE
        RETURN 'pg_net extension is not installed. Enable it to run cron actions.';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RETURN 'Error initiating web request to ' || function_name || ': ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ---------------------------------------------------------------------
-- 3. AUTOMATED DB CRON SCHEDULER REGISTRATIONS
-- ---------------------------------------------------------------------

-- Wrapper function to schedule jobs safely using cron schema
CREATE OR REPLACE FUNCTION public.setup_automated_cron_jobs()
RETURNS TEXT AS $$
DECLARE
    cron_installed BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') INTO cron_installed;
    
    IF NOT cron_installed THEN
        RETURN 'pg_cron is not enabled. Please enable the pg_cron extension on your Supabase dashboard to automate scheduling.';
    END IF;

    -- Unschedule any existing jobs safely with dynamic SQL to prevent compile-time dependency issues
    BEGIN
        EXECUTE 'SELECT cron.unschedule(''schedule-post-every-minute'')';
    EXCEPTION WHEN OTHERS THEN
        -- If it didn't exist, ignore
    END;

    -- Schedule Post check to execute every single minute dynamically
    BEGIN
        EXECUTE '
            SELECT cron.schedule(
                ''schedule-post-every-minute'',
                ''* * * * *'',
                ''SELECT public.invoke_edge_function(''''schedule-post'''');''
            )
        ';
    EXCEPTION WHEN OTHERS THEN
        RETURN 'Error registering schedule-post cron: ' || SQLERRM;
    END;

    -- Unschedule any existing analytics jobs safely
    BEGIN
        EXECUTE 'SELECT cron.unschedule(''analytics-sync-daily'')';
    EXCEPTION WHEN OTHERS THEN
        -- If it didn't exist, ignore
    END;

    -- Schedule Analytics metric synchronizer to run once daily at midnight dynamically
    BEGIN
        EXECUTE '
            SELECT cron.schedule(
                ''analytics-sync-daily'',
                ''0 0 * * *'',
                ''SELECT public.invoke_edge_function(''''analytics-sync'''');''
            )
        ';
    EXCEPTION WHEN OTHERS THEN
        RETURN 'Error registering analytics-sync cron: ' || SQLERRM;
    END;

    RETURN 'Success: Both cron jobs ("schedule-post-every-minute" & "analytics-sync-daily") registered!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger initial scheduler setup
SELECT public.setup_automated_cron_jobs();
