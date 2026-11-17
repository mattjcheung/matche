"use client";

import { useId, useState } from "react";
import { Avatar, Button, Card, ChipToggle, Display, Icon, IconButton, MediaPlaceholder, Muted, PlayDisc, Segmented, Tag } from "@/components";
import type { TagTone } from "@/components/Chip";
import type { FeedPostVM, PersonVM } from "@/lib/data/queries/home";
import type { PostKind } from "@/lib/data/types";
import { cx } from "@/lib/cx";
import styles from "./Feed.module.css";

type Filter = "all" | "live" | "review" | "question";
type ComposeKind = "update" | "question";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Everything" },
  { id: "live", label: "On a trip now" },
  { id: "review", label: "Trip reviews" },
  { id: "question", label: "Questions" },
];

const BADGE: Record<PostKind, { label: string; tone: TagTone }> = {
  live: { label: "On a trip", tone: "primary" },
  review: { label: "Trip review", tone: "dark" },
  question: { label: "Question", tone: "accent" },
  update: { label: "Update", tone: "neutral" },
};

export function Feed({ me, initialPosts }: { me: PersonVM; initialPosts: FeedPostVM[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [kind, setKind] = useState<ComposeKind>("update");
  const [draft, setDraft] = useState("");
  const [mine, setMine] = useState<FeedPostVM[]>([]);
  const composeId = useId();

  const all = [...mine, ...initialPosts];
  const visible = all.filter((p) => filter === "all" || p.kind === filter);

  function post() {
    const text = draft.trim();
    if (!text) return;
    // TODO(data): replace with an insert into `posts` once the backend exists.
    const p: FeedPostVM = {
      id: `local-${Date.now()}`,
      kind,
      author: { ...me, name: "You" },
      context: kind === "question" ? "· asking the community" : "· not on a trip",
      time: "Just now",
      body: text,
      emphasis: "normal",
      media: [],
      review: null,
      likes: 0,
      replies: 0,
      comments: [],
      canSave: false,
    };
    setMine((m) => [p, ...m]);
    setDraft("");
    setFilter("all");
  }

  return (
    <>
      {/* Composer */}
      <Card padding="md" gap={12}>
        <div className={styles.composerRow}>
          <Avatar initials={me.initials} tone={me.tone} fg={me.fg} size={40} />
          <div className={styles.composerBody}>
            <label htmlFor={composeId} className="visually-hidden">
              Write a post
            </label>
            <textarea
              id={composeId}
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={kind === "question" ? "Ask for ideas – e.g. Any tips for 10 days in Vietnam?" : "Share an update, a tip or a photo…"}
              className={styles.textarea}
            />
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
              <IconButton aria-label="Add photo">
                <Icon name="photo" />
              </IconButton>
              <IconButton aria-label="Add video">
                <Icon name="video" />
              </IconButton>
              <Button onClick={post} className={styles.postButton}>
                Post
              </Button>
            </div>
            <Muted size={13}>
              On a trip? Posts are tagged with the day and place automatically, and when the trip ends your photos are bundled into one review post.
            </Muted>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div role="tablist" aria-label="Filter feed" className={styles.filters}>
        {FILTERS.map((f) => (
          <ChipToggle key={f.id} asTab selected={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </ChipToggle>
        ))}
      </div>

      {/* Posts */}
      {visible.map((p) => (
        <FeedPost key={p.id} post={p} />
      ))}
      {visible.length === 0 && (
        <Card dashed className={styles.empty}>
          Nothing here yet.
        </Card>
      )}
    </>
  );
}

function FeedPost({ post: p }: { post: FeedPostVM }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const badge = BADGE[p.kind];
  const photo = p.media.find((m) => m.kind === "photo");
  const video = p.media.find((m) => m.kind === "video");

  return (
    <Card as="article" padding="md" gap={12}>
      <div className={styles.postHead}>
        <Avatar initials={p.author.initials} tone={p.author.tone} fg={p.author.fg} size={40} />
        <div className={styles.postWho}>
          <p className={styles.postName}>
            <strong>{p.author.name}</strong> <span className={styles.context}>{p.context}</span>
          </p>
          <Muted size={13} className={styles.time}>
            {p.time}
          </Muted>
        </div>
        <Tag tone={badge.tone}>{badge.label}</Tag>
      </div>

      {p.review ? (
        <>
          <div className={styles.reviewHead}>
            <Display as="p" size="sm">
              {p.review.title}
            </Display>
            <Muted size={14}>{p.review.meta}</Muted>
          </div>
          <div className={styles.tiles}>
            {p.media.slice(0, 4).map((m, i, arr) => (
              <MediaPlaceholder key={i} tone={m.tone} aspect="1 / 1" radius={10} align="center">
                {i === arr.length - 1 && p.review?.moreCount ? <span className={styles.more}>+{p.review.moreCount}</span> : null}
              </MediaPlaceholder>
            ))}
          </div>
        </>
      ) : video ? (
        <MediaPlaceholder tone={video.tone} height={280} align="center">
          {video.duration && (
            <span className={styles.videoLength}>
              <Tag tone="overlay">{video.duration}</Tag>
            </span>
          )}
          <PlayDisc label="Play video" />
        </MediaPlaceholder>
      ) : photo ? (
        <MediaPlaceholder tone={photo.tone} height={280} caption="[Photo]" />
      ) : null}

      <p className={cx(styles.body, styles[`body_${p.emphasis}`])}>{p.body}</p>

      {p.comments.length > 0 && (
        <div className={styles.comments}>
          {p.comments.map((c) => (
            <p key={c.id} className={styles.comment}>
              <strong>{c.who}</strong> {c.body}
            </p>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="pill" size="sm" aria-pressed={liked} onClick={() => setLiked((v) => !v)} aria-label={`Like, ${p.likes + (liked ? 1 : 0)} likes`}>
          ♥ {p.likes + (liked ? 1 : 0)}
        </Button>
        <Button variant="pill" size="sm">
          {p.replies > 0 ? `Reply · ${p.replies}` : "Reply"}
        </Button>
        {p.canSave && (
          <Button variant="tint" size="sm" aria-pressed={saved} onClick={() => setSaved((v) => !v)}>
            {saved ? "Saved to wishlist" : "Save trip to wishlist"}
          </Button>
        )}
      </div>
    </Card>
  );
}
