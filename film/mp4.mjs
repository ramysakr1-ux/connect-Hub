/**
 * Connect Lite — the film as MP4.
 *
 *   node film/mp4.mjs film/connect-lite-film.webm
 *
 * The cut is VP8 + Opus in WebM. Safari will not decode Opus inside WebM, so
 * the music vanished, and a 60 MB WebM streams badly from GitHub Pages, so it
 * stalled (Ramy, 2 Oct 2026: "it froze a lot and also the music was gone").
 * MP4 with H.264 and AAC plays everywhere with hardware decoding.
 *
 * The browser is still the encoder: Playwright's own ffmpeg writes VP8 and
 * nothing else, but the installed Google Chrome records MediaRecorder output
 * as MP4 (avc1 + mp4a). This plays the cut in that Chrome and records it, in
 * real time, so it takes as long as the film.
 */
import { readFileSync, statSync, appendFileSync, rmSync, existsSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const FILE = process.argv[2];
if (!FILE) { console.log('name the cut: node film/mp4.mjs film/connect-lite-film.webm'); process.exit(1); }
const OUT = FILE.replace(/\.webm$/, '.mp4');
const SECONDS = Number(process.argv[3] || 0); // a short test run stops here
if (existsSync(OUT)) rmSync(OUT);

const server = createServer((rq, rs) => {
  const size = statSync(FILE).size;
  const range = /bytes=(\d+)-(\d*)/.exec(rq.headers.range || '');
  const buf = readFileSync(FILE);
  if (range) {
    const a = Number(range[1]), b = range[2] ? Number(range[2]) : size - 1;
    rs.writeHead(206, { 'Content-Type': 'video/webm', 'Content-Range': `bytes ${a}-${b}/${size}`, 'Content-Length': b - a + 1, 'Accept-Ranges': 'bytes', 'Access-Control-Allow-Origin': '*' });
    rs.end(buf.subarray(a, b + 1));
  } else {
    rs.writeHead(200, { 'Content-Type': 'video/webm', 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Access-Control-Allow-Origin': '*' });
    rs.end(buf);
  }
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: 400, height: 300 } })).newPage();
await page.exposeFunction('mp4Chunk', (b64) => { appendFileSync(OUT, Buffer.from(b64, 'base64')); });
await page.exposeFunction('mp4Say', (s) => console.log(s));
await page.setContent(`<body style="margin:0;background:#111"><video id="v" crossorigin="anonymous" style="width:200px" src="http://127.0.0.1:${port}/cut.webm"></video></body>`);
await page.waitForFunction(() => { const v = document.getElementById('v'); return v.readyState >= 2 && isFinite(v.duration); }, null, { timeout: 120000 });
const dur = await page.evaluate(() => document.getElementById('v').duration);
console.log('cut ' + Math.floor(dur / 60) + ':' + String(Math.round(dur % 60)).padStart(2, '0') + ' — recording as MP4');

await page.evaluate((SECONDS) => new Promise((done, fail) => {
  const v = document.getElementById('v');
  const type = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4'].find(t => MediaRecorder.isTypeSupported(t));
  if (!type) return fail(new Error('this Chrome cannot record MP4'));
  /* The picture straight from the element (no canvas round trip, which
     washes the colour -- see cut.mjs); the sound through WebAudio, because a
     headless Chrome gives captureStream() no audio track of its own. */
  const stream = new MediaStream(v.captureStream().getVideoTracks());
  const ac = new AudioContext();
  const dest = ac.createMediaStreamDestination();
  ac.createMediaElementSource(v).connect(dest);
  stream.addTrack(dest.stream.getAudioTracks()[0]);
  const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 1100000, audioBitsPerSecond: 128000 });
  let bytes = 0, pending = Promise.resolve();
  rec.ondataavailable = (e) => {
    if (!e.data || !e.data.size) return;
    bytes += e.data.size;
    pending = pending.then(() => e.data.arrayBuffer()).then((buf) => {
      const u = new Uint8Array(buf); let s = '';
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return window.mp4Chunk(btoa(s));
    });
  };
  rec.onerror = (e) => fail(e.error || new Error('recorder error'));
  rec.onstop = () => { pending.then(() => { window.mp4Say('recorded ' + (bytes / 1048576).toFixed(1) + ' MB as ' + type + ' (' + stream.getAudioTracks().length + ' audio track)'); done(); }); };
  v.onended = () => setTimeout(() => rec.stop(), 600);
  if (SECONDS > 0) setTimeout(() => { v.pause(); rec.stop(); }, SECONDS * 1000);
  let last = -10;
  v.ontimeupdate = () => { if (v.currentTime - last >= 30) { last = v.currentTime; window.mp4Say('  ' + Math.round(v.currentTime) + 's'); } };
  ac.resume().then(() => v.play()).then(() => rec.start(1000)).catch(fail);
}), SECONDS);
await browser.close();
server.close();
/* MediaRecorder writes a fragmented MP4: it plays, but Chrome reads its
   length from the track headers and Safari adds those to the fragments, so no
   header patch suits both, and macOS's avconvert gave up a third of the way
   through every time (2 Oct 2026). film/flatten.mjs rewrites the same bytes
   as a plain, moov-first MP4 with ordinary sample tables. */
const FRAG = OUT.replace(/\.mp4$/, '-fragmented.mp4');
renameSync(OUT, FRAG);
const r = spawnSync(process.execPath, [new URL('./flatten.mjs', import.meta.url).pathname, FRAG, OUT], { encoding: 'utf8' });
if (r.status !== 0 || !existsSync(OUT)) { console.log('flatten failed: ' + (r.stderr || r.stdout)); process.exit(1); }
rmSync(FRAG);
console.log((r.stdout || '').trim());
console.log('wrote ' + OUT + ' (' + (statSync(OUT).size / 1048576).toFixed(1) + ' MB)');
