// A finished course whose assignments were marked against wording that was
// never stored: put the wording back, and make the marks fit it.
//
//   node store/repair-course-wording.mjs c4
//   node store/repair-course-wording.mjs c4 --write
//
// WHAT WENT WRONG. demo-finished.mjs built the finished demo course with
// twelve candidates, four closed assignments each, and NO assignment wording
// behind them -- its stubbed store answered `course()` with `wording: null` and
// it never wrote one. So every assignment screen on that course read "This
// assignment isn't set up yet", and the self-heal that fills a course's wording
// in refuses a course that already has marks on it, by design, so it could
// never repair itself. Found 27 Sep 2026.
//
// The same seed also wrote exactly four criteria marks for every assignment.
// The real counts are 6/4/4/5 (assignment-defaults.js, from the syllabus), so
// writing the wording alone would leave the two extra criteria of Focus on the
// Learner, and the fifth of Lessons from the Classroom, sitting UNMARKED on a
// closed, passed assignment. Both halves have to happen together, which is why
// this is one script.
//
// It pads with Met, because every assignment on that course closed at Pass --
// it is making the record say what the outcome already says, not inventing a
// judgement. Where a record used its one resubmission, the LAST criterion of
// the first round is set Not met with the reason the tutor's own general
// comment gives, because otherwise the comment ("not yet met on one
// criterion") and the marks (all met) contradict each other on one screen.
//
// GUARDS. It refuses a course that already has wording -- it is a repair, not
// an overwrite. It refuses a `course` read that comes back too short, because
// that is a FAILED READ and not an empty course (see restore-c4-settings.mjs).
// It writes nothing without --write, and reads everything back afterwards.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const courseId = process.argv[2];
const WRITE = process.argv.includes('--write');
/* Rewriting every per-criterion comment is NOT part of repairing the wording.
   demo-finished.mjs wrote a plain "Met." against each criterion and that is
   consistent across the whole course and not wrong; demo-mint.mjs writes the
   fuller notes, which is why the running course reads richer. --notes takes
   the finished course up to the same writing, deliberately and on its own. */
const NOTES_TOO = process.argv.includes('--notes');
if (!courseId || courseId.startsWith('--')) {
  console.error('Usage: node store/repair-course-wording.mjs <courseId> [--write]');
  process.exit(1);
}

/* The same words the product's own minting script uses, in the same places --
   demo-mint.mjs, markAssignment(). A repair that invents its own phrasing
   leaves the finished course reading differently from the running one for no
   reason a viewer could name. NOTES are positional, one per criterion. */
const NOTES = [
  'You describe the learner in real detail, and the detail is used \u2014 it feeds the two problems you chose.',
  'The two problems are well chosen and the activities follow from them. The rationale for the first could say more about why THIS activity and not another.',
  'Accurate throughout; the references are the right ones and they are cited.',
  'The reflection is honest and specific. It would be stronger still with one thing you would do differently in the classroom next week.',
  'Within the word count and clearly organised under the headings.',
  'Clear, readable, and written for a reader who was not in the room.',
];
/* The not-met note has to be about the criterion it sits under. demo-finished
   gave every resubmitted assignment the SAME sentence -- "the rationale for
   the second activity" -- which is a Focus on the Learner story: Language
   Related Tasks and Lessons from the Classroom have no rationale criterion at
   all, so on those two the tutor's words described something the assignment
   does not ask for. Built from the criterion's own text instead, it is true of
   whichever one it lands on. */
const notMetNote = (text) => `Not met yet: ${String(text || 'this criterion').replace(/^[A-Z]/, (m) => m.toLowerCase())} \u2014 the evidence for this is not there yet. Rewrite this section only and resubmit.`;
/* And the general comment must not name a criterion either, for the same
   reason: it points at the note rather than repeating it. */
const GENERAL_1 = 'Not yet met on one criterion \u2014 the note against it says what is missing. Everything else is there and is well done. Resubmit that section only.';
const NOT_MET_RE = /not met|resubmit/i;
/* WHICH criterion a resubmitted assignment failed. Not "the last one", and not
   a fixed number either: the tutor's own general comment on these records says
   "the rationale for the second activity", so the criterion it belongs to is
   the one about providing a rationale -- which is criterion 5 of Focus on the
   Learner and a different number in each of the others. Picking an index and
   hoping put the comment against "Selecting appropriate material" and left the
   rationale criterion reading Met. Read the criterion text and match it. */
