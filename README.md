# Matche – all-in-one travel hub

Next.js (App Router) + TypeScript + CSS Modules.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Routes

| Route | Screen |
| --- | --- |
| `/` | Discover – hub, feed & inspiration |
| `/friends`, `/friends/[id]` | Friends map, trips & volunteering; friend profile |
| `/me` | Your profile & history book |
| `/trips` → `/trips/[slug]` | Trip planner |
| `/trips/new` | Start-a-trip wizard |
| `/calendar`, `/costs` | Trip calendar, cost tracker |
| `/journal`, `/recap` | On-trip journal and post-trip recap (phone-first) |

## Structure

- `styles/tokens.css` – the single design-tokens file (colour, type, spacing, radii). CSS Modules use these variables only.
- `components/` – shared UI: `PageShell`, `SiteHeader`, `MobileShell`, `Button`, `Card`, `Avatar`, `Tag`/`ChipToggle`, `Segmented`, `StatTile`, `MediaPlaceholder`, `Icon`, typography.
- `lib/data/` – typed mock rows shaped like database tables (`trips`, `trip_members`, `bookings`, `expenses`, `expense_splits`, `posts`, `friendships`, plus `trip_stops`, `todos`, `journal_entries`, …). Row types live in `types*.ts`.
- `lib/data/queries/` – the only way screens read data. To move to Postgres/Supabase, reimplement these functions; screens don't change.
- `APP_TODAY` in `lib/data/users.ts` pins "today" for the mock data – replace with the real date once data is live.
