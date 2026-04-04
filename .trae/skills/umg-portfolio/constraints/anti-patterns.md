# 🟠 反模式陷阱

每一条都来自实际踩过的坑。

## 陷阱 1: 直接访问可能为 undefined 的属性

```tsx
const title = data.hero.title;
const company = content.about.currentCompany;
<ProjectCard {...projects[3]} />
<div>{stats[5].label}</div>
```

**后果**: 开发环境不报错，生产环境白屏或渲染 `[object Object]`/undefined。

**正确做法**:
```tsx
const safeData = data || {};
const title = safeData.hero?.title ?? '';
const about = content?.about ?? defaultAbout;
{projects.length > 3 && <ProjectCard {...projects[3]} />}
```

## 陷阱 2: 硬编码 fetch 路径

```tsx
fetch('/content.json')
```

**后果**: 本地 dev 正常，部署后编辑器保存失败 / 内容加载失败。

**正确做法**: 通过 ContentProvider 或检测 basePath 前缀。

## 陷阱 3: 阻塞式数据加载

```tsx
const [content, setContent] = useState(null);
useEffect(() => {
  fetch('/content.json').then(r => r.json()).then(setContent);
}, []);
if (!content) return <div>Loading...</div>;
```

**后果**: 用户看到空白页面或 loading spinner，体验极差。

**正确做法**: 先渲染默认值 (`useState(defaultContent)`)，后台异步更新。

## 陷阱 4: 把整个 Section 写成一个 500+ 行组件

```tsx
export default function Projects() { /* 630 行 */ }
```

**后果**: 无法复用、diff 时噪音巨大、AI 下次修改时上下文爆炸。

**正确做法**: 拆分内联子组件（同文件内即可），主函数只做布局编排（<230 行）。

## 陷阱 5: 用 CSS 变量名而非实际色值写内联样式

```tsx
<div style={{ background: 'var(--accent-primary)' }}>
```

**后果**: Tailwind v4 内联 style 不识别 CSS 变量，样式不生效或渲染为空。

**正确做法**: 直接用色值 `bg-[#00d4aa]` 或 `style={{ background: '#00d4aa' }}`。

<!-- MANUAL-START:anti-patterns -->
<!-- 发现新反模式时追加到这里 -->
<!-- MANUAL-END:anti-patterns -->
