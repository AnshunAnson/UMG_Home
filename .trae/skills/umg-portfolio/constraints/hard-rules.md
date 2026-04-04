# 🔴 绝对禁区

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
| 8 | **在 ContentProvider 或数据加载中 `await` 再渲染** | 页面白屏直到 fetch 完成。必须先渲染默认值，后台静默更新 |
| 9 | **无防御地访问嵌套属性** | 见 anti-patterns.md |
