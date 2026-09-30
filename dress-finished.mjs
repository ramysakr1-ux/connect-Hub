/**
 * Connect Lite — dress the finished course for the film's last part.
 *
 *   node dress-finished.mjs            what it would write (dry run)
 *   node dress-finished.mjs --write    write it to the finished course
 *
 * Part five of the film (DEMO-ANIMATION-SPEC.md) is shot from the finished
 * course: the final declaration, Cambridge's booklet drawn from the record,
 * the print. That course (c4) was built by demo-finished.mjs with eight
 * returned practices, four marked assignments and grades per candidate, but
 * before the CELTA 5 existed in Lite -- so its booklet had no confirmations,
 * no stages, no signatures and no observation sheets, and scene 20 would have
 * drawn an empty form. This adds, for every candidate:
 *
 *   celta5    the candidate's half: both confirmations signed in ink on day
 *             one; Stage 1 and Stage 3 agreed and signed; Stage 2 written,
 *             submitted, agreed and signed; the final declaration, five
 *             checks and a signature.
 *   celta5t   the tutors' half: Stage 1, 2 and 3 written and returned, each
 *             signed in ink; the attendance record (one absence on the
 *             course); the tutor's final signature.
 *   observations   six sheets turned in -- four filmed, two live -- so the
 *             booklet's observation table shows the six hours.
 *
 * Dates are the course's own: a stage is returned after the practice the
 * record says it followed, and everything closes on the last day. The course
 * keeps its dates in settings and is pinned to that last day (the demo
 * clock), so its links never expire and its screens read "the course has
 * finished" for ever. Signatures are drawn paths that belong to nobody.
 *
 * It refuses any course but the one labelled "Finished course — the film,
 * part five". Every write names its op's real parameter; settings are read
 * twice and read back.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CANDIDATES } from './demo-lessons.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const WRITE = process.argv.includes('--write');
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const call = async (b, tries = 6) => {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) }); return JSON.parse(await r.text()); }
    catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};
const must = async (label, b) => { const r = await call(b); if (!r.ok) { console.log('   ' + label + ' FAILED: ' + r.error); process.exitCode = 1; } return r; };

const START = '2026-08-10', END = '2026-09-04', VISIT = '2026-09-03';
const TUTORS = ['Jordan Blake', 'Diane Okonkwo'];
const iso = (date, hhmm) => new Date(date + 'T' + hhmm + ':00Z').toISOString();
const plusDays = (date, n) => { const d = new Date(date + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

function ink(name) {
  let h = 7; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 8) / 16777216; };
  const pts = []; const n = 14 + Math.floor(rnd() * 6);
  for (let i = 0; i < n; i++) pts.push([Math.round(24 + (252 * i) / (n - 1) + (rnd() - 0.5) * 10), Math.round(58 + Math.sin(i * 1.9 + rnd()) * 14 + (rnd() - 0.5) * 12)]);
  return 'M' + pts.map(p => p[0] + ' ' + p[1]).join(' L');
}
const signed = (name, date, hhmm) => ({ name, at: iso(date, hhmm), ink: ink(name) });

const CRITERIA = (() => { const src = readFileSync(join(HERE, 'celta5-criteria.js'), 'utf8'); const w = {}; new Function('window', src)(w); return w.CONNECT_HUB_CRITERIA.map(c => c[0]); })();
const OBS = (() => { const src = readFileSync(join(HERE, 'observation-defaults.js'), 'utf8'); const w = {}; new Function('window', src)(w); return w.CONNECT_HUB_OBSERVATION_DEFAULTS; })();

/* ---- the course ------------------------------------------------------------ */
const courses = (await call({ op: 'ownerCourses', owner: OWNER })).result.courses;
const course = courses.find(c => c.name === 'Finished course — the film, part five');
if (!course) { console.log('no course labelled "Finished course — the film, part five"'); process.exit(1); }
const KEY = course.tutorKey;
const roster = (await call({ op: 'roster', key: KEY })).result;
const people = Object.values(roster.trainees || {}).filter(Boolean);
console.log(course.id + ' — ' + course.name + ': ' + people.length + ' candidates');

