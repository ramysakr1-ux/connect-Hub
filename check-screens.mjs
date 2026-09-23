/**
 * Connect Lite — every screen, every link, in a real browser.
 *
 *   npm run check
 *
 * Lite has no build and no server, so this is the whole of its test suite. It
 * exists because two bugs got through everything else on 23 Sep 2026: the
 * candidate tracker handed a trainee the tutor's editable grid when the URL
 * lost its ?me=1, and the no-link page told first-time visitors their link had
 * expired. Both were one page load away from being obvious.
 *
 * It builds its own harness, because the order matters and getting it wrong
 * quietly points a test at the LIVE store:
 *   1. copy the site into a temp folder
 *   2. THEN neutralise hub-store's URL
 * Never the other way round, and never copy again afterwards without
 * re-neutralising — that mistake once sent a walk's writes at the real sheet.
 *
 * What it asserts, per screen and per link:
 *   - the page loads and its <script type="text/x-hub-app"> actually ran
 *   - no unexpected page or console errors
 *   - the room guard answers the way the matrix below says it should
 * A guard refusing on purpose throws by design; that throw is not a failure.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = new URL('.', import.meta.url).pathname;

/* Who may open what. "own" means the screen opens but must show the person
   their own view rather than the tutor's -- the exact distinction screen 7
   lost. Anything not listed is expected to open. */
const ROOMS = {
  'index.html':                      { trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '1_trainee_plan_and_analysis.html':{ trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '2_trainee_self_evaluation.html':  { trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '3_tutor_feedback.html':           { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '5_tutor_dashboard.html':          { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '6_centre_admin_dashboard.html':   { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '7_candidate_tracker.html':        { trainee:'own',    tutor:'open',   assessor:'open'   },
  '8_assignment_wording.html':       { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '9_assignment_submission.html':    { trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '10_tutor_assignment_marking.html':{ trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '13_grades_report.html':           { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '15_course_record.html':           { trainee:'refuse', tutor:'open',   assessor:'refuse' },
};
const MODES = [
  { name:'trainee',  seed:{ 'hub:t':'check-t', 'hub:booted':'trainee:check-t' },  q:'?t=check-t' },
  { name:'tutor',    seed:{ 'hub:k':'check-k', 'hub:booted':'tutor:check-k' },    q:'?k=check-k' },
  { name:'assessor', seed:{ 'hub:a':'check-a', 'hub:booted':'assessor:check-a' }, q:'?ak=check-a' },
];
const SETTINGS = JSON.stringify({ centreName:'Check Centre', centreNumber:'TR000', courseName:'CHECK', start:'2026-01-05', end:'2026-01-30' });
const REFUSED = /This room belongs to/i;
const NO_LINK = /Open your course link/i;

/* 1. the harness: copy, THEN neutralise. */
const dir = mkdtempSync(join(tmpdir(), 'lite-check-'));
/* Ramy's own C/17 course pages live in this repo too and are not Lite
   screens; they have no link, no rooms and nothing to assert. */
const NOT_A_SCREEN = new Set(['celta-c17-timetable.html']);
const files = readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f) && f !== 'check-screens.mjs');
for (const f of files) copyFileSync(join(HERE, f), join(dir, f));
const storePath = join(dir, 'hub-store.js');
const store = readFileSync(storePath, 'utf8');
const neutralised = store.replace(/((?:var|const|let)\s+URL\s*=\s*)(['"]).*?\2/, '$1"http://127.0.0.1:9/offline"');
if (neutralised === store) { console.error('Could not neutralise hub-store.js — refusing to run against the live store.'); process.exit(1); }
writeFileSync(storePath, neutralised);

/* 2. serve it. */
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const server = createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
  try {
    const body = readFileSync(join(dir, name));
    res.writeHead(200, { 'Content-Type': TYPES[extname(name)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}/`;

/* 3. sweep. */
const screens = files.filter(f => f.endsWith('.html') && !NOT_A_SCREEN.has(f)).sort((a, b) => {
  const n = s => (s === 'index.html' ? 0 : parseInt(s, 10) || 99);
  return n(a) - n(b) || a.localeCompare(b);
});
const browser = await chromium.launch();
const failures = [];
let loads = 0;

for (const mode of MODES) {
  for (const screen of screens) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => { const t = String(e); if (!/stopping this page on purpose/.test(t)) errs.push('page error: ' + t.slice(0, 110)); });
    page.on('console', c => { if (c.type() === 'error') { const t = c.text(); if (!/ERR_UNSAFE_PORT|Failed to load resource|net::|ERR_CONNECTION/.test(t)) errs.push('console: ' + t.slice(0, 110)); } });
    await page.addInitScript(([seed, settings]) => {
      for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
      localStorage.setItem('connect_course_settings', settings);
    }, [mode.seed, SETTINGS]);

    const where = `[${mode.name}] ${screen}`;
    try {
      await page.goto(base + screen + mode.q, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1300);
      loads++;
      const seen = await page.evaluate(() => ({
        appLeft: document.querySelectorAll('script[type="text/x-hub-app"]').length,
        text: (document.body.innerText || '').slice(0, 3000),
      }));
      if (seen.appLeft > 0) failures.push(`${where}: the page's own script never ran`);
      if (NO_LINK.test(seen.text)) failures.push(`${where}: gated as if no link was given`);
      const want = (ROOMS[screen] || {})[mode.name];
      const refused = REFUSED.test(seen.text);
      if (want === 'refuse' && !refused) failures.push(`${where}: OPEN — this room should refuse this link`);
      if ((want === 'open' || want === 'own') && refused) failures.push(`${where}: REFUSED — this room should open for this link`);
      if (want === 'own' && /yours to set/i.test(seen.text)) failures.push(`${where}: shows the TUTOR's view to a candidate`);
      for (const e of errs) failures.push(`${where}: ${e}`);
    } catch (e) {
      failures.push(`${where}: did not load — ${String(e).slice(0, 90)}`);
    }
    await ctx.close();
  }
}

await browser.close();
server.close();

console.log(`\nConnect Lite — ${loads} page loads, ${screens.length} screens x ${MODES.length} links.`);
if (!failures.length) { console.log('Nothing screamed.\n'); process.exit(0); }
console.log(`\n${failures.length} PROBLEM(S):\n`);
for (const f of failures) console.log('  ' + f);
console.log('');
process.exit(1);
