/**
 * Connect Lite — the two standing demo courses, and the finished one.
 *
 *   node seed-standing-demos.mjs --which start            what it would build (dry run)
 *   node seed-standing-demos.mjs --which start --write    build the beginning demo, pinned to day 6
 *   node seed-standing-demos.mjs --which visit --write    build the before-the-visit demo, pinned to day 17
 *   node seed-standing-demos.mjs --which visit --write --course c7    re-dress a course this made
 *
 * Ramy, 30 Sep 2026: "I want to do a demo for a course that has no end date
 * so it would last. Two perhaps: one showing the beginning of the course and
 * one towards the end before the assessor visit." A course pinned to a day
 * (settings.demoToday, the demo clock) reads that day as today for ever, so
 * both can be sent to centres and never age. They are also the film's set
 * (DEMO-ANIMATION-SPEC.md, parts 1-4); part 5 is shot from the finished
 * course, which demo-finished.mjs builds.
 *
 * THE COURSE. Elmswood English Centre (the invented demo centre, TR999),
 * "CELTA — C/1 2026", Monday 2 March to Friday 27 March 2026, six candidates
 * in one group, two tutors. Day 1 is orientation; teaching runs from day 2
 * with the two sets (ABC, DEF) taking alternate days, the same practice
 * number on consecutive days -- the timetable page's own skeleton. Day 19 is
 * the assessor's visit.
 *
 *   start   pinned to day 6 (Mon 9 Mar).  TP1-2 taught; TP3 today for ABC.
 *           Stage 1 returned to two, signed by one. Four volunteers, three
 *           agreed. FOL submitted by four, marked for one. Nothing graded.
 *   visit   pinned to day 17 (Tue 24 Mar). TP1-8 returned for ABC, 1-7 for
 *           DEF with TP8 today. Stages 1 and 2 returned and signed. All four
 *           assignments through, one double-marked, one resubmitted, LfC
 *           still being marked. Grid released with a clash. Five volunteers,
 *           one certificate earned and signed. Provisional grades in. The
 *           assessor pack complete with picks and documents.
 *
 * HOW THE DOCUMENTS ARE MADE. As in demo-finished.mjs: every returned teaching
 * practice's frozen document is built by the real feedback screen, headless,
 * so it stays the product's. The lesson content and the candidates come from
 * demo-finished-data.mjs through demo-lessons.mjs; the aims follow Lite's own
 * rotation (hub-rotation.js), so the TP points, the timetable and the plans
 * agree about who taught what on which day.
 *
 * WRITES. Every write names its op's real parameter (`data`, never `value`):
 * a wrong field name writes null and the store still answers ok (30 Sep 2026).
 * Every course-kind write is read back and its field count checked. It
 * refuses c1-c5.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';
import { COURSE as FINISHED, SLOTS, CANDIDATES, lesson, feedbackState, assignment, setTpDate } from './demo-lessons.mjs';

const HERE = new URL('.', import.meta.url).pathname;
/* hub-rotation.js is a browser file that also exports for CommonJS; loading it
   the way the other browser assets are loaded here is the one way that works
   from an ES module. */
const R = (() => { const src = readFileSync(join(HERE, 'hub-rotation.js'), 'utf8'); const scope = {}; new Function('window', 'module', src)(scope, undefined); if (!scope.hubRotation || !scope.hubRotation.rotate) throw new Error('hub-rotation.js gave no rotate()'); return scope.hubRotation; })();

const WRITE = process.argv.includes('--write');
const WHICH = process.argv[process.argv.indexOf('--which') + 1];
if (!['start', 'visit'].includes(WHICH)) { console.log('say --which start or --which visit'); process.exit(1); }
const REUSE = (process.argv[process.argv.indexOf('--course') + 1] || '').match(/^c\d+$/) ? process.argv[process.argv.indexOf('--course') + 1] : '';
const KEEP = new Set(['c1', 'c2', 'c3', 'c4', 'c5']);

const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const call = async (b, tries = 6) => {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
      const t = await r.text();
      return JSON.parse(t);
    } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};
const must = async (label, b) => { const r = await call(b); if (!r.ok) { console.log('   ' + label + ' FAILED: ' + r.error); process.exitCode = 1; } return r; };

