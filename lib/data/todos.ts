import type { Todo } from "./types.ontrip";

export const todos: Todo[] = [
  { id: "td_hakone", trip_id: "trip_japan", title: "Book Hakone ryokan", note: "Cherry blossom weekends sell out", due_on: "2026-12-01", source: "manual", done: false },
  { id: "td_passport", trip_id: "trip_japan", title: "Renew passport", note: "Auto-added · expires Aug 2027", due_on: "2027-01-15", source: "auto", done: false },
  { id: "td_osaka", trip_id: "trip_japan", title: "Book Osaka stay", note: "Shortlist shared with group", due_on: "2027-03-01", source: "manual", done: false },
  { id: "td_insurance", trip_id: "trip_japan", title: "Buy travel insurance", note: "Covers all 3 travellers", due_on: "2027-03-15", source: "manual", done: false },
  { id: "td_vjw", trip_id: "trip_japan", title: "Complete Visit Japan Web", note: "Auto-added · one week before you fly", due_on: "2027-03-22", source: "auto", done: false },
  { id: "td_esim", trip_id: "trip_japan", title: "Order eSIM", note: "Arrives in 2–3 days", due_on: "2027-03-26", source: "manual", done: false },
];
