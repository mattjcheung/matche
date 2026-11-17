"use client";

import { useId, useState, useTransition } from "react";
import { addJournalEntry } from "@/lib/actions";
import { Button, Card, Icon, Muted, Segmented } from "@/components";
import type { JournalVisibility } from "@/lib/data/types.ontrip";
import styles from "./page.module.css";

/** Draft media shown in the composer until uploads exist. */
const DRAFT_MEDIA = [
  { id: "m1", tone: "#3D5A52" },
  { id: "m2", tone: "#6E5432", duration: "0:12" },
];

export function EntryComposer({ companions, tripId, date, place }: { companions: string[]; tripId: string; date: string; place: string }) {
  const [visibility, setVisibility] = useState<JournalVisibility>("group");
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSave] = useTransition();

  function save() {
    setError(null);
    startSave(async () => {
      const res = await addJournalEntry({ tripId, body: text, visibility, date, place });
      if (!res.ok) return setError(res.error);
      setPosted(true);
      setText("");
    });
  }
  const id = useId();

  const names = companions.length > 1 ? `${companions.slice(0, -1).join(", ")} and ${companions.at(-1)}` : companions[0] ?? "Your group";

  return (
    <Card as="section" aria-label="New entry" padding="md" radius="lg" gap={12} className={styles.composer}>
      <label htmlFor={id} className={styles.composerLabel}>
        New entry
      </label>
      <textarea
        id={id}
        rows={3}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPosted(false);
        }}
        placeholder="What happened today?"
        className={styles.textarea}
      />
      <div className={styles.mediaRow}>
        {DRAFT_MEDIA.map((m) => (
          <div key={m.id} className={styles.thumb} style={{ background: m.tone }}>
            {m.duration && <span className={styles.thumbDuration}>{m.duration}</span>}
          </div>
        ))}
        <button type="button" aria-label="Add photo or video" className={styles.addMedia}>
          <Icon name="plus" size={22} strokeWidth={2} />
        </button>
      </div>
      <Segmented
        label="Who can see this"
        block
        size="md"
        value={visibility}
        onChange={setVisibility}
        options={[
          { value: "private", label: "Private" },
          { value: "group", label: "Shared with group" },
        ]}
      />
      <Muted size={13}>
        {visibility === "group"
          ? `${names} will see this. Shared entries with the most love go into your recap.`
          : "Only you can see this. You can share it later."}
      </Muted>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <Button size="lg" block onClick={save} disabled={!text.trim() || saving} aria-busy={saving}>
        {saving ? "Posting…" : posted ? "Posted" : "Post entry"}
      </Button>
    </Card>
  );
}
