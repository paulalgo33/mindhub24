// MindHub24 — Cal.com booking webhook
// Cal.com fires this on BOOKING_CREATED. We:
//   1. store the booking
//   2. send confirmation (email now)
//   3. ping Alexandra + Sudipto on Telegram
//   4. enqueue 24h / 1h reminders + 1h feedback
//   5. mark any matching partial_booking as completed

import { sbInsert, sbUpdate, sendEmail, sendTelegram, enqueue, readBody } from './_lib.js';
import {
  emailConfirmation, tgInternalNewBooking, _BRAND,
} from './_templates.js';

const INTERNAL_CHATS = (process.env.TELEGRAM_INTERNAL_CHAT_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = await readBody(req);

    // Cal.com payload shape: { triggerEvent, payload: {...} }
    const trigger = body.triggerEvent;
    const p = body.payload || {};

    if (trigger && trigger !== 'BOOKING_CREATED') {
      return res.status(200).json({ ok: true, ignored: trigger });
    }

    const attendee = (p.attendees && p.attendees[0]) || {};
    const name = attendee.name || p.responses?.name?.value || 'Гость';
    const email = attendee.email || p.responses?.email?.value;
    const appointment_at = p.startTime || p.start;
    const timezone = attendee.timeZone || p.organizer?.timeZone || 'Europe/Moscow';
    const meetingUrl = p.metadata?.videoCallUrl || p.location || null;
    const cal_uid = p.uid;

    if (!email || !appointment_at) {
      return res.status(400).json({ error: 'missing email or startTime', got: { email, appointment_at } });
    }

    // 1. store booking (idempotent on cal_booking_uid)
    let booking;
    try {
      booking = await sbInsert('bookings', {
        cal_booking_uid: cal_uid, name, email,
        appointment_at, timezone, locale: 'ru', status: 'confirmed',
      });
    } catch (e) {
      // duplicate webhook → already processed
      if (String(e).includes('duplicate') || String(e).includes('23505')) {
        return res.status(200).json({ ok: true, duplicate: true });
      }
      throw e;
    }

    // 2. confirmation email — immediately
    const conf = emailConfirmation({ name, appointment_at, timezone, meetingUrl });
    await sendEmail({ to: email, subject: conf.subject, html: conf.html, text: conf.text });

    // 3. internal Telegram pings (Alexandra + Sudipto)
    const ping = tgInternalNewBooking({ name, email, appointment_at, timezone });
    for (const chatId of INTERNAL_CHATS) {
      try { await sendTelegram({ chatId, text: ping }); } catch (e) { /* non-fatal */ }
    }

    // 4. enqueue future messages
    const appt = new Date(appointment_at).getTime();
    const t24 = new Date(appt - 24 * 3600 * 1000);
    const t1 = new Date(appt - 1 * 3600 * 1000);
    const tFeedback = new Date(appt + 1 * 3600 * 1000);

    // only enqueue reminders that are still in the future
    const now = Date.now();
    if (t24.getTime() > now)
      await enqueue({ booking_id: booking.id, kind: 'reminder_24h', channel: 'email', recipient: email, send_at: t24 });
    if (t1.getTime() > now)
      await enqueue({ booking_id: booking.id, kind: 'reminder_1h', channel: 'email', recipient: email, send_at: t1 });
    await enqueue({ booking_id: booking.id, kind: 'feedback_1h', channel: 'email', recipient: email, send_at: tFeedback });

    // 5. mark matching partial as completed (stops the abandon-nudge)
    try {
      await sbUpdate('partial_bookings', `email=eq.${encodeURIComponent(email)}&completed=eq.false`, { completed: true });
    } catch (e) { /* non-fatal */ }

    return res.status(200).json({ ok: true, booking_id: booking.id });
  } catch (err) {
    console.error('booking-webhook error', err);
    return res.status(500).json({ error: String(err) });
  }
}
