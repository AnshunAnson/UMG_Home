# 清理屎山 Round 1 — 设计文档

> generated_by: cleanup-round-1
> verified_at: 2026-05-10
> scope: portfolio/ 全量代码审计后确定的清理目标

## 审计结论：6 个屎山区域

### 🔴 P0: ContentProvider 空壳（伪数据层）

**现状**: [ContentProvider.tsx](app/ContentProvider.tsx) 声称有 3 级加载策略 (fetch → localStorage → fallback)，实际只有 `useState(defaultContent)` — 永远返回硬编码默认值。无 fetch、无 effect、无异步。

**影响**:
- `content.json` 运行时**无人读取**
- 所有 section 的 `useContent()` 等价于直接 import `config/content.ts`
- 每个 section 的 dual-import fallback (`const content = xxx || defaultXxxContent`) 是死分支
- Edit 页面保存到 content.json 但主页面从不消费

**清理方案**:
1. 删除 `ContentProvider.tsx` 中无意义的 Context/useState 包装
2. 改为直接 export 一个 content 对象 + `useContent()` hook 直接返回它
3. 删除所有 section 中的 `import { xxxContent as defaultXxxContent from '../config/content'` 冗余导入
4. 删除所有 section 中的 `|| defaultXxxContent` 死分支
5. **保留** ContentProvider 外壳（layout.tsx 包裹了它）和 useContent() hook 签名，避免波及 layout

**收敛效果**: 消除 6 处冗余 import + 6 处死分支 fallback；数据流从「伪 3 级」降为「单一直接读取」

---

### 🔴 P0: 死代码 — ParticleField + useMousePosition

**现状**:
- [ParticleField.tsx](app/components/ParticleField.tsx) — 245 行 Canvas 粒子动画系统，**零引用**
- [useMousePosition.ts](app/hooks/useMousePosition.ts) — 鼠标位置追踪 hook，**仅被 ParticleField 引用**

**清理方案**: 直接删除两个文件

**收敛效果**: -310 行死代码，-1 个 hook，-1 个组件

---

### 🟡 P1: 8 个未用 npm 依赖

| 依赖 | 大小估 | 引用？ |
|------|--------|------|
| `@gsap/react` | ~5KB | ❌ 无 import |
| `gsap` | ~40KB | ❌ 无 import |
| `@react-three/fiber` | ~200KB | ❌ 无 import |
| `@react-three/drei` | ~500KB | ❌ 无 import |
| `@react-three/postprocessing` | ~50KB | ❌ 无 import |
| `@types/three` | ~500KB | ❌ 无 import |
| `three` | ~800KB | ~2MB | ❌ 无 import |
| `prisma` | ~5MB | ❌ 无数据库 |

**清理方案**: `npm uninstall` 以上 8 个包

**收敛效果**: node_modules -~8MB，package.json -8 dependencies，lockfile 收缩

---

### 🟡 P1: save-ts API 反模式

**现状**: [save-ts/route.ts](app/api/save-ts/route.ts) 在运行时覆写源码文件 `app/config/content.ts`。

**风险**:
- 用户输入写入源码 = 架构反模式
- 编辑器保存时同时写 content.json + content.ts，耦合度 1.0
- 如果生成的 ts 有语法错误，整个项目编译崩溃

**清理方案**:
1. 删除 `/api/save-ts/route.ts`
2. 修改 edit/page.tsx 的 handleSave：移除 save-ts 并行请求，只保留 save-content
3. content.ts 回归为唯一手动维护的默认值源（git 版本化管理）

**收敛效果**: -1 API 路由 (~68 行)，消除「运行时写源码」危险模式，编辑器保存逻辑简化一半

---

### 🟢 P2: basePath 重复定义

**现状**:
- [next.config.ts:6](next.config.ts#L6): `basePath: process.env.NODE_ENV === 'production' ? '/UMG_Home' : ''`
- [Projects.tsx:10](app/sections/Projects.tsx#L10): `const basePath = process.env.NODE_ENV === 'production' ? '/UMG_Home' : '';`

**清理方案**: Projects.tsx 删除本地 basePath 常量，改为从 `process.env` 或统一 config 读取。最简方案：删除行内定义，改用 `''.startsWith('/UMG_Home')` 模式检测（与 AGENTS.md 规则一致）。

**收敛效果**: 消除重复的 env 条件判断

---

### 🟢 P2: AGENTS.md 虚假文档修正

**现状**: AGENTS.md 中多处描述与实际代码不符：

| AGENTS.md 声称 | 实际情况 |
|----------------|----------|
| ContentProvider 有 3 级加载 / FOUC 防御 | 只有 useState(defaultContent)，无 fetch |
| 组件列表含 GlitchText, NeonCard, ParticleBackground, ScrollIndicator, ProjectCard | 均不存在 |
| components/ 下 animations/, project-modal/ 目录 | 不存在 |
| 「Animations lib deleted / ProjectHoverContext missing after cleanup」 | 历史噪声，无关当前 |

**清理方案**: 重写 AGENTS.md 使其与代码一致

---

## 执行顺序（依赖拓扑）

```
P0: ContentProvider 空壳修复 ──→ 影响: 所有 6 个 section 文件
P0: 删除死代码 ────────────────→ 无依赖，可并行
P1: 卸载未用依赖 ──────────────→ 无依赖，可并行
P1: 删除 save-ts + 简化 edit ──→ 依赖: P0 完成后（避免冲突）
P2: basePath 去重 ─────────────→ 无依赖
P2: AGENTS.md 修正 ────────────→ 最后执行（汇总所有变更）
```

## 不在本次范围

- content.json 数据结构优化（属于功能变更，非清理）
- section 组件内部 UI/UX 改进（属于功能变更）
- TypeScript 类型收窄（如 ProjectItem 的 `any` 类型）— 属于质量改进但不在最小闭环
- 编辑器 UX 增强

## 验证标准

1. `npm run build` 零错误退出
2. `npm run lint` 零 warning
3. 主页面渲染正常（Hero → Projects → About → Skills → Contact → Footer）
4. 编辑器页面可打开、可编辑、可保存到 content.json
