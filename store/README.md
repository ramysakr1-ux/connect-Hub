# The store (Apps Script)

The Connect Lite store is an Apps Script web app, **not** a file in this repo.
Its source of truth is the Apps Script project "Connect Lite store":

https://script.google.com/home/projects/16l_gwb2Dlei1rxAzDGXFzmuGSHV_WxTv4znZMXltzAFgx0XMSo_dn4w2/edit

One file, `Code.gs`. Its deployed `/exec` URL is the `URL` in `hub-store.js`.
To change it: edit in the Apps Script editor → Save → **Deploy → Manage
deployments → pencil → Version: New version → Deploy**. Do NOT make a "New
deployment": that mints a new URL and every link in circulation keeps
pointing at the old code.

Changes are recorded here as patches, with the anchors they were applied to,
so the editor's text and this folder can be reconciled.

## 30 Sep 2026 — the console marks a pinned demo (version 50)
`ownerCourses` rows carry `demoToday`, so the owner console shows a gold
"Demo · pinned to …" chip on a standing demo course. One field, no new op.

## 30 Sep 2026 — the demo clock (versions 48, 49)
See `2026-09-30-demo-clock.md` and `2026-09-30-pinned-at.md`. `settings.demoToday`
pins a course to a day: no assessor expiry (v48), the clock and the
certificate threshold on the volunteer boot (v48), and `post` /
`shareMaterial` / `gridSet` accept the moment a seed says they happened
(v49). Built for the two standing demo courses (`seed-standing-demos.mjs`).

## 30 Sep 2026 — the certificate's signature (version 47)
See `2026-09-30-certificate-signature.md`. One field: the volunteer boot sends
`cert` (the centre's drawn signature, kept on their register row by a tutor),
so the student's own copy is signed too. No new op.

## 30 Sep 2026 — a volunteer agrees once (versions 44, 45, 46)
Version 44: `shareMaterial` / `unshareMaterial` (course kind `shared`, appended
under the lock; a trainee cannot write a course record). Version 45: the
volunteer boot sends `marks` + `level` — without them the student's page and
certificate showed zero hours. Version 46, see
`2026-09-30-volunteer-agrees-once.md`: `volunteerAgree`, the one write a
volunteer may make (their own `agreed` stamp, set once), and `agreed` on the
boot. All three verified from Node against c5.

## 30 Sep 2026 — the volunteer register and a volunteer's own link
See `2026-09-30-volunteer-register-and-link.md`. Course kind `volunteers`
(tutors + assessor only; a candidate gets null), a volunteer's link `?v=` that
reads its own page and nothing else, and the course id in a tutor's boot so
the register can mint links. **Deployed as versions 41, 42 and 43.** Two
deploys in between silently re-deployed version 40 — the note says why and
the order that works.

## 29 Sep 2026 — the assessor link ends when the course ends
See `2026-09-29-assessor-link-ends-with-the-course.md`. The expiry stops being
the course end date plus fourteen days and becomes the end of the course's last
day (Ramy's call): one line out of `assessorExpiry_`. **Deployed as version
39.** Verified against the live store — every course with an end date reports
that date as its assessor expiry, and the pages already said so.

## 28 Sep 2026 — the switch: a clone arrives with everything off
See `2026-09-28-the-switch.md`. `cloneCourse` marks carried links `show:false`
(timetable excepted) and each assignment `released:false`; the pages show a
candidate only what a tutor turns on. **Deployed as version 38.** (Parse the
editor's text before deploying — a stray comment ate a brace.)

## 28 Sep 2026 — the TP7 & TP8 planning grid
See `2026-09-28-planning-grid.md`. Course kind `grid`, ops `gridSet` /
`gridRelease` under the lock (`courseUpdateObj_`); `boot` / `course` return it
shaped per reader (`gridFor_` — a candidate never sees a token). **Deployed as
version 35**; version 36 adds the optional `due` date to `gridRelease`.

## 28 Sep 2026 — the course stream
See `2026-09-28-course-stream.md`. Course kind `stream`, ops `post` / `unpost`
appending one post at a time under the lock (`courseUpdate_`, and
`courseWrite_` split into wrapper + `courseWriteRaw_`); `boot` and `course`
return it. **Deployed as version 34**; version 37 adds the optional `due` on a post.

## 27 Sep 2026 — course materials folders live in one folder
See `2026-09-27-materials-folders-live-in-one-place.md`. `matsRoot_()` and
`MATS_ROOT`, so course folders stop landing at the root of My Drive, plus
`tidyMaterialsFolders()` to file the ones already there. Saved in the editor;
**needs a new version deployed** for new folders to use it.

## 27 Sep 2026 — the owner key can be rotated
See `2026-09-27-rotate-the-owner-key.md`. One new owner-only op,
`rotateOwnerKey`, plus a one-line fix to `ownerKey()`'s link (it still points at
github.io). **Not yet deployed** — apply it in the editor and redeploy as a new
VERSION. `node store/rotate-owner-key.mjs` is the runner and refuses to write a
key it cannot then use.

## 27 Sep 2026 — c4 had no assignment wording, and clearing localStorage wiped its course record
See `2026-09-27-c4-wording-and-a-wiped-course-record.md`. No store change — a
seed bug and an operating mistake. **Clearing localStorage on a live tutor page
is a write**; hub-sync pushes the emptiness up.

## 26 Sep 2026 — the teaching-practice history, one row per TP
See `2026-09-26-tpHistory-per-row.md`. Deployed as version 20.

## 26 Sep 2026 — any record too big for one cell, split across rows
See `2026-09-26-chunked-records.md`. Deployed as version 21. The per-TP change
above fixed two TPs sharing a cell; this fixes one record that is itself too
big, which tagging the demo's feedback points with their criteria made real.
Proven live by `node store/verify-chunks.mjs` (ten checks).

## 26 Sep 2026 — critLearn, a course record for what its tutors tag
See `2026-09-26-critlearn.md`. Deployed as version 22. One more course kind,
handed to a tutor only. Proven by `node check-crit-learn.mjs`.

## 26 Sep 2026 — seedCritLearn, a centre's next course starts from its last
See `2026-09-26-seed-critlearn.md`. Deployed as version 23. Proven by
`node store/verify-seed.mjs`, which makes its own courses and deletes them.

## 26 Sep 2026 — one link is one course
See `2026-09-26-one-course.md`. Deployed as version 25. Candidates counted for
the life of the course, and the dates sealed by the first one. Proven by
`node store/verify-one-course.mjs`.
