import type { Trip, TripMember } from "./types";
import type { TripLocation } from "./types.social";

/**
 * Friends' own trips. Conceptually the same `trips` / `trip_members` tables as
 * `trips.ts` (the current user's trips) – split out only to keep the mock data
 * readable.
 */
type TripSeed = Partial<Trip> &
  Pick<Trip, "id" | "slug" | "owner_id" | "name" | "stage" | "country" | "places" | "created_at">;

function trip(t: TripSeed): Trip {
  return {
    date_mode: "exact",
    start_date: null,
    end_date: null,
    when_label: "",
    styles: [],
    budget: null,
    progress_pct: 0,
    status_line: "",
    ...t,
  };
}

export const friendTrips: Trip[] = [
  // ---- travelling now (APP_TODAY = 2026-11-09) ----
  trip({ id: "trip_sophie_lisbon", slug: "sophie-lisbon", owner_id: "sophie", name: "Lisbon", stage: "travelling", start_date: "2026-11-06", end_date: "2026-11-14", places: ["Lisbon", "Sintra"], country: "Portugal", styles: ["Food", "Culture"], progress_pct: 100, created_at: "2026-08-14T09:00:00Z" }),
  trip({ id: "trip_samjo_dolomites", slug: "samjo-dolomites", owner_id: "samjo", name: "Dolomites ski week", stage: "travelling", start_date: "2026-11-05", end_date: "2026-11-16", places: ["Dolomites"], country: "Italy", styles: ["Snow"], progress_pct: 100, created_at: "2026-07-01T09:00:00Z" }),
  trip({ id: "trip_priya_seoul", slug: "priya-seoul", owner_id: "priya", name: "Seoul", stage: "travelling", start_date: "2026-11-08", end_date: "2026-11-13", places: ["Seoul"], country: "South Korea", styles: ["Food"], progress_pct: 100, created_at: "2026-09-20T09:00:00Z" }),
  trip({ id: "trip_mei_bali", slug: "mei-bali", owner_id: "mei", name: "Bali", stage: "travelling", start_date: "2026-11-07", end_date: "2026-11-16", places: ["Ubud"], country: "Indonesia", styles: ["Relaxing"], progress_pct: 100, created_at: "2026-09-05T09:00:00Z" }),

  // ---- planning ----
  trip({ id: "trip_tom_morocco", slug: "tom-morocco", owner_id: "tom", name: "Morocco", stage: "planning", date_mode: "flex", when_label: "Thinking October 2027", places: ["Marrakech", "Fes"], country: "Morocco", progress_pct: 15, created_at: "2026-11-08T09:00:00Z" }),
  trip({ id: "trip_jess_mexico", slug: "jess-mexico", owner_id: "jess", name: "Mexico", stage: "planning", date_mode: "none", when_label: "Dates TBC", places: ["Oaxaca", "Mexico City"], country: "Mexico", progress_pct: 10, created_at: "2026-11-07T09:00:00Z" }),
  trip({ id: "trip_dan_japan", slug: "dan-japan", owner_id: "dan", name: "Japan", stage: "planning", start_date: "2027-04-06", end_date: "2027-04-20", places: ["Tokyo", "Osaka"], country: "Japan", progress_pct: 40, created_at: "2026-11-06T09:00:00Z" }),

  // ---- booked ----
  trip({ id: "trip_kofi_vietnam", slug: "kofi-vietnam", owner_id: "kofi", name: "Vietnam", stage: "booked", start_date: "2027-01-08", end_date: "2027-01-24", places: ["Hanoi", "Hoi An", "Ho Chi Minh City"], country: "Vietnam", progress_pct: 70, created_at: "2026-11-08T09:00:00Z" }),
  trip({ id: "trip_ravi_iceland", slug: "ravi-iceland", owner_id: "ravi", name: "Iceland", stage: "booked", start_date: "2027-02-12", end_date: "2027-02-19", places: ["Reykjavík"], country: "Iceland", progress_pct: 60, created_at: "2026-11-07T09:00:00Z" }),
  trip({ id: "trip_hannah_nz", slug: "hannah-new-zealand", owner_id: "hannah", name: "New Zealand", stage: "booked", start_date: "2026-12-20", end_date: "2027-01-04", places: ["Christchurch", "Queenstown"], country: "New Zealand", progress_pct: 65, created_at: "2026-11-06T09:00:00Z" }),

  // ---- completed ----
  trip({ id: "trip_rosa_peru", slug: "rosa-peru", owner_id: "rosa", name: "Peru", stage: "completed", start_date: "2026-10-28", end_date: "2026-11-08", places: ["Lima", "Cusco", "Sacred Valley"], country: "Peru", progress_pct: 100, created_at: "2026-06-01T09:00:00Z" }),
  trip({ id: "trip_jordan_tasmania", slug: "jordan-tasmania", owner_id: "jordan", name: "Tasmania", stage: "completed", start_date: "2026-09-12", end_date: "2026-09-16", places: ["Hobart", "Freycinet", "Cradle Mountain"], country: "Australia", progress_pct: 100, created_at: "2026-07-15T09:00:00Z" }),
  trip({ id: "trip_kofi_namibia", slug: "kofi-namibia", owner_id: "kofi", name: "Namibia", stage: "completed", start_date: "2026-08-05", end_date: "2026-08-14", places: ["Windhoek", "Sossusvlei"], country: "Namibia", progress_pct: 100, created_at: "2026-04-10T09:00:00Z" }),
];

