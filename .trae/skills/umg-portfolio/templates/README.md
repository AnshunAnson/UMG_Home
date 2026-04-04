# Harness Template — 30 秒为新项目创建 Taste Harness

## 快速开始

```bash
# 1. 复制模板到你的项目 skill 目录
cp -r .trae/skills/umg-portfolio/templates/harness-template .trae/skills/my-project-harness

# 2. 进入新 harness 目录
cd .trae/skills/my-project-harness

# 3. 重命名 SKILL.md.template → SKILL.md
mv SKILL.md.template SKILL.md

# 4. 运行品味注入 (扫描你的代码库)
node evolve/scripts/inject-taste.mjs

# 5. 完成! 你的项目现在有自己的 Taste Harness 了
```

## 文件说明

| 文件 | 用途 | 需要修改? |
|------|------|---------|
| `SKILL.md` | Harness 入口 (Router) | ✅ 改 name/description |
| `identity/taste-profile.md` | 品味配置 | 🔄 inject-taste 自动填充 |
| `identity/evolution-state.md` | 进化状态 | 🔄 post-task/evolve 自动更新 |
| `constraints/hard-rules.md` | 绝对禁区 | ✅ 添加项目特定规则 |
| `constraints/identity-boundary.md` | 身份边界 | ❌ 已移除，设计规范委托给 ui-ux-pro-max |
| `constraints/anti-patterns.md` | 反模式陷阱 | 📝 手动追加 + post-task 巡检 |
| `knowledge/*.md` | 方法论参考 | 🔄 evolve 自动丰富 |
| `memory/*` | 记忆系统 | 🔄 post-task 自动积累 |
| `harness/*.md` | 运行时定义 | ❌ 通用, 不需改 |
| `evolve/*.md + scripts/*` | 进化引擎 | ❌ 通用, 不需改 |

## 可用脚本

| 脚本 | 功能 | 触发方式 |
|------|------|---------|
| **`post-task.mjs`** | **任务后同步** (变更检测→决策推断→增量同步→反模式巡检) | **每次任务完成后自动运行** ✅核心 |
| `inject-taste.mjs` | 扫描代码库 → 推断品味配置 | 初始化 / 大变更后 |
| `inject-memory.mjs` | 整理 decisions.log → 提取模式 | decisions.log 增长后 |
| `evolve.mjs` | 全量深度进化 (taste+memory) | 定期 / CI |

### Task Completion Protocol

Harness 的核心闭环机制。AI 完成每个开发任务后:

```
Step 1: 追加决策到 memory/decisions.log
Step 2: 运行 node evolve/scripts/post-task.mjs
Step 3: 检查报告中的 anti-pattern 警告
```

## 架构

```
Taste Harness (本目录)
├── 纯品味层 (identity/)     ← 从代码推断"开发者喜欢什么"
├── 纯约束层 (constraints/)   ← 定义"不能做什么"
├── 方法论层 (knowledge/)    ← "怎么做最好"的参考
├── 记忆层 (memory/)         ← "上次学到了什么"
└── 运行时层 (harness/)      ← 分类/路由/评估/进化

ProjectDoc (../project-doc/)
├── 技术栈 / 目录 / 组件       ← "这是什么项目"
├── 路径 / 数据流 / CSS 类      ← "东西在哪"
└── 构建配置 / 色彩实际值      ← "怎么构建"
```

## 与 ProjectDoc 配合使用

Harness 不包含任何项目事实。当 AI 需要了解项目结构时，它会自动查阅 ProjectDoc:

```
用户: "帮我加一个新的 Section"
  ↓
Harness: [L1 加载] taste-profile(风格) + hard-rules(约束)
  ↓ [L4 分类] type=feature, domain=architecture, scope=multi-file
  ↓ [L4 路由] 加载 modification-playbook + design-principles
  ↓ [L3 记忆] 注入 patterns-discovered (如有相关经验)
  ↓ [ProjectDoc] 查询 structure.md (目录) + file-reference.md (路径)
  ↓
AI: 完整上下文 → 执行任务
```

## 下一步

- 创建对应的 `../project-doc/` 目录和事实文件
- 在首次开发任务后运行 `evolve.mjs` 验证完整流程
- 根据实际使用体验调整 constraints/ 和 knowledge/
