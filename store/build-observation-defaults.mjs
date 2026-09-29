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

/* A part's body, block by block. Three kinds a sheet can render:
     text  -- a line of instruction
     tick  -- a run of box-marked options ("Tick the one that fits best");
              a plain line among them is a group label (Language lessons /
              Skills lessons)
     grid  -- a table whose first row is headings and whose other rows are
              numbered and empty: the candidate fills the cells in
   Any other table is read cell by cell as the lines it contains. */
const TICK = /^[\u2610\u25A1\u2751\u25AF\u2B1C]\s*/;
function partBlocks(items) {
  const out = [];
  const pushText = (t) => { if (t) out.push({ kind: 'text', text: t }); };
  const lines = [];
  items.forEach((b) => {
    if (b.kind === 'p') { lines.push(b.text); return; }
    const rows = b.rows;
    /* The heading row's first cell is empty: it sits over the row numbers. */
    const isGrid = rows.length >= 3 && rows[0].every((c) => c.length <= 1) && rows[0].filter((c) => c.length).length >= 2 &&
      rows.slice(1).every((r) => r.every((c, i) => c.length === 0 || (i === 0 && c.length === 1 && /^\d+$/.test(c[0]))));
    if (isGrid) { const head = rows[0].map((c) => c[0] || ''); if (!head[0]) head.shift(); lines.push({ grid: { head, rows: rows.length - 1 } }); return; }
    /* A one-column table is the document grouping its prompts. If its first
       row is a short heading ("If it was a LANGUAGE lesson") the table is a
       SET: that label, the prompts under it, one answer for the set. If not,
       each row is its own thing to write -- ITEMS, one answer each (part E:
       one stage, one thing, one question). Ramy, 29 Sep 2026, on part D at
       phone width: eight prompts feeding one box meant scrolling back a screen
       to re-read the question. */
    const oneCol = rows.every((r) => r.length === 1);
    const headingLike = (t) => typeof t === 'string' && t.length < 40 && !/[.?!:]$/.test(t);
    if (oneCol && rows.length >= 2 && rows[0][0].length === 1 && headingLike(rows[0][0][0])) {
      lines.push({ set: { label: rows[0][0][0], prompts: rows.slice(1).flatMap((r) => r[0]) } }); return;
    }
    /* an item's paragraphs stay on their own lines (the sheet renders a
       newline as a line break): "One question to ask the teacher afterwards"
       and "Ask it. Write the answer here." are two lines, not one sentence */
    if (oneCol && rows.length >= 2) { lines.push({ items: rows.map((r) => r[0].join('\n')) }); return; }
    rows.forEach((r) => r.forEach((c) => c.forEach((t) => lines.push(t))));
  });
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (typeof l !== 'string') {
      if (l.grid) out.push({ kind: 'grid', head: l.grid.head, rows: l.grid.rows });
      else if (l.set) out.push({ kind: 'set', label: l.set.label, prompts: l.set.prompts });
      else if (l.items) out.push({ kind: 'items', items: l.items });
      continue;
    }
    if (!TICK.test(l)) { pushText(l); continue; }
    /* a tick block: options, with any un-ticked line between them a group label */
    const groups = [{ label: '', options: [] }];
    const prev = out[out.length - 1];
    if (prev && prev.kind === 'text' && !/[.?!]$/.test(prev.text) && prev.text.length < 40) { groups[0].label = prev.text; out.pop(); }
    let j = i;
    for (; j < lines.length; j++) {
      const t = lines[j]; if (typeof t !== 'string') break;
      if (TICK.test(t)) groups[groups.length - 1].options.push(clean(t.replace(TICK, '')));
      else if (!/[.?!]$/.test(t) && t.length < 40 && j + 1 < lines.length && typeof lines[j + 1] === 'string' && TICK.test(lines[j + 1])) groups.push({ label: t, options: [] });
      else break;
    }
    out.push({ kind: 'tick', groups: groups.filter((g) => g.options.length) });
    i = j - 1;
  }
  return out;
}

/* A table row: a bare number on its own line, then the question, which may
   wrap over the lines that follow. */
function numbered(body) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  const skip = new Set(['Observation focus', 'Question', 'Your notes', 'Notes (all teachers)']);
  /* "After watching" heads the reflection questions that follow the table. It
     is not a row and it does not belong on the end of the last one -- which is
     where every filmed sheet had been putting it, along with both questions
     under it (found 29 Sep 2026, looking at the rendered sheet). */
  const STOP = /^After watching\b/i;
  const out = [];
  for (let j = 0; j < lines.length; j++) {
    if (!/^\d{1,2}$/.test(lines[j]) || j + 1 >= lines.length) continue;
    let q = lines[j + 1];
    if (/^\d{1,2}$/.test(q) || q.startsWith('Teacher') || skip.has(q)) continue;
    let k = j + 2;
    while (k < lines.length && !/^\d{1,2}$/.test(lines[k]) && !lines[k].startsWith('Teacher') && !skip.has(lines[k]) && !STOP.test(lines[k])) { q += ' ' + lines[k]; k++; }
    out.push(clean(q));
  }
  return out;
}
/* Whatever the sheet says to do BEFORE or DURING the lesson. It is part of the
   task -- "find out what your peer is teaching" cannot be read afterwards. */
