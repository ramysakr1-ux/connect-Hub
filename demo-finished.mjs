/**
 * Build the finished demo course: twelve candidates, eight returned teaching
 * practices each, four marked assignments each, grades and full end-of-course
 * reports.
 *
 *   node demo-finished.mjs            what it would make
 *   node demo-finished.mjs --write    make it
 *   node demo-finished.mjs --write --course c7    carry on with one it made
 *
 * Why this exists. The running demo course (c3) stands three weeks in: plans
 * waiting for feedback, assignments waiting to be marked, no final grades. A
 * course three weeks in has no end-of-course report, so a film that wants to
 * show one needs a course that is over (Ramy, 26 Sep 2026). A centre's console
 * showing one course running and one finished is also just what a centre looks
 * like.
 *
 * How the documents are made. Every returned teaching practice carries the
 * frozen document the trainee reads, and that document is built by the
 * feedback screen itself -- this opens the real page, hands it a plan and a
 * feedback state, and takes back what its own Return button would have
 * written. Nothing here writes HTML by hand, so the documents are the product's
 * and stay the product's when it changes.
 *
 * What it will not do. It refuses to touch c1, c2 or c3.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { COURSE, SLOTS, TOPICS, CANDIDATES } from './demo-finished-data.mjs';

const WRITE = process.argv.includes('--write');
const REUSE = (process.argv[process.argv.indexOf('--course') + 1] || '').match(/^c\d+$/) ? process.argv[process.argv.indexOf('--course') + 1] : '';
const KEEP = new Set(['c1', 'c2', 'c3']);

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const call = async (b, tries = 6) => {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};

/* ---- the course ---------------------------------------------------------- */
let course;
if (REUSE) {
  const oc = await call({ op: 'ownerCourses', owner: OWNER });
  course = (oc.result.courses || []).find(c => c.id === REUSE);
  if (!course) { console.log('no course ' + REUSE); process.exit(1); }
  console.log('carrying on with ' + course.id);
} else if (WRITE) {
  const made = await call({ op: 'createCourse', owner: OWNER, name: COURSE.name });
  if (!made.ok) { console.log('could not make the course: ' + made.error); process.exit(1); }
  course = made.result.course || made.result;
  console.log('made ' + course.id + ' — ' + COURSE.name);
} else {
  course = { id: '(dry run)', tutorKey: '(dry run)' };
}
if (KEEP.has(course.id)) { console.log('refusing to touch ' + course.id); process.exit(1); }
const KEY = course.tutorKey;

if (WRITE) {
  const s = await call({ op: 'putCourse', key: KEY, kind: 'settings', data: COURSE.settings });
  console.log(s.ok ? 'settings saved' : 'settings FAILED: ' + s.error);
}

/* ---- the people ---------------------------------------------------------- */
const roster = WRITE ? await call({ op: 'roster', key: KEY }) : { result: { trainees: {} } };
const have = new Map(Object.values(roster.result.trainees || {}).map(t => [t.name, t]));
const people = [];
for (const c of CANDIDATES) {
  if (have.has(c.name)) { people.push(Object.assign({}, c, { token: have.get(c.name).token })); continue; }
  if (!WRITE) { people.push(Object.assign({}, c, { token: 'dry' })); continue; }
  const a = await call({ op: 'addTrainee', key: KEY, name: c.name, group: c.group });
  if (!a.ok) { console.log('could not add ' + c.name + ': ' + a.error); process.exit(1); }
  people.push(Object.assign({}, c, { token: a.result.token }));
}
console.log(people.length + ' candidates');

/* ---- dates: eight teaching practices across four weeks ------------------- */
const start = new Date(COURSE.settings.start + 'T00:00:00Z');
const tpDate = n => {                       /* two a week, Tuesday and Thursday */
  const week = Math.floor((n - 1) / 2), day = (n - 1) % 2 ? 3 : 1;
  const d = new Date(start); d.setUTCDate(d.getUTCDate() + week * 7 + day);
  return d.toISOString().slice(0, 10);
};
const at = n => Date.parse(tpDate(n) + 'T17:30:00Z');

/* ---- one lesson --------------------------------------------------------- */
const bullets = a => a.map(x => '• ' + x).join('\n');

