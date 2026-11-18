import type { Metadata } from "next";
import Link from "next/link";
import { AvatarStack, Button, ButtonLink, Card, Display, Eyebrow, Icon, Muted, PageShell, ProgressBar, StatTile, Tag } from "@/components";
import { getCurrentUserName } from "@/lib/data/queries/trips";
import {
  getDashboardStats,
  getFocusTrip,
  groupDashboardTrips,
  listDashboardTrips,
  type DashboardTripVM,
} from "@/lib/data/queries/dashboard";
import { cx } from "@/lib/cx";
import styles from "./trips.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export const metadata: Metadata = { title: "Trips" };

export default async function TripsDashboardPage() {
  await loadDb(needsFor("dashboard", "trips"));
  const groups = groupDashboardTrips(listDashboardTrips());
  const stats = getDashboardStats(groups);
  const focus = getFocusTrip(groups);
  const name = getCurrentUserName();

  const jump = [
    { href: "#now", label: "Happening now", count: groups.now.length },
    { href: "#upcoming", label: "Coming up", count: groups.upcoming.length },
    { href: "#dreaming", label: "Still dreaming", count: groups.dreaming.length },
    { href: "#past", label: "Past trips", count: groups.past.length },
  ];

  return (
    <PageShell gap="lg" top="lg">
      {/* ---------------------------------------------------------- Header */}
      <section aria-labelledby="trips-h" className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.greeting}>Welcome back, {name}</p>
          <Display as="h1" size="page" id="trips-h">
            Your trips
          </Display>
          <Muted size={15}>Everywhere you’ve been, everywhere you’re going, and everything in between.</Muted>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" size="lg" className={styles.smallText}>
            + Connect a booking site
          </Button>
          <ButtonLink href="/trips/new" size="lg" icon={<Icon name="plus" strokeWidth={2} />}>
            Start a trip
          </ButtonLink>
        </div>
      </section>

      {/* ---------------------------------------------------------- Focus + stats */}
      <section aria-label="At a glance" className={styles.glance}>
        {focus ? (
          <Card as={Link} href={`/trips/${focus.slug}`} tone="dark" padding="2xl" radius="2xl" gap={20} className={styles.focus}>
            <div className={styles.focusTop}>
              <div>
                <Eyebrow tone="onDark" className={styles.focusEyebrow}>
                  {focus.daysAway !== null && focus.daysAway > 0 ? `Next trip · in ${focus.daysAway} days` : "Happening now"}
                </Eyebrow>
                <Display as="p" size="xl">
                  {focus.name}
                </Display>
                <p className={styles.focusMeta}>
                  {focus.dates} · {focus.route}
                </p>
              </div>
              <AvatarStack people={focus.members} label={`${focus.members.length} travellers`} />
            </div>
            <div className={styles.focusStats}>
              <StatTile tone="onDark" value={focus.flightsBooked} label="flights booked" />
              <StatTile tone="onDark" value={`${focus.staysBooked} / ${focus.staysPlanned}`} label="stays booked" />
              <StatTile tone="onDarkWarm" value={focus.todosOpen} label="to-dos open" />
            </div>
            {focus.todos.length > 0 && (
              <ul className={styles.todos} aria-label="Next to-dos">
                {focus.todos.map((t) => (
                  <li key={t.id} className={styles.todo}>
                    <span className={styles.todoDate}>
                      <span>{t.mon}</span>
                      <strong>{t.day}</strong>
                    </span>
                    <span className={styles.todoTitle}>{t.title}</span>
                  </li>
                ))}
              </ul>
            )}
            <span className={styles.focusCta}>Adjust plans →</span>
          </Card>
        ) : (
          <Card dashed padding="2xl" gap={12} className={styles.focusEmpty}>
            <Display as="p" size="md">
              Nothing booked yet
            </Display>
            <Muted size={15}>Pick a place and a rough time – Matche gathers the rest.</Muted>
            <ButtonLink href="/trips/new" className={styles.alignStart}>
              Start a trip
            </ButtonLink>
          </Card>
        )}

        <div className={styles.statGrid}>
          <StatTile size="lg" value={stats.tripsTaken} label="trips taken" />
          <StatTile size="lg" value={stats.countries} label="countries" />
          <StatTile size="lg" value={stats.nightsAway} label="nights away" />
          <StatTile size="lg" tone="primary" value={stats.inTheWorks} label="trips in the works" />
        </div>
      </section>

      {/* ---------------------------------------------------------- Jump nav */}
      <nav aria-label="Trip groups" className={styles.jump}>
        {jump.map((j) => (
          <a key={j.href} href={j.href} className={styles.jumpLink}>
            {j.label}
            <span className={styles.jumpCount}>{j.count}</span>
          </a>
        ))}
      </nav>

      {/* ---------------------------------------------------------- Now */}
      <TripGroup
        id="now"
        title="Happening now"
        description="Trips you’re on right now – jump in to tweak today’s plans or log a moment."
        trips={groups.now}
        empty={
          stats.nextIn !== null
            ? `No trip in progress. Your next one starts in ${stats.nextIn} days.`
            : "No trip in progress right now."
        }
      />

      {/* ---------------------------------------------------------- Upcoming */}
      <TripGroup
        id="upcoming"
        title="Coming up"
        description="Dated trips on the way. Adjust bookings, stops and who’s coming."
        trips={groups.upcoming}
        empty="No dated trips yet – pick dates on an idea below to lock one in."
      />

      {/* ---------------------------------------------------------- Dreaming */}
      <TripGroup
        id="dreaming"
        title="Still dreaming"
        description="Ideas and half-plans. Pick up where you left off."
        trips={groups.dreaming}
        empty="No ideas saved. Save a stop from any recap to start one."
      />

      {/* ---------------------------------------------------------- Past */}
      <TripGroup
        id="past"
        title="Past trips"
        description="Look back, rate what worked, and turn the best bits into a recap."
        trips={groups.past}
        empty="Your finished trips will land here."
      />
    </PageShell>
  );
}

