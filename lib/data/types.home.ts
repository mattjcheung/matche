import type { ID, ISODate, ISODateTime, Tone } from "./types";

/** A short film a traveller made from their journal (featured_recaps). */
export interface FeaturedRecap {
  id: ID;
  author_id: ID;
  title: string;
  country: string;
  duration_label: string;
  save_count: number;
  cover_tone: Tone;
  published_at: ISODateTime;
}

/** Long-form review tied to a verified trip (stories). */
export interface Story {
  id: ID;
  author_id: ID;
  place: string;
  title: string;
  blurb: string;
  read_minutes: number;
  rating: number;
  cover_tone: Tone;
  published_at: ISODateTime;
}

/** Denormalised activity line for "Friends right now" (friend_activity). */
export interface FriendActivity {
  id: ID;
  user_id: ID;
  /** Verb phrase after the name, e.g. "is in Lisbon". */
  action: string;
  meta: string;
  created_at: ISODateTime;
}

/** Other Matche travellers in the same place at the same time (traveller_overlaps). */
export interface TravellerOverlap {
  id: ID;
  trip_id: ID;
  place: string;
  starts_on: ISODate;
  ends_on: ISODate;
  traveller_count: number;
  group_name: string;
  pitch: string;
}
