// MindHub24 — partial booking capture
// Called from /book when a visitor enters their email + ticks consent,
// BEFORE they complete the Cal.com flow. Lets us nudge abandoners.
// GDPR: only stored if consent === true.

import { sbInsert, sbSelect, enqueue, readBody } from './_lib.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { email, name, consent } = await readBody(req);
    if (!email || !consent) {
      return res.status(200).json({ ok: false, reason: 'no consent or email' });
    }

    // de-dupe: already captured & still pending?
    const existing = await sbSelect(
      'partial_bookings',
      `email=eq.${encodeURIComponent(email)}&completed=eq.false&select=id`
    );
    if (existing.length) return res.status(200).json({ ok: true, dedup: true });

    const partial = await sbInsert('partial_bookings', {
      email, name: name || null, consent: true, completed: false, nudge_sent: false,
    });

    // schedule abandon nudge 1 hour out — if they complete, webhook flips completed=true
    // and the dispatcher will skip it.
    const sendAt = new Date(Date.now() + 60 * 60 * 1000);
    await enqueue({ partial_id: partial.id, kind: 'abandon_nudge', channel: 'email', recipient: email, send_at: sendAt });

    return res.status(200).json({ ok: true, partial_id: partial.id });
  } catch (err) {
    console.error('partial-capture error', err);
    return res.status(500).json({ error: String(err) });
  }
}