/* ---- the calendar --------------------------------------------------------- */
const START = '2026-03-02', END = '2026-03-27';
const DAYS = (() => { const out = []; for (let d = new Date(START + 'T00:00:00Z'); d <= new Date(END + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) { const w = d.getUTCDay(); if (w && w !== 6) out.push(d.toISOString().slice(0, 10)); } return out; })();
const DAY = i => DAYS[i - 1];                                  // 1-based course day
const PIN_DAY = WHICH === 'start' ? 6 : 17;
const PIN = DAY(PIN_DAY);
const VISIT_DAY = 19;
/* London is on GMT in March, so a course time is a UTC time. */
const ts = (day, hhmm) => Date.parse(DAY(day) + 'T' + hhmm + ':00Z');
const iso = (day, hhmm) => new Date(ts(day, hhmm)).toISOString();

/* The timetable's own skeleton: day 1 has no assessed practice; from day 2 the
   two sets alternate, the same practice number on consecutive days. */
const TP_COUNT = 8;
const TEACH = {};                                              // tp -> [dayOfSet0, dayOfSet1]
DAYS.slice(1).forEach((date, i) => { const tp = Math.floor(i / 2) + 1; if (tp > TP_COUNT) return; (TEACH[tp] = TEACH[tp] || [])[i % 2] = i + 2; });
const tpDay = (tp, setIndex) => TEACH[tp][setIndex];

/* ---- the people ----------------------------------------------------------- */
const PICK = [0, 1, 2, 3, 6, 7];                                // Olivia, Deniz, Sofia, Marcus, Hannah, Selin
const CANDS = PICK.map(i => Object.assign({}, CANDIDATES[i], { group: '1' }));
const TUTORS = ['Jordan Blake', 'Diane Okonkwo'];
const VOLUNTEERS = [
  { name: 'Ayşe Demir', level: 'B1', note: '', lang: 'tr' },
  { name: 'Mehmet Yılmaz', level: 'A2', note: '', lang: 'tr' },
  { name: 'Elena Petrova', level: 'B1', note: '', lang: 'ru' },
  { name: 'Omar Haddad', level: 'A2', note: 'evenings only', lang: 'ar' },
  { name: 'Léa Dubois', level: 'B1', note: '', lang: 'en' },
];

/* ---- ink: a drawn signature that is nobody's, from the name ------------- */
function ink(name) {
  let h = 7; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 8) / 16777216; };
  const pts = []; const n = 14 + Math.floor(rnd() * 6);
  for (let i = 0; i < n; i++) pts.push([Math.round(24 + (252 * i) / (n - 1) + (rnd() - 0.5) * 10), Math.round(58 + Math.sin(i * 1.9 + rnd()) * 14 + (rnd() - 0.5) * 12)]);
  return 'M' + pts.map(p => p[0] + ' ' + p[1]).join(' L');
}
const signed = (name, day, hhmm) => ({ name, at: iso(day, hhmm), ink: ink(name) });

/* ---- the settings --------------------------------------------------------- */
const LOGO = FINISHED.settings.logo;
const ROOMS = [
  { label: 'Input', url: 'https://zoom.us/j/81000000001', assessor: false },
  { label: 'Teaching practice', url: 'https://zoom.us/j/81000000002', assessor: true },
  { label: 'Feedback and tutorials', url: 'https://zoom.us/j/81000000003', assessor: false },
];
const COURSE_LINKS = [
  { label: 'CELTA syllabus and assessment guidelines', url: 'https://www.cambridgeenglish.org/Images/21816-celta-syllbus.pdf', card: 'Course files', show: true },
  { label: 'Coursebook audio, both levels', url: 'https://drive.google.com/drive/folders/demo-coursebook-audio', card: 'Course files', show: true },
  { label: 'Elmswood centre handbook', url: 'https://drive.google.com/drive/folders/demo-centre-handbook', card: 'Course files', show: true },
];
const DOCS = {
  docTimetable: 'https://drive.google.com/drive/folders/demo-course-timetable',
  docTpSchedule: 'https://drive.google.com/drive/folders/demo-tp-schedule',
  docRegisters: 'https://drive.google.com/drive/folders/demo-attendance-registers',
  docAgreement: 'https://drive.google.com/drive/folders/demo-candidate-agreement',
  docOwnWork: 'https://drive.google.com/drive/folders/demo-own-work-declaration',
  docDescriptions: 'https://drive.google.com/drive/folders/demo-candidate-descriptions',
  docApplications: 'https://drive.google.com/drive/folders/demo-applications',
  docPrevReport: 'https://drive.google.com/drive/folders/demo-previous-assessor-report',
  docActionPlan: 'https://drive.google.com/drive/folders/demo-action-plan',
  docAssessTimetable: 'https://drive.google.com/drive/folders/demo-assessment-timetable',
};
function settingsFor(tokens) {
  const s = {
    start: START, end: END,
    centreName: 'Elmswood English Centre', centreNumber: 'TR999', courseName: 'CELTA — C/1 2026',
    courseNumber: '1 / 2026', notificationRef: 'TR999-C1/2026',
    tpCount: TP_COUNT, totalHours: 120, deliveryMode: 'f2f',
    tutorNames: TUTORS.join(', '),
    tutorContacts: [{ name: TUTORS[0], email: 'jordan@elmswood.example', group: '' }, { name: TUTORS[1], email: 'diane@elmswood.example', group: '' }],
    planDueNote: 'Plans by 17:00 the day before you teach.', selfDueNote: 'Self-evaluation before you read the feedback, please.',
    logo: LOGO, gradeForm: FINISHED.settings.gradeForm,
    timeZone: 'Europe/London', onlineRooms: ROOMS,
    courseLinks: COURSE_LINKS,
    volunteerCertificateHours: 20,
    visitDate: DAY(VISIT_DAY), assessorVisit: [], docs: {},
    appianUrl: '',
    demoToday: PIN,
  };
  if (WHICH === 'visit') { s.docs = DOCS; s.assessorVisit = [tokens[0], tokens[3]]; }
  return s;
}

