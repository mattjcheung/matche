"use client";

import { useState } from "react";
import type { RecapTemplate } from "@/lib/data/types.ontrip";
import styles from "./page.module.css";

type Choice = RecapTemplate | "edit";
const OPTIONS: Array<{ id: Choice; label: string }> = [
  { id: "basic", label: "Basic" },
  { id: "upbeat", label: "Upbeat" },
  { id: "edit", label: "Edit clips" },
];

/** Template picker for the recap film. TODO(data): persist to trip_recaps.template. */
export function RecapStyle({ initial }: { initial: RecapTemplate }) {
  const [choice, setChoice] = useState<Choice>(initial);
  return (
    <div role="group" aria-label="Recap style" className={styles.styles}>
      {OPTIONS.map((o) => (
        <button key={o.id} type="button" aria-pressed={choice === o.id} onClick={() => setChoice(o.id)} className={styles.styleOption}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
