import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Button, Card, Display, Eyebrow, MediaPlaceholder, PageShell } from "@/components";
import { cx } from "@/lib/cx";
import {
  getFriendProfile,
  getFriendsAroundTheWorld,
  getTravelGroupsForNextTrip,
} from "@/lib/data/queries/profile";
import styles from "./page.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export async function generateMetadata({ params }: PageProps<"/friends/[id]">): Promise<Metadata> {
  await loadDb(needsFor("profile"));
  const { id } = await params;
  const profile = getFriendProfile(id);
  return { title: profile ? `${profile.shortName}’s profile` : "Friend not found" };
}

export default async function FriendProfilePage({ params }: PageProps<"/friends/[id]">) {
  await loadDb(needsFor("profile"));
  const { id } = await params;
  const profile = getFriendProfile(id);
  if (!profile) notFound();

  const world = getFriendsAroundTheWorld(undefined, { exclude: profile.id });
  const groups = getTravelGroupsForNextTrip();
  const { common, journal } = profile;

  return (
    <PageShell row>
      <div className={styles.primary}>
        <Link href="/friends" className={styles.back}>
          ← All friends
        </Link>

        <section aria-labelledby="name-h" className={styles.hero}>
          <div className={styles.heroTop}>
            <span
              className={styles.bigAvatar}
              style={{ background: profile.tone, color: profile.toneFg ?? undefined }}
              aria-hidden="true"
            >
              {profile.initials}
            </span>
            <div className={styles.heroText}>
              <h1 id="name-h" className={styles.name}>
                {profile.name}
              </h1>
              <p className={styles.intro}>{profile.intro}</p>
            </div>
            <div className={styles.heroActions}>
              <Button variant="secondary" className={styles.heroButton}>
                Message
              </Button>
              <Button variant="primary" className={styles.heroButton}>
                Ask about a place
              </Button>
            </div>
          </div>
          <div className={styles.stats}>
            {profile.stats.map((s) => (
              <div key={s.label} className={cx(styles.stat, s.highlight && styles.statHighlight)}>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="common-h" className={styles.section}>
          <Display id="common-h" size="md">
            You and {profile.shortName}
          </Display>
          <div className={styles.commonGrid}>
            <div className={styles.commonCard}>
              <p className={styles.commonTitle}>You’ve both been to</p>
              {common.bothBeen.length > 0 ? (
                <ul className={styles.chips}>
                  {common.bothBeen.map((r) => (
                    <li key={r} className={styles.chip}>
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.none}>No places in common yet.</p>
              )}
            </div>
            <div className={styles.commonCard}>
              <p className={styles.commonTitle}>{profile.shortName}’s been where you’re planning</p>
              {common.beenWherePlanning.length > 0 ? (
                <ul className={styles.chips}>
                  {common.beenWherePlanning.map((r) => (
                    <li key={r} className={cx(styles.chip, styles.chipAccent)}>
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.none}>None of your planned places yet.</p>
              )}
              {common.askAbout && (
                <button type="button" className={styles.textLink}>
                  Ask {profile.shortName} about {common.askAbout} →
                </button>
              )}
            </div>
            <div className={styles.commonCard}>
              <p className={styles.commonTitle}>You’re both planning</p>
              {common.bothPlanning.length > 0 ? (
                <ul className={styles.chips}>
                  {common.bothPlanning.map((p) => (
                    <li key={p.label} className={cx(styles.chip, styles.chipPrimary)}>
                      {p.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.none}>No overlapping plans yet.</p>
              )}
              {common.sharedTripHref && (
                <Link href={common.sharedTripHref} className={styles.textLink}>
                  Open shared trip →
                </Link>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="journal-h" className={styles.section}>
          <div>
            <Display id="journal-h" size="md">
              {journal.title}
            </Display>
            <p className={styles.sub}>{journal.subtitle}</p>
          </div>
          {journal.entries.length > 0 ? (
            <div className={styles.entries}>
              {journal.entries.map((e) => (
                <article key={e.id} className={styles.entry}>
                  <MediaPlaceholder tone={e.tone} height={170} radius={0} caption={e.caption} />
                  <div className={styles.entryBody}>
                    <p className={styles.entryDay}>{e.dayLabel}</p>
                    <p className={styles.entryText}>{e.body}</p>
                    <p className={styles.entryMeta}>
                      <span aria-hidden="true">♥</span>
                      <span className={styles.srOnly}>Likes:</span> {e.likes} · {e.replies} replies
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.emptyJournal}>{profile.shortName} hasn’t shared any public journal entries yet.</p>
          )}
        </section>
      </div>

      <aside className={styles.secondary}>
        <Card as="section" aria-labelledby="world-h" padding="lg" radius="xl" gap={14}>
          <Display id="world-h" size="sm">
            Friends around the world
          </Display>
          {world.map((w) => (
            <div key={w.id} className={styles.worldRow}>
              <Avatar initials={w.initials} tone={w.tone} fg={w.toneFg ?? undefined} size={40} />
              <div className={styles.worldText}>
                <p className={styles.worldName}>
                  <strong>{w.name}</strong> · {w.where}
                </p>
                <p className={styles.worldStatus}>{w.status}</p>
              </div>
            </div>
          ))}
        </Card>

        <Card as="section" aria-labelledby="meet-h" tone="dark" padding="lg" radius="xl" gap={14}>
          <div>
            <Eyebrow tone="onDark" className={styles.meetEyebrow}>
              Meet travellers
            </Eyebrow>
            <Display id="meet-h" size="sm" className={styles.meetTitle}>
              Groups for your upcoming stops
            </Display>
          </div>
          {groups.length > 0 ? (
            groups.map((g) => (
              <div key={g.id} className={styles.group}>
                <div className={styles.groupText}>
                  <p className={styles.groupName}>{g.name}</p>
                  <p className={styles.groupMeta}>{g.meta}</p>
                </div>
                <Button variant="inverse" className={styles.join} aria-label={`Join ${g.name}`}>
                  Join
                </Button>
              </div>
            ))
          ) : (
            <p className={styles.groupMeta}>No groups for your next trip yet.</p>
          )}
          <p className={styles.groupNote}>Only your first name and travel dates are shown. Meet in public places.</p>
        </Card>
      </aside>
    </PageShell>
  );
}
