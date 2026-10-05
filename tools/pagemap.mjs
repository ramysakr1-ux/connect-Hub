import { call, readCourse, LIBRARY } from './st.mjs';
import fs from 'node:fs';
/* WHICH PAGES A SLOT TEACHES FROM, read off the citation each slot already
   carries. Only a number introduced by "p." or "pp." counts, so exercise
   numbers, track numbers and unit labels ("4A", "ex. 1-4", "track 2.03") can
   never be mistaken for a page. The Teacher's Book is excluded on purpose:
   those pages are the tutor's, and the card carries what the LEARNERS see. */
export const SETS = {
  s1: { SB: 'LH_SB', sbName: 'Student’s Book' },
  s2: { SB: 'RM_SB', sbName: 'Students’ Book' },
  s3: { SB: 'SF_SB', WB: 'SF_WB', TB: 'SF_TB', sbName: 'Student’s Book' },
  s4: { SB: 'SO_SB', WB: 'SO_WB', sbName: 'Student’s Book' },
  s5: { SB: 'SOB1_SB', WB: 'SOB1_WB', sbName: 'Student’s Book' },
};
/* THE PHOTOCOPIABLES, FOUND. Ramy's Straightforward documents send candidates
   to pp. 223, 224, 228 and 233. Those sit past the Student's Book's last page
   (175), and the Teacher's Book that was in the library -- a SECOND edition --
   has no resource section at all. He produced the FIRST edition on 4 Oct 2026:
   1B is "Paintballing", first published 2007, and its own imprint licenses
   photocopies of pp. 211-258. So a cited page above the Student's Book's last
   page is a Teacher's Book photocopiable and is taken from there. All four
   were checked against the slot that cites them: 223 "4A A good explanation?",
   224 "4B Sentence-making challenge", 228 "5B Whatever!", 233 "6C You
   shouldn't have ...". */
const SB_LAST = { s3: 175 };
/* The Teacher's Book's own notes are the tutor's and stay off the card, but
   from p. 211 the book turns into photocopiable WORKSHEETS, which is what the
   learners are handed. Its imprint licenses copies of pp. 211-258 by name, so
   a Teacher's Book page at or above that line is attached like any other page
   -- e.g. 1B.3's "Teacher's Book p. 214", which is "1D What I love about...",
   the worksheet for the very lesson that slot teaches. */
const TB_WORKSHEETS_FROM = { s3: 211 };
/* The Student's Book's own Additional material carries the roleplay cards for
   the 4A functional language lesson that 3B.2 teaches (SB p. 37, "Roleplay:
   ex. 1"): "4A Functional language exercise 3 page 37", Groups A and B, read
   off pp. 139 and 146. They stand in for the photocopiable above. */
export const EXTRA = { s3: { '3B|1': [['SB', 139], ['SB', 146]] } };
/* THE JIGSAW PAGES. Ramy, 4 Oct 2026: "add the jigsaw pages too." A spread
   routinely splits a task -- "Student A: go to page 141, Student B: go to page
   142" -- and without both halves the activity cannot run. jigsaw.py traces
   each pointer back to the section heading above it and gives the destination
   only to the slot whose lesson type is that section, so the speaking task's
   pairwork cards no longer land on the vocabulary slot sharing its spread. */
/* NOJIG=1 writes the map WITHOUT these, which is what jigsaw.py must read:
   it looks for pointers to pages a slot does not already have, so feeding it a
   map that already contains its own last answer makes it report nothing and
   overwrite jigsaw.json with an empty one. */
const JIG = process.env.NOJIG ? {} :
  JSON.parse(fs.readFileSync(new URL('./jigsaw.json', import.meta.url), 'utf8'));
for (const sid of Object.keys(JIG))
  for (const [k, list] of Object.entries(JIG[sid])) {
    EXTRA[sid] = EXTRA[sid] || {};
    EXTRA[sid][k] = (EXTRA[sid][k] || []).concat(list.filter(([s, p]) =>
      !(EXTRA[sid][k] || []).some(([a, b]) => a === s && b === p)));
  }

