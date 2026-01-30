'use client';

import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  
  const { data: trip, isLoading } = trpc.trip.getById.useQuery({ id: tripId });
  const deleteTrip = trpc.trip.delete.useMutation();
  const updateTrip = trpc.trip.update.useMutation();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTrip.mutateAsync({ id: tripId });
      router.push('/trips');
    } catch (err) {
      console.error('Failed to delete trip', err);
    }
  };

  const handleStatusChange = async (status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await updateTrip.mutateAsync({ id: tripId, status });
      window.location.reload();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Trip not found</h1>
          <Link href="/trips" className="text-blue-600 hover:underline">
            Back to trips
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                📅 {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </span>
              <span>•</span>
              <span>{duration} days</span>
              <span>•</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                trip.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                trip.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                trip.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {trip.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={trip.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="px-4 py-2 border rounded-lg text-sm font-semibold"
            >
              <option value="PLANNED">Planned</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        {trip.description && (
          <p className="text-gray-700 text-lg">{trip.description}</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h2 className="text-xl font-bold mb-2">Delete Trip?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone. All photos, posts, and comments will be deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Destinations */}
          {trip.destinations.length > 0 && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Destinations</h2>
              <div className="space-y-3">
                {trip.destinations.map((tripDest, index) => (
                  <div key={tripDest.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{tripDest.destination.name}</h3>
                      {tripDest.destination.city && (
                        <p className="text-gray-600">{tripDest.destination.city}, {tripDest.destination.country}</p>
                      )}
                      {!tripDest.destination.city && (
                        <p className="text-gray-600">{tripDest.destination.country}</p>
                      )}
                      {tripDest.notes && (
                        <p className="text-sm text-gray-500 mt-2">{tripDest.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Simple Map Placeholder */}
              <div className="mt-6 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8 text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-600 font-semibold">Map View Coming Soon</p>
                <p className="text-sm text-gray-500 mt-1">
                  {trip.destinations.map(d => d.destination.name).join(' → ')}
                </p>
              </div>
            </div>
          )}

          {/* Photos */}
          {trip.photos.length > 0 && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Photos ({trip.photos.length})</h2>
              <div className="grid grid-cols-3 gap-4">
                {trip.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.caption || 'Trip photo'}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {trip.posts.length > 0 && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Posts</h2>
              <div className="space-y-4">
                {trip.posts.map((post) => (
                  <div key={post.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      {post.author.avatarUrl ? (
                        <img 
                          src={post.author.avatarUrl} 
                          alt={post.author.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {post.author.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{post.author.firstName || post.author.username}</p>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                    {post.photos.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {post.photos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt="Post"
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {trip.photos.length === 0 && trip.posts.length === 0 && (
            <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">Start Adding Memories</h3>
              <p className="text-gray-600">Upload photos and create posts to document your journey!</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trip Info Card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Trip Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Created by:</span>
                <p className="font-semibold">{trip.planner.firstName || trip.planner.username}</p>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <p className="font-semibold">{trip.isGroupTrip ? 'Group Trip' : 'Solo Trip'}</p>
              </div>
              <div>
                <span className="text-gray-600">Visibility:</span>
                <p className="font-semibold">{trip.visibility}</p>
              </div>
              <div>
                <span className="text-gray-600">Destinations:</span>
                <p className="font-semibold">{trip.destinations.length}</p>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Comments ({trip.comments.length})</h3>
            {trip.comments.length > 0 ? (
              <div className="space-y-3">
                {trip.comments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      {comment.author.avatarUrl ? (
                        <img 
                          src={comment.author.avatarUrl} 
                          alt={comment.author.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                      <span className="font-semibold">{comment.author.firstName || comment.author.username}</span>
                    </div>
                    <p className="text-gray-700 ml-8">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{trip.photos.length}</p>
                <p className="text-sm text-gray-600">Photos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{trip.posts.length}</p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{trip.comments.length}</p>
                <p className="text-sm text-gray-600">Comments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{duration}</p>
                <p className="text-sm text-gray-600">Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
