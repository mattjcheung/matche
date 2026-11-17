import type { VolunteerOpportunity, VolunteerTripMatch } from "./types.social";

const verified = "2026-10-01T00:00:00Z";

/** `volunteer_opportunities` – every organisation is checked before listing. */
export const volunteerOpportunities: VolunteerOpportunity[] = [
  // Near the Japan route
  { id: "vol_osaka_cleanup", title: "River and beach clean-up", category: "Environment", tone: "#8FC7BF", location: "Osaka", commitment: "Half a day · gloves and bags provided", need_tag: null, need_note: null, need_cta: null, need_rank: null, verified_at: verified },
  { id: "vol_kyoto_english", title: "English conversation evenings", category: "Community", tone: "#E9D79A", location: "Kyoto community centre", commitment: "2 hours · no teaching experience needed", need_tag: null, need_note: null, need_cta: null, need_rank: null, verified_at: verified },
  { id: "vol_nagano_farm", title: "Help on a mountain farm in exchange for a bed", category: "Farm stay", tone: "#B9D3A8", location: "Rural Nagano", commitment: "3+ days · meals included", need_tag: null, need_note: null, need_cta: null, need_rank: null, verified_at: verified },
  { id: "vol_nara_temple", title: "Temple garden upkeep", category: "Heritage", tone: "#F6B08E", location: "Nara", commitment: "Morning shift · light work", need_tag: null, need_note: null, need_cta: null, need_rank: null, verified_at: verified },
  // Where help is needed
  { id: "vol_vic_wildlife", title: "Wildlife care after bushfires", category: "Wildlife", tone: "#B9D3A8", location: "Regional Victoria, Australia", commitment: "Weekends · training provided", need_tag: "Close to home", need_note: "Asking for volunteers now", need_cta: "Find a weekend", need_rank: 1, verified_at: verified },
  { id: "vol_fiji_reef", title: "Coral reef restoration", category: "Environment", tone: "#8FC7BF", location: "Fiji", commitment: "2–4 weeks · dive certificate needed", need_tag: "Popular", need_note: "One of the most-saved this year", need_cta: "Start a trip around it", need_rank: 2, verified_at: verified },
  { id: "vol_srilanka_turtles", title: "Sea turtle hatchery support", category: "Wildlife", tone: "#F6B08E", location: "Southern Sri Lanka", commitment: "1–2 weeks · stay with local hosts", need_tag: "In need", need_note: "Short on volunteers", need_cta: "Start a trip around it", need_rank: 3, verified_at: verified },
  { id: "vol_nepal_trails", title: "Trail rebuilding with a local crew", category: "Community", tone: "#E9D79A", location: "Annapurna region, Nepal", commitment: "2 weeks · good fitness needed", need_tag: "Community", need_note: "Asking for volunteers now", need_cta: "Start a trip around it", need_rank: 4, verified_at: verified },
];

/** `volunteer_trip_matches` – how an opportunity fits one of the user's trips. */
export const volunteerTripMatches: VolunteerTripMatch[] = [
  { id: "vm_osaka", opportunity_id: "vol_osaka_cleanup", trip_id: "trip_japan", suggested_on: "2027-04-10", fit_note: "Runs 10 Apr, while you’re in Osaka", cta_label: "Add to 10 April" },
  { id: "vm_kyoto", opportunity_id: "vol_kyoto_english", trip_id: "trip_japan", suggested_on: null, fit_note: "Evenings during your Kyoto stay", cta_label: "Add to itinerary" },
  { id: "vm_nagano", opportunity_id: "vol_nagano_farm", trip_id: "trip_japan", suggested_on: null, fit_note: "Would add 3 days between Hakone and Kyoto", cta_label: "See how it fits" },
  { id: "vm_nara", opportunity_id: "vol_nara_temple", trip_id: "trip_japan", suggested_on: "2027-04-07", fit_note: "Pairs with your 7 April day trip", cta_label: "Add to 7 April" },
];
