import type { Metadata } from "next";
import { Button, Card, Display, Muted, PageShell } from "@/components";
import { getTripCalendar } from "@/lib/data/queries/calendar";
import { listTodoVMs } from "@/lib/data/queries/ontrip";
import { getActiveTrip } from "@/lib/data/queries/trips";
import { cx } from "@/lib/cx";
import { MonthGrid } from "./MonthGrid";
import styles from "./page.module.css";
import { loadDb } from "@/lib/data/db";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage() {
  await loadDb();
  const trip = getActiveTrip();
  const months = getTripCalendar(trip.id);
  const todos = listTodoVMs(trip.id);
  // Open on the month containing the middle of the trip.
  const mid = new Date((Date.parse(trip.start_date!) + Date.parse(trip.end_date!)) / 2).toISOString().slice(0, 7);
  const initial = Math.max(0, months.findIndex((m) => m.key === mid));

  return (
    <PageShell row>
      <aside className={styles.side}>
        <Card as="section" aria-labelledby="todo-h" padding="lg" gap={14}>
          <div>
            <Display as="h2" size="sm" id="todo-h">
              To-do by date
            </Display>
            <Muted size={14} className={styles.sub}>
              Document deadlines are added automatically from your trip’s requirements.
            </Muted>
          </div>
          <ul className={styles.todos}>
            {todos.map((t) => (
              <li key={t.id} className={cx(styles.todo, t.auto && styles.todoAuto)}>
                <div className={styles.dateBox}>
                  <span className={styles.dateMon}>{t.mon}</span>
                  <span className={styles.dateDay}>{t.day}</span>
                </div>
                <div className={styles.minw0}>
                  <p className={styles.todoTitle}>{t.title}</p>
                  <Muted size={13} className={styles.todoNote}>
                    {t.note}
                  </Muted>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="secondary" block className={styles.addTodo}>
            + Add a to-do
          </Button>
        </Card>

        <Card as="section" aria-labelledby="key-h" padding="lg" gap={12}>
          <h2 id="key-h" className={styles.keyHeading}>
            Key
          </h2>
          <div className={styles.keyRow}>
            <span className={cx(styles.swatch, styles.swBooked)} />
            Booked stay
          </div>
          <div className={styles.keyRow}>
            <span className={cx(styles.swatch, styles.swHoped)} />
            Hoping to stay (not booked)
          </div>
          <div className={styles.keyRow}>
            <span className={cx(styles.swatch, styles.swTodo)} />
            To-do deadline
          </div>
          <div className={styles.keyRow}>
            <span className={cx(styles.swatch, styles.swTravel)} />
            Travel
          </div>
          <div className={styles.keyRow}>
            <span className={styles.swJournal} />
            Journal entry (during trip)
          </div>
        </Card>
      </aside>

      <section aria-labelledby="cal-h" className={styles.main}>
        <MonthGrid tripName={trip.name} months={months} initial={initial} />
        <Muted size={14}>During the trip, tap any day to add a journal entry – private or shared with the group.</Muted>
      </section>
    </PageShell>
  );
}
