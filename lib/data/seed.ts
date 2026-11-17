/**
 * Demo rows used to seed Supabase. Not imported by the app at runtime – only by
 * `scripts/generate-supabase.ts`. The demo owner is the user with id
 * `matthew`; the first person to sign in takes over that account.
 */
import { bookings } from "./bookings";
import { destinationCosts, destinationNotes, destinations, destinationStats, userDestinationLinks } from "./destinations";
import { featuredRecaps, friendActivity, stories, travellerOverlaps } from "./discover";
import { expenseSplits, expenses } from "./expenses";
import { experiences, tripExperienceSuggestions } from "./experiences";
import { friendHighlights, tripPrompts } from "./friend_highlights";
import { friendTripMembers, friendTrips, tripLocations } from "./friend_trips";
import { friendships } from "./friendships";
import { itineraryEvents } from "./itinerary_events";
import { journalEntries, journalMedia, tripRecaps } from "./journal_entries";
import { friendJournalEntries } from "./journal_entries_friends";
import { pastTripMembers, pastTrips } from "./past_trips";
import { postComments, posts } from "./posts";
import { profileNotes } from "./profile_notes";
import type { TableKey } from "./tables";
import { todos } from "./todos";
import { travelGroups } from "./travel_groups";
import { packingItems, travelDocuments, tripChecklistItems, tripOverlaps } from "./trip_essentials";
import { companionSuggestions, tripIdeas } from "./trip_ideas";
import { tripReviews } from "./trip_reviews";
import { tripGuides, tripStopPlans, tripStops } from "./trip_stops";
import { tripMembers, trips } from "./trips";
import { userBadges } from "./user_badges";
import { userProfiles, userTravelStats } from "./user_profiles";
import { userYearNights } from "./user_year_nights";
import { users } from "./users";
import { travelSummaries, visitedRegions } from "./visited_regions";
import { volunteerOpportunities, volunteerTripMatches } from "./volunteering";

export const DEMO_OWNER_ID = "matthew";

export const seed = {
  users,
  friendships,
  trips: [...trips, ...friendTrips, ...pastTrips],
  tripMembers: [...tripMembers, ...friendTripMembers, ...pastTripMembers],
  tripLocations,
  bookings,
  expenses,
  expenseSplits,
  posts,
  postComments,
  featuredRecaps,
  stories,
  friendActivity,
  travellerOverlaps,
  todos,
  journalEntries,
  journalMedia,
  tripRecaps,
  itineraryEvents,
  tripStops,
  tripStopPlans,
  tripGuides,
  experiences,
  tripExperienceSuggestions,
  destinations,
  destinationNotes,
  destinationStats,
  destinationCosts,
  userDestinationLinks,
  travelDocuments,
  tripChecklistItems,
  tripOverlaps,
  packingItems,
  tripIdeas,
  companionSuggestions,
  friendHighlights,
  tripPrompts,
  friendJournalEntries,
  travelGroups,
  visitedRegions,
  travelSummaries,
  volunteerOpportunities,
  volunteerTripMatches,
  tripReviews,
  userBadges,
  userProfiles,
  userTravelStats,
  userYearNights,
  profileNotes,
} satisfies Record<TableKey, readonly object[]>;

export type Seed = typeof seed;
