/**
 * Generates the Supabase schema + seed from the typed demo rows.
 *
 *   npm run db:generate
 *
 * Writes:
 *   supabase/migrations/0001_init.sql – tables, keys, row-level security, functions
 *   supabase/seed.sql                 – demo data (idempotent)
 *
 * Column types are inferred from the demo rows; review the output before
 * changing a live database.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DEMO_OWNER_ID, seed } from "../lib/data/seed";
import { TABLES, type TableKey } from "../lib/data/tables";

type Row = Record<string, unknown>;
type ColType = "text" | "date" | "timestamptz" | "bigint" | "double precision" | "boolean" | "text[]" | "jsonb";

const ROOT = join(__dirname, "..");
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z$/;

const userIds = new Set(seed.users.map((u) => u.id));
const tripIds = new Set(seed.trips.map((t) => t.id));

/* ------------------------------------------------------------------ types */

function inferType(values: unknown[]): ColType {
  const v = values.filter((x) => x !== null && x !== undefined);
  if (v.length === 0) return "text";
  if (v.every((x) => typeof x === "boolean")) return "boolean";
  if (v.every((x) => typeof x === "number")) return v.every((x) => Number.isInteger(x)) ? "bigint" : "double precision";
  if (v.every((x) => typeof x === "string")) {
    if (v.every((x) => DATE.test(x as string))) return "date";
    if (v.every((x) => TIMESTAMP.test(x as string))) return "timestamptz";
    return "text";
  }
  if (v.every((x) => Array.isArray(x) && (x as unknown[]).every((y) => typeof y === "string"))) return "text[]";
  return "jsonb";
}

function columnsOf(rows: Row[]): Array<{ name: string; type: ColType }> {
  const names: string[] = [];
  for (const r of rows) for (const k of Object.keys(r)) if (!names.includes(k)) names.push(k);
  return names.map((name) => ({ name, type: inferType(rows.map((r) => r[name])) }));
}

/** `id` if present, otherwise the smallest unique combination of key-ish columns. */
function primaryKey(rows: Row[], cols: string[]): string[] | null {
  if (cols.includes("id")) return ["id"];
  const keyish = cols.filter((c) => c.endsWith("_id") || c === "year" || c === "position");
  const unique = (combo: string[]) => new Set(rows.map((r) => combo.map((c) => String(r[c])).join("|"))).size === rows.length;
  for (const c of keyish) if (unique([c])) return [c];
  for (let i = 0; i < keyish.length; i++) for (let j = i + 1; j < keyish.length; j++) if (unique([keyish[i], keyish[j]])) return [keyish[i], keyish[j]];
  return null;
}

/** Columns that hold a user id (every non-null value is a known user). */
function isUserColumn(name: string, rows: Row[]): boolean {
  if (!/(^|_)(user|friend|author|owner|viewer|from_user|to_user)_id$|^paid_by$/.test(name)) return false;
  const vals = rows.map((r) => r[name]).filter((v) => v !== null && v !== undefined);
  return vals.length > 0 && vals.every((v) => typeof v === "string" && userIds.has(v));
}

function isTripColumn(name: string, rows: Row[]): boolean {
  if (name !== "trip_id") return false;
  const vals = rows.map((r) => r[name]).filter((v) => v !== null && v !== undefined);
  return vals.every((v) => typeof v === "string" && tripIds.has(v));
}

/* ------------------------------------------------------------- literals */

function lit(v: unknown, type: ColType): string {
  if (v === null || v === undefined) return "null";
  if (type === "jsonb") return `${quote(JSON.stringify(v))}::jsonb`;
  if (type === "text[]") return `array[${(v as string[]).map(quote).join(", ")}]::text[]`;
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  return quote(String(v));
}
const quote = (s: string) => `'${s.replace(/'/g, "''")}'`;

/* --------------------------------------------------------------- policies */

/** Tables everyone signed in can read (public social content & profiles). */
const PUBLIC_READ = new Set<TableKey>([
  "users", "posts", "postComments", "featuredRecaps", "stories", "friendActivity", "experiences",
  "destinations", "destinationNotes", "destinationStats", "destinationCosts", "userDestinationLinks",
  "friendJournalEntries", "travelGroups", "visitedRegions", "travelSummaries", "volunteerOpportunities",
  "tripReviews", "userBadges", "userProfiles", "userTravelStats", "userYearNights", "profileNotes",
]);

/** Trip-scoped tables members can read and change. */
const MEMBER_WRITE = new Set<TableKey>(["bookings", "expenses", "todos", "itineraryEvents", "tripStops", "packingItems", "tripChecklistItems"]);

