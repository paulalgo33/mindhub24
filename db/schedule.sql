-- MindHub24 — pg_cron scheduler setup
-- Run this in Supabase SQL Editor AFTER schema.sql and AFTER deploying to Vercel.
-- Replace the two placeholders below first.

-- Vercel Hobby cron only runs once/day, so we schedule from inside Supabase instead.
-- This calls the Vercel dispatch endpoint every 10 minutes.

-- 1. Make sure extensions are on (also in schema.sql)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Schedule the dispatcher. EDIT THESE TWO VALUES:
--    <YOUR_SITE>     e.g. mindhub24.com
--    <CRON_SECRET>   the same value you set in Vercel env (CRON_SECRET)

select cron.schedule(
  'mh24-dispatch-due',
  '*/10 * * * *',
  $$
  select net.http_post(
    url     := 'https://<YOUR_SITE>/api/dispatch-due',
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'Authorization', 'Bearer <CRON_SECRET>'
               ),
    body    := '{}'::jsonb
  );
  $$
);

-- To inspect:        select * from cron.job;
-- To remove/rename:  select cron.unschedule('mh24-dispatch-due');
-- To watch runs:     select * from cron.job_run_details order by start_time desc limit 20;
