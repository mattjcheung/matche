import { MONTHS_SHORT, parseISODate } from "@/lib/format";
import type { TripBudget } from "../types";
import { db, me, getUser } from "../db";
import { TRIP_BUDGETS, TRIP_LENGTHS, TRIP_STYLES } from "../trip_ideas";
import { APP_TODAY } from "../clock";

/**
 * Queries for the Start-a-trip wizard (`/trips/new`). Everything is returned
 * as one plain object so the server page can hand it to the client wizard.
 */

export interface DestinationInfoVM {
  docs: string;
  events: string;
  health: string;
  people: string;
  pack: string;
}

export interface NewTripOptions {
  ideas: Array<{ name: string; why: string }>;
  /** Gathered info keyed by destination name. */
  destinationInfo: Record<string, DestinationInfoVM>;
  /** Destination names that are domestic for the user's passport. */
  domestic: string[];
  /** The next 12 months, starting next month. */
  months: Array<{ id: string; mon: string; yr: string }>;
  lengths: string[];
  friends: Array<{ id: string; name: string; initials: string; tone: string; fg?: string }>;
  styles: string[];
  budgets: TripBudget[];
  defaultBudget: TripBudget;
  /** e.g. { phrase: "an Australian passport", expiresLabel: "Aug 2027" }. */
  passport: { country: string; phrase: string; expiresLabel: string } | null;
}

const DEMONYM: Record<string, string> = { Australia: "Australian", "New Zealand": "New Zealand", Canada: "Canadian", USA: "American", "South Africa": "South African", Japan: "Japanese" };

function passportPhrase(country: string): string {
  const adj = DEMONYM[country] ?? country;
  return `${/^[AEIOU]/.test(adj) ? "an" : "a"} ${adj} passport`;
}

function nextTwelveMonths(today: string): NewTripOptions["months"] {
  const d = parseISODate(today);
  return Array.from({ length: 12 }, (_, i) => {
    const m = (d.getUTCMonth() + 1 + i) % 12;
    const y = d.getUTCFullYear() + Math.floor((d.getUTCMonth() + 1 + i) / 12);
    return { id: `${MONTHS_SHORT[m]}${y}`, mon: MONTHS_SHORT[m], yr: String(y) };
  });
}

export function getNewTripOptions(userId: string = me()): NewTripOptions {
  const passport = db().travelDocuments.find((d) => d.user_id === userId && d.kind === "passport");
  const homeCountry = passport?.issuing_country ?? getUser(userId).home_country;

  const ideas = db().tripIdeas
    .filter((i) => i.user_id === userId)
    .sort((a, b) => a.position - b.position)
    .flatMap((i) => {
      const d = db().destinations.find((x) => x.id === i.destination_id);
      return d ? [{ name: d.name, why: i.reason }] : [];
    });

  const exp = passport ? parseISODate(passport.expires_on) : null;

  return {
    ideas,
    destinationInfo: Object.fromEntries(
      db().destinations.map((d) => [d.name, { docs: d.docs, events: d.events, health: d.health, people: d.people, pack: d.packing }]),
    ),
    domestic: db().destinations.filter((d) => d.country === homeCountry).map((d) => d.name),
    months: nextTwelveMonths(APP_TODAY),
    lengths: [...TRIP_LENGTHS],
    friends: db().companionSuggestions
      .filter((c) => c.user_id === userId)
      .sort((a, b) => a.position - b.position)
      .map((c) => {
        const u = getUser(c.friend_id);
        return { id: u.id, name: u.short_name, initials: u.initials, tone: u.tone, fg: u.tone_fg };
      }),
    styles: [...TRIP_STYLES],
    budgets: [...TRIP_BUDGETS],
    defaultBudget: "Mid-range",
    passport:
      passport && exp
        ? { country: passport.issuing_country, phrase: passportPhrase(passport.issuing_country), expiresLabel: `${MONTHS_SHORT[exp.getUTCMonth()]} ${exp.getUTCFullYear()}` }
        : null,
  };
}
