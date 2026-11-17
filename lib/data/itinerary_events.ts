import type { ID, ISODate } from "./types";

/** Dated items on a trip that aren't bookings or stays (itinerary_events). */
export interface ItineraryEvent {
  id: ID;
  trip_id: ID;
  /** Optional link to the trip_stops row it belongs to. */
  stop_id: ID | null;
  kind: "day_trip" | "activity";
  date: ISODate;
  label: string;
}

export const itineraryEvents: ItineraryEvent[] = [
  { id: "ev_nara", trip_id: "trip_japan", stop_id: "stop_nara", kind: "day_trip", date: "2027-04-07", label: "Nara day trip" },
  { id: "ev_hiroshima", trip_id: "trip_japan", stop_id: "stop_hiroshima", kind: "day_trip", date: "2027-04-11", label: "Hiroshima day trip" },
];