function notMetIndexFor(key) {
  const crit = (WORDING[key] && WORDING[key].criteria) || [];
  const byWord = crit.findIndex((c) => /rationale/i.test(c.text || ''));
  if (byWord >= 0) return byWord;
  return Math.min(3, crit.length - 1);
}

/* The four assignments, from the product's own file. Never a copy kept here. */
const WORDING = (() => {
  const src = readFileSync(join(HERE, 'assignment-defaults.js'), 'utf8');
  const w = {};
  new Function('window', src)(w);
  const d = w.CONNECT_HUB_DEFAULT_WORDING;
  if (!d || Object.keys(d).length < 4) { console.error('assignment-defaults.js gave no wording'); process.exit(1); }
  return JSON.parse(JSON.stringify(d));
})();
const CRIT = Object.fromEntries(Object.keys(WORDING).map((k) => [k, (WORDING[k].criteria || []).length]));

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
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
if (!course) { console.error('no course ' + courseId); process.exit(1); }

/* Twice. A short answer once is a failed read; twice over it is the truth. */
const reads = [await call({ op: 'course', key: course.tutorKey }), await call({ op: 'course', key: course.tutorKey })];
const settingsN = reads.map((r) => Object.keys((r.result || {}).settings || {}).length);
const wordingN = reads.map((r) => Object.keys((r.result || {}).wording || {}).length);
console.log(`${courseId} — ${course.name}`);
console.log(`  settings fields: ${settingsN.join(' then ')}   wording: ${wordingN.join(' then ')}`);
if (settingsN[0] < 6 || settingsN[0] !== settingsN[1]) {
  console.error('\nThat is a FAILED READ, not a course. Refusing to write.'); process.exit(1);
}
/* Already there: leave it alone and repair the records only. This must stay
   re-runnable -- it is how the comments were put right after the first pass
   padded them with a bare "Met." */
const NEEDS_WORDING = wordingN[0] === 0;
if (!NEEDS_WORDING) console.log(`  wording is already there (${wordingN[0]} assignments) \u2014 leaving it, repairing the records only`);

const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];
if (!people.length) { console.error('no candidates on ' + courseId); process.exit(1); }

/* What each record would become. */
function repair(inner) {
  const out = JSON.parse(JSON.stringify(inner));
  const changes = [];
  for (const key of Object.keys(out)) {
    const sub = out[key];
    if (!sub || !sub.stage) continue;
    const n = CRIT[key];
    if (!n) { changes.push(`${key}: not one of the four — left alone`); continue; }
    sub.criteriaMarks = sub.criteriaMarks || { sub1: [], sub2: [] };
    sub.criteriaComments = sub.criteriaComments || { sub1: [], sub2: [] };
    for (const round of ['sub1', 'sub2']) {
      const has = round === 'sub1' ? !!sub.sub1 : !!sub.sub2;
      if (!has) { sub.criteriaMarks[round] = []; sub.criteriaComments[round] = []; continue; }
      const m = (sub.criteriaMarks[round] || []).slice();
      const c = (sub.criteriaComments[round] || []).slice();
      const was = m.length;
      const placeholders = NOTES_TOO ? c.filter((x) => x === 'Met.').length : 0;
      for (let i = 0; i < n; i++) {
        if (m[i] !== true && m[i] !== false) m[i] = true;
        /* "Met." on its own is a PLACEHOLDER -- the first pass of this script
           wrote it before the product's own notes were found, and the real
           comments are all full sentences. Upgrade it; leave anything a person
           or demo-mint actually wrote. */
        const empty = typeof c[i] !== 'string' || !c[i];
        const placeholder = c[i] === 'Met.';
        if (empty || (placeholder && NOTES_TOO)) c[i] = round === 'sub1' ? NOTES[i % NOTES.length] : '';
      }
      m.length = n; c.length = n;
      /* The resubmission's reason, on the round and the criterion it is about. */
      if (round === 'sub1' && sub.usedResubmission) {
        const at = notMetIndexFor(key);
        /* Every criterion back to Met FIRST, and its comment with it. An
           earlier pass of this script put the Not met on the last criterion;
           amending in place left that one failed as well, and clearing only an
           exact match of today's wording left the PREVIOUS pass's not-met
           sentence sitting under a criterion now marked Met. So any criterion
           being un-failed loses its comment, whatever it says. */
        for (let i = 0; i < n; i++) {
          /* Any criterion that is Met loses a comment that talks about not
             meeting it. Clearing only the ones currently marked false left an
             earlier pass's sentence under a criterion since put back to Met --
             on screen, "Met" with "resubmit with that added" underneath. */
          if (m[i] === false || NOT_MET_RE.test(c[i] || '')) { m[i] = true; c[i] = NOTES_TOO ? NOTES[i % NOTES.length] : 'Met.'; }
        }
        const crit = (WORDING[key] && WORDING[key].criteria) || [];
        m[at] = false; c[at] = notMetNote((crit[at] || {}).text);
        if (sub.feedback) sub.feedback.generalComment1 = GENERAL_1;
      }
      sub.criteriaMarks[round] = m;
      sub.criteriaComments[round] = c;
      if (placeholders) changes.push(`${key}.${round}: ${placeholders} placeholder comment${placeholders === 1 ? '' : 's'} → the real note`);
      if (was !== n || sub.usedResubmission) changes.push(`${key}.${round}: ${was} → ${n}${sub.usedResubmission && round === 'sub1' ? `, criterion ${notMetIndexFor(key) + 1} of ${n} Not met (the rationale one)` : ''}`);
    }
  }
  return { out, changes };
}

