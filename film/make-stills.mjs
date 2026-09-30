/**
 * Connect Lite — the film's five stills, made rather than captured.
 *
 *   node film/make-stills.mjs
 *
 * The spec (DEMO-ANIMATION-SPEC.md) lists five frames that are not Lite
 * screens: the link sitting in a Classroom stream and in a Drive folder, a
 * tab with the Wi-Fi off, the exchange window with the brief pasted in, the
 * print dialog over the booklet, and the console card of a freshly cloned
 * course. They used to be "captured by hand"; this draws the first five as
 * pages of the film's own and photographs them at 1280 x 800, and takes the
 * last one for real: it clones the finished course, photographs its card on
 * the console, and deletes the clone. Nothing real appears: Elmswood, the
 * demo's names, a made-up stream.
 *
 * Output: film/stills/*.png, which scenes.js names in their `still` steps.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const HERE = new URL('..', import.meta.url).pathname;
const OUT = join(HERE, 'film', 'stills');
mkdirSync(OUT, { recursive: true });
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const call = async (b) => { for (let i = 0; i < 6; i++) { try { const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) }); return JSON.parse(await r.text()); } catch (e) { await new Promise(res => setTimeout(res, 3000)); } } return { ok: false, error: 'no JSON' }; };

const LINK = 'https://lite.celtaconnect.com/invite.html?k=••••';
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Newsreader:wght@600;700&family=Karla:wght@400;600;700&display=swap" rel="stylesheet">`;
const base = (body, extra = '') => `<!DOCTYPE html><html><head><meta charset="utf-8">${FONT}<style>
  html,body{margin:0;width:1280px;height:800px;overflow:hidden;font-family:Roboto,Arial,sans-serif;color:#1f1f1f;background:#fff;}
  .bar{height:64px;display:flex;align-items:center;gap:18px;padding:0 24px;border-bottom:1px solid #e0e0e0;}
  .bar b{font-size:20px;font-weight:500;color:#5f6368;} .bar .t{font-size:20px;}
  .lite{font-family:'Newsreader',Georgia,serif;color:#1e6b63;font-weight:700;}
  ${extra}</style></head><body>${body}</body></html>`;

/* 1. Classroom: a stream with the link as a post */
const classroom = base(`
  <div class="bar" style="background:#1e8e3e;color:#fff;border:0"><b style="color:#fff">CELTA — C/1 2026</b><span style="opacity:.85">Stream</span><span style="opacity:.85">Classwork</span><span style="opacity:.85">People</span></div>
  <div style="display:grid;grid-template-columns:260px 1fr;gap:24px;padding:24px 40px;">
    <div><div style="background:#fff;border:1px solid #dadce0;border-radius:8px;padding:16px;font-size:13px;color:#5f6368"><b style="color:#1f1f1f;font-size:14px">Upcoming</b><br><br>Due Wednesday<br>Focus on the Learner</div></div>
    <div>
      <div style="background:#fff;border:1px solid #dadce0;border-radius:8px;padding:18px 20px;margin-bottom:14px;">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px"><span style="width:36px;height:36px;border-radius:50%;background:#0b8043;color:#fff;display:grid;place-items:center;font-weight:500">J</span><div><b style="font-weight:500">Jordan Blake</b><div style="font-size:12px;color:#5f6368">2 Mar</div></div></div>
        <div style="font-size:14px;line-height:1.6">Everything for the course lives behind this one link. Keep it to yourself: it is your way in.<br><a style="color:#1a73e8">${LINK}</a></div>
        <div style="margin-top:12px;border:1px solid #dadce0;border-radius:8px;padding:12px 14px;display:flex;gap:14px;align-items:center;width:520px"><span style="width:40px;height:40px;border-radius:8px;background:#efe9dc;display:grid;place-items:center" class="lite">CL</span><div><div style="font-weight:500">Connect Lite — your invitation</div><div style="font-size:12px;color:#5f6368">lite.celtaconnect.com</div></div></div>
      </div>
      <div style="background:#fff;border:1px solid #dadce0;border-radius:8px;padding:18px 20px;color:#5f6368;font-size:14px">Diane Okonkwo posted a new material: <b style="color:#1f1f1f;font-weight:500">Input: the lesson framework</b></div>
    </div>
  </div>`);

