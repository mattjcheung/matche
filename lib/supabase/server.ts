import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for server components and server actions, authenticated as
 * the signed-in Clerk user (Supabase third-party auth). Row-level security sees
 * the Clerk user id as `auth.jwt() ->> 'sub'` (`public.me()` in SQL).
 */
export function createServerSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return createClient(url, key, {
    async accessToken() {
      return (await auth()).getToken();
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
