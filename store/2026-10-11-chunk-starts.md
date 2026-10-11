# Store v85 = Apps Script version 99 (deployed 11 Oct 2026, 18:08): a chunk must not start with =, + or '

(The deployment's description says "v75" — a numbering slip on the day; it is v85, after v84 of c2786c18.)

**The fault (11 Oct 2026, 17:42).** A course record over 50,000 characters is
sliced into pieces, one Sheets cell each (`courseWriteRaw_`). The library's
tppoints record (13 sets, 1.52 M chars, 31 pieces) was written with piece #7
beginning `=drivesdk` — the tail of a Drive link. `setValues` treats a cell that
starts with `=` as a formula; the cell became `#ERROR! Formula parse error` and
its 50,000 characters were gone. `courseRead_` could not parse the join, returned
null, and the course answered with the empty default. The put had said ok.
`+` (also a formula start) and a leading `'` (stripped as a text prefix) do the
same. Every chunked record is exposed on every write: the library (31 pieces),
c1 (11), **C/18 = c5 (7)**.

**The fix:** the cut moves back a character or two so no piece starts with one
of the three. The read joins pieces in index order whatever their lengths, so
nothing upstream changes and old records read as before.

**Recovery done the same evening** from `_library-backups/library-2026-10-11T14-42.json`
(the snapshot the link step takes before writing) with a client-side boundary
check and a front pad (`scratchpad/recover-library.mjs`, `safe-put.mjs`).

Deployed with: `store/gas/` → `node --check Code.js` → `clasp push` →
`clasp deploy -i AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA -d "v85 chunk starts"`,
then the read-only verify (ping, ownerCourses, a course read of c2 and c5).

**Proved on the live store (18:12):** the scratch course c1 was written with a
front pad chosen so a 50,000-char boundary fell exactly on the `=` of
`=drivesdk`; v85 read it back whole (6 sets, 664,993 chars). Before v85 that
write would have lost the cell. The pad was then taken off again.
