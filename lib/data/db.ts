import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Seed } from "./seed";
import { TABLES, type TableKey } from "./tables";
import type { User } from "./types";

/** Every table the signed-in user can see (row-level security applied). */
export type Db = { [K in TableKey]: Seed[K] };

/**
 * Request-scoped snapshot. Pages call `await loadDb()` once; the query
 * functions in `lib/data/queries/*` then read it synchronously via `db()`.
 */
const holder = cache(() => ({ db: null as Db | null, userId: null as string | null, pending: null as Promise<Db> | null }));

export async function loadDb(): Promise<Db> {
  const h = holder();
  if (h.db) return h.db;
  h.pending ??= (async () => {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
    const sb = createServerSupabase();
    await ensureAccount(sb, userId);

    const entries = await Promise.all(
      (Object.keys(TABLES) as TableKey[]).map(async (key) => {
        const { data, error } = await sb.from(TABLES[key]).select("*");
        if (error) throw new Error(`Supabase: reading ${TABLES[key]} failed – ${error.message}`);
        return [key, data ?? []] as const;
      }),
    );
    h.userId = userId;
    h.db = Object.fromEntries(entries) as unknown as Db;
    return h.db;
  })();
  return h.pending;
}

/** The loaded snapshot. Throws if the page forgot `await loadDb()`. */
export function db(): Db {
  const d = holder().db;
  if (!d) throw new Error("db() called before `await loadDb()` in this request");
  return d;
}

/** The signed-in user's id (Clerk user id). */
export function me(): string {
  const id = holder().userId;
  if (!id) throw new Error("me() called before `await loadDb()` in this request");
  return id;
}

export function findUser(id: string): User | undefined {
  return db().users.find((u) => u.id === id);
}

/** A user row, or a neutral placeholder if the row isn't visible. */
export function getUser(id: string): User {
  return (
    findUser(id) ?? {
      id,
      name: "Unknown traveller",
      short_name: "Someone",
      initials: "?",
      tone: "#DDE2DD",
      home_city: "",
      home_country: "",
      home_lon: 0,
      home_lat: 0,
    }
  );
}

/**
 * First visit: take over the demo account if it's unclaimed, otherwise create
 * a fresh profile from the Clerk user.
 */
async function ensureAccount(sb: ReturnType<typeof createServerSupabase>, userId: string) {
  const { data: existing, error } = await sb.from("users").select("id").eq("id", userId).maybeSingle();
  if (error) throw new Error(`Supabase: checking your profile failed – ${error.message}`);
  if (existing) return;

  const { data: claimed, error: claimError } = await sb.rpc("claim_demo_account");
  if (claimError) throw new Error(`Supabase: claiming the demo account failed – ${claimError.message}`);
  if (claimed) return;

  const cu = await currentUser();
  const name = [cu?.firstName, cu?.lastName].filter(Boolean).join(" ") || cu?.username || "New traveller";
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const { error: insertError } = await sb.from("users").insert({
    id: userId,
    name,
    short_name: name.split(" ")[0],
    initials,
    tone: "#0B5F5B",
    tone_fg: "#FFFFFF",
    home_city: "",
    home_country: "",
    home_lon: 0,
    home_lat: 0,
  });
  if (insertError) throw new Error(`Supabase: creating your profile failed – ${insertError.message}`);
}
