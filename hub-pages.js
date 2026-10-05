/* Cutting a course's own book into the pages its lessons need.
 *
 * A set carries citations -- "SB p.61, ex 3A-B" -- and the pages themselves are
 * whoever's copy of the book attached them. A set written by another centre, or
 * shared through Connect, arrives with the citations and none of the pages: we
 * tell you which page, you bring your own book. Doing that by hand is 37 pages
 * for Language Hub, 71 for Straightforward, one upload at a time. Nobody will.
 *
 * So: point at your PDF once, and this cuts out every page the set cites and
 * attaches it. The file never leaves the browser except as the pages that come
 * out of it, which go to the course's own Drive folder like any other material.
 *
 * THE OFFSET IS THE WHOLE DIFFICULTY. A PDF's third page is almost never the
 * book's page 3 -- there are covers, a contents, a map of the book. Rather than
 * guess, we render one page and ask: is this page N? They nudge until it is,
 * and the gap is the offset.
 *
 * ONE OFFSET IS NOT ENOUGH, and that cost us a day. A publisher's file can
 * leave pages out of the MIDDLE, and then every page after them sits that much
 * deeper. The Speakout B1 Student's Book, found 5 Oct 2026: its folio reads
 * 145 on PDF page 145 and 150 on PDF page 146, so book pp. 146-149 -- the
 * Additional material its own pairwork prompts send a class to -- are not in
 * the file at all. Calibrated on one early page, asking for p. 150 rendered
 * p. 146: a real page, with real text, from the wrong part of the book. No
 * check above the PDF could have caught it, because a wrong page looks exactly
 * like a right one. So the folio is confirmed at BOTH ends of what the set
 * needs and the two offsets compared; `pageMap` below is what a disagreement
 * turns into.
 *
 * Ramy, 5 Oct 2026, on sets travelling without our scans: "where do they lead
 * if we're not attaching anything?" This is the other half of that answer --
 * the book link tells a trainee where the page lives, this puts the page on
 * the card. */
(function () {
  'use strict';
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const BOOKS = { SB: 'Student’s Book', WB: 'Workbook', TB: 'Teacher’s Book' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let lib = null;
  function loadPdfJs() {
    if (lib) return Promise.resolve(lib);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = PDFJS;
      s.onload = () => {
        lib = window.pdfjsLib;
        if (!lib) return rej(new Error('the PDF reader did not load'));
        lib.GlobalWorkerOptions.workerSrc = WORKER;
        res(lib);
      };
      s.onerror = () => rej(new Error('the PDF reader could not be fetched — check the connection'));
      document.head.appendChild(s);
    });
  }

  /* Every page this set cites, by book. A file with a url is already attached;
     one without is a page we owe the trainee. */
  function needs(S) {
    const out = {};
    Object.keys(S.sessions || {}).forEach(k => (S.sessions[k].slots || []).forEach(sl => {
      (sl.files || []).forEach(f => {
        const p = parseInt(f.page, 10);
        if (!p) return;
        const src = f.src || 'SB';
        (out[src] = out[src] || { have: new Set(), want: new Set() });
        out[src][f.url ? 'have' : 'want'].add(p);
      });
    }));
    Object.keys(out).forEach(k => {
      out[k].have = [...out[k].have].sort((a, b) => a - b);
      out[k].want = [...out[k].want].sort((a, b) => a - b);
    });
    return out;
  }

  /* WHAT A DISAGREEMENT TURNS INTO. Two folios that imply different offsets
     mean the file is missing pages somewhere between them, so a map is a first
     offset and, optionally, the book page a second and deeper one starts at.
     The pages the file skips then fall out of the arithmetic: they are the
     `gap` pages immediately below that break, and `skips` refuses them rather
     than render the page that would come out instead.

     Same shape as the server-side builder's SHIFTS and ABSENT in
     tools/scanpages.py, read off the folios the same way. A file with an extra
     insert bound in gives a negative gap: nothing is missing then, so `absent`
     stays empty and only the offset moves. */
  function pageMap(offset, from, deep) {
    const shifted = typeof from === 'number' && typeof deep === 'number' && deep !== offset;
    const gap = shifted ? offset - deep : 0;
    const absent = [];
    for (let p = from - gap; shifted && p < from; p++) absent.push(p);
    return {
      offset: offset,
      deep: shifted ? deep : offset,
      from: shifted ? from : null,
      gap: gap,
      absent: absent,
      at: p => (shifted && p >= from ? deep : offset),
      skips: p => absent.indexOf(p) >= 0,
    };
  }

  async function renderPage(doc, pdfPage, dpi) {
    const page = await doc.getPage(pdfPage);
    const vp = page.getViewport({ scale: (dpi || 150) / 72 });
    const cv = document.createElement('canvas');
    cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
    return cv;
  }

  window.HubPages = {
    BOOKS: BOOKS,
    needs: needs,
    map: pageMap,
    loadPdfJs: loadPdfJs,
    renderPage: renderPage,
    esc: esc,

    /* Open a chosen file as a pdf.js document. */
    async open(file) {
      const js = await loadPdfJs();
      const buf = await file.arrayBuffer();
      return js.getDocument({ data: buf }).promise;
    },

    /* Cut and attach. `map` is a pageMap, never a bare offset -- a page the
       file does not have is named back as skipped rather than rendered, because
       what would come out is a real page from the wrong part of the book and
       nothing downstream could tell. `onStep` is told where it has got to so
       the page can draw a progress line; attaching stops at the first upload
       that fails rather than carrying on and leaving a set half done. */
    async attach(opts) {
      const { doc, src, pages, map, token, dpi, quality, label, onStep } = opts;
      const made = {}, skipped = [];
      for (let i = 0; i < pages.length; i++) {
        const bookPage = pages[i];
        if (onStep) onStep({ i: i, of: pages.length, page: bookPage });
        if (map.skips(bookPage)) { skipped.push(bookPage); continue; }
        const pdfPage = bookPage + map.at(bookPage);
        if (pdfPage < 1 || pdfPage > doc.numPages)
          throw new Error(`page ${bookPage} would be PDF page ${pdfPage}, which is outside this file`);
        const cv = await renderPage(doc, pdfPage, dpi || 150);
        const b64 = cv.toDataURL('image/jpeg', quality || 0.72).split(',')[1];
        if (!b64) throw new Error(`page ${bookPage} could not be turned into an image`);
        const name = `${label} ${BOOKS[src] || src} p. ${bookPage}.jpg`;
        const out = await window.HubStore.putMaterial(token, name, 'image/jpeg', b64);
        if (!out || !out.url) throw new Error(`page ${bookPage} did not upload`);
        made[bookPage] = { name: name.replace(/\.jpg$/, ''), url: out.url };
      }
      if (onStep) onStep({ i: pages.length, of: pages.length, done: true });
      return { made: made, skipped: skipped };
    },

    /* Write what came back onto every slot that cites those pages. */
    fill(S, src, made) {
      let n = 0;
      Object.keys(S.sessions || {}).forEach(k => (S.sessions[k].slots || []).forEach(sl => {
        (sl.files || []).forEach(f => {
          const got = made[parseInt(f.page, 10)];
          if (!got || f.url || (f.src || 'SB') !== src) return;
          f.url = got.url; if (!f.name) f.name = got.name; n++;
        });
      }));
      return n;
    },
  };
})();
