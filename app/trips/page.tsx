import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getNextTrip, listMyTrips } from "@/lib/data/queries/trips";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export const metadata: Metadata = { title: "Trips" };

/** `/trips` opens the next upcoming trip (or the newest trip, or the wizard). */
export default async function TripsIndexPage() {
  await loadDb(needsFor("trips"));
  const trip = getNextTrip() ?? listMyTrips()[0];
  redirect(trip ? `/trips/${trip.slug}` : "/trips/new");
}