/* The brief is everything the sheet says before its table: the "Before /
   During the lesson" instruction, and any preamble above it (TP6 opens with
   "Feedback helps consolidate..." and eight examples, which used to be
   dropped -- second audit, 29 Sep 2026). Lines are kept on their own lines. */
const briefOf = (body) => {
  const m = body.match(/(Before the lesson|During the lesson)\s+([^\n]+(?:\n(?!#|\d{1,2}$)[^\n]+)*)/);
  const marker = m ? clean(m[1] + ' \u2014 ' + m[2]) : '';
  const lines = body.split('\n').map((l) => l.trim());
  const start = lines.findIndex((l, i) => i > 1 && l);           // 0 = tp head, 1 = title
  const stop = lines.findIndex((l) => /^(Before the lesson|During the lesson)\b/.test(l) || l === '#' || /^\d{1,2}$/.test(l));
  const pre = (start >= 0 && stop > start) ? lines.slice(start, stop).filter(Boolean) : [];
  return [pre.join('\n'), marker].filter(Boolean).join('\n');
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
  /* The first sheet named its teacher by her clothes ("female teacher in
     yellow"); Ramy, 27 Sep 2026: "remove the female teacher in yellow part".
     Every recording line reads the same way now. */
  const recording = (lines[1] || '').replace(/^Recording:.*?observation\s*(\d+)\s*$/i, 'Recording: observation $1');
  /* Everything under "After watching" is a reflection question, one per line,
     asked once at the end of the sheet rather than against a row. */
  const ai = lines.findIndex((l) => /^After watching\b/i.test(l));
  const after = ai >= 0 ? lines.slice(ai + 1).map(clean).filter(Boolean) : [];
  /* Anything between the Recording line and the table head is the sheet's
     brief -- Filmed 4 opens with a boxed "Before you watch" that was dropped
     (second audit, 29 Sep 2026). */
  const headAt = lines.findIndex((l) => l === '#' || /^Observation focus/.test(l) || /^Lesson:/.test(l));
  const brief = headAt > 2 ? lines.slice(2, headAt).filter((l) => !/^(Lesson|Level|Length|Date watched|Learners present):?$/i.test(l)).join('\n') : '';
  filmed.push({ id: 'filmed' + (filmed.length + 1), title: lines[0], recording, ...(brief ? { brief } : {}),
    shape: 'notes', rows: numbered(part), after });
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
  const blocks = docBlocks(file);
  for (let j = 0; j < blocks.length; j++) {
    const m = blocks[j].kind === 'p' && blocks[j].text.match(/^([A-E])\.\s+(.+)$/);
    if (!m) continue;
    const body = [];
    for (let k = j + 1; k < blocks.length && !(blocks[k].kind === 'p' && /^[A-E]\.\s/.test(blocks[k].text)); k++) body.push(blocks[k]);
    const bl = partBlocks(body);
    /* `lines` stays for anything that still reads the flat form */
    parts.push({ letter: m[1], title: m[2], lines: bl.filter((b) => b.kind === 'text').map((b) => b.text), blocks: bl });
  }
  /* The two documents title themselves differently ("Live Teacher
     Observations Demo 1", "CELTA  ·  LIVE OBSERVATION TASK 2"). Ramy, 27 Sep
     2026: "normalise the live task 2 title". Both read the same way now;
     the number is the document's own. */
  const num = (lines[0].match(/(\d+)\s*$/) || [])[1];
  const title = num ? 'Live Teacher Observation ' + num : lines[0];
  /* Live teaching is 90 minutes at each level (Ramy, 29 Sep 2026), so the two
     live sheets carry their own length. The candidate can still change it on
     the sheet; this is what it starts at, and it means the three live hours
     Handbook 10.1 requires are on the record without anyone typing them. The
     filmed recordings vary course to course, so they carry none. */
  /* The brief: what the sheet says before its first question or part, minus
     the title, the sub-title and the header labels (Live Task 2 opens "In Task
     1 you watched how a teacher runs a room..." and a "Before the lesson"
     block; both were dropped). Demo 1 closes with a circle-one prompt after
     question 8, which was dropped too -- it is carried as an after-prompt. */
  const HDR = /^(Lesson|Level|Length|Date watched|Learners present|Teacher observed|Teacher|Date|Your name)\s*:?$/i;
  const firstQ = lines.findIndex((l) => /^(1\.\s|A\.\s)/.test(l));
  const brief = firstQ > 2 ? lines.slice(2, firstQ).filter((l) => !HDR.test(l) && !/^Recording:/i.test(l) && !/\u00b7.*minutes$/i.test(l)).join('\n') : '';
  const lastQ = qs.length ? lines.findIndex((l) => /^8\.\s/.test(l)) : -1;
  let after = [];
  if (lastQ >= 0) {
    const tail = lines.slice(lastQ + 1).filter((l) => l && !/^\(circle one\)$/i.test(l));
    const prompt = tail.findIndex((l) => /\?$/.test(l));
    if (prompt >= 0) after = [tail.slice(prompt).join(' ').replace(/\s{2,}/g, ' ')];
  }
  live.push(qs.length
    ? { id, title, sub: lines[1] || '', minutes: 90, ...(brief ? { brief } : {}), shape: 'questions', rows: qs, ...(after.length ? { after } : {}) }
    : { id, title, sub: lines[1] || '', minutes: 90, ...(brief ? { brief } : {}), shape: 'parts', parts });
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
