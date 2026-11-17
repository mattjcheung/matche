import { bookings } from "../bookings";
import { featuredRecaps, friendActivity, stories, travellerOverlaps } from "../discover";
import { postComments, posts } from "../posts";
import type { Post, PostKind, PostMedia, Trip } from "../types";
import { CURRENT_USER_ID, getUser } from "../users";
import { getNextTrip, getTripMembers, listMyTrips, daysUntilTrip, tripDatesLabel, STAGE_LABEL, STAGE_TONE } from "./trips";
import { countTodosDueSoon } from "./ontrip";

/* ------------------------------------------------------------------------ */
/* View models – plain serialisable objects handed to client components.     */
/* ------------------------------------------------------------------------ */

export interface PersonVM {
  id: string;
  name: string;
  initials: string;
  tone: string;
  fg?: string;
}

export interface FeedPostVM {
  id: string;
  kind: PostKind;
  author: PersonVM;
  /** "· Day 3 · Ubud, Bali" */
  context: string;
  time: string;
  body: string;
  emphasis: Post["emphasis"];
  media: PostMedia[];
  review: { title: string; meta: string; moreCount: number | null } | null;
  likes: number;
  replies: number;
  comments: Array<{ id: string; who: string; body: string }>;
  canSave: boolean;
}

function person(id: string): PersonVM {
  const u = getUser(id);
  return { id: u.id, name: u.short_name, initials: u.initials, tone: u.tone, fg: u.tone_fg };
}

/** Relative time against the mock "now" (APP_TODAY evening). */
const NOW = Date.parse("2026-11-09T19:00:00Z");
export function relativeTime(iso: string): string {
  const mins = Math.round((NOW - Date.parse(iso)) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return "Yesterday";
  return `${Math.round(hours / 24)} days ago`;
}

function postContext(p: Post): string {
  switch (p.kind) {
    case "live":
      return `· Day ${p.trip_day} · ${p.place}`;
    case "review":
      return "· finished a trip";
    case "question":
      return "· asking the community";
    default:
      return "· not on a trip";
  }
}

export function listFeed(): FeedPostVM[] {
  // Curated order for now; becomes a ranked query once the feed is live.
  return posts.map((p) => ({
      id: p.id,
      kind: p.kind,
      author: person(p.author_id),
      context: postContext(p),
      time: relativeTime(p.created_at),
      body: p.body,
      emphasis: p.emphasis,
      media: p.media,
      review: p.review_title ? { title: p.review_title, meta: p.review_meta ?? "", moreCount: p.review_more_count } : null,
      likes: p.like_count,
      replies: p.reply_count,
      comments: postComments
        .filter((c) => c.post_id === p.id)
        .map((c) => ({ id: c.id, who: getUser(c.author_id).short_name, body: c.body })),
      canSave: p.kind === "review",
    }));
}

export function getCurrentUserVM(): PersonVM {
  return person(CURRENT_USER_ID);
}

export interface NextTripVM {
  slug: string;
  name: string;
  daysAway: number | null;
  dates: string;
  route: string;
  members: PersonVM[];
  flightsBooked: number;
  staysBooked: number;
  staysPlanned: number;
  todosDue: number;
  sources: string[];
}

export function getNextTripSummary(): NextTripVM | null {
  const t = getNextTrip();
  if (!t) return null;
  const tb = bookings.filter((b) => b.trip_id === t.id);
  const flights = tb.filter((b) => b.kind === "flight").length;
  const stays = tb.filter((b) => b.kind === "stay").length;
  return {
    slug: t.slug,
    name: t.name,
    daysAway: daysUntilTrip(t),
    dates: tripDatesLabel(t),
    route: t.places.join(" → "),
    members: getTripMembers(t.id).map((u) => ({ ...person(u.id), fg: undefined, tone: u.id === CURRENT_USER_ID ? "var(--color-accent-bright)" : u.tone })),
    flightsBooked: flights,
    staysBooked: stays,
    staysPlanned: t.places.length,
    todosDue: countTodosDueSoon(t.id),
    sources: ["Airline email", "Hotel booking site", "Home rental app", "Rail pass receipt"],
  };
}

export interface TripCardVM {
  slug: string;
  stage: string;
  stageTone: (typeof STAGE_TONE)[Trip["stage"]];
  when: string;
  name: string;
  places: string;
  progress: number;
  status: string;
}

export function listTripCards(): TripCardVM[] {
  return listMyTrips().map((t) => ({
    slug: t.slug,
    stage: STAGE_LABEL[t.stage],
    stageTone: STAGE_TONE[t.stage],
    when: t.when_label,
    name: t.name,
    places: t.places.join(" · "),
    progress: t.progress_pct,
    status: t.status_line,
  }));
}

export function listFriendsRightNow() {
  return friendActivity.map((a) => ({ id: a.id, person: person(a.user_id), action: a.action, meta: a.meta }));
}

export function getTravellerOverlap() {
  const next = getNextTrip();
  return travellerOverlaps.find((o) => o.trip_id === next?.id) ?? null;
}

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

export function listFeaturedRecaps() {
  return featuredRecaps.map((r) => {
    const a = getUser(r.author_id);
    const who = a.name.includes("&") ? a.name : `${a.short_name} ${a.name.split(" ")[1]?.[0] ?? ""}.`;
    return { id: r.id, title: r.title, who, meta: `${r.country} · ${compact(r.save_count)} saves`, duration: r.duration_label, tone: r.cover_tone };
  });
}

export function listStories() {
  return stories.map((s) => {
    const a = getUser(s.author_id);
    return {
      id: s.id,
      place: s.place,
      title: s.title,
      blurb: s.blurb,
      who: `${a.short_name} ${a.name.split(" ")[1]?.[0] ?? ""}.`,
      read: `${s.read_minutes} min read`,
      rating: s.rating.toFixed(1),
      tone: s.cover_tone,
    };
  });
}
