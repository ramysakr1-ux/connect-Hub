// READ ONLY. What stage every candidate's four assignments are at, so the film
// can cut to somebody who is really at "Resubmission needed" instead of
// pretending a stubbed save moved them there. Writes nothing.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const courseId = process.argv[2] || 'c3';

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
const roster = await call({ op: 'roster', key: course.tutorKey });
const people = (roster.result && roster.result.trainees) || [];
console.log(`${courseId} — ${course.name}, ${people.length} candidates\n`);

for (const p of people) {
  const g = await call({ op: 'get', key: course.tutorKey, token: p.token, kind: 'assignments' });
  let d = g.ok ? g.result : null;
  if (d && d.data) d = d.data;
  if (!d || typeof d !== 'object') { console.log(`${p.name.padEnd(20)} —`); continue; }
  const bits = ['a1', 'a2', 'a3', 'a4', 'a5'].map((k) => {
    const s = d[k]; if (!s) return null;
    const dm = s.markers && s.markers.second ? '+2nd' : '';
    return `${k}:${s.stage || '?'}${dm}`;
  }).filter(Boolean);
  console.log(`${p.name.padEnd(20)} ${bits.join('  ')}`);
}
