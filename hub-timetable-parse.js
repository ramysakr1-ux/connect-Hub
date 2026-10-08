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
 *   - a Word table, read as blocks by hub-docx.js and flattened to rows here;
 *   - a Google Sheets link (8 Oct 2026), fetched as the sheet's CSV export.
 *     Google answers a page from any address for a sheet shared "anyone with
 *     the link", and refuses a private one -- the page says how to share it.
 *
 * THE WEEK GRID (8 Oct 2026). Ramy's own C/18 sheet is not a row per day: each
 * week is a row of dates across Monday to Friday, with labelled rows under it
 * ("Input 11:00", "TP 15:00", "Assignments"). gridRows() turns that into the
 * row-per-day shape before anything else reads it, so a centre's grid lands
 * the same as a list.
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

  /* CSV as Google exports it: a quoted cell may hold line breaks, so the
     text cannot be split into lines first the way rowsFromText does. */
  function csvRows(text) {
    const rows = []; let row = [], cur = '', q = false;
    const t = String(text || '');
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) {
        if (c === '"' && t[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && t[i + 1] === '\n') i++;
        row.push(cur); rows.push(row.map(clean)); row = []; cur = '';
      } else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row.map(clean)); }
    return rows.filter((r) => r.some(Boolean));
  }

  /* The CSV address of a Google Sheets link, keeping the tab it points at
     (#gid=, ?gid=). Takes an editing link and a "Publish to web" link.
     Anything else answers null. */
  function sheetCsvUrl(link) {
    const s = String(link || '').trim();
    const gid = (s.match(/[#?&]gid=(\d+)/) || [])[1];
    const tab = gid ? '&gid=' + gid : '';
    let m = s.match(/docs\.google\.com\/spreadsheets\/d\/e\/([\w-]+)/);
    if (m) return 'https://docs.google.com/spreadsheets/d/e/' + m[1] + '/pub?output=csv' + tab;
    m = s.match(/docs\.google\.com\/spreadsheets\/d\/([\w-]{20,})/);
    if (m) return 'https://docs.google.com/spreadsheets/d/' + m[1] + '/export?format=csv' + tab;
    return null;
  }

  /* A week grid, as one row per day: [Date, Input, TP, Notes]. A row with
     dates in three or more of its cells starts a week; the labelled rows under
     it fill that week's days, column by column, until the next row of dates.
     The TP cell gives its practice number to the TP column, and whatever else
     it says ("Demo lesson 1", "Assessor's visit") goes to the notes beside the
     assignments, so nothing on the sheet is dropped. Answers null when the
     rows are not a grid. */
  function gridRows(rows, year) {
    let weeks = 0, cols = null;
    const days = [], byDate = {};
    (rows || []).forEach((r) => {
      const dated = r.map((c, i) => (i > 0 ? readDate(c, year) : '')).filter(Boolean);
      if (dated.length >= 3) {
        weeks++;
        cols = r.map((c, i) => (i > 0 ? readDate(c, year) : ''));
        cols.forEach((d) => { if (d && !byDate[d]) { byDate[d] = { date: d, input: [], tp: [], notes: [] }; days.push(byDate[d]); } });
        return;
      }
      if (!cols) return;
      const label = clean(r[0]);
      const key = HEAD.input1.test(label) || HEAD.input2.test(label) ? 'input'
        : HEAD.tp.test(label) ? 'tp' : HEAD.notes.test(label) ? 'notes' : null;
      if (!key) return;
      cols.forEach((d, i) => { const v = clean(r[i]); if (d && v) byDate[d][key].push(v); });
    });
    if (!weeks || !days.length) return null;
    return [['Date', 'Input', 'TP', 'Notes']].concat(days.map((d) => {
      /* The number comes from a part that is only "TP 7": "No TP · syllabus
         planning TP7 & TP8" names practices on a day that has none. */
      const tpCell = d.tp.join(' · ');
      const parts = tpCell.split(/\s*·\s*/).filter(Boolean);
      const own = parts.find((p) => /^TP\s*\d{1,2}$/i.test(p));
      const tpNo = own ? readTp(own) : null;
      const extra = parts.filter((p) => p !== own && !/^[A-Z]{3}$/.test(p));
      const notes = (tpNo ? extra : (tpCell ? [tpCell] : [])).concat(d.notes);
      return [d.date, d.input.join(' · '), tpNo ? 'TP ' + tpNo : '', notes.join(' · ')];
    }));
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
    const grid = gridRows(rows, year);
    if (grid) rows = grid;
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
      /* When the sheet has a TP column (a grid always does), only that column
         counts: the other cells can name a practice ("syllabus planning TP7 &
         TP8") on a day with none. Without one, the whole row is searched. */
      const tpColumn = grid || (map && map.tp !== undefined);
      const tp = readTp(at('tp')) || (tpColumn ? null : readTp(r.map(clean).join(' ')));
      if (tp) row.tp = tp;
      if (!row.a && !row.b && !row.notes && !row.tp) { unmatched.push(r.map(clean).filter(Boolean).join(' ')); return; }
      found.push(row);
    });
    return { found, unmatched, byDate, byPosition, header: !!map, grid: !!grid };
  }

  const api = { parse, rowsFromText, rowsFromBlocks, csvRows, gridRows, sheetCsvUrl, readDate, readTp, headerMap, splitCsv, clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubTimetableParse = api;
})(typeof window !== 'undefined' ? window : globalThis);
