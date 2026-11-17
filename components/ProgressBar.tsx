import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  /** 0–100. */
  value: number;
  label: string;
  height?: number;
  color?: string;
}

export function ProgressBar({ value, label, height = 6, color }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={styles.track}
      style={{ height }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.fill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
