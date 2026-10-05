// Put the Alternative Teaching Techniques page on a DEMO course's list of
// files for trainees (Course admin → Settings → Files for trainees).
//
//   node store/add-techniques-link.mjs c3            # shows what it would do
//   node store/add-techniques-link.mjs c3 --write
//   node store/add-techniques-link.mjs c3 --remove --write
//
// Ramy, the same evening: "why are you adding to the demo courses?" -- the
// write was my call, not his, and --remove took it back out of c3, c4, c5.
//
// Ramy, 27 Sep 2026: "add the alternative teaching techniques page as a
// trainee link". Any centre gets the line on its next Save of Settings;
// the demo courses do not press Save, so this does it for them. Refuses the
// two real courses (c1 IH Istanbul, c2 C/17), and refuses a short read: the
// settings record it writes back is the one it read plus one link, never
// less (a merge onto a short read is how c4 lost its settings, 27 Sep 2026).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const LINK = { label: 'Alternative teaching techniques', url: 'https://lite.celtaconnect.com/alternative-teaching-techniques/' };

const [courseId] = process.argv.slice(2);
const WRITE = process.argv.includes('--write');
const REMOVE = process.argv.includes('--remove');
if (!courseId) { console.error('Usage: node store/add-techniques-link.mjs <courseId> [--write]'); process.exit(1); }
/* c2 is the C/17 provisional-grades course: no trainees, nothing to link.
   c1 is Ramy's real October course; it is written only on his word, which
   --asked records (27 Sep 2026: "add it to my October course"). */
if (courseId === 'c2') { console.error('refusing c2 — the C/17 grades course has no trainees'); process.exit(1); }
if (courseId === 'c1' && !process.argv.includes('--asked')) { console.error('refusing c1 — a real course; add --asked only when Ramy has asked for this write'); process.exit(1); }

const call = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const j = await r.json(); if (!j.ok) throw new Error(j.error || 'store said no'); return j.result;
};
const { courses } = await call({ op: 'ownerCourses', owner: OWNER });
const course = courses.find((c) => c.id === courseId);
if (!course) { console.error('no course ' + courseId); process.exit(1); }
const before = await call({ op: 'course', key: course.tutorKey });
const settings = before.settings;
const fields = settings ? Object.keys(settings).length : 0;
if (!settings || fields < 10) { console.error('short read: settings has ' + fields + ' fields — not writing'); process.exit(1); }
const links = Array.isArray(settings.courseLinks) ? settings.courseLinks : [];
const has = links.some((l) => l && l.url === LINK.url);
if (!REMOVE && has) { console.log(courseId + ': already there (' + links.length + ' links)'); process.exit(0); }
if (REMOVE && !has) { console.log(courseId + ': not there (' + links.length + ' links)'); process.exit(0); }
const next = { ...settings, courseLinks: REMOVE ? links.filter((l) => !(l && l.url === LINK.url)) : links.concat([LINK]) };
console.log(courseId + ' (' + (settings.courseName || '?') + '): ' + fields + ' fields, links ' + links.length + ' → ' + next.courseLinks.length);
if (!WRITE) { console.log('dry run — add --write'); process.exit(0); }
await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: next });
const after = await call({ op: 'course', key: course.tutorKey });
const same = Object.keys(next).every((k) => JSON.stringify(after.settings[k]) === JSON.stringify(next[k])) && Object.keys(after.settings).length === Object.keys(next).length;
console.log(same ? 'written and read back: ' + Object.keys(after.settings).length + ' fields, ' + after.settings.courseLinks.length + ' links' : 'MISMATCH after write — check the record');
