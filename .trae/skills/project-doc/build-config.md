# build-config

<!-- AUTO-START:build-config -->
| 配置项 | 值 | 说明 |
|--------|-----|------|
| **output** | `export` | 静态导出模式 ✅ |
| **distDir** | `dist` | 构建输出目录 |
| **basePath** | `/UMG_Home` | 生产环境前缀 |
| **images.unoptimized** | `true ✅` | 禁用 Image 优化 (静态导出需要) |

**Scripts**:
- `dev`: next dev --turbopack
- `dev:webpack`: next dev
- `build`: next build
- `start`: next start
- `lint`: eslint
<!-- AUTO-END:build-config -->
