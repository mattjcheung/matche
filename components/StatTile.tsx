import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./StatTile.module.css";

export type StatTileTone =
  /** White card with border. */
  | "surface"
  /** Solid teal. */
  | "primary"
  /** Clay tint. */
  | "accent"
  /** Raised panel on a dark card. */
  | "onDark"
  /** Warm panel on a dark card (warnings, to-dos). */
  | "onDarkWarm";

export interface StatTileProps {
  value: ReactNode;
  label: ReactNode;
  /** Optional line under the value (summary tiles), shown after `label` when `labelFirst`. */
  note?: ReactNode;
  /** Summary layout: label above value, note below (Costs). Default: value then label. */
  labelFirst?: boolean;
  tone?: StatTileTone;
  /** Value size: sm 22, md 26, lg 36. */
  size?: "sm" | "md" | "lg";
  align?: "start" | "center";
  className?: string;
}

export function StatTile({ value, label, note, labelFirst, tone = "surface", size = "md", align = "start", className }: StatTileProps) {
  return (
    <div className={cx(styles.tile, styles[`tone_${tone}`], align === "center" && styles.center, labelFirst && styles.summary, className)}>
      {labelFirst && <p className={styles.label}>{label}</p>}
      <p className={cx(styles.value, styles[`value_${size}`])}>{value}</p>
      {!labelFirst && <p className={styles.label}>{label}</p>}
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
