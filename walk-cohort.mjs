/**
 * Connect Lite — a whole cohort, the shape the next real course will have.
 *
 *   node walk-cohort.mjs            SHOTS=<dir> node walk-cohort.mjs
 *
 * walk-roles.mjs proves the MECHANISM with one candidate: every store path,
 * every refusal, every lock. This proves the SHAPE, which one candidate cannot
 * show -- Ramy, 25 Sep 2026: "aim for a course mimicking the next course, we'll
 * have a course of five or six... one trainer first half, second trainer second
 * half, but two trainers on the full course. Assessor pack. It's a four week
 * course."
 *
 * So: six candidates in two groups, four weeks, eight teaching practices each,
 * a first-half tutor and a second-half tutor sharing ONE course key (Lite has
 * one tutor link per course by design), work spread unevenly across the cohort
 * the way a real course is, and the assessor arriving at the end to a pack that
 * has to hold all six. What it looks for is what a one-candidate walk cannot
 * see: a roster that stays legible at six, columns that hold six rows, grades
 * that stay attached to the right person, letters that do not drift, and every
 * total that should equal six actually equalling six.
 *
 * Same harness rule as the other two: copy the site, THEN point hub-store at a
 * fake store in this process.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = new URL('.', import.meta.url).pathname;
const DAY = 864e5;

/* ---------------- the cohort ---------------- */
const COHORT = [
  { name: 'Defne Yılmaz',     group: '1' },
  { name: 'Arash Rahimi',     group: '1' },
  { name: 'Beatriz Almeida',  group: '1' },
  { name: 'Emre Koçak',       group: '2' },
  { name: 'Nadia Haddad',     group: '2' },
  { name: 'Tom Whelan',       group: '2' },
];
const TUTOR_1 = 'Ramy Sakr';          // weeks 1-2
const TUTOR_2 = 'Pelin Korkmaz';      // weeks 3-4

/* ---------------- the fake store ---------------- */
const STORE = { course: { settings: null, wording: null }, trainees: {}, key: 'tutor-key-1', akey: 'assessor-key-1', calls: [] };
const REFUSE = { ok: false, error: 'This link is not on a course' };
function handle(p){
  STORE.calls.push(p.op);
  const tr = tok => STORE.trainees[tok];
  const rosterOut = () => Object.values(STORE.trainees).map(t => ({ token: t.token, name: t.name, group: t.group, created: t.created, records: t.records }));
  const isTutor = p.key === STORE.key, isAssessor = p.a === STORE.akey;
  switch (p.op) {
    case 'ping': return { ok: true, result: { pong: true } };
    case 'boot':
      if (p.token) { const t = tr(p.token); if (!t) return REFUSE; return { ok: true, result: { me: { token: t.token, name: t.name, group: t.group, records: t.records }, course: STORE.course } }; }
      if (isTutor) return { ok: true, result: { roster: rosterOut(), course: STORE.course } };
      if (isAssessor) return { ok: true, result: { roster: rosterOut(), course: STORE.course, assessor: { key: STORE.akey, expires: null } } };
      return REFUSE;
    case 'me': { const t = tr(p.token); if (!t) return REFUSE; return { ok: true, result: { token: t.token, name: t.name, group: t.group, records: t.records } }; }
    case 'get': { const t = tr(p.token); if (!t) return REFUSE; return { ok: true, result: { data: t.records[p.kind] ?? null } }; }
    case 'put': { const t = tr(p.token); if (!t) return REFUSE; if (p.data == null) delete t.records[p.kind]; else t.records[p.kind] = p.data; return { ok: true, result: { saved: true } }; }
    case 'course': if (!isTutor && !isAssessor) return REFUSE; return { ok: true, result: STORE.course };
    case 'putCourse': if (!isTutor) return REFUSE; STORE.course[p.kind] = p.data; return { ok: true, result: { saved: true } };
    case 'roster': if (!isTutor && !isAssessor) return REFUSE; return { ok: true, result: { trainees: rosterOut() } };
    case 'addTrainee': { if (!isTutor) return REFUSE; const token = 't' + (Object.keys(STORE.trainees).length + 1) + 'x' + Math.random().toString(36).slice(2, 8); STORE.trainees[token] = { token, name: p.name, group: p.group || '', created: Date.now(), records: {} }; return { ok: true, result: { token, trainees: rosterOut() } }; }
    case 'addTrainees': { if (!isTutor) return REFUSE; (p.trainees || []).forEach(x => { const token = 't' + (Object.keys(STORE.trainees).length + 1) + 'x' + Math.random().toString(36).slice(2, 8); STORE.trainees[token] = { token, name: x.name, group: x.group || '', created: Date.now(), records: {} }; }); return { ok: true, result: { added: (p.trainees || []).length, trainees: rosterOut() } }; }
    case 'renameTrainee': { const t = tr(p.token); if (!isTutor || !t) return REFUSE; t.name = p.name; t.group = p.group || ''; return { ok: true, result: { trainees: rosterOut() } }; }
    case 'removeTrainee': case 'purgeTrainee': { if (!isTutor) return REFUSE; delete STORE.trainees[p.token]; return { ok: true, result: { trainees: rosterOut() } }; }
    case 'assessorLink': if (!isTutor) return REFUSE; return { ok: true, result: { key: STORE.akey, expires: null } };
    case 'rotateAssessorKey': if (!isTutor) return REFUSE; STORE.akey = 'assessor-key-' + Date.now(); return { ok: true, result: { key: STORE.akey, expires: null } };
    case 'rotateKey': if (!isTutor) return REFUSE; STORE.key = 'tutor-key-' + Date.now(); return { ok: true, result: { key: STORE.key } };
    case 'putMaterial': { const t = tr(p.token); if (!t) return REFUSE; return { ok: true, result: { url: 'https://drive.example/' + encodeURIComponent(p.name) } }; }
    default: return { ok: false, error: 'Unknown op ' + p.op };
  }
}
const storeServer = createServer((req, res) => {
  let body = ''; req.on('data', c => body += c); req.on('end', () => {
    let out; try { out = handle(JSON.parse(body || '{}')); } catch (e) { out = { ok: false, error: String(e.message) }; }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(out));
  });
});
await new Promise(r => storeServer.listen(0, r));
const STORE_URL = `http://127.0.0.1:${storeServer.address().port}/exec`;

