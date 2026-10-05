// The film's scratch course: a real course, with real dates and an empty
// roster, that scene 3 can genuinely set up on camera.
//
//   node store/scratch-course.mjs                  what it is now (read only)
//   node store/scratch-course.mjs --make           create it, or put it back as it should be
//   node store/scratch-course.mjs --reset          empty the roster, ready for another take
//   node store/scratch-course.mjs --reset --one    empty it, then leave ONE trainee
//
// --one is for working on scene 4 by itself. Played in order the film does
// not need it: scene 3 pastes twelve people onto this course, and scene 4
// cuts to one of them to show the centre's own wording as a trainee sees
// it. But jumping straight to scene 4, or running the film's ?check=1, finds
// an empty course -- so --one leaves somebody there. Scene 3 must still be
// able to start from nothing, which is why this is a flag and not the
// default.
//
// WHY IT EXISTS. Scene 3 shows a centre setting its course up and pasting in
// twelve trainees. On the demo course that cannot be filmed honestly: the
// demo already has twelve people, and its dates are deliberately empty so it
// never ages, so the Settings tab shows blank date fields and the assessor
// line says the link does not expire yet. Both are true of the demo and
// wrong for the scene. A scratch course has dates, starts empty, and can be
// emptied again between takes.
//
// It never touches a course that is somebody's (KEEP). It finds its own course by name and refuses
// anything else.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const NAME = 'Film scratch — not a demo';
/* The courses that are somebody's: C/18, C/17, the finished film course and
   the two standing demos. c3 left this list on 2 Oct 2026 -- the old running
   demo in that slot was deleted on 30 Sep and the slot is where a fresh
   scratch course now lands. The name check above is the real guard. */
const KEEP = new Set(['c1', 'c2', 'c4', 'c6', 'c7']);
const MAKE = process.argv.includes('--make');
const RESET = process.argv.includes('--reset');
const ONE = process.argv.includes('--one');
// Not one of the twelve scene 3 pastes in, so the two can never collide.
const KEEPER = { name: 'Marta Kowalczyk', group: '1' };

// Real dates, so the Settings tab is filled and the assessor link has an
// expiry to state. A month starting next Monday reads like any course.
const monday = (() => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + ((8 - d.getUTCDay()) % 7 || 7));
  return d;
})();
const iso = (d) => d.toISOString().slice(0, 10);
const plus = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; };

const SETTINGS = {
  start: iso(monday),
  end: iso(plus(monday, 25)),
  centreName: 'Elmswood English Centre',
  centreNumber: 'TR999',
  courseName: 'CELTA — October 2026',
  tpCount: 8,
  totalHours: 120,
  deliveryMode: 'f2f',
  tutorNames: 'Jordan Blake, Diane Okonkwo',
  planDueNote: '',
  selfDueNote: '',
  docs: {},
  logo: '',
  gradeForm: {},
};

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

const list = await call({ op: 'ownerCourses', owner: OWNER });
if (!list.ok) { console.error('ownerCourses failed: ' + list.error); process.exit(1); }
const courses = list.result.courses || list.result;
let course = courses.find((c) => c.name === NAME);

if (course && KEEP.has(course.id)) { console.error('refusing to touch ' + course.id); process.exit(1); }

if (!course) {
  if (!MAKE) {
    console.log(`No scratch course yet. Run with --make.`);
    process.exit(0);
  }
  const made = await call({ op: 'createCourse', owner: OWNER, centreNumber: 'TR999', centreName: 'Elmswood English Centre', name: NAME });
  if (!made.ok) { console.error('could not create it: ' + made.error); process.exit(1); }
  course = made.result.course || made.result;
  if (KEEP.has(course.id)) { console.error('refusing: got ' + course.id); process.exit(1); }
  console.log('created ' + course.id);
}

console.log(`\n${NAME}  (${course.id})`);

if (MAKE) {
  // Dates FIRST, while the roster is empty: the store seals a course's window
  // when its first trainee is added, and after that the start cannot move.
  const s = await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: SETTINGS });
  console.log('settings: ' + (s.ok ? `${SETTINGS.start} → ${SETTINGS.end}` : 'FAILED ' + s.error));
}

if (MAKE || RESET) {
  /* Re-read between passes rather than working from one snapshot. Removing
     from a list taken up front reported "removed 24 of 24" and left twelve
     behind: every call answered ok, including the ones aimed at tokens the
     earlier removals had already shifted. The roster's own count is the only
     thing worth believing, so this loops until it says zero. */
  let gone = 0, pass = 0;
  for (; pass < 8; pass++) {
    const r = await call({ op: 'roster', key: course.tutorKey });
    const people = (r.result && r.result.trainees) || [];
    if (!people.length) break;
    for (const p of people) {
      const g = await call({ op: 'removeTrainee', key: course.tutorKey, token: p.token });
      if (g.ok) gone++; else console.log(`  could not remove ${p.name}: ${g.error}`);
    }
  }
  // Purging does not give a place back -- by design, so a link cannot be
  // reused as a second course. On the scratch course that would burn the cap
  // after two takes, so the owner puts the counter back.
  const seats = await call({ op: 'seats', owner: OWNER, course: course.id, ever: 0 });
  // Read it back rather than trusting the loop: the first version of this
  // reported "emptied 12" and left twelve on the course.
  if (ONE) {
    const add = await call({ op: 'addTrainee', key: course.tutorKey, name: KEEPER.name, group: KEEPER.group });
    console.log(`one trainee: ${add.ok ? KEEPER.name : 'FAILED ' + add.error}`);
  }

  const check = await call({ op: 'roster', key: course.tutorKey });
  const left = ((check.result && check.result.trainees) || []).length;
  if (ONE) {
    console.log(`roster: ${gone} removed, ${left} left (should be 1)`);
    if (left !== 1) { console.error('\nExpected exactly one candidate.'); process.exit(1); }
    process.exit(0);
  }
  console.log(`roster: ${gone} removed over ${pass} pass${pass === 1 ? '' : 'es'}, ${left} left; seats.ever reset: ${seats.ok ? 'yes' : 'no (' + seats.error + ')'}`);
  if (left) { console.error('\nThe roster did not empty. Not safe to film scene 3 on it.'); process.exit(1); }
}

const after = await call({ op: 'course', key: course.tutorKey });
const cs = (after.result && after.result.settings) || {};
const roster = await call({ op: 'roster', key: course.tutorKey });
console.log(`now: ${cs.courseName || '(no name)'} · ${cs.start || '?'} → ${cs.end || '?'} · ${((roster.result && roster.result.trainees) || []).length} trainees`);
console.log(`\nfilm URL for scene 3 — add this to the film's own address:\n  &s=${course.tutorKey}\n`);
