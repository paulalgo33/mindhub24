# MindHub24 — Claude Code Setup & Deployment Guide

Everything you need. Copy-paste each block in order.

---

## STEP 1: Install Claude Code

### macOS
```bash
curl -fsSL https://code.claude.com/install.sh | sh
```

### Windows (PowerShell as Administrator)
```powershell
irm https://code.claude.com/install.ps1 | iex
```

### Linux
```bash
curl -fsSL https://code.claude.com/install.sh | sh
```

### Verify it works
```bash
claude --version
```

> **Requirement:** You need a Claude Pro, Max, or Teams subscription.
> The free Claude.ai plan does NOT include Claude Code access.

---

## STEP 2: Authenticate Claude Code

```bash
claude
```

This opens your browser. Log in with your Anthropic/Claude account. Done.

---

## STEP 3: Install Git & Node.js (if not already)

### Check if you have them
```bash
git --version
node --version
```

### If missing — install Node.js
Go to https://nodejs.org → download LTS version → install.

### If missing — install Git
Go to https://git-scm.com → download → install.

---

## STEP 4: Install Vercel CLI

```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```
Follow the browser prompts to authenticate with your Vercel account.

---

## STEP 5: Create GitHub Repo & Clone Project

### Option A: Start from the zip I gave you
```bash
# Unzip the project
unzip mindhub24-project.zip
cd mindhub24

# Initialize git
git init
git add .
git commit -m "Initial commit: MindHub24 Astro project"

# Create repo on GitHub (using GitHub CLI, or do it on github.com)
# If you have GitHub CLI:
gh repo create mindhub24 --public --source=. --push

# If you don't have GitHub CLI, create repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/mindhub24.git
git branch -M main
git push -u origin main
```

### Option B: Start fresh with Claude Code
```bash
mkdir mindhub24
cd mindhub24
git init
claude
```

Then tell Claude Code:
```
I'm building MindHub24, an online psychology practice website for Russian-speaking 
clients. Use Astro 5 + Tailwind CSS v4 + GSAP. I have all project specs in my 
Claude.ai project. Set up the full project structure.
```

---

## STEP 6: Deploy to Vercel

### First deployment (from project folder)
```bash
cd mindhub24
vercel
```

Vercel will ask:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → mindhub24
- **Directory?** → ./
- **Override settings?** → Yes
  - **Build command:** `npm run build`
  - **Output directory:** `dist`
  - **Install command:** `npm install`

### After first setup, deploy updates with:
```bash
vercel --prod
```

### Or connect GitHub for auto-deploys:
1. Go to https://vercel.com/dashboard
2. Click your mindhub24 project → Settings → Git
3. Connect your GitHub repo
4. Now every `git push` auto-deploys

---

## STEP 7: Start Working with Claude Code

```bash
cd mindhub24
claude
```

### Your first prompt to Claude Code:
```
Read the entire project structure. This is MindHub24 — an online 
psychological counseling practice for Russian-speaking clients. 
The tech stack is Astro 5 + Tailwind CSS v4. 

Key files:
- src/i18n/ru.ts — all Russian copy
- src/styles/global.css — design system with @theme tokens
- src/pages/lp/israel.astro — main landing page
- src/components/ — all UI components

Confirm you understand the project structure, then we'll start working.
```

---

## STEP 8: Create CLAUDE.md (Project Memory)

Claude Code reads this file automatically every session.

```bash
claude
```

Then say:
```
Create a CLAUDE.md file in the project root with these instructions:

# CLAUDE.md — MindHub24 Project Instructions

## Project
MindHub24: Online psychological counseling practice for Russian-speaking clients worldwide.
Founder: Alexandra (Moldova). Title: "Психолог-консультант" (NEVER "психотерапевт" or "therapist").

## Tech Stack
- Astro 5 (static-first)
- Tailwind CSS v4 (Vite plugin, @theme in global.css)
- GSAP 3 + ScrollTrigger (scroll animations)
- Sharp (image optimization)
- Deploy: Vercel (currently), Hostinger later

## Commands
- `npm run dev` — local dev server at localhost:4321
- `npm run build` — static build to dist/
- `vercel --prod` — deploy to production

## Architecture
- src/i18n/ru.ts — ALL copy lives here (type-safe)
- src/styles/global.css — design system (@theme tokens)
- src/layouts/LandingLayout.astro — base layout (meta, night mode, cursor glow)
- src/components/ — reusable Astro components
- src/pages/lp/ — country-specific landing pages

## Design Rules
- Fonts: Playfair Display (headings) + DM Sans (body)
- Colors: --color-deep (#0F2E38), --color-primary (#1B4D5C), --color-accent (#C9A84C)
- Night mode: 23:00-05:00 auto-detect via JS
- All text: Russian-first, native (not translated-from-English)
- Professional titles: ONLY "психолог-консультант", NEVER "психотерапевт"
- Always include crisis numbers on landing pages

## Key Decisions
- Price hidden on main site, shown on landing pages
- Israel: €50/₪190, Russia: 5000₽
- No app — web only
- Cal.com for booking, Plausible for analytics (no cookies)
```