export function pagesOf(cite, TB_FROM) {
  /* Set one cites the Hub pages at the back as "148-5.2" -- page 148, activity
     5.2. Strip the activity label first or the hyphen reads as a range and the
     page becomes 148 to 5. Set one also writes "pages 44 & 148", so "pages"
     introduces a number just as "p." does. */
  const txt = String(cite || '')
    .replace(/\(notes pp?\.[^)]*\)/gi, '')
    .replace(/(\d{1,3})\s*[–—-]\s*\d+\.\d+/g, '$1');
  const out = [];
  txt.split(/[\n·]/).forEach(frag => {
    /* ONE LINE CAN NAME TWO BOOKS. Ramy's A1 documents write
       "SB, p. 15, ex. 4a, 5 and 6  WB, p. 9 ex. 1a" -- deciding the source for
       the whole fragment put the Student's Book page in the Workbook. The
       source is whichever of SB / WB / Teacher's Book was named most recently
       BEFORE each page number. */
    const marks = [];
    frag.replace(/teacher.?s book|workbook|\bWB\b|\bSB\b|student.?s book/gi,
      (hit, at) => { marks.push([at, /teacher/i.test(hit) ? 'TB' : /wb|workbook/i.test(hit) ? 'WB' : 'SB']); return hit; });
    const srcAt = at => { let s = 'SB'; marks.forEach(([i, v]) => { if (i < at) s = v; }); return s; };
    const re = /(?:pp?\.\s*|pages?\b\s*|\bpp?(?=\d))(\d{1,3})(?:\s*(?:[–—-]|&|and)\s*(?:pp?\.|pages?\b)?\s*(\d{1,3}))?/gi;
    let m;
    while ((m = re.exec(frag))) {
      const src = srcAt(m.index);
      if (src === 'TB' && !(TB_FROM && +m[1] >= TB_FROM)) continue;
      const a = +m[1], b = m[2] ? +m[2] : a;
      /* "pp. 10-11" is a spread; "pp. 145 & 147" is two separate pages. */
      if (b > a && b - a <= 3 && /[–—-]/.test(m[0])) { for (let p = a; p <= b; p++) out.push([src, p]); }
      else { out.push([src, a]); if (b !== a) out.push([src, b]); }
    }
  });
  const seen = new Set();
  return out.filter(([s, p]) => { const k = s + p; if (seen.has(k)) return false; seen.add(k); return true; });
}

/* book page numbers that are blank in the publisher's own file */
const BLANK = JSON.parse(fs.readFileSync(new URL('./blank-pages.json', import.meta.url), 'utf8'));
const PRE = { s1: 'LH', s2: 'RM', s3: 'SF', s4: 'SO', s5: 'SOB1' };

export async function buildMap() {
  const L = (await readCourse(LIBRARY)).rec.set.library;
  const map = {}, dropped = [];
  for (const id of Object.keys(SETS)) {
    const S = L[id]; map[id] = {};
    Object.keys(S.sessions).sort().forEach(x => S.sessions[x].slots.forEach((sl, i) => {
      const k = `${x}|${i}`;
      let got = pagesOf(sl.pages, TB_WORKSHEETS_FROM[id]).map(([s, p]) =>
        (s === 'SB' && SB_LAST[id] && p > SB_LAST[id] && SETS[id].TB) ? ['TB', p] : [s, p]);
      got = got.concat((EXTRA[id] || {})[k] || []);
      /* A PAGE THE PUBLISHER'S FILE DOES NOT HAVE. The Speakout A1 Student's
         Book PDF is missing book pp. 140-150 -- the Additional material the
         pairwork tasks point at -- and those pages are blank, not absent, so
         they rendered as white sheets, uploaded cleanly and printed into five
         day PDFs before anyone looked at one. Nothing else in the library has
         a blank page (blank-scan.py checks all seven books). Drop them here,
         where every attach and every day PDF reads from, and SAY so. */
      got = got.filter(([src, p]) => {
        const bk = `${PRE[id]}_${src}`;
        if (!(BLANK[bk] || []).includes(+p)) return true;
        dropped.push(`${id} ${k.replace('|', '·')} ${src} p.${p} — blank in ${bk}`);
        return false;
      });
      /* A PAGE ONCE. The citation and the jigsaw can name the same page --
         s3 6B.1 cites "Additional material pp. 146 & 148" AND has them placed
         by hand in jigsaw.py -- and without this the slot carried each twice,
         which put two identical scans on the card and two copies in the
         printed day. Nothing complained: both were real pages with real urls. */
      const once = new Set();
      map[id][k] = got.filter(([src, p]) => { const key = src + p;
        if (once.has(key)) return false; once.add(key); return true; });
    }));
  }
  return { map, dropped, L };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { map, dropped } = await buildMap();
  const all = new Set();
  for (const id of Object.keys(SETS)) {
    const u = new Set();
    Object.entries(map[id]).forEach(([k, l]) => l.forEach(([s, p]) => { u.add(s + p); all.add(id + s + p); }));
    console.log(`${id}: ${Object.keys(map[id]).length} slots · ${u.size} unique pages · ${[...u].sort().join(' ')}`);
  }
  console.log(`\ntotal page images to make: ${all.size}`);
  console.log(`dropped (not in any book we hold): ${dropped.length ? dropped.join(', ') : 'none'}`);
  fs.writeFileSync('pagemap.json', JSON.stringify(map, null, 1));
}
