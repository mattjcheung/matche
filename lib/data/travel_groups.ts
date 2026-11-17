import type { TravelGroup } from "./types.social";

/** `travel_groups` – meetups for travellers in the same place at the same time. */
export const travelGroups: TravelGroup[] = [
  { id: "tg_kyoto_april", name: "Kyoto · early April", place: "Kyoto", starts_on: "2027-04-03", ends_on: "2027-04-07", member_count: 14, created_at: "2026-10-12T00:00:00Z" },
  { id: "tg_osaka_food", name: "Osaka food crawl", place: "Osaka", starts_on: "2027-04-10", ends_on: "2027-04-10", member_count: 6, created_at: "2026-10-20T00:00:00Z" },
  { id: "tg_hakone_onsen", name: "Hakone onsen day", place: "Hakone", starts_on: "2027-04-03", ends_on: "2027-04-03", member_count: 4, created_at: "2026-10-28T00:00:00Z" },
  { id: "tg_tokyo_may", name: "Tokyo · Golden Week", place: "Tokyo", starts_on: "2027-04-29", ends_on: "2027-05-05", member_count: 21, created_at: "2026-10-30T00:00:00Z" },
  { id: "tg_lisbon_nov", name: "Lisbon sunset walks", place: "Lisbon", starts_on: "2026-11-07", ends_on: "2026-11-14", member_count: 9, created_at: "2026-10-15T00:00:00Z" },
];
