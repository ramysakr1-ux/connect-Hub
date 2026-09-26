/**
 * Give the demo course's plans real materials on Drive.
 *
 *   node demo-materials.mjs <tutor key>            what it would do
 *   node demo-materials.mjs <tutor key> --write    do it
 *
 * The mint wrote plausible-looking Drive links — .../file/d/1DefneY3Lite/view —
 * and they point at nothing, so "Open the materials" 404s and the preview pane
 * stays blank. That is fine in a screenshot and fatal on film.
 *
 * This uploads a real one-page worksheet for each plan that has a link, through
 * the store's own putMaterial: it lands in the course's Drive folder, is shared
 * "anyone with the link can view" by the store, and the plan's link is rewritten
 * to the URL Drive gives back. Nothing is faked and nothing is hand-shared.
 *
 * The worksheet is built here rather than shipped as a binary, so the repo
 * carries no blobs and the text can follow the lesson each candidate planned.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!KEY || KEY.startsWith('--')) { console.log('usage: node demo-materials.mjs <tutor key> [--write]'); process.exit(1); }

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const call = async (b, tries = 6) => {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};

/* A one-page PDF, written by hand: five objects and a correct xref, which is
   all a worksheet needs and avoids a dependency for eleven lines of text. */
function pdf(title, lines) {
  const esc = s => String(s).replace(/([\\()])/g, '\\$1').replace(/[^\x20-\x7e]/g, '-');
  let text = 'BT /F1 16 Tf 62 742 Td (' + esc(title) + ') Tj ET\n';
  let y = 706;
  lines.forEach(l => {
    const size = l.startsWith('# ') ? 12 : 11;
    const body = l.startsWith('# ') ? l.slice(2) : l;
    if (l === '') { y -= 10; return; }
    text += 'BT /F' + (l.startsWith('# ') ? '1' : '2') + ' ' + size + ' Tf 62 ' + y + ' Td (' + esc(body) + ') Tj ET\n';
    y -= l.startsWith('# ') ? 26 : 19;
  });
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    null,                                            /* the stream, built below */
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  objs[3] = '<< /Length ' + text.length + ' >>\nstream\n' + text + 'endstream';
  let out = '%PDF-1.4\n', offsets = [];
  objs.forEach((body, i) => { offsets.push(out.length); out += (i + 1) + ' 0 obj\n' + body + '\nendobj\n'; });
  const xref = out.length;
  out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
  offsets.forEach(o => { out += String(o).padStart(10, '0') + ' 00000 n \n'; });
  out += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  return Buffer.from(out, 'latin1');
}

const roster = await call({ op: 'roster', key: KEY });
if (!roster.ok) { console.log('could not read the roster: ' + roster.error); process.exit(1); }
const people = Object.values(roster.result.trainees || {}).sort((a, b) => a.name.localeCompare(b.name));

const FAKE = /drive\.google\.com\/file\/d\/1[A-Za-z]+\d?Lite\/view/;
let done = 0, skipped = 0;

for (const who of people) {
  const plan = (who.records || {}).plan;
  const link = plan && plan.state && plan.state.plan && plan.state.plan.matsLink;
  if (!link) { skipped++; continue; }
  if (!FAKE.test(link)) { console.log(who.name + ': already real — ' + link.slice(0, 60)); skipped++; continue; }

  const tp = (plan.state.plan.tp || plan.state.meta && plan.state.meta.tp || '').toString().replace(/[^0-9]/g, '') || '?';
  const aim = String((plan.state.plan.mainAim || '')).replace(/\s+/g, ' ').trim().slice(0, 78);
  const file = pdf('Handout 1 — ' + who.name.split(' ')[0] + ', teaching practice ' + tp, [
    '# What this is',
    'The worksheet the candidate wrote for this lesson, attached to the plan so',
    'the tutor opens it beside the procedure rather than hunting for it.',
    '',
    '# The lesson it belongs to',
    aim || 'See the lesson plan this is attached to.',
    '',
    '# Task 1 — before you read',
    'In pairs: which of these have you done this week? Tell your partner.',
    '',
    '# Task 2 — read for the gist',
    'Read once. What is the writer\'s overall point? One sentence.',
    '',
    '# Task 3 — read for detail',
    '1  Where does the writer live now?',
    '2  What does she miss most?',
    '3  How long was the journey?',
    '4  What would she change?',
    '',
    'Connect Lite demonstration course — this is a real file on Drive, shared',
    'by the store as anyone with the link can view.',
  ]);

  console.log(who.name + ': ' + (WRITE ? 'uploading' : 'would upload') + ' ' + file.length + ' bytes (was ' + link.slice(-24) + ')');
  if (!WRITE) { done++; continue; }

  const up = await call({ op: 'putMaterial', token: who.token, name: 'Handout 1 — TP' + tp + '.pdf', type: 'application/pdf', bytes: file.toString('base64') }, 3);
  if (!up.ok) { console.log('   upload failed: ' + up.error); continue; }
  const url = (up.result || {}).url;
  if (!url) { console.log('   no url came back'); continue; }

  const next = JSON.parse(JSON.stringify(plan));
  next.state.plan.matsLink = url;
  /* The stored document has the old link printed into it too — the plan the
     tutor reads is that HTML, not the state. */
  if (next.docHTML) next.docHTML = next.docHTML.split(link).join(url);
  const put = await call({ op: 'put', key: KEY, token: who.token, kind: 'plan', data: next });
  console.log(put.ok ? '   -> ' + url : '   write failed: ' + put.error);
  if (put.ok) done++;
}
console.log('\n' + done + ' plans given real materials, ' + skipped + ' left alone' + (WRITE ? '' : '  (dry run)'));
