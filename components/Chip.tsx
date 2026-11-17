import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Chip.module.css";

/* -------------------------------------------------------------------------- */
/* Tag – a small, static status pill ("Booked", "On a trip", "Question").      */
/* -------------------------------------------------------------------------- */

export type TagTone = "primary" | "accent" | "neutral" | "dark" | "muted" | "overlay" | "onDark";

export interface TagProps {
  tone?: TagTone;
  /** Override colours (e.g. a category tone from data). */
  bg?: string;
  fg?: string;
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

export function Tag({ tone = "neutral", bg, fg, size = "sm", children, className }: TagProps) {
  const style: CSSProperties | undefined = bg || fg ? { background: bg, color: fg } : undefined;
  return (
    <span className={cx(styles.tag, styles[`tag_${tone}`], size === "md" && styles.tagMd, className)} style={style}>
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* ChipToggle – a pill button that can be on/off (filters, multi-select).      */
/* -------------------------------------------------------------------------- */

export type ChipToggleVariant =
  /** Selected = solid ink (feed filters, expense filters). */
  | "ink"
  /** Selected = solid teal (trip months, styles). */
  | "primary";

export interface ChipToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  selected: boolean;
  variant?: ChipToggleVariant;
  size?: "sm" | "md";
  /** Use `role="tab"` semantics instead of aria-pressed. */
  asTab?: boolean;
}

export function ChipToggle({ selected, variant = "ink", size = "md", asTab, className, children, type = "button", ...rest }: ChipToggleProps) {
  const a11y = asTab ? { role: "tab" as const, "aria-selected": selected } : { "aria-pressed": selected };
  return (
    <button
      type={type}
      className={cx(styles.chip, styles[`chip_${variant}`], size === "sm" && styles.chipSm, className)}
      {...a11y}
      {...rest}
    >
      {children}
    </button>
  );
}
