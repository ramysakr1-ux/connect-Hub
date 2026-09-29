/* Connect Lite — reading a centre's timetable out of a sheet.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 29 Sep 2026: "is it possible to just import a timetable the same way
 * we do with the TP points, the same way we do with the observation tasks?"
 * A timetable already exists somewhere — in Excel, in Google Sheets, in a
 * Word table — and typing it a second time into Lite is the kind of work
 * nobody should be asked to do twice.
 *
 * WHAT IT TAKES. Rows, however they arrive:
 *   - pasted from Excel or Sheets, which is tab-separated text;
 *   - a comma-separated file;
 *   - a Word table, read as blocks by hub-docx.js and flattened to rows here.
 *
 * WHAT IT LOOKS FOR. A header row naming the columns, in any order and in
 * whatever words the centre uses (date / day, input, teaching practice,
 * notes). Without one it falls back to position: date, input 1, input 2,
 * notes. Anything it cannot place is reported rather than guessed at.
 *
 * WHAT IT DOES NOT TOUCH. The teaching practice column is read but never
 * allowed to overwrite what Lite works out from the course itself, unless the
 * sheet gives a practice number outright. The course knows its own practices;
 * a pasted sheet is a claim about them.
 *
 * MATCHING ROWS TO DAYS. By date when the row carries one it can read, and
 * by position otherwise — the first row is the first course day. That way a
 * sheet with "Mon", "Tue" and no dates still lands correctly, and a sheet
 * with real dates lands correctly even if it skips a day.
 */
