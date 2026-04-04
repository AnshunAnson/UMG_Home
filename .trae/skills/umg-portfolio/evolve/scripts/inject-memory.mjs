import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..');
const HARNESSRC = join(ROOT, '.harnessrc.json');

if (existsSync(HARNESSRC)) JSON.parse(readFileSync(HARNESSRC, 'utf-8'));

const DECISIONS_LOG = join(ROOT, 'memory', 'decisions.log');
const PATTERNS_FILE = join(ROOT, 'memory', 'patterns-discovered.md');

if (!existsSync(DECISIONS_LOG)) { console.log('No decisions.log found'); process.exit(0); }

const logContent = readFileSync(DECISIONS_LOG, 'utf-8').trim();
const lines = logContent.split('\n').filter(l => l.trim().startsWith('{'));
if (lines.length === 0) { console.log('No decisions to analyze'); process.exit(0); }

const decisions = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

const byType = {};
for (const d of decisions) {
  const t = d.type || d.task?.split(':')[0] || 'unknown';
  if (!byType[t]) byType[t] = [];
  byType[t].push(d);
}

const successByModule = {};
const failureByModule = {};
for (const d of decisions) {
  const m = d.module || 'unknown';
  if (!successByModule[m]) successByModule[m] = { success: 0, fail: 0 };
  if (d.outcome === 'success') successByModule[m].success++;
  else successByModule[m].fail++;
}

const patterns = [];
patterns.push(`\n## Decision Statistics (auto-generated)`);
patterns.push(`\nTotal Decisions: ${decisions.length}`);
patterns.push(`\n### By Type:`);
for (const [type, items] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
  patterns.push(`- **${type}**: ${items.length} decisions`);
}
patterns.push(`\n### By Module (Success Rate):`);
for (const [module, stats] of Object.entries(successByModule)) {
  const total = stats.success + stats.fail;
  const rate = total > 0 ? ((stats.success / total) * 100).toFixed(0) : '0';
  patterns.push(`- **${module}**: ${stats.success}/${total} (${rate}%)`);
}

const existing = existsSync(PATTERNS_FILE) ? readFileSync(PATTERNS_FILE, 'utf-8') : '';
const manualStart = '<!-- MANUAL-START:patterns -->';
const manualEnd = '<!-- MANUAL-END:patterns -->';
const manualIdx = existing.indexOf(manualStart);
let preManual = manualIdx !== -1 ? existing.slice(0, manualIdx) : existing;
const postManual = manualIdx !== -1 ? existing.slice(existing.indexOf(manualEnd) + manualEnd.length) : '';
const statsRegex = /## Decision Statistics \(auto-generated\)\n[\s\S]*?(?=\n## |<!-- MANUA|$)/g;
preManual = preManual.replace(statsRegex, '').replace(/\n{3,}/g, '\n\n');

writeFileSync(PATTERNS_FILE, preManual + '\n' + patterns.join('\n') + '\n' + manualStart + '\n<!-- Append manually discovered patterns here -->\n' + manualEnd + postManual);

console.log(`=== Memory Injection Complete ===`);
console.log(`Decisions analyzed: ${decisions.length}`);
console.log(`Types found: ${Object.keys(byType).length}`);
console.log(`Modules tracked: ${Object.keys(successByModule).length}`);
