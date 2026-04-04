import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..');
const EVOLVE_STATE = join(ROOT, 'identity', 'evolution-state.md');

const startTime = Date.now();
console.log('=== UMG Portfolio Taste Harness Evolution ===\n');

let changedCount = 0;
let totalAdded = 0;
let totalRemoved = 0;

function runScript(name, cmd) {
  try {
    const beforeFiles = {};
    const result = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' });
    console.log(result);
    return { changed: true, output: result };
  } catch (e) {
    console.log(`${name}: ${e.stderr?.trim() || e.message || 'no change'}`);
    return { changed: false, output: e.stdout?.trim() || '' };
  }
}

const tasteResult = runScript('Taste Profile', 'node evolve/scripts/inject-taste.mjs');
const memoryResult = runScript('Memory Patterns', 'node evolve/scripts/inject-memory.mjs');
const structureResult = runScript('Project Structure', 'node evolve/scripts/inject-structure.mjs');

if (tasteResult.changed) { changedCount++; totalAdded += 1; }
if (memoryResult.changed) { changedCount++; totalAdded += 1; }
if (structureResult.changed) { changedCount++; totalAdded += 1; }

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

if (existsSync(EVOLVE_STATE)) {
  let state = readFileSync(EVOLVE_STATE, 'utf-8');
  const sessionMatch = state.match(/Total Sessions: (\d+)/);
  const currentSessions = sessionMatch ? parseInt(sessionMatch[1]) : 0;
  const decisionMatch = state.match(/Decisions Logged: (\d+)/);
  const decisionsLogged = decisionMatch ? parseInt(decisionMatch[1]) : 0;

  const newHistoryLine = `\n| ${(new Date()).toISOString().slice(0, 19).replace('T', ' ')} | taste:${tasteResult.changed ? '✓' : '✗'} mem:${memoryResult.changed ? '✓' : '✗'} struct:${structureResult.changed ? '✓' : '✗'} | ${changedCount}/3 modules | ${elapsed}s |`;
  state = state.replace(/\(每次 evolve 追加一行\)_/, '(每次 evolve 追加一行)\n' + newHistoryLine);
  state = state.replace(/Total Sessions: (\d+)/, `Total Sessions: ${currentSessions + 1}`);
  state = state.replace(/Decisions Logged: (\d+)/, `Decisions Logged: ${decisionsLogged}`);
  state = state.replace(/Last Evolved:\s*_\(.*?\)_/, `Last Evolved: ${new Date().toISOString().slice(0, 19)}`);
  writeFileSync(EVOLVE_STATE, state);
}

console.log(`\n---`);
console.log(`Total: ${changedCount}/3 modules changed, +${totalAdded}/-${totalRemoved} lines`);
console.log(`Elapsed: ${elapsed}s`);
process.exit(changedCount > 0 ? 0 : 1);
