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
 * UNFINISHED, 25 Sep 2026. Four of the six steps are solid: the course, its
 * settings, six candidates, and two plans turned in. Returning feedback lands
 * on some runs and not others, and the provisional grades have not landed yet.
 * Both are timing against a store whose calls take 1.5-13 seconds, and both
 * need the writes driven and CONFIRMED one at a time rather than raced -- a
 * rewrite of the last two steps, not another wait.
 *
 * Every failure tonight was a guessed selector or a guessed data shape, found
 * one failed run at a time: wrong field ids, a tabbed panel, an unanswered
 * confirmation modal, and four wrong guesses about shape -- a point lives at
 * state.lists.lST not state.f.st, courseName is top-level not under settings,
 * the roster op returns `records` not `tp`. Print the real shape first. Every
 * one of those cost twenty minutes to discover and would have cost one to look
 * up.
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

/* Wait for the STORE to show it, rather than guessing how long a sync takes.
   Closing the tab a few seconds after Turn in looked like it worked and wrote
   nothing: the record goes to localStorage first and hub-sync pushes it on its
   own schedule, so the only honest signal is the store itself. */
/* The roster op returns each trainee as { token, name, group, created, records }
   -- the work is under `records`, NOT under `tp`. `tp` is the shape hub-sync
   builds in the browser, and testing for it here said "no plan reached the
   store" about a plan that had reached the store on the first attempt. Checked
   against the live store, 25 Sep 2026; the fourth time today a guessed shape
   has cost more than printing one would have. */
const recOf = t => (t && t.records) || {};

async function until(what, test, tries = 15, gap = 4000) {
  for (let i = 0; i < tries; i++) {
    const r = await call({ op: 'roster', key: K });
    const n = Object.values((r && r.trainees) || {}).filter(test).length;
    if (n) return n;
    await new Promise(res => setTimeout(res, gap));
  }
  throw new Error('waited a minute and ' + what + ' never reached the store');
}

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
/* The real ids, read off 6_centre_admin_dashboard.html rather than guessed.
   The first version of this guessed #startDate/#endDate and a bare Add button,
   and `set` swallowed every miss silently -- so the course was made with its
   default name and the run died on a button that was never on the page. Now a
   missed field is an error, because a demo that is quietly half-built is worse
   than one that stops. */
const set = async (sel, v) => {
  const el = await p.$(sel);
  if (!el) throw new Error('no field ' + sel + ' on the course admin screen');
  await el.fill(String(v)); await settle(p, 200);
};
await set('#centreName', 'Demo Centre');
await set('#centreNumber', 'XX000');
await set('#courseName', 'CELTA \u2014 demo course');
await set('#courseStart', day(-18));
await set('#courseEnd', day(4));
await set('#tpCount', '8');
await set('#totalHours', '120');
await set('#tutorNames', 'Ramy Sakr, Pelin Korkmaz');
/* Settings are not kept until Save is pressed -- the screen says so, and the
   first run skipped it, which is why the course kept its default name. */
await p.click('#saveSettings');
await settle(p, 3000);
const named = await p.$eval('#courseName', e => e.value).catch(() => '');
if (!/demo course/i.test(named)) throw new Error('the course name did not save: ' + named);
console.log('  course details saved');

/* ---- 2. the cohort ---- */
const tokens = {};
/* Six at once through the bulk box, which the screen already has: six separate
   round trips to the store is six waits of up to thirteen seconds. */
/* Course admin is TABBED -- Settings, Roster and links, Assignments -- and
   #panel-roster starts display:none. The add-trainee button resolves in the
   DOM the whole time and simply never becomes clickable, which is what the
   first two runs died on. */
await p.click('.tab[data-tab="roster"]'); await settle(p, 1500);
await p.waitForSelector('#toggleAdd', { state: 'visible', timeout: 20000 });
await p.click('#toggleAdd'); await settle(p, 600);
await p.click('#toggleBulk'); await settle(p, 600);
await p.fill('#storeBulkNames', COHORT.map(c => c.name + ', ' + c.group).join('\n'));
await settle(p, 400);
await p.click('#storeBulkAddBtn');
/* "Add all" asks first. Clicking the button and walking away leaves the modal
   open and nothing added -- which is exactly what happened, silently, while
   the script reported success. */
await settle(p, 900);
const confirmAdd = await p.$('.confirm-action');
if (!confirmAdd) throw new Error('no confirmation appeared for the bulk add');
await confirmAdd.click();
await settle(p, 12000);
const roster = await call({ op: 'roster', key: K });
for (const [id, t] of Object.entries((roster && roster.trainees) || {})) tokens[t.name] = t.token || id;
/* Counted off the STORE, not off the screen, and fatal if it is short: a demo
   with no candidates is worse than no demo, and every step after this one
   quietly does nothing without them. */
if (Object.keys(tokens).length < COHORT.length)
  throw new Error('only ' + Object.keys(tokens).length + ' of ' + COHORT.length + ' candidates reached the store');
console.log('  ' + Object.keys(tokens).length + ' candidates added');

