import type { Trip, TripMember } from "./types";

/**
 * Alex's completed trips, oldest first. These feed the travel history book on
 * `/me`. Same `trips` / `trip_members` tables as `trips.ts`, just stage
 * "completed".
 */
function completed(
  id: string,
  slug: string,
  name: string,
  start_date: string,
  end_date: string,
  places: string[],
  country: string,
  styles: string[],
  budget: Trip["budget"],
): Trip {
  return {
    id,
    slug,
    owner_id: "alex",
    name,
    stage: "completed",
    date_mode: "exact",
    start_date,
    end_date,
    when_label: "",
    places,
    country,
    styles,
    budget,
    progress_pct: 100,
    status_line: "Trip complete",
    created_at: `${start_date}T00:00:00Z`,
  };
}

export const pastTrips: Trip[] = [
  completed("trip_nz_south_2018", "nz-south-island-2018", "New Zealand, South Island", "2018-02-03", "2018-02-15", ["Christchurch", "Lake Tekapo", "Queenstown", "Milford Sound"], "New Zealand", ["Road trip", "Hiking"], "Budget"),
  completed("trip_vietnam_2019", "vietnam-2019", "Vietnam, north to south", "2019-09-06", "2019-09-24", ["Hanoi", "Ha Long Bay", "Hue", "Hoi An", "Ho Chi Minh City"], "Vietnam", ["Food", "Rail"], "Budget"),
  completed("trip_bali_2022", "bali-lombok-2022", "Bali & Lombok", "2022-07-08", "2022-07-18", ["Canggu", "Ubud", "Gili Air", "Lombok"], "Indonesia", ["Beach"], "Budget"),
  completed("trip_singapore_2023", "singapore-2023", "Singapore stopover", "2023-04-01", "2023-04-04", ["Chinatown", "Tiong Bahru", "Gardens by the Bay"], "Singapore", ["Food"], "Mid-range"),
  completed("trip_fiji_2023", "fiji-2023", "Fiji", "2023-04-04", "2023-04-11", ["Nadi", "Yasawa Islands"], "Fiji", ["Beach"], "Mid-range"),
  completed("trip_korea_2024", "south-korea-2024", "South Korea", "2024-10-05", "2024-10-14", ["Seoul", "Gyeongju", "Busan"], "South Korea", ["Food", "Culture"], "Mid-range"),
  completed("trip_nz_north_2025", "nz-north-island-2025", "New Zealand, North Island", "2025-01-04", "2025-01-12", ["Auckland", "Rotorua", "Tongariro", "Wellington"], "New Zealand", ["Hiking"], "Mid-range"),
  completed("trip_srilanka_2026", "sri-lanka-2026", "Sri Lanka", "2026-02-07", "2026-02-21", ["Colombo", "Sigiriya", "Kandy", "Ella", "Mirissa"], "Sri Lanka", ["Hiking", "Rail"], "Budget"),
];

function member(trip_id: string, user_id: string, joined_at: string): TripMember {
  return { trip_id, user_id, role: user_id === "alex" ? "owner" : "member", joined_at };
}

export const pastTripMembers: TripMember[] = [
  member("trip_nz_south_2018", "alex", "2017-11-01T09:00:00Z"),
  member("trip_nz_south_2018", "jordan", "2017-11-02T09:00:00Z"),
  member("trip_vietnam_2019", "alex", "2019-05-10T09:00:00Z"),
  member("trip_vietnam_2019", "sophie", "2019-05-11T09:00:00Z"),
  member("trip_bali_2022", "alex", "2022-04-20T09:00:00Z"),
  member("trip_singapore_2023", "alex", "2023-01-15T09:00:00Z"),
  member("trip_fiji_2023", "alex", "2023-01-15T09:00:00Z"),
  member("trip_fiji_2023", "sophie", "2023-01-16T09:00:00Z"),
  member("trip_fiji_2023", "rosa", "2023-01-18T09:00:00Z"),
  member("trip_korea_2024", "alex", "2024-07-01T09:00:00Z"),
  member("trip_korea_2024", "priya", "2024-07-02T09:00:00Z"),
  member("trip_nz_north_2025", "alex", "2024-10-20T09:00:00Z"),
  member("trip_nz_north_2025", "jordan", "2024-10-21T09:00:00Z"),
  member("trip_nz_north_2025", "dan", "2024-10-22T09:00:00Z"),
  member("trip_srilanka_2026", "alex", "2025-11-30T09:00:00Z"),
];
