/**
 * Prove a centre's next course starts from what its last one tagged — against
 * the LIVE store, on two courses created for the run and deleted after it.
 *
 *   node store/verify-seed.mjs
 *
 * Never touches c1 (C/18 2026), c2 (C/17 provisional grades) or c3 (the demo
 * course): it makes its own, and the last thing it does is delete them.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const KEEP = new Set(['c1', 'c2', 'c3']);

const call = async b => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON after 6 tries' };
};
let bad = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) bad++; };

const made = [];
const newCourse = async (name) => {
  const r = await call({ op: 'createCourse', owner: OWNER, name });
  if (!r.ok) throw new Error('could not create ' + name + ': ' + r.error);
  const c = r.result.course || r.result;
  if (KEEP.has(c.id)) throw new Error('refusing to touch ' + c.id);
  made.push(c.id);
  return c;
};
let cleaned = false;
const cleanup = async () => {
  if (cleaned) return; cleaned = true;
  for (const id of made) {
    if (KEEP.has(id)) continue;
    /* deleteCourse wants the id twice: once as `course`, once as `confirm`. */
    const r = await call({ op: 'deleteCourse', owner: OWNER, course: id, confirm: id });
    console.log(r.ok ? 'deleted ' + id : 'could NOT delete ' + id + ': ' + r.error);
  }
};
process.on('beforeExit', cleanup);

/* A model of the shape hub-crit-learn.js writes: one code, tagged often. */
const taught = {
  v: 1, n: 8, words: { warm: 6, group: 5, name: 6, answer: 4, wait: 4, minute: 3 },
  codes: { '1d': { n: 8, noN: 0, w: { warm: 6, group: 5, name: 6, answer: 4, wait: 4, minute: 3 }, no: {} },
           '2a': { n: 0, noN: 5, w: {}, no: { warm: 5, group: 4, name: 4 } } }
};

const CENTRE = 'ZZ999';
console.log('\nConnect Lite — does a centre\'s next course start from its last?\n');

const first = await newCourse('Seed test — the course that taught it');
const second = await newCourse('Seed test — the course that inherits');
console.log('made ' + made.join(' and '));

await call({ op: 'putCourse', key: first.tutorKey, kind: 'settings', data: { centreNumber: CENTRE, centreName: 'Seed Test Centre', courseName: 'C/1' } });
await call({ op: 'putCourse', key: first.tutorKey, kind: 'critLearn', data: taught });

console.log('1. a course of another centre gets nothing');
await call({ op: 'putCourse', key: second.tutorKey, kind: 'settings', data: { centreNumber: 'YY111', centreName: 'Somewhere Else', courseName: 'C/1' } });
const wrong = await call({ op: 'seedCritLearn', key: second.tutorKey });
ok(wrong.ok && wrong.result.seeded === false, 'refused: ' + ((wrong.result || {}).why || wrong.error));

console.log('2. the same centre gets the last course\'s counts, halved');
await call({ op: 'putCourse', key: second.tutorKey, kind: 'settings', data: { centreNumber: CENTRE, centreName: 'Seed Test Centre', courseName: 'C/2' } });
const seed = await call({ op: 'seedCritLearn', key: second.tutorKey });
ok(seed.ok && seed.result.seeded === true, 'seeded from ' + ((seed.result || {}).from || '(' + seed.error + ')'));
const m = (seed.result || {}).critLearn || {};
ok(m.n === 4, 'eight tagged points arrive as four (' + m.n + ')');
ok(((m.codes || {})['1d'] || {}).n === 4, '1d keeps its shape: ' + JSON.stringify((m.codes || {})['1d'] || {}).slice(0, 90));
ok(((m.codes || {})['2a'] || {}).noN === 3, 'and what the tutors turned down comes too (2a noN ' + (((m.codes || {})['2a'] || {}).noN) + ')');
ok(m.seed && m.seed.course === first.id, 'it records where it came from: ' + JSON.stringify(m.seed || null));

console.log('3. a tutor reading the course sees it');
const read = await call({ op: 'course', key: second.tutorKey });
ok((((read.result || {}).critLearn) || {}).n === 4, 'the tutor\'s own read has it');
const trainee = await call({ op: 'addTrainee', key: second.tutorKey, name: 'Seed Probe', group: '1' });
const asTrainee = await call({ op: 'course', t: trainee.result.token, token: trainee.result.token });
ok(!((asTrainee.result || {}).critLearn), 'and a trainee on the same course does not');

console.log('4. it seeds, it never overwrites');
const again = await call({ op: 'seedCritLearn', key: second.tutorKey });
ok(again.ok && again.result.seeded === false, 'a second ask is refused: ' + ((again.result || {}).why || again.error));

await cleanup();
console.log(bad ? '\n' + bad + ' failed.' : '\nA centre carries its reading of the criteria forward.');
process.exit(bad ? 1 : 0);
