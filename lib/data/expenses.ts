import type { Expense, ExpenseSplit } from "./types";

export const expenses: Expense[] = [
  { id: "exp_flights", trip_id: "trip_japan", description: "Return flights MEL ⇄ Japan", category: "Getting around", spent_on: "2026-10-12", amount_cents: 360000, currency: "AUD", paid_by: "matthew" },
  { id: "exp_shinjuku", trip_id: "trip_japan", description: "Shinjuku hotel, 5 nights", category: "Stays", spent_on: "2026-10-20", amount_cents: 300000, currency: "AUD", paid_by: "sophie" },
  { id: "exp_kyoto", trip_id: "trip_japan", description: "Kyoto townhouse, 5 nights", category: "Stays", spent_on: "2026-10-28", amount_cents: 302400, currency: "AUD", paid_by: "jordan" },
  { id: "exp_jrpass", trip_id: "trip_japan", description: "Japan Rail Passes ×3", category: "Getting around", spent_on: "2026-11-02", amount_cents: 150000, currency: "AUD", paid_by: "jordan" },
  { id: "exp_teamlab", trip_id: "trip_japan", description: "teamLab tickets ×3", category: "Activities", spent_on: "2026-11-04", amount_cents: 18600, currency: "AUD", paid_by: "matthew" },
  { id: "exp_dinner", trip_id: "trip_japan", description: "Welcome dinner deposit", category: "Food", spent_on: "2026-11-05", amount_cents: 45000, currency: "AUD", paid_by: "matthew" },
];

/** Every expense above is split equally between the three Japan travellers. */
const japanCrew = ["matthew", "sophie", "jordan"];
export const expenseSplits: ExpenseSplit[] = expenses.flatMap((e) =>
  japanCrew.map((user_id) => ({
    expense_id: e.id,
    user_id,
    amount_cents: Math.round(e.amount_cents / japanCrew.length),
  })),
);
