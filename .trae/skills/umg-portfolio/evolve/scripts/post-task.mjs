import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
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
const TASTE_FILE = join(ROOT, 'identity', 'taste-profile.md');
const DECISIONS_LOG = join(ROOT, 'memory', 'decisions.log');
const ANTI_PATTERNS = join(ROOT, 'constraints', 'anti-patterns.md');
const PATTERNS_FILE = join(ROOT, 'memory', 'patterns-discovered.md');
const EVOLVE_STATE = join(ROOT, 'identity', 'evolution-state.md');

console.log('=== Post-Task Document Sync ===\n');

function scanFiles(dir, exts) {
  const results = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || config.excludeDirs.includes(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) results.push(...scanFiles(full, exts));
      else if (exts.some(e => entry.name.endsWith(e))) results.push(full);
    }
  } catch {}
  return results;
}

function getLastEvolveTime() {
  if (!existsSync(EVOLVE_STATE)) return 0;
  const content = readFileSync(EVOLVE_STATE, 'utf-8');
  const match = content.match(/Last Evolved:\s*(\S+)/);
  if (!match) return 0;
  const val = match[1].replace(/[_()]/g, '');
  if (val === 'initial' || !/^\d{4}/.test(val)) return 0;
  return new Date(val).getTime();
}

function detectChanges() {
  const threshold = getLastEvolveTime();
  const files = scanFiles(join(PORTFOLIO, 'app'), ['.tsx', '.css', '.ts']);
  const changed = [];
  for (const f of files) {
    try {
      const stat = statSync(f);
      if (stat.mtimeMs > threshold) {
        changed.push({ path: f, relative: relative(PORTFOLIO, f), mtime: stat.mtimeMs, size: stat.size });
      }
    } catch {}
  }
  return changed.sort((a, b) => b.mtime - a.mtime);
}

function inferTask(changedFiles) {
  const domains = { visual: 0, animation: 0, data: 0, architecture: 0, style: 0, config: 0 };
  for (const f of changedFiles) {
    const r = f.relative.toLowerCase();
    if (r.includes('hero') || r.includes('about') || r.includes('contact') || r.includes('particle')) domains.visual++;
    else if (r.includes('project') || r.includes('skill') || r.includes('card')) domains.visual++;
    else if (/motion|spring|animate|framer|whileinview|useview/i.test(r)) domains.animation++;
    else if (r.includes('content') || r.includes('data') || r.includes('config') || r.includes('provider')) domains.data++;
    else if (r.includes('layout') || r.includes('page.') || r.includes('globals.')) domains.architecture++;
    else if (r.endsWith('.css') || r.includes('style') || r.includes('tailwind')) domains.style++;
    else if (r.includes('next.config') || r.includes('package.json') || r.includes('tsconfig')) domains.config++;
  }

  const topDomain = Object.entries(domains).sort((a, b) => b[1] - a[1])[0];
  const fileCount = changedFiles.length;
  let totalSize = 0;
  for (const f of changedFiles) totalSize += f.size;

  const scope = fileCount <= 1 && totalSize < 5000 ? 'single-file'
    : fileCount <= 3 && totalSize < 20000 ? 'multi-file'
    : 'repo-wide';

  const uncertainty = totalSize < 3000 ? 'low' : totalSize < 10000 ? 'medium' : 'high';

  return {
    domain: topDomain[1] > 0 ? topDomain[0] : 'style',
    scope,
    uncertainty,
    fileCount,
    totalSize,
    files: changedFiles.map(f => f.relative)
  };
}

function generateDecisionId() {
  if (!existsSync(DECISIONS_LOG)) return 'D-001';
  const content = readFileSync(DECISIONS_LOG, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim().startsWith('{'));
  return `D-${String(lines.length + 1).padStart(3, '0')}`;
}

function logDecision(task) {
  const id = generateDecisionId();
  const entry = {
    ts: new Date().toISOString(),
    task: `post-task-auto: ${task.domain}/${task.scope} (${task.fileCount} files changed)`,
    decision: `Sync docs after detecting changes in: ${task.files.slice(0, 5).join(', ')}${task.files.length > 5 ? ` + ${task.files.length - 5} more` : ''}`,
    reason: 'auto-detected by post-task.mjs change scanner',
    outcome: 'synced',
    module: `post-task:${task.domain}`
  };
  const line = JSON.stringify(entry) + '\n';
  writeFileSync(DECISIONS_LOG, line, { flag: 'a' });
  return id;
}

