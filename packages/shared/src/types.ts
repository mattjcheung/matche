import { z } from "zod";

// Trip validation schemas
export const CreateTripSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isGroupTrip: z.boolean().optional(),
  visibility: z.enum(["PUBLIC", "FRIENDS_ONLY", "PRIVATE"]).default("PUBLIC"),
  destinations: z.array(z.object({
    name: z.string().min(1),
    city: z.string().optional(),
    country: z.string().min(1),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    arrivalDate: z.coerce.date().optional(),
    departureDate: z.coerce.date().optional(),
    notes: z.string().optional(),
  })).optional(),
});

export const UpdateTripSchema = CreateTripSchema.partial().extend({
  id: z.string(),
  status: z.enum(["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
});

// User profile schemas
export const UpdateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(500).optional(),
  username: z.string().min(3).optional(),
  isPublic: z.boolean().optional(),
});

// Post schemas
export const CreatePostSchema = z.object({
  content: z.string().min(1).max(5000),
  tripId: z.string().optional(),
  visibility: z.enum(["PUBLIC", "FRIENDS_ONLY", "PRIVATE"]).default("PUBLIC"),
});

// Comment schemas
export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string().optional(),
  tripId: z.string().optional(),
});

// Type exports
export type CreateTripInput = z.infer<typeof CreateTripSchema>;
export type UpdateTripInput = z.infer<typeof UpdateTripSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;