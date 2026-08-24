/**
 * Extracts the directive from the mobile app's source and computes its SHA-256.
 *
 * The hash published on the website has to be byte-identical to the one the app
 * computes on device, or the whole "you can verify nothing changed" claim is
 * worse than not making it. Rather than transcribing the text into this repo by
 * hand — where a curly quote or a missing em dash would silently produce a
 * different hash — this reads the app's `src/domain/directive.ts` directly and
 * reproduces its `canonicalDirective()` exactly.
 *
 * Usage:
 *   node scripts/directive-hash.mjs [path-to-app-repo]
 *
 * Exits non-zero if the app source cannot be found or parsed, so this can be
 * wired into CI as a parity gate.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const appRepo = resolve(process.argv[2] ?? '../manourying');
const source = join(appRepo, 'src', 'domain', 'directive.ts');

let text;
try {
  text = readFileSync(source, 'utf8');
} catch {
  console.error(`Could not read ${source}`);
  console.error('Pass the app repo path: node scripts/directive-hash.mjs ../manourying');
  process.exit(1);
}

const block = /export const DIRECTIVE_STEPS[^=]*=\s*\[([\s\S]*?)\n\];/.exec(text);
if (!block) {
  console.error('DIRECTIVE_STEPS not found — has the app source been restructured?');
  process.exit(1);
}

/**
 * Pulls a single-quoted TS string, tolerating the multi-line form Prettier
 * produces for the longer `detail:` values.
 */
function field(objectSource, name) {
  const m = new RegExp(`${name}:\\s*(?:\\n\\s*)?'((?:[^'\\\\]|\\\\.)*)'`).exec(objectSource);
  return m ? m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null;
}

const steps = [];
for (const chunk of block[1].split(/\}\s*,?\s*(?=\{|$)/)) {
  if (!chunk.includes('at:')) continue;
  const at = field(chunk, 'at');
  const heading = field(chunk, 'heading');
  const detail = field(chunk, 'detail');
  if (at && heading && detail) steps.push({ at, heading, detail });
}

if (steps.length === 0) {
  console.error('Parsed zero steps out of DIRECTIVE_STEPS.');
  process.exit(1);
}

// Must match `canonicalDirective()` in the app, character for character.
const canonical = steps.map((s) => `${s.at}\t${s.heading}\t${s.detail}`).join('\n');
const hash = createHash('sha256').update(canonical, 'utf8').digest('hex');

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ steps, canonical, hash }, null, 2));
} else {
  console.log(`steps:  ${steps.length}`);
  for (const s of steps) console.log(`  ${s.at}  ${s.heading}`);
  console.log(`\nsha256: ${hash}`);
}