function policiesFor(key: TableKey, table: string, cols: string[]): string[] {
  const p: string[] = [];
  const sel = (name: string, using: string) => p.push(`create policy "${name}" on public.${table} for select to authenticated using (${using});`);
  const all = (name: string, check: string) =>
    p.push(`create policy "${name}" on public.${table} for all to authenticated using (${check}) with check (${check});`);

  switch (key) {
    case "users":
      sel("Profiles are visible to signed-in users", "true");
      p.push(`create policy "Users insert their own profile" on public.users for insert to authenticated with check (id = public.me());`);
      p.push(`create policy "Users update their own profile" on public.users for update to authenticated using (id = public.me()) with check (id = public.me());`);
      return p;
    case "friendships":
      sel("See your own friendships", "user_id = public.me() or friend_id = public.me()");
      all("Manage your own friendships", "user_id = public.me()");
      return p;
    case "trips":
      sel("See trips you are on or your friends own", "public.can_see_trip(id)");
      p.push(`create policy "Create your own trips" on public.trips for insert to authenticated with check (owner_id = public.me());`);
      p.push(`create policy "Owners update trips" on public.trips for update to authenticated using (owner_id = public.me()) with check (owner_id = public.me());`);
      p.push(`create policy "Owners delete trips" on public.trips for delete to authenticated using (owner_id = public.me());`);
      return p;
    case "tripMembers":
      sel("See members of visible trips", "public.can_see_trip(trip_id)");
      p.push(`create policy "Owners add members, people add themselves" on public.trip_members for insert to authenticated with check (user_id = public.me() or public.owns_trip(trip_id));`);
      p.push(`create policy "Owners remove members, people leave" on public.trip_members for delete to authenticated using (user_id = public.me() or public.owns_trip(trip_id));`);
      return p;
    case "tripLocations":
      sel("See locations of visible trips", "public.can_see_trip(trip_id)");
      return p;
    case "journalEntries":
      sel("Members see shared entries and their own", "public.is_trip_member(trip_id) and (visibility = 'group' or author_id = public.me())");
      p.push(`create policy "Members write their own entries" on public.journal_entries for insert to authenticated with check (author_id = public.me() and public.is_trip_member(trip_id));`);
      p.push(`create policy "Authors edit their entries" on public.journal_entries for update to authenticated using (author_id = public.me()) with check (author_id = public.me());`);
      p.push(`create policy "Authors delete their entries" on public.journal_entries for delete to authenticated using (author_id = public.me());`);
      return p;
    case "journalMedia":
      sel("Media follows its entry", "exists (select 1 from public.journal_entries e where e.id = entry_id)");
      return p;
    case "expenseSplits":
      all("Members manage splits", "exists (select 1 from public.expenses e where e.id = expense_id and public.is_trip_member(e.trip_id))");
      return p;
    case "tripStopPlans":
      all("Members manage stop plans", "exists (select 1 from public.trip_stops s where s.id = stop_id and public.is_trip_member(s.trip_id))");
      return p;
    case "posts":
      sel("Posts are public to signed-in users", "true");
      p.push(`create policy "Write your own posts" on public.posts for insert to authenticated with check (author_id = public.me());`);
      p.push(`create policy "Delete your own posts" on public.posts for delete to authenticated using (author_id = public.me());`);
      return p;
    case "postComments":
      sel("Comments are public to signed-in users", "true");
      p.push(`create policy "Write your own comments" on public.post_comments for insert to authenticated with check (author_id = public.me());`);
      return p;
  }

  if (PUBLIC_READ.has(key)) {
    sel("Visible to signed-in users", "true");
    return p;
  }
  if (cols.includes("trip_id")) {
    if (MEMBER_WRITE.has(key)) all("Trip members manage", "public.is_trip_member(trip_id)");
    else sel("Trip members read", "public.is_trip_member(trip_id)");
    return p;
  }
  if (cols.includes("viewer_id")) {
    sel("Only the viewer sees these", "viewer_id = public.me()");
    return p;
  }
  if (cols.includes("user_id")) {
    all("Only the owner", "user_id = public.me()");
    return p;
  }
  sel("Visible to signed-in users", "true");
  return p;
}

/* --------------------------------------------------------------- generate */

const schema: string[] = [];
const seedSql: string[] = [];
const fks: string[] = [];
const rls: string[] = [];
const warnings: string[] = [];

schema.push(`-- Generated by scripts/generate-supabase.ts – edit the generator, not this file.
-- Matche schema: tables, keys, row-level security and helper functions.
-- Auth comes from Clerk (Supabase third-party auth); the user id is the JWT \`sub\`.

begin;

create or replace function public.me() returns text
language sql stable as $$ select nullif(auth.jwt() ->> 'sub', '') $$;
`);

seedSql.push(`-- Generated by scripts/generate-supabase.ts – demo data. Safe to re-run.
begin;
`);

