import { daysBetween, formatDateRange } from "@/lib/format";
import { ACTIVE_TRIP_ID, tripMembers, trips } from "../trips";
import type { Trip, User } from "../types";
import { APP_TODAY, CURRENT_USER_ID, getUser } from "../users";

/**
 * Trip queries. Each function maps 1:1 to a future SQL query, e.g.
 *   listMyTrips → select trips.* from trips join trip_members … where user_id = $1
 * Keep them synchronous-looking but treat results as read-only.
 */

export function listMyTrips(userId: string = CURRENT_USER_ID): Trip[] {
  const mine = new Set(tripMembers.filter((m) => m.user_id === userId).map((m) => m.trip_id));
  return trips.filter((t) => mine.has(t.id));
}

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}

export function getTripById(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

/** The trip shown on Calendar / Costs / Journal / Recap. */
export function getActiveTrip(): Trip {
  const t = getTripById(ACTIVE_TRIP_ID);
  if (!t) throw new Error("Active trip missing");
  return t;
}

/** Next dated trip that hasn't started yet. */
export function getNextTrip(userId: string = CURRENT_USER_ID): Trip | undefined {
  return listMyTrips(userId)
    .filter((t) => t.start_date && t.start_date >= APP_TODAY)
    .sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1))[0];
}

export function getTripMembers(tripId: string): User[] {
  return tripMembers
    .filter((m) => m.trip_id === tripId)
    .sort((a, b) => (a.role === "owner" ? -1 : b.role === "owner" ? 1 : 0))
    .map((m) => getUser(m.user_id));
}

export function daysUntilTrip(trip: Trip): number | null {
  return trip.start_date ? daysBetween(APP_TODAY, trip.start_date) : null;
}

/** "29 Mar – 14 Apr 2027", or the free-text label for undated trips. */
export function tripDatesLabel(trip: Trip): string {
  return trip.start_date && trip.end_date ? formatDateRange(trip.start_date, trip.end_date) : trip.when_label;
}

export const STAGE_LABEL: Record<Trip["stage"], string> = {
  idea: "Idea",
  planning: "Planning",
  booked: "Booked",
  travelling: "On the trip",
  completed: "Completed",
};

/** Tag tone per stage, matching the trip cards. */
export const STAGE_TONE: Record<Trip["stage"], "primary" | "accent" | "neutral" | "dark"> = {
  idea: "neutral",
  planning: "accent",
  booked: "primary",
  travelling: "primary",
  completed: "dark",
};
