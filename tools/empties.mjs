import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
/* EVERY SET IN THE LIBRARY, not the four that happened to exist when this was
   written. Ramy, 5 Oct 2026: "apply to all four sets. Or all five sets." The
   intermediate set is coming; a hard-coded list would let it through unchecked.
   Sets sort s1, s2, ... s10 correctly because they are padded on read. */
const SETS = Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)));
let n = 0;
for (const id of SETS)
  Object.keys(L[id].sessions).sort().forEach(x => L[id].sessions[x].slots.forEach((sl, i) => {
    const empty = (sl.stages || []).filter(st => !String(st.todo || '').trim());
    if (empty.length) { n += empty.length;
      console.log(`${id} ${x}·${i+1} [${sl.type}] ${empty.length}/${sl.stages.length} stages with no instructions: ${empty.map(e=>e.name).join(' · ')}`); }
  }));
console.log(`\n${n} stages carry a name and a clock but no instructions`);
