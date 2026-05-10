# AGENTS.md — UMG Portfolio Project

> **For AI agents working on this codebase.** This document is machine-readable, not human-oriented.

## Project Overview

| Property | Value |
|----------|-------|
| **Name** | UMG Portfolio (UMG_Home) |
| **Type** | Next.js 16 Static Site (SSG) + Content Editor |
| **Live URL** | `https://anshunanson.github.io/Personal_Technical_Homepage/` |
| **Git Remote** | `https://github.com/AnshunAnson/Personal_Technical_Homepage.git` |
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
│   │   ├── save-ts/route.ts         # POST: write config/content.ts (TypeScript source)
│   │   └── upload/route.ts          # POST: file upload (images/GIFs)
│   ├── components/
│   │   ├── Navigation.tsx           # Fixed top navigation bar
│   │   ├── SectionHeader.tsx        # Reusable section title (label + h2)
│   │   └── ContactCard.tsx          # Reusable contact info card (icon + label + value)
│   ├── config/
│   │   └── content.ts               # DEFAULT content data (single source of truth)
│   ├── edit/                        # No-code content editor
│   │   ├── page.tsx                 # Editor main page (save → /api/save-ts + /api/save-content)
│   │   ├── schema.tsx               # Form field definitions for each section
│   │   └── components/
│   │       ├── DynamicForm.tsx      # Dynamic form renderer (safeData guard)
│   │       └── FormFields/
│   │           ├── ArrayInput.tsx   # Array-type field editor (with drag reorder + file upload)
│   │           ├── FieldWrapper.tsx # Shared label+description wrapper for form fields
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
| `/api/save-ts` | Dynamic (API) | POST: save content to `app/config/content.ts` (TypeScript source with type annotations) |
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

┌─────────────┐     POST      ┌──────────────────┐
│   /edit      │ ───────────→ │   /api/save-ts    │
│  (编辑器)    │              │ writes content.ts  │
└─────────────┘              └──────────────────┘

> Edit page saves to **both** endpoints simultaneously via `Promise.all`. Both must exist.
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
  basePath: process.env.NODE_ENV === 'production' ? '/Personal_Technical_Homepage' : '',
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
| **Safe data guard** | DynamicForm uses `safe = data \|\| {}` before property access |
| **Relative asset paths** | All image/GIF paths MUST be relative (`images/xxx.png`, NOT `/images/xxx.png`). SSG tree-shaking eliminates runtime basePath detection code |
| **Type-schema-config sync** | Every field in `types/content.ts` MUST have a matching entry in `schema.tsx` AND be consumed by a Section component. Dead fields cause editor confusion |

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
window.location.pathname.startsWith('/Personal_Technical_Homepage')  // WRONG — gets tree-shaken away in SSG
resolveAssetPath(src)  // WRONG — any runtime path function using browser APIs will be eliminated
```

### Component Extraction Pattern

When 2+ sections share identical UI structure, extract into `app/components/`:

| Extracted Component | Props | Used By |
|---------------------|-------|---------|
| `SectionHeader` | `{ label: string, title: string }` | About, Skills, Contact, Projects |
| `ContactCard` | `{ icon: LucideIcon, label, value, href, delay }` | Contact (Email + Phone cards) |
| `FieldWrapper` | `{ label, required?, description?, children }` | TextInput, NumberInput, TextArea |
| `stopDragPropagation` | (constant object spread) | ArrayInput nested inputs (6 sites) |

Extraction criteria: identical markup appears ≥2 times with only data props differing.

## Architecture Lessons Learned

### Lesson 1: SSG Tree-Shaking Eliminates Runtime Browser Code

**Problem**: Added `resolveAssetPath()` function that detected `basePath` via `window.location.pathname`. Built successfully, dev server worked fine. But production build had **all images returning 404** — the function was completely absent from the output JS bundle.

**Root Cause**: Next.js SSG pre-renders HTML at build time. Any code path that depends solely on browser APIs (`window`, `document`, `location`) and is not triggered during server-side rendering gets **tree-shaken away** as dead code. The function existed in source but never appeared in any chunk.

**Solution**: Use **relative paths** (`images/photo.png` instead of `/images/photo.png`). Browsers resolve relative URLs against the current page URL, which already includes the basePath prefix (`/Personal_Technical_Homepage/`). No runtime detection needed.

**Rule**: Never write runtime path-resolution functions for SSG assets. Always use relative paths.

### Lesson 2: Schema Drift — The Silent Killer of Editable Content Systems

**Problem**: After extracting `SectionHeader` component (replacing inline `<motion.div><span><h2>` blocks across 4 sections), the old `sectionTitle`/`sectionSubtitle` fields remained in:
- `types/content.ts` (interface definitions)
- `config/content.ts` (default data values)
- `edit/schema.tsx` (editor form fields)
- `public/content.json` (runtime data)

Users could edit these fields in the `/edit` page, but changes had **zero visual effect** because no Section component reads them anymore.

**Root Cause**: Refactoring rendering components without synchronously cleaning the data layer creates **unconsumed dead fields**. In an editable-content system this is worse than normal dead code — it actively misleads users into thinking their edits matter.

**Prevention Rule (Schema Sync Invariant)**:

```
For every field F in types/content.ts interface I:
  ├─→ F MUST exist in schema.tsx corresponding section definition
  ├─→ F MUST exist in config/content.ts default export
  └─→ F MUST be referenced (destructured or accessed) in the consuming Section component

