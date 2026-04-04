---
name: "umg-portfolio"
description: "UMG Portfolio 项目专属约束与工作习惯。Actions: fix, feature, refactor, review, debug, edit, modify, update, add, create, change. Projects: portfolio, UMG_Home, personal site. Elements: Section, Component, ContentProvider, page, layout, animation, style, content. Topics: hard-rules, anti-patterns, taste-profile, modification-playbook, code-principles. 当用户在 portfolio 项目中开发时必须加载此 Skill 获取项目约束。"
allowed-tools: Bash(python3*), Read, Write, Edit
---

# UMG Portfolio Taste Harness v4.3

> 项目级硬约束 + 踩坑经验 + 操作 SOP。
>
> 项目事实 → **ProjectDoc** (`../../../ProjectDoc/`)
> 设计规范 → **ui-ux-pro-max** Skill
> 项目约束 + 经验 → **这里**

## When to Apply

此 Skill **必须**在以下情况加载：

- 用户提到 "portfolio"、"UMG_Home"、"我的网站"、"个人作品集"
- 用户要求修改 `app/sections/` 下的任何 Section 组件
- 用户要求修改 `app/components/` 下的任何组件
- 用户要求修改 `app/edit/` 下的编辑器相关代码
- 用户要求修改 `ContentProvider.tsx` 或数据流
- 用户要求修改 `page.tsx`、`layout.tsx`、`globals.css`
- 用户要求添加新 Section、新组件、新功能
- 用户要求修复 portfolio 项目中的 bug
- 用户要求重构 portfolio 项目代码
- 当前工作目录在 `portfolio/` 或其子目录

## Design Spec Delegation

> 详细的 UI/UX 设计规范（色彩系统、排版、间距、动画原则、组件样式指南）
> 由 **ui-ux-pro-max** Skill 提供。
>
> **本 Skill 仅定义：**
> - 项目级技术硬约束（hard-rules）— 碰了就炸
> - 本项目踩过的坑（anti-patterns）— 来自真实血泪
> - 项目特有的操作流程（modification-playbook）— SOP
> - 代码层面的设计哲学（code-principles）— 数据观 + 代码观
> - 具体参数参考（animation-patterns）— 本项目实际使用的值

## L1 硬约束 (完整版见 constraints/hard-rules.md)

1. 不引入 package.json 中不存在的依赖
2. 不修改 next.config.ts 的 output/basePath/distDir
3. 不修改 images: { unoptimized: true }
4. 不删除已有依赖 (Prisma/@react-three/postprocessing)
5. 不写注释 (除非用户要求)
6. 'use client' 在第 1 行
7. 不硬编码 `/content.json` 路径 (必须 basePath 感知)
8. 不阻塞渲染 (先渲染默认值, 后台异步更新)
9. 无防御地访问嵌套属性 (见 constraints/anti-patterns.md)

## 品味取值实例 (完整版见 identity/taste-profile.md)

- 背景: 总是 `#0a0a0f`
- CTA: 总是 `#00d4aa`
- 动画: spring 物理主导 (不用 linear)
- 圆角: 最大 rounded-2xl (不用 rounded-3xl+)
- 注释: 接近零密度 (~1%)
- 防御性编程: 中等强度 (20% safe access rate)

## 模块路由表

| 任务特征 | 加载模块 | 额外加载 |
|---------|----------|---------|
| 动画/motion/过渡/交互 | animation-patterns | — |
| 新建 Section | modification-playbook | ProjectDoc: structure.md |
| 修改内容/字段 | modification-playbook | ProjectDoc: data-flow.md |
| 复用/组件/hooks | code-principles | ProjectDoc: components.md |
| visual/style/design | animation-patterns | + ui-ux-pro-max |

## 维护工具

以下 Python 脚本用于维护 Skill 内容，在需要时执行：

### 更新品味参数

当需要重新扫描代码库更新 taste-profile 时：

```bash
python3 scripts/inject_taste.py
```

扫描代码库，检测：
- 色彩温度分布
- Spring 动画参数
- 圆角使用情况
- 注释密度
- 防御性编程率

### 更新项目文档

当项目结构发生变化时：

```bash
python3 scripts/inject_structure.py
```

生成/更新 `ProjectDoc/` 下的文件：
- structure.md — 目录树
- components.md — 组件清单
- tech-stack.md — 技术栈版本
- file-reference.md — 文件路径速查

### 记录决策

完成重要任务后，记录决策：

```bash
python3 scripts/post_task.py --task "任务描述" --decision "决策内容" --outcome success
```

查看决策统计：

```bash
python3 scripts/post_task.py --stats
```

## Task Completion Protocol

任务完成后：

1. **追加决策记录** — 在 `memory/decisions.log` 末尾追加一条 JSONL
2. **检查反模式** — 确认无 anti-patterns 警告
3. **必要时更新文档** — 运行上述 Python 脚本

## 最后一条规则

> **先读再改，不准盲改。**
>
> 能 inline 就 inline，能复用就复用，能不新建文件就不建。
> 每一行代码都要有存在理由。
