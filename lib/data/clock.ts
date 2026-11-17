/**
 * "Today" for date maths. Pinned so the demo data (friends mid-trip, "next trip
 * in 140 days") reads the way it was designed. Set MATCHE_TODAY=live to use
 * the real date, or any YYYY-MM-DD to pin a different day.
 */
const pinned = process.env.MATCHE_TODAY;
export const APP_TODAY: string =
  pinned === "live" ? new Date().toISOString().slice(0, 10) : pinned && /^\d{4}-\d{2}-\d{2}$/.test(pinned) ? pinned : "2026-11-09";
