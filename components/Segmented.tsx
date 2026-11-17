"use client";

import { cx } from "@/lib/cx";
import styles from "./Segmented.module.css";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  /** Accessible group name, e.g. "Post type". */
  label: string;
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Stretch segments to fill the width. */
  block?: boolean;
  /** "light" = grey track (default); "dark" = for use on dark cards. */
  theme?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Segmented control: a sunken track with one raised (white) segment.
 * Each segment is a toggle button with aria-pressed.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  block,
  theme = "light",
  size = "sm",
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(styles.track, block && styles.block, theme === "dark" && styles.dark, className)}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cx(styles.segment, size === "md" && styles.md)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