/* ---------------- the site, pointed at it ---------------- */
const dir = mkdtempSync(join(tmpdir(), 'lite-cohort-'));
const files = readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f) && !/^(check-screens|walk-roles|walk-cohort)\.mjs$/.test(f));
for (const f of files) copyFileSync(join(HERE, f), join(dir, f));
const sp = join(dir, 'hub-store.js'); const src = readFileSync(sp, 'utf8');
const pointed = src.replace(/((?:var|const|let)\s+URL\s*=\s*)(['"]).*?\2/, `$1"${STORE_URL}"`);
if (pointed === src) { console.error('could not point hub-store at the fake store'); process.exit(1); }
writeFileSync(sp, pointed);
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const site = createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
  let body; try { body = readFileSync(join(dir, name)); } catch { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[extname(name)] || 'application/octet-stream' }); res.end(body);
});
await new Promise(r => site.listen(0, r));
const BASE = `http://127.0.0.1:${site.address().port}/`;

/* ---------------- the walk ---------------- */
const browser = await chromium.launch();
const findings = [];
const GUARD = /stopping this page on purpose/;
const PAGES = {};
function watch(page, who){
  page.on('pageerror', e => { if (!GUARD.test(e.message)) findings.push(`[${who}] page error on ${page.url().replace(BASE,'').replace(/\?.*$/,'')}: ${e.message}`); });
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|UNSAFE_PORT|favicon|beforeunload' confirmation panel/.test(m.text())) findings.push(`[${who}] console on ${page.url().replace(BASE,'').replace(/\?.*$/,'')}: ${m.text().slice(0,160)}`); });
}
async function ctx(who){ const c = await browser.newContext({ viewport: { width: 1340, height: 1000 } }); const p = await c.newPage(); watch(p, who); PAGES[who] = p; return { c, p }; }
const SHOTS = process.env.SHOTS || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
let n = 0, passed = 0;
async function snap(tag){
  if (!SHOTS) return;
  for (const [who, p] of Object.entries(PAGES)) {
    try { await p.screenshot({ path: join(SHOTS, `${String(n).padStart(2,'0')}-${tag || who}.png`), fullPage: true }); } catch (e) {}
  }
}
async function step(name, fn){
  n++; try { const note = await fn(); passed++; console.log(`  ok  ${n}. ${name}${note ? ' — ' + note : ''}`); }
  catch (e) { findings.push(`step ${n} (${name}): ${e.message}`); console.log(`  FAIL ${n}. ${name} — ${e.message}`); }
  await snap();
}
const must = (cond, msg) => { if (!cond) throw new Error(msg); };
const settle = (p, ms = 1500) => p.waitForTimeout(ms);
const text = p => p.evaluate(() => document.body.innerText);
const tutorUrl = f => `${BASE}${f}?k=${STORE.key}`;
/* Nothing on any screen may run off the side of the page. A cohort of six is
   where that breaks: six rows of names, six columns of teaching practice. */
