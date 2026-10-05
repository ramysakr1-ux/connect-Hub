// READ ONLY. Prints course c4's settings. Writes nothing, anywhere.
// Written 27 Sep 2026 after a `course` read came back with an empty
// settings object and was written on top of -- this is the check that
// says whether the object survived.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true, error: 'non-JSON' }; }
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
const c4 = (list.result.courses || list.result).find((c) => c.id === 'c4');
console.log('ownerCourses name:', JSON.stringify(c4.name), ' trainees:', c4.trainees);

for (let i = 1; i <= 3; i++) {
  const r = await call({ op: 'course', key: c4.tutorKey });
  const s = r.result && r.result.settings;
  console.log(`read ${i}: ok=${r.ok} settings=` + (s == null ? 'MISSING' : `${Object.keys(s).length} fields ${JSON.stringify(Object.keys(s))}`));
  if (s && s.courseName) console.log(`         courseName=${JSON.stringify(s.courseName)} start=${JSON.stringify(s.start)} end=${JSON.stringify(s.end)}`);
  await new Promise((x) => setTimeout(x, 1500));
}

const roster = await call({ op: 'roster', key: c4.tutorKey });
console.log('roster:', roster.ok ? `${(roster.result.trainees || []).length} trainees` : 'FAIL ' + roster.error);
