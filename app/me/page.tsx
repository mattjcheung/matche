import type { Metadata } from "next";
import Link from "next/link";
import { Button, SiteHeader } from "@/components";
import { cx } from "@/lib/cx";
import { formatDate } from "@/lib/format";
import {
  currentYear,
  getLongestTrip,
  getProfile,
  getTotalNightsAway,
  getTravelStats,
  listBadges,
  listHistoryChapters,
  listNightsByYear,
  listPendingNotes,
  listProfileNotes,
} from "@/lib/data/queries/me";
import { getNextTrip } from "@/lib/data/queries/trips";
import { HistoryBook } from "./HistoryBook";
import { NotesSection } from "./NotesSection";
import { OwnerOnly, ProfileViewProvider, PublicBanner, PublicToggle } from "./ProfileView";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your travel profile: stats, badges, a history book of every trip and notes from people you met.",
};

const EARTH_CIRCUMFERENCE_KM = 40_075;
const CONTINENTS = 7;
/** Tallest bar in the nights-per-year chart, px. */
const BAR_MAX_PX = 110;

export default function MePage() {
  const { user, profile, joinedYear } = getProfile();
  const stats = getTravelStats();
  const years = listNightsByYear();
  const totalNights = getTotalNightsAway();
  const longest = getLongestTrip();
  const badges = listBadges();
  const chapters = listHistoryChapters();
  const notes = listProfileNotes();
  const pending = listPendingNotes();
  const nextTrip = getNextTrip();
  const thisYear = currentYear();

  const maxNights = Math.max(1, ...years.map((y) => y.nights));
  const laps = Math.floor((stats.distance_km / EARTH_CIRCUMFERENCE_KM) * 10) / 10;
  const firstYear = years[0]?.year;
  const lastYear = years[years.length - 1]?.year;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <ProfileViewProvider>
        <PublicBanner />
        <main className={styles.main}>
          {/* ---------------- Hero ---------------- */}
          <section aria-labelledby="me-h" className={styles.hero}>
            <div className={styles.heroBand}>
              <svg viewBox="0 0 1200 150" preserveAspectRatio="none" aria-hidden="true" className={styles.heroArt}>
                <path className={styles.heroHill} d="M0 120 C200 60 320 140 520 90 S860 30 1200 80 V150 H0Z" />
                <path className={styles.heroShade} d="M0 140 C260 100 420 150 640 120 S980 90 1200 125 V150 H0Z" />
                <path className={styles.heroRoute} d="M80 60 C260 20 420 70 600 40 S900 10 1120 50" />
              </svg>
            </div>
            <div className={styles.heroBody}>
              <div className={styles.identity}>
                <span className={styles.heroAvatar} style={{ background: profile.hero_tone }} aria-hidden="true">
                  {user.initials}
                </span>
                <div className={styles.nameBlock}>
                  <h1 id="me-h" className={styles.name}>
                    {user.name}
                  </h1>
                  <p className={styles.handle}>
                    @{profile.handle} · {user.home_city}-based · on Matche since {joinedYear}
                  </p>
                </div>
                <div className={styles.heroActions}>
                  <PublicToggle />
                  <OwnerOnly>
                    <Button variant="primary" className={styles.editButton}>
                      Edit profile
                    </Button>
                  </OwnerOnly>
                </div>
              </div>

              <div className={styles.aboutRow}>
                <div className={styles.about}>
                  <p className={styles.eyebrow}>About me</p>
                  <p className={styles.aboutText}>{profile.about}</p>
                  <div className={styles.tags}>
                    {profile.style_tags.map((t) => (
                      <span key={t} className={styles.styleTag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <dl className={styles.facts}>
                  {profile.facts.map((f) => (
                    <div key={f.label} className={styles.fact}>
                      <dt className={styles.factLabel}>{f.label}</dt>
                      <dd className={styles.factValue}>{f.value}</dd>
                    </div>
                  ))}
                  <div className={cx(styles.fact, styles.factAsk)}>
                    <dt className={styles.factLabel}>Ask me about</dt>
                    <dd className={styles.factValue}>{profile.ask_me_about.join(" · ")}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* ---------------- By the numbers ---------------- */}
          <section aria-labelledby="dash-h" className={styles.dash}>
            <div>
              <h2 id="dash-h" className={styles.sectionTitle}>
                Your travels, by the numbers
              </h2>
              <p className={styles.lede}>Worked out from your trips and journal entries.</p>
            </div>

            <div className={styles.statGrid}>
              <div className={cx(styles.stat, styles.statDark)}>
                <p className={styles.bigNumber}>{stats.countries_visited}</p>
                <p className={styles.statLabel}>countries visited</p>
                <div
                  className={styles.continents}
                  role="img"
                  aria-label={`${stats.continents_visited} of ${CONTINENTS} continents`}
                >
                  {Array.from({ length: CONTINENTS }, (_, k) => (
                    <span key={k} className={cx(styles.continent, k < stats.continents_visited && styles.continentOn)} />
                  ))}
                </div>
                <p className={styles.statNote} aria-hidden="true">
                  {stats.continents_visited} of {CONTINENTS} continents
                </p>
              </div>
              <div className={cx(styles.stat, styles.statPrimary)}>
                <p className={styles.bigNumber}>{laps}×</p>
                <p className={styles.statLabel}>around the Earth</p>
                <p className={styles.statNote}>
                  {stats.distance_km.toLocaleString("en-AU")} km {stats.distance_note}
                </p>
              </div>
              <div className={cx(styles.stat, styles.statAccent)}>
                <p className={styles.bigNumber}>{totalNights}</p>
                <p className={styles.statLabel}>nights away from home</p>
                {longest && (
                  <p className={styles.statNote}>
                    Longest trip: {longest.days} days in {longest.trip.country}
                  </p>
                )}
              </div>
              <div className={cx(styles.stat, styles.statSurface)}>
                <p className={styles.personalityEyebrow}>Travel personality</p>
                <p className={styles.personality}>{stats.personality}</p>
                <p className={styles.personalityNote}>{stats.personality_note}</p>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={cx(styles.panel, styles.chartPanel)}>
                <p className={styles.panelTitle}>Nights away per year</p>
                <div
                  className={styles.chart}
                  role="img"
                  aria-label={`Nights away per year, ${firstYear} to ${lastYear}`}
                >
                  {years.map((y) => (
                    <div key={y.year} className={styles.barCol}>
                      <span className={styles.barValue}>{y.nights}</span>
                      <div
                        className={cx(styles.bar, y.year === thisYear && styles.barCurrent)}
                        style={{ height: Math.max(4, Math.round((y.nights / maxNights) * BAR_MAX_PX)) }}
                      />
                      <span className={styles.barLabel}>{y.year}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={cx(styles.panel, styles.factsPanel)}>
                <p className={styles.panelTitle}>Fun facts</p>
                {stats.fun_facts.map((f) => (
                  <p key={f.label} className={styles.funFact}>
                    <strong>{f.label}:</strong> {f.value}
                  </p>
                ))}
              </div>
            </div>

            <ul className={styles.badges} aria-label="Badges">
              {badges.map((b) => (
                <li key={b.id} className={styles.badge}>
                  <span className={styles.badgeIcon} style={{ background: b.tone }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="9" r="6" />
                      <path d="M8.5 14l-1.5 8 5-3 5 3-1.5-8" />
                    </svg>
                  </span>
                  <div>
                    <p className={styles.badgeName}>{b.name}</p>
                    <p className={styles.badgeDetail}>{b.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- History book ---------------- */}
          <HistoryBook
            chapters={chapters}
            nextChapter={
              nextTrip
                ? {
                    label: `${nextTrip.name}${nextTrip.start_date ? ` · ${formatDate(nextTrip.start_date)}` : ""}`,
                    href: "/trips",
                  }
                : null
            }
          />

          {/* ---------------- Notes + sidebar ---------------- */}
          <div className={styles.lowerRow}>
            <NotesSection
              ownerName={user.short_name}
              notes={notes}
              pending={pending}
              initialNotesPublic={profile.notes_public}
            />

            <aside className={styles.aside}>
              <section aria-labelledby="wish-h" className={cx(styles.panel, styles.asideCard)}>
                <h2 id="wish-h" className={styles.asideTitle}>
                  Bucket list
                </h2>
                <ul className={styles.bucket}>
                  {profile.bucket_list.map((b) => (
                    <li key={b} className={styles.bucketItem}>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className={styles.asideNote}>Friends can see this and suggest tips.</p>
              </section>

              <section aria-labelledby="give-h" className={styles.giving}>
                <h2 id="give-h" className={styles.asideTitle}>
                  Giving back
                </h2>
                <p className={styles.givingText}>{profile.giving_back}</p>
                <Link href="/friends" className={styles.givingLink}>
                  Find something on your next trip →
                </Link>
              </section>

              <OwnerOnly>
                <section aria-labelledby="priv-h" className={cx(styles.panel, styles.privacy)}>
                  <h2 id="priv-h" className={styles.privacyTitle}>
                    Who sees what
                  </h2>
                  <p className={styles.privacyText}>
                    Public: bio, stats, history book covers. Friends: shared journal entries and recaps. Only you:
                    private entries, costs and bookings.
                  </p>
                  <Button variant="secondary" className={styles.privacyButton}>
                    Privacy settings
                  </Button>
                </section>
              </OwnerOnly>
            </aside>
          </div>
        </main>
      </ProfileViewProvider>
    </div>
  );
}
