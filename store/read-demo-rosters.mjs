// READ ONLY. Who is on the demo courses, so the film's scenes can name a
// real candidate instead of one from the spec's imagination. Writes nothing.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

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
for (const id of ['c3', 'c4']) {
  const c = (list.result.courses || list.result).find((x) => x.id === id);
  const r = await call({ op: 'roster', key: c.tutorKey });
  const people = (r.result && r.result.trainees) || [];
  console.log(`\n${id} — ${c.name} (${people.length})`);
  people.forEach((p) => {
    const kinds = Object.keys(p.records || {});
    console.log(`  ${(p.name || '?').padEnd(22)} group ${String(p.group || '?').padEnd(3)} records: ${kinds.length ? kinds.join(', ') : '(none listed)'}`);
  });
}
