/**
 * Connect Lite — the three roles walked end to end through a store.
 *
 *   node walk-roles.mjs
 *
 * Not a load check (that is check-screens.mjs). This is the 22 Sep 2026
 * lifecycle walk, rebuilt as a script: an EMPTY store, three clean browser
 * sessions, and each step creating the conditions for the next -- the tutor
 * sets the course up, the candidate opens her invitation, turns work in, the
 * tutor returns it, marks an assignment, gives an extension, the assessor
 * opens the pack. Everything crosses the store; nothing is planted in
 * localStorage by hand, so the sync paths are what is being tested.
 *
 * The store is a fake in this process, answering `boot` by caller the way the
 * Apps Script does: {me, course} for a trainee token, {roster, course} for a
 * tutor key, {roster, course, assessor} for an assessor key. Same harness
 * rule as check-screens: copy the site, THEN point hub-store at the fake.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = new URL('.', import.meta.url).pathname;
const DAY = 864e5;

/* ---------------- the fake store ---------------- */
const STORE = { course: { settings: null, wording: null }, trainees: {}, key: 'tutor-key-1', akey: 'assessor-key-1', calls: [],
  // Faults the walk can switch on: `refuse` names a record kind whose put the
  // store turns down (ok:false, the way the Apps Script refuses), `slow` is a
  // delay in ms on every put (the Apps Script takes 1.5-13 s to answer).
  refuse: '', slow: 0, overCell: [] };
const CELL = 50000;
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
    case 'put': { const t = tr(p.token); if (!t) return REFUSE; if (STORE.refuse && p.kind === STORE.refuse) return { ok: false, error: 'The store refused this write' }; if (p.data != null && JSON.stringify(p.data).length > CELL) return { ok: false, error: 'over the cell' }; if (p.data == null) delete t.records[p.kind]; else t.records[p.kind] = p.data; return { ok: true, result: { saved: true } }; }
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
    let p = {}, out; try { p = JSON.parse(body || '{}'); out = handle(p); } catch (e) { out = { ok: false, error: String(e.message) }; }
    /* A record is one Sheets cell, and a cell holds 50,000 characters. Above
       that the Apps Script throws and Google answers with an HTML error page
       (title "Hata"), which hub-store reads as a transient failure. Measured
       on the live store 26 Sep 2026: a tpHistory put of 49,495 chars saved,
       50,995 did not. This fake used to hold anything, which is how a
       candidate's second TP never filing went unseen. */
    const answer = () => {
      if (p.op === 'put' && p.data != null && JSON.stringify(p.data).length > CELL) {
        STORE.overCell.push(p.kind + ' ' + JSON.stringify(p.data).length);
        res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' }); return res.end('<!DOCTYPE html><html><head><title>Hata</title></head><body>Hata</body></html>');
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(out));
    };
    if (STORE.slow && p.op === 'put') setTimeout(answer, STORE.slow); else answer();
  });
});
await new Promise(r => storeServer.listen(0, r));
const STORE_URL = `http://127.0.0.1:${storeServer.address().port}/exec`;

/* ---------------- the site, pointed at it ---------------- */
const dir = mkdtempSync(join(tmpdir(), 'lite-walk-'));
const files = readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f) && !/^(check-screens|walk-roles)\.mjs$/.test(f));
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
function watch(page, who){
  page.on('pageerror', e => { if (!GUARD.test(e.message)) findings.push(`[${who}] page error: ${e.message}`); });
  // A finding names the page it came from: a console error with no address
  // took three runs to place on 25 Sep 2026.
  // "Blocked attempt to show a 'beforeunload' confirmation panel" is Chrome
  // reporting that the unsaved-writes guard asked to prompt and headless
  // Chrome, which never has a user gesture, refused to show it. That is the
  // guard working, not the app failing; a real browser shows the prompt.
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|UNSAFE_PORT|favicon|beforeunload' confirmation panel/.test(m.text())) findings.push(`[${who}] console on ${page.url().replace(BASE, '').replace(/\?.*$/, '')} (step ${n}): ${m.text().slice(0, 160)}`); });
}
const PAGES = {};
async function ctx(who){ const c = await browser.newContext({ viewport: { width: 1340, height: 1000 } }); const p = await c.newPage(); watch(p, who); PAGES[who] = p; return { c, p }; }
let n = 0, passed = 0;
/* SHOTS=<dir> node walk-roles.mjs saves a full-page screenshot of every role's
   page after every step, named <step>-<role>.png -- so a screen can be LOOKED
   at in the state the walk put it in, without planting anything or opening a
   real course (25 Sep 2026: the live tutor pages could not be opened from the
   browser pane without pasting a course key into a URL). */
const SHOTS = process.env.SHOTS || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
async function snap(){
  if (!SHOTS) return;
  for (const [who, p] of Object.entries(PAGES)) {
    try { await p.screenshot({ path: join(SHOTS, `${String(n).padStart(2, '0')}-${who}.png`), fullPage: true }); } catch (e) {}
  }
}
async function step(name, fn){
  n++; try { const note = await fn(); passed++; console.log(`  ok  ${n}. ${name}${note ? ' — ' + note : ''}`); }
  catch (e) { findings.push(`step ${n} (${name}): ${e.message}`); console.log(`  FAIL ${n}. ${name} — ${e.message}`); }
  await snap();
}
/* A step for a fault that is known and still open. It runs every time so the
   walk keeps saying what the store cannot do, it does not fail the walk, and
   it turns INTO a finding the day it passes -- the marker is then stale. */
async function known(name, fn){
  n++; try { const note = await fn(); findings.push(`step ${n} (${name}) PASSED but is marked known-open: retire the marker`); console.log(`  ??  ${n}. ${name} — passed; retire the known-open marker${note ? ' — ' + note : ''}`); }
  catch (e) { passed++; console.log(`  open ${n}. ${name} — ${e.message}`); }
  await snap();
}
const must = (cond, msg) => { if (!cond) throw new Error(msg); };
const settle = (p, ms = 1500) => p.waitForTimeout(ms);
const text = p => p.evaluate(() => document.body.innerText);
const tutorUrl = f => `${BASE}${f}?k=${STORE.key}`;

console.log('\nConnect Lite — three roles, one store\n');

