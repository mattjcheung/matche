import type { Booking } from "./types";

export const bookings: Booking[] = [
  { id: "bk_out", trip_id: "trip_japan", kind: "flight", title: "Flight MEL → HND", subtitle: "3 passengers", starts_on: "2027-03-29", ends_on: null, when_label: "29 Mar, 9:30pm", source: "Airline (email)", reference: "QX7H2P", paid_by: "matthew" },
  { id: "bk_shinjuku", trip_id: "trip_japan", kind: "stay", title: "Shinjuku hotel", subtitle: "2 rooms · 5 nights", starts_on: "2027-03-29", ends_on: "2027-04-03", when_label: "29 Mar – 3 Apr", source: "Hotel booking site", reference: "48213097", paid_by: "sophie" },
  { id: "bk_kyoto", trip_id: "trip_japan", kind: "stay", title: "Kyoto townhouse", subtitle: "Whole home · 5 nights", starts_on: "2027-04-04", ends_on: "2027-04-09", when_label: "4 – 9 Apr", source: "Home rental app", reference: "HM-55K2", paid_by: "jordan" },
  { id: "bk_jrpass", trip_id: "trip_japan", kind: "rail", title: "Japan Rail Pass", subtitle: "14 days × 3", starts_on: "2027-04-03", ends_on: null, when_label: "From 3 Apr", source: "Rail operator", reference: "JRP-0091", paid_by: "matthew" },
  { id: "bk_home", trip_id: "trip_japan", kind: "flight", title: "Flight KIX → MEL", subtitle: "3 passengers", starts_on: "2027-04-14", ends_on: null, when_label: "14 Apr, 10:05pm", source: "Airline (email)", reference: "QX7H2P", paid_by: "matthew" },
];
