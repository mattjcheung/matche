import { daysBetween, MONTHS_SHORT, parseISODate } from "@/lib/format";
import { pastTripMembers, pastTrips } from "../past_trips";
import { profileNotes } from "../profile_notes";
import { tripReviews } from "../trip_reviews";
import type { Trip, User } from "../types";
import type { ProfileNote, UserBadge, UserProfile, UserTravelStats, UserYearNights } from "../types.profile";
import { userBadges } from "../user_badges";
import { userProfiles, userTravelStats } from "../user_profiles";
import { userYearNights } from "../user_year_nights";
import { APP_TODAY, CURRENT_USER_ID, getUser } from "../users";

/**
 * Profile (`/me`) queries. Each maps to a future SQL query, e.g.
 *   listHistoryChapters → select trips.*, trip_reviews.* from trips
 *     join trip_members … join trip_reviews … where stage = 'completed'
 * Results are plain, serialisable objects safe to pass to client components.
 */

export interface MyProfile {
  user: User;
  profile: UserProfile;
  /** Year the user joined Matche. */
  joinedYear: number;
}

export function getProfile(userId: string = CURRENT_USER_ID): MyProfile {
  const profile = userProfiles.find((p) => p.user_id === userId);
  if (!profile) throw new Error(`No profile for ${userId}`);
  return { user: getUser(userId), profile, joinedYear: Number(profile.created_at.slice(0, 4)) };
}

export function getTravelStats(userId: string = CURRENT_USER_ID): UserTravelStats {
  const s = userTravelStats.find((r) => r.user_id === userId);
  if (!s) throw new Error(`No travel stats for ${userId}`);
  return s;
}

export function listNightsByYear(userId: string = CURRENT_USER_ID): UserYearNights[] {
  return userYearNights.filter((r) => r.user_id === userId).sort((a, b) => a.year - b.year);
}

export function getTotalNightsAway(userId: string = CURRENT_USER_ID): number {
  return listNightsByYear(userId).reduce((sum, r) => sum + r.nights, 0);
}

export function listBadges(userId: string = CURRENT_USER_ID): UserBadge[] {
  return userBadges.filter((b) => b.user_id === userId).sort((a, b) => (a.earned_at < b.earned_at ? -1 : 1));
}

/** Completed trips the user was on, oldest first. */
export function listCompletedTrips(userId: string = CURRENT_USER_ID): Trip[] {
  const mine = new Set(pastTripMembers.filter((m) => m.user_id === userId).map((m) => m.trip_id));
  return pastTrips
    .filter((t) => mine.has(t.id) && t.stage === "completed" && t.start_date && t.end_date)
    .sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1));
}

function tripNights(t: Trip): number {
  return daysBetween(t.start_date!, t.end_date!);
}

/** The longest completed trip, e.g. for "Longest trip: 18 days in Vietnam". */
export function getLongestTrip(userId: string = CURRENT_USER_ID): { trip: Trip; days: number } | undefined {
  const sorted = listCompletedTrips(userId)
    .map((trip) => ({ trip, days: tripNights(trip) }))
    .sort((a, b) => b.days - a.days);
  return sorted[0];
}

/** One chapter of the travel history book. */
export interface HistoryChapter {
  tripId: string;
  slug: string;
  year: string;
  shortTitle: string;
  title: string;
  /** "Feb 2018 · 12 days". */
  dates: string;
  /** "Christchurch → Lake Tekapo → …". */
  route: string;
  nights: number;
  entries: number;
  /** "4.8". */
  rating: string;
  /** "Jordan, Dan" or "Solo". */
  with: string;
  quote: string;
  /** "Day 3". */
  quoteDay: string;
  coverTone: string;
  photoTones: string[];
}

export function listHistoryChapters(userId: string = CURRENT_USER_ID): HistoryChapter[] {
  return listCompletedTrips(userId).flatMap((trip) => {
    const review = tripReviews.find((r) => r.trip_id === trip.id && r.user_id === userId);
    if (!review) return [];
    const start = parseISODate(trip.start_date!);
    const nights = tripNights(trip);
    const companions = pastTripMembers
      .filter((m) => m.trip_id === trip.id && m.user_id !== userId)
      .sort((a, b) => (a.joined_at < b.joined_at ? -1 : 1))
      .map((m) => getUser(m.user_id).short_name);
    return [
      {
        tripId: trip.id,
        slug: trip.slug,
        year: String(start.getUTCFullYear()),
        shortTitle: review.short_title,
        title: trip.name,
        dates: `${MONTHS_SHORT[start.getUTCMonth()]} ${start.getUTCFullYear()} · ${nights} days`,
        route: trip.places.join(" → "),
        nights,
        entries: review.journal_entry_count,
        rating: review.rating.toFixed(1),
        with: companions.length ? companions.join(", ") : "Solo",
        quote: review.highlight_quote,
        quoteDay: `Day ${review.highlight_day}`,
        coverTone: review.cover_tone,
        photoTones: review.photo_tones,
      },
    ];
  });
}

/** A note from someone met on the road, ready to render. */
export interface ProfileNoteView {
  id: string;
  initials: string;
  tone: string;
  /** "Linh, homestay host". */
  who: string;
  /** "Hoi An, Vietnam · 2019". */
  where: string;
  text: string;
  shownOnProfile: boolean;
}

function noteYear(n: ProfileNote): string | null {
  const trip = n.trip_id ? pastTrips.find((t) => t.id === n.trip_id) : undefined;
  return trip?.start_date ? trip.start_date.slice(0, 4) : null;
}

/** Approved notes on a profile, oldest trip first. */
export function listProfileNotes(userId: string = CURRENT_USER_ID): ProfileNoteView[] {
  return profileNotes
    .filter((n) => n.profile_user_id === userId && n.status === "approved")
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
    .map((n) => {
      const year = noteYear(n);
      return {
        id: n.id,
        initials: n.author_initials,
        tone: n.author_tone,
        who: `${n.author_name}, ${n.author_role}`,
        where: year ? `${n.met_at} · ${year}` : n.met_at,
        text: n.body,
        shownOnProfile: n.shown_on_profile,
      };
    })
    // Notes the owner has hidden go last (stable sort keeps date order otherwise).
    .sort((a, b) => Number(b.shownOnProfile) - Number(a.shownOnProfile));
}

export interface PendingNoteView {
  id: string;
  authorName: string;
  /** Short place, e.g. "Hoi An". */
  metAt: string;
}

/** Notes waiting for the profile owner's approval, newest first. */
export function listPendingNotes(userId: string = CURRENT_USER_ID): PendingNoteView[] {
  return profileNotes
    .filter((n) => n.profile_user_id === userId && n.status === "pending")
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .map((n) => ({ id: n.id, authorName: n.author_name, metAt: n.met_at.split(",")[0] }));
}

/** Calendar year of the app's "today", used to highlight the current year. */
export function currentYear(): number {
  return parseISODate(APP_TODAY).getUTCFullYear();
}
