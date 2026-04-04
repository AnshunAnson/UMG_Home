# Module Router

> 根据 Classifier 的 6 轴分类结果, 决定加载哪些 L2 模块。

## Routing Rules

### Rule Set A: Domain-Based (Primary — 主要依据)

| domain | 加载模块 (L2) | ProjectDoc 补充查询 |
|--------|-------------|---------------------|
| visual | code-principles | styles.md, css-classes.md |
| animation | animation-patterns | — |
| data | modification-playbook | data-flow.md, file-reference.md |
| architecture | modification-playbook + code-principles | structure.md, tech-stack.md |
| style | code-principles | css-classes.md, styles.md |
| config | modification-playbook | build-config.md, file-reference.md |

### Rule Set B: Type-Based (Secondary — 补充触发)

| type | 额外加载 |
|------|----------|
| refactor | + constraints/anti-patterns (重构时必看反模式) |
| feature | + modification-playbook (新功能参考操作手册) |
| review | + constraints/anti-patterns + design-principles (审查时看约束和原则) |
| debug | + design-principles (排查时理解设计意图) |

### Rule Set C: Uncertainty-Based (Tertiary — 安全增强)

| uncertainty | 额外动作 |
|-------------|---------|
| high | + memory/patterns-discovered (从历史经验学习) |
| high | 建议 ensemble 模式 (考虑两种方案并行) |

### Rule Set D: Blast Radius (Safety — 保护机制)

| blast_radius | 额外动作 |
|-------------|---------|
| system | + constraints/hard-rules (额外谨慎) |
| system | + memory/failure-postmortems (避免已知陷阱) |
| repo-wide | 全部 L2 模块 + memory/* (最大保护) |

## Router Decision Flow

```
1. 从 Classifier 获取 6 维分类结果
2. 按 Domain → 选择 L2 主模块
3. 按 Type → 追加补充模块
4. 按 Uncertainty → 是否注入记忆
5. 按 Blast Radius → 是否加强安全
6. 始终加载: identity/taste-profile + constraints/*
7. 输出: 最终模块列表 + ProjectDoc 查询列表
```
