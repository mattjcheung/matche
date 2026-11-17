import type { ID, ISODate, Tone, TripBudget } from "./types";

/**
 * Row types for the trip planner (`/trips/[slug]`) and the Start-a-trip wizard
 * (`/trips/new`). Same conventions as `types.ts`: snake_case columns, string
 * ids, `<table>_id` foreign keys, ISO dates, integer minor units for money.
 */

// ---------------------------------------------------------------------------
// trip_stops – places on a trip's route (overnight bases and day trips)
// ---------------------------------------------------------------------------
export type TripStopKind = "overnight" | "day_trip";

export interface TripStop {
  id: ID;
  trip_id: ID;
  /** Order along the route. */
  position: number;
  place: string;
  kind: TripStopKind;
  /** For day trips: the overnight stop they're taken from. */
  parent_stop_id: ID | null;
  /** Schematic route-map coordinates (0–300 × 0–260 viewBox). */
  map_x: number;
  map_y: number;
  map_r: number;
  label_x: number;
  label_y: number;
}

// ---------------------------------------------------------------------------
// trip_stop_plans – one row per stop per itinerary mode
// ---------------------------------------------------------------------------
export type ItineraryMode = "dated" | "flexible";
export type TripStopStatus = "booked" | "hoping" | "to_book" | "idea";

export interface TripStopPlan {
  id: ID;
  stop_id: ID;
  mode: ItineraryMode;
  start_date: ISODate | null;
  end_date: ISODate | null;
  /** For flexible plans, e.g. "4–5 nights". */
  nights_label: string | null;
  status: TripStopStatus;
  detail: string;
}

// ---------------------------------------------------------------------------
// trip_guides – generated planning notes for a trip
// ---------------------------------------------------------------------------
export interface TripGuide {
  trip_id: ID;
  route_title: string;
  route_body: string;
  /** e.g. "Spring · cities + onsen · lots of trains". */
  packing_context: string;
}

// ---------------------------------------------------------------------------
// experiences & trip_experience_suggestions
// ---------------------------------------------------------------------------
export interface Experience {
  id: ID;
  name: string;
  place: string;
  country: string;
  /** Average traveller rating, 0–5. */
  rating: number;
  /** 0 = free, 1–3 = $ … $$$. */
  price_level: 0 | 1 | 2 | 3;
  media_tone: Tone;
}

export type ExperienceSignal = "friend_loved" | "friend_saved" | "booked_count" | "wishlist";

export interface TripExperienceSuggestion {
  id: ID;
  trip_id: ID;
  experience_id: ID;
  position: number;
  signal: ExperienceSignal;
  signal_user_id: ID | null;
  signal_count: number | null;
}

// ---------------------------------------------------------------------------
// travel_documents
// ---------------------------------------------------------------------------
export interface TravelDocument {
  id: ID;
  user_id: ID;
  kind: "passport";
  issuing_country: string;
  expires_on: ISODate;
}

// ---------------------------------------------------------------------------
// trip_checklist_items – per-person to-dos generated for a trip
// ---------------------------------------------------------------------------
export type ChecklistStatus = "done" | "warning" | "todo";

export interface TripChecklistItem {
  id: ID;
  trip_id: ID;
  user_id: ID;
  category: "documents";
  position: number;
  status: ChecklistStatus;
  /** Bold lead-in, e.g. "No visa needed". */
  title: string | null;
  body: string;
}

// ---------------------------------------------------------------------------
// destinations – places people can start a trip to, with gathered info
// ---------------------------------------------------------------------------
export interface Destination {
  id: ID;
  name: string;
  /** Country the destination is in (used for domestic vs. international). */
  country: string;
  docs: string;
  events: string;
  health: string;
  people: string;
  /** Packing starter phrase, e.g. "slip-on shoes for temples, …". */
  packing: string;
  /** Friends-of-friends who've been (locked until introduced). */
  fof_visited_count: number;
  /** Matche trips logged here in spring; null until there's enough data. */
  spring_trip_count: number | null;
}

export type DestinationNoteCategory = "events" | "health";

export interface DestinationNote {
  id: ID;
  destination_id: ID;
  category: DestinationNoteCategory;
  position: number;
  title: string;
  body: string;
}

export interface DestinationStat {
  id: ID;
  destination_id: ID;
  position: number;
  label: string;
  value_label: string;
  /** 0–100 bar fill. */
  score_pct: number;
}

/** Per-person daily living cost by spending style. */
export interface DestinationCost {
  destination_id: ID;
  tier: TripBudget;
  /** Integer minor units (AUD); null until enough traveller data exists. */
  daily_cents: number | null;
}

// ---------------------------------------------------------------------------
// user_destination_links – who has been / is going / lived somewhere
// ---------------------------------------------------------------------------
export type DestinationRelation = "visited" | "planning" | "lived";

export interface UserDestinationLink {
  id: ID;
  user_id: ID;
  destination_id: ID;
  relation: DestinationRelation;
  /** e.g. "Been 3 times · last trip Oct 2025". */
  summary: string;
}

// ---------------------------------------------------------------------------
// trip_overlaps – friends / travellers in the same place at the same time
// ---------------------------------------------------------------------------
export interface TripOverlap {
  id: ID;
  trip_id: ID;
  /** A friend who overlaps, or null for an anonymous traveller count. */
  user_id: ID | null;
  traveller_count: number | null;
  place: string;
  dates_label: string;
}

// ---------------------------------------------------------------------------
// packing_items
// ---------------------------------------------------------------------------
export interface PackingItem {
  id: ID;
  trip_id: ID;
  position: number;
  label: string;
  reason: string;
  is_packed: boolean;
}

// ---------------------------------------------------------------------------
// trip_ideas – destination suggestions for the Start-a-trip wizard
// ---------------------------------------------------------------------------
export interface TripIdea {
  id: ID;
  user_id: ID;
  destination_id: ID;
  position: number;
  reason: string;
}

/** Friends suggested first when inviting people to a new trip. */
export interface CompanionSuggestion {
  user_id: ID;
  friend_id: ID;
  position: number;
}
