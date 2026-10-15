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
