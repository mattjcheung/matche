"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from "react";
import { Avatar, Button, ChipToggle, Icon, MediaPlaceholder, PlayDisc, Segmented, Tag } from "@/components";
import type { TagTone } from "@/components/Chip";
import type { FeedPostVM, PersonVM } from "@/lib/data/queries/home";
import type { PostKind } from "@/lib/data/types";
import { cx } from "@/lib/cx";
import { createPost } from "@/lib/actions";
import styles from "./Feed.module.css";

type Filter = "all" | "live" | "review" | "question" | "recaps";
type ComposeKind = "update" | "question";

export interface RecapItemVM {
  id: string;
  title: string;
  who: string;
  meta: string;
  duration: string;
  tone: string;
}

export interface StoryItemVM {
  id: string;
  place: string;
  title: string;
  blurb: string;
  who: string;
  read: string;
  rating: string;
  tone: string;
}

type Item =
  | { type: "post"; key: string; post: FeedPostVM }
  | { type: "recap"; key: string; recap: RecapItemVM; first: boolean }
  | { type: "story"; key: string; story: StoryItemVM };

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "For you" },
  { id: "live", label: "On a trip now" },
  { id: "review", label: "Trip reviews" },
  { id: "question", label: "Questions" },
  { id: "recaps", label: "Recaps & stories" },
];

const BADGE: Record<PostKind, { label: string; tone: TagTone } | null> = {
  live: { label: "On a trip", tone: "primary" },
  review: { label: "Trip review", tone: "dark" },
  question: { label: "Question", tone: "accent" },
  update: null,
};

/** Posts with a recap or a story slotted in after every second post. */
function buildItems(posts: FeedPostVM[], recaps: RecapItemVM[], stories: StoryItemVM[], filter: Filter): Item[] {
  if (filter === "recaps") {
    const out: Item[] = [];
    const n = Math.max(recaps.length, stories.length);
    for (let i = 0; i < n; i++) {
      if (recaps[i]) out.push({ type: "recap", key: `r-${recaps[i].id}`, recap: recaps[i], first: i === 0 });
      if (stories[i]) out.push({ type: "story", key: `s-${stories[i].id}`, story: stories[i] });
    }
    return out;
  }
  const visible = posts.filter((p) => filter === "all" || p.kind === filter);
  if (filter !== "all") return visible.map((p) => ({ type: "post", key: p.id, post: p }));

  const extras: Item[] = [];
  const n = Math.max(recaps.length, stories.length);
  for (let i = 0; i < n; i++) {
    if (recaps[i]) extras.push({ type: "recap", key: `r-${recaps[i].id}`, recap: recaps[i], first: i === 0 });
    if (stories[i]) extras.push({ type: "story", key: `s-${stories[i].id}`, story: stories[i] });
  }
  const out: Item[] = [];
  visible.forEach((p, i) => {
    out.push({ type: "post", key: p.id, post: p });
    if (i % 2 === 1 && extras.length) out.push(extras.shift()!);
  });
  return [...out, ...extras];
}

