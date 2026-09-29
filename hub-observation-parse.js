/* Connect Lite — reading a centre's observation sheets into tasks.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * ONE parser, two readers. The generator (store/build-observation-defaults.mjs)
 * reads the centre's Word files in Node and ships the result as
 * observation-defaults.js; the wording editor (screen 19) reads a Word file
 * in the browser and offers to replace a group with what it finds. Until
 * 29 Sep 2026 those were two parsers, and the browser's knew nothing of
 * tables, tick-boxes, "After watching" or a sheet's preamble -- so a file
 * imported on a course came through flattened, the way Live Task 2 shipped
 * before that day's fixes. Now both call this file, and the generator's
 * output is the proof: regenerating with it reproduces the shipped sheets
 * byte for byte.
 *
 * Input: `blocks`, the document in order -- {kind:'p', text} for a paragraph,
 * {kind:'table', rows:[[cellParagraphs...]...]} for a table (each cell an
 * array of its paragraphs, empty paragraphs dropped, whitespace collapsed).
 * Output: {found:[task...], skipped:[title...]} in exactly the shapes the
 * sheet renders: peer grid/single/focus, filmed notes (+ after, brief), live
 * questions or parts (with blocks: text / tick / grid / set / items).
 */
(function (root) {
  'use strict';
  const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

  /* The flat form: one line per paragraph, table cells' paragraphs each on
     their own line, in document order. Several rules below read the sheet
     this way, exactly as the generator's original text reader did. */
  const flatLines = (blocks) => {
    const out = [];
    blocks.forEach((b) => {
      if (b.kind === 'p') { if (b.text) out.push(b.text); return; }
      (b.rows || []).forEach((r) => r.forEach((c) => c.forEach((t) => { if (t) out.push(t); })));
    });
    return out;
  };

  /* A part's body, block by block. Three kinds a sheet can render:
       text  -- a line of instruction
       tick  -- a run of box-marked options ("Tick the one that fits best");
                a plain line among them is a group label
       grid  -- a table whose first row is headings and whose other rows are
                numbered and empty: the candidate fills the cells in
       set   -- a one-column table headed by a short line: label, prompts, one answer
       items -- a one-column table with no heading: one answer per row
     Any other table is read cell by cell as the lines it contains. */
  const TICK = /^[☐□❑▯⬜]\s*/;
  function partBlocks(items) {
    const out = [];
    const pushText = (t) => { if (t) out.push({ kind: 'text', text: t }); };
    const lines = [];
    items.forEach((b) => {
      if (b.kind === 'p') { lines.push(b.text); return; }
      const rows = b.rows;
      const isGrid = rows.length >= 3 && rows[0].every((c) => c.length <= 1) && rows[0].filter((c) => c.length).length >= 2 &&
        rows.slice(1).every((r) => r.every((c, i) => c.length === 0 || (i === 0 && c.length === 1 && /^\d+$/.test(c[0]))));
      if (isGrid) { const head = rows[0].map((c) => c[0] || ''); if (!head[0]) head.shift(); lines.push({ grid: { head, rows: rows.length - 1 } }); return; }
      const oneCol = rows.every((r) => r.length === 1);
      const headingLike = (t) => typeof t === 'string' && t.length < 40 && !/[.?!:]$/.test(t);
      if (oneCol && rows.length >= 2 && rows[0][0].length === 1 && headingLike(rows[0][0][0])) {
        lines.push({ set: { label: rows[0][0][0], prompts: rows.slice(1).flatMap((r) => r[0]) } }); return;
      }
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
     wrap over the lines that follow. "After watching" is not a row. */
  function numbered(lines) {
    const skip = new Set(['Observation focus', 'Question', 'Your notes', 'Notes (all teachers)']);
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
  /* Everything a peer sheet says before its table: any preamble, then the
     "Before / During the lesson" instruction. Lines kept on their own lines. */
  function briefOf(lines) {
    const body = lines.join('\n');
    const m = body.match(/(Before the lesson|During the lesson)\s+([^\n]+(?:\n(?!#|\d{1,2}$|Teacher\s*\d)[^\n]+)*)/);   // stops at the table: a row number, or "Teacher N" on a focus sheet
    const marker = m ? clean(m[1] + ' — ' + m[2]) : '';
    const start = lines.findIndex((l, i) => i > 1 && l);           // 0 = tp head, 1 = title
    const stop = lines.findIndex((l) => /^(Before the lesson|During the lesson)\b/.test(l) || l === '#' || /^\d{1,2}$/.test(l));
    const pre = (start >= 0 && stop > start) ? lines.slice(start, stop).filter(Boolean) : [];
    return [pre.join('\n'), marker].filter(Boolean).join('\n');
  }

  /* Slice the document into tasks at the given paragraph boundary. */
  const splitAt = (blocks, isBoundary) => {
    const starts = [];
    blocks.forEach((b, i) => { if (b.kind === 'p' && isBoundary(b.text, blocks[i + 1])) starts.push(i); });
    return starts.map((s, k) => blocks.slice(s, k + 1 < starts.length ? starts[k + 1] : blocks.length));
  };

  function parsePeer(blocks) {
    const seen = new Set(), found = [];
    const HEAD = /^PEER OBSERVATION\s*·\s*/;
    splitAt(blocks, (t) => HEAD.test(t)).forEach((seg) => {
      const lines = flatLines(seg);
      lines[0] = lines[0].replace(HEAD, '');
      const head = lines[0].trim();
      const title = lines.slice(1).map((l) => l.trim()).find(Boolean);
      const tp = (head.match(/TP(\d)/) || [])[1];
      const variant = /TASK 2/.test(head) ? 2 : /TASK 1/.test(head) ? 1 : 0;
      const id = 'peer' + tp + (variant ? '-' + variant : '');
      if (!tp || seen.has(id)) return;          // TP1a and TP1b are one task, done twice
      seen.add(id);
      found.push({ id, tp: Number(tp), title, variant, brief: briefOf(lines), rows: numbered(lines),
        shape: tp === '6' ? 'single' : tp === '8' ? 'focus' : 'grid' });
    });
    return found;
  }

  function parseFilmed(blocks) {
    const found = [];
    const segs = splitAt(blocks, (t, next) => /^[A-Z][^\n]{0,60}$/.test(t) && next && next.kind === 'p' && /^Recording:/.test(next.text));
    segs.forEach((seg) => {
      const lines = flatLines(seg);
      const recording = (lines[1] || '').replace(/^Recording:.*?observation\s*(\d+)\s*$/i, 'Recording: observation $1');
      const ai = lines.findIndex((l) => /^After watching\b/i.test(l));
      const after = ai >= 0 ? lines.slice(ai + 1).map(clean).filter(Boolean) : [];
      const headAt = lines.findIndex((l) => l === '#' || /^Observation focus/.test(l) || /^Lesson:/.test(l));
      const brief = headAt > 2 ? lines.slice(2, headAt).filter((l) => !/^(Lesson|Level|Length|Date watched|Learners present):?$/i.test(l)).join('\n') : '';
      const t = { id: 'filmed' + (found.length + 1), title: lines[0], recording, ...(brief ? { brief } : {}), shape: 'notes', rows: numbered(lines), after };
      found.push(t);
    });
    return found;
  }

  /* One live sheet per file. Demo 1 is numbered questions; Task 2 is lettered
     parts. Each is a demonstration class -- two 45-minute lessons, 90 min. */
  function parseLive(blocks, index) {
    const lines = flatLines(blocks);
    if (!lines.length) return null;
    const qs = lines.filter((l) => /^\d{1,2}\.\s/.test(l)).map((l) => l.replace(/^\d{1,2}\.\s*/, ''));
    const parts = [];
    for (let j = 0; j < blocks.length; j++) {
      const m = blocks[j].kind === 'p' && blocks[j].text.match(/^([A-E])\.\s+(.+)$/);
      if (!m) continue;
      const body = [];
      for (let k = j + 1; k < blocks.length && !(blocks[k].kind === 'p' && /^[A-E]\.\s/.test(blocks[k].text)); k++) body.push(blocks[k]);
      const bl = partBlocks(body);
      parts.push({ letter: m[1], title: m[2], lines: bl.filter((b) => b.kind === 'text').map((b) => b.text), blocks: bl });
    }
    const num = (lines[0].match(/(\d+)\s*$/) || [])[1];
    const title = num ? 'Demonstration class ' + num : lines[0];
    const HDR = /^(Lesson|Level|Length|Date watched|Learners present|Teacher observed|Teacher|Date|Your name)\s*:?$/i;
    const firstQ = lines.findIndex((l) => /^(1\.\s|A\.\s)/.test(l));
    const brief = firstQ > 2 ? lines.slice(2, firstQ).filter((l) => !HDR.test(l) && !/^Recording:/i.test(l) && !/·.*minutes$/i.test(l)).join('\n') : '';
    const lastQ = qs.length ? lines.findIndex((l) => /^8\.\s/.test(l)) : -1;
    let after = [];
    if (lastQ >= 0) {
      const tail = lines.slice(lastQ + 1).filter((l) => l && !/^\(circle one\)$/i.test(l));
      const prompt = tail.findIndex((l) => /\?$/.test(l));
      if (prompt >= 0) after = [tail.slice(prompt).join(' ').replace(/\s{2,}/g, ' ')];
    }
    if (!qs.length && !parts.length) return null;
    const id = 'live' + (index + 1);
    return qs.length
      ? { id, title, sub: lines[1] || '', minutes: 90, ...(brief ? { brief } : {}), shape: 'questions', rows: qs, ...(after.length ? { after } : {}) }
      : { id, title, sub: lines[1] || '', minutes: 90, ...(brief ? { brief } : {}), shape: 'parts', parts };
  }

  /* group: 'peer' | 'filmed' | 'live'. A live file holds one sheet; `index`
     numbers it among the live sheets when several files are read in turn. */
  function parse(blocks, group, index) {
    if (group === 'peer') { const f = parsePeer(blocks); return { found: f, skipped: [] }; }
    if (group === 'filmed') { const f = parseFilmed(blocks); return { found: f, skipped: f.filter((t) => !t.rows.length).map((t) => t.title) }; }
    const t = parseLive(blocks, index || 0);
    return t ? { found: [t], skipped: [] } : { found: [], skipped: [flatLines(blocks)[0] || 'the file'] };
  }

  const api = { parse, flatLines, partBlocks, numbered, briefOf, clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubObservationParse = api;
})(typeof window !== 'undefined' ? window : globalThis);
