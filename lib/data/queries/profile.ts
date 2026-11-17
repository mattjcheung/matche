import { MONTHS_LONG, MONTHS_SHORT, parseISODate } from "@/lib/format";
import { friendships } from "../friendships";
import { friendJournalEntries } from "../journal_entries_friends";
import { travelGroups } from "../travel_groups";
import type { ISODate, Trip } from "../types";
import type { FriendJournalEntry } from "../types.social";
import { CURRENT_USER_ID, getUser, usersById } from "../users";
import { travelSummaries, visitedRegions } from "../visited_regions";
import {
  daysSinceReturn,
  getCurrentTrip,
  isFriend,
  isTripMember,
  isUpcoming,
  listFriendIds,
  listHighlights,
  listTripsForUser,
  personView,
  profileHref,
  travelDayLabel,
  tripLength,
  tripRegions,
} from "./friends";
import { getNextTrip } from "./trips";

/**
 * Friend profile queries (`/friends/[id]`). Built for any friend; friends with
 * little data get empty lists rather than errors.
 */

/** Ids for `generateStaticParams`. */
export function listFriendProfileIds(viewerId: string = CURRENT_USER_ID): string[] {
  return listFriendIds(viewerId);
}

/** Regions a user has been to: `visited_regions` plus finished trips. */
function visitedBy(userId: string): string[] {
  const listed = visitedRegions.filter((v) => v.user_id === userId).map((v) => v.region);
  const fromTrips = listTripsForUser(userId)
    .filter((t) => daysSinceReturn(t) !== null)
    .flatMap(tripRegions);
  return [...new Set([...listed, ...fromTrips])];
}

/** Regions on a user's upcoming trips. */
function planningRegions(userId: string): string[] {
  return [...new Set(listTripsForUser(userId).filter((t) => isUpcoming(t)).flatMap(tripRegions))];
}

export interface ProfileStat {
  value: string;
  label: string;
  highlight: boolean;
}

export interface SharedPlan {
  label: string;
  /** Shared trip the viewer is on. */
  shared: boolean;
}

export interface ProfileJournalEntry {
  id: string;
  tone: string;
  caption: string;
  dayLabel: string;
  body: string;
  likes: number;
  replies: number;
}

export interface FriendProfile {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  tone: string;
  toneFg: string | null;
  /** "Friends since 2024 · currently in Lisbon". */
  intro: string;
  stats: ProfileStat[];
  common: {
    bothBeen: string[];
    beenWherePlanning: string[];
    /** First place to ask about, e.g. "Portugal". */
    askAbout: string | null;
    bothPlanning: SharedPlan[];
    sharedTripHref: string | null;
  };
  journal: {
    title: string;
    subtitle: string;
    entries: ProfileJournalEntry[];
  };
}

function entryView(e: FriendJournalEntry): ProfileJournalEntry {
  return {
    id: e.id,
    tone: e.media_tone,
    caption: e.media_kind === "video" ? `[Video${e.media_duration ? ` ${e.media_duration}` : ""}]` : "[Photo]",
    dayLabel: `Day ${e.day_number} · ${e.place}`,
    body: e.body,
    likes: e.like_count,
    replies: e.reply_count,
  };
}

function publicEntries(authorId: string, tripId: string): ProfileJournalEntry[] {
  return friendJournalEntries
    .filter((e) => e.author_id === authorId && e.trip_id === tripId && e.visibility === "public")
    .sort((a, b) => b.day_number - a.day_number)
    .map(entryView);
}

