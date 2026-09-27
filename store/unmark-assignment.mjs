// Put one assignment back to unmarked, leaving the candidate's own work alone.
//
//   node store/unmark-assignment.mjs c3 "Anastasia" fol
//   node store/unmark-assignment.mjs c3 "Anastasia" fol --write
//
// WHY. The film's take drove a real marking sheet and clicked all six criteria
// on it (27 Sep 2026). The engine stubs the store's `put`, and the marks
// reached the store anyway, so a candidate on the running demo has an
// assignment that reads as marked when nobody marked it. Ramy: "undo the
// marks the film left on Anastasia."
//
// It clears the MARKS and nothing else: the submission, the stage, the marker
// names and both general comments are written back exactly as they were, and
// the whole record is compared field by field afterwards. It refuses outright
// if the assignment has been closed, because clearing the marks under a
// recorded outcome would leave a pass with nothing behind it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const [courseId, who, key] = process.argv.slice(2);
const WRITE = process.argv.includes('--write');
if (!courseId || !who || !key) { console.error('Usage: node store/unmark-assignment.mjs <courseId> <name> <assignment> [--write]'); process.exit(1); }
if (courseId === 'c2') { console.error('refusing c2 — that is the real C/17 grades course'); process.exit(1); }

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) { const r = await once(b); if (r.ok || !r.transient) return r; await new Promise((x) => setTimeout(x, 3000 * (i + 1))); }
  return { ok: false, error: 'gave up' };
};

const list = await call({ op: 'ownerCourses', owner: OWNER });
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
if (!course) { console.error('no course ' + courseId); process.exit(1); }
const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];
const hits = people.filter((p) => p.name.toLowerCase().includes(who.toLowerCase()));
if (hits.length !== 1) { console.error(`"${who}" matches ${hits.length} candidates`); process.exit(1); }
const p = hits[0];

const rec = (p.records || {}).assignments;
const before = rec && (rec.data || rec);
const sub = before && before[key];
if (!sub) { console.error(`${p.name} has no ${key}`); process.exit(1); }
if (sub.stage === 'closed') { console.error(`${key} is CLOSED with outcome ${JSON.stringify((sub.feedback||{}).outcome)} — refusing, clearing marks under a recorded outcome would leave a pass with nothing behind it`); process.exit(1); }

console.log(`${p.name} · ${key} · stage ${sub.stage}`);
console.log(`  marks now     : ${JSON.stringify((sub.criteriaMarks || {}).sub1 || [])}`);
console.log(`  comments now  : ${JSON.stringify(((sub.criteriaComments || {}).sub1 || []).filter(Boolean).length)} written`);
console.log(`  the submission: ${sub.sub1 ? 'present, and not touched by this' : 'none'}`);
if (!WRITE) { console.log('\nRead only. Add --write.\n'); process.exit(0); }

const next = JSON.parse(JSON.stringify(before));
const t = next[key];
t.criteriaMarks = { sub1: [], sub2: [] };
t.criteriaComments = { sub1: [], sub2: [] };
if (t.feedback) { t.feedback.generalComment1 = ''; t.feedback.generalComment2 = ''; }

const w = await call({ op: 'put', key: course.tutorKey, token: p.token, kind: 'assignments', data: next });
if (!w.ok) { console.error('write refused: ' + w.error); process.exit(1); }

const read = await call({ op: 'get', key: course.tutorKey, token: p.token, kind: 'assignments' });
let after = read.ok ? read.result : null; if (after && after.data) after = after.data;
const a = after && after[key];
if (!a) { console.error('the record came back empty — check it before anything else'); process.exit(1); }

/* Everything that is not the marks must be identical, including the other
   assignments on the record. */
const problems = [];
if (JSON.stringify(a.sub1) !== JSON.stringify(sub.sub1)) problems.push('the submission changed');
if (a.stage !== sub.stage) problems.push(`stage changed to ${a.stage}`);
if (JSON.stringify(a.markers) !== JSON.stringify(sub.markers)) problems.push('the marker record changed');
if ((a.criteriaMarks.sub1 || []).length) problems.push('marks are still there');
for (const k of Object.keys(before)) if (k !== key && JSON.stringify(after[k]) !== JSON.stringify(before[k])) problems.push(`${k} changed and should not have`);

console.log(problems.length ? '\nPROBLEMS:\n  ' + problems.join('\n  ')
  : `\nUnmarked. Stage still ${a.stage}, the submission and the marker record untouched, the other assignments untouched.`);
process.exit(problems.length ? 1 : 0);
