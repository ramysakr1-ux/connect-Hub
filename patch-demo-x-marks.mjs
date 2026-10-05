/* Cambridge's fourth mark, on the demo: X, "Not Applicable at this stage",
   in the trainee's own column at Stage 2. c7 only — c6 has no Stage 2. */
import { readFileSync } from 'node:fs';
const HERE = '/Users/work/connect-Hub/';
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const WRITE = process.argv.includes('--write');
const call = async (b) => { for (let i = 0; i < 8; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r && (r.ok || r.error)) return r; } catch (e) {} await new Promise(res => setTimeout(res, 2500)); } throw new Error('store'); };
const cs = (await call({ op: 'ownerCourses', owner: OWNER })).result.courses;
const c7 = cs.find(c => c.id === 'c7');
if (!/^Demo — /.test(c7.name)) throw new Error('not a demo course');
const roster = await call({ op: 'roster', key: c7.tutorKey });
const people = Object.values(roster.result.trainees || {}).filter(Boolean);
for (const [ci, p] of people.entries()) {
  const got = await call({ op: 'get', key: c7.tutorKey, token: p.token, kind: 'celta5' });
  const C = (got.result && got.result.data) || got.result || null;
  if (!C || !C.stage2 || !C.stage2.marks) { console.log(p.name + ': no Stage 2 self-assessment'); continue; }
  const codes = Object.keys(C.stage2.marks);
  let n = 0;
  codes.forEach((code, i) => { if ((i + ci) % 7 === 0) { C.stage2.marks[code] = 'X'; n++; } });
  console.log(p.name + ': ' + n + ' of ' + codes.length + ' criteria marked X');
  if (WRITE) {
    const w = await call({ op: 'put', key: c7.tutorKey, token: p.token, kind: 'celta5', data: C });
    if (!w.ok) throw new Error('refused for ' + p.name + ': ' + w.error);
    const back = await call({ op: 'get', key: c7.tutorKey, token: p.token, kind: 'celta5' });
    const B = (back.result && back.result.data) || back.result || {};
    const xs = Object.values((B.stage2 || {}).marks || {}).filter(v => v === 'X').length;
    console.log('   read back: ' + xs + ' X marks');
  }
}
console.log(WRITE ? 'written.' : 'dry run — add --write.');
