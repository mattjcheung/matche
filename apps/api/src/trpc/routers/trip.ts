import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { CreateTripSchema, UpdateTripSchema } from '@matche/shared';
import { TRPCError } from '@trpc/server';

export const tripRouter = router({
  // Get all trips for the current user
  getMyTrips: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.trip.findMany({
      where: { plannerId: ctx.userId },
      include: {
        destinations: {
          include: {
            destination: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        photos: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { photos: true, posts: true, comments: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }),

  // Get a single trip by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const trip = await ctx.prisma.trip.findUnique({
        where: { id: input.id },
        include: {
          planner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          destinations: {
            include: {
              destination: true,
            },
            orderBy: { orderIndex: 'asc' },
          },
          photos: {
            orderBy: { createdAt: 'desc' },
          },
          posts: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  avatarUrl: true,
                },
              },
              photos: true,
            },
            orderBy: { createdAt: 'desc' },
          },
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
          },
        },
      });

      if (!trip) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Trip not found' });
      }

      // Check visibility permissions
      if (trip.plannerId !== ctx.userId && trip.visibility === 'PRIVATE') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot access private trip' });
      }

      return trip;
    }),

  // Create a new trip
  create: protectedProcedure
    .input(CreateTripSchema)
    .mutation(async ({ ctx, input }) => {
      const { destinations, ...tripData } = input;

      const trip = await ctx.prisma.trip.create({
        data: {
          ...tripData,
          plannerId: ctx.userId,
          destinations: destinations
            ? {
                create: destinations.map((dest, index) => ({
                  orderIndex: index,
                  arrivalDate: dest.arrivalDate,
                  departureDate: dest.departureDate,
                  notes: dest.notes,
                  destination: {
                    connectOrCreate: {
                      where: {
                        name_country: {
                          name: dest.name,
                          country: dest.country,
                        },
                      },
                      create: {
                        name: dest.name,
                        city: dest.city,
                        country: dest.country,
                        latitude: dest.latitude,
                        longitude: dest.longitude,
                      },
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
          destinations: {
            include: {
              destination: true,
            },
          },
        },
      });

      return trip;
    }),

  // Update a trip
  update: protectedProcedure
    .input(UpdateTripSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, destinations, ...updateData } = input;

      // Verify ownership
      const existingTrip = await ctx.prisma.trip.findUnique({
        where: { id },
      });

      if (!existingTrip) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Trip not found' });
      }

      if (existingTrip.plannerId !== ctx.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update this trip' });
      }

      // Update trip
      const trip = await ctx.prisma.trip.update({
        where: { id },
        data: updateData,
        include: {
          destinations: {
            include: {
              destination: true,
            },
          },
        },
      });

      return trip;
    }),

  // Delete a trip
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const trip = await ctx.prisma.trip.findUnique({
        where: { id: input.id },
      });

      if (!trip) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Trip not found' });
      }

      if (trip.plannerId !== ctx.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this trip' });
      }

      await ctx.prisma.trip.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get trip stats for dashboard
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [planned, ongoing, completed, totalDestinations] = await Promise.all([
      ctx.prisma.trip.count({
        where: { plannerId: ctx.userId, status: 'PLANNED' },
      }),
      ctx.prisma.trip.count({
        where: { plannerId: ctx.userId, status: 'ONGOING' },
      }),
      ctx.prisma.trip.count({
        where: { plannerId: ctx.userId, status: 'COMPLETED' },
      }),
      ctx.prisma.tripDestination.count({
        where: { trip: { plannerId: ctx.userId } },
      }),
    ]);

    return {
      planned,
      ongoing,
      completed,
      total: planned + ongoing + completed,
      totalDestinations,
    };
  }),
});
