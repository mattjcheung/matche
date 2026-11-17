import type { Metadata } from "next";
import { Button, Card, Display, Eyebrow, Muted, PageShell, StatTile } from "@/components";
import { getCostSummary } from "@/lib/data/queries/costs";
import { getActiveTrip } from "@/lib/data/queries/trips";
import { ExpenseTable } from "./ExpenseTable";
import { SettleUp } from "./SettleUp";
import styles from "./page.module.css";
import { loadDb } from "@/lib/data/db";
import { needsFor } from "@/lib/data/queries/needs";

export const metadata: Metadata = { title: "Cost tracker" };

/** Bar colours for "Where the money went", in category order. */
const CATEGORY_COLORS = ["var(--color-primary)", "var(--color-primary-mid)", "var(--color-accent)", "var(--color-ink)", "var(--color-ink-placeholder)"];

export default async function CostsPage() {
  await loadDb(needsFor("costs", "trips"));
  const trip = getActiveTrip();
  const c = getCostSummary(trip.id);

  return (
    <PageShell>
      <div className={styles.head}>
        <div>
          <Eyebrow className={styles.eyebrow}>{trip.name}</Eyebrow>
          <Display as="h1" size="page">
            Cost tracker
          </Display>
          <Muted className={styles.lede}>
            Matche never moves money. Log who paid for what, see who owes whom, then settle up however you like and mark it done.
          </Muted>
        </div>
        <Button size="lg">+ Add expense</Button>
      </div>

      <section aria-label="Summary" className={styles.summary}>
        <StatTile labelFirst tone="primary" size="lg" label="Owed to you" value={c.owedToYou?.total ?? "A$0"} note={c.owedToYou ? `from ${c.owedToYou.from}` : "All square"} />
        <StatTile labelFirst tone="accent" size="lg" label="You owe" value={c.youOwe?.total ?? "A$0"} note={c.youOwe ? `to ${c.youOwe.to}` : "All square"} />
        <StatTile labelFirst size="lg" label="Group spend so far" value={c.groupSpend} note={`${c.expenseCount} expenses · split ${c.splitWays} ways`} />
        <StatTile labelFirst size="lg" label="Your share vs budget" value={c.yourShare} note="of [A$ budget] · on-trip estimate from living costs" />
      </section>

      <div className={styles.split}>
        <section aria-labelledby="exp-h" className={styles.primary}>
          <ExpenseTable rows={c.expenses} />
        </section>

        <aside className={styles.secondary}>
          <SettleUp debts={c.debts} />

          <Card as="section" aria-labelledby="net-h" padding="lg" gap={14}>
            <h2 id="net-h" className={styles.smallHeading}>
              Group balances
            </h2>
            {c.balances.map((b) => (
              <div key={b.id} className={styles.balance}>
                <div className={styles.balanceTop}>
                  <span>{b.name}</span>
                  <strong className={b.net_cents < 0 ? styles.neg : styles.pos}>{b.label}</strong>
                </div>
                <div className={styles.balanceBar} role="img" aria-label={`${b.name}: ${b.label}`}>
                  <div className={styles.balanceLeft}>
                    {b.net_cents < 0 && <div className={styles.barNeg} style={{ width: `${b.pct}%` }} />}
                  </div>
                  <div className={styles.balanceRight}>
                    {b.net_cents > 0 && <div className={styles.barPos} style={{ width: `${b.pct}%` }} />}
                  </div>
                </div>
              </div>
            ))}
            <Muted size={13}>Left of the line: paid less than their share. Right: paid more.</Muted>
          </Card>

          <Card as="section" aria-labelledby="cat-h" padding="lg" gap={12}>
            <h2 id="cat-h" className={styles.smallHeading}>
              Where the money went
            </h2>
            <div className={styles.stack} aria-hidden="true">
              {c.categories.map((cat, i) => (
                <div key={cat.name} style={{ width: `${cat.pct}%`, background: CATEGORY_COLORS[i] }} />
              ))}
            </div>
            {c.categories.map((cat, i) => (
              <div key={cat.name} className={styles.catRow}>
                <span className={styles.catName}>
                  <span className={styles.swatch} style={{ background: CATEGORY_COLORS[i] }} aria-hidden="true" />
                  {cat.name}
                </span>
                <strong className="tabular">{cat.total}</strong>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
