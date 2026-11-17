import { daysBetween, formatDateRange } from "@/lib/format";
import type { Trip, User } from "../types";
import { db, me, getUser } from "../db";
import { redirect } from "next/navigation";
import { APP_TODAY } from "../clock";

/**
 * Trip queries. Each function maps 1:1 to a future SQL query, e.g.
 *   listMyTrips → select trips.* from trips join trip_members … where user_id = $1
 * Keep them synchronous-looking but treat results as read-only.
 */

export function listMyTrips(userId: string = me()): Trip[] {
  const mine = new Set(db().tripMembers.filter((m) => m.user_id === userId).map((m) => m.trip_id));
  return db().trips.filter((t) => mine.has(t.id));
}

export function getTripBySlug(slug: string): Trip | undefined {
  return db().trips.find((t) => t.slug === slug);
}

export function getTripById(id: string): Trip | undefined {
  return db().trips.find((t) => t.id === id);
}

/**
 * The trip the Calendar, Costs, Journal and Recap screens show: your next
 * dated trip, else your most recent dated one. No dated trips → start one.
 */
export function getActiveTrip(): Trip {
  const dated = listMyTrips().filter((t) => t.start_date && t.end_date);
  const t =
    dated.filter((x) => x.end_date! >= APP_TODAY).sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1))[0] ??
    dated.sort((a, b) => (a.end_date! < b.end_date! ? 1 : -1))[0];
  if (!t) redirect("/trips/new");
  return t;
}

/** Next dated trip that hasn't started yet. */
export function getNextTrip(userId: string = me()): Trip | undefined {
  return listMyTrips(userId)
    .filter((t) => t.start_date && t.start_date >= APP_TODAY)
    .sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1))[0];
}

export function getTripMembers(tripId: string): User[] {
  return db().tripMembers
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
