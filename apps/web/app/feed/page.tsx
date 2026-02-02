'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: posts, isLoading, refetch } = trpc.social.getFeed.useQuery({ limit: 20 });
  const createPost = trpc.social.createPost.useMutation();
  const createComment = trpc.social.createComment.useMutation();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const { data: searchResults, isLoading: searchLoading } = trpc.user.searchUsers.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );
  const { data: following } = trpc.social.getFollowing.useQuery({});

  const followingIds = useMemo(
    () => new Set(following?.map((f: { following: { id: string } }) => f.following.id) ?? []),
    [following]
  );

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      await createComment.mutateAsync({
        content,
        postId,
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      refetch();
    } catch (err) {
      console.error('Failed to create comment', err);
    }
  };

  const hasPosts = posts && posts.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search panel */}
        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search friends and creators..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search dropdown */}
            {isSearchOpen && searchQuery.length >= 2 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSearchOpen(false)}
                  aria-hidden
                />
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-slate-200 shadow-xl z-20 overflow-hidden max-h-80 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-6 text-center text-slate-500">Searching...</div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <ul className="py-2">
                      {searchResults.map((user) => (
                        <li key={user.id}>
                          <Link
                            href={`/profile/${user.username}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition"
                          >
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                                {user.username[0].toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.username}
                              </p>
                              <p className="text-sm text-slate-500">@{user.username}</p>
                            </div>
                            {followingIds.has(user.id) && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                                Following
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-slate-500">No users found</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Featured posts - empty for now */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Featured</h2>
          <div className="rounded-2xl bg-white/60 backdrop-blur border border-slate-200/60 p-8 text-center">
            <p className="text-slate-500 text-sm">Coming soon</p>
          </div>
        </section>

        {/* Friends' posts */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">From your circle</h2>

          {hasPosts ? (
            <div className="space-y-4">
              {posts!.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {post.author.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                          {post.author.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">
                          {post.author.firstName && post.author.lastName
                            ? `${post.author.firstName} ${post.author.lastName}`
                            : post.author.username}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleString()}
                          {post.trip && (
                            <>
                              {' · '}
                              <Link
                                href={`/trips/${post.trip.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                {post.trip.title}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-800 whitespace-pre-wrap mb-3">{post.content}</p>

                    {post.photos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {post.photos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.caption || ''}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500 pb-3 border-b border-slate-100">
                      <span>💬 {post._count.comments} comments</span>
                    </div>

                    {post.comments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            {comment.author.avatarUrl ? (
                              <img
                                src={comment.author.avatarUrl}
                                alt=""
                                className="w-7 h-7 rounded-full shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold shrink-0">
                                {comment.author.username[0].toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                              <p className="font-medium text-sm text-slate-800">
                                {comment.author.firstName || comment.author.username}
                              </p>
                              <p className="text-sm text-slate-600">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post.id);
                          }
                        }}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        disabled={createComment.isPending || !commentInputs[post.id]?.trim()}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* All caught up! empty state */
            <div className="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">All caught up!</h2>
              <p className="text-slate-600 mb-6">
                You&apos;ve seen all the latest from your friends. Check back later or discover new creators.
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
              >
                See older posts
              </button>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  href="/explore"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Explore creators →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