If ANY link breaks during refactoring, ALL four layers must be updated together.
```

**Audit command** — after any Section refactor, verify no drift:

```powershell
# List all fields in types vs actual usage in sections
$typeFields = Select-String -Path "app/types/content.ts" -Pattern "^\s+\w+\??:"
$sectionUsage = Select-String -Path "app/sections/*.tsx" -Pattern "\.\w+" | ForEach { $_.Matches.Value }
# Compare manually or script the diff
```

### Lesson 3: Relative Paths Are the Only Reliable Strategy for GitHub Pages + SSG

| Approach | Dev Server | GitHub Pages Production | Verdict |
|----------|-----------|------------------------|---------|
| Absolute `/images/x.png` | ✅ Works | ❌ 404 (missing `/Personal_Technical_Homepage` prefix) | Broken |
| Runtime `basePath` detection | ✅ Works | ❌ Function tree-shaken away | Broken |
| Relative `images/x.png` | ✅ Works | ✅ Browser resolves from page URL | **Correct** |
| `next/image` component | ✅ Works | ❌ Requires image optimization API | Broken on GH Pages |

**Rule**: All asset references in `content.ts`, `content.json`, and JSX must use relative paths starting from `public/` root (no leading slash).

### Lesson 4: Cleanup Priority Framework

When auditing this codebase, classify issues by severity:

| Priority | Criteria | Examples from this project |
|----------|----------|---------------------------|
| **P1 Critical** | Data correctness: dead/misleading fields, type safety gaps | Unconsumed schema fields (15 found), `any` types (8 found) |
| **P2 Important** | Logic errors, dead imports, stale comments | Unused `React` import, wrong placeholder path, `'boolean'` in enum |
| **P3 Minor** | Code duplication, naming inconsistency | Identical Email/Phone cards (~35 lines × 2), repeated form field wrappers |

Always fix P1 before P2 before P3. P1 issues silently corrupt user experience; P3 issues only affect maintainability.

## Known Gotchas & Issues Resolved

| Issue | Solution | Reference |
|-------|----------|-----------|
| **SSG tree-shaking removes runtime path code** | Use relative paths for all assets. Never rely on `window.location` detection | See Lesson 1 above |
| **Schema drift after Section refactor** | Maintain schema-sync invariant: types ↔ schema ↔ config ↔ rendering must stay in sync | See Lesson 2 above |
| **Static resources 404 on GitHub Pages** | `basePath: '/Personal_Technical_Homepage'` in next.config.ts + relative asset paths | [next.config.ts](next.config.ts) |
| **Skills hex positions overflow** | Category grid renders all items; no fixed position overflow risk | [Skills.tsx](app/sections/Skills.tsx) |
| **Edit→Home content not syncing** | Key mapping: short key → long key on save | [edit/page.tsx](app/edit/page.tsx) |
| **DynamicForm crash on undefined data** | `safeData = data \|\| {}` defensive guard | [DynamicForm.tsx](app/edit/components/DynamicForm.tsx) |
| **Workflow file not triggering** | Must be at repo ROOT `.github/workflows/`, NOT inside `portfolio/` | Repo root |
| **SSG content not updating after edit** | SSG compiles from `config/content.ts`, NOT runtime `content.json`. Both must be synced | [config/content.ts](app/config/content.ts), [public/content.json](public/content.json) |
| **Large media files (PNG>2MB, GIF>5MB)** | GitHub Pages has transfer limits. Compress PNG→JPG (ffmpeg `-q:v 2`), GIF→MP4 (`-crf 28`). Update both config files | See Debug Workflow below |
| **Batch path rename causes 404s** | After renaming extensions, verify every referenced file exists on disk before committing. Use `Get-ChildItem -Recurse` audit | See Debug Workflow below |
| **Edit page save returns 404 for /api/save-ts** | Edit page calls `/api/save-ts` AND `/api/save-content` via `Promise.all`. If either route file is missing under `app/api/`, the save fails with 404. Both route directories must exist | [save-ts/route.ts](app/api/save-ts/route.ts), [edit/page.tsx](app/edit/page.tsx) |

## Debug Workflow

### Toolchain for Media Operations

| Tool | Path | Usage |
|------|------|-------|
| **ffmpeg** | `C:\Program Files\UI2V\resources\app.asar.unpacked\node_modules\ffmpeg-static\ffmpeg.exe` | PNG→JPG compression, GIF→MP4 conversion |
| **gifski** | `C:\Users\Administrator\Desktop\gifski-main-fixed-source\target\release\gifski.exe` | High-quality GIF encoding (backup) |
| **Git** | `C:\Program Files\Git\cmd\git.exe` | Full path required in PowerShell |

### Chrome DevTools MCP Debugging Steps

1. **Navigate to target page**
   ```
   mcp_Chrome_DevTools_MCP_navigate_page → type: "url", url: "http://localhost:3000/" or live URL
   ```

2. **Take visual screenshot**
   ```
   mcp_Chrome_DevTools_MCP_take_screenshot
   ```

3. **Check network requests for 404s**
   ```
   mcp_Chrome_DevTools_MCP_list_network_requests → resourceTypes: ["image"]
   Look for status 404 entries — these are broken assets
   ```

4. **Inspect failed request details**
   ```
   mcp_Chrome_DevTools_MCP_get_network_request → reqid: <failed_reqid>
   Check response body for "Site not found" (GitHub Pages 404)
   ```

5. **Check console errors**
   ```
   mcp_Chrome_DevTools_MCP_list_console_messages → types: ["error", "warn"]
   ```

6. **Verify image loading via JS**
   ```
   mcp_Chrome_DevTools_MCP_evaluate_script → function:
     document.querySelectorAll('img').map(img => ({
       src: img.src,
       naturalWidth: img.naturalWidth,    // 0 = failed
       complete: img.complete
     }))
   ```

### Media Compression Commands

**PNG → JPG (files > 2MB):**
```powershell
$ffmpeg = "C:\Program Files\UI2V\resources\app.asar.unpacked\node_modules\ffmpeg-static\ffmpeg.exe"
& $ffmpeg -y -i input.png -vf "scale=1920:-2" -q:v 2 output.jpg
Remove-Item input.png -Force
```

**GIF → MP4 (files > 5MB):**
```powershell
& $ffmpeg -y -i input.gif -movflags +faststart -pix_fmt yuv420p `
  -vf "scale='if(gt(iw,1920),1920,-2)':'if(gt(ih,1080),1080,-2)'" `
  -c:v libx264 -crf 28 -preset medium output.mp4