/* 2. Drive: a folder with the link saved as a file */
const row = (icon, name, who, dt, sz) => `<div style="display:grid;grid-template-columns:1fr 140px 150px 90px;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f3f4;font-size:14px"><span style="display:flex;gap:12px;align-items:center">${icon}${name}</span><span style="color:#444746">${who}</span><span style="color:#444746">${dt}</span><span style="color:#444746;text-align:right">${sz}</span></div>`;
const folder = `<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#5f6368" d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;
const linkIcon = `<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#1a73e8" d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z"/></svg>`;
const drive = base(`
  <div class="bar"><b>Drive</b><span style="flex:1"></span><span style="color:#5f6368">Search in Drive</span></div>
  <div style="padding:20px 40px;"><div style="font-size:18px;color:#444746;margin-bottom:14px">My Drive &nbsp;›&nbsp; CELTA — C/1 2026 &nbsp;›&nbsp; <b style="color:#1f1f1f;font-weight:500">Course</b></div>
  <div style="border:1px solid #dadce0;border-radius:8px;overflow:hidden">
    <div style="display:grid;grid-template-columns:1fr 140px 150px 90px;gap:10px;padding:10px 16px;border-bottom:1px solid #e0e0e0;font-size:12px;color:#444746;font-weight:500"><span>Name</span><span>Owner</span><span>Last modified</span><span style="text-align:right">File size</span></div>
    ${row(linkIcon, '<b style="font-weight:500">Connect Lite — the course</b>', 'me', '2 Mar 2026', '—')}
    ${row(folder, 'Coursebook audio', 'me', '9 Feb 2026', '—')}
    ${row(folder, 'Input session slides', 'Diane', '20 Jan 2026', '—')}
    ${row(folder, 'Centre handbook', 'me', '3 Feb 2026', '—')}
  </div></div>`);

/* 3. the Wi-Fi off: the card as it stays, with the system's own sign of no network */
const wifi = base(`
  <div style="position:absolute;inset:0;background:#f8f5ee"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:38px;background:#2b2118;color:#fff;display:flex;align-items:center;justify-content:flex-end;gap:14px;padding:0 18px;font-size:13px"><span style="opacity:.8">Wi‑Fi</span><span style="display:inline-block;width:18px;height:18px;border-radius:50%;border:2px solid #fff;position:relative"><span style="position:absolute;left:3px;top:6px;width:10px;height:2px;background:#fff;transform:rotate(-45deg)"></span></span><span style="opacity:.8">Off</span></div>
  <div style="position:absolute;top:70px;left:140px;width:1000px;background:#fdfcf8;border:1px solid #e7e1d3;border-radius:16px;padding:36px 44px;font-family:Karla,sans-serif;">
    <div class="lite" style="font-size:22px">Connect <span style="font-size:12px;letter-spacing:.2em;color:#7a7166">LITE</span></div>
    <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7a7166;margin-top:22px;font-weight:700">Your invitation · tutor</div>
    <h1 style="font-family:Newsreader,Georgia,serif;font-size:34px;margin:8px 0 12px;color:#2b241c">CELTA — C/1 2026 at Elmswood English Centre</h1>
    <p style="font-size:17px;line-height:1.6;color:#2b241c;max-width:60ch">This link opens the course as a tutor: the dashboard, every candidate, the timetable, the assessor's pack. It is yours and your course admin's. Keep it; do not forward it.</p>
    <div style="margin-top:26px;display:inline-block;background:#1e6b63;color:#fff;font-weight:700;padding:14px 26px;border-radius:999px">Open the course</div>
    <div style="margin-top:34px;display:inline-flex;align-items:center;gap:8px;background:#2b2118;color:#fff;font-size:12px;font-weight:700;padding:7px 12px;border-radius:999px;opacity:.85">Offline — this page is kept on your device</div>
  </div>`);

/* 4. the exchange window: the brief pasted into a model, the trainer talking */
const exchange = base(`
  <div style="position:absolute;inset:0;background:#f7f7f8"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:52px;background:#fff;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;padding:0 22px;font-weight:500;color:#444">A model, any model</div>
  <div style="position:absolute;top:80px;left:200px;width:880px;">
    <div style="background:#e9e9ee;border-radius:16px;padding:16px 20px;font-size:14px;line-height:1.55;color:#222;white-space:pre-wrap;font-family:Roboto,Arial,sans-serif">Teaching practice 2 — Sofia Kuznetsova — A2 — Grammar: present simple, time expressions
Plan: lead-in (5) · present: clarify and focus on TL (8) · controlled practice (8) · freer practice (7) · feedback and error correction (10)
Self-evaluation: “The task was set before the handout went out… the clarification stage ran over.”
Please write the feedback: strengths and action points for planning, strengths and action points for teaching, a line on the self-evaluation, an overall comment.</div>
    <div style="margin-top:22px;display:flex;gap:14px;align-items:center;color:#666;font-size:14px"><span style="width:12px;height:12px;border-radius:50%;background:#c0392b;box-shadow:0 0 0 6px rgba(192,57,43,.18)"></span>Listening… “Right, so Sofia's lead-in was tight, she set the task before the paper, the clarification ran long…”</div>
  </div>`);

