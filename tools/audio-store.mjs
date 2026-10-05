/* THE AUDIO AS THE STORE ACTUALLY HOLDS IT. tracks.mjs reads tracks-plan.json
   and only ever listed the sets that plan covers, so it showed s4 as empty
   when the store had six slots of audio on it. Read the record. */
import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
/* EVERY SET IN THE LIBRARY, not the four that happened to exist when this was
   written. Ramy, 5 Oct 2026: "apply to all four sets. Or all five sets." The
   intermediate set is coming; a hard-coded list would let it through unchecked.
   Sets sort s1, s2, ... s10 correctly because they are padded on read. */
const SETS = Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)));
let slots = 0, lines = 0, bad = [];
for (const id of SETS) {
  const rows = [];
  Object.keys(L[id].sessions).sort().forEach(x => L[id].sessions[x].slots.forEach((sl, i) => {
    const ls = String(sl.tracks || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (!ls.length) return;
    slots++; lines += ls.length;
    ls.forEach(l => { if (!/https?:\/\/\S+/.test(l)) bad.push(`${id} ${x}·${i+1}  ${l}`); });
    rows.push(`  ${x}·${i+1} [${String(sl.type).padEnd(19)}] ${ls.map(l => l.split('|')[0].trim()).join(', ')}`);
  }));
  console.log(`===== ${id}  ${rows.length} slots`); rows.forEach(r => console.log(r));
}
console.log(`\n${slots} slots carry audio · ${lines} track lines · ${bad.length} with no url`);
bad.forEach(b => console.log('  MISSING URL ' + b));
