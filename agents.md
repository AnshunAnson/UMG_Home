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
| Animation | Framer Motion | latest |
| Icons | Lucide React | latest |
| Scroll | Lenis (smooth scroll) | latest |
| Deployment | GitHub Pages (via Actions) | — |

## Directory Structure

```
portfolio/
├── app/
│   ├── api/
│   │   ├── save-content/route.ts    # POST: write content.json to disk
│   │   └── upload/route.ts          # POST: file upload (images/GIFs)
│   ├── components/
│   │   └── Navigation.tsx           # Fixed top navigation bar
│   ├── config/
│   │   └── content.ts               # DEFAULT content data (single source of truth)
│   ├── edit/                        # No-code content editor
│   │   ├── page.tsx                 # Editor main page (save → /api/save-content)
│   │   ├── schema.tsx               # Form field definitions for each section
│   │   └── components/
│   │       ├── DynamicForm.tsx      # Dynamic form renderer (safeData guard)
│   │       └── FormFields/
│   │           ├── ArrayInput.tsx   # Array-type field editor (with drag reorder + file upload)
│   │           ├── NumberInput.tsx  # Number field editor
│   │           ├── ObjectInput.tsx  # Object/nested field editor
│   │           ├── TextArea.tsx     # Multi-line text editor
│   │           ├── TextInput.tsx    # Single-line text editor
│   │           └── index.ts         # Barrel export
│   ├── hooks/
│   │   └── useSmoothScroll.ts       # Lenis smooth scroll hook
│   ├── sections/                    # Page section components (consume useContent())
│   │   ├── Hero.tsx                 # Hero/banner section
│   │   ├── About.tsx                # About me section
│   │   ├── Projects.tsx            # Projects showcase (expandable cards with images/GIFs)
│   │   ├── Skills.tsx              # Skills category grid
│   │   ├── Contact.tsx             # Contact info section (includes Footer)
│   │   └── Footer.tsx              # Site footer
│   ├── types/
│   │   └── content.ts               # TypeScript interfaces for all content types
│   ├── ContentProvider.tsx          # Global content state (static context provider)
│   ├── globals.css                  # Global styles + Tailwind imports + CSS variables
│   ├── layout.tsx                   # Root layout (wraps ContentProvider + Navigation)
│   └── page.tsx                     # Home page (assembles all sections)
├── public/
│   ├── content.json                 # LIVE content data (written by edit API)
│   ├── gifs/                        # Project GIF assets (organized by project)
│   ├── images/                      # Project image assets (organized by project)
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
| `/api/upload` | Dynamic (API) | POST: upload image/GIF to `public/` |

## Data Architecture

### Single Source of Truth Flow

```
┌─────────────────────┐
│  config/content.ts   │ ◄────── 手动维护（git 版本化管理）
│  (默认值，编译时确定） │
└─────────┬───────────┘
          │ import
          ▼
┌─────────────────────┐
│  ContentProvider     │
│  (静态 Context)      │ ──→ useContent() → 所有 Sections
└─────────────────────┘

┌─────────────┐     POST      ┌──────────────────┐
│   /edit      │ ───────────→ │ /api/save-content │
│  (编辑器)    │              │  writes content.json│
└─────────────┘              └──────────────────┘
```

### Content Provider

ContentProvider 是一个**静态 Context Provider**：
- 编译时从 `config/content.ts` 加载默认值
- 通过 `useContent()` hook 提供给所有 Section 组件
- 不执行 fetch、不读 localStorage、无异步加载

### Key Data Types

All content keys in `content.json` and `config/content.ts`:

| JSON Key | Section | Component |
|----------|---------|-----------|
| `heroContent` | Hero banner | [Hero.tsx](app/sections/Hero.tsx) |
| `aboutContent` | About me | [About.tsx](app/sections/About.tsx) |
| `projectsContent` | Projects list | [Projects.tsx](app/sections/Projects.tsx) |
| `skillsContent` | Skills grid | [Skills.tsx](app/sections/Skills.tsx) |
| `contactContent` | Contact info | [Contact.tsx](app/sections/Contact.tsx) |
| `footerContent` | Footer | [Footer.tsx](app/sections/Footer.tsx) |

### Edit Page Key Mapping

Edit page uses short keys internally (`data.hero`, `data.about`), maps to long keys on save:

```typescript
const saveData = {
  heroContent: data.hero,
  aboutContent: data.about,
  projectsContent: data.projects,
  skillsContent: data.skills,
  contactContent: data.contact,
  footerContent: data.footer,
};
```

## Build & Deploy

### Commands

```bash
npm run dev                          # Start dev server (Turbopack)
npm run build                        # Build static export → dist/
npm run start                        # Preview production build
```

Git operations from repo root (`e:\AnShunConfig\html\`):
```bash
cd .. && git add . && git commit -m "msg" && git push origin master
```

### Build Configuration

File: [next.config.ts](next.config.ts)

```typescript
{
  output: 'export',
  distDir: process.env.NEXT_DIST_DIR || 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/UMG_Home' : '',
  images: { unoptimized: true },
}
```

### CI/CD

File: `.github/workflows/deploy.yml` at **repo root**

- Triggered on: push to `master`, or manual `workflow_dispatch`
- Builds `portfolio/` with `working-directory: portfolio`
- Deploys via `actions/deploy-pages@v4`

## Coding Conventions

### Must Follow

| Rule | Detail |
|------|--------|
| **No comments in code** | Unless explicitly requested by user |
| **Client Components** | All interactive files must have `'use client'` at line 1 |
| **Content access** | Sections MUST use `useContent()` hook, never import `content.ts` directly |
| **Array bounds** | Check `.length > N` before accessing indexed items (Projects.tsx pattern) |
| **Safe data guard** | DynamicForm uses `safeData = data \|\| {}` before property access |
| **basePath awareness** | Asset paths must detect basePath at runtime: `window.location.pathname.startsWith('/UMG_Home')` |

### Patterns to Use

```tsx
const { hero } = useContent();
const { name, subtitle } = hero;

{projects.length > 0 && <div>{projects[0].title}</div>}
{projects.length > 3 && <div>{projects[3]}</div>}

const safeData = data || {};
const value = safeData[key];
```

### Patterns to Avoid

```tsx
import { heroContent } from '../config/content';  // WRONG in sections
const title = data.hero.title;  // CRASH if data is undefined
fetch('/content.json');  // WRONG — won't work on GitHub Pages
```

## Known Gotchas & Issues Resolved

| Issue | Solution | Reference |
|-------|----------|-----------|
| **Static resources 404 on GitHub Pages** | `basePath: '/UMG_Home'` in next.config.ts | [next.config.ts](next.config.ts) |
| **Asset path resolution in Projects** | Runtime basePath detection via `window.location.pathname.startsWith(...)` | [Projects.tsx](app/sections/Projects.tsx) |
| **Skills hex positions overflow** | Category grid renders all items; no fixed position overflow risk | [Skills.tsx](app/sections/Skills.tsx) |
| **Edit→Home content not syncing** | Key mapping: short key → long key on save | [edit/page.tsx](app/edit/page.tsx) |
| **DynamicForm crash on undefined data** | `safeData = data \|\| {}` defensive guard | [DynamicForm.tsx](app/edit/components/DynamicForm.tsx) |
| **Workflow file not triggering** | Must be at repo ROOT `.github/workflows/`, NOT inside `portfolio/` | Repo root |
