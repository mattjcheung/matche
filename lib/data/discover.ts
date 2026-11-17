import type { FeaturedRecap, FriendActivity, Story, TravellerOverlap } from "./types.home";

export const featuredRecaps: FeaturedRecap[] = [
  { id: "rc_priya_japan", author_id: "priya", title: "10 days of ramen and rail passes", country: "Japan", duration_label: "1:42", save_count: 2100, cover_tone: "#2E4A45", published_at: "2026-10-30T00:00:00Z" },
  { id: "rc_tom_morocco", author_id: "tom", title: "Atlas Mountains on foot", country: "Morocco", duration_label: "2:05", save_count: 860, cover_tone: "#6B4A2B", published_at: "2026-10-12T00:00:00Z" },
  { id: "rc_mei_ph", author_id: "mei", title: "Island-hopping on a budget", country: "Philippines", duration_label: "1:18", save_count: 1400, cover_tone: "#31455E", published_at: "2026-09-21T00:00:00Z" },
  { id: "rc_samjo_dolo", author_id: "samjo", title: "Winter in the Dolomites", country: "Italy", duration_label: "2:30", save_count: 990, cover_tone: "#5A3A47", published_at: "2026-02-14T00:00:00Z" },
];

export const stories: Story[] = [
  { id: "st_arashiyama", author_id: "hannah", place: "Kyoto, Japan", title: "Skip the 9am crowds: a slow day in Arashiyama", blurb: "Where to go before the tour buses arrive, the tofu lunch worth queuing for, and the bamboo path most people miss.", read_minutes: 6, rating: 4.8, cover_tone: "#3D5A52", published_at: "2026-10-02T00:00:00Z" },
  { id: "st_bruny", author_id: "ravi", place: "Hobart, Tasmania", title: "Salamanca to Bruny Island in one weekend", blurb: "A realistic two-day plan with ferry timings, the oyster stop, and what to book a week out.", read_minutes: 4, rating: 4.6, cover_tone: "#6E5432", published_at: "2026-09-15T00:00:00Z" },
  { id: "st_seoul", author_id: "jess", place: "Seoul, South Korea", title: "Night markets, honestly reviewed", blurb: "Six markets in five nights, ranked on food, crowds and value – including the one I wouldn’t go back to.", read_minutes: 8, rating: 4.4, cover_tone: "#394B6A", published_at: "2026-08-28T00:00:00Z" },
];

export const friendActivity: FriendActivity[] = [
  { id: "fa_sophie", user_id: "sophie", action: "is in Lisbon", meta: "Day 4 of 9 · 3 new entries", created_at: "2026-11-09T17:00:00Z" },
  { id: "fa_dan", user_id: "dan", action: "is planning Japan too", meta: "Overlaps with you in Osaka, 10–12 Apr", created_at: "2026-11-09T12:00:00Z" },
  { id: "fa_rosa", user_id: "rosa", action: "finished her Peru trip", meta: "Review posted · 42 photos", created_at: "2026-11-08T12:00:00Z" },
];

export const travellerOverlaps: TravellerOverlap[] = [
  { id: "ov_kyoto", trip_id: "trip_japan", place: "Kyoto", starts_on: "2027-04-03", ends_on: "2027-04-07", traveller_count: 14, group_name: "Kyoto, early April", pitch: "swap tips, share a cooking class or split a day-trip driver" },
];
