"use client";

import { useId, useState } from "react";
import { Avatar, Button, Icon, PlayDisc, Segmented } from "@/components";
import type { IconName } from "@/components/Icon";
import { cx } from "@/lib/cx";
import { WORLD_PATH, WORLD_VIEWBOX } from "@/lib/geo/worldPath";
import styles from "./Tour.module.css";

/* -------------------------------------------------------------------------- */
/* Sample data – the landing page never reads real accounts.                  */
/* -------------------------------------------------------------------------- */

const PEOPLE = {
  you: { name: "You", initials: "YO", tone: "#0B5F5B", fg: "#FFFFFF" },
  sophie: { name: "Sophie", initials: "SL", tone: "#8FC7BF" },
  jordan: { name: "Jordan", initials: "JP", tone: "#E9D79A" },
} as const;
type PersonId = keyof typeof PEOPLE;

const STEPS: Array<{ id: string; title: string; blurb: string; icon: IconName }> = [
  { id: "bookings", title: "Every booking, one timeline", blurb: "Forward a confirmation and it lands in the right trip, on the right day.", icon: "calendar" },
  { id: "plan", title: "Start a trip in a minute", blurb: "Name a place – Matche pulls in entry rules, events and friends who’ve been.", icon: "map-pin" },
  { id: "costs", title: "Split costs, skip the maths", blurb: "Log who paid. See who owes whom. Settle however you like.", icon: "wallet" },
  { id: "journal", title: "Journal as you go", blurb: "Private or shared with the group. Loved moments become your recap film.", icon: "journal" },
  { id: "friends", title: "See where friends are", blurb: "Who’s travelling now, who’s been where you’re going, who’s overlapping with you.", icon: "user" },
];

