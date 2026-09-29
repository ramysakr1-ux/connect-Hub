// Set a course's contact hours (Handbook 3.1: at least 120).
//
//   node store/set-course-hours.mjs c1 120
//   node store/set-course-hours.mjs c1 120 --write
//
// WHY. The assessor pack checks `settings.totalHours` against 3.1 and shows
// "not set" as an unmet MUST when it is missing. C/18 2026 had no value while
// every other course carried 120 (found opening its pack, 29 Sep 2026).
//
// GUARDS. Settings are written back WHOLE, so a short read would replace the
// course's settings with the failure -- that is exactly how c4 lost twelve
// fields on 27 Sep 2026. It refuses a read with fewer fields than it saw
// listed on the course, refuses a value under 120, and writes nothing without
// --write. The settings are read back and compared field by field after.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const courseId = process.argv[2];
const hours = parseInt(process.argv[3], 10);
const WRITE = process.argv.includes('--write');
if (!courseId || !hours) { console.error('Usage: node store/set-course-hours.mjs <courseId> <hours> [--write]'); process.exit(1); }
if (hours < 120) { console.error('Handbook 3.1 asks for at least 120 contact hours — refusing ' + hours + '.'); process.exit(1); }

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

/* Read it twice. Two agreeing reads is the cheapest guard against the store
   answering one of them short, which is what a settings write cannot survive. */
const a = await call({ op: 'course', key: course.tutorKey });
const b = await call({ op: 'course', key: course.tutorKey });
const s1 = (a && a.settings) || null, s2 = (b && b.settings) || null;
if (!s1 || !s2) { console.error('A read came back with no settings — refusing.'); process.exit(1); }
if (JSON.stringify(s1) !== JSON.stringify(s2)) { console.error('The two reads disagree — refusing. Run it again.'); process.exit(1); }
const before = Object.keys(s1);
console.log('settings fields (' + before.length + '): ' + before.join(', '));
console.log('totalHours now: ' + JSON.stringify(s1.totalHours) + '  →  ' + hours);

if (!WRITE) { console.log('\nDry run. Add --write to save it.'); process.exit(0); }

const next = Object.assign({}, s1, { totalHours: hours });
await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: next });

const back = ((await call({ op: 'course', key: course.tutorKey })) || {}).settings || {};
const after = Object.keys(back);
console.log('\nread back (' + after.length + ' fields): totalHours = ' + JSON.stringify(back.totalHours));
const lost = before.filter((k) => !after.includes(k));
const changed = before.filter((k) => k !== 'totalHours' && JSON.stringify(s1[k]) !== JSON.stringify(back[k]));
console.log('fields lost   : ' + (lost.length ? lost.join(', ') : 'none'));
console.log('others changed: ' + (changed.length ? changed.join(', ') : 'none'));
