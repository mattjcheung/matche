import { daysBetween, MONTHS_SHORT, parseISODate } from "@/lib/format";
import type { Trip } from "../types";
import { db, me, getUser } from "../db";
import { APP_TODAY } from "../clock";
import { daysUntilTrip, getTripMembers, listMyTrips, tripDatesLabel, STAGE_LABEL, STAGE_TONE } from "./trips";

/**
 * Trips dashboard (`/trips`) queries: every trip the user is on, split into
 * happening now / coming up / still dreaming / past, plus headline numbers.
 */

export type TripPhase = "now" | "upcoming" | "dreaming" | "past";

/** What opening the trip lets you do. */
export type TripIntent = "review" | "continue" | "adjust";

export interface DashboardPersonVM {
  id: string;
  initials: string;
  tone: string;
  fg?: string;
}

export interface DashboardTripVM {
  slug: string;
  name: string;
  phase: TripPhase;
  intent: TripIntent;
  /** "Open trip", "Continue planning", "Review trip"… */
  cta: string;
  stage: string;
  stageTone: (typeof STAGE_TONE)[Trip["stage"]];
  /** "29 Mar – 14 Apr 2027" or "Long weekend, dates TBC". */
  dates: string;
  /** "In 140 days", "Day 3 of 12", "Feb 2026". */
  when: string;
  route: string;
  progress: number;
  status: string;
  members: DashboardPersonVM[];
  coverTone: string;
  /** Past trips only. */
  rating: string | null;
  highlight: string | null;
  nights: number | null;
  year: string | null;
}

const PHASE_TONES = ["#3D5A52", "#31455E", "#6B4A2B", "#5A3A47", "#2E4A45", "#394B6A", "#6E5432"];

function phaseOf(t: Trip): TripPhase {
  if (t.stage === "completed" || (t.end_date && t.end_date < APP_TODAY)) return "past";
  if (t.stage === "travelling" || (t.start_date && t.end_date && t.start_date <= APP_TODAY && t.end_date >= APP_TODAY)) return "now";
  if (t.start_date) return "upcoming";
  return "dreaming";
}

function intentOf(t: Trip, phase: TripPhase): TripIntent {
  if (phase === "past") return "review";
  if (phase === "now" || t.stage === "booked") return "adjust";
  return "continue";
}

const CTA: Record<TripIntent, string> = {
  review: "Review trip",
  continue: "Continue planning",
  adjust: "Adjust plans",
};

function hashTone(id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PHASE_TONES[h % PHASE_TONES.length];
}

