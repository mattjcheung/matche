'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';
import { TravelMap } from '@/components/TravelMap';

export default function DashboardPage() {
  const { user } = useUser();
  const { data: stats, isLoading: statsLoading } = trpc.trip.getStats.useQuery();
  const { data: trips, isLoading: tripsLoading } = trpc.trip.getMyTrips.useQuery();

  // Derive countries visited from completed trips
  const countriesVisited = useMemo(() => {
    if (!trips) return [];
    const countries = new Set<string>();
    for (const trip of trips) {
      if (trip.status === 'COMPLETED') {
        for (const td of trip.destinations) {
          if (td.destination?.country) {
            countries.add(td.destination.country);
          }
        }
      }
    }
    return Array.from(countries);
  }, [trips]);

  if (statsLoading || tripsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-slate-600">Loading your travel data...</p>
          </div>
        </div>
      </div>
    );
  }

  const upcomingTrips =
    trips?.filter((t) => t.status === 'PLANNED' || t.status === 'ONGOING') ?? [];
  const pastTrips = trips?.filter((t) => t.status === 'COMPLETED') ?? [];

  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.firstName || 'Traveler'}!
          </h1>
          <p className="text-slate-600 mt-1">Your travel memory bank and planning hub</p>
        </div>

        {/* World map - your location + countries visited */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Your travel map</h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm overflow-hidden">
            <TravelMap countriesVisited={countriesVisited} userLocation={null} />
          </div>
          {countriesVisited.length > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ve visited {countriesVisited.length} countr
              {countriesVisited.length === 1 ? 'y' : 'ies'}
            </p>
          )}
        </section>

        {/* Travel planning section */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Travel planning</h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-blue-50">
                <p className="text-xs font-semibold text-blue-700 uppercase">Total Trips</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats?.total ?? 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50">
                <p className="text-xs font-semibold text-green-700 uppercase">Planned</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats?.planned ?? 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50">
                <p className="text-xs font-semibold text-purple-700 uppercase">Completed</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats?.completed ?? 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50">
                <p className="text-xs font-semibold text-amber-700 uppercase">Destinations</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">
                  {stats?.totalDestinations ?? 0}
                </p>
              </div>
            </div>

            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              + Plan a New Trip
            </Link>

            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 mb-3">Upcoming adventures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTrips.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
                    >
                      {trip.photos[0] ? (
                        <img
                          src={trip.photos[0].url}
                          alt={trip.title}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="w-full h-36 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-3xl">✈️</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-semibold text-slate-900">{trip.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(trip.startDate).toLocaleDateString()} –{' '}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                        {trip.destinations.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            📍 {trip.destinations.map((d) => d.destination.name).join(', ')}
                          </p>
                        )}
                        <span
                          className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                            trip.status === 'ONGOING'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Past Trips */}
            {pastTrips.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 mb-3">Travel memories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastTrips.slice(0, 6).map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="rounded-xl border border-slate-200 overflow-hidden opacity-90 hover:opacity-100 transition"
                    >
                      {trip.photos[0] ? (
                        <img
                          src={trip.photos[0].url}
                          alt={trip.title}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="w-full h-36 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                          <span className="text-white text-3xl">📸</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-semibold text-slate-900">{trip.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(trip.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {trip._count.photos} photos · {trip._count.posts} posts
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {trips?.length === 0 && (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🗺️</div>
                <h3 className="font-semibold text-slate-800 mb-1">Start your journey</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Create your first trip to begin tracking your adventures!
                </p>
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Plan your first trip
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Wishlist section */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Wishlist</h2>
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm p-6">
            <p className="text-slate-500 text-sm">
              Places and travel plans you&apos;ve saved from friends and creators. Coming soon!
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-sm">
                Saved places
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-sm">
                Saved itineraries
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
