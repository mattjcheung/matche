import type { TripGuide, TripStop, TripStopPlan } from "./types.trip";

export const tripStops: TripStop[] = [
  { id: "stop_tokyo", trip_id: "trip_japan", position: 1, place: "Tokyo", kind: "overnight", parent_stop_id: null, map_x: 262, map_y: 70, map_r: 9, label_x: 244, label_y: 50 },
  { id: "stop_hakone", trip_id: "trip_japan", position: 2, place: "Hakone", kind: "overnight", parent_stop_id: null, map_x: 205, map_y: 110, map_r: 7, label_x: 196, label_y: 134 },
  { id: "stop_kyoto", trip_id: "trip_japan", position: 3, place: "Kyoto", kind: "overnight", parent_stop_id: null, map_x: 120, map_y: 150, map_r: 9, label_x: 104, label_y: 135 },
  { id: "stop_nara", trip_id: "trip_japan", position: 4, place: "Nara", kind: "day_trip", parent_stop_id: "stop_kyoto", map_x: 150, map_y: 200, map_r: 5, label_x: 160, label_y: 205 },
  { id: "stop_osaka", trip_id: "trip_japan", position: 5, place: "Osaka", kind: "overnight", parent_stop_id: null, map_x: 95, map_y: 160, map_r: 8, label_x: 58, label_y: 184 },
  { id: "stop_hiroshima", trip_id: "trip_japan", position: 6, place: "Hiroshima", kind: "day_trip", parent_stop_id: "stop_osaka", map_x: 20, map_y: 215, map_r: 5, label_x: 8, label_y: 240 },
];

export const tripStopPlans: TripStopPlan[] = [
  { id: "sp_tokyo_d", stop_id: "stop_tokyo", mode: "dated", start_date: "2027-03-29", end_date: "2027-04-03", nights_label: null, status: "booked", detail: "Shinjuku hotel · teamLab, Tsukiji breakfast, Shimokitazawa" },
  { id: "sp_hakone_d", stop_id: "stop_hakone", mode: "dated", start_date: "2027-04-03", end_date: "2027-04-04", nights_label: null, status: "hoping", detail: "Ryokan with private onsen – 2 options shortlisted" },
  { id: "sp_kyoto_d", stop_id: "stop_kyoto", mode: "dated", start_date: "2027-04-04", end_date: "2027-04-09", nights_label: null, status: "booked", detail: "Townhouse rental · day trip to Nara on 7 Apr" },
  { id: "sp_osaka_d", stop_id: "stop_osaka", mode: "dated", start_date: "2027-04-09", end_date: "2027-04-14", nights_label: null, status: "to_book", detail: "Day trip to Hiroshima & Miyajima on 11 Apr" },
  { id: "sp_tokyo_f", stop_id: "stop_tokyo", mode: "flexible", start_date: null, end_date: null, nights_label: "4–5 nights", status: "booked", detail: "Start here – cheapest flights land at Haneda" },
  { id: "sp_hakone_f", stop_id: "stop_hakone", mode: "flexible", start_date: null, end_date: null, nights_label: "1 night", status: "idea", detail: "Onsen stop on the way west" },
  { id: "sp_kyoto_f", stop_id: "stop_kyoto", mode: "flexible", start_date: null, end_date: null, nights_label: "4–5 nights", status: "idea", detail: "Base for Nara day trip" },
  { id: "sp_osaka_f", stop_id: "stop_osaka", mode: "flexible", start_date: null, end_date: null, nights_label: "3–5 nights", status: "idea", detail: "Fly home from Kansai" },
];

export const tripGuides: TripGuide[] = [
  {
    trip_id: "trip_japan",
    route_title: "Route built from your wishlist",
    route_body:
      "7 of 9 saved places fit this trip. Reordering Hakone before Kyoto saves a backtrack on the shinkansen. Nara and Hiroshima work best as day trips.",
    packing_context: "Spring · cities + onsen · lots of trains",
  },
];
