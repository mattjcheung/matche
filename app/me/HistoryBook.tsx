"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components";
import { cx } from "@/lib/cx";
import type { HistoryChapter } from "@/lib/data/queries/me";
import styles from "./HistoryBook.module.css";

export interface HistoryBookProps {
  chapters: HistoryChapter[];
  /** "Japan with the crew · 29 Mar 2027", or null when nothing is planned. */
  nextChapter: { label: string; href: string } | null;
}

/** Travel history book: one chapter per completed trip, oldest to newest. */
export function HistoryBook({ chapters, nextChapter }: HistoryBookProps) {
  const [index, setIndex] = useState(chapters.length - 1);
  const ch = chapters[index];
  const count = chapters.length;
  const first = index === 0;
  const last = index === count - 1;

  return (
    <section aria-labelledby="book-h" className={styles.section}>
      <div className={styles.head}>
        <div>
          <h2 id="book-h" className={styles.title}>
            Travel history book
          </h2>
          <p className={styles.lede}>Every trip, oldest to newest. Pick a chapter or flip through.</p>
        </div>
        {ch && (
          <p className={styles.counter} aria-live="polite">
            Chapter {index + 1} of {count}
          </p>
        )}
      </div>

      {ch && (
        <>
          <nav aria-label="Trips in order" className={styles.tabsNav}>
            <ol className={styles.tabs}>
              {chapters.map((c, k) => (
                <li key={c.tripId}>
                  <button
                    type="button"
                    className={cx(styles.tab, k === index && styles.tabCurrent)}
                    aria-current={k === index ? "step" : undefined}
                    onClick={() => setIndex(k)}
                  >
                    <span className={styles.tabYear}>{c.year}</span>
                    <span className={styles.tabName}>{c.shortTitle}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <article className={styles.chapter} aria-label={`Chapter ${index + 1}: ${ch.title}`}>
            <div className={styles.cover} style={{ background: ch.coverTone }}>
              <span className={styles.chapterTag}>Chapter {index + 1}</span>
              <div>
                <p className={styles.coverDates}>{ch.dates}</p>
                <h3 className={styles.coverTitle}>{ch.title}</h3>
                <p className={styles.coverRoute}>{ch.route}</p>
                <p className={styles.coverCaption}>[Cover photo]</p>
              </div>
            </div>

            <div className={styles.body}>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <p className={styles.statValue}>{ch.nights}</p>
                  <p className={styles.statLabel}>nights</p>
                </div>
                <div className={styles.stat}>
                  <p className={styles.statValue}>{ch.entries}</p>
                  <p className={styles.statLabel}>journal entries</p>
                </div>
                <div className={styles.stat}>
                  <p className={styles.statValue}>{ch.rating}</p>
                  <p className={styles.statLabel}>your rating</p>
                </div>
              </div>
              <p className={styles.with}>With {ch.with}</p>
              <blockquote className={styles.quote}>
                {ch.quote}
                <br />
                <span className={styles.quoteSource}>– your journal, {ch.quoteDay}</span>
              </blockquote>
              <div className={styles.photos}>
                {ch.photoTones.map((tone, k) => (
                  <div key={k} className={styles.photo} style={{ background: tone }} role="img" aria-label={`Photo ${k + 1} from ${ch.shortTitle}`} />
                ))}
              </div>
              <div className={styles.actions}>
                <Link href="/recap" className={cx(styles.linkButton, styles.recap)}>
                  Watch recap
                </Link>
                <Link href="/journal" className={cx(styles.linkButton, styles.journal)}>
                  Read journal
                </Link>
                <div className={styles.pager}>
                  <button
                    type="button"
                    className={styles.pageButton}
                    aria-label="Previous trip"
                    aria-disabled={first}
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  >
                    <Icon name="chevron-left" size={18} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className={styles.pageButton}
                    aria-label="Next trip"
                    aria-disabled={last}
                    onClick={() => setIndex((i) => Math.min(count - 1, i + 1))}
                  >
                    <Icon name="chevron-right" size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </>
      )}

      {nextChapter && (
        <Link href={nextChapter.href} className={styles.next}>
          <span className={styles.nextText}>
            <strong>Next chapter:</strong> {nextChapter.label}
          </span>
          <span className={styles.nextCta}>Open trip →</span>
        </Link>
      )}
    </section>
  );
}