/* ===== TUTOR sets the course up ===== */
const T = await ctx('tutor');
let amaraToken = '', invite = '';
await step('tutor: course admin opens on an empty course', async () => {
  await T.p.goto(tutorUrl('6_centre_admin_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 2500);
  must(await T.p.$('#courseName'), 'settings form not rendered');
});
await step('tutor: settings saved to the store (TR073, the two turn-in lines)', async () => {
  await T.p.fill('#courseName', 'C/18 2026'); await T.p.fill('#centreName', 'IH Istanbul'); await T.p.fill('#centreNumber', 'TR073');
  await T.p.fill('#courseStart', '2026-10-05'); await T.p.fill('#courseEnd', '2026-10-30'); await T.p.fill('#tpCount', '8');
  await T.p.fill('#planDueNote', 'Turn in by 6pm the day before you teach'); await T.p.fill('#selfDueNote', 'Turn in before your feedback session');
  await T.p.click('#saveSettings'); await settle(T.p, 2500);
  const s = STORE.course.settings || {};
  must(s.centreNumber === 'TR073' && s.planDueNote && s.selfDueNote && s.courseName === 'C/18 2026', 'store settings: ' + JSON.stringify(s).slice(0, 200));
  return 'store has ' + Object.keys(s).length + ' settings';
});
await step('tutor: a candidate added; her link is the invitation', async () => {
  // the roster lives on the second tab
  const tab = await T.p.$('text=Roster and links'); must(tab, 'no Roster tab'); await tab.click(); await settle(T.p, 500);
  await T.p.click('#toggleAdd'); await settle(T.p, 400);
  await T.p.fill('#storeAddName', 'Amara Nwosu');
  await T.p.click('#storeAddForm button[type="submit"]'); await settle(T.p, 2500);
  const toks = Object.keys(STORE.trainees); must(toks.length === 1, 'store trainees: ' + toks.length);
  amaraToken = toks[0];
  const copy = await T.p.$(`[data-copy*="${amaraToken}"]`); must(copy, 'no Copy link button for her');
  invite = await copy.getAttribute('data-copy');
  must(/invite\.html\?t=/.test(invite), 'link handed out is not the invitation: ' + invite);
  return invite.replace(BASE, '');
});
let assignKey = '', lateKey = '';
await step('tutor: assignment deadlines set on the wording (one ahead, one already closed)', async () => {
  await T.p.goto(tutorUrl('8_assignment_wording.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 2000);
  const keys = await T.p.evaluate(() => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5")'));
  /* Neither of these may be the assignment with the item picker. One is
     submitted, the other closed by its deadline and later extended, and both
     would leave Language Related Tasks locked for the four-item picker step
     below (25 Sep 2026: it was, and the step found no chips to click). In
     COURSE order, not Object.keys order, which follows the file. */
  const plain = await T.p.evaluate(() => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5" && DATA[k] && DATA[k].sections && !DATA[k].sections.some(s => s.type === "picker") && DATA[k].sections.some(s => s.type === "text" && !hubIsReference(s)))'));
  assignKey = plain[0]; lateKey = plain[1] || keys.find(k => k !== assignKey);
  for (const [k, off] of [[assignKey, 3 * DAY], [lateKey, -2 * DAY]]) {
    await T.p.evaluate(k => eval(`CURRENT='${k}'; renderList(); renderEditor();`), k); await settle(T.p, 300);
    const local = await T.p.evaluate(off => HubDue.toLocalInput(new Date(Date.now() + off).toISOString()), off);
    await T.p.fill('input[type="datetime-local"]', local); await T.p.dispatchEvent('input[type="datetime-local"]', 'change'); await settle(T.p, 300);
    await T.p.fill('input[type="number"][max="30"]', '5'); await T.p.dispatchEvent('input[type="number"][max="30"]', 'change');
  }
  await T.p.evaluate(() => eval('persist()')); await settle(T.p, 2500);
  const w = STORE.course.wording || {};
  must(w[assignKey] && w[assignKey].dueAt && w[lateKey] && w[lateKey].dueAt, 'dueAt not in the store: ' + JSON.stringify({ a: w[assignKey] && w[assignKey].dueAt, l: w[lateKey] && w[lateKey].dueAt }));
  return `${assignKey.toUpperCase()} due in 3 days, ${lateKey.toUpperCase()} closed 2 days ago`;
});
await step('tutor: a course still on the superseded criteria adopts the corrected ones', async () => {
  /* 25 Sep 2026. The four assignments' criteria were checked against the ones
     IH Istanbul actually sets on C/17 and against the syllabus, and corrected.
     A course's stored wording is a frozen copy, so the correction reached no
     existing course -- C/18 2026 included, whose criteria went to the store the
     moment its deadlines were set. So the tutor's landing page adopts the
     corrected lists when the stored copy is still the old default word for
     word, and heals the store. Planted in the STORE, not in localStorage: the
     sync path is the thing under test. */
  // Read the old lists out of the page rather than parsing the JS by hand, so
  // this step cannot drift from the file it is testing.
  // The step before this saved the deadlines a moment ago. Leaving the wording
  // editor while that write is still in flight is exactly what the
  // beforeunload guard exists to stop, and Chrome logs its refusal to show
  // the prompt as a console error -- a real guard doing its job, not a fault.
  await settle(T.p, 2000);
  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 2500);
  // A LIST of every default Lite has shipped, oldest first. The oldest is the
  // one worth planting: a course that has sat untouched the longest.
  const versions = await T.p.evaluate(() => eval('JSON.parse(JSON.stringify(window.CONNECT_HUB_SUPERSEDED_WORDING || []))'));
  must(Array.isArray(versions) && versions.length, 'the superseded wording is not on the dashboard: ' + JSON.stringify(versions).slice(0, 120));
  const was = versions[0];
  must(Object.keys(was).length === 4, 'the oldest superseded version does not hold four assignments: ' + JSON.stringify(Object.keys(was)));
  /* Only the criteria and the title are wound back -- this is the state C/18
     was actually in, the course's own sections and the deadlines just set
     intact. Replacing the whole object instead would leave the assignments with
     no sections, which is not a state any course reaches. */
  for (const k of Object.keys(was)) {
    const a = STORE.course.wording[k]; if (!a) continue;
    a.title = was[k].title;
    a.criteria = was[k].criteria.map(t => ({ text: t, sectionIndex: null }));
    a.sections = JSON.parse(JSON.stringify(was[k].sections));
  }
  const dueBefore = JSON.stringify(Object.fromEntries(Object.entries(STORE.course.wording).map(([k, v]) => [k, v.dueAt || ''])));
  const before = Object.fromEntries(Object.entries(was).map(([k]) => [k, STORE.course.wording[k].criteria.length]));

  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3500);

  const after = Object.fromEntries(Object.entries(was).map(([k]) => [k, STORE.course.wording[k].criteria.length]));
  must(JSON.stringify(after) === JSON.stringify({ lrt: 4, lsrt: 4, fol: 6, lfc: 5 }),
    'store not healed: ' + JSON.stringify({ before, after }));
  must(STORE.course.wording.lsrt.title === 'Language Skills Related Tasks', 'lsrt title still singular');
  must(STORE.course.wording.lrt.criteria[0].text === 'Analysing language correctly for teaching purposes',
    'lrt criterion 1 is not the syllabus wording: ' + STORE.course.wording.lrt.criteria[0].text);
  // Untouched end to end, so the course gets the whole shipped brief and not
  // just corrected criteria: the reading text, the picker, the three texts.
  const lrtJson = JSON.stringify(STORE.course.wording.lrt);
  must(/Dear Marta/.test(lrtJson), 'the letter did not come with the brief');
  must(/talk properly soon/.test(lrtJson), 'the fixed functional exponent is missing');
  must(STORE.course.wording.lsrt.sections.filter(x => x.readonly).length >= 4,
    'the class profile and three texts did not come with the skills brief');
  // What the centre set on this course must survive it.
  const dueAfter = JSON.stringify(Object.fromEntries(Object.entries(STORE.course.wording).map(([k, v]) => [k, v.dueAt || ''])));
  must(dueAfter === dueBefore, 'the deadlines did not survive: ' + dueBefore + ' -> ' + dueAfter);
  return Object.entries(before).map(([k, v]) => `${k} ${v}→${after[k]}`).join(', ') + '; full briefs in, deadlines kept';
});

/* ===== TRAINEE opens her invitation, cold ===== */
const A = await ctx('trainee');
await step('trainee: the invitation card, from a clean browser', async () => {
  await A.p.goto(invite, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3000);
  const t = await text(A.p);
  must(/Course invitation/i.test(t), 'no card'); must(/C\/18 2026/.test(t), 'course name missing'); must(/TR073/.test(t), 'centre number missing');
  must(/Amara Nwosu/.test(t), 'her name missing'); must(/yours alone/i.test(t), 'the keep-it line missing');
  const go = await A.p.$('#go'); must(go, 'no button'); await go.click(); await settle(A.p, 3000);
  must(/amara/i.test(await text(A.p)), 'workspace did not open as her: ' + (await text(A.p)).slice(0, 80));   // the badge is her first name, in caps
});
await step('trainee: the plan shows the turn-in line, and turns in to the store', async () => {
  await A.p.goto(`${BASE}1_trainee_plan_and_analysis.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2500);
  must((await A.p.$eval('#dueNote', n => n.textContent)).includes('6pm'), 'turn-in line missing');
  await A.p.fill('#fTP', 'TP1'); await A.p.fill('#fLevel', 'B1'); await A.p.fill('#fLength', '45');
  // the shape is a menu now (26 Sep): open it, pick the item, and the pick is the action
  await A.p.click('#fwBtn'); await A.p.click('.fw-item:has-text("Test – Teach – Test")'); await settle(A.p, 300); const c = await A.p.$('.confirm-action'); if (c) await c.click();
  // the name and the aim are two fields in the editor (26 Sep); the record still joins them with the colon
  await A.p.evaluate(() => { const t = document.querySelector('.t-stage'); t.value = 'Lead-in'; t.dispatchEvent(new Event('input', { bubbles: true }));
    const a = document.querySelector('.t-aim'); a.value = 'to set the topic'; a.dispatchEvent(new Event('input', { bubbles: true }));
    const pr = document.querySelector('.t-proc'); pr.value = '• Show three photos'; pr.dispatchEvent(new Event('input', { bubbles: true }));
    const tm = document.querySelector('.t-time'); tm.value = '6'; tm.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('fMain').value = '• To clarify the past simple'; document.getElementById('fMain').dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('fMatsLink').value = 'https://drive.google.com/file/d/1PLAN/view'; document.getElementById('fMatsLink').dispatchEvent(new Event('input', { bubbles: true })); });
  await A.p.click('#turnInBtn'); await settle(A.p, 500); const c2 = await A.p.$('.confirm-action'); if (c2) await c2.click(); await settle(A.p, 3000);
  const rec = STORE.trainees[amaraToken].records.plan;
  must(rec && rec.status === 'turned_in', 'plan not turned in on the store: ' + JSON.stringify(rec && rec.status));
  must(rec.state.plan.matsLink, 'materials link not on the record');
  return 'plan on the store, with a materials link';
});
await step('trainee: the self-evaluation shows its line, and turns in', async () => {
  await A.p.goto(`${BASE}2_trainee_self_evaluation.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2500);
  must((await A.p.$eval('#dueNote', n => n.textContent)).includes('feedback session'), 'turn-in line missing');
  await A.p.evaluate(() => { const t = document.getElementById('sWell'); t.value = '• The lead-in got everyone talking'; t.dispatchEvent(new Event('input', { bubbles: true })); });
  await A.p.click('#turnInBtn'); await settle(A.p, 500); const c = await A.p.$('.confirm-action'); if (c) await c.click(); await settle(A.p, 3000);
  must((STORE.trainees[amaraToken].records.selfeval || {}).status === 'turned_in', 'self-evaluation not on the store');
});

/* ===== TUTOR gives feedback, through the exchange ===== */
await step('tutor: dashboard sees her, feedback screen shows her plan with the materials button', async () => {
  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  must(/Amara/.test(await text(T.p)), 'dashboard does not show her');
  await T.p.goto(`${tutorUrl('3_tutor_feedback.html')}&trainee=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  must(/Pulled in|Loaded/.test(await T.p.$eval('#loadedInfo', n => n.textContent)), 'plan not loaded: ' + await T.p.$eval('#loadedInfo', n => n.textContent));
  const mats = await T.p.$('.seen .mats-open'); must(mats, 'no Open the materials button');
  must((await mats.getAttribute('href')).includes('1PLAN'), 'materials button points elsewhere');
  must(await T.p.$('#xCopy'), 'no Copy on the exchange card');
});
await step('tutor: a pasted brief lands in the boxes; returned to her via the store', async () => {
  const brief = await T.p.evaluate(() => eval('HubExchange.brief(DOC)'));
  const filled = brief.replace('## Grade\n\n', '## Grade\nTo standard\n').replace('## Stage 1 — Lead-in\n\n', '## Lead-in\nGood hook.\n')
    .replace('## Strengths in planning\n\n', '## Strengths in planning\n- Clear staging\n').replace('## Action points in teaching\n\n', '## Action points in teaching\n★ Monitor the pair work\n')
    .replace('## Overall comment\n\n', '## Overall comment\nA solid lesson.\n');
  await T.p.evaluate(txt => { const dt = new DataTransfer(); dt.setData('text/plain', txt); document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, filled);
  await settle(T.p, 800);
  const got = await T.p.evaluate(() => eval('(function(){ const c = collect(); return { grade: c.grade, st0: c.tcomm.st0, sp: c.sp.length, at: c.at.map(x => x.star) }; })()'));
  must(got.grade === 'To standard' && got.st0 === 'Good hook.' && got.sp === 1 && got.at[0] === true, 'boxes: ' + JSON.stringify(got));
  await T.p.click('#returnBtn'); await settle(T.p, 500); const c = await T.p.$('.confirm-action'); if (c) await c.click(); await settle(T.p, 3000);
  const fb = STORE.trainees[amaraToken].records.feedback;
  must(fb && fb.status === 'returned' && fb.docHTML, 'feedback not on the store: ' + JSON.stringify(fb && fb.status));
  return 'grade, stage comment, a starred point, returned';
});

/* ===== TRAINEE reads it ===== */
await step('trainee: her record opens the returned feedback, read-only, landscape', async () => {
  await A.p.goto(`${BASE}4_feedback_returned.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3500);
  const t = await text(A.p);
  must(/To standard/.test(t) && /Good hook/.test(t), 'feedback not shown: ' + t.slice(0, 200));
  must((await A.p.$$('#content textarea, #content input, #content [contenteditable="true"]')).length === 0, 'editable controls on the record');
  const pg = await A.p.evaluate(() => [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.constructor.name === 'CSSPageRule' && /landscape/.test(r.style.size)); } catch (e) { return false; } }));
  must(pg, 'no landscape @page');
});

/* ===== TWO MORE TPs, SAME CANDIDATE, SAME TUTOR BROWSER =====
   Found 26 Sep 2026 under the demo mint, against the live store: TP2 returned
   to a candidate who already had TP1, and the store ended up holding
   feedback:null (she had started TP3) and tpHistory:{1}. Returning writes the
   feedback AND files the TP into the roster's history, both through the 600 ms
   debounce; leave the page first and the beacon carries them, and a beacon
   with a ~100 KB document fails silently. Neither harness had ever returned
   two TPs to one candidate from one tutor browser, so nothing caught it.
   These steps do, and they test the two halves of the fix separately: Return
   may not say "Returned" until the store has the document; and a tutor's boot
   keeps a filed document the store lacks and sends it, the way the trainee's
   side has kept its own copy since 22 Sep. */
// An overall comment the length a tutor writes.
const COMMENT_LINE = i => `Line ${i + 1}: the pair work ran long, but every student spoke, and the correction slot at the end was well judged.`;
const LONG_COMMENT = Array.from({ length: 12 }, (_, i) => COMMENT_LINE(i)).join('\n');
// The size of a returned TP measured on the live demo course, 26 Sep 2026: 25-35 KB of docHTML.
const LIVE_SIZE_COMMENT = Array.from({ length: 75 }, (_, i) => COMMENT_LINE(i)).join('\n');
async function traineeTurnsIn(tp){
  await A.p.goto(`${BASE}1_trainee_plan_and_analysis.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2500);
  must(!(await A.p.$eval('#fTP', n => n.disabled)), 'the plan form is locked: the last TP was never cleared');
  await A.p.fill('#fTP', tp); await A.p.fill('#fLevel', 'B1'); await A.p.fill('#fLength', '45');
  await A.p.click('#fwBtn'); await A.p.click('.fw-item:has-text("Test – Teach – Test")'); await settle(A.p, 300); const c = await A.p.$('.confirm-action'); if (c) await c.click();
  await A.p.evaluate(tp => { const set = (sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
    set('.t-stage', 'Lead-in'); set('.t-aim', 'to set the topic'); set('.t-proc', '• Show three photos'); set('.t-time', '6'); set('#fMain', '• To practise the past simple, ' + tp); }, tp);
  await A.p.click('#turnInBtn'); await settle(A.p, 500); const c2 = await A.p.$('.confirm-action'); if (c2) await c2.click(); await settle(A.p, 3000);
  const rec = STORE.trainees[amaraToken].records.plan;
  must(rec && rec.status === 'turned_in', tp + ' plan not turned in on the store: ' + JSON.stringify(rec && rec.status));
  await A.p.goto(`${BASE}2_trainee_self_evaluation.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2500);
  await A.p.evaluate(tp => { const t = document.getElementById('sWell'); t.value = '• ' + tp + ': the lead-in got everyone talking'; t.dispatchEvent(new Event('input', { bubbles: true })); }, tp);
  await A.p.click('#turnInBtn'); await settle(A.p, 500); const c3 = await A.p.$('.confirm-action'); if (c3) await c3.click(); await settle(A.p, 3000);
  must((STORE.trainees[amaraToken].records.selfeval || {}).status === 'turned_in', tp + ' self-evaluation not on the store');
}
async function traineeStartsNextTP(filedTP){
  await A.p.goto(`${BASE}4_feedback_returned.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3500);
  const btn = await A.p.$('#nextTpBtn'); must(btn, 'no Start next TP button');
  await btn.click(); await settle(A.p, 500); const c = await A.p.$('.confirm-action'); if (c) await c.click(); await settle(A.p, 4000);
  const r = STORE.trainees[amaraToken].records;
  must(!r.plan && !r.selfeval && !r.feedback, 'desk not cleared on the store: ' + JSON.stringify(Object.keys(r)));
  const h = r.tpHistory || {};
  must(h[filedTP] && h[filedTP].docHTML, 'TP' + filedTP + ' not in the store history: {' + Object.keys(h) + '}');
  return Object.keys(h);
}
// The tutor's feedback screen for the candidate's current TP, filled and ready to return.
async function tutorFills(tp, strength){
  await T.p.goto(`${tutorUrl('3_tutor_feedback.html')}&trainee=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  const reads = await T.p.$eval('#fTP', n => n.value);
  must(reads === tp, '#fTP reads ' + JSON.stringify(reads) + ', not ' + tp + ': the screen is not on her current plan');
  must(!(await T.p.$eval('#fGrade', n => n.disabled)), 'the board is locked on an old return');
  const brief = await T.p.evaluate(() => eval('HubExchange.brief(DOC)'));
  const filled = brief.replace('## Grade\n\n', '## Grade\nTo standard\n').replace('## Strengths in teaching\n\n', '## Strengths in teaching\n- ' + strength + '\n');
  await T.p.evaluate(txt => { const dt = new DataTransfer(); dt.setData('text/plain', txt); document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, filled);
  await settle(T.p, 800);
  await T.p.evaluate(txt => { const t = document.getElementById('tOverall'); t.value = txt; t.dispatchEvent(new Event('input', { bubbles: true })); }, LONG_COMMENT);
  await settle(T.p, 1200);   // the autosave, so the return is not racing a draft
  const got = await T.p.evaluate(() => eval('(function(){ const c = collect(); return { grade: c.grade, st: c.st.length, overall: (c.overall || "").length }; })()'));
  must(got.grade === 'To standard' && got.st === 1 && got.overall > 1000, 'boxes: ' + JSON.stringify(got));
}
const returned = () => T.p.waitForFunction(() => /Returned/.test((document.getElementById('turnStatus') || {}).textContent || ''), null, { timeout: 20000 });
const localHistory = () => T.p.evaluate(t => { const r = JSON.parse(localStorage.getItem('connect_roster_v1') || '{}'); return Object.keys((((r.trainees || {})[t] || {}).tp || {}).history || {}); }, amaraToken);

await step('trainee: Start next TP files TP1 away and clears the desk', async () => {
  const h = await traineeStartsNextTP(1);
  return 'store history {' + h + '}, desk clear';
});
await step('trainee: TP2 plan and self-evaluation turned in', async () => { await traineeTurnsIn('TP2'); });
await step('tutor: TP2 returned from the same browser, to a slow store: "Returned" waits for the store', async () => {
  await tutorFills('TP2', 'Clear instructions');
  STORE.slow = 1500;
  const t0 = Date.now();
  try {
    await T.p.click('#returnBtn'); await settle(T.p, 300); const c = await T.p.$('.confirm-action'); if (c) await c.click();
    await returned();
  } finally { STORE.slow = 0; }
  const took = Date.now() - t0;
  const h = STORE.trainees[amaraToken].records.tpHistory || {};
  must(h[2] && h[2].docHTML, `the screen said Returned after ${took} ms, and the store's history was {${Object.keys(h)}}`);
  must(await T.p.$eval('#returnBtn', n => n.style.display === 'none'), 'the Return button is still showing');
  const sizes = Object.keys(h).map(k => `TP${k} ${h[k].docHTML.length}`).join(', ');
  return `store history {${Object.keys(h)}} (${sizes} chars), Returned after ${took} ms`;
});
await step('trainee: both sheets on the desk, the current one in front of the pile', async () => {
  await A.p.goto(`${BASE}4_feedback_returned.html?t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3500);
  const t = await text(A.p);
  must(/Clear instructions/.test(t), 'TP2 not shown'); must(/Good hook/.test(t), 'TP1 no longer shown');
  // newest last in the record, and the last sheet is the one in front
  const pile = await A.p.$$eval('#content .doc', ds => ds.map(d => (d.classList.contains('current') ? 'current' : 'earlier') + ':' + (/Clear instructions/.test(d.textContent) ? 'TP2' : /Good hook/.test(d.textContent) ? 'TP1' : '?')));
  must(pile.join(' ') === 'earlier:TP1 current:TP2', 'the pile reads ' + pile.join(' '));
});
// Reopen the returned TP on the tutor's screen, change the overall comment, return it again.
async function tutorReturnsAgain(comment){
  await T.p.goto(`${tutorUrl('3_tutor_feedback.html')}&trainee=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  const reopen = await T.p.$('#reopenBtn'); must(reopen, 'TP2 is not on the screen as returned');
  await reopen.click(); await settle(T.p, 300); const c = await T.p.$('.confirm-action'); if (c) await c.click(); await settle(T.p, 500);
  await T.p.evaluate(txt => { const t = document.getElementById('tOverall'); t.value = txt; t.dispatchEvent(new Event('input', { bubbles: true })); }, comment);
  await settle(T.p, 1200);
  await T.p.click('#returnBtn'); await settle(T.p, 300); const c2 = await T.p.$('.confirm-action'); if (c2) await c2.click();
  await returned(); await settle(T.p, 1500);
}
const localTP2 = () => T.p.evaluate(t => { const r = JSON.parse(localStorage.getItem('connect_roster_v1')); const e = r.trainees[t].tp.history[2]; return { at: e.returnedAt, chars: e.docHTML.length }; }, amaraToken);
await step('tutor: TP2 re-returned while the store refuses the filing, given up after three tries; the next boot still sends it', async () => {
  STORE.refuse = 'tpHistory';
  let mine;
  try {
    await tutorReturnsAgain(LONG_COMMENT + '\nAnd one more line, added on a second look.');
    const r = STORE.trainees[amaraToken].records;
    mine = await localTP2();
    must(r.feedback && r.feedback.returnedAt === mine.at, 'the re-returned feedback is not on the store');
    must((r.tpHistory[2] || {}).returnedAt !== mine.at, 'the store took the filing it was told to refuse');
    must(/Not saved to the course/.test(await text(T.p)), 'no banner for the refused filing');
    // Two more visits with the store still refusing: the ledger gives up after
    // three tries and keeps only the record of the refusal.
    for (let i = 0; i < 2; i++) { await T.p.reload({ waitUntil: 'domcontentloaded' }); await settle(T.p, 3000); }
    const kept = await T.p.evaluate(k => ({ ledger: localStorage.getItem('hub:pending:tutor:' + k), unsaved: localStorage.getItem('hub:unsaved:tutor:' + k) || '' }), STORE.key);
    must(!kept.ledger, 'the ledger still holds it after three refusals: ' + String(kept.ledger).slice(0, 80));
    must(/teaching practice record/.test(kept.unsaved), 'no record of the refusal: ' + kept.unsaved.slice(0, 120));
    must((await localTP2()).at === mine.at, 'the browser lost the re-return before any boot');
  } finally { STORE.refuse = ''; }
  // The store is back. Nothing is pending, so this boot is the one that used
  // to replace the roster with the store's older copy.
  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 5000);
  const h = STORE.trainees[amaraToken].records.tpHistory || {};
  must(h[2] && h[2].returnedAt === mine.at, 'the boot lost the re-return: the store holds ' + JSON.stringify(h[2] && h[2].returnedAt) + ', the browser ' + mine.at);
  must((await localTP2()).at === mine.at, 'the browser gave up its newer copy');
  must(!(await T.p.$('#hubUnsaved')), 'the banner is still up after the filing saved');
  return `store history {${Object.keys(h)}}, TP2 ${h[2].docHTML.length} chars, banner down`;
});
/* ===== KNOWN OPEN: a candidate's history is one Sheets cell ===== */
await known('store: a TP the size of a real one files into a history that already holds one', async () => {
  /* A candidate's whole tpHistory -- every returned TP, each with its docHTML
     -- is ONE record, one cell, 50,000 characters. A returned TP on the live
     demo course measures 25-35 KB, so a real candidate's second TP cannot
     file, and the October course will hit this at every candidate's second
     return. The client-side fix (Return waits for the store; the boot keeps a
     filing the store lacks) is right and does not cure this: the put itself
     is refused, sits in the ledger as transient, and -- worse -- a pending
     write holds every later boot off the roster, so the tutor stops seeing
     new work. Needs the store to hold each TP's entry as its own record: an
     Apps Script change plus every reader of tpHistory, not this repo's to
     make on its own. The step puts the short return back afterwards so the
     doomed write does not sit under the rest of the walk. */
  let sizes = '';
  try {
    await tutorReturnsAgain(LIVE_SIZE_COMMENT);
    const r = STORE.trainees[amaraToken].records, h = r.tpHistory || {}, mine = await localTP2();
    sizes = `feedback record ${JSON.stringify(r.feedback).length} chars, history cell ${JSON.stringify(h).length} chars`;
    must(r.feedback && r.feedback.returnedAt === mine.at, 'the feedback itself did not save: ' + sizes);
    must(h[2] && h[2].returnedAt === mine.at, `the ${mine.chars}-char TP2 did not file (${sizes}); refused over the cell: ${STORE.overCell.join('; ') || 'none'}`);
  } finally {
    STORE.overCell = [];
    await tutorReturnsAgain(LONG_COMMENT);
    const r = STORE.trainees[amaraToken].records, mine = await localTP2();
    if (!(r.tpHistory[2] && r.tpHistory[2].returnedAt === mine.at)) findings.push('the short return did not go back on the store after the cell-limit step');
  }
  return sizes;
});
await step('trainee: Start next TP files TP2; the desk is clear', async () => {
  const h = await traineeStartsNextTP(2);
  must(h.includes('1') && h.includes('2'), 'store history {' + h + '}');
  return 'store history {' + h + '}, desk clear';
});

/* ===== TRAINEE submits an assignment against a deadline ===== */
await step('trainee: assignment shows its deadline, submits to the store', async () => {
  await A.p.goto(`${BASE}9_assignment_submission.html?t=${amaraToken}&a=${assignKey}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3000);
  const pill = await A.p.$eval('.duepill', n => n.textContent).catch(() => '');
  must(/Due .* left/.test(pill), 'no due pill: ' + pill);
  await A.p.evaluate(() => { const ta = document.querySelector('textarea'); ta.value = 'I chose to focus on the past simple because my learners keep confusing it with the present perfect. '.repeat(12); ta.dispatchEvent(new Event('input', { bubbles: true })); });
  await A.p.evaluate(() => { const ml = document.querySelector('[data-role="materialslink"]'); if (ml) { ml.value = 'https://drive.google.com/file/d/1ASSIGN/view'; ml.dispatchEvent(new Event('input', { bubbles: true })); } });
  // declarations: one at a time, re-querying (they re-render)
  for (let i = 0; i < 6; i++) { const box = await A.p.$('[data-role="decl-check"]:not(:checked)'); if (!box) break; await box.click(); await settle(A.p, 250); }
  const no = await A.p.$('[data-role="ai"][value="no"]'); if (no) { await no.click(); await settle(A.p, 300); }
  must(!(await A.p.$eval('#submitBtn', b => b.disabled)), 'Submit still off: ' + await A.p.$eval('#emptyHint', n => n.textContent).catch(() => ''));
  await A.p.click('#submitBtn'); await settle(A.p, 500); const c = await A.p.$('.confirm-action'); if (c) await c.click(); await settle(A.p, 3000);
  const sub = (STORE.trainees[amaraToken].records.assignments || {})[assignKey];
  must(sub && sub.stage === 'submitted', 'not submitted on the store: ' + JSON.stringify(sub && sub.stage));
  must(sub.sub1 && sub.sub1.materialsLink, 'materials link not on the submission');
});
await step('trainee: the four-item picker, with a group nobody chooses', async () => {
  /* Language Related Tasks analyses FOUR items: one grammar structure chosen
     from three, one functional exponent that is the same for everyone, and two
     vocabulary items chosen from three. The picker used to be exactly two
     groups sharing one count, so this assignment could not be written down at
     all (25 Sep 2026). Each group's own cap has to hold, the fixed group has to
     arrive without being clicked, and the analysis table has to repeat for all
     four. */
  await A.p.goto(`${BASE}9_assignment_submission.html?t=${amaraToken}&a=lrt`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3000);
  must(/Dear Marta/.test(await text(A.p)), 'the letter the items come from is not on the page');

  const chips = c => A.p.$$(`[data-role="chip"][data-cat="${c}"]:not([disabled])`);
  const g = await chips('A');
  must(g.length === 3, 'grammar group: ' + g.length + ' chips');
  await g[0].click(); await settle(A.p, 500);
  // one only: the second click must be refused by the group's own cap
  const gAfter = await A.p.$$('[data-role="chip"][data-cat="A"].disabled');
  must(gAfter.length === 2, 'grammar group did not cap at one: ' + gAfter.length + ' disabled');

  const v = await chips('C'); await v[0].click(); await settle(A.p, 400);
  const v2 = await chips('C'); await v2[1].click(); await settle(A.p, 600);

  const got = await A.p.evaluate(() => eval('itemsForFieldsSection(WORDING.lrt, WORDING.lrt.sections.findIndex(s => s.type === "fields"))'));
  must(got.length === 4, 'four items expected, got ' + JSON.stringify(got));
  must(got.some(x => /talk properly soon/.test(x)), 'the fixed functional exponent did not arrive: ' + JSON.stringify(got));
  const blocks = await A.p.$$('.itemblock');
  must(blocks.length === 4, 'the analysis table did not repeat for all four: ' + blocks.length);
  return got.join(' · ');
});
await step('trainee: the closed assignment refuses, and says why', async () => {
  await A.p.goto(`${BASE}9_assignment_submission.html?t=${amaraToken}&a=${lateKey}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2500);
  const pill = await A.p.$eval('.duepill', n => n.textContent).catch(() => '');
  must(/Closed/.test(pill), 'no closed pill: ' + pill);
  must(await A.p.$eval('#submitBtn', b => b.disabled), 'Submit is live on a closed assignment');
  must(/Ask your tutor/.test(await A.p.$eval('#emptyHint', n => n.textContent)), 'no reason given');
});

/* ===== TUTOR marks, extends, tracks, grades ===== */
await step('tutor: marking shows the materials button and the due row; a pasted marking lands', async () => {
  await T.p.goto(`${tutorUrl('10_tutor_assignment_marking.html')}&trainee=${amaraToken}&a=${assignKey}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  must(await T.p.$('a.mats-open'), 'no materials button on the submission');
  must(await T.p.$('.duerow'), 'no due row');
  // The word count. It used to be a CRITERION on every assignment, which
  // Cambridge does not have (syllabus, Component 2), so 25 Sep 2026 took it
  // out of the criteria lists -- and that was the tutor's only sight of the
  // count. If this line goes, a tutor marks a 1,400-word assignment blind.
  const wc = await T.p.evaluate(() => [...document.querySelectorAll('p.note')].map(n => n.textContent).find(t => /words submitted, against/.test(t)) || '');
  must(/^\d+ words submitted, against 750\u20131,?000/.test(wc), 'no word count on the marking screen: ' + JSON.stringify(wc));
  const brief = await T.p.evaluate(() => eval('xBrief(WORDING[CURRENT], subFor(CURRENT), "sub1")'));
  const h1 = brief.match(/## Criterion 1 — [^\n]*/)[0];
  const filled = brief.replace(h1 + '\n\n', h1 + '\nMet\nAccurate.\n').replace('## General comment\n\n', '## General comment\nCareful work.\n');
  await T.p.evaluate(txt => { const dt = new DataTransfer(); dt.setData('text/plain', txt); document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, filled);
  await settle(T.p, 800);
  const got = await T.p.evaluate(() => eval('(function(){ const s = subFor(CURRENT); return { m0: s.criteriaMarks.sub1[0], c0: s.criteriaComments.sub1[0], g: document.getElementById("comment").value }; })()'));
  must(got.m0 === true && got.c0 === 'Accurate.' && got.g === 'Careful work.', 'marking boxes: ' + JSON.stringify(got));
  await settle(T.p, 2500);
  const onStore = ((STORE.trainees[amaraToken].records.assignments || {})[assignKey] || {});
  must((onStore.criteriaMarks || {}).sub1?.[0] === true && (onStore.criteriaComments || {}).sub1?.[0] === 'Accurate.', 'pasted marking not on the store: ' + JSON.stringify({ m: onStore.criteriaMarks, c: onStore.criteriaComments }));
});
await step('tutor: a comment typed by hand survives marking the next criterion', async () => {
  // 24 Sep 2026: render() rebuilt the form on every pill click and only Save
  // read the comment boxes, so typing on criterion 2 then marking criterion 3
  // wiped the comment.
  await T.p.evaluate(() => { const el = document.querySelector('[data-crit-comment="1"]'); el.value = 'Terminology is right.'; el.dispatchEvent(new Event('input', { bubbles: true })); const g = document.getElementById('comment'); g.value = 'Careful work, and on time.'; g.dispatchEvent(new Event('input', { bubbles: true })); });
  await T.p.click('[data-crit="2"]'); await settle(T.p, 2500);
  const after = await T.p.evaluate(() => ({ c1: document.querySelector('[data-crit-comment="1"]').value, g: document.getElementById('comment').value, p2: document.querySelector('[data-crit="2"]').textContent.trim() }));
  must(after.c1 === 'Terminology is right.' && after.g === 'Careful work, and on time.', 'comment wiped by the pill click: ' + JSON.stringify(after));
  must(after.p2 === 'Met', 'pill did not mark: ' + after.p2);
  const onStore = ((STORE.trainees[amaraToken].records.assignments || {})[assignKey] || {});
  must(onStore.criteriaComments?.sub1?.[1] === 'Terminology is right.' && onStore.feedback?.generalComment1 === 'Careful work, and on time.', 'typed comments not on the store: ' + JSON.stringify({ c: onStore.criteriaComments, f: onStore.feedback }));
  return 'comment and general comment kept, and on the store';
});
await step('tutor: an extension on the closed assignment reaches her through the store', async () => {
  await T.p.goto(`${tutorUrl('10_tutor_assignment_marking.html')}&trainee=${amaraToken}&a=${lateKey}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  must(await T.p.$('.duerow.past'), 'due row not red on a closed assignment');
  await T.p.click('#extSet'); await settle(T.p, 3000);
  const ext = ((STORE.trainees[amaraToken].records.tracker || {}).extensions || {});
  must(ext['a:' + lateKey], 'extension not on the store tracker: ' + JSON.stringify(ext));
  await A.p.goto(`${BASE}9_assignment_submission.html?t=${amaraToken}&a=${lateKey}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3500);
  const pill = await A.p.$eval('.duepill', n => n.textContent).catch(() => '');
  must(/your extension/.test(pill), 'her screen does not show the extension: ' + pill);
  return 'her pill: ' + pill;
});
await step('tutor: the tracker shows her, with the assignment states', async () => {
  await T.p.goto(tutorUrl('7_candidate_tracker.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  const row = await T.p.evaluate(() => { const r = [...document.querySelectorAll('.grid')].find(x => /Amara/.test(x.innerText)); return r ? [...r.querySelectorAll('.chip')].map(c => c.textContent.trim().replace('/ —', '').trim() + ':' + c.className.replace('chip ', '')) : null; });
  must(row, 'no row for her'); must(row.some(c => /^in:/.test(c)), 'submitted assignment not "in": ' + row.join(' '));
  must(row.some(c => /^due:/.test(c)), 'extended-but-unsubmitted one not "due": ' + row.join(' '));
  return row.join('  ');
});
await step('tutor: a grade saved to the store', async () => {
  await T.p.goto(tutorUrl('13_grades_report.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  /* The Classroom shape (25 Sep 2026): the cohort in two tables at the top,
     every candidate down the page. A grade chosen in the cohort table must
     show on the candidate's own row, and the other way round. */
  const inTable = await T.p.$('.cohort select.grade[data-grade="final"]'); must(inTable, 'no final-grade select in the cohort table');
  await inTable.selectOption('PASS'); await settle(T.p, 300);
  const onRow = await T.p.$eval('.cand .grow.final select.grade', el => el.value);
  must(onRow === 'PASS', 'the candidate row did not follow the cohort table: ' + onRow);
  await T.p.selectOption('.cand .grow select.grade[data-grade="provisional"]', 'PASS / PASS B'); await settle(T.p, 300);
  const inTable2 = await T.p.$eval('.cohort select.grade[data-grade="provisional"]', el => el.value);
  must(inTable2 === 'PASS / PASS B', 'the cohort table did not follow the candidate row: ' + inTable2);
  // a strength, with its criterion code, and the section's copy button
  await T.p.click('.cand [data-sec="teachS"] [data-add]'); await settle(T.p, 300);
  await T.p.fill('.cand [data-sec="teachS"] .pt textarea', 'Establishes good rapport with the group from the outset');
  await T.p.selectOption('.cand [data-sec="teachS"] .pt select', '1d'); await settle(T.p, 200);
  const copied = await T.p.evaluate(() => eval('sectionText(ORDER[0].id, "teachS")'));
  must(copied === 'Establishes good rapport with the group from the outset (1d)', 'section copy text: ' + JSON.stringify(copied));
  await T.p.click('#saveBtn'); await settle(T.p, 3000);
  const g = (STORE.trainees[amaraToken].records.tracker || {}).grades;
  must(g && g.final === 'PASS' && g.provisional === 'PASS / PASS B', 'grades not on the store tracker: ' + JSON.stringify(g));
  must(g.teachS && g.teachS[0] && g.teachS[0].code === '1d', 'the coded strength not on the store: ' + JSON.stringify(g.teachS));
  return 'final PASS, provisional PASS / PASS B, one coded strength, on the store';
});

await step('tutor: the final course report, from the grade just saved', async () => {
  /* Connect's final report, page for page (25 Sep 2026). The cover certifies
     the hours and the grade over the tutors' signatures; the reverse gives the
     two assessment areas and the syllabus descriptor for the grade. Nothing on
     it is typed twice: the grade is the grades report's, the assignments'
     Pass/Fail is read off her record, the hours and tutors are the course's. */
  await T.p.goto(tutorUrl('6_centre_admin_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 2500);
  await T.p.fill('#totalHours', '120'); await T.p.selectOption('#deliveryMode', 'mixed'); await T.p.fill('#tutorNames', 'Ramy Sakr, Pelin Korkmaz');
  await T.p.click('#saveSettings'); await settle(T.p, 3000);
  must((STORE.course.settings || {}).tutorNames === 'Ramy Sakr, Pelin Korkmaz', 'tutor names not on the store: ' + JSON.stringify(STORE.course.settings));
  await T.p.goto(tutorUrl('13_grades_report.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  await T.p.fill('.cand [data-field="hoursAttended"]', '118');
  await T.p.fill('.cand [data-field="overall"]', 'A confident, well-prepared teacher by the end of the course.');
  await T.p.click('#saveBtn'); await settle(T.p, 3000);
  const door = await T.p.$eval('.cand .frrow a.btn', a => a.getAttribute('href'));
  await T.p.goto(`${BASE}${door}&k=${STORE.key}`, { waitUntil: 'domcontentloaded' }); await settle(T.p, 3000);
  const body = await text(T.p);
  // The centre's own wording (its Pass A / Pass B templates and a real Pass report, 25 Sep 2026)
  must(/This is to confirm that\s+Amara Nwosu/.test(body), 'the cover does not confirm her: ' + body.slice(0, 200));
  must(/attended 118 hours of a 120-hour initial teacher training course/.test(body) && /6 hours of classroom-based and online teaching practice/.test(body), 'hours or mode missing: ' + body.slice(0, 700));
  must(/Ramy Sakr[\s\S]*Pelin Korkmaz[\s\S]*CELTA course Tutor/.test(body), 'signatures missing');
  must(/Preparing, planning and practising teaching\s+Grade: Pass/.test(body), 'the teaching area grade is not the final grade');
  must(/Written assignments\s+Grade: (Pass|Fail|\u2014|—)/.test(body), 'the assignments area is missing');
  // innerText carries the heading's text-transform, so the heading arrives in capitals
  must(/Performance Descriptor for a Pass Grade/i.test(body) && /continue to need guidance/.test(body), 'the descriptor for the grade is missing');
  must(/A confident, well-prepared teacher/.test(body), 'the overall comment is missing');
  return 'cover, two areas, descriptor, comment, two signatures';
});

/* ===== ASSESSOR ===== */
const S = await ctx('assessor');
await step('assessor: the invitation card, then the pack, from a clean browser', async () => {
  await S.p.goto(`${BASE}invite.html?ak=${STORE.akey}`, { waitUntil: 'domcontentloaded' }); await settle(S.p, 3000);
  const t = await text(S.p); must(/Assessor access/i.test(t) && /Cambridge assessor/.test(t) && /TR073/.test(t), 'card wrong: ' + t.slice(0, 160));
  await S.p.click('#go'); await settle(S.p, 3500);
  const pk = await text(S.p);
  must(/Amara/.test(pk), 'pack does not list her'); must(/C\/18 2026/.test(pk), 'pack has no course name');
  must((await S.p.$$('textarea, input:not([type=hidden]):not([type=checkbox])')).length <= 2, 'assessor pack has editable fields');
});
await step('assessor: the final report opens from the pack; the candidate is refused', async () => {
  await S.p.goto(`${BASE}12_assessor_pack.html?ak=${STORE.akey}`, { waitUntil: 'domcontentloaded' }); await settle(S.p, 3000);
  const door = await S.p.$('a[href^="16_final_report.html"]'); must(door, 'no final-report door on the pack');
  await door.click(); await settle(S.p, 3000);
  must(/This is to confirm that\s+Amara Nwosu/.test(await text(S.p)), 'the assessor could not open the report');
  await A.p.goto(`${BASE}16_final_report.html?id=${encodeURIComponent(amaraToken)}&t=${amaraToken}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 2500);
  const t = await text(A.p);
  must(!/This is to confirm/.test(t), 'a candidate could open her own final report before release');
  return 'assessor in, candidate refused';
});
await step('assessor: the tutor room refuses', async () => {
  await S.p.goto(`${BASE}3_tutor_feedback.html?ak=${STORE.akey}`, { waitUntil: 'domcontentloaded' }); await settle(S.p, 2000);
  must(/This room belongs to/.test(await text(S.p)), 'assessor got into the feedback form');
});

/* ===== the unsaved-write guard, live ===== */
await step('trainee: a refused write is kept and shown, not thrown away', async () => {
  // Her plan is turned in and locked, so it cannot produce a write. The
  // extended assignment can: her page is up and booted, THEN the store
  // forgets her, THEN she writes a draft.
  await A.p.goto(`${BASE}9_assignment_submission.html?t=${amaraToken}&a=${lateKey}`, { waitUntil: 'domcontentloaded' }); await settle(A.p, 3500);
  const saved = STORE.trainees[amaraToken]; delete STORE.trainees[amaraToken];
  await A.p.evaluate(() => { const ta = document.querySelector('textarea:not([disabled])'); ta.value = 'written while the store said no'; ta.dispatchEvent(new Event('input', { bubbles: true })); });
  await settle(A.p, 4500);
  const shown = !!(await A.p.$('#hubUnsaved'));
  const kept = await A.p.evaluate(() => Object.keys(localStorage).some(k => k.startsWith('hub:unsaved:')));
  STORE.trainees[amaraToken] = saved;
  must(shown && kept, `refused write: banner ${shown}, record ${kept}`);
  // and when the store is back, Try again clears it
  await A.p.click('#hubUnsaved [data-u=retry]'); await settle(A.p, 3000);
  must(!(await A.p.$('#hubUnsaved')), 'banner still up after the store came back');
  must(JSON.stringify(STORE.trainees[amaraToken].records.assignments || {}).includes('written while the store said no'), 'her draft never reached the store after retry');
  return 'refused, kept, shown; retried and cleared';
});
await step('tutor: a course with work already marked is left on its own criteria', async () => {
  /* The other half of the adoption above, and the one that matters more.
     criteriaMarks and criteriaComments are POSITIONAL, so replacing an
     eight-item list with a six-item one on an assignment already marked would
     move a Met from one criterion to another and drop the last two. By this
     point in the walk Amara has a marked assignment, so the guard must hold. */
  // The dashboard, so the superseded lists are on the page to read.
  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 2500);
  // A LIST of every default Lite has shipped, oldest first. The oldest is the
  // one worth planting: a course that has sat untouched the longest.
  const versions = await T.p.evaluate(() => eval('JSON.parse(JSON.stringify(window.CONNECT_HUB_SUPERSEDED_WORDING || []))'));
  must(Array.isArray(versions) && versions.length, 'the superseded wording is not on the dashboard: ' + JSON.stringify(versions).slice(0, 120));
  const was = versions[0];
  must(Object.keys(was).length === 4, 'the oldest superseded version does not hold four assignments: ' + JSON.stringify(Object.keys(was)));
  const marked = Object.values(STORE.trainees).some(t => Object.keys((t.records || {}).assignments || {}).length);
  must(marked, 'this step proves nothing unless the course has an assignment record by now');
  const keep = JSON.parse(JSON.stringify(STORE.course.wording));
  for (const k of Object.keys(was)) {
    const a = STORE.course.wording[k]; if (!a) continue;
    a.title = was[k].title;
    a.criteria = was[k].criteria.map(t => ({ text: t, sectionIndex: null }));
    a.sections = JSON.parse(JSON.stringify(was[k].sections));
  }
  const before = Object.fromEntries(Object.entries(was).map(([k]) => [k, STORE.course.wording[k].criteria.length]));

  await T.p.goto(tutorUrl('5_tutor_dashboard.html'), { waitUntil: 'domcontentloaded' }); await settle(T.p, 3500);

  const after = Object.fromEntries(Object.entries(was).map(([k]) => [k, STORE.course.wording[k].criteria.length]));
  STORE.course.wording = keep;
  must(JSON.stringify(after) === JSON.stringify(before), 'marked work had its criteria swapped under it: ' + JSON.stringify({ before, after }));
  return 'left alone: ' + Object.entries(after).map(([k, v]) => `${k} ${v}`).join(', ');
});

console.log(`\n${passed} of ${n} steps passed; ${STORE.calls.length} store calls.`);
if (findings.length) { console.log('\nFINDINGS'); findings.forEach(f => console.log('  - ' + f)); }
else console.log('\nNothing screamed.');
await browser.close(); site.close(); storeServer.close();
process.exit(findings.length ? 1 : 0);
