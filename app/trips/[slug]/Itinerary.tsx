"use client";

import { useState } from "react";
import { Button, Segmented, Tag } from "@/components";
import type { ItineraryVM } from "@/lib/data/queries/trip-planner";
import styles from "./Itinerary.module.css";

type Mode = "dated" | "flexible";

const MODES = [
  { value: "dated", label: "With dates" },
  { value: "flexible", label: "Flexible" },
] as const;

/** Itinerary section: dated/flexible toggle, wishlist route banner, route map and stop list. */
export function Itinerary({ data }: { data: ItineraryVM }) {
  const [mode, setMode] = useState<Mode>("dated");
  const stops = mode === "dated" ? data.dated : data.flexible;
  const { map } = data;

  return (
    <section id="itinerary" aria-labelledby="itin-h" className={styles.section}>
      <div className={styles.head}>
        <h2 id="itin-h" className={styles.h2}>
          Itinerary
        </h2>
        <Segmented label="Itinerary mode" options={MODES} value={mode} onChange={setMode} size="md" className={styles.modeToggle} />
      </div>

      {data.guide && (
        <div className={styles.banner}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.bannerIcon}>
            <circle cx="6" cy="19" r="2.5" />
            <circle cx="18" cy="5" r="2.5" />
            <path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" />
          </svg>
          <div className={styles.bannerText}>
            <p className={styles.bannerTitle}>{data.guide.title}</p>
            <p className={styles.bannerBody}>{data.guide.body}</p>
          </div>
          <Button variant="primary" className={styles.btn14}>
            Re-optimise
          </Button>
        </div>
      )}

      <div className={styles.routeRow}>
        <figure className={styles.map}>
          <figcaption className={styles.mapCaption}>Route overview (schematic)</figcaption>
          <svg viewBox="0 0 300 260" role="img" aria-label={map.ariaLabel} className={styles.mapSvg}>
            <path d={map.allPath} className={styles.pathAll} />
            <path d={map.overnightPath} className={styles.pathOvernight} />
            {map.nodes.map((n) => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={n.r} className={n.dayTrip ? styles.nodeDay : styles.node} />
                <text x={n.labelX} y={n.labelY} className={n.dayTrip ? styles.labelDay : styles.label}>
                  {n.place}
                </text>
              </g>
            ))}
          </svg>
          <p className={styles.mapLegend}>Solid: overnight stops · Dashed: day trips</p>
        </figure>

        <ol className={styles.stops}>
          {stops.map((s) => (
            <li key={s.id} className={styles.stop}>
              <span className={styles.num}>{s.n}</span>
              <div className={styles.stopBody}>
                <div className={styles.stopTop}>
                  <p className={styles.place}>{s.place}</p>
                  <Tag tone={s.tone} className={styles.tag}>
                    {s.status}
                  </Tag>
                </div>
                <p className={styles.when}>{s.when}</p>
                <p className={styles.detail}>{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
