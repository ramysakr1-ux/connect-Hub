/* A slot that highlights target language and never clarifies it. Ramy, 5 Oct
   2026, on s5 3A.1: "Highlighting, there's no clarification here." READ ONLY. */
import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
const HI = /highlight|expos|notic/i, CL = /clarif|clarification|MPF|MFP|teach|present/i;
let n = 0;
for (const id of Object.keys(L).sort())
  for (const [nm, s] of Object.entries(L[id].sessions))
    (s.slots || []).forEach((sl, i) => {
      const names = (sl.stages || []).map(x => x.name);
      if (!names.some(x => HI.test(x)) || names.some(x => CL.test(x))) return;
      n++;
      console.log(`${id} ${nm}·${i + 1} [${sl.type}] ${names.length} stages — ${names.join(' / ')}`);
    });
console.log(`\n${n} slots highlight the language and never clarify it`);