function checkAntiPatterns(changedFiles) {
  if (!existsSync(ANTI_PATTERNS)) return [];
  const apContent = readFileSync(ANTI_PATTERNS, 'utf-8');
  const traps = [];
  const trapRegex = /## 陷阱 \d+:\s+(.+)/g;
  let m;
  while ((m = trapRegex.exec(apContent)) !== null) {
    traps.push(m[1]);
  }

  const warnings = [];
  const badPatterns = [
    { name: 'unsafe property access', regex: /\w+\.\w+\.\w+(?!\?)/g, trap: '直接访问可能为 undefined 的属性' },
    { name: 'hardcoded fetch path', regex: /fetch\s*\(\s*['"]\/content\.json['"]/g, trap: '硬编码 fetch 路径' },
    { name: 'blocking loading', regex: /useState\s*\(\s*null\s*\)[^}]*useEffect[^}]*if\s*\(\s*!content\s*\)/g, trap: '阻塞式数据加载' },
    { name: 'CSS variable in inline style', regex: /var\(--\w+-\w+\)/g, trap: '用 CSS 变量名而非实际色值写内联样式', skipExt: ['.css'] },
  ];

  for (const cf of changedFiles) {
    try {
      const content = readFileSync(cf.path, 'utf-8');
      const ext = cf.relative.split('.').pop();
      for (const bp of badPatterns) {
        if (bp.skipExt && bp.skipExt.includes('.' + ext)) continue;
        const matches = content.match(bp.regex);
        if (matches && matches.length > 0) {
          warnings.push({ file: cf.relative, pattern: bp.trap, count: matches.length });
        }
      }
    } catch {}
  }
  return warnings;
}

function runInjectTaste() {
  try {
    const hexRegex = new RegExp('#([0-9a-fA-F]{6})', 'g');

    function hue(hex) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max === min) return 0;
      const d = max - min;
      let h = 0;
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
      return h % 360;
    }

    const allFiles = scanFiles(join(PORTFOLIO, 'app'), ['.tsx', '.css']);
    let allContent = '';
    for (const f of allFiles) { try { allContent += readFileSync(f, 'utf-8') + '\n'; } catch {} }

    const colors = new Map();
    let match;
    while ((match = hexRegex.exec(allContent)) !== null) {
      const c = match[1].toLowerCase();
      colors.set(c, (colors.get(c) || 0) + 1);
    }

    let cool = 0, warm = 0;
    for (const [c, count] of colors) {
      const h = hue(c);
      if (h < 180 || h >= 300) cool += count; else warm += count;
    }
    const total = cool + warm || 1;
    const coolPct = (cool / total * 100).toFixed(1);

    function replaceAutoBlock(blockName, newContent) {
      const content = readFileSync(TASTE_FILE, 'utf-8');
      const startTag = `<!-- AUTO-START:${blockName} -->`;
      const endTag = `<!-- AUTO-END:${blockName} -->`;
      const startIdx = content.indexOf(startTag);
      const endIdx = content.indexOf(endTag);
      if (startIdx === -1 || endIdx === -1) return false;
      writeFileSync(TASTE_FILE, content.slice(0, startIdx + startTag.length) + '\n' + newContent + '\n' + content.slice(endIdx));
      return true;
    }

    replaceAutoBlock('taste-colors',
      `- **Dominant Temperature**: ${coolPct}% cool (${(warm / total * 100).toFixed(1)}% warm)
- **Unique Colors**: ${colors.size} distinct values
- **Last Sync**: ${new Date().toISOString().slice(0, 19)}`);

    return { colors: colors.size, coolTemp: coolPct, filesScanned: allFiles.length };
  } catch (e) {
    return { error: e.message };
  }
}