let planned = 0;
const work = [];
for (const p of people) {
  const rec = (p.records || {}).assignments;
  const inner = rec && (rec.data || rec);
  if (!inner || !Object.keys(inner).length) { console.log(`  ${p.name.padEnd(20)} no assignments`); continue; }
  const { out, changes } = repair(inner);
  work.push({ p, out, changes });
  planned += changes.length;
  console.log(`  ${p.name.padEnd(20)} ${changes.join('; ') || 'already right'}`);
}

if (!WRITE) {
  console.log(`\nRead only. ${planned} change${planned === 1 ? '' : 's'} to make across ${work.length} candidates, plus the wording itself.`);
  console.log('Add --write to do it.\n');
  process.exit(0);
}

if (NEEDS_WORDING) {
  const w = await call({ op: 'putCourse', key: course.tutorKey, kind: 'wording', data: WORDING });
  if (!w.ok) { console.error('wording write refused: ' + w.error); process.exit(1); }
  console.log(`\nwording written: ${Object.keys(WORDING).map((k) => k + ':' + CRIT[k]).join(' ')}`);
}

let done = 0, failed = 0;
for (const { p, out } of work) {
  const r = await call({ op: 'put', key: course.tutorKey, token: p.token, kind: 'assignments', data: out });
  if (r.ok) done++; else { failed++; console.error(`  ${p.name}: ${r.error}`); }
}
console.log(`records written: ${done}${failed ? `, ${failed} FAILED` : ''}`);

/* Read it all back. A write that answered ok is not a record that is there. */
const after = await call({ op: 'course', key: course.tutorKey });
const afterW = Object.keys(((after.result || {}).wording) || {});
const afterS = Object.keys(((after.result || {}).settings) || {}).length;
const check = await call({ op: 'roster', key: course.tutorKey });
let short = [];
for (const p of ((check.result && check.result.trainees) || [])) {
  const rec = (p.records || {}).assignments;
  const inner = rec && (rec.data || rec);
  if (!inner) continue;
  for (const key of Object.keys(inner)) {
    const sub = inner[key];
    if (!sub || !sub.stage || !CRIT[key]) continue;
    const m = (sub.criteriaMarks || {}).sub1 || [];
    if (m.length !== CRIT[key] || m.some((x) => x !== true && x !== false)) short.push(`${p.name}/${key} (${m.length} of ${CRIT[key]})`);
  }
}
console.log(`\nafter: wording [${afterW.join(',')}], settings ${settingsN[0]} → ${afterS}`);
console.log(short.length ? `STILL SHORT: ${short.join(', ')}` : 'every closed assignment is fully marked against its own criteria.');
if (afterS < settingsN[0]) { console.error('\nSettings fields were lost. Put them back before anything else.'); process.exit(1); }
if (short.length || failed) process.exit(1);