export function Feed({
  me,
  initialPosts,
  recaps,
  stories,
}: {
  me: PersonVM;
  initialPosts: FeedPostVM[];
  recaps: RecapItemVM[];
  stories: StoryItemVM[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [kind, setKind] = useState<ComposeKind>("update");
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const composeId = useId();
  const pendingScroll = useRef<string | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const items = buildItems(initialPosts, recaps, stories, filter);

  // Links to "#recaps" elsewhere on the page: if the current filter hides the
  // recaps, switch back to the full feed, then glide to them.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a[href="#recaps"]');
      if (!a || document.getElementById("recaps")) return;
      e.preventDefault();
      pendingScroll.current = "recaps";
      setFilter("all");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!pendingScroll.current) return;
    const el = document.getElementById(pendingScroll.current);
    pendingScroll.current = null;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function choose(f: Filter) {
    setFilter(f);
    // Keep the filter bar in view so the new results start right under it.
    const bar = filtersRef.current;
    if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function post() {
    if (!draft.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await createPost({ kind, body: draft });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDraft("");
      setFocused(false);
      setFilter("all");
    });
  }

  const expanded = focused || draft.length > 0;

  return (
    <>
      {/* Composer */}
      <div className={styles.composer}>
        <div className={styles.composerRow}>
          <Avatar initials={me.initials} tone={me.tone} fg={me.fg} size={40} />
          <label htmlFor={composeId} className="visually-hidden">
            Write a post
          </label>
          <textarea
            id={composeId}
            rows={expanded ? 3 : 1}
            value={draft}
            onFocus={() => setFocused(true)}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={kind === "question" ? "Ask for ideas – e.g. Any tips for 10 days in Vietnam?" : "Where are you, and what’s good?"}
            className={styles.textarea}
          />
        </div>
        <div className={styles.composerTools}>
          <Segmented
            label="Post type"
            value={kind}
            onChange={setKind}
            options={[
              { value: "update", label: "Update" },
              { value: "question", label: "Ask for ideas" },
            ]}
          />
          <button type="button" className={styles.toolBtn} aria-label="Add photo">
            <Icon name="photo" size={20} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Add video">
            <Icon name="video" size={20} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Tag a place">
            <Icon name="map-pin" size={20} />
          </button>
          <Button onClick={post} size="sm" className={styles.postButton} disabled={pending || !draft.trim()} aria-busy={pending}>
            {pending ? "Posting…" : "Post"}
          </Button>
        </div>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </div>

      {/* Filters */}
      <div ref={filtersRef} role="tablist" aria-label="Filter feed" className={styles.filters}>
        {FILTERS.map((f) => (
          <ChipToggle key={f.id} asTab size="sm" selected={filter === f.id} onClick={() => choose(f.id)}>
            {f.label}
          </ChipToggle>
        ))}
      </div>

      {/* Items */}
      <div className={styles.stream}>
        {items.map((it) =>
          it.type === "post" ? (
            <FeedPost key={it.key} post={it.post} me={me} />
          ) : it.type === "recap" ? (
            <RecapCard key={it.key} recap={it.recap} anchor={it.first} />
          ) : (
            <StoryCard key={it.key} story={it.story} />
          ),
        )}
        {items.length === 0 && <p className={styles.empty}>Nothing here yet.</p>}
        {items.length > 0 && <p className={styles.end}>You’re all caught up ✓</p>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Post */

function FeedPost({ post: p, me }: { post: FeedPostVM; me: PersonVM }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [myComments, setMyComments] = useState<Array<{ id: string; body: string }>>([]);
  const [reply, setReply] = useState("");
  const replyRef = useRef<HTMLInputElement>(null);
  const replyId = useId();
  const badge = BADGE[p.kind];
  const photo = p.media.find((m) => m.kind === "photo");
  const video = p.media.find((m) => m.kind === "video");
  const likes = p.likes + (liked ? 1 : 0);
  const long = p.body.length > 220;
  const comments = showComments ? p.comments : p.comments.slice(0, 2);

  function doubleTapLike() {
    setLiked(true);
    setBurst((n) => n + 1);
  }

  function sendReply(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setMyComments((c) => [...c, { id: `local-${c.length}`, body: reply.trim() }]);
    setReply("");
  }

  const media = p.review ? (
    <div className={styles.tiles}>
      {p.media.slice(0, 4).map((m, i, arr) => (
        <MediaPlaceholder key={i} tone={m.tone} aspect="1 / 1" radius={0} align="center">
          {i === arr.length - 1 && p.review?.moreCount ? <span className={styles.more}>+{p.review.moreCount}</span> : null}
        </MediaPlaceholder>
      ))}
    </div>
  ) : video ? (
    <MediaPlaceholder tone={video.tone} aspect="4 / 5" radius={0} align="center">
      {video.duration && (
        <span className={styles.videoLength}>
          <Tag tone="overlay">{video.duration}</Tag>
        </span>
      )}
      <PlayDisc label="Play video" />
    </MediaPlaceholder>
  ) : photo ? (
    <MediaPlaceholder tone={photo.tone} aspect="4 / 5" radius={0} caption="[Photo]" />
  ) : null;

  return (
    <article className={styles.post} aria-labelledby={`${p.id}-who`}>
      <header className={styles.postHead}>
        <Link href={`/friends/${p.author.id}`} className={styles.avatarLink} tabIndex={-1} aria-hidden="true">
          <Avatar initials={p.author.initials} tone={p.author.tone} fg={p.author.fg} size={40} />
        </Link>
        <div className={styles.postWho}>
          <p className={styles.postName} id={`${p.id}-who`}>
            <strong>{p.author.name}</strong>
            {badge && (
              <Tag tone={badge.tone} className={styles.badge}>
                {badge.label}
              </Tag>
            )}
          </p>
          <p className={styles.postMeta}>
            {p.context.replace(/^·\s*/, "")} · {p.time}
          </p>
        </div>
        <button type="button" className={styles.more_btn} aria-label="More options">
          <span aria-hidden="true">•••</span>
        </button>
      </header>

      {p.review && (
        <div className={styles.reviewHead}>
          <p className={styles.reviewTitle}>{p.review.title}</p>
          <p className={styles.postMeta}>{p.review.meta}</p>
        </div>
      )}

      {media && (
        <div className={styles.media} onDoubleClick={doubleTapLike}>
          {media}
          {burst > 0 && (
            <span key={burst} className={styles.heartBurst} aria-hidden="true">
              <Icon name="heart" size={96} fill="currentColor" strokeWidth={0} />
            </span>
          )}
        </div>
      )}

      <div className={styles.actionBar}>
        <button
          type="button"
          className={cx(styles.action, liked && styles.liked)}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={() => setLiked((v) => !v)}
        >
          <Icon name="heart" size={24} fill={liked ? "currentColor" : "none"} />
        </button>
        <button type="button" className={styles.action} aria-label="Comment" onClick={() => replyRef.current?.focus()}>
          <Icon name="message" size={24} />
        </button>
        <button type="button" className={styles.action} aria-label="Share">
          <Icon name="share" size={22} />
        </button>
        <button
          type="button"
          className={cx(styles.action, styles.saveAction, saved && styles.saved)}
          aria-pressed={saved}
          aria-label={p.canSave ? (saved ? "Saved to wishlist" : "Save trip to wishlist") : saved ? "Saved" : "Save"}
          onClick={() => setSaved((v) => !v)}
        >
          <Icon name="bookmark" size={22} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className={styles.postBody}>
        <p className={styles.likes}>
          {likes.toLocaleString()} {likes === 1 ? "like" : "likes"}
        </p>
        <p className={cx(styles.caption, styles[`body_${p.emphasis}`], long && !expanded && styles.clamped)}>
          {!media && !p.review ? null : <strong>{p.author.name} </strong>}
          {p.body}
        </p>
        {long && !expanded && (
          <button type="button" className={styles.textBtn} onClick={() => setExpanded(true)}>
            more
          </button>
        )}

        {p.replies > comments.length && !showComments && p.comments.length > 0 && (
          <button type="button" className={styles.textBtn} onClick={() => setShowComments(true)}>
            View all {p.replies} comments
          </button>
        )}
        {(comments.length > 0 || myComments.length > 0) && (
          <ul className={styles.comments}>
            {comments.map((c) => (
              <li key={c.id} className={styles.comment}>
                <strong>{c.who}</strong> {c.body}
              </li>
            ))}
            {myComments.map((c) => (
              <li key={c.id} className={styles.comment}>
                <strong>{me.name}</strong> {c.body}
              </li>
            ))}
          </ul>
        )}

        <form className={styles.replyRow} onSubmit={sendReply}>
          <label htmlFor={replyId} className="visually-hidden">
            Add a comment
          </label>
          <input
            ref={replyRef}
            id={replyId}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={p.kind === "question" ? "Share a tip…" : "Add a comment…"}
            className={styles.replyInput}
            autoComplete="off"
          />
          {reply.trim() && (
            <button type="submit" className={styles.replySend}>
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Recap (reel-style) */

function RecapCard({ recap: r, anchor }: { recap: RecapItemVM; anchor: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <article id={anchor ? "recaps" : undefined} className={cx(styles.post, styles.recap)}>
      <header className={styles.postHead}>
        <span className={styles.recapIcon} aria-hidden="true">
          <Icon name="film" size={20} />
        </span>
        <div className={styles.postWho}>
          <p className={styles.postName}>
            <strong>Trending recap</strong>
          </p>
          <p className={styles.postMeta}>
            {r.who} · {r.meta}
          </p>
        </div>
      </header>
      <MediaPlaceholder tone={r.tone} aspect="9 / 14" radius={0} align="between" className={styles.recapMedia}>
        <div className={styles.recapTop}>
          <Tag tone="overlay">{r.duration}</Tag>
        </div>
        <PlayDisc label={`Play “${r.title}”`} />
        <p className={styles.recapTitle}>{r.title}</p>
      </MediaPlaceholder>
      <div className={styles.actionBar}>
        <button type="button" className={styles.action} aria-label="Share">
          <Icon name="share" size={22} />
        </button>
        <button
          type="button"
          className={cx(styles.action, styles.saveAction, saved && styles.saved)}
          aria-pressed={saved}
          aria-label={saved ? "Saved to wishlist" : `Save “${r.title}” to wishlist`}
          onClick={() => setSaved((v) => !v)}
        >
          <Icon name="bookmark" size={22} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Story (long read) */

function StoryCard({ story: s }: { story: StoryItemVM }) {
  return (
    <article className={cx(styles.post, styles.story)}>
      <MediaPlaceholder tone={s.tone} aspect="16 / 9" radius={0} caption="[Cover photo]" />
      <div className={styles.storyBody}>
        <p className={styles.storyPlace}>
          {s.place} · Story
        </p>
        <h3 className={styles.storyTitle}>{s.title}</h3>
        <p className={styles.storyBlurb}>{s.blurb}</p>
        <p className={styles.postMeta}>
          {s.who} · {s.read} · ★ {s.rating}
        </p>
      </div>
    </article>
  );
}
