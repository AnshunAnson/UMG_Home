# UMG Portfolio Taste Harness v4.2 — 收敛改进计划

## 目标

将 umg-portfolio 从"全功能框架"收敛为**轻量项目级约束+进化 Harness**：
- 剥离设计规范（已由 ui-ux-pro-max 覆盖）
- 聚焦项目独有价值：硬约束 / 踩坑经验 / 操作 SOP / 进化引擎
- 实施核心改进：配置外部化 + 种子数据 + 评估客观化
- **零新增依赖**

---

## 一、文件变更总览

### 删除/合并（瘦身）

| 文件 | 操作 | 原因 |
|------|------|------|
| `constraints/identity-boundary.md` | **删除** | 设计 token/色彩/圆角/动画/easing 禁用 → 全部属 ui-ux-pro-max 范畴。仅保留"本项目具体取值"摘要到 SKILL.md |
| `knowledge/design-principles.md` | **精简** | 删除 UE5 美学/布局哲学/动画哲学/组件哲学（设计规范），仅保留"数据哲学: 防御性乐观主义"+"代码哲学: 极简实用"（代码层面） |
| `knowledge/animation-patterns.md` | **精简** | 删除通用原则和禁止清单（ui-ux-pro-max 已覆盖），仅保留"已有模式参考表"（含具体组件名和参数值） |

### 新建

| 文件 | 用途 | 大小 |
|------|------|------|
| `.harnessrc.json` | 统一路径配置，消除硬编码 | ~15 行 |
| `constraints/security-boundary.md` | 安全边界定义 | ~40 行 |

### ProjectDoc 迁移（自动创建）

