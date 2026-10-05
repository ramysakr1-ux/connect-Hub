import { call } from './st.mjs';
/* A STAGE THAT NAMES A PAGE THE SLOT DOES NOT CARRY. 3A.1 told trainees to
   use "Page 127, 3.2" while its citation named only p. 24, so the page never
   reached the card or the printed day and the trainee was sent somewhere
   they had not been given. This finds every other instance: it reads the page
   numbers out of each stage's instructions and checks them against the pages
   actually attached to that slot. */
const r = await call({ op:'course', key:'5fade4f069614afd9b6e5a3a' });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
/* "pages 116 and 117", "A turns to page 139, B to 141, C to 144": the numbers
   after the first one carry no "page" of their own. So once a sentence has
   said "page", every plausible page number in it counts -- except the ones
   that belong to a track, an exercise or a worksheet. */
const SENT = /[^.;]*\bpages?\b[^.;]*/gi;
const NUM = /(?<!track |exercise |ex\. |worksheet |TP )\b(\d{1,3})\b(?!\.\d)/g;
let bad = 0, seen = 0;
for (const id of ['s1', 's2', 's3', 's4']) {
  const S = L[id];
  const out = [];
  Object.keys(S.sessions).sort().forEach(x => S.sessions[x].slots.forEach((sl, i) => {
    const have = new Set((sl.files || []).map(f => +f.page || +(String(f.name).match(/p\.\s*(\d{1,3})/) || [])[1]));
    (sl.stages || []).forEach(st => {
      const text = `${st.todo || ''} ${st.avoid || ''}`;
      const want = new Set();
      (text.match(SENT) || []).forEach(sent => {
        let m; NUM.lastIndex = 0;
        while ((m = NUM.exec(sent))) { const p = +m[1]; if (p >= 5 && p <= 260) want.add(p); }
      });
      want.forEach(p => {
        seen++;
        if (have.has(p)) return;
        bad++;
        out.push(`  ${x}·${i + 1} [${sl.type}] "${st.name}" → p.${p}   (has ${[...have].sort((a,b)=>a-b).join(', ') || 'none'})`);
      });
    });
  }));
  console.log(`===== ${id} ${out.length ? '' : '· nothing'}`);
  out.forEach(l => console.log(l));
}
console.log(`\n${seen} page references inside stages · ${bad} point at a page the slot does not carry`);
