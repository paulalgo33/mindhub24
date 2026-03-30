# MindHub24 — Production Website

> Premium online psychological counseling practice for Russian-speaking clients worldwide.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Astro 5** | Static-first, zero JS by default, content collections ready |
| Styling | **Tailwind CSS v4** | Vite plugin, `@theme` design tokens, no config file |
| Animations | **GSAP 3 + ScrollTrigger** | Cinematic scroll reveals, parallax, counters |
| Images | **Astro Image + Sharp** | Auto WebP, responsive `srcset`, lazy loading |
| Deployment | **Cloudflare Pages** | Free, global CDN, automatic builds |
| Analytics | **Plausible** | Privacy-first, no cookies, GDPR-compliant |
| Booking | **Cal.com** | Free tier, timezone handling, webhook support |
| Forms | **Tally** | GDPR-compliant, free, embeddable |
| Email | **MailerLite** | Free under 1000 subs, automation |
| Automation | **Make.com** | Connects Cal.com → Sheets → MailerLite → Telegram |

## Project Structure

```
mindhub24/
├── astro.config.mjs           # Astro 5 config + Tailwind Vite plugin + sitemap
├── package.json
├── tsconfig.json              # Path aliases (@/components, @/assets, etc.)
├── public/
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── styles/
│   │   └── global.css         # Tailwind @theme design system, animations, night mode
│   ├── i18n/
│   │   └── ru.ts              # Type-safe Russian translations (all copy)
│   ├── layouts/
│   │   └── LandingLayout.astro  # Base: meta, OG, JSON-LD, night detection, cursor glow
│   ├── components/
│   │   ├── Nav.astro            # Glassmorphic sticky nav
│   │   ├── Hero.astro           # Day/night variants, ambient orbs, floating badge
│   │   ├── Marquee.astro        # Infinite scroll trust ticker
│   │   ├── AudioPlayer.astro    # Voice recording player with waveform
│   │   ├── Quiz.astro           # 5-question interactive modal quiz
│   │   ├── Voices.astro         # Dark masonry anonymous quotes
│   │   ├── CalBooking.astro     # Cal.com embed (inline or modal)
│   │   ├── Analytics.astro      # Plausible with custom MindHub24 events
│   │   ├── MetaPixel.astro      # Facebook/Instagram pixel
│   │   └── Footer.astro         # Crisis numbers + legal links
│   ├── scripts/
│   │   └── scroll-animations.ts # GSAP ScrollTrigger cinematic engine
│   ├── pages/
│   │   ├── index.astro          # Root redirect → /lp/israel
│   │   └── lp/
│   │       ├── israel.astro     # 14-section landing page (€50 / ₪190)
│   │       └── russia.astro     # Russia variant (5 000 ₽, no Meta refs)
│   └── assets/
│       └── images/              # Alexandra photos (auto-optimized to WebP)
└── dist/                        # Build output
```

## Quick Start

```bash
# Install
npm install

# Development
npm run dev          # http://localhost:4321

# Build
npm run build        # Static output → dist/

# Preview build
npm run preview      # Local preview of built site
```

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Done — automatic deploys on push

## Design System

### Colors (defined in `src/styles/global.css` via `@theme`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-deep` | `#0F2E38` | Primary dark, buttons, nav |
| `--color-primary` | `#1B4D5C` | Accent borders, links |
| `--color-primary-light` | `#2A7A91` | Hover states |
| `--color-accent` | `#C9A84C` | Gold accents, labels |
| `--color-cream` | `#FAF7F2` | Main background |
| `--color-warm` | `#F3EDE4` | Alternating sections |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | Playfair Display | 400–700 |
| Body | DM Sans | 300–600 |

### UX Features

- **Night mode** (23:00–05:00): Auto-detects, swaps hero to "Не спится?" with breathing exercise
- **Cursor glow**: Ambient light follows mouse (desktop only)
- **Film grain**: Subtle texture overlay for tactile depth
- **Scroll reveals**: IntersectionObserver-based fade-up animations
- **GSAP parallax**: Image parallax on scroll
- **Interactive quiz**: 5-question modal, same result for everyone (therapeutic mirror)
- **Audio waveform**: Animated bars synced to playback

## Analytics Events

All events fire via Plausible custom events (`window.mh24.*`):

| Event | Trigger |
|-------|---------|
| `cta_click` | Any CTA button |
| `booking_widget_open` | Cal.com modal opens |
| `booking_confirmed` | Booking completed |
| `quiz_start` | Quiz opened |
| `quiz_complete` | Quiz finished |
| `audio_play` | Audio player started |
| `night_mode_active` | Night visitor detected |
| `lp_scroll_depth` | 25/50/75/100% scroll |
| `crisis_page_view` | Crisis section viewed |

## Landing Pages

| URL | Market | Price | Ad Source |
|-----|--------|-------|-----------|
| `/lp/israel` | Israel | €50 / ₪190 | Meta Ads |
| `/lp/russia` | Russia | 5 000 ₽ | Google Ads |
| `/lp/poland` | Poland | €50 | Meta Ads |
| `/lp/baltics` | Baltics | €50 | Meta Ads |

## Next Steps

### To Complete Before Launch
1. Replace `PIXEL_ID_HERE` in MetaPixel component with actual pixel ID
2. Set up Cal.com account, update `calLink` in CalBooking component
3. Record Alexandra's audio, place MP3 in `public/audio/`
4. Add `audioSrc="/audio/first-session.mp3"` to AudioPlayer props
5. Set up Plausible account at plausible.io
6. Configure custom domain in Cloudflare Pages

### Phase 2 Additions
- Poland and Baltics landing pages (same structure, different pricing/copy)
- English translations (`src/i18n/en.ts`)
- Blog with Astro Content Collections
- Main site pages (`/ru/about`, `/ru/services/*`, etc.)
- Telegram bot integration
- Stripe payment at booking (Cal.com integration)

## Legal Safety

- Title used: "Психолог-консультант" (legally safe with Russian degree)
- Never: "Психотерапевт", "Клинический психолог", "Licensed psychologist"
- Service: "Психологическое консультирование" (not "лечение" or "терапия")
- Crisis disclaimers on every landing page
- No health data collected in chatbots or casual channels
