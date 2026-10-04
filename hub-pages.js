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
 * and the gap is the offset for every other page.
 *
 * Ramy, 5 Oct 2026, on sets travelling without our scans: "where do they lead
 * if we're not attaching anything?" This is the other half of that answer --
 * the book link tells a candidate where the page lives, this puts the page on
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
     one without is a page we owe the candidate. */
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
    loadPdfJs: loadPdfJs,
    renderPage: renderPage,
    esc: esc,

    /* Open a chosen file as a pdf.js document. */
    async open(file) {
      const js = await loadPdfJs();
      const buf = await file.arrayBuffer();
      return js.getDocument({ data: buf }).promise;
    },

    /* Cut and attach. `onStep` is told where it has got to so the page can draw
       a progress line; attaching stops at the first upload that fails rather
       than carrying on and leaving a set half done. */
    async attach(opts) {
      const { doc, src, pages, offset, token, dpi, quality, label, onStep } = opts;
      const made = {};
      for (let i = 0; i < pages.length; i++) {
        const bookPage = pages[i], pdfPage = bookPage + offset;
        if (onStep) onStep({ i: i, of: pages.length, page: bookPage });
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
      return made;
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