当前 ProjectDoc 位于 `.trae/skills/project-doc/`（7 个文件），用户要求迁移至 `e:\AnShunConfig\html\ProjectDoc\`。

**操作**：将现有 7 个文件复制到新位置。如目标目录不存在则自动创建。

| 源文件 | 目标路径 |
|--------|---------|
| `.trae/skills/project-doc/tech-stack.md` | `../../ProjectDoc/tech-stack.md` |
| `.trae/skills/project-doc/structure.md` | `../../ProjectDoc/structure.md` |
| `.trae/skills/project-doc/components.md` | `../../ProjectDoc/components.md` |
| `.trae/skills/project-doc/file-reference.md` | `../../ProjectDoc/file-reference.md` |
| `.trae/skills/project-doc/css-classes.md` | `../../ProjectDoc/css-classes.md` |
| `.trae/skills/project-doc/data-flow.md` | `../../ProjectDoc/data-flow.md` |
| `.trae/skills/project-doc/build-config.md` | `../../ProjectDoc/build-config.md` |

### 修改

| 文件 | 变更内容 |
|------|---------|
| `SKILL.md` | 重写描述、添加 ui-ux-pro-max 引用声明、注入品味取值摘要、更新路由表 |
| `evolve/scripts/inject-taste.mjs` | 读取 .harnessrc.json、增强 spring 正则、修复防御性编程统计 |
| `evolve/scripts/post-task.mjs` | 读取 .harnessrc.json、增强模式推断输出 |
| `evolve/scripts/inject-memory.mjs` | 读取 .harnessrc.json |
| `harness/evaluator.md` | 添加 Objective Checklist（客观检查项）|
| `memory/decisions.log` | 追加 15 条 seed 决策（`_seed: true` 标记）|
| `identity/taste-profile.md` | 添加 ui-ux-pro-max 引用标注 |
| `memory/patterns-discovered.md` | 补充手动观察到的操作模式 |

### 不变

- `constraints/hard-rules.md` ✅
- `constraints/anti-patterns.md` ✅
- `knowledge/modification-playbook.md` ✅
- `harness/classifier.md` ✅
- `harness/router.md` ✅
- `harness/evolver.md` ✅
- `evolve/evolve.md` ✅
- `memory/failure-postmortems.md` ✅
- `identity/evolution-state.md` ✅
- `templates/` ✅

---

## 二、详细实施步骤

### Step 1: 创建 ProjectDoc 目录并迁移文件

1. 创建目录 `e:\AnShunConfig\html\ProjectDoc\`（如不存在）
2. 将 `.trae/skills/project-doc/` 下的 7 个 md 文件**复制**到 `html/ProjectDoc/`
3. 验证 7 个文件全部就位

### Step 2: 创建 `.harnessrc.json`

路径：`e:\AnShunConfig\html\.trae\skills\umg-portfolio\.harnessrc.json`

```jsonc
{
  "$schema": "./harness-schema.json",
  "version": "4.2",
  "projectRoot": "../../portfolio",
  "projectDocPath": "../../../ProjectDoc",
  "paths": {
    "appDir": "app",
    "sectionsDir": "app/sections",
    "componentsDir": "app/components",
    "configDir": "app/config",
    "editDir": "app/edit"
  },
  "fileExtensions": [".tsx", ".css", ".ts"],
  "excludeDirs": ["node_modules", ".next", "dist", ".git", "out"],
  "designSkill": "ui-ux-pro-max"
}
```

> `projectDocPath` 为相对于 skill 目录 (`umg-portfolio/`) 的路径：
> `../../../ProjectDoc` = 向上 3 级到 `html/`，再进入 `ProjectDoc/`

### Step 3: 创建 `constraints/security-boundary.md`

内容包括：
- 敏感信息分级表（PUBLIC / INTERNAL / SENSITIVE）
- 分享时的脱敏规则（绝对路径 → 占位符、邮箱脱敏等）
- `.harnessrc.json` 中 projectRoot 不提交到公开仓库的提醒

### Step 4: 删除 `constraints/identity-boundary.md`

该文件全部内容（色彩禁用、圆角上限、动画 easing 禁用、排版锁定、渐变规则）属于通用设计规范范畴。

其**有效信息**以极简形式沉淀到两处：
1. **SKILL.md L1 始终加载摘要** — 保留 6 行品味核心（背景色/CTA色/spring/圆角上限/注释密度/防御性编程）
2. **taste-profile.md 头部** — 添加一行引用：`> Design tokens & detailed guidelines → ui-ux-pro-max Skill`

### Step 5: 精简 `knowledge/design-principles.md`

**删除的内容**：
- ~~核心美学: UE5 风格~~ （设计规范）
- ~~布局哲学: 宽松垂直节奏~~ （设计规范）
- ~~组件哲学: 卡片即世界~~ （设计规范）
- ~~动画哲学: 物理感 > 数字感~~ （设计规范 → animation-patterns 的参考表已保留具体参数）

**保留的内容**（重命名为 `code-principles.md`）：
- 数据哲学: 防御性乐观主义（代码层面，含代码示例）
- 代码哲学: 极简实用（代码层面）

文件头添加：`> 📎 Visual/Animation design principles → ui-ux-pro-max Skill. 本文件仅保留代码层面的设计哲学。`

### Step 6: 精简 `knowledge/animation-patterns.md`

**删除的内容**：
- ~~核心原则 1~7~~ （通用动画设计原则）
- ~~禁止清单~~ （通用规范）

**保留的内容**：
- 已有模式参考表（7 行，含 Hero/Section/Hover/Card/Button/Modal 的具体参数）— 这是**项目特有的事实**
- 过渡时间参考表（8 行，具体数值）

文件头添加：`> 📎 Animation design principles & forbidden patterns → ui-ux-pro-max Skill. 本文件仅保留本项目的具体参数参考。`

### Step 7: 改造 `SKILL.md`

关键变更：

1. **description 更新**：
   - 旧: "自动推断开发者品味、约束行为边界..."
   - 新: "项目级硬约束 + 踩坑经验 + 操作 SOP + 进化引擎。设计规范委托给 ui-ux-pro-max。"

2. **新增 Design Delegation 段落**：
   ```markdown
   ## Design Spec Delegation
   > 详细的 UI/UX 设计规范（色彩系统、排版、间距、动画原则、组件样式指南）
   > 由 **ui-ux-pro-max** Skill 提供。
   >
   > 本 Skill 仅定义：
   > - 项目级技术硬约束（hard-rules）
   > - 本项目踩过的坑（anti-patterns + postmortems）
   > - 项目特有的操作流程（modification-playbook）
   > - 代码层面的设计哲学（code-principles）
   > - 具体参数参考（animation-patterns 中的实际使用值）
   ```

3. **L1 始终加载摘要** — 保持不变（6 行品味核心是项目实例化值，不是通用规范）

4. **路由表更新**：
   - `design-principles` → 改名为 `code-principles`
   - visual/domain 任务额外注明 "同时加载 ui-ux-pro-max"

### Step 8: 注入 15 条 Seed Decisions

在 `memory/decisions.log` 末尾追加 15 条 `_seed: true` 标记的条目，基于当前代码库的实际状态推断：

```jsonl
{"ts":"2026-01-10T08:00:00Z","task":"初始化项目基础架构","decision":"采用 Next.js SSG export + basePath=/UMG_Home 部署到 GitHub Pages","reason":"静态站点托管需求，避免 SSR 成本","outcome":"success","module":"hard-rules","_seed":true}
{"ts":"2026-01-12T10:30:00Z","task":"Hero 区域字母入场动画实现","decision":"使用 variants+staggerChildren 模式而非 whileInView","reason":"Hero 是首屏焦点，需要更有冲击力的入场效果；其他 Section 用 whileInView 即可","outcome":"success","module":"animation-patterns","_seed":true}
{"ts":"2026-01-13T14:00:00Z","task":"ContentProvider 数据加载重构","decision":"采用 useState(defaultContent) 乐观渲染替代 useState(null)+await","reason":"符合 hard-rules #8 不阻塞渲染原则，用户无需看到空白 Loading 页面","outcome":"success","module":"anti-patterns","_seed":true}
{"ts":"2026-01-14T09:15:00Z","task":"统一所有 Section 背景色","decision":"硬编码 bg-[#0a0a0f] 而非 CSS 变量 var(--bg-primary)","reason":"Tailwind v4 内联 style 不解析 CSS 变量（见 anti-patterns #5），直接用色值确保一致性","outcome":"success","module":"design-principles","_seed":true}
{"ts":"2026-01-15T11:00:00Z","task":"Projects 卡片 3D tilt 交互","decision":"使用 rotateX/Y ±8° + ease-out 0.15s 实现","reason":"轻量感知反馈，不干扰阅读；spring 参数过重会拖累滚动性能","outcome":"success","module":"animation-patterns","_seed":true}
{"ts":"2026-01-16T16:00:00Z","task":"Contact CTA 磁吸按钮效果","decision":"useSpring(damping:15, stiffness:150) + offset*0.4","reason":"快速响应的磁吸感，damping 15 提供适度阻尼避免飘忽","outcome":"success","module":"animation-patterns","_seed":true}
{"ts":"2026-01-17T10:45:00Z","task":"粒子背景性能优化","decision":"限制粒子数量 + requestAnimationFrame + 可见区域检测","reason":"Three.js 粒子在移动端容易掉帧，需做性能预算控制","outcome":"success","module":"anti-patterns","_seed":true}
{"ts":"2026-01-18T13:20:00Z","task":"Skills 六边形网格布局","decision":"CSS grid + clip-path hexagon 而非 SVG 或 Canvas","reason":"纯 CSS 方案最轻量，且响应式适配简单","outcome":"success","module":"modification-playbook","_seed":true}
{"ts":"2026-01-19T09:00:00Z","task":"内容编辑器 DynamicForm 组件","decision":"schema-driven 动态表单 + FieldSchema 类型注册","reason":"新增字段只需改 schema.tsx 和 content.ts 两处，符合最小修改原则","outcome":"success","module":"modification-playbook","_seed":true}
{"ts":"2026-01-20T15:30:00Z","task":"全局光晕跟随效果","decision":"spring(damping:30, stiffness:50) + blur-[120px] opacity-20","reason":"慵懒跟随感，高模糊低透明度不抢内容焦点","outcome":"success","module":"animation-patterns","_seed":true}
{"ts":"2026-01-21T11:00:00Z","task":"NeonCard 边框 hover 高亮","decision":"border-color transition 0.3s + internal radial-gradient on hover","reason":"所有卡片统一交互语言，从 patterns-discovered 归纳出的标准模式","outcome":"success","module":"patterns-discovered","_seed":true}
{"ts":"2026-01-22T14:00:00Z","task":"数据安全访问策略落地","decision":"全面采用 ?. 和 ?? + 数组长度检查","reason":"content.json 可能缺失任意字段，必须防御性访问（anti-patterns #1）","outcome":"success","module":"anti-patterns","_seed":true}
{"ts":"2026-01-23T10:00:00Z","task":"GlitchText 组件实现","decision":"AnimatePresence + opacity/scale/y 三维过渡 0.3s","reason":"轻量文字故障效果，不影响周围布局","outcome":"success","module":"animation-patterns","_seed":true}
{"ts":"2026-01-24T16:45:00Z","task":"Footer 固定底部布局","decision":"相对定位 + 标准容器 + 最小化视觉权重","reason":"Footer 不应是视觉焦点，保持暗色调与页面融合","outcome":"success","module":"design-principles","_seed":true}
{"ts":"2026-01-25T09:30:00Z","task":"建立 Harness 约束体系 v1","decision":"将 hard-rules / anti-patterns / identity-boundary 分层管理","reason":"不同类型的约束需要不同的违反后果认知（炸/错/丑）","outcome":"success","module":"harness-setup","_seed":true}
```

### Step 9: Evaluator 增加 Objective Checklist

在 [evaluator.md](file:///e:/AnShunConfig/html/.trae/skills/umg-portfolio/harness/evaluator.md) 的 Scoring Thresholds 之前插入新段落：

```markdown
## Objective Checklist (Auto-Verifiable)

