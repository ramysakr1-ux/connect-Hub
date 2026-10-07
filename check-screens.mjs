/**
 * Connect Lite — every screen, every link, in a real browser.
 *
 *   npm run check
 *
 * Lite has no build and no server, so this is the whole of its test suite. It
 * exists because two bugs got through everything else on 23 Sep 2026: the
 * trainee tracker handed a trainee the tutor's editable grid when the URL
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
  /* THE FRONT DOOR, not a room (3 Oct 2026). A tutor, assessor or volunteer who
     types lite.celtaconnect.com is SENT to their own room rather than refused
     at this one, so "refuse" stopped being the right answer here -- and the
     check kept reporting the redirect as a hole. `goes:` says where each link
     must land, which is a stronger test than refusing was: it catches a tutor
     being dropped in the trainee's room as well as a tutor being let in. */
  'index.html':                      { trainee:'open',
                                       tutor:'goes:5_tutor_dashboard.html',
                                       assessor:'goes:12_assessor_pack.html',
                                       volunteer:'goes:26_volunteer.html' },
  '1_trainee_plan_and_analysis.html':{ trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '2_trainee_self_evaluation.html':  { trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '3_tutor_feedback.html':           { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '5_tutor_dashboard.html':          { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '6_centre_admin_dashboard.html':   { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '7_candidate_tracker.html':        { trainee:'own',    tutor:'open',   assessor:'open'   },
  '8_assignment_wording.html':       { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '9_assignment_submission.html':    { trainee:'open',   tutor:'refuse', assessor:'refuse' },
  '10_tutor_assignment_marking.html':{ trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '13_grades_report.html':           { trainee:'refuse', tutor:'open',   assessor:'open'   },
  '15_course_record.html':           { trainee:'refuse', tutor:'open',   assessor:'refuse' },
  '16_final_report.html':            { trainee:'refuse', tutor:'open',   assessor:'open'   },
  /* Guidance, not a room: it holds no course data and takes no key, because
     somebody reads it BEFORE their link works, or because theirs did not. */
  '17_how_it_works.html':            { trainee:'open',   tutor:'open',   assessor:'open'   },
  /* The timetable and the teaching-practice points are the whole course's to
     read; each reader is shown their own share of them by the store. */
  '23_timetable.html':               { trainee:'open',   tutor:'open',   assessor:'open',   volunteer:'refuse' },
  '24_tp_points.html':               { trainee:'open',   tutor:'open',   assessor:'open',   volunteer:'refuse' },
  /* The volunteer register is the tutors' room; the assessor reads it, since
     Handbook 14.1 lists attendance registers for the visit. */
  /* The candidate agreement is the whole course's to read: the trainee signs
     it, a tutor fields questions about it, and the assessor is entitled to see
     what was signed. Only the trainee's own link can sign, which the page gates
     inside rather than at the door. */
  '29_candidate_agreement.html':     { trainee:'open',   tutor:'open',   assessor:'open',   volunteer:'refuse' },
  /* 8 Oct 2026: the pre-course task's answer key and the getting-to-know-you
     bank are the course's pages -- a trainee's to use, a tutor's and the
     assessor's to read, never a volunteer's. */
  '30_precourse_key.html':           { trainee:'open',   tutor:'open',   assessor:'open',   volunteer:'refuse' },
  '31_getting_to_know_you.html':     { trainee:'open',   tutor:'open',   assessor:'open',   volunteer:'refuse' },
  '25_volunteer_register.html':      { trainee:'refuse', tutor:'open',   assessor:'open',   volunteer:'refuse' },
  /* A volunteer student's own page, and the certificate printed from it. The
     certificate is also the tutor's, to print one from the register. */
  '26_volunteer.html':               { trainee:'refuse', tutor:'refuse', assessor:'refuse', volunteer:'open'   },
  '27_volunteer_certificate.html':   { trainee:'refuse', tutor:'open',   assessor:'refuse', volunteer:'open'   },
};
const MODES = [
  { name:'trainee',  seed:{ 'hub:t':'check-t', 'hub:booted':'trainee:check-t' },  q:'?t=check-t' },
  { name:'tutor',    seed:{ 'hub:k':'check-k', 'hub:booted':'tutor:check-k' },    q:'?k=check-k' },
  { name:'assessor', seed:{ 'hub:a':'check-a', 'hub:booted':'assessor:check-a' }, q:'?ak=check-a' },
  /* A volunteer student (30 Sep 2026): a member of the public on their own
     link. Their token carries its course, the way the store mints it. */
  { name:'volunteer', seed:{ 'hub:v':'check-volunteer', 'hub:booted':'volunteer:check-volunteer',
                             'hub:volunteer':JSON.stringify({ name:'Check Student', here:[] }) }, q:'?v=check-volunteer' },
];
const SETTINGS = JSON.stringify({ centreName:'Check Centre', centreNumber:'TR000', courseName:'CHECK', start:'2026-01-05', end:'2026-01-30' });
const REFUSED = /This room belongs to/i;
const NO_LINK = /Open your course link/i;

/* 1. the harness: copy, THEN neutralise. */
const dir = mkdtempSync(join(tmpdir(), 'lite-check-'));
/* Ramy's own C/17 course pages live in this repo too and are not Lite
   screens; they have no link, no rooms and nothing to assert. */
const NOT_A_SCREEN = new Set(['celta-c17-timetable.html']);
/* The manifests too (6 Oct 2026): the install hint asks the browser whether
   the app is installed, and the browser answers by fetching the page's
   manifest -- a 404 for it is a console error on every screen. */
const files = readdirSync(HERE).filter(f => /\.(html|js|css|webmanifest)$/.test(f) && f !== 'check-screens.mjs');
for (const f of files) copyFileSync(join(HERE, f), join(dir, f));
const storePath = join(dir, 'hub-store.js');
const store = readFileSync(storePath, 'utf8');
const neutralised = store.replace(/((?:var|const|let)\s+URL\s*=\s*)(['"]).*?\2/, '$1"http://127.0.0.1:9/offline"');
if (neutralised === store) { console.error('Could not neutralise hub-store.js — refusing to run against the live store.'); process.exit(1); }
writeFileSync(storePath, neutralised);

/* 2. serve it. */
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json' };
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
    /* Both throws are the page stopping itself on purpose: one refuses a link,
       the other leaves for the room that link belongs to. */
    page.on('pageerror', e => { const t = String(e);
      if (!/stopping this page on purpose|leaving for your own room/.test(t)) errs.push('page error: ' + t.slice(0, 110)); });
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
      if (want && want.slice(0, 5) === 'goes:') {
        const landed = decodeURIComponent(page.url().split('?')[0].split('/').pop() || '');
        if (landed !== want.slice(5)) failures.push(`${where}: went to ${landed || '(nowhere)'} — should go to ${want.slice(5)}`);
        for (const e of errs) failures.push(`${where}: ${e}`);
        await ctx.close();
        continue;
      }
      const refused = REFUSED.test(seen.text);
      if (want === 'refuse' && !refused) failures.push(`${where}: OPEN — this room should refuse this link`);
      if ((want === 'open' || want === 'own') && refused) failures.push(`${where}: REFUSED — this room should open for this link`);
      if (want === 'own' && /yours to set/i.test(seen.text)) failures.push(`${where}: shows the TUTOR's view to a trainee`);
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
