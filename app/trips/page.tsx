import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getNextTrip, listMyTrips } from "@/lib/data/queries/trips";

export const metadata: Metadata = { title: "Trips" };

/** `/trips` opens the next upcoming trip (or the newest trip, or the wizard). */
export default function TripsIndexPage() {
  const trip = getNextTrip() ?? listMyTrips()[0];
  redirect(trip ? `/trips/${trip.slug}` : "/trips/new");
}
