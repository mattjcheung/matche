"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./Icon";
import styles from "./MobileShell.module.css";

const TABS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/trips", label: "Trip", icon: "home" },
  { href: "/journal", label: "Journal", icon: "journal" },
  { href: "/costs", label: "Costs", icon: "wallet" },
  { href: "/recap", label: "Recap", icon: "film" },
  { href: "/friends", label: "Friends", icon: "user" },
];

/** Bottom tab bar for on-trip screens. */
export function MobileTabBar() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="App" className={styles.tabbar}>
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cx(styles.tab, active && styles.tabActive)}
          >
            <Icon name={t.icon} size={22} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export interface MobileShellProps {
  /** Pinned content above the scrolling body (e.g. day strip). */
  header?: ReactNode;
  children: ReactNode;
}

/**
 * On-trip screens (Journal, Recap). Built phone-first: a full-height column
 * with a sticky bottom tab bar. On wider screens it stays a centred phone-width
 * column so it reads like the native app it will become.
 */
export function MobileShell({ header, children }: MobileShellProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.frame}>
        {header && <div className={styles.header}>{header}</div>}
        <main className={styles.body}>{children}</main>
        <MobileTabBar />
      </div>
    </div>
  );
}
