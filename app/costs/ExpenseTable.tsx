"use client";

import { useState } from "react";
import { Avatar, ChipToggle, Display } from "@/components";
import type { ExpenseRowVM } from "@/lib/data/queries/costs";
import styles from "./page.module.css";

type Filter = "everyone" | "paid" | "involves";
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "everyone", label: "Everyone" },
  { id: "paid", label: "Paid by me" },
  { id: "involves", label: "Involves me" },
];

export function ExpenseTable({ rows }: { rows: ExpenseRowVM[] }) {
  const [filter, setFilter] = useState<Filter>("everyone");
  const visible = rows.filter((r) => (filter === "paid" ? r.paidByMe : filter === "involves" ? r.involvesMe : true));

  return (
    <>
      <div className={styles.tableHead}>
        <Display as="h2" size="md" id="exp-h">
          Expenses
        </Display>
        <div role="group" aria-label="Filter by person" className={styles.filters}>
          {FILTERS.map((f) => (
            <ChipToggle key={f.id} size="sm" selected={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </ChipToggle>
          ))}
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Expense</th>
              <th scope="col">Paid by</th>
              <th scope="col">Split</th>
              <th scope="col" className={styles.num}>Total</th>
              <th scope="col" className={styles.num}>Your share</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong className={styles.expName}>{e.description}</strong>
                  <br />
                  <span className={styles.expMeta}>
                    {e.category} · {e.date}
                  </span>
                </td>
                <td>
                  <span className={styles.payer}>
                    <Avatar initials={e.payer.initials} tone={e.payer.tone} size={28} />
                    {e.payer.name}
                  </span>
                </td>
                <td className={styles.splitCell}>{e.splitLabel}</td>
                <td className={`${styles.num} ${styles.total}`}>{e.total}</td>
                <td className={styles.num}>{e.yourShare}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>
                  No expenses match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
