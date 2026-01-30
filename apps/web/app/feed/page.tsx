'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useState } from 'react';

export default function FeedPage() {
  const [postContent, setPostContent] = useState('');
  const { data: posts, isLoading, refetch } = trpc.social.getFeed.useQuery({ limit: 20 });
  const createPost = trpc.social.createPost.useMutation();
  const createComment = trpc.social.createComment.useMutation();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      await createPost.mutateAsync({
        content: postContent,
        visibility: 'PUBLIC',
      });
      setPostContent('');
      refetch();
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Activity Feed</h1>

      {/* Create Post */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your travel thoughts..."
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={createPost.isPending || !postContent.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {createPost.isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white border rounded-xl p-6 shadow-sm">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.username}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {post.author.username[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">
                    {post.author.firstName && post.author.lastName
                      ? `${post.author.firstName} ${post.author.lastName}`
                      : post.author.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                    {post.trip && (
                      <>
                        {' • '}
                        <Link href={`/trips/${post.trip.id}`} className="text-blue-600 hover:underline">
                          {post.trip.title}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Post Photos */}
              {post.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {post.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.caption || 'Post photo'}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-4 text-sm text-gray-600 pb-3 border-b">
                <button className="hover:text-blue-600">
                  💬 {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
                </button>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="mt-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      {comment.author.avatarUrl ? (
                        <img
                          src={comment.author.avatarUrl}
                          alt={comment.author.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                          {comment.author.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                        <p className="font-semibold text-sm">
                          {comment.author.firstName || comment.author.username}
                        </p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {post._count.comments > 3 && (
                    <p className="text-sm text-gray-500 ml-11">
                      + {post._count.comments - 3} more comments
                    </p>
                  )}
                </div>
              )}

              {/* Add Comment */}
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment(post.id);
                    }
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={() => handleComment(post.id)}
                  disabled={createComment.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-50"
                >
                  Comment
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-2">Your feed is empty</h2>
            <p className="text-gray-600 mb-6">
              Start following other travelers or create your first post!
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/explore"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Explore Travelers
              </Link>
              <Link
                href="/trips/new"
                className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Create a Trip
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
