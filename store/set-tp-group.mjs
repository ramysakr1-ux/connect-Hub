// Put every trainee on a course into one teaching-practice group.
//
//   node store/set-tp-group.mjs c1 A
//   node store/set-tp-group.mjs c1 A --write
//
// WHY. Handbook 7.1: a TP group must consist of 4-6 candidates. C/18 2026 had
// six trainees split three and three, so BOTH groups were short and the
// assessor pack's Handbook panel flagged it red (found opening the pack,
// 29 Sep 2026). With six people the only arrangement that passes is one group
// of six: 4+2, 5+1 and 3+3 all fail. Ramy, 29 Sep 2026: "one group of six."
//
// It moves nobody's records -- the group is a field on the roster row, and
// `renameTrainee` is the op that writes the pair (name, group) together, so
// the name is read first and passed back unchanged.
//
// GUARDS.
//   - A roster read with no trainees is a FAILED read, not an empty course.
//   - It refuses a resulting group size outside 4-6, which is the rule it
//     exists to satisfy.
//   - Nothing is written without --write, and the roster is read back after.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const courseId = process.argv[2];
const group = process.argv[3];
const WRITE = process.argv.includes('--write');
if (!courseId || !group || courseId.startsWith('--') || group.startsWith('--')) {
  console.error('Usage: node store/set-tp-group.mjs <courseId> <group> [--write]');
  process.exit(1);
}

const call = async (body) => {
  for (let i = 0; i < 5; i++) {
    try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) })).json(); if (r && r.ok) return r.result; if (r && r.error) throw new Error(r.error); }
    catch (e) { if (i === 4) throw e; }
    await new Promise((r) => setTimeout(r, 1300));
  }
};

const { courses } = await call({ op: 'ownerCourses', owner: OWNER });
const course = courses.find((c) => c.id === courseId);
if (!course) { console.error('No course ' + courseId); process.exit(1); }
console.log(courseId + ' — ' + (course.courseName || course.name || ''));

const r = await call({ op: 'roster', key: course.tutorKey });
/* `trainees` comes back as an ARRAY, so Object.entries gives 0,1,2... and
   passing one of those as the token gets "This link is not on the course"
   (29 Sep 2026). The token is a field on the row. */
const trainees = (r && r.trainees) || [];
const rows = Object.values(trainees).filter(Boolean);
if (!rows.length) { console.error('Roster read came back empty — refusing. Run it again.'); process.exit(1); }

const was = {};
rows.forEach((v) => { const g = v.group || '(none)'; was[g] = (was[g] || 0) + 1; });
console.log('now : ' + Object.entries(was).map(([g, n]) => g + ' has ' + n).join(', '));
console.log('after: ' + group + ' has ' + rows.length);

if (rows.length < 4 || rows.length > 6) {
  console.error('That would make a group of ' + rows.length + ', outside Handbook 7.1’s 4-6 — refusing.');
  process.exit(1);
}
const moving = rows.filter((v) => (v.group || '') !== group);
console.log('moving: ' + (moving.length ? moving.map((v) => v.name + ' (' + (v.group || 'none') + ')').join(', ') : 'nobody'));
if (!moving.length) { console.log('Already one group — nothing to write.'); process.exit(0); }
if (!WRITE) { console.log('\nDry run. Add --write to save it.'); process.exit(0); }

for (const v of moving) {
  if (!v.token) { console.error('No token on ' + (v.name || '?') + ' \u2014 stopping.'); process.exit(1); }
  await call({ op: 'renameTrainee', key: course.tutorKey, token: v.token, name: v.name, group });
  console.log('  moved ' + v.name);
}

const back = await call({ op: 'roster', key: course.tutorKey });
const after = {};
Object.values((back && back.trainees) || []).forEach((v) => { const g = v.group || '(none)'; after[g] = (after[g] || 0) + 1; });
console.log('\nread back: ' + Object.entries(after).map(([g, n]) => g + ' has ' + n).join(', '));
Object.values((back && back.trainees) || []).forEach((v) => console.log('  ' + (v.name || '?').padEnd(20) + ' ' + (v.group || '(none)') + '  records: ' + Object.keys(v.records || {}).length));
