---
name: "umg-portfolio"
description: "UMG Portfolio 项目的专属开发规范与设计品味。当在此项目中开发、修改组件、添加功能、调整样式、优化性能或进行代码审查时必须调用。涵盖视觉风格、代码模式、动画哲学、颜色系统和架构约定。"
---

# UMG Portfolio — 约束集 (Constraint Set)

> 本文件不是操作手册。它是**围栏**——定义你不能越界的范围。
> 围栏之内，你自己判断最优路径。
>
> **仓库根目录**: `html/` | **项目代码目录**: `html/portfolio/`

---

## 🔴 绝对禁区

碰了就炸。零容忍。

| # | 禁止行为 | 后果 |
|---|---------|------|
| 1 | **引入 `package.json` 中不存在的依赖** | 构建失败 / 产物膨胀 |
| 2 | **修改 `next.config.ts` 的 `output`/`basePath`/`distDir`** | GitHub Pages 部署 404 / 路由全崩 |
| 3 | **修改 `images: { unoptimized: true }`** | SSG 导出直接报错 |
| 4 | **删除 `package.json` 中已有的依赖** (Prisma/@react-three/postprocessing) | 别人的功能依赖它，你不知道谁在用 |
| 5 | **在 `.tsx` 文件中写注释** | 除非用户明确要求，否则删掉 |
| 6 | **把 `'use client'` 放在第 1 行以外** | Next.js 可能静默降级为 Server Component，所有 hook 报错 |
| 7 | **硬编码 `/content.json` 路径** | `fetch('/content.json')` 在 GitHub Pages (`/UMG_Home`) 上 404。必须检测 basePath |
| 8 | **在 ContentProvider 或数据加载中 `await` 再渲染** | 页面白屏直到 fetch 完成。必须先渲染默认值，后台异步更新 |
| 9 | **无防御地访问嵌套属性** | 见下方 🟠 反模式陷阱 |

---

## 🟡 身份边界

不会炸，但会破坏项目的设计一致性。越界 = 品味错误。

### 色彩 — 不准用的颜色

```
禁止作为页面背景: 任何 #0a0a0f 以外的色值
禁止作为主 CTA 按钮: 任何 #00d4aa 以外的色值
禁止作为渐变终点: #00d4aa 和 #00a8e8 以外的组合
禁止作为 section label: 任何 #00d4aa 以外的色值
禁止作为卡片默认边框: rgba(255,255,255,0.08) 以外的写法
```

**合法的调色板（仅此一份，不准扩展）：**

| 角色 | 色值 | 用在哪 |
|------|------|--------|
| 页面背景 | `#0a0a0f` | 所有 section 的 bg |
| 卡片背景 | `#13131a` | 数据卡片 / 项目卡片底色 |
| 边框区域 | `#1f1f2e` | 卡片 border |
| 主文字 | `#ffffff` | 标题 / 重要文本 |
| 次要文字 | `#8a8a8a` / `#a0a0a0` | 描述 / 列表 |
| 弱化文字 | `#6b7280` | 标签说明 |
| 主强调 | `#00d4aa` | CTA / label / hover 高亮 |
| 辅助蓝 | `#00a8e8` | HMI 项目 / 渐变终点 |
| 紫罗兰 | `#9d4edd` / `#9b59b6` | Niagara 项目 |
| 橙红系 | `#ff6b35` / `#e74c3c` / `#f39c12` | Design/Game/其他项目 |
| 品红 | `#ff006e` | 备用 |

### 圆角 — 不准超过的尺寸

| 元素 | 最大圆角 | 不准用 |
|------|---------|--------|
| 卡片 | `rounded-xl` / `rounded-2xl` | `rounded-3xl` 及以上 |
| 按钮 | `rounded-full` | — (这是上限本身) |
| 标签 | `rounded-full` / `rounded-lg` / `rounded-xl` | — |

### 动画 — 不准用的 easing

