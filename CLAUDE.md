# CLAUDE.md — MindHub24 Project Instructions

## Project
MindHub24: Online psychological counseling practice for Russian-speaking clients worldwide.
Founder: Alexandra (Moldova). Title: "Психолог-консультант" (NEVER "психотерапевт" or "therapist").

## Tech Stack
- Astro 5 (static-first)
- Tailwind CSS v4 (Vite plugin, @theme in global.css)
- GSAP 3 + ScrollTrigger (scroll animations)
- Sharp (image optimization)
- Deploy: Vercel

## Commands
- `npm run dev` — local dev server at localhost:4321
- `npm run build` — static build to dist/
- `vercel --prod` — deploy to production

## Architecture
- src/i18n/ru.ts — ALL copy lives here (type-safe translations)
- src/styles/global.css — design system (@theme tokens, animations, night mode)
- src/layouts/LandingLayout.astro — base layout (meta, OG, JSON-LD, night mode, cursor glow, scroll reveal)
- src/components/ — reusable Astro components (12 total)
- src/pages/lp/ — country-specific landing pages (no main nav, conversion-optimized)
- src/pages/ — standalone pages (simulated session, grounding audio library)
- src/scripts/ — GSAP scroll animation engine
- src/assets/images/ — Alexandra's photos (auto-optimized to WebP by Astro)

## Design Rules
- Fonts: Playfair Display (headings, serif) + DM Sans (body, sans-serif)
- Primary: --color-deep (#0F2E38), --color-primary (#1B4D5C)
- Accent: --color-accent (#C9A84C) — muted gold
- Background: --color-cream (#FAF7F2), --color-warm (#F3EDE4)
- Night mode: auto-detect 23:00-05:00 via JS, swaps CSS vars + hero content
- Film grain overlay: 1.8% opacity SVG noise
- Cursor glow: 500px radial gradient following mouse (desktop only)
- Scroll reveals: IntersectionObserver, data-reveal attribute, 1.2s ease-out-expo
- All text: Russian-first, native (not translated-from-English feeling)
- Body font size: 16px base, 18px for reading-heavy sections
- Line height: 1.7 body, 1.15-1.2 headings
- Max content width: 720px for text, 1200-1400px for grids
- Buttons: 100px border-radius (pill shape), no ALL-CAPS ever

## Legal Safety — CRITICAL
- Professional title: ONLY "психолог-консультант" or "специалист по психологическому консультированию"
- NEVER use: "психотерапевт", "клинический психолог", "licensed psychologist", "therapist"
- Service: "психологическое консультирование" (NOT "лечение" or "терапия")
- Always include crisis numbers on every landing page
- Never imply local licensure in any target country

## Landing Page Structure (14 sections)
1. Hero (day/night variants) + Breathing circle (night only)
2. Trust marquee ticker
3. Pain recognition cards (4 cards, 2x2 grid)
4. How it works (3 steps)
5. Services (6 cards, dark background)
6. "What we don't do" approach section
7. Audio player (Alexandra's voice)
8. "What to say" phrases (pill cards)
9. Quiz (5-question modal)
10. About Alexandra (photo + credentials)
11. Pricing (2 cards: free consult + €50 session)
12. Voices wall (dark masonry, anonymous quotes)
13. Final CTA
14. Crisis footer + legal links

## Key Decisions
- Price hidden on main site, shown on landing pages only
- Israel: €50/₪190, Russia: 5000₽, Poland/Baltics: €50
- No app — web only (portal Phase 3 if 50+ clients)
- Cal.com for booking, Plausible for analytics (no cookies)
- Google Sheet CRM → HubSpot when volume justifies
- Make.com for automation (6 scenarios)
- MailerLite for email sequences

## Markets (priority order)
1. Israel — primary, Meta Ads, therapy-normalized culture
2. Russia — if Prodamus payment verified, Google Ads (Meta blocked)
3. Poland — post-2022 Russian-speaking influx, Meta Ads
4. Baltics (Latvia + Estonia) — identity crisis positioning

## Words to USE
поддержка, помощь, работа с собой, осознанность, устойчивость, ясность, опора, профессиональный, конфиденциально, в вашем темпе, на вашем языке, сложности, консультирование

## Words to AVOID
исцеление, трансформация, путешествие, просветление, токсичный, вселенная, энергия, целитель, коуч, магия, прорыв, проблемы (use "сложности"), лечение, терапевт/психотерапевт
