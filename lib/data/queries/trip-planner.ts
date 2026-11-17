import { daysBetween, formatMoney, MONTHS_SHORT, parseISODate } from "@/lib/format";
import { bookings } from "../bookings";
import { destinationCosts, destinationNotes, destinations, destinationStats, userDestinationLinks } from "../destinations";
import { expenses, expenseSplits } from "../expenses";
import { experiences, tripExperienceSuggestions } from "../experiences";
import { packingItems, travelDocuments, tripChecklistItems, tripOverlaps } from "../trip_essentials";
import { tripGuides, tripStopPlans, tripStops } from "../trip_stops";
import { trips } from "../trips";
import type { ISODate, Trip, TripBudget } from "../types";
import type { ChecklistStatus, Destination, ExperienceSignal, TripStopStatus } from "../types.trip";
import { CURRENT_USER_ID, getUser } from "../users";
import { daysUntilTrip, getTripMembers, STAGE_LABEL, tripDatesLabel } from "./trips";

/**
 * Queries for the trip planner screen (`/trips/[slug]`). Each returns plain,
 * serialisable view models so results can be handed to client components.
 */

/* ------------------------------------------------------------------------ */
/* Trip + header                                                             */
/* ------------------------------------------------------------------------ */

/** All trip slugs, for `generateStaticParams`. */
export function listTripSlugs(): string[] {
  return trips.map((t) => t.slug);
}

export interface TripHeaderVM {
  eyebrow: string;
  name: string;
  /** "29 Mar – 14 Apr 2027 · 16 nights · Alex, Sophie, Jordan" */
  meta: string;
}

export function getTripHeader(trip: Trip): TripHeaderVM {
  const days = daysUntilTrip(trip);
  const eyebrow = ["Trip", STAGE_LABEL[trip.stage], days !== null && days > 0 ? `in ${days} days` : null]
    .filter(Boolean)
    .join(" · ");
  const nights = trip.start_date && trip.end_date ? daysBetween(trip.start_date, trip.end_date) : null;
  const people = getTripMembers(trip.id).map((u) => u.short_name).join(", ");
  const meta = [tripDatesLabel(trip), nights !== null ? `${nights} night${nights === 1 ? "" : "s"}` : null, people]
    .filter(Boolean)
    .join(" · ");
  return { eyebrow, name: trip.name, meta };
}

/** The destination record behind a trip (by country), if any. */
function getTripDestination(trip: Trip): Destination | undefined {
  return trip.country ? destinations.find((d) => d.country === trip.country) : undefined;
}

/* ------------------------------------------------------------------------ */
/* Itinerary                                                                 */
/* ------------------------------------------------------------------------ */

export type StopTone = "primary" | "accent" | "neutral";

export interface StopVM {
  id: string;
  n: number;
  place: string;
  when: string;
  status: string;
  tone: StopTone;
  detail: string;
}

export interface RouteMapNodeVM {
  id: string;
  place: string;
  dayTrip: boolean;
  x: number;
  y: number;
  r: number;
  labelX: number;
  labelY: number;
}

export interface ItineraryVM {
  guide: { title: string; body: string } | null;
  map: { ariaLabel: string; overnightPath: string; allPath: string; nodes: RouteMapNodeVM[] };
  dated: StopVM[];
  flexible: StopVM[];
}

const STOP_STATUS: Record<TripStopStatus, { label: string; tone: StopTone }> = {
  booked: { label: "Booked", tone: "primary" },
  hoping: { label: "Hoping to stay", tone: "accent" },
  to_book: { label: "To book", tone: "neutral" },
  idea: { label: "Idea", tone: "neutral" },
};

/** "2027-03-29", "2027-04-03" → "29 Mar – 3 Apr · 5 nights"; same month → "3 – 4 Apr · 1 night". */
function stayLabel(start: ISODate, end: ISODate): string {
  const s = parseISODate(start);
  const e = parseISODate(end);
  const endPart = `${e.getUTCDate()} ${MONTHS_SHORT[e.getUTCMonth()]}`;
  const startPart = s.getUTCMonth() === e.getUTCMonth() ? `${s.getUTCDate()}` : `${s.getUTCDate()} ${MONTHS_SHORT[s.getUTCMonth()]}`;
  const nights = daysBetween(start, end);
  return `${startPart} – ${endPart} · ${nights} night${nights === 1 ? "" : "s"}`;
}

