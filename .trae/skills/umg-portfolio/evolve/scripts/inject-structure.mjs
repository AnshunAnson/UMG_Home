import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..');
const HARNESSRC = join(ROOT, '.harnessrc.json');

function loadConfig() {
  if (!existsSync(HARNESSRC)) throw new Error('.harnessrc.json not found');
  return JSON.parse(readFileSync(HARNESSRC, 'utf-8'));
}

const config = loadConfig();
const PORTFOLIO = join(ROOT, config.projectRoot);
const PROJECT_DOC = join(ROOT, config.projectDocPath);

console.log('=== Project Structure Injection ===\n');

function ensureDir(dir) {
  if (!existsSync(dir)) { try { mkdirSync(dir, { recursive: true }); } catch {} }
}

function scanFiles(dir, exts, baseDir) {
  const results = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) results.push(...scanFiles(full, exts, baseDir));
      else if (exts.some(e => entry.name.endsWith(e))) results.push({ path: full, rel: relative(baseDir || dir, full).replace(/\\/g, '/') });
    }
  } catch {}
  return results;
}

function autoBlock(name, content) {
  return `<!-- AUTO-START:${name} -->\n${content}\n<!-- AUTO-END:${name} -->`;
}

function replaceAutoBlock(filePath, blockName, newContent) {
  const dir = filePath.split('/').slice(0, -1).join('/');
  ensureDir(dir);
  let content = '';
  if (existsSync(filePath)) content = readFileSync(filePath, 'utf-8');
  else content = `# ${blockName}\n\n${autoBlock(blockName, '')}\n`;
  const startTag = `<!-- AUTO-START:${blockName} -->`;
  const endTag = `<!-- AUTO-END:${blockName} -->`;
  const startIdx = content.indexOf(startTag);
  const endIdx = content.indexOf(endTag);
  if (startIdx !== -1 && endIdx !== -1) {
    writeFileSync(filePath, content.slice(0, startIdx + startTag.length) + '\n' + newContent + '\n' + content.slice(endIdx));
  } else {
    writeFileSync(filePath, content.trimEnd() + '\n\n' + autoBlock(blockName, newContent) + '\n');
  }
  return true;
}

ensureDir(PROJECT_DOC);

const pkgPath = join(PORTFOLIO, 'package.json');
const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, 'utf-8')) : {};

const deps = Object.entries(pkg.dependencies || {}).map(([k, v]) => `${k}: ${v}`).sort();
const devDeps = Object.entries(pkg.devDependencies || {}).map(([k, v]) => `${k}: ${v}`).sort();

const nextVer = pkg.dependencies?.next || 'unknown';
const reactVer = pkg.dependencies?.react || 'unknown';
const fmVer = pkg.dependencies?.['framer-motion'] || 'unknown';
const twVer = pkg.devDependencies?.tailwindcss || 'unknown';
const tsVer = pkg.devDependencies?.typescript || 'unknown';

replaceAutoBlock(join(PROJECT_DOC, 'tech-stack.md'), 'tech-stack',
`| 项目 | 值 |
|------|-----|
| **名称** | ${pkg.name || 'unknown'} |
| **版本** | ${pkg.version || 'unknown'} |
| **框架** | Next.js ${nextVer} |
| **UI** | React ${reactVer} |
| **动画** | Framer Motion ${fmVer} |
| **样式** | Tailwind CSS v${twVer} (v4, @theme inline) |
| **语言** | TypeScript ^${tsVer} |
| **3D** | Three.js + @react-three/fiber + drei |
| **其他** | GSAP (@gsap/react), Lenis (smooth scroll), Lucide (icons), Prisma |

## Dependencies (${deps.length})

${deps.map(d => `- ${d}`).join('\n')}

## DevDependencies (${devDeps.length})

${devDeps.map(d => `- ${d}`).join('\n')}`);

const allFiles = scanFiles(PORTFOLIO, ['.tsx', '.ts', '.css', '.json'], PORTFOLIO);
let treeLines = [];
const processedDirs = new Set();

function buildTree(dir, prefix, baseDir) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true }).filter(e => !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== '.next' && e.name !== 'dist').sort((a, b) => {
      if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name);
      return a.isDirectory() ? -1 : 1;
    });
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const isLast = i === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const rel = relative(baseDir, join(dir, e.name)).replace(/\\/g, '/');
      if (e.isDirectory()) {
        treeLines.push(prefix + connector + '**' + e.name + '/**');
        buildTree(join(dir, e.name), prefix + (isLast ? '    ' : '│   '), baseDir);
      } else {
        treeLines.push(prefix + connector + rel);
      }
    }
  } catch {}
}

buildTree(PORTFOLIO, '', PORTFOLIO);

replaceAutoBlock(join(PROJECT_DOC, 'structure.md'), 'structure',
`\`\`
portfolio/
${treeLines.join('\n')}
\`\``);

