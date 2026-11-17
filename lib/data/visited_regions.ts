import type { UserTravelSummary, VisitedRegion } from "./types.social";

/**
 * `visited_regions` – countries / regions people have been to. Completed trips
 * on Matche count as well; the queries merge those in.
 */
const v = (user_id: string, region: string, visit_count = 1): VisitedRegion => ({
  user_id,
  region,
  visit_count,
  first_visited_on: null,
});

export const visitedRegions: VisitedRegion[] = [
  // Matthew
  v("matthew", "New Zealand", 2), v("matthew", "Vietnam"), v("matthew", "Bali"), v("matthew", "Singapore"),
  v("matthew", "Fiji"), v("matthew", "South Korea"), v("matthew", "Sri Lanka"),
  // Sophie
  v("sophie", "Vietnam"), v("sophie", "New Zealand"), v("sophie", "Singapore"), v("sophie", "Bali"),
  v("sophie", "Fiji"), v("sophie", "Portugal", 2), v("sophie", "Spain"), v("sophie", "Tasmania"),
  v("sophie", "France"), v("sophie", "Italy"), v("sophie", "Greece"),
  // Others
  v("priya", "Japan", 3), v("priya", "India", 4), v("priya", "Singapore"),
  v("hannah", "New Zealand"), v("hannah", "Vietnam"),
  v("samjo", "Canada"), v("samjo", "Japan"),
  v("ravi", "Mexico"), v("ravi", "Portugal"),
];

/** `user_travel_summaries` – headline numbers on a friend's profile. */
export const travelSummaries: UserTravelSummary[] = [
  { user_id: "sophie", countries_visited: 23, favourite_country: "Portugal", trips_logged: 31, computed_at: "2026-11-09T00:00:00Z" },
  { user_id: "priya", countries_visited: 17, favourite_country: "Japan", trips_logged: 22, computed_at: "2026-11-09T00:00:00Z" },
];
