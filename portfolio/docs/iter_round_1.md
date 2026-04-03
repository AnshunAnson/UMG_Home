# Round 1 迭代设计文档

> 轮次: 1 | 日期: 2026-04-04 | 状态: 设计完成，待执行
> 分析方法: 4-Agent 并行分析 (冗余/耦合/错误风险/配置膨胀)

---

## 一、当前系统核心问题诊断

### 1.1 冗余问题 (Redundancy)

| 类别 | 文件/模块 | 删除理由 | 风险等级 |
|------|-----------|----------|----------|
| **死代码-3D场景** | `app/components/3d-scenes/` 全部13个文件 | 无任何组件import这些场景，仅ParticleField被Hero使用(在components根目录) | 低 |
| **死代码-编辑器** | `app/edit/` 整个目录 (page.tsx, schema.ts, components/) | 静态导出站点不需要运行时编辑功能；ContentProvider已覆盖其用途 | 低 |
| **死代码-项目详情页** | `app/projects/` 整个目录 (page.tsx, components/) | 主页Projects section已包含完整项目展示，独立详情页功能重复 | 低 |
| **死代码-数据库** | `prisma/schema.prisma`, `prisma.config.ts` | output:'export' 模式下无后端，Prisma完全无用 | 低 |
| **未使用组件** | `app/components/GlobalVignette.tsx` | 0引用计数 | 低 |
| **未使用Hook** | `hooks/useAnimateInView.ts` | 0引用计数 | 低 |
| **未使用Hook** | `hooks/useScrollAnimation.ts` | 0引用计数 | 低 |
| **未使用工具库** | `lib/animations.ts` | 0引用计数 | 低 |
| **未使用工具** | `utils/contentManager.ts` | 0引用计数 | 低 |
| **未使用Context** | `context/ProjectHoverContext.tsx` | layout.tsx中导入但无消费者 | 低 |
| **空文件** | `CLAUDE.md` | 0字节空文件 | 无 |

### 1.2 耦合问题 (Coupling)

| 耦合点 | 描述 | 收敛方案 |
|--------|------|----------|
| ContentProvider → content.ts → sections硬编码数据 | ContentProvider提供content但Skills/Contact等组件内部又硬编码了数据 | 统一从content.ts读取，删除组件内硬编码 |
| layout.tsx 引入 ProjectHoverContext | Context被声明但从未消费 | 删除Context及其provider包装 |
| content.ts 单文件318行 | 所有内容配置堆积在一个文件 | 本轮暂不拆分（保持最小闭环） |

### 1.3 错误风险 (Error Risks)

| 风险点 | 文件:行号 | 触发条件 | 修复方案 |
|--------|-----------|----------|----------|
| **数组越界** | Projects.tsx:68,82,107 | projects数组<4项时访问[0],[1-3],[3] | 添加length守卫 + 可选渲染 |
| **硬编码冲突** | Skills.tsx:8-15 skillsData | 与content.ts的skillsContent数据源不一致 | 删除skillsData硬编码，统一用content |
| **硬编码冲突** | Contact.tsx:247 socialLinks | 与content.ts的contactContent数据源不一致 | 从content读取或保持静态(联系信息变化少) |
| **SSR window访问** | GlitchText, GlobalVignette | 服务端渲染时window未定义 | 已有dynamic import保护，本轮不处理 |

### 1.4 配置膨胀 (Config Bloat)

