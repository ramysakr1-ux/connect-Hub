import { call, LIBRARY } from './st.mjs';
const r = await call({ op:'course', key:LIBRARY });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
let bad = 0, n = 0;
for (const id of Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)))) {
  const S = L[id]; let off = [];
  Object.keys(S.sessions).forEach(x => S.sessions[x].slots.forEach((sl, i) => {
    const st = sl.stages || []; if (!st.length) return;
    n++; const t = st.reduce((a, s) => a + (Number(s.minutes) || 0), 0);
    if (t !== 45) { off.push(`${x}·${i+1}=${t}`); bad++; }
  }));
  console.log(`${id}  ${off.length ? 'OFF: ' + off.join(' ') : 'every staged slot is 45 minutes'}`);
}
console.log(`\n${n} staged slots checked · ${bad} not 45`);
