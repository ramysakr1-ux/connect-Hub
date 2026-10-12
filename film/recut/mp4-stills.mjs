// Frames from a finished MP4 at given seconds (Chrome decodes H.264), side by side in one PNG.
//   node mp4-stills.mjs <file.mp4> <out.png> 2 10 20 ...
import { createRequire } from 'node:module'; import { createServer } from 'node:http'; import { readFileSync, statSync } from 'node:fs';
const { chromium } = createRequire('/Users/work/connect-Hub/package.json')('playwright');
const [FILE, OUT, ...TIMES] = process.argv.slice(2);
const srv = createServer((q, r) => { if (q.url === '/') { r.writeHead(200, { 'Content-Type': 'text/html' }); r.end('<video id="v" src="/v.mp4" muted preload="auto"></video><canvas id="c"></canvas>'); return; } const buf = readFileSync(FILE); const m = /bytes=(\d+)-(\d*)/.exec(q.headers.range || '');
  if (m) { const a = +m[1], b = m[2] ? +m[2] : buf.length - 1; r.writeHead(206, { 'Content-Type': 'video/mp4', 'Content-Range': `bytes ${a}-${b}/${buf.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 }); r.end(buf.subarray(a, b + 1)); }
  else { r.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': buf.length, 'Accept-Ranges': 'bytes' }); r.end(buf); } });
await new Promise(r => srv.listen(0, r));
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1600, height: 700 } });
await p.goto(`http://127.0.0.1:${srv.address().port}/`);
const png = await p.evaluate(async (T) => {
  const v = document.getElementById('v'); await new Promise(r => v.readyState >= 1 ? r() : v.onloadedmetadata = r);
  const w = 216, h = 384, c = document.getElementById('c'); c.width = T.length * (w + 6); c.height = h; const g = c.getContext('2d'); g.fillStyle = '#222'; g.fillRect(0, 0, c.width, h);
  for (let i = 0; i < T.length; i++) { v.currentTime = T[i]; await new Promise(r => v.onseeked = r); g.drawImage(v, i * (w + 6), 0, w, h); }
  return c.toDataURL('image/png') + '|' + v.duration;
}, TIMES.map(Number));
const [data, dur] = png.split('|'); (await import('node:fs')).writeFileSync(OUT, Buffer.from(data.split(',')[1], 'base64'));
console.log('duration', (+dur).toFixed(1), 's'); await b.close(); srv.close();
