import fs from 'node:fs';
import { call, LIBRARY } from './st.mjs';
/* Slots that play a recording but whose TP point never names the track. The
   number has to come from the book page itself. */
const plan = JSON.parse(fs.readFileSync('tracks-plan.json', 'utf8'));
const have = new Set(Object.keys(plan));
const r = await call({ op:'course', key:LIBRARY });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
/* EVERY SET IN THE LIBRARY, not the four that happened to exist when this was
   written. Ramy, 5 Oct 2026: "apply to all four sets. Or all five sets." The
   intermediate set is coming; a hard-coded list would let it through unchecked.
   Sets sort s1, s2, ... s10 correctly because they are padded on read. */
const SETS = Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)));
const out = [];
for (const id of SETS)
  Object.keys(L[id].sessions).sort().forEach(x => L[id].sessions[x].slots.forEach((sl, i) => {
    if (have.has(`${id}|${x}|${i}`)) return;
    /* A VIDEO SLOT IS NOT A GAP. Set four's 1A.1 and 2A.1 play a BBC clip, not
       a track; the link rides on the pages line, and the stage still talks
       about "the recordings". Nothing is missing. */
    /* Set five writes it the other way round -- "(BBC Documentary: Top Gear,
       Nepal) / Ask the tutor to add the video." -- so look for the word, not
       for one layout of it. Three of its lessons are built on a BBC clip. */
    if (/^Video:/m.test(String(sl.pages || '')) || /\bvideo\b/i.test(String(sl.pages || ''))) return;
    const blob = [sl.pages, ...(sl.stages||[]).map(s => `${s.todo||''} ${s.avoid||''}`)].join(' ');
    /* "play the" caught "I can play the guitar", so say what is being played.
   And a stage that tells the candidate NOT to use the recording is not a slot
   missing one: "rather than building the stage round the recording". */
    const PLAYS = /\btrack\b|\baudio\b|listen again|\bplay (?:the (?:recording|track|audio|clip|video|first|second))\b|\brecording\b|tapescript/i;
    /* "play it" on its own means a game as often as a recording -- set five's
       speaking task says the listener "has to be able to play it afterwards" --
       so it counts only in a sentence that also names what is played. */
    const PLAYS_IT = /[^.]*\bplay it\b[^.]*\./i;
    const itIsAudio = (() => { const m = blob.match(PLAYS_IT);
      return m ? /track|audio|recording|\bclip\b|\bvideo\b|\blisten\b/i.test(m[0]) : false; })();
    const NEGATED = /(?:rather than|instead of|do not|don't|without|not)\s+[^.;]{0,60}\b(?:recording|track|audio)\b/i;
    if (!PLAYS.test(blob) && !itIsAudio) return;
    if (NEGATED.test(blob) && !/\btrack\s+\d|\bplay (?:it|the)\b/i.test(blob.replace(NEGATED, ''))) return;
    const why = (blob.match(/[^.]*\b(?:track|audio|listen again|play it|play the|recording|tapescript)[^.]*\.?/i) || [''])[0];
    out.push({ id, x, i, type: sl.type, page: String(sl.pages).split('\n')[0], why: why.trim().slice(0, 150) });
  }));
out.forEach(o => {
  console.log(`${o.id} ${o.x}·${o.i+1} [${o.type}]`);
  console.log(`      ${o.page}`);
  console.log(`      “…${o.why}”`);
});
console.log(`\n${out.length} slots play a recording with no track number in the TP point`);
fs.writeFileSync('audio-gaps.json', JSON.stringify(out, null, 1));