| 场景 | 禁止 | 必须/推荐 |
|------|------|----------|
| 交互动效 (hover/click/tilt) | `linear`, 默认 ease | `spring`(damping:10~15, stiffness:100~150), `ease-out`, `cubic-bezier(0.4,0,0.2,1)` |
| 入场动画 | 无限制但 duration > 1s | `whileInView` + `duration: 0.5~0.8` |
| 循环动画 | 无 `repeat: Infinity` | 必须有 |

### 排版 — 不准改的设定

```
字体: Inter (sans) + JetBrains Mono (mono) — 不准换
Hero 标题上限: text-[12rem] — 不准更大
Section 标题: text-5xl~text-8xl font-bold — 不准更小/更轻
Section Label: text-sm font-mono uppercase tracking-widest text-[#00d4aa] — 格式锁定
```

### 渐变 — 不准做的事

- ❌ 彩虹渐变（3 色以上）
- ❌ 高饱和度互补色搭配（红+绿、蓝+橙）
- ✅ 仅允许：单色透明度渐变、双色邻近色渐变（如 #00d4aa → #00a8e8）

---

## 🟠 反模式陷阱

每一条都来自实际踩过的坑。如果你这么写，后果如下：

### 陷阱 1: 直接访问可能为 undefined 的属性

```tsx
// ❌ 致命：data 可能为 undefined/null
const title = data.hero.title;
const company = content.about.currentCompany;

// ❌ 致命：数组可能为空或不够长
<ProjectCard {...projects[3]} />
<div>{stats[5].label}</div>

// ✅ 安全：带 fallback + 长度检查
const safeData = data || {};
const title = safeData.hero?.title ?? '';
const content = useContent();
const about = content?.about ?? defaultAbout;
{projects.length > 3 && <ProjectCard {...projects[3]} />}
```

**后果**: 开发环境不报错，生产环境白屏或渲染 `[object Object]`/undefined。

### 陷阱 2: 硬编码 fetch 路径

```tsx
// ❌ GitHub Pages 上 404
fetch('/content.json')

// ✅ basePath 感知
const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/UMG_Home') ? '/UMG_Home' : '';
fetch(`${basePath}/content.json`)
```

**后果**: 本地 dev 正常，部署后编辑器保存失败 / 内容加载失败。

### 陷阱 3: 阻塞式数据加载

```tsx
// ❌ 白屏等待
const [content, setContent] = useState(null);
useEffect(() => {
  fetch('/content.json').then(r => r.json()).then(setContent); // 没有 fallback
}, []);
if (!content) return <div>Loading...</div>; // 永远显示 loading 直到 fetch 完成

// ✅ 立即渲染 + 后台更新
const [content, setContent] = useState(defaultContent);
useEffect(() => { fetch(...).then(json => setContent(prev => ({...prev, ...json}))); }, []);
return <App data={content} />; // 立即显示默认内容
```

**后果**: 用户看到空白页面或 loading spinner，体验极差。

### 陷阱 4: 把整个 Section 写成一个 500+ 行组件

```tsx
// ❌ 一个文件包含 FeaturedCard + SideCard + BottomCard + Modal = 630 行
export default function Projects() { /* 630 行 */ }

// ✅ 拆分内联子组件（不需要独立文件，同文件内即可）
function FeaturedProjectCard({ ... }) { /* 120 行 */ }
function SideProjectCard({ ... }) { /* 80 行 */ }
function ProjectModal({ ... }) { /* 100 行 */ }
export default function Projects() { /* 230 行，只做布局编排 */ }
```

**后果**: 无法复用、diff 时噪音巨大、AI 下次修改时上下文爆炸。

### 陷阱 5: 用 CSS 变量名而非实际色值写内联样式

```tsx
// ❌ Tailwind v4 内联 style 不识别 CSS 变量
<div style={{ background: 'var(--accent-primary)' }}>

// ✅ 直接用色值
<div className="bg-[#00d4aa]">
<div style={{ background: '#00d4aa' }}>
```

**后果**: 样式不生效或渲染为空。

---

## 📦 事实基准

