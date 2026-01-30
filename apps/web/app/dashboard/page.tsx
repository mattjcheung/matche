'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();
  const { data: stats, isLoading: statsLoading } = trpc.trip.getStats.useQuery();
  const { data: trips, isLoading: tripsLoading } = trpc.trip.getMyTrips.useQuery();

  if (statsLoading || tripsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your travel data...</p>
        </div>
      </div>
    );
  }

  const upcomingTrips = trips?.filter(t => t.status === 'PLANNED' || t.status === 'ONGOING') || [];
  const pastTrips = trips?.filter(t => t.status === 'COMPLETED') || [];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome back, {user?.firstName || 'Traveler'}!</h1>
        <p className="text-gray-600 mt-2 text-lg">Here is your travel memory bank.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-6 border rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <h2 className="font-semibold text-blue-800 text-sm uppercase">Total Trips</h2>
          <p className="text-4xl font-bold text-blue-900 mt-2">{stats?.total || 0}</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <h2 className="font-semibold text-green-800 text-sm uppercase">Planned</h2>
          <p className="text-4xl font-bold text-green-900 mt-2">{stats?.planned || 0}</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <h2 className="font-semibold text-purple-800 text-sm uppercase">Completed</h2>
          <p className="text-4xl font-bold text-purple-900 mt-2">{stats?.completed || 0}</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <h2 className="font-semibold text-orange-800 text-sm uppercase">Destinations</h2>
          <p className="text-4xl font-bold text-orange-900 mt-2">{stats?.totalDestinations || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link 
          href="/trips/new"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Plan a New Trip
        </Link>
      </div>

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Upcoming Adventures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map((trip) => (
              <Link 
                key={trip.id} 
                href={`/trips/${trip.id}`}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {trip.photos[0] ? (
                  <img 
                    src={trip.photos[0].url} 
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl">✈️</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{trip.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  {trip.destinations.length > 0 && (
                    <p className="text-sm text-gray-500">
                      📍 {trip.destinations.map(d => d.destination.name).join(', ')}
                    </p>
                  )}
                  <div className="mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trip.status === 'ONGOING' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Trips */}
      {pastTrips.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Travel Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTrips.slice(0, 6).map((trip) => (
              <Link 
                key={trip.id} 
                href={`/trips/${trip.id}`}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition opacity-90 hover:opacity-100"
              >
                {trip.photos[0] ? (
                  <img 
                    src={trip.photos[0].url} 
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-white text-4xl">📸</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{trip.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(trip.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {trip._count.photos} photos • {trip._count.posts} posts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {trips?.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">Start Your Journey</h2>
          <p className="text-gray-600 mb-6">Create your first trip to begin tracking your adventures!</p>
          <Link 
            href="/trips/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Plan Your First Trip
          </Link>
        </div>
      )}
    </div>
  );
}