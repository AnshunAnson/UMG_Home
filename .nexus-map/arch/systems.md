> generated_by: nexus-mapper v2
> verified_at: 2026-05-10
> provenance: AST-backed for TypeScript/TSX/JavaScript; system boundaries verified by BENCHMARK phase file inspection

# 系统边界与代码位置

## 1. Content Data Layer

| 属性 | 值 |
|------|-----|
| ID | `umg.content-data-layer` |
| 职责 | 管理内容默认值定义和 TypeScript 类型声明 |
| code_path | `portfolio/app/config/content.ts`, `portfolio/app/types/content.ts` |
| 热点 | 高（content.ts 35次变更，content.json 38次变更） |
| 复杂度 | 中 |

**关键文件**：
- `portfolio/app/config/content.ts` — 所有区块内容默认值（~305行，单一真相源）
- `portfolio/app/types/content.ts` — 内容数据 TypeScript 接口定义（128行）
- `portfolio/public/content.json` — 运行时内容数据文件（由编辑器写入）

**注意**：content.json 的高频变更是被动结果，由 Content Editor 系统驱动。

## 2. Content Provider

| 属性 | 值 |
|------|-----|
| ID | `umg.content-provider` |
| 职责 | 全局内容状态管理，提供 useContent() hook，实现三层加载策略和 FOUC 防御 |
| code_path | `portfolio/app/ContentProvider.tsx` |
| 热点 | 中（8次变更） |
| 复杂度 | 中 |

**加载优先级**：
1. `fetch('/content.json')` — 部署文件
2. `localStorage.getItem('portfolio-content')` — 本地编辑覆盖
3. `config/content.ts` 默认值 — 硬编码回退

**导出**：
- `ContentProvider` — React Context Provider 组件
- `useContent()` — 获取全局内容状态的 hook

## 3. Page Sections

| 属性 | 值 |
|------|-----|
| ID | `umg.page-sections` |
| 职责 | 渲染主页各区块 |
| code_path | `portfolio/app/sections/` |
| 热点 | 高（Projects.tsx 26次变更） |
| 复杂度 | 中 |

**组件清单**：
| 组件 | 行数 | 变更次数 | 关键特征 |
|------|------|----------|----------|
| Hero.tsx | 77 | 8 | 名称高亮动画 |
| About.tsx | — | 7 | — |
| Skills.tsx | 80 | 9 | 六边形网格 + HEX_POSITIONS |
| Projects.tsx | 257 | 26 | resolveAssetPath + ProjectItem + 数组边界保护 |
| Contact.tsx | — | 9 | — |
| Footer.tsx | 79 | — | — |

**双重 import 模式**：每个 section 同时 import `useContent`（运行时数据）和 `config/content`（默认值回退），这是 FOUC 防御策略的一部分。

## 4. Content Editor

| 属性 | 值 |
|------|-----|
| ID | `umg.content-editor` |
| 职责 | 无代码内容编辑器，表单化编辑各区块内容 |
| code_path | `portfolio/app/edit/` |
| 热点 | 中（edit/page.tsx 8次变更） |
| 复杂度 | 高 |

**关键文件**：
- `portfolio/app/edit/page.tsx` — 编辑器主页面，import config/content 作为 initialData
- `portfolio/app/edit/schema.tsx` — 表单字段定义，import types/content
- `portfolio/app/edit/components/DynamicForm.tsx` — 动态表单渲染器（safeData 防御）
- `portfolio/app/edit/components/FormFields/` — 5个字段编辑器组件

**保存映射**：`data.hero` → `heroContent`（短键→长键映射）

## 5. API Persistence

| 属性 | 值 |
|------|-----|
| ID | `umg.api-persistence` |
| 职责 | 内容保存和文件上传 API 路由 |
| code_path | `portfolio/app/api/` |
| 热点 | 低 |
| 复杂度 | 低 |

**路由**：
| 路径 | 功能 |
|------|------|
| `/api/save-content` | POST: 写入 content.json |
| `/api/save-ts` | POST: 生成 content.ts 类型文件 |
| `/api/upload` | POST: 文件上传 |

## 6. App Shell

| 属性 | 值 |
|------|-----|
| ID | `umg.app-shell` |
| 职责 | 应用外壳：根布局、导航、页面组装 |
| code_path | `portfolio/app/layout.tsx`, `portfolio/app/page.tsx` |
| 热点 | 低 |
| 复杂度 | 低 |

**关键文件**：
- `portfolio/app/layout.tsx` — 根布局，包裹 ContentProvider + Navigation
- `portfolio/app/page.tsx` — 主页，组装所有 section 组件
- `portfolio/app/components/Navigation.tsx` — 导航组件
- `portfolio/app/components/ParticleField.tsx` — 粒子背景
- `portfolio/app/hooks/useSmoothScroll.ts` — Lenis 平滑滚动
- `portfolio/app/hooks/useMousePosition.ts` — 鼠标位置追踪
