# Modification Playbook — 操作方法论

## 新增一个 Section

1. `sections/NewSection.tsx` — `'use client'` 第 1 行
2. `page.tsx` — import 并 `<NewSection />` 放入正确顺序
3. 如果需要内容数据:
   - `config/content.ts` 加导出
   - `ContentProvider.tsx` 加字段 + 合并逻辑 (interface / defaultContent / fetch / localStorage = 4 处)
   - 选择 `useContent()` (支持编辑) 或 direct import (简单场景)

## 新增一个可编辑内容字段

1. `config/content.ts` — 在对应内容块中加字段
2. `ContentProvider.tsx` — interface + defaultContent + fetch 合并 + localStorage 合并（4 处）
3. `edit/schema.tsx` — 加 FieldSchema
4. `edit/page.tsx` — 注册到表单（如需 UI 编辑）
5. 对应 Section — 通过 `useContent()` 读取新字段

## 修改样式

- 只在 `globals.css` 加 CSS 变量或工具类
- 组件内优先用 Tailwind inline class
- 内联 style 只用于动态值（如 project.color、鼠标坐标）

## 新建可复用组件

1. 先检查 `components/` 是否已有类似组件（见 ProjectDoc: components.md）
2. 如果已有活跃组件 → 复用或扩展
3. 如果有待集成组件 → 检查是否可直接使用
4. 如果确实需要新建:
   - 放在 `components/` 目录
   - `'use client'` 第 1 行
   - 保持与现有组件一致的命名和结构风格
