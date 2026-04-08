# 去掉求职意向模块 + 修复 edit 不可编辑内容

## Part 1: 去掉求职意向

### UI 层删除

| 文件 | 操作 |
|------|------|
| About.tsx L311-338 | 删除硬编码"求职意向"卡片（UMG重构、11-22K、location） |
| Contact.tsx L324-340 | 删除求职意向标签块（jobTitle、salary、location） |
| Hero.tsx | 保留 stats 渲染，仅从数据层移除第三个项 |

### 数据层清理

| 文件 | 操作 |
|------|------|
| content.ts | 删除 `heroContent.stats[2]`（🎯团队前期建设）；删除 `contactContent.jobTitle` 和 `contactContent.salary` |
| content.json | 同步删除对应字段 |
| types/content.ts | 从 `ContactContent` 接口删除 `jobTitle` 和 `salary` |
| schema.tsx | 从 Contact schema 删除 `jobTitle` 和 `salary`；更新 Hero stats description |

---

## Part 2: 修复 edit 不可编辑的内容

### 问题 1: Footer 完全无法编辑（schema 缺失）

`allSchemas` 中没有 footer 条目，edit 页面没有 Footer 编辑入口。

**修复**：在 `schema.tsx` 的 `allSchemas` 中添加 footer schema，包含：
- logo / logoHighlight / tagline
- navLinks（数组，label + href）
- socialLinks（数组，icon + href + label）
- copyright

### 问题 2: Skills / Contact / Footer 未接入 useContent()

这三个组件直接 `import { xxxContent } from '../config/content'`，绕过了 ContentProvider，导致 edit 保存后前端不刷新。

**修复**：
- Skills.tsx — 改为 `useContent()` 获取数据
- Contact.tsx — 改为 `useContent()` 获取数据
- Footer.tsx — 改为 `useContent()` 获取数据

### 问题 3: About 的 coreSkills 有数据但未渲染

schema 中定义了 `coreSkills`，content 配置中也有 4 条数据，但 About 组件完全没有渲染。

**修复**：在 About.tsx 中添加 coreSkills 渲染区域。

---

## 执行步骤

1. About.tsx — 删除求职意向卡片 + 添加 coreSkills 渲染
2. Contact.tsx — 删除求职意向标签块 + 改用 useContent()
3. Skills.tsx — 改用 useContent()
4. Footer.tsx — 改用 useContent()
5. content.ts — 删除 stats[2]、jobTitle、salary
6. content.json — 同步删除
7. types/content.ts — 删除 ContactContent 的 jobTitle、salary
8. schema.tsx — 删除 Contact 的 jobTitle/salary + 添加 Footer schema + 更新 Hero stats description
9. edit/page.tsx — 在 initialData 中添加 footer 字段
10. 验证 — 刷新页面确认无报错
