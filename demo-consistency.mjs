/**
 * Make a running demo course say only what its records support.
 *
 *   node demo-consistency.mjs <tutor key>            what it would change
 *   node demo-consistency.mjs <tutor key> --write    change it
 *
 * Ramy, 26 Sep 2026, looking at the tracker: it "needs to be consistent with
 * the TPs and the assignments that have already been submitted." He was right,
 * and the end-of-course reports written an hour earlier were part of the
 * problem: the course stands at teaching practice three with one assignment
 * each, and four candidates carried a final grade, a report that mentioned
 * TP6 and TP7, and a tutorial note about targets met "by the sixth teaching
 * practice". None of that had happened.
 *
 * A course three weeks in has no end-of-course report, so this strips them:
 * the final grade, the hours attended, the overall comment and any tutorial
 * note that claims a teaching practice the candidate has not taught. What it
 * keeps is everything the records do support — the provisional standing, the
 * criterion-tagged strengths and action points, and the evidence note.
 *
 * The finished course, with eight teaching practices and four marked
 * assignments each, is a separate course (demo-finished.mjs). One demo course
 * is running and one is over, which is also what a centre's console looks
 * like.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!KEY || KEY.startsWith('--')) { console.log('usage: node demo-consistency.mjs <tutor key> [--write]'); process.exit(1); }

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
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
const people = Object.values(roster.result.trainees || {}).sort((a, b) => a.name.localeCompare(b.name));

/* The highest teaching practice this candidate has actually had returned. */
const taught = who => Math.max(0, ...Object.keys((who.records || {}).tpHistory || {}).map(Number).filter(n => n > 0));
/* An assignment counts as done when it is closed with a pass. */
const done = who => Object.values((who.records || {}).assignments || {})
  .filter(a => a && a.stage === 'closed' && /^Pass/.test(((a.feedback || {}).outcome) || '')).length;

let changed = 0;
for (const who of people) {
  const rec = (who.records || {}).tracker || {};
  const g = Object.assign({}, rec.grades || {});
  const tp = taught(who), asg = done(who);
  const notes = [];

  if (g.final) { notes.push('final grade ' + g.final + ' removed'); g.final = ''; }
  if (g.hoursAttended) { notes.push('hours removed'); g.hoursAttended = ''; }
  if ((g.overall || '').trim()) { notes.push('end-of-course report removed'); g.overall = ''; }

  /* A tutorial note may only speak of teaching practices that exist. */
  const claims = [...String(g.update || '').matchAll(/\b(?:TP|teaching practice)\s*(\d+)\b/gi)].map(m => Number(m[1]));
  const overclaimed = claims.filter(n => n > tp);
  if (overclaimed.length) {
    notes.push('tutorial note claimed TP' + overclaimed.join(', TP') + ' of ' + tp + ' taught');
    g.update = 'The first tutorial is recorded on this candidate’s tracker with the standing at that point and the action points agreed. The targets set there are the ones the teaching practices above are being read against.';
  }

  console.log(who.name.padEnd(20) + 'TP' + tp + ', ' + asg + ' assignment' + (asg === 1 ? '' : 's') + ' passed'
    + (notes.length ? '   — ' + notes.join('; ') : '   — consistent'));
  if (!notes.length || !WRITE) { if (notes.length) changed++; continue; }

  const out = await call({ op: 'put', key: KEY, token: who.token, kind: 'tracker', data: Object.assign({}, rec, { grades: g }) });
  if (!out.ok) { console.log('   WRITE FAILED: ' + out.error); continue; }
  changed++;
}
console.log('\n' + changed + ' candidates ' + (WRITE ? 'corrected' : 'would be corrected'));
