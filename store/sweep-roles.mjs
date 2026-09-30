/* Every store op, in every role, checking what each may and may not do. */
import { readFileSync } from 'node:fs';
const HERE = '/Users/work/connect-Hub/';
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const raw = async (b) => {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json();
      if (r && (r.ok || r.error)) return r;
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('store unreachable');
};

const { courses } = (await raw({ op: 'ownerCourses', owner: OWNER })).result;
const c5 = courses.find((c) => c.id === 'c5');
const roster = (await raw({ op: 'roster', key: c5.tutorKey })).result || {};
const tok = Object.values(roster.trainees || []).filter(Boolean)[0].token;
const reg = (await raw({ op: 'course', key: c5.tutorKey })).result.volunteers || { students: [] };
const vtok = (reg.students[0] || {}).token;
const other = (reg.students[1] || {}).name || 'NO-SECOND-STUDENT';
const ak = c5.assessorKey;

const fails = [];
const check = (what, ok) => { console.log((ok ? '  ok    ' : '  FAIL  ') + what); if (!ok) fails.push(what); };

console.log('READS');
const t = (await raw({ op: 'course', key: c5.tutorKey })).result || {};
check('tutor sees every course kind', ['settings', 'wording', 'observations', 'stream', 'grid', 'timetable', 'tppoints', 'volunteers', 'shared'].every((k) => k in t));
const cb = (await raw({ op: 'boot', token: tok })).result || {};
check('candidate gets NO volunteer register', !(cb.course || {}).volunteers);
check('candidate DOES get the shared materials', Array.isArray((cb.course || {}).shared));
const ab = (await raw({ op: 'boot', a: ak })).result || {};
check('assessor DOES get the register (Handbook 14.1)', !!(ab.course || {}).volunteers);
const vb = (await raw({ op: 'boot', v: vtok })).result || {};
check('volunteer gets their own row only', !!vb.volunteer && !('roster' in vb));
check('volunteer gets no wording, points or stream', !('wording' in (vb.course || {})) && !('tppoints' in (vb.course || {})) && !('stream' in (vb.course || {})));
check('volunteer never sees another student', !JSON.stringify(vb).includes(other));

console.log('WRITES');
check('assessor cannot write a course record', (await raw({ op: 'putCourse', a: ak, kind: 'settings', data: { x: 1 } })).ok === false);
check('candidate cannot write a course record', (await raw({ op: 'putCourse', token: tok, kind: 'settings', data: { x: 1 } })).ok === false);
check('volunteer cannot write anything', (await raw({ op: 'putCourse', v: vtok, kind: 'settings', data: { x: 1 } })).ok === false);
check('volunteer cannot share a material', (await raw({ op: 'shareMaterial', v: vtok, name: 'x', url: 'https://x.example/y' })).ok === false);
check('volunteer cannot call the course op', (await raw({ op: 'course', v: vtok })).ok === false);
check('volunteer cannot read the roster', (await raw({ op: 'roster', v: vtok })).ok === false);
check('unknown volunteer token refused', (await raw({ op: 'boot', v: 'c5-' + '0'.repeat(20) })).ok === false);
check('token naming a course that does not exist refused', (await raw({ op: 'boot', v: 'c999-' + 'a'.repeat(20) })).ok === false);

const probe = 'https://sweep.example/probe.pdf';
check('candidate CAN share a material', (await raw({ op: 'shareMaterial', token: tok, name: 'sweep probe', url: probe })).ok === true);
const sharedNow = (await raw({ op: 'course', key: c5.tutorKey })).result.shared || [];
const mine = sharedNow.find((x) => x && x.url === probe);
check('tutor CAN take it back', mine ? (await raw({ op: 'unshareMaterial', key: c5.tutorKey, id: mine.id })).ok === true : false);

console.log(fails.length ? ('\n' + fails.length + ' FAILURE(S)') : '\nEvery role behaved.');
