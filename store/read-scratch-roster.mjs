// READ ONLY. What the scratch course's roster rows actually look like, so a
// reset can tell a removed trainee from a present one. Writes nothing.
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
const c = (list.result.courses || list.result).find((x) => x.name === 'Film scratch — not a demo');
if (!c) { console.log('no scratch course'); process.exit(0); }

const r = await call({ op: 'roster', key: c.tutorKey });
const people = (r.result && r.result.trainees) || [];
console.log(`${c.id}: roster returns ${people.length} rows\n`);
console.log('fields on a row:', people[0] ? Object.keys(people[0]).join(', ') : '(none)');
console.log('');
people.slice(0, 6).forEach((p) => {
  const flags = Object.entries(p)
    .filter(([k]) => !/token|name|group/.test(k))
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(' ');
  console.log(`  ${(p.name || '?').padEnd(22)} group=${JSON.stringify(p.group)} ${flags}`);
});
const names = people.map((p) => p.name);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
console.log(`\nduplicated names: ${dupes.length ? [...new Set(dupes)].join(', ') : 'none'}`);
