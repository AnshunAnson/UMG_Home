# Patterns Discovered

> 从 decisions.log 和实际代码分析中提取的可复用模式。
> 由 inject-memory.mjs 自动整理和更新。

## Layout Patterns

- **Standard Section**: `bg-[#0a0a0f]` + grid background (60px) + blur orbs + container + label-title-content
  - Observed in 5/7 sections (all except Hero and Footer)
- **Card Hover Glow**: border-color transition 0.3s + internal radial-gradient on hover
  - Observed in all card components

## Data Access Pattern

- **Safe Content Access**: `const content = useContent(); const data = content?.key ?? defaultKey;`
- **Safe Array Access**: `{arr.length > N && <Component {...arr[N]} />}`

## Animation Entry Pattern (Non-Hero)

- **whileInView Standard**: `const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-100px' });`
- Used identically in 6/7 sections (all except Hero which uses variants+stagger)



## Decision Statistics (auto-generated)

Total Decisions: 3

### By Type:
- **post-task-auto**: 2 decisions
- **Initial Harness v4.1 setup**: 1 decisions

### By Module (Success Rate):
- **harness-setup**: 1/1 (100%)
- **post-task:visual**: 0/2 (0%)
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

<!-- MANUAL-START:patterns -->
<!-- Append manually discovered patterns here -->
<!-- MANUAL-END:patterns -->