function lesson(cand, ci, slot) {
  const topic = TOPICS[(ci + slot.n) % TOPICS.length];
  const tl = topic.tl, level = slot.level;
  const rows = slot.stages.map((name, i) => ({
    stage: name, aim: '', int: ['T–S + OC', 'PW + OC', 'Ind. + PW', 'PW', 'Ind. + PW + OC', 'OC'][i % 6],
    time: String([5, 8, 8, 7, 10, 7][i % 6]),
    proc: bullets(procFor(name, topic, level)),
  }));
  const total = rows.reduce((s, r) => s + Number(r.time), 0);
  if (total !== 45) rows[rows.length - 1].time = String(Number(rows[rows.length - 1].time) + (45 - total));
  return {
    v: 1, kind: 'celta-tp',
    meta: { name: cand.name, tp: String(slot.n), level, date: tpDate(slot.n), length: '45', framework: slot.shape },
    plan: {
      main: bullets([`To ${slot.focus.toLowerCase()} in the context of ${topic.text.toLowerCase()}`,
                     `To clarify and practise ${tl} at ${level}`]),
      sub: bullets(['To develop oral fluency through a short reaction task',
                    'To give practice in working out meaning from context']),
      pers: bullets(slot.n === 1 ? ['To set every task before handing anything out']
                                 : [`${cand.teachA[0][1]} (carried from TP${slot.n - 1})`]),
      mats: bullets([`${topic.text}, adapted to ${level}`, 'Handout 1 — gist and detail questions',
                     'Handout 2 — controlled practice', 'Board plan in the appendix']),
      matsLink: '', matsFile: null,
      profile: `Twelve adults at ${level}. Mixed first languages — Turkish, Arabic, Spanish, one Farsi speaker — and mixed ages. They are confident speakers for the level and prefer to see language written down before they use it.`,
      /* problem and solution as their own pair, which is what the analysis
         sheet prints and what 4j and 4k are actually about. */
      probs: [
        { problem: `Some learners may already know ${topic.items[0]}, and the presentation stage stalls.`,
          solution: 'Elicit before teaching; if it is known, check it once and move straight to the next item.' },
        { problem: 'Reading every word and translating, so the gist task overruns.',
          solution: 'A tight time limit, said aloud and shown on the clock, and stop them when it ends.' },
        { problem: 'Stronger learners finish the detail task in half the time.',
          solution: 'They compare with a neighbour and write one more question of their own for the class.' },
      ],
      rows,
    },
    la: {
      type: 'vocab', context: topic.text, mainAim: 'Yes', blocks: [],
      vocab: topic.items.map(item => ({
        item, def: `as used in ${topic.text.toLowerCase()}`,
        convey: 'Elicit from the context, then check with a concept question',
        clar: 'Elicit from the context, then check with a concept question',
        form: 'See the analysis sheet for part of speech and pattern',
        prob: 'Stress is the likely difficulty; drill the whole chunk, then backchain',
      })),
      ref: 'Oxford Learner’s Dictionary; the adapted text',
    },
    self: {
      well: bullets(['The task was set before the handout went out, and checked.',
                     'The pair check before open class meant everybody had an answer ready.']),
      not: bullets(['The clarification stage ran over and the last stage lost time.']),
      learn: bullets(['A time limit only works if I stop them when it ends.']),
      diff: bullets(['I would cut one of the detail questions and give the minutes to the freer stage.']),
      next: bullets([cand.teachA[0][1]]),
      actions: '',
    },
    feedback: null,
  };
}

