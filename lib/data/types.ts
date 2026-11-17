/**
 * Row types for Matche's mock data.
 *
 * Each interface mirrors a future Postgres/Supabase table: snake_case columns,
 * string ids, foreign keys named `<table>_id`, ISO dates (`YYYY-MM-DD`) and
 * money in integer minor units (cents). Screens never read these tables
 * directly – they go through the query functions in `lib/data/queries/*`, so
 * swapping the in-memory arrays for real database calls only touches that
 * folder.
 */

export type ID = string;
/** ISO calendar date, `YYYY-MM-DD`. */
export type ISODate = string;
/** ISO timestamp, `YYYY-MM-DDTHH:mm:ssZ`. */
export type ISODateTime = string;
export type CurrencyCode = "AUD" | "USD" | "EUR" | "JPY";

/** A colour from the friend/category palette, stored as hex. */
export type Tone = string;

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export interface User {
  id: ID;
  /** Display name, e.g. "Sophie Lam". */
  name: string;
  /** Short name used in sentences, e.g. "Sophie". */
  short_name: string;
  initials: string;
  /** Avatar background. */
  tone: Tone;
  /** Avatar text colour when the tone is dark. Defaults to ink. */
  tone_fg?: string;
  home_city: string;
  home_country: string;
  home_lon: number;
  home_lat: number;
  bio?: string;
}

// ---------------------------------------------------------------------------
// friendships
// ---------------------------------------------------------------------------
export type FriendshipStatus = "pending" | "accepted";
export interface Friendship {
  id: ID;
  user_id: ID;
  friend_id: ID;
  status: FriendshipStatus;
  created_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// trips
// ---------------------------------------------------------------------------
export type TripStage = "idea" | "planning" | "booked" | "travelling" | "completed";
export type TripDateMode = "exact" | "flex" | "none";
export type TripBudget = "Budget" | "Mid-range" | "Comfort";

export interface Trip {
  id: ID;
  /** URL slug. */
  slug: string;
  owner_id: ID;
  name: string;
  stage: TripStage;
  date_mode: TripDateMode;
  start_date: ISODate | null;
  end_date: ISODate | null;
  /** Free-text timing when dates aren't fixed, e.g. "Long weekend, dates TBC". */
  when_label: string;
  /** Ordered place names, e.g. ["Tokyo", "Hakone", "Kyoto", "Osaka"]. */
  places: string[];
  country: string | null;
  styles: string[];
  budget: TripBudget | null;
  /** 0–100, planning completeness shown on trip cards. */
  progress_pct: number;
  status_line: string;
  created_at: ISODateTime;
}

export type TripMemberRole = "owner" | "member";
export interface TripMember {
  trip_id: ID;
  user_id: ID;
  role: TripMemberRole;
  joined_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// bookings
// ---------------------------------------------------------------------------
export type BookingKind = "flight" | "stay" | "rail" | "activity" | "other";
export interface Booking {
  id: ID;
  trip_id: ID;
  kind: BookingKind;
  title: string;
  subtitle: string;
  starts_on: ISODate;
  ends_on: ISODate | null;
  /** Human time label as shown on the booking, e.g. "29 Mar, 9:30pm". */
  when_label: string;
  /** Where the booking was imported from, e.g. "Airline (email)". */
  source: string;
  reference: string;
  paid_by: ID;
}

// ---------------------------------------------------------------------------
// expenses & expense_splits
// ---------------------------------------------------------------------------
export type ExpenseCategory = "Stays" | "Getting around" | "Food" | "Activities" | "Other";
export interface Expense {
  id: ID;
  trip_id: ID;
  description: string;
  category: ExpenseCategory;
  spent_on: ISODate;
  /** Integer minor units (cents). */
  amount_cents: number;
  currency: CurrencyCode;
  paid_by: ID;
}

export interface ExpenseSplit {
  expense_id: ID;
  user_id: ID;
  /** This person's share, integer minor units. */
  amount_cents: number;
}

/** A recorded settle-up between two people. Matche never moves money. */
export interface Settlement {
  id: ID;
  trip_id: ID;
  from_user_id: ID;
  to_user_id: ID;
  amount_cents: number;
  currency: CurrencyCode;
  settled_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// posts & post_comments
// ---------------------------------------------------------------------------
export type PostKind = "live" | "review" | "question" | "update";
export type MediaKind = "photo" | "video";

export interface PostMedia {
  kind: MediaKind;
  /** Placeholder colour until real media storage exists. */
  tone: Tone;
  /** Video duration label, e.g. "0:34". */
  duration?: string;
}

export interface Post {
  id: ID;
  author_id: ID;
  kind: PostKind;
  trip_id: ID | null;
  /** For live posts: day number of the author's trip. */
  trip_day: number | null;
  place: string | null;
  body: string;
  /** Larger type for short, punchy posts. */
  emphasis: "normal" | "large" | "xl";
  media: PostMedia[];
  /** Review-only fields. */
  review_title: string | null;
  review_meta: string | null;
  /** Extra media count shown on the last review tile, e.g. 45 → "+45". */
  review_more_count: number | null;
  like_count: number;
  reply_count: number;
  created_at: ISODateTime;
}

export interface PostComment {
  id: ID;
  post_id: ID;
  author_id: ID;
  body: string;
  created_at: ISODateTime;
}
