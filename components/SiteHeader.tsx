"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { Avatar } from "./Avatar";
import { Icon, LogoMark } from "./Icon";
import styles from "./SiteHeader.module.css";

const NAV = [
  { href: "/", label: "Discover", match: (p: string) => p === "/" },
  { href: "/trips", label: "Trips", match: (p: string) => p.startsWith("/trips") },
  { href: "/calendar", label: "Calendar", match: (p: string) => p.startsWith("/calendar") },
  { href: "/costs", label: "Costs", match: (p: string) => p.startsWith("/costs") },
  { href: "/friends", label: "Friends", match: (p: string) => p.startsWith("/friends") },
];

export interface SiteHeaderProps {
  /** Unread notification count; the bell shows only when provided. */
  notifications?: number;
}

export function SiteHeader({ notifications }: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <LogoMark />
          <span className={styles.wordmark}>Matche</span>
        </Link>
        <nav aria-label="Main" className={styles.nav}>
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(styles.navLink, active && styles.navLinkActive)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.actions}>
          {notifications !== undefined && (
            <button
              type="button"
              className={styles.bell}
              aria-label={notifications > 0 ? `Notifications, ${notifications} new` : "Notifications"}
            >
              <Icon name="bell" />
              {notifications > 0 && <span className={styles.dot} />}
            </button>
          )}
          <Link
            href="/me"
            aria-label="Your profile"
            aria-current={pathname.startsWith("/me") ? "page" : undefined}
            className={cx(styles.me, pathname.startsWith("/me") && styles.meActive)}
          >
            <Avatar initials="AK" tone="var(--color-primary)" fg="var(--color-on-dark)" size={44} />
          </Link>
        </div>
      </div>
    </header>
  );
}
