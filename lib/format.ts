import type { CurrencyCode, ISODate } from "./data/types";

const CURRENCY_PREFIX: Record<CurrencyCode, string> = {
  AUD: "A$",
  USD: "US$",
  EUR: "€",
  JPY: "¥",
};

/** 360000, "AUD" → "A$3,600". Whole units unless there are cents. */
export function formatMoney(cents: number, currency: CurrencyCode = "AUD", opts: { signed?: boolean } = {}): string {
  const abs = Math.abs(cents) / 100;
  const digits = Number.isInteger(abs) ? 0 : 2;
  const body = abs.toLocaleString("en-AU", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const sign = cents < 0 ? "−" : opts.signed && cents > 0 ? "+" : "";
  return `${sign}${CURRENCY_PREFIX[currency]}${body}`;
}

export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parse `YYYY-MM-DD` as a UTC date (no timezone drift). */
export function parseISODate(d: ISODate): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

/** "2027-03-29" → "29 Mar". */
export function formatDayMonth(d: ISODate): string {
  const dt = parseISODate(d);
  return `${dt.getUTCDate()} ${MONTHS_SHORT[dt.getUTCMonth()]}`;
}

/** "2027-03-29" → "29 Mar 2027". */
export function formatDate(d: ISODate): string {
  const dt = parseISODate(d);
  return `${dt.getUTCDate()} ${MONTHS_SHORT[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

/** "2027-03-29", "2027-04-14" → "29 Mar – 14 Apr 2027". */
export function formatDateRange(start: ISODate, end: ISODate): string {
  const s = parseISODate(start);
  const e = parseISODate(end);
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const left = sameYear ? formatDayMonth(start) : formatDate(start);
  return `${left} – ${formatDate(end)}`;
}

export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / 86_400_000);
}
