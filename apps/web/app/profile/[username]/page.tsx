'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { use } from 'react';

export default function ProfileByUsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { data: user, isLoading } = trpc.user.getByUsername.useQuery({ username });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <Link href="/feed" className="text-blue-600 hover:underline">Back to feed</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </h1>
            <p className="text-slate-500">@{user.username}</p>
            {user.bio && <p className="text-slate-600 mt-2">{user.bio}</p>}
          </div>
        </div>
        <div className="flex gap-6 text-sm text-slate-600">
          <span>{user._count.trips} trips</span>
          <span>{user._count.followers} followers</span>
          <span>{user._count.following} following</span>
        </div>
        <div className="mt-6">
          <Link
            href="/feed"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to feed
          </Link>
        </div>
      </div>
    </div>
  );
}
