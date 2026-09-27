// Photograph the REAL screens, once, so the film shows Connect Lite rather
// than a drawing of it.
//
//   node film-standalone/capture.mjs
//
// Ramy, 27 Sep 2026: "I want a video that actually shows what Connect Lite
// looks like, not a made up one that looks nothing like what we built." He is
// right, and this is the answer: every frame of the film is a photograph of
// the live site, taken here, saved as a file. The film that plays them needs
// no store, no network and no live course — the capture happened once.
//
// It only ever READS. Nothing is clicked that writes, no key is written down:
// the keys come from the store at run time and stay in memory.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = join(HERE, '..');
const SHOTS = join(HERE, 'shots');
mkdirSync(SHOTS, { recursive: true });

const SITE = 'https://lite.celtaconnect.com/';
const STORE = (readFileSync(join(ROOT, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(ROOT, '.owner-key'), 'utf8').trim();

const call = async (b) => {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch { await new Promise((x) => setTimeout(x, 3000)); }
  }
  return { ok: false };
};

const list = await call({ op: 'ownerCourses', owner: OWNER });
const courses = list.result.courses || list.result;
const demo = courses.find((c) => c.id === 'c3');
const fin = courses.find((c) => c.id === 'c4');
const scratch = courses.find((c) => c.name === 'Film scratch — not a demo');
const roster = await call({ op: 'roster', key: demo.tutorKey });
const emily = ((roster.result && roster.result.trainees) || []).find((p) => p.name === 'Emily Carter');
const zeynep = ((roster.result && roster.result.trainees) || []).find((p) => p.name.startsWith('Zeyne'));
const sRoster = await call({ op: 'roster', key: scratch.tutorKey });
const marta = ((sRoster.result && sRoster.result.trainees) || []).find((p) => p.name === 'Marta Kowalczyk');
const ak = await call({ op: 'assessorLink', key: fin.tutorKey });

/* Every frame of the film, and the real address it is a photograph of.
   `do` runs in the page before the shot -- open a tab, scroll to a section --
   and never writes. */
const FRAMES = [
  ['01-owner',      `14_owner.html?o=${OWNER}`,                                    null],
  ['02-invite-tutor',`invite.html?k=${scratch.tutorKey}`,                           null],
  ['03-admin',      `6_centre_admin_dashboard.html?k=${scratch.tutorKey}`,          `tab:settings`],
  ['04-roster',     `6_centre_admin_dashboard.html?k=${scratch.tutorKey}`,          `tab:roster`],
  ['05-links',      `6_centre_admin_dashboard.html?k=${scratch.tutorKey}`,          `tab:roster|scroll:0`],
  ['06-wording',    `8_assignment_wording.html?k=${scratch.tutorKey}`,              null],
  ['07-wording-open',`8_assignment_wording.html?k=${scratch.tutorKey}`,             `click:#list button[data-a]`],
  ['08-invite-trainee',`invite.html?t=${emily.token}`,                              null],
  ['09-home',       `index.html?t=${emily.token}`,                                  null],
  ['10-plan',       `1_trainee_plan_and_analysis.html?t=${emily.token}`,            null],
  ['11-plan-stages',`1_trainee_plan_and_analysis.html?t=${emily.token}`,            `scroll:700`],
  ['12-analysis',   `1_trainee_plan_and_analysis.html?t=${emily.token}`,            `click:#laToggle`],
  ['13-selfeval',   `2_trainee_self_evaluation.html?t=${emily.token}`,              null],
  ['14-desk',       `5_tutor_dashboard.html?k=${demo.tutorKey}`,                    null],
  ['15-feedback',   `3_tutor_feedback.html?k=${demo.tutorKey}&trainee=${zeynep.token}`, null],
  ['16-feedback-2', `3_tutor_feedback.html?k=${demo.tutorKey}&trainee=${zeynep.token}`, `scroll:600`],
  ['17-returned',   `4_feedback_returned.html?t=${emily.token}`,                    null],
  ['18-assign',     `9_assignment_submission.html?t=${emily.token}&a=fol`,          null],
  ['19-assign-resub',`9_assignment_submission.html?t=${marta.token}&a=fol`,         `scroll:500`],
  ['20-marking',    `10_tutor_assignment_marking.html?k=${demo.tutorKey}&trainee=${zeynep.token}&a=fol`, null],
  ['21-invite-assessor',`invite.html?ak=${ak.result.key}`,                          null],
  ['22-pack',       `12_assessor_pack.html?ak=${ak.result.key}`,                    null],
  ['23-pack-2',     `12_assessor_pack.html?ak=${ak.result.key}`,                    `scroll:650`],
  ['24-grades',     `13_grades_report.html?k=${fin.tutorKey}`,                      null],
  ['25-final',      `16_final_report.html?ak=${ak.result.key}&id=Olivia%20Bennett`, null],
  ['26-offer',      `offer.html?k=${demo.tutorKey}`,                                null],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
let ok = 0, bad = [];
for (const [name, path, act] of FRAMES) {
  try {
    await page.goto(SITE + path, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2200);
    for (const step of (act || '').split('|').filter(Boolean)) {
      const [kind, arg] = [step.slice(0, step.indexOf(':')), step.slice(step.indexOf(':') + 1)];
      if (kind === 'tab') await page.click(`[data-tab="${arg}"]`).catch(() => {});
      if (kind === 'click') await page.click(arg).catch(() => {});
      if (kind === 'scroll') await page.evaluate((y) => window.scrollTo({ top: +y }), arg);
      await page.waitForTimeout(1400);
    }
    /* The sync pill and the install pill belong to a browser, not to a film. */
    await page.evaluate(() => {
      document.getElementById('hubSync')?.remove();
      document.getElementById('hubUnsaved')?.remove();
      document.querySelector('.dictbar')?.setAttribute('data-film', '1');
    });
    await page.screenshot({ path: join(SHOTS, name + '.png') });
    ok++; console.log(`  ${name}`);
  } catch (e) {
    bad.push(`${name}: ${String(e).slice(0, 70)}`);
    console.log(`  ${name}  FAILED`);
  }
}
await browser.close();
console.log(`\n${ok} of ${FRAMES.length} captured${bad.length ? '\n  ' + bad.join('\n  ') : ''}`);
