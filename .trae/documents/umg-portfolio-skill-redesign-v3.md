# UMG Portfolio Skill 拆分 + 渐进加载 + 自进化 + 注入脚本

> 基于 Claude Code SKILL 哲学体系（否定式约束、渐进加载、Source Anchors、Failure Mode 恐惧注入）重新设计。

---

## 一、架构总览

### 当前问题

单文件 `SKILL.md` (345 行) 存在 3 个核心缺陷：

| 问题 | 影响 | 借鉴的 Claude Code 解决方案 |
|------|------|--------------------------|
| **全量加载** | AI 做 CSS 调整时也要吃下动画/数据流/反模式等无关内容，浪费 token | Prompt Assembly: static/dynamic 边界分离 |
| **静态僵化** | package.json 升级后 skill 中的版本号过期，globals.css 改了色值不同步 | Context Hygiene: 持续清洁 + 自动同步 |
| **无代码锚点** | 色值/目录/组件列表是手写的，可能与实际代码脱节 | Source Anchors: 一切锚定到真实文件路径 |

### 目标架构：4 层渐进加载

```
L0 SKILL.md (路由器)              ← ~50 行, ALWAYS, 缓存命中区
  │
  ├─ L1 core/hard-rules.md         ← ~80 行, ALWAYS, 硬约束
  │
  └─ L2 按需加载 (6 个子模块):
      │
      ├─ visual/visual-identity.md     ← 触发词: 样式/颜色/UI/css/design
      ├─ animation/animation.md         ← 触发词: 动画/动效/motion/过渡/交互
      ├─ codebase/facts.md             ← 触发词: 架构/结构/目录/技术栈
      ├─ codebase/anti-patterns.md     ← 触发词: 修改/新建/添加功能/重构
      ├─ codebase/modification-paths.md← 触发词: 新section/新字段/编辑内容
      └─ assets/assets.md              ← 触发词: 复用/组件/hooks/已有资产
          │
          └─ L3 evolve/evolve.md        ← 触发词: evolve/更新skill/同步
```

### Token 预算对比

| 场景 | 当前 (v2 单文件) | 新架构 |
|------|-----------------|--------|
| CSS 调整 | 345 行 (100%) | ~230 行 (**-33%**) |
| 加动画 | 345 行 (100%) | ~210 行 (**-39%**) |
| 新建 Section | 345 行 (100%) | ~290 行 (**-16%**) |
| 全面重构 | 345 行 (100%) | ~610 行 (+77%, 但场景极少) |

---

## 二、目标目录结构

```
html/.trae/skills/umg-portfolio/
│
├── SKILL.md                          ← Phase 1: L0 路由器
│
├── core/
│   └── hard-rules.md                 ← Phase 1: L1 硬约束
│
├── visual/
│   └── visual-identity.md            ← Phase 2: L2a 视觉身份
│
├── animation/
│   └── animation.md                  ← Phase 2: L2b 动画哲学
│
├── codebase/
│   ├── facts.md                      ← Phase 2: L2c1 事实基准
│   ├── anti-patterns.md              ← Phase 2: L2c2 反模式陷阱
│   └── modification-paths.md         ← Phase 2: L2c3 修改链路
│
├── assets/
│   └── assets.md                     ← Phase 2: L2d 已有资产
│
├── evolve/
│   └── evolve.md                     ← Phase 3: L3 自进化引擎
│
└── scripts/
    ├── inject-stack.mjs              ← Phase 3: 技术栈提取
    ├── inject-colors.mjs             ← Phase 3: 色彩系统提取
    ├── inject-components.mjs         ← Phase 3: 组件注册表扫描
    ├── inject-structure.mjs          ← Phase 3: 目录结构镜像
    ├── inject-css-classes.mjs        ← Phase 3: CSS 工具类提取
    └── evolve.mjs                    ← Phase 3: 主编排脚本
```

**总计**: 7 个目录, 16 个文件 (1 路由器 + 6 子 skill + 1 进化引擎 + 6 注入脚本)

