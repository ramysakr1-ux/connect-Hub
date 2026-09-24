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
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = new URL('.', import.meta.url).pathname;
const DAY = 864e5;

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
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|UNSAFE_PORT|favicon/.test(m.text())) findings.push(`[${who}] console: ${m.text().slice(0, 160)}`); });
}
async function ctx(who){ const c = await browser.newContext({ viewport: { width: 1340, height: 1000 } }); const p = await c.newPage(); watch(p, who); return { c, p }; }
let n = 0, passed = 0;
async function step(name, fn){
  n++; try { const note = await fn(); passed++; console.log(`  ok  ${n}. ${name}${note ? ' — ' + note : ''}`); }
  catch (e) { findings.push(`step ${n} (${name}): ${e.message}`); console.log(`  FAIL ${n}. ${name} — ${e.message}`); }
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
  const prose = await T.p.evaluate(() => eval('Object.keys(DATA).filter(k => DATA[k] && DATA[k].sections && DATA[k].sections.some(s => s.type === "text" && !/before you start/i.test(s.label)))'));
  assignKey = prose[0]; lateKey = keys.find(k => k !== assignKey);
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
  await A.p.selectOption('#fwSelect', 'ttt'); await A.p.click('#fwApply'); await settle(A.p, 300); const c = await A.p.$('.confirm-action'); if (c) await c.click();
  await A.p.evaluate(() => { const t = document.querySelector('.t-stage'); t.value = 'Lead-in: to set the topic'; t.dispatchEvent(new Event('input', { bubbles: true }));
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
  const pill = await T.p.$('[data-grade="final"]:not(.capped)') || await T.p.$('[data-grade]');
  must(pill, 'no grade pills'); await pill.click(); await settle(T.p, 300);
  await T.p.click('#saveBtn'); await settle(T.p, 3000);
  const g = (STORE.trainees[amaraToken].records.tracker || {}).grades;
  must(g && Object.keys(g).length, 'grade not on the store tracker: ' + JSON.stringify(STORE.trainees[amaraToken].records.tracker));
  return JSON.stringify(g);
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

console.log(`\n${passed} of ${n} steps passed; ${STORE.calls.length} store calls.`);
if (findings.length) { console.log('\nFINDINGS'); findings.forEach(f => console.log('  - ' + f)); }
else console.log('\nNothing screamed.');
await browser.close(); site.close(); storeServer.close();
process.exit(findings.length ? 1 : 0);
