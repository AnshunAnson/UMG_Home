# UMG Portfolio Harness Framework v4.1

> **从 Skill 文档到 Harness 运行时框架 — 用户品味层**
>
> **核心设计: 职责分离 — 项目事实归 ProjectDoc，用户品味归 Harness**
>
> 基于 awesome-harness-engineering 生态 + adaptive-harness + evolve-plugin + 12 Factor Agents。

---

## 0. 核心架构: ProjectDoc ↔ Harness 双层模型

```
┌─────────────────────────────────────────────────┐
│                  AI Agent                        │
│                                                   │
│    ┌──────────────────┐   ┌──────────────────┐   │
│    │   ProjectDoc     │   │  UMG Harness     │   │
│    │   (项目事实层)    │←→│  (用户品味层)     │   │
│    ├──────────────────┤   ├──────────────────┤   │
│    │ • 技术栈         │   │ • 品味配置        │   │
│    │ • 目录结构       │   │ • 硬约束          │   │
│    │ • 组件清单       │   │ • 身份边界        │   │
│    │ • 文件路径       │   │ • 反模式陷阱      │   │
│    │ • 数据流图       │   │ • 动画风格参考    │   │
│    │ • CSS 类库       │   │ • 记忆系统        │   │
│    │ • 构建配置       │   │ • Harness 运行时  │   │
│    │ • 色彩实际值     │   │ • 进化引擎        │   │
│    └──────────────────┘   └──────────────────┘   │
│         ↑ 自动注入               ↑ 代码推断        │
│         │ (inject-facts)        │ (inject-taste) │
│    ─────┴───────────────────────┴────────────────  │
│                   代码库 (portfolio/)              │
└─────────────────────────────────────────────────┘
```

**ProjectDoc 回答 "这是什么项目?" — 纯事实，自动从代码生成。**
**Harness 回答 "这个开发者喜欢怎么工作?" — 纯品味+规则+记忆，从代码推断。**

### 为什么这样分离?

| 混在一起的问题 | 分离后的好处 |
|---------------|-------------|
| 项目重构后 Skill 中的目录树过期 | ProjectDoc 自动同步, Harness 不受影响 |
| 换项目时要重写整个 Skill | Harness 可复用, 只需换 ProjectDoc |
| 事实和偏好混在 345 行中难以维护 | 各司其职, 各自进化 |
| AI 无法区分"这是事实"还是"这是偏好" | 明确的语义边界 |

---

## 一、范式转变: v2 → v4.1

### v2 (当前) → v3 (已废弃) → v4 的演进

| <br />   | v2 单文件 Skill    | v3 拆分 Skill     | **v4 Harness Framework** |
| -------- | --------------- | --------------- | ------------------------ |
| **定位**   | 操作手册/约束集        | 拆分的约束集文档        | **运行时框架**                |
| **加载方式** | 全量 345 行        | 4 层渐进加载         | **6 轴分类 + 按需路由**         |
| **身份信息** | 手写事实基准          | 手写 + AUTO 标记    | **自动检测指纹 + 品味推断**        |
| **记忆**   | 无               | 无               | **Git 持久化 Memory 系统**    |
| **评估**   | 无               | 无               | **6 维 Evaluator 评分**     |
| **进化**   | 无               | 单向注入脚本          | **Evaluate→Evolve 闭环**   |
| **通用性**  | 仅 umg-portfolio | 仅 umg-portfolio | **templates/ 可复用给任何项目**  |

### 核心灵感来源

| 来源                            | 借鉴的核心概念                                   | 在 v4 中的体现                          |
| ----------------------------- | ----------------------------------------- | ---------------------------------- |
| **adaptive-harness**          | Classify→Route→Execute→Evaluate→Evolve 闭环 | harness/ 目录下的运行时定义                 |
| **adaptive-harness**          | 6 轴任务 Taxonomy                            | classifier.md 的任务分类系统              |
| **adaptive-harness**          | 三级自改进 (Routing/Content/Genesis)           | evolver.md 的进化规则                   |
| **evolve-plugin**             | 原子化架构, Token -92%                         | L0-L5 分层按需加载                       |
| **evolve-plugin**             | Git 持久化记忆                                 | memory/ 目录                         |
| **evolve-plugin**             | 北极星锚定                                     | identity/evolution-state.md        |
| **Adaptive Claude Agents**    | 技术栈自动检测                                   | inject-identity.mjs                |
| **12 Factor Agents**          | Context/State 一等公民                        | identity/ + memory/ 作为独立层          |
| **Manus Context Engineering** | Filesystem Memory                         | decisions.log (JSON-L append-only) |
| **Claude Code SKILL**         | 否定式约束 + Failure Mode                      | constraints/ 全部保留                  |

