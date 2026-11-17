import type { FriendJournalEntry } from "./types.social";

/** `friend_journal_entries` – friends' journal entries, newest first. */
export const friendJournalEntries: FriendJournalEntry[] = [
  {
    id: "fje_sophie_d4", author_id: "sophie", trip_id: "trip_sophie_lisbon", day_number: 4, place: "Alfama",
    body: "Tiles, tarts and far too many hills. Worth every step.",
    media_kind: "photo", media_tone: "#5A3A47", media_duration: null,
    like_count: 12, reply_count: 3, visibility: "public", created_at: "2026-11-09T17:00:00Z",
  },
  {
    id: "fje_sophie_d3", author_id: "sophie", trip_id: "trip_sophie_lisbon", day_number: 3, place: "Belém",
    body: "Queued 25 minutes for custard tarts. Would queue again.",
    media_kind: "video", media_tone: "#31455E", media_duration: "0:20",
    like_count: 18, reply_count: 5, visibility: "public", created_at: "2026-11-08T17:00:00Z",
  },
  {
    id: "fje_sophie_d2", author_id: "sophie", trip_id: "trip_sophie_lisbon", day_number: 2, place: "Sintra",
    body: "Go early, take the bus up and walk down through the forest.",
    media_kind: "photo", media_tone: "#6B4A2B", media_duration: null,
    like_count: 9, reply_count: 1, visibility: "public", created_at: "2026-11-07T17:00:00Z",
  },
  {
    id: "fje_sophie_d1", author_id: "sophie", trip_id: "trip_sophie_lisbon", day_number: 1, place: "Baixa",
    body: "Landed, napped, found the best bifana in the city (according to the guy selling it).",
    media_kind: "photo", media_tone: "#3D5A52", media_duration: null,
    like_count: 7, reply_count: 0, visibility: "friends", created_at: "2026-11-06T17:00:00Z",
  },
  {
    id: "fje_priya_d2", author_id: "priya", trip_id: "trip_priya_seoul", day_number: 2, place: "Gwangjang Market",
    body: "Mung bean pancakes straight off the griddle. Coming back tomorrow.",
    media_kind: "photo", media_tone: "#394B6A", media_duration: null,
    like_count: 18, reply_count: 2, visibility: "public", created_at: "2026-11-09T09:00:00Z",
  },
  {
    id: "fje_priya_d1", author_id: "priya", trip_id: "trip_priya_seoul", day_number: 1, place: "Bukchon",
    body: "Hanok alleys at dusk, then far too much fried chicken.",
    media_kind: "video", media_tone: "#2E4A45", media_duration: "0:15",
    like_count: 11, reply_count: 1, visibility: "public", created_at: "2026-11-08T12:00:00Z",
  },
];
