import type { ID, ISODate, ISODateTime, MediaKind, Tone } from "./types";

/** A dated to-do on a trip (todos). `source` = "auto" for requirement-driven deadlines. */
export interface Todo {
  id: ID;
  trip_id: ID;
  title: string;
  note: string;
  due_on: ISODate;
  source: "auto" | "manual";
  done: boolean;
}

export type JournalVisibility = "private" | "group";

/** A journal entry written during a trip (journal_entries). */
export interface JournalEntry {
  id: ID;
  trip_id: ID;
  author_id: ID;
  entry_date: ISODate;
  /** "12:40" local time. */
  local_time: string;
  place: string;
  body: string;
  visibility: JournalVisibility;
  like_count: number;
  reply_count: number;
  created_at: ISODateTime;
}

/** Photo / video attached to a journal entry (journal_media). */
export interface JournalMedia {
  id: ID;
  entry_id: ID;
  kind: MediaKind;
  tone: Tone;
  duration?: string;
}

export type RecapTemplate = "basic" | "upbeat";

/** Auto-generated end-of-trip film (trip_recaps). */
export interface TripRecap {
  id: ID;
  trip_id: ID;
  template: RecapTemplate;
  duration_label: string;
  /** Shared entries the film was built from. */
  source_entry_count: number;
  total_entry_count: number;
  places_count: number;
  cover_tone: Tone;
  submitted_to_featured: boolean;
}
