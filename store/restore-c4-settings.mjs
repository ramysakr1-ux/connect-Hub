// Puts course c4's settings back, with its dates cleared on purpose.
//
//   node store/restore-c4-settings.mjs            (dry run, prints the diff)
//   node store/restore-c4-settings.mjs --write
//
// WHY THIS EXISTS. On 27 Sep 2026 a `course` read came back with an EMPTY
// settings object -- an Apps Script hiccup, not an empty course -- and the
// caller did `Object.assign({}, cur, {start:'', end:''})` and wrote that
// back. `putCourse` REPLACES, so twelve fields were replaced by two. The
// roster and every TP and assignment record were untouched; only `settings`
// was lost.
//
// The lesson, and the guard below: a read that returns fewer fields than it
// should has FAILED. It has not returned an empty object. Never merge onto
// it and never write the result.
//
// The values here are the ones demo-finished-data.mjs built the course with,
// so this file has no opinion of its own -- it reads them from there.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COURSE } from '../demo-finished-data.mjs';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const WRITE = process.argv.includes('--write');

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true, error: 'non-JSON' }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) {
    const r = await once(b);
    if (r.ok || !r.transient) return r;
    await new Promise((x) => setTimeout(x, 3000 * (i + 1)));
  }
  return { ok: false, error: 'gave up' };
};

// What c4 must end up holding: everything it was built with, no dates.
const want = { ...COURSE.settings, start: '', end: '' };

const list = await call({ op: 'ownerCourses', owner: OWNER });
if (!list.ok) { console.error('ownerCourses failed: ' + list.error); process.exit(1); }
const c4 = (list.result.courses || list.result).find((c) => c.id === 'c4');
if (!c4) { console.error('no c4'); process.exit(1); }

const before = (await call({ op: 'course', key: c4.tutorKey })).result?.settings || {};
console.log(`c4 holds ${Object.keys(before).length} settings fields; it should hold ${Object.keys(want).length}.`);
const missing = Object.keys(want).filter((k) => !(k in before));
console.log('missing:', missing.length ? missing.join(', ') : 'none');

if (!WRITE) {
  console.log('\nDry run. Re-run with --write to put them back.\n');
  process.exit(0);
}

const w = await call({ op: 'putCourse', key: c4.tutorKey, kind: 'settings', data: want });
if (!w.ok) { console.error('write refused: ' + w.error); process.exit(1); }

// Read back and compare every field. THE GUARD: a short read is a failed
// read, so say so rather than calling it a pass.
const after = (await call({ op: 'course', key: c4.tutorKey })).result?.settings || {};
if (Object.keys(after).length < Object.keys(want).length) {
  console.error(`\nRead-back returned only ${Object.keys(after).length} fields. That is a FAILED READ, not a failed write -- re-run the dry run before touching anything.`);
  process.exit(1);
}
let bad = 0;
for (const k of Object.keys(want)) {
  const same = JSON.stringify(after[k]) === JSON.stringify(want[k]);
  if (!same) { console.log(`  MISMATCH ${k}: ${JSON.stringify(after[k]).slice(0, 60)}`); bad++; }
}
console.log(bad ? `\n${bad} fields wrong.` : `\nAll ${Object.keys(want).length} fields restored; start and end are empty by design.`);

const link = await call({ op: 'assessorLink', key: c4.tutorKey });
console.log('assessor link expires:', JSON.stringify((link.result || {}).expires), '(null = never)');
process.exit(bad ? 1 : 0);
