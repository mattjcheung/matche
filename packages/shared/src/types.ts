import { z } from "zod";

// Shared validation schema for creating a trip
// This is used by the Frontend form AND the Backend API validation
export const CreateTripSchema = z.object({
  title: z.string().min(3),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isGroupTrip: z.boolean().optional()
});

export type CreateTripInput = z.infer<typeof CreateTripSchema>;