import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components";
import { getNewTripOptions } from "@/lib/data/queries/new-trip";
import { NewTripWizard } from "./NewTripWizard";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Start a trip" };

export default function NewTripPage() {
  const options = getNewTripOptions();

  return (
    <div className={styles.page}>
      {/* Focused wizard header: brand + exit, no main nav. */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <LogoMark />
            <span className={styles.wordmark}>Matche</span>
          </Link>
          <Link href="/" className={styles.exit}>
            Save &amp; exit
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <NewTripWizard options={options} />
      </main>
    </div>
  );
}
