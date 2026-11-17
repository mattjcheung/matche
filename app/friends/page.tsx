import type { Metadata } from "next";
import { Avatar, Button, Display, PageShell } from "@/components";
import { cx } from "@/lib/cx";
import {
  getFriendsMap,
  getFriendTripColumns,
  getVolunteering,
  type FriendTripColumnStage,
} from "@/lib/data/queries/friends";
import { FriendsMap } from "./FriendsMap";
import { Volunteering } from "./Volunteering";
import styles from "./page.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export const metadata: Metadata = {
  title: "Friends",
};

const DOT_CLASS: Record<FriendTripColumnStage, string> = {
  planning: styles.dotPlanning,
  booked: styles.dotBooked,
  completed: styles.dotCompleted,
};

export default async function FriendsPage() {
  await loadDb(needsFor("friends"));
  const map = getFriendsMap();
  const columns = getFriendTripColumns();
  const volunteering = getVolunteering();

  return (
    <PageShell>
      <div className={styles.stack}>
        <FriendsMap data={map} />

        <section aria-labelledby="trips-h" className={styles.section}>
          <div>
            <Display id="trips-h" size="lg">
              Friends’ trips
            </Display>
            <p className={styles.lede}>
              Jump in with a tip, a question or a meetup – especially where you’ve been, or are about to go.
            </p>
          </div>
          <div className={styles.columns}>
            {columns.map((col) => (
              <div key={col.stage} className={styles.column}>
                <div className={styles.columnHead}>
                  <span className={cx(styles.dot, DOT_CLASS[col.stage])} aria-hidden="true" />
                  <h3 className={styles.columnTitle}>{col.title}</h3>
                  <span className={styles.count}>{col.cards.length}</span>
                </div>
                {col.cards.length === 0 && <p className={styles.emptyColumn}>Nothing here yet.</p>}
                {col.cards.map((t) => (
                  <article key={t.id} className={styles.tripCard}>
                    <div className={styles.tripWho}>
                      <Avatar initials={t.initials} tone={t.tone} fg={t.toneFg ?? undefined} size={40} />
                      <div className={styles.tripWhoText}>
                        <p className={styles.tripName}>
                          <strong>{t.name}</strong> · {t.where}
                        </p>
                        <p className={styles.tripWhen}>{t.when}</p>
                      </div>
                    </div>
                    {t.prompt && (
                      <>
                        <p className={cx(styles.hook, styles[`hook_${t.prompt.tone}`])}>{t.prompt.body}</p>
                        <Button variant="secondary" className={styles.hookCta}>
                          {t.prompt.cta}
                        </Button>
                      </>
                    )}
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <Volunteering data={volunteering} />
      </div>
    </PageShell>
  );
}
