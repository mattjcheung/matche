"use client";

import { useState } from "react";
import { Button, Card, Display, Muted } from "@/components";
import type { PairwiseDebt } from "@/lib/data/queries/costs";
import styles from "./page.module.css";

/**
 * Person-to-person balances with "mark as paid/received".
 * TODO(data): marking settled should insert a `settlements` row.
 */
export function SettleUp({ debts }: { debts: PairwiseDebt[] }) {
  const [settled, setSettled] = useState<string[]>([]);
  const [nudged, setNudged] = useState<string[]>([]);
  const open = debts.filter((d) => !settled.includes(d.personId));

  return (
    <Card as="section" aria-labelledby="bal-h" padding="lg" gap={14}>
      <Display as="h2" size="sm" id="bal-h">
        Settle up
      </Display>
      {open.map((d) =>
        d.amount_cents > 0 ? (
          <div key={d.personId} className={`${styles.debt} ${styles.debtIn}`}>
            <p className={styles.debtText}>
              <strong>{d.name}</strong> owes you <strong>{d.label}</strong>
            </p>
            <div className={styles.debtActions}>
              <Button variant="outline" size="md" className={styles.debtButton} disabled={nudged.includes(d.personId)} onClick={() => setNudged((n) => [...n, d.personId])}>
                {nudged.includes(d.personId) ? "Nudge sent" : "Send a nudge"}
              </Button>
              <Button size="md" className={styles.debtButton} onClick={() => setSettled((s) => [...s, d.personId])}>
                Mark as received
              </Button>
            </div>
          </div>
        ) : (
          <div key={d.personId} className={`${styles.debt} ${styles.debtOut}`}>
            <p className={styles.debtText}>
              You owe{" "}
              <strong>
                {d.name} {d.label}
              </strong>
            </p>
            <Button variant="accent" size="md" className={`${styles.debtButton} ${styles.alignStart}`} onClick={() => setSettled((s) => [...s, d.personId])}>
              Mark as paid
            </Button>
          </div>
        ),
      )}
      {open.length === 0 && <p className={styles.debtText}>You’re all square with everyone.</p>}
      <Muted size={13}>Shown person-to-person. Switch on “simplify debts” to settle the group in the fewest transfers.</Muted>
    </Card>
  );
}
