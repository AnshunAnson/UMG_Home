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
│   │   ├── save-ts/route.ts         # POST: write config/content.ts (TypeScript source)
│   │   └── upload/route.ts          # POST: file upload (images/GIFs)
│   ├── components/
│   │   └── Navigation.tsx           # Fixed top navigation bar
│   ├── config/
│   │   └── content.ts               # DEFAULT content data (single source of truth)
│   ├── edit/                        # No-code content editor
│   │   ├── page.tsx                 # Editor main page (save → /api/save-ts + /api/save-content)
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
| **SSG content not updating after edit** | SSG compiles from `config/content.ts`, NOT runtime `content.json`. Both must be synced | [config/content.ts](app/config/content.ts), [public/content.json](public/content.json) |
| **Large media files (PNG>2MB, GIF>5MB)** | GitHub Pages has transfer limits. Compress PNG→JPG (ffmpeg `-q:v 2`), GIF→MP4 (`-crf 28`). Update both config files | See Debug Workflow below |
| **Batch path rename causes 404s** | After renaming extensions, verify every referenced file exists on disk before committing. Use `Get-ChildItem -Recurse` audit | See Debug Workflow below |
| **Edit page save returns 404 for /api/save-ts** | Edit page calls `/api/save-ts` AND `/api/save-content` via `Promise.all`. If either route file is missing under `app/api/`, the save fails with 404. Both route directories must exist | [save-ts/route.ts](app/api/save-ts/route.ts), [edit/page.tsx](app/edit/page.tsx) |
| **异构比例图片布局混乱** | 使用**黑底画布模式**: 固定比例容器 + `bg-black` + `flex items-center justify-center` + 图片 `object-contain`。纯 CSS 解决，不修改原生素材，无需数据字段驱动 | [Projects.tsx](app/sections/Projects.tsx) |
| **preserveAspectRatio 数据字段过度工程** | 曾尝试用数据字段标记每张图的比例类型，条件渲染不同容器。最终简化为统一黑底画布，移除所有数据字段和条件逻辑。**原则: CSS 能解决的问题不要引入数据复杂度** | [Projects.tsx](app/sections/Projects.tsx), [types/content.ts](app/types/content.ts) |
| **正则表达式操作 JSON 导致结构损坏** | 用 regex 删除 JSON 字段（如 preserveAspectRatio）会破坏格式/逗号/缩进。必须用 PowerShell `ConvertFrom-Json | Select-Object -ExcludeProperty | ConvertTo-Json` 管道安全操作 | — |

## Design Patterns

### Black Canvas Layout (黑底画布布局)

**问题**: Projects 区域包含多种比例的 GIF/图片（16:9、1:1、21:9、超宽横条等），直接渲染会导致卡片高度不一、布局错乱。

**方案**: 统一容器为固定比例黑底画布，图片以 `object-contain` 自适应居中。

```tsx
<div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
  <img
    src={src}
    alt={alt}
    className="max-w-full max-h-full w-auto h-auto object-contain"
  />
</div>
```

**关键类组合**:
| 类 | 作用 |
|---|------|
| `aspect-video` 或 `aspect-[21/9]` | 固定容器比例（网格用 16:9，卡片预览用 21:9） |
| `bg-black` | 黑底填充图片未覆盖区域，视觉统一 |
| `flex items-center justify-center` | 图片在容器内水平垂直居中 |
| `max-w-full max-h-full w-auto h-auto` | 限制图片不超过容器尺寸 |
| `object-contain` | 保持原图比例完整显示，不裁切不拉伸 |

**适用场景**: 作品集展示、产品画廊等需要混排不同比例媒体的场景。

**反模式**: 不要用 `preserveAspectRatio` 数据字段做条件渲染；不要用 ffmpeg 给原生素材加黑边；不要用正则修改 JSON。

## Debug Workflow

### Toolchain for Media Operations

| Tool | Path | Usage |
|------|------|-------|
| **ffmpeg** | `C:\Program Files\UI2V\resources\app.asar.unpacked\node_modules\ffmpeg-static\ffmpeg.exe` | PNG→JPG compression, GIF→MP4 conversion |
| **gifski** | `C:\Users\Administrator\Desktop\gifski-main-fixed-source\target\release\gifski.exe` | High-quality GIF encoding (MP4→GIF conversion) |
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
# Remove original, keep .jpg
Remove-Item input.png -Force
```

**GIF → MP4 (files > 5MB):**
```powershell
& $ffmpeg -y -i input.gif -movflags +faststart -pix_fmt yuv420p `
  -vf "scale='if(gt(iw,1920),1920,-2)':'if(gt(ih,1080),1080,-2)'" `
  -c:v libx264 -crf 28 -preset medium output.mp4
```

**MP4 → GIF (需要高质量动画预览时):**
```powershell
$ffmpeg = "C:\Program Files\UI2V\resources\app.asar.unpacked\node_modules\ffmpeg-static\ffmpeg.exe"
$gifski = "C:\Users\Administrator\Desktop\gifski-main-fixed-source\target\release\gifski.exe"
$framesDir = "temp_frames"
New-Item -ItemType Directory -Path $framesDir -Force | Out-Null
# 1. 提取帧
& $ffmpeg -i input.mp4 -vf "fps=15" -q:v 2 "$framesDir/frame%04d.png"
# 2. gifski 编码（从帧序列生成高质量GIF）
& $gifski -o output.gif "$framesDir/*.png"
# 3. 清理临时帧
Remove-Item $framesDir -Recurse -Force
```
> 注意: GIF 文件通常比 MP4 大 2-3 倍，仅用于必须展示动画的场景。

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
# Find which commit last had the file
& git log --oneline --all --diff-filter=A -- "<file_path>"

# Restore from a specific commit
& git show <commit-sha>:<file_path> | Set-Content -Path <local_path> -Encoding Byte

# Or checkout from specific commit
& git checkout <commit-sha> -- "<file_path>"
```