export function getTripItinerary(tripId: string): ItineraryVM {
  const stops = tripStops.filter((s) => s.trip_id === tripId).sort((a, b) => a.position - b.position);
  const overnight = stops.filter((s) => s.kind === "overnight");

  const plansFor = (mode: "dated" | "flexible"): StopVM[] =>
    overnight.flatMap((stop, i) => {
      const plan = tripStopPlans.find((p) => p.stop_id === stop.id && p.mode === mode);
      if (!plan) return [];
      const when = plan.start_date && plan.end_date ? stayLabel(plan.start_date, plan.end_date) : plan.nights_label ?? "";
      const st = STOP_STATUS[plan.status];
      return [{ id: plan.id, n: i + 1, place: stop.place, when, status: st.label, tone: st.tone, detail: plan.detail }];
    });

  const pt = (s: { map_x: number; map_y: number }) => `${s.map_x} ${s.map_y}`;
  const overnightPath = overnight.length ? `M${overnight.map(pt).join(" L")}` : "";
  const dayTripPath = stops
    .filter((s) => s.kind === "day_trip" && s.parent_stop_id)
    .map((s) => {
      const parent = stops.find((p) => p.id === s.parent_stop_id);
      return parent ? `M${pt(parent)} L${pt(s)}` : "";
    })
    .join(" ");

  const ariaLabel =
    "Route: " +
    overnight
      .map((o) => {
        const days = stops.filter((s) => s.parent_stop_id === o.id).map((s) => `${s.place} day trip`);
        return days.length ? `${o.place} with ${days.join(" and ")}` : o.place;
      })
      .join(", ");

  const guide = tripGuides.find((g) => g.trip_id === tripId);
  return {
    guide: guide ? { title: guide.route_title, body: guide.route_body } : null,
    map: {
      ariaLabel,
      overnightPath,
      allPath: [overnightPath, dayTripPath].filter(Boolean).join(" "),
      nodes: stops.map((s) => ({
        id: s.id,
        place: s.place,
        dayTrip: s.kind === "day_trip",
        x: s.map_x,
        y: s.map_y,
        r: s.map_r,
        labelX: s.label_x,
        labelY: s.label_y,
      })),
    },
    dated: plansFor("dated"),
    flexible: plansFor("flexible"),
  };
}

/* ------------------------------------------------------------------------ */
/* Bookings                                                                  */
/* ------------------------------------------------------------------------ */

export interface BookingRowVM {
  id: string;
  what: string;
  sub: string;
  when: string;
  via: string;
  ref: string;
  paidBy: string;
}

export function listTripBookings(tripId: string): BookingRowVM[] {
  return bookings
    .filter((b) => b.trip_id === tripId)
    .sort((a, b) => (a.starts_on < b.starts_on ? -1 : a.starts_on > b.starts_on ? 1 : 0))
    .map((b) => ({
      id: b.id,
      what: b.title,
      sub: b.subtitle,
      when: b.when_label,
      via: b.source,
      ref: b.reference,
      paidBy: getUser(b.paid_by).short_name,
    }));
}

/* ------------------------------------------------------------------------ */
/* Experience bank                                                           */
/* ------------------------------------------------------------------------ */

export interface ExperienceVM {
  id: string;
  name: string;
  place: string;
  rating: string;
  price: string;
  social: string;
  tone: string;
}

function signalLabel(signal: ExperienceSignal, userId: string | null, count: number | null): string {
  const who = userId ? getUser(userId).short_name : "";
  switch (signal) {
    case "friend_loved":
      return `${who} loved this`;
    case "friend_saved":
      return `${who} has this saved`;
    case "booked_count":
      return `Booked by ${count ?? 0} travellers`;
    case "wishlist":
      return "On your wishlist";
  }
}

export function listTripExperiences(tripId: string): ExperienceVM[] {
  return tripExperienceSuggestions
    .filter((s) => s.trip_id === tripId)
    .sort((a, b) => a.position - b.position)
    .flatMap((s) => {
      const e = experiences.find((x) => x.id === s.experience_id);
      if (!e) return [];
      return [
        {
          id: s.id,
          name: e.name,
          place: e.place,
          rating: e.rating.toFixed(1),
          price: e.price_level === 0 ? "Free" : "$".repeat(e.price_level),
          social: signalLabel(s.signal, s.signal_user_id, s.signal_count),
          tone: e.media_tone,
        },
      ];
    });
}

/* ------------------------------------------------------------------------ */
/* Essentials                                                                */
/* ------------------------------------------------------------------------ */

export interface NoteVM {
  id: string;
  title: string | null;
  body: string;
}

export interface EssentialsVM {
  passportCountry: string | null;
  destinationName: string | null;
  documents: Array<NoteVM & { status: ChecklistStatus }>;
  costs: Array<{ tier: TripBudget; label: string; amount: string; mine: boolean }>;
  events: NoteVM[];
  health: NoteVM[];
  stats: Array<{ id: string; label: string; value: string; pct: number }>;
  /** "From [N] Matche trips in spring" */
  statsSource: string;
  overlaps: Array<{ id: string; lead: string; rest: string }>;
}

