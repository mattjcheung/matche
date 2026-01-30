'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useState } from 'react';

export default function TripsPage() {
  const [filter, setFilter] = useState<'all' | 'planned' | 'ongoing' | 'completed'>('all');
  const { data: trips, isLoading } = trpc.trip.getMyTrips.useQuery();

  const filteredTrips = trips?.filter(trip => {
    if (filter === 'all') return true;
    return trip.status.toLowerCase() === filter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Trips</h1>
        <Link 
          href="/trips/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + New Trip
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-4 font-semibold ${
            filter === 'all' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({trips?.length || 0})
        </button>
        <button
          onClick={() => setFilter('planned')}
          className={`pb-2 px-4 font-semibold ${
            filter === 'planned' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Planned ({trips?.filter(t => t.status === 'PLANNED').length || 0})
        </button>
        <button
          onClick={() => setFilter('ongoing')}
          className={`pb-2 px-4 font-semibold ${
            filter === 'ongoing' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Ongoing ({trips?.filter(t => t.status === 'ONGOING').length || 0})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`pb-2 px-4 font-semibold ${
            filter === 'completed' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({trips?.filter(t => t.status === 'COMPLETED').length || 0})
        </button>
      </div>

      {/* Trips Grid */}
      {filteredTrips && filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Link 
              key={trip.id} 
              href={`/trips/${trip.id}`}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              {trip.photos[0] ? (
                <img 
                  src={trip.photos[0].url} 
                  alt={trip.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-4xl">✈️</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{trip.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    trip.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                    trip.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                {trip.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{trip.description}</p>
                )}
                <p className="text-sm text-gray-600 mb-2">
                  📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </p>
                {trip.destinations.length > 0 && (
                  <p className="text-sm text-gray-500 mb-2">
                    📍 {trip.destinations.map(d => d.destination.name).join(', ')}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-gray-500 mt-3">
                  <span>{trip._count.photos} photos</span>
                  <span>{trip._count.posts} posts</span>
                  <span>{trip._count.comments} comments</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">No trips yet</h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "Create your first trip to start tracking your adventures!"
              : `You don't have any ${filter} trips.`}
          </p>
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