export function Tour() {
  const [active, setActive] = useState(0);
  const base = useId();
  const step = STEPS[active];

  function onKey(e: React.KeyboardEvent, i: number) {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + STEPS.length) % STEPS.length;
    setActive(n);
    document.getElementById(`${base}-tab-${n}`)?.focus();
  }

  return (
    <div className={styles.tour}>
      <div role="tablist" aria-label="Matche features" aria-orientation="vertical" className={styles.tabs}>
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={styles.tab}
          >
            <span className={styles.tabNum}>{i + 1}</span>
            <span className={styles.tabText}>
              <span className={styles.tabTitle}>{s.title}</span>
              <span className={styles.tabBlurb}>{s.blurb}</span>
            </span>
          </button>
        ))}
      </div>

      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active}`} className={styles.panel}>
        <div className={styles.window}>
          <div className={styles.windowBar} aria-hidden="true">
            <span />
            <span />
            <span />
            <p>{step.title}</p>
          </div>
          <div className={styles.windowBody}>
            {step.id === "bookings" && <BookingsDemo />}
            {step.id === "plan" && <PlanDemo />}
            {step.id === "costs" && <CostsDemo />}
            {step.id === "journal" && <JournalDemo />}
            {step.id === "friends" && <FriendsDemo />}
          </div>
        </div>
        <div className={styles.panelNav}>
          <Button variant="secondary" size="sm" disabled={active === 0} onClick={() => setActive(active - 1)}>
            ← Back
          </Button>
          <span className={styles.progress} aria-live="polite">
            Step {active + 1} of {STEPS.length}
          </span>
          {active < STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setActive(active + 1)}>
              Next: {STEPS[active + 1].title.split(",")[0]} →
            </Button>
          ) : (
            <Button size="sm" onClick={() => setActive(0)}>
              Start again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- 1. Bookings */

const EMAILS = [
  { id: "flight", from: "Airline", subject: "Your e-ticket: MEL → HND", day: "29 Mar", label: "Flight MEL → HND · 9:30pm", icon: "share" as IconName },
  { id: "hotel", from: "Hotel booking site", subject: "Booking confirmed: Shinjuku hotel", day: "29 Mar", label: "Shinjuku hotel · 5 nights", icon: "home" as IconName },
  { id: "rail", from: "Rail operator", subject: "Japan Rail Pass receipt", day: "3 Apr", label: "Japan Rail Pass starts", icon: "map-pin" as IconName },
];

function BookingsDemo() {
  const [filed, setFiled] = useState<string[]>([]);
  const inbox = EMAILS.filter((e) => !filed.includes(e.id));
  const timeline = EMAILS.filter((e) => filed.includes(e.id));
  return (
    <div className={styles.split}>
      <div className={styles.col}>
        <p className={styles.colLabel}>Your inbox</p>
        {inbox.map((e) => (
          <div key={e.id} className={styles.email}>
            <div className={styles.minw0}>
              <p className={styles.emailFrom}>{e.from}</p>
              <p className={styles.emailSubject}>{e.subject}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFiled((f) => [...f, e.id])} aria-label={`Forward “${e.subject}” to Matche`}>
              Forward
            </Button>
          </div>
        ))}
        {inbox.length === 0 && <p className={styles.empty}>Inbox zero. Everything’s filed.</p>}
      </div>
      <div className={styles.col}>
        <p className={styles.colLabel}>
          Japan with the crew · {timeline.length}/{EMAILS.length} filed
        </p>
        <ol className={styles.timeline}>
          {timeline.map((e) => (
            <li key={e.id} className={styles.timelineItem}>
              <span className={styles.timelineDay}>{e.day}</span>
              <span className={styles.timelineLabel}>{e.label}</span>
            </li>
          ))}
        </ol>
        {timeline.length === 0 && <p className={styles.empty}>Forward a confirmation to see it land here.</p>}
        {timeline.length > 0 && (
          <button type="button" className={styles.reset} onClick={() => setFiled([])}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- 2. Plan */

const PLACES: Record<string, { docs: string; events: string; friends: string }> = {
  Japan: {
    docs: "No visa needed for short tourist stays. Passport valid for your whole stay.",
    events: "Cherry blossom late March–early April. Golden Week is very busy.",
    friends: "Priya and Hannah have been. Dan is going in April too.",
  },
  Portugal: {
    docs: "No visa for short stays in the Schengen area – check ETIAS for your dates.",
    events: "Lisbon’s street festivals fill June. Summer is peak season.",
    friends: "Sophie is there right now and has been twice before.",
  },
  Peru: {
    docs: "No visa needed for short tourist stays.",
    events: "Inti Raymi in Cusco on 24 June. Andes rainy season is Dec–Mar.",
    friends: "Rosa just got back and rated it 4.9 / 5.",
  },
};

function PlanDemo() {
  const [place, setPlace] = useState<string | null>(null);
  const info = place ? PLACES[place] : null;
  return (
    <div className={styles.stack}>
      <p className={styles.colLabel}>Where do you want to go?</p>
      <div role="group" aria-label="Pick a destination" className={styles.chips}>
        {Object.keys(PLACES).map((p) => (
          <button key={p} type="button" aria-pressed={place === p} onClick={() => setPlace(p)} className={styles.chip}>
            {p}
          </button>
        ))}
      </div>
      {info ? (
        <div className={styles.planGrid} aria-live="polite">
          <InfoCard icon="check" title="Entry & documents" body={info.docs} />
          <InfoCard icon="calendar" title="What’s on" body={info.events} />
          <InfoCard icon="user" title="Friends who’ve been" body={info.friends} />
        </div>
      ) : (
        <p className={styles.empty}>Pick a place to see what Matche gathers for you.</p>
      )}
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <div className={styles.infoCard}>
      <span className={styles.infoIcon}>
        <Icon name={icon} size={18} />
      </span>
      <p className={styles.infoTitle}>{title}</p>
      <p className={styles.infoBody}>{body}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Costs */

const SAMPLE_EXPENSES: Array<{ id: string; what: string; paidBy: PersonId; amount: number }> = [
  { id: "dinner", what: "Welcome dinner", paidBy: "you", amount: 180 },
  { id: "rail", what: "Rail passes ×3", paidBy: "jordan", amount: 1500 },
  { id: "hotel", what: "Hotel, 5 nights", paidBy: "sophie", amount: 900 },
];

function CostsDemo() {
  const [added, setAdded] = useState<string[]>(["dinner"]);
  const [settled, setSettled] = useState(false);
  const rows = SAMPLE_EXPENSES.filter((e) => added.includes(e.id));
  const ids = Object.keys(PEOPLE) as PersonId[];
  const net = Object.fromEntries(ids.map((id) => [id, 0])) as Record<PersonId, number>;
  for (const e of rows) {
    net[e.paidBy] += e.amount;
    for (const id of ids) net[id] -= e.amount / ids.length;
  }
  const max = Math.max(1, ...ids.map((id) => Math.abs(net[id])));
  const money = (n: number) => `A$${Math.round(Math.abs(n)).toLocaleString("en-AU")}`;

  // Fewest transfers: biggest debtor pays biggest creditor.
  const debtors = ids.filter((i) => net[i] < -0.5).map((i) => ({ id: i, amt: -net[i] }));
  const creditors = ids.filter((i) => net[i] > 0.5).map((i) => ({ id: i, amt: net[i] }));
  const transfers: Array<{ from: PersonId; to: PersonId; amt: number }> = [];
  for (const d of debtors) {
    for (const c of creditors) {
      const amt = Math.min(d.amt, c.amt);
      if (amt > 0.5) {
        transfers.push({ from: d.id, to: c.id, amt });
        d.amt -= amt;
        c.amt -= amt;
      }
    }
  }

  return (
    <div className={styles.split}>
      <div className={styles.col}>
        <p className={styles.colLabel}>Add an expense</p>
        {SAMPLE_EXPENSES.map((e) => {
          const on = added.includes(e.id);
          return (
            <button
              key={e.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setSettled(false);
                setAdded((a) => (on ? a.filter((x) => x !== e.id) : [...a, e.id]));
              }}
              className={styles.expense}
            >
              <Avatar {...PEOPLE[e.paidBy]} size={28} />
              <span className={styles.expenseText}>
                <strong>{e.what}</strong>
                <span>
                  {PEOPLE[e.paidBy].name} paid {money(e.amount)}
                </span>
              </span>
              <span className={styles.expenseState}>{on ? "Added" : "+ Add"}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.col}>
        <p className={styles.colLabel}>Balances · split 3 ways</p>
        {ids.map((id) => (
          <div key={id} className={styles.balance}>
            <div className={styles.balanceTop}>
              <span>{PEOPLE[id].name}</span>
              <strong className={net[id] < -0.5 ? styles.neg : styles.pos}>
                {settled ? "A$0" : `${net[id] > 0.5 ? "+" : net[id] < -0.5 ? "−" : ""}${money(net[id])}`}
              </strong>
            </div>
            <div className={styles.balanceBar} aria-hidden="true">
              <div className={styles.barLeft}>{!settled && net[id] < 0 && <div className={styles.barNeg} style={{ width: `${(Math.abs(net[id]) / max) * 100}%` }} />}</div>
              <div className={styles.barRight}>{!settled && net[id] > 0 && <div className={styles.barPos} style={{ width: `${(net[id] / max) * 100}%` }} />}</div>
            </div>
          </div>
        ))}
        <div className={styles.settle} aria-live="polite">
          {settled ? (
            <p>All square. Matche never moves money – you just mark it done.</p>
          ) : transfers.length ? (
            <>
              {transfers.map((t) => (
                <p key={`${t.from}-${t.to}`}>
                  <strong>{PEOPLE[t.from].name}</strong> {t.from === "you" ? "owe" : "owes"} <strong>{t.to === "you" ? "you" : PEOPLE[t.to].name}</strong> {money(t.amt)}
                </p>
              ))}
              <Button size="sm" onClick={() => setSettled(true)}>
                Mark all settled
              </Button>
            </>
          ) : (
            <p>Add an expense to see who owes whom.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- 4. Journal */

const RECAP_AT = 3;

function JournalDemo() {
  const [visibility, setVisibility] = useState<"private" | "group">("group");
  const [text, setText] = useState("Up at 6 for Fushimi Inari – had the top gates almost to ourselves.");
  const [entries, setEntries] = useState<Array<{ id: number; text: string; shared: boolean }>>([
    { id: 1, text: "Tamagoyaki on a stick at Nishiki Market. No regrets.", shared: true },
  ]);
  const inputId = useId();
  const shared = entries.filter((e) => e.shared).length;
  const ready = shared >= RECAP_AT;

  function post() {
    const t = text.trim();
    if (!t) return;
    setEntries((e) => [{ id: Date.now(), text: t, shared: visibility === "group" }, ...e]);
    setText("");
  }

  return (
    <div className={styles.split}>
      <div className={styles.col}>
        <p className={styles.colLabel}>Day 9 · Kyoto</p>
        <label htmlFor={inputId} className="visually-hidden">
          New journal entry
        </label>
        <textarea
          id={inputId}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What happened today?"
          className={styles.textarea}
        />
        <Segmented
          label="Who can see this"
          block
          value={visibility}
          onChange={setVisibility}
          options={[
            { value: "private", label: "Private" },
            { value: "group", label: "Shared with group" },
          ]}
        />
        <Button block onClick={post} disabled={!text.trim()}>
          Post entry
        </Button>
      </div>
      <div className={styles.col}>
        <div className={cx(styles.recap, ready && styles.recapReady)} aria-live="polite">
          {ready ? (
            <>
              <PlayDisc size={48} />
              <p>
                <strong>Your recap film is ready</strong>
                <br />
                Made from {shared} shared entries.
              </p>
            </>
          ) : (
            <p>
              <strong>Recap film</strong>
              <br />
              {shared} of {RECAP_AT} shared entries – private ones are never included.
            </p>
          )}
        </div>
        <ul className={styles.entries}>
          {entries.map((e) => (
            <li key={e.id} className={styles.entry}>
              <span className={cx(styles.entryTag, !e.shared && styles.entryPrivate)}>{e.shared ? "Shared" : "Private"}</span>
              {e.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- 5. Friends */

const FRIENDS = [
  { id: "sophie", initials: "SL", tone: "#8FC7BF", name: "Sophie", place: "Lisbon", lon: -9.1, lat: 38.7, status: "Travelling · Day 4 of 9", note: "Ask her about Portugal before you plan your own trip." },
  { id: "mei", initials: "ML", tone: "#F6B08E", name: "Mei", place: "Ubud, Bali", lon: 115.3, lat: -8.5, status: "Travelling · Day 3 of 10", note: "Recently lost her sunglasses to a monkey. Otherwise going well." },
  { id: "hannah", initials: "HW", tone: "#E9D79A", name: "Hannah", place: "Kyoto", lon: 135.8, lat: 35, status: "Lives here", note: "You’ll be in Kyoto 4–9 April. A coffee could be on." },
  { id: "rosa", initials: "RB", tone: "#C9B8E8", name: "Rosa", place: "Melbourne", lon: 145, lat: -37.8, status: "Just back from Peru", note: "Her review is up – ask how she handled the altitude." },
  { id: "ravi", initials: "RS", tone: "#BFD7EA", name: "Ravi", place: "New York", lon: -74, lat: 40.7, status: "Iceland booked for February", note: "It’s on your wishlist too. Follow along when he goes." },
];

function FriendsDemo() {
  const [sel, setSel] = useState(FRIENDS[2].id);
  const f = FRIENDS.find((x) => x.id === sel)!;
  return (
    <div className={styles.stack}>
      <div className={styles.map}>
        <svg viewBox={WORLD_VIEWBOX} preserveAspectRatio="none" aria-hidden="true" className={styles.land}>
          <path d={WORLD_PATH} />
        </svg>
        {FRIENDS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === sel}
            aria-label={`${p.name}, ${p.place}, ${p.status}`}
            onClick={() => setSel(p.id)}
            className={cx(styles.pin, p.id === sel && styles.pinOn)}
            style={{ left: `${((p.lon + 180) / 360) * 100}%`, top: `${((90 - p.lat) / 180) * 100}%`, background: p.tone }}
          >
            {p.initials}
          </button>
        ))}
      </div>
      <div className={styles.friendCard} aria-live="polite">
        <Avatar initials={f.initials} tone={f.tone} size={40} />
        <div className={styles.minw0}>
          <p className={styles.infoTitle}>
            {f.name} · {f.place}
          </p>
          <p className={styles.friendStatus}>{f.status}</p>
          <p className={styles.infoBody}>{f.note}</p>
        </div>
      </div>
    </div>
  );
}
