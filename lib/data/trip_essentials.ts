import type { PackingItem, TravelDocument, TripChecklistItem, TripOverlap } from "./types.trip";

export const travelDocuments: TravelDocument[] = [
  { id: "doc_alex_passport", user_id: "alex", kind: "passport", issuing_country: "Australia", expires_on: "2027-08-21" },
];

export const tripChecklistItems: TripChecklistItem[] = [
  { id: "tci_jp_visa", trip_id: "trip_japan", user_id: "alex", category: "documents", position: 1, status: "done", title: "No visa needed", body: "for tourist stays up to 90 days on an Australian passport." },
  { id: "tci_jp_passport", trip_id: "trip_japan", user_id: "alex", category: "documents", position: 2, status: "warning", title: "Renew your passport.", body: "It expires Aug 2027 – inside many airlines’ and countries’ 6-month rule. Apply by 15 Jan 2027." },
  { id: "tci_jp_vjw", trip_id: "trip_japan", user_id: "alex", category: "documents", position: 3, status: "todo", title: null, body: "Fill in Visit Japan Web for faster arrival – a week before you fly." },
];

export const tripOverlaps: TripOverlap[] = [
  { id: "to_jp_dan", trip_id: "trip_japan", user_id: "dan", traveller_count: null, place: "Osaka", dates_label: "10–12 Apr" },
  { id: "to_jp_kyoto", trip_id: "trip_japan", user_id: null, traveller_count: 14, place: "Kyoto", dates_label: "3–7 Apr" },
];

export const packingItems: PackingItem[] = [
  { id: "pk_jp_1", trip_id: "trip_japan", position: 1, label: "Layers and a light rain jacket", reason: "Spring days are mild, nights cool", is_packed: false },
  { id: "pk_jp_2", trip_id: "trip_japan", position: 2, label: "Comfortable walking shoes", reason: "Easy to slip off – temples and ryokan", is_packed: false },
  { id: "pk_jp_3", trip_id: "trip_japan", position: 3, label: "Coin purse and some cash", reason: "Smaller shops and shrines prefer cash", is_packed: false },
  { id: "pk_jp_4", trip_id: "trip_japan", position: 4, label: "Travel adapter (Type A)", reason: "Two flat pins", is_packed: false },
  { id: "pk_jp_5", trip_id: "trip_japan", position: 5, label: "Small towel", reason: "Handy for onsen and public bathrooms", is_packed: false },
  { id: "pk_jp_6", trip_id: "trip_japan", position: 6, label: "Pack light or forward luggage", reason: "Big bags are awkward on trains", is_packed: false },
];
