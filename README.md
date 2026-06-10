# MindHub24 — Production Website

> Russian-language online psychology consulting practice for Russian-speaking expats worldwide.
> Founder: Alexandra (Психолог-консультант). Operator: Sudipto Paul.

---

## ⚡ Source of truth

| What | Where |
|------|-------|
| **Live site** | https://mindhub24.com (→ Vercel) |
| **Preview** | https://mindhub24.vercel.app |
| **GitHub repo** | https://github.com/paulalgo33/mindhub24 |
| **Local clone** | `~/Projects/mindhub24` |
| **Vercel project** | bivaestn-9955s-projects / mindhub24 |
| **Deploy** | Auto on push to `main` |

**This repo is the ONE canonical source. Nothing else is authoritative.**

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5 (static) |
| Styling | Tailwind CSS v4 |
| Animations | GSAP 3 + ScrollTrigger |
| Deployment | Vercel (auto-deploy from main) |
| Analytics | Plausible (privacy-first, no cookies) |
| Booking | Cal.com embed (⚠ NOT YET WIRED — see TODO) |
| Forms | Tally |
| Email | MailerLite |

---

## Project structure

```
mindhub24/
├── api/
│   └── claude.js              # Serverless functions (AI tools: journal, reframe, studio)
├── public/
│   ├── images/                # Alexandra photos + stock images
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/            # Nav, Hero, Quiz, AudioPlayer, CalBooking, Footer etc.
│   ├── content/
│   │   ├── blog/              # 10 Russian blog articles (MD)
│   │   └── config.ts
│   ├── i18n/
│   │   └── ru.ts              # All Russian copy (type-safe)
│   ├── layouts/               # LandingLayout, MainLayout, ToolLayout
│   ├── pages/
│   │   ├── index.astro        # Root → redirects to /lp/israel
│   │   ├── lp/                # israel, russia, poland, baltics, free-consult
│   │   ├── services/          # 9 service pages
│   │   ├── tools/             # journal, reframe, studio + 10 more tools
│   │   ├── about/             # alexandra, approach
│   │   ├── blog/              # index + [slug]
│   │   ├── book/              # Cal.com booking page
│   │   ├── team/              # Team page
│   │   ├── testimonials/
│   │   ├── faq/
│   │   ├── crisis/
│   │   └── [legal]/           # privacy, terms, cookies, disclaimer, cancellation
│   ├── scripts/
│   │   └── scroll-animations.ts
│   └── styles/
│       └── global.css         # Design tokens, night mode, animations
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Quick start

```bash
cd ~/Projects/mindhub24
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
```

---

## Design system

| Token | Value | Usage |
|-------|-------|-------|
| `--color-deep` | `#0F2E38` | Primary dark, buttons, nav |
| `--color-primary` | `#1B4D5C` | Accent borders, links |
| `--color-accent` | `#C9A84C` | Gold accents |
| `--color-cream` | `#FAF7F2` | Main background |

Fonts: **Playfair Display** (headings) · **DM Sans** (body)

---

## Non-negotiables (brand rules)

- Alexandra's title: **Психолог-консультант** — never психотерапевт or therapist
- Sole booking CTA: free 15-min consultation
- No fabricated testimonials — real anonymized only
- Russian is source language — never translate-from-English
- Crisis block on every page with verified emergency numbers
- No AI disclosure in user-facing copy

---

## TODO before production launch

- [ ] **Cal.com** — create event "Ознакомительная встреча 15 мин", add calLink to `src/components/CalBooking.astro`
- [ ] **DNS** — point mindhub24.com A record → `76.76.21.21` at Hostinger (in progress 2026-06-10)
- [ ] **Meta Pixel** — replace `PIXEL_ID_HERE` in `src/components/MetaPixel.astro`
- [ ] **Plausible** — add snippet, verify events firing
- [ ] **Audio** — Alexandra records intro MP3 → `public/audio/first-session.mp3`
- [ ] **Testimonials** — replace placeholder quotes with real anonymized client feedback

---

## Deployment

Vercel auto-deploys on every push to `main`. No manual step needed.

```bash
git add .
git commit -m "your message"
git push origin main
# → Vercel builds and deploys automatically
```

Custom domain setup: Vercel dashboard → Domains → add `mindhub24.com` + `www.mindhub24.com`

---

## Archives (do not use for deployment)

| Path | What | Why archived |
|------|------|--------------|
| `~/Projects/mindhub24-ARCHIVE-2026-04-25` | Local dev build, Apr 2026 sprint | No git remote, predates production site |
| `~/Documents/Claude/Projects/Mindhub24_Project/repo-staging-ARCHIVE-2026-04-25` | Claude Code staging copy | No git, no remote, older content |

Both archives contain reviewed Russian content (modules, practices) that may be merged into production in Phase 2.

---

## Related systems

| System | Location | Purpose |
|--------|----------|---------|
| Content OS (mh24-os) | `~/Code/mh24-os/` | Automated content pipeline (Instagram/Telegram) |
| Cockpit dashboard | `~/Code/mh24-os/cockpit/` | Weekly strategy UI |
| Kingston SSD | `/Volumes/Kingston/mh24/` | Pipeline artifacts + DB backups |
| Postgres DB | localhost:5432 db=mh24 | Content pipeline state |

---

*Last updated: 2026-06-10 · Maintained by Sudipto Paul*