function monthYear(d: ISODate): string {
  const dt = parseISODate(d);
  return `${MONTHS_LONG[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

export function getFriendProfile(friendId: string, viewerId: string = CURRENT_USER_ID): FriendProfile | null {
  if (!usersById[friendId] || !isFriend(friendId, viewerId)) return null;
  const u = getUser(friendId);
  const current = getCurrentTrip(friendId);

  // ---- you and them ----
  const viewerVisited = new Set(visitedBy(viewerId));
  const viewerPlanning = planningRegions(viewerId);
  const friendVisited = visitedBy(friendId);
  const bothBeen = friendVisited.filter((r) => viewerVisited.has(r));
  const beenWherePlanning = friendVisited.filter((r) => viewerPlanning.includes(r) && !viewerVisited.has(r));

  const friendUpcoming = listTripsForUser(friendId).filter((t) => isUpcoming(t));
  const sharedTrips = friendUpcoming.filter((t) => isTripMember(t.id, viewerId));
  const bothPlanning: SharedPlan[] = [];
  const seen = new Set<string>();
  for (const t of sharedTrips) {
    const label = t.country ?? t.name;
    seen.add(label);
    bothPlanning.push({ label: `${label} · same trip`, shared: true });
  }
  for (const t of friendUpcoming) {
    if (sharedTrips.includes(t)) continue;
    for (const r of tripRegions(t)) {
      if (viewerPlanning.includes(r) && !seen.has(r)) {
        seen.add(r);
        bothPlanning.push({ label: r, shared: false });
      }
    }
  }

  // ---- stats ----
  const summary = travelSummaries.find((s) => s.user_id === friendId);
  const placesInCommon = bothBeen.length + beenWherePlanning.length + bothPlanning.length;
  const stats: ProfileStat[] = [
    { value: String(summary?.countries_visited ?? friendVisited.length), label: "countries visited", highlight: false },
    { value: summary?.favourite_country ?? "—", label: "favourite country", highlight: false },
    {
      value: String(summary?.trips_logged ?? listTripsForUser(friendId).filter((t) => daysSinceReturn(t) !== null).length),
      label: "trips logged",
      highlight: false,
    },
    { value: String(placesInCommon), label: "places in common", highlight: true },
  ];

  // ---- journal ----
  let journal: FriendProfile["journal"];
  if (current) {
    journal = {
      title: `${current.location?.name ?? current.trip.name}, right now`,
      subtitle: `${u.short_name}’s public journal entries · ${travelDayLabel(current)}`,
      entries: publicEntries(friendId, current.trip.id),
    };
  } else {
    const recent = listTripsForUser(friendId)
      .filter((t): t is Trip & { end_date: string } => daysSinceReturn(t) !== null && !!t.end_date)
      .sort((a, b) => b.end_date.localeCompare(a.end_date))
      .find((t) => publicEntries(friendId, t.id).length > 0);
    journal = recent
      ? {
          title: `${recent.name}, ${monthYear(recent.end_date)}`,
          subtitle: `${u.short_name}’s public journal entries · ${tripLength(recent)} days`,
          entries: publicEntries(friendId, recent.id),
        }
      : {
          title: `${u.short_name}’s journal`,
          subtitle: "Public journal entries from their trips show up here.",
          entries: [],
        };
  }

  const since = friendships.find((f) => f.user_id === viewerId && f.friend_id === friendId)?.created_at;
  const where = current?.location ? `currently in ${current.location.name}` : `at home in ${u.home_city}`;

  return {
    id: u.id,
    name: u.name,
    shortName: u.short_name,
    ...personView(u),
    intro: since ? `Friends since ${since.slice(0, 4)} · ${where}` : where,
    stats,
    common: {
      bothBeen,
      beenWherePlanning,
      askAbout: beenWherePlanning[0] ?? null,
      bothPlanning,
      sharedTripHref: sharedTrips[0] ? `/trips/${sharedTrips[0].slug}` : null,
    },
    journal,
  };
}

// ---------------------------------------------------------------------------
// Sidebar: friends around the world
// ---------------------------------------------------------------------------

export interface WorldFriend {
  id: string;
  initials: string;
  tone: string;
  toneFg: string | null;
  name: string;
  where: string;
  status: string;
  profileHref: string;
}

/** Friends with something happening, most relevant first. */
export function getFriendsAroundTheWorld(
  viewerId: string = CURRENT_USER_ID,
  opts: { exclude?: string; limit?: number } = {},
): WorldFriend[] {
  const friends = new Set(listFriendIds(viewerId));
  return listHighlights(viewerId)
    .filter((h) => h.activity && friends.has(h.friend_id) && h.friend_id !== opts.exclude)
    .slice(0, opts.limit ?? 4)
    .map((h) => {
      const u = getUser(h.friend_id);
      const current = getCurrentTrip(u.id);
      const trips = listTripsForUser(u.id);
      const justBack = trips.find((t) => {
        const d = daysSinceReturn(t);
        return d !== null && d <= 7;
      });
      const upcoming = trips.filter((t) => isUpcoming(t) && !isTripMember(t.id, viewerId));
      let where: string;
      let status = h.activity ?? "";
      if (current) {
        where = current.location?.name ?? current.trip.name;
        status = `${travelDayLabel(current)} · ${status}`;
      } else if (justBack) {
        where = `Just back from ${justBack.name}`;
      } else if (upcoming[0]) {
        where = upcoming[0].stage === "booked" ? `${upcoming[0].name} booked` : `Planning ${upcoming[0].name}`;
      } else {
        where = u.home_city;
      }
      return { id: u.id, ...personView(u), name: u.short_name, where, status, profileHref: profileHref(u.id) };
    });
}

// ---------------------------------------------------------------------------
// Sidebar: travel groups for the viewer's next trip
// ---------------------------------------------------------------------------

export interface TravelGroupView {
  id: string;
  name: string;
  meta: string;
}

/** "10 Apr", "3–7 Apr", "29 Mar – 2 Apr". */
function shortDayRange(start: ISODate, end: ISODate): string {
  const s = parseISODate(start);
  const e = parseISODate(end);
  const sm = MONTHS_SHORT[s.getUTCMonth()];
  if (start === end) return `${s.getUTCDate()} ${sm}`;
  if (s.getUTCMonth() === e.getUTCMonth()) return `${s.getUTCDate()}–${e.getUTCDate()} ${sm}`;
  return `${s.getUTCDate()} ${sm} – ${e.getUTCDate()} ${MONTHS_SHORT[e.getUTCMonth()]}`;
}

export function getTravelGroupsForNextTrip(viewerId: string = CURRENT_USER_ID, limit = 3): TravelGroupView[] {
  const next = getNextTrip(viewerId);
  if (!next || !next.start_date || !next.end_date) return [];
  const { start_date, end_date } = next;
  return travelGroups
    .filter((g) => next.places.includes(g.place) && g.starts_on <= end_date && g.ends_on >= start_date)
    .sort((a, b) => b.member_count - a.member_count)
    .slice(0, limit)
    .map((g) => ({
      id: g.id,
      name: g.name,
      meta: `${g.member_count} travellers · ${shortDayRange(g.starts_on, g.ends_on)}`,
    }));
}