async function noSideScroll(p, where){
  const over = await p.evaluate(() => {
    const d = document.documentElement;
    if (d.scrollWidth <= d.clientWidth + 1) return null;
    const bad = [...document.querySelectorAll('body *')].find(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > d.clientWidth + 1 || r.left < -1) && getComputedStyle(el).overflowX !== 'auto';
    });
    return { page: d.scrollWidth, view: d.clientWidth, worst: bad ? (bad.tagName + '.' + String(bad.className).split(' ')[0]) : '?' };
  });
  must(!over, `${where} scrolls sideways: ${JSON.stringify(over)}`);
}

console.log('\nConnect Lite — a cohort of six, four weeks, two tutors\n');

const T = await ctx('tutor');
const tokens = {};

await step('tutor: a four-week course, eight TPs each, two tutors named', async () => {
  await T.p.goto(tutorUrl('6_centre_admin_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  await T.p.fill('#courseName', 'C/18 2026'); await T.p.fill('#centreName', 'IH Istanbul'); await T.p.fill('#centreNumber', 'TR073');
  await T.p.fill('#courseStart', '2026-10-05'); await T.p.fill('#courseEnd', '2026-10-30'); await T.p.fill('#tpCount', '8');
  await T.p.fill('#totalHours', '120'); await T.p.selectOption('#deliveryMode', 'f2f');
  await T.p.fill('#tutorNames', `${TUTOR_1}, ${TUTOR_2}`);
  await T.p.fill('#planDueNote', 'Turn in by 6pm the day before you teach');
  await T.p.fill('#selfDueNote', 'Turn in before your feedback session');
  await T.p.click('#saveSettings'); await settle(T.p, 3000);
  const s = STORE.course.settings || {};
  must(s.courseName === 'C/18 2026' && s.tpCount === 8 && s.totalHours === 120, 'settings: ' + JSON.stringify(s).slice(0, 220));
  must(/Ramy Sakr/.test(s.tutorNames) && /Pelin Korkmaz/.test(s.tutorNames), 'both tutors not recorded: ' + s.tutorNames);
  // 5 to 30 October: 25 days, Monday to Friday, four working weeks
  const days = Math.round((Date.parse(s.end) - Date.parse(s.start)) / DAY) + 1;
  must(days >= 26 && days <= 28, 'not a four-week course: ' + days + ' days from start to end inclusive');
  return `${s.start} to ${s.end}, ${s.tpCount} TPs each, ${s.totalHours} hours`;
});

await step('tutor: six candidates in two groups', async () => {
  const tab = await T.p.$('text=Roster and links'); must(tab, 'no Roster tab'); await tab.click(); await settle(T.p, 600);
  for (const c of COHORT) {
    await T.p.click('#toggleAdd'); await settle(T.p, 350);
    await T.p.fill('#storeAddName', c.name);
    const g = await T.p.$('#storeAddGroup'); if (g) await g.fill(c.group);
    await T.p.click('#storeAddForm button[type="submit"]'); await settle(T.p, 2200);
  }
  const rows = Object.values(STORE.trainees);
  must(rows.length === 6, 'store has ' + rows.length + ' candidates, expected 6');
  rows.forEach(r => { tokens[r.name] = r.token; });
  COHORT.forEach(c => must(tokens[c.name], 'missing from the store: ' + c.name));
  // every link is distinct -- six people, six invitations
  const links = new Set(Object.values(tokens));
  must(links.size === 6, 'candidates share a link: ' + links.size + ' distinct tokens for 6 people');
  await noSideScroll(T.p, 'Course admin, roster of six');
  return '6 candidates, 6 distinct links, 2 groups';
});

await step('tutor: the roster reads cleanly at six, names not truncated', async () => {
  /* All three link kinds are invite.html -- the tutor's carries ?k=, the
     assessor's ?ak=, a candidate's ?t= -- so count the ?t= ones. */
  const shown = await T.p.evaluate(() => [...document.querySelectorAll('[data-copy]')].filter(b => /[?&]t=/.test(b.dataset.copy)).length);
  must(shown === 6, 'candidate invitation links on the roster: ' + shown + ', expected 6');
  // A name that is cut off on screen is a name a tutor cannot check.
  const clipped = await T.p.evaluate(() => [...document.querySelectorAll('.board *')]
    .filter(el => el.children.length === 0 && el.textContent.trim())
    .filter(el => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
    .map(el => el.textContent.trim().slice(0, 40)));
  must(!clipped.length, 'text clipped on the roster: ' + JSON.stringify(clipped.slice(0, 5)));
  return 'six rows, nothing clipped';
});

let assignKey = '', lateKey = '';
await step('tutor: the four deadlines, spread across the four weeks', async () => {
  await T.p.goto(tutorUrl('8_assignment_wording.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 2500);
  const order = await T.p.evaluate(() => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5")'));
  must(order.length === 4, 'four assignments expected, got ' + JSON.stringify(order));
  const plain = await T.p.evaluate(() => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5" && DATA[k] && !DATA[k].sections.some(s => s.type === "picker"))'));
  assignKey = plain[0]; lateKey = plain[1];
  // one in week two (open), one already closed, as a real course looks mid-way
  for (const [k, off] of [[assignKey, 4 * DAY], [lateKey, -2 * DAY]]) {
    await T.p.evaluate(k => eval(`CURRENT='${k}'; renderList(); renderEditor();`), k); await settle(T.p, 350);
    const local = await T.p.evaluate(off => HubDue.toLocalInput(new Date(Date.now() + off).toISOString()), off);
    await T.p.fill('input[type="datetime-local"]', local); await T.p.dispatchEvent('input[type="datetime-local"]', 'change'); await settle(T.p, 300);
  }
  await T.p.evaluate(() => eval('persist()')); await settle(T.p, 2500);
  const w = STORE.course.wording || {};
  must(w[assignKey].dueAt && w[lateKey].dueAt, 'deadlines not on the store');
  await settle(T.p, 1200);
  return `${assignKey.toUpperCase()} open, ${lateKey.toUpperCase()} closed`;
});

/* ===== weeks 1-2: the first tutor, and four of the six turn work in ===== */
await step('six candidates open their own links; four turn in a plan', async () => {
  const workers = COHORT.slice(0, 4);
  for (const c of workers) {
    const A = await ctx('trainee');
    await A.p.goto(`${BASE}1_trainee_plan_and_analysis.html?t=${tokens[c.name]}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2800);
    const nameField = await A.p.$('#fName');
    must(nameField, 'no name field on the plan for ' + c.name);
    const shown = await A.p.inputValue('#fName');
    must(shown === c.name, `the plan opened as the wrong person: ${shown} instead of ${c.name}`);
    await A.p.fill('#fTP', 'TP2'); await A.p.fill('#fLevel', c.group === '1' ? 'B1' : 'A2');
    await A.p.evaluate(() => { const ta = document.querySelector('.t-main'); if (ta) { ta.value = 'To clarify the past simple'; ta.dispatchEvent(new Event('input', { bubbles: true })); } });
    await A.p.click('#turnInBtn'); await settle(A.p, 700);
    const c2 = await A.p.$('.confirm-action'); if (c2) await c2.click();
    await settle(A.p, 3000);
    await A.c.close(); delete PAGES.trainee;
  }
  const withPlans = Object.values(STORE.trainees).filter(t => t.records.plan);
  must(withPlans.length === 4, 'plans on the store: ' + withPlans.length + ', expected 4');
  // and each plan belongs to its own person
  withPlans.forEach(t => {
    const nm = ((t.records.plan || {}).state || {}).name || '';
    must(!nm || nm === t.name, `a plan is filed under the wrong candidate: ${nm} on ${t.name}`);
  });
  return '4 of 6 turned in, each under their own name';
});

await step("a turned-in plan is shut: no button still works", async () => {
  const A = await ctx('trainee');
  await A.p.goto(`${BASE}1_trainee_plan_and_analysis.html?t=${tokens[COHORT[0].name]}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3000);
  must(/can't edit it|cannot edit it/i.test(await text(A.p)), 'the turned-in banner is missing');
  const live = await A.p.evaluate(() => [...document.querySelectorAll('.board button')]
    .filter(b => !b.disabled && !b.closest('.back') && !b.classList.contains('btn-print'))
    .map(b => (b.textContent || b.id || b.className).trim().replace(/\s+/g, ' ').slice(0, 34)));
  must(!live.length, 'buttons still live on a turned-in plan: ' + JSON.stringify(live));
  const liveFields = await A.p.evaluate(() => [...document.querySelectorAll('.board input, .board textarea, .board select')].filter(e => !e.disabled).length);
  must(liveFields === 0, liveFields + ' fields still editable on a turned-in plan');
  await A.c.close(); delete PAGES.trainee;
  return 'every control disabled';
});

await step('tutor: the dashboard shows all six, four with work waiting', async () => {
  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3500);
  const body = await text(T.p);
  for (const c of COHORT) must(body.includes(c.name), 'missing from the dashboard: ' + c.name);
  await noSideScroll(T.p, 'Tutor dashboard, six candidates');
  return 'all six listed';
});

await step(`weeks 1-2: ${TUTOR_1} returns feedback to three`, async () => {
  await T.p.evaluate(nm => localStorage.setItem('chub:tutorName', nm), TUTOR_1);
  for (const c of COHORT.slice(0, 3)) {
    await T.p.goto(`${BASE}3_tutor_feedback.html?k=${STORE.key}&trainee=${tokens[c.name]}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
    await T.p.selectOption('#fGrade', 'To standard'); await settle(T.p, 300);
    /* A strength in teaching, or the return warns that nothing was said about
       the teaching and stops to ask -- which is the screen working, not a
       fault, and it is what the tutor would actually write. */
    await T.p.evaluate(() => {
      const box = [...document.querySelectorAll('textarea, input[type=text]')].find(e => /one point/i.test(e.placeholder || ''));
      if (box) { box.value = 'Clear instructions, checked before the task'; box.dispatchEvent(new Event('input', { bubbles: true })); }
      const ov = document.querySelector('#overall'); if (ov) { ov.value = 'A solid lesson.'; ov.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    await settle(T.p, 400);
    const ret = await T.p.$('#returnBtn'); must(ret, 'no Return button for ' + c.name);
    await ret.click(); await settle(T.p, 800);
    const cf = await T.p.$('.confirm-action'); if (cf) await cf.click();
    await settle(T.p, 3000);
  }
  const returned = Object.values(STORE.trainees).filter(t => t.records.feedback);
  must(returned.length === 3, 'feedback on the store: ' + returned.length + ', expected 3');
  const graded = Object.values(STORE.trainees).filter(t => /To standard/.test(JSON.stringify(t.records.feedback || {})));
  must(graded.length === 3, 'returned without a grade: ' + graded.length + ' of 3 carry one');
  return `${TUTOR_1} returned 3, each graded`;
});

/* ===== weeks 3-4: the second tutor, same course key ===== */
await step(`weeks 3-4: ${TUTOR_2} takes over on the same course link`, async () => {
  /* Lite gives a course ONE tutor link, by design -- both tutors use it and
     each signs their own work with the name in their own browser. So the
     handover is a different browser with a different name, not a new link. */
  const T2 = await ctx('tutor2');
  await T2.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T2.p, 3500);
  const field = await T2.p.$('#tutorName'); must(field, 'no tutor-name field on the dashboard');
  await field.fill(TUTOR_2); await settle(T2.p, 600);
  const body = await text(T2.p);
  for (const c of COHORT) must(body.includes(c.name), `${TUTOR_2} cannot see ${c.name}`);
  const first = await T.p.evaluate(() => localStorage.getItem('chub:tutorName'));
  const second = await T2.p.evaluate(() => localStorage.getItem('chub:tutorName'));
  must(first === TUTOR_1 && second === TUTOR_2, `the two tutors' names ran together: ${first} / ${second}`);
  return 'same course, two tutors, separate names';
});

await step(`${TUTOR_2} marks an assignment and signs it as herself`, async () => {
  const T2 = { p: PAGES.tutor2 };
  const who = COHORT[0].name;
  // she submits it first, as the candidate
  const A = await ctx('trainee');
  await A.p.goto(`${BASE}9_assignment_submission.html?t=${tokens[who]}&a=${assignKey}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3000);
  await A.p.evaluate(() => { const ta = document.querySelector('textarea:not([disabled])'); ta.value = 'My TP group is ten adults at B1. '.repeat(30); ta.dispatchEvent(new Event('input', { bubbles: true })); });
  for (let i = 0; i < 6; i++) { const b = await A.p.$('[data-role="decl-check"]:not(:checked)'); if (!b) break; await b.click(); await settle(A.p, 220); }
  const no = await A.p.$('[data-role="ai"][value="no"]'); if (no) { await no.click(); await settle(A.p, 300); }
  await A.p.click('#submitBtn'); await settle(A.p, 600);
  const cf = await A.p.$('.confirm-action'); if (cf) await cf.click(); await settle(A.p, 3000);
  await A.c.close(); delete PAGES.trainee;

  await T2.p.goto(`${BASE}10_tutor_assignment_marking.html?k=${STORE.key}&trainee=${tokens[who]}&a=${assignKey}`, { waitUntil: 'domcontentloaded' }); await settle(T2.p, 3000);
  const marker = await T2.p.$('[data-role="marker1"], #marker1');
  if (marker) { await marker.fill(TUTOR_2); await settle(T2.p, 400); }
  /* render() rebuilds the criteria list on every click, so a handle taken
     before the click is detached by the next one -- click by index instead. */
  const count = await T2.p.evaluate(() => document.querySelectorAll('[data-crit]').length);
  must(count >= 4, 'criteria pills: ' + count);
  for (let i = 0; i < count; i++) { await T2.p.click(`[data-crit="${i}"]`); await settle(T2.p, 300); }
  await settle(T2.p, 2500);
  const sub = (STORE.trainees[tokens[who]].records.assignments || {})[assignKey] || {};
  const marks = (sub.criteriaMarks || {}).sub1 || [];
  must(marks.length >= 4 && marks.every(m => m === true), 'not every criterion marked: ' + JSON.stringify(marks));
  return `${TUTOR_2} marked ${assignKey.toUpperCase()} for ${who}`;
});

await step('the grades report holds six, and each grade stays on its own person', async () => {
  await T.p.goto(tutorUrl('13_grades_report.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3500);
  const rows = await T.p.$$('.cohort .gt:first-child tbody tr');
  must(rows.length === 6, 'provisional table rows: ' + rows.length + ', expected 6');
  const cards = await T.p.$$('.cand');
  must(cards.length === 6, 'candidate sections: ' + cards.length + ', expected 6');
  // letters A..F, in roster order, on both the tables and the sections
  const letters = await T.p.evaluate(() => [...document.querySelectorAll('.cand .ltr')].map(e => e.textContent.trim()));
  must(letters.join('') === 'ABCDEF', 'letters drifted: ' + letters.join(''));
  // a different grade for each of three people, then read them back by name
  const want = { 0: 'PASS A', 2: 'PASS', 4: 'FAIL' };
  for (const [i, g] of Object.entries(want)) {
    // the provisional too, so the pack can be checked for both
    await T.p.selectOption(`.cand:nth-of-type(${+i + 1}) .grow select.grade[data-grade="provisional"]`, g); await settle(T.p, 300);
    await T.p.selectOption(`.cand:nth-of-type(${+i + 1}) .grow.final select.grade`, g); await settle(T.p, 350);
  }
  await T.p.click('#saveBtn'); await settle(T.p, 3500);
  const byName = Object.fromEntries(Object.values(STORE.trainees).map(t => [t.name, ((t.tracker || t.records.tracker || {}).grades || {}).final || '']));
  const order = await T.p.evaluate(() => [...document.querySelectorAll('.cand .chead h2')].map(e => e.textContent.replace(/^[A-F]\s*/, '').trim()));
  for (const [i, g] of Object.entries(want)) {
    must(byName[order[+i]] === g, `${order[+i]} should be ${g}, store has ${JSON.stringify(byName[order[+i]])}`);
  }
  /* Cambridge's evidence field belongs to a BORDERLINE provisional and to
     nothing else (Handbook June 2025, p43). A slash grade must reveal it; a
     clean grade must not have it at all. */
  const evShown = () => T.p.evaluate(() => [...document.querySelectorAll('.evwrap')].map(b => !b.hidden));
  /* Both grades on this candidate are put back before the step ends -- step 12
     reads them off the assessor pack, and this step now SAVES, so anything
     left behind here would travel. */
  const provWas = await T.p.$eval('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]', e => e.value);
  must((await evShown()).every(v => v === false), 'the evidence box shows on a candidate with no provisional grade');
  await T.p.selectOption('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]', 'PASS / PASS B'); await settle(T.p, 500);
  const after = await evShown();
  must(after[0] === true && after.slice(1).every(v => v === false), 'a slash provisional did not reveal the evidence box: ' + JSON.stringify(after));
  const heading = await T.p.$eval('.cand:nth-of-type(1) .evwrap h3', e => e.textContent.trim());
  must(/^Evidence needed for a Pass \/ Higher Grade \(if applicable\)$/i.test(heading), 'not Cambridge\'s wording: ' + heading);
  must(!(await T.p.$('.cand .grow.final ~ .prosewrap .evwrap')), 'the evidence box is still attached to the final grade');
  await T.p.selectOption('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]', 'PASS'); await settle(T.p, 500);
  must((await evShown()).every(v => v === false), 'a clean provisional did not hide the evidence box again');

  /* The provisional dropdown carries all ten values the Cambridge form has:
     seven grades and three outcomes that are not grades. An outcome is not
     borderline and does not take a grade's colour. */
  const provOpts = await T.p.$$eval('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"] option',
    os => os.map(o => o.value).filter(Boolean));
  ['WITHDRAWN','EXTENSION','DEFERRAL'].forEach(o =>
    must(provOpts.includes(o), 'the provisional dropdown is missing ' + o));
  must(provOpts.length === 10, 'the provisional dropdown holds ' + provOpts.length + ' values, not 10');
  await T.p.selectOption('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]', 'WITHDRAWN'); await settle(T.p, 500);
  must((await evShown()).every(v => v === false), 'an outcome revealed the borderline evidence box');
  must(await T.p.$eval('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]',
    e => e.classList.contains('out') && !e.classList.contains('set')), 'an outcome is painted as a grade');
  await T.p.selectOption('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]', 'PASS'); await settle(T.p, 500);

  /* The same three values on the final grade, where they close the door to
     the final course report: that document confirms attendance and states a
     grade, and a candidate who withdrew has neither. */
  const finOpts = await T.p.$$eval('.cand:nth-of-type(1) .grow.final select.grade option',
    os => os.map(o => o.value).filter(Boolean));
  ['WITHDRAWN','EXTENSION','DEFERRAL'].forEach(o =>
    must(finOpts.includes(o), 'the final dropdown is missing ' + o));
  must(finOpts.length === 7, 'the final dropdown holds ' + finOpts.length + ' values, not 7');
  const frLabel = () => T.p.$eval('.cand:nth-of-type(1) .frbtn', e => e.textContent.trim());
  /* Put back whatever the earlier steps left here -- step 12 reads this
     candidate's final grade off the assessor pack, and a walk step must not
     quietly undo the one before it. */
  const finalWas = await T.p.$eval('.cand:nth-of-type(1) .grow.final select.grade', e => e.value);
  await T.p.selectOption('.cand:nth-of-type(1) .grow.final select.grade', 'PASS B'); await settle(T.p, 400);
  must(/^Open the final report$/.test(await frLabel()), 'a graded candidate cannot open the final report: ' + await frLabel());
  await T.p.selectOption('.cand:nth-of-type(1) .grow.final select.grade', 'WITHDRAWN'); await settle(T.p, 400);
  must(/not issued/.test(await frLabel()), 'the final report is still offered on a withdrawal: ' + await frLabel());
  /* The final grade's box: Appian's two fields, side by side, arriving with
     the grade and leaving with it. */
  const finBox = '.cand:nth-of-type(1) .finwrap';
  await T.p.selectOption('.cand:nth-of-type(1) .grow.final select.grade', ''); await settle(T.p, 500);
  must(!(await T.p.isVisible(finBox)), 'the final box shows with no final grade');
  await T.p.selectOption('.cand:nth-of-type(1) .grow.final select.grade', 'PASS'); await settle(T.p, 500);
  must(await T.p.isVisible(finBox), 'the final box did not arrive with the final grade');
  const finHeads = await T.p.$$eval(finBox + ' .fside h3', hs => hs.map(h => h.textContent.trim()));
  must(JSON.stringify(finHeads) === JSON.stringify([
    'Update on strengths and action points',
    'What evidence was provided for a Higher Grade (if applicable)'
  ]), 'the final box is not Appian\'s two fields: ' + JSON.stringify(finHeads));
  const [fa, fb] = await T.p.$$eval(finBox + ' .fside', els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  must(Math.abs(fa - fb) < 4, 'the two sides are stacked, not side by side');

  await T.p.selectOption('.cand:nth-of-type(1) .grow.final select.grade', finalWas); await settle(T.p, 400);
  await T.p.selectOption('.cand:nth-of-type(1) .grow select.grade[data-grade="provisional"]', provWas); await settle(T.p, 400);
  await T.p.click('#saveBtn'); await settle(T.p, 700);

  /* The course-level half of the Cambridge form: four required fields, above
     the candidates, kept with the course so every tutor has them. */
  const courseHeads = await T.p.$$eval('#course .sec h3', hs => hs.map(h => h.textContent.trim()));
  must(JSON.stringify(courseHeads) === JSON.stringify([
    'Teaching Practice','Teaching Practice Supervision and Feedback','Tutorials','Additional Comments'
  ]), 'the course-level fields are not the form\'s four, in order: ' + JSON.stringify(courseHeads));
  await T.p.fill('#course textarea[data-coursefield="tutorials"]', 'Two tutorials each, week two and week four.');
  await T.p.click('#saveBtn'); await settle(T.p, 700);
  await T.p.reload({waitUntil:'networkidle'}); await settle(T.p, 900);
  must(await T.p.$eval('#course textarea[data-coursefield="tutorials"]', e => e.value)
    === 'Two tutorials each, week two and week four.', 'a course-level field did not survive a reload');
  const heads = await T.p.$$eval('.cand:nth-of-type(1) .cols .sec h3', hs => hs.map(h => h.textContent.trim()));
  must(JSON.stringify(heads) === JSON.stringify([
    'Planning: Strengths','Planning: Areas for development','Teaching: Strengths','Teaching: Areas for development'
  ]), 'the candidate headings are not the form\'s: ' + JSON.stringify(heads));

  await noSideScroll(T.p, 'Grades report, six candidates');
  return 'A-F, three graded, each on the right person; evidence borderline-only; ten provisional and seven final values; the form\'s own headings, course fields kept';
});

await step('the assessor pack holds all six, with the visit at the end of week four', async () => {
  const S = await ctx('assessor');
  await S.p.goto(`${BASE}12_assessor_pack.html?ak=${STORE.akey}`, { waitUntil: 'domcontentloaded' }); await settle(S.p, 3500);
  const body = await text(S.p);
  for (const c of COHORT) must(body.includes(c.name), 'missing from the assessor pack: ' + c.name);
  must(/6 on the course|6 candidates/i.test(body), 'the pack does not count six: ' + (body.match(/\d+ on the course/) || ['none'])[0]);
  /* The standing column is the TP standard, and three candidates were graded
     To standard in weeks 1-2. If it reads NOT STARTED for all six, the grade
     never reached the record the pack reads. */
  const standings = await S.p.evaluate(() => [...document.querySelectorAll('.standing')].map(e => e.textContent.trim()));
  must(standings.filter(t => /TO STANDARD/i.test(t)).length === 3,
    'standing column: ' + JSON.stringify(standings) + ' -- three should read TO STANDARD');
  // the four briefs, and the link that expires fourteen days after the course
  for (const k of ['FOL', 'LRT', 'LSRT', 'LFC']) must(body.includes(k), 'brief missing from the pack: ' + k);
  must(/13 November 2026/.test(body), 'the expiry is not course end + 14 days: ' + (body.match(/stops working on [^\n]*/) || ['none'])[0]);
  /* The provisional is what the centre files before the assessment, so it must
     be on the table -- and it must not disappear when a final is agreed. */
  must(/Provisional: PASS A/.test(body) && /Final: PASS A/.test(body),
    'the pack does not show both grades: ' + (body.match(/Provisional[^\n]*|Final[^\n]*/g) || ['none']).join(' / '));
  await noSideScroll(S.p, 'Assessor pack, six candidates');
  return 'six candidates, four briefs, both grades, link expires 13 Nov';
});

await step('the assessor reads a final report, and it names the right tutors', async () => {
  const S = { p: PAGES.assessor };
  const door = await S.p.$('a[href^="16_final_report.html"]');
  must(door, 'no final-report door in the pack for a graded candidate');
  await door.click(); await settle(S.p, 3000);
  const body = await text(S.p);
  must(/This is to confirm that/.test(body), 'the report did not open');
  must(new RegExp(TUTOR_1).test(body) && new RegExp(TUTOR_2).test(body), 'both tutors should sign the report');
  must(/120-hour/.test(body), 'the course hours are missing');
  /* This candidate has submitted no written assignment at all, so the
     assessment area must NOT claim they passed one. It did: the old test
     asked for fails and resubmissions-due and found neither. */
  must(/Written assignments\s+Grade: [\u2014—]/.test(body),
    'the written assignments area claims a grade for a candidate who submitted nothing: ' + (body.match(/Written assignments[^\n]*/) || ['none'])[0]);
  await noSideScroll(S.p, 'Final report');
  return 'both tutors signed; assignments area honest about nothing submitted';
});

await step('nothing on any screen runs off the side at phone width', async () => {
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await phone.newPage(); watch(p, 'phone'); PAGES.phone = p;
  const screens = [
    ['6_centre_admin_dashboard.html', `?k=${STORE.key}`],
    ['5_tutor_dashboard.html', `?k=${STORE.key}`],
    ['7_candidate_tracker.html', `?k=${STORE.key}`],
    ['13_grades_report.html', `?k=${STORE.key}`],
    ['12_assessor_pack.html', `?ak=${STORE.akey}`],
    ['9_assignment_submission.html', `?t=${tokens[COHORT[0].name]}&a=${assignKey}`],
  ];
  const bad = [];
  for (const [f, q] of screens) {
    await p.goto(`${BASE}${f}${q}`, { waitUntil: 'domcontentloaded' }); await settle(p, 2600);
    try { await noSideScroll(p, f); } catch (e) { bad.push(e.message); }
  }
  await phone.close(); delete PAGES.phone;
  must(!bad.length, bad.join(' | '));
  return `${screens.length} screens at 390px`;
});

console.log(`\n${passed} of ${n} steps passed; ${STORE.calls.length} store calls.`);
if (findings.length) { console.log('\nFINDINGS'); findings.forEach(f => console.log('  - ' + f)); }
else console.log('\nNothing screamed.');
await browser.close(); site.close(); storeServer.close();
process.exit(findings.length ? 1 : 0);
