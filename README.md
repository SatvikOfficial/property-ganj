# property-ganj — Quick run guide

Minimal instructions to run this Next.js project locally.

Prereqs
- Node.js 18+ (recommended)
- pnpm (preferred) or npm

Install
- pnpm: `pnpm install`
- npm: `npm install`

Run (development)
- pnpm: `pnpm dev`
- npm: `npm run dev`

Build
- pnpm: `pnpm build`
- npm: `npm run build`

Start (production)
- pnpm: `pnpm start`
- npm: `npm run start`

Lint
- pnpm: `pnpm lint`
- npm: `npm run lint`

Notes
- The dev and start scripts run the app on port 5000 by default.
- This README is intentionally concise — see `package.json` for full script definitions.

## Smart Lucknow location system
- Set `NEXT_PUBLIC_GEOAPIFY_API_KEY` in your `.env.local` using the browser (client) key from Geoapify. All autocomplete and reverse geocoding requests use this key on the client.
- The reusable `LucknowLocationAutocomplete` component powers the list-property form, hero search bar, and `/search` filters. It restricts suggestions to Lucknow’s bounding box, debounces API calls, and exposes a “Use current” GPS option.
- When a suggestion (or GPS fix) is selected, locality, colony, sector/block, pincode, and coordinates are auto-filled and persisted with each listing so property detail pages can render a map pin.
