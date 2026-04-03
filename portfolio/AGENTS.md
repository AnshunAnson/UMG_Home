# AGENTS.md — UMG Portfolio Project

> **For AI agents working on this codebase.** This document is machine-readable, not human-oriented.

## Project Overview

| Property | Value |
|----------|-------|
| **Name** | UMG Portfolio (UMG_Home) |
| **Type** | Next.js 16 Static Site (SSG) + Content Editor |
| **Live URL** | `https://anshunanson.github.io/UMG_Home/` |
| **Git Remote** | `https://github.com/AnshunAnson/UMG_Home.git` |
| **Branch** | `master` |
| **Repo Root** | `e:\AnShunConfig\html\` (git root), project in `portfolio/` subfolder |
| **Purpose** | Personal portfolio for a UMG/UI developer with no-code content editing |

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Turbopack, static export) | 16.2.2 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | strict |
| Styling | Tailwind CSS v4 | — |
| Animation | Framer Motion, GSAP | latest |
| 3D | Three.js / React Three Fiber / @react-three/drei | latest |
| Icons | Lucide React | latest |
| Scroll | Lenis (smooth scroll) | latest |
| Deployment | GitHub Pages (via Actions) | — |

## Directory Structure

```
portfolio/
├── app/
│   ├── api/save-content/route.ts    # POST: write content.json to disk
│   ├── components/                   # Reusable UI components
│   │   ├── GlitchText.tsx            # Glitch text animation effect
│   │   ├── GlobalAnimatedBackground.tsx # Full-page animated background (self-contained)
│   │   ├── NeonCard.tsx              # Neon-styled card wrapper
│   │   ├── ParticleBackground.tsx    # Canvas particle background
│   │   ├── ParticleField.tsx        # Particle field component
│   │   ├── ProjectCard.tsx          # Individual project card (inlined animations)
│   │   └── ScrollIndicator.tsx      # Scroll down indicator
│   ├── config/
│   │   └── content.ts               # DEFAULT content data (~305 lines, single source of truth for defaults)
│   ├── edit/                        # No-code content editor
│   │   ├── page.tsx                 # Editor main page (save → API + localStorage)
│   │   ├── schema.tsx               # Form field definitions for each section
│   │   └── components/
│   │       ├── DynamicForm.tsx      # Dynamic form renderer (safeData guard)
│   │       └── FormFields/
│   │           ├── ArrayInput.tsx   # Array-type field editor
│   │           ├── NumberInput.tsx  # Number field editor
│   │           ├── ObjectInput.tsx  # Object/nested field editor
│   │           ├── TextArea.tsx     # Multi-line text editor
│   │           ├── TextInput.tsx    # Single-line text editor
│   │           └── index.ts         # Barrel export
│   ├── hooks/
│   │   ├── useMousePosition.ts      # Mouse position tracking hook
│   │   └── useSmoothScroll.ts       # Lenis smooth scroll hook
│   ├── sections/                    # Page section components (consume useContent())
│   │   ├── Hero.tsx                 # Hero/banner section
│   │   ├── About.tsx                # About me section
│   │   ├── Experience.tsx          # Career timeline section
│   │   ├── Projects.tsx            # Projects showcase (array bounds protected)
│   │   ├── Skills.tsx              # Skills hexagon grid (HEX_POSITIONS slice)
│   │   ├── Contact.tsx             # Contact form / info section
│   │   └── Footer.tsx              # Site footer
│   ├── ContentProvider.tsx          # Global content state (3-level loading)
│   ├── globals.css                  # Global styles + Tailwind imports
│   ├── layout.tsx                   # Root layout (wraps ContentProvider)
│   └── page.tsx                     # Home page (assembles all sections)
├── public/
│   ├── content.json                 # LIVE content data (written by edit API)
│   ├── next.svg                     # Default Next.js SVG
│   └── vercel.svg                   # Default Vercel SVG
├── next.config.ts                   # Static export + basePath config
├── package.json                     # Dependencies & scripts
├── postcss.config.mjs              # PostCSS config
├── tsconfig.json                    # TypeScript config
├── eslint.config.mjs               # ESLint config
└── .gitignore                       # Git ignore rules
```

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static (SSG) | Main portfolio page |
| `/edit` | Static (SSG) | No-code content editor |
| `/api/save-content` | Dynamic (API) | POST: save content to `public/content.json` |

## Data Architecture

### Single Source of Truth Flow

```
┌─────────────┐     fetch()      ┌──────────────────┐
│  content.json │ ◄───────────── │  ContentProvider   │
│  (public/)   │  Priority 1     │  (app level)       │
└─────────────┘                 └────────┬───────────┘
                                         │ context
        ┌────────────────────────────────┼────────────────────────┐
        │                                │                        │
        ▼                                ▼                        ▼