/* ---- wording: the four assignments with their deadlines ------------------ */
const DEFAULT_WORDING = (() => {
  const src = readFileSync(join(HERE, 'assignment-defaults.js'), 'utf8');
  const scope = { window: {} }; new Function('window', src)(scope.window);
  const w = scope.window.CONNECT_HUB_DEFAULT_WORDING; if (!w || Object.keys(w).length < 4) throw new Error('no wording');
  return JSON.parse(JSON.stringify(w));
})();
const ASG_DUE_DAY = { fol: 8, lrt: 11, lsrt: 14, lfc: 17 };
const WORDING = JSON.parse(JSON.stringify(DEFAULT_WORDING));
Object.keys(ASG_DUE_DAY).forEach(k => { if (WORDING[k]) WORDING[k].due = iso(ASG_DUE_DAY[k], '17:00'); });
const OBS_WORDING = (() => {
  const src = readFileSync(join(HERE, 'observation-defaults.js'), 'utf8');
  const scope = { window: {} }; new Function('window', src)(scope.window);
  return JSON.parse(JSON.stringify(scope.window.CONNECT_HUB_OBSERVATION_DEFAULTS));
})();
const CRITERIA = (() => {
  const src = readFileSync(join(HERE, 'celta5-criteria.js'), 'utf8');
  const scope = { window: {} }; new Function('window', src)(scope.window);
  return scope.window.CONNECT_HUB_CRITERIA.map(c => c[0]);
})();

/* ---- the timetable -------------------------------------------------------- */
const SLOTS_DAY = [
  { key: 'i1', from: '10:00', to: '11:00', kind: 'input', label: 'Input', room: 'Input' },
  { key: 'br1', from: '11:00', to: '11:15', kind: 'break', label: 'Break' },
  { key: 'i2', from: '11:15', to: '12:15', kind: 'input', label: 'Input', room: 'Input' },
  { key: 'lun', from: '12:15', to: '13:15', kind: 'break', label: 'Lunch' },
  { key: 'prep', from: '13:15', to: '13:30', kind: 'prep', label: 'TP preparation' },
  { key: 'tp1', from: '13:30', to: '14:15', kind: 'tp', label: 'Teaching practice', room: 'Teaching practice' },
  { key: 'tp2', from: '14:15', to: '15:00', kind: 'tp', label: 'Teaching practice', room: 'Teaching practice' },
  { key: 'tp3', from: '15:15', to: '16:00', kind: 'tp', label: 'Teaching practice', room: 'Teaching practice' },
  { key: 'plan', from: '16:15', to: '17:00', kind: 'plan', label: 'Lesson planning' },
  { key: 'fb', from: '17:15', to: '18:00', kind: 'feedback', label: 'TP feedback', room: 'Feedback and tutorials' },
];
const INPUT = [
  ['Welcome, the course and the portfolio', 'Demonstration lesson: a first look at the classroom'],
  ['The lesson framework', 'Classroom management: instructions and grouping'],
  ['Receptive skills: reading', 'Language analysis 1: meaning, form, pronunciation'],
  ['Presenting grammar: PPP', 'Concept checking'],
  ['Vocabulary: what to teach and how', 'Focus on the Learner: the assignment'],
  ['Listening: gist and detail', 'Phonology 1: sounds and the chart'],
  ['Error correction', 'Monitoring and feedback'],
  ['Text-based presentation', 'Language Related Tasks: the assignment'],
  ['Speaking: fluency and accuracy', 'Phonology 2: stress and connected speech'],
  ['Test–Teach–Test', 'Writing: process and product'],
  ['Functional language', 'Stage 1 tutorials'],
  ['Teaching young learners: an overview', 'Language Skills Related Tasks: the assignment'],
  ['Authentic materials', 'Adapting the coursebook'],
  ['Learner training and autonomy', 'Stage 2 tutorials'],
  ['Syllabus planning: TP7 and TP8', 'Dealing with mixed levels'],
  ['Lessons from the Classroom: the assignment', 'Observation: what to look for'],
  ['Teaching online', 'Professional development after CELTA'],
  ['Games and drama in the classroom', 'Life after CELTA: jobs and interviews'],
  ['Assessor visit: teaching practice', 'Assessor visit: feedback'],
  ['Course review and CELTA 5 checks', 'End of course'],
];
function timetable() {
  const days = DAYS.map((date, i) => {
    const d = { date, cells: { i1: INPUT[i][0], i2: INPUT[i][1] }, notes: '' };
    if (i + 1 === VISIT_DAY) d.notes = 'Cambridge assessor visits: teaching practice observed, feedback observed, grades discussed.';
    return d;
  });
  DAYS.slice(1).forEach((date, i) => { const tp = Math.floor(i / 2) + 1; if (tp > TP_COUNT) return; days[i + 1].tp = tp; days[i + 1].setIndex = i % 2; });
  return { days, slots: SLOTS_DAY.map(x => Object.assign({}, x)), published: true, built: iso(1, '09:00') };
}

