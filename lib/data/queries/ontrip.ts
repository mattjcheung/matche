import { daysBetween, formatDateRange, MONTHS_LONG, MONTHS_SHORT, parseISODate, WEEKDAYS_SHORT } from "@/lib/format";
import { journalEntries, journalMedia, tripRecaps } from "../journal_entries";
import { todos } from "../todos";
import { tripStopPlans, tripStops } from "../trip_stops";
import type { Todo } from "../types.ontrip";
import { APP_TODAY, CURRENT_USER_ID, getUser } from "../users";
import { getTripById, getTripMembers } from "./trips";

/* ------------------------------------------------------------------------ */
/* To-dos                                                                    */
/* ------------------------------------------------------------------------ */

export function listTodos(tripId: string): Todo[] {
  return todos.filter((t) => t.trip_id === tripId).sort((a, b) => (a.due_on < b.due_on ? -1 : 1));
}

/** Open to-dos due within `days` of today. */
export function countTodosDueSoon(tripId: string, days = 120): number {
  return listTodos(tripId).filter((t) => !t.done && daysBetween(APP_TODAY, t.due_on) <= days).length;
}

export function listTodoVMs(tripId: string, limit = 5) {
  return listTodos(tripId)
    .slice(0, limit)
    .map((t) => {
      const d = parseISODate(t.due_on);
      return { id: t.id, mon: MONTHS_SHORT[d.getUTCMonth()], day: String(d.getUTCDate()), title: t.title, note: t.note, auto: t.source === "auto" };
    });
}

/* ------------------------------------------------------------------------ */
/* Journal                                                                   */
/* ------------------------------------------------------------------------ */

/**
 * The on-trip "today" used to preview the journal. Once data is live this is
 * the traveller's local date while a trip is in progress.
 */
export const JOURNAL_PREVIEW_DATE = "2027-04-06";

export function getJournalDay(tripId: string, date: string = JOURNAL_PREVIEW_DATE) {
  const trip = getTripById(tripId);
  if (!trip?.start_date) throw new Error("Trip has no dates");
  const d = parseISODate(date);
  const dayNumber = daysBetween(trip.start_date, date) + 1;
  // Where are we tonight? The dated stop whose nights cover this date.
  const stops = tripStops.filter((s) => s.trip_id === tripId);
  const plan = tripStopPlans.find((p) => p.mode === "dated" && stops.some((s) => s.id === p.stop_id) && p.start_date! <= date && date < p.end_date!);
  const place = stops.find((s) => s.id === plan?.stop_id)?.place ?? trip.places[0];

  // A 7-day strip centred-ish on today (4 back, 2 forward).
  const days = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(d.getTime() + (i - 4) * 86_400_000);
    const iso = dt.toISOString().slice(0, 10);
    const state = iso === date ? "today" : iso < date ? "past" : "future";
    const hasEntry = journalEntries.some((e) => e.trip_id === tripId && e.entry_date === iso);
    return { iso, weekday: WEEKDAYS_SHORT[dt.getUTCDay()], n: String(dt.getUTCDate()), state, hasEntry: hasEntry || state === "today" };
  });

  return {
    dayNumber,
    place,
    title: `${WEEKDAYS_SHORT[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS_LONG[d.getUTCMonth()]}`,
    days,
  };
}

export interface JournalEntryVM {
  id: string;
  author: { name: string; initials: string; tone: string; fg?: string };
  time: string;
  body: string;
  photoTone: string | null;
  likes: number;
  replies: number;
}

/** Group-visible entries from the other travellers for a day, newest first. */
export function listGroupEntries(tripId: string, date: string = JOURNAL_PREVIEW_DATE): JournalEntryVM[] {
  return journalEntries
    .filter((e) => e.trip_id === tripId && e.entry_date === date && e.visibility === "group" && e.author_id !== CURRENT_USER_ID)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .map((e) => {
      const u = getUser(e.author_id);
      return {
        id: e.id,
        author: { name: u.short_name, initials: u.initials, tone: u.tone, fg: u.tone_fg },
        time: `${e.local_time} · ${e.place}`,
        body: e.body,
        photoTone: journalMedia.find((m) => m.entry_id === e.id)?.tone ?? null,
        likes: e.like_count,
        replies: e.reply_count,
      };
    });
}

/** Names of the other people on the trip, for "Sophie and Jordan will see this". */
export function listTripCompanions(tripId: string): string[] {
  return getTripMembers(tripId).filter((u) => u.id !== CURRENT_USER_ID).map((u) => u.short_name);
}

/* ------------------------------------------------------------------------ */
/* Recap                                                                     */
/* ------------------------------------------------------------------------ */

export function getTripRecap(tripId: string) {
  const trip = getTripById(tripId);
  const recap = tripRecaps.find((r) => r.trip_id === tripId);
  if (!trip || !recap || !trip.start_date || !trip.end_date) return null;
  return {
    tripName: trip.name,
    country: trip.country ?? trip.places[0],
    dates: formatDateRange(trip.start_date, trip.end_date),
    nights: daysBetween(trip.start_date, trip.end_date),
    places: recap.places_count,
    entries: recap.total_entry_count,
    sourceEntries: recap.source_entry_count,
    duration: recap.duration_label,
    template: recap.template,
    coverTone: recap.cover_tone,
  };
}
