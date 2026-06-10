-- MindHub24 — Booking Automation Schema
-- Database: Supabase (Postgres)
-- Run this in Supabase SQL Editor once.

-- ============================================================
-- 1. BOOKINGS — completed Cal.com bookings
-- ============================================================
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  cal_booking_uid text unique,                 -- Cal.com's booking UID (idempotency)
  name            text not null,
  email           text not null,
  phone           text,                        -- optional, for future
  telegram        text,                        -- optional @handle if provided
  appointment_at  timestamptz not null,        -- when the session is
  timezone        text default 'Europe/Moscow',
  locale          text default 'ru',
  status          text default 'confirmed',    -- confirmed | cancelled | completed | no_show
  source          text default 'cal',          -- cal | manual
  created_at      timestamptz default now()
);

create index if not exists idx_bookings_appt on bookings(appointment_at);
create index if not exists idx_bookings_status on bookings(status);

-- ============================================================
-- 2. PARTIAL_BOOKINGS — people who started but didn't finish
-- ============================================================
create table if not exists partial_bookings (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  consent      boolean default false,          -- GDPR: they ticked the box
  completed    boolean default false,          -- flipped true if they later complete
  nudge_sent   boolean default false,          -- abandon-nudge already sent?
  created_at   timestamptz default now()
);

create index if not exists idx_partial_email on partial_bookings(email);
create index if not exists idx_partial_pending on partial_bookings(completed, nudge_sent);

-- ============================================================
-- 3. SCHEDULED_MESSAGES — the queue the cron drains
-- ============================================================
-- Each row is one message to send at send_at.
-- kind: confirmation | reminder_24h | reminder_1h | feedback_1h | abandon_nudge | internal_ping
-- channel: email | telegram
create table if not exists scheduled_messages (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid references bookings(id) on delete cascade,
  partial_id   uuid references partial_bookings(id) on delete cascade,
  kind         text not null,
  channel      text not null,                  -- email | telegram
  recipient    text not null,                  -- email address or telegram chat_id
  send_at      timestamptz not null,
  sent_at      timestamptz,                    -- null until sent
  status       text default 'pending',         -- pending | sent | failed | skipped
  error        text,
  attempts     int default 0,
  created_at   timestamptz default now()
);

create index if not exists idx_sched_due on scheduled_messages(send_at, status);

-- ============================================================
-- 4. pg_cron — drain the queue every 10 minutes
-- ============================================================
-- Requires pg_cron + pg_net extensions (enable in Supabase Dashboard → Database → Extensions)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule: every 10 min, call the dispatch Edge Function.
-- Replace <PROJECT_REF> and <ANON_OR_SERVICE_KEY> placeholders after deploy.
-- (We set this up via the setup script, not hardcoded here.)

-- Example (configured by setup script):
-- select cron.schedule(
--   'dispatch-due-messages',
--   '*/10 * * * *',
--   $$ select net.http_post(
--        url := 'https://<PROJECT_REF>.functions.supabase.co/dispatch-due',
--        headers := '{"Authorization": "Bearer <SERVICE_KEY>", "Content-Type": "application/json"}'::jsonb
--      ); $$
-- );

-- ============================================================
-- 5. Row Level Security — lock everything down
-- ============================================================
alter table bookings enable row level security;
alter table partial_bookings enable row level security;
alter table scheduled_messages enable row level security;
-- No public policies = only service_role key can read/write. Front-end never touches these directly.
