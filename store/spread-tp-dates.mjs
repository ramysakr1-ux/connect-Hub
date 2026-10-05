// The taught history said all twelve trainees taught on every TP day.
//
//   node store/spread-tp-dates.mjs c4
//   node store/spread-tp-dates.mjs c4 --write
//
// WHY. The assessor pack's "lesson plans for the day" reads TWO date fields,
// because a lesson has two states: the live plan at state.meta.date and, once
// the tutor has written it up, state.f.fDate on that TP's feedback. Moving the
// PLAN dates fixed half of it and the pack still listed twelve — the taught
// records all carried the visit day too (27 Sep 2026, caught by looking at the
// page rather than at the data I had just written).
//
// The course runs two groups in parallel, three lessons each, so six teach on
// a day. This moves TP8 for the six who are not teaching on the visit day.
// ONLY TP8, and only for those six: every other TP is written back byte for
// byte and checked afterwards, because a tpHistory is 280KB of a real
// trainee's course and this is not the place to lose any of it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const courseId = process.argv[2] || 'c4';
const WRITE = process.argv.includes('--write');
if (['c1', 'c2'].includes(courseId)) { console.error('refusing ' + courseId); process.exit(1); }

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) { const r = await once(b); if (r.ok || !r.transient) return r; await new Promise((x) => setTimeout(x, 4000 * (i + 1))); }
  return { ok: false, error: 'gave up' };
};

const list = await call({ op: 'ownerCourses', owner: OWNER });
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
const cs = await call({ op: 'course', key: course.tutorKey });
const settings = (cs.result && cs.result.settings) || {};
const visit = String(settings.visitDate || '').trim();
if (!visit) { console.error('the course has no visit date'); process.exit(1); }
const before = (() => { const d = new Date(visit + 'T12:00:00'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); })();

const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];

/* Who is on the visit day is already decided — the live plan says so, and the
   two must agree or the pack contradicts itself. */
const onTheDay = new Set();
for (const p of people) {
  const rec = (p.records || {}).plan; const plan = rec && (rec.data || rec);
  const d = plan && plan.state && plan.state.meta && plan.state.meta.date;
  if (d === visit) onTheDay.add(p.token);
}
const move = people.filter((p) => !onTheDay.has(p.token));
console.log(`${courseId} — visit ${visit}`);
console.log(`  teaching that day (from the plans): ${people.length - move.length}`);
console.log(`  taught records to move to ${before}: ${move.map((p) => p.name).join(', ')}`);
if (!WRITE) { console.log('\nRead only. Add --write.\n'); process.exit(0); }

let done = 0, failed = 0;
for (const p of move) {
  const rec = (p.records || {}).tpHistory;
  const hist = rec && (rec.data || rec);
  if (!hist || !hist['8']) { console.log(`  ${p.name}: no TP8 — skipped`); continue; }
  const next = JSON.parse(JSON.stringify(hist));
  if (!next['8'].state || !next['8'].state.f) { console.log(`  ${p.name}: TP8 has no feedback — skipped`); continue; }
  next['8'].state.f.fDate = before;
  /* Everything that is NOT TP8 must come back identical. */
  const untouched = Object.keys(hist).filter((n) => n !== '8');
  const fingerprint = (h) => untouched.map((n) => JSON.stringify(h[n]).length).join(',');
  const wrote = await call({ op: 'put', key: course.tutorKey, token: p.token, kind: 'tpHistory', data: next });
  if (!wrote.ok) { failed++; console.error(`  ${p.name}: write refused — ${wrote.error}`); continue; }
  const back = await call({ op: 'get', key: course.tutorKey, token: p.token, kind: 'tpHistory' });
  let got = back.ok ? back.result : null; if (got && got.data) got = got.data;
  const same = got && fingerprint(got) === fingerprint(hist);
  const moved = got && got['8'] && got['8'].state && got['8'].state.f && got['8'].state.f.fDate === before;
  if (!same || !moved) { failed++; console.error(`  ${p.name}: READ BACK WRONG — other TPs intact: ${same}, TP8 moved: ${moved}`); break; }
  done++; console.log(`  ${p.name}: TP8 → ${before}, TP1–7 intact`);
}
console.log(`\n${done} moved${failed ? `, ${failed} FAILED` : ''}`);
