// A CELTA day does not have twelve people teaching on it.
//
//   node store/spread-plan-dates.mjs c4
//   node store/spread-plan-dates.mjs c4 --write
//
// WHY. The assessor pack builds "Lesson plans for the day" from the assessment
// date (Handbook 14.1: "lesson plans for trainees teaching in teaching
// practice on the day of the assessment"). The code filters on exactly that
// and is right. The DATA was wrong: every plan on the finished demo carried
// the same date, so the section listed all twelve trainees as teaching on
// one day. Ramy spotted it on 27 Sep 2026; it had been verified as working,
// which it was not — twelve plans is the tell, not the proof.
//
// The course runs two groups in parallel, and a TP day is six lessons: three
// in each group. So six trainees teach on the day of the visit and six on
// the day before it, which is what the timetable model says a day looks like.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const courseId = process.argv[2] || 'c4';
const WRITE = process.argv.includes('--write');
const NEVER = new Set(['c1', 'c2']);
if (NEVER.has(courseId)) { console.error('refusing ' + courseId); process.exit(1); }

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) { const r = await once(b); if (r.ok || !r.transient) return r; await new Promise((x) => setTimeout(x, 3000 * (i + 1))); }
  return { ok: false, error: 'gave up' };
};

const list = await call({ op: 'ownerCourses', owner: OWNER });
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
if (!course) { console.error('no ' + courseId); process.exit(1); }
const cs = await call({ op: 'course', key: course.tutorKey });
const settings = (cs.result && cs.result.settings) || {};
if (Object.keys(settings).length < 6) { console.error('short settings read — refusing'); process.exit(1); }

const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];

/* Whatever date the plans carry now is the day the course actually taught;
   keep it as the day of the visit rather than inventing one. */
const dates = {};
for (const p of people) {
  const rec = (p.records || {}).plan;
  const plan = rec && (rec.data || rec);
  const d = plan && plan.state && plan.state.meta && plan.state.meta.date;
  if (d) (dates[d] = dates[d] || []).push(p.name);
}
const day = Object.entries(dates).sort((a, b) => b[1].length - a[1].length)[0];
if (!day) { console.error('no plan carries a date'); process.exit(1); }
const visit = day[0];
const before = (() => { const d = new Date(visit + 'T12:00:00'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); })();

/* Three from each group teach on the day; the rest taught the day before.
   THE CANDIDATES THE ASSESSOR IS THERE TO OBSERVE GO FIRST. Handbook 14.2 has
   the assessor co-observing trainees in teaching practice during the visit,
   so a chosen trainee who teaches the day BEFORE cannot be observed — the
   pack would name three people to watch and offer plans for a day two of them
   are not teaching. The first pass at this put Marcus Ellery on the wrong day
   and the two halves of the pack disagreed (27 Sep 2026). */
const chosen = new Set(settings.assessorVisit || []);
const byGroup = {};
for (const p of people) (byGroup[p.group || '1'] = byGroup[p.group || '1'] || []).push(p);
const onTheDay = new Set();
for (const g of Object.keys(byGroup).sort()) {
  const inGroup = byGroup[g].slice().sort((a, b) => (chosen.has(b.token) ? 1 : 0) - (chosen.has(a.token) ? 1 : 0));
  inGroup.slice(0, 3).forEach((p) => onTheDay.add(p.token));
}
const stranded = people.filter((p) => chosen.has(p.token) && !onTheDay.has(p.token));
if (stranded.length) { console.error('observed but not teaching that day: ' + stranded.map((p) => p.name).join(', ')); process.exit(1); }

console.log(`${courseId} — ${course.name}`);
console.log(`  every plan currently carries ${visit} (${day[1].length} trainees)`);
console.log(`  visit day ${visit}: ${[...people].filter(p => onTheDay.has(p.token)).map(p => p.name).join(', ')}`);
console.log(`  moved to ${before}: ${[...people].filter(p => !onTheDay.has(p.token)).map(p => p.name).join(', ')}`);
if (!WRITE) { console.log('\nRead only. Add --write.\n'); process.exit(0); }

let moved = 0, kept = 0, failed = 0;
for (const p of people) {
  const rec = (p.records || {}).plan;
  const plan = rec && (rec.data || rec);
  if (!plan || !plan.state || !plan.state.meta) continue;
  if (onTheDay.has(p.token)) { kept++; continue; }
  const next = JSON.parse(JSON.stringify(plan));
  next.state.meta.date = before;
  const w = await call({ op: 'put', key: course.tutorKey, token: p.token, kind: 'plan', data: next });
  if (w.ok) moved++; else { failed++; console.error(`  ${p.name}: ${w.error}`); }
}
/* The visit is the day the plans are on, or the section is empty. */
if (settings.visitDate !== visit) {
  const w = await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: { ...settings, visitDate: visit } });
  console.log(w.ok ? `  visitDate set to ${visit}` : `  visitDate FAILED: ${w.error}`);
}

const back = await call({ op: 'roster', key: course.tutorKey });
const after = {};
for (const p of ((back.result && back.result.trainees) || [])) {
  const rec = (p.records || {}).plan; const plan = rec && (rec.data || rec);
  const d = plan && plan.state && plan.state.meta && plan.state.meta.date;
  if (d) (after[d] = after[d] || []).push(p.name);
}
console.log(`\n${moved} moved, ${kept} kept${failed ? `, ${failed} FAILED` : ''}`);
for (const [d, who] of Object.entries(after).sort()) console.log(`  ${d}  ${who.length} trainee(s)`);
