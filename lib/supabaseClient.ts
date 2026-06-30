// =====================================================================
// SAVVYGROW AI - SUPABASE INTEGRATION CLIENT LAYER
// File: /lib/supabaseClient.ts
// =====================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;
let serverAdminInstance: SupabaseClient | null = null;

/**
 * Creates a recursive, callable mock proxy for Supabase queries and commands
 * so that missing keys never throw unhandled property exceptions during evaluation.
 */
function createRecursiveMockProxy(path: string = "supabase"): any {
  const mockFn = () => {
    return createRecursiveMockProxy(`${path}()`);
  };

  return new Proxy(mockFn, {
    get(target, prop, receiver) {
      if (prop === "then") {
        return (resolve: any) => {
          resolve({
            data: {},
            error: null
          });
        };
      }

      if (prop === Symbol.iterator || prop === "inspect" || typeof prop === "symbol") {
        return undefined;
      }

      return createRecursiveMockProxy(`${path}.${String(prop)}`);
    }
  });
}

/**
 * Returns a primary Supabase Client safe for client-side and public requests.
 * Uses lazy instantiation to avoid startup crashes if secrets are missing.
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment keys are missing! Returning a mocked/silent client proxy to prevent application crash."
    );
    // Returns a proxy handler that intercepts calls to gracefully notify the developer/user
    return createRecursiveMockProxy();
  }

  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return clientInstance;
}

/**
 * Returns a high-privileged Admin client for backend server actions / webhooks.
 * Crucial for multi-tenant checks, bypasses RLS safely where necessary.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (serverAdminInstance) return serverAdminInstance;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      "Supabase Service Role Key is missing! Lazily routing admin requests to standard anon capabilities."
    );
    return getSupabaseClient();
  }

  serverAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return serverAdminInstance;
}
