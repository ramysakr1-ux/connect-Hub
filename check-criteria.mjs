/**
 * Every criterion tagged anywhere on a course, with the wording it claims.
 *
 *   node check-criteria.mjs <tutor key>            print the audit
 *   node check-criteria.mjs <tutor key> --brief    just the count and any faults
 *
 * Ramy, 26 Sep 2026: "it's extremely important for both the demo and the
 * animated film that when tagging the criteria, it's the right criterion.
 * Otherwise this could really backfire."
 *
 * It could. The audience is CELTA trainers, who know the criteria by number,
 * and a demo that tags a rapport comment 2a is worse than a demo that tags
 * nothing. So this does not take anybody's word for it. It walks the whole
 * course, pulls out every place a criterion code is attached to a piece of
 * text — the criterion-tagged points inside returned teaching-practice
 * feedback, and the strengths and action points on the grades report — prints
 * each pairing with the criterion's actual wording beside it, and fails on
 * three things it can decide by itself:
 *
 *   - a code that is not one of the 41 (Section 3 is 3a and 3b; there is no 3c)
 *   - a planning point tagged with a teaching criterion, or the reverse
 *   - the same sentence tagged differently in two places on the same course
 *
 * What it cannot decide is whether 5f is a better reading than 5g for a given
 * sentence. That is a judgement, so the audit prints every pairing for a human
 * to read: the point of the output is that it is short enough to read.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.argv[2];
const BRIEF = process.argv.includes('--brief');
if (!KEY || KEY.startsWith('--')) { console.log('usage: node check-criteria.mjs <tutor key> [--brief]'); process.exit(1); }

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];

/* The criteria, read out of the feedback screen itself rather than copied:
   one list, and if the screen's ever changes this follows it. */
const page = readFileSync(join(HERE, '3_tutor_feedback.html'), 'utf8');
const block = page.slice(page.indexOf('const CRITERIA=['), page.indexOf('];', page.indexOf('const CRITERIA=[')));
const CRIT = {};
for (const m of block.matchAll(/\['([0-9][a-n])','(\d)','([^']+)'\]/g)) CRIT[m[1]] = { topic: m[2], text: m[3] };
const ALL = Object.keys(CRIT);
if (ALL.length !== 41) { console.log('the criteria list has ' + ALL.length + ' codes, not 41 — stopping'); process.exit(1); }

/* Planning points draw on topic 4; teaching points on 1, 2, 3 and 5. The
   feedback screen scopes its suggestions exactly this way. */
const SCOPE = { planning: ['4'], teaching: ['1', '2', '3', '5'] };

const call = async b => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};

const roster = await call({ op: 'roster', key: KEY });
if (!roster.ok) { console.log('could not read the roster: ' + roster.error); process.exit(1); }

const LIST_SCOPE = { lSP: 'planning', lAP: 'planning', lST: 'teaching', lAT: 'teaching' };
const GRADE_SCOPE = { planS: 'planning', planA: 'planning', teachS: 'teaching', teachA: 'teaching' };
const tagsOf = html => [...String(html || '').matchAll(/class="tag"[^>]*data-c="([0-9][a-n])"/g)].map(m => m[1]);
const textOf = html => String(html || '').replace(/<span class="tag"[\s\S]*?<\/span>/g, ' ').replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/\s+/g, ' ').trim();

/* text -> { codes, scope, where[] } */
const seen = new Map();
const note = (text, code, scope, where) => {
  if (!text || !code) return;
  const key = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const e = seen.get(key) || { text, pairs: new Map(), scope, where: [] };
  const codes = e.pairs.get(code) || [];
  codes.push(where); e.pairs.set(code, codes);
  e.where.push(where);
  seen.set(key, e);
};

for (const who of Object.values(roster.result.trainees || {})) {
  const rec = who.records || {};
  for (const [label, entry] of [['feedback', rec.feedback], ...Object.entries(rec.tpHistory || {}).map(([n, e]) => ['TP' + n, e])]) {
    if (!entry || !entry.state || !entry.state.lists) continue;
    for (const [id, rows] of Object.entries(entry.state.lists)) {
      const scope = LIST_SCOPE[id]; if (!scope) continue;
      for (const row of rows || []) {
        const text = textOf(row.html);
        for (const code of tagsOf(row.html)) note(text, code, scope, who.name + ' ' + label);
      }
    }
  }
  const g = (rec.tracker || {}).grades || {};
  for (const [field, scope] of Object.entries(GRADE_SCOPE)) {
    for (const p of g[field] || []) if (p && p.code) note(String(p.text || ''), p.code, scope, who.name + ' grades');
  }
}

const faults = [];
const rows = [...seen.values()].sort((a, b) => a.text.localeCompare(b.text));
let pairings = 0;

for (const e of rows) {
  const codes = [...e.pairs.keys()].sort();
  pairings += codes.length;
  const bad = [];
  for (const c of codes) {
    if (!CRIT[c]) { bad.push(c + ' is not a CELTA 5 criterion'); continue; }
    if (!SCOPE[e.scope].includes(CRIT[c].topic)) bad.push(c + ' is a topic ' + CRIT[c].topic + ' criterion on a ' + e.scope + ' point');
  }
  /* The same sentence, read two ways in two places on one course. */
  const places = new Set(e.where);
  if (codes.length > 1 && places.size > 1) {
    const perPlace = new Map();
    for (const [c, wheres] of e.pairs) for (const w of wheres) perPlace.set(w, (perPlace.get(w) || new Set()).add(c));
    const shapes = new Set([...perPlace.values()].map(s => [...s].sort().join('+')));
    if (shapes.size > 1) bad.push('tagged differently in different places: ' + [...shapes].join('  /  '));
  }
  if (bad.length) faults.push({ text: e.text, bad });
  if (BRIEF) continue;
  console.log('\n' + (bad.length ? 'FAULT  ' : '       ') + e.text);
  console.log('       ' + e.scope + ', ' + places.size + ' place' + (places.size === 1 ? '' : 's'));
  for (const c of codes) console.log('       ' + c + '  ' + (CRIT[c] ? CRIT[c].text : '*** not a criterion ***'));
  for (const b of bad) console.log('       !! ' + b);
}

console.log('\n' + rows.length + ' distinct tagged sentences, ' + pairings + ' criterion pairings, across the course.');
if (!faults.length) { console.log('Nothing a machine can fault. The readings themselves still want a human eye — they are all above.'); process.exit(0); }
console.log('\n' + faults.length + ' need attention:');
faults.forEach(f => { console.log('  ' + f.text); f.bad.forEach(b => console.log('     ' + b)); });
process.exit(1);
