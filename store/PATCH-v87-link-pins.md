# Code.gs v87 — link PINs: a second key on trainee links and the tutor link

Ramy, 15 Oct 2026: *"can we add a password to lite's link"* — for trainees and
for tutors — *"course admin sets it"*.

The link is still the key. The PIN is a second one the store checks, so a
copied link alone opens nothing.

**What the store does**
- A course record of kind `pins`: `{ tutor: {hash, salt, set}, trainees: { <token>: {hash, salt, set} } }`.
  SHA-256 over `salt:pin`, a fresh uuid salt per setting; the digits are never kept.
- In `handle_`, once the caller is known: a tutor-key call needs `req.pin` to
  match `pins.tutor`; a trainee-token call needs it to match
  `pins.trainees[token]`. No PIN on record → no gate. `ping` passes; the
  owner key passes; the assessor key and volunteer links are never gated.
  Refusals: `PIN required`, `Wrong PIN` (the pages key on these).
- New tutor-only ops: `setTutorPin {pin}`, `setTraineePin {token, pin}`
  (pin `''` clears), `pins` → `{tutor: set-stamp|false, trainees: {token: set-stamp}}`.
- `cloneCourse` does not copy `pins`; the `course` read never returns them.

**The pages** (`hub-store.js`, `hub-pin.js`, `hub-sync.js`, `invite.html`,
`6_centre_admin_dashboard.html`): the client sends the PIN it holds
(`hub:pin` for a trainee link, `hub:kpin` for the tutor key), asks with a
sheet on `PIN required` / `Wrong PIN` and retries; a new link forgets the old
PIN. The invitation card never asks (`HUB_NO_PIN_PROMPT`): it shows a line.
Course admin → Roster and links: Set PIN / PIN · set on each trainee, Team PIN
on the tutor link; the digits are shown once.

**Deploy:** `node --check Code.js` → `clasp push` →
`clasp deploy -i AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA -d "v87 link PINs"`.
Pages first or store first? Either order is safe: an old page against the new
store simply gets `PIN required` only where a PIN has been set (none yet); a new
page against the old store never sees the refusal.
