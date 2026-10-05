// READ ONLY. Are the two demo courses permanent and whole?
//
//   node store/check-demo-permanent.mjs
//
// A demo course must never age: no start, no end, so its assessor link --
// the door the offer card carries -- never expires (the store computes the
// expiry from the course's end date + 14 -- our own window, matching the
// assessor's two-week reporting deadline at Handbook 15.2, not a Cambridge
// rule). And its settings
// must be whole: `putCourse` REPLACES, so a bad merge can leave a course
// with two fields where it had fourteen.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COURSE as FINISHED } from '../demo-finished-data.mjs';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

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

let bad = 0;
const ok = (pass, msg) => { console.log((pass ? '  ok   ' : '  FAIL ') + msg); if (!pass) bad++; };

const list = await call({ op: 'ownerCourses', owner: OWNER });
if (!list.ok) { console.error('ownerCourses failed: ' + list.error); process.exit(1); }
const courses = list.result.courses || list.result;

console.log('\nAre the demo courses permanent?\n');
for (const id of ['c3', 'c4']) {
  const c = courses.find((x) => x.id === id);
  if (!c) { ok(false, `${id} is missing`); continue; }
  console.log(`${id} — ${c.name}`);
  const s = (await call({ op: 'course', key: c.tutorKey })).result?.settings || {};
  const n = Object.keys(s).length;
  ok(n >= 14, `settings whole: ${n} fields`);
  ok(!s.start && !s.end, `no dates: start=${JSON.stringify(s.start)} end=${JSON.stringify(s.end)}`);
  ok(!!s.courseName, `courseName: ${JSON.stringify(s.courseName)}`);
  if (id === 'c4') ok(!!s.gradeForm && !!s.gradeForm.tp, 'the grade-form paragraphs survived');
  const link = await call({ op: 'assessorLink', key: c.tutorKey });
  const exp = (link.result || {}).expires;
  ok(exp === null || exp === undefined, `assessor link never expires (expires=${JSON.stringify(exp)})`);
  const ak = (link.result || {}).key;
  if (ak) {
    const rd = await call({ op: 'course', a: ak });
    ok(rd.ok, `the assessor key opens the course${rd.ok ? '' : ' — ' + rd.error}`);
  }
  const roster = await call({ op: 'roster', key: c.tutorKey });
  ok(roster.ok && (roster.result.trainees || []).length === 12, `twelve trainees: ${roster.ok ? (roster.result.trainees || []).length : 'FAIL'}`);
  console.log('');
}

console.log(bad ? `${bad} to look at.\n` : 'Both demo courses are permanent and whole.\n');
process.exit(bad ? 1 : 0);
