/* The store, for the tools in this folder.
 *
 * THE KEYS ARE NOT IN HERE AND MUST NEVER BE. connect-Hub is public, and a
 * committed key is what made C/17's grades readable by anyone who found this
 * repository. Both keys are read at run time:
 *
 *   LIBRARY  the course the TP point library lives on, from the LIBRARY_KEY
 *            environment variable or .library-key beside the repo
 *   OWNER    the owner key, from OWNER_KEY or .owner-key, read only when
 *            something actually asks for it -- most of the checks never do,
 *            and they should still run on a machine that has no owner key
 *
 * Both files are gitignored. If one is missing the error says which file to
 * make rather than failing somewhere inside a fetch.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');

function secret(envName, fileName, what) {
  const fromEnv = (process.env[envName] || '').trim();
  if (fromEnv) return fromEnv;
  const p = path.join(ROOT, fileName);
  try {
    const v = fs.readFileSync(p, 'utf8').trim();
    if (v) return v;
  } catch { /* fall through to the message */ }
  throw new Error(`no ${what}: set ${envName}, or put it in ${p} (both are gitignored)`);
}

export const STORE = fs.readFileSync(path.join(ROOT, 'hub-store.js'), 'utf8')
  .match(/https:\/\/script\.google\.com[^"']+/)[0];

/* The library's course. Every check reads it; none of them should spell it. */
export const LIBRARY = secret('LIBRARY_KEY', '.library-key', 'library course key');

/* Only the owner tools need this, so it is not read until one asks. */
let _owner = null;
export function owner() {
  if (_owner === null) _owner = secret('OWNER_KEY', '.owner-key', 'owner key');
  return _owner;
}

/* THE ENDPOINT DROPS THE SOCKET. An uncaught fetch throw ends a run mid-write,
   once with the whole payload already sent, so whether it landed could not be
   told from here. A dropped connection is transient like any other answer. */
export async function call(b, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
      const t = await r.text();
      try { const j = JSON.parse(t); if (j.ok || !j.transient) return j; } catch { }
    } catch (e) {
      if (i === tries - 1) return { ok: false, error: 'network: ' + (e.message || e) };
    }
    await new Promise(x => setTimeout(x, 2500 * (i + 1)));
  }
  return { ok: false, error: 'gave up' };
}

/* THE STORE SOMETIMES ANSWERS ok WITH THE RECORD MISSING. Three times on
   4 Oct 2026 a course read came back ok:true with no tppoints at all; a script
   that read, changed and wrote would have put an empty record over four sets.
   Read through this instead: it retries, and throws rather than hand back a
   record that is not there. */
export async function readCourse(key = LIBRARY, kind = 'tppoints', tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await call({ op: 'course', key });
    const recs = (r.result && (r.result.records || r.result)) || {};
    if (recs[kind]) return { recs, rec: recs[kind] };
    await new Promise(x => setTimeout(x, 2000 * (i + 1)));
  }
  throw new Error(`the store kept answering without a ${kind} record — nothing written`);
}
