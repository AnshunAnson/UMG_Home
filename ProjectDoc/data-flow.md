# data-flow

<!-- AUTO-START:data-flow -->
```
content.json (静态默认值)
    ↓ fetch() + localStorage merge
ContentProvider.tsx (React Context)
    ↓ useState(defaultContent) → useEffect(远程覆盖+本地存储合并)
    ↓
useContent() hook → 返回 EditedContent 对象
    ↓
Consumers (4):
    └─ ContentProvider()
  └─ About()
  └─ Hero()
  └─ Projects()
``

**数据结构**:
- **hero** — 定义于 config/content.ts, 类型见 edit/schema.tsx
- **about** — 定义于 config/content.ts, 类型见 edit/schema.tsx
- **projects** — 定义于 config/content.ts, 类型见 edit/schema.tsx
- **skills** — 定义于 config/content.ts, 类型见 edit/schema.tsx
- **contact** — 定义于 config/content.ts, 类型见 edit/schema.tsx
- **footer** — 定义于 config/content.ts, 类型见 edit/schema.tsx

**写入路径**:
- API: POST `api/save-content/route.ts` → 写入 public/content.json
- 客户端: ContentProvider fetch(`/content.json`) + localStorage 读写
- 编辑器: edit/page.tsx → DynamicForm → schema.tsx 验证 → save-content API
<!-- AUTO-END:data-flow -->