以下是不容置疑的事实。不做规定，只记录现状。

### 技术栈 (package.json 锁定)

| 技术 | 版本 | 角色 |
|------|------|------|
| Next.js | 16.2.2 | Framework (Turbopack) |
| React | 19.2.4 | UI |
| TypeScript | strict | Language |
| Tailwind CSS | v4 (@tailwindcss/postcss) | Styling |
| Framer Motion | ^12.38.0 | 主力动画库 |
| GSAP | ^3.14.2 | 辅助动画 |
| Three.js + R3F + Drei | latest | 3D (已安装) |
| @react-three/postprocessing | ^3.0.4 | 3D 后处理 (已安装，勿删) |
| Lucide React | ^1.7.0 | 图标 |
| Lenis | ^1.3.21 | 平滑滚动 |
| Prisma | ^7.6.0 | ORM (已安装预留，当前未使用) |

### 目录结构

```
portfolio/
├── app/
│   ├── config/content.ts          ← 6 个内容块导出 (hero/about/projects/skills/contact/footer)
│   ├── ContentProvider.tsx         ← Context + fetch(content.json) + localStorage 合并
│   ├── globals.css                ← CSS 变量 + @theme + 工具类 (.ue5-card 等)
│   ├── layout.tsx                 ← ContentProvider 包裹根节点
│   ├── page.tsx                   ← 组装 7 个 sections
│   ├── sections/                  ← Hero / About / Experience / Projects / Skills / Contact / Footer
│   ├── components/                ← ParticleField(活跃) / GlitchText / NeonCard / GlobalAnimatedBackground / ScrollIndicator / ProjectCard
│   ├── hooks/                     ← useMousePosition / useSmoothScroll
│   ├── edit/                      ← schema.tsx + DynamicForm.tsx + page.tsx (内容编辑器)
│   └── api/save-content/route.ts  ← POST → 写入 public/content.json
├── public/content.json            ← 运行时数据的单一事实来源
└── next.config.ts                 ← output:export, basePath:/UMG_Home, distDir:dist
```

### 内容数据流

```
content.ts (默认值)
    ↓ import fallback
Section 组件 (useContent() 或 direct import)
    ↑ 浅合并覆盖
content.json (fetch, 键名: heroContent/aboutContent/projectsContent/skillsContent/contactContent)
localStorage['portfolio-content'] (第二优先级)
    ↑ POST 写入
api/save-content → fs.writeFileSync('public/content.json')
    ↑ 表单提交
edit/page.tsx → DynamicForm(schema.tsx 定义字段)
```

**键映射:** edit 内部用短键 (`data.hero`) → 保存时映射为长键 (`heroContent`)。footer 无映射。

### 关键文件路径速查

