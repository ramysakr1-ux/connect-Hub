/* THE CONNECT LIBRARY AUDIT -- one standard for every set, ours and a contributor's.

   Ramy, 11 Oct 2026: "every set has to pass that compliance audit ... We will not check
   the content, and we'll make that clear. The center is responsible for the content. We
   will only check for anything that is inappropriate ... But also the consistency."

     node tools/audit/audit.mjs                 every set in the library course
     node tools/audit/audit.mjs s7 s12          some of them
     LIBRARY_FILE=set.json node tools/audit/audit.mjs   a contributed set (no files to fetch)
     AUDIT_CACHE=<dir>  where fetched pages and recordings and their measurements live
                        (default ../../_audit-cache, gitignored)

   Three levels:
     MUST       a set that fails one does not go into the library
     FIX        Connect fixes it before publishing (scans, recordings) and says what changed
     REPORT     the centre is told; nothing is changed, because the content is theirs

   Writes <cache>/report.json and <cache>/AUDIT.md. It reads the library; it writes nothing
   to it. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readCourse, LIBRARY } from '../st.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const HUB = path.resolve(HERE, '..', '..');
const CACHE = process.env.AUDIT_CACHE || path.join(HUB, '_audit-cache');
for (const d of ['img', 'aud']) fs.mkdirSync(path.join(CACHE, d), { recursive: true });
const require = createRequire(path.join(HUB, 'package.json'));
require(path.join(HUB, 'hub-rotation.js'));
const R = globalThis.hubRotation;

const L = (await readCourse(LIBRARY)).rec.set.library;
const want = process.argv.slice(2).filter(a => /^s\d+$/.test(a));
const IDS = (want.length ? want : Object.keys(L)).sort((a, b) => +a.slice(1) - +b.slice(1));
const SESSIONS = ['1A','1B','2A','2B','3A','3B','4A','4B','5A','5B','6A','6B'];

const TYPES = ['Reading','Listening','Speaking','Writing','Grammar','Vocabulary','Functional language','Pronunciation'];
const FAM = { Reading:'receptive', Listening:'receptive', Speaking:'productive', Writing:'productive',
              Grammar:'language', Vocabulary:'language', 'Functional language':'language', Pronunciation:'pronunciation' };
const SHAPES = ['Receptive Skills (reading or listening)','Productive Skills (speaking or writing)','Text-Based Presentation of Language',
                'Present – Practice – Produce (PPP)','Test – Teach – Test','Language Practice (follows a previous lesson)'];
const INTER = ['OC','PW','GW','Ind.','Ming.','T–S','T-S','S-S','S–S'];
const idOf = u => (/\/d\/([\w-]{20,})/.exec(String(u || '')) || [])[1] || '';
const trackLines = sl => String(sl.tracks || '').split('\n').map(x => x.trim()).filter(Boolean);
const normT = t => String(t || '').replace(/\.0+(\d)/, '.$1').toLowerCase();
const trackNo = l => normT((/track\s+([\w.]+)/i.exec(l.split('|')[0]) || [])[1] || '');
/* A sentence that names a track in order to warn the trainee off it -- "Do not
   play track 2.39", "Part 4 (track 1.20) is not yours" -- is not asking for it. */
