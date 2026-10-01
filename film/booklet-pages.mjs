/**
 * Connect Lite — the real Cambridge CELTA 5, photographed page by page.
 *
 *   node film/booklet-pages.mjs
 *
 * Ramy, 1 Oct 2026: "the PDF that shows at the end is not the Cambridge CELTA
 * 5 PDF. We have the original. Show the original... already completed with
 * everything, including the final declaration." So the film does not describe
 * the booklet; it shows the July 2023 form drawn in the browser from a
 * finished record, rendered to PNG, and holds the pages on screen as stills.
 *
 * Whose record. The film's last chapters are shot on the first candidate of
 * the cast, so the name comes from demo-finished-data.mjs rather than being
 * written here: a hard-coded name silently stopped matching the moment the
 * demo was recast (1 Oct 2026, the international cast), and the pages would
 * then carry nobody. Run this after any reseed of the finished course.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from '/Users/work/connect-Hub/node_modules/playwright/index.mjs';
const HERE = '/Users/work/connect-Hub/';
const OUT = HERE + 'film/stills/';
mkdirSync(OUT, { recursive: true });
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const call = async b => { for (let i = 0; i < 8; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r && (r.ok || r.error)) return r.result; } catch (e) {} await new Promise(r => setTimeout(r, 2500)); } throw new Error('store'); };
const { courses } = await call({ op: 'ownerCourses', owner: OWNER });
const c4 = courses.find(c => c.id === 'c4');
const roster = await call({ op: 'roster', key: c4.tutorKey });
const WANT = (await import(HERE + 'demo-finished-data.mjs')).CANDIDATES[0].name;
const who = Object.values(roster.trainees || {}).find(t => t && t.name === WANT);
if (!who) { console.log('c4 has no ' + WANT + ' on its roster — reseed it before drawing the booklet'); process.exit(1); }
console.log('drawing the booklet from ' + WANT + "'s finished record");
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const s = createServer((q, r) => { const n = decodeURIComponent((q.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html'; let b; try { b = readFileSync(join(HERE, n)); } catch { r.writeHead(404); return r.end('no'); } r.writeHead(200, { 'Content-Type': TYPES[extname(n)] || 'application/octet-stream' }); r.end(b); });
await new Promise(r => s.listen(0, r));
const br = await chromium.launch();
const p = await (await br.newContext({ viewport: { width: 1280, height: 950 } })).newPage();
p.on('console', m => { if (m.type() === 'error') console.log('page error: ' + m.text().slice(0, 150)); });
await p.goto(`http://127.0.0.1:${s.address().port}/20_celta5.html?k=${c4.tutorKey}&trainee=${who.token}`, { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(26000);
console.log('drawing the booklet…');
const b64 = await p.evaluate(async () => {
  const a = await window.HubStore.call({ op: 'celta5Assets' });
  const b = window.hubCelta5Pdf.fromBase64;
  const assets = { master: b(a['celta5-master-july-2023.pdf']), regular: b(a['Arimo-Regular.ttf']), bold: b(a['Arimo-Bold.ttf']) };
  const input = window.hubCelta5Debug && window.hubCelta5Debug.input ? window.hubCelta5Debug.input() : null;
  if (!input) return null;
  const bytes = await window.hubCelta5Pdf.render(input, assets);
  let bin = ''; const u = new Uint8Array(bytes);
  for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(bin);
}).catch(e => { console.log('build failed: ' + e.message); return null; });
await br.close(); s.close();
if (!b64) { console.log('no booklet came back — check hubCelta5Pdf.render'); process.exit(1); }
const pdf = OUT + 'celta5.pdf';
writeFileSync(pdf, Buffer.from(b64, 'base64'));
console.log('pdf: ' + (Buffer.from(b64, 'base64').length / 1024).toFixed(0) + ' KB');
execFileSync('python3', ['-c', `
import pypdfium2 as pdfium
d = pdfium.PdfDocument("${pdf}")
pages = [0, 1, 2, 3, 6, 9, 12]
for n in pages:
    if n >= len(d): continue
    img = d[n].render(scale=2).to_pil()
    img.save("${OUT}celta5-p%02d.png" % (n + 1))
    print("page", n + 1)
print("pages in the booklet:", len(d))
`], { encoding: 'utf8', stdio: 'inherit' });