const tsxFiles = scanFiles(join(PORTFOLIO, 'app'), ['.tsx'], PORTFOLIO);
const compRegex = /export\s+(default\s+)?function\s+(\w+)|export\s+(default\s+)?(?:const|var|let)\s+(\w+)\s*[\s=<]\s*(?:\(|function)/g;
const importLocalRegex = /from\s+['"]\.\.?\/([^'"]+)['"]/g;
const useClientRegex = ['use client'];

const components = [];
for (const f of tsxFiles) {
  try {
    const content = readFileSync(f.path, 'utf-8');
    const lines = content.split('\n');
    const hasUseClient = lines[0]?.trim() === "'use client'";
    const localImports = [];
    let match;
    while ((match = importLocalRegex.exec(content)) !== null) {
      localImports.push(match[1]);
    }
    const compMatches = [...content.matchAll(compRegex)];
    for (const m of compMatches) {
      const name = m[2] || m[4];
      components.push({ name, file: f.rel, lines: lines.length, client: hasUseClient, imports: localImports });
    }
  } catch {}
}

components.sort((a, b) => a.file.localeCompare(b.file));

const compTable = components.map(c =>
  `| ${c.name} | \`${c.file}\` | ${c.lines}L | ${c.client ? '✅ client' : 'server'} | ${c.imports.slice(0, 4).join(', ') || '—'} |`).join('\n');

replaceAutoBlock(join(PROJECT_DOC, 'components.md'), 'components',
`共 ${components.length} 个组件导出, 分布在 ${tsxFiles.length} 个 .tsx 文件中

| 组件名 | 文件 | 行数 | Client? | 本地依赖 |
|--------|------|------|---------|----------|
${compTable}`);

const keyPaths = [
  { label: '入口', path: 'app/page.tsx' },
  { label: '布局', path: 'app/layout.tsx' },
  { label: '内容提供者', path: 'app/ContentProvider.tsx' },
  { label: '全局样式', path: 'app/globals.css' },
  { label: '内容配置', path: 'app/config/content.ts' },
  { label: '编辑Schema', path: 'app/edit/schema.tsx' },
  { label: '编辑页面', path: 'app/edit/page.tsx' },
  { label: '保存API', path: 'app/api/save-content/route.ts' },
  { label: 'Next配置', path: 'next.config.ts' },
  { label: '包管理', path: 'package.json' },
];

const sections = [
  { name: 'Hero', path: 'app/sections/Hero.tsx' },
  { name: 'About', path: 'app/sections/About.tsx' },
  { name: 'Projects', path: 'app/sections/Projects.tsx' },
  { name: 'Skills', path: 'app/sections/Skills.tsx' },
  { name: 'Experience', path: 'app/sections/Experience.tsx' },
  { name: 'Contact', path: 'app/sections/Contact.tsx' },
  { name: 'Footer', path: 'app/sections/Footer.tsx' },
];

const sharedComponents = [
  { name: 'ParticleField', path: 'app/components/ParticleField.tsx' },
  { name: 'ProjectCard', path: 'app/components/ProjectCard.tsx' },
  { name: 'NeonCard', path: 'app/components/NeonCard.tsx' },
  { name: 'GlitchText', path: 'app/components/GlitchText.tsx' },
  { name: 'GlobalAnimatedBackground', path: 'app/components/GlobalAnimatedBackground.tsx' },
  { name: 'ParticleBackground', path: 'app/components/ParticleBackground.tsx' },
  { name: 'ScrollIndicator', path: 'app/components/ScrollIndicator.tsx' },
];

const hooks = [
  { name: 'useMousePosition', path: 'app/hooks/useMousePosition.ts' },
  { name: 'useSmoothScroll', path: 'app/hooks/useSmoothScroll.ts' },
];

const editComponents = [
  { name: 'DynamicForm', path: 'app/edit/components/DynamicForm.tsx' },
  { name: 'ArrayInput', path: 'app/edit/components/FormFields/ArrayInput.tsx' },
  { name: 'ObjectInput', path: 'app/edit/components/FormFields/ObjectInput.tsx' },
  { name: 'TextInput', path: 'app/edit/components/FormFields/TextInput.tsx' },
  { name: 'NumberInput', path: 'app/edit/components/FormFields/NumberInput.tsx' },
  { name: 'TextArea', path: 'app/edit/components/FormFields/TextArea.tsx' },
];

replaceAutoBlock(join(PROJECT_DOC, 'file-reference.md'), 'file-reference',
`### 核心
${keyPaths.map(p => `- **${p.label}**: \`portfolio/${p.path}\``).join('\n')}

### Sections (7个)
${sections.map(s => `- **${s.name}**: \`portfolio/${s.path}\``).join('\n')}

### 共享 Components (7个)
${sharedComponents.map(c => `- **${c.name}**: \`portfolio/${c.path}\``).join('\n')}

### Hooks (2个)
${hooks.map(h => `- **${h.name}**: \`portfolio/${h.path}\``).join('\n')}