function TripGroup({ id, title, description, trips, empty }: { id: string; title: string; description: string; trips: DashboardTripVM[]; empty: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={styles.group}>
      <div className={styles.groupHead}>
        <Display as="h2" size="md" id={`${id}-h`}>
          {title}
          <span className={styles.groupCount}>{trips.length}</span>
        </Display>
        <Muted size={15}>{description}</Muted>
      </div>
      {trips.length === 0 ? (
        <Card dashed className={styles.empty}>
          {empty}
        </Card>
      ) : (
        <div className={cx(styles.grid, id === "past" && styles.gridPast)}>
          {trips.map((t) => (
            <TripTile key={t.slug} trip={t} />
          ))}
        </div>
      )}
    </section>
  );
}

function TripTile({ trip: t }: { trip: DashboardTripVM }) {
  const past = t.phase === "past";
  return (
    <Link href={`/trips/${t.slug}`} className={styles.tile}>
      <div className={styles.cover} style={{ background: t.coverTone }}>
        <div className={styles.coverTop}>
          <Tag tone="overlay">{past ? (t.nights !== null ? `${t.nights} nights` : t.stage) : t.stage}</Tag>
          {t.rating && (
            <span className={styles.rating} aria-label={`Rated ${t.rating} out of 5`}>
              ★ {t.rating}
            </span>
          )}
        </div>
        <p className={styles.coverWhen}>{t.when}</p>
      </div>
      <div className={styles.tileBody}>
        <div>
          <h3 className={styles.tileName}>{t.name}</h3>
          <Muted size={14} className={styles.route}>
            {t.route}
          </Muted>
        </div>
        {past ? (
          t.highlight && <p className={styles.quote}>“{t.highlight}”</p>
        ) : (
          <div className={styles.progress}>
            <ProgressBar value={t.progress} label={`${t.name} planning progress`} />
            <Muted size={13}>
              {t.progress}% planned · {t.status}
            </Muted>
          </div>
        )}
        <div className={styles.tileFoot}>
          <AvatarStack people={t.members} size={28} ring="var(--color-surface)" label={`${t.members.length} travellers`} />
          <span className={cx(styles.cta, styles[`cta_${t.intent}`])}>{t.cta} →</span>
        </div>
      </div>
    </Link>
  );
}
