# Result Evaluator — 6-Dimension Scorecard

> 任务完成后评估结果质量。量化评分驱动 Evolver 进化。

## 6 Dimensions

| Dimension | Weight | 衡量什么 | 评分指南 |
|-----------|--------|---------|---------|
| correctness | 25% | 能否正常工作? | 1.0=无 bug, 0.5=小问题, 0.0=无法运行 |
| completeness | 20% | 是否完整? | 1.0=全部需求满足, 0.5=部分完成 |
| quality | 20% | 代码质量? | 是否符合 constraints/taste-profile/code-principles? |
| robustness | 15% | 鲁棒性? | 边界情况处理? 防御性编程? |
| clarity | 10% | 可读性? | 其他 AI/人类能否读懂? |
| verifiability | 10% | 可验证性? | 可测试? 可 review? |

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

## Scoring Thresholds

| 等级 | 条件 | 后续动作 |
|------|------|---------|
| **PASS** | final ≥ 0.85, objective ≥ 0.9, 且无维度 < 0.7 | 记录 decisions.log, 更新 patterns (如有新模式) |
| **PARTIAL** | final ≥ 0.65, 或 objective < 0.9, 或有维度 < 0.7 | 记录 decisions.log (含 gap 说明), 建议修复 |
| **FAIL** | final < 0.65, 或 objective < 0.6, 或任何 HR check fail | 创建 failure-postmortem 条目, **不建议 commit** |

## Quick Check List (评估前自查)

- [ ] 'use client' 在第 1 行?
- [ ] 无硬编码路径?
- [ ] 数组访问有长度检查?
- [ ] 异步数据不阻塞渲染?
- [ ] 符合色彩/圆角/动画身份边界?
- [ ] 无注释 (除非用户要求)?
- [ ] 可从 ProjectDoc 找到引用的所有事实?
