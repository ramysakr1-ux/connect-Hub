/* Does a saved recording stay listed when an older copy of the interview record is written over it? (18 Nov 2026, store v258)
 * Against the role check's scratch course only ("Role check — not a course"), never a real one. No audio is sent: the
 * recordings here are made-up ids in the record. Ends by leaving the record empty.
 *   node store/check-interview-keep.mjs
 */
import { readFileSync } from 'fs';
const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const raw = async (b) => {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b), signal: AbortSignal.timeout(90000) })).json();
      if (r && (r.ok || r.error)) return r;
    } catch (e) { if (i === 4) return { ok: false, error: 'no answer (' + String(e.message || e).slice(0, 40) + ')' }; }
    await new Promise((r) => setTimeout(r, 2000));
  }
};
const { courses } = (await raw({ op: 'ownerCourses', owner: OWNER })).result;
const sc = courses.find((c) => c.name === 'Role check — not a course' && !c.deleted);
if (!sc) { console.error('no scratch course: run node store/check-roles.mjs first'); process.exit(1); }
const roster = Object.values((await raw({ op: 'roster', key: sc.tutorKey })).result.trainees || {}).filter(Boolean);
const T1 = (roster.find((t) => t.name === 'Role Check One') || {}).token;
if (!T1) { console.error('no Role Check One on the scratch course'); process.exit(1); }
const put = (data) => raw({ op: 'put', token: T1, kind: 'interview', data });
const get = async () => ((await raw({ op: 'get', token: T1, kind: 'interview' })).result || {}).data || {};
const stu = (extra) => Object.assign({ name: 'Ana', answers: {}, heard: [], at: '2026-11-18T00:00:00.000Z' }, extra);
let bad = 0;
const say = (ok, what, got) => { if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what + (ok ? '' : '  -> ' + JSON.stringify(got).slice(0, 200))); };

await put({ students: {} });
await put({ students: { Ana: stu({ audio: [{ id: 'made-up-1', seconds: 5, transcript: 'Student: hello' }] }) } });
await put({ students: { Ana: stu({ answers: { q1: 'typed on the laptop' } }) } });                     // an older copy: no audio at all
let d = await get();
say(d.students && d.students.Ana && (d.students.Ana.audio || []).some((a) => a.id === 'made-up-1'), 'an older copy does not unlist the recording', d);
say(d.students && d.students.Ana && d.students.Ana.answers.q1 === 'typed on the laptop', 'and its own typing is saved', d);
await put({ students: { Ana: stu({ audio: [{ id: 'made-up-1', seconds: 5 }] }) } });                      // lists it, but never saw the transcript
d = await get();
say(((d.students.Ana.audio || [])[0] || {}).transcript === 'Student: hello', 'a transcript the store holds is kept', d);
await put({ students: { Ana: stu({ audio: [{ id: 'made-up-1', seconds: 5, transcript: '' }] }) } });      // emptied on purpose
d = await get();
say(((d.students.Ana.audio || [])[0] || {}).transcript === '', 'a transcript emptied on purpose stays empty', d);
await put({ students: {} });                                                                              // a copy from before the student was chosen
d = await get();
say(d.students && d.students.Ana && (d.students.Ana.audio || []).length === 1, 'a student with a recording is not dropped', d);
await put({ students: { Ana: stu({ audio: [{ id: 'made-up-1', seconds: 5 }] }) }, audioGone: ['made-up-1'] });   // deleted
d = await get();
say(!(d.students.Ana.audio || []).length, 'a deleted recording leaves the list', d);
await put({ students: { Ana: stu({ audio: [{ id: 'made-up-1', seconds: 5 }] }) } });                      // an older copy still lists it
d = await get();
say(!(d.students.Ana.audio || []).length && (d.audioGone || []).includes('made-up-1'), 'and an older copy cannot bring it back', d);
await put({ students: {}, audioGone: [] });
d = await get();
say(!Object.keys(d.students || {}).length, 'left empty', d);
console.log(bad ? '\n' + bad + ' failure(s)' : '\nInterview recordings stay listed.');
process.exit(bad ? 1 : 0);