(function (root) {
  'use strict';
  const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

  /* Tab-separated beats comma-separated: a timetable cell often contains a
     comma ("Reading, and a lexis focus") and almost never a tab. */
  function rowsFromText(text) {
    const lines = String(text || '').split(/\r?\n/).map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim());
    if (!lines.length) return [];
    const tabbed = lines.filter((l) => l.indexOf('\t') >= 0).length;
    if (tabbed >= Math.max(1, Math.floor(lines.length / 2))) return lines.map((l) => l.split('\t').map(clean));
    return lines.map((l) => splitCsv(l).map(clean));
  }

  /* A comma-separated line, honouring quotes, because a pasted cell may hold
     one ("Reading, then feedback"). */
  function splitCsv(line) {
    const out = []; let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out;
  }

  /* A Word table, as hub-docx.js hands it over. Several tables are read in
     order, so a timetable split one table per week still reads as one. */
  function rowsFromBlocks(blocks) {
    const out = [];
    (blocks || []).forEach((b) => {
      if (b.kind !== 'table') return;
      (b.rows || []).forEach((r) => out.push(r.map((cell) => clean((cell || []).join(' ')))));
    });
    if (out.length) return out;
    /* No table in the document: fall back to its paragraphs as one column. */
    return (blocks || []).filter((b) => b.kind === 'p' && b.text).map((b) => [b.text]);
  }

  const HEAD = {
    date: /^(date|day|when)\b/i,
    input1: /^(input ?1|input|session ?1|morning|am)\b/i,
    input2: /^(input ?2|session ?2|afternoon|pm)\b/i,
    tp: /^(tp|teaching practice|practice)\b/i,
    notes: /^(notes?|other|assignments?|out)\b/i
  };

  /* Which column is which. Returns null when the first row is not a header,
     and the caller then reads by position. */
  function headerMap(row) {
    const map = {}; let hits = 0;
    (row || []).forEach((cell, i) => {
      Object.keys(HEAD).forEach((k) => {
        if (map[k] === undefined && HEAD[k].test(cell)) { map[k] = i; hits++; }
      });
    });
    return hits >= 2 ? map : null;
  }

  const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  /* The date a row names, as a bare day. Reads 2026-10-05, 5/10/2026,
     "5 Oct", "Mon 5 Oct". A year is taken from the course when the cell does
     not carry one, because a timetable almost never writes the year. */
  function readDate(cell, year) {
    const s = clean(cell);
    if (!s) return '';
    let m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + '-' + m[2] + '-' + m[3];
    m = s.match(/\b(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?\b/);
    if (m) {
      const y = m[3] ? (m[3].length === 2 ? '20' + m[3] : m[3]) : String(year || new Date().getFullYear());
      return y + '-' + String(+m[2]).padStart(2, '0') + '-' + String(+m[1]).padStart(2, '0');
    }
    m = s.match(/\b(\d{1,2})\s*(?:st|nd|rd|th)?\s+([A-Za-z]{3,})\b/);
    if (m) {
      const mi = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
      if (mi >= 0) return String(year || new Date().getFullYear()) + '-' + String(mi + 1).padStart(2, '0') + '-' + String(+m[1]).padStart(2, '0');
    }
    m = s.match(/\b([A-Za-z]{3,})\s+(\d{1,2})\s*(?:st|nd|rd|th)?\b/);
    if (m) {
      const mi = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
      if (mi >= 0) return String(year || new Date().getFullYear()) + '-' + String(mi + 1).padStart(2, '0') + '-' + String(+m[2]).padStart(2, '0');
    }
    return '';
  }

  /* A practice number the sheet states outright ("TP 3", "TP3 · ABC"). */
  function readTp(cell) {
    const m = clean(cell).match(/\bTP\s*(\d{1,2})\b/i);
    return m ? +m[1] : null;
  }

  /* rows: from rowsFromText or rowsFromBlocks. days: the course's own days,
     [{date}], used to match by position when a row names no date.
     Returns { found: [{date, a, b, notes, tp}], unmatched: [rowText],
     byDate: n, byPosition: n, header: bool }. */
  function parse(rows, days, opts) {
    opts = opts || {};
    const year = opts.year || (days && days.length ? +String(days[0].date).slice(0, 4) : new Date().getFullYear());
    rows = (rows || []).filter((r) => r && r.some((c) => clean(c)));
    if (!rows.length) return { found: [], unmatched: [], byDate: 0, byPosition: 0, header: false };
    const map = headerMap(rows[0]);
    const body = map ? rows.slice(1) : rows;
    /* No header: is the first column dates? Sniff it rather than assume. A
       sheet whose first column is the morning session was losing that whole
       column, because the positional fallback threw column 0 away as a date
       that would not parse (found testing, 29 Sep 2026). */
    let col = map;
    if (!col) {
      const looksDated = body.filter((r) => readDate(r[0], year)).length;
      col = looksDated >= Math.max(1, Math.ceil(body.length / 2))
        ? { date: 0, input1: 1, input2: 2, tp: 3, notes: 4 }
        : { input1: 0, input2: 1, tp: 2, notes: 3 };
    }
    const found = [], unmatched = [];
    let byDate = 0, byPosition = 0, pos = 0;
    body.forEach((r) => {
      const at = (k) => (col[k] === undefined ? '' : clean(r[col[k]] || ''));
      const iso = readDate(at('date'), year);
      let date = '';
      if (iso && (!days || !days.length || days.some((d) => d.date === iso))) { date = iso; byDate++; }
      else if (days && days.length) {
        /* No readable date: the next course day in order. A row that is
           plainly a heading ("Week 2") consumes no day. */
        const whole = r.map(clean).filter(Boolean).join(' ');
        if (/^week\s*\d+/i.test(whole) && r.filter((c) => clean(c)).length <= 2) { unmatched.push(whole); return; }
        while (pos < days.length && found.some((f) => f.date === days[pos].date)) pos++;
        if (pos >= days.length) { unmatched.push(whole); return; }
        date = days[pos].date; pos++; byPosition++;
      }
      if (!date) { unmatched.push(r.map(clean).filter(Boolean).join(' ')); return; }
      const row = { date: date, a: at('input1'), b: at('input2'), notes: at('notes') };
      const tp = readTp(at('tp')) || readTp(r.map(clean).join(' '));
      if (tp) row.tp = tp;
      if (!row.a && !row.b && !row.notes && !row.tp) { unmatched.push(r.map(clean).filter(Boolean).join(' ')); return; }
      found.push(row);
    });
    return { found, unmatched, byDate, byPosition, header: !!map };
  }

  const api = { parse, rowsFromText, rowsFromBlocks, readDate, readTp, headerMap, splitCsv, clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubTimetableParse = api;
})(typeof window !== 'undefined' ? window : globalThis);
