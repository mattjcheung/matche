"use client";

import { useState } from "react";
import { Avatar, Button, ButtonLink, ChipToggle, Eyebrow, Segmented } from "@/components";
import { cx } from "@/lib/cx";
import type { NewTripOptions } from "@/lib/data/queries/new-trip";
import type { TripBudget } from "@/lib/data/types";
import styles from "./NewTripWizard.module.css";

type DateMode = "exact" | "flex" | "none";

const STEP_LABELS = ["Where", "When", "Who & style", "Your starter plan"];
const DATE_MODES = [
  { value: "exact", label: "Exact dates" },
  { value: "flex", label: "Flexible" },
  { value: "none", label: "Not sure yet" },
] as const;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2027-03-29" → "29 Mar 2027" (input values are always YYYY-MM-DD). */
function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${Number(day)} ${MONTH_NAMES[Number(m) - 1]} ${y}`;
}

function toggleIn<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export function NewTripWizard({ options }: { options: NewTripOptions }) {
  const [step, setStep] = useState(1);
  const [dests, setDests] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [dateMode, setDateMode] = useState<DateMode>("flex");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [months, setMonths] = useState<string[]>([]);
  const [length, setLength] = useState("");
  const [friends, setFriends] = useState<string[]>([]);
  const [tripStyles, setTripStyles] = useState<string[]>([]);
  const [budget, setBudget] = useState<TripBudget>(options.defaultBudget);

  const canNext = step !== 1 || dests.length > 0;
  const friendName = (id: string) => options.friends.find((f) => f.id === id)?.name ?? id;
  const friendNames = friends.map(friendName);

  const addTyped = () => {
    const t = typed.trim();
    if (t && !dests.includes(t)) {
      setDests([...dests, t]);
      setTyped("");
    }
  };

  /* ---- derived summary ---- */
  let when = "";
  if (dateMode === "exact" && (start || end)) when = `${fmtDate(start) || "?"} – ${fmtDate(end) || "?"}`;
  if (dateMode === "flex" && (months.length || length)) {
    const picked = options.months.filter((m) => months.includes(m.id)).map((m) => m.mon);
    when = (picked.length ? picked.join(", ") : "Any month") + (length ? ` · ${length}` : "");
  }
  if (dateMode === "none") when = "Undecided – idea for now";

  const placeList = dests.length === 1 ? dests[0] : `${dests.slice(0, -1).join(", ")} & ${dests[dests.length - 1]}`;
  const tripName =
    dests.length === 0
      ? "Your trip"
      : placeList + (friends.length ? ` with ${friends.length === 1 ? friendNames[0] : "friends"}` : "");

  const passportWarn = options.passport !== null && dests.some((d) => !options.domestic.includes(d));
  const packs = dests.map((d) => options.destinationInfo[d]?.pack).filter(Boolean);
  const packing =
    (packs.length ? `Start with ${packs.join("; ")}.` : "We’ll suggest a list once we know more about where you’re going.") +
    (tripStyles.includes("Hiking") ? " Add hiking boots and a day pack." : "") +
    (tripStyles.includes("Beaches") ? " Add reef-safe sunscreen and a quick-dry towel." : "");

  const summary: Array<{ label: string; value: string; empty: string }> = [
    { label: "Where", value: dests.join(" → "), empty: "Pick a place" },
    { label: "When", value: when, empty: "Not set yet" },
    { label: "Who", value: friends.length ? `You + ${friendNames.join(", ")}` : step > 3 ? "Just you" : "", empty: "Just you, for now" },
    { label: "Style", value: tripStyles.join(", "), empty: "Not chosen" },
    { label: "Spending", value: budget, empty: "" },
  ];

  const hint = !canNext ? "Add at least one place to continue." : step === 4 ? "You can edit everything once the trip is created." : "";

  return (
    <>
      <div className={styles.intro}>
        <h1 className={styles.h1}>Start a trip</h1>
        <ol aria-label="Steps" className={styles.steps}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const state = n === step ? "current" : n < step ? "done" : "todo";
          return (
            <li key={label}>
              <button
                type="button"
                className={styles.stepBtn}
                data-state={state}
                aria-current={n === step ? "step" : undefined}
                onClick={() => {
                  if (n < step || canNext) setStep(n);
                }}
              >
                <span className={styles.stepNum} aria-hidden={state === "done" ? true : undefined}>
                  {state === "done" ? "✓" : n}
                </span>
                {state === "done" && <span className="visually-hidden">Step {n}, done: </span>}
                <span className={styles.stepLabel}>{label}</span>
              </button>
            </li>
          );
        })}
        </ol>
      </div>

      <div className={styles.layout}>
        <section className={styles.panel} aria-label={`Step ${step} of 4: ${STEP_LABELS[step - 1]}`}>
          {/* ---------------- Step 1: Where ---------------- */}
          {step === 1 && (
            <div className={styles.stepBody}>
              <div>
                <h2 className={styles.h2}>Where do you want to go?</h2>
                <p className={styles.lede}>Add one place or several. Countries, cities or regions all work.</p>
              </div>
              <div className={styles.addRow}>
                <label htmlFor="dest" className="visually-hidden">
                  Add a destination
                </label>
                <input
                  id="dest"
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTyped();
                    }
                  }}
                  placeholder="Type a place, e.g. Vietnam"
                  className={cx(styles.input, styles.destInput)}
                />
                <Button className={styles.addBtn} onClick={addTyped}>
                  Add
                </Button>
              </div>
              {dests.length > 0 && (
                <div className={styles.chosen} role="group" aria-label="Chosen places">
                  {dests.map((d) => (
                    <button key={d} type="button" className={styles.chosenChip} aria-label={`Remove ${d}`} onClick={() => setDests(toggleIn(dests, d))}>
                      {d} <span aria-hidden="true" className={styles.chosenX}>×</span>
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.group}>
                <p className={styles.groupLabel}>Ideas for you</p>
                <div className={styles.ideas}>
                  {options.ideas.map((idea) => (
                    <button
                      key={idea.name}
                      type="button"
                      className={styles.idea}
                      aria-pressed={dests.includes(idea.name)}
                      onClick={() => setDests(toggleIn(dests, idea.name))}
                    >
                      <span className={styles.ideaName}>{idea.name}</span>
                      <span className={styles.ideaWhy}>{idea.why}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Step 2: When ---------------- */}
          {step === 2 && (
            <div className={styles.stepBody}>
              <div>
                <h2 className={styles.h2}>When are you thinking?</h2>
                <p className={styles.lede}>Exact dates, a rough window, or no idea yet – you can change it any time.</p>
              </div>
              <Segmented label="Date type" options={DATE_MODES} value={dateMode} onChange={setDateMode} size="md" className={styles.seg} />
              {dateMode === "exact" && (
                <div className={styles.dates}>
                  <div className={styles.field}>
                    <label htmlFor="d1" className={styles.fieldLabel}>
                      Leave
                    </label>
                    <input id="d1" type="date" value={start} onChange={(e) => setStart(e.target.value)} className={cx(styles.input, styles.dateInput)} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="d2" className={styles.fieldLabel}>
                      Return
                    </label>
                    <input id="d2" type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} className={cx(styles.input, styles.dateInput)} />
                  </div>
                </div>
              )}
              {dateMode === "flex" && (
                <div className={styles.group}>
                  <p className={styles.groupLabel}>Which months could work?</p>
                  <div className={styles.months}>
                    {options.months.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={styles.month}
                        aria-pressed={months.includes(m.id)}
                        aria-label={`${m.mon} ${m.yr}`}
                        onClick={() => setMonths(toggleIn(months, m.id))}
                      >
                        <span className={styles.monthName}>{m.mon}</span>
                        <span className={styles.monthYear}>{m.yr}</span>
                      </button>
                    ))}
                  </div>
                  <p className={cx(styles.groupLabel, styles.groupLabelGap)}>How long?</p>
                  <div className={styles.chips}>
                    {options.lengths.map((l) => (
                      <ChipToggle key={l} variant="primary" selected={length === l} onClick={() => setLength(length === l ? "" : l)}>
                        {l}
                      </ChipToggle>
                    ))}
                  </div>
                </div>
              )}
              {dateMode === "none" && (
                <p className={styles.noneNote}>
                  That’s fine – your trip stays as an idea. We’ll still gather documents and costs, and add events once you pick a window.
                </p>
              )}
            </div>
          )}

          {/* ---------------- Step 3: Who & style ---------------- */}
          {step === 3 && (
            <div className={cx(styles.stepBody, styles.stepBodyLoose)}>
              <div>
                <h2 className={styles.h2}>Who’s coming, and what’s the vibe?</h2>
                <p className={styles.lede}>Invited friends can edit the plan and share costs. Leave it empty for a solo trip.</p>
              </div>
              <div className={styles.group}>
                <p className={styles.groupLabel}>Invite friends</p>
                <div className={styles.chips}>
                  {options.friends.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={styles.friend}
                      aria-pressed={friends.includes(f.id)}
                      onClick={() => setFriends(toggleIn(friends, f.id))}
                    >
                      <Avatar initials={f.initials} tone={f.tone} fg={f.fg} size={34} />
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.group}>
                <p className={styles.groupLabel}>Trip style (pick any)</p>
                <div className={styles.chips}>
                  {options.styles.map((s) => (
                    <ChipToggle key={s} variant="primary" selected={tripStyles.includes(s)} onClick={() => setTripStyles(toggleIn(tripStyles, s))}>
                      {s}
                    </ChipToggle>
                  ))}
                </div>
              </div>
              <div className={styles.group}>
                <p className={styles.groupLabel}>Spending style</p>
                <Segmented
                  label="Spending style"
                  options={options.budgets.map((b) => ({ value: b, label: b }))}
                  value={budget}
                  onChange={setBudget}
                  size="md"
                  className={styles.seg}
                />
              </div>
            </div>
          )}

          {/* ---------------- Step 4: Starter plan ---------------- */}
          {step === 4 && (
            <div className={styles.stepBody}>
              <div>
                <Eyebrow>Gathered for you</Eyebrow>
                <h2 className={cx(styles.h2, styles.planTitle)}>{tripName}</h2>
                <p className={styles.lede}>
                  Based on {options.passport?.phrase ?? "your passport"}. Always confirm entry rules with official sources before you book.
                </p>
              </div>
              {passportWarn && options.passport && (
                <div className={styles.warn}>
                  <span className={styles.warnMark} aria-hidden="true">
                    !
                  </span>
                  <p className={styles.warnText}>
                    <strong>Your passport expires {options.passport.expiresLabel}.</strong> Many countries want 6 months’ validity left – we’ll add a renewal
                    reminder to your calendar.
                  </p>
                </div>
              )}
              {dests.map((d) => {
                const info = options.destinationInfo[d] ?? {
                  docs: "We’ll check entry rules for your passport and add any deadlines to your calendar.",
                  events: "Public holidays and events will appear once you pick dates or months.",
                  health: `We’ll pull current travel advice and vaccine guidance for ${d}.`,
                  people: "We’ll show friends who’ve been and travellers going at the same time.",
                };
                return (
                  <article key={d} className={styles.plan}>
                    <h3 className={styles.planName}>{d}</h3>
                    <div className={styles.planGrid}>
                      <div className={styles.planTile}>
                        <p className={styles.planLabel}>Documents</p>
                        <p className={styles.planText}>{info.docs}</p>
                      </div>
                      <div className={styles.planTile}>
                        <p className={styles.planLabel}>Events &amp; seasons</p>
                        <p className={styles.planText}>{info.events}</p>
                      </div>
                      <div className={styles.planTile}>
                        <p className={styles.planLabel}>Health &amp; safety</p>
                        <p className={styles.planText}>{info.health}</p>
                      </div>
                      <div className={cx(styles.planTile, styles.planTileTint)}>
                        <p className={styles.planLabel}>Friends &amp; travellers</p>
                        <p className={styles.planText}>{info.people}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
              <div className={styles.packing}>
                <p className={styles.packingTitle}>Packing starter</p>
                <p className={styles.packingText}>{packing}</p>
              </div>
            </div>
          )}

          {/* ---------------- Footer ---------------- */}
          <div className={styles.footer}>
            {step > 1 && (
              <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <p className={cx(styles.hint, !canNext && styles.hintError)} aria-live="polite">
              {hint}
            </p>
            {step < 4 && (
              <Button
                size="lg"
                className={styles.nextBtn}
                aria-disabled={!canNext}
                onClick={() => {
                  if (canNext) setStep(step + 1);
                }}
              >
                {step === 3 ? "Build my plan" : "Next"}
              </Button>
            )}
            {step === 4 && (
              <ButtonLink href="/trips" size="lg" className={styles.nextBtn}>
                Create trip
              </ButtonLink>
            )}
          </div>
        </section>

        <aside aria-labelledby="sum-h" className={styles.summary}>
          <h2 id="sum-h" className={styles.summaryTitle}>
            Your trip so far
          </h2>
          {summary.map((r) => (
            <div key={r.label} className={styles.summaryRow}>
              <p className={styles.summaryLabel}>{r.label}</p>
              <p className={cx(styles.summaryValue, !r.value && styles.summaryEmpty)}>{r.value || r.empty}</p>
            </div>
          ))}
          <p className={styles.summaryNote}>Nothing is booked here. Once the trip exists, forward confirmations and they’ll land in it.</p>
        </aside>
      </div>
    </>
  );
}
