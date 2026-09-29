/* Connect Lite — reading a Word file in the browser.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 27 Sep 2026: "should there be an option for them to just upload
 * their own assignments or their own observation tasks and push into
 * whatever we built here?" There is now. A .docx is a zip; the text is in
 * word/document.xml. No library: the zip is walked by hand and each entry
 * inflated with the browser's own DecompressionStream, which every browser
 * Lite supports has had since 2023.
 *
 * What comes out is plain text, one paragraph per line:
 *   - a Word heading paragraph (Heading 1-3, Title) gets a "# " in front,
 *     with a blank line before it, so the assignment importer's
 *     blank-line-then-heading rule sees a section;
 *   - a table row becomes one line, its cells joined by tabs, and a table
 *     ends with a blank line;
 *   - numbered-list paragraphs keep whatever the author typed; Word's own
 *     automatic numbering is NOT in the text, so "1." typed by hand survives
 *     and auto-numbers do not. The observation importer copes with both.
 *
 * window.hubDocxText(file) -> Promise<string>. Rejects with a plain message
 * when the file is not a Word document or the browser cannot inflate.
 * window.hubDocxBlocks(file) -> Promise<blocks>: the same document with its
 * tables kept, for the observation parser.
 */
(function(){
  'use strict';

  async function inflateRaw(bytes){
    if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot open Word files here — save the sheet as plain text and import that.');
    const ds = new DecompressionStream('deflate-raw');
    const w = ds.writable.getWriter(); w.write(bytes); w.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }

  /* The zip's central directory, read from the end of the file. */
  async function entryBytes(buf, wanted){
    const dv = new DataView(buf), u8 = new Uint8Array(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
    if (eocd < 0) throw new Error('That is not a Word document.');
    const count = dv.getUint16(eocd + 10, true), cdOff = dv.getUint32(eocd + 16, true);
    let p = cdOff;
    for (let n = 0; n < count; n++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
      const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
      const lhOff = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen));
      if (name === wanted) {
        const lnlen = dv.getUint16(lhOff + 26, true), lxlen = dv.getUint16(lhOff + 28, true);
        const start = lhOff + 30 + lnlen + lxlen;
        const data = u8.subarray(start, start + csize);
        if (method === 0) return data;
        if (method === 8) return inflateRaw(data);
        throw new Error('That Word file is packed in a way this page cannot read.');
      }
      p += 46 + nlen + xlen + clen;
    }
    throw new Error('That is not a Word document.');
  }

  const decode = s => s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g, (m,n) => String.fromCharCode(+n)).replace(/&amp;/g,'&');

  /* document.xml -> lines. Walks paragraphs in order; a paragraph inside a
     table cell is joined to its row rather than standing alone. */
  function xmlToText(xml){
    const out = [];
    const paraText = p => decode(p.replace(/<w:tab[^>]*\/>/g, '\t').replace(/<w:br[^>]*\/>/g, '\n').replace(/<[^>]+>/g, '')).replace(/[  ]+/g, ' ').trim();
    const isHeading = p => /<w:pStyle w:val="(Heading[1-3]|Title|Heading[1-3]Char)"/.test(p) || /<w:pStyle w:val="Heading\d"/.test(p);
    /* Tables first: pull each out, replace with a marker, keep its rows. */
    const tables = [];
    const body = xml.replace(/<w:tbl>[\s\S]*?<\/w:tbl>/g, m => {
      const rows = (m.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g) || []).map(tr =>
        (tr.match(/<w:tc[ >][\s\S]*?<\/w:tc>/g) || []).map(tc => (tc.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || []).map(paraText).filter(Boolean).join(' ')).join('\t'));
      tables.push(rows); return '<w:tblmarker n="' + (tables.length - 1) + '"/>';
    });
    const parts = body.match(/<w:p[ >][\s\S]*?<\/w:p>|<w:tblmarker n="\d+"\/>/g) || [];
    parts.forEach(p => {
      const tm = p.match(/^<w:tblmarker n="(\d+)"\/>$/);
      if (tm) { tables[+tm[1]].forEach(r => { if (r.replace(/\t/g,'').trim()) out.push(r); }); out.push(''); return; }
      const t = paraText(p);
      if (!t) { out.push(''); return; }
      if (isHeading(p)) { if (out.length && out[out.length-1] !== '') out.push(''); out.push('# ' + t); }
      else out.push(t);
    });
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  /* The same document as BLOCKS, tables kept: {kind:'p', text} for a
     paragraph, {kind:'table', rows:[[cellParagraphs...]...]} for a table,
     each cell an array of its paragraphs, in document order, empties
     dropped. This is what the observation parser (hub-observation-parse.js)
     reads -- the flat text above loses a sheet's stage map and tick-boxes,
     which is how an imported Live Task 2 came through as column names and
     the digits one to seven (29 Sep 2026). Matches the shape the generator
     builds in Node, so a centre's file reads here exactly as Ramy's did. */
  function xmlToBlocks(xml){
    const body = xml.slice(Math.max(0, xml.indexOf('<w:body>')));
    const paraText = p => decode(p.replace(/<w:tab[^>]*\/>/g, '\t').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const paras = frag => (frag.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || []).map(paraText).filter(Boolean);
    const out = [];
    const re = /<w:tbl>[\s\S]*?<\/w:tbl>|<w:p[ >][\s\S]*?<\/w:p>/g;
    let m;
    while ((m = re.exec(body))) {
      const frag = m[0];
      if (frag.startsWith('<w:tbl>')) {
        const rows = (frag.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g) || []).map(tr => (tr.match(/<w:tc>[\s\S]*?<\/w:tc>/g) || []).map(tc => paras(tc)));
        out.push({ kind: 'table', rows });
      } else {
        const t = paraText(frag); if (t) out.push({ kind: 'p', text: t });
      }
    }
    return out;
  }
  window.hubDocxBlocks = async function(file){
    const buf = await file.arrayBuffer();
    const bytes = await entryBytes(buf, 'word/document.xml');
    return xmlToBlocks(new TextDecoder('utf-8').decode(bytes));
  };
  /* Plain text as blocks: every non-empty line a paragraph. */
  window.hubTextBlocks = text => String(text || '').split(/\r?\n/).map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).map(text => ({ kind: 'p', text }));

  window.hubDocxText = async function(file){
    const buf = await file.arrayBuffer();
    const bytes = await entryBytes(buf, 'word/document.xml');
    return xmlToText(new TextDecoder('utf-8').decode(bytes));
  };
  /* Any file the editors accept: Word through the reader above, text as is. */
  window.hubFileText = function(file){
    if (/\.docx$/i.test(file.name)) return window.hubDocxText(file);
    return file.text();
  };
})();
