import Link from "next/link";
import {
  AvatarStack,
  Avatar,
  Button,
  ButtonLink,
  Card,
  Display,
  Eyebrow,
  Icon,
  IconButton,
  MediaPlaceholder,
  Muted,
  PageShell,
  PlayDisc,
  ProgressBar,
  SectionHeader,
  StatTile,
  Tag,
} from "@/components";
import {
  getCurrentUserVM,
  getNextTripSummary,
  getTravellerOverlap,
  listFeaturedRecaps,
  listFeed,
  listFriendsRightNow,
  listStories,
  listTripCards,
} from "@/lib/data/queries/home";
import { Feed } from "./_home/Feed";
import styles from "./_home/home.module.css";
import { loadDb } from "@/lib/data/db";

export default async function HomePage() {
  await loadDb();
  const me = getCurrentUserVM();
  const next = getNextTripSummary();
  const trips = listTripCards();
  const feed = listFeed();
  const friends = listFriendsRightNow();
  const overlap = getTravellerOverlap();
  const recaps = listFeaturedRecaps();
  const stories = listStories();

  return (
    <PageShell notifications={3} gap="lg" top="lg">
      {/* ---------------------------------------------------------- Hero */}
      <section aria-labelledby="hero-h" className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.greeting}>Good evening, {me.name}</p>
          <Display as="h1" size="hero" id="hero-h">
            Every booking, every idea, every friend who’s been there. One place.
          </Display>
          <div className={styles.heroActions}>
            <ButtonLink href="/trips/new" size="xl" icon={<Icon name="plus" strokeWidth={2} />}>
              Start a trip
            </ButtonLink>
            <ButtonLink href="#feed" size="xl" variant="secondary">
              Get inspired
            </ButtonLink>
          </div>
          <Muted size={14}>
            Pick a place, a rough time and who’s coming – Matche gathers visas, costs, events and friends who’ve been.
          </Muted>
        </div>

        {next && (
          <Card as={Link} href={`/trips/${next.slug}`} tone="dark" padding="2xl" radius="2xl" gap={20} className={styles.nextTrip}>
            <div className={styles.nextTripTop}>
              <div>
                <Eyebrow tone="onDark" className={styles.nextEyebrow}>
                  Next trip · in {next.daysAway} days
                </Eyebrow>
                <Display as="p" size="xl">
                  {next.name}
                </Display>
                <p className={styles.nextMeta}>
                  {next.dates} · {next.route}
                </p>
              </div>
              <AvatarStack people={next.members} label={`${next.members.length} travellers`} />
            </div>
            <div className={styles.nextStats}>
              <StatTile tone="onDark" value={next.flightsBooked} label="flights booked" />
              <StatTile tone="onDark" value={`${next.staysBooked} / ${next.staysPlanned}`} label="stays booked" />
              <StatTile tone="onDarkWarm" value={next.todosDue} label="to-dos due soon" />
            </div>
            <ul className={styles.sources} aria-label="Imported from">
              {next.sources.map((s) => (
                <li key={s}>
                  <Tag tone="onDark" size="md">
                    {s}
                  </Tag>
                </li>
              ))}
            </ul>
            <span className={styles.openPlanner}>Open trip planner →</span>
          </Card>
        )}
      </section>

      {/* ---------------------------------------------------------- Your trips */}
      <section aria-labelledby="trips-h" className={styles.section}>
        <SectionHeader
          id="trips-h"
          title="Your trips"
          description={
            <>
              Forward any confirmation to <strong>trips@matche.app</strong> or connect a booking account – we file it into the right trip.
            </>
          }
          action={
            <Button variant="secondary" size="md" className={styles.smallText}>
              + Connect a booking site
            </Button>
          }
        />
        <div className={styles.tripGrid}>
          {trips.map((t) => (
            <Card key={t.slug} as={Link} href={`/trips/${t.slug}`} padding="lg" gap={14} className={styles.tripCard}>
              <div className={styles.tripCardTop}>
                <Tag tone={t.stageTone}>{t.stage}</Tag>
                <Muted size={13}>{t.when}</Muted>
              </div>
              <div>
                <Display as="h3" size="sm">
                  {t.name}
                </Display>
                <Muted size={14} className={styles.tripPlaces}>
                  {t.places}
                </Muted>
              </div>
              <ProgressBar value={t.progress} label={`${t.name} planning progress`} />
              <Muted size={13}>{t.status}</Muted>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Feed + sidebar */}
      <section id="feed" aria-labelledby="feed-h" className={styles.feedRow}>
        <div className={styles.feedCol}>
          <SectionHeader
            id="feed-h"
            title="Feed"
            description="Moments from trips happening now, reviews of trips just finished, and questions from people still dreaming."
          />
          <Feed me={me} initialPosts={feed} />
        </div>

        <aside className={styles.sideCol}>
          <Card padding="xl" gap={16}>
            <Display as="h2" size="sm">
              Friends right now
            </Display>
            {friends.map((f) => (
              <div key={f.id} className={styles.friendRow}>
                <Avatar initials={f.person.initials} tone={f.person.tone} size={40} />
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
            <Link href="/friends" className={styles.textLink}>
              See the friends map
            </Link>
          </Card>

          {overlap && (
            <Card tone="accent" padding="xl" gap={14}>
              <Eyebrow tone="accent">Meet travellers</Eyebrow>
              <Display as="h2" size="sm">
                {overlap.traveller_count} people on Matche will be in {overlap.place} the same week as you
              </Display>
              <p className={styles.meetCopy}>
                Join the {overlap.group_name} group to {overlap.pitch}.
              </p>
              <Button variant="accent" className={styles.alignStart}>
                See who’s going
              </Button>
            </Card>
          )}
        </aside>
      </section>

      {/* ---------------------------------------------------------- Recaps */}
      <section aria-labelledby="recaps-h" className={styles.section}>
        <SectionHeader
          id="recaps-h"
          title="Featured trip recaps"
          description="Short films travellers made from their journals. Save any stop straight to your wishlist."
          action={
            <Link href="#recaps-h" className={styles.textLink}>
              See all recaps
            </Link>
          }
        />
        <div className={styles.recapGrid}>
          {recaps.map((r) => (
            <article key={r.id} className={styles.recap}>
              <MediaPlaceholder tone={r.tone} aspect="9 / 13" radius={20} align="between" className={styles.recapMedia}>
                <div className={styles.recapTop}>
                  <Tag tone="overlay">{r.duration}</Tag>
                  <IconButton aria-label={`Save “${r.title}” to wishlist`} shape="circle" overlay>
                    <Icon name="bookmark" size={18} strokeWidth={2} />
                  </IconButton>
                </div>
                <PlayDisc label={`Play “${r.title}”`} />
                <span className={styles.recapCaption}>[Recap video]</span>
              </MediaPlaceholder>
              <div>
                <p className={styles.recapTitle}>{r.title}</p>
                <Muted size={14} className={styles.recapMeta}>
                  {r.who} · {r.meta}
                </Muted>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Stories */}
      <section aria-labelledby="stories-h" className={styles.section}>
        <SectionHeader
          id="stories-h"
          title="Stories & reviews"
          description="Long reads from people who’ve actually been. Every review is tied to a real, verified trip."
        />
        <div className={styles.storyGrid}>
          {stories.map((s) => (
            <Card as="article" key={s.id} padding="none" className={styles.story}>
              <MediaPlaceholder tone={s.tone} height={170} caption="[Cover photo]" className={styles.storyCover} />
              <Eyebrow className={styles.storyPlace}>{s.place}</Eyebrow>
              <Display as="h3" size="sm" className={styles.storyTitle}>
                <a href="#stories-h">{s.title}</a>
              </Display>
              <p className={styles.storyBlurb}>{s.blurb}</p>
              <Muted size={13}>
                {s.who} · {s.read} · Rated {s.rating} / 5
              </Muted>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
