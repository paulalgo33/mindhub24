// MindHub24 — Message templates (Russian)
// All client-facing copy lives here. Plain functions returning {subject, html, text}.
// Brand rules: психолог-консультант, free 15-min consult, warm/non-clinical tone.

const BRAND = {
  name: 'MindHub24',
  from: 'MindHub24 <hello@mindhub24.com>',
  site: 'https://mindhub24.com',
  telegram: 'https://t.me/mindhub24',
  email: 'hello@mindhub24.com',
};

function fmtDate(iso, tz = 'Europe/Moscow') {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', timeZone: tz,
  }).format(d);
}

const shell = (inner) => `
<div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;background:#FAF7F2;padding:32px 24px;color:#1B4D5C;">
  <div style="text-align:center;margin-bottom:24px;">
    <span style="font-size:22px;font-weight:600;color:#0F2E38;letter-spacing:-0.5px;">MindHub24</span>
  </div>
  <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #e8e0d4;">
    ${inner}
  </div>
  <p style="text-align:center;font-size:12px;color:#9a8f7d;margin-top:20px;line-height:1.6;">
    MindHub24 · Психологическое консультирование онлайн<br>
    <a href="${BRAND.telegram}" style="color:#1B4D5C;">Telegram</a> ·
    <a href="mailto:${BRAND.email}" style="color:#1B4D5C;">${BRAND.email}</a>
  </p>
  <p style="text-align:center;font-size:11px;color:#c0b6a4;margin-top:8px;">
    Если вы в кризисе — немедленно звоните 112. MindHub24 не является экстренной службой.
  </p>
</div>`;

const btn = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#0F2E38;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:500;margin:8px 0;">${label}</a>`;

// ---------- CLIENT EMAILS ----------

export function emailConfirmation({ name, appointment_at, timezone, meetingUrl }) {
  const when = fmtDate(appointment_at, timezone);
  return {
    subject: 'Ваша встреча подтверждена — MindHub24',
    html: shell(`
      <h1 style="font-size:20px;font-weight:600;margin:0 0 12px;color:#0F2E38;">Здравствуйте, ${name}!</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Ваша бесплатная первая встреча подтверждена. Это знакомство — 15 минут, без анкет и диагнозов. Просто разговор.</p>
      <div style="background:#F3EDE4;border-radius:12px;padding:16px;margin:16px 0;">
        <p style="font-size:13px;color:#9a8f7d;margin:0 0 4px;">КОГДА</p>
        <p style="font-size:16px;font-weight:500;margin:0;color:#0F2E38;">${when}</p>
      </div>
      ${meetingUrl ? btn(meetingUrl, 'Ссылка на встречу') : ''}
      <p style="font-size:14px;line-height:1.6;margin:16px 0 0;color:#5a6b6f;">Вам не нужно готовиться. Если нужно перенести — просто ответьте на это письмо.</p>
    `),
    text: `Здравствуйте, ${name}! Ваша бесплатная первая встреча подтверждена.\n\nКогда: ${when}\n${meetingUrl ? `Ссылка: ${meetingUrl}\n` : ''}\nВам не нужно готовиться. Чтобы перенести — ответьте на это письмо.\n\nMindHub24`,
  };
}

export function emailReminder24h({ name, appointment_at, timezone, meetingUrl }) {
  const when = fmtDate(appointment_at, timezone);
  return {
    subject: 'Напоминание: встреча завтра — MindHub24',
    html: shell(`
      <h1 style="font-size:20px;font-weight:600;margin:0 0 12px;color:#0F2E38;">${name}, напоминаем о встрече</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Ваша встреча с психологом-консультантом — уже завтра.</p>
      <div style="background:#F3EDE4;border-radius:12px;padding:16px;margin:16px 0;">
        <p style="font-size:16px;font-weight:500;margin:0;color:#0F2E38;">${when}</p>
      </div>
      ${meetingUrl ? btn(meetingUrl, 'Ссылка на встречу') : ''}
      <p style="font-size:14px;line-height:1.6;margin:16px 0 0;color:#5a6b6f;">Если планы изменились — ответьте на это письмо, перенесём.</p>
    `),
    text: `${name}, напоминаем: ваша встреча уже завтра.\n\n${when}\n${meetingUrl ? `Ссылка: ${meetingUrl}\n` : ''}\nЧтобы перенести — ответьте на письмо.\n\nMindHub24`,
  };
}

export function emailReminder1h({ name, meetingUrl }) {
  return {
    subject: 'Встреча через час — MindHub24',
    html: shell(`
      <h1 style="font-size:20px;font-weight:600;margin:0 0 12px;color:#0F2E38;">${name}, встреча через час</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Скоро увидимся. Ничего устанавливать не нужно — просто нажмите ссылку в нужное время.</p>
      ${meetingUrl ? btn(meetingUrl, 'Перейти к встрече') : ''}
    `),
    text: `${name}, ваша встреча через час.\n${meetingUrl ? `Ссылка: ${meetingUrl}\n` : ''}\nMindHub24`,
  };
}

export function emailFeedback({ name }) {
  return {
    subject: 'Как прошла встреча? — MindHub24',
    html: shell(`
      <h1 style="font-size:20px;font-weight:600;margin:0 0 12px;color:#0F2E38;">${name}, спасибо, что пришли</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Надеемся, встреча была тёплой и полезной. Если захотите продолжить — просто ответьте на это письмо, и мы подберём удобное время.</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">А если есть пара слов о том, как всё прошло — нам важно это услышать.</p>
      ${btn(BRAND.telegram, 'Написать в Telegram')}
    `),
    text: `${name}, спасибо, что пришли на встречу.\n\nЕсли захотите продолжить — ответьте на это письмо.\nЕсли есть пара слов о встрече — будем рады услышать.\n\nMindHub24`,
  };
}

export function emailAbandonNudge({ name }) {
  const greet = name ? `${name}, ` : '';
  return {
    subject: 'Вы почти записались — MindHub24',
    html: shell(`
      <h1 style="font-size:20px;font-weight:600;margin:0 0 12px;color:#0F2E38;">${greet}остался один шаг</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Кажется, вы начали записываться на бесплатную встречу, но не завершили. Это нормально — первый шаг бывает непростым.</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Встреча длится 15 минут. Без обязательств, без анкет. Просто знакомство.</p>
      ${btn(BRAND.site + '/book/', 'Выбрать время')}
    `),
    text: `${greet}кажется, вы начали записываться, но не завершили.\n\nВстреча — 15 минут, без обязательств.\nВыбрать время: ${BRAND.site}/book/\n\nMindHub24`,
  };
}

// ---------- INTERNAL TELEGRAM (to Alexandra + Sudipto) ----------

export function tgInternalNewBooking({ name, email, appointment_at, timezone }) {
  const when = fmtDate(appointment_at, timezone);
  return `🟢 *Новая запись*\n\n👤 ${name}\n✉️ ${email}\n📅 ${when}`;
}

export function tgInternalAbandon({ name, email }) {
  return `🟡 *Незавершённая запись*\n\n👤 ${name || '—'}\n✉️ ${email}\n_Отправлено напоминание._`;
}

// ---------- CLIENT TELEGRAM (only if they gave @handle / chat_id) ----------

export function tgClientReminder24h({ name, appointment_at, timezone }) {
  const when = fmtDate(appointment_at, timezone);
  return `Здравствуйте, ${name}! Напоминаем: ваша встреча с психологом-консультантом уже завтра — ${when}. До встречи 🌿`;
}

export const _BRAND = BRAND;
