import type { FriendHighlight, TripPrompt } from "./types.social";

const at = "2026-11-09T08:00:00Z";
const h = (
  friend_id: string,
  priority: number,
  body: string,
  brief: string,
  activity: string | null = null,
): FriendHighlight => ({ id: `hl_${friend_id}`, viewer_id: "alex", friend_id, body, brief, activity, priority, created_at: at });

/** `friend_highlights` for the current user. */
export const friendHighlights: FriendHighlight[] = [
  h("dan", 1, "Planning Japan – you’re both in Osaka 10–12 April.", "Dan is planning Japan", "In Osaka the same nights as you"),
  h("rosa", 2, "Just got back from 12 days in Peru. Her review is rated 4.9.", "Rosa just got back from Peru", "Recap posted · 42 entries"),
  h("priya", 3, "Eating her way around Seoul’s markets. She’s been to Japan three times.", "Priya is in Seoul", "3 new entries"),
  h("tom", 4, "Planning Morocco and wondering how long to spend in Marrakech.", "Tom is planning Morocco", "Asked you about Marrakech"),
  h("jordan", 5, "On your Japan trip. Did Tasmania in September – the route you’re planning.", "Jordan is on your Japan trip"),
  h("sophie", 6, "Posting daily from Lisbon. She’s been to Portugal twice – ask her before you plan your Portugal & Spain trip.", "Sophie is in Lisbon"),
  h("samjo", 7, "Ski week in the Dolomites. Their winter recap from last year has 990 saves.", "Sam & Jo are skiing in the Dolomites"),
  h("mei", 8, "Recently lost her sunglasses to a monkey. Otherwise going well.", "Mei is in Bali"),
  h("hannah", 9, "Lives in Kyoto. You’ll be there 4–9 April – a coffee could be on.", "Hannah is home in Kyoto"),
  h("jess", 10, "Planning Mexico and torn between two cities.", "Jess is planning Mexico"),
  h("ravi", 11, "Iceland booked for February.", "Ravi has Iceland booked"),
  h("kofi", 12, "Off to Vietnam in January – you’ve been.", "Kofi is off to Vietnam"),
];

const p = (
  trip_id: string,
  kind: TripPrompt["kind"],
  tone: TripPrompt["tone"],
  body: string,
  cta_label: string,
): TripPrompt => ({ id: `tp_${trip_id}`, trip_id, viewer_id: "alex", kind, body, cta_label, tone, created_at: at });

/** `trip_prompts` – the nudge on each friend's trip card, for the current user. */
export const tripPrompts: TripPrompt[] = [
  p("trip_tom_morocco", "question", "neutral", "Tom asked: is three nights in Marrakech too many?", "Answer Tom"),
  p("trip_jess_mexico", "vote", "neutral", "Help her choose: Oaxaca or Mexico City?", "Add your vote"),
  p("trip_dan_japan", "meetup", "primary", "You’re both in Osaka 10–12 April.", "Plan a meetup"),
  p("trip_kofi_vietnam", "tip", "primary", "You’ve been to Vietnam. Got a tip for him?", "Share a tip"),
  p("trip_ravi_iceland", "follow", "neutral", "It’s on your wishlist too. Follow along when he goes?", "Follow his trip"),
  p("trip_hannah_nz", "tip", "primary", "You’ve both been to NZ – she’s asking about the South Island.", "Share a tip"),
  p("trip_rosa_peru", "ask", "accent", "Review posted, rated 4.9. Ask how she handled the altitude.", "Ask Rosa"),
  p("trip_jordan_tasmania", "ask", "accent", "You’re planning Tasmania next – he’s done the same route.", "Ask about it"),
  p("trip_kofi_namibia", "recap", "neutral", "His recap has 40 entries and a sand-dune sunrise film.", "Watch recap"),
];