***

## 二、架构总览

### 2.1 目标目录结构 (18 文件, 7 目录)

> **⚠️ 项目事实 (tech stack/目录/组件/路径/CSS类/数据流) 存放在 ProjectDoc，不在 Harness 中。**

```
html/.trae/skills/umg-portfolio/         ← 用户品味 Harness (纯品味+规则+记忆)
│
├── SKILL.md                              ← L0: Harness Router (~55 行)
│   ├── Pipeline 图
│   ├── 6 轴 Taxonomy
│   ├── Router 表 (引用 ProjectDoc 做事实查询)
│   └── ProjectDoc Integration 协议说明
│
├── identity/                             ← L1-a: 纯品味层 (从代码推断, 非项目事实)
│   ├── taste-profile.md                 ← 🎯 品味配置 [AUTO] **核心文件**
│   └── evolution-state.md               ← 进化状态 [AUTO]
│
├── constraints/                         ← L1-b: 纯约束层 (通用+项目特定规则)
│   ├── hard-rules.md                    ← 🔴 绝对禁区
│   ├── identity-boundary.md             ← 🟡 身份边界 (品味约束)
│   └── anti-patterns.md                 ← 🟠 反模式陷阱
│
├── knowledge/                           ← L2: 纯方法论 (非项目事实)
│   ├── animation-patterns.md            ← 动画风格参考 (模式表)
│   ├── modification-playbook.md         ← 操作方法论 (步骤模板)
│   └── design-principles.md            ← 🆕 设计原则 (从代码提炼的哲学)
│
├── memory/                              ← L3: 记忆层 (跨会话持久化)
│   ├── decisions.log                    ← 决策日志 (JSON-L)
│   ├── patterns-discovered.md           ← 发现的模式
│   ├── failure-postmortems.md           ← 复盘记录
│   └── session-summaries/              ← 会话摘要
│
├── harness/                             ← L4: Harness 运行时 (元层)
│   ├── classifier.md                    ← 任务分类器 (6 轴 Taxonomy)
│   ├── router.md                        ← 路由规则 (模块映射 + ProjectDoc 查询)
│   ├── evaluator.md                     ← 评估标准 (6 维评分卡)
│   └── evolver.md                       ← 进化引擎规则
│
├── evolve/                              ← L5: 进化引擎 (脚本)
│   ├── evolve.md                        ← 使用手册
│   ├── inject-taste.mjs                ← 🎯 品味注入 (扫描代码→偏好推断)
│   ├── inject-memory.mjs               ← 记忆整理
│   └── evolve.mjs                        ← 主编排脚本
│
└── templates/                           ← 通用抽象模板 (可复用!)
    └── harness-template/               ← 复制 = 新项目 Harness
        ├── SKILL.md.template
        ├── identity/                    ← 空壳 (等待 inject-taste)
        ├── constraints/
        ├── knowledge/
        ├── memory/
        ├── harness/                     ← 通用定义
        ├── evolve/
        └── README.md
```

### 2.1.1 已移至 ProjectDoc 的内容

| 原 v4 位置 | 内容 | 移至 ProjectDoc 的文件 |
|-----------|------|---------------------|
| identity/project-fingerprint.md | 技术栈表格 | `tech-stack.md` |
| identity/project-fingerprint.md | 目录结构树 | `structure.md` |
| identity/project-fingerprint.md | 构建配置 | `build-config.md` |
| knowledge/codebase-map.md | 数据流图 | `data-flow.md` |
| knowledge/codebase-map.md | 文件路径速查表 | `file-reference.md` |
| knowledge/asset-inventory.md | 组件列表+状态 | `components.md` |
| knowledge/asset-inventory.md | Hooks 表 | `hooks.md` |
| knowledge/asset-inventory.md | CSS 工具类列表 | `css-classes.md` |
| knowledge/visual-system.md | 色彩实际值表 | `styles.md` (color palette section) |

