/**
 * Connect Lite — drop chosen TP point sets from the library onto one course.
 *
 *   node store/put-tp-point-sets.mjs --key <courseKey>              what it would write
 *   node store/put-tp-point-sets.mjs --key <courseKey> --write      write it
 *   node store/put-tp-point-sets.mjs --key <courseKey> --write --only s2,s4
 *
 * THE LIBRARY LIVES IN library/tp-point-sets.json, NOT IN A COURSE. A set is
 * twelve sessions of three 45-minute slots, written against one coursebook
 * edition, with the pages and the recordings attached. It belongs to a tutor
 * and their book, not to a course.
 *
 * Always pass --only. A course record is pushed to every browser that opens
 * the course, so a centre's course carries the two or three sets its tutors
 * teach from and nothing else. Four sets are already 300 KB; the library is
 * heading for three sets a level across five levels, and no candidate's phone
 * should be pulling down fourteen sets to read one.
 *
 *   s1  Language Hub Elementary, 1st ed (Macmillan 2019)        A2
 *   s2  Roadmap A2+, 1st ed (Pearson 2019)                      B1 pre-int
 *   s3  Straightforward Upper-Intermediate, 1st ed (Macmillan)  B2
 *   s4  Speakout A1, 3rd ed (Pearson 2022)                      A1
 *
 * This writes `set.library` and leaves `set.setFor` alone -- which group
 * teaches from which set is the tutor's to say on the TP point sets screen,
 * and Apply on the TP points screen is what deals the slots. Everything else
 * on the record is carried through untouched, because the store rebuilds a
 * TP points record from named keys on read and drops what it is not handed.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const arg = n => { const i = process.argv.indexOf(n); return i < 0 ? '' : (process.argv[i + 1] || ''); };
const WRITE = process.argv.includes('--write');
const KEY = arg('--key');
const ONLY = arg('--only');
if (!KEY) { console.log('say --key <courseKey>'); process.exit(1); }

const STORE = (readFileSync(join(ROOT, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const call = async (b, tries = 6) => {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
      return JSON.parse(await r.text());
    } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};

const FILE = JSON.parse(readFileSync(join(ROOT, 'library', 'tp-point-sets.json'), 'utf8'));
/* --only s2,s4 -- a centre takes the sets for the levels it teaches, not the
   whole library. */
const want = ONLY ? ONLY.split(',').map(x => x.trim()).filter(Boolean) : Object.keys(FILE);
const missing = want.filter(id => !FILE[id]);
if (missing.length) { console.log('no set called ' + missing.join(', ') + ' in the library. It holds: ' + Object.keys(FILE).join(', ')); process.exit(1); }
if (!ONLY) console.log('No --only, so this would put the WHOLE library on one course. Name the sets the centre chose.\n');
const lib = {};
want.forEach(id => { lib[id] = FILE[id]; });

const r = await call({ op: 'course', key: KEY });
if (!r.ok) { console.log('cannot read that course: ' + r.error); process.exit(1); }
const recs = (r.result && (r.result.records || r.result)) || {};
const P = recs.tppoints || {};
const held = (P.set && P.set.library) || {};

Object.keys(lib).forEach(id => {
  const s = lib[id];
  const slots = Object.keys(s.sessions || {}).reduce((a, k) => a + (s.sessions[k].slots || []).length, 0);
  const stages = Object.keys(s.sessions || {}).reduce((a, k) =>
    a + (s.sessions[k].slots || []).reduce((b, sl) => b + (sl.stages || []).length, 0), 0);
  console.log(`  ${id}  ${s.name || s.book}  ${slots} slots, ${stages} stages${held[id] ? '  (replaces a set already there)' : ''}`);
});
console.log(`  sets already on the course and kept: ${Object.keys(held).filter(k => !lib[k]).join(', ') || 'none'}`);

if (!WRITE) { console.log('\ndry run. Add --write.'); process.exit(0); }
P.set = Object.assign({}, P.set, { library: Object.assign({}, held, lib) });
const w = await call({ op: 'putCourse', key: KEY, kind: 'tppoints', data: P });
console.log(w.ok ? '\nwritten. Open the TP points screen and Apply.' : '\nFAILED: ' + w.error);

/* Read it back -- a write that answers ok can still have dropped a field. */
const back = await call({ op: 'course', key: KEY });
const got = ((((back.result && (back.result.records || back.result)) || {}).tppoints || {}).set || {}).library || {};
console.log('read back: ' + (Object.keys(got).join(', ') || 'NOTHING — the set did not survive the write'));
