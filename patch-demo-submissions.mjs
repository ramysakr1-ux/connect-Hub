/* The demo's written assignments, in full (Ramy, 17 Oct 2026: "write the four
   assignments"). Puts the model answers from demo-submissions.mjs onto every
   trainee's existing submissions on the three demo courses, in place: only the
   submitted text, the picked items, the analysis tables and the declaration
   change. Marks, comments, feedback, markers and dates stay exactly as they are.
   Only courses named "Demo — ..." are touched; anything else is refused.

     node patch-demo-submissions.mjs            what it would change
     node patch-demo-submissions.mjs --write    write it, and read each back */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { demoSubmission, countWords } from './demo-submissions.mjs';
const HERE = '/Users/work/connect-Hub/';
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const WRITE = process.argv.includes('--write');
const call = async (b) => { for (let i = 0; i < 8; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r && (r.ok || r.error)) return r; } catch (e) {} await new Promise((res) => setTimeout(res, 2500)); } throw new Error('store'); };

const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['hub-shared.js', 'assignment-defaults.js']) { try { vm.runInContext(readFileSync(HERE + f, 'utf8'), ctx); } catch (e) {} }
const W = ctx.window.CONNECT_HUB_DEFAULT_WORDING;
const declAt = (code) => W[code].sections.findIndex((s) => s.type === 'declaration');

const courses = (await call({ op: 'ownerCourses', owner: OWNER })).result.courses.filter((c) => /^Demo — /.test(c.name));
let changed = 0;
for (const c of courses) {
  const roster = await call({ op: 'roster', key: c.tutorKey });
  const people = Object.values(roster.result.trainees || {}).filter(Boolean);
  let n = 0;
  for (const p of people) {
    const got = await call({ op: 'get', key: c.tutorKey, token: p.token, kind: 'assignments' });
    const A = (got.result && got.result.data) || got.result || null;
    if (!A || typeof A !== 'object') continue;
    let touched = 0;
    for (const code of ['fol', 'lrt', 'lsrt', 'lfc']) {
      const a = A[code]; if (!a) continue;
      const body = demoSubmission(code, String(p.group || '1'));
      for (const round of ['sub1', 'sub2']) {
        if (!a[round]) continue;
        a[round].picked = JSON.parse(JSON.stringify(body.picked));
        a[round].text = { ...body.text };
        a[round].fields = { ...body.fields };
        a[round].decl = { [declAt(code)]: { checks: [true, true, true], aiUsed: 'no', aiLink: '', aiPurpose: '' } };
        touched++;
      }
      if (a.draft && a.draft.text) { a.draft.picked = JSON.parse(JSON.stringify(body.picked)); a.draft.text = { ...body.text }; a.draft.fields = { ...body.fields }; }
    }
    if (!touched) continue;
    n++; changed += touched;
    if (WRITE) {
      const w = await call({ op: 'put', key: c.tutorKey, token: p.token, kind: 'assignments', data: A });
      if (!w.ok) throw new Error(`refused for ${p.name} on ${c.name}: ${w.error}`);
      const back = await call({ op: 'get', key: c.tutorKey, token: p.token, kind: 'assignments' });
      const B = (back.result && back.result.data) || back.result || {};
      const words = Object.keys(B).filter((k) => B[k] && B[k].sub1).map((k) => `${k} ${countWords(B[k].sub1)}`).join(', ');
      console.log(`   ${c.name} · ${p.name}: ${words}`);
    }
  }
  console.log(`${c.name}: ${n} of ${people.length} trainees have submissions to update`);
}
console.log(`${changed} submissions ${WRITE ? 'written.' : 'to change. Dry run — add --write.'}`);
