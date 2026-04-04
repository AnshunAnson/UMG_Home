# Evolve Engine — 使用手册

## 运行方式

```bash
cd .trae/skills/umg-portfolio
node evolve/scripts/evolve.mjs
```

## 可用脚本

| 脚本 | 功能 | 何时运行 |
|------|------|---------|
| **`post-task.mjs`** | **任务后同步** (变更检测+决策推断+增量同步+反模式巡检) | **每次任务完成后** ✅核心 |
| `inject-taste.mjs` | 扫描代码库 → 推断品味配置 | 代码变更后 / 首次初始化 |
| `inject-memory.mjs` | 整理 decisions.log → 提取模式 | decisions.log 增长后 |
| **`inject-structure.mjs`** | **扫描代码库 → 生成项目架构快照 (7个fact文件)** | **首次初始化 / 架构变更后 / 定期** ✅架构感知 |
| `evolve.mjs` | 主编排 (taste + memory + structure 全量) | 定期运行 / CI 触发 |

## inject-taste.mjs 输出说明

扫描 portfolio/ 下所有 .tsx/.css 文件, 从 7 个维度推断开发者偏好:

1. **Color Preferences** — 色温分析、背景一致性、CTA 一致性、渐变合规性
2. **Animation Preferences** — 物理模型聚类、入场模式分布、交互风格
3. **Code Style Preferences** — 组件粒度、命名约定、注释密度、防御性编程强度
4. **Layout Preferences** — 间距标准、容器规范、网格使用、最大宽度

输出写入 `identity/taste-profile.md` 的 AUTO 标记区间。

## inject-memory.mjs 输出说明

读取 `memory/decisions.log`, 执行:

1. 按任务类型聚类决策
2. 提取高频成功模式
3. 检测是否有新的反模式信号
4. 更新 `memory/patterns-discovered.md`

## evolve.mjs 报告解读

```
=== Evolution Report ===
taste-profile:   ✓ updated (+42/-0 lines)    ← 有新发现
patterns:       ✓ updated (+3/-1 lines)     ← 新增模式
evolution-state: ✓ weight updates applied   ← 权重调整
---
Total: 2/3 modules changed, +45/-1 lines    ← 总体变化量
Session: #5 (decisions logged: 12)          ← 当前会话数
```

- `✓ updated` = 有内容变更
- `✗ no changes` = 无需更新 (代码未变)
- `+N/-M` = 新增 N 行, 删除 M 行

## Post-Task Sync (任务后同步)

### 是什么

`post-task.mjs` — 每次 AI 完成开发任务后的轻量级自动同步脚本。

与 `evolve.mjs` (全量深度进化) 的区别: post-task 是增量、快速、每次任务后都跑; evolve 是全量、深度、定期跑。

### 运行方式

```bash
node evolve/scripts/post-task.mjs
```

### 工作流程

```
1. 变更检测
   └─ 读取 evolution-state.md 的 Last Evolved 时间戳
   └─ 扫描 portfolio/ 下所有 .tsx/.css/.ts 文件的 mtime
   └─ 筛选 mtime > lastEvolved 的文件 → 变更列表
   └─ 若无变更 → 输出 "No changes detected" 并退出

2. 任务推断
   └─ 分析变更文件路径 → domain (visual/animation/data/architecture/style/config)
   └─ 统计文件数和总大小 → scope (single-file/multi-file/repo-wide)
   └─ 估算变更量 → uncertainty (low/medium/high)

3. 决策记录
   └─ 自动生成 decisions.log 条目 (标记为 post-task-auto)
   └─ 分配自增 ID (D-001, D-002, ...)

4. 增量品味同步
   └─ 全量重扫颜色统计 (比例需要全局数据)
   └─ 更新 taste-profile.md 的 AUTO 区域
   └─ 记录 Last Sync 时间戳

5. 记忆整理
   └─ 复用 inject-memory.mjs 逻辑
   └─ 更新 patterns-discovered.md
   └─ 清理重复统计块

6. 反模式巡检
   └─ 在变更文件中搜索 anti-patterns.md 中记录的模式
   └─ 匹配 unsafe property access / hardcoded fetch / blocking load / CSS var
   └─ 输出 ⚠️ 警告列表

7. 报告输出 + evolution-state 更新
```

### 输出示例

```
=== Post-Task Document Sync ===

Changed Files: 3
  📄 sections/Hero.tsx (8KB)
  📄 app/globals.css (2KB)
  📄 config/content.ts (1KB)

Inferred Task: visual | multi-file | uncertainty=medium
Decision Logged: D-003
Taste Sync: 44 colors, 71.2% cool (26 files)
Memory Sync: 3 decisions, 2 types
Anti-Pattern Check: clean ✓

---
Post-Task Sync Complete | D-003 | 3 files | 0 warnings
```

### Anti-Pattern 巡检规则

当前检测的反模式 (从 constraints/anti-patterns.md 提取):

| 模式 | 检测正则 | 陷阱编号 |
|------|---------|---------|
| unsafe property access | `\w+\.\w+\.\w+(?!\?)` | #1 |
| hardcoded fetch path | `fetch\s*\(\s*['"]\/content\.json['"]` | #2 |
| blocking loading | `useState(null)` + `if (!content)` | #3 |
| CSS variable in inline style | `var(--\w+-\w+)` | #5 |

发现匹配时输出 `⚠️` 警告, 但不阻止同步。由 AI 判断是否需要处理。

## 人工审核检查清单

每次 evolve 后建议确认:

- [ ] taste-profile 的色彩偏好与实际代码一致?
- [ ] animation preferences 的参数范围合理?
- [ ] patterns-discovered 中无重复或矛盾?
- [ ] evolution-state 的权重在合理范围内 (0.5~1.5)?