### Edit 组件 (6个)
${editComponents.map(c => `- **${c.name}**: \`portfolio/${c.path}\``).join('\n')}`);

const cssPath = join(PORTFOLIO, 'app', 'globals.css');
let cssInfo = '';
if (existsSync(cssPath)) {
  const css = readFileSync(cssPath, 'utf-8');
  const varRegex = /--([\w-]+):\s*([^;]+);/g;
  const vars = [];
  let m;
  while ((m = varRegex.exec(css)) !== null) vars.push(`--${m[1]}: ${m[2]}`);
  const fontImport = css.match(/@import url\(['"]([^'"]+)['"]\)/)?.[1] || '';
  const hasTailwind = css.includes('@import "tailwindcss"');
  const hasThemeInline = css.includes('@theme inline');
  cssInfo = `- **字体**: ${fontImport || '无外部字体'}
- **Tailwind**: ${hasTailwind ? '✅ v4 (@import)' : '❌'}
- **@theme inline**: ${hasThemeInline ? '✅ (CSS变量→设计令牌)' : '❌'}
- **CSS 变量** (${vars.length} 个):

\`\`\`css
${vars.join('\n')}
\`\`\``;
} else {
  cssInfo = '*globals.css 未找到*';
}

replaceAutoBlock(join(PROJECT_DOC, 'css-classes.md'), 'css-classes', cssInfo);

const providerPath = join(PORTFOLIO, 'app', 'ContentProvider.tsx');
let dataFlow = '';
if (existsSync(providerPath)) {
  const provider = readFileSync(providerPath, 'utf-8');
  const contentKeySet = new Set();
  [...provider.matchAll(/\b(hero|about|projects|skills|contact|footer)Content\b/g)].forEach(m => contentKeySet.add(m[1]));
  const contentKeys = [...contentKeySet];

  const consumers = [];
  for (const f of tsxFiles) {
    try {
      const c = readFileSync(f.path, 'utf-8');
      if (c.includes('useContent()')) {
        const compName = f.rel.split('/').pop()?.replace('.tsx', '') || f.rel;
        consumers.push(compName);
      }
    } catch {}
  }

  dataFlow = `\`\`\`
content.json (静态默认值)
    ↓ fetch() + localStorage merge
ContentProvider.tsx (React Context)
    ↓ useState(defaultContent) → useEffect(远程覆盖+本地存储合并)
    ↓
useContent() hook → 返回 EditedContent 对象
    ↓
Consumers (${consumers.length}):
  ${consumers.map(c => `  └─ ${c}()`).join('\n')}
\`\`

**数据结构**:
${contentKeys.map(k => `- **${k}** — 定义于 config/content.ts, 类型见 edit/schema.tsx`).join('\n')}

**写入路径**:
- API: POST \`api/save-content/route.ts\` → 写入 public/content.json
- 客户端: ContentProvider fetch(\`/content.json\`) + localStorage 读写
- 编辑器: edit/page.tsx → DynamicForm → schema.tsx 验证 → save-content API`;
} else {
  dataFlow = '*ContentProvider 未找到*';
}

replaceAutoBlock(join(PROJECT_DOC, 'data-flow.md'), 'data-flow', dataFlow);

const nextConfigPath = join(PORTFOLIO, 'next.config.ts');
let buildInfo = '';
if (existsSync(nextConfigPath)) {
  const nc = readFileSync(nextConfigPath, 'utf-8');
  const outputMatch = nc.match(/output:\s*['"]([^'"]*)['"]/);
  const distMatch = nc.match(/distDir:\s*['"]([^'"]*)['"]/);
  const basePathMatch = nc.match(/basePath:\s*[^,]+?['"]\/([^'"]*)['"]/);
  const scriptLines = Object.entries(pkg.scripts || {}).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n');
buildInfo = `| 配置项 | 值 | 说明 |
|--------|-----|------|
| **output** | \`${outputMatch?.[1] || '?'}\` | ${outputMatch?.[1] === 'export' ? '静态导出模式 ✅' : 'SSR 模式'} |
| **distDir** | \`${distMatch?.[1] || '?'}\` | 构建输出目录 |
| **basePath** | \`${basePathMatch?.[1] ? '/' + basePathMatch?.[1] : '(dev: 空)'}\` | 生产环境前缀 |
| **images.unoptimized** | \`${nc.includes('unoptimized: true') ? 'true ✅' : 'false'}\` | 禁用 Image 优化 (静态导出需要) |

**Scripts**:
${scriptLines}`;
} else {
  buildInfo = '*next.config.ts 未找到*';
}

replaceAutoBlock(join(PROJECT_DOC, 'build-config.md'), 'build-config', buildInfo);

console.log(`Project Doc generated at: ${PROJECT_DOC}`);
console.log(`Files: tech-stack / structure / components / file-reference / css-classes / data-flow / build-config`);
console.log(`Components found: ${components.length}`);
console.log(`Total source files scanned: ${allFiles.length}`);