/* ---- per candidate ----------------------------------------------------------- */
function dress(p, i) {
  const cand = CANDIDATES.find(c => c.name === p.name) || CANDIDATES[i % CANDIDATES.length];
  const hist = (p.records && p.records.tpHistory) || {};
  const tpDate = n => ((hist[n] && hist[n].state && hist[n].state.f && hist[n].state.f.fDate) || plusDays(START, 1 + (n - 1) * 3));
  const d1 = plusDays(tpDate(2), 1), d2 = plusDays(tpDate(5), 1), d3 = plusDays(tpDate(8), 0);
  const tutor1 = TUTORS[0], tutor2 = TUTORS[1];
  const grade = cand.final || 'PASS';
  const overall = /PASS [AB]/.test(grade) ? 'above' : grade === 'FAIL' ? 'not' : 'to';
  const marksC = {}, marksT = {};
  CRITERIA.forEach((code, k) => {
    marksC[code] = (k + i) % 9 === 0 ? 'S+' : (k + i) % 13 === 0 ? 'N' : 'S';
    marksT[code] = grade === 'FAIL' ? ((k + i) % 4 === 0 ? 'N' : 'S') : (k + i) % 11 === 0 ? 'S+' : (k + i) % 17 === 0 ? 'N' : 'S';
  });
  const strengths = cand.teachS.slice(0, 2).map(x => x[1]).join('\n');
  const actions = cand.teachA.slice(0, 2).map(x => x[1]).join('\n');

  const C = {
    confirms: { portfolio: signed(p.name, START, '12:05'), appeals: signed(p.name, START, '12:06') },
    stage1: { agrees: true, signed: signed(p.name, d1, '19:12') },
    stage2: { notesWA: 'FOL and LRT ' + (cand.assignments.fol === 'resub' ? 'passed, FOL on resubmission' : 'passed') + '; LSRT submitted. I found the rationale sections hardest.', notesOther: 'I am planning faster and my instructions are shorter.', overall: overall === 'not' ? 'to' : overall, areas: cand.teachA.map(x => x[1]).join('\n'), marks: marksC, submittedAt: iso(plusDays(d2, -1), '20:15'), agrees: true, signed: signed(p.name, d2, '21:05') },
    stage3: { agrees: grade !== 'FAIL', signed: signed(p.name, d3, '20:40') },
    final: { checks: { tp: true, obs: true, wa: true, own: true, records: true }, signed: signed(p.name, END, '15:30') },
  };
  const T = {
    cover: { uln: '' },
    stage1: { tutorialGiven: 'yes', hoursTaught: '1.5', strengths, actionPlan: actions, returnedAt: iso(d1, '17:40'), signedBy: signed(tutor1, d1, '17:40') },
    stage2: { notesWA: 'Three assignments passed' + (cand.assignments.fol === 'resub' ? ', FOL on resubmission' : '') + '. LfC due in week four.', notesOther: cand.tutorial, overall, summary: 'Action points from Stage 1 met. ' + cand.teachA[0][1] + ' remains the target for the last week.', marks: marksT, returnedAt: iso(d2, '17:50'), signedBy: signed(tutor2, d2, '17:50') },
    stage3: { tutorialGiven: 'yes', hoursTaught: '6', notesWA: 'All four written assignments ' + (Object.values(cand.assignments).some(h => h === 'resub') ? 'passed, one on resubmission.' : 'passed at the first attempt.'), notesOther: cand.tutorial, overall, summary: (cand.report && cand.report[2]) || actions, marks: marksT, returnedAt: iso(d3, '18:10'), signedBy: signed(tutor2, d3, '18:10') },
    attendance: { rows: p.name === 'Kerem Doğan' ? [{ date: plusDays(START, 9) + ' 10:00–12:15', session: 'Input: speaking; phonology 2', reason: 'Illness, with a note', madeUp: 'Yes — notes and the recording', cand: 'Watched the recording that evening.', tutor: 'JB' }] : [], other: [] },
    final: { signed: signed(tutor1, END, '16:05') },
  };
  /* six observation sheets: the four filmed ones in the first fortnight, the two live ones in week three */
  const obs = {};
  const filmedDays = [0, 3, 7, 10], lessons = ['A2 reading: a day in the life', 'B1 grammar: past simple stories', 'A2 speaking: giving directions', 'B1 vocabulary: food and cooking'];
  OBS.filmed.forEach((sheet, k) => {
    const a = { hLesson: lessons[k], hLevel: k % 2 ? 'B1' : 'A2', hLength: '45', hDate: plusDays(START, filmedDays[k]), hLearners: '10', hSigned: 'Recorded lesson' };
    (sheet.rows || []).forEach((q, r) => { a['r' + r] = ['Yes — clearly, and checked with a question.', 'Mostly; one instruction went out with the paper.', 'Learners used names with each other by the end.', 'Yes, and the teacher waited for the answer.', 'Pairs first, then open class; nobody was put on the spot.'][(r + i) % 5]; });
    (sheet.after || []).forEach((q, r) => { a['a' + r] = 'The clearest thing was the order: task, then instruction check, then the handout.'; });
    obs[sheet.id] = { a, turnedInAt: iso(plusDays(START, filmedDays[k]), '18:20') };
  });
  OBS.live.forEach((sheet, k) => {
    const day = 14 + k * 2;
    const a = { hTeacher: TUTORS[k % 2], hLesson: k ? 'A2 reading and speaking: at the market' : 'B1 functional language: making arrangements', hLevel: k ? 'A2' : 'B1', hLength: '90', hDate: plusDays(START, day), hLearners: '11', hSigned: TUTORS[k % 2].split(' ').map(w => w[0]).join('') };
    (sheet.rows || []).forEach((q, r) => { a['q' + r] = 'Observed and noted in the session; the clearest example was the way the task was set before the handout.'; });
    (sheet.after || []).forEach((q, r) => { a['a' + r] = 'What I would take into my own teaching is the pace of the feedback stage: two answers, not six.'; });
    (sheet.parts || []).forEach((part, pi) => { (part.blocks || []).forEach((b, bi) => { if (b.kind === 'set') a['p' + pi + 's' + bi] = 'Seen in the lesson, and it worked.'; }); });
    obs[sheet.id] = { a, turnedInAt: iso(plusDays(START, day), '18:05') };
  });
  return { celta5: C, celta5t: T, observations: obs };
}

