import type { User } from "./types";

/** The signed-in user. Replace with the auth session once there is one. */
export const CURRENT_USER_ID = "alex";

/**
 * Fixed "today" so mock data reads consistently (e.g. "in 140 days").
 * Swap for `new Date()` when data is live.
 */
export const APP_TODAY = "2026-11-09";

export const users: User[] = [
  { id: "alex", name: "Alex Kim", short_name: "Alex", initials: "AK", tone: "#0B5F5B", tone_fg: "#FFFFFF", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "sophie", name: "Sophie Lam", short_name: "Sophie", initials: "SL", tone: "#8FC7BF", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "jordan", name: "Jordan Park", short_name: "Jordan", initials: "JP", tone: "#E9D79A", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "dan", name: "Dan Moore", short_name: "Dan", initials: "DM", tone: "#E9D79A", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "rosa", name: "Rosa Bell", short_name: "Rosa", initials: "RB", tone: "#C9B8E8", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "tom", name: "Tom Reid", short_name: "Tom", initials: "TR", tone: "#B9D3A8", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "priya", name: "Priya Nair", short_name: "Priya", initials: "PN", tone: "#F6B08E", home_city: "Melbourne", home_country: "Australia", home_lon: 145, home_lat: -37.8 },
  { id: "mei", name: "Mei Lin", short_name: "Mei", initials: "ML", tone: "#C9B8E8", home_city: "Sydney", home_country: "Australia", home_lon: 151.2, home_lat: -33.9 },
  { id: "samjo", name: "Sam & Jo", short_name: "Sam & Jo", initials: "SJ", tone: "#B9D3A8", home_city: "Brisbane", home_country: "Australia", home_lon: 153, home_lat: -27.5 },
  { id: "hannah", name: "Hannah Wu", short_name: "Hannah", initials: "HW", tone: "#E9D79A", home_city: "Kyoto", home_country: "Japan", home_lon: 135.8, home_lat: 35 },
  { id: "jess", name: "Jess Kim", short_name: "Jess", initials: "JK", tone: "#F3C6B3", home_city: "Vancouver", home_country: "Canada", home_lon: -123.1, home_lat: 49.3 },
  { id: "ravi", name: "Ravi Shah", short_name: "Ravi", initials: "RS", tone: "#BFD7EA", home_city: "New York", home_country: "USA", home_lon: -74, home_lat: 40.7 },
  { id: "kofi", name: "Kofi Asante", short_name: "Kofi", initials: "KA", tone: "#D8C9A3", home_city: "Cape Town", home_country: "South Africa", home_lon: 18.4, home_lat: -33.9 },
];

export const usersById: Record<string, User> = Object.fromEntries(
  users.map((u) => [u.id, u]),
);

export function getUser(id: string): User {
  const u = usersById[id];
  if (!u) throw new Error(`Unknown user ${id}`);
  return u;
}
