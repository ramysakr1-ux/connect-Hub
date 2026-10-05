/* Every screen, on the LIVE site, in every role, against the real store.
   check-screens.mjs runs offline against a neutralised store; this is the
   other half: real data, real boots, real console. */
import { readFileSync } from 'node:fs';
import { chromium } from '/Users/work/connect-Hub/node_modules/playwright/index.mjs';

const HERE = '/Users/work/connect-Hub/';
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const raw = async (b) => {
  for (let i = 0; i < 5; i++) {
    try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r && (r.ok || r.error)) return r; } catch (e) {}
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('store unreachable');
};
const { courses } = (await raw({ op: 'ownerCourses', owner: OWNER })).result;
/* The scratch course, by NAME: it is made and deleted as needed, so its id
   is whatever slot was free (it was c5 for a week, then c3). The film's
   scratch-course.mjs names it; SCRATCH=<id> overrides. (2 Oct 2026) */
const c5 = courses.find((c) => process.env.SCRATCH ? c.id === process.env.SCRATCH : c.name === 'Film scratch \u2014 not a demo');
if (!c5) { console.error('No scratch course: node store/scratch-course.mjs --make, then --reset --one'); process.exit(1); }
const roster = (await raw({ op: 'roster', key: c5.tutorKey })).result || {};
const people = Object.values(roster.trainees || []).filter(Boolean);
const tok = people[0].token;
const course = (await raw({ op: 'course', key: c5.tutorKey })).result || {};
const vtok = ((course.volunteers || {}).students || [{}])[0].token;

const BASE = 'https://lite.celtaconnect.com/';
const ROLES = [
  { name: 'tutor',     q: 'k=' + c5.tutorKey,    screens: ['5_tutor_dashboard','6_centre_admin_dashboard','7_candidate_tracker','8_assignment_wording','13_grades_report','15_course_record','16_final_report','19_observation_wording','21_tp_grid','22_fail_letter','23_timetable','24_tp_points','25_volunteer_register','12_assessor_pack','3_tutor_feedback','10_tutor_assignment_marking','11_assignment_record','18_observation_tasks','20_celta5'] },
  { name: 'trainee', q: 't=' + tok,            screens: ['index','1_trainee_plan_and_analysis','2_trainee_self_evaluation','4_feedback_returned','9_assignment_submission','18_observation_tasks','20_celta5','21_tp_grid','23_timetable','24_tp_points','7_candidate_tracker'] },
  { name: 'assessor',  q: 'ak=' + c5.assessorKey, screens: ['12_assessor_pack','7_candidate_tracker','13_grades_report','16_final_report','23_timetable','24_tp_points','25_volunteer_register','20_celta5'] },
  { name: 'volunteer', q: 'v=' + vtok,           screens: ['26_volunteer','27_volunteer_certificate'] },
];

const problems = [];
const browser = await chromium.launch();
for (const role of ROLES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'Europe/Istanbul' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => { const t = String(e); if (!/stopping this page on purpose/.test(t)) errs.push(t.slice(0, 120)); });
  page.on('console', (m) => { if (m.type() === 'error') { const t = m.text(); if (!/favicon|manifest|404/i.test(t)) errs.push('console: ' + t.slice(0, 120)); } });
  console.log('\n' + role.name.toUpperCase());
  for (const s of role.screens) {
    errs.length = 0;
    try {
      await page.goto(BASE + s + '.html?' + role.q, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(6500);
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      const blank = body.trim().length < 40;
      const gated = /This room belongs to|no longer opens|not on the course|Open your course link/i.test(body);
      const bad = errs.slice();
      if (blank) bad.push('page is blank');
      console.log('  ' + (bad.length ? 'FAIL  ' : gated ? 'gated ' : 'ok    ') + s + (bad.length ? ' :: ' + bad.slice(0, 2).join(' | ') : ''));
      if (bad.length) problems.push(role.name + ' ' + s + ': ' + bad.slice(0, 2).join(' | '));
    } catch (e) {
      console.log('  FAIL  ' + s + ' :: ' + String(e).slice(0, 100));
      problems.push(role.name + ' ' + s + ': ' + String(e).slice(0, 100));
    }
  }
  await ctx.close();
}
await browser.close();
console.log('\n' + (problems.length ? problems.length + ' PROBLEM(S)\n' + problems.map((p) => '  - ' + p).join('\n') : 'No problems on the live site.'));
