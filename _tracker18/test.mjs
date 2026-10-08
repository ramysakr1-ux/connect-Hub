// Server in a VM against the strict fake sheet API; the page in Chromium, wired to it.
import vm from 'node:vm'; import { readFileSync } from 'node:fs';
import { makeEnv } from '../_tracker-test/fake.mjs';
import { chromium } from '/Users/work/connect-Hub/node_modules/playwright/index.mjs';
const env = makeEnv(); const ctx = vm.createContext({ ...env.globals, console });
vm.runInContext(readFileSync('Code.js', 'utf8'), ctx);
const S = env.ss; let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const throws = (fn, re, m) => { try { fn(); ok(false, m + ' (did not throw)'); } catch (e) { ok(re.test(String(e.message)), m + ' threw ' + e.message); } };
// seed C/18 roster as the real sheet has it
const ro = S.insertSheet('Roster'); ro.cells = [['group','candidate'],['ABC','Billur Manav'],['ABC','Iris Ersoy'],['ABC','Kian Pakravanan'],['DEF','Koray Yeşilyayla'],['DEF','Hiba Alimam'],['DEF','Ebru Rifai']];
let d = ctx.getData();
ok(d.roster.length === 6 && d.config.course === 'C18/2026', 'roster + course');
ok(d.roster[3].id === 'def-koray-ye-ilyayla', 'slug as the C/17 tracker made them: ' + d.roster[3].id);
ok(S.getSheetByName('Tracker').cells[0].length === 32, 'Tracker header written');
let r = ctx.saveField('abc-billur-manav', 'tp1', 'STD'); ok(r.tp1 === 'STD' && r.updated, 'save tp1');
ctx.saveField('abc-billur-manav', 'tp1_aim', 'Grammar');
ok(ctx.getData().rows['abc-billur-manav'].tp1_aim === 'Grammar', 'aim persisted');
throws(() => ctx.saveField('abc-billur-manav', 'tp1', 'BANANA'), /BAD_VALUE/, 'bad grade refused');
throws(() => ctx.saveField('abc-nobody', 'tp1', 'STD'), /STALE_ROSTER/, 'stale id refused');
throws(() => ctx.saveField('abc-billur-manav', 'updated', 'x'), /UNKNOWN_FIELD/, 'updated not writable');
throws(() => ctx.saveField('abc-billur-manav', 'tp1_aim', 'Pronunciation'), /BAD_VALUE/, 'aim outside the seven refused');
ok(JSON.stringify(ctx.healthCheck()) === '{"orphans":[],"bad":[]}', 'health clean');
const tr = S.getSheetByName('Tracker'); tr.cells[1][FIELD('tp2')] = 'BANANA';
function FIELD(f){ return vm.runInContext('FIELDS', ctx).indexOf(f); }
ok(ctx.healthCheck().bad.length === 1, 'health catches a bad cell'); tr.cells[1][FIELD('tp2')] = '';
throws(() => ctx.startNewCourse('C17/2026', 'C19/2026', 'A\tX'), /CONFIRM_MISMATCH/, 'wrong confirm');
throws(() => ctx.startNewCourse('C18/2026', '', 'A\tX'), /NO_NEW_CODE/, 'no new code');
throws(() => ctx.startNewCourse('C18/2026', 'C19/2026', ''), /EMPTY_ROSTER/, 'empty roster');
ok(ctx.getData().rows['abc-billur-manav'].tp1 === 'STD', 'guards wrote nothing');
// C/17's real data still reads, rules and all (read from the archive values)
const c17 = JSON.parse(readFileSync('c17rows.json', 'utf8'));
console.log('server checks', pass, 'passed,', fail, 'failed');

