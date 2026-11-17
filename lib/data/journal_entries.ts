import type { JournalEntry, JournalMedia, TripRecap } from "./types.ontrip";

export const journalEntries: JournalEntry[] = [
  { id: "je_sophie_nishiki", trip_id: "trip_japan", author_id: "sophie", entry_date: "2027-04-06", local_time: "12:40", place: "Nishiki Market", body: "Tamagoyaki on a stick. Jordan had three. No regrets.", visibility: "group", like_count: 4, reply_count: 2, created_at: "2027-04-06T03:40:00Z" },
  { id: "je_jordan_inari", trip_id: "trip_japan", author_id: "jordan", entry_date: "2027-04-06", local_time: "9:15", place: "Fushimi Inari", body: "Somewhere around gate 4,000 I stopped counting.", visibility: "group", like_count: 6, reply_count: 1, created_at: "2027-04-06T00:15:00Z" },
  // Earlier days – give the day strip its journal dots.
  { id: "je_matthew_0402", trip_id: "trip_japan", author_id: "matthew", entry_date: "2027-04-02", local_time: "20:10", place: "Shimokitazawa", body: "Vintage shops, then the best curry of my life.", visibility: "group", like_count: 3, reply_count: 0, created_at: "2027-04-02T11:10:00Z" },
  { id: "je_matthew_0403", trip_id: "trip_japan", author_id: "matthew", entry_date: "2027-04-03", local_time: "17:30", place: "Hakone", body: "Onsen with a view of absolutely nothing – full fog. Still perfect.", visibility: "group", like_count: 5, reply_count: 2, created_at: "2027-04-03T08:30:00Z" },
  { id: "je_sophie_0404", trip_id: "trip_japan", author_id: "sophie", entry_date: "2027-04-04", local_time: "15:00", place: "Kyoto", body: "Moved into the townhouse. It has a tiny garden and a cat that is not ours.", visibility: "group", like_count: 7, reply_count: 3, created_at: "2027-04-04T06:00:00Z" },
  { id: "je_matthew_0405", trip_id: "trip_japan", author_id: "matthew", entry_date: "2027-04-05", local_time: "11:20", place: "Arashiyama", body: "Took Hannah’s advice and got to the bamboo path at 7am.", visibility: "private", like_count: 0, reply_count: 0, created_at: "2027-04-05T02:20:00Z" },
];

export const journalMedia: JournalMedia[] = [
  { id: "jm_1", entry_id: "je_sophie_nishiki", kind: "photo", tone: "#6B4A2B" },
  { id: "jm_2", entry_id: "je_jordan_inari", kind: "photo", tone: "#5A3A47" },
];

export const tripRecaps: TripRecap[] = [
  { id: "rcp_japan", trip_id: "trip_japan", template: "basic", duration_label: "1:48", source_entry_count: 18, total_entry_count: 54, places_count: 6, cover_tone: "#2E4A45", submitted_to_featured: false },
];