---

## 三、各模块详细规格

### 3.1 L0: SKILL.md (路由器)

**定位**: 始终在上下文中的最小入口。只做两件事：
1. 定义高信号触发词 (`whenToUse`)
2. 提供渐进加载指引

**必须包含的内容**:
- frontmatter (name + description)
- Overview: "不是操作手册，是围栏" 定位句
- **L1 始终加载区块**: 内联硬约束的核心摘要 (~15 行，不是完整版)
- **L2 加载索引表**: 6 个子模块的名称 / 路径 / 触发词 / 预估行数
- **最后一条规则**: "先读再改"

**不含**: 具体色值、具体代码示例、完整反模式、动画模板

### 3.2 L1: core/hard-rules.md

**从当前 v2 提取的内容**:
- 🔴 绝对禁区 (9 条，完整保留)
- 🟡 身份边界中最关键的 5 条 (背景色/CTA色/'use client'/注释/圆角上限)
- 最后一条规则

**设计原则**: 这是"即使什么都不做也必须知道的事"。~80 行。

### 3.3 L2a: visual/visual-identity.md

**从当前 v2 提取**:
- 完整调色板表 + 禁止用色规则
- 排版系统 (字体/标题层级/label 格式)
- 圆角规范表
- UI 组件语言表 (12 种元素样式)
- 渐变禁止规则

**AUTO 标记区域**:
```markdown
<!-- AUTO-START:color-palette -->
(由 inject-colors.mjs 自动填充)
<!-- AUTO-END:color-palette -->

<!-- AUTO-START:css-classes -->
(由 inject-css-classes.mjs 自动填充)
<!-- AUTO-END:css-classes -->
```

### 3.4 L2b: animation/animation.md

**从当前 v2 提取**:
- 核心原则 (7 条)
- 7 种已有模式参考表 (风格锚点，非模板)
- 禁止清单 (5 条)
- 过渡时间参考表

**不含**: 完整 JSX 代码模板 (那是"怎么做"，我们只给"什么风格")

### 3.5 L2c1: codebase/facts.md

**从当前 v2 提取**:
- 技术栈表格 (含版本号)
- 目录结构树
- 内容数据流图
- 关键文件路径速查表

**AUTO 标记区域**:
```markdown
<!-- AUTO-START:tech-stack -->
(由 inject-stack.mjs 从 package.json 提取)
<!-- AUTO-END:tech-stack -->

<!-- AUTO-START:directory-tree -->
(由 inject-structure.mjs 从 app/ 扫描)
<!-- AUTO-END:directory-tree -->
```

### 3.6 L2c2: codebase/anti-patterns.md

**从当前 v2 提取**:
- 5 个反模式 (完整保留，带 ❌→✅ 代码对比和后果说明)

**MANUAL 追加区域**:
```markdown
<!-- MANUAL-START:anti-patterns -->
(人工追加新发现的反模式)
<!-- MANUAL-END:anti-patterns -->
```

### 3.7 L2c3: codebase/modification-paths.md

**从当前 v2 提取**:
- 新增 Section 步骤 (3 步)
- 新增可编辑字段步骤 (5 步)
- 修改样式规则

### 3.8 L2d: assets/assets.md

**从当前 v2 提取**:
- 可复用组件表 (名称/状态/功能)
- 自定义 Hooks 表
- CSS 工具类列表

**AUTO 标记区域**:
```markdown
<!-- AUTO-START:components -->
(由 inject-components.mjs 从 components/ 扫描)
<!-- AUTO-END:components -->
```

### 3.9 L3: evolve/evolve.md

**新增内容 — 自进化引擎定义**:

