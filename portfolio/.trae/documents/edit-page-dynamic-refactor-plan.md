# Edit页面动态重构计划

## 当前问题

1. **edit页面表单是硬编码的** - 每个字段都是手动编写的input，新增配置需要修改edit页面代码
2. **配置文件和edit页面不同步** - content.ts更新了，但edit页面可能不支持新字段
3. **维护成本高** - 每次修改配置结构都需要同时修改edit页面

## 目标架构

```
┌─────────────────────────────────────────────────────────┐
│                    content.ts (单一数据源)                 │
│  - heroContent                                          │
│  - aboutContent                                         │
│  - projectsContent                                      │
│  - skillsContent                                        │
│  - contactContent                                       │
│  - footerContent                                        │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   前端页面组件       │         │   Edit页面          │
│   (Hero.tsx等)      │         │   (动态表单生成)     │
│                     │         │                     │
│  读取content.ts     │         │  读取content.ts     │
│  渲染内容            │         │  自动生成表单        │
└─────────────────────┘         └─────────────────────┘
```

## 核心设计

### 1. 配置描述 Schema

为每个content定义数据结构描述，edit页面根据描述自动生成表单：

```typescript
// config/schema.ts
export const contentSchema = {
  hero: {
    badge: { type: 'string', label: '标签' },
    name: { type: 'string', label: '主标题' },
    nameHighlightLength: { type: 'number', label: '高亮字母数' },
    subtitle: { type: 'string', label: '副标题' },
    stats: { 
      type: 'array', 
      label: '统计标签',
      itemSchema: {
        icon: { type: 'string', label: '图标' },
        label: { type: 'string', label: '标签文字' }
      }
    },
    cornerLeft: { type: 'string', label: '左上角文字' },
    cornerRight: { type: 'string', label: '右上角文字' }
  },
  about: {
    sectionTitle: { type: 'string', label: '区域标题' },
    sectionSubtitle: { type: 'string', label: '区域副标题' },
    bio: { type: 'array', label: '个人介绍', itemType: 'string' },
    stats: {
      type: 'array',
      label: '统计数据',
      itemSchema: {
        label: { type: 'string', label: '标签' },
        value: { type: 'number', label: '数值' },
        suffix: { type: 'string', label: '后缀' }
      }
    }
  },
  // ... 其他配置
};
```

### 2. 动态表单组件

根据schema类型自动渲染对应表单控件：

```typescript
// components/DynamicForm.tsx
function DynamicForm({ schema, data, onChange }) {
  return Object.entries(schema).map(([key, field]) => {
    switch (field.type) {
      case 'string':
        return <TextInput key={key} ... />;
      case 'number':
        return <NumberInput key={key} ... />;
      case 'array':
        return <ArrayInput key={key} ... />;
      case 'object':
        return <ObjectInput key={key} ... />;
    }
  });
}
```

### 3. 改进后的edit页面结构

```
app/edit/
├── page.tsx                 # 主页面
├── components/
│   ├── DynamicForm.tsx      # 动态表单生成器
│   ├── FormFields/
│   │   ├── TextInput.tsx    # 文本输入
│   │   ├── NumberInput.tsx  # 数字输入
│   │   ├── TextArea.tsx     # 多行文本
│   │   ├── ArrayInput.tsx   # 数组输入
│   │   └── ObjectInput.tsx  # 对象输入
│   └── Sidebar.tsx          # 侧边栏导航
├── schema.ts                # 配置结构描述
└── utils/
    └── formGenerator.ts     # 表单生成工具
```

## 实施步骤

### Phase 1: 创建Schema描述
1. 分析现有content.ts结构
2. 为每个content创建schema描述
3. 定义支持的字段类型

### Phase 2: 创建动态表单组件
1. 创建基础表单字段组件
2. 创建DynamicForm组件
3. 实现嵌套对象和数组支持

### Phase 3: 重构Edit页面
1. 使用DynamicForm替换硬编码表单
2. 根据schema自动生成所有表单
3. 保持现有的保存/下载功能

### Phase 4: 测试和优化
1. 测试所有字段类型
2. 验证保存和加载功能
3. 优化用户体验

## 优势

1. **单一数据源** - content.ts是唯一需要修改的文件
2. **自动同步** - edit页面自动适应配置变化
3. **易于扩展** - 新增字段只需修改schema和content
4. **类型安全** - TypeScript确保配置和schema一致
5. **维护简单** - 无需手动维护edit页面表单

## 文件变更

### 新增文件
- `app/edit/schema.ts` - 配置结构描述
- `app/edit/components/DynamicForm.tsx` - 动态表单
- `app/edit/components/FormFields/*.tsx` - 表单字段组件

### 修改文件
- `app/edit/page.tsx` - 重构为动态生成
- `app/config/content.ts` - 可能需要调整结构以适配schema

### 删除文件
- 无（保持向后兼容）
