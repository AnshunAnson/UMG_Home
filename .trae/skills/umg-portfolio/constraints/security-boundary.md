# 🔒 安全边界

## 敏感信息分级

| 级别 | 内容示例 | 分享行为 |
|------|---------|---------|
| **PUBLIC** | 设计原则、通用规则、美学偏好、taste-profile | 可公开分享 |
| **INTERNAL** | 具体文件路径、组件名、项目结构、路由表 | 仅团队内分享 |
| **SENSITIVE** | API key、部署配置、个人化内容字段、`.harnessrc.json` 中的 projectRoot | 不分享 |

## 脱敏规则

将 Skill 分享给他人或公开仓库时，必须执行以下脱敏：

| 原始内容 | 替换为 |
|---------|--------|
| 绝对路径 `E:\AnShunConfig\...` | `{PROJECT_ROOT}` |
| 相对路径 `../../portfolio` | `{PROJECT_ROOT}` |
| 邮箱地址 | `{EMAIL}` |
| IP 地址 / 内网域名 | `{INTERNAL_HOST}` |
| 个人名字（如有） | `{USER}` |

**保留不脱敏**：
- 色值 (`#0a0a0f`, `#00d4aa` 等) — 这是品味核心，脱敏后 Skill 失去意义
- 技术栈名称 (Next.js, Framer Motion 等)
- 硬约束规则文本
- 动画参数参考值

## `.harnessrc.json` 安全提醒

- `projectRoot` 包含本地文件系统路径，**不应提交到公开仓库**
- 建议在 `.gitignore` 中添加 `.harnessrc.json` 或提供 `.harnessrc.example.json` 模板
- 团队协作时每个成员维护自己的 `.harnessrc.json`
