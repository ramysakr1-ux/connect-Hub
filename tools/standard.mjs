/* THE STANDARD ITSELF (TP-POINT-STANDARD.md, agreed 26 Oct 2026).
 *
 * The other checks look at the clock, the pages, the audio and the aims; none of them asks
 * whether a lesson follows the fade: TP 1-2 in full, TP 3-4 one line a stage, TP 5 the stage
 * names, TP 6 the aim and what to watch out for. This does, with the same rules as
 * standardIssues() in 28_tp_point_sets.html.
 */
import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
const words = t => String(t || '').trim().split(/\s+/).filter(Boolean).length;
const want = n => n <= 2 ? 'full' : n <= 4 ? 'guided' : n === 5 ? 'outline' : 'bare';
function issues(sl, scaffold) {
  const out = [], st = (sl.stages || []).filter(x => x && (x.name || x.todo));
  if (scaffold === 'full') {
    if (sl.aim && !/^by the end of the lesson/i.test(String(sl.aim).trim())) out.push('main aim form');
    if (sl.sub && !/^to\b/i.test(String(sl.sub).trim())) out.push('sub aim form');
    if (!sl.shape) out.push('no shape');
    if (st.some(x => !String(x.aim || '').trim())) out.push('stage without aim');
    if (st.some(x => !String(x.minutes || '').trim() && !/flexi|if[- ]time/i.test(x.name || ''))) out.push('stage without time');
  } else {
    if (words(sl.aim) > 2) out.push('main aim not one word');
    if (words(sl.sub) > 2) out.push('sub aim not one word');
    if (sl.shape) out.push('shape given');
    if (scaffold === 'guided') {
      if (st.some(x => String(x.minutes || '').trim() || String(x.interaction || '').trim())) out.push('times or interaction');
      if (st.some(x => String(x.todo || '').length > 160)) out.push('line too long');
    }
    if (scaffold === 'outline' && st.some(x => String(x.todo || '').trim() || String(x.minutes || '').trim() || String(x.interaction || '').trim())) out.push('outline has more than names');
    if (scaffold === 'bare' && st.length) out.push('bare has stages');
    if (scaffold === 'bare' && !String(sl.watch || '').trim()) out.push('bare without its watch-outs');
  }
  return out;
}
let off = 0;
for (const id of Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)))) {
  const S = L[id], tally = {}; let n = 0;
  for (const [k, ses] of Object.entries(S.sessions || {})) {
    const tpn = parseInt(k, 10);
    if (ses.scaffold !== want(tpn)) { const m = `level ${ses.scaffold} at TP ${tpn} (want ${want(tpn)})`; tally[m] = (tally[m] || 0) + 1; n++; }
    for (const sl of ses.slots || []) for (const x of issues(sl, want(tpn))) { n++; tally[x] = (tally[x] || 0) + 1; }
  }
  if (n) off++;
  console.log(`${id.padEnd(4)} ${String(S.book || S.name || '').slice(0, 34).padEnd(34)} ` +
    (n ? `${n} issues: ` + Object.entries(tally).map(([k, v]) => `${k} x${v}`).join(', ') : 'to the standard'));
}
console.log(`\n${off} sets off the standard`);
