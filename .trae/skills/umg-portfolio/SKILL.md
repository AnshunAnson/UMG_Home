---
name: "umg-portfolio"
description: "项目级硬约束 + 踩坑经验 + 操作 SOP + 进化引擎。设计规范委托给 ui-ux-pro-max。当在此项目中开发时自动触发。不包含项目事实(见ProjectDoc), 纯粹定义'这个项目的不可触碰红线和工作习惯'。"
---

# UMG Portfolio Taste Harness v4.2

> 不是 Skill 文档, 不是项目说明书。是 **Taste Harness** — 开发者的数字工作风格指纹。
>
> 项目事实 → **ProjectDoc** (`../../../ProjectDoc/`)
> 设计规范 → **ui-ux-pro-max** Skill (色彩/排版/间距/动画原则/组件样式)
> 项目约束 + 经验 + 习惯 → **这里**
>
> **仓库根目录**: `html/` | **项目代码目录**: `html/portfolio/` | **ProjectDoc**: `../../../ProjectDoc/`

## Design Spec Delegation

> 详细的 UI/UX 设计规范（色彩系统、排版、间距、动画设计原则、组件样式指南）
> 由 **ui-ux-pro-max** Skill 提供。
>
> **本 Skill 仅定义：**
> - 项目级技术硬约束（hard-rules）— 碰了就炸
> - 本项目踩过的坑（anti-patterns + postmortems）— 来自真实血泪
> - 项目特有的操作流程（modification-playbook）— SOP
> - 代码层面的设计哲学（code-principles）— 数据观 + 代码观
> - 具体参数参考（animation-patterns）— 本项目实际使用的值

## Pipeline

`用户任务 → [L1 硬约束] → [L4 分类] → [L4 路由] → [L2 方法论] → [L3 记忆] → [ProjectDoc 事实查询] → 执行 → [L4 评估] → [L4 进化]`

## ProjectDoc Integration (架构感知)

> **修改代码前必须加载的上下文。不是可选参考，是防止盲改的安全网。**

当需要项目事实时, AI 应读取 `../../../ProjectDoc/` 下的对应文件:

| 需求 | 文件 | 关键信息 |
|------|------|---------|
| 技术栈/版本 | `tech-stack.md` | Next.js 16 / React 19 / FM 12 / Tailwind v4 / Three.js |
| 目录结构 | `structure.md` | 完整目录树 |
| 组件列表+依赖 | `components.md` | **25个组件**: 名称/路径/行数/client? |
| 文件路径速查 | `file-reference.md` | 核心10文件 + 7 Sections + 7 Components |
| CSS 类库 | `css-classes.md` | :root 变量 + @theme inline + 字体 |
| 数据流图 | `data-flow.md` | ContentProvider→useContent→各Section |
| 构建配置 | `build-config.md` | output=export / basePath=/UMG_Home |

### 架构感知路由 (何时加载哪些 fact)

| 任务特征 | 必须加载的 ProjectDoc | 原因 |
|---------|---------------------|------|
| 新建 Section | structure.md + file-reference.md + components.md | 知道放哪、复用什么、import 路径 |
| 修改组件样式 | components.md + css-classes.md (+ ui-ux-pro-max) | 知道组件边界、可用CSS变量 |
| 改数据结构/字段 | data-flow.md + tech-stack.md | 知道数据流全链路、不破坏类型 |
| 修 layout/page | file-reference.md + build-config.md | basePath 感知、output=export 限制 |
| 加新依赖 | tech-stack.md + build-config.md | 不重复、不破坏静态导出 |
| 动画相关改动 | components.md (+ ui-ux-pro-max) | 定位所有动画入口点 |
| **domain=architecture** | **全部 7 个文件** | **架构变更影响全局** |

### 快速命令

```bash
# 任务后同步 (增量)
node evolve/scripts/post-task.mjs

# 完整进化 (全量)
node evolve/scripts/evolve.mjs
```

## 6 轴任务分类 (Classifier)

