import type { CompanionSuggestion, TripIdea } from "./types.trip";

export const tripIdeas: TripIdea[] = [
  { id: "idea_vietnam", user_id: "alex", destination_id: "dest_vietnam", position: 1, reason: "Kofi’s going in January" },
  { id: "idea_portugal", user_id: "alex", destination_id: "dest_portugal", position: 2, reason: "Sophie’s favourite country" },
  { id: "idea_iceland", user_id: "alex", destination_id: "dest_iceland", position: 3, reason: "Saved from 2 recaps" },
  { id: "idea_peru", user_id: "alex", destination_id: "dest_peru", position: 4, reason: "Rosa’s review: 4.9 / 5" },
  { id: "idea_morocco", user_id: "alex", destination_id: "dest_morocco", position: 5, reason: "Trending with friends" },
  { id: "idea_tasmania", user_id: "alex", destination_id: "dest_tasmania", position: 6, reason: "Close to home · long weekend" },
];

export const companionSuggestions: CompanionSuggestion[] = [
  { user_id: "alex", friend_id: "sophie", position: 1 },
  { user_id: "alex", friend_id: "jordan", position: 2 },
  { user_id: "alex", friend_id: "dan", position: 3 },
  { user_id: "alex", friend_id: "priya", position: 4 },
  { user_id: "alex", friend_id: "rosa", position: 5 },
];

/** Lookup lists for the wizard (would be enums / small tables in Postgres). */
export const TRIP_STYLES = ["Food", "Hiking", "Culture", "Beaches", "Nightlife", "Slow travel", "Volunteering"] as const;
export const TRIP_LENGTHS = ["Long weekend", "1 week", "2 weeks", "3+ weeks"] as const;
export const TRIP_BUDGETS = ["Budget", "Mid-range", "Comfort"] as const;
