# Store v87 — PINs on the links (15 Oct 2026)

Ramy: "they should receive the link and then the first time they click on it,
it prompts them to choose a password and they enter it twice. And then if they
lose it, the course admin will be able to send them another link and the other
one will just automatically be terminated."

## What changes

- A course setting, `settings.pinLinks` (the switch on Course admin > Links).
- With it on, every trainee link and the tutor link is gated in `handle_`
  after the caller is resolved: no PIN on record → `PIN needed` (the page
  shows the choose sheet, typed twice, and calls `setMyPin` / `setTutorPin`);
  a PIN on record and none sent → `PIN required`; a wrong one → `Wrong PIN`.
  Assessor and volunteer links are never gated; `ping` never is.
- The store keeps only `{hash, salt, set}` per subject in course kind `pins`
  (`tutor`, `trainees[token]`); the hash is SHA-256 over `salt:pin`. Nobody,
  admin included, can read a PIN back.
- Ops: `setMyPin {pin}` (a trainee, their own link, only while no PIN is on
  record for them), `setTutorPin {pin}` (the tutor key, only while the team
  has none), `pins` → `{on, tutor, trainees}` (tutor key), `reissueTrainee
  {token}` (tutor key): a new token, the roster row, every record row and
  every course-level mention of the old token move to it, the old PIN entry
  is dropped, the old link dies. `rotateKey` also clears the team's PIN.
- Pages: `hub-store.js` (the choose flow), `hub-pin.js` (the sheet),
  `invite.html` (the card says the link asks for a PIN; it never prompts),
  `6_centre_admin_dashboard.html` (the switch; "New link" on a trainee's row).

## Deploy

    cd store/gas && node --check Code.js && clasp push
    clasp deploy -i AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA -d "v87 link PINs"

Never a bare `clasp deploy` (it makes a second deployment with a new URL).

## v88 (15 Oct 2026)

A PIN is four to twelve letters or numbers (Ramy: "does it have to be a number?"), not four to six digits. The sheet shows it in lower case; the store accepts A-Z, a-z, 0-9 and hashes what it is given.

## v89 (15 Oct 2026)

A new trainee record kind, `interview` (TRAINEE_WRITES, TRAINEE_READS, TUTOR_WRITES): the Focus on the Learner student interview. Needs the store deployed BEFORE the pages are pushed, or a trainee's interview notes are refused ("Not yours to write: interview") and stay on the device only.

## v90 (15 Oct 2026)

The Focus on the Learner pool. New trainee op `poolHeard {items}` replaces that trainee's list of heard notes in course kind `folpool` (60 notes, 400 characters each); boot and the course read carry `folpool` flattened (trainees get the notes without who heard them, tutors get `by`). Removing or purging a trainee drops their notes. Deploy the store BEFORE pushing the pages.