// ---- the page ----
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.exposeFunction('__srv', (fn, args) => { try { return { ok: JSON.parse(JSON.stringify(ctx[fn](...args))) }; } catch (e) { return { err: String(e.message) }; } });
await p.addInitScript(() => {
  const mk = (ok, bad) => new Proxy({}, { get: (_, k) => k === 'withSuccessHandler' ? (f) => mk(f, bad) : k === 'withFailureHandler' ? (f) => mk(ok, f)
    : (...a) => window.__srv(k, a).then(r => r.err ? bad && bad(new Error(r.err)) : ok && ok(r.ok)) });
  window.google = { script: { run: mk(null, null) } };
});
const html = readFileSync('Index.html', 'utf8');
await p.route('https://tracker.test/', r => r.fulfill({ contentType: 'text/html', body: html }));
await p.goto('https://tracker.test/'); await p.waitForTimeout(1500);
const t = await p.evaluate(() => document.body.innerText);
ok(/C18\/2026 Candidate Tracker/.test(t) && /Group ABC/.test(t) && /Group DEF/.test(t) && /Ebru Rifai/.test(t), 'page renders roster');
ok(/TP1–4 B1 · TP5–8 A1/.test(t), 'levels line');
// TP grid: Iris TP2 -> Above standard, Lexis
await p.click('button[data-id="abc-iris-ersoy"][data-tp="2"]'); await p.waitForTimeout(200);
await p.click('#pop button[data-g="ABOVE"][data-a="Lexis"]'); await p.waitForTimeout(800);
let row = ctx.getData().rows['abc-iris-ersoy']; ok(row && row.tp2 === 'ABOVE' && row.tp2_aim === 'Lexis', 'grid saved grade+aim: ' + JSON.stringify(row && [row.tp2, row.tp2_aim]));
// stage 2 cycle twice -> STD, assignment cycle -> PASS, DM, fail letter, withdrawn
await p.click('button[data-id="def-hiba-alimam"][data-cycle="stage2"]'); await p.waitForTimeout(500);
await p.click('button[data-id="def-hiba-alimam"][data-cycle="stage2"]'); await p.waitForTimeout(500);
await p.click('button[data-id="def-hiba-alimam"][data-assign="fol"]'); await p.waitForTimeout(500);
await p.check('input[data-id="def-hiba-alimam"][data-dm="fol"]'); await p.waitForTimeout(500);
await p.fill('input[data-id="def-ebru-rifai"][data-text="failLetter"]', '29/10/2026'); await p.press('input[data-id="def-ebru-rifai"][data-text="failLetter"]', 'Tab'); await p.waitForTimeout(500);
row = ctx.getData().rows['def-hiba-alimam']; ok(row.stage2 === 'STD' && row.fol_r === 'PASS' && row.fol_dm === 'TRUE', 'stage/assign/dm saved: ' + JSON.stringify([row.stage2, row.fol_r, row.fol_dm]));
ok(ctx.getData().rows['def-ebru-rifai'].failLetter === '29/10/2026', 'fail letter saved');
// rules: Kian NOTSTD at stage 2 -> potential fail + letter due + stage 3 required
ctx.saveField('abc-kian-pakravanan', 'stage2', 'NOTSTD'); await p.click('#reload'); await p.waitForTimeout(1200);
const kt = await p.evaluate(() => [...document.querySelectorAll('.card')].find(c => /Kian/.test(c.innerText)).innerText);
ok(/POTENTIAL FAIL/.test(kt) && /no Fail letter issued/.test(kt) && /Stage 3 required — not to standard at Stage 2/.test(kt), 'rules fire for Kian');
await p.screenshot({ path: 'shot-desk.png', fullPage: false });
await p.click('button[data-id="def-koray-ye-ilyayla"][data-tp="5"]'); await p.waitForTimeout(300); await p.screenshot({ path: 'shot-grid.png' });
await p.keyboard.press('Escape');
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300); await p.screenshot({ path: 'shot-phone.png' });
// copy summary text
const sum = await p.evaluate(() => summary()); ok(/GROUP ABC/.test(sum) && /Iris Ersoy/.test(sum) && /TP2 AS \(Lexis\)/.test(sum), 'summary');
ok(errs.length === 0, 'no page errors: ' + errs.join(' | '));
console.log('total', pass, 'passed,', fail, 'failed'); await b.close();
