import { call, readCourse, LIBRARY } from './st.mjs';
import { SETS } from './pagemap.mjs';
const TITLE = { s1:'Language Hub Elementary', s2:'Roadmap A2+', s3:'Straightforward Upper-Int', s4:'Speakout A1', s5:'Speakout B1' };
/* through readCourse: a read that answers ok with no record made this check
   crash halfway down the suite and look like a page fault. */
const L = (await readCourse(LIBRARY)).rec.set.library;
let bad = [];
const seen = new Map();
for (const id of Object.keys(SETS).sort((a, b) => (+a.slice(1)) - (+b.slice(1)))) {
  const S = L[id];
  let slotsWith = 0, slots = 0, pages = 0, days = 0;
  Object.keys(S.sessions).sort().forEach(x => {
    if (S.sessions[x].dayPdf && S.sessions[x].dayPdf.url) days++;
    S.sessions[x].slots.forEach((sl, i) => {
      slots++;
      const f = sl.files || [];
      if (f.length) slotsWith++;
      pages += f.length;
      f.forEach(one => {
        if (!one.url || !/drive\.google\.com/.test(one.url)) bad.push(`${id} ${x}·${i+1} bad url: ${one.name}`);
        const did = (String(one.url).match(/\/d\/([^/?]+)/) || [])[1];
        if (did) { const k = id + '|' + one.name;
          if (seen.has(did) && seen.get(did) !== k) { /* one page, two slots — expected */ }
          seen.set(did, k); }
      });
    });
  });
  console.log(`${id} ${TITLE[id].padEnd(26)} ${slotsWith}/${slots} slots have pages · ${pages} scans · ${days}/12 day PDFs`);
}
console.log(bad.length ? `\nPROBLEMS:\n  ${bad.join('\n  ')}` : '\nevery attached page has a Drive url');
