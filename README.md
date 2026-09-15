# Baloch Digital

Landing-page project for [balochdigital.io](https://balochdigital.io).

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
| Theses | $CRED | `/data/cred` | Password |
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

### Adding dashboard content

The new pages currently display “Coming soon.” The existing NOCK report is
preserved. Add the Open Compute Inference dashboard in
`src/app/dash/open-compute-inference/page.tsx`; it has no password check.
`src/app/data/entry-shell.tsx` provides the shared page heading and return link,
and `src/app/data/entries.ts` defines directory names, categories, and URLs.
For future protected content, check `hasValidDataRoomSession()` on the server
before loading or rendering private data, as the NOCK page does. Keep any future
private data endpoints protected as well.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Design handoff

Place untouched Variant exports and visual references in `design-input/`. See that folder's README for the handoff format. Final claims and copy must come from the approved export or explicit later instructions; do not invent fund credentials or evidence.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
