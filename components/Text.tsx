import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Text.module.css";

/** Small uppercase label above a title, e.g. "JAPAN WITH THE CREW". */
export function Eyebrow({
  children,
  tone = "primary",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: "primary" | "accent" | "onDark" | "muted";
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cx(styles.eyebrow, styles[`eyebrow_${tone}`], className)}>{children}</Tag>;
}

export type DisplaySize = "sm" | "md" | "lg" | "xl" | "page" | "hero";

/**
 * Bricolage Grotesque heading.
 * Sizes: sm 21–22, md 26, lg 30, xl 34, page 40, hero clamp(36–60).
 */
export function Display({
  as: Tag = "h2",
  size = "lg",
  children,
  className,
  id,
}: {
  as?: ElementType;
  size?: DisplaySize;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cx(styles.display, styles[`display_${size}`], className)}>
      {children}
    </Tag>
  );
}

/** Section title + description on the left, an optional action on the right. */
export function SectionHeader({
  id,
  title,
  description,
  action,
  as = "h2",
  size = "lg",
  eyebrow,
}: {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: ElementType;
  size?: DisplaySize;
  eyebrow?: ReactNode;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderText}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Display as={as} size={size} id={id}>
          {title}
        </Display>
        {description && <p className={styles.lede}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Grey supporting copy. */
export function Muted({
  children,
  size = 15,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  size?: 12 | 13 | 14 | 15;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cx(styles.muted, styles[`muted_${size}`], className)}>{children}</Tag>;
}