/* ---- the rotation, the aims, and what each aim looks like as a lesson ---- */
const SHAPE_BY_AIM = { Reading: SLOTS[0], Grammar: SLOTS[1], 'Functional language': SLOTS[2], Speaking: SLOTS[3], Listening: SLOTS[4], Vocabulary: SLOTS[5], Writing: SLOTS[7] };
const BOOK = { A2: { title: 'Speakout A2, 3rd edition', url: 'https://drive.google.com/file/d/demo-speakout-a2/view' }, B1: { title: 'Speakout B1, 3rd edition', url: 'https://drive.google.com/file/d/demo-speakout-b1/view' } };
const AUDIO = 'https://drive.google.com/drive/folders/demo-coursebook-audio';
function tppoints(people, rot) {
  const rows = {};
  people.forEach((p, idx) => {
    rows[p.token] = {};
    for (let tp = 1; tp <= TP_COUNT; tp++) {
      const aim = rot.rows[p.token]['tp' + tp];
      const level = tp <= 4 ? 'A2' : 'B1';
      const shape = SHAPE_BY_AIM[aim] || SLOTS[1];
      const cell = { aim };
      const setIndex = rot.sets.findIndex(s => s.some(q => q.token === p.token));
      const day = tpDay(tp, setIndex);
      /* Materials go on the practices the course has reached, and the next one. */
      if (day <= PIN_DAY + 2) {
        const unit = 1 + ((tp - 1 + idx) % 6), page = 10 + unit * 4 + idx;
        Object.assign(cell, {
          sub: /Reading|Listening/.test(aim) ? 'Speaking: a short reaction task' : 'Lexis from the text',
          framework: shape.shape,
          point: `${shape.focus} at ${level}: unit ${unit} of the coursebook, one page, adapted. ${aim === 'Listening' ? 'Two listenings: gist then detail.' : 'Gist first, then the language.'}`,
          book: { url: BOOK[level].url, ref: `${BOOK[level].title}, SB p. ${page}, ex. 1–3\nWB p. ${page - 4}, ex. 1a, 1b`, page },
          audio: /Listening|Speaking/.test(aim) ? { url: AUDIO } : { url: '' },
          pages: [], edited: true,
        });
      }
      rows[p.token]['tp' + tp] = cell;
    }
  });
  return { groups: { '1': rows }, released: { '1': true }, sets: { '1': rot.sets.map(s => s.map(p => p.token)) } };
}

/* ---- what has happened to each candidate by the pinned day -------------- */
function plan(cand, ci, tp, aim, setIndex) {
  const level = tp <= 4 ? 'A2' : 'B1';
  const slot = Object.assign({}, SHAPE_BY_AIM[aim] || SLOTS[1], { n: tp, level });
  setTpDate(n => DAY(tpDay(n, setIndex)));
  return { slot, doc: lesson(cand, ci, slot) };
}