┌──────────────┐                ┌──────────────┐          ┌──────────────┐
│   / (home)   │                │   /edit       │          │  All sections │
│  read-only   │                │  read+write  │          │ useContent()  │
└──────────────┘                └──────┬───────┘          └──────────────┘
                                       │ POST
                                       ▼
                              ┌──────────────────┐
                              │ /api/save-content │
                              │  writes to disk   │
                              └──────────────────┘
```

### ContentProvider Loading Priority

1. **Priority 1**: `fetch('/content.json')` — deployed file (GitHub Pages)
2. **Priority 2**: `localStorage.getItem('portfolio-content')` — local edits override deployed
3. **Fallback**: `config/content.ts` defaults — hardcoded fallback

### Key Data Types

All content keys in `content.json`:

| JSON Key | Section | Component |
|----------|---------|-----------|
| `heroContent` | Hero banner | [Hero.tsx](app/sections/Hero.tsx) |
| `aboutContent` | About me | [About.tsx](app/sections/About.tsx) |
| `projectsContent` | Projects list | [Projects.tsx](app/sections/Projects.tsx) |
| `skillsContent` | Skills grid | [Skills.tsx](app/sections/Skills.tsx) |
| `contactContent` | Contact info | [Contact.tsx](app/sections/Contact.tsx) |

### Edit Page Key Mapping

Edit page uses short keys internally (`data.hero`, `data.about`), maps to long keys on save:

```typescript
// edit/page.tsx handleSave()
const saveData = {
  heroContent: data.hero,      // short → long key mapping
  aboutContent: data.about,
  projectsContent: data.projects,
  skillsContent: data.skills,
  contactContent: data.contact,
};
```

## Build & Deploy

### Commands

```bash
# Development
npm run dev                          # Start dev server (Turbopack)

# Production
npm run build                        # Build static export → dist/
npm run start                        # Preview production build

# Git operations (from repo root e:\AnShunConfig\html\)
cd .. && git add . && git commit -m "msg" && git push origin master
```

### Build Configuration

File: [next.config.ts](next.config.ts)

```typescript
{
  output: 'export',        // SSG mode required for GitHub Pages
  distDir: 'dist',         // Output directory
  basePath: '/UMG_Home',   // CRITICAL: matches GitHub Pages subdirectory
  images: { unoptimized: true },  // Required for static export
}
```

### CI/CD

File location: `.github/workflows/deploy.yml` at **repo root** (`e:\AnShunConfig\html\.github\workflows\deploy.yml`)

- Triggered on: push to `master`, or manual `workflow_dispatch`
- Builds `portfolio/` with `working-directory: portfolio`
- Uploads `portfolio/dist` as Pages artifact
- Deploys via `actions/deploy-pages@v4`

## Coding Conventions

### Must Follow

| Rule | Detail |
|------|--------|
| **No comments in code** | Unless explicitly requested by user |
| **Client Components** | All interactive files must have `'use client'` at line 1 |
| **Content access** | Sections MUST use `useContent()` hook, never import `content.ts` directly |
| **Defensive data** | Always destructure with default values (see Hero.tsx pattern) |
| **Array bounds** | Check `.length > N` before accessing indexed items (Projects.tsx pattern) |
| **Safe data guard** | DynamicForm uses `safeData = data \|\| {}` before property access |
| **basePath awareness** | Fetch URLs must detect basePath: `window.location.pathname.startsWith('/UMG_Home')` |
| **FOUC prevention** | ContentProvider renders defaultContent immediately, updates silently from fetch — never block rendering with loading state |

### Patterns to Use

```tsx
// ✅ Safe content access (Hero.tsx pattern)
const { title = '', subtitle = '' } = useContent().hero;

