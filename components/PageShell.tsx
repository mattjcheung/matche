import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { SiteHeader, type SiteHeaderProps } from "./SiteHeader";
import styles from "./PageShell.module.css";

export interface PageShellProps extends SiteHeaderProps {
  children: ReactNode;
  /** Gap between top-level sections: 28 (default) or 56 (home). */
  gap?: "md" | "lg";
  /** Top padding: 32 (default) or 40 (home). */
  top?: "md" | "lg";
  /** Lay children out as a wrapping row (sidebar + content screens). */
  row?: boolean;
  className?: string;
}

/** Desktop/web screen: site header + centred 1280px main column. */
export function PageShell({ children, gap = "md", top = "md", row, notifications, className }: PageShellProps) {
  return (
    <div className={styles.page}>
      <SiteHeader notifications={notifications} />
      <main
        className={cx(
          styles.main,
          gap === "lg" && styles.gapLg,
          top === "lg" && styles.topLg,
          row && styles.row,
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}

/**
 * Two-column layout that wraps on narrow screens: a wide primary column and a
 * ~320px secondary column. Order in markup = reading order.
 */
export function SplitLayout({ children, className, gap = 28 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <div className={cx(styles.split, className)} style={{ gap }}>
      {children}
    </div>
  );
}

export function Primary({ children, className, as: Tag = "div", ...rest }: { children: ReactNode; className?: string; as?: "div" | "section"; "aria-labelledby"?: string; "aria-label"?: string }) {
  return (
    <Tag className={cx(styles.primary, className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Secondary({ children, className, as: Tag = "aside", ...rest }: { children: ReactNode; className?: string; as?: "aside" | "div" | "section"; "aria-labelledby"?: string; "aria-label"?: string }) {
  return (
    <Tag className={cx(styles.secondary, className)} {...rest}>
      {children}
    </Tag>
  );
}
