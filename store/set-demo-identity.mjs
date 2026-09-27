// The demo centre's identity, the same on every demo course.
//
//   node store/set-demo-identity.mjs             what they hold now (read only)
//   node store/set-demo-identity.mjs --write
//
// WHY. Ramy, 27 Sep 2026: the demo must look authentic and be entirely made
// up. "I don't want a real centre — a made up centre with a made up logo."
//
// Elmswood English Centre is already invented, and stays. Three things were
// not right:
//
//   centreNumber  XX000 reads as an unfilled placeholder, not as a centre.
//                 A made-up one has to look like a centre number without
//                 being anyone's: TR999 is formatted like the real thing and
//                 is the number nobody is assigned. Never TR073 -- that is
//                 the centre Ramy actually works with.
//   courseName    "C/16 2026" sits one digit from his real C/17 2026, so a
//                 viewer could read the demo as his own previous course.
//                 C/1 is unmistakably a made-up code.
//   logo          There was none, so every screen showed the centre as a name
//                 with an empty box beside it. assets/elmswood-logo.svg is an
//                 elm leaf in the centre's own dark green -- deliberately none
//                 of Connect's colours, so nobody reads the centre and the
//                 product as the same organisation.
//
// The owner console shows settings.courseName in preference to the course's
// stored name (14_owner.html: `c.courseName || c.name`), so this changes what
// the console lists too -- which matters, because the console is scene 1 of
// the film and the screens after it must agree with it.
//
// It touches ONLY the demo and scratch courses, by name. c1 is IH Istanbul's
// real class tracker and c2 is C/17's provisional grades; both are refused.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const WRITE = process.argv.includes('--write');

const CENTRE_NAME = 'Elmswood English Centre';
const CENTRE_NUMBER = 'TR999';
const LOGO = (() => {
  const svg = readFileSync(join(HERE, 'assets/elmswood-logo.svg'), 'utf8').replace(/\n\s*/g, ' ').trim();
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
})();

/* Which courses, and what is theirs alone. A course not listed here is not
   touched, whatever it is called. */
const COURSES = [
  { id: 'c3', why: 'the running demo' },
  { id: 'c4', why: 'the finished demo', courseName: 'CELTA — C/1 2026', notificationRef: `${CENTRE_NUMBER}-C1/2026` },
  { id: 'c5', why: 'the film scratch course' },
];
const NEVER = new Set(['c1', 'c2']);

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
const all = list.result.courses || list.result;

console.log(`logo: ${LOGO.length} characters of SVG\n`);
let wrote = 0;
for (const want of COURSES) {
  if (NEVER.has(want.id)) { console.error('refusing ' + want.id); process.exit(1); }
  const course = all.find((c) => c.id === want.id);
  if (!course) { console.log(`${want.id} — not there, skipped`); continue; }

  const read = await call({ op: 'course', key: course.tutorKey });
  const cur = (read.result && read.result.settings) || {};
  const n = Object.keys(cur).length;
  if (n < 6) { console.error(`${want.id}: read returned only ${n} settings fields. That is a FAILED READ — writing nothing.`); process.exit(1); }

  const next = { ...cur, centreName: CENTRE_NAME, centreNumber: CENTRE_NUMBER, logo: LOGO };
  if (want.courseName) next.courseName = want.courseName;
  if (want.notificationRef) next.notificationRef = want.notificationRef;

  const changed = Object.keys(next).filter((k) => JSON.stringify(next[k]) !== JSON.stringify(cur[k]));
  console.log(`${want.id} — ${want.why}`);
  console.log(`  centre: ${JSON.stringify(cur.centreName)} ${JSON.stringify(cur.centreNumber)} → ${JSON.stringify(CENTRE_NAME)} ${JSON.stringify(CENTRE_NUMBER)}`);
  console.log(`  course: ${JSON.stringify(cur.courseName)}${want.courseName ? ' → ' + JSON.stringify(want.courseName) : ' (unchanged)'}`);
  if (want.notificationRef) console.log(`  reference: ${JSON.stringify(cur.notificationRef || '')} → ${JSON.stringify(want.notificationRef)}`);
  console.log(`  logo: ${cur.logo ? 'had one' : 'none'} → the elm mark`);
  console.log(`  fields changing: ${changed.join(', ') || 'none'}`);

  if (!WRITE || !changed.length) { console.log(''); continue; }
  const w = await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: next });
  if (!w.ok) { console.error('  write refused: ' + w.error); process.exit(1); }
  const after = ((await call({ op: 'course', key: course.tutorKey })).result || {}).settings || {};
  if (Object.keys(after).length < n) { console.error(`  FIELDS LOST: ${n} → ${Object.keys(after).length}. Put them back before anything else.`); process.exit(1); }
  const wrong = changed.filter((k) => JSON.stringify(after[k]) !== JSON.stringify(next[k]));
  console.log(wrong.length ? `  WRONG after the write: ${wrong.join(', ')}` : `  written; ${n} fields before, ${Object.keys(after).length} after`);
  if (wrong.length) process.exit(1);
  wrote++;
  console.log('');
}
if (WRITE) console.log(`${wrote} course${wrote === 1 ? '' : 's'} updated.`);
else console.log('Read only. Add --write.\n');
