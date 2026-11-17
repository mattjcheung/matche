import type {
  Destination,
  DestinationCost,
  DestinationNote,
  DestinationStat,
  UserDestinationLink,
} from "./types.trip";

export const destinations: Destination[] = [
  {
    id: "dest_japan",
    name: "Japan",
    country: "Japan",
    docs: "No visa needed for tourist stays up to 90 days. Passport must be valid for your whole stay.",
    events: "Cherry blossom late Mar–early Apr; Golden Week (late Apr–early May) is very busy.",
    health: "Some common cold and allergy medicines are banned – check yours. Earthquake alerts worth turning on.",
    people: "Priya and Hannah have been. Dan is planning a trip in April.",
    packing: "slip-on shoes for temples, a coin purse, a Type A adapter",
    fof_visited_count: 5,
    spring_trip_count: null,
  },
  {
    id: "dest_vietnam",
    name: "Vietnam",
    country: "Vietnam",
    docs: "E-visa needed – apply online before you go. We’ll add a deadline to your calendar.",
    events: "Lunar New Year (Tết) falls in Jan or Feb – lots closes for a few days.",
    health: "See a travel clinic about recommended vaccines 6–8 weeks before you go.",
    people: "Kofi is going in January. 31 Matche travellers are planning Vietnam this summer.",
    packing: "light rain jacket, mosquito repellent, quick-dry clothes",
    fof_visited_count: 0,
    spring_trip_count: null,
  },
  {
    id: "dest_portugal",
    name: "Portugal",
    country: "Portugal",
    docs: "No visa needed for up to 90 days in the Schengen area. Check whether the new ETIAS travel authorisation applies to your dates.",
    events: "Lisbon’s Santo António street festivals fill June; summer is peak season.",
    health: "Low-risk destination. Strong sun from June to September.",
    people: "Sophie is there right now and has been twice before.",
    packing: "grippy walking shoes for steep cobbles, a light layer for evenings",
    fof_visited_count: 0,
    spring_trip_count: null,
  },
  {
    id: "dest_iceland",
    name: "Iceland",
    country: "Iceland",
    docs: "No visa needed for up to 90 days in the Schengen area. Check ETIAS for your dates.",
    events: "Northern lights season roughly Sep–Mar; midnight sun in June.",
    health: "Weather changes fast – check road and weather alerts daily if driving.",
    people: "Ravi goes in February. It’s on 2 friends’ wishlists.",
    packing: "waterproof shell, thermal base layers, swimwear for hot pools",
    fof_visited_count: 0,
    spring_trip_count: null,
  },
  {
    id: "dest_morocco",
    name: "Morocco",
    country: "Morocco",
    docs: "No visa needed for tourist stays up to 90 days.",
    events: "Ramadan dates move each year – some cafés close during the day.",
    health: "Stick to bottled or filtered water. Dress modestly away from tourist areas.",
    people: "Tom is planning a trip and asking for tips.",
    packing: "light long sleeves, a scarf, a refillable filter bottle",
    fof_visited_count: 0,
    spring_trip_count: null,
  },
  {
    id: "dest_peru",
    name: "Peru",
    country: "Peru",
    docs: "No visa needed for short tourist stays.",
    events: "Inti Raymi in Cusco on 24 June. Rainy season in the Andes is roughly Dec–Mar.",
    health: "Altitude sickness is common in Cusco – plan two slow days. Ask a clinic about the Amazon.",
    people: "Rosa just got back and rated it 4.9.",
    packing: "warm layers for cold nights, sunscreen for altitude, broken-in boots",
    fof_visited_count: 0,
    spring_trip_count: null,
  },
  {
    id: "dest_tasmania",
    name: "Tasmania",
    country: "Australia",
    docs: "Domestic trip – just bring photo ID.",
    events: "Summer is best for walking; winter is cold but quiet.",
    health: "Weather on mountain walks can turn quickly – register longer hikes.",
    people: "Jordan did a similar route in September.",
    packing: "a proper rain jacket, warm layers even in summer",
    fof_visited_count: 0,
    spring_trip_count: null,
  },
];

export const destinationNotes: DestinationNote[] = [
  { id: "dn_jp_sakura", destination_id: "dest_japan", category: "events", position: 1, title: "Cherry blossom season", body: "overlaps your dates – expect busy parks and book Kyoto stays early." },
  { id: "dn_jp_golden", destination_id: "dest_japan", category: "events", position: 2, title: "Golden Week", body: "starts 29 Apr, after you leave – good timing, prices jump then." },
  { id: "dn_jp_dance", destination_id: "dest_japan", category: "events", position: 3, title: "Spring dance performances", body: "run in Kyoto’s geisha districts through April." },
  { id: "dn_jp_meds", destination_id: "dest_japan", category: "health", position: 1, title: "Medication:", body: "some common cold and allergy medicines are banned in Japan. Check yours before packing." },
  { id: "dn_jp_vacc", destination_id: "dest_japan", category: "health", position: 2, title: "Vaccines:", body: "make sure routine vaccines are current; ask a travel clinic about extras for rural stays." },
  { id: "dn_jp_quake", destination_id: "dest_japan", category: "health", position: 3, title: "Earthquakes:", body: "save your stays’ evacuation info and turn on emergency alerts." },
];

export const destinationStats: DestinationStat[] = [
  { id: "ds_jp_enjoy", destination_id: "dest_japan", position: 1, label: "Enjoyment", value_label: "4.8 / 5", score_pct: 96 },
  { id: "ds_jp_safe", destination_id: "dest_japan", position: 2, label: "Feels safe", value_label: "4.9 / 5", score_pct: 98 },
  { id: "ds_jp_value", destination_id: "dest_japan", position: 3, label: "Value for money", value_label: "4.1 / 5", score_pct: 82 },
  { id: "ds_jp_crowds", destination_id: "dest_japan", position: 4, label: "Crowds in April", value_label: "High", score_pct: 85 },
];

/** Daily cost bands are still being gathered, so amounts are null for now. */
export const destinationCosts: DestinationCost[] = [
  { destination_id: "dest_japan", tier: "Budget", daily_cents: null },
  { destination_id: "dest_japan", tier: "Mid-range", daily_cents: null },
  { destination_id: "dest_japan", tier: "Comfort", daily_cents: null },
];

export const userDestinationLinks: UserDestinationLink[] = [
  { id: "udl_priya_jp", user_id: "priya", destination_id: "dest_japan", relation: "visited", summary: "Been 3 times · last trip Oct 2025" },
  { id: "udl_dan_jp", user_id: "dan", destination_id: "dest_japan", relation: "planning", summary: "Planning · Osaka 10–12 Apr" },
  { id: "udl_hannah_jp", user_id: "hannah", destination_id: "dest_japan", relation: "lived", summary: "Lived in Kyoto for a year" },
];
