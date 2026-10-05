// The one rung of the assignment cycle no demo course holds: a trainee
// sitting at "Resubmission needed", their tutor's per-criterion comments in
// front of them and one attempt left.
//
//   node store/plant-assignment-rungs.mjs            what is there now (read only)
//   node store/plant-assignment-rungs.mjs --plant
//   node store/plant-assignment-rungs.mjs --clear
//
// WHY. Scene 13 shows the written assignments going round: submitted, marked,
// sent back, resubmitted, closed. Four of those five rungs are real on the
// demo courses and need no help --
//
//   c3  Anastasia Volkova  fol  submitted           a sheet awaiting marking
//   c3  Madison Reyes      fol  returned_unmarked   sent back without marks
//   c3  Emily Carter       fol  closed              done
//   c4  Deniz Arslan       fol  closed, on resubmission -- sub1 AND sub2
//
// -- and the film reads them where they are, writing nothing. The gap is the
// middle of the story: nobody is at resubmission_needed, which is the rung
// that shows a trainee what their tutor asked them to fix. That one is
// planted HERE, on the scratch course, because the scratch course is the one
// course a take is allowed to write to (see scratch-course.mjs) and the demo
// courses are what a prospect is sent.
//
// It plants a REAL record, not an invented one: Deniz Arslan's closed fol on
// c4 rewound one step -- the resubmission dropped, the first round's marks,
// comments and outcome kept. So the text on screen is the seed's own writing
// against the same wording, and the section indices cannot drift.
//
// It never touches c1-c4. It finds the scratch course by name and refuses
// anything else. Reads from c3/c4 are reads.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const NAME = 'Film scratch — not a demo';
const KEEP = new Set(['c1', 'c2', 'c3', 'c4']);
const PLANT = process.argv.includes('--plant');
const CLEAR = process.argv.includes('--clear');

// Where the real record is read from, and which assignment the scene follows.
const SOURCE = { course: 'c4', person: 'Deniz Arslan', key: 'fol' };
// Where the wording is read from, if the scratch course has none of its own.
const WORDING_FROM = 'c3';

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

const scratch = courses.find((c) => c.name === NAME);
if (!scratch) { console.error(`No scratch course. Run: node store/scratch-course.mjs --make`); process.exit(1); }
if (KEEP.has(scratch.id)) { console.error('refusing to touch ' + scratch.id); process.exit(1); }

/* By NAME, not "whoever is first". Scene 3 pastes twelve people onto this
   course and the first of them is Defne Yilmaz -- who is also on the demo
   course, so a film playing in order would show the same name on two courses
   at two different points of the same assignment. The keeper is deliberately
   none of the twelve (see scratch-course.mjs), so she is the same person
   whether the course holds one trainee or thirteen. */
const WHO = 'Marta Kowalczyk';
const roster = await call({ op: 'roster', key: scratch.tutorKey });
let people = (roster.result && roster.result.trainees) || [];
let who = people.find((p) => p.name === WHO);
if (!who) {
  if (!PLANT) { console.error(`${WHO} is not on the scratch course. Run: node store/scratch-course.mjs --reset --one`); process.exit(1); }
  const add = await call({ op: 'addTrainee', key: scratch.tutorKey, name: WHO, group: '1' });
  if (!add.ok) { console.error(`could not add ${WHO}: ${add.error}`); process.exit(1); }
  const again = await call({ op: 'roster', key: scratch.tutorKey });
  people = (again.result && again.result.trainees) || [];
  who = people.find((p) => p.name === WHO);
  if (!who) { console.error(`${WHO} was added and is not on the roster.`); process.exit(1); }
  console.log(`  added ${WHO}`);
}

console.log(`${NAME}  (${scratch.id})`);
console.log(`  trainee: ${who.name}   (${people.length} on the course)`);

const existing = (who.records && who.records.assignments) || null;
const inner = existing && (existing.data || existing);
const stageNow = inner && inner[SOURCE.key] && inner[SOURCE.key].stage;
console.log(`  ${SOURCE.key} now: ${stageNow || 'nothing'}`);

if (!PLANT && !CLEAR) {
  console.log('\nRead only. Add --plant to plant the resubmission rung, --clear to take it away.\n');
  process.exit(0);
}

if (CLEAR) {
  const w = await call({ op: 'put', key: scratch.tutorKey, token: who.token, kind: 'assignments', data: {} });
  if (!w.ok) { console.error('clear refused: ' + w.error); process.exit(1); }
  console.log('  cleared.');
  process.exit(0);
}

/* The wording first. A record's section indices only mean anything against
   the wording they were written for, and the scratch course's wording
   self-heals in a browser but not from here -- so it is copied from c3, which
   is the same default set the source record was written against. */
const src = courses.find((c) => c.id === SOURCE.course);
const wsrc = courses.find((c) => c.id === WORDING_FROM);
if (!src || !wsrc) { console.error('could not find the demo courses to read from'); process.exit(1); }

