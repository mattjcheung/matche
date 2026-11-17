import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Button, ButtonLink, Display, Eyebrow, MediaPlaceholder, ProgressBar, SiteHeader } from "@/components";
import { cx } from "@/lib/cx";
import {
  getAskFriends,
  getPackingList,
  getTripCostSummary,
  getTripEssentials,
  getTripHeader,
  getTripItinerary,
  listTripBookings,
  listTripExperiences,
} from "@/lib/data/queries/trip-planner";
import { getTripBySlug } from "@/lib/data/queries/trips";
import { Itinerary } from "./Itinerary";
import styles from "./page.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export async function generateMetadata({ params }: PageProps<"/trips/[slug]">): Promise<Metadata> {
  await loadDb(needsFor("trip-planner", "trips"));
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  return { title: trip ? trip.name : "Trip not found" };
}

const SECTIONS = [
  { href: "#itinerary", label: "Itinerary" },
  { href: "#bookings", label: "Bookings" },
  { href: "#experiences", label: "Experience bank" },
  { href: "#essentials", label: "Essentials" },
  { href: "#packing", label: "What to pack" },
  { href: "/costs", label: "Costs" },
];

export default async function TripPage({ params }: PageProps<"/trips/[slug]">) {
  await loadDb(needsFor("trip-planner", "trips"));
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();

  const header = getTripHeader(trip);
  const itinerary = getTripItinerary(trip.id);
  const bookings = listTripBookings(trip.id);
  const experiences = listTripExperiences(trip.id);
  const essentials = getTripEssentials(trip);
  const ask = getAskFriends(trip);
  const packing = getPackingList(trip.id);
  const costs = getTripCostSummary(trip.id);

  return (
    <div className={styles.page}>
      <SiteHeader />

      <div className={styles.band}>
        <div className={styles.bandInner}>
          <div className={styles.titleRow}>
            <div className={styles.titleBlock}>
              <Eyebrow>{header.eyebrow}</Eyebrow>
              <h1 className={styles.h1}>{header.name}</h1>
              <p className={styles.meta}>{header.meta}</p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="secondary" className={styles.btn14}>
                Invite to trip
              </Button>
              <ButtonLink href="/calendar" className={cx(styles.btn14, styles.inkBtn)}>
                Open calendar
              </ButtonLink>
            </div>
          </div>
          <nav aria-label="Trip sections" className={styles.tabs}>
            {SECTIONS.map((s, i) =>
              s.href.startsWith("#") ? (
                <a key={s.href} href={s.href} className={cx(styles.tab, i === 0 && styles.tabActive)}>
                  {s.label}
                </a>
              ) : (
                <Link key={s.href} href={s.href} className={styles.tab}>
                  {s.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.primary}>
          <Itinerary data={itinerary} />

          {/* ---------------- Bookings ---------------- */}
          <section id="bookings" aria-labelledby="book-h" className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <h2 id="book-h" className={styles.h2}>
                  Bookings
                </h2>
                <p className={styles.lede}>Pulled in from confirmation emails and connected accounts. Matche never takes payment.</p>
              </div>
              <Button variant="secondary" className={styles.btn14}>
                + Add manually
              </Button>
            </div>
            <div className={styles.tableBox} role="region" aria-labelledby="book-h" tabIndex={0}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">What</th>
                    <th scope="col">When</th>
                    <th scope="col">Booked via</th>
                    <th scope="col">Ref</th>
                    <th scope="col">Paid by</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong className={styles.what}>{b.what}</strong>
                        <br />
                        <span className={styles.sub}>{b.sub}</span>
                      </td>
                      <td>{b.when}</td>
                      <td>{b.via}</td>
                      <td className={styles.ref}>{b.ref}</td>
                      <td>{b.paidBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------------- Experience bank ---------------- */}
          <section id="experiences" aria-labelledby="exp-h" className={styles.section}>
            <div>
              <h2 id="exp-h" className={styles.h2}>
                Experience bank
              </h2>
              <p className={styles.lede}>Top-rated by Matche travellers and your friends. Drag one onto a day, or keep it here for later.</p>
            </div>
            <div className={styles.expGrid}>
              {experiences.map((e) => (
                <article key={e.id} className={styles.expCard}>
                  <MediaPlaceholder tone={e.tone} height={110} radius={12} caption="[Photo]" className={styles.expMedia} />
                  <p className={styles.expName}>{e.name}</p>
                  <p className={styles.expMeta}>
                    {e.place} · {e.rating} ★ · {e.price}
                  </p>
                  <p className={styles.expSocial}>{e.social}</p>
                  <Button variant="secondary" className={styles.expBtn}>
                    Add to a day
                  </Button>
                </article>
              ))}
            </div>
          </section>

          {/* ---------------- Essentials ---------------- */}
          <section id="essentials" aria-labelledby="ess-h" className={styles.section}>
            <div>
              <h2 id="ess-h" className={styles.h2}>
                Essentials, gathered for you
              </h2>
              <p className={styles.lede}>
                Based on your passport{essentials.passportCountry ? ` (${essentials.passportCountry})` : ""}, dates and stops. Always confirm with official
                sources before you go.
              </p>
            </div>
            <div className={styles.essGrid}>
              <article className={styles.ess}>
                <p className={styles.essLabel}>Travel documents</p>
                {essentials.documents.map((d) => (
                  <div key={d.id} className={styles.check}>
                    <span className={cx(styles.checkMark, styles[`check_${d.status}`])} aria-hidden="true">
                      {d.status === "done" ? "✓" : d.status === "warning" ? "!" : ""}
                    </span>
                    <p className={styles.essText}>
                      {d.title && <strong>{d.title}</strong>} {d.body}
                    </p>
                  </div>
                ))}
                <Link href="/calendar" className={styles.essLink}>
                  Deadlines added to calendar →
                </Link>
              </article>

              <article className={styles.ess}>
                <p className={styles.essLabel}>Living costs · per person, per day</p>
                <div className={styles.costGrid}>
                  {essentials.costs.map((c) => (
                    <div key={c.tier} className={cx(styles.costTile, c.mine && styles.costMine)}>
                      <p className={styles.costLabel}>{c.label}</p>
                      <p className={styles.costValue}>{c.amount}</p>
                    </div>
                  ))}
                </div>
                <p className={cx(styles.essText, styles.ink2)}>Meals, transport and entry fees by city, from traveller-logged spending. Feeds your trip budget.</p>
                <Link href="/costs" className={styles.essLink}>
                  Set a trip budget →
                </Link>
              </article>

              <article className={styles.ess}>
                <p className={styles.essLabel}>Holidays &amp; events</p>
                {essentials.events.map((n) => (
                  <p key={n.id} className={styles.essText}>
                    <strong>{n.title}</strong> {n.body}
                  </p>
                ))}
              </article>

              <article className={styles.ess}>
                <p className={styles.essLabel}>What travellers say · {essentials.destinationName}</p>
                {essentials.stats.map((s) => (
                  <div key={s.id} className={styles.stat}>
                    <div className={styles.statRow}>
                      <span>{s.label}</span>
                      <strong>{s.value}</strong>
                    </div>
                    <ProgressBar value={s.pct} label={`${s.label}: ${s.value}`} />
                  </div>
                ))}
                <p className={styles.statSource}>{essentials.statsSource}</p>
              </article>

              <article className={cx(styles.ess, styles.essWarn)}>
                <p className={styles.essLabel}>Be aware · health &amp; safety</p>
                {essentials.health.map((n) => (
                  <p key={n.id} className={styles.essText}>
                    <strong>{n.title}</strong> {n.body}
                  </p>
                ))}
                <a href="https://www.smartraveller.gov.au/" target="_blank" rel="noopener noreferrer" className={styles.essLink}>
                  Official travel advice →
                </a>
              </article>

              <article className={styles.ess}>
                <p className={styles.essLabel}>Who else is going</p>
                {essentials.overlaps.map((o) => (
                  <p key={o.id} className={styles.essText}>
                    <strong>{o.lead}</strong>
                    {o.rest}
                  </p>
                ))}
                <Link href="/" className={styles.essLink}>
                  Meet travellers →
                </Link>
              </article>
            </div>
          </section>
        </div>

        <aside className={styles.aside}>
          <section aria-labelledby="ask-h" className={cx(styles.panel, styles.askPanel)}>
            <div>
              <Display id="ask-h" size="sm">
                Ask a friend
              </Display>
              <p className={styles.panelLede}>People you know who’ve been to, or are heading to, {ask.destinationName}.</p>
            </div>
            {ask.friends.map((f) => (
              <div key={f.id} className={styles.friend}>
                <Avatar initials={f.initials} tone={f.tone} fg={f.fg} size={40} />
                <div className={styles.friendText}>
                  <Link href={`/friends/${f.id}`} className={styles.friendName}>
                    {f.name}
                  </Link>
                  <p className={styles.friendMeta}>{f.meta}</p>
                </div>
                <Button variant="secondary" className={styles.askBtn} aria-label={`Ask ${f.name}`}>
                  Ask
                </Button>
              </div>
            ))}
            {ask.lockedCount > 0 && (
              <div className={styles.locked}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.lockIcon}>
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <p className={styles.lockedText}>
                  <strong>{ask.lockedCount} friends-of-friends</strong> have been. Ask a mutual friend for an intro to unlock them.
                </p>
              </div>
            )}
            <Button variant="primary" block>
              Unlock connections
            </Button>
          </section>

          <section id="packing" aria-labelledby="pack-h" className={cx(styles.panel, styles.packPanel)}>
            <div>
              <Display id="pack-h" size="sm">
                What to pack
              </Display>
              <p className={styles.panelLede}>{packing.context}</p>
            </div>
            {packing.items.map((p) => (
              <label key={p.id} className={styles.packItem}>
                <input type="checkbox" defaultChecked={p.packed} className={styles.packBox} />
                <span>
                  <strong className={styles.packLabel}>{p.label}</strong>
                  <br />
                  <span className={styles.sub}>{p.reason}</span>
                </span>
              </label>
            ))}
            <Button variant="secondary" block className={styles.btn14}>
              + Add your own item
            </Button>
          </section>

          <Link href="/costs" className={styles.costCard}>
            <p className={styles.costCardLabel}>Group costs</p>
            <p className={styles.costCardHeadline}>{costs.headline}</p>
            <p className={styles.costCardDetail}>{costs.detail}</p>
          </Link>
        </aside>
      </main>
    </div>
  );
}