> AI 在打主观分之前，**必须先逐项执行以下检查**。
> 所有检查结果直接影响最终评分。

### Hard Rules Compliance (Pass/Fail — 任一 fail 则 correctness ≤ 0.5)

| # | 检查项 | 对应 hard-rule | fail 后果 |
|---|--------|---------------|----------|
| HR-1 | `'use client'` 在第 1 行? | #6 | correctness ≤ 0.5 |
| HR-2 | 无 package.json 中不存在的 import? | #1 | correctness ≤ 0.3 |
| HR-3 | 无硬编码 `/content.json`? | #7 | robustness ≤ 0.5 |
| HR-4 | 无 `useState(null)` + 阻塞渲染? | #8 | robustness ≤ 0.5 |
| HR-5 | 无注释（除非用户要求）? | #5 | quality -0.2 |

### Identity Boundary Check (每违反一条扣 0.1)

| # | 检查项 | 取值 |
|---|--------|------|
| IB-1 | 页面背景色 = `#0a0a0f`? | |
| IB-2 | CTA 按钮/label 色 = `#00d4aa`? | |
| IB-3 | 最大圆角 ≤ rounded-2xl? | |
| IB-4 | 交互动效无 linear easing? | |
| IB-5 | 字体未更换 (Inter + JetBrains Mono)? | |

