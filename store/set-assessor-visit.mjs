// The assessor visit's date and the course's notification reference — the two
// settings fields that live only on the centre admin screen.
//
//   node store/set-assessor-visit.mjs c4
//   node store/set-assessor-visit.mjs c4 --date 2026-09-01 --ref TR073-C16/2026
//   node store/set-assessor-visit.mjs c4 --observe "Deniz, Marcus, Selin"
//   node store/set-assessor-visit.mjs c4 --clear
//
// They are what the assessor pack builds its "lesson plans for the day of the
// assessment" section from, and what it heads the pack with. A pack with no
// visit date hides that section rather than breaking, which is the intended
// behaviour, so this is a filling-in, not a repair.
//
// --observe is the MCT's choice of which candidates the assessor will observe
// (Handbook 14.2). It is stored as a list of candidate TOKENS -- the pack keeps
// only the ids it can still find on the roster -- so names are given here and
// resolved against the roster. A name that matches more than one candidate, or
// none, stops the whole thing: three names are three people, and half a list
// written to the course is worse than none.
//
// GUARDED the way the other settings writers are: a `course` read that comes
// back with too few fields is a FAILED READ, and putCourse REPLACES.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const courseId = process.argv[2];
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const date = arg('--date');
const ref = arg('--ref');
const observe = arg('--observe');
const CLEAR = process.argv.includes('--clear');
if (!courseId || courseId.startsWith('--')) { console.error('Usage: node store/set-assessor-visit.mjs <courseId> [--date YYYY-MM-DD] [--ref TEXT] [--observe "Name, Name"] [--clear]'); process.exit(1); }
if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('--date must be YYYY-MM-DD'); process.exit(1); }

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true, error: 'non-JSON' }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) { const r = await once(b); if (r.ok || !r.transient) return r; await new Promise((x) => setTimeout(x, 3000 * (i + 1))); }
  return { ok: false, error: 'gave up' };
};

const list = await call({ op: 'ownerCourses', owner: OWNER });
if (!list.ok) { console.error('ownerCourses failed: ' + list.error); process.exit(1); }
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
if (!course) { console.error('no course ' + courseId); process.exit(1); }

const read = await call({ op: 'course', key: course.tutorKey });
const cur = (read.result && read.result.settings) || {};
const n = Object.keys(cur).length;
if (n < 6) { console.error(`Read returned only ${n} settings fields. That is a FAILED READ — refusing to write over it.`); process.exit(1); }

const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];
const nameOf = (tok) => (people.find((p) => p.token === tok) || {}).name || '(not on the roster)';

console.log(`${courseId} — ${course.name}`);
console.log(`  visitDate now: ${JSON.stringify(cur.visitDate || '')}   notificationRef now: ${JSON.stringify(cur.notificationRef || '')}`);
console.log(`  observed now: ${(cur.assessorVisit || []).map(nameOf).join(', ') || '(nobody chosen)'}`);
if (!date && !ref && !observe && !CLEAR) { console.log('\nRead only. Pass --date, --ref and/or --observe, or --clear.\n'); process.exit(0); }

/* Names to tokens. Exact first, then a unique prefix -- "Deniz" for Deniz
   Arslan. Anything ambiguous or unfound stops everything. */
let picks = null;
if (observe) {
  const wanted = observe.split(',').map((x) => x.trim()).filter(Boolean);
  if (!wanted.length) { console.error('--observe was empty'); process.exit(1); }
  picks = [];
  for (const want of wanted) {
    const lc = want.toLowerCase();
    let hits = people.filter((p) => p.name.toLowerCase() === lc);
    if (!hits.length) hits = people.filter((p) => p.name.toLowerCase().startsWith(lc));
    if (!hits.length) hits = people.filter((p) => p.name.toLowerCase().includes(lc));
    if (hits.length !== 1) {
      console.error(`"${want}" matches ${hits.length} candidates${hits.length ? ': ' + hits.map((h) => h.name).join(', ') : ''} — writing nothing.`);
      process.exit(1);
    }
    picks.push(hits[0]);
  }
  console.log(`  observed after: ${picks.map((p) => p.name).join(', ')}`);
}

const next = { ...cur };
if (CLEAR) { delete next.visitDate; delete next.notificationRef; delete next.assessorVisit; }
if (date) next.visitDate = date;
if (ref) next.notificationRef = ref;
if (picks) next.assessorVisit = picks.map((p) => p.token);

const w = await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: next });
if (!w.ok) { console.error('write refused: ' + w.error); process.exit(1); }
const after = ((await call({ op: 'course', key: course.tutorKey })).result || {}).settings || {};
console.log(`  visitDate after: ${JSON.stringify(after.visitDate || '')}   notificationRef after: ${JSON.stringify(after.notificationRef || '')}`);
console.log(`  observed after: ${(after.assessorVisit || []).map(nameOf).join(', ') || '(nobody chosen)'}`);
console.log(`  settings fields: ${n} before, ${Object.keys(after).length} after`);
if (Object.keys(after).length < n) { console.error('\nFields were lost. Put them back before doing anything else.'); process.exit(1); }
