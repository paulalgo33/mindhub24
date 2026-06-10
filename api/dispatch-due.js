// MindHub24 — queue dispatcher
// Called every 10 min by Supabase pg_cron (or Vercel Cron).
// Drains scheduled_messages whose send_at <= now and status = pending.
// Sends via email/telegram, marks sent. Skips abandon_nudge if partial completed.

import { sbSelect, sbUpdate, sendEmail, sendTelegram } from './_lib.js';
import {
  emailReminder24h, emailReminder1h, emailFeedback, emailAbandonNudge,
  tgInternalAbandon,
} from './_templates.js';

const CRON_SECRET = process.env.CRON_SECRET;
const INTERNAL_CHATS = (process.env.TELEGRAM_INTERNAL_CHAT_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);

export default async function handler(req, res) {
  // simple shared-secret guard so randos can't trigger sends
  const auth = req.headers['authorization'] || req.query?.key;
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}` && auth !== CRON_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const nowIso = new Date().toISOString();
  let processed = 0, failed = 0, skipped = 0;

  try {
    // pull due messages (cap at 50 per run)
    const due = await sbSelect(
      'scheduled_messages',
      `status=eq.pending&send_at=lte.${nowIso}&select=*&order=send_at.asc&limit=50`
    );

    for (const msg of due) {
      try {
        // resolve the related record
        let booking = null, partial = null;
        if (msg.booking_id) {
          const b = await sbSelect('bookings', `id=eq.${msg.booking_id}&select=*`);
          booking = b[0];
        }
        if (msg.partial_id) {
          const pr = await sbSelect('partial_bookings', `id=eq.${msg.partial_id}&select=*`);
          partial = pr[0];
        }

        // skip rules
        if (booking && booking.status === 'cancelled') {
          await mark(msg.id, 'skipped'); skipped++; continue;
        }
        if (msg.kind === 'abandon_nudge' && partial && partial.completed) {
          await mark(msg.id, 'skipped'); skipped++; continue;
        }

        // build + send
        await dispatch(msg, booking, partial);
        await mark(msg.id, 'sent');
        processed++;
      } catch (e) {
        failed++;
        await sbUpdate('scheduled_messages', `id=eq.${msg.id}`, {
          attempts: (msg.attempts || 0) + 1,
          error: String(e).slice(0, 400),
          status: (msg.attempts || 0) >= 2 ? 'failed' : 'pending',
        });
      }
    }

    return res.status(200).json({ ok: true, processed, failed, skipped, scanned: due.length });
  } catch (err) {
    console.error('dispatch error', err);
    return res.status(500).json({ error: String(err) });
  }
}

async function mark(id, status) {
  await sbUpdate('scheduled_messages', `id=eq.${id}`, {
    status, sent_at: new Date().toISOString(),
  });
}

async function dispatch(msg, booking, partial) {
  const b = booking || {};
  switch (msg.kind) {
    case 'reminder_24h': {
      const m = emailReminder24h({ name: b.name, appointment_at: b.appointment_at, timezone: b.timezone, meetingUrl: b.meeting_url });
      return sendEmail({ to: msg.recipient, ...m });
    }
    case 'reminder_1h': {
      const m = emailReminder1h({ name: b.name, meetingUrl: b.meeting_url });
      return sendEmail({ to: msg.recipient, ...m });
    }
    case 'feedback_1h': {
      const m = emailFeedback({ name: b.name });
      return sendEmail({ to: msg.recipient, ...m });
    }
    case 'abandon_nudge': {
      const m = emailAbandonNudge({ name: partial?.name });
      await sendEmail({ to: msg.recipient, ...m });
      // mark nudge sent + ping internal
      if (partial) {
        await sbUpdate('partial_bookings', `id=eq.${partial.id}`, { nudge_sent: true });
        const ping = tgInternalAbandon({ name: partial.name, email: partial.email });
        for (const chatId of INTERNAL_CHATS) {
          try { await sendTelegram({ chatId, text: ping }); } catch (e) { /* */ }
        }
      }
      return;
    }
    default:
      throw new Error(`unknown kind ${msg.kind}`);
  }
}
