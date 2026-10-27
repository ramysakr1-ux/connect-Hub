import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
/* EVERY SET IN THE LIBRARY, not the four that happened to exist when this was
   written. Ramy, 5 Oct 2026: "apply to all four sets. Or all five sets." The
   intermediate set is coming; a hard-coded list would let it through unchecked.
   Sets sort s1, s2, ... s10 correctly because they are padded on read. */
const SETS = Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)));
/* TP-POINT-STANDARD.md: a full (TP 1-2) lesson has instructions under every stage and a
   guided (TP 3-4) lesson one short line; an outline (TP 5) lesson is the stage names only,
   and a bare (TP 6) lesson has no stages, so nothing is missing there. */
const level = (x, ses) => ses.scaffold || (parseInt(x, 10) <= 2 ? 'full' : parseInt(x, 10) <= 4 ? 'guided' : parseInt(x, 10) === 5 ? 'outline' : 'bare');
let n = 0, nameOnly = 0;
for (const id of SETS)
  Object.keys(L[id].sessions).sort().forEach(x => L[id].sessions[x].slots.forEach((sl, i) => {
    if (['outline', 'bare'].includes(level(x, L[id].sessions[x]))) { if (level(x, L[id].sessions[x]) === 'outline') nameOnly += (sl.stages || []).length; return; }
    const empty = (sl.stages || []).filter(st => !String(st.todo || '').trim());
    if (empty.length) { n += empty.length;
      console.log(`${id} ${x}·${i+1} [${sl.type}] ${empty.length}/${sl.stages.length} stages with no instructions: ${empty.map(e=>e.name).join(' · ')}`); }
  }));
console.log(`\n${n} stages in full and guided lessons carry a name but no instructions · ${nameOnly} outline stages are names only, by the standard`);
