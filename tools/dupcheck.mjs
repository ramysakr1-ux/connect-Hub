import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
let dups = 0;
for (const id of Object.keys(L))
  Object.keys(L[id].sessions).forEach(sess => L[id].sessions[sess].slots.forEach((sl, i) => {
    const seen = new Set(), bad = [];
    (sl.files || []).forEach(f => { const k = `${f.src}|${f.page}`; if (seen.has(k)) bad.push(k); seen.add(k); });
    if (bad.length) { dups += bad.length; console.log(`  ${id} ${sess}·${i+1} carries ${bad.join(', ')} twice`); }
  }));
console.log(`${dups} duplicate page attachments`);
