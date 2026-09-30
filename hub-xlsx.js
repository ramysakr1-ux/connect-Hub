/* Connect Lite — reading an Excel file in the browser, without a library.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 30 Sep 2026, on the volunteer register: "imported from an Excel".
 * Until now a spreadsheet had to be pasted, or saved as CSV first. An .xlsx
 * is a zip of XML, the same trick as hub-docx.js: the zip is walked by hand,
 * each entry inflated with the browser's own DecompressionStream, and the
 * three files that matter are read:
 *
 *   xl/sharedStrings.xml   -- the text, once, indexed
 *   xl/styles.xml          -- which number formats are dates
 *   xl/worksheets/sheet1.xml (the workbook's first sheet) -- the cells
 *
 * window.hubXlsxRows(file) -> Promise<string[][]>: the first sheet as rows of
 * strings, in cell order, with empty cells kept in place so a blank B does
 * not slide C into it. A date cell comes out as YYYY-MM-DD, which is what
 * the timetable parser reads; a time cell as HH:MM; a number as itself.
 * Rejects with a plain sentence when the file is not an Excel workbook.
 *
 * What it does not do: formulas beyond their cached value, other sheets,
 * merged cells (the top-left cell holds the text, the rest are empty, which
 * is also what a paste gives). Enough for a register and a timetable.
 */