function whenLabel(t: Trip, phase: TripPhase): string {
  if (phase === "past" && t.start_date) {
    const d = parseISODate(t.start_date);
    return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  if (phase === "now" && t.start_date && t.end_date) {
    return `Day ${daysBetween(t.start_date, APP_TODAY) + 1} of ${daysBetween(t.start_date, t.end_date) + 1}`;
  }
  const days = daysUntilTrip(t);
  if (days !== null && days > 0) return days === 1 ? "Tomorrow" : `In ${days} days`;
  return t.when_label || "No dates yet";
}

export function listDashboardTrips(userId: string = me()): DashboardTripVM[] {
  const reviews = db().tripReviews.filter((r) => r.user_id === userId);
  return listMyTrips(userId).map((t) => {
    const phase = phaseOf(t);
    const intent = intentOf(t, phase);
    const review = reviews.find((r) => r.trip_id === t.id);
    return {
      slug: t.slug,
      name: t.name,
      phase,
      intent,
      cta: CTA[intent],
      stage: STAGE_LABEL[t.stage],
      stageTone: STAGE_TONE[t.stage],
      dates: tripDatesLabel(t),
      when: whenLabel(t, phase),
      route: t.places.join(" → "),
      progress: t.progress_pct,
      status: t.status_line,
      members: getTripMembers(t.id).map((u) => ({ id: u.id, initials: u.initials, tone: u.tone, fg: u.tone_fg })),
      coverTone: review?.cover_tone ?? hashTone(t.id),
      rating: review ? review.rating.toFixed(1) : null,
      highlight: review?.highlight_quote ?? null,
      nights: t.start_date && t.end_date ? daysBetween(t.start_date, t.end_date) : null,
      year: t.start_date ? t.start_date.slice(0, 4) : null,
    };
  });
}

export interface TripGroups {
  now: DashboardTripVM[];
  upcoming: DashboardTripVM[];
  dreaming: DashboardTripVM[];
  past: DashboardTripVM[];
}

/** Trips grouped by phase, each group in the order you'd want to read it. */
export function groupDashboardTrips(trips: DashboardTripVM[], raw: Trip[] = listMyTrips()): TripGroups {
  const start = new Map(raw.map((t) => [t.slug, t.start_date ?? ""]));
  const created = new Map(raw.map((t) => [t.slug, t.created_at]));
  const by = (p: TripPhase) => trips.filter((t) => t.phase === p);
  return {
    now: by("now"),
    upcoming: by("upcoming").sort((a, b) => (start.get(a.slug)! < start.get(b.slug)! ? -1 : 1)),
    dreaming: by("dreaming").sort((a, b) => b.progress - a.progress || (created.get(a.slug)! < created.get(b.slug)! ? 1 : -1)),
    past: by("past").sort((a, b) => (start.get(a.slug)! < start.get(b.slug)! ? 1 : -1)),
  };
}

export interface DashboardStatsVM {
  tripsTaken: number;
  countries: number;
  nightsAway: number;
  inTheWorks: number;
  nextIn: number | null;
}

export function getDashboardStats(groups: TripGroups, raw: Trip[] = listMyTrips()): DashboardStatsVM {
  const past = raw.filter((t) => groups.past.some((p) => p.slug === t.slug));
  const next = groups.upcoming[0];
  const nextTrip = next ? raw.find((t) => t.slug === next.slug) : undefined;
  return {
    tripsTaken: past.length,
    countries: new Set(past.map((t) => t.country).filter(Boolean)).size,
    nightsAway: past.reduce((n, t) => n + (t.start_date && t.end_date ? daysBetween(t.start_date, t.end_date) : 0), 0),
    inTheWorks: groups.now.length + groups.upcoming.length + groups.dreaming.length,
    nextIn: nextTrip ? daysUntilTrip(nextTrip) : null,
  };
}

export interface NextTripFocusVM {
  slug: string;
  name: string;
  daysAway: number | null;
  dates: string;
  route: string;
  members: DashboardPersonVM[];
  flightsBooked: number;
  staysBooked: number;
  staysPlanned: number;
  todosOpen: number;
  todos: Array<{ id: string; mon: string; day: string; title: string }>;
}

/** The trip in focus at the top of the dashboard: on now, else the next one. */
export function getFocusTrip(groups: TripGroups, raw: Trip[] = listMyTrips()): NextTripFocusVM | null {
  const pick = groups.now[0] ?? groups.upcoming[0];
  const t = pick && raw.find((x) => x.slug === pick.slug);
  if (!t) return null;
  const tb = db().bookings.filter((b) => b.trip_id === t.id);
  const todos = [...db().todos.filter((x) => x.trip_id === t.id && !x.done)];
  todos.sort((a, b) => (a.due_on < b.due_on ? -1 : 1));
  return {
    slug: t.slug,
    name: t.name,
    daysAway: daysUntilTrip(t),
    dates: tripDatesLabel(t),
    route: t.places.join(" → "),
    members: getTripMembers(t.id).map((u) => ({
      id: u.id,
      initials: u.initials,
      tone: u.id === me() ? "var(--color-accent-bright)" : getUser(u.id).tone,
    })),
    flightsBooked: tb.filter((b) => b.kind === "flight").length,
    staysBooked: tb.filter((b) => b.kind === "stay").length,
    staysPlanned: t.places.length,
    todosOpen: todos.length,
    todos: todos.slice(0, 3).map((x) => {
      const d = parseISODate(x.due_on);
      return { id: x.id, mon: MONTHS_SHORT[d.getUTCMonth()], day: String(d.getUTCDate()), title: x.title };
    }),
  };
}