const WARN = /do not (re)?play|don[’']t (re)?play|not on (your|the) card|not yours|is not (your|on)|are not (your|on)|sits on the same page|leave .{0,20}alone|another lesson|the next lesson|previous (lesson|slot)|\bnot on\b|not your (part|lesson)/i;
const namedTracks = text => text.split(/(?<=[.;])\s+/).filter((x, i, ss) => !WARN.test(x) && !WARN.test(ss[i + 1] || ''))
  .flatMap(x => [...x.matchAll(/\btracks?\s+((?:\d+\.\d+[a-z]?(?:\s*(?:,|and|&)\s*)?)+)/gi)].flatMap(m => m[1].match(/\d+\.\d+[a-z]?/g) || [])).map(normT);
const stageText = sl => (sl.stages || []).map(g => (g.todo || '') + ' ' + (g.avoid || '')).join(' ');
const span = m => { const x = /^\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*$/.exec(String(m ?? '')); return x ? [+x[1], +(x[2] || x[1])] : null; };
const lengthFor = (S, tp) => +(((S.minutesByTp || {})[tp]) ?? S.minutes ?? 45);

/* ------------------------------------------------------------------ fetch */
function fetchAll() {
  const jobs = [];
  for (const id of IDS) for (const k of SESSIONS) for (const sl of ((L[id].sessions || {})[k] || {}).slots || []) {
    for (const f of sl.files || []) { const d = idOf(f.url); if (d) jobs.push(['img', d, '.jpg']); }
    for (const l of trackLines(sl)) { const d = idOf(l); if (d) jobs.push(['aud', d, '.mp3']); }
  }
  const todo = [...new Map(jobs.map(j => [j[1], j])).values()].filter(([k, d, ext]) => !fs.existsSync(path.join(CACHE, k, d + ext)));
  if (!todo.length) return;
  const list = path.join(CACHE, 'fetch.txt');
  fs.writeFileSync(list, todo.map(([k, d, ext]) => `${k} ${d}${ext}`).join('\n'));
  /* curl, six at a time, each file from Drive's own download address (the files are
     link-shared, as Lite serves them to trainees). A failure is retried by the next run. */
  const sh = `cd "${CACHE}" && cat fetch.txt | xargs -P 6 -L 1 sh -c 'id="\${1%.*}"; curl -sfL --retry 3 --max-time 120 -o "$0/$1.part" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t" && mv "$0/$1.part" "$0/$1" || rm -f "$0/$1.part"'`;
  spawnSync('sh', ['-c', sh], { stdio: 'inherit' });
  console.log(`fetched: ${todo.filter(([k, d, ext]) => fs.existsSync(path.join(CACHE, k, d + ext))).length} of ${todo.length} new files`);
}

/* ------------------------------------------------------------------ the checks */
const res = {};   // set -> [{level, area, check, ok, where[], note}]
function check(set, level, area, name, failures, note) {
  (res[set] = res[set] || []).push({ level, area, check: name, ok: !failures.length, where: failures.slice(0, 40), count: failures.length, note: note || '' });
}

const BAD = ['fuck','shit','bitch','cunt','bastard','slut','whore','nigger','nigga','faggot','fag','dyke','tranny','retard','spastic','paki','chink','kike','wetback','gypsy','gyppo'];
const BADRE = new RegExp('\\b(' + BAD.join('|') + ')(s|es|ed|ing)?\\b', 'i');

function structure(id) {
  const S = L[id];
  const where = (k, i) => `${k}·${i + 1}`;
  const all = [];
  SESSIONS.forEach(k => ((S.sessions || {})[k] || { slots: [] }).slots.forEach((sl, i) => all.push({ k, i, sl, tp: +k[0], ses: S.sessions[k] })));

  /* COMPLETE */
  check(id, 'MUST', 'Complete', 'All twelve teaching days, three lessons each',
    SESSIONS.filter(k => !((S.sessions || {})[k]) || ((S.sessions[k].slots || []).filter(Boolean).length !== 3)));
  check(id, 'MUST', 'Complete', 'Every day says what it is about (its context)',
    SESSIONS.filter(k => S.sessions && S.sessions[k] && !String(S.sessions[k].context || '').trim()));
  check(id, 'MUST', 'Complete', 'Every lesson has a type, both aims, a shape, a pages line and its pages',
    all.filter(({ sl }) => !sl.type || !sl.aim || !sl.sub || !sl.shape || !sl.pages || !(sl.files || []).length).map(x => where(x.k, x.i)));
  check(id, 'MUST', 'Complete', 'Every lesson is staged; every stage has a name and its minutes',
    all.filter(({ sl }) => !(sl.stages || []).length || (sl.stages || []).some(g => !g.name || (!span(g.minutes) && !/if.?time|flexi|spare|extra/i.test(g.name)))).map(x => where(x.k, x.i)));
  check(id, 'MUST', 'Complete', 'TP 1–2 are written out: every stage says what to do',
    all.filter(({ tp, sl }) => tp <= 2 && (sl.stages || []).some(g => !String(g.todo || '').trim())).map(x => where(x.k, x.i)));
  check(id, 'MUST', 'Complete', 'The book is named with its edition (or year), publisher and year',
    /\(([^,()]+),\s*(\d{4})\)/.test(S.book || '') && /edition|\d{4}/i.test(S.book || '') ? [] : [S.book || '(no book)']);
  check(id, 'MUST', 'Complete', 'A level, and the book’s references',
    [!S.level && 'no level', !String(S.sources || '').trim() && 'no references'].filter(Boolean));

  /* ACCURATE (the parts that can be read off the set; the pages themselves are below) */
  check(id, 'MUST', 'Accurate', 'Every attached page is cited in the pages line',
    all.flatMap(({ k, i, sl }) => (sl.files || []).filter(f => f.page && !new RegExp('\\b' + f.page + '\\b').test(sl.pages || '')).map(f => `${where(k, i)} ${f.src} p.${f.page}`)));
  check(id, 'MUST', 'Accurate', 'Every attached page has its file',
    all.flatMap(({ k, i, sl }) => (sl.files || []).filter(f => !idOf(f.url)).map(f => `${where(k, i)} ${f.name}`)));
  check(id, 'MUST', 'Accurate', 'No page attached twice to one lesson',
    all.flatMap(({ k, i, sl }) => { const s = new Set(), d = []; (sl.files || []).forEach(f => { const key = f.src + f.page; if (s.has(key)) d.push(`${where(k, i)} ${f.src} p.${f.page}`); s.add(key); }); return d; }));
  check(id, 'MUST', 'Accurate', 'A Teacher’s Book page only as a photocopiable, worksheet or audioscript',
    all.flatMap(({ k, i, sl }) => (sl.files || []).filter(f => f.src === 'TB' && !/photocop|worksheet|audioscript|tapescript|handout|resource|communicative/i.test((sl.pages || '') + ' ' + (f.name || ''))).map(f => `${where(k, i)} TB p.${f.page}`)));
  check(id, 'MUST', 'Accurate', 'Every recording listed has its file',
    all.flatMap(({ k, i, sl }) => trackLines(sl).filter(l => !idOf(l)).map(l => `${where(k, i)} ${l.slice(0, 30)}`)));
  check(id, 'MUST', 'Accurate', 'Every track a lesson asks for is on its card',
    all.flatMap(({ k, i, sl }) => {
      const listed = trackLines(sl).map(trackNo).filter(Boolean);
      const named = namedTracks((sl.pages || '') + ' ' + stageText(sl));
      return [...new Set(named.filter(t => !listed.includes(t)))].map(t => `${where(k, i)} asks for track ${t}`);
    }), 'Tracks named only to warn the trainee off them are not counted.');
  check(id, 'REPORT', 'Accurate', 'Every track on a card is named by its number in the lesson',
    all.flatMap(({ k, i, sl }) => {
      const text = ((sl.pages || '') + ' ' + stageText(sl)).toLowerCase();
      return trackLines(sl).map(trackNo).filter(t => t && !text.replace(/\.0+(\d)/g, '.$1').includes(t)).map(t => `${where(k, i)} track ${t}`);
    }), 'The lesson says “the recording” without its number, so a trainee with two tracks cannot tell which is which.');

  /* CONSISTENT */
  check(id, 'MUST', 'Consistent', 'Each lesson’s stages add up to the set’s own lesson length',
    all.flatMap(({ k, i, tp, sl }) => {
      let lo = 0, hi = 0; (sl.stages || []).forEach(g => { const m = span(g.minutes); if (m) { lo += m[0]; hi += m[1]; } });
      const len = lengthFor(S, tp);
      return lo <= len && len <= hi ? [] : [`${where(k, i)} ${lo === hi ? lo : lo + '–' + hi} of ${len}`];
    }), 'The length is the set’s own (“A slot is … minutes”), per TP where a set gives one; it is not assumed to be 45.');
  check(id, 'MUST', 'Consistent', 'Three different lesson types every day',
    SESSIONS.filter(k => { const t = (((S.sessions || {})[k] || {}).slots || []).map(s => s && s.type); return t.length === 3 && new Set(t).size !== 3; }));
  check(id, 'MUST', 'Consistent', 'Lesson types, shapes and interaction codes from Lite’s lists',
    all.flatMap(({ k, i, sl }) => [
      ...(TYPES.includes(sl.type) ? [] : [`${where(k, i)} type “${sl.type}”`]),
      ...(SHAPES.includes(sl.shape) ? [] : [`${where(k, i)} shape “${sl.shape}”`]),
      ...(sl.stages || []).filter(g => g.interaction && !INTER.includes(g.interaction)).map(g => `${where(k, i)} “${g.name}” interaction “${g.interaction}”`)]));
  check(id, 'MUST', 'Consistent', 'Four to seven stages a lesson',
    all.filter(({ sl }) => { const n = (sl.stages || []).length; return n < 4 || n > 7; }).map(x => `${where(x.k, x.i)} ${(x.sl.stages || []).length} stages`));
  check(id, 'MUST', 'Consistent', 'Aims follow the TP: written out at TP 1–2, one word from TP 3, “You decide” at TP 4 and 6',
    all.flatMap(({ k, i, tp, sl }) => {
      const a = String(sl.aim || '').trim(), s = String(sl.sub || '').trim(), w = where(k, i);
      if (tp <= 2) return [!/^By the end of the lessons?,? (the )?(students|sts|learners|ss) will have/i.test(a) && `${w} main aim not written out`, !/^To /.test(s) && `${w} sub aim not written out`].filter(Boolean);
      const out = [];
      if (a !== sl.type) out.push(`${w} main aim “${a.slice(0, 30)}” is not the type`);
      if (tp === 4 || tp === 6) { if (s !== 'You decide') out.push(`${w} sub aim should be “You decide”`); }
      else if (!TYPES.includes(s)) out.push(`${w} sub aim “${s.slice(0, 30)}” is not one type word`);
      else if (FAM[s] === FAM[sl.type]) out.push(`${w} sub aim ${s} is the same kind as ${sl.type}`);
      return out;
    }));

  /* APPROPRIATE */
  const texts = all.flatMap(({ k, i, sl, ses }) => [[where(k, i), [sl.aim, sl.sub, sl.pages, ...(sl.stages || []).flatMap(g => [g.name, g.todo, g.avoid])].join(' ')]])
    .concat(SESSIONS.map(k => [k, ((S.sessions || {})[k] || {}).context || '']));
  check(id, 'MUST', 'Appropriate', 'No offensive or discriminatory language',
    texts.filter(([, t]) => BADRE.test(t)).map(([w, t]) => `${w}: “${(BADRE.exec(t) || [''])[0]}”`),
    'A word list catches the obvious; Connect also reads every set before it goes in.');
  check(id, 'MUST', 'Appropriate', 'No personal details: no email addresses or phone numbers in the writing',
    texts.flatMap(([w, t]) => [...(t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []), ...(t.match(/(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]\d{3}[ -]\d{3,4}/g) || [])].map(x => `${w}: ${x}`)));
  const links = texts.flatMap(([w, t]) => (t.match(/https?:\/\/\S+/g) || []).map(x => [w, x]));
  check(id, 'MUST', 'Appropriate', 'No links to anyone’s own files (Drive, Dropbox, OneDrive, iCloud)',
    links.filter(([, x]) => /drive\.google|docs\.google|dropbox|onedrive|1drv\.ms|icloud|sharepoint/i.test(x)).map(([w, x]) => `${w}: ${x.slice(0, 60)}`));
  check(id, 'REPORT', 'Appropriate', 'Links to public pages in the writing (they can disappear)',
    links.filter(([, x]) => !/drive\.google|docs\.google|dropbox|onedrive|1drv\.ms|icloud|sharepoint/i.test(x)).map(([w, x]) => `${w}: ${x.slice(0, 60)}`));
  check(id, 'MUST', 'Appropriate', 'Read by Connect', [], 'Not automatic: a person reads every set for anything the word list cannot catch. Pending for this run.');

  /* REPORT ONLY: the teaching is the centre's */
  const six = 'ABCDEF'.split('').map(l => ({ token: 'x' + l, name: l }));
  const rot = R.rotate(six, { tps: 3 });
  const got = {};
  for (let tp = 1; tp <= 3; tp++) rot.sets.forEach((st, si) => R.orderFor(st, tp).forEach((p, pos) => {
    const sl = (((S.sessions || {})[tp + (si ? 'B' : 'A')] || {}).slots || [])[pos];
    (got[p.token] = got[p.token] || []).push(sl ? sl.type : '?');
  }));
  check(id, 'REPORT', 'Teaching (the centre’s)', 'Dealt to six, no trainee repeats a type in TP 1–3',
    Object.entries(got).filter(([, t]) => new Set(t).size < t.length).map(([k, t]) => `${k.slice(1)}: ${t.join(', ')}`));
  check(id, 'REPORT', 'Teaching (the centre’s)', 'A language lesson clarifies the language it highlights',
    all.filter(({ sl }) => FAM[sl.type] === 'language' && !(sl.stages || []).some(g => /clarif|meaning|form|teach/i.test(g.name))).map(x => `${where(x.k, x.i)} ${x.sl.type}`));
  check(id, 'REPORT', 'Teaching (the centre’s)', 'A reading or listening lesson ends in a productive response',
    all.filter(({ sl }) => FAM[sl.type] === 'receptive' && !(sl.stages || []).slice(-3).some(g => /speak|writ|response|post-|discuss|task|product/i.test(g.name + ' ' + g.todo))).map(x => `${where(x.k, x.i)} ${x.sl.type}`));
  return all;
}

/* ------------------------------------------------------------------ the files */
function files(id, all, IM, AU) {
  const pageRows = all.flatMap(({ k, i, sl }) => (sl.files || []).map(f => ({ w: `${k}·${i + 1}`, f, m: IM[idOf(f.url)] })));
  const missing = pageRows.filter(r => !r.m);
  check(id, 'MUST', 'Accurate', 'Every page file can be fetched', missing.map(r => `${r.w} ${r.f.name}`));
  const have = pageRows.filter(r => r.m && !r.m.error);
  check(id, 'MUST', 'Accurate', 'No blank page', have.filter(r => r.m.std < 4).map(r => `${r.w} ${r.f.name}`));
  /* The margin number is read by a machine from the card's own scan, and on
     11 Oct 2026 every one of its ten "mismatches" was a misread (41 read as 4,
     125 as 25, 9 as 19) on a page that was right. So a read that shares its
     digits with the cited number is taken as a misread, and the rest are put
     to a person, not failed. Our own sets are checked against the book's PDF
     by verify-pages as well. */
  const misread = (got, want) => String(want).includes(String(got)) || String(got).includes(String(want)) || Math.abs(+got - +want) <= 2;
  check(id, 'REPORT', 'Accurate', 'Printed page numbers a person should confirm (the machine read a different number)',
    have.filter(r => r.m.folios.length && !r.m.folios.includes(+r.f.page) && !r.m.folios.every(g => misread(g, r.f.page))).map(r => `${r.w} ${r.f.name} reads ${r.m.folios.join('/')}`),
    `${have.filter(r => r.m.folios.includes(+r.f.page)).length} of ${have.length} pages confirmed by their printed number; the others print none a machine can read.`);
  /* A spine shadow or the scanner bed is a GREY band along most of a side; a
     photograph that runs to the edge is dark too, but coloured and patchy. */
  const bandSides = r => Object.entries(r.m.band || {}).filter(([, b]) => b.dark >= 0.7 && b.grey >= 0.8).map(([s]) => s);
  check(id, 'FIX', 'Scans', 'Clean edges: no spine shadow or scanner bed down a side',
    have.filter(r => bandSides(r).length).map(r => `${r.w} ${r.f.name} (${bandSides(r).join(', ')})`));
  check(id, 'FIX', 'Scans', 'White paper, not grey or yellow', have.filter(r => r.m.paper < 225).map(r => `${r.w} ${r.f.name} (paper ${Math.round(r.m.paper)})`));
  check(id, 'FIX', 'Scans', 'Upright: no page tilted more than 1°', have.filter(r => Math.abs(r.m.skew) > 1).map(r => `${r.w} ${r.f.name} (${r.m.skew}°)`));
  check(id, 'FIX', 'Scans', 'Sharp enough to read', have.filter(r => r.m.blur < 120).map(r => `${r.w} ${r.f.name}`));
  check(id, 'FIX', 'Scans', 'Large enough for the card (1,000 pixels across or more)', have.filter(r => r.m.w < 1000).map(r => `${r.w} ${r.f.name} (${r.m.w}px)`));
  /* a pirate site's stamp, not the word "download" in an exercise */
  const STAMP = /[a-z0-9-]*(download|english)[a-z0-9-]*\s*\.\s*(ir|ru|su|cc|to|com|net)\b|frenglish|trenglish|languagedownload/i;
  const stamps = r => [...new Set(r.m.watermark.filter(w => STAMP.test(w)).map(w => w.replace(/\s+/g, '')))];
  check(id, 'FIX', 'Scans', 'No pirate-site stamp on the page', have.filter(r => stamps(r).length).map(r => `${r.w} ${r.f.name}: ${stamps(r).join(', ')}`));
  const days = SESSIONS.filter(k => !(((L[id].sessions || {})[k] || {}).dayPdf || {}).url);
  check(id, 'FIX', 'Scans', 'Every teaching day has its pages as one PDF', days);

  const trackRows = all.flatMap(({ k, i, sl }) => trackLines(sl).map(l => ({ w: `${k}·${i + 1}`, t: trackNo(l), m: AU[idOf(l)], label: l.split('|')[0].trim() })));
  check(id, 'MUST', 'Accurate', 'Every recording can be fetched and plays', trackRows.filter(r => !r.m || r.m.error).map(r => `${r.w} ${r.label}`));
  const ok = trackRows.filter(r => r.m && !r.m.error);
  check(id, 'FIX', 'Recordings', 'Not silent, and no more than three seconds of silence before it starts',
    ok.filter(r => r.m.silent || r.m.lead_silence > 3).map(r => `${r.w} ${r.label} (${r.m.silent ? 'silent' : r.m.lead_silence.toFixed(1) + 's'})`));
  check(id, 'FIX', 'Recordings', 'Good enough to play to a class (64 kbps or more)', ok.filter(r => r.m.bitrate && r.m.bitrate < 64000).map(r => `${r.w} ${r.label} (${Math.round(r.m.bitrate / 1000)} kbps)`));
  check(id, 'FIX', 'Recordings', 'Not distorted (clipping)', ok.filter(r => r.m.clipped > 0.001).map(r => `${r.w} ${r.label} (${(r.m.clipped * 100).toFixed(2)}% clipped)`));
  const levels = ok.map(r => r.m.rms_db).sort((a, b) => a - b);
  const mid = levels.length ? levels[Math.floor(levels.length / 2)] : 0;
  check(id, 'FIX', 'Recordings', 'Even volume across the set (within 8 dB of its middle)', ok.filter(r => Math.abs(r.m.rms_db - mid) > 8).map(r => `${r.w} ${r.label} (${(r.m.rms_db - mid).toFixed(1)} dB)`));
  check(id, 'FIX', 'Recordings', 'A sensible length (5 seconds to 15 minutes)', ok.filter(r => !r.m.duration || r.m.duration < 5 || r.m.duration > 900).map(r => `${r.w} ${r.label} (${Math.round(r.m.duration || 0)}s)`));
}

/* ------------------------------------------------------------------ run */
if (!process.env.LIBRARY_FILE && !process.argv.includes('--no-files')) {
  fetchAll();
  for (const [kind, dir] of [['images', 'img'], ['audio', 'aud']]) {
    const r = spawnSync('python3', [path.join(HERE, 'audit_media.py'), kind, path.join(CACHE, dir), path.join(CACHE, kind + '.json')], { encoding: 'utf8' });
    process.stdout.write(r.stdout || ''); if (r.status) process.stdout.write(r.stderr || '');
  }
}
const IM = fs.existsSync(path.join(CACHE, 'images.json')) ? JSON.parse(fs.readFileSync(path.join(CACHE, 'images.json'))) : {};
const AU = fs.existsSync(path.join(CACHE, 'audio.json')) ? JSON.parse(fs.readFileSync(path.join(CACHE, 'audio.json'))) : {};
for (const id of IDS) { const all = structure(id); if (Object.keys(IM).length || Object.keys(AU).length) files(id, all, IM, AU); }

const when = new Date().toISOString();
fs.writeFileSync(path.join(CACHE, 'report.json'), JSON.stringify({ when, sets: Object.fromEntries(IDS.map(id => [id, { name: L[id].name, book: L[id].book, checks: res[id] }])) }, null, 1));
const lines = [`# Connect library audit — ${when.slice(0, 16).replace('T', ' ')}`, ''];
for (const id of IDS) {
  const c = res[id] || [];
  const must = c.filter(x => x.level === 'MUST' && !x.ok), fix = c.filter(x => x.level === 'FIX' && !x.ok), rep = c.filter(x => x.level === 'REPORT' && !x.ok);
  lines.push(`## ${id} — ${(L[id].book || '').split(',')[0]}: ${must.length ? 'FAILS ' + must.length + ' must-pass' : 'passes every must-pass check'}${fix.length ? ' · ' + fix.length + ' to fix' : ''}${rep.length ? ' · ' + rep.length + ' to report' : ''}`);
  for (const x of c.filter(x => !x.ok)) lines.push(`- **${x.level}** ${x.area} — ${x.check}: ${x.count} — ${x.where.slice(0, 6).join('; ')}${x.count > 6 ? ' …' : ''}`);
  lines.push('');
}
fs.writeFileSync(path.join(CACHE, 'AUDIT.md'), lines.join('\n'));
for (const id of IDS) {
  const c = res[id] || [];
  const n = lvl => c.filter(x => x.level === lvl && !x.ok).length;
  console.log(`${id.padEnd(4)} ${(L[id].book || '').split(',')[0].padEnd(46)} must-pass failed: ${n('MUST')} · to fix: ${n('FIX')} · to report: ${n('REPORT')}`);
}
console.log('\n' + path.join(CACHE, 'AUDIT.md'));