### 2.1.2 Harness 保留的内容 (纯品味+规则)

| 位置 | 内容 | 性质 |
|------|------|------|
| identity/taste-profile.md | "开发者喜欢冷色调、spring 动画、中等圆角" | **推断** (不是记录) |
| constraints/hard-rules.md | "不准删除依赖、不准硬编码路径" | **规则** (禁止行为) |
| constraints/identity-boundary.md | "背景只能用 #0a0a0f、CTA 只能用 #00d4aa" | **约束** (边界) |
| knowledge/animation-patterns.md | "项目中用的 7 种动画模式" | **参考** (风格锚点) |
| memory/* | "上次决定 X 方案因为 Y" | **经验** (历史) |

### 2.2 数据流 — Harness Pipeline

```
用户输入任务
    │
    ▼
┌───────────────────────────────────────────┐
│  L0 SKILL.md (Router) — 始终加载          │
│  识别任务类型, 决定加载策略                 │
└───────────────┬───────────────────────────┘
                │
    ┌───────────▼───────────┐
    │  L1 Identity + Constraints (始终加载) │
    │  • 我是谁? (fingerprint)              │
    │  • 开发者喜欢什么? (taste-profile)     │
    │  • 绝对不能做什么? (hard-rules)        │
    └───────────┬───────────┘
                │
    ┌───────────▼───────────┐
    │  L4 Classifier (6轴分类) │
    │  type × uncertainty × scope        │
    │  × domain × blast_radius × verifiability │
    └───────────┬───────────┘
                │
    ┌───────────▼───────────┐
    │  L4 Router (模块路由)   │
    │  根据分类结果选择 L2 模块组合          │
    └───────────┬───────────┘
                │
    ┌───────────▼───────────┐
    │  L2 Knowledge (按需加载)│
    │  只加载相关模块, 节省 token           │
    └───────────┬───────────┘
                │
    ┌───────────▼───────────────────┐
    │  L3 Memory (上下文增强)          │
    │  注入历史决策 + 已发现模式        │
    └───────────┬───────────────────┘
                │
    ▼
  AI 执行任务
                │
    ┌───────────▼───────────────────┐
    │  L4 Evaluator (6维评估)         │
    │  correctness / completeness / quality │
    │  / robustness / clarity / verifiability │
    └───────────┬───────────────────┘
                │
    ┌───────────▼───────────────────┐
    │  L4 Evolver (进化)              │
    │  更新权重 / A/B 测试内容 / 记录决策  │
    │  写入 memory/ + 更新 evolution-state │
    └───────────────────────────────┘
```

### 2.3 Token 预算对比

| 场景         | v2 (单文件)     | v4.1 Harness             | 节省     |
| ---------- | ------------ | ----------------------- | ------ |
| CSS 快速修复   | 345 行 (100%) | \~160 行 (**-54%**)      | <br /> |
| 加动画效果      | 345 行 (100%) | \~240 行 (**-30%**)      | <br /> |
| 新建 Section | 345 行 (100%) | \~280 行 (**-19%**)      | <br /> |
| 全面重构       | 345 行 (100%) | \~500 行 (+45%, 含评估+记忆) | <br /> |
| 含记忆上下文     | 345 行 (100%) | \~550 lines (+59%, 但跨会话积累)  | <br /> |

> **注**: 需要项目事实时, AI 通过 ProjectDoc 查询 (额外 ~100-200 行, 按需加载)

**关键洞察**: 日常任务只需 19-54% 的 v2 token。项目事实按需从 ProjectDoc 加载，不污染 Harness 上下文。

***

## 三、各模块详细规格

### 3.1 L0: SKILL.md (Harness Router)

**始终在上下文中。\~55 行。比 v4 更轻（删除了项目事实摘要）。**

```markdown
---
name: "umg-portfolio"
description: "UMG Portfolio Taste Harness — 自动推断开发者品味、约束行为边界、积累工作经验、持续进化的用户级 AI 协作框架。
当在此项目中开发时自动触发。不包含项目事实(见ProjectDoc), 纯粹定义'这个开发者喜欢怎么工作'。"
whenToUse:
  - 用户在 portfolio/ 目录下发起任何开发任务
  - 关键词: 样式/颜色/动画/组件/section/重构/新建/编辑/部署
---

# UMG Portfolio Taste Harness

> 不是 Skill 文档, 不是项目说明书。是 **Taste Harness** — 开发者的数字工作风格指纹。
>
> 项目事实 → **ProjectDoc** (自动从代码生成)
> 用户品味 → **这里** (从代码推断 + 记忆积累)
>
> **仓库根目录**: `html/` | **项目代码目录**: `html/portfolio/` | **ProjectDoc**: `html/.trae/project-doc/`

## Pipeline

`用户任务 → [L1 品味+约束] → [L4 分类] → [L4 路由] → [L2 方法论] → [L3 记忆] → [ProjectDoc 事实查询] → 执行 → [L4 评估] → [L4 进化]`

## ProjectDoc Integration

当需要项目事实时, AI 应读取 `../project-doc/` 下的对应文件:
- 技术栈/版本 → `tech-stack.md`
- 目录结构 → `structure.md`
- 组件列表 → `components.md`
- 文件路径 → `file-reference.md`
- CSS 类库 → `css-classes.md`
- 数据流图 → `data-flow.md`

## 6 轴任务分类 (Classifier)
[同 v4, 保持不变]

## 模块路由表 (Router)
[同 v4, knowledge 模块减少为 3 个]

## 最后一条规则
[同 v4]
```

### 3.2 L1-a: identity/ (身份层)

#### project-fingerprint.md — 技术指纹 \[AUTO]

由 `inject-identity.mjs` 从 `package.json` 自动生成:

```markdown
# Project Fingerprint

## Tech Stack <!-- AUTO-START:tech-stack -->
| Next.js | 16.2.2 | Framework |
| React | 19.2.2 | UI |
| ... (自动填充)
<!-- AUTO-END:tech-stack -->

## Build Config <!-- AUTO-START:build-config -->
output: export | basePath: /UMG_Home | distDir: dist
<!-- AUTO-END:build-config -->

## Directory Structure <!-- AUTO-START:directory-tree -->
(自动生成的目录树)
<!-- AUTO-END:directory-tree -->

## Detected: _lastScan_: 2026-04-04T...
```

#### taste-profile.md — 品味配置 \[AUTO] 🆕核心创新

由 `inject-taste.mjs` 通过代码分析自动推断:

```markdown
# Taste Profile (Auto-Detected from Codebase)

> 这个文件不是手写的。它是通过扫描代码库中所有 .tsx/.css 文件,
> 统计实际使用的模式推断出的"开发者品味指纹"。

## Color Preferences <!-- AUTO-START:taste-colors -->
- **Dominant Temperature**: Cool (67% cool tokens: #00d4aa #00a8e8 #9d4edd)
- **Background**: Always #0a0a0f (100% consistency across 7 sections)
- **CTA**: Always #00d4aa (100% consistency on primary buttons)
- **Accent Diversity**: 5 distinct accent colors (Car/HMI/Niagara/Design/Game)
- **Forbidden**: No warm backgrounds, no rainbow gradients detected
<!-- AUTO-END:taste-colors -->

## Animation Preferences <!-- AUTO-START:taste-animation -->
- **Physics Model**: Spring-dominant (avg damping: 14.3, avg stiffness: 115)
- **Entry Pattern**: whileInView (used in 6/7 sections), variants+stagger (Hero only)
- **Interaction Style**: 3D tilt (Projects), magnetic button (Contact), particle repulsion (Hero)
- **Duration Range**: 0.15s (tilt) ~ 0.8s (entry), never > 1s
- **Forbidden**: No linear easing on interactions, no entry > 1s
<!-- AUTO-END:taste-animation -->

## Code Style Preferences <!-- AUTO-START:taste-code -->
- **Component Size**: Medium (avg 195 lines, max 380 lines, min 45 lines)
- **Naming**: camelCase components, kebab-case CSS classes
- **Comment Density**: Minimal (2.8% of lines — near-zero policy)
- **Defensive Coding**: High (100% of data accesses use optional chaining or fallbacks)
- **Import Strategy**: Mixed (Hero/About use useContent(), others direct import)
<!-- AUTO-END:taste-code -->

## Layout Preferences <!-- AUTO-START:taste-layout -->
- **Section Spacing**: Generous (py-32 lg:py-40 standard)
- **Container**: mx-auto px-6 lg:px-12 (consistent across all sections)
- **Grid Usage**: 2-column (About), 12-column (Projects), hexagonal (Skills)
- **Max Width**: max-w-6xl (Hero), max-w-2xl (text content)
<!-- AUTO-END:taste-layout -->
```

**inject-taste.mjs 的扫描逻辑:**

```javascript
// 1. 色彩扫描: 正则匹配 bg-\[#([0-9a-f]{6})\] 和 text-\[#([0-9a-f]{6})\]
//    → 统计频率 → 色温分析 (hue < 180 = cool, hue >= 180 && < 300 = warm, else neutral)

// 2. 动画扫描: 匹配 spring\(damping:\s*(\d+).*stiffness:\s*(\d+)\)
//    → 聚类 → 判断主导物理模型

// 3. 圆角扫描: 提取所有 rounded-(xl|2xl|3xl|full) 
//    → 取最大值作为圆角偏好上限

// 4. 组件粒度: fs.readdir + 每文件 lineCount
//    → 统计分布 (mean, median, max, min)

// 5. 命名约定: 分析函数名/文件名的 case pattern
//    → 判定主导命名风格

// 6. 注释密度: (注释行数 / 总行数) * 100
//    → 判定文档偏好级别

// 7. 防御性编程: 统计 ?. 和 ?? 操作符使用率
//    → 判定安全编码意识强度
```

#### evolution-state.md — 进化状态 \[AUTO]

```markdown
# Evolution State

## Version: v4.0.0
## Last Evolved: 2026-04-04T12:00:00Z
## Total Sessions: 0
## Decisions Logged: 0
## Patterns Discovered: 0
## Anti-Patterns Recorded: 5 (seeded)

## Module Weights (Router)
| module | weight | lastAdjusted | reason |
|--------|--------|-------------|--------|
| visual-system | 1.00 | initial | — |
| animation-patterns | 1.00 | initial | — |
| codebase-map | 1.00 | initial | — |
| anti-patterns | 1.00 | initial | — |
| modification-playbook | 1.00 | initial | — |
| asset-inventory | 1.00 | initial | — |

## Harness Performance History
(每次 evolve 追加一行)
```

### 3.3 L1-b: constraints/ (约束层)

三个文件直接从 v2 提取，结构不变:

* `hard-rules.md` — 🔴 绝对禁区 9 条

* `identity-boundary.md` — 🟡 身份边界 (色彩/圆角/动画/排版/渐变)

* `anti-patterns.md` — 🟠 反模式陷阱 5 个 + MANUAL 追加区

### 3.4 L2: knowledge/ (知识层)

五个文件按需加载:

* `visual-system.md` — 视觉系统 (调色板含 AUTO 标记/UI 组件语言表/渐变规则)

* `animation-patterns.md` — 动画模式 (7 种参考表/禁止清单/时间参考)

* `codebase-map.md` — 代码库地图 (技术栈 AUTO/目录树 AUTO/数据流图/路径速查)

* `asset-inventory.md` — 资产清单 (组件 AUTO/Hooks/CSS 类 AUTO)

* `modification-playbook.md` — 操作手册 (新增 Section/字段/样式的步骤)

### 3.5 L3: memory/ (记忆层) 🆕

#### decisions.log — 决策日志

Append-only JSON-L 格式 (每条决策一行 JSON):

```jsonl
{"ts":"2026-04-04T10:30:00Z","task":"修改 Hero 背景色","decision":"保持 #0a0a0f 不变","reason":"taste-profile 显示 100% 一致性","outcome":"success","module":"visual-system"}
{"ts":"2026-04-04T11:15:00Z","task":"新增 Testimonials Section","decision":"采用 About 的左右分栏布局","reason":"codebase-map 显示 grid lg:grid-cols-2 是已验证模式","outcome":"success","module":"modification-playbook"}
```

#### patterns-discovered.md — 发现的模式

AI 在工作中发现的可复用模式，逐步积累:

```markdown
# Patterns Discovered

## Layout Patterns (from actual code analysis)
- **Standard Section**: bg-[#0a0a0f] + grid background + blur orbs + container + label-title-content (observed in 5/7 sections)
- **Card Hover**: border-color transition 0.3s + radial-gradient glow inside (observed in all card components)

## Data Access Pattern (from bug prevention)
- **Safe Content**: `const content = useContent(); const data = content?.key ?? defaultKey;` (universal in sections that use context)

## Animation Entry Pattern (from consistency check)
- **Non-Hero Sections**: `const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-100px' });` (6/7 sections identical)
```

#### failure-postmortems.md — 复盘记录

每个失败/回滚的详细复盘:

```markdown
# Failure Postmortems

## FP-001: Projects Modal z-index Conflict (2026-03-15)
**What happened**: Modal 被粒子背景遮挡
**Root cause**: ParticleField z-index 未设为 pointer-events-none 的层
**Fix**: 给 ParticleField wrapper 加 pointer-events-none
**Lesson learned**: Canvas 层必须在 pointer-events 上显式声明
**Prevention**: 新增 anti-pattern #6 — "Canvas 元素必须声明 pointer-events"
```

#### session-summaries/ — 会话摘要

每次对话结束时自动生成一个:

```markdown
# Session Summary: 2026-04-04 10:00-11:30

## Tasks Completed: 3
1. ✅ 修复 Contact 区域磁吸按钮偏移
2. ✅ 更新 Skills 六边形布局间距
3. ⏳ 新增 Testimonials Section (进行中)

## Modules Loaded: visual-system, animation-patterns, codebase-map
## Evaluator Scores: avg 0.91 (quality: 0.88, clarity: 0.95)
## Patterns Added: 1 (Card Hover Glow variant)
## Decisions Logged: 2
## Evolution: visual-system weight 1.00→1.02 (pattern reuse success)
```

### 3.6 L4: harness/ (运行时元层) 🆕

#### classifier.md — 任务分类器

定义 6 轴 Taxonomy + 分类示例 + 到 Router 的映射:

```markdown
# Task Classifier

## 6-Axis Taxonomy

### Axis 1: Type (任务类型)
| Value | Triggers | Examples |
|-------|----------|----------|
| fix | 修复/解决/bug/报错/崩溃/不工作 | "修复登录后白屏" |
| feature | 新建/添加/实现/增加/做个 | "加一个暗黑模式切换" |
| refactor | 重构/优化/整理/简化/合并 | "把 Projects 拆成小组件" |
| review | 审查/检查/review/有没有问题 | "帮我 review 这段代码" |
| debug | 排查/为什么/怎么/定位 | "为什么这个动画不触发" |
| test | 测试/测试用例/覆盖 | "给 Contact 表单加测试" |
| deploy | 部署/发布/build/CI | "部署到 GitHub Pages" |

### Axis 2: Uncertainty (不确定度)
| Value | Criteria |
|-------|----------|
| low | 明确的单一变更, 有现成参照 |
| medium | 需要少量设计决策, 有多个可行方案 |
| high | 开放性问题, 需要探索/研究/原型 |

[... 其余 4 轴类似定义 ...]

## Classification Example

Input: "给 Projects 卡片加个 3D tilt 效果，鼠标移上去要倾斜"
→ type=feature | uncertainty=low | scope=multi-file | domain=animation | blast_radius=component | verifiability=easy
→ Route: knowledge/animation-patterns + knowledge/asset-inventory
```

#### router.md — 路由规则

定义"什么分类结果 → 加载哪些模块":

```markdown
# Module Router

## Routing Rules

### Rule Set A: Domain-Based (Primary)
domain=visual → +visual-system
domain=animation → +animation-patterns
domain=data → +codebase-map
domain=architecture → +codebase-map + modification-playbook
domain=config → +codebase-map

### Rule Set B: Type-Based (Secondary)
type=refactor → +anti-patterns (always load when refactoring)
type=feature → +modification-playbook (for new features)
type=review → +anti-patterns + asset-inventory (know what exists first)
type=debug → +codebase-map (need to understand structure)

### Rule Set C: Uncertainty-Based (Tertiary)
uncertainty=high → +memory/patterns-discovered (learn from past)
uncertainty=high → suggest ensemble mode (load 2 approaches)

### Rule Set D: Blast Radius (Safety)
blast_radius=system → +hard-rules (extra caution)
blast_radius=repo-wide → full L2 load + memory/failure-postmortems
```

#### evaluator.md — 评估标准

定义 6 维评分卡:

```markdown
# Result Evaluator

## 6-Dimension Scorecard

| Dimension | Weight | What it Measures | Scoring Guide |
|-----------|--------|-----------------|---------------|
| correctness | 25% | Does it work? | 1.0=no bugs, 0.5=minor, 0.0=broken |
| completeness | 20% | Is it done? | 1.0=all requirements, 0.5=partial |
| quality | 20% | Is it well-written? | Follows constraints/taste/profile? |
| robustness | 15% | Will it break? | Edge cases handled? Defensive coding? |
| clarity | 10% | Is it understandable? | Can another AI/human read it? |
| verifiability | 10% | Can we verify it? | Testable? Reviewable? |

## Scoring Thresholds
- **PASS**: overall ≥ 0.85, no dimension < 0.7
- **PARTIAL**: overall ≥ 0.65, at least one dimension < 0.7
- **FAIL**: overall < 0.65 or any dimension < 0.5

## Post-Evaluation Actions
- PASS → log to decisions.log, update patterns if novel
- PARTIAL → log with gaps, suggest fixes
- FAIL → create failure-postmortem entry, DO NOT commit
```

#### evolver.md — 进化引擎规则

定义三种进化层级:

```markdown
# Harness Evolver

## Level 1: Routing Evolution (Weight Updates)
Trigger: After every evaluated task
Action: Update module weights in evolution-state.md
Formula: `new_weight = old_weight * (1 + (score - 0.9) * 0.05)`
Cap: 0.5 ≤ weight ≤ 1.5

## Level 2: Content Evolution (A/B Testing)
Trigger: When same task type scores inconsistently (>0.15 variance over 3 tasks)
Action:
  1. Create variant of the underperforming module's guidance
  2. Mark with `[EXPERIMENT]` tag
  3. Track which variant produces better scores
  4. After 5 tasks, promote winner, archive loser to failure-postmortems

## Level 3: Genesis (New Harness Creation)
Trigger: When a new task pattern emerges (≥3 similar unclassified tasks)
Action:
  1. Detect pattern from decisions.log clustering
  2. Propose new module or sub-skill
  3. Write to patterns-discovered.md as proposal
  4. Require human approval before creating file

## Auto-Triggers for evolve.mjs
- package.json changed → run inject-identity
- globals.css changed → run inject-taste + inject-knowledge
- components/ changed → run inject-knowledge
- Any .tsx added/removed → run inject-structure
- After each coding session → run inject-memory
```

### 3.7 L5: evolve/ (进化引擎脚本)

6 个 Node.js ESM 脚本 (无依赖):

| 脚本                     | 输入                             | 输出                                    | 功能           |
| ---------------------- | ------------------------------ | ------------------------------------- | ------------ |
| `inject-identity.mjs`  | package.json, next.config.ts   | identity/project-fingerprint.md       | 技术栈+构建配置+目录树 |
| `inject-taste.mjs`     | 所有 .tsx/.css 文件                | identity/taste-profile.md             | **品味指纹推断**   |
| `inject-knowledge.mjs` | globals.css, components/, app/ | knowledge/ 下 3 个文件的 AUTO 区            | CSS类+组件+目录同步 |
| `inject-memory.mjs`    | memory/decisions.log           | memory/patterns-discovered.md         | 决策聚类→模式提取    |
| `evolve.mjs`           | (调用以上全部)                       | evolve-report.md + evolution-state.md | 主编排+报告生成     |

### 3.8 templates/ (通用抽象模板) 🆕

整个 `harness-template/` 目录是一个 **可复用的 Harness 骨架**:

```bash
# 为新项目创建 Harness:
cp -r .trae/skills/umg-portfolio/templates/harness-template .trae/skills/my-project-harness
cd .trae/skills/my-project-harness
node evolve/inject-identity.mjs
node evolve/inject-taste.mjs
node evolve/inject-knowledge.mjs
# 完成! 你的项目现在有自己的 Harness 了
```

模板中的文件都是"半成品":

* `SKILL.md.template` — 有 Pipeline 图和 Taxonomy 定义，但无项目特定内容

* `identity/` — 空壳，等待注入脚本填充

* `constraints/hard-rules.md` — 通用版（无项目特定的第 2-3 条）

* `knowledge/` — 空壳

* `harness/` — 完整通用定义（classifier/router/evaluator/evolver 不依赖项目）

* `evolve/` — 完整通用脚本（无需修改即可用于任何项目）

***

## 四、实施步骤 (18 步)

### Phase 1: Harness 骨架 (步骤 1-4)

* [ ] **Step 1**: 创建目录结构 (identity/constraints/knowledge/memory/harness/evolve/templates/harness-template + 子目录)
* [ ] **Step 2**: 编写 `SKILL.md` (L0 Router ~55 行) — 含 Pipeline 图 + ProjectDoc Integration 协议 + 6 轴 Taxonomy + Router 表
* [ ] **Step 3**: 编写 `identity/evolution-state.md` — 进化状态骨架
* [ ] **Step 4**: 编写 `constraints/` 下三个文件 (hard-rules / identity-boundary / anti-patterns, 从 v2 提取)

### Phase 2: 知识层 — 纯方法论 (步骤 5-8)

* [ ] **Step 5**: `knowledge/animation-patterns.md` — 7 种模式参考表/禁止清单/时间参考
* [ ] **Step 6**: `knowledge/modification-playbook.md` — 新增 Section/字段/样式的操作模板
* [ ] **Step 7**: `knowledge/design-principles.md` 🆕 — 从代码提炼的设计哲学 (深邃暗色+霓虹青绿=UE5风格等)
* [ ] **Step 8**: `identity/taste-profile.md` 🎯 — 品味配置骨架 + AUTO 标记区 (7 个推断维度)

### Phase 3: Memory + Runtime (步骤 9-13)

* [ ] **Step 9**: `memory/decisions.log` — JSON-L 格式定义
* [ ] **Step 10**: `memory/patterns-discovered.md` — 骨格 + 初始模式种子
* [ ] **Step 11**: `memory/failure-postmortems.md` — 骨格 + 反模式转化种子
* [ ] **Step 12**: `harness/classifier.md` — 6 轴 Taxonomy 完整定义
* [ ] **Step 13**: `harness/router.md` + `evaluator.md` + `evolver.md` — 运行时三元组

### Phase 4: 进化引擎 (步骤 14-17)

* [ ] **Step 14**: `evolve/evolve.md` — 使用手册
* [ ] **Step 15**: `scripts/inject-taste.mjs` 🎯 — 核心脚本: 扫描代码 → 7 维品味推断
* [ ] **Step 16**: `scripts/inject-memory.mjs` — decisions.log → patterns 聚类
* [ ] **Step 17**: `scripts/evolve.mjs` — 主编排 (调用 taste + memory + 生成报告)

### Phase 5: 模板 + 验证 (步骤 18)

* [ ] **Step 18**: `templates/harness-template/` + README.md + 端到端 evolve 验证

***

## 五、设计决策记录 (DDR)

| 决策 | 选择 | 理由 |
|------|------|------|
| **ProjectDoc ↔ Harness 分离** | 项目事实归 ProjectDoc, 用户品味归 Harness | 各司其职, Harness 真正通用化, 换项目只需换 ProjectDoc |
| **6 轴 Taxonomy** | type/uncertainty/scope/domain/blast_radius/verifiability | 借鉴 adaptive-harness，比关键词匹配更精确 |
| **Taste Detection** | 代码统计分析 → 7 维品味推断 | 让 AI 感知"开发者喜欢什么"，而非只知"不准做什么" |
| **Memory 格式** | JSON-L (decisions) + Markdown (patterns/postmortems) | JSON-L 可程序化处理，Markdown 可人类阅读 |
| **Evaluator 维度** | 6 维加权评分 | 借鉴 adaptive-harness，量化进化方向 |
| **三级进化** | Routing(权重) → Content(A/B) → Genesis(新建) | 渐进式复杂度 |
| **Template 设计** | 半成品非空壳 | 通用定义(harness/)直接可用，项目特定内容等待注入 |
| **inject-taste 范围** | 7 维度(色彩/动画/圆角/粒度/命名/注释/防御) | 覆盖视觉+代码+工程三个层面 |
| **删除 visual-system.md** | 色彩实际值→ProjectDoc, 品味偏好→taste-profile | 避免事实与偏好混在一起 |
| **删除 codebase-map.md** | 整个文件→ProjectDoc | Harness 不应包含任何可从代码自动生成的事实 |
| **删除 asset-inventory.md** | 整个文件→ProjectDoc | 同上 |
| **新增 design-principles.md** | 从代码提炼的设计哲学 | 填补"方法论层"的哲学空白（如 UE5 风格=深邃暗色+霓虹） |

