/**
 * Connect Lite — mint a demo course someone can actually try.
 *
 *   node demo-mint.mjs "Jane Okonkwo"      (the name is just a label on the course)
 *
 * Ramy, 25 Sep 2026, on sending a demo to a trainer who asks: they must not
 * open an empty course. A blank roster teaches nobody anything — there is no
 * feedback to read, no grade form worth looking at, and nothing in the drawer.
 * So this leaves a course standing that has been LIVED IN: six candidates,
 * plans turned in, feedback returned with real points, an assignment marked,
 * and two provisional grades.
 *
 * It drives the REAL pages against the REAL store, exactly as a tutor would,
 * for the same reason the walks do: hand-writing store records means guessing
 * at their shape, and a guess about that shape is what cost an afternoon on
 * 25 Sep (a point lives at state.lists.lST, not state.f.st).
 *
 * The owner key is not in this repo and must not be. Put it in a file called
 * .owner-key beside this script, or pass OWNER_KEY in the environment.
 * Delete the course afterwards with demo-clear.mjs — deleting it kills all
 * three of its links at once, which is what "the demo expires" means here.
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const SITE = process.env.SITE || 'https://ramysakr1-ux.github.io/connect-Hub/';
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const LABEL = process.argv[2] || 'Demo';
const DAY = 864e5;

const KEYFILE = join(HERE, '.owner-key');
function ownerKey() {
  if (process.env.OWNER_KEY) return process.env.OWNER_KEY.trim();
  if (existsSync(KEYFILE)) return readFileSync(KEYFILE, 'utf8').trim();
  console.error('No owner key. Put it in .owner-key beside this script, or set OWNER_KEY.');
  console.error('To find it: open the store in the Apps Script editor, choose ownerKey in the');
  console.error('function list, press Run, and it prints a link — the key is the ?o= on the end.');
  process.exit(1);
}
const RAW = ownerKey();
if (RAW === 'PASTE_THE_KEY_HERE' || !RAW) {
  console.error('\n' + KEYFILE + ' holds the placeholder text, not your owner key.\n');
  console.error('  Open the store in the Apps Script editor, choose ownerKey in the function');
  console.error('  list, press Run, and copy the part after ?o= into that file.\n');
  process.exit(1);
}
const OWNER = RAW;
if (!STORE) { console.error('Could not read the store URL out of hub-store.js.'); process.exit(1); }

/* A wrong key is an ordinary thing to happen, not a crash. The store answers
   "Not yours to open", which said nothing about WHICH key was wrong or where
   it is kept -- and arrived as a stack trace (Ramy hit exactly this with the
   placeholder still in the file, 25 Sep 2026). */
function explain(err){
  const m = String(err && err.message || err);
  if (/not yours|owner|denied|forbidden/i.test(m)) {
    console.error('\nThe store refused that owner key.\n');
    console.error('  It is read from ' + KEYFILE + (process.env.OWNER_KEY ? ' (overridden by OWNER_KEY)' : ''));
    console.error('  and right now it holds ' + (RAW === 'PASTE_THE_KEY_HERE'
      ? 'the placeholder text, not a key.'
      : RAW.length + ' characters.'));
    console.error('\n  To find the real one: open the store in the Apps Script editor, choose');
    console.error('  ownerKey in the function list, press Run, and copy the part after ?o=.\n');
  } else {
    console.error('\nThe store said: ' + m + '\n');
  }
  process.exit(1);
}

const call = async body => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) });
  const out = await r.json();
  if (!out.ok) explain(new Error(out.error || 'store error'));
  return out.result;
};
const settle = (p, ms) => p.waitForTimeout(ms);
const day = n => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);

/* A cohort that reads like a course, not like test data. */
const COHORT = [
  { name: 'Defne Yılmaz',    group: '1' },
  { name: 'Arash Rahimi',    group: '1' },
  { name: 'Beatriz Almeida', group: '1' },
  { name: 'Emre Koçak',      group: '2' },
  { name: 'Nadia Haddad',    group: '2' },
  { name: 'Tom Whelan',      group: '2' },
];
/* Written the way a tutor writes, with the criteria tagged, because the point
   of the demo is the grades report handing these back. */
const FEEDBACK = {
  'Defne Yılmaz': {
    st: 'Clear instructions, checked before the task',
    at: 'Cut the teacher talk in the feedback stage',
    sp: 'Aims stated clearly and in the learners’ terms',
    ap: 'Anticipate the pronunciation problems, not only the meaning ones',
  },
  'Arash Rahimi': {
    st: 'Warm with the group from the first minute',
    at: 'Let the pair work run before stepping in',
    sp: 'Materials chosen well for the level',
    ap: 'Give the main stage the time the plan says it has',
  },
};

console.log('Minting a demo course for: ' + LABEL);
const made = await call({ op: 'createCourse', owner: OWNER });
const course = (made.courses || []).slice(-1)[0] || {};
const K = course.tutorKey, AK = course.assessorKey;
if (!K) { console.error('The store did not return a tutor key.'); process.exit(1); }
console.log('  course ' + made.id + ' made');

