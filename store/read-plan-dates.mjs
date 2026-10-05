// READ ONLY. What date a lesson plan carries, and where. Writes nothing.
// Needed before the assessor pack can list "the lesson plans for the day of
// the assessment" (Handbook 14.1) without guessing at a field name.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const courseId = process.argv[2] || 'c4';

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) {
    const r = await once(b);
    if (r.ok || !r.transient) return r;
    await new Promise((x) => setTimeout(x, 3000 * (i + 1)));
  }
  return { ok: false, error: 'gave up' };
};

const list = await call({ op: 'ownerCourses', owner: OWNER });
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];
console.log(`${courseId} — ${course.name}, ${people.length} trainees\n`);

const who = people[0];
for (const kind of ['plan', 'tpHistory']) {
  const g = await call({ op: 'get', key: course.tutorKey, token: who.token, kind });
  let d = g.ok ? g.result : null;
  if (d && d.data && !d.state && !d.status) d = d.data;   // the store wraps records in .data
  if (!d) { console.log(`${kind}: empty`); continue; }
  if (kind === 'plan') {
    const st = d.state || {};
    console.log(`plan: status=${d.status} label=${JSON.stringify(d.label)}`);
    console.log('  state keys: ' + Object.keys(st).join(', ').slice(0, 300));
    const walk = (o, path) => { if (!o || typeof o !== 'object') return;
      for (const k of Object.keys(o)) {
        if (/^f?date$/i.test(k) && typeof o[k] === 'string') console.log(`  ${path}.${k} = ${JSON.stringify(o[k])}`);
        else if (o[k] && typeof o[k] === 'object' && path.split('.').length < 4) walk(o[k], path + '.' + k);
      } };
    walk(st, 'state');
  } else {
    const keys = Object.keys(d);
    console.log(`tpHistory: ${keys.length} entries — ${keys.join(', ')}`);
    const one = d[keys[0]];
    const st = (one && one.state) || {};
    const f = st.f || {};
    console.log(`  first entry's date-ish fields: ` + [...Object.keys(st), ...Object.keys(f).map((k) => 'f.' + k)]
      .filter((k) => /date|day/i.test(k)).join(', '));
    if (f.fDate) console.log(`  f.fDate = ${JSON.stringify(f.fDate)}`);
    if (st.plan && st.plan.fDate) console.log(`  state.plan.fDate = ${JSON.stringify(st.plan.fDate)}`);
  }
}
