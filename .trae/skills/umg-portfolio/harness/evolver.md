# Harness Evolver — 进化引擎规则

> 定义 Harness 如何自我改进。三级渐进复杂度。

## Level 1: Routing Evolution (权重更新)

**触发**: 每次 Evaluator 评分后自动执行
**目标**: 让常用且有效的模块获得更高权重

```
公式: new_weight = old_weight × (1 + (score - 0.9) × 0.05)
上限: 0.5 ≤ weight ≤ 1.5
```

示例:
- animation-patterns 连续 3 次 PASS (score avg 0.95) → weight: 1.00 → 1.025
- code-principles 一次 PARTIAL (score 0.70) → weight: 1.00 → 0.990

**效果**: 高质量模块在 Router 中被优先推荐; 低效模块逐渐降权。

## Level 2: Content Evolution (A/B 测试)

**触发**: 同一 task type 连续 3 次评分方差 > 0.15
**目标**: 找到更好的指导语表达方式

流程:
1. 检测到某类任务 (如 "feature+animation") 评分不稳定
2. 创建该模块 guidance 的 variant (标记 `[EXPERIMENT]`)
3. 后续同类任务随机使用 original 或 variant
4. 各累积 5 次评分后比较:
   - winner → 替换原版
   - loser → 归档到 failure-postmortems 作为 "废弃方案"

## Level 3: Genesis (新模块创建)

**触发**: ≥ 3 个相似的未分类任务出现在 decisions.log 中
**目标**: 自动发现新的知识领域

流程:
1. inject-memory.mjs 从 decisions.log 聚类发现模式
2. 写入 patterns-discovered.md 作为 proposal
3. 标记 `[PROPOSAL]` 等待确认
4. 人工审核后决定是否创建新 .md 文件

## Auto-Triggers (脚本调用时机)

| 文件变更 | 触发脚本 | 更新目标 |
|---------|---------|---------|
| portfolio/**/*.tsx 变更 | inject-taste.mjs | identity/taste-profile.md |
| portfolio/**/*.css 变更 | inject-taste.mjs | identity/taste-profile.md |
| memory/decisions.log 新增条目 | inject-memory.mjs | memory/patterns-discovered.md |

## Evolution Report 格式

每次 evolve.mjs 运行后输出:

```
=== UMG Portfolio Taste Harness Evolution ===
taste-profile:   ✓ updated (+N/-M lines)
patterns:       ✗ no changes
evolution-state: ✓ weight updates applied
---
Total: X/Y modules changed, +A/-B lines
Session: #N (decisions logged: D)
```
