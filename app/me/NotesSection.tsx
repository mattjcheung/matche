"use client";

import { useState } from "react";
import { Avatar, Button } from "@/components";
import { cx } from "@/lib/cx";
import type { PendingNoteView, ProfileNoteView } from "@/lib/data/queries/me";
import { useProfileView } from "./ProfileView";
import styles from "./NotesSection.module.css";

export interface NotesSectionProps {
  ownerName: string;
  notes: ProfileNoteView[];
  pending: PendingNoteView[];
  initialNotesPublic: boolean;
}

/** "Notes from people I met" – owner can hide single notes or all of them. */
export function NotesSection({ ownerName, notes, pending, initialNotesPublic }: NotesSectionProps) {
  const { publicView } = useProfileView();
  const [notesPublic, setNotesPublic] = useState(initialNotesPublic);
  const [hidden, setHidden] = useState<string[]>(() => notes.filter((n) => !n.shownOnProfile).map((n) => n.id));

  const visible = publicView ? (notesPublic ? notes.filter((n) => !hidden.includes(n.id)) : []) : notes;
  const firstPending = pending[0];

  const toggleNote = (id: string) =>
    setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));

  return (
    <section aria-labelledby="notes-h" className={styles.section}>
      <div className={styles.head}>
        <div>
          <h2 id="notes-h" className={styles.title}>
            Notes from people I met
          </h2>
          <p className={styles.lede}>Left by travellers and hosts you connected with on the road.</p>
        </div>
        {!publicView && (
          <label className={styles.publicSwitch}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={notesPublic}
              onChange={() => setNotesPublic((v) => !v)}
            />
            Show notes on my public profile
          </label>
        )}
      </div>

      {!publicView && firstPending && (
        <div className={styles.pending}>
          <p className={styles.pendingText}>
            <strong>
              {pending.length} new {pending.length === 1 ? "note" : "notes"}
            </strong>{" "}
            from {firstPending.authorName} (met in {firstPending.metAt})
            {pending.length > 1 ? ` and ${pending.length - 1} more are` : " is"} waiting for your approval.
          </p>
          <Button variant="accent" className={styles.reviewButton}>
            Review note
          </Button>
        </div>
      )}

      {publicView && !notesPublic && <p className={styles.private}>{ownerName} keeps notes private.</p>}

      <div className={styles.grid}>
        {visible.map((n) => {
          const isHidden = hidden.includes(n.id);
          const dimmed = !publicView && (isHidden || !notesPublic);
          return (
            <article key={n.id} className={cx(styles.note, dimmed && styles.dimmed)}>
              <p className={styles.noteText}>“{n.text}”</p>
              <div className={styles.author}>
                <Avatar initials={n.initials} tone={n.tone} size={36} className={styles.avatar} />
                <div className={styles.authorText}>
                  <p className={styles.who}>{n.who}</p>
                  <p className={styles.where}>{n.where}</p>
                </div>
              </div>
              {!publicView && (
                <button
                  type="button"
                  className={styles.noteToggle}
                  aria-pressed={!isHidden}
                  onClick={() => toggleNote(n.id)}
                >
                  {isHidden ? "Hidden – show on profile" : "Shown – hide from profile"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