### Code Health (每违反一条扣 0.05)

| # | 检查项 |
|---|--------|
| CH-1 | 单文件 < 300 行? (或已合理拆分内联子组件) |
| CH-2 | 所有数组访问有长度检查? (`arr.length > N && ...`) |
| CH-3 | 所有外部数据属性访问有 `?.` 或 `??` fallback? |

### Score Formula

```
objective_score = 1.0 - (HR_fails * weight) - (IB_violations * 0.1) - (CH_violations * 0.05)
final_score = objective_score * 0.6 + subjective_score * 0.4
```

其中 `HR_fails * weight` 根据 hardest fail 决定扣分权重（correctness fail 扣 0.5, robustness fail 扣 0.3）。
```

同时更新 Scoring Thresholds 表中的条件：

| 等级 | 条件（更新后） | 后续动作 |
|------|---------------|---------|
| **PASS** | final ≥ 0.85, objective ≥ 0.9, 且无维度 < 0.7 | 记录 decisions.log |
| **PARTIAL** | final ≥ 0.65, 或 objective < 0.9, 或有维度 < 0.7 | 记录 + gap 说明 |
| **FAIL** | final < 0.65, 或 objective < 0.6, 或任何 HR check fail | 创建 postmortem |

### Step 10: 升级 `inject-taste.mjs`

改动点：

1. **读取 `.harnessrc.json`** 替代硬编码路径常量
2. **增强 Spring 正则**（从 1 个扩展为 5 个匹配模式）：
   ```
   当前: /spring\s*\(\s*damping:\s*(\d+)[\s,]*stiffness:\s*(\d+)/g
   扩展为 5 个 pattern 覆盖:
     - spring({ damping: x, stiffness: y })
     - type: 'spring' with damping/stiffness nearby
     - useSpring containing config with damping/stiffness
     - transition with spring type
     - standalone damping/stiffness pair in object
   ```
3. **修复防御性编程统计**：
   - 分母：只统计真正的嵌套成员访问 `\w+(?:\[\w+\])?\.\w+(?:\[\w+\])?\.\w+`
   - 分子：同样修正 `?.` 和 `??` 的匹配精度

### Step 11: 升级 `post-task.mjs`

改动点：

1. **读取 `.harnessrc.json`**
2. **增强 `runInjectMemory()` 输出**：除了决策统计外，还将 inferTask 的 domain/scope/uncertainty 结果写入 patterns-discovered.md 的手动区域（作为候选模式观察记录）

### Step 12: 升级 `inject-memory.mjs`

改动点：
1. **读取 `.harnessrc.json`**

### Step 13: 补充 `patterns-discovered.md` 手动模式

在 `<!-- MANUAL-START:patterns -->` 之前追加基于项目实际观察到的操作模式：

```markdown
## Manually Observed Patterns (MOP)

### MOP-001: ContentProvider 修改四步法
每次修改内容模型时，必须同步修改 4 处：
1. interface 定义
2. defaultContent 默认值
3. fetch 合并逻辑
4. localStorage 合并逻辑
**置信度**: 100% (所有内容相关变更均遵循)

### MOP-002: Section 注册两步法
新建 Section 组件的标准动作：
1. 创建 `sections/NewSection.tsx`（'use client' 第 1 行）
2. 在 `page.tsx` 中 import 并按顺序放置
可选第 3 步：如需内容数据，扩展 ContentProvider
**置信度**: 100%

### MOP-003: Card Hover Glow 标准模式
所有卡片组件共享的 hover 交互：
- border-color transition 0.3s
- hover 时内部 radial-gradient 光晕扩散
- 使用项目对应的辅助色 (project.color)
**置信度**: 100% (ProjectCard, NeonCard, Skills card 均一致)

### MOP-004: whileInView 入场标准模板
非 Hero Section 的统一入场写法：
```tsx
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: '-100px' });
// ...
<div ref={ref} className={isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}>
```
**置信度**: 86% (6/7 sections 使用此模式，Hero 除外)
```

### Step 14: 更新 `evolution-state.md`

- Version: v4.1.0 → v4.2.0
- Total Sessions: 保持不变
- Decisions Logged: 0 → 18 (3 existing + 15 seed)
- 记录本次改进说明

---

## 三、实施顺序

```
Step 1:  ProjectDoc 迁移          ← 创建 html/ProjectDoc/ + 复制 7 个文件
Step 2:  .harnessrc.json          ← 基础配置，其他脚本依赖它
Step 3:  security-boundary.md     ← 独立文件，无依赖
Step 4:  删除 identity-boundary.md ← 瘦身（设计规范剥离）
Step 5:  精简 design-principles.md → 瘦身 + 重命名 code-principles.md
Step 6:  精简 animation-patterns.md ← 瘦身（仅保留项目参数参考）
Step 7:  重写 SKILL.md            ← 汇总所有变更后的入口 + 更新 ProjectDoc 路径引用
Step 8:  追加 seed decisions      ← 激活进化引擎 (15 条)
Step 9:  Evaluator Objective Checklist ← 评分客观化
Step 10: inject-taste.mjs 升级     ← 读配置 + 正则增强 + 统计修复
Step 11: post-task.mjs 升级        ← 读配置 + 模式输出增强
Step 12: inject-memory.mjs 升级    ← 读配置
Step 13: patterns-discovered 补充  ← 手动操作模式 (MOP-001~004)
Step 14: evolution-state 更新      ← 版本号 v4.2.0
```

---

## 四、变更前后对比

| 指标 | 变更前 (v4.1) | 变更后 (v4.2) |
|------|--------------|--------------|
| 总文件数 | ~30 | ~27 (-3 个删除/合并) |
| .md 文件总行数 | ~900 行 | ~650 行 (-27%) |
| 设计规范相关行数 | ~350 行 | ~30 行 (-91%) |
| 新增依赖 | 0 | **0** |
| 新增脚本 | 0 | **0** |
| Seed Decisions | 0 | **15 条** |
| Evaluator 客观性 | 0%（纯主观） | **60% 客观检查** |
| 路径硬编码 | 4 层 `..` | **配置文件驱动** |
| 安全边界 | ❌ | ✅ |
| 与 ui-ux-pro-max 关系 | 未定义 | **明确委托声明** |
