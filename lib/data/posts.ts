import type { Post, PostComment } from "./types";

export const posts: Post[] = [
  {
    id: "post_mei_monkeys", author_id: "mei", kind: "live", trip_id: null, trip_day: 3, place: "Ubud, Bali",
    body: "Day 3: We got attacked by monkeys lol!", emphasis: "xl", media: [],
    review_title: null, review_meta: null, review_more_count: null,
    like_count: 31, reply_count: 4, created_at: "2026-11-09T18:35:00Z",
  },
  {
    id: "post_priya_market", author_id: "priya", kind: "live", trip_id: null, trip_day: 2, place: "Seoul, South Korea",
    body: "Lunch at the market: mung bean pancakes straight off the griddle. Already planning to come back tomorrow.",
    emphasis: "normal", media: [{ kind: "photo", tone: "#394B6A" }],
    review_title: null, review_meta: null, review_more_count: null,
    like_count: 18, reply_count: 2, created_at: "2026-11-09T18:00:00Z",
  },
  {
    id: "post_rosa_peru", author_id: "rosa", kind: "review", trip_id: null, trip_day: null, place: "Peru",
    body: "Take the altitude seriously and give yourself two slow days in Cusco. The Sacred Valley was the highlight, not Machu Picchu.",
    emphasis: "normal",
    media: [
      { kind: "photo", tone: "#6B4A2B" }, { kind: "photo", tone: "#3D5A52" },
      { kind: "photo", tone: "#5A3A47" }, { kind: "photo", tone: "#2E4A45" },
    ],
    review_title: "Peru · 12 days · Lima, Cusco, Sacred Valley",
    review_meta: "Rated 4.9 / 5 · 42 photos and 6 videos bundled from her trip",
    review_more_count: 45,
    like_count: 56, reply_count: 9, created_at: "2026-11-08T12:00:00Z",
  },
  {
    id: "post_dan_question", author_id: "dan", kind: "question", trip_id: null, trip_day: null, place: null,
    body: "Any ideas for travel during Dec–Jan? Two weeks, somewhere warm, not too touristy.",
    emphasis: "large", media: [],
    review_title: null, review_meta: null, review_more_count: null,
    like_count: 7, reply_count: 12, created_at: "2026-11-09T16:00:00Z",
  },
  {
    id: "post_samjo_snow", author_id: "samjo", kind: "live", trip_id: null, trip_day: 5, place: "Dolomites, Italy",
    body: "First real snow of the trip. Jo fell over within ten seconds.",
    emphasis: "normal", media: [{ kind: "video", tone: "#5A3A47", duration: "0:34" }],
    review_title: null, review_meta: null, review_more_count: null,
    like_count: 24, reply_count: 3, created_at: "2026-11-09T14:00:00Z",
  },
];

export const postComments: PostComment[] = [
  { id: "c1", post_id: "post_mei_monkeys", author_id: "tom", body: "Did they take anything??", created_at: "2026-11-09T18:40:00Z" },
  { id: "c2", post_id: "post_mei_monkeys", author_id: "mei", body: "My sunglasses. They looked better on him anyway.", created_at: "2026-11-09T18:45:00Z" },
  { id: "c3", post_id: "post_dan_question", author_id: "hannah", body: "Sri Lanka’s south coast is in its dry season then.", created_at: "2026-11-09T16:20:00Z" },
  { id: "c4", post_id: "post_dan_question", author_id: "kofi", body: "Cape Town and the Garden Route – summer there.", created_at: "2026-11-09T16:40:00Z" },
];
