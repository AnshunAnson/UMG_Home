> generated_by: nexus-mapper v2
> verified_at: 2026-05-10
> provenance: AST-backed for TS/TSX/JS; git_stats backed by 61 commits/90 days

# UMG Portfolio — 项目知识库索引

Next.js 16 SSG + 无代码编辑器，UMG/UI 开发者作品集，GitHub Pages 部署。

## 系统（6个）

| 系统 | 职责 | 代码位置 |
|------|------|----------|
| Content Data Layer | 默认值 + 类型声明 | `app/config/content.ts`, `app/types/content.ts` |
| Content Provider | 全局状态 + useContent() + FOUC 防御 | `app/ContentProvider.tsx` |
| Page Sections | 6个区块渲染 | `app/sections/` |
| Content Editor | 表单化编辑 + 保存 | `app/edit/` |
| API Persistence | 3个 API 路由 | `app/api/` |
| App Shell | 布局 + 导航 + 组装 | `app/layout.tsx`, `app/page.tsx` |

## 数据流

```
content.json → ContentProvider → useContent() → Sections
                   ↑
config/content.ts (fallback)
                   ↑
Editor → POST /api/save-content → content.json
```

## 关键决策

1. **FOUC 防御**：Sections 双重 import（useContent + config/content 默认值回退），立即渲染默认值
2. **编辑器驱动**：content.json 是最高热点(38次)，但由 Editor 被动驱动
3. **强耦合三角**：types/content.ts ↔ config/content.ts ↔ content.json（score ≥ 0.97）

## 热点 Top 3

1. `content.json` — 38 changes 🔴
2. `config/content.ts` — 35 changes 🔴
3. `sections/Projects.tsx` — 26 changes 🔴

## 证据缺口

- `components/animations/` 和 `components/project-modal/` 目录为空
- AST import 边为相对路径，依赖关系经人工推断

## [操作指南] 强制执行步骤

> 对所有读取本文件的 AI 的硬性指令。

### 步骤1 — 必须先读完以下文件

- `.nexus-map/arch/systems.md` — 系统边界与代码位置
- `.nexus-map/arch/dependencies.md` — 依赖关系与 Mermaid 图
- `.nexus-map/arch/test_coverage.md` — 测试面与证据缺口
- `.nexus-map/hotspots/git_forensics.md` — Git 热点与耦合
- `.nexus-map/concepts/domains.md` — 核心领域概念

> 总量 < 5000 tokens，不得跳过。

### 步骤2 — 按任务类型追加

- 接口修改/跨模块调用 → `query_graph.py --impact <文件>`
- 查谁引用 → `query_graph.py --who-imports <模块>`
- 结构重大变化 → 评估是否重新运行 nexus-mapper
