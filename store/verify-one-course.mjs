/**
 * One link is one course. Proven against the LIVE store, on courses this
 * makes and deletes.
 *
 *   node store/verify-one-course.mjs
 *
 * Two rules, and a course has to break both to be two courses:
 *   HOW MANY  every candidate it has ever had is counted; purging one does not
 *             give the place back; 24 is the cap.
 *   HOW LONG  the dates are the centre's to set while nobody is on the course,
 *             and are sealed by the first candidate. After that the start
 *             cannot move and the end may only slip a few days.
 *
 * Never touches c1, c2, c3 or c4.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const KEEP = new Set(['c1', 'c2', 'c3', 'c4']);

const call = async b => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};
let bad = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) bad++; };

const made = [];
const newCourse = async name => {
  const r = await call({ op: 'createCourse', owner: OWNER, name });
  if (!r.ok) throw new Error(r.error);
  const c = r.result.course || r.result;
  if (KEEP.has(c.id)) throw new Error('refusing to touch ' + c.id);
  made.push(c.id); return c;
};
let cleaned = false;
const cleanup = async () => {
  if (cleaned) return; cleaned = true;
  for (const id of made) {
    if (KEEP.has(id)) continue;
    const r = await call({ op: 'deleteCourse', owner: OWNER, course: id, confirm: id });
    console.log(r.ok ? 'deleted ' + id : 'could NOT delete ' + id + ': ' + r.error);
  }
};
process.on('beforeExit', cleanup);

const settings = (start, end) => ({ start, end, centreName: 'Seat Test', centreNumber: 'ZZ998', courseName: 'C/1', tpCount: 8 });

console.log('\nConnect Lite — is one link one course?\n');
const c = await newCourse('Seat test — the window');

console.log('1. while nobody is on it, the dates are the centre’s');
let r = await call({ op: 'putCourse', key: c.tutorKey, kind: 'settings', data: settings('2026-10-05', '2026-10-30') });
ok(r.ok, 'a first set of dates is accepted');
r = await call({ op: 'putCourse', key: c.tutorKey, kind: 'settings', data: settings('2026-11-02', '2026-11-27') });
ok(r.ok, 'and changed again, because the course has not started' + (r.ok ? '' : ': ' + r.error));

console.log('\n2. the first candidate seals the window');
const first = await call({ op: 'addTrainee', key: c.tutorKey, name: 'Seat One', group: '1' });
ok(first.ok, 'a candidate is added' + (first.ok ? '' : ': ' + first.error));
r = await call({ op: 'putCourse', key: c.tutorKey, kind: 'settings', data: settings('2027-01-11', '2027-02-05') });
ok(!r.ok && /start date cannot be changed/.test(r.error || ''), 'a new start date is refused: ' + (r.error || 'IT WAS ACCEPTED'));
r = await call({ op: 'putCourse', key: c.tutorKey, kind: 'settings', data: settings('2026-11-02', '2027-02-05') });
ok(!r.ok && /new dates is a new course/.test(r.error || ''), 'a new end date is refused: ' + (r.error || 'IT WAS ACCEPTED'));
r = await call({ op: 'putCourse', key: c.tutorKey, kind: 'settings', data: settings('2026-11-02', '2026-12-04') });
ok(r.ok, 'a course running a week over is fine' + (r.ok ? '' : ': ' + r.error));

console.log('\n3. a place used is a place gone');
const seats = await call({ op: 'seats', owner: OWNER, course: c.id });
ok(seats.ok && seats.result.seats.ever === 1, 'one candidate counted: ' + JSON.stringify((seats.result || {}).seats));
const purge = await call({ op: 'purgeTrainee', key: c.tutorKey, token: first.result.token });
ok(purge.ok, 'the candidate is purged');
const after = await call({ op: 'seats', owner: OWNER, course: c.id });
ok(after.ok && after.result.seats.ever === 1, 'the count does not go back down: ' + after.result.seats.ever);

console.log('\n4. the cap is the cap');
await call({ op: 'seats', owner: OWNER, course: c.id, ever: 23 });
const twentyFour = await call({ op: 'addTrainee', key: c.tutorKey, name: 'Seat 24', group: '1' });
ok(twentyFour.ok, 'the twenty-fourth is accepted');
const twentyFive = await call({ op: 'addTrainee', key: c.tutorKey, name: 'Seat 25', group: '1' });
ok(!twentyFive.ok && /up to 24 candidates/.test(twentyFive.error || ''), 'the twenty-fifth is refused: ' + (twentyFive.error || 'IT WAS ACCEPTED'));
const paste = await call({ op: 'addTrainees', key: c.tutorKey, trainees: [{ name: 'A' }, { name: 'B' }] });
ok(!paste.ok && /up to 24 candidates/.test(paste.error || ''), 'and a pasted list cannot get round it: ' + (paste.error || 'IT WAS ACCEPTED'));

console.log('\n5. the owner can still put it right');
const raised = await call({ op: 'seats', owner: OWNER, course: c.id, cap: 30 });
ok(raised.ok && raised.result.seats.cap === 30, 'a cap can be raised for a centre that has paid for it');
ok(raised.result.seats.firstStart === '2026-11-02', 'and raising it does not unseal the dates: ' + JSON.stringify(raised.result.seats));
const now = await call({ op: 'addTrainee', key: c.tutorKey, name: 'Seat 25 again', group: '1' });
ok(now.ok, 'so the twenty-fifth goes in');

console.log('\n6. none of it touches reading');
const roster = await call({ op: 'roster', key: c.tutorKey });
ok(roster.ok, 'the roster still reads');
const course = await call({ op: 'course', key: c.tutorKey });
ok(course.ok && (course.result.settings || {}).end === '2026-12-04', 'and the settings are the ones that were allowed');

await cleanup();
console.log(bad ? '\n' + bad + ' failed.' : '\nOne link, one course.');
process.exit(bad ? 1 : 0);
