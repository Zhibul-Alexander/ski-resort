# Ski №1 Rental — Gudauri (Static, multi-language)

Tech:
- Next.js (App Router) with **static export**
- Tailwind + shadcn-style UI (Radix)
- Content/prices in `/content/*/*.json` (edit via Git)

## Local development

```bash
yarn
yarn dev
```

Open: http://localhost:3000

## Build (static export)

```bash
yarn build
```

Output is in `out/` (Cloudflare Pages can deploy this directory).

## Languages / routes
- `/en`, `/ru`, `/ge`, `/zh`, `/kk`
- Internally: `/ge` maps to `ka`, `/zh` maps to `zh-Hans` (content stored in those folders).

## Booking requests (email)
The frontend POSTs JSON to an endpoint:

- set `NEXT_PUBLIC_BOOKING_ENDPOINT` (see `.env.example`)
- recommended: a Cloudflare Worker route like `https://<your-domain>/api/booking`

If you *don’t* set the endpoint, the form shows an error.

## Map
We used your Google Maps link coordinates and an `output=embed` iframe URL.
Replace in:
`/content/*/site.json` -> `location.mapEmbedUrl` and `location.mapOpenUrl`.

## What to edit
- Prices: `/content/*/pricing.json`
- FAQ: `/content/*/faq.json`
- Reviews: `/content/*/reviews.json`
- Contacts/hours/map: `/content/*/site.json`
- Images: `/public/images/shop/*` and `/public/images/resort/*`

---

## Cloudflare Pages deploy (quick)
1. Create a new Pages project from this repo
2. Build command: `yarn build`
3. Output directory: `out`

---

## Worker (template included)
See `/worker/README.md` for a ready-to-deploy email worker (Resend-based).