/* ---- 3. two of them turn in a plan ---- */
for (const name of Object.keys(FEEDBACK)) {
  const t = tokens[name]; if (!t) continue;
  const already = await call({ op: 'roster', key: K });
  const mine = Object.values((already && already.trainees) || {}).find(x => x.name === name);
  if (mine && (mine.records || {}).plan) { console.log('  ' + name + ' already has a plan — left alone'); continue; }
  const tc = await br.newContext(); const tp = await tc.newPage();
  /* Through invite.html, which is how a candidate actually arrives and what
     puts their token in the browser. */
  await tp.goto(url('invite.html', 't=' + t), { waitUntil: 'domcontentloaded' });
  await settle(tp, 3500);
  await tp.goto(url('1_trainee_plan_and_analysis.html', 't=' + t), { waitUntil: 'domcontentloaded' });
  await settle(tp, 4500);
  /* The real fields, read off the page: the turn-in asks for a name, the main
     aims and a line of procedure, and stops to confirm if any is missing. A
     demo whose plan is empty teaches nothing, so they are filled properly. */
  await tp.fill('#fName', name);
  await tp.fill('#fMain', 'By the end of the lesson learners will be better able to talk about their weekend routines, using the present simple.');
  await tp.fill('#fSub', 'To give controlled and freer speaking practice in a personalised context.');
  const proc = await tp.$('table.proc textarea, table.proc input[type=text]');
  if (proc) { await proc.fill('Lead-in: learners talk in pairs about last weekend.'); }
  await settle(tp, 800);
  await tp.click('#turnInBtn');
  await settle(tp, 900);
  const cf = await tp.$('.confirm-action'); if (cf) { await cf.click(); }
  await settle(tp, 2500);
  /* Kept open until the store has it — hub-sync flushes on its own schedule
     and a closed tab flushes nothing. */
  await until('a plan', t2 => recOf(t2).plan, 12, 4000);
  await tc.close();
}
{
  const n = await until('a plan', t => recOf(t).plan, 1, 0);
  console.log('  ' + n + ' plan(s) turned in');
}

/* ---- 4. feedback returned, with points a tutor would actually write ---- */
for (const [name, f] of Object.entries(FEEDBACK)) {
  const t = tokens[name]; if (!t) continue;
  await p.goto(url('3_tutor_feedback.html', 'k=' + K + '&trainee=' + t), { waitUntil: 'domcontentloaded' });
  /* The page settles itself after boot -- hub-sync replaces the app script and
     the roster arrives -- so wait for a control that only exists once it has,
     rather than for a fixed few seconds. A handle taken too early dies with
     "execution context was destroyed" the moment the page moves under it. */
  await p.waitForSelector('#fGrade', { state: 'visible', timeout: 30000 });
  await p.waitForSelector('#lST .pt-text', { state: 'visible', timeout: 30000 });
  await settle(p, 1500);
  await p.selectOption('#fGrade', 'To standard');
  await p.fill('#fTP', 'TP3');
  for (const [list, text] of [['lSP', f.sp], ['lAP', f.ap], ['lST', f.st], ['lAT', f.at]]) {
    const sel = '#' + list + ' .pt-text';
    await p.waitForSelector(sel, { state: 'visible', timeout: 15000 });
    await p.click(sel);
    await p.keyboard.type(text);
    await settle(p, 300);
  }
  await p.fill('#tOverall', 'A lesson that did what it set out to do.');
  await settle(p, 700);
  const ret = await p.$('#returnBtn');
  if (!ret) throw new Error('no Return button on the feedback screen for ' + name);
  { await ret.click(); await settle(p, 900);
    const cf = await p.$('.confirm-action'); if (cf) await cf.click(); await settle(p, 2500); }
  await until('feedback', t => recOf(t).feedback, 12, 4000);
}
{
  const n = await until('feedback', t => recOf(t).feedback, 1, 0);
  console.log('  feedback returned to ' + n + ' candidate(s)');
}

/* ---- 5. two provisional grades, so the grades report is not blank ---- */
await p.goto(url('13_grades_report.html', 'k=' + K), { waitUntil: 'domcontentloaded' });
/* Same rule as the feedback screen: wait for a control the page only has once
   the roster has arrived. Four and a half seconds was a guess, and a guess
   that lost two grades every run. */
await p.waitForSelector('.cand .grow select.grade[data-grade="provisional"]', { state: 'visible', timeout: 30000 });
await settle(p, 1500);
const grades = ['PASS', 'PASS B'];
for (let i = 0; i < grades.length; i++) {
  const sel = `.cand:nth-of-type(${i + 1}) .grow select.grade[data-grade="provisional"]`;
  const el = await p.$(sel);
  if (!el) break;
  await p.selectOption(sel, grades[i]);
  await settle(p, 500);
}
await p.click('#saveBtn');
await settle(p, 3500);
{
  const after = await call({ op: 'roster', key: K });
  const n = Object.values((after && after.trainees) || {})
    .filter(t => (recOf(t).tracker || {}).grades && recOf(t).tracker.grades.provisional).length;
  if (!n) console.log('  (no provisional grades saved — the grades report will open blank)');
  else console.log('  ' + n + ' provisional grade(s) set');
}

await br.close();

const someone = Object.entries(tokens)[0];
console.log('\n' + '='.repeat(66));
console.log('DEMO COURSE ' + made.id + '  (' + LABEL + ')');
console.log('='.repeat(66));
/* Through the card, as the owner console now hands it out: the card says what
   the link is and who it is for, then opens the dashboard. */
console.log('\nTutor — this is the one to send:\n  ' + url('invite.html', 'k=' + K));
if (someone) console.log('\nA candidate, ' + someone[0] + ', so they can see the other side:\n  ' + url('invite.html', 't=' + someone[1]));
if (AK) console.log('\nAssessor, view only:\n  ' + url('invite.html', 'ak=' + AK));
console.log('\nWhen you are done:  node demo-clear.mjs ' + made.id);
console.log('Deleting it kills all three links at once.\n');