```markdown
# UMG Portfolio Skill — 自进化引擎

## 进化维度

| 维度 | 触发条件 | 注入脚本 | 更新目标 |
|------|---------|---------|---------|
| 技术栈漂移 | package.json 变更 | inject-stack.mjs | codebase/facts.md |
| 色彩系统同步 | globals.css @theme 变更 | inject-colors.mjs | visual/visual-identity.md |
| 组件注册表 | components/ 文件增删 | inject-components.mjs | assets/assets.md |
| 目录镜像 | app/ 结构变化 | inject-structure.mjs | codebase/facts.md |
| CSS 类库 | globals.css .class 增删 | inject-css-classes.mjs | visual/ + assets/ |

## 运行方式

```bash
node .trae/skills/umg-portfolio/scripts/evolve.mjs
```

## 输出报告解读

[运行后的输出格式说明]

## 人工审核检查清单

[进化后需要人工确认的事项]
```

---

## 四、注入脚本详细规格

### 4.1 scripts/inject-stack.mjs

```
输入:  ../../portfolio/package.json
输出:  codebase/facts.md 中 <!-- AUTO-START:tech-stack --> ... <!-- AUTO-END:tech-stack --> 区间
逻辑:
  1. JSON.parse 读取 package.json
  2. 合并 dependencies + devDependencies
  3. 通过预定义映射表分类 (next.js→Framework, react→UI, framer-motion→Animation...)
  4. 生成 Markdown 表格 (| 技术 | 版本 | 角色 |)
  5. 替换目标区间内容
  6. console.log 变更统计
```

### 4.2 scripts/inject-colors.mjs

```
输入:  ../../portfolio/app/globals.css
       + 扫描 sections/ 和 components/ 中 bg-[#xxx] / text-[#xxx] 硬编码色值
输出:  visual/visual-identity.md 中 <!-- AUTO-START:color-palette --> 区间
逻辑:
  1. 读取 globals.css
  2. 正则提取 --variable: value (支持 #hex / rgb() / rgba())
  3. 扫描所有 .tsx/.css 文件中的 Tailwind 硬编码色值
  4. 合并去重，按亮度排序
  5. 生成调色板 Markdown 表格
  6. 替换目标区间
```

### 4.3 scripts/inject-components.mjs

```
输入:  ../../portfolio/app/components/ 目录
       + 扫描 sections/ 的 import 语句判断活跃状态
输出:  assets/assets.md 中 <!-- AUTO-START:components --> 区间
逻辑:
  1. fs.readdirSync('components/') 过滤 .tsx
  2. 对每个文件:
     - 读前 30 行提取 export default function 名
     - 搜索 // 开头的描述注释
     - grep sections/ 和 page.tsx 是否 import 此组件 → 判断 ✅活跃 / ⏸待集成
  3. 生成组件表 (| 组件 | 状态 | 功能 |)
  4. 替换目标区间
```

### 4.4 scripts/inject-structure.mjs

```
输入:  ../../portfolio/app/ 目录 (递归)
输出:  codebase/facts.md 中 <!-- AUTO-START:directory-tree --> 区间
逻辑:
  1. 递归 fs.readdir + stat
  2. 排除: node_modules, .next, dist
  3. 对每个目录: 列出子文件/文件夹 + 启发式注释
  4. 生成树形文本 (与当前格式一致)
  5. 替换目标区间
```

### 4.5 scripts/inject-css-classes.mjs

```
输入:  ../../portfolio/app/globals.css
输出:  visual/visual-identity.md 和 assets/assets.md 中的 CSS 类列表
逻辑:
  1. 读取 globals.css
  2. 正则匹配 .ue5-*, .project-*, .glow-* 等项目前缀的 class 定义
  3. 提取 class 名 + 后续注释 (/* ... */)
  4. 生成列表格式
  5. 替换目标区间
```

### 4.6 scripts/evolve.mjs (主编排)

