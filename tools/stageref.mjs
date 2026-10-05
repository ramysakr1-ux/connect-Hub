import { call, LIBRARY } from './st.mjs';
/* A STAGE THAT NAMES A PAGE THE SLOT DOES NOT CARRY. 3A.1 told candidates to
   use "Page 127, 3.2" while its citation named only p. 24, so the page never
   reached the card or the printed day and the candidate was sent somewhere
   they had not been given. This finds every other instance: it reads the page
   numbers out of each stage's instructions and checks them against the pages
   actually attached to that slot. */
const r = await call({ op:'course', key:LIBRARY });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
/* EVERY SET IN THE LIBRARY, not the four that happened to exist when this was
   written. Ramy, 5 Oct 2026: "apply to all four sets. Or all five sets." The
   intermediate set is coming; a hard-coded list would let it through unchecked.
   Sets sort s1, s2, ... s10 correctly because they are padded on read. */
const SETS = Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)));
/* "pages 116 and 117", "A turns to page 139, B to 141, C to 144": the numbers
   after the first one carry no "page" of their own. So once a sentence has
   said "page", every plausible page number in it counts -- except the ones
   that belong to a track, an exercise or a worksheet. */
const SENT = /[^.;]*\bpages?\b[^.;]*/gi;
/* i: "Exercise 6" was read as page 6.
   (?<![\d.]) : the tail of a decimal is not a page. "Track 4.8" was read as
   page 8 and "replay 5.04" as page 5 -- the lookahead only guarded the head of
   the number, never the half after the dot.
   item/question/activity/line/number : "items 2, 3, 7 and 8" was four pages. */
const NUM = /(?<!track |exercise |ex\. |worksheet |TP |item |items |question |questions |activity |activities |line |number )(?<![\d.])\b(\d{1,3})\b(?!\.\d)/gi;
let bad = 0, seen = 0, tbRef = 0, warned = 0;
/* The warning is often in the NEXT sentence -- "...sends students to pages 142
   and 146. Those are not on your card." -- so look at the sentence holding the
   number AND the one after it. */
const warnsOff = (text, p) => {
  const sents = text.split(/(?<=[.;])\s+/);
  return sents.some((sent, i) => new RegExp(`\\b${p}\\b`).test(sent) &&
    /not on (your|the) card|is not on|are not on|neither page is on|skips from|do not send|don't send|leave (it|that|the roleplay|them|the \\w+) alone|not been given|which (?:is|are) not|is not there|not in (?:the|that) (?:file|book)/i
      .test(sent + ' ' + (sents[i + 1] || '')));
};
/* must match TB_WORKSHEETS_FROM in pagemap.mjs */
const TB_FROM = { s3: 211 };
const tbNote = (text, p, id) => {
  const at = text.search(new RegExp(`\\b${p}\\b`));
  if (at < 0) return false;
  const before = text.slice(0, at);
  /* "notes on page 198" -- pagemap strips "(notes p. 198)" from a citation for
     the same reason: a photocopiable's answer notes live in the Teacher's Book
     and are not the learner's page. */
  if (/\bnotes?\s+(?:on\s+)?(?:pp?\.|pages?)\s*$/i.test(before)) return !(TB_FROM[id] && p >= TB_FROM[id]);
  const book = (before.match(/teacher.?s book|workbook|student.?s book/gi) || []).pop();
  return !!book && /teacher/i.test(book) && !(TB_FROM[id] && p >= TB_FROM[id]);
};
for (const id of SETS) {
  const S = L[id];
  const out = [];
  Object.keys(S.sessions).sort().forEach(x => S.sessions[x].slots.forEach((sl, i) => {
    const have = new Set((sl.files || []).map(f => +f.page || +(String(f.name).match(/p\.\s*(\d{1,3})/) || [])[1]));
    (sl.stages || []).forEach(st => {
      const raw = `${st.todo || ''} ${st.avoid || ''}`;
      /* SENT splits on the full stop, so "Track 4.8" became a sentence that
         began "8 ..." and the 8 was read as a page -- the decimal guard on NUM
         never saw the dot because the dot had been used as the split. Take
         every decimal out first. Then take out list runs: "items 2, 3, 7 and
         8" was four pages, because the lookbehind only ever guarded the first
         number in the run. */
      const text = raw
        .replace(/\b\d{1,3}\.\d{1,3}\b/g, ' \u2039dec\u203a ')
        .replace(/\b(?:items?|questions?|exercises?|lines?|activities|activity|tracks?|numbers?)\s+\d{1,3}(?:\s*(?:,|and|&|to|\u2013|-)\s*\d{1,3})*/gi,
                 ' \u2039list\u203a ');
      const want = new Set();
      (text.match(SENT) || []).forEach(sent => {
        let m; NUM.lastIndex = 0;
        while ((m = NUM.exec(sent))) { const p = +m[1]; if (p >= 5 && p <= 260) want.add(p); }
      });
      want.forEach(p => {
        seen++;
        if (have.has(p)) return;
        /* THE TEACHER'S BOOK'S OWN NOTES ARE NOT A GAP. pagemap drops a
           Teacher's Book page below the worksheet line on purpose -- those are
           the tutor's language notes and the photocopiables' answer notes, and
           the imprint licenses copies of pp. 211-258 only. A stage may still
           send the candidate to them ("the Teacher's Book page 6 has the
           explanations"); that is guidance, not a page the card owes them. */
        if (tbNote(text, p, id)) { tbRef++; return; }
        /* A STAGE THAT SAYS "THAT PAGE IS NOT ON YOUR CARD" IS DOING THE RIGHT
           THING. Four of day six's stages name a page precisely to tell the
           candidate not to go there -- the book's own exercise points at a
           bank page the card does not carry, and the instruction heads them
           off. Flagging that as a gap punishes the warning. */
        if (warnsOff(text, p)) { warned++; return; }
        bad++;
        out.push(`  ${x}·${i + 1} [${sl.type}] "${st.name}" → p.${p}   (has ${[...have].sort((a,b)=>a-b).join(', ') || 'none'})`);
      });
    });
  }));
  console.log(`===== ${id} ${out.length ? '' : '· nothing'}`);
  out.forEach(l => console.log(l));
}
console.log(`\n${seen} page references inside stages · ${bad} point at a page the slot does not carry`
  + `\n${tbRef} name a Teacher's Book page that stays off the card by design`
  + `\n${warned} name an off-card page in order to warn the candidate away from it`);
