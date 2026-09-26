# Any record too big for one cell, split across rows (26 Sep 2026)

**Why.** A Sheets cell holds 50,000 characters. The per-TP change earlier today
gave each teaching practice its own row, which fixed the *history*: two TPs no
longer share a cell. It did not fix a single TP that is itself too big.

Tagging the demo course's feedback points with their criteria showed where that
line is. A returned teaching practice record — the tutor's state plus the
rendered document — sits at 44–48 KB. The criteria tags add a `title` carrying
the full criterion wording on each tag, and the document gains the legend that
lists the criteria referred to; together that is 2–6 KB. Nineteen of the
thirty-three records on the course came back

    Too large to store: feedback is 50465 characters and a record holds 50000

which is the readable refusal the last change added — correct, but the write
still does not happen. This is not a demo-only ceiling: a real course's TP8,
with a long plan and a tagged feedback, lands in the same place, and the first
real course starts in October.

**What.** A record whose JSON does not fit one cell is written across as many
rows as it needs, kind `<kind>#<i>` (`feedback#0`, `feedback#1`, …, and
`tpHistory:3#0`, … for a single oversized TP). The pieces are plain string
slices of the one JSON: they are concatenated in index order on read and parsed
once, so nothing downstream knows. The wire is unchanged in both directions.

Rules that keep the rows honest:

* writing a record always clears the other spelling — a chunked write empties
  the plain row, a small write empties every chunk row — so a record that
  shrinks below the limit cannot leave a stale tail behind that a later read
  would append;
* a chunk set that is incomplete (a missing index, from a write interrupted
  half way) is treated as absent rather than parsed into garbage;
* the ceiling is still real: `MAX_CHUNKS` of 12 is about 600 KB, and past that
  the write is refused with the same readable message.

**Edits, by anchor (each occurs exactly once).**

1. `read_`: the `tpHistory` line stays; after it insert

   ```js
   var chunked = chunksFromRows_(rows, kind);
   if (chunked !== undefined) return chunked;
   ```

2. `foldRecord_`: first line of the body becomes

   ```js
   var piece = chunkOf_(kind);
   if (piece) { bucket._chunks = bucket._chunks || {}; (bucket._chunks[piece.base] = bucket._chunks[piece.base] || {})[piece.i] = json; return; }
   ```

   so a chunk row is collected rather than parsed on its own.

3. `finishBucket_`: before it returns, assemble what was collected —

   ```js
   if (bucket._chunks) {
     Object.keys(bucket._chunks).forEach(function (base) {
       var data = joinChunks_(bucket._chunks[base]);
       if (data === undefined) return;
       var n = tpOf_(base);
       if (n) { bucket.tpHistory = bucket.tpHistory || {}; bucket.tpHistory[n] = data; bucket._tpRows = bucket._tpRows || {}; bucket._tpRows[n] = 1; }
       else bucket[base] = data;
     });
     delete bucket._chunks;
   }
   ```

   (this block goes **above** the existing `delete bucket._tpRows;`).

4. `write_` and `writeHistory_`'s per-TP write and `courseWrite_`: the line
   `assertFits_(json, kind);` becomes `writeCells_(sh, courseId, token, kind, json);`
   — see the helper below, which does the fitting, the splitting and the
   clearing in one place.

5. New helpers, beside the ones from the per-row change:

```js
var MAX_CHUNKS = 12;
function chunkOf_(kind) { var m = /^(.*)#(\d+)$/.exec(String(kind)); return m ? { base: m[1], i: Number(m[2]) } : null; }
function joinChunks_(parts) {
  var idx = Object.keys(parts).map(Number).sort(function (a, b) { return a - b; });
  for (var i = 0; i < idx.length; i++) if (idx[i] !== i) return undefined;   /* a hole: treat as absent */
  var json = idx.map(function (i) { return parts[i]; }).join('');
  try { return JSON.parse(json); } catch (e) { return undefined; }
}
function chunksFromRows_(rows, kind) {
  var parts = {}, any = false;
  for (var i = 0; i < rows.length; i++) {
    var piece = chunkOf_(String(rows[i][2]));
    if (!piece || piece.base !== kind) continue;
    parts[piece.i] = rows[i][3]; any = true;
  }
  return any ? joinChunks_(parts) : undefined;
}
/* One place decides how a record is laid out, so the two spellings can never
   both be live: whichever one this write does not use is emptied. */
function writeCells_(sh, courseId, token, kind, json) {
  if (json.length <= CELL_LIMIT) { clearKinds_(sh, courseId, token, chunkNames_(kind)); return [[kind, json]]; }
  var n = Math.ceil(json.length / CELL_LIMIT);
  if (n > MAX_CHUNKS) throw new Error('Too large to store: ' + kind + ' is ' + json.length + ' characters and a record holds ' + (CELL_LIMIT * MAX_CHUNKS));
  var out = [];
  for (var i = 0; i < n; i++) out.push([kind + '#' + i, json.substr(i * CELL_LIMIT, CELL_LIMIT)]);
  clearKinds_(sh, courseId, token, [kind].concat(chunkNames_(kind).slice(n)));
  return out;
}
function chunkNames_(kind) { var a = []; for (var i = 0; i < MAX_CHUNKS; i++) a.push(kind + '#' + i); return a; }
```

`clearKinds_` is the existing row-emptying used by `writeHistory_`; if it is
named differently in the editor, this is the one call to reconcile.

**Proving it.** `node store/verify-chunks.mjs` writes a 120 KB record to the
demo course, reads it back through `get`, `roster` and `me`, shrinks it again
and checks the chunk rows are gone.
