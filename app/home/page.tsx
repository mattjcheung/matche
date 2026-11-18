import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, Button, Card, Display, Eyebrow, Icon, MediaPlaceholder, Muted, SiteHeader } from "@/components";
import {
  getCurrentUserVM,
  getNextTripSummary,
  getTravellerOverlap,
  listFeaturedRecaps,
  listFeed,
  listFriendsRightNow,
  listStories,
} from "@/lib/data/queries/home";
import { Feed } from "./_home/Feed";
import styles from "./_home/home.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export const metadata: Metadata = { title: "Discover" };

export default async function DiscoverPage() {
  await loadDb(needsFor("home"));
  const me = getCurrentUserVM();
  const next = getNextTripSummary();
  const feed = listFeed();
  const friends = listFriendsRightNow();
  const overlap = getTravellerOverlap();
  const recaps = listFeaturedRecaps();
  const stories = listStories();

  return (
    <div className={styles.page}>
      <SiteHeader notifications={3} />

      <div className={styles.layout}>
        {/* ---------------------------------------------------------- Left rail */}
        <aside className={styles.left} aria-label="You">
          <div className={styles.sticky}>
            <Card padding="lg" gap={14}>
              <div className={styles.meRow}>
                <Avatar initials={me.initials} tone={me.tone} fg={me.fg} size={48} />
                <div className={styles.minw0}>
                  <p className={styles.meName}>{me.name}</p>
                  <Link href="/me" className={styles.meLink}>
                    View profile
                  </Link>
                </div>
              </div>
              {next && (
                <Link href={`/trips/${next.slug}`} className={styles.nextMini}>
                  <span className={styles.nextMiniLabel}>Next trip{next.daysAway !== null ? ` · ${next.daysAway} days` : ""}</span>
                  <strong>{next.name}</strong>
                  <span className={styles.nextMiniRoute}>{next.route}</span>
                </Link>
              )}
            </Card>

            <nav aria-label="Discover shortcuts" className={styles.shortcuts}>
              <a href="#feed-top" className={styles.shortcut}>
                <Icon name="home" size={18} /> Feed
              </a>
              <a href="#recaps" className={styles.shortcut}>
                <Icon name="film" size={18} /> Trending recaps
              </a>
              <a href="#friends-now" className={styles.shortcut}>
                <Icon name="map-pin" size={18} /> Friends travelling
              </a>
              <Link href="/trips" className={styles.shortcut}>
                <Icon name="calendar" size={18} /> Your trips
              </Link>
              <Link href="/trips/new" className={styles.shortcut}>
                <Icon name="plus" size={18} /> Start a trip
              </Link>
            </nav>
          </div>
        </aside>

        {/* ---------------------------------------------------------- Feed */}
        <main id="feed-top" className={styles.center}>
          <h1 className="visually-hidden">Discover</h1>

          {/* Stories: friends who are travelling right now */}
          <section aria-label="Friends on the road" className={styles.stories}>
            <Link href="/journal" className={styles.storyBubble}>
              <span className={styles.storyRingMe}>
                <Avatar initials={me.initials} tone={me.tone} fg={me.fg} size={60} />
                <span className={styles.storyPlus} aria-hidden="true">
                  +
                </span>
              </span>
              <span className={styles.storyName}>Your story</span>
            </Link>
            {friends.map((f) => (
              <Link key={f.id} href={`/friends/${f.person.id}`} className={styles.storyBubble} title={`${f.person.name} ${f.action}`}>
                <span className={styles.storyRing}>
                  <Avatar initials={f.person.initials} tone={f.person.tone} fg={f.person.fg} size={60} ring="var(--color-surface)" />
                </span>
                <span className={styles.storyName}>{f.person.name}</span>
              </Link>
            ))}
            {recaps.map((r) => (
              <a key={r.id} href="#recaps" className={styles.storyBubble} title={r.title}>
                <span className={styles.storyRingRecap}>
                  <span className={styles.storyRecap} style={{ background: r.tone }}>
                    <Icon name="play" size={18} />
                  </span>
                </span>
                <span className={styles.storyName}>{r.who}</span>
              </a>
            ))}
          </section>

          <Feed me={me} initialPosts={feed} recaps={recaps} stories={stories} />
        </main>

        {/* ---------------------------------------------------------- Right rail */}
        <aside className={styles.right} aria-label="Around you">
          <div className={styles.sticky}>
            <Card id="friends-now" padding="lg" gap={14} className={styles.anchorCard}>
              <div className={styles.railHead}>
                <Display as="h2" size="sm">
                  Friends right now
                </Display>
                <Link href="/friends" className={styles.railLink}>
                  Map
                </Link>
              </div>
              {friends.map((f) => (
                <div key={f.id} className={styles.friendRow}>
                  <Avatar initials={f.person.initials} tone={f.person.tone} size={36} />
                  <div className={styles.minw0}>
                    <p className={styles.friendLine}>
                      <Link href={`/friends/${f.person.id}`} className={styles.friendName}>
                        {f.person.name}
                      </Link>{" "}
                      {f.action}
                    </p>
                    <Muted size={13} className={styles.friendMeta}>
                      {f.meta}
                    </Muted>
                  </div>
                </div>
              ))}
            </Card>

            {overlap && (
              <Card tone="accent" padding="lg" gap={12}>
                <Eyebrow tone="accent">Meet travellers</Eyebrow>
                <p className={styles.meetTitle}>
                  {overlap.traveller_count} people will be in {overlap.place} the same week as you
                </p>
                <p className={styles.meetCopy}>
                  Join the {overlap.group_name} group to {overlap.pitch}.
                </p>
                <Button variant="accent" size="sm" className={styles.alignStart}>
                  See who’s going
                </Button>
              </Card>
            )}

            <Card padding="lg" gap={12}>
              <Display as="h2" size="sm">
                Trending recaps
              </Display>
              {recaps.slice(0, 3).map((r) => (
                <a key={r.id} href="#recaps" className={styles.trendRow}>
                  <MediaPlaceholder tone={r.tone} aspect="3 / 4" radius={8} className={styles.trendThumb} />
                  <span className={styles.minw0}>
                    <strong className={styles.trendTitle}>{r.title}</strong>
                    <Muted size={13}>{r.meta}</Muted>
                  </span>
                </a>
              ))}
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
