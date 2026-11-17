import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, Button, Card, Display, Eyebrow, Icon, MediaPlaceholder, MobileShell, Muted } from "@/components";
import { getJournalDay, listGroupEntries, listTripCompanions } from "@/lib/data/queries/ontrip";
import { getActiveTrip } from "@/lib/data/queries/trips";
import { cx } from "@/lib/cx";
import { EntryComposer } from "./EntryComposer";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Trip journal" };

export default function JournalPage() {
  const trip = getActiveTrip();
  const day = getJournalDay(trip.id);
  const entries = listGroupEntries(trip.id);
  const companions = listTripCompanions(trip.id);

  const header = (
    <>
      <div className={styles.titleRow}>
        <div>
          <Eyebrow className={styles.eyebrow}>
            Day {day.dayNumber} · {day.place}
          </Eyebrow>
          <Display as="h1" size="md" className={styles.title}>
            {day.title}
          </Display>
        </div>
        <Link href="/calendar" aria-label="Open calendar" className={styles.calendarLink}>
          <Icon name="calendar" />
        </Link>
      </div>
      <ol className={styles.days} aria-label="Trip days">
        {day.days.map((d) => (
          <li key={d.iso} className={cx(styles.day, styles[`day_${d.state}`])} aria-current={d.state === "today" ? "date" : undefined}>
            <span className={styles.dayWd}>{d.weekday}</span>
            <span className={styles.dayN}>{d.n}</span>
            <span className={cx(styles.dayDot, d.hasEntry && d.state !== "future" && styles.dayDotOn)} aria-hidden="true" />
            {d.hasEntry && d.state !== "future" && <span className="visually-hidden">, has journal entries</span>}
          </li>
        ))}
      </ol>
    </>
  );

  return (
    <MobileShell header={header}>
      <EntryComposer companions={companions} />

      <h2 className={styles.groupHeading}>Today from the group</h2>
      {entries.map((e) => (
        <Card as="article" key={e.id} padding="sm" radius="lg" gap={10}>
          <div className={styles.entryHead}>
            <Avatar initials={e.author.initials} tone={e.author.tone} fg={e.author.fg} size={34} />
            <div>
              <p className={styles.entryName}>{e.author.name}</p>
              <Muted size={12}>{e.time}</Muted>
            </div>
          </div>
          {e.photoTone && <MediaPlaceholder tone={e.photoTone} height={120} radius={12} />}
          <p className={styles.entryBody}>{e.body}</p>
          <div className={styles.entryActions}>
            <Button variant="pill" size="sm" className={styles.smallPill}>
              ♥ {e.likes}
            </Button>
            <Button variant="pill" size="sm" className={styles.smallPill}>
              Reply · {e.replies}
            </Button>
          </div>
        </Card>
      ))}
    </MobileShell>
  );
}
