/* Two faults Ramy found by reading, so they stop being found by reading.
   1. A stage that merges highlighting and clarifying into one job.
   2. A tail: a slot whose last stage before the feedback is an extension, or a
      reading or writing stage on a slot that is not a reading or writing slot. */
import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
let merged = 0, tails = 0;
for (const id of Object.keys(L).sort())
  for (const [nm, s] of Object.entries(L[id].sessions))
    (s.slots || []).forEach((sl, i) => {
      const n = (sl.stages || []).map(x => x.name);
      const where = `${id} ${nm}·${i + 1} [${sl.type}]`;
      n.filter(x => /\band\b.*TL|highlight.*clarif|clarif.*highlight/i.test(x))
        .forEach(x => { merged++; console.log(`${where} merges two jobs in one stage: "${x}"`); });
      /* the last stage that is not feedback */
      const body = n.filter(x => !/feedback|correction/i.test(x));
      const last = body[body.length - 1] || '';
      const offType = new RegExp(sl.type.split(' ')[0], 'i');
      if (/extension/i.test(last) ||
          (/reading|writing|listening/i.test(last) && !offType.test(last))) {
        tails++; console.log(`${where} ends on "${last}" — a tail after the production`);
      }
    });
console.log(`\n${merged} stages merge highlighting and clarifying · ${tails} slots end on a tail`);
