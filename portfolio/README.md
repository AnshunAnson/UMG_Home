# UMG Portfolio

基于 Next.js 16 和 TypeScript 的个人作品集网站，专注于 UE4/UE5 开发和 UMG 界面设计。

## 技术栈

- **框架**: Next.js 16.2.2 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **滚动优化**: Lenis
- **图标**: Lucide React

## 项目结构

```
portfolio/
├── app/
│   ├── api/              # API 路由
│   │   ├── save-content/ # 保存 JSON 内容
│   │   └── save-ts/      # 保存 TypeScript 内容
│   ├── components/       # UI 组件
│   │   ├── project-modal/ # 项目模态框组件
│   │   └── ParticleField.tsx # 粒子背景效果
│   ├── config/           # 配置文件
│   │   └── content.ts    # 默认内容配置
│   ├── edit/             # 内容编辑页面
│   │   ├── components/   # 编辑页面组件
│   │   └── schema.tsx    # 表单 Schema 定义
│   ├── hooks/            # 自定义 Hooks
│   ├── sections/         # 页面区域组件
│   ├── types/            # TypeScript 类型定义
│   ├── ContentProvider.tsx # 内容状态管理
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 主页面
├── public/               # 静态资源
│   ├── gifs/             # GIF 动画
│   └── content.json      # 内容数据
├── next.config.ts        # Next.js 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖
```

## 功能特性

### 核心功能
- 响应式设计，支持移动端和桌面端
- 平滑滚动和鼠标跟随效果
- 动态项目展示和模态框
- 内容编辑器支持实时更新

### 页面区域
- **Hero**: 首屏展示和个人简介
- **About**: 详细个人介绍
- **Projects**: 项目经历展示
- **Skills**: 技能专长列表
- **Experience**: 工作经验
- **Contact**: 联系方式和合作意向

### 编辑功能
- 动态表单生成
- 支持图片上传和预览
- 拖拽排序功能
- 实时保存到 JSON 和 TypeScript 文件

## 开发指南

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run start
```

### 代码检查
```bash
npm run lint
```

## 配置说明

### 内容管理
内容配置文件位于 `app/config/content.ts`，包含以下区域：
- `heroContent`: Hero 区域内容
- `aboutContent`: About 区域内容
- `projectsContent`: Projects 区域内容
- `skillsContent`: Skills 区域内容
- `contactContent`: Contact 区域内容
- `footerContent`: 页脚内容

### 编辑内容
访问 `/edit` 页面可以在线编辑内容，支持：
- 文本输入
- 数值调整
- 数组项添加/删除/排序
- 图片上传

## 部署

本项目支持静态导出，可部署到任何静态托管服务：
```bash
npm run build
```

构建输出位于 `dist/` 目录。

## 许可证

MIT License
