# PropertyGanj

PropertyGanj is a Next.js real estate marketplace focused on property discovery, listing management, and lead workflows for Lucknow. The app includes public marketing pages, property search, authentication, profile flows, agent tooling, and admin inventory controls backed by Supabase.

## Stack

- Next.js 16 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Vercel Analytics

## Core Features

- Landing page with featured projects, owner listings, agent listings, and locality sections
- Email/password auth with server-side registration recovery flow
- Property search and detail pages
- Profile pages for liked properties and posted ads
- Agent application flow and agent inventory endpoints
- Admin pages and APIs for users, properties, dashboard data, and holds
- Supabase Storage uploads for property media

## Project Structure

```text
app/                  App Router pages and API routes
components/           Shared UI and page components
components/home/      Landing-page specific sections
data/                 Static content for blogs and partner data
lib/                  Domain helpers and upload utilities
utils/supabase/       Browser, server, admin, and middleware clients
public/               Static assets
scripts/              Local utility and seed scripts
```

## Environment Variables

Create a local `.env` file with the values below:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=property-media
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is required for admin APIs and the registration repair flow.
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` is optional. It defaults to `property-media`.

## Local Development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

The default local server runs on `http://127.0.0.1:8080`.

## Available Scripts

```bash
npm run dev
npm run dev:turbo
npm run build
npm run build:turbo
npm run start
```

## Deployment

The project is set up for Vercel. Make sure the same Supabase environment variables are configured in the Vercel project before deploying.

The production build command is:

```bash
npm run build
```

## Important Routes

- `/` landing page
- `/search` property search
- `/property/[id]` property details
- `/auth` authentication
- `/profile` user profile
- `/agent` agent entry page
- `/admin` admin dashboard

## API Surface

The app currently exposes routes under:

- `/api/auth/*`
- `/api/properties/*`
- `/api/profile/*`
- `/api/agent/*`
- `/api/admin/*`
- `/api/uploads/*`

## Repository Hygiene

- `.gitignore` excludes local dependencies, build outputs, env files, and machine-specific clutter.
- `public/robots.txt` allows indexing of public pages while blocking admin, auth, profile, API, and placeholder-property routes.