const order = Object.keys(TABLES) as TableKey[];
for (const key of order) {
  const table = TABLES[key];
  const rows = seed[key] as unknown as Row[];
  const cols = columnsOf(rows);
  const names = cols.map((c) => c.name);
  const pk = primaryKey(rows, names);

  const lines = cols.map((c) => `  ${c.name} ${c.type}${pk?.length === 1 && pk[0] === c.name ? " primary key" : ""}`);
  if (!pk) lines.unshift("  row_id bigint generated always as identity primary key");
  if (pk && pk.length > 1) lines.push(`  primary key (${pk.join(", ")})`);
  schema.push(`create table public.${table} (\n${lines.join(",\n")}\n);`);

  for (const c of cols) {
    if (table !== "users" && isUserColumn(c.name, rows)) {
      fks.push(`alter table public.${table} add foreign key (${c.name}) references public.users (id) on update cascade on delete cascade;`);
    } else if (table !== "trips" && isTripColumn(c.name, rows)) {
      fks.push(`alter table public.${table} add foreign key (${c.name}) references public.trips (id) on update cascade on delete cascade;`);
    }
    // Warn about demo-owner ids hidden in json / arrays (they won't follow an account takeover).
    if ((c.type === "jsonb" || c.type === "text[]") && rows.some((r) => JSON.stringify(r[c.name] ?? null).includes(`"${DEMO_OWNER_ID}"`))) {
      warnings.push(`${table}.${c.name} contains "${DEMO_OWNER_ID}" inside ${c.type}`);
    }
  }

  rls.push(`alter table public.${table} enable row level security;`);
  rls.push(...policiesFor(key, table, names));

  if (rows.length) {
    const values = rows.map((r) => `  (${cols.map((c) => lit(r[c.name], c.type)).join(", ")})`).join(",\n");
    seedSql.push(`insert into public.${table} (${names.join(", ")}) values\n${values}\non conflict do nothing;\n`);
  }
}

const tableNames = order.map((k) => `public.${TABLES[k]}`);
const grantsSql = [
  "grant usage on schema public to authenticated;",
  `grant select, insert, update, delete on ${tableNames.join(", ")} to authenticated;`,
].join("\n");

const write = (rel: string, body: string) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
  console.log(`wrote ${rel} (${(body.length / 1024).toFixed(1)} KB)`);
};

schema.push(`
-- Foreign keys. User references cascade on update so an account takeover
-- (claim_demo_account) re-points every row in one statement.
${fks.join("\n")}

-- Helper functions (security definer so policies don't recurse).
create or replace function public.is_trip_member(t text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from trip_members m where m.trip_id = t and m.user_id = public.me())
$$;

create or replace function public.owns_trip(t text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from trips where id = t and owner_id = public.me())
$$;

create or replace function public.can_see_trip(t text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_trip_member(t)
      or exists (
        select 1 from trips tr
        join friendships f on f.friend_id = tr.owner_id
        where tr.id = t and f.user_id = public.me() and f.status = 'accepted'
      )
      or exists (
        select 1 from trip_members m
        join friendships f on f.friend_id = m.user_id
        where m.trip_id = t and f.user_id = public.me() and f.status = 'accepted'
      )
$$;

-- First sign-in: the signed-in Clerk user takes over the demo account
-- ("${DEMO_OWNER_ID}"). Returns false if already claimed or the user has a profile.
create or replace function public.claim_demo_account() returns boolean
language plpgsql security definer set search_path = public as $$
declare uid text := public.me();
begin
  if uid is null then return false; end if;
  if exists (select 1 from users where id = uid) then return false; end if;
  if not exists (select 1 from users where id = '${DEMO_OWNER_ID}') then return false; end if;
  update users set id = uid where id = '${DEMO_OWNER_ID}';
  return true;
end $$;

grant execute on function public.me(), public.is_trip_member(text), public.owns_trip(text),
  public.can_see_trip(text), public.claim_demo_account() to authenticated;

-- Table access for signed-in users. Some projects don't auto-grant new
-- tables; row-level security above still decides which rows they see.
${grantsSql}

-- Row-level security
${rls.join("\n")}

commit;
`);

write("supabase/migrations/0002_grants.sql", `-- Generated by scripts/generate-supabase.ts.
-- Gives signed-in users table access (row-level security still applies).
-- Needed on projects that don't automatically expose new tables.
begin;
${grantsSql}
commit;
`);

seedSql.push("commit;\n");

write("supabase/migrations/0001_init.sql", schema.join("\n\n"));
write("supabase/seed.sql", seedSql.join("\n"));
if (warnings.length) console.warn("warnings:\n  " + warnings.join("\n  "));