```

**Batch audit all image sizes:**
```powershell
Get-ChildItem public -Recurse -File | Where-Object { $_.Extension -match '\.(png|gif|jpg|mp4)$' } |
  Sort-Object Length -Descending |
  Select-Object @{N='SizeMB';E={[math]::Round($_.Length/1MB,2)}}, FullName
```

### Post-Compression Verification Checklist

- [ ] All referenced files exist on disk: `Get-ChildItem public -Recurse | Select-String <path>`
- [ ] `config/content.ts` paths match actual file extensions
- [ ] `public/content.json` paths match actual file extensions (sync from config)
- [ ] No stale references to deleted files (e.g., old `1.png`~`6.png`)
- [ ] Browser MCP confirms all images load (naturalWidth > 0)
- [ ] Network panel shows no 404s for image requests
- [ ] Git commit includes both config changes AND binary asset files

### Common Pitfall: SSG vs Runtime Data

This project uses **SSG (Static Site Generation)**:
- **Build time**: Next.js reads `config/content.ts`, bakes HTML at compile
- **Runtime**: Browser loads static HTML + assets, NO data fetching

Therefore:
- Editing `public/content.json` alone does **NOT** change the built site
- Must update `config/content.ts` AND rebuild/redeploy
- The `/edit` page writes to `content.json` for the editor's own use, but the main site reads from compiled config

### Git Restore for Accidentally Deleted Assets

If batch operations delete files that weren't properly replaced:

```powershell
& git log --oneline --all --diff-filter=A -- "<file_path>"
& git show <commit-sha>:<file_path> | Set-Content -Path <local_path> -Encoding Byte
& git checkout <commit-sha> -- "<file_path>"
```
