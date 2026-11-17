import { daysBetween, formatDate, formatDateRange, MONTHS_LONG, parseISODate } from "@/lib/format";
import type { ISODate, Trip, User } from "../types";
import type { FriendHighlight, TripLocation, TripPromptTone } from "../types.social";
import { getNextTrip } from "./trips";
import { db, me, getUser } from "../db";
import { APP_TODAY } from "../clock";

/**
 * Friends queries. Each maps to a future SQL query over `friendships`,
 * `trips` / `trip_members`, `trip_locations`, `friend_highlights`,
 * `trip_prompts` and `volunteer_*`. Results are plain serialisable objects so
 * they can be handed straight to client components.
 */

// ---------------------------------------------------------------------------
// Shared helpers (also used by ./profile)
// ---------------------------------------------------------------------------

/** `trips` and `trip_members` as one table each. */
export function allTrips(): Trip[] {
  return db().trips;
}
const allMembers = () => db().tripMembers;

export function profileHref(userId: string): string {
  return `/friends/${userId}`;
}

/** Accepted friends of `viewerId`, in friendship order. */
export function listFriendIds(viewerId: string = me()): string[] {
  return db().friendships
    .filter((f) => f.user_id === viewerId && f.status === "accepted")
    .map((f) => f.friend_id);
}

export function isFriend(friendId: string, viewerId: string = me()): boolean {
  return listFriendIds(viewerId).includes(friendId);
}

export function listTripsForUser(userId: string): Trip[] {
  const ids = new Set(allMembers().filter((m) => m.user_id === userId).map((m) => m.trip_id));
  return allTrips().filter((t) => ids.has(t.id));
}

export function isTripMember(tripId: string, userId: string): boolean {
  return allMembers().some((m) => m.trip_id === tripId && m.user_id === userId);
}

export function listTripLocations(tripId: string): TripLocation[] {
  return db().tripLocations.filter((l) => l.trip_id === tripId).sort((a, b) => a.position - b.position);
}

/** Regions a trip visits, in route order, de-duplicated. */
export function tripRegions(trip: Trip): string[] {
  const regions = listTripLocations(trip.id).map((l) => l.region);
  if (regions.length === 0 && trip.country) regions.push(trip.country);
  return [...new Set(regions)];
}

function isUnderway(t: Trip, today: ISODate = APP_TODAY): boolean {
  return !!t.start_date && !!t.end_date && t.start_date <= today && today <= t.end_date;
}

function isFinished(t: Trip, today: ISODate = APP_TODAY): boolean {
  return t.stage === "completed" || (!!t.end_date && t.end_date < today);
}

/** Trips still ahead (not under way, not finished). */
export function isUpcoming(t: Trip, today: ISODate = APP_TODAY): boolean {
  return !isUnderway(t, today) && !isFinished(t, today);
}

export interface CurrentTrip {
  trip: Trip;
  location: TripLocation | null;
  day: number;
  totalDays: number;
}

/** The trip a user is on today, with the place they're at. */
export function getCurrentTrip(userId: string): CurrentTrip | null {
  const trip = listTripsForUser(userId).find((t) => isUnderway(t));
  if (!trip || !trip.start_date || !trip.end_date) return null;
  const locs = listTripLocations(trip.id);
  const location =
    locs.find((l) => l.starts_on && l.ends_on && l.starts_on <= APP_TODAY && APP_TODAY <= l.ends_on) ??
    locs[0] ??
    null;
  return {
    trip,
    location,
    day: daysBetween(trip.start_date, APP_TODAY) + 1,
    totalDays: daysBetween(trip.start_date, trip.end_date) + 1,
  };
}

export function travelDayLabel(c: CurrentTrip): string {
  return `Day ${c.day} of ${c.totalDays}`;
}

export function getHighlight(friendId: string, viewerId: string = me()): FriendHighlight | undefined {
  return db().friendHighlights.find((h) => h.friend_id === friendId && h.viewer_id === viewerId);
}

export function listHighlights(viewerId: string = me()): FriendHighlight[] {
  return db().friendHighlights.filter((h) => h.viewer_id === viewerId).sort((a, b) => a.priority - b.priority);
}

/** Whole days in a dated trip, inclusive. */
export function tripLength(t: Trip): number | null {
  return t.start_date && t.end_date ? daysBetween(t.start_date, t.end_date) + 1 : null;
}

