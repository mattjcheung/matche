"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { PostKind, TripBudget, TripDateMode } from "@/lib/data/types";
import type { JournalVisibility } from "@/lib/data/types.ontrip";

/**
 * Writes. Each runs as the signed-in Clerk user, so Supabase row-level
 * security decides what's allowed (see supabase/migrations/0001_init.sql).
 */

async function session() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return { userId, sb: createServerSupabase() };
}

const newId = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

/* ------------------------------------------------------------------ posts */

export async function createPost(input: { kind: Extract<PostKind, "update" | "question">; body: string }) {
  const body = input.body.trim();
  if (!body) return { ok: false as const, error: "Write something first." };
  if (body.length > 4000) return { ok: false as const, error: "Posts can be up to 4,000 characters." };
  const { userId, sb } = await session();
  const { error } = await sb.from("posts").insert({
    id: newId("post"),
    author_id: userId,
    kind: input.kind === "question" ? "question" : "update",
    trip_id: null,
    trip_day: null,
    place: null,
    body,
    emphasis: "normal",
    media: [],
    review_title: null,
    review_meta: null,
    review_more_count: null,
    like_count: 0,
    reply_count: 0,
    created_at: new Date().toISOString(),
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}

/* ------------------------------------------------------------------ trips */

export interface CreateTripInput {
  places: string[];
  dateMode: TripDateMode;
  start: string | null;
  end: string | null;
  whenLabel: string;
  friendIds: string[];
  styles: string[];
  budget: TripBudget;
  name: string;
}

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "trip";

export async function createTrip(input: CreateTripInput) {
  const places = input.places.map((p) => p.trim()).filter(Boolean).slice(0, 20);
  if (places.length === 0) return { ok: false as const, error: "Add at least one place." };
  const dated = input.dateMode === "exact" && input.start && input.end && input.start <= input.end;
  const { userId, sb } = await session();

  const id = newId("trip");
  const slug = `${slugify(input.name || places.join(" "))}-${id.slice(-6)}`;
  const now = new Date().toISOString();

  const { error } = await sb.from("trips").insert({
    id,
    slug,
    owner_id: userId,
    name: (input.name || places.join(" & ")).slice(0, 120),
    stage: "planning",
    date_mode: dated ? "exact" : input.dateMode === "exact" ? "flex" : input.dateMode,
    start_date: dated ? input.start : null,
    end_date: dated ? input.end : null,
    when_label: input.whenLabel || (input.dateMode === "none" ? "Someday" : "Dates TBC"),
    places,
    country: places.length === 1 ? places[0] : null,
    styles: input.styles.slice(0, 10),
    budget: input.budget,
    progress_pct: 5,
    status_line: "Just created · nothing booked yet",
    created_at: now,
  });
  if (error) return { ok: false as const, error: error.message };

  const members = [
    { trip_id: id, user_id: userId, role: "owner", joined_at: now },
    ...input.friendIds.filter((f) => f !== userId).map((f) => ({ trip_id: id, user_id: f, role: "member", joined_at: now })),
  ];
  const { error: memberError } = await sb.from("trip_members").insert(members);
  if (memberError) return { ok: false as const, error: memberError.message };

  revalidatePath("/");
  redirect(`/trips/${slug}`);
}

/* ---------------------------------------------------------------- journal */

export async function addJournalEntry(input: { tripId: string; body: string; visibility: JournalVisibility; date: string; place: string }) {
  const body = input.body.trim();
  if (!body) return { ok: false as const, error: "Write something first." };
  const { userId, sb } = await session();
  const now = new Date();
  const { error } = await sb.from("journal_entries").insert({
    id: newId("je"),
    trip_id: input.tripId,
    author_id: userId,
    entry_date: input.date,
    local_time: now.toTimeString().slice(0, 5),
    place: input.place,
    body,
    visibility: input.visibility === "private" ? "private" : "group",
    like_count: 0,
    reply_count: 0,
    created_at: now.toISOString(),
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/journal");
  revalidatePath("/calendar");
  return { ok: true as const };
}