---

## EVERYDAY CLAUDE CODE WORKFLOWS

### Start your day
```bash
cd mindhub24
claude
```

### Common tasks — just type these as prompts:

**Fix something:**
```
The night mode breathing circle animation is jittery on mobile. Fix it.
```

**Add a new page:**
```
Create the Poland landing page at /lp/poland. Same structure as Israel 
but price is €50 (no shekel), and the hero subtitle should mention 
relocation-specific pain points for Russian speakers who moved to Poland.
```

**Update copy:**
```
In ru.ts, change the hero subtitle to: "Профессиональная психологическая 
помощь на русском языке. Из любой точки мира."
```

**Deploy:**
```
Run the build, make sure there are no errors, then deploy to Vercel.
```

**Git workflow:**
```
Show me what changed, create a commit with a good message, and push to GitHub.
```

**Add Cal.com booking:**
```
Replace all "Записаться" buttons on the Israel landing page with Cal.com 
modal booking. The Cal.com link is mindhub24/free-consult. Use the 
CalBooking component that's already in the project.
```

**Add Alexandra's audio:**
```
I've placed first-session.mp3 in public/audio/. Update the AudioPlayer 
component on the Israel page to use audioSrc="/audio/first-session.mp3".
```

**Run dev server:**
```
Start the dev server so I can preview changes.
```

**Check build:**
```
Build the project and report any errors or warnings.
```

---

## WHEN YOU BUY THE DOMAIN (Hostinger)

### Option A: Keep Vercel hosting, use Hostinger for domain only
Best option. Fastest, free CDN, auto-deploys.

In Claude Code:
```
I bought mindhub24.com on Hostinger. I want to keep hosting on Vercel 
but point my domain there. Walk me through the DNS setup step by step.
```

The steps will be:
1. In Vercel dashboard → Project → Settings → Domains → Add `mindhub24.com`
2. Vercel gives you DNS records (typically A record + CNAME)
3. In Hostinger DNS settings → replace default records with Vercel's records
4. Wait 1-24 hours for DNS propagation
5. Done — mindhub24.com serves from Vercel's CDN

### Option B: Move everything to Hostinger hosting
Not recommended but possible.

In Claude Code:
```
Build the project for static hosting on Hostinger. I need to upload 
the dist/ folder via FTP.
```

Then:
1. `npm run build`
2. Upload everything in `dist/` to Hostinger via File Manager or FTP
3. Set document root to the uploaded folder
4. Repeat manually every time you change something (this is why Vercel is better)

---

## USEFUL CLAUDE CODE COMMANDS

Inside Claude Code (after running `claude`):

| Command | What it does |
|---------|-------------|
| `/help` | Show all commands |
| `/clear` | Clear conversation context |
| `/compact` | Summarize conversation to save context |
| `/config` | Edit settings |
| `/cost` | Show token usage and cost |
| `/bug` | Report a bug to Anthropic |
| Ctrl+C | Cancel current operation |
| `/exit` or Ctrl+D | Exit Claude Code |

---

## PROJECT FILE MAP (for reference)

```
mindhub24/
├── CLAUDE.md                    ← Claude Code reads this every session
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── robots.txt
│   ├── site.webmanifest
│   └── audio/                   ← Put Alexandra's MP3s here
├── src/
│   ├── styles/global.css        ← Design system
│   ├── i18n/ru.ts               ← All Russian copy
│   ├── scripts/
│   │   └── scroll-animations.ts ← GSAP engine
│   ├── layouts/
│   │   └── LandingLayout.astro
│   ├── components/
│   │   ├── Analytics.astro      ← Plausible events
│   │   ├── AudioPlayer.astro    ← Voice recording player
│   │   ├── BreathingCircle.astro ← Night mode breathing
│   │   ├── CalBooking.astro     ← Cal.com embed
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Marquee.astro
│   │   ├── MetaPixel.astro      ← Facebook pixel
│   │   ├── MoodWeather.astro    ← "Погода души" widget
│   │   ├── Nav.astro
│   │   ├── Quiz.astro
│   │   └── Voices.astro
│   ├── pages/
│   │   ├── index.astro          ← Redirect
│   │   ├── first-words.astro    ← Simulated session
│   │   ├── sounds.astro         ← Grounding audio library
│   │   └── lp/
│   │       ├── israel.astro     ← Main LP (€50/₪190)
│   │       └── russia.astro     ← Russia LP (5000₽)
│   └── assets/images/           ← Alexandra's photos
```
