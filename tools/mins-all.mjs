import { call, LIBRARY } from './st.mjs';
/* TP-POINT-STANDARD.md: only a TP 1-2 (full) lesson carries times, and they add up to
   a 45-minute slot. TP 3-6 (guided, outline, bare) carry none, so no clock is checked
   there; a lesson that does carry times anyway (a set written to the old standard) is
   still held to 45. */
const r = await call({ op:'course', key:LIBRARY });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
const level = (x, ses) => ses.scaffold || (parseInt(x, 10) <= 2 ? 'full' : parseInt(x, 10) <= 4 ? 'guided' : parseInt(x, 10) === 5 ? 'outline' : 'bare');
let bad = 0, n = 0, bydesign = 0;
for (const id of Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)))) {
  const S = L[id]; let off = [];
  Object.keys(S.sessions).forEach(x => S.sessions[x].slots.forEach((sl, i) => {
    const st = sl.stages || []; if (!st.length) return;
    const timed = st.some(s => Number(s.minutes) > 0);
    if (!timed && level(x, S.sessions[x]) !== 'full') { bydesign++; return; }
    n++; const t = st.reduce((a, s) => a + (Number(s.minutes) || 0), 0);
    if (t !== 45) { off.push(`${x}·${i+1}=${t}`); bad++; }
  }));
  console.log(`${id}  ${off.length ? 'OFF: ' + off.join(' ') : 'every timed slot is 45 minutes'}`);
}
console.log(`\n${n} timed slots checked · ${bad} not 45 · ${bydesign} guided and outline slots carry no times, by the standard`);