// ✅ Safe array access (Projects.tsx pattern)
{projects.length > 0 && <div>{projects[0].title}</div>}
{projects.length > 3 && <div>{projects[3]}</div>}

// ✅ Safe dynamic data (DynamicForm.tsx pattern)
const safeData = data || {};
const value = safeData[key];
```

### Patterns to Avoid

```tsx
// ❌ Never import content defaults directly in sections
import { heroContent } from '../config/content';  // WRONG

// ❌ Never assume data shape without guards
const title = data.hero.title;  // CRASH if data is undefined

// ❌ Never hardcode absolute paths
fetch('/content.json');  // WRONG — won't work on GitHub Pages
```

## Known Gotchas & Issues Resolved

| Issue | Solution | Reference |
|-------|----------|-----------|
| **Static resources 404 on GitHub Pages** | `basePath: '/UMG_Home'` in next.config.ts | [next.config.ts:5](next.config.ts#L5) |
| **Content flash on reload (FOUC)** | Render defaultContent immediately, silent background update via `setContent(prev => ...)` — never block with loading state | [ContentProvider.tsx:33](app/ContentProvider.tsx#L33) |
| **Skills hex positions overflow** | `.slice(0, HEX_POSITIONS.length)` + null guard | [Skills.tsx](app/sections/Skills.tsx) |
| **Edit→Home content not syncing** | Key mapping: `data.hero` → `heroContent` on save | [edit/page.tsx](app/edit/page.tsx) |
| **DynamicForm crash on undefined data** | `safeData = data \|\| {}` defensive guard | [DynamicForm.tsx](app/edit/components/DynamicForm.tsx) |
| **Workflow file not triggering** | Must be at repo ROOT `.github/workflows/`, NOT inside `portfolio/` | Repo root |
| **ProjectHoverContext missing after cleanup** | GlobalAnimatedBackground rewritten as self-contained | [GlobalAnimatedBackground.tsx](app/components/GlobalAnimatedBackground.tsx) |
| **Animations lib deleted** | ProjectCard inlines its own constants | [ProjectCard.tsx](app/components/ProjectCard.tsx) |

## Edit System Architecture

```
User opens /edit
    ↓
DynamicForm renders fields from schema.tsx
    ↓
User modifies values (React state)
    ↓
User clicks "保存"
    ↓
1. localStorage.setItem('portfolio-content', jsonStr)   ← local cache
2. fetch('/api/save-content', { method: 'POST', body })  ← server write
    ↓
API route writes to public/content.json via fs/promises
    ↓
User runs: git add . && git commit && git push
    ↓
GitHub Actions builds + deploys to Pages
```

## Dependency List (package.json)

### Core
- `next`: 16.2.2
- `react`: 19.2.4
- `react-dom`: 19.2.4

### Animation & Visual
- `framer-motion`: latest
- `gsap`: latest
- `three`: latest
- `@react-three/fiber`: latest
- `@react-three/drei`: latest

### Utilities
- `lucide-react`: latest (icons)
- `lenis`: latest (smooth scroll)

### Dev
- `typescript`: latest
- `@types/react`: latest
- `@types/three`: latest
- `eslint`: latest
- `tailwindcss`: v4

### REMOVED (do not re-add)
- `prisma` — removed (no database needed)
- `@react-three/postprocessing` — removed (3D scenes deleted)