/** "6 – 20 Apr 2027", "29 Mar – 14 Apr 2027", "20 Dec 2026 – 4 Jan 2027". */
export function compactDateRange(start: ISODate, end: ISODate): string {
  const s = parseISODate(start);
  const e = parseISODate(end);
  if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()} – ${formatDate(end)}`;
  }
  return formatDateRange(start, end);
}

/** "Got back yesterday · 12 days", "September · 5 days". */
function completedLabel(t: Trip): string {
  if (!t.end_date) return t.when_label;
  const ago = daysBetween(t.end_date, APP_TODAY);
  const end = parseISODate(t.end_date);
  const when =
    ago <= 1
      ? "Got back yesterday"
      : ago < 7
        ? `Got back ${ago} days ago`
        : end.getUTCFullYear() === parseISODate(APP_TODAY).getUTCFullYear()
          ? MONTHS_LONG[end.getUTCMonth()]
          : `${MONTHS_LONG[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  const days = tripLength(t);
  return days ? `${when} · ${days} days` : when;
}

/** Days since a finished trip ended, or null. */
export function daysSinceReturn(t: Trip): number | null {
  return isFinished(t) && t.end_date ? daysBetween(t.end_date, APP_TODAY) : null;
}

interface PersonView {
  initials: string;
  tone: string;
  toneFg: string | null;
}

export function personView(u: User): PersonView {
  return { initials: u.initials, tone: u.tone, toneFg: u.tone_fg ?? null };
}

// ---------------------------------------------------------------------------
// Friends map
// ---------------------------------------------------------------------------

export interface MapMarker extends PersonView {
  id: string;
  kind: "friend" | "group";
  name: string;
  /** "Lisbon, Portugal", or the names of grouped friends. */
  place: string;
  lon: number;
  lat: number;
  travelling: boolean;
  status: string;
  detail: string;
  /** Profile link for single friends; null for grouped pins. */
  profileHref: string | null;
}

export interface FriendsMapData {
  travellingCount: number;
  friendCount: number;
  placeCount: number;
  markers: MapMarker[];
}

/**
 * One pin per travelling friend (at their current trip location) and one pin
 * per home city for friends at home – friends sharing a home city are grouped.
 */
export function getFriendsMap(viewerId: string = me()): FriendsMapData {
  const friendIds = listFriendIds(viewerId);
  const viewerUpcomingPlaces = new Set(
    listTripsForUser(viewerId)
      .filter((t) => isUpcoming(t))
      .flatMap((t) => t.places),
  );

  const travelling: MapMarker[] = [];
  const homes = new Map<string, User[]>();

  for (const id of friendIds) {
    const u = getUser(id);
    const current = getCurrentTrip(id);
    if (current?.location) {
      const loc = current.location;
      const status = `Travelling · ${travelDayLabel(current)}`;
      const place = `${loc.name}, ${loc.region}`;
      travelling.push({
        id,
        kind: "friend",
        ...personView(u),
        name: u.name,
        place,
        lon: loc.lon,
        lat: loc.lat,
        travelling: true,
        status,
        detail: getHighlight(id, viewerId)?.body ?? `${u.short_name} is in ${loc.name}.`,
        profileHref: profileHref(id),
      });
      continue;
    }
    const key = `${u.home_city}|${u.home_country}`;
    homes.set(key, [...(homes.get(key) ?? []), u]);
  }

  const singles: MapMarker[] = [];
  const groups: MapMarker[] = [];
  for (const people of homes.values()) {
    const first = people[0];
    if (people.length === 1) {
      singles.push({
        id: first.id,
        kind: "friend",
        ...personView(first),
        name: first.name,
        place: `${first.home_city}, ${first.home_country}`,
        lon: first.home_lon,
        lat: first.home_lat,
        travelling: false,
        status: viewerUpcomingPlaces.has(first.home_city) ? "Lives here" : "At home",
        detail: getHighlight(first.id, viewerId)?.body ?? `At home in ${first.home_city}.`,
        profileHref: profileHref(first.id),
      });
      continue;
    }
    const prio = (u: User) => getHighlight(u.id, viewerId)?.priority ?? Number.MAX_SAFE_INTEGER;
    const ordered = [...people].sort((a, b) => prio(a) - prio(b));
    const briefs = ordered.map((u) => getHighlight(u.id, viewerId)?.brief ?? `${u.short_name} is at home`);
    const detail =
      briefs.length > 1 ? `${briefs.slice(0, -1).join(", ")} and ${briefs[briefs.length - 1]}.` : `${briefs[0]}.`;
    groups.push({
      id: `home-${first.home_city.toLowerCase().replace(/\s+/g, "-")}`,
      kind: "group",
      initials: `+${people.length}`,
      tone: "var(--color-surface)",
      toneFg: null,
      name: first.home_city,
      place: ordered.map((u) => u.short_name).join(", "),
      lon: first.home_lon,
      lat: first.home_lat,
      travelling: false,
      status: `${people.length} friends at home`,
      detail,
      profileHref: null,
    });
  }

  const markers = [...travelling, ...singles, ...groups];
  return {
    travellingCount: travelling.length,
    friendCount: friendIds.length,
    placeCount: new Set(markers.map((m) => `${m.lon},${m.lat}`)).size,
    markers,
  };
}

// ---------------------------------------------------------------------------
// Friends' trips (planning / booked / completed)
// ---------------------------------------------------------------------------

export type FriendTripColumnStage = "planning" | "booked" | "completed";

export interface FriendTripCard extends PersonView {
  id: string;
  friendId: string;
  name: string;
  where: string;
  when: string;
  prompt: { body: string; cta: string; tone: TripPromptTone } | null;
  profileHref: string;
}

export interface FriendTripColumn {
  stage: FriendTripColumnStage;
  title: string;
  cards: FriendTripCard[];
}

const COLUMN_TITLE: Record<FriendTripColumnStage, string> = {
  planning: "Planning",
  booked: "Booked",
  completed: "Completed",
};

function columnFor(t: Trip): FriendTripColumnStage | null {
  if (isUnderway(t)) return null;
  if (isFinished(t)) return "completed";
  if (t.stage === "booked") return "booked";
  if (t.stage === "idea" || t.stage === "planning") return "planning";
  return null;
}

/** Friends' trips the viewer isn't on, grouped by stage. */
export function getFriendTripColumns(viewerId: string = me()): FriendTripColumn[] {
  const friends = new Set(listFriendIds(viewerId));
  const columns: Record<FriendTripColumnStage, Trip[]> = { planning: [], booked: [], completed: [] };

  for (const t of allTrips()) {
    if (!friends.has(t.owner_id) || isTripMember(t.id, viewerId)) continue;
    const col = columnFor(t);
    if (col) columns[col].push(t);
  }
  // Newest first: recently started plans, most recent returns.
  columns.planning.sort((a, b) => b.created_at.localeCompare(a.created_at));
  columns.booked.sort((a, b) => b.created_at.localeCompare(a.created_at));
  columns.completed.sort((a, b) => (b.end_date ?? "").localeCompare(a.end_date ?? ""));

  return (Object.keys(columns) as FriendTripColumnStage[]).map((stage) => ({
    stage,
    title: COLUMN_TITLE[stage],
    cards: columns[stage].map((t) => {
      const owner = getUser(t.owner_id);
      const prompt = db().tripPrompts.find((p) => p.trip_id === t.id && p.viewer_id === viewerId);
      return {
        id: t.id,
        friendId: owner.id,
        ...personView(owner),
        name: owner.short_name,
        where: t.name,
        when:
          stage === "completed"
            ? completedLabel(t)
            : t.start_date && t.end_date
              ? compactDateRange(t.start_date, t.end_date)
              : t.when_label,
        prompt: prompt ? { body: prompt.body, cta: prompt.cta_label, tone: prompt.tone } : null,
        profileHref: profileHref(owner.id),
      };
    }),
  }));
}

// ---------------------------------------------------------------------------
// Volunteering
// ---------------------------------------------------------------------------

export interface VolunteerCard {
  id: string;
  tag: string;
  tone: string;
  title: string;
  where: string;
  commitment: string;
  fit: string;
  cta: string;
}

export interface VolunteeringView {
  intro: string;
  cards: VolunteerCard[];
}

export interface VolunteeringData {
  route: VolunteeringView;
  need: VolunteeringView;
}

/** "29 March – 14 April". */
function longDayMonthRange(start: ISODate, end: ISODate): string {
  const f = (d: ISODate) => {
    const dt = parseISODate(d);
    return `${dt.getUTCDate()} ${MONTHS_LONG[dt.getUTCMonth()]}`;
  };
  return `${f(start)} – ${f(end)}`;
}

/** Opportunities on the viewer's next trip, and places asking for help. */
export function getVolunteering(viewerId: string = me()): VolunteeringData {
  const next = getNextTrip(viewerId);
  const opp = (id: string) => db().volunteerOpportunities.find((o) => o.id === id);

  const routeCards: VolunteerCard[] = next
    ? db().volunteerTripMatches
        .filter((m) => m.trip_id === next.id)
        .flatMap((m) => {
          const o = opp(m.opportunity_id);
          return o
            ? [{ id: o.id, tag: o.category, tone: o.tone, title: o.title, where: o.location, commitment: o.commitment, fit: m.fit_note, cta: m.cta_label }]
            : [];
        })
    : [];

  const routeIntro =
    next && next.start_date && next.end_date
      ? `Short opportunities near your ${next.country ?? next.name} route, ${longDayMonthRange(next.start_date, next.end_date)}. Add one straight into your itinerary.`
      : "Add dates to a trip and short opportunities along your route will show up here.";

  const needCards: VolunteerCard[] = db().volunteerOpportunities
    .filter((o) => o.need_tag && o.need_rank !== null)
    .sort((a, b) => (a.need_rank ?? 0) - (b.need_rank ?? 0))
    .map((o) => ({
      id: o.id,
      tag: o.need_tag ?? o.category,
      tone: o.tone,
      title: o.title,
      where: o.location,
      commitment: o.commitment,
      fit: o.need_note ?? "",
      cta: o.need_cta ?? "Find out more",
    }));

  return {
    route: { intro: routeIntro, cards: routeCards },
    need: {
      intro: "Not travelling soon? These places are popular with Matche volunteers or are asking for help right now.",
      cards: needCards,
    },
  };
}