| 项目 | 当前状态 | 收敛动作 |
|------|----------|----------|
| @react-three/postprocessing | ~2.1MB, 未使用 | 从package.json移除 |
| prisma | ~6.5MB, 未使用 | 从package.json移除 |
| public/*.svg (5个) | Next.js默认图标，未使用 | 删除file.svg, globe.svg, window.svg |
| AGENTS.md | AI配置文件，生产无需保留 | 保留(开发辅助) |

---

## 二、本轮删减 & 收敛策略

### 策略原则
1. **删除优先于新增**: 只删不改加
2. **收敛优先于扩展**: 减少文件数、依赖数、代码行数
3. **保最小闭环**: 确保主页 `/` 完整可展示

### 执行优先级

#### P0 - 必须删除（死代码，零风险）
```
删除清单:
├── app/components/3d-scenes/          # 13个文件，全部死代码
│   ├── index.ts
│   ├── SceneContainer.tsx
│   ├── BlueprintScene.tsx
│   ├── Car3DScene.tsx
│   ├── Car3DSceneV2.tsx
│   ├── CarRenderScene.tsx
│   ├── Design3DScene.tsx
│   ├── Particle3DScene.tsx
│   ├── Particle3DSceneV2.tsx
│   ├── ParticleEffectScene.tsx
│   ├── UI3DScene.tsx
│   ├── UIMaterialScene.tsx
│   ├── UMGScene.tsx
│   └── Weapon3DScene.tsx
├── app/edit/                          # 整个编辑器目录
│   ├── page.tsx
│   ├── schema.ts
│   └── components/
│       └── DynamicForm.tsx
│       └── FormFields/ (5个文件)
├── app/projects/                      # 项目详情页
│   ├── page.tsx
│   └── components/ (3个文件)
├── prisma/                            # 数据库相关
│   ├── schema.prisma
│   └── (prisma.config.ts 在根目录)
├── app/components/GlobalVignette.tsx  # 未使用组件
├── app/hooks/useAnimateInView.ts      # 未使用hook
├── app/hooks/useScrollAnimation.ts    # 未使用hook
├── app/lib/animations.ts              # 未使用工具库
├── app/utils/contentManager.ts        # 未使用工具
├── app/context/ProjectHoverContext.tsx # 未使用context
├── CLAUDE.md                          # 空文件
└── public/{file,globe,window}.svg     # 未使用的默认图标
```

#### P1 - 必须修复（错误风险）
```
修复清单:
├── Projects.tsx  - 数组越界保护 (projects[0], projects.slice(1,3), projects[3])
├── Skills.tsx    - 删除硬编码skillsData，改用content.ts数据
└── layout.tsx    - 移除 ProjectHoverContext Provider 包装
```

#### P2 - 依赖清理
```
清理清单:
├── package.json  - 移除 prisma, @react-three/postprocessing
└── 重新 npm install
```

---

## 三、保留的最小闭环定义

### 核心页面路由
| 路由 | 功能 | 状态 |
|------|------|------|
| `/` | 主页 (全部section) | ✅ 保留 |
| `/edit` | 编辑器 | ❌ 删除（P0） |
| `/projects` | 项目详情 | ❌ 删除（P0） |

### 保留的文件结构（迭代后目标）
```
portfolio/
├── app/
│   ├── page.tsx                    # 主页入口
│   ├── layout.tsx                  # 布局（精简）
│   ├── ContentProvider.tsx         # 内容上下文
│   ├── globals.css                 # 全局样式
│   ├── favicon.ico                 # 图标
│   ├── config/
│   │   └── content.ts              # 内容配置（唯一数据源）
│   ├── sections/                   # 6个section组件
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx            # (修复越界)
│   │   ├── Skills.tsx              # (去硬编码)
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── components/                 # 精简后的组件
│   │   ├── ParticleField.tsx       # 唯一3D组件
│   │   ├── GlitchText.tsx
│   │   ├── NeonCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ScrollIndicator.tsx
│   │   ├── ParticleBackground.tsx
│   │   └── GlobalAnimatedBackground.tsx
│   └── hooks/
│       └── useSmoothScroll.ts      # 唯一使用的hook
│       └── useMousePosition.ts     # Hero使用
├── public/
│   └── next.svg                    # 保留(可能被Next.js内部引用)
│   └── vercel.svg                  # 保留
├── package.json                    # (精简依赖)
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

---

## 四、预期效果指标

| 指标 | 迭代前 | 迭代后(Round 1) | 变化 |
|------|--------|-----------------|------|
| 源码文件数 | ~55+ | ~25 | **-55%** |
| 总代码行数 | ~8000+ | ~4000 | **-50%** |
| npm依赖包 | 16 | ~14 | **-2** |
| node_modules体积 | ~250MB | ~240MB | **-10MB** |
| 运行时错误数 | 3 | 0 | **-100%** |
| 死代码文件 | 25+ | 0 | **全清除** |

---

## 五、执行检查清单

- [ ] P0: 删除 3d-scenes/ 目录 (13文件)
- [ ] P0: 删除 edit/ 目录 (8文件)
- [ ] P0: 删除 projects/ 目录 (4文件)
- [ ] P0: 删除 prisma/ 目录 (1文件)
- [ ] P0: 删除 GlobalVignette.tsx
- [ ] P0: 删除 useAnimateInView.ts
- [ ] P0: 删除 useScrollAnimation.ts
- [ ] P0: 删除 animations.ts
- [ ] P0: 删除 contentManager.ts
- [ ] P0: 删除 ProjectHoverContext.tsx
- [ ] P0: 删除 CLAUDE.md
- [ ] P0: 删除 3个无用SVG
- [ ] P0: 删除 prisma.config.ts
- [ ] P1: 修复 Projects.tsx 数组越界
- [ ] P1: 修复 Skills.tsx 硬编码
- [ ] P1: 精简 layout.tsx
- [ ] P2: 清理 package.json 依赖
- [ ] P2: 重新 npm install
- [ ] 验证: 主页 / 正常渲染
