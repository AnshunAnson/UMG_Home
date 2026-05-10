> generated_by: nexus-mapper v2
> verified_at: 2026-05-10
> provenance: git_stats backed by 61 commits over 90 days; coupling analysis from git_detective.py

# Git 热点与耦合风险

## 分析概览

| 指标 | 值 |
|------|-----|
| 分析周期 | 90 天 |
| 总提交数 | 61 |
| 总作者数 | 1 |

## 热点文件 Top 10

| 排名 | 文件 | 变更次数 | 风险 | 所属系统 |
|:----:|------|:--------:|:----:|----------|
| 1 | `portfolio/public/content.json` | 38 | 🔴 high | Content Data Layer |
| 2 | `portfolio/app/config/content.ts` | 35 | 🔴 high | Content Data Layer |
| 3 | `portfolio/app/sections/Projects.tsx` | 26 | 🔴 high | Page Sections |
| 4 | `portfolio/app/sections/Contact.tsx` | 9 | 🟡 medium | Page Sections |
| 5 | `portfolio/app/sections/Skills.tsx` | 9 | 🟡 medium | Page Sections |
| 6 | `portfolio/app/sections/Hero.tsx` | 8 | 🟡 medium | Page Sections |
| 7 | `portfolio/app/edit/page.tsx` | 8 | 🟡 medium | Content Editor |
| 8 | `portfolio/app/ContentProvider.tsx` | 8 | 🟡 medium | Content Provider |
| 9 | `portfolio/app/sections/About.tsx` | 7 | 🟡 medium | Page Sections |
| 10 | `portfolio/app/types/content.ts` | 6 | 🟡 medium | Content Types |

## 强耦合对（coupling_score ≥ 0.7）

| 文件 A | 文件 B | 共变次数 | 耦合分数 | 风险评估 |
|--------|--------|:--------:|:--------:|----------|
| `config/content.ts` | `public/content.json` | 34 | 0.971 | 🔴 几乎完全同步变更，编辑器保存时同时更新 |
| `config/content.ts` | `types/content.ts` | 6 | 1.000 | 🔴 类型与默认值完全同步，结构变更必同步 |
| `edit/schema.tsx` | `public/content.json` | 6 | 1.000 | 🔴 schema 变更必伴随内容结构变更 |
| `layout.tsx` | `sections/Projects.tsx` | 5 | 1.000 | 🟡 页面组装与项目展示强绑定 |
| `page.tsx` | `sections/Projects.tsx` | 5 | 1.000 | 🟡 同上 |
| `sections/Contact.tsx` | `sections/Hero.tsx` | 7 | 0.875 | 🟡 区块间样式/结构同步调整 |
| `sections/About.tsx` | `sections/Contact.tsx` | 6 | 0.857 | 🟡 同上 |
| `sections/About.tsx` | `sections/Skills.tsx` | 6 | 0.857 | 🟡 同上 |
| `sections/Projects.tsx` | `types/content.ts` | 5 | 0.833 | 🟡 项目数据结构变更影响展示 |
| `sections/Hero.tsx` | `sections/Projects.tsx` | 6 | 0.750 | 🟡 同上 |
| `sections/Contact.tsx` | `sections/Skills.tsx` | 7 | 0.778 | 🟡 同上 |
| `sections/Projects.tsx` | `sections/Skills.tsx` | 7 | 0.778 | 🟡 同上 |
| `sections/Contact.tsx` | `sections/Projects.tsx` | 6 | 0.667 | 🟡 同上 |
| `config/content.ts` | `sections/Projects.tsx` | 13 | 0.500 | 🟡 内容变更影响项目展示 |
| `sections/Projects.tsx` | `public/content.json` | 13 | 0.500 | 🟡 同上 |

## 关键发现

1. **content.json 是被动热点**：38次变更中绝大多数由 Content Editor 的保存操作驱动，而非手动编辑。修改 content.json 时应优先检查编辑器保存逻辑。

2. **Projects.tsx 是代码热点**：26次变更远超其他 section，主要因为项目数据结构复杂（含图片、GIF、多语言描述等），且 resolveAssetPath 和 ProjectItem 逻辑较重。

3. **Section 间存在群体耦合**：Contact、Hero、About、Skills 四个 section 的 coupling_score 在 0.75-0.875 之间，说明它们经常被一起修改（通常是全局样式或布局调整）。

4. **类型-数据-展示三件套**：`types/content.ts` ↔ `config/content.ts` ↔ `content.json` 形成耦合三角（coupling_score 均 ≥ 0.97），任何内容结构变更必须三者同步更新。

## 变更建议

- 修改 `types/content.ts` 时，必须同步更新 `config/content.ts` 和 `edit/schema.tsx`
- 修改 `Projects.tsx` 时，注意 `layout.tsx` 和 `page.tsx` 可能需要同步调整
- 全局样式变更时，预期 Contact/Hero/About/Skills 需要一起修改