async function candidateRecords(cand, ci, token, setIndex, rot, buildDoc, volunteersPresent) {
  const recs = {};
  const teachDay = tp => tpDay(tp, setIndex);
  const returnedTps = [];                                     // taught and feedback returned before the pin
  const history = {};
  let lastDoc = null, lastSlot = null;
  for (let tp = 1; tp <= TP_COUNT; tp++) {
    const day = teachDay(tp);
    if (day >= PIN_DAY) break;
    const { slot, doc } = plan(cand, ci, tp, rot.rows[token]['tp' + tp], setIndex);
    const state = feedbackState(cand, doc, slot);
    state.f.fStudents = String(volunteersPresent(day));
    const html = await buildDoc(state);
    history[tp] = { status: 'returned', label: tp + ' · ' + cand.name, state, returnedAt: ts(day, '17:45'), docHTML: html };
    returnedTps.push(tp); lastDoc = doc; lastSlot = slot;
  }
  /* On the start demo two of DEF are still waiting for their TP2 feedback. */
  const waiting = WHICH === 'start' && setIndex === 1 && ci >= 2;       // Sofia and Selin: taught Friday, feedback not yet back
  if (waiting) { delete history[2]; returnedTps.pop(); }
  if (Object.keys(history).length) recs.tpHistory = history;

  const nextTp = returnedTps.length + 1;
  if (waiting) {
    const { doc } = plan(cand, ci, 2, rot.rows[token].tp2, setIndex);
    recs.plan = { status: 'turned_in', label: '2 · ' + cand.name, state: doc, centreName: 'Elmswood English Centre', turnedInAt: ts(teachDay(2) - 1, '16:40'), docHTML: '' };
    recs.selfeval = { status: 'turned_in', label: '2 · ' + cand.name, state: doc.self, turnedInAt: ts(teachDay(2), '16:30') };
  } else if (nextTp <= TP_COUNT) {
    /* The next lesson: its plan is in once the day before has passed (or is today). */
    const day = teachDay(nextTp);
    /* And Olivia's next plan is still blank on the first-week demo, so scene 6
       can write one on camera (stubbed): she teaches tomorrow, it is due today. */
    if (day - 1 <= PIN_DAY && !(WHICH === 'start' && ci === 0)) {
      const { doc } = plan(cand, ci, nextTp, rot.rows[token]['tp' + nextTp], setIndex);
      recs.plan = { status: 'turned_in', label: nextTp + ' · ' + cand.name, state: doc, centreName: 'Elmswood English Centre', turnedInAt: ts(Math.min(day - 1, PIN_DAY), ci % 2 ? '16:52' : '09:14'), docHTML: '' };
    }
    if (nextTp > 1 && returnedTps.length) recs.feedback = history[returnedTps[returnedTps.length - 1]];
  } else {
    /* Every practice returned: the last one is what is on the desk. */
    recs.feedback = history[TP_COUNT];
    recs.plan = { status: 'turned_in', label: '8 · ' + cand.name, state: lastDoc, centreName: 'Elmswood English Centre', turnedInAt: ts(teachDay(8) - 1, '16:20'), docHTML: '' };
    recs.selfeval = { status: 'turned_in', label: '8 · ' + cand.name, state: lastDoc.self, turnedInAt: ts(teachDay(8), '16:35') };
  }

  /* Observation sheets: the filmed ones on days 1, 4, 8, 11; live on day 15. */
  const obs = {};
  const filmedDays = { filmed1: 1, filmed2: 4, filmed3: 8, filmed4: 11 };
  Object.entries(filmedDays).forEach(([id, day]) => {
    if (day > PIN_DAY) return;
    if (WHICH === 'start' && id === 'filmed2' && ci >= 3) return;   // three of six have not done the second yet
    const sheet = OBS_WORDING.filmed.find(t => t.id === id);
    const a = { hLesson: ['A2 reading: a day in the life', 'B1 grammar: past simple stories', 'A2 speaking: giving directions', 'B1 vocabulary: food and cooking'][Number(id.slice(-1)) - 1], hLevel: Number(id.slice(-1)) % 2 ? 'A2' : 'B1', hLength: '45', hDate: DAY(day), hLearners: '10', hSigned: 'Recorded lesson' };
    (sheet.rows || []).forEach((q, i) => { a['r' + i] = ['Yes — clearly, and checked with a question.', 'Mostly; one instruction went out with the paper.', 'Learners used names with each other by the end.', 'Yes, and the teacher waited for the answer.', 'Pairs first, then open class; nobody was put on the spot.'][(i + ci) % 5]; });
    (sheet.after || []).forEach((q, i) => { a['a' + i] = 'The clearest thing was the order: task, then instruction check, then the handout. I want to try that.'; });
    obs[id] = { a, turnedInAt: iso(day, '18:20') };
  });
  if (PIN_DAY >= 15 && ci < 4) {
    const sheet = OBS_WORDING.live.find(t => t.id === 'live1');
    const a = { hTeacher: TUTORS[ci % 2], hLesson: 'B1 functional language: making arrangements', hLevel: 'B1', hLength: '90', hDate: DAY(15), hLearners: '11', hSigned: TUTORS[ci % 2].split(' ').map(w => w[0]).join('') };
    (sheet.rows || []).forEach((q, i) => { a['q' + i] = 'Observed and noted in the session; the clearest example was the way the task was set before the handout.'; });
    obs.live1 = { a, turnedInAt: iso(15, '18:10') };
  }
  if (Object.keys(obs).length) recs.observations = obs;

  /* The CELTA 5, both halves. */
  /* For the film (30 Sep 2026): on the first-week demo Selin has not yet
     confirmed Cambridge's words, so scene 3 can sign them on camera (stubbed). */
  const C = (WHICH === 'start' && ci === 5) ? { confirms: {} } : { confirms: { portfolio: signed(cand.name, 1, '12:05'), appeals: signed(cand.name, 1, '12:06') } };
  const T = { cover: { uln: '' } };
  const stage1Day = WHICH === 'start' ? 5 : 10;
  if (WHICH === 'start' ? ci < 2 : true) {
    T.stage1 = { tutorialGiven: 'yes', hoursTaught: WHICH === 'start' ? '1.5' : '3', strengths: cand.teachS.slice(0, 2).map(x => x[1]).join('\n'), actionPlan: cand.teachA.slice(0, 2).map(x => x[1]).join('\n'), returnedAt: iso(stage1Day, '17:40'), signedBy: signed(TUTORS[0], stage1Day, '17:40') };
    if (WHICH === 'start' ? ci === 0 : true) C.stage1 = { agrees: true, signed: signed(cand.name, stage1Day, '19:12') };
  }
  if (WHICH === 'visit') {
    const marksC = {}, marksT = {};
    CRITERIA.forEach((code, i) => { marksC[code] = (i + ci) % 9 === 0 ? 'S+' : (i + ci) % 13 === 0 ? 'N' : 'S'; marksT[code] = (i + ci) % 11 === 0 ? 'S+' : (i + ci) % 17 === 0 ? 'N' : 'S'; });
    C.stage2 = { notesWA: 'FOL and LRT passed; LSRT submitted. I found the rationale section of FOL hard and rewrote it once.', notesOther: 'I am planning faster and my instructions are shorter.', overall: 'to', areas: cand.teachA.map(x => x[1]).join('\n'), marks: marksC, submittedAt: iso(12, '20:15') };
    T.stage2 = { notesWA: 'Three assignments passed' + (cand.assignments.fol === 'resub' ? ', FOL on resubmission' : '') + '. LfC due in week four.', notesOther: cand.tutorial, overall: /PASS [AB]/.test(cand.final) ? 'above' : 'to', summary: 'Action points from Stage 1 met. ' + cand.teachA[0][1] + ' remains the target for the last week.', marks: marksT, returnedAt: iso(13, '17:50'), signedBy: signed(TUTORS[1], 13, '17:50') };
    if (ci !== 5) C.stage2.signed = signed(cand.name, 13, '21:05'), C.stage2.agrees = true;
    if (ci === 5) T.attendance = { rows: [{ date: DAY(9) + ' 10:00–12:15', session: 'Input: speaking; phonology 2', reason: 'Illness, with a note', madeUp: 'Yes — notes and the recording', cand: 'Watched the recording on the Wednesday.', tutor: 'JB' }], other: [] };
  }
  recs.celta5 = C; recs.celta5t = T;

  /* Assignments. */
  const asgAt = Object.fromEntries(Object.entries(ASG_DUE_DAY).map(([k, d]) => [k, ts(d, '16:10')]));
  const asg = {};
  const draftSub = (code) => { const full = assignment(cand, code, 'pass', DEFAULT_WORDING, asgAt); return { stage: 'submitted', usedResubmission: false, sub1: full.sub1, sub2: null, criteriaMarks: { sub1: [], sub2: [] }, criteriaComments: { sub1: [], sub2: [] }, markers: { first: '', second: '', doubleMarked: false }, sub1At: asgAt[code] - 5 * 36e5, feedback: { outcome: '', generalComment1: '', generalComment2: '' } }; };
  Object.entries(cand.assignments).forEach(([code, how]) => {
    const due = ASG_DUE_DAY[code];
    if (WHICH === 'start') {
      if (code !== 'fol') return;
      if (ci === 0) asg[code] = Object.assign(assignment(cand, code, 'pass', DEFAULT_WORDING, asgAt), { sub1At: ts(4, '21:40'), marked1At: ts(6, '08:50') });
      else if (ci < 4) asg[code] = Object.assign(draftSub(code), { sub1At: ts(5, ['18:02', '19:30', '22:15'][ci - 1]) });
      return;
    }
    if (due < PIN_DAY) { asg[code] = assignment(cand, code, how, DEFAULT_WORDING, asgAt); }
    else if (ci < 3) asg[code] = Object.assign(draftSub(code), { sub1At: ts(16, ['19:05', '20:40', '22:58'][ci]) });
  });
  if (WHICH === 'visit' && ci === 2 && asg.lrt) { asg.lrt.markers = { first: TUTORS[0], second: TUTORS[1], doubleMarked: true }; asg.lrt.marked2At = asgAt.lrt + 2 * 36e5; }
  if (Object.keys(asg).length) recs.assignments = asg;

  if (WHICH === 'visit') {
    recs.tracker = { grades: { provisional: cand.final, final: '', hoursAttended: '', planS: cand.planS.map(([code, text]) => ({ text, code })), planA: cand.planA.map(([code, text]) => ({ text, code })), teachS: cand.teachS.map(([code, text]) => ({ text, code })), teachA: cand.teachA.map(([code, text]) => ({ text, code })), update: cand.tutorial, evidence: /PASS [AB]/.test(cand.final) ? 'Supported by the teaching practice records: the Stage 1 action points met and held.' : '', overall: '' } };
    if (ci === 0) recs.staffLinks = [{ label: 'Application form', url: 'https://drive.google.com/file/d/demo-application-olivia/view' }, { label: 'Interview notes', url: 'https://drive.google.com/file/d/demo-interview-olivia/view' }];
  }
  if (ci === 0) recs.links = [{ label: 'Pre-course task, marked', url: 'https://drive.google.com/file/d/demo-precourse-olivia/view' }];
  return recs;
}