```
逻辑:
  1. console.log('=== UMG Portfolio Skill Evolution ===')
  2. 依次 import 并执行 { injectStack, injectColors, injectComponents, injectStructure, injectCssClasses }
  3. 每个脚本返回 { changed: boolean, linesAdded: number, linesRemoved: number }
  4. 汇总统计:
     === Evolution Report ===
     tech-stack:     ✓ updated (+3/-2 lines)
     color-palette:  ✗ no changes
     components:     ✓ updated (+1/-0 lines)
     directory-tree: ✗ no changes
     css-classes:    ✓ updated (+2/-1 lines)
     ---
     Total: 3/5 modules changed, +6/-3 lines
  5. 写入 evolve-report.md (可选)
  6. process.exit(changedCount > 0 ? 0 : 1)
```

---

## 五、实施步骤 (18 步)

### Phase 1: 骨架搭建 (步骤 1-3)

- [ ] **Step 1**: 创建目录结构 `core/ visual/ animation/ codebase/ assets/ evolve/ scripts/`
- [ ] **Step 2**: 编写 `SKILL.md` (L0 路由器) — 含 whenToUse、L1 摘要内联、L2 索引表
- [ ] **Step 3**: 编写 `core/hard-rules.md` (L1) — 从 v2 提取 🔴+🟡 核心

### Phase 2: L2 子模块拆分 (步骤 4-9)

- [ ] **Step 4**: 编写 `visual/visual-identity.md` — 色彩(AUTO标记)/排版/圆角/UI语言/渐变
- [ ] **Step 5**: 编写 `animation/animation.md` — 原则/模式参考表/禁止/时间参考
- [ ] **Step 6**: 编写 `codebase/facts.md` — 技术栈(AUTO)/目录树(AUTO)/数据流/路径速查
- [ ] **Step 7**: 编写 `codebase/anti-patterns.md` — 5 个反模式(MANUAL追加区)
- [ ] **Step 8**: 编写 `codebase/modification-paths.md` — Section/字段/样式修改链路
- [ ] **Step 9**: 编写 `assets/assets.md` — 组件(AUTO)/Hooks/CSS类

### Phase 3: 自进化引擎 (步骤 10-16)

- [ ] **Step 10**: 编写 `evolve/evolve.md` — 5 维度定义/运行方式/报告解读/审核清单
- [ ] **Step 11**: 编写 `scripts/inject-stack.mjs` — package.json → tech-stack 表
- [ ] **Step 12**: 编写 `scripts/inject-colors.mjs` — globals.css → color-palette 表
- [ ] **Step 13**: 编写 `scripts/inject-components.mjs` — components/ → 组件表
- [ ] **Step 14**: 编写 `scripts/inject-structure.mjs` — app/ → 目录树
- [ ] **Step 15**: 编写 `scripts/inject-css-classes.mjs` — globals.css → CSS 类列表
- [ ] **Step 16**: 编写 `scripts/evolve.mjs` — 主编排脚本 (调用 11-15)

### Phase 4: 验证 (步骤 17-18)

- [ ] **Step 17**: 运行 `node scripts/evolve.mjs` 验证所有 AUTO 区域正确填充
- [ ] **Step 18**: 逐文件检查完整性 — 每个 SKILL 都有 frontmatter/Overview/Failure Modes/Output

---

## 六、设计决策记录 (DDR)

| 决策 | 选择 | 理由 |
|------|------|------|
| 分层粒度 | 4 层 (L0/L1/L2/L3) | Claude Code 用 static/dynamic 两层; 我们加 L1 是因为硬约束必须始终存在 |
| L2 拆分粒度 | 6 个子模块 | 按"任务类型"而非"技术领域"拆分 — AI 判断"我在做什么"比"这属于哪门技术"更容易 |
| AUTO 标记格式 | HTML 注释 `<!-- AUTO-START:name -->` | 与 Markdown 兼容, 正则易匹配, 不影响渲染 |
| 脚本语言 | Node.js ESM (无依赖) | 项目已有 Node.js 环境, ESM 现代, 无依赖保证可移植 |
| 反模式追加 | MANUAL 标记 (非自动) | 反模式需要人工判断"这真的是个坑吗", 不能自动积累 |
| evolve 触发方式 | 手动运行脚本 | 不做 watch/file-watcher — 避免复杂度和意外行为 |
