import { formatDayMonth, formatMoney } from "@/lib/format";
import { expenseSplits, expenses } from "../expenses";
import type { CurrencyCode, ExpenseCategory } from "../types";
import { CURRENT_USER_ID, getUser } from "../users";
import { getTripMembers } from "./trips";

/**
 * Cost-tracker maths. Everything is derived from `expenses` + `expense_splits`
 * so it stays correct when rows come from the database.
 */

export interface ExpenseRowVM {
  id: string;
  description: string;
  category: ExpenseCategory;
  date: string;
  payer: { id: string; name: string; initials: string; tone: string };
  splitLabel: string;
  total: string;
  yourShare: string;
  paidByMe: boolean;
  involvesMe: boolean;
}

export interface PairwiseDebt {
  /** The other person. */
  personId: string;
  name: string;
  /** >0: they owe you. <0: you owe them. */
  amount_cents: number;
  label: string;
}

export interface CostSummaryVM {
  currency: CurrencyCode;
  expenses: ExpenseRowVM[];
  owedToYou: { total: string; from: string } | null;
  youOwe: { total: string; to: string } | null;
  groupSpend: string;
  expenseCount: number;
  splitWays: number;
  yourShare: string;
  debts: PairwiseDebt[];
  balances: Array<{ id: string; name: string; label: string; net_cents: number; pct: number }>;
  categories: Array<{ name: ExpenseCategory; total: string; pct: number }>;
}

const CATEGORY_ORDER: ExpenseCategory[] = ["Stays", "Getting around", "Food", "Activities", "Other"];

export function getCostSummary(tripId: string, me: string = CURRENT_USER_ID): CostSummaryVM {
  const rows = expenses.filter((e) => e.trip_id === tripId).sort((a, b) => (a.spent_on < b.spent_on ? -1 : 1));
  const currency = rows[0]?.currency ?? "AUD";
  const members = getTripMembers(tripId);
  const splitsFor = (id: string) => expenseSplits.filter((s) => s.expense_id === id);
  const fmt = (c: number, signed = false) => formatMoney(c, currency, { signed });

  // Net position per person: paid − share.
  const net: Record<string, number> = Object.fromEntries(members.map((m) => [m.id, 0]));
  // Pairwise: owes[a][b] = amount a owes b (before netting).
  const owes: Record<string, Record<string, number>> = {};
  const addOwe = (a: string, b: string, c: number) => {
    owes[a] ??= {};
    owes[a][b] = (owes[a][b] ?? 0) + c;
  };

  for (const e of rows) {
    net[e.paid_by] = (net[e.paid_by] ?? 0) + e.amount_cents;
    for (const s of splitsFor(e.id)) {
      net[s.user_id] = (net[s.user_id] ?? 0) - s.amount_cents;
      if (s.user_id !== e.paid_by) addOwe(s.user_id, e.paid_by, s.amount_cents);
    }
  }

  const debts: PairwiseDebt[] = members
    .filter((m) => m.id !== me)
    .map((m) => {
      const theyOweMe = (owes[m.id]?.[me] ?? 0) - (owes[me]?.[m.id] ?? 0);
      return {
        personId: m.id,
        name: m.short_name,
        amount_cents: theyOweMe,
        label: fmt(Math.abs(theyOweMe)),
      };
    })
    .filter((d) => d.amount_cents !== 0);

  const owedToMe = debts.filter((d) => d.amount_cents > 0);
  const iOwe = debts.filter((d) => d.amount_cents < 0);
  const join = (names: string[]) => (names.length <= 1 ? names[0] ?? "" : `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`);

  const total = rows.reduce((s, e) => s + e.amount_cents, 0);
  const myShare = rows.reduce((s, e) => s + (splitsFor(e.id).find((x) => x.user_id === me)?.amount_cents ?? 0), 0);
  const maxAbs = Math.max(1, ...Object.values(net).map(Math.abs));

  const byCat = new Map<ExpenseCategory, number>();
  for (const e of rows) byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount_cents);

  return {
    currency,
    expenses: rows.map((e) => {
      const payer = getUser(e.paid_by);
      const splits = splitsFor(e.id);
      const mine = splits.find((s) => s.user_id === me);
      const equal = splits.every((s) => s.amount_cents === splits[0]?.amount_cents);
      return {
        id: e.id,
        description: e.description,
        category: e.category,
        date: formatDayMonth(e.spent_on),
        payer: { id: payer.id, name: payer.id === me ? "You" : payer.short_name, initials: payer.initials, tone: payer.id === me ? "var(--color-accent-bright)" : payer.tone },
        splitLabel: equal ? `Equally, ${splits.length} ways` : `Custom, ${splits.length} people`,
        total: fmt(e.amount_cents),
        yourShare: mine ? fmt(mine.amount_cents) : "–",
        paidByMe: e.paid_by === me,
        involvesMe: !!mine || e.paid_by === me,
      };
    }),
    owedToYou: owedToMe.length
      ? { total: fmt(owedToMe.reduce((s, d) => s + d.amount_cents, 0)), from: join(owedToMe.map((d) => d.name)) }
      : null,
    youOwe: iOwe.length ? { total: fmt(-iOwe.reduce((s, d) => s + d.amount_cents, 0)), to: join(iOwe.map((d) => d.name)) } : null,
    groupSpend: fmt(total),
    expenseCount: rows.length,
    splitWays: members.length,
    yourShare: fmt(myShare),
    debts,
    balances: members.map((m) => ({
      id: m.id,
      name: m.id === me ? "You" : m.short_name,
      net_cents: net[m.id],
      label: fmt(net[m.id], true),
      pct: Math.round((Math.abs(net[m.id]) / maxAbs) * 100),
    })),
    categories: CATEGORY_ORDER.filter((c) => byCat.has(c))
      .map((c) => ({ name: c, total: fmt(byCat.get(c)!), pct: Math.round((byCat.get(c)! / total) * 100), cents: byCat.get(c)! }))
      .sort((a, b) => b.cents - a.cents)
      .map(({ name, total: t, pct }) => ({ name, total: t, pct })),
  };
}