let written = 0;
for (const [i, p] of people.entries()) {
  const recs = dress(p, i);
  console.log(p.name.padEnd(18) + Object.keys(recs).join(', ') + '  (Stage 1 ' + recs.celta5t.stage1.returnedAt.slice(0, 10) + ', Stage 3 ' + recs.celta5t.stage3.returnedAt.slice(0, 10) + ')');
  if (!WRITE) continue;
  for (const [kind, data] of Object.entries(recs)) { const r = await must(p.name + ' ' + kind, { op: 'put', key: KEY, token: p.token, kind, data }); if (r.ok) written++; }
}

/* the settings: the course's own dates, its number, and the pin to its last day */
if (WRITE) {
  const s1 = (await call({ op: 'course', key: KEY })).result.settings || {};
  const s2 = (await call({ op: 'course', key: KEY })).result.settings || {};
  if (Object.keys(s1).length < 12 || Object.keys(s1).length !== Object.keys(s2).length) { console.log('settings read short (' + Object.keys(s1).length + '/' + Object.keys(s2).length + ') — not writing them'); process.exit(1); }
  const next = Object.assign({}, s1, { start: START, end: END, visitDate: VISIT, courseNumber: '1 / 2026', notificationRef: 'TR999-C1/2026', demoToday: END });
  await must('settings', { op: 'putCourse', key: KEY, kind: 'settings', data: next });
  const back = (await call({ op: 'course', key: KEY })).result.settings || {};
  console.log('settings: ' + Object.keys(back).length + ' keys, pinned to ' + back.demoToday + ', ' + back.start + ' → ' + back.end);
  console.log('\n' + written + ' records written.');
}
