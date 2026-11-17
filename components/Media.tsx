import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";
import styles from "./Media.module.css";

export interface MediaPlaceholderProps {
  /** Placeholder colour until real media is stored. */
  tone: string;
  /** Fixed height in px, or use `aspect`. */
  height?: number;
  /** CSS aspect-ratio, e.g. "9 / 13" or "1 / 1". */
  aspect?: string;
  radius?: number;
  /** Bracketed caption, e.g. "[Photo]". */
  caption?: string;
  /** Where to place children / caption. */
  align?: "end" | "center" | "between";
  children?: ReactNode;
  className?: string;
}

/** A coloured block standing in for a photo or video. */
export function MediaPlaceholder({
  tone,
  height,
  aspect,
  radius = 14,
  caption,
  align = "end",
  children,
  className,
}: MediaPlaceholderProps) {
  const style: CSSProperties = { background: tone, height, aspectRatio: aspect, borderRadius: radius };
  return (
    <div className={cx(styles.media, styles[`align_${align}`], className)} style={style}>
      {children}
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );
}

/** Round white play disc; a real button when `onClick`/`label` given. */
export function PlayDisc({ size = 64, label }: { size?: number; label?: string }) {
  const style = { width: size, height: size };
  const icon = <Icon name="play" size={Math.round(size * 0.38)} />;
  if (label) {
    return (
      <button type="button" aria-label={label} className={styles.play} style={style}>
        {icon}
      </button>
    );
  }
  return (
    <span className={styles.play} style={style} aria-hidden="true">
      {icon}
    </span>
  );
}