const scratchCourse = await call({ op: 'course', key: scratch.tutorKey });
const haveWording = Object.keys(((scratchCourse.result || {}).wording) || {});
if (!haveWording.length) {
  const from = await call({ op: 'course', key: wsrc.tutorKey });
  const wording = (from.result || {}).wording || {};
  const n = Object.keys(wording).length;
  if (n < 4) { console.error(`${WORDING_FROM} answered with only ${n} assignments. That is a FAILED READ — refusing to copy it.`); process.exit(1); }
  const w = await call({ op: 'putCourse', key: scratch.tutorKey, kind: 'wording', data: wording });
  if (!w.ok) { console.error('could not copy the wording: ' + w.error); process.exit(1); }
  console.log(`  wording: copied ${n} assignments from ${WORDING_FROM}`);
} else {
  console.log(`  wording: already here (${haveWording.length} assignments)`);
}

/* The record. Read the real closed one, rewind it one step. */
const srcRoster = await call({ op: 'roster', key: src.tutorKey });
const srcPerson = ((srcRoster.result && srcRoster.result.trainees) || []).find((p) => p.name === SOURCE.person);
if (!srcPerson) { console.error(`no ${SOURCE.person} on ${SOURCE.course}`); process.exit(1); }
const srcRec = (srcPerson.records || {}).assignments;
const srcInner = srcRec && (srcRec.data || srcRec);
const sub = srcInner && srcInner[SOURCE.key];
if (!sub || !sub.sub1) { console.error(`${SOURCE.person}'s ${SOURCE.key} on ${SOURCE.course} has no first submission to read`); process.exit(1); }
if (!sub.sub2) { console.error(`${SOURCE.person}'s ${SOURCE.key} was never resubmitted — it is the wrong record to rewind`); process.exit(1); }

const marks = (sub.criteriaMarks && sub.criteriaMarks.sub1) || [];
if (marks.length < 2) { console.error('the source record has no first-round marks'); process.exit(1); }
/* Sized against the wording this record will be READ against, not the one it
   was written against. The source course's fol had four criteria; the wording
   on the scratch course has six, and a mark sheet two criteria short shows a
   trainee "Resubmission needed" with two of them never judged. Anything the
   source does not cover is met -- only the flagged ones are turned down. */
const readAgainst = await call({ op: 'course', key: scratch.tutorKey });
const critCount = ((((readAgainst.result || {}).wording || {})[SOURCE.key] || {}).criteria || []).length;
if (!critCount) { console.error(`the scratch course's ${SOURCE.key} has no criteria to mark`); process.exit(1); }
const rewound = [];
for (let i = 0; i < critCount; i++) rewound[i] = marks[i] === false ? false : true;
/* A resubmission is asked for because something was NOT met -- and the whole
   point of this screen is that the trainee can read WHY. So the two turned
   down are the last two that carry the tutor's comment, not simply the last
   two: turning down a criterion the source never wrote about would show a
   trainee "Not met" and nothing to do about it. */
const srcComments = ((sub.criteriaComments || {}).sub1 || []);
const commented = [];
for (let i = 0; i < critCount; i++) if ((srcComments[i] || '').trim()) commented.push(i);
const turnDown = commented.slice(-2);
if (turnDown.length < 2) { console.error(`the source record comments on only ${commented.length} criteria — nothing to send back with`); process.exit(1); }
turnDown.forEach((i) => { rewound[i] = false; });

const record = {
  [SOURCE.key]: {
    stage: 'resubmission_needed',
    usedResubmission: false,
    sub1: sub.sub1,
    sub1At: sub.sub1At || new Date().toISOString(),
    sub2: null,
    draft: null,
    feedback: { outcome: 'Resubmission needed', generalComment1: (sub.feedback && sub.feedback.generalComment1) || '' },
    criteriaMarks: { sub1: rewound, sub2: [] },
    criteriaComments: { sub1: ((sub.criteriaComments || {}).sub1 || []).slice(), sub2: [] },
    markers: { first: (sub.markers && sub.markers.first) || 'Jordan Blake', second: '', doubleMarked: false },
  },
};

const w = await call({ op: 'put', key: scratch.tutorKey, token: who.token, kind: 'assignments', data: record });
if (!w.ok) { console.error('write refused: ' + w.error); process.exit(1); }

/* Read it back. A write that answered ok is not a record that is there. */
const back = await call({ op: 'get', key: scratch.tutorKey, token: who.token, kind: 'assignments' });
let got = back.ok ? back.result : null;
if (got && got.data) got = got.data;
const landed = got && got[SOURCE.key];
if (!landed || landed.stage !== 'resubmission_needed') { console.error('\nIt did not land. Nothing to film.'); process.exit(1); }
const cm = landed.criteriaComments.sub1 || [];
const notMet = (landed.criteriaMarks.sub1 || []).map((m, i) => (m === false ? i : -1)).filter((i) => i >= 0);
console.log(`  planted: ${SOURCE.key} at ${landed.stage} — ${landed.criteriaMarks.sub1.length} criteria marked, not met at ${notMet.join(' and ')}, each with a comment: ${notMet.every((i) => (cm[i] || '').trim()) ? 'yes' : 'NO'}`);
console.log(`\nFilm scene 13c reads this as: ${who.name}, on the scratch course.\n`);