| 你要做什么 | 去哪个文件 |
|-----------|-----------|
| 改页面文字内容 | `config/content.ts` (默认值) 或通过 `/edit` 页面在线编辑 |
| 加新的可编辑字段 | `config/content.ts` → `ContentProvider.tsx` → `edit/schema.tsx` → `edit/page.tsx` → Section 组件 |
| 改全局样式/CSS变量 | `globals.css` |
| 加新 Section | `sections/NewSection.tsx` + 注册到 `page.tsx` |
| 加新可复用组件 | `components/` |
| 改构建配置 | `next.config.ts` (⚠️ 参见 🔴 禁区 #2,#3) |
| 改 CI/CD | 仓库根目录 `.github/workflows/deploy.yml` (不在 portfolio/内) |

---

## ⚡ 动画自由度

以下是你**不能**做的。除此之外，自由发挥。

### 禁止

- ❌ 入场动画 duration > 1s（用户没耐心）
- ❌ 同时触发 5 个以上独立动画（性能杀手）
- ❌ 在非 Hero 区域使用 `useScroll` 视差（只有 Hero 需要）
- ❌ 用 `animate={{}}` 配合超复杂的多层嵌套 transform（维护噩梦）
- ❌ 循环动画无 `repeat: Infinity`（会停住）

### 已有的模式参考（不是模板，是风格锚点）

项目中实际存在的动画模式，保持风格一致即可：

| 模式 | 使用位置 | 核心特征 |
|------|---------|---------|
| variants + stagger | Hero 字母入场 | spring(d:12,s:100), rotateX:-90→0 |
| whileInView + isInView | 所有非 Hero section | once:true, margin:'-100px', opacity/y:0→1 |
| useScroll + useTransform | Hero 视差 | offset:['start start','end start'], y:0→50% |
| 鼠标跟随光晕 | Hero 背景 | spring(d:30,s:50), 600px blur-[120px] |
| 3D perspective tilt | Projects 卡片 | rotX/Y ±8°, translateZ(10px), 0.15s ease-out |
| 磁吸按钮 | Contact CTA | useSpring(d:15,s:150), offset * 0.4 |
| AnimatePresence | Modal 进退场 | opacity + scale + y, 0.3s |

---

## 🔧 修改链路

### 新增一个 Section

1. `sections/NewSection.tsx` — `'use client'` 第 1 行
2. `page.tsx` — import 并 `<NewSection />` 放入正确顺序
3. 如果需要内容数据：
   - `config/content.ts` 加导出
   - `ContentProvider.tsx` 加字段 + 合并逻辑
   - 选择 useContent() (支持编辑) 或 direct import (简单场景)

### 新增一个可编辑内容字段

1. `config/content.ts` — 在对应内容块中加字段
2. `ContentProvider.tsx` — interface + defaultContent + fetch 合并 + localStorage 合并（4 处）
3. `edit/schema.tsx` — 加 FieldSchema
4. `edit/page.tsx` — 注册到表单（如果需要 UI 编辑）
5. 对应 Section — 通过 `useContent()` 读取

### 修改样式

- 只在 `globals.css` 加 CSS 变量或工具类
- 组件内优先用 Tailwind inline class
- 内联 style 只用于动态值（如 `project.color`、鼠标坐标）

---

## 🎯 已有资产

别重复造轮子。先用这些。

### 可复用组件

| 组件 | 状态 | 功能 |
|------|------|------|
| `ParticleField` | ✅ 活跃 (Hero 使用) | Canvas 粒子场，鼠标排斥+连线，30~120 动态数量 |
| `GlitchText` | ⏸ 待集成 | 故障艺术文字动效 |
| `NeonCard` | ⏸ 待集成 | 霓虹发光卡片 |
| `GlobalAnimatedBackground` | ⏸ 待集成 | 全局动画背景 |
| `ProjectCard` | ⏸ 待集成 | 独立项目卡片 (Projects 已内联实现) |
| `ScrollIndicator` | ✅ 可用 | 滚动指示箭头 |

### 自定义 Hooks

| Hook | 返回值 | 用途 |
|------|--------|------|
| `useMousePosition()` | `{ x, y, normalizedX, normalizedY }` | 光晕跟随 + 粒子交互 |
| `useSmoothScroll()` | Lenis 实例 | 全局平滑滚动 |

### globals.css 工具类

`.ue5-card` / `.ue5-button` / `.ue5-button-outline` / `.ue5-tag` / `.gradient-text` / `.section-divider` / `.ue5-grid` / `.ue5-grid-animated` / `.project-card` / `.light-sweep` / `.glow-effect` / `.blueprint-node` / `.wireframe` / `.typing-cursor` / `.animate-fade-in` / `.ue5-progress` / `.particle-container` / `.ripple` / `.audio-bar` / `.crosshair` / `.network-node`

---

## 最后一条规则

> **先读再改，不准盲改。**
>
> 修改任何文件前，先读完该文件的完整内容。
> 修改任何组件前，先理解它的数据来源和父级上下文。
> 如果不确定，读现有 Section 的实现方式（Hero/About/Projects 三选一最完整），然后遵循同样的模式。
>
> 能 inline 就 inline，能复用就复用，能不新建文件就不建。
> 每一行代码都要有存在理由。
