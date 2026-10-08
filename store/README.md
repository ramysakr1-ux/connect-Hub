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

**Since 7 Oct 2026 the code lives in `store/gas/Code.js`** (clasp's name for
`Code.gs`), pulled with clasp and committed as the exact code that was
deployed (store v73 = Apps Script version 87). From here a change is a diff
to that file, and a deploy is, from `store/gas/`:

    node --check Code.js
    clasp push
    clasp deploy -i AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA -d "v75 ..."

Never a bare `clasp deploy`. If anything is ever edited in the Apps Script
editor instead, `clasp pull` before the next change or the repo copy is stale.
The patches below are how the editor's text got to v73.

## 8 Oct 2026 — the certificate per level, signed by the centre (version 93, store v79)

The volunteer's certificate of attendance is now 160 hours AT A LEVEL (a
level's 200 less twenty per cent leeway), signed for the centre rather than
by a tutor. A volunteer's boot gains `levelFrom` (the day the centre moved
them up; the count at the new level starts there) and the settings list
gains `certSigner` ({name, role, ink}, set on Course admin). Read-only.

## 8 Oct 2026 — a volunteer's link carries the card style (version 92, store v78)

A volunteer's boot sends a short list of the course's settings, never the
tutors' contacts. `cardStyle` joins that list, so a volunteer on a ticket
course gets the ticket like everyone else. Read-only.

## 8 Oct 2026 — the console reads settings split across cells (version 91, store v77)

`ownerList_()` read only a plain `settings` row, so a course whose settings
had outgrown one cell (c5, once its logo was in: 61,126 characters of logo
alone) was listed with no course name, no centre and no card style. It now
joins `settings#0`, `#1`, ... in one pass, as `courseRead_` does. Read-only.

## 8 Oct 2026 — the console learns each course's card style (version 90, store v76)

`ownerList_()` adds `cardStyle` ('ticket' or '') to each course it hands the
owner console, read from the course's settings, so a course whose links open
on the ticket (1b) shows in the console as a ticket book. Read-only; nothing
else changes. Course admin writes `settings.cardStyle` itself, and a clone
already carries it (v75 keeps the centre's newer settings).

## 8 Oct 2026 — a clone carries the centre's newer settings (version 89, store v75)
`cloneCourse` keeps what is the centre's: now also the agreement, Connect's
pre-course switch and its two overrides, the tutor and volunteer contacts, the
online rooms, the time zone, and the centre's own agreement link; a copied
file row loses its show-from day. Dates, names, the assessment, the roster and
the keys still start fresh.

## 7 Oct 2026 — the centre book: a number fills in its centre (version 88, store v74)
The first deploy from the repo with clasp. A `centres` sheet (number | name |
first | courses) that learns from every course made; owner-only `centres` and
`centresSeed` ops; `createCourse` returns the book and accepts a centre number
in both of Cambridge's shapes (`TR073`, `10294`, `MX026b`). Seeded the same
night with all 479 centres by `store/seed-centres.mjs`; TR073 fills
*International House Istanbul*. Patch note: `PATCH-v74-centre-book.md`.

## 4 Oct 2026 — a course's TP point set rides with the points (version 67)
`tpPointsFor_` returns `set` to readers, so the lessons written once against a
coursebook — sessions, slots, stages, timings — survive a read. Candidates are
unaffected: the rotation stamps a slot's content into their own cells.
See [2026-10-04-tp-point-sets.md](2026-10-04-tp-point-sets.md).

## 3 Oct 2026 — the nightly backup, rebuilt (version 66)
There was no backup: no code, no trigger, nothing in the account since
2 September. `nightlyBackup()` copies the records Sheet into `CELTA hub backups`
each night on a Day timer, keeps 30, and prunes only its own files. No request
path changed, and a before/after fingerprint of the live store came back
identical on all four courses.
See [2026-10-03-nightly-backup.md](2026-10-03-nightly-backup.md).

## 2 Oct 2026 — the manifest finally asks for mail (version 65)
`appsscript.json` gains `script.send_mail` and `https://mail.google.com/`;
Ramy pasted it, authorised the script (Run → Allow) and deployed v65 himself.
First mail ever sent by the store: the card, 13:20. See the note below.

## 2 Oct 2026 — the card as an email (version 64)
`sendCard`, owner only: the console builds the offer card as HTML and the
store sends it from `lite@` (with a bcc); `sendAs_` carries `bcc` and the
plain-text part. Sending needs the owner to authorise mail once in the editor.
See [2026-10-02-send-card.md](2026-10-02-send-card.md).

## 2 Oct 2026 — the reminders' sender, and a gate that went out twice (versions 61, 62)
`sendAs_` sends the volunteer reminders from `info@celtaconnect.com` when the
account holds it as an alias; v61 was composed on a stale editor tab and
reverted the centre-number gate, which v62 restores.
See [2026-10-02-sender-and-a-reverted-gate.md](2026-10-02-sender-and-a-reverted-gate.md).

## 1 Oct 2026 — a course needs its Cambridge centre number (version 60)
`createCourse` refuses without one, writes it locked into the course's
settings, and `putCourse` keeps it whatever Course admin sends; the console's
list carries it. See [2026-10-01-centre-number.md](2026-10-01-centre-number.md).

## 1 Oct 2026 — feedback thumbs on the demos and the offer page (version 59)
A `feedback` tab; `feedback` takes no credential, `feedbackSummary` the owner key;
the timer mails new comments. See [2026-10-01-feedback.md](2026-10-01-feedback.md).

## 1 Oct 2026 — the volunteer reminders (version 56)
Two mails from a half-hourly trigger — eighteen hours before the first practice
to everyone with an address, an hour before to those who said yes — with
yes/no links that land on the register and as a count on every boot; an
opt-out; the assessor never sees an address.
See [2026-10-01-volunteer-reminders.md](2026-10-01-volunteer-reminders.md).

## 1 Oct 2026 — a candidate's timetable gets the sets before release (version 55)
`tpPointsFor_` hands an unreleased candidate their group's sets and their own
token, never the points, so the timetable can draw its letters.
See [2026-10-01-sets-before-release.md](2026-10-01-sets-before-release.md).

## 1 Oct 2026 — a volunteer writes to the centre, never a tutor (version 54)
The volunteer boot drops `tutorContacts` (v51) and carries the one
`volunteerContact` the centre names on Course admin.
See [2026-10-01-volunteer-contact.md](2026-10-01-volunteer-contact.md).

## 1 Oct 2026 — a candidate may carry an email (version 53)

Column F of the trainees sheet, optional everywhere; `addTrainee`, `addTrainees` and
`renameTrainee` take it, a tutor's roster carries it, the assessor's copy never does,
and a candidate's own boot carries only their own. Earlier the same day: v51 sent the
tutor contacts on a volunteer's boot, v52 the hours they carried in.
See [2026-10-01-candidate-email.md](2026-10-01-candidate-email.md).

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
- `2026-10-04-upload-cap-by-caller.md` — v71: uploads capped by caller, trainee 2MB / tutor key 9MB (v69 and v70 got this wrong).
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
