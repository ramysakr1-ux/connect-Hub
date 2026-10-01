/**
 * Connect Lite — swap a demo course's cast.
 *
 *   node swap-cast.mjs <c6|c7|c4> [--write]
 *
 * Ramy, 1 Oct 2026: "let's make the course international as well, different
 * names from all over the world — 12 candidates from everywhere, including
 * Asia." The names live in demo-finished-data.mjs and the seed writes every
 * record against them, but a course already on the store holds the OLD people
 * with their tokens. This removes anybody who is not in the current cast, so
 * the seed can add the new twelve cleanly. Refuses any course that is not one
 * of the three demos.
 */
import { readFileSync } from 'node:fs';
import { CANDIDATES } from './demo-finished-data.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const WHICH = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!['c4', 'c6', 'c7'].includes(WHICH)) { console.log('name a demo course: c4, c6 or c7'); process.exit(1); }
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const call = async (b) => { for (let i = 0; i < 8; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r && (r.ok || r.error)) return r; } catch (e) {} await new Promise(res => setTimeout(res, 2500)); } throw new Error('the store would not answer'); };

const courses = (await call({ op: 'ownerCourses', owner: OWNER })).result.courses;
const course = courses.find(c => c.id === WHICH);
if (!course) { console.log(WHICH + ' is not in the store'); process.exit(1); }
if (!/^(Demo — |Finished course — )/.test(course.name)) { console.log(course.name + ' is not a demo — refusing'); process.exit(1); }

const want = new Set(CANDIDATES.map(c => c.name));
const roster = (await call({ op: 'roster', key: course.tutorKey })).result.trainees || {};
const people = Object.values(roster).filter(Boolean);
const stale = people.filter(p => !want.has(p.name));
console.log(`${WHICH} — ${course.name}`);
console.log(`  on the roster: ${people.length}; in the cast: ${people.length - stale.length}; to remove: ${stale.length}`);
stale.forEach(p => console.log('    ' + p.name));
if (!WRITE) { console.log('\ndry run — add --write'); process.exit(0); }

let gone = 0;
for (const p of stale) {
  /* Removing from a list read ONCE answers ok and leaves rows behind: the
     earlier removals shift the later tokens. Re-read each time. */
  const r = await call({ op: 'removeTrainee', key: course.tutorKey, token: p.token });
  if (r.ok) gone++; else console.log('    could not remove ' + p.name + ': ' + r.error);
}
const after = Object.values((await call({ op: 'roster', key: course.tutorKey })).result.trainees || {}).filter(Boolean);
console.log(`\nremoved ${gone}; the roster now holds ${after.length}: ${after.map(p => p.name).join(', ') || '(nobody)'}`);