export function getTripEssentials(trip: Trip, userId: string = CURRENT_USER_ID): EssentialsVM {
  const dest = getTripDestination(trip);
  const passport = travelDocuments.find((d) => d.user_id === userId && d.kind === "passport");
  const notes = (category: "events" | "health"): NoteVM[] =>
    destinationNotes
      .filter((n) => n.destination_id === dest?.id && n.category === category)
      .sort((a, b) => a.position - b.position)
      .map((n) => ({ id: n.id, title: n.title, body: n.body }));

  const myTier: TripBudget = trip.budget ?? "Mid-range";
  const costs = destinationCosts
    .filter((c) => c.destination_id === dest?.id)
    .map((c) => ({
      tier: c.tier,
      label: c.tier === myTier ? "Your style" : c.tier,
      amount: c.daily_cents === null ? "[A$ —]" : formatMoney(c.daily_cents),
      mine: c.tier === myTier,
    }));

  return {
    passportCountry: passport?.issuing_country ?? null,
    destinationName: dest?.name ?? null,
    documents: tripChecklistItems
      .filter((c) => c.trip_id === trip.id && c.user_id === userId && c.category === "documents")
      .sort((a, b) => a.position - b.position)
      .map((c) => ({ id: c.id, title: c.title, body: c.body, status: c.status })),
    costs,
    events: notes("events"),
    health: notes("health"),
    stats: destinationStats
      .filter((s) => s.destination_id === dest?.id)
      .sort((a, b) => a.position - b.position)
      .map((s) => ({ id: s.id, label: s.label, value: s.value_label, pct: s.score_pct })),
    statsSource: `From ${dest?.spring_trip_count ?? "[N]"} Matche trips in spring`,
    overlaps: tripOverlaps
      .filter((o) => o.trip_id === trip.id)
      .map((o) =>
        o.user_id
          ? { id: o.id, lead: getUser(o.user_id).short_name, rest: ` (friend) is in ${o.place} ${o.dates_label} – the same nights as you.` }
          : { id: o.id, lead: `${o.traveller_count ?? 0} travellers`, rest: ` will be in ${o.place} ${o.dates_label} and are open to meeting up.` },
      ),
  };
}

/* ------------------------------------------------------------------------ */
/* Ask a friend                                                              */
/* ------------------------------------------------------------------------ */

export interface AskFriendVM {
  id: string;
  name: string;
  initials: string;
  tone: string;
  fg?: string;
  meta: string;
}

export function getAskFriends(trip: Trip): { destinationName: string; friends: AskFriendVM[]; lockedCount: number } {
  const dest = getTripDestination(trip);
  const friends = userDestinationLinks
    .filter((l) => l.destination_id === dest?.id)
    .map((l) => {
      const u = getUser(l.user_id);
      return { id: u.id, name: u.name, initials: u.initials, tone: u.tone, fg: u.tone_fg, meta: l.summary };
    });
  return { destinationName: dest?.name ?? trip.name, friends, lockedCount: dest?.fof_visited_count ?? 0 };
}

/* ------------------------------------------------------------------------ */
/* Packing                                                                   */
/* ------------------------------------------------------------------------ */

export function getPackingList(tripId: string): {
  context: string;
  items: Array<{ id: string; label: string; reason: string; packed: boolean }>;
} {
  return {
    context: tripGuides.find((g) => g.trip_id === tripId)?.packing_context ?? "",
    items: packingItems
      .filter((p) => p.trip_id === tripId)
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ id: p.id, label: p.label, reason: p.reason, packed: p.is_packed })),
  };
}

/* ------------------------------------------------------------------------ */
/* Group costs teaser                                                        */
/* ------------------------------------------------------------------------ */

/**
 * Pairwise balances for the current user on a trip: for every expense, each
 * non-payer owes the payer their split; balances are then netted per person.
 */
export function getTripCostSummary(tripId: string, userId: string = CURRENT_USER_ID): { headline: string; detail: string } {
  const net = new Map<string, number>(); // >0: they owe me; <0: I owe them
  for (const e of expenses.filter((x) => x.trip_id === tripId)) {
    for (const s of expenseSplits.filter((x) => x.expense_id === e.id)) {
      if (s.user_id === e.paid_by) continue;
      if (e.paid_by === userId) net.set(s.user_id, (net.get(s.user_id) ?? 0) + s.amount_cents);
      else if (s.user_id === userId) net.set(e.paid_by, (net.get(e.paid_by) ?? 0) - s.amount_cents);
    }
  }
  const owedToMe = [...net.values()].filter((v) => v > 0).reduce((a, b) => a + b, 0);
  const iOwe = [...net.entries()].filter(([, v]) => v < 0).sort((a, b) => a[1] - b[1]);

  const headline = owedToMe > 0 ? `You’re owed ${formatMoney(owedToMe)}` : iOwe.length ? "You owe the group" : "You’re all square";
  const owes = iOwe.map(([id, v]) => `You owe ${getUser(id).short_name} ${formatMoney(-v)}`);
  return { headline, detail: [...owes, "Open cost tracker →"].join(" · ") };
}