function procFor(name, topic, level) {
  const n = name.toLowerCase();
  if (/lead-in/.test(n)) return ['Photo and headline on the board. In pairs: what is this about, and do you do it?', 'Two answers in open class. No correction here.'];
  if (/prediction/.test(n)) return ['Headline only. In pairs, three things they expect the text to say.', 'Take four ideas on the board; they check them in the next stage.'];
  if (/pre-teach/.test(n)) return [`Elicit ${topic.items.join(', ')} from the context, one at a time.`, 'Concept check each, drill the stress, board the form.'];
  if (/gist/.test(n)) return ['Set the question before the handout. Three minutes.', 'Pairs compare, then whole-class check against their predictions.'];
  if (/detail/.test(n)) return ['Four questions on the board, six minutes, alone.', 'Pairs compare; nominate for the answers and ask them to justify from the text.'];
  if (/post-/.test(n)) return ['Prompt on the board; model with a strong pair.', 'Monitor for content and for the target language; collect examples for the feedback.'];
  if (/present:|highlighting/.test(n)) return [`Board the marker sentence from the text. Elicit meaning with concept questions.`, `Form on the board; drill the whole chunk, then backchain.`];
  if (/clarif/.test(n)) return ['Meaning, then form, then pronunciation, in that order.', 'Check with two concept questions before any practice.'];
  if (/first test/.test(n)) return ['Handout 1 — they do what they can alone, then compare.', 'Monitor to find out what they already know; do not correct yet.'];
  if (/teach \(/.test(n)) return ['Clarify only the items the diagnostic showed they need.', 'Board them; drill; check with concept questions.'];
  if (/second test/.test(n)) return ['Handout 2, the same task type as the diagnostic.', 'Pairs compare; open-class check against the board.'];
  if (/controlled practice/.test(n)) return ['Handout 2, eight items, alone then in pairs.', 'Open-class check; drill any item that caused trouble.'];
  if (/freer practice/.test(n)) return ['Role cards in pairs, three rounds, swapping partners.', 'Monitor from a distance; note examples for correction.'];
  if (/preparing to/.test(n)) return ['Give the task and the time; two minutes to plan alone.', 'Model the first exchange with a strong learner.'];
  if (/speaking \/ writing task|reading or listening task/.test(n)) return ['The task itself, in pairs, eight minutes.', 'Monitor and collect language for the feedback stage.'];
  if (/error correction|feedback/.test(n)) return ['Four sentences from the monitoring on the board — two right, two wrong.', 'Pairs decide which need fixing; drill the corrected forms.'];
  if (/extension/.test(n)) return ['If time: change partners and repeat the task with a new prompt.'];
  return ['Set the task, check it, and let them do it.', 'Monitor; take feedback from what you hear.'];
}

/* ---- one returned feedback ---------------------------------------------- */
const tag = (code, text) => `${text} <span class="tag" contenteditable="false" data-c="${code}" title="">${code}</span>&nbsp;`;

function feedbackState(cand, doc, slot) {
  const grade = cand.arc[slot.n - 1];
  const tutor = (cand.group === '1') === (slot.n <= 4) ? 'Jordan Blake' : 'Diane Okonkwo';
  const pick = (bank, k) => bank[Math.min(k, bank.length - 1)];
  const lists = {
    lSP: [pick(cand.planS, 0), pick(cand.planS, (slot.n) % cand.planS.length)].map(([c, t]) => ({ html: tag(c, t), star: false })),
    lAP: [pick(cand.planA, (slot.n) % cand.planA.length)].map(([c, t]) => ({ html: tag(c, t), star: slot.n < 8 })),
    lST: [pick(cand.teachS, 0), pick(cand.teachS, (slot.n + 1) % cand.teachS.length)].map(([c, t]) => ({ html: tag(c, t), star: false })),
    lAT: [pick(cand.teachA, (slot.n) % cand.teachA.length)].map(([c, t]) => ({ html: tag(c, t), star: slot.n < 8 })),
  };
  const tcomm = {};
  doc.plan.rows.forEach((r, i) => { tcomm['st' + i] = stageComment(i, grade); });
  doc.la.vocab.forEach((v, i) => { tcomm['vo' + i] = 'Accurate, and the concept question would do the work in class.'; });
  return {
    f: {
      fTP: 'TP' + slot.n, fDate: doc.meta.date, fTutor: tutor, fLevel: slot.level, fTime: '45',
      fStudents: '12', fMain: '', fSub: '', fGrade: grade,
      tOverall: overallFor(cand, slot, grade),
      tSelf: 'An honest self-evaluation that names the same things I did, and says what you will do about them. That is what this document is for.',
      tLA: 'Accurate and usable. One more example of the negative form would finish it.',
    },
    lists, tcomm, doc,
  };
}

function stageComment(i, grade) {
  const good = ['A quick, clean way in — and you resisted correcting here, which was right.',
    'Well set up: the instruction came before the paper and you checked it.',
    'Clear clarification, and the board work was worth copying down.',
    'Purposeful monitoring — you were listening for the language you had taught.',
    'Good pattern in the correction: two right and two wrong keeps it from feeling like a list of failures.',
    'You protected this stage, which is where the lesson consolidates.'];
  const weak = ['This ran long, and it was the presentation rather than the practice that took the time.',
    'The instruction went out with the paper; give it first and check it.',
    'Too many items for one stage — three would have been taught properly.',
    'You were close enough to the pairs that the talking stopped.',
    'This stage was cut for time, and it is the one the lesson needed.',
    'Take two answers here, not six.'];
  return grade === 'Below standard' ? weak[i % weak.length]
       : grade === 'Above standard' ? good[i % good.length]
       : (i % 2 ? good[i % good.length] : weak[i % weak.length]);
}

function overallFor(cand, slot, grade) {
  const first = cand.name.split(' ')[0];
  if (grade === 'Above standard') return `A very good lesson, ${first}. The aims were met, the learners produced the language, and you made two adjustments in the room that the plan did not contain. ${cand.teachA[0][1]} is the one thing still worth your attention.`;
  if (grade === 'Below standard') return `This lesson did not meet the standard, ${first}, and the reason is the one we have talked about: the early stages took the time the later ones needed, so the lesson did not arrive where your plan said it would. What was good was real — the learners were with you and they wanted to do the work. Take the action points into the next one and we will look at it again.`;
  return `A solid lesson, ${first}. The plan was thorough and you taught the plan you wrote, which is not nothing. The learners were engaged and they produced the target language — that is the test, and you passed it. ${cand.teachA[0][1]} is what to carry into the next one.`;
}

/* ---- the page that builds the documents ---------------------------------- */
const dir = mkdtempSync(join(tmpdir(), 'finished-'));
for (const f of readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f))) copyFileSync(join(HERE, f), join(dir, f));
writeFileSync(join(dir, 'hub-store.js'), `window.HubStore={url:'x',token:function(){return '';},key:function(){return 'k';},assessorKey:function(){return '';},isTutor:function(){return true;},isAssessor:function(){return false;},isTrainee:function(){return false;},call:function(){return Promise.resolve({});},boot:function(){return Promise.resolve({});},me:function(){return Promise.resolve({});},get:function(){return Promise.resolve(null);},put:function(){return Promise.resolve({});},course:function(){return Promise.resolve({settings:${JSON.stringify(COURSE.settings)},wording:null,critLearn:null});},putCourse:function(){return Promise.resolve({saved:true});},seedCritLearn:function(){return Promise.resolve({seeded:false});},roster:function(){return Promise.resolve({});},withAccess:function(f){return f;}};`);
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
const buildDoc = st => page.evaluate(s => { eval('draftApply')(s); return eval('buildHTML')(eval('collect')()); }, st);

