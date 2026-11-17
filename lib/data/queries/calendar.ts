import { MONTHS_LONG, parseISODate } from "@/lib/format";
import { getTripById } from "./trips";
import { listTodos } from "./ontrip";
import { db } from "../db";

export type ChipKind = "todo" | "travel" | "plan";

export interface CalendarCellVM {
  /** ISO date, or null for leading/trailing blanks. */
  iso: string | null;
  day: number | null;
  stay: { label: string; booked: boolean } | null;
  chips: Array<{ kind: ChipKind; text: string }>;
  journal: boolean;
}

export interface CalendarMonthVM {
  key: string;
  label: string;
  cells: CalendarCellVM[];
}

const isoOf = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** "29 Mar, 9:30pm" → "9:30pm" */
const timeFrom = (label: string) => label.split(",")[1]?.trim() ?? "";
/** "Flight MEL → HND" → "MEL → HND" */
const routeFrom = (title: string) => title.replace(/^Flight\s+/i, "");

/**
 * Month grids (Mon-first) covering every month from the earliest to-do
 * deadline in the trip's run-up through the end of the trip. Each day is
 * built from trip_stop_plans (stays), bookings (travel), itinerary_events,
 * todos and journal_entries.
 */
export function getTripCalendar(tripId: string, fromMonth?: string): CalendarMonthVM[] {
  const trip = getTripById(tripId);
  if (!trip?.start_date || !trip.end_date) return [];

  const stops = db().tripStops.filter((s) => s.trip_id === tripId);
  const plans = db().tripStopPlans.filter((p) => p.mode === "dated" && stops.some((s) => s.id === p.stop_id));
  const tripBookings = db().bookings.filter((b) => b.trip_id === tripId);
  const events = db().itineraryEvents.filter((e) => e.trip_id === tripId);
  const todos = listTodos(tripId);
  const entryDates = new Set(db().journalEntries.filter((e) => e.trip_id === tripId).map((e) => e.entry_date));

  function stayFor(iso: string) {
    // Nights run from start_date up to (not including) end_date.
    const p = plans.find((pl) => pl.start_date! <= iso && iso < pl.end_date!);
    if (!p) return null;
    const stop = stops.find((s) => s.id === p.stop_id)!;
    return { label: stop.place, booked: p.status === "booked" };
  }

  function chipsFor(iso: string) {
    const chips: CalendarCellVM["chips"] = [];
    for (const t of todos) if (t.due_on === iso) chips.push({ kind: "todo", text: t.title });
    for (const b of tripBookings) {
      if (b.starts_on !== iso) continue;
      if (b.kind === "flight") chips.push({ kind: "travel", text: `${routeFrom(b.title)} ${timeFrom(b.when_label)}`.trim() });
      if (b.kind === "rail") chips.push({ kind: "travel", text: `${b.title.replace(/^Japan Rail Pass/, "JR Pass")} starts` });
    }
    for (const e of events) if (e.date === iso) chips.push({ kind: "plan", text: e.label });
    return chips;
  }

  const start = fromMonth ?? trip.start_date.slice(0, 7);
  const end = trip.end_date.slice(0, 7);
  const months: CalendarMonthVM[] = [];
  let [y, m] = start.split("-").map(Number);
  m -= 1;
  while (isoOf(y, m, 1).slice(0, 7) <= end) {
    const first = parseISODate(isoOf(y, m, 1));
    const lead = (first.getUTCDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const cells: CalendarCellVM[] = Array.from({ length: lead }, () => ({ iso: null, day: null, stay: null, chips: [], journal: false }));
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = isoOf(y, m, d);
      cells.push({ iso, day: d, stay: stayFor(iso), chips: chipsFor(iso), journal: entryDates.has(iso) });
    }
    while (cells.length % 7) cells.push({ iso: null, day: null, stay: null, chips: [], journal: false });
    months.push({ key: isoOf(y, m, 1).slice(0, 7), label: `${MONTHS_LONG[m]} ${y}`, cells });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return months;
}
