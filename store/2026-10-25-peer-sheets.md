# 25 Oct 2026 — peer sheets, connected (store v133)

Ramy: a trainee who watched a colleague teach may choose to share what they wrote about that
colleague, "only after the oral feedback"; and "it shouldn't open until the self-eval is
submitted". It works for any peer task, Connect's own wording or the centre's: the columns are
the shape's (grid, focus, single), never the questions'.

## Kind
- Course kind `peerShared`: a pool keyed by the observer's token. Each item is one teacher's part
  of one sheet: `{id, task, sit, tp, col, title, rows:[{q,a}], to, by, group, at}`. `to` is the
  teacher's real token and never leaves the store. It does not go through putCourse.

## Ops (trainees only)
- `shareSheet` {token, to, task, sit, tp, col, title, rows}: `to` is the classmate's STAND-IN id
  (the one `hideTokens_` gives a browser), resolved here against the roster; refused unless that
  classmate is in the caller's own TP group and is not the caller. Rows are cleaned (40 rows,
  400/4000 characters) and at least one answer must be written. Upsert by `task#sit>to`.
- `unshareSheet` {token, to, task, sit}: takes it back.
- `peerSheets` {token}: what classmates connected with the caller. Also in the boot as
  `course.peerSheets`.

## The hold-back
`peerSheetsFor_` returns a row for every sheet connected with the caller, but the ANSWERS only for
a teaching practice whose self-evaluation the caller has turned in (the live `selfeval` record is
`turned_in` and its label's first number is that TP), or whose feedback has been returned (the
TP is in `tpHistory`). Before that the row is `{locked:true}` with the observer's name, the TP and
the title, and no text. The store holds this back, not the page.

## What stays on the page
"After the oral feedback" is the page's, from the timetable: the button opens when the feedback
slot of the day that TP and half fall on has ended on the course's clock (end of that day when it
has no feedback slot; open when the timetable does not say). It only guards the observer, whose
sheet it is. The observer's own record of what they connected, and when, is a field on the sheet
in their `observations` record, so a demo keeps it on the device.

Tutors read the observer's own sheet as before and never need the pool.