/* 5. the print dialog over the booklet */
const print = base(`
  <div style="position:absolute;inset:0;background:#f8f5ee"></div>
  <div style="position:absolute;top:40px;left:120px;width:600px;height:720px;background:#fff;border:1px solid #d9d1c1;box-shadow:0 4px 30px rgba(0,0,0,.12);padding:46px 52px;font-family:Arimo,Arial,sans-serif;color:#222">
    <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#666">Cambridge English</div>
    <div style="font-size:26px;font-weight:700;margin-top:14px">CELTA 5</div>
    <div style="font-size:13px;color:#444;margin-top:4px">Candidate Record Booklet · July 2023</div>
    <div style="margin-top:36px;font-size:13px;line-height:2.1"><b>Candidate name</b> &nbsp; Olivia Bennett<br><b>Centre</b> &nbsp; Elmswood English Centre &nbsp; <b>Centre number</b> &nbsp; TR999<br><b>Course number</b> &nbsp; 1 / 2026 &nbsp; <b>Dates</b> &nbsp; 10 August – 4 September 2026</div>
    <div style="margin-top:40px;border-top:1px solid #ddd;padding-top:16px;font-size:12px;color:#555;line-height:1.8">Stage 1 &nbsp; returned 14 August &nbsp; signed both sides<br>Stage 2 &nbsp; returned 26 August &nbsp; signed both sides<br>Stage 3 &nbsp; returned 3 September &nbsp; signed both sides<br>Final declaration &nbsp; 4 September &nbsp; signed both sides</div>
  </div>
  <div style="position:absolute;top:60px;right:120px;width:380px;background:#fff;border:1px solid #dadce0;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,.18);font-size:14px">
    <div style="padding:16px 20px;border-bottom:1px solid #e0e0e0;font-weight:500;font-size:16px">Print <span style="float:right;color:#5f6368;font-weight:400">13 pages</span></div>
    <div style="padding:14px 20px;display:grid;gap:16px;color:#3c4043">
      <div style="display:flex;justify-content:space-between"><span>Destination</span><b style="font-weight:500">Save as PDF</b></div>
      <div style="display:flex;justify-content:space-between"><span>Pages</span><span>All</span></div>
      <div style="display:flex;justify-content:space-between"><span>Layout</span><span>Portrait</span></div>
      <div style="display:flex;justify-content:space-between"><span>Paper size</span><span>A4</span></div>
      <div style="display:flex;justify-content:space-between"><span>Margins</span><span>Default</span></div>
    </div>
    <div style="padding:14px 20px;border-top:1px solid #e0e0e0;display:flex;justify-content:flex-end;gap:10px"><span style="padding:8px 16px;border:1px solid #dadce0;border-radius:4px;color:#1a73e8">Cancel</span><span style="padding:8px 18px;background:#1a73e8;color:#fff;border-radius:4px">Save</span></div>
  </div>`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
for (const [name, html] of [['classroom-stream', classroom], ['drive-folder', drive], ['wifi-off', wifi], ['exchange-window', exchange], ['print-dialog', print]]) {
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, name + '.png') });
  console.log('made ' + name + '.png');
}

/* 6. the next course, for real: clone the finished course, photograph its card, delete it */
const list = (await call({ op: 'ownerCourses', owner: OWNER })).result.courses;
const finished = list.find(c => c.name === 'Finished course — the film, part five');
if (finished) {
  const made = await call({ op: 'cloneCourse', owner: OWNER, from: finished.id });
  const clone = made.ok ? made.result : null;
  if (!clone || !clone.id) console.log('could not clone: ' + (made.error || JSON.stringify(made).slice(0, 120)));
  else {
    await page.goto('https://lite.celtaconnect.com/14_owner.html?o=' + OWNER, { waitUntil: 'domcontentloaded', timeout: 60000 });
    for (let i = 0; i < 40; i++) { const n = await page.evaluate(() => document.querySelectorAll('.course').length); if (n > list.length) break; await page.waitForTimeout(1500); }
    await page.waitForTimeout(1200);
    const card = await page.evaluate((id) => { const b = document.querySelector('[data-clone="' + id + '"]'); const el = b && b.closest('.course'); if (!el) return null; el.classList.remove('minted'); el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -20); const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, clone.id);
    if (card) { await page.screenshot({ path: join(OUT, 'next-course-card.png'), clip: { x: Math.max(0, card.x - 20), y: Math.max(0, card.y - 20), width: Math.min(1280, card.w + 40), height: Math.min(800, card.h + 40) } }); console.log('made next-course-card.png from ' + clone.id); }
    else console.log('the clone did not appear on the console');
    const del = await call({ op: 'deleteCourse', owner: OWNER, course: clone.id, confirm: clone.id });
    console.log((del.ok ? 'deleted ' : 'could NOT delete ') + clone.id + (del.ok ? '' : ': ' + del.error));
  }
}
await browser.close();
