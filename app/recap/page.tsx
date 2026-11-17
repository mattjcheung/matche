import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Card, Display, Eyebrow, MobileShell, Muted, PlayDisc, StatTile } from "@/components";
import { getTripRecap } from "@/lib/data/queries/ontrip";
import { getActiveTrip } from "@/lib/data/queries/trips";
import { RecapStyle } from "./RecapStyle";
import styles from "./page.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export const metadata: Metadata = { title: "Trip recap" };

export default async function RecapPage() {
  await loadDb(needsFor("ontrip", "trips"));
  const trip = getActiveTrip();
  const r = getTripRecap(trip.id);
  if (!r) notFound();

  return (
    <MobileShell>
      <div>
        <Eyebrow className={styles.eyebrow}>Trip complete</Eyebrow>
        <Display as="h1" size="md" className={styles.title}>
          Your {r.country} recap is ready
        </Display>
      </div>

      <div className={styles.player} style={{ ["--recap-tone" as string]: r.coverTone }}>
        <div className={styles.playerTop}>
          <span className={styles.playerChip}>
            {r.duration} · {r.template === "basic" ? "Basic" : "Upbeat"} template
          </span>
          <span className={styles.playerCaption}>[Video preview]</span>
        </div>
        <PlayDisc size={72} label="Play recap" />
        <div className={styles.playerBottom}>
          <p className={styles.playerTitle}>{r.tripName}</p>
          <p className={styles.playerDates}>{r.dates}</p>
        </div>
      </div>

      <p className={styles.note}>
        Made from the {r.sourceEntries} shared journal entries your group reacted to most. Private entries are never included.
      </p>

      <RecapStyle initial={r.template} />

      <div className={styles.stats}>
        <StatTile align="center" size="sm" value={r.nights} label="nights" />
        <StatTile align="center" size="sm" value={r.places} label="places" />
        <StatTile align="center" size="sm" value={r.entries} label="entries" />
      </div>

      <Card as="section" aria-labelledby="rate-h" padding="sm" radius="lg" gap={10}>
        <h2 id="rate-h" className={styles.rateHeading}>
          Rate the trip to help others plan
        </h2>
        <Muted size={13}>Feeds the cost, enjoyment and safety stats travellers see.</Muted>
        <Button variant="secondary" block className={styles.smallButton}>
          Add a quick review
        </Button>
      </Card>

      <div className={styles.ctas}>
        <Button size="lg" block>
          Share to friends
        </Button>
        <Button size="lg" variant="secondary" block>
          Submit to featured recaps
        </Button>
      </div>
    </MobileShell>
  );
}
