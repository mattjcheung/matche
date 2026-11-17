"use client";

import { useState } from "react";
import { Button, ButtonLink, Display, Segmented, Tag } from "@/components";
import { cx } from "@/lib/cx";
import type { FriendsMapData, MapMarker } from "@/lib/data/queries/friends";
import styles from "./FriendsMap.module.css";
import { WORLD_PATH, WORLD_VIEWBOX } from "./worldPath";

type Filter = "all" | "away" | "home";

const FILTERS = [
  { value: "all", label: "Everyone" },
  { value: "away", label: "Travelling" },
  { value: "home", label: "At home" },
] as const;

/** Equirectangular projection → percentage offsets inside the map box. */
function position(m: MapMarker) {
  return {
    left: `${(((m.lon + 180) / 360) * 100).toFixed(2)}%`,
    top: `${(((90 - m.lat) / 180) * 100).toFixed(2)}%`,
  };
}

export function FriendsMap({ data }: { data: FriendsMapData }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | undefined>(data.markers[0]?.id);

  const visible = data.markers.filter(
    (m) => filter === "all" || (filter === "away" ? m.travelling : !m.travelling),
  );
  const sel = data.markers.find((m) => m.id === selectedId) ?? data.markers[0];

  return (
    <section aria-labelledby="map-h" className={styles.section}>
      <div className={styles.head}>
        <div>
          <Display as="h1" size="page" id="map-h">
            Where your friends are
          </Display>
          <p className={styles.lede}>
            {data.travellingCount} friends travelling right now · {data.friendCount} friends in {data.placeCount} places
          </p>
        </div>
        <div className={styles.actions}>
          <Segmented<Filter> label="Show on map" options={FILTERS} value={filter} onChange={setFilter} size="md" />
          <Button size="lg" className={styles.addButton}>
            + Add friends
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.mapCard}>
          <div className={styles.map}>
            <svg viewBox={WORLD_VIEWBOX} preserveAspectRatio="none" aria-hidden="true" className={styles.land}>
              <path d={WORLD_PATH} />
            </svg>
            {visible.map((m) => {
              const on = sel?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={styles.pin}
                  style={position(m)}
                  aria-label={`${m.name}, ${m.place}, ${m.status}`}
                  aria-pressed={on}
                  onClick={() => setSelectedId(m.id)}
                >
                  <span
                    className={cx(styles.dot, m.travelling && styles.dotAway, on && styles.dotOn)}
                    style={{ background: m.tone }}
                  >
                    {m.initials}
                  </span>
                </button>
              );
            })}
          </div>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={cx(styles.swatch, styles.swatchAway)} />
              Travelling now
            </span>
            <span className={styles.legendItem}>
              <span className={cx(styles.swatch, styles.swatchHome)} />
              At home
            </span>
          </div>
        </div>

        {sel && (
          <div className={styles.detail} aria-live="polite">
            <div className={styles.who}>
              <span
                className={styles.bigAvatar}
                style={{ background: sel.tone, color: sel.toneFg ?? undefined }}
                aria-hidden="true"
              >
                {sel.initials}
              </span>
              <div className={styles.whoText}>
                <p className={styles.name}>{sel.name}</p>
                <p className={styles.place}>{sel.place}</p>
              </div>
            </div>
            <Tag tone={sel.travelling ? "accent" : "primary"} className={styles.status}>
              {sel.status}
            </Tag>
            <p className={styles.detailText}>{sel.detail}</p>
            <div className={styles.detailActions}>
              {sel.profileHref && (
                <ButtonLink href={sel.profileHref} variant="primary" className={styles.smallText}>
                  View profile
                </ButtonLink>
              )}
              <Button variant="secondary" className={styles.smallText}>
                Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
