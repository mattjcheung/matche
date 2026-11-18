import type { Metadata } from "next";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { ButtonLink, Display, Eyebrow, Icon, LogoMark, Muted } from "@/components";
import { Tour } from "./_landing/Tour";
import styles from "./_landing/landing.module.css";

export const metadata: Metadata = {
  title: { absolute: "Matche – Every booking, idea and friend for your trip, in one place" },
  description:
    "Matche gathers your bookings, splits costs with your travel crew, keeps a shared trip journal and shows you which friends have been where you’re going.",
};

/**
 * Public landing page. Static: no account data is read here, so it renders
 * without a session. The interactive tour uses its own sample data.
 */
export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="Matche home">
            <LogoMark />
            <span className={styles.wordmark}>Matche</span>
          </Link>
          <nav aria-label="Landing" className={styles.headerNav}>
            <a href="#tour" className={`${styles.navLink} ${styles.hideOnPhone}`}>
              How it works
            </a>
            <Show when="signed-out">
              <Link href="/sign-in" className={styles.navLink}>
                Sign in
              </Link>
              <ButtonLink href="/sign-up" size="md">
                Get started
              </ButtonLink>
            </Show>
            <Show when="signed-in">
              <ButtonLink href="/home" size="md">
                Open Matche
              </ButtonLink>
            </Show>
          </nav>
        </div>
      </header>

      <main>
        {/* ------------------------------------------------------------ Hero */}
        <section aria-labelledby="hero-h" className={styles.hero}>
          <div className={styles.heroText}>
            <Eyebrow>Your all-in-one travel hub</Eyebrow>
            <Display as="h1" size="hero" id="hero-h">
              Every booking, every idea, every friend who’s been there. One place.
            </Display>
            <p className={styles.heroLede}>
              Plan the trip together, keep every confirmation in one timeline, split costs without the awkward maths, and come home with a
              journal and a recap film you’ll actually want to share.
            </p>
            <div className={styles.heroActions}>
              <Show when="signed-out">
                <ButtonLink href="/sign-up" size="xl" icon={<Icon name="plus" strokeWidth={2} />}>
                  Start your first trip
                </ButtonLink>
              </Show>
              <Show when="signed-in">
                <ButtonLink href="/home" size="xl">
                  Open Matche
                </ButtonLink>
              </Show>
              <ButtonLink href="#tour" size="xl" variant="secondary">
                Take the tour
              </ButtonLink>
            </div>
          </div>

          <div className={styles.heroCard} aria-hidden="true">
            <p className={styles.heroCardEyebrow}>Next trip · in 140 days</p>
            <p className={styles.heroCardTitle}>Japan with the crew</p>
            <p className={styles.heroCardMeta}>29 Mar – 14 Apr · Tokyo → Hakone → Kyoto → Osaka</p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>9</span>
                <span>bookings filed</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>3</span>
                <span>friends going</span>
              </div>
              <div className={`${styles.heroStat} ${styles.heroStatWarm}`}>
                <span className={styles.heroStatValue}>A$412</span>
                <span>owed to you</span>
              </div>
            </div>
            <ul className={styles.heroChips}>
              <li>Airline email</li>
              <li>Hotel booking site</li>
              <li>Rail pass receipt</li>
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------------ Tour */}
        <section id="tour" aria-labelledby="tour-h" className={styles.tourSection}>
          <div className={styles.sectionHead}>
            <Eyebrow>How it works</Eyebrow>
            <Display as="h2" size="lg" id="tour-h">
              One trip, from first idea to the recap
            </Display>
            <Muted className={styles.sectionLede}>Try each step – everything below is a working sample, nothing is saved.</Muted>
          </div>
          <Tour />
        </section>

        {/* ------------------------------------------------------------ Phases */}
        <section aria-labelledby="phases-h" className={styles.phases}>
          <Display as="h2" size="lg" id="phases-h" className={styles.visuallyHiddenHeading}>
            Before, during and after
          </Display>
          {PHASES.map((p) => (
            <article key={p.title} className={styles.phase}>
              <span className={styles.phaseIcon}>
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className={styles.phaseTitle}>{p.title}</h3>
              <p className={styles.phaseBody}>{p.body}</p>
            </article>
          ))}
        </section>

        {/* ------------------------------------------------------------ CTA */}
        <section aria-labelledby="cta-h" className={styles.cta}>
          <Display as="h2" size="xl" id="cta-h">
            Where to next?
          </Display>
          <p className={styles.ctaBody}>Pick a place, a rough time and who’s coming. Matche does the gathering.</p>
          <Show when="signed-out">
            <ButtonLink href="/sign-up" size="xl" variant="inverse">
              Start your first trip
            </ButtonLink>
          </Show>
          <Show when="signed-in">
            <ButtonLink href="/trips/new" size="xl" variant="inverse">
              Start a trip
            </ButtonLink>
          </Show>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© 2026 Matche</span>
        <Link href="/sign-in">Sign in</Link>
      </footer>
    </div>
  );
}

const PHASES = [
  {
    icon: "calendar",
    title: "Before",
    body: "Visas, passport deadlines, events and a starter itinerary – gathered the moment you name a place.",
  },
  {
    icon: "journal",
    title: "During",
    body: "A shared journal tagged with the day and place. Private when you want it, shared when you don’t.",
  },
  {
    icon: "film",
    title: "After",
    body: "Costs settled, a recap film made from the moments your group loved, and a review that helps the next traveller.",
  },
] as const;
