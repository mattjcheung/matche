import type { Experience, TripExperienceSuggestion } from "./types.trip";

export const experiences: Experience[] = [
  { id: "exp_fushimi", name: "Early-morning Fushimi Inari hike", place: "Kyoto", country: "Japan", rating: 4.9, price_level: 0, media_tone: "#3D5A52" },
  { id: "exp_izakaya", name: "Izakaya hopping tour", place: "Tokyo", country: "Japan", rating: 4.8, price_level: 2, media_tone: "#6E5432" },
  { id: "exp_okonomiyaki", name: "Okonomiyaki cooking class", place: "Osaka", country: "Japan", rating: 4.7, price_level: 2, media_tone: "#394B6A" },
  { id: "exp_ashi", name: "Lake Ashi boat & ropeway", place: "Hakone", country: "Japan", rating: 4.6, price_level: 1, media_tone: "#5A3A47" },
];

export const tripExperienceSuggestions: TripExperienceSuggestion[] = [
  { id: "tes_1", trip_id: "trip_japan", experience_id: "exp_fushimi", position: 1, signal: "friend_loved", signal_user_id: "priya", signal_count: null },
  { id: "tes_2", trip_id: "trip_japan", experience_id: "exp_izakaya", position: 2, signal: "booked_count", signal_user_id: null, signal_count: 312 },
  { id: "tes_3", trip_id: "trip_japan", experience_id: "exp_okonomiyaki", position: 3, signal: "friend_saved", signal_user_id: "dan", signal_count: null },
  { id: "tes_4", trip_id: "trip_japan", experience_id: "exp_ashi", position: 4, signal: "wishlist", signal_user_id: null, signal_count: null },
];
