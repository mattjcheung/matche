'use client';

import { trpc } from '@/lib/trpc';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const { data: user, isLoading } = trpc.user.getMe.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-8">
      {/* Profile Header */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-6">
          {clerkUser?.imageUrl ? (
            <img 
              src={clerkUser.imageUrl} 
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
            </h1>
            <p className="text-slate-600 mb-1">@{user.username}</p>
            <p className="text-slate-700 mb-4">{user.bio || 'No bio yet'}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-bold text-lg text-slate-900">{user._count.trips}</span>
                <span className="text-slate-600 ml-1">trips</span>
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900">{user._count.posts}</span>
                <span className="text-slate-600 ml-1">posts</span>
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900">{user._count.followers}</span>
                <span className="text-slate-600 ml-1">followers</span>
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900">{user._count.following}</span>
                <span className="text-slate-600 ml-1">following</span>
              </div>
            </div>
          </div>
          <div>
            <Link
              href="/profile/edit"
              className="bg-white border border-slate-200 px-4 py-2 rounded-lg font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 text-lg mb-4">Account Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-600">Email:</span>
              <p className="font-semibold text-slate-900">{user.email}</p>
            </div>
            <div>
              <span className="text-slate-600">Member since:</span>
              <p className="font-semibold text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-slate-600">Profile visibility:</span>
              <p className="font-semibold text-slate-900">{user.isPublic ? 'Public' : 'Private'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 text-lg mb-4">Travel Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Trips</span>
              <span className="font-bold text-blue-600">{user._count.trips}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Posts</span>
              <span className="font-bold text-purple-600">{user._count.posts}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 text-lg mb-4">Social</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Followers</span>
              <span className="font-bold text-green-600">{user._count.followers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Following</span>
              <span className="font-bold text-orange-600">{user._count.following}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/trips"
          className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-slate-100 transition"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-2">My Trips</h3>
          <p className="text-sm text-slate-600">View and manage all your trips</p>
        </Link>
        <Link 
          href="/trips/new"
          className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-slate-100 transition"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-2">Plan New Trip</h3>
          <p className="text-sm text-slate-600">Start planning your next adventure</p>
        </Link>
      </div>
      </div>
    </div>
  );
}
