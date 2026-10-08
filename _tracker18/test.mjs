// The restored tracker: its real Code.js in a VM against the strict fake sheet,
// its real index.html in Chromium, wired together through google.script.run.
import vm from 'node:vm'; import { readFileSync } from 'node:fs';
import { makeEnv } from '../_tracker-test/fake.mjs';
import { chromium } from '/Users/work/connect-Hub/node_modules/playwright/index.mjs';
const env = makeEnv(); const ctx = vm.createContext({ ...env.globals, console, Utilities: { formatDate: (d) => d.toISOString().slice(0, 10) }, Session: { getScriptTimeZone: () => 'Europe/Istanbul' } });
vm.runInContext(readFileSync('Code.js', 'utf8'), ctx);
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const ro = env.ss.insertSheet('Roster'); ro.cells = [['group','candidate'],['C18','Billur Manav'],['C18','Iris Ersoy'],['C18','Kian Pakravanan'],['C18','Koray Yeşilyayla'],['C18','Hiba Alimam'],['C18','Ebru Rifai']];
ok(ctx.courseCode() === 'C18/2026', 'course code');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.exposeFunction('__srv', (fn, args) => { try { return { ok: JSON.parse(JSON.stringify(ctx[fn](...args) ?? null)) }; } catch (e) { return { err: String(e.message) }; } });
await p.addInitScript(() => {
  const mk = (ok, bad) => new Proxy({}, { get: (_, k) => k === 'withSuccessHandler' ? (f) => mk(f, bad) : k === 'withFailureHandler' ? (f) => mk(ok, f)
    : (...a) => window.__srv(k, a).then(r => r.err ? bad && bad(new Error(r.err)) : ok && ok(r.ok)) });
  window.google = { script: { run: mk(null, null) } };
});
const html = readFileSync('index.html', 'utf8');
await p.route('https://tracker.test/', r => r.fulfill({ contentType: 'text/html', body: html }));
await p.goto('https://tracker.test/'); await p.waitForTimeout(1500);
const t = await p.evaluate(() => document.body.innerText); if (errs.length) console.log('PAGE ERRORS', errs);
ok(/COURSE C18\/2026/.test(t) && /B1 first, then A1/.test(t) && !/Group ABC|Group DEF/.test(t) && /Ebru Rifai/.test(t), 'renders C/18 roster');
ok(/Live — synced with the shared sheet/.test(t), 'live line');
await p.screenshot({ path: 'r-overview.png' });
await p.click('.cand-head >> nth=0'); await p.waitForTimeout(400);
const lbls = await p.$$eval('.cand:not(.collapsed) .tp-lbl, .tp-lbl', els => els.slice(0, 8).map(e => e.textContent));
ok(lbls[0] === 'TP1 · B1' && lbls[4] === 'TP5 · A1', 'levels: ' + lbls.join(','));
await p.screenshot({ path: 'r-open.png' });
await p.click('.tp-cell .badge >> nth=0'); await p.waitForTimeout(400);
await p.screenshot({ path: 'r-grid.png' });
await p.click('.tp-pop .pchip:has-text("To standard")'); await p.waitForTimeout(500);
await p.click('.tp-pop .pchip:has-text("Grammar")'); await p.waitForTimeout(800);
const data = ctx.getData(); const row = data['c18-billur-manav'];
ok(row && row.tp1 && row.tp1_aim, 'grid saved grade+aim: ' + JSON.stringify(row && [row.tp1, row.tp1_aim]));
ok(errs.length === 0, 'no page errors: ' + errs.join(' | '));
console.log('total', pass, 'passed,', fail, 'failed'); await b.close();
