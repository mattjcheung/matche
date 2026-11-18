"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import styles from "./page.module.css";

export interface SectionNavItem {
  href: string;
  label: string;
}

/**
 * Trip section tabs. In-page links glide to their section (smooth scrolling
 * is set globally) and the tab for the section in view stays highlighted.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const anchors = items.filter((i) => i.href.startsWith("#"));
  const [active, setActive] = useState(anchors[0]?.href ?? "");

  useEffect(() => {
    const targets = anchors.map((a) => document.getElementById(a.href.slice(1))).filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = targets.find((t) => visible.get(t.id));
        if (first) setActive(`#${first.id}`);
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchors.map((a) => a.href).join("|")]);

  return (
    <nav aria-label="Trip sections" className={styles.tabs}>
      {items.map((s) =>
        s.href.startsWith("#") ? (
          <a
            key={s.href}
            href={s.href}
            onClick={() => setActive(s.href)}
            aria-current={active === s.href ? "location" : undefined}
            className={cx(styles.tab, active === s.href && styles.tabActive)}
          >
            {s.label}
          </a>
        ) : (
          <Link key={s.href} href={s.href} className={styles.tab}>
            {s.label}
          </Link>
        ),
      )}
    </nav>
  );
}
