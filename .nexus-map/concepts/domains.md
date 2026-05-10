> generated_by: nexus-mapper v2
> verified_at: 2026-05-10
> provenance: AST-backed for TypeScript/TSX/JavaScript; domain concepts inferred from code structure and naming

# 核心领域概念

## 1. Content（内容）

**定义**：作品集网站的所有可编辑文本和配置数据，包括英雄区标题、关于我描述、项目列表、技能标签和联系方式。

**核心实体**：
- `heroContent` — 英雄区内容（名称、高亮长度、副标题）
- `aboutContent` — 关于我内容
- `projectsContent` — 项目列表（数组，每项含标题、描述、图片、链接）
- `skillsContent` — 技能标签列表
- `contactContent` — 联系方式
- `footerContent` — 页脚内容

**数据生命周期**：
1. 默认值定义在 `config/content.ts`
2. 类型约束在 `types/content.ts`
3. 运行时通过 `ContentProvider` 分发
4. 编辑器修改后通过 API 写入 `content.json`
5. 下次加载时 ContentProvider 从 `content.json` 读取

## 2. FOUC Defense（内容闪烁防御）

**定义**：防止页面加载时出现内容空白或闪烁的策略。ContentProvider 立即渲染 config/content 的默认值，后台静默从 content.json 更新，从不阻塞渲染。

**实现机制**：
- Sections 同时 import `useContent()` 和 `config/content`
- `const heroData = hero || defaultHeroContent` — 运行时数据为空时回退到默认值
- ContentProvider 使用 `setContent(prev => ...)` 静默更新，不使用 loading 状态

## 3. basePath Awareness（基础路径感知）

**定义**：由于部署在 GitHub Pages 子目录 `/UMG_Home/`，所有资源路径和 API 请求必须感知 basePath。

**关键约束**：
- `next.config.ts` 中 `basePath: '/UMG_Home'`
- fetch URL 必须检测 `window.location.pathname.startsWith('/UMG_Home')`
- 静态导出模式 `output: 'export'` 要求 `images: { unoptimized: true }`

## 4. Safe Data Access（安全数据访问）

**定义**：防御性数据访问模式，确保在数据未加载或结构不完整时不会崩溃。

**三种模式**：
1. **默认值解构**：`const { title = '', subtitle = '' } = useContent().hero`
2. **数组边界检查**：`projects.length > 3 && <div>{projects[3]}</div>`
3. **安全数据守卫**：`const safeData = data || {}`（DynamicForm 模式）

## 5. Edit-Save Pipeline（编辑保存管线）

**定义**：从编辑器表单到持久化存储的完整数据流。

**流程**：
1. 编辑器从 `config/content` 加载 initialData
2. 用户通过 DynamicForm 修改数据
3. handleSave 将短键映射为长键（`data.hero` → `heroContent`）
4. POST `/api/save-content` 写入 `content.json`
5. POST `/api/save-ts` 生成 TypeScript 类型文件
6. 同时写入 localStorage 作为本地覆盖