function runInjectMemory(task) {
  if (!existsSync(DECISIONS_LOG)) return { decisions: 0 };
  const logContent = readFileSync(DECISIONS_LOG, 'utf-8').trim();
  const lines = logContent.split('\n').filter(l => l.trim().startsWith('{'));
  const decisions = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

  const byType = {};
  for (const d of decisions) {
    const t = d.type || d.task?.split(':')[0] || 'unknown';
    if (!byType[t]) byType[t] = [];
    byType[t].push(d);
  }

  const patterns = [`\n## Decision Statistics (auto-generated)\n\nTotal Decisions: ${decisions.length}\n\n### By Type:\n`];
  for (const [type, items] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    patterns.push(`- **${type}**: ${items.length} decisions`);
  }

  patterns.push(`\n### Latest Task Observation (from post-task):\n`);
  patterns.push(`- **Domain**: ${task.domain} | **Scope**: ${task.scope} | **Uncertainty**: ${task.uncertainty}`);
  patterns.push(`- **Files Changed**: ${task.fileCount} | **Total Size**: ${Math.round(task.totalSize / 1024)}KB`);

  if (existsSync(PATTERNS_FILE)) {
    const existing = readFileSync(PATTERNS_FILE, 'utf-8');
    const manualStart = '<!-- MANUAL-START:patterns -->';
    const manualIdx = existing.indexOf(manualStart);
    let preManual = manualIdx !== -1 ? existing.slice(0, manualIdx) : existing;
    const statsRegex = /## Decision Statistics \(auto-generated\)\n[\s\S]*?(?=\n## |<!-- MANUA|$)/g;
    preManual = preManual.replace(statsRegex, '').replace(/\n{3,}/g, '\n\n');
    const postManual = manualIdx !== -1 ? existing.slice(existing.indexOf(manualStart)) : '';
    writeFileSync(PATTERNS_FILE, preManual + '\n' + patterns.join('\n') + '\n' + postManual);
  }

  return { decisions: decisions.length, types: Object.keys(byType).length };
}

function updateEvolutionState(task, decisionId, tasteResult, memoryResult, warnings) {
  if (!existsSync(EVOLVE_STATE)) return;
  let state = readFileSync(EVOLVE_STATE, 'utf-8');
  const sessionMatch = state.match(/Total Sessions: (\d+)/);
  const currentSessions = sessionMatch ? parseInt(sessionMatch[1]) : 0;

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const warningFlag = warnings.length > 0 ? ` ⚠${warnings.length}` : '';
  const newLine = `\n| ${now} | post-task:${task.domain} | D:${decisionId} | ${task.fileCount} files | taste:${tasteResult.colors ?? '?'} mem:${memoryResult.decisions} warn:${warnings.length}${warningFlag} |`;

  state = state.replace(/\(每次 evolve 追加一行\)_/, '(每次 evolve 追加一行)\n' + newLine);
  state = state.replace(/Total Sessions: (\d+)/, `Total Sessions: ${currentSessions + 1}`);
  state = state.replace(/Last Evolved:\s*_\(.*?\)_/, `Last Evolved: ${new Date().toISOString().slice(0, 19)}`);
  writeFileSync(EVOLVE_STATE, state);
}

const changed = detectChanges();

if (changed.length === 0) {
  console.log('No changes detected since last sync. Nothing to do.');
  console.log('(Run with --force to override)\n');
  process.exit(0);
}

const task = inferTask(changed);
console.log(`Changed Files: ${changed.length}`);
for (const f of changed) {
  console.log(`  📄 ${f.relative} (${Math.round(f.size / 1024)}KB)`);
}
console.log(`\nInferred Task: ${task.domain} | ${task.scope} | uncertainty=${task.uncertainty}`);

const decisionId = logDecision(task);
console.log(`Decision Logged: ${decisionId}`);

const tasteResult = runInjectTaste();
if (tasteResult.error) {
  console.log(`Taste Sync: ERROR — ${tasteResult.error}`);
} else {
  console.log(`Taste Sync: ${tasteResult.colors} colors, ${tasteResult.coolTemp}% cool (${tasteResult.filesScanned} files)`);
}

const memoryResult = runInjectMemory(task);
console.log(`Memory Sync: ${memoryResult.decisions} decisions, ${memoryResult.types} types`);

const warnings = checkAntiPatterns(changed);
if (warnings.length > 0) {
  console.log(`\n⚠️  Anti-Pattern Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.log(`   🔸 ${w.file}: "${w.pattern}" x${w.count}`);
  }
} else {
  console.log(`Anti-Pattern Check: clean ✓`);
}

updateEvolutionState(task, decisionId, tasteResult, memoryResult, warnings);

console.log(`\n---`);
console.log(`Post-Task Sync Complete | ${decisionId} | ${changed.length} files | ${warnings.length} warnings`);
