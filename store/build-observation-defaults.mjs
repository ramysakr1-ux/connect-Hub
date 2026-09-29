// Turn Ramy's own task sheets into observation-defaults.js.
//
//   node store/build-observation-defaults.mjs ~/Downloads
//
// The fourteen observation tasks are HIS, written in Word, and they are the
// centre's to change afterwards — so they are imported once and become the
// default set a new course starts from, exactly as assignment-defaults.js is.
// Generated rather than hand-copied: 130 questions typed out by hand is 130
// chances to change one of his words by accident.
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { createRequire } from 'node:module';

/* The rules that turn a sheet into a task live in ONE file, shared with the
   wording editor's importer (screen 19) so a centre's own Word file reads
   the same way in the browser as Ramy's did here. Change them there. */
createRequire(import.meta.url)('../hub-observation-parse.js');   // registers globalThis.hubObservationParse
const { parse } = globalThis.hubObservationParse;

const SRC = process.argv[2] || join(process.env.HOME, 'Downloads');
const OUT = join(new URL('..', import.meta.url).pathname, 'observation-defaults.js');

const clean = (s) => s.replace(/\s+/g, ' ').trim();

/* The same document, with its tables kept. Word wraps a table in <w:tbl>, a
   row in <w:tr>, a cell in <w:tc>; docText above flattens all of that to
   lines, which is fine for a sheet made of paragraphs and wrong for one made
   of tables -- Live Task 2's stage map came out as the column names and the
   digits one to seven, and its tick-boxes as text (Ramy, 29 Sep 2026, seeing
   it at laptop width). This reader returns blocks: {kind:'p', text} or
   {kind:'table', rows:[[cellParagraphs...]]}. */
const docBlocks = (file) => {
  const xml = execSync(`unzip -p ${JSON.stringify(join(SRC, file))} word/document.xml`, { maxBuffer: 1 << 24 }).toString('utf8');
  const body = xml.slice(xml.indexOf('<w:body>'));
  const text = (frag) => frag.replace(/<w:tab[^>]*\/>/g, '\t').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
  const paras = (frag) => [...frag.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => clean(text(m[0]))).filter(Boolean);
  const out = [];
  const re = /<w:tbl>[\s\S]*?<\/w:tbl>|<w:p[ >][\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(body))) {
    const frag = m[0];
    if (frag.startsWith('<w:tbl>')) {
      const rows = [...frag.matchAll(/<w:tr[ >][\s\S]*?<\/w:tr>/g)].map((r) => [...r[0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)].map((c) => paras(c[0])));
      out.push({ kind: 'table', rows });
    } else {
      const t = clean(text(frag)); if (t) out.push({ kind: 'p', text: t });
    }
  }
  return out;
};

/* Peer and filmed sheets: one file each, every task in it. Live sheets: one
   file per demonstration class, in order -- Demo 1 is numbered questions,
   Task 2 is lettered parts (A-E) with tick-boxes, a stage map and prompt
   sets. Ramy, 29 Sep 2026: Demo 1 and Demo 2 are the live observation of
   experienced teachers -- each a demonstration class led by a tutor with the
   TP students (Handbook 10.1's phrase), two 45-minute lessons, ninety
   minutes; Demo 1 on a day the course admin picks, Demo 2 at the level swap.
   Titled in Cambridge's words; the centre's own subtitle stays. Demo 1's
   Word file carries a stale "watch the whole recording · 45 minutes" line
   from an older version; the parser does not carry it. */
const peer = parse(docBlocks('Peer_Observation_Tasks.docx'), 'peer').found;
const filmed = parse(docBlocks('Filmed_Observation_Tasks-2.docx'), 'filmed').found;
const live = ['Live_Teacher_Observations_Demo_1.docx', 'Live Observation Task 2 - Lesson Shape and Language Focus.docx']
  .flatMap((file, i) => parse(docBlocks(file), 'live', i).found);

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
