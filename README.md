# Fresco Heating & Air Conditioning

Marketing site + booking system for an HVAC company in Georgetown, TX.
Built with Next.js 16 (App Router), React 19, and Tailwind CSS 4.

## Pages

- `/` - landing page (hero, stats, features, services, service areas,
  reviews, FAQ, contact footer)
- `/about` - company story
- `/booking` - service picker + appointment form with optional preferred
  date/time, submits to the API, plays back a summary on confirmation
- `/admin` - dispatch console: live board of every booking, status pipeline,
  search, notifications, and a detail modal per request (with tap-to-call
  and tap-to-email links)

SEO basics are in place too: per-page titles/descriptions, `sitemap.xml`,
`robots.txt` (admin + API excluded), and LocalBusiness structured data.
Set `NEXT_PUBLIC_SITE_URL` to the real origin when deploying so the
sitemap and robots files point at it.

## Backend

There is no external database. Bookings are stored as JSON in
`data/requests.json` (gitignored, created on first run and seeded with five
sample tickets so the dashboard isn't empty).

API routes (Next.js route handlers):

| Method | Route                  | What it does                                        |
| ------ | ---------------------- | --------------------------------------------------- |
| GET    | `/api/requests`        | List all requests, newest first                     |
| POST   | `/api/requests`        | Create a request (booking form posts here)          |
| PATCH  | `/api/requests/[id]`   | Update a request's status (admin dropdown)          |

The storage layer lives in `lib/requests.ts`. Writes go through a promise
queue so concurrent POST/PATCH can't clobber each other, and each write is
write-temp-then-rename so a crash can't corrupt the file.

## Confirmation emails

Every booking triggers a confirmation email to the customer (reference
number plus everything they entered) via SendGrid's Web API. It activates
once two env vars exist in `.env.local` (copy `.env.local.example`):

- `SENDGRID_API_KEY` - sendgrid.com, Settings > API Keys
- `BOOKING_FROM_EMAIL` - a sender verified under Settings > Sender
  Authentication (Single Sender Verification needs no domain)

Without them the emails are skipped and bookings work as normal. SendGrid
failures are logged, never fatal to a booking. Free tier: 100 emails/day.

## Running it

```bash
npm install
npm run dev      # dev server on http://localhost:3000
# or
npm run build && npm run start
```

The admin dashboard polls `/api/requests` every 15 seconds, so a booking
submitted in one tab shows up in the admin tab on its own.

## Head's up

Because the store is a local JSON file, this setup wants a single
long-running server (dev machine, VPS, Docker). On serverless hosts like
Vercel the filesystem is ephemeral, so swap `lib/requests.ts` for a real
database (Postgres, SQLite over a mounted volume, etc.) before deploying
there. The route handlers only talk to that one file, so the swap is
contained.
