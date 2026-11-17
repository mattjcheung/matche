import type { Friendship } from "./types";

const friendIds = [
  "sophie", "jordan", "dan", "rosa", "tom", "priya", "mei",
  "samjo", "hannah", "jess", "ravi", "kofi",
];

/** Accepted friendships for the current user (one row per direction). */
export const friendships: Friendship[] = friendIds.map((friend_id, i) => ({
  id: `fr_${friend_id}`,
  user_id: "matthew",
  friend_id,
  status: "accepted",
  created_at: friend_id === "sophie" ? "2024-03-01T00:00:00Z" : `202${Math.min(5, 1 + (i % 5))}-0${1 + (i % 9)}-01T00:00:00Z`,
}));
