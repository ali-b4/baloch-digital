# Baloch Digital

Public website and Data Room for [balochdigital.io](https://balochdigital.io).

The site uses Next.js, React, TypeScript, and Tailwind CSS. Impeccable is installed at project scope for design context and quality checks. Deployment is intended for Vercel; DNS remains managed through Squarespace, and Google Workspace mail records must be preserved when the domain is connected.

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Data Room configuration

The public `/data` directory lists two categories:

| Category | Page | URL | Access |
| --- | --- | --- | --- |
| Theses | $NOCK | `/data/nock` | Password |
| Theses | $META | `/data/meta` | Password |
| Theses | $ORBIO | `/data/orbio` | Password |
| Theses | $HYPE | `/data/hype` | Password |
| Dashboards | Open Compute Inference | `/dash/open-compute-inference` | Public |
| Dashboards | Hobbyist Inference Economics | `/dash/hobbyist-inference-economics` | Password |

All protected pages share one password and a seven-day session across `/data`
and `/dash`. Each protected URL displays its own password prompt. The directory
and public dashboard remain available without authentication or configuration.
Protected content fails closed until both server-only values are configured in
`.env.local` (and in Vercel for deployment):

```bash
DATAROOM_PASSWORD="owner-provided-passphrase"
DATAROOM_SESSION_SECRET="a-high-entropy-secret-of-at-least-32-bytes"
```

Do not expose either value through a `NEXT_PUBLIC_` variable. Rotating the
session secret invalidates existing seven-day Data Room sessions.

The expanded session uses a new site-wide cookie. Visitors with an older Data
Room session will enter the same password once again; sign-in and logout remove
the old `/data` cookie.

### Building Data Room pages

The NOCK report is implemented; the other entries currently show “Coming soon.”

- `src/app/data/entries.ts` is the shared list of titles, categories, URLs, and access settings. It also supplies page metadata and the allowed destinations after login. Register new entries here once.
- Each URL has its own `page.tsx`. The shared `EntryPlaceholder` reads the entry's access setting and supplies the appropriate password gate or placeholder.
- `src/app/data/entry-shell.tsx` provides the shared heading, return link, and lock action for finished pages.
- `src/app/data/nock/page.tsx` checks access before importing `report.tsx`. Follow this pattern when replacing a protected placeholder with real content. Protect any private data endpoints too.
- NOCK copy, narrative, and model values live in `report-copy.ts`, `report-content.ts`, and `report-data.ts`. Its chart and validation stay local to the report; other pages do not need to adopt them.

Open Compute Inference is public: build its content directly in
`src/app/dash/open-compute-inference/page.tsx`.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Access/session tests live in `tests/data-room-session.test.mjs`; report model
tests live in `tests/nock-report-core.test.mjs`. Type checking also flags unused
local code and parameters.

## Design handoff

Place untouched Variant exports and visual references in `design-input/`. See that folder's README for the handoff format. Final claims and copy must come from the approved export or explicit later instructions; do not invent fund credentials or evidence.

## Deploy on Vercel

Use the existing Vercel project and configure the two Data Room environment
variables above. Preserve Google Workspace mail records when changing DNS.
