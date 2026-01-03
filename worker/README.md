# Booking email Worker (template)

This Worker receives the booking request JSON and sends 2 emails:
1) To the owner (new booking request)
2) To the customer (confirmation)

## Choose an email provider
Recommended: Resend (simple API, good deliverability).

## Setup (Wrangler)
1) Install wrangler:
```bash
npm i -g wrangler
```

2) From /worker:
```bash
npm i
wrangler login
```

3) Configure secrets:
```bash
wrangler secret put RESEND_API_KEY
wrangler secret put OWNER_EMAIL
wrangler secret put FROM_EMAIL
```

Examples:
- OWNER_EMAIL: `zhibul.alexander@gmail.com`
- FROM_EMAIL: `booking@your-domain.com` (use a domain you control)

4) Deploy:
```bash
wrangler deploy
```

5) Put the resulting URL into the frontend:
- Cloudflare Pages env var: `NEXT_PUBLIC_BOOKING_ENDPOINT=https://<worker-url>/api/booking`

## Optional anti-spam
Add Cloudflare Turnstile and verify token in the Worker.
