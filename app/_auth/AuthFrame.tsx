import type { ReactNode } from "react";
import { Display, LogoMark, Muted } from "@/components";
import styles from "./AuthFrame.module.css";

/** Branded wrapper around Clerk's sign-in / sign-up cards. */
export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <div className={styles.brand}>
          <LogoMark size={32} />
          <span className={styles.wordmark}>Matche</span>
        </div>
        <Display as="h1" size="xl">
          Every booking, every idea, every friend who’s been there.
        </Display>
        <Muted>One place for the trips you’re planning, taking and remembering.</Muted>
      </div>
      {children}
    </main>
  );
}
