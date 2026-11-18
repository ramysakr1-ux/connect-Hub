/* How full is Lite? (18 Nov 2026, store v260)
 *
 * Ramy, in C/21's first week: "let's have regular checks on size limitations ... this is the first course, and a lot
 * of people are using it at the same time, and it's going to get bigger and bigger. I just want to be ahead of any
 * problems, whether it's to do with uploading material or where they live."
 *
 * Reads only. Asks the store for its own sizes (op health, owner only: counts and sizes, no names, no contents) and
 * looks at Lite's folders in the Drive synced to this Mac, then prints one line per limit:
 *
 *   OK      well inside the limit
 *   WATCH   past the point where it is worth planning for (60% of most limits)
 *   ACT     close enough that something should be done before the next course
 *
 * and, for anything not OK, what to do. Exit code 0 when everything is OK, 1 when something says WATCH, 2 for ACT.
 *
 *   node store/check-health.mjs            the report
 *   node store/check-health.mjs --json     the same as JSON (for a scheduled run to read)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const JSON_OUT = process.argv.includes('--json');

const raw = async (b) => {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b), signal: AbortSignal.timeout(120000) })).json();
      if (r && (r.ok || r.error)) return r;
    } catch (e) { if (i === 3) return { ok: false, error: 'no answer (' + String(e.message || e).slice(0, 40) + ')' }; }
    await new Promise((r) => setTimeout(r, 2500));
  }
};
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const mb = (n) => (n >= 1073741824 ? (n / 1073741824).toFixed(2) + ' GB' : (n / 1048576).toFixed(1) + ' MB');
const num = (n) => Number(n || 0).toLocaleString('en-US');
const lines = [];
const say = (level, what, detail, todo) => lines.push({ level, what, detail, todo: level === 'OK' ? '' : todo || '' });
const grade = (share, watch = 60, act = 85) => (share >= act ? 'ACT' : share >= watch ? 'WATCH' : 'OK');

const res = await raw({ op: 'health', owner: OWNER });
if (!res || !res.ok) {
  say('ACT', 'The store', 'did not answer the health check: ' + ((res && res.error) || 'no answer'), 'If this says "Unknown op", the store has not been deployed with the health report yet. Otherwise open Lite and see whether courses load.');
} else {
  const h = res.result, L = h.limits;
  /* 1. the spreadsheet's grid */
  const cs = pct(h.cells, L.cells), top = (h.sheets || []).slice(0, 3).map((s) => `${s.name} ${num(s.cells)}`).join(', ');
  say(grade(cs), 'Spreadsheet cells', `${num(h.cells)} of ${num(L.cells)} (${cs}%). Largest sheets: ${top}.`,
    'Google refuses new rows at 10 million cells. Trim empty rows and columns on the largest sheet, or archive finished courses to a second spreadsheet.');
  /* 2. the records */
  for (const [name, r] of [['Trainee records', h.records], ['Course records', h.course]]) {
    if (!r) continue;
    const share = pct(r.longest, L.cell);
    say(r.longest > L.cell ? 'ACT' : 'OK', name,
      `${num(r.rows)} rows, ${mb(r.chars)} of text. Longest cell ${num(r.longest)} of ${num(L.cell)} (${share}%)${r.longest === L.cell ? ', which is normal: a long document is split across full cells' : ''}. ${num(r.packed)} packed, ${num(r.inDrive)} kept in Drive, ${num(r.over40k)} over 40,000.`,
      'A cell over the limit means a record was written without being packed. Tell Claude which course it is; the record needs re-saving.');
  }
  /* 3. the settings store */
  const ps = pct(h.props.chars, L.props), pl = pct(h.props.longest, L.prop);
  say(grade(Math.max(ps, pl)), 'Settings store', `${num(h.props.count)} entries, ${num(h.props.chars)} of ${num(L.props)} characters (${ps}%). Longest value ${num(h.props.longest)} of ${num(L.prop)} (${pl}%), a "${h.props.longestKind}" entry.`,
    'Google refuses a value over 9,000 characters and a store over 500,000. The longest entry is the one to shrink or move into the spreadsheet.');
  /* 4. records too big for a cell */
  if (h.big && !h.big.error) say(h.big.files > 2000 ? 'WATCH' : 'OK', 'Records kept in Drive', `${num(h.big.files)} files, ${mb(h.big.bytes)}.`, 'Many of these are left behind by deleted trainees. They can be cleared by a sweep that keeps only the files a record still points at.');
  /* 5. mail */
  if (h.mail && !h.mail.error) say(h.mail.leftToday < 20 ? 'ACT' : h.mail.leftToday < 100 ? 'WATCH' : 'OK', 'Emails left today', `${num(h.mail.leftToday)}. Google sets the daily allowance for the store\u2019s account; a full day starts at about 100.`, 'When this reaches zero the store sends no more mail until tomorrow: links, invitations and the "are you coming" messages stop. Spread a big send over two days.');
  /* 6. the store account's own Drive */
  if (h.drive && !h.drive.error && h.drive.limit > 0) { const ds = pct(h.drive.used, h.drive.limit); say(grade(ds, 75, 90), 'The store account’s Drive', `${mb(h.drive.used)} of ${mb(h.drive.limit)} (${ds}%).`, 'Uploads and recordings fail when this is full. Clear finished courses’ recordings and uploads, or add storage.'); }
  else if (h.drive && !h.drive.error) say('OK', 'The store account’s Drive', `${mb(h.drive.used)} used; Google reports no fixed limit for this account.`);
  say(h.tookMs > 60000 ? 'WATCH' : 'OK', 'Time to read all of this', `${(h.tookMs / 1000).toFixed(1)} seconds.`, 'The store has six minutes for any one job. A health read this slow means the sheets are large enough to slow ordinary saves too.');
}

