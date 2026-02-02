import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { UpdateProfileSchema } from '@matche/shared';

export const userRouter = router({
  // Get current user profile
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      include: {
        _count: {
          select: {
            trips: true,
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });
  }),

  // Get user by username
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        include: {
          trips: {
            where: ctx.userId
              ? {
                  OR: [
                    { visibility: 'PUBLIC' },
                    { plannerId: ctx.userId },
                  ],
                }
              : { visibility: 'PUBLIC' },
            include: {
              destinations: {
                include: { destination: true },
              },
              photos: { take: 1 },
            },
            orderBy: { startDate: 'desc' },
          },
          _count: {
            select: {
              trips: true,
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!user) {
        return null;
      }

      // Hide private info if not the owner
      if (ctx.userId !== user.id) {
        return {
          ...user,
          email: undefined,
        };
      }

      return user;
    }),

  // Search users (for feed search - friends and creators)
  searchUsers: protectedProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          id: { not: ctx.userId },
          OR: [
            { username: { contains: input.query, mode: 'insensitive' } },
            { firstName: { contains: input.query, mode: 'insensitive' } },
            { lastName: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          _count: {
            select: { trips: true, followers: true },
          },
        },
        take: 20,
      });
    }),

  // Update profile
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: input,
      });
    }),
});
