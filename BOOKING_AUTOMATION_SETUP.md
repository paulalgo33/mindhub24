# MindHub24 — Booking Automation Setup

Everything is built and committed. This is the checklist of accounts + keys you create once,
then the system runs itself. Email + Telegram only (WhatsApp skipped for now).

## What this does

1. Visitor books a free 15-min consult on `/book` (Cal.com).
2. **Immediately:** confirmation email to client + Telegram ping to Alexandra & Sudipto.
3. **24h before** the appointment: reminder email.
4. **1h before:** final reminder email.
5. **1h after:** feedback request email.
6. **Partial booking** (entered email + ticked consent but didn't finish): nudge email 1h later.
   If they complete, the nudge is auto-skipped.

---

## Step 1 — Cal.com (the calendar)

1. Sign up at cal.com (free). Username: `mindhub24`.
2. Create an event type:
   - Title: **Ознакомительная встреча (бесплатно)**
   - Duration: **15 min**
   - URL slug: **15min**  → public link becomes `cal.com/mindhub24/15min`
   - Location: your video tool (Cal Video / Google Meet / Zoom)
   - Connect Alexandra's Google Calendar so availability is real.
3. Set up the webhook:
   - Cal.com → Settings → Developer → Webhooks → New
   - Subscriber URL: `https://mindhub24.com/api/booking-webhook`
   - Event triggers: **Booking Created**
   - Save.

> The embed on `/book` already points to `mindhub24/15min`. If you use a different slug,
> change `calLink` in `src/pages/book/index.astro` (one line) and redeploy.

---

## Step 2 — Supabase (the database)

1. Sign up at supabase.com (free). New project → name `mindhub24`.
2. Database → Extensions → enable **pg_cron** and **pg_net**.
3. SQL Editor → paste contents of `db/schema.sql` → Run.
4. Settings → API → copy:
   - `Project URL`  → this is `SUPABASE_URL`
   - `service_role` secret key → this is `SUPABASE_SERVICE_ROLE_KEY`

(Do the `db/schedule.sql` step LAST, after Vercel env vars are set — Step 6.)

---

## Step 3 — Resend (email sending)

1. Sign up at resend.com (free, 3,000 emails/month).
2. Add domain `mindhub24.com` → Resend gives you DNS records (SPF/DKIM).
3. Add those records at Hostinger DNS (TXT + CNAME). Wait for "Verified".
4. API Keys → create → copy → this is `RESEND_API_KEY`.

> Until the domain verifies, you can test with Resend's `onboarding@resend.dev` sender.
> Once verified, mail comes from `hello@mindhub24.com`.

---

## Step 4 — Telegram (pings + reminders)

1. In Telegram, message **@BotFather** → `/newbot` → name it → copy the token → `TELEGRAM_BOT_TOKEN`.
2. Get chat IDs for Alexandra and yourself:
   - Each person messages the new bot once (say "hi").
   - Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser.
   - Find each `"chat":{"id":NNNNN}` → those numbers are the chat IDs.
3. `TELEGRAM_INTERNAL_CHAT_IDS` = both IDs, comma-separated, e.g. `111111,222222`.

---

## Step 5 — Vercel env vars

Vercel → mindhub24 → Settings → Environment Variables. Add (Production):

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | from Step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | from Step 2 |
| `RESEND_API_KEY` | from Step 3 |
| `TELEGRAM_BOT_TOKEN` | from Step 4 |
| `TELEGRAM_INTERNAL_CHAT_IDS` | from Step 4 |
| `CRON_SECRET` | make up a long random string |

Redeploy (Vercel → Deployments → Redeploy) so the functions pick up the vars.

---

## Step 6 — Turn on the scheduler

1. Open `db/schedule.sql`.
2. Replace `<YOUR_SITE>` with `mindhub24.com` and `<CRON_SECRET>` with the value from Step 5.
3. Supabase SQL Editor → paste → Run.
4. Verify: `select * from cron.job;` — you should see `mh24-dispatch-due` every 10 min.

---

## Step 7 — Test end to end

1. Book a test slot on `https://mindhub24.com/book` using your own email, ~2h out.
2. Within seconds: you should get a confirmation email + a Telegram ping.
3. Check Supabase → `bookings` (1 row) and `scheduled_messages` (3 rows: reminder_24h, reminder_1h, feedback_1h).
4. To force a reminder now (instead of waiting), in SQL Editor:
   `update scheduled_messages set send_at = now() where kind='feedback_1h';`
   then wait up to 10 min (or hit `/api/dispatch-due` manually with the secret).

---

## Files (all committed)

| File | Purpose |
|------|---------|
| `db/schema.sql` | Tables: bookings, partial_bookings, scheduled_messages |
| `db/schedule.sql` | pg_cron job (every 10 min) |
| `api/booking-webhook.js` | Cal.com → store + confirm + enqueue |
| `api/partial-capture.js` | Capture abandoners (with consent) |
| `api/dispatch-due.js` | Drains the queue, sends due messages |
| `api/_templates.js` | All Russian email + Telegram copy |
| `api/_lib.js` | Supabase / Resend / Telegram helpers |
| `src/pages/book/index.astro` | Live Cal.com embed + consent capture form |
| `.env.example` | Env var template |

## Costs

All free tiers cover this comfortably: Cal.com (free), Supabase (free), Resend (3k/mo free),
Telegram (free), Vercel (Hobby). Zero monthly cost at your volume.
