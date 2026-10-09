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
 * TEACHING PRACTICE. When the sheet has a TP column (a week grid always has
 * one), the sheet decides the practice days: a blank TP cell is a day with no
 * practice, and each practice's first day goes to the first set, its second to
 * the second (Ramy, 9 Oct 2026: "the sheet decides"). Lite's own rotation
 * assumes a TP every day from day two; a real course has demo lessons and
 * days without teaching, and the sheet is where those are written. Without a
 * TP column, a number found in the row is taken and nothing else changes.
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

  /* A week grid, as one row per day: [Date, Input, Session 2, TP, Notes,
     InputAt, TpAt]. A row with dates in three or more of its cells starts a
     week; the labelled rows under it fill that week's days, column by column,
     until the next row of dates. The TP cell gives its practice number to the
     TP column; whatever else it says goes on as written -- a piece with its own
     time ("Demo lesson 1 · 15:00", "filmed observations (14:00)") is a session
     that day and goes to Session 2, and the rest ("No TP", "feedback same
     day") goes to the notes beside the assignments, so nothing on the sheet is
     dropped.
     THE LABELS CARRY TIMES (9 Oct 2026). "Input 11:00" and "TP 15:00 · 15:50 ·
     16:45" say when that week's input starts and when each lesson starts; they
     were read as a row name and the times thrown away, so every input landed
     on Lite's own 10:00 and the lessons on its own times. They go to InputAt
     and TpAt, per day, because a later week can change them ("TP 14:00 ·
     14:50 · 15:45" from week 3). Answers null when the rows are not a grid. */
  function gridRows(rows, year) {
    let weeks = 0, cols = null;
    const days = [], byDate = {};
    (rows || []).forEach((r) => {
      const dated = r.map((c, i) => (i > 0 ? readDate(c, year) : '')).filter(Boolean);
      if (dated.length >= 3) {
        weeks++;
        cols = r.map((c, i) => (i > 0 ? readDate(c, year) : ''));
        cols.forEach((d) => { if (d && !byDate[d]) { byDate[d] = { date: d, input: [], tp: [], notes: [], inputAt: '', tpAt: [] }; days.push(byDate[d]); } });
        return;
      }
      if (!cols) return;
      const label = clean(r[0]);
      const key = HEAD.input1.test(label) || HEAD.input2.test(label) ? 'input'
        : HEAD.tp.test(label) ? 'tp' : HEAD.notes.test(label) ? 'notes' : null;
      if (!key) return;
      const at = clocksIn(label);
      cols.forEach((d, i) => {
        if (!d) return;
        if (key === 'input' && at.length && !byDate[d].inputAt) byDate[d].inputAt = at[0];
        if (key === 'tp' && at.length && !byDate[d].tpAt.length) byDate[d].tpAt = at;
        const v = clean(r[i]); if (v) byDate[d][key].push(v);
      });
    });
    if (!weeks || !days.length) return null;
    return [['Date', 'Input', 'Session 2', 'TP', 'Notes', 'InputAt', 'TpAt']].concat(days.map((d) => {
      /* The number comes from a part that is only "TP 7": "No TP · syllabus
         planning TP7 & TP8" names practices on a day that has none. */
      const tpCell = d.tp.join(' · ');
      const parts = tpCell.split(/\s*·\s*/).filter(Boolean);
      const own = parts.find((p) => /^TP\s*\d{1,2}$/i.test(p));
      const tpNo = own ? readTp(own) : null;
      const rest = pieces(parts.filter((p) => p !== own && !/^[A-Z]{3}$/.test(p)).join(' · '));
      const timed = rest.filter((g) => g.timed).map((g) => g.text);
      const notes = rest.filter((g) => !g.timed).map((g) => g.text).concat(d.notes);
      return [d.date, d.input.join(' · '), timed.join(' · '), tpNo ? 'TP ' + tpNo : '', notes.join(' · '), d.inputAt, d.tpAt.join(' ')];
    }));
  }

  /* Every clock time written in a label or a cell, in order, as HH:MM. */
  function clocksIn(text) {
    const out = [];
    String(text || '').replace(/(\d{1,2})[:.](\d{2})\s*(am|pm)?/gi, (all, h, m, ap) => { const c = toClock(h, m, ap); if (c) out.push(c); return all; });
    return out;
  }

  /* A cell, as the sessions it holds. "Classroom management · Analysing
     language and context (12:30)" is two sessions: the first at the row's
     time, the second at its own. A piece carrying a time starts a session of
     its own; pieces without one run together ("Phonology 1 · Word and
     sentence stress" is one input with a subtitle); a piece that is only a
     time ("Demo lesson 2 · 14:00") belongs to the piece before it. */
  function pieces(text) {
    const out = [];
    clean(text).split(/\s*·\s*/).filter(Boolean).forEach((p) => {
      const bare = /^\(?\d{1,2}[:.]\d{2}\s*(am|pm)?(\s*[–—-]\s*\d{1,2}[:.]\d{2}\s*(am|pm)?)?\)?$/i.test(p);
      const timed = !!timesIn(p);
      const last = out[out.length - 1];
      if (bare && last && !last.timed) { last.text += ' (' + p.replace(/[()]/g, '') + ')'; last.timed = true; return; }
      if (!timed && last && !last.timed) { last.text += ' · ' + p; return; }
      out.push({ text: p, timed });
    });
    return out;
  }

  /* THE DAY'S SHAPE, when the sheet writes it out (9 Oct 2026). Ramy's C/18
     sheet says, above the grid: "Weeks 1–2: input 11:00–12:15 · break · TP
     feedback on yesterday 12:30–13:15 · lunch 13:15–14:15 · lesson planning
     14:15–15:00 · TP 15:00–17:30 · reflection 17:30–18:00. From Demo lesson 2
     (Fri 23 Oct): input 11:00–12:15 · ..." That is the whole day, and the day
     changes half way through the course. A sentence with three or more time
     ranges is read as a shape; a date before its colon is the day it starts
     from; a part with no time ("break") fills the gap between its neighbours.
     Answers [{ from: 'YYYY-MM-DD' or '', slots: [{kind, label, from, to}] }]. */
  function shapesIn(rows, year) {
    const out = [];
    (rows || []).forEach((r) => {
      const text = (r || []).map(clean).filter(Boolean).join(' ');
      if (rangesIn(text).length < 3) return;
      text.split(/\.\s+(?=[A-Z])/).forEach((sentence) => {
        if (rangesIn(sentence).length < 3) return;
        const colon = sentence.indexOf(':'), first = sentence.search(/\d{1,2}[:.]\d{2}/);
        const head = colon > 0 && colon < first ? sentence.slice(0, colon) : '';
        const body = head ? sentence.slice(colon + 1) : sentence;
        const segs = body.replace(/\.\s*$/, '').split(/\s*·\s*/).map(clean).filter(Boolean).map((seg) => {
          const rg = rangesIn(seg)[0];
          const name = clean(seg.replace(/(\d{1,2})[:.](\d{2})\s*(am|pm)?\s*(?:[–—-]|to)\s*(\d{1,2})[:.](\d{2})\s*(am|pm)?/i, ''));
          return { name, from: rg ? rg.s : '', to: rg ? rg.e : '' };
        });
        const slots = [];
        segs.forEach((g, i) => {
          let from = g.from, to = g.to;
          if (!from) {
            const prev = segs.slice(0, i).reverse().find((x) => x.to), next = segs.slice(i + 1).find((x) => x.from);
            if (!prev || !next || prev.to >= next.from) return;
            from = prev.to; to = next.from;
          }
          slots.push({ kind: shapeKind(g.name), label: shapeLabel(g.name), from, to });
        });
        if (slots.length >= 3) out.push({ from: readDate(head, year), slots });
      });
    });
    return out;
  }
  function rangesIn(text) {
    const out = [];
    String(text || '').replace(/(\d{1,2})[:.](\d{2})\s*(am|pm)?\s*(?:[–—-]|to)\s*(\d{1,2})[:.](\d{2})\s*(am|pm)?/gi, (all, h1, m1, a1, h2, m2, a2) => {
      const s = toClock(h1, m1, a1 || a2), e = toClock(h2, m2, a2); if (s && e && e > s) out.push({ s, e }); return all;
    });
    return out;
  }
  function shapeKind(name) {
    if (/\bTP\b|teaching practice/i.test(name) && !/feedback/i.test(name)) return 'tp';
    if (/lunch|break/i.test(name)) return 'break';
    if (/feedback|reflect/i.test(name)) return 'feedback';
    if (/planning/i.test(name)) return 'plan';
    if (/input/i.test(name)) return 'input';
    return 'event';
  }
  /* What the tile says: the sheet's own words, with a capital, and the two a
     tile always calls by their own name. */
  function shapeLabel(name) {
    if (/lunch/i.test(name)) return 'Lunch';
    if (/^break$/i.test(name)) return 'Break';
    if (/^reflection$/i.test(name)) return 'Reflection';
    const n = clean(name);
    return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
  }

  const HEAD = {
    date: /^(date|day|when)\b/i,
    input1: /^(input ?1|input|session ?1|morning|am)\b/i,
    input2: /^(input ?2|session ?2|afternoon|pm)\b/i,
    tp: /^(tp|teaching practice|practice)\b/i,
    notes: /^(notes?|other|assignments?|out)\b/i,
    inputAt: /^inputat$/i,
    tpAt: /^tpat$/i
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
    if (!rows.length) return { found: [], unmatched: [], byDate: 0, byPosition: 0, header: false, shapes: [] };
    const shapes = shapesIn(rows, year);
    const grid = gridRows(rows, year);
    if (grid) rows = grid;
    /* a sentence describing the day is not a day: a sheet without a grid
       would otherwise give it a course day by position */
    else if (shapes.length) rows = rows.filter((r) => !(r.filter((c) => clean(c)).length === 1 && rangesIn(r.join(' ')).length >= 3));
    const map = headerMap(rows[0]);
    const body = map ? rows.slice(1) : rows;
    const tpColumn = !!(grid || (map && map.tp !== undefined));
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
      let date = '', outside = '';
      if (iso && (!days || !days.length || days.some((d) => d.date === iso))) { date = iso; byDate++; }
      /* A date the sheet states that is not a course day (stage 3, 9 Oct
         2026): put on the nearest course day, and the review asks rather
         than placing it silently by position. */
      else if (iso && days && days.length) {
        const ds = days.map((d) => d.date);
        date = iso > ds[ds.length - 1] ? ds[ds.length - 1] : iso < ds[0] ? ds[0] : ds.filter((d) => d <= iso).pop();
        outside = iso;
      }
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
      if (outside) row.outside = outside;
      if (at('inputAt')) row.inputAt = at('inputAt');
      if (at('tpAt')) row.tpAt = at('tpAt').split(/\s+/).filter(Boolean);
      /* When the sheet has a TP column (a grid always does), only that column
         counts: the other cells can name a practice ("syllabus planning TP7 &
         TP8") on a day with none. Without one, the whole row is searched. */
      const tp = readTp(at('tp')) || (tpColumn ? null : readTp(r.map(clean).join(' ')));
      if (tp) row.tp = tp;
      if (!row.a && !row.b && !row.notes && !row.tp) { unmatched.push(r.map(clean).filter(Boolean).join(' ')); return; }
      found.push(row);
    });
    return { found, unmatched, byDate, byPosition, header: !!map, grid: !!grid, tpColumn, shapes };
  }

  /* ---- STAGE 3: WHAT EACH CELL MEANS, AND WHAT TO ASK (9 Oct 2026) ------
     The timetable-system handoff (specs/timetable-system/ §5): every cell has
     a meaning, and anything the reader is unsure of becomes a question rather
     than a guess. interpret() takes parse()'s result and the course, and
     returns the review: one line per cell as written, what Lite understood,
     and the questions. Nothing is written until every question is answered. */
  /* Planning and assignment time are what a cell IS, so they are read from
     how it starts: "Intro to coursebook & lesson planning" is an input that
     mentions planning, and it went in as a planning session (9 Oct 2026). */
  const KIND_WORDS = [
    ['task', /^(work on|finalis|file completion|assignment time|marking)/i],
    ['plan', /^((supervised|syllabus|independent|guided)\s+)?(lesson\s+)?planning\b/i],
    ['event', /\b(tutorials?|consultation|orientation|welcome|course close|closing|demo(nstration)?|debrief|observations?|filmed|assessor|meeting|getting to know|gtky)\b/i]
  ];
  /* What a CELTA input is usually called. A cell matching none of these, and
     no remembered term, is asked about. */
  const INPUT_WORDS = /(phonolog|pronunc|stress|intonation|connected speech|sounds|vocab|lexi|grammar|tense|aspect|modal|condition|receptive|productive|reading|listening|speaking|writing|skills|literacy|functional|function|language|analys|context|elicit|concept|ccq|monitor|error|correction|feedback|manag|lesson|framework|ppp|guided discovery|test.?teach|ttt|task.?based|drill|teaching|present|learner|young learners|exam|course ?book|materials|board|instruction|rapport|motivation|professional|development|introduc|intro\b|orientation|syllabus|discourse|dictionar|games?|songs?|authentic|text)/i;
  const KINDS = { input: 'Input session', plan: 'Lesson planning', event: 'Whole group', task: 'Assignment time' };
  const normTerm = (s) => clean(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const CODE = { fol: 'fol', lrt: 'lrt', lsrt: 'lsrt', lsa: 'lsrt', srt: 'lsrt', lfc: 'lfc' };
  const hm = (h, m) => String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  /* A clock time written in a cell. A sheet writes 24-hour times; an hour
     under eight is read as the afternoon, since no CELTA day starts at 2 AM. */
  const toClock = (h, m, ap) => { h = +h; if (ap) { if (/p/i.test(ap) && h < 12) h += 12; if (/a/i.test(ap) && h === 12) h = 0; } else if (h < 8) h += 12; return h < 24 && +m < 60 ? hm(h, m) : ''; };
  function timesIn(text) {
    const t = clean(text);
    let m = t.match(/(\d{1,2})[:.](\d{2})\s*(am|pm)?\s*(?:[–—-]|to)\s*(\d{1,2})[:.](\d{2})\s*(am|pm)?/i);
    if (m) {
      const s = toClock(m[1], m[2], m[3] || m[6]), e = toClock(m[4], m[5], m[6]);
      if (s && e && e > s) return { s, e, title: clean(t.replace(m[0], '').replace(/\(\s*\)/g, '').replace(/(\s*·\s*)+$/, '').replace(/^(\s*·\s*)+/, '').replace(/\s*·\s*·\s*/g, ' · ')) };
    }
    m = t.match(/\(?\b(\d{1,2})[:.](\d{2})\s*(am|pm)?\)?/i);
    if (m) {
      const s = toClock(m[1], m[2], m[3]);
      if (s) return { s, title: clean(t.replace(m[0], '').replace(/\(\s*\)/g, '').replace(/(\s*·\s*)+$/, '').replace(/^(\s*·\s*)+/, '').replace(/\s*·\s*·\s*/g, ' · ')) };
    }
    return null;
  }
  const label = (iso) => { const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return iso; const d = new Date(+m[1], +m[2] - 1, +m[3]); return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] + ' ' + d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]; };
  /* Deadlines named in a note: "Assignment 3 in · 11:00", "LRT due", "By
     18:00 · Assignment 1 in". A resubmission or an "out" is a note. */
  function deadlinesIn(notes, ctx) {
    const out = [];
    const pieces = String(notes || '').split(/;\s*|(?=\b(?:assignment\s*\d|fol|lrt|lsrt|lsa|lfc)\b)/i).map((x) => x.trim()).filter(Boolean);
    pieces.forEach((piece, i) => {
      if (/resub|\bout\b/i.test(piece)) return;
      const m = piece.match(/\b(?:assignment\s*(\d)|(fol|lrt|lsrt|lsa|srt|lfc))\b[^;]*?\b(in|due|deadline)\b/i);
      if (!m) return;
      const key = m[1] ? (ctx.order || [])[+m[1] - 1] : CODE[m[2].toLowerCase()];
      const own = piece.match(/(\d{1,2})[:.](\d{2})/);
      const before = (pieces[i - 1] || '').match(/by\s*(\d{1,2})[:.](\d{2})\W*$/i);
      const time = own ? toClock(own[1], own[2]) : before ? toClock(before[1], before[2]) : '';
      out.push({ text: clean(piece.replace(/(\s*·\s*)+$/, '')), key: key || '', n: m[1] ? +m[1] : 0, time });
    });
    return out;
  }
  function interpret(res, ctx) {
    ctx = ctx || {};
    const days = ctx.days || [], vocab = ctx.vocab || {}, titles = ctx.titles || {};
    const lines = [], questions = [];
    const seen = {};
    (res.found || []).forEach((f, fi) => {
      const row = 'r' + fi;
      const first = seen[f.date] === undefined; if (first) seen[f.date] = fi;
      if (f.outside) {
        const last = days.length ? days[days.length - 1].date : '', start = days.length ? days[0].date : '';
        questions.push({ id: row + ':outside', row, kind: 'outside',
          text: 'This row is dated ' + label(f.outside) + (f.outside > last ? ', after the last course day, ' + label(last) : f.outside < start ? ', before the first course day, ' + label(start) : ', which is not a course day') + '. What should happen?',
          answers: [{ label: 'Put it on ' + label(f.date), value: 'move' }, { label: 'Ignore this row', value: 'skip' }] });
      }
      if (!first) questions.push({ id: row + ':dup', row, kind: 'dup', text: 'Two rows are for ' + label(f.date) + '. How should they go in?',
        answers: [{ label: 'Both, this row’s sessions after the first’s', value: 'both' }, { label: 'Keep the first row', value: 'first' }, { label: 'Keep this row instead', value: 'second' }] });
      ['a', 'b'].forEach((col) => pieces(f[col]).forEach(({ text: raw }) => {
        const times = timesIn(raw);
        /* a tile's name starts with a capital, whatever the cell did ("demo
           debrief 16:45" is the tile "Demo debrief") */
        const said = times ? times.title || raw : raw;
        const title = said.charAt(0).toUpperCase() + said.slice(1);
        const term = normTerm(title);
        let kind = vocab[term] || '', how = vocab[term] ? 'remembered' : '';
        if (!kind) for (const [k, re] of KIND_WORDS) if (re.test(title)) { kind = k; how = 'words'; break; }
        if (!kind && INPUT_WORDS.test(title)) { kind = 'input'; how = 'words'; }
        const line = { row, date: f.date, col, raw, title, kind: kind || '', times, how };
        if (!kind) {
          /* one question per term: the answer goes for every cell that says it */
          line.q = 'term:' + term;
          if (!questions.some((q) => q.id === line.q)) questions.push({ id: line.q, row, kind: 'term', term, text: '“' + title + '”: what kind of session is this?',
            answers: Object.keys(KINDS).map((k) => ({ label: KINDS[k], value: k })).concat([{ label: 'Leave it out', value: 'skip' }]), remember: true });
        }
        if (/\btbc\b|to be confirmed/i.test(raw)) {
          line.tbc = row + ':' + col + ':tbc';
          questions.push({ id: line.tbc, row, kind: 'tbc', text: '“' + title + '” is not confirmed yet. What should Lite do?',
            answers: [{ label: 'Put it in, marked “to be confirmed”', value: 'keep' }, { label: 'Leave it out', value: 'skip' }] });
        }
        lines.push(line);
      }));
      if (f.tp) lines.push({ row, date: f.date, col: 'tp', raw: 'TP ' + f.tp, kind: 'tp', title: 'TP ' + f.tp });
      if (f.notes) {
        const line = { row, date: f.date, col: 'notes', raw: f.notes, kind: 'note', title: f.notes, dues: [] };
        deadlinesIn(f.notes, ctx).forEach((d, di) => {
          const id = row + ':due' + di;
          const name = d.key ? (titles[d.key] || d.key.toUpperCase()) : '';
          line.dues.push(id);
          questions.push(Object.assign({ id, row, kind: 'due', date: f.date }, d.key
            ? { key: d.key, time: d.time, text: '“' + d.text + '” on ' + label(f.date) + ': is this ' + name + '’s deadline?',
                answers: [{ label: 'Yes: ' + name + ' due ' + label(f.date) + (d.time ? ', ' + d.time : ''), value: 'yes' }, { label: 'No, it’s a note', value: 'no' }] }
            : { time: d.time, text: '“' + d.text + '” on ' + label(f.date) + ': which assignment is due?',
                answers: (ctx.order || []).map((k) => ({ label: titles[k] || k.toUpperCase(), value: 'key:' + k })).concat([{ label: 'None, it’s a note', value: 'no' }]) }));
        });
        lines.push(line);
      }
    });
    return { lines, questions };
  }

  const api = { parse, interpret, timesIn, deadlinesIn, normTerm, KINDS, rowsFromText, rowsFromBlocks, csvRows, gridRows, sheetCsvUrl, readDate, readTp, headerMap, splitCsv, clean, pieces, shapesIn, clocksIn };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubTimetableParse = api;
})(typeof window !== 'undefined' ? window : globalThis);
