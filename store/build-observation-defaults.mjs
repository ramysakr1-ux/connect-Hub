// Turn Ramy's own task sheets into observation-defaults.js.
//
//   node store/build-observation-defaults.mjs ~/Downloads
//
// The fourteen observation tasks are HIS, written in Word, and they are the
// centre's to change afterwards — so they are imported once and become the
// default set a new course starts from, exactly as assignment-defaults.js is.
// Generated rather than hand-copied: 130 questions typed out by hand is 130
// chances to change one of his words by accident.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const SRC = process.argv[2] || join(process.env.HOME, 'Downloads');
const OUT = join(new URL('..', import.meta.url).pathname, 'observation-defaults.js');

/* Word keeps its text in word/document.xml; paragraphs are <w:p>. */
const docText = (file) => {
  const xml = execSync(`unzip -p ${JSON.stringify(join(SRC, file))} word/document.xml`, { maxBuffer: 1 << 24 }).toString('utf8');
  return xml.replace(/<\/w:p>/g, '\n').replace(/<w:tab[^>]*\/>/g, '\t').replace(/<[^>]+>/g, '');
};
const clean = (s) => s.replace(/\s+/g, ' ').trim();

/* A table row: a bare number on its own line, then the question, which may
   wrap over the lines that follow. */
function numbered(body) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  const skip = new Set(['Observation focus', 'Question', 'Your notes', 'Notes (all teachers)']);
  const out = [];
  for (let j = 0; j < lines.length; j++) {
    if (!/^\d{1,2}$/.test(lines[j]) || j + 1 >= lines.length) continue;
    let q = lines[j + 1];
    if (/^\d{1,2}$/.test(q) || q.startsWith('Teacher') || skip.has(q)) continue;
    let k = j + 2;
    while (k < lines.length && !/^\d{1,2}$/.test(lines[k]) && !lines[k].startsWith('Teacher') && !skip.has(lines[k])) { q += ' ' + lines[k]; k++; }
    out.push(clean(q));
  }
  return out;
}
/* Whatever the sheet says to do BEFORE or DURING the lesson. It is part of the
   task -- "find out what your peer is teaching" cannot be read afterwards. */
const briefOf = (body) => {
  const m = body.match(/(Before the lesson|During the lesson)\s+([^\n]+(?:\n(?!#|\d{1,2}$)[^\n]+)*)/);
  return m ? clean(m[1] + ' — ' + m[2]) : '';
};

const peerSrc = docText('Peer_Observation_Tasks.docx');
const seen = new Set();
const peer = [];
for (const part of peerSrc.split(/PEER OBSERVATION\s*·\s*/).slice(1)) {
  const head = part.split('\n')[0].trim();
  const title = part.split('\n').slice(1).map((l) => l.trim()).find(Boolean);
  const tp = (head.match(/TP(\d)/) || [])[1];
  const variant = /TASK 2/.test(head) ? 2 : /TASK 1/.test(head) ? 1 : 0;
  const id = 'peer' + tp + (variant ? '-' + variant : '');
  if (seen.has(id)) continue;           // TP1a and TP1b are one task, done twice
  seen.add(id);
  peer.push({ id, tp: Number(tp), title, variant, brief: briefOf(part), rows: numbered(part),
    /* TP6 is answered once across all three teachers; TP8 is a focus area per
       teacher rather than a set of questions; everything else is the grid. */
    shape: tp === '6' ? 'single' : tp === '8' ? 'focus' : 'grid' });
}

const filmedSrc = docText('Filmed_Observation_Tasks-2.docx');
const filmed = [];
for (const part of filmedSrc.split(/\n(?=[A-Z][^\n]{0,60}\nRecording:)/).slice(1)) {
  const lines = part.split('\n').map((l) => l.trim()).filter(Boolean);
  filmed.push({ id: 'filmed' + (filmed.length + 1), title: lines[0], recording: lines[1] || '',
    shape: 'notes', rows: numbered(part) });
}

const live = [];
for (const [file, id] of [['Live_Teacher_Observations_Demo_1.docx', 'live1'],
                          ['Live Observation Task 2 - Lesson Shape and Language Focus.docx', 'live2']]) {
  const t = docText(file);
  const lines = t.split('\n').map((l) => l.trim()).filter(Boolean);
  /* The two live sheets are written differently. Demo 1 is numbered questions;
     Task 2 is lettered PARTS (A, B, C), each with its own instruction and some
     with tick-boxes. Parsing only the numbered kind gave Task 2 zero questions,
     which would have shipped an empty task (27 Sep 2026). */
  const qs = t.split('\n').map(clean).filter((l) => /^\d{1,2}\.\s/.test(l)).map((l) => l.replace(/^\d{1,2}\.\s*/, ''));
  const parts = [];
  const raw = t.split('\n').map(clean);
  for (let j = 0; j < raw.length; j++) {
    const m = raw[j].match(/^([A-E])\.\s+(.+)$/);
    if (!m) continue;
    const body = [];
    for (let k = j + 1; k < raw.length && !/^[A-E]\.\s/.test(raw[k]); k++) if (raw[k]) body.push(raw[k]);
    parts.push({ letter: m[1], title: m[2], lines: body });
  }
  live.push(qs.length
    ? { id, title: lines[0], sub: lines[1] || '', shape: 'questions', rows: qs }
    : { id, title: lines[0], sub: lines[1] || '', shape: 'parts', parts });
}

const out = `/* Connect Lite — the observation tasks a course starts with.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * GENERATED from the centre's own Word sheets by
 * store/build-observation-defaults.mjs. Do not hand-edit: re-run it.
 * A centre changes these on its own course, not here — the same arrangement
 * as assignment-defaults.js.
 *
 * SHAPES, because the sheets are not all one thing:
 *   grid      focus rows, answered for Teacher 1, 2 and 3 (peer TP1-5, 7)
 *   single    questions answered once across all teachers  (peer TP6)
 *   focus     a focus area per teacher, no set questions    (peer TP8)
 *   notes     focus rows with one notes column              (filmed)
 *   questions numbered questions, open answers              (live)
 */
window.CONNECT_HUB_OBSERVATION_DEFAULTS = ${JSON.stringify({ peer, filmed, live }, null, 2)};
`;
writeFileSync(OUT, out, 'utf8');
const n = peer.length + filmed.length + live.length;
console.log(`${n} tasks written to observation-defaults.js`);
console.log(`  peer   ${peer.length}: ${peer.map((t) => t.id + '(' + t.shape + ',' + t.rows.length + ')').join(' ')}`);
console.log(`  filmed ${filmed.length}: ${filmed.map((t) => t.rows.length + ' rows').join(', ')}`);
console.log(`  live   ${live.length}: ${live.map((t) => t.shape === 'parts' ? (t.parts.length + ' parts') : (t.rows.length + ' questions')).join(', ')}`);
