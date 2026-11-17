import type { UserProfile, UserTravelStats } from "./types.profile";

export const userProfiles: UserProfile[] = [
  {
    user_id: "matthew",
    handle: "matthewcheung",
    hero_tone: "#E0662F",
    about:
      "Weekday spreadsheets, weekend train timetables. I plan trips around what I’m going to eat, then work backwards. Always up for a dawn hike if there’s a good breakfast at the bottom.",
    style_tags: ["Food-led", "Early riser", "Trains over planes", "Carry-on only"],
    facts: [
      { label: "Favourite spot", value: "Hoi An, Vietnam" },
      { label: "Dream trip", value: "Patagonia on foot" },
      { label: "Best meal abroad", value: "Street cao lầu" },
      { label: "Languages", value: "English, some Korean" },
    ],
    ask_me_about: ["Vietnam by train", "NZ campervans", "cheap eats in Seoul"],
    bucket_list: ["Patagonia", "Iceland in winter", "Lisbon & Porto", "Trans-Siberian rail", "Oaxaca"],
    giving_back: "2 volunteering days logged: a beach clean-up in Bali and a turtle hatchery shift in Sri Lanka.",
    notes_public: true,
    created_at: "2024-03-12T09:00:00Z",
  },
];

/** Aggregates a nightly job would compute from trips, bookings and journal entries. */
export const userTravelStats: UserTravelStats[] = [
  {
    user_id: "matthew",
    countries_visited: 12,
    continents_visited: 4,
    distance_km: 186_400,
    distance_note: "by plane, train, bus and one very slow ferry",
    personality: "The Grazer",
    personality_note: "38% of your journal entries are about food. Dumplings alone appear 21 times.",
    fun_facts: [
      { label: "Earliest alarm", value: "3:45am, sunrise trek, Sri Lanka" },
      { label: "Most-loved entry", value: "“The ferry that broke down twice” – 48 hearts" },
      { label: "Most-visited", value: "New Zealand, 3 trips" },
      { label: "Friends helped", value: "24 “Ask a friend” answers" },
    ],
    computed_at: "2026-11-09T00:00:00Z",
  },
];