export const friendTripMembers: TripMember[] = friendTrips.map((t) => ({
  trip_id: t.id,
  user_id: t.owner_id,
  role: "owner",
  joined_at: t.created_at,
}));

/**
 * `trip_locations` – coordinates and region for each place a trip visits
 * (the current user's trips and friends'). Used for the friends map and for
 * "places in common".
 */
export const tripLocations: TripLocation[] = [
  // Alex – Japan with the crew
  { id: "loc_japan_tokyo", trip_id: "trip_japan", position: 1, name: "Tokyo", region: "Japan", lon: 139.7, lat: 35.7, starts_on: "2027-03-29", ends_on: "2027-04-03" },
  { id: "loc_japan_hakone", trip_id: "trip_japan", position: 2, name: "Hakone", region: "Japan", lon: 139.1, lat: 35.2, starts_on: "2027-04-03", ends_on: "2027-04-04" },
  { id: "loc_japan_kyoto", trip_id: "trip_japan", position: 3, name: "Kyoto", region: "Japan", lon: 135.8, lat: 35, starts_on: "2027-04-04", ends_on: "2027-04-09" },
  { id: "loc_japan_osaka", trip_id: "trip_japan", position: 4, name: "Osaka", region: "Japan", lon: 135.5, lat: 34.7, starts_on: "2027-04-09", ends_on: "2027-04-14" },
  // Alex – Tasmania, Patagonia, Portugal & Spain
  { id: "loc_tas_hobart", trip_id: "trip_tasmania", position: 1, name: "Hobart", region: "Tasmania", lon: 147.3, lat: -42.9, starts_on: null, ends_on: null },
  { id: "loc_tas_cradle", trip_id: "trip_tasmania", position: 2, name: "Cradle Mountain", region: "Tasmania", lon: 145.9, lat: -41.7, starts_on: null, ends_on: null },
  { id: "loc_pat_chalten", trip_id: "trip_patagonia", position: 1, name: "El Chaltén", region: "Argentina", lon: -72.9, lat: -49.3, starts_on: null, ends_on: null },
  { id: "loc_pat_torres", trip_id: "trip_patagonia", position: 2, name: "Torres del Paine", region: "Chile", lon: -73, lat: -51, starts_on: null, ends_on: null },
  { id: "loc_ib_lisbon", trip_id: "trip_iberia", position: 1, name: "Lisbon", region: "Portugal", lon: -9.1, lat: 38.7, starts_on: null, ends_on: null },
  { id: "loc_ib_porto", trip_id: "trip_iberia", position: 2, name: "Porto", region: "Portugal", lon: -8.6, lat: 41.2, starts_on: null, ends_on: null },
  { id: "loc_ib_sansebastian", trip_id: "trip_iberia", position: 3, name: "San Sebastián", region: "Spain", lon: -2, lat: 43.3, starts_on: null, ends_on: null },

  // Friends – travelling now
  { id: "loc_sophie_lisbon", trip_id: "trip_sophie_lisbon", position: 1, name: "Lisbon", region: "Portugal", lon: -9.1, lat: 38.7, starts_on: "2026-11-06", ends_on: "2026-11-14" },
  { id: "loc_samjo_dolomites", trip_id: "trip_samjo_dolomites", position: 1, name: "Dolomites", region: "Italy", lon: 11.8, lat: 46.4, starts_on: "2026-11-05", ends_on: "2026-11-16" },
  { id: "loc_priya_seoul", trip_id: "trip_priya_seoul", position: 1, name: "Seoul", region: "South Korea", lon: 127, lat: 37.6, starts_on: "2026-11-08", ends_on: "2026-11-13" },
  { id: "loc_mei_ubud", trip_id: "trip_mei_bali", position: 1, name: "Ubud", region: "Bali", lon: 115.3, lat: -8.5, starts_on: "2026-11-07", ends_on: "2026-11-16" },

  // Friends – planning / booked / completed
  { id: "loc_tom_marrakech", trip_id: "trip_tom_morocco", position: 1, name: "Marrakech", region: "Morocco", lon: -8, lat: 31.6, starts_on: null, ends_on: null },
  { id: "loc_jess_oaxaca", trip_id: "trip_jess_mexico", position: 1, name: "Oaxaca", region: "Mexico", lon: -96.7, lat: 17.1, starts_on: null, ends_on: null },
  { id: "loc_dan_tokyo", trip_id: "trip_dan_japan", position: 1, name: "Tokyo", region: "Japan", lon: 139.7, lat: 35.7, starts_on: "2027-04-06", ends_on: "2027-04-10" },
  { id: "loc_dan_osaka", trip_id: "trip_dan_japan", position: 2, name: "Osaka", region: "Japan", lon: 135.5, lat: 34.7, starts_on: "2027-04-10", ends_on: "2027-04-12" },
  { id: "loc_kofi_hanoi", trip_id: "trip_kofi_vietnam", position: 1, name: "Hanoi", region: "Vietnam", lon: 105.8, lat: 21, starts_on: "2027-01-08", ends_on: "2027-01-13" },
  { id: "loc_ravi_reykjavik", trip_id: "trip_ravi_iceland", position: 1, name: "Reykjavík", region: "Iceland", lon: -21.9, lat: 64.1, starts_on: "2027-02-12", ends_on: "2027-02-19" },
  { id: "loc_hannah_queenstown", trip_id: "trip_hannah_nz", position: 1, name: "Queenstown", region: "New Zealand", lon: 168.7, lat: -45, starts_on: "2026-12-20", ends_on: "2027-01-04" },
  { id: "loc_rosa_cusco", trip_id: "trip_rosa_peru", position: 1, name: "Cusco", region: "Peru", lon: -72, lat: -13.5, starts_on: "2026-10-30", ends_on: "2026-11-04" },
  { id: "loc_jordan_hobart", trip_id: "trip_jordan_tasmania", position: 1, name: "Hobart", region: "Tasmania", lon: 147.3, lat: -42.9, starts_on: "2026-09-12", ends_on: "2026-09-16" },
  { id: "loc_kofi_sossusvlei", trip_id: "trip_kofi_namibia", position: 1, name: "Sossusvlei", region: "Namibia", lon: 15.3, lat: -24.7, starts_on: "2026-08-05", ends_on: "2026-08-14" },
];
