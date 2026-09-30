/* Today's screens at phone width. The one thing that cannot be seen from a
   laptop is content running off the right edge, which is how the TP points
   grid lost four columns. */
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
const c5 = courses.find((c) => c.id === 'c5');
const roster = (await raw({ op: 'roster', key: c5.tutorKey })).result || {};
const tok = Object.values(roster.trainees || []).filter(Boolean)[0].token;
const course = (await raw({ op: 'course', key: c5.tutorKey })).result || {};
const vtok = ((course.volunteers || {}).students || [{}])[0].token;

const BASE = 'https://lite.celtaconnect.com/';
const PAGES = [
  ['23_timetable', 'k=' + c5.tutorKey, 'timetable, tutor'],
  ['23_timetable', 't=' + tok, 'timetable, candidate'],
  ['24_tp_points', 'k=' + c5.tutorKey, 'TP points, tutor'],
  ['24_tp_points', 't=' + tok, 'TP points, candidate'],
  ['25_volunteer_register', 'k=' + c5.tutorKey, 'register'],
  ['26_volunteer', 'v=' + vtok, "student's own page"],
  ['27_volunteer_certificate', 'v=' + vtok, 'certificate'],
  ['1_trainee_plan_and_analysis', 't=' + tok, 'lesson plan (share switch)'],
];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: 'Europe/Istanbul' });
const page = await ctx.newPage();
const problems = [];
for (const [file, q, label] of PAGES) {
  await page.goto(BASE + file + '.html?' + q, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7500);
  const r = await page.evaluate(() => {
    const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const clipped = [...document.querySelectorAll('td, .day, .mat, .who, .seg, .sl, .cert, .fact')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 2).length;
    const tiny = [...document.querySelectorAll('button, a')]
      .filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.height < 22; }).length;
    return { over, clipped, tiny, h: document.body.scrollHeight };
  });
  const bad = r.over > 1 || r.clipped > 0;
  console.log('  ' + (bad ? 'FAIL  ' : 'ok    ') + label + '  (sideways ' + r.over + 'px, ' + r.clipped + ' clipped, ' + r.tiny + ' small tap targets, ' + r.h + 'px tall)');
  if (bad) problems.push(label + ': sideways ' + r.over + 'px, ' + r.clipped + ' clipped');
}
await browser.close();
console.log('\n' + (problems.length ? problems.length + ' PROBLEM(S)\n' + problems.map((p) => '  - ' + p).join('\n') : 'Nothing runs off the edge on a phone.'));
