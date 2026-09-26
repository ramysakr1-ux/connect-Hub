# tpHistory: one row per teaching practice (26 Sep 2026)

**Why.** A Sheets cell holds 50,000 characters. A returned teaching practice —
plan, analysis sheet and feedback as one document — is 25–35 KB. The history
was every returned TP of a candidate in ONE cell (`records` row, kind
`tpHistory`), so the second filing was refused every time. Measured on the
live store: 49,495 characters accepted, 50,995 refused with an HTML error page.

**What.** Each TP has its own row, kind `tpHistory:<n>`. The wire is unchanged:
a `put` of kind `tpHistory` with the whole map is split into rows here; every
read (`get`, `me`, `boot`, `roster`) assembles the map back. A legacy
single-row `tpHistory` is folded in on read (per-TP rows win) and emptied on
the next write. Every other record write now fails with a readable
"Too large to store: <kind> is N characters and a record holds 50000" instead
of an HTML page.

**Edits, by anchor (each occurred exactly once):**

1. `read_`: after `var rows = sh.getRange(2, 1, last - 1, 4).getValues();`
   insert `if (kind === 'tpHistory') return historyFromRows_(rows, courseId, token);`
2. `rosterWithRecords_`: the per-row body becomes
   `foldRecord_(bucket, String(r[2]), r[3], kinds);` and the map returns
   `records: finishBucket_(byToken[t.token])`.
3. `recordsFor_`: the per-row body becomes `foldRecord_(out, String(r[2]), r[3], kinds);`
   and it returns `finishBucket_(out)`.
4. `write_`: first line `if (kind === 'tpHistory') return writeHistory_(courseId, token, data);`
   and `assertFits_(json, kind);` after `json` is built.
5. `courseWrite_`: `assertFits_(json, kind);` after `json` is built.
6. New helpers, inserted before `// ---- the owner ----`:

```js
var CELL_LIMIT = 50000;
function assertFits_(json, kind) {
  if (json.length > CELL_LIMIT) throw new Error('Too large to store: ' + kind + ' is ' + json.length + ' characters and a record holds ' + CELL_LIMIT);
}
function tpOf_(kind) { var m = /^tpHistory:(\d+)$/.exec(String(kind)); return m ? m[1] : null; }
function foldRecord_(bucket, kind, json, kinds) {
  var n = tpOf_(kind);
  var base = n ? 'tpHistory' : kind;
  if (!kinds[base] && !TRAINEE_READS[base]) return;
  var data; try { data = JSON.parse(json); } catch (e) { return; }
  if (base !== 'tpHistory') { bucket[kind] = data; return; }
  bucket.tpHistory = bucket.tpHistory || {};
  bucket._tpRows = bucket._tpRows || {};
  if (n) { if (data) bucket.tpHistory[n] = data; bucket._tpRows[n] = 1; return; }
  if (data && typeof data === 'object') Object.keys(data).forEach(function (k) { if (!bucket._tpRows[k] && data[k]) bucket.tpHistory[k] = data[k]; });
}
function finishBucket_(bucket) {
  if (!bucket) return bucket;
  delete bucket._tpRows;
  if (bucket.tpHistory && !Object.keys(bucket.tpHistory).length) delete bucket.tpHistory;
  return bucket;
}
function historyFromRows_(rows, courseId, token) {
  var b = {};
  rows.forEach(function (r) { if (String(r[0]) === String(courseId) && String(r[1]) === token) foldRecord_(b, String(r[2]), r[3], TUTOR_WRITES); });
  finishBucket_(b);
  return b.tpHistory || null;
}
function writeHistory_(courseId, token, data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_(SHEET_RECORDS);
    var last = sh.getLastRow();
    var rows = last >= 2 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
    var have = historyFromRows_(rows, courseId, token) || {};
    var want = (data && typeof data === 'object') ? data : {};
    var merged = {};
    Object.keys(have).forEach(function (k) { merged[k] = have[k]; });
    Object.keys(want).forEach(function (k) { if (want[k]) merged[k] = want[k]; });
    var rowOf = {};
    rows.forEach(function (r, i) { if (String(r[0]) === String(courseId) && String(r[1]) === token) rowOf[String(r[2])] = i + 2; });
    var appends = [];
    Object.keys(merged).forEach(function (k) {
      if (!/^\d+$/.test(k)) return;
      var kind = 'tpHistory:' + k;
      var json = JSON.stringify(merged[k]);
      assertFits_(json, kind);
      if (rowOf[kind]) { if (String(rows[rowOf[kind] - 2][3]) !== json) sh.getRange(rowOf[kind], 4, 1, 2).setValues([[json, new Date()]]); }
      else appends.push([courseId, token, kind, json, new Date()]);
    });
    if (appends.length) sh.getRange(sh.getLastRow() + 1, 1, appends.length, 5).setValues(appends);
    if (rowOf['tpHistory']) sh.getRange(rowOf['tpHistory'], 4, 1, 2).setValues([['null', new Date()]]);
  } finally { lock.releaseLock(); }
}
```

**Semantics worth knowing.** The history only grows: an entry the caller does
not send is kept (the pages send the whole map, and a missing number must not
delete a TP). `deleteCourse` and `purgeTrainee` match rows by course/token, so
the per-TP rows go with them. `feedback` is still one row and is ~35 KB per TP
— under the limit, but the guard now names it if that ever changes.

**Verified after deploy with** `node store/verify-history.mjs` (writes and reads
a two-TP history on the demo course c3 only).