(function(){
  'use strict';

  async function inflateRaw(bytes){
    if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot open Excel files here — save the sheet as CSV and import that.');
    const ds = new DecompressionStream('deflate-raw');
    const w = ds.writable.getWriter(); w.write(bytes); w.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }

  /* Every entry of the zip, by name, from the central directory at the end. */
  function directory(buf){
    const dv = new DataView(buf), u8 = new Uint8Array(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
    if (eocd < 0) throw new Error('That is not an Excel workbook.');
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const map = {};
    for (let n = 0; n < count; n++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
      const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
      const lhOff = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen));
      map[name] = { method, csize, lhOff };
      p += 46 + nlen + xlen + clen;
    }
    return { map, dv, u8 };
  }
  async function entry(dir, name){
    const e = dir.map[name]; if (!e) return null;
    const lnlen = dir.dv.getUint16(e.lhOff + 26, true), lxlen = dir.dv.getUint16(e.lhOff + 28, true);
    const start = e.lhOff + 30 + lnlen + lxlen;
    const data = dir.u8.subarray(start, start + e.csize);
    const bytes = e.method === 0 ? data : e.method === 8 ? await inflateRaw(data) : null;
    if (!bytes) throw new Error('That workbook is packed in a way this page cannot read.');
    return new TextDecoder().decode(bytes);
  }

  const decode = s => String(s).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#x([0-9a-f]+);/gi, (m,h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (m,n) => String.fromCodePoint(+n)).replace(/&amp;/g,'&');
  const innerText = xml => decode(xml.replace(/<[^>]+>/g, ''));

  /* Shared strings: each <si> is one string, possibly in several <t> runs. */
  function sharedStrings(xml){
    if (!xml) return [];
    const out = [];
    const re = /<si>([\s\S]*?)<\/si>/g; let m;
    while ((m = re.exec(xml))) {
      const ts = m[1].match(/<t[^>]*>[\s\S]*?<\/t>/g) || [];
      out.push(ts.map(innerText).join(''));
    }
    return out;
  }

  /* Which cell styles are dates or times. Built-in ids 14-22 and 45-47 are
     dates and times; a custom format is one if it spells out day/month/year
     or hours/minutes outside quoted text. */
  function dateStyles(xml){
    const isDate = {}, isTime = {};
    if (!xml) return { isDate, isTime };
    const fmts = {};
    (xml.match(/<numFmt [^>]*\/>/g) || []).forEach(t => {
      const id = (t.match(/numFmtId="(\d+)"/) || [])[1], code = decode((t.match(/formatCode="([^"]*)"/) || [])[1] || '');
      if (id) fmts[id] = code.replace(/"[^"]*"/g, '').replace(/\[[^\]]*\]/g, '');
    });
    const xfs = (xml.match(/<cellXfs[\s\S]*?<\/cellXfs>/) || [''])[0].match(/<xf [^>]*\/?>/g) || [];
    xfs.forEach((xf, i) => {
      const id = +((xf.match(/numFmtId="(\d+)"/) || [])[1] || 0);
      const code = fmts[id] || '';
      const timeOnly = (id >= 18 && id <= 21) || (id >= 45 && id <= 47) || (code && /[hs]/i.test(code) && !/[dy]/i.test(code));
      const date = (id >= 14 && id <= 22) || (id >= 45 && id <= 47) || (code && /[dmy]/i.test(code) && /[dy]/i.test(code)) || timeOnly;
      if (timeOnly) isTime[i] = true; else if (date) isDate[i] = true;
    });
    return { isDate, isTime };
  }
  const pad = n => String(n).padStart(2, '0');
  function serialToDate(n){
    /* Excel's day 1 is 1 Jan 1900 and it believes in 29 Feb 1900; from 1 Mar
       1900 onward the serial is days since 30 Dec 1899. */
    const days = Math.floor(n), ms = Math.round((n - days) * 86400000);
    const d = new Date(Date.UTC(1899, 11, 30) + days * 86400000 + ms);
    return d;
  }
  const fmtDate = n => { const d = serialToDate(n); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };
  const fmtTime = n => { const secs = Math.round((n - Math.floor(n)) * 86400); return pad(Math.floor(secs / 3600) % 24) + ':' + pad(Math.floor(secs / 60) % 60); };
  const colIndex = ref => { const m = String(ref).match(/^([A-Z]+)/); if (!m) return 0; let n = 0; for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; };

  /* The first sheet's cells -> rows of strings. */
  function sheetRows(xml, strings, styles){
    const rows = [];
    const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g; let rm;
    while ((rm = rowRe.exec(xml))) {
      const cells = [];
      const cRe = /<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g; let cm;
      while ((cm = cRe.exec(rm[1]))) {
        const attrs = cm[1], body = cm[2] || '';
        const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1] || '';
        const type = (attrs.match(/\bt="(\w+)"/) || [])[1] || 'n';
        const style = +((attrs.match(/\bs="(\d+)"/) || [])[1] || -1);
        let text = '';
        if (type === 'inlineStr') text = (body.match(/<t[^>]*>[\s\S]*?<\/t>/g) || []).map(innerText).join('');
        else {
          const v = (body.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
          if (v == null) text = '';
          else if (type === 's') text = strings[+v] || '';
          else if (type === 'str' || type === 'e') text = decode(v);
          else if (type === 'b') text = v === '1' ? 'TRUE' : 'FALSE';
          else {
            const n = parseFloat(v);
            if (isNaN(n)) text = decode(v);
            else if (styles.isTime[style]) text = fmtTime(n);
            else if (styles.isDate[style]) text = n % 1 ? fmtDate(n) + ' ' + fmtTime(n) : fmtDate(n);
            else text = String(n);
          }
        }
        const i = ref ? colIndex(ref) : cells.length;
        while (cells.length < i) cells.push('');
        cells[i] = text.trim();
      }
      rows.push(cells);
    }
    /* Trailing empty rows and cells are noise. */
    return rows.map(r => { while (r.length && !r[r.length - 1]) r.pop(); return r; }).filter(r => r.some(Boolean));
  }

  /* The first sheet in the workbook's own order, via its rels; sheet1.xml
     when the rels cannot be read. */
  async function firstSheetPath(dir){
    const wb = await entry(dir, 'xl/workbook.xml');
    const rels = await entry(dir, 'xl/_rels/workbook.xml.rels');
    if (wb && rels) {
      const rid = (wb.match(/<sheet [^>]*r:id="([^"]+)"/) || wb.match(/<sheet [^>]*\br:id="([^"]+)"/) || [])[1];
      if (rid) {
        const rel = (rels.match(new RegExp('<Relationship [^>]*Id="' + rid + '"[^>]*/>')) || [])[0] || '';
        const target = (rel.match(/Target="([^"]+)"/) || [])[1];
        if (target) return target.replace(/^\/?(xl\/)?/, 'xl/');
      }
    }
    return 'xl/worksheets/sheet1.xml';
  }

  window.hubXlsxRows = async function(file){
    const buf = await file.arrayBuffer();
    const dir = directory(buf);
    if (!dir.map['xl/workbook.xml'] && !dir.map['xl/worksheets/sheet1.xml']) throw new Error('That is not an Excel workbook.');
    const sheet = await entry(dir, await firstSheetPath(dir));
    if (!sheet) throw new Error('That workbook has no sheet this page can read.');
    const strings = sharedStrings(await entry(dir, 'xl/sharedStrings.xml'));
    const styles = dateStyles(await entry(dir, 'xl/styles.xml'));
    return sheetRows(sheet, strings, styles);
  };
  window.hubIsXlsx = file => /\.xlsx$/i.test((file && file.name) || '');
})();
