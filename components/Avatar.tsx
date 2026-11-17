import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  initials: string;
  /** Background colour (hex or CSS variable). */
  tone: string;
  /** Text colour; defaults to ink. */
  fg?: string;
  /** Diameter in px. Font size scales with it. */
  size?: number;
  /** Optional ring colour (e.g. to separate stacked avatars on dark cards). */
  ring?: string;
  /** Accessible label; omit when a name is shown next to the avatar. */
  label?: string;
  className?: string;
}

export function Avatar({ initials, tone, fg, size = 40, ring, label, className }: AvatarProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    flexBasis: size,
    background: tone,
    color: fg ?? "var(--color-ink)",
    fontSize: size >= 40 ? 14 : size >= 34 ? 13 : 12,
    borderColor: ring,
    borderWidth: ring ? 2 : 0,
  };
  return (
    <span
      className={cx(styles.avatar, className)}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {initials}
    </span>
  );
}

export interface AvatarStackProps {
  people: Array<Pick<AvatarProps, "initials" | "tone" | "fg">>;
  size?: number;
  ring?: string;
  label?: string;
}

/** Overlapping avatars, e.g. the travellers on a trip card. */
export function AvatarStack({ people, size = 36, ring = "var(--color-dark)", label }: AvatarStackProps) {
  return (
    <span className={styles.stack} role={label ? "img" : undefined} aria-label={label}>
      {people.map((p, i) => (
        <Avatar
          key={`${p.initials}-${i}`}
          {...p}
          size={size}
          ring={ring}
          className={i > 0 ? styles.overlap : undefined}
        />
      ))}
    </span>
  );
}