| 轴 | 值 | 示例 |
|----|-----|------|
| type | fix / feature / refactor / review / debug / test / deploy | "修复登录bug"=fix |
| uncertainty | low(有参照) / medium(多方案) / high(需探索) | "改个颜色"=low |
| scope | single-file / multi-file / repo-wide | "改按钮样式"=single-file |
| domain | visual / animation / data / architecture / style / config | "加粒子背景"=animation |
| blast_radius | component / section / system | "改 Hero"=section |
| verifiability | easy / medium | hard | "加 console.log"=easy |

## 模块路由表 (Router)

| 任务特征 | 加载模块 (L2) | 额外加载 |
|---------|-------------|---------|
| 含 色/css/ui/style/design | animation-patterns | + ui-ux-pro-max + ProjectDoc: css-classes.md |
| 含 动画/motion/过渡/交互/动效 | animation-patterns | + ui-ux-pro-max |
| 含 新建/添加/new/新增 section | modification-playbook | + ProjectDoc: structure.md, file-reference.md |
| 含 修改/改内容/edit/编辑字段 | modification-playbook | + ProjectDoc: data-flow.md |
| 含 复用/组件/已有/hooks | code-principles | + ProjectDoc: components.md, hooks.md |
| uncertainty=high | + patterns-discovered (memory) | — |
| blast_radius=system | + hard-rules (extra caution) | — |
| **任何任务** | **始终加载**: identity/taste-profile + constraints/* | — |

## L1 始终加载摘要

### 硬约束核心 (完整版见 constraints/hard-rules.md)

1. 不引入 package.json 中不存在的依赖
2. 不修改 next.config.ts 的 output/basePath/distDir
3. 不修改 images: { unoptimized: true }
4. 不删除已有依赖 (Prisma/@react-three/postprocessing)
5. 不写注释 (除非用户要求)
6. 'use client' 在第 1 行
7. 不硬编码 `/content.json` 路径 (必须 basePath 感知)
8. 不阻塞渲染 (先渲染默认值, 后台异步更新)
9. 无防御地访问嵌套属性 (见 constraints/anti-patterns.md)

### 品味取值实例 (完整版见 identity/taste-profile.md)

> 以下值是本项目在 ui-ux-pro-max 设计规范上的**具体实例化**。
> 设计原则本身 → ui-ux-pro-max；这里的值是本项目的选择。

- 背景: 总是 `#0a0a0f`
- CTA: 总是 `#00d4aa`
- 动画: spring 物理主导 (不用 linear)
- 圆角: 最大 rounded-2xl (不用 rounded-3xl+)
- 注释: 接近零密度 (~1%)
- 防御性编程: 中等强度 (20% safe access rate)

## Task Completion Protocol (任务完成协议)

> **每次任务完成后必须执行的标准动作。不是可选的，是 Harness 闭环的一部分。**

```
任务执行完毕
  ↓
Step 1: 追加决策记录
  → 在 memory/decisions.log 末尾追加一条 JSONL:
    {"ts":"ISO时间","task":"简述","decision":"做了什么决策","reason":"为什么","outcome":"success/partial/fail","module":"涉及模块"}
  ↓
Step 2: 运行 post-task 同步
  → node evolve/scripts/post-task.mjs
  → 自动检测变更文件 → 推断任务类型 → 增量更新品味/记忆 → 反模式巡检
  ↓
Step 3: 检查报告
  → 确认无 ⚠️ anti-pattern 警告
  → 如有警告, 评估是否需要追加到 constraints/anti-patterns.md
  ↓
任务真正结束 ✓
```

**与 evolve.mjs 的区别:**

| | `post-task.mjs` | `evolve.mjs` |
|---|---|---|
| **触发时机** | 每次任务结束后 | 定期 / 重大变更后 |
| **扫描范围** | 增量 (仅变更文件) | 全量 (全部文件) |
| **决策日志** | 自动推断 + 追加 | 不生成 (依赖已有) |
| **反模式巡检** | ✅ 仅检查变更文件 | ❌ 不检查 |
| **耗时** | < 0.5s | ~ 1-2s |

## 最后一条规则

> **先读再改，不准盲改。**
>
> 能 inline 就 inline，能复用就复用，能不新建文件就不建。
> 每一行代码都要有存在理由。
