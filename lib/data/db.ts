import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Seed } from "./seed";
import { TABLES, type TableKey } from "./tables";
import type { User } from "./types";

/** Tables the signed-in user can see (row-level security applied). */
export type Db = { [K in TableKey]: Seed[K] };

type Holder = {
  userId: string | null;
  loaded: Partial<Record<TableKey, unknown[]>>;
  inflight: Partial<Record<TableKey, Promise<void>>>;
  view: Db | null;
};

/** Request-scoped state: each table is fetched at most once per request. */
const holder = cache((): Holder => ({ userId: null, loaded: {}, inflight: {}, view: null }));

/**
 * Load the tables a page needs, then read them synchronously through the
 * query functions (`db()`). Pages pass `needsFor(...)` from
 * `lib/data/queries/needs.ts`; `users` is always included.
 */
export async function loadDb(tables: readonly TableKey[]): Promise<void> {
  const h = holder();
  if (!h.userId) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
    h.userId = userId;
  }
  const sb = createServerSupabase();
  const wanted = [...new Set<TableKey>(["users", ...tables])];

  await Promise.all(
    wanted.map((key) => {
      if (h.loaded[key]) return undefined;
      h.inflight[key] ??= (async () => {
        const { data, error } = await sb.from(TABLES[key]).select("*");
        if (error) throw new Error(`Supabase: reading ${TABLES[key]} failed – ${error.message}`);
        h.loaded[key] = data ?? [];
      })();
      return h.inflight[key];
    }),
  );

  // First visit: no profile row yet → claim the demo account or create one.
  const users = h.loaded.users as User[];
  if (!users.some((u) => u.id === h.userId)) {
    await createAccount(sb, h.userId!);
    const { data, error } = await sb.from("users").select("*");
    if (error) throw new Error(`Supabase: reading users failed – ${error.message}`);
    h.loaded.users = data ?? [];
    // Other tables may now reference the new id; refetch what this page uses.
    for (const key of wanted) {
      if (key === "users") continue;
      delete h.loaded[key];
      delete h.inflight[key];
    }
    if (wanted.length > 1) return loadDb(tables);
  }
}

/** The loaded tables. Reading a table the page didn't load is a bug and throws. */
export function db(): Db {
  const h = holder();
  h.view ??= new Proxy({} as Db, {
    get(_, key: string) {
      const rows = h.loaded[key as TableKey];
      if (!rows) {
        throw new Error(`db().${key} was not loaded for this page – add its query module to needsFor(...) and run \`npm run db:needs\``);
      }
      return rows;
    },
  });
  return h.view;
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

/** Take over the demo account if it's unclaimed, otherwise create a profile from Clerk. */
async function createAccount(sb: ReturnType<typeof createServerSupabase>, userId: string) {
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
  const { error } = await sb.from("users").insert({
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
  // A concurrent request may have created it first.
  if (error && error.code !== "23505") throw new Error(`Supabase: creating your profile failed – ${error.message}`);
}
