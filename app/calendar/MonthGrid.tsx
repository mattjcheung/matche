"use client";

import { useState } from "react";
import { Display, Eyebrow, Icon, IconButton } from "@/components";
import type { CalendarMonthVM } from "@/lib/data/queries/calendar";
import { cx } from "@/lib/cx";
import styles from "./page.module.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthGrid({ tripName, months, initial }: { tripName: string; months: CalendarMonthVM[]; initial: number }) {
  const [i, setI] = useState(initial);
  const month = months[i];
  if (!month) return null;

  return (
    <>
      <div className={styles.calHead}>
        <div>
          <Eyebrow className={styles.eyebrow}>{tripName}</Eyebrow>
          <Display as="h1" size="page" id="cal-h">
            <span aria-live="polite">{month.label}</span>
          </Display>
        </div>
        <div className={styles.monthNav}>
          <IconButton aria-label="Previous month" disabled={i === 0} onClick={() => setI(i - 1)} className={styles.navButton}>
            <Icon name="chevron-left" size={18} strokeWidth={2} />
          </IconButton>
          <IconButton aria-label="Next month" disabled={i === months.length - 1} onClick={() => setI(i + 1)} className={styles.navButton}>
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </IconButton>
        </div>
      </div>

      <div className={styles.gridWrap}>
        <div className={styles.grid}>
          <div className={styles.weekdays} aria-hidden="true">
            {WEEKDAYS.map((w) => (
              <div key={w} className={styles.weekday}>
                {w}
              </div>
            ))}
          </div>
          <div className={styles.cells}>
            {month.cells.map((c, k) => (
              <div key={c.iso ?? `blank-${k}`} className={cx(styles.cell, !c.iso && styles.cellEmpty)}>
                {c.day && (
                  <div className={styles.cellTop}>
                    <span className={styles.cellNum}>{c.day}</span>
                    {c.journal && <span className={styles.journalDot} title="Journal entry" aria-label="Journal entry" role="img" />}
                  </div>
                )}
                {c.stay && <div className={cx(styles.stay, c.stay.booked ? styles.stayBooked : styles.stayHoped)}>{c.stay.label}</div>}
                {c.chips.map((ch, n) => (
                  <div key={n} className={cx(styles.chip, styles[`chip_${ch.kind}`])}>
                    {ch.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
