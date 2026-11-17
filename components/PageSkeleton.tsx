import { cx } from "@/lib/cx";
import { SiteHeader } from "./SiteHeader";
import styles from "./PageSkeleton.module.css";

/** Shown instantly while a page's data loads (route `loading.tsx`). */
export function PageSkeleton() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main} aria-busy="true" aria-label="Loading">
        <div className={cx(styles.block, styles.title)} />
        <div className={cx(styles.block, styles.lede)} />
        <div className={styles.grid}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={cx(styles.block, styles.card)} />
          ))}
        </div>
        <div className={cx(styles.block, styles.wide)} />
      </main>
    </div>
  );
}

/** Phone-width variant for Journal and Recap. */
export function MobileSkeleton() {
  return (
    <div className={styles.mobileBackdrop}>
      <main className={styles.mobile} aria-busy="true" aria-label="Loading">
        <div className={cx(styles.block, styles.lede)} />
        <div className={cx(styles.block, styles.title)} />
        <div className={cx(styles.block, styles.tall)} />
        <div className={cx(styles.block, styles.card)} />
      </main>
    </div>
  );
}
