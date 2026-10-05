/* RAMY'S AIM RULE, 5 Oct 2026 — checks the library against it.
 *   TP1, TP2  main a full future-perfect sentence, sub a full infinitive one
 *   TP3       main one word, sub one word
 *   TP4       main one word, sub the candidate's
 *   TP5       main one word, sub one word
 *   TP6       main one word, sub the candidate's
 * The main aim's one word is the slot's own lesson type. */
import { readCourse, LIBRARY } from './st.mjs';
const L = (await readCourse(LIBRARY)).rec.set.library;
/* EVERY SET IN THE LIBRARY, not the four that happened to exist when this was
   written. Ramy, 5 Oct 2026: "apply to all four sets. Or all five sets." The
   intermediate set is coming; a hard-coded list would let it through unchecked.
   Sets sort s1, s2, ... s10 correctly because they are padded on read. */
const SETS = Object.keys(L).sort((a, b) => (+a.slice(1)) - (+b.slice(1)));
const WORDS = ['Grammar','Vocabulary','Functional language','Pronunciation','Reading','Listening','Speaking','Writing'];
/* PRONUNCIATION IS ITS OWN FAMILY. Lumping it with grammar and vocabulary made
   a clash of the commonest pairing in the book -- a grammar lesson whose second
   focus is the pronunciation of the form it teaches, which is what Ramy's own
   B1 documents do twice at TP3. Meaning, form and pronunciation are dimensions
   of one lesson, not three skills, so a language main aim may take a
   pronunciation sub; what it may not take is another language SKILL. */
const FAM = t => ['Reading','Listening'].includes(t) ? 'receptive'
  : ['Speaking','Writing'].includes(t) ? 'productive'
  : t === 'Pronunciation' ? 'pronunciation' : 'language';
const RULE = { 1:['full','full'], 2:['full','full'], 3:['word','word'],
               4:['word','theirs'], 5:['word','word'], 6:['word','theirs'] };
const bad = []; let seen = 0;
for (const id of SETS)
  Object.keys(L[id].sessions).sort().forEach(sess => L[id].sessions[sess].slots.forEach((sl, i) => {
    seen++;
    const tp = +sess[0], at = `${id} ${sess}·${i + 1}`;
    const [wa, ws] = RULE[tp], a = String(sl.aim || '').trim(), s = String(sl.sub || '').trim();
    if (wa === 'word' && a !== sl.type) bad.push(`${at} TP${tp}: main aim is "${a}", should be "${sl.type}"`);
    if (wa === 'full') {
      if (!/^By the end of the lesson/i.test(a)) bad.push(`${at} TP${tp}: main aim does not open "By the end of the lesson"`);
      else if (!/\bwill have\b/i.test(a)) bad.push(`${at} TP${tp}: main aim is not future perfect`);
    }
    if (ws === 'theirs' && s !== 'You decide') bad.push(`${at} TP${tp}: sub aim is "${s}", should be "You decide"`);
    if (ws === 'word') {
      if (!WORDS.includes(s)) bad.push(`${at} TP${tp}: sub aim is "${s}", not one of the seven words`);
      else if (FAM(s) === FAM(sl.type)) bad.push(`${at} TP${tp}: ${sl.type} / ${s} are the same family`);
    }
    if (ws === 'full' && !/^To\s/.test(s)) bad.push(`${at} TP${tp}: sub aim is not an infinitive — "${s}"`);
  }));
bad.forEach(b => console.log('  ✗ ' + b));
console.log(`\n${SETS.length} sets · ${seen} slots checked against the rule · ${bad.length} off it`);