/* ---- volunteers ----------------------------------------------------------- */
function volunteers(courseId) {
  const teachDays = Object.values(TEACH).flat().sort((a, b) => a - b).filter(d => d < PIN_DAY);
  const list = (WHICH === 'start' ? VOLUNTEERS.slice(0, 4) : VOLUNTEERS).map((v, i) => {
    /* The random half is the secret, as the register mints it: never derived
       from anything guessable. */
    const tok = courseId + '-' + randomBytes(10).toString('hex');
    const marks = {};
    teachDays.forEach((d, k) => {
      const miss = [0, 0.15, 0.3, 0.55, 0.2][i];
      const r = ((k * 7 + i * 13) % 10) / 10;
      if (r < miss) return;
      marks[DAY(d)] = (k + i) % 7 === 3 ? 'partial' : 'present';
    });
    const s = { name: v.name, note: v.note, level: v.level, token: tok, marks };
    if (i !== 3) s.agreed = iso(1, ['12:40', '13:05', '18:20', '', '12:55'][i] || '12:00');
    return s;
  });
  if (WHICH === 'visit') list[0].cert = signed(TUTORS[0], 16, '17:55');
  return { students: list };
}

/* ---- the page that builds the documents ---------------------------------- */
async function docBuilder(settings) {
  const dir = mkdtempSync(join(tmpdir(), 'standing-'));
  for (const f of readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f))) copyFileSync(join(HERE, f), join(dir, f));
  writeFileSync(join(dir, 'hub-store.js'), `window.HubStore={url:'x',token:function(){return '';},key:function(){return 'k';},assessorKey:function(){return '';},volunteerToken:function(){return '';},isVolunteer:function(){return false;},isTutor:function(){return true;},isAssessor:function(){return false;},isTrainee:function(){return false;},call:function(){return Promise.resolve({});},boot:function(){return Promise.resolve({});},me:function(){return Promise.resolve({});},get:function(){return Promise.resolve(null);},put:function(){return Promise.resolve({});},course:function(){return Promise.resolve({settings:${JSON.stringify(settings)},wording:null,critLearn:null});},putCourse:function(){return Promise.resolve({saved:true});},seedCritLearn:function(){return Promise.resolve({seeded:false});},roster:function(){return Promise.resolve({});},withAccess:function(f){return f;}};`);
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  const server = createServer((rq, rs) => {
    const name = decodeURIComponent((rq.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
    let body; try { body = readFileSync(join(dir, name)); } catch { rs.writeHead(404); return rs.end('no'); }
    rs.writeHead(200, { 'Content-Type': TYPES[extname(name)] || 'application/octet-stream' }); rs.end(body);
  });
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { try { localStorage.setItem('hub:k', 'k'); localStorage.removeItem('chub:critlearn'); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/3_tutor_feedback.html?k=k`);
  await page.waitForTimeout(2500);
  const build = st => page.evaluate(s => { eval('draftApply')(s); return eval('buildHTML')(eval('collect')()); }, st);
  return { build, close: async () => { await browser.close(); server.close(); } };
}

/* ---- the course ------------------------------------------------------------ */
const NAME = WHICH === 'start' ? 'Demo — the first week' : 'Demo — before the visit';
let course;
if (REUSE) {
  const oc = await call({ op: 'ownerCourses', owner: OWNER });
  course = (oc.result.courses || []).find(c => c.id === REUSE);
  if (!course) { console.log('no course ' + REUSE); process.exit(1); }
} else if (WRITE) {
  const made = await call({ op: 'createCourse', owner: OWNER, name: NAME });
  if (!made.ok) { console.log('could not make the course: ' + made.error); process.exit(1); }
  course = made.result;
  console.log('made ' + course.id + ' — ' + NAME);
} else {
  course = { id: '(dry run)', tutorKey: '(dry run)', assessorKey: '' };
}
if (KEEP.has(course.id)) { console.log('refusing to touch ' + course.id); process.exit(1); }
const KEY = course.tutorKey;
console.log(`${NAME}: ${START} → ${END}, pinned to day ${PIN_DAY} (${PIN}), visit day ${VISIT_DAY} (${DAY(VISIT_DAY)})`);
console.log('teaching days: ' + Object.entries(TEACH).map(([tp, [a, b]]) => `TP${tp} d${a}/d${b}`).join(' '));

/* the people */
let people = [];
if (WRITE) {
  const roster = await call({ op: 'roster', key: KEY });
  const have = new Map(Object.values(roster.result.trainees || {}).filter(Boolean).map(t => [t.name, t]));
  const missing = CANDS.filter(c => !have.has(c.name));
  if (missing.length) {
    const a = await must('addTrainees', { op: 'addTrainees', key: KEY, trainees: missing.map(c => ({ name: c.name, group: '1' })) });
    Object.values((a.result && a.result.trainees) || {}).filter(Boolean).forEach(t => have.set(t.name, t));
  }
  people = CANDS.map(c => Object.assign({}, c, { token: have.get(c.name).token }));
} else {
  people = CANDS.map((c, i) => Object.assign({}, c, { token: 'dry' + i }));
}
const rot = R.rotate(people.map(p => ({ token: p.token, name: p.name })), { tps: TP_COUNT, groupOffset: 0 });
const setOf = token => rot.sets.findIndex(s => s.some(q => q.token === token));
console.log('sets: ' + rot.sets.map(s => s.map(p => p.name.split(' ')[0]).join(', ')).join('  |  '));

const settings = settingsFor(people.map(p => p.token));
const vols = volunteers(course.id === '(dry run)' ? 'cX' : course.id);
const presentOn = day => vols.students.filter(s => s.marks[DAY(day)] === 'present').length + 4;   // four regulars the register does not hold

/* course-level records */
const readBack = async (kind, expectKeys) => {
  const r = await call({ op: 'course', key: KEY });
  const got = r.result && r.result[kind];
  const n = got ? Object.keys(got).length : 0;
  if (n < expectKeys) { console.log(`   ${kind} read back with ${n} keys (expected ≥ ${expectKeys}) — STOPPING`); process.exit(1); }
  console.log(`   ${kind}: ${n} keys`);
};
if (WRITE) {
  await must('settings', { op: 'putCourse', key: KEY, kind: 'settings', data: settings }); await readBack('settings', 20);
  await must('wording', { op: 'putCourse', key: KEY, kind: 'wording', data: WORDING }); await readBack('wording', 4);
  await must('observations', { op: 'putCourse', key: KEY, kind: 'observations', data: OBS_WORDING }); await readBack('observations', 3);
  await must('timetable', { op: 'putCourse', key: KEY, kind: 'timetable', data: timetable() }); await readBack('timetable', 3);
  await must('tppoints', { op: 'putCourse', key: KEY, kind: 'tppoints', data: tppoints(people, rot) }); await readBack('tppoints', 3);
  await must('volunteers', { op: 'putCourse', key: KEY, kind: 'volunteers', data: vols }); await readBack('volunteers', 1);
}

/* the stream, the shared materials, the grid: through their own ops, with the
   moment they happened (the store honours `at` on a pinned course) */
const POSTS = [
  [1, '08:30', TUTORS[0], '', 'Welcome to C/1. Your link is your home for the course: the timetable, your plans, your feedback and your CELTA 5 all live behind it. Day one is orientation and the demonstration lesson at 13:30.'],
  [1, '17:20', TUTORS[0], '', 'TP points for the first week are released. Open TP points from your home: your lesson, the pages and the audio are on the card.'],
  [4, '12:10', TUTORS[1], '', 'Focus on the Learner is due Wednesday at 17:00. The brief and the criteria are on the assignment page; the own-work declaration is part of submitting.', 8],
  [5, '18:05', TUTORS[0], '', 'Stage 1 tutorials start Monday, ten minutes each, in the feedback room after TP.'],
  [9, '09:05', TUTORS[1], '', 'Levels swap after TP4: from Monday the class is B1. Coursebook audio for B1 is in the course files.'],
  [12, '17:30', TUTORS[0], '', 'The TP7 and TP8 planning grid is released to the group. One language lesson and one skills lesson each, and no two of you the same main aim on the same day.', 14],
  [16, '18:15', TUTORS[0], '', 'The Cambridge assessor visits on Thursday 26 March. TP8 feedback is returned by Wednesday evening; please sign anything waiting in your CELTA 5 before then.', 19],
];
const SHARES = [
  [2, '20:10', 0, 'Penguin-counting article, adapted to A2', 'https://drive.google.com/file/d/demo-share-penguins/view', 'handout'],
  [4, '19:45', 3, 'Night baker: gap-fill and answer key', 'https://drive.google.com/file/d/demo-share-baker/view', 'worksheet'],
  [9, '21:00', 1, 'Comparatives: picture prompts', 'https://drive.google.com/file/d/demo-share-comparatives/view', 'handout'],
  [15, '20:30', 4, 'Making arrangements: role cards', 'https://drive.google.com/file/d/demo-share-rolecards/view', 'worksheet'],
];
const GRID = [
  ['Grammar', 'Speaking', 'Speakout B1 unit 7'], ['Vocabulary', 'Reading', 'Speakout B1 unit 8'], ['Grammar', 'Listening', 'Speakout B1 unit 9'],
  ['Functional language', 'Writing', 'Speakout B1 unit 7'], ['Reading', 'Grammar', 'Speakout B1 unit 10'], ['Speaking', 'Vocabulary', 'Speakout B1 unit 8'],
];

/* the candidates' records */
let written = 0;
if (WRITE) {
  const b = await docBuilder(settings);
  for (const [ci, p] of people.entries()) {
    const recs = await candidateRecords(p, ci, p.token, setOf(p.token), rot, b.build, presentOn);
    for (const [kind, data] of Object.entries(recs)) {
      const r = await must(`${p.name} ${kind}`, { op: 'put', key: KEY, token: p.token, kind, data });
      if (r.ok) written++;
    }
    console.log(`${p.name.padEnd(18)} ${Object.keys(recs).join(', ')}`);
  }
  await b.close();

  /* A re-run must not post twice: the stream appends, so what is already
     there is skipped by its text. */
  const already = new Set((((await call({ op: 'course', key: KEY })).result || {}).stream || []).map(p => p.text));
  for (const [day, hhmm, by, to, text, dueDay] of POSTS) {
    if (day > PIN_DAY || already.has(text)) continue;
    const body = { op: 'post', key: KEY, by, to, text, at: iso(day, hhmm) };
    if (dueDay) body.due = iso(dueDay, '17:00');
    await must('post', body);
  }
  for (const [day, hhmm, ci, name, url, kind] of SHARES) {
    if (day > PIN_DAY) continue;
    await must('share', { op: 'shareMaterial', key: KEY, name, url, by: people[ci].name, tp: String(Math.max(1, Math.floor((day - 1) / 2))), kind, at: iso(day, hhmm) });
  }
  if (WHICH === 'visit') {
    for (const [ci, p] of people.entries()) {
      await must('gridSet tp7', { op: 'gridSet', key: KEY, token: p.token, tp: '7', main: GRID[ci][0], sub: GRID[ci][1], material: GRID[ci][2], at: iso(13, '1' + (ci + 2) + ':' + (10 + ci * 7)) });
      await must('gridSet tp8', { op: 'gridSet', key: KEY, token: p.token, tp: '8', main: GRID[ci][1], sub: GRID[ci][0], material: GRID[ci][2], at: iso(13, '1' + (ci + 2) + ':' + (40 + ci * 3)) });
    }
    await must('gridRelease', { op: 'gridRelease', key: KEY, group: '1', released: true, due: iso(14, '17:00') });
  }
} else {
  for (const [ci, p] of people.entries()) console.log(`${p.name.padEnd(18)} set ${setOf(p.token)} — aims: ${[1,2,3,4,5,6,7,8].map(tp => rot.rows[p.token]['tp' + tp]).join(' · ')}`);
  console.log(`\nvolunteers: ${vols.students.map(s => s.name + ' (' + Object.keys(s.marks).length + ' marked' + (s.agreed ? ', agreed' : '') + (s.cert ? ', certificate signed' : '') + ')').join('; ')}`);
  console.log(`posts up to the pin: ${POSTS.filter(p => p[0] <= PIN_DAY).length}; shares: ${SHARES.filter(s => s[0] <= PIN_DAY).length}`);
}

if (WRITE) {
  console.log(`\n${written} candidate records written.`);
  const links = await call({ op: 'assessorLink', key: KEY });
  const ak = (links.result && (links.result.key || links.result.assessorKey)) || course.assessorKey || '';
  console.log(`\ncourse ${course.id} — ${NAME}`);
  console.log('  tutor        https://lite.celtaconnect.com/invite.html?k=' + KEY);
  if (ak) console.log('  assessor     https://lite.celtaconnect.com/invite.html?ak=' + ak);
  console.log('  a candidate  https://lite.celtaconnect.com/invite.html?t=' + people[0].token + '  (' + people[0].name + ')');
  console.log('  a volunteer  https://lite.celtaconnect.com/26_volunteer.html?v=' + vols.students[0].token + '  (' + vols.students[0].name + ')');
}