/* ---- write it ------------------------------------------------------------ */
let docs = 0, writes = 0;
for (const [ci, cand] of people.entries()) {
  const history = {};
  let last = null;
  for (const slot of SLOTS) {
    const doc = lesson(cand, ci, slot);
    const state = feedbackState(cand, doc, slot);
    const html = await buildDoc(state);
    docs++;
    history[slot.n] = { status: 'returned', label: slot.n + ' · ' + cand.name, state, returnedAt: at(slot.n), docHTML: html };
    last = { doc, state, html, slot };
  }
  console.log(cand.name.padEnd(20) + '8 teaching practices, ' + cand.arc.filter(g => g === 'Above standard').length + ' above / '
    + cand.arc.filter(g => g === 'Below standard').length + ' below, ' + cand.final);
  if (!WRITE) continue;

  for (const n of Object.keys(history)) {
    const out = await call({ op: 'put', key: KEY, token: cand.token, kind: 'tpHistory', data: { [n]: history[n] } });
    if (!out.ok) { console.log('   TP' + n + ' FAILED: ' + out.error); continue; }
    writes++;
  }
  /* The last one is also what is on the tutor's screen and the trainee's desk. */
  await call({ op: 'put', key: KEY, token: cand.token, kind: 'feedback', data: history[8] });
  await call({ op: 'put', key: KEY, token: cand.token, kind: 'plan', data: { status: 'turned_in', label: '8 · ' + cand.name, state: last.doc, centreName: COURSE.settings.centreName, turnedInAt: at(8) - 6e5, docHTML: '' } });
  await call({ op: 'put', key: KEY, token: cand.token, kind: 'selfeval', data: { status: 'turned_in', label: '8 · ' + cand.name, state: last.doc.self, turnedInAt: at(8) - 3e5 } });
  writes += 3;
}

