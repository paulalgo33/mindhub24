// MindHub24 — shared send + db helpers (Vercel serverless, Node runtime)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ---- Supabase REST helpers (no SDK needed) ----
export async function sbInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`sbInsert ${table}: ${res.status} ${await res.text()}`);
  return (await res.json())[0];
}

export async function sbSelect(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`sbSelect ${table}: ${res.status}`);
  return res.json();
}

export async function sbUpdate(table, query, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`sbUpdate ${table}: ${res.status} ${await res.text()}`);
  return res;
}

// ---- Resend email ----
export async function sendEmail({ to, subject, html, text, from }) {
  if (!RESEND_KEY) throw new Error('RESEND_API_KEY missing');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from || 'MindHub24 <hello@mindhub24.com>',
      to: [to], subject, html, text,
    }),
  });
  if (!res.ok) throw new Error(`Resend: ${res.status} ${await res.text()}`);
  return res.json();
}

// ---- Telegram ----
export async function sendTelegram({ chatId, text }) {
  if (!TG_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN missing');
  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
  if (!res.ok) throw new Error(`Telegram: ${res.status} ${await res.text()}`);
  return res.json();
}

// ---- enqueue a future message ----
export async function enqueue({ booking_id, partial_id, kind, channel, recipient, send_at }) {
  return sbInsert('scheduled_messages', {
    booking_id: booking_id || null,
    partial_id: partial_id || null,
    kind, channel, recipient,
    send_at: new Date(send_at).toISOString(),
  });
}

export function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
