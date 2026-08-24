/**
 * Parity gate: the website and the mobile app must not disagree about facts.
 *
 * Two codebases ship independently, and the moment they say different things
 * about the instant, the pitch, or the directive, the project's central claim —
 * that you can verify nothing was changed — stops being true. This compares the
 * values that appear in both and fails loudly on any difference.
 *
 * It is deliberately tolerant of the app repo being absent (a fresh clone of
 * just this repo should still build), but if the app *is* there and disagrees,
 * that is an error, not a warning.
 *
 * Usage:  node scripts/check-parity.mjs [path-to-app-repo]
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const appRepo = resolve(process.argv[2] ?? '../manourying');
const webRoot = resolve('web');

function read(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

/** Pulls a single-quoted TS string, tolerating Prettier's multi-line form. */
function field(source, name) {
  const m = new RegExp(`${name}:\\s*(?:\\n\\s*)?'((?:[^'\\\\]|\\\\.)*)'`).exec(source);
  return m ? m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null;
}

function extractSteps(source) {
  const block = /DIRECTIVE_STEPS[^=]*=\s*\[([\s\S]*?)\n\];/.exec(source);
  if (!block) return null;
  const steps = [];
  for (const chunk of block[1].split(/\}\s*,?\s*(?=\{|$)/)) {
    if (!chunk.includes('at:')) continue;
    const at = field(chunk, 'at');
    const heading = field(chunk, 'heading');
    const detail = field(chunk, 'detail');
    if (at && heading && detail) steps.push({ at, heading, detail });
  }
  return steps.length ? steps : null;
}

const canonicalise = (steps) =>
  steps.map((s) => `${s.at}\t${s.heading}\t${s.detail}`).join('\n');
const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

const problems = [];
const checks = [];

// ---- the directive, and therefore the published hash ----------------------

const appDirective = read(join(appRepo, 'src', 'domain', 'directive.ts'));
const webDirective = read(join(webRoot, 'src', 'lib', 'directive.ts'));

if (!webDirective) {
  problems.push('web/src/lib/directive.ts is missing.');
} else if (!appDirective) {
  console.warn(`! app repo not found at ${appRepo} — skipping directive parity.`);
  console.warn('  Pass its path: node scripts/check-parity.mjs ../manourying\n');
} else {
  const appSteps = extractSteps(appDirective);
  const webSteps = extractSteps(webDirective);

  if (!appSteps) problems.push('Could not parse DIRECTIVE_STEPS out of the app source.');
  else if (!webSteps) problems.push('Could not parse DIRECTIVE_STEPS out of the site source.');
  else {
    const appHash = sha256(canonicalise(appSteps));
    const webHash = sha256(canonicalise(webSteps));
    if (appHash !== webHash) {
      problems.push(
        'Directive mismatch — the hash this site publishes is not the hash the app computes.\n' +
          `    app:  ${appHash}\n` +
          `    site: ${webHash}\n` +
          '    Run: node scripts/directive-hash.mjs --json  and copy the steps across.',
      );
    } else {
      checks.push(`directive sha256 ${appHash.slice(0, 16)}…`);
    }
  }
}

// ---- scalar facts that appear in both ------------------------------------

const appMoment = read(join(appRepo, 'src', 'domain', 'moment.ts'));
const webConfig = read(join(webRoot, 'src', 'config.ts'));

if (appMoment && webConfig) {
  const pairs = [
    {
      what: 'the moment',
      app: /Date\.parse\('([^']+)'\)/.exec(appMoment)?.[1],
      web: /MOMENT_UTC\s*=\s*'([^']+)'/.exec(webConfig)?.[1],
    },
    {
      what: 'the tone',
      app: /TONE_HZ\s*=\s*(\d+)/.exec(appMoment)?.[1],
      web: /TONE_HZ\s*=\s*(\d+)/.exec(webConfig)?.[1],
    },
  ];

  for (const { what, app, web } of pairs) {
    if (!app || !web) {
      problems.push(`Could not read ${what} from both sources (app=${app}, site=${web}).`);
    } else if (app !== web) {
      problems.push(`Mismatch on ${what}: app says ${app}, site says ${web}.`);
    } else {
      checks.push(`${what} ${app}`);
    }
  }
}

// ---- report --------------------------------------------------------------

if (problems.length) {
  console.error('\nParity check failed:\n');
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error('');
  process.exit(1);
}

console.log('parity: site and app agree');
for (const c of checks) console.log(`  ✓ ${c}`);
