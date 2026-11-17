"use client";

import { useState } from "react";
import { Button, Display, Eyebrow, Segmented, Tag } from "@/components";
import type { VolunteeringData } from "@/lib/data/queries/friends";
import styles from "./Volunteering.module.css";

type View = "route" | "need";

const VIEWS = [
  { value: "route", label: "On your route" },
  { value: "need", label: "Where help is needed" },
] as const;

export function Volunteering({ data }: { data: VolunteeringData }) {
  const [view, setView] = useState<View>("route");
  const current = data[view];

  return (
    <section aria-labelledby="vol-h" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <Eyebrow tone="onDark">Give back while you travel</Eyebrow>
          <Display id="vol-h" size="xl" className={styles.title}>
            Volunteering opportunities
          </Display>
          <p className={styles.intro}>{current.intro}</p>
        </div>
        <Segmented<View> label="Volunteering view" options={VIEWS} value={view} onChange={setView} theme="dark" size="md" />
      </div>

      {current.cards.length > 0 ? (
        <div className={styles.grid}>
          {current.cards.map((v) => (
            <article key={v.id} className={styles.card}>
              <Tag bg={v.tone} fg="var(--color-ink)" className={styles.tag}>
                {v.tag}
              </Tag>
              <p className={styles.cardTitle}>{v.title}</p>
              <p className={styles.meta}>{v.where}</p>
              <p className={styles.meta}>{v.commitment}</p>
              {v.fit && <p className={styles.fit}>{v.fit}</p>}
              <Button variant="inverse" block className={styles.cta}>
                {v.cta}
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nothing listed here yet – check back closer to your trip.</p>
      )}

      <p className={styles.note}>
        Every organisation is checked before it’s listed. Matche doesn’t list placements in orphanages or roles that
        need qualifications you don’t have.
      </p>
    </section>
  );
}
