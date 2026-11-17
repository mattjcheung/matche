/**
 * Row types for the social screens (`/friends`, `/friends/[id]`). Same
 * conventions as `types.ts`: each interface mirrors a future Postgres/Supabase
 * table, references users and trips by id and never duplicates their columns.
 */
import type { ID, ISODate, ISODateTime, MediaKind, Tone } from "./types";

// ---------------------------------------------------------------------------
// trip_locations – where a trip goes, with coordinates for the friends map
// (geo companion to `trip_stops`; one row per place a trip visits)
// ---------------------------------------------------------------------------
export interface TripLocation {
  id: ID;
  trip_id: ID;
  /** Order within the trip, from 1. */
  position: number;
  /** Place name, e.g. "Lisbon". */
  name: string;
  /** Country or well-known region shown after the name, e.g. "Portugal", "Bali". */
  region: string;
  lon: number;
  lat: number;
  starts_on: ISODate | null;
  ends_on: ISODate | null;
}

// ---------------------------------------------------------------------------
// visited_regions – countries / regions a user has been to
// ---------------------------------------------------------------------------
export interface VisitedRegion {
  user_id: ID;
  /** Country or region name, matching `TripLocation.region`, e.g. "Bali". */
  region: string;
  /** Number of separate visits. */
  visit_count: number;
  first_visited_on: ISODate | null;
}

// ---------------------------------------------------------------------------
// user_travel_summaries – headline numbers on a friend's profile
// ---------------------------------------------------------------------------
export interface UserTravelSummary {
  user_id: ID;
  countries_visited: number;
  favourite_country: string | null;
  trips_logged: number;
  computed_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// friend_highlights – "why this friend matters to you right now", written for
// one viewer (generated from trips and activity, editable by the friend).
// ---------------------------------------------------------------------------
export interface FriendHighlight {
  id: ID;
  viewer_id: ID;
  friend_id: ID;
  /** Full sentence(s) for the map detail card. */
  body: string;
  /** Short clause used when friends are grouped, e.g. "Rosa just got back from Peru". */
  brief: string;
  /** Activity line for "Friends around the world"; null = not shown there. */
  activity: string | null;
  /** Lower = shown first. */
  priority: number;
  created_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// trip_prompts – the nudge on a friend's trip card ("Tom asked: …")
// ---------------------------------------------------------------------------
export type TripPromptTone = "primary" | "accent" | "neutral";
export type TripPromptKind = "question" | "vote" | "meetup" | "tip" | "follow" | "ask" | "recap";

export interface TripPrompt {
  id: ID;
  trip_id: ID;
  viewer_id: ID;
  kind: TripPromptKind;
  body: string;
  cta_label: string;
  tone: TripPromptTone;
  created_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// friend_journal_entries – public journal entries from friends' trips
// ---------------------------------------------------------------------------
export interface FriendJournalEntry {
  id: ID;
  author_id: ID;
  trip_id: ID;
  day_number: number;
  /** Neighbourhood / place for the day label, e.g. "Alfama". */
  place: string;
  body: string;
  media_kind: MediaKind;
  /** Placeholder colour until real media storage exists. */
  media_tone: Tone;
  /** Video duration label, e.g. "0:20". */
  media_duration: string | null;
  like_count: number;
  reply_count: number;
  visibility: "public" | "friends" | "private";
  created_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// volunteer_opportunities & volunteer_trip_matches
// ---------------------------------------------------------------------------
export interface VolunteerOpportunity {
  id: ID;
  title: string;
  category: string;
  /** Tag colour. */
  tone: Tone;
  /** Where, as shown, e.g. "Kyoto community centre". */
  location: string;
  /** Time commitment and what's provided. */
  commitment: string;
  /** Listed under "Where help is needed" with this tag / note / action; null = not listed there. */
  need_tag: string | null;
  need_note: string | null;
  need_cta: string | null;
  /** Lower = shown first in "Where help is needed". */
  need_rank: number | null;
  verified_at: ISODateTime;
}

/** How an opportunity fits one of the viewer's trips ("On your route"). */
export interface VolunteerTripMatch {
  id: ID;
  opportunity_id: ID;
  trip_id: ID;
  /** Day it would slot into, if any. */
  suggested_on: ISODate | null;
  fit_note: string;
  cta_label: string;
}

// ---------------------------------------------------------------------------
// travel_groups – meetups for travellers in the same place at the same time
// ---------------------------------------------------------------------------
export interface TravelGroup {
  id: ID;
  name: string;
  /** Place name matching a trip's `places`, e.g. "Kyoto". */
  place: string;
  starts_on: ISODate;
  ends_on: ISODate;
  member_count: number;
  created_at: ISODateTime;
}