/* 7. Lite's folders, as this Mac's Drive shows them: where uploads and recordings live */
const roots = (() => { const base = join(homedir(), 'Library/CloudStorage'); if (!existsSync(base)) return [];
  return readdirSync(base).filter((n) => n.startsWith('GoogleDrive-')).map((n) => join(base, n, 'Shared drives', 'Connect Lite')).filter(existsSync); })();
if (roots.length) {
  let files = 0, bytes = 0, recs = 0, recBytes = 0; const by = {};
  const walk = (dir, top) => { let names = []; try { names = readdirSync(dir); } catch (e) { return; }
    for (const n of names) { const p = join(dir, n); let st; try { st = statSync(p); } catch (e) { continue; }
      if (st.isDirectory()) walk(p, top || n); else { files++; bytes += st.size; by[top || n] = (by[top || n] || 0) + st.size; if (/Interview recordings/.test(p)) { recs++; recBytes += st.size; } } } };
  roots.forEach((r) => walk(r, ''));
  say(grade(pct(files, 400000)), 'Lite’s shared drive', `${num(files)} files, ${mb(bytes)} (a shared drive holds 400,000 items). Interview recordings: ${num(recs)} files, ${mb(recBytes)}.`,
    'A shared drive stops taking files at 400,000 items. Move finished courses’ folders out to an archive drive.');
} else say('OK', 'Lite’s shared drive', 'not synced to this Mac, so not measured here.');

/* 8. the fixed caps, for reference: what a single upload may be */
say('OK', 'Single-file caps', 'a trainee’s upload 2 MB, a tutor’s 9 MB, an interview recording 8 MB (ten minutes is about 2.4 MB).');

const worst = lines.some((l) => l.level === 'ACT') ? 2 : lines.some((l) => l.level === 'WATCH') ? 1 : 0;
if (JSON_OUT) console.log(JSON.stringify({ at: new Date().toISOString(), worst: ['OK', 'WATCH', 'ACT'][worst], lines }, null, 1));
else {
  console.log('Connect Lite: how full is it?  ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC\n');
  for (const l of lines) { console.log(`${l.level.padEnd(6)}${l.what}: ${l.detail}`); if (l.todo) console.log(`      What to do: ${l.todo}`); }
  console.log('\n' + (worst === 0 ? 'Everything is well inside its limit.' : worst === 1 ? 'Nothing is urgent. The WATCH lines are worth planning for.' : 'Something needs doing: see the ACT lines.'));
}
process.exit(worst);
