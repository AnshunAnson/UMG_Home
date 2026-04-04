# 统一内容类型定义计划

## 问题分析

当前架构存在的问题：
1. **类型定义重复** - `config/content.ts` 和 `edit/schema.tsx` 各自维护数据结构
2. **同步困难** - 修改前端数据结构后需手动同步到 edit schema
3. **容易出错** - 两边不一致时导致运行时错误

## 目标

创建单一的类型定义来源，前端展示和 edit 页面共享同一套类型。

## 实施步骤

### Phase 1: 创建统一类型定义

创建 `app/types/content.ts`，包含所有内容区域的类型定义：

```typescript
// Hero 区域
export interface HeroContent {
  badge: string;
  name: string;
  nameHighlightLength: number;
  subtitle: string;
  stats: Array<{ icon: string; label: string }>;
  cornerLeft: string;
  cornerRight: string;
}

// About 区域
export interface AboutContent {
  sectionTitle: string;
  sectionSubtitle: string;
  bio: string[];
  age: number;
  location: string;
  experience: number;
  currentCompany: string;
  jobTitle: string;
  stats: Array<{ label: string; value: number; suffix: string }>;
  coreSkills: Array<{ title: string; description: string }>;
}

// Projects 区域
export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: number;
  icon: string;
  title: string;
  company: string;
  period: string;
  category: string;
  description: string;
  details: string[];
  achievements: string[];
  tech: string[];
  color: string;
  images?: ProjectImage[];
}

export interface ProjectsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  projects: Project[];
}

// 其他区域...

// 统一导出
export interface PortfolioContent {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  projectsContent: ProjectsContent;
  // ...
}
```

### Phase 2: 重构 config/content.ts

修改 `config/content.ts`：
1. 导入类型定义
2. 使用类型约束默认值
3. 保持向后兼容的导出

```typescript
import { HeroContent, AboutContent, ProjectsContent } from '../types/content';

export const heroContent: HeroContent = {
  // ... 默认值
};

export const aboutContent: AboutContent = {
  // ... 默认值
};

export const projectsContent: ProjectsContent = {
  // ... 默认值
};
```

### Phase 3: 重构 edit/schema.tsx

修改 `edit/schema.tsx`：
1. 从类型定义生成 schema
2. 或使用类型约束 schema

方案A：从类型生成 schema（推荐）
```typescript
import { Project, HeroContent } from '../types/content';

// 类型到 schema 的映射
const projectSchema: SectionSchema = {
  title: '项目 Projects',
  fields: {
    // 基于 Project 类型自动生成
    id: { type: 'number', label: 'ID' },
    title: { type: 'string', label: '项目名称' },
    // ...
    images: {
      type: 'array',
      label: 'GIF图片',
      itemType: 'object',
      itemSchema: {
        src: { type: 'string', label: '图片路径' },
        alt: { type: 'string', label: '图片描述' }
      }
    }
  }
};
```

### Phase 4: 更新前端组件

修改所有使用内容的组件：
1. 从 `types/content` 导入类型
2. 使用 `useContent()` 时添加类型约束

```typescript
import { ProjectsContent } from '../types/content';

const { projectsContent } = useContent() as { projectsContent: ProjectsContent };
```

### Phase 5: 验证和测试

1. 运行 TypeScript 检查确保无类型错误
2. 测试 edit 页面所有表单功能
3. 测试前端展示功能
4. 验证保存和加载流程

## 文件变更清单

### 新增文件
- `app/types/content.ts` - 统一类型定义

### 修改文件
- `app/config/content.ts` - 使用类型约束
- `app/edit/schema.tsx` - 基于类型定义 schema
- `app/edit/page.tsx` - 使用统一类型
- `app/ContentProvider.tsx` - 添加类型定义
- `app/sections/*.tsx` - 使用统一类型

## 预期收益

1. **单一数据源** - 类型定义只维护一份
2. **类型安全** - TypeScript 编译时检查
3. **自动同步** - 修改类型后自动反映到所有地方
4. **IDE 支持** - 更好的代码提示和重构支持

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 类型过于严格导致灵活性降低 | 使用 `Partial<>` 和可选字段 |
| 重构引入运行时错误 | 全面测试所有功能 |
| 第三方库类型不兼容 | 使用类型断言或扩展类型 |