/* ---- assignments and grades --------------------------------------------- */
const ASG = { fol: 'Focus on the Learner', lrt: 'Language Related Tasks', lsrt: 'Language Skills Related Tasks', lfc: 'Lessons from the Classroom' };
const asgAt = { fol: at(2), lrt: at(4), lsrt: at(6), lfc: at(8) };

function assignment(cand, code, how) {
  const marker = cand.group === '1' ? 'Jordan Blake' : 'Diane Okonkwo';
  const body = `This assignment is submitted as part of the CELTA course at ${COURSE.settings.centreName}. It addresses each of the criteria set out in the brief, in the order the brief gives them, with reference to the teaching practice class and to the reading listed at the end.`;
  const sub = { picked: {}, text: { 1: body }, fields: {}, decl: { 8: { checks: [true, true, true], aiUsed: 'no', aiLink: '', aiPurpose: '' } }, materialsLink: '' };
  const base = {
    stage: 'closed', usedResubmission: how === 'resub',
    sub1: sub, sub2: how === 'resub' ? sub : null,
    criteriaMarks: { sub1: [true, true, true, true], sub2: how === 'resub' ? [true, true, true, true] : [] },
    criteriaComments: { sub1: ['Met.', 'Met.', 'Met.', 'Met.'], sub2: [] },
    markers: { first: marker, second: '', doubleMarked: false },
    sub1At: asgAt[code] - 864e5, marked1At: asgAt[code],
    feedback: {
      outcome: how === 'resub' ? 'Pass (on resubmission)' : 'Pass',
      generalComment1: how === 'resub'
        ? 'Not yet met on one criterion: the rationale for the second activity did not follow from the problem you identified. Everything else is there. Resubmit that section only.'
        : 'A careful, well-organised piece of work that does what the brief asks. The examples are from your own teaching practice class and they are used, not just mentioned.',
      generalComment2: how === 'resub' ? 'The resubmitted section deals fully with the point raised. Passed.' : '',
    },
  };
  if (how === 'extension') base.extension = { until: new Date(asgAt[code] + 3 * 864e5).toISOString().slice(0, 10), reason: 'Documented personal circumstances; agreed with the course tutor.' };
  return base;
}

for (const cand of people) {
  const grades = {
    provisional: cand.final, final: cand.final, hoursAttended: '120',
    planS: cand.planS.map(([code, text]) => ({ text, code })),
    planA: cand.planA.map(([code, text]) => ({ text, code })),
    teachS: cand.teachS.map(([code, text]) => ({ text, code })),
    teachA: cand.teachA.map(([code, text]) => ({ text, code })),
    update: cand.tutorial,
    evidence: cand.final === 'FAIL'
      ? 'Five of the eight assessed lessons were below the standard and the difficulties recurred. Seen at both tutorials and again in week four, with an action plan agreed and recorded each time.'
      : (/PASS [AB]/.test(cand.final) ? 'The standing above is supported by the teaching practice records, which show the action points from the first tutorial met and held.' : ''),
    overall: cand.report.join('\n\n'),
  };
  console.log(cand.name.padEnd(20) + cand.final + ', ' + Object.keys(cand.assignments).length + ' assignments, '
    + grades.overall.split(/\s+/).length + '-word report');
  if (!WRITE) continue;
  const asg = {};
  for (const [code, how] of Object.entries(cand.assignments)) asg[code] = assignment(cand, code, how);
  const a = await call({ op: 'put', key: KEY, token: cand.token, kind: 'assignments', data: asg });
  const t = await call({ op: 'put', key: KEY, token: cand.token, kind: 'tracker', data: { grades } });
  if (!a.ok) console.log('   assignments FAILED: ' + a.error);
  if (!t.ok) console.log('   tracker FAILED: ' + t.error);
  writes += 2;
}

await browser.close(); server.close();
console.log('\n' + docs + ' documents built by the feedback screen, ' + writes + ' records written.');
if (WRITE) {
  const links = await call({ op: 'assessorLink', key: KEY });
  console.log('\ncourse ' + course.id);
  console.log('  tutor     https://ramysakr1-ux.github.io/connect-Hub/invite.html?k=' + KEY);
  if (links.ok) console.log('  assessor  https://ramysakr1-ux.github.io/connect-Hub/invite.html?ak=' + (links.result.key || links.result.assessorKey || ''));
  console.log('  a candidate  https://ramysakr1-ux.github.io/connect-Hub/invite.html?t=' + people[0].token + '  (' + people[0].name + ')');
}
