import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { CreateCommentSchema, CreatePostSchema } from '@matche/shared';

export const socialRouter = router({
  // Follow a user
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.follow.create({
        data: {
          followerId: ctx.userId,
          followingId: input.userId,
        },
      });
    }),

  // Unfollow a user
  unfollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.follow.deleteMany({
        where: {
          followerId: ctx.userId,
          followingId: input.userId,
        },
      });
    }),

  // Get followers
  getFollowers: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.userId;
      
      return await ctx.prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });
    }),

  // Get following
  getFollowing: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.userId;
      
      return await ctx.prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });
    }),

  // Create a post
  createPost: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          content: input.content,
          visibility: input.visibility,
          authorId: ctx.userId,
          tripId: input.tripId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              avatarUrl: true,
            },
          },
        },
      });
    }),

  // Create a comment
  createComment: protectedProcedure
    .input(CreateCommentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.create({
        data: {
          content: input.content,
          authorId: ctx.userId,
          postId: input.postId,
          tripId: input.tripId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              avatarUrl: true,
            },
          },
        },
      });
    }),

  // Get activity feed
  getFeed: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      // Get IDs of users the current user is following
      const following = await ctx.prisma.follow.findMany({
        where: { followerId: ctx.userId },
        select: { followingId: true },
      });

      const followingIds = following.map(f => f.followingId);

      // Get posts from followed users + own posts
      return await ctx.prisma.post.findMany({
        where: {
          OR: [
            { authorId: { in: [...followingIds, ctx.userId] } },
            { visibility: 'PUBLIC' },
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          trip: {
            select: {
              id: true,
              title: true,
            },
          },
          photos: true,
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
      });
    }),
});
