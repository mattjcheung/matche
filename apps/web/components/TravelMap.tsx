'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map common DB/country name variants to world-atlas names
const COUNTRY_ALIASES: Record<string, string> = {
  usa: 'unitedstatesofamerica',
  'united states': 'unitedstatesofamerica',
  uk: 'unitedkingdom',
  'united kingdom': 'unitedkingdom',
  'south korea': 'southkorea',
  'north korea': 'northkorea',
  'republic of korea': 'southkorea',
  vietnam: 'vietnam',
  'russia': 'russia',
  'dem rep congo': 'demrepcongo',
  'democratic republic of congo': 'demrepcongo',
};

function normalizeCountry(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^the/, '');
  return COUNTRY_ALIASES[normalized] ?? normalized;
}

export function TravelMap({
  countriesVisited = [],
  userLocation,
}: {
  countriesVisited?: string[];
  userLocation?: { lat: number; lng: number } | null;
}) {
  const visitedSet = new Set(
    countriesVisited.map((c) => normalizeCountry(c))
  );

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [0, 20],
          scale: 140,
        }}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.name ?? '';
              const normalized = normalizeCountry(name);
              const isVisited = visitedSet.has(normalized);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isVisited ? '#2563eb' : '#e2e8f0'}
                  stroke="#94a3b8"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: isVisited ? '#3b82f6' : '#cbd5e1' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-500" /> Countries visited
        </span>
      </div>
    </div>
  );
}
