/**
 * Row types for the profile screen (`/me`). Same conventions as `types.ts`:
 * each interface mirrors a future Postgres/Supabase table.
 */
import type { ID, ISODate, ISODateTime, Tone } from "./types";

// ---------------------------------------------------------------------------
// user_profiles – public profile fields beyond the `users` row
// ---------------------------------------------------------------------------
export interface ProfileFact {
  label: string;
  value: string;
}

export interface UserProfile {
  user_id: ID;
  /** Without the "@", e.g. "matthewcheung". */
  handle: string;
  /** Large hero avatar background. */
  hero_tone: Tone;
  about: string;
  /** Short travel-style tags, e.g. "Food-led". */
  style_tags: string[];
  /** Quick facts grid, e.g. { label: "Favourite spot", value: "Hoi An, Vietnam" }. */
  facts: ProfileFact[];
  ask_me_about: string[];
  bucket_list: string[];
  /** Summary line for the "Giving back" card. */
  giving_back: string;
  /** Whether notes from people met appear on the public profile. */
  notes_public: boolean;
  created_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// user_travel_stats – aggregates computed from trips and journal entries
// ---------------------------------------------------------------------------
export interface UserTravelStats {
  user_id: ID;
  countries_visited: number;
  continents_visited: number;
  distance_km: number;
  /** e.g. "by plane, train, bus and one very slow ferry". */
  distance_note: string;
  personality: string;
  personality_note: string;
  fun_facts: ProfileFact[];
  computed_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// user_year_nights – nights away per calendar year (all trips, incl. weekends)
// ---------------------------------------------------------------------------
export interface UserYearNights {
  user_id: ID;
  year: number;
  nights: number;
}

// ---------------------------------------------------------------------------
// user_badges
// ---------------------------------------------------------------------------
export interface UserBadge {
  id: ID;
  user_id: ID;
  name: string;
  /** Why it was earned, e.g. "14 markets logged". */
  detail: string;
  tone: Tone;
  earned_at: ISODate;
}

// ---------------------------------------------------------------------------
// trip_reviews – the traveller's own look back on a completed trip
// ---------------------------------------------------------------------------
export interface TripReview {
  trip_id: ID;
  user_id: ID;
  /** Short label for the chapter tab, e.g. "NZ South Island". */
  short_title: string;
  /** 0–5, one decimal. */
  rating: number;
  journal_entry_count: number;
  highlight_quote: string;
  /** Trip day the quote comes from. */
  highlight_day: number;
  cover_tone: Tone;
  photo_tones: Tone[];
}

// ---------------------------------------------------------------------------
// profile_notes – notes left on a profile by people met while travelling.
// Authors are usually hosts/guides without an account, so they're inline.
// ---------------------------------------------------------------------------
export type ProfileNoteStatus = "pending" | "approved";

export interface ProfileNote {
  id: ID;
  /** Profile the note is on. */
  profile_user_id: ID;
  /** Set when the author is a Matche user. */
  author_user_id: ID | null;
  author_name: string;
  /** e.g. "homestay host". */
  author_role: string;
  author_initials: string;
  author_tone: Tone;
  /** Where they met, e.g. "Hoi An, Vietnam". */
  met_at: string;
  /** Trip they met on; its start year is shown on the note. */
  trip_id: ID | null;
  body: string;
  status: ProfileNoteStatus;
  /** Owner's choice to show this note on their public profile. */
  shown_on_profile: boolean;
  created_at: ISODateTime;
}