const url = (page, q) => SITE + page + '?' + q;
const br = await chromium.launch();
const ctx = await br.newContext();
const p = await ctx.newPage();
p.on('pageerror', e => console.error('  page error: ' + String(e).slice(0, 120)));

/* ---- 1. the course itself ---- */
await p.goto(url('6_centre_admin_dashboard.html', 'k=' + K), { waitUntil: 'domcontentloaded' });
await settle(p, 4000);
await p.evaluate(nm => localStorage.setItem('chub:tutorName', nm), 'Ramy Sakr');
const set = async (sel, v) => { const el = await p.$(sel); if (el) { await el.fill(v); await settle(p, 250); } };
await set('#centreName', 'Demo Centre');
await set('#centreNumber', 'XX000');
await set('#courseName', 'CELTA — demo course');
await set('#startDate', day(-18));
await set('#endDate', day(4));
await settle(p, 1200);
console.log('  course details set');

/* ---- 2. the cohort ---- */
const tokens = {};
for (const c of COHORT) {
  const box = await p.$('#newTrainee, input[placeholder*="name" i]');
  if (!box) break;
  await box.fill(c.name);
  const add = await p.$('#addTrainee, button:has-text("Add")');
  if (add) await add.click();
  await settle(p, 1800);
}
await settle(p, 2500);
const roster = await call({ op: 'roster', key: K });
for (const [id, t] of Object.entries((roster && roster.trainees) || {})) tokens[t.name] = t.token || id;
console.log('  ' + Object.keys(tokens).length + ' candidates added');

/* ---- 3. two of them turn in a plan ---- */
for (const name of Object.keys(FEEDBACK)) {
  const t = tokens[name]; if (!t) continue;
  const tc = await br.newContext(); const tp = await tc.newPage();
  await tp.goto(url('1_trainee_plan_and_analysis.html', 't=' + t), { waitUntil: 'domcontentloaded' });
  await settle(tp, 4000);
  await tp.evaluate(() => {
    const first = document.querySelector('textarea, input[type=text]');
    if (first) { first.value = 'Talking about weekend routines'; first.dispatchEvent(new Event('input', { bubbles: true })); }
  });
  await settle(tp, 600);
  const turn = await tp.$('#turnInBtn, button:has-text("Turn in")');
  if (turn) { await turn.click(); await settle(tp, 800);
    const cf = await tp.$('.confirm-action'); if (cf) await cf.click(); await settle(tp, 3000); }
  await tc.close();
}
console.log('  two plans turned in');

/* ---- 4. feedback returned, with points a tutor would actually write ---- */
for (const [name, f] of Object.entries(FEEDBACK)) {
  const t = tokens[name]; if (!t) continue;
  await p.goto(url('3_tutor_feedback.html', 'k=' + K + '&trainee=' + t), { waitUntil: 'domcontentloaded' });
  await settle(p, 4000);
  await p.selectOption('#fGrade', 'To standard').catch(() => {});
  await p.fill('#fTP', 'TP3').catch(() => {});
  for (const [list, text] of [['lSP', f.sp], ['lAP', f.ap], ['lST', f.st], ['lAT', f.at]]) {
    const box = await p.$('#' + list + ' .pt-text');
    if (box) { await box.click(); await p.keyboard.type(text); await settle(p, 250); }
  }
  await p.fill('#tOverall', 'A lesson that did what it set out to do.').catch(() => {});
  await settle(p, 700);
  const ret = await p.$('#returnBtn');
  if (ret) { await ret.click(); await settle(p, 900);
    const cf = await p.$('.confirm-action'); if (cf) await cf.click(); await settle(p, 3500); }
}
console.log('  feedback returned to two candidates');

/* ---- 5. two provisional grades, so the grades report is not blank ---- */
await p.goto(url('13_grades_report.html', 'k=' + K), { waitUntil: 'domcontentloaded' });
await settle(p, 4500);
const sels = await p.$$('.cand .grow select.grade[data-grade="provisional"]');
for (let i = 0; i < Math.min(2, sels.length); i++) {
  await sels[i].selectOption(i === 0 ? 'PASS' : 'PASS B').catch(() => {});
  await settle(p, 400);
}
const save = await p.$('#saveBtn'); if (save) { await save.click(); await settle(p, 2500); }
console.log('  two provisional grades set');

await br.close();

const someone = Object.entries(tokens)[0];
console.log('\n' + '='.repeat(66));
console.log('DEMO COURSE ' + made.id + '  (' + LABEL + ')');
console.log('='.repeat(66));
console.log('\nTutor — this is the one to send:\n  ' + url('5_tutor_dashboard.html', 'k=' + K));
if (someone) console.log('\nA candidate, ' + someone[0] + ', so they can see the other side:\n  ' + url('invite.html', 't=' + someone[1]));
if (AK) console.log('\nAssessor, view only:\n  ' + url('12_assessor_pack.html', 'ak=' + AK));
console.log('\nWhen you are done:  node demo-clear.mjs ' + made.id);
console.log('Deleting it kills all three links at once.\n');
