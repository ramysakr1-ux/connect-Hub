# Connect Lite — read this first

Connect Lite is a static site (GitHub Pages, no build) at **lite.celtaconnect.com**
for running a CELTA course's paperwork. Its data lives in an Apps Script web app
("the store") in Ramy's Google account. Ramy Sakr is the only user who matters:
he is a CELTA tutor and assessor, and he is about to run a real course on it.

**State of play and what to do next: `HANDOVER-2026-10-06.md`.** Read it before
touching anything.

## Rules that stand (Ramy's words where quoted)

- **Never touch a live course without asking.** `c1` is the scratch course.
  `c3` is the TP point library and must never be touched. There are real
  courses alongside them.
- **localhost talks to the LIVE store.** "Never seed a test course there — it
  once wiped the entire TP point library." The walkers neutralise the store
  URL themselves; a script that does not must not be run against it.
- **Run `python3 bump-assets.py` as the LAST step before every push**, and add
  any new shared file to BOTH its `assets` list and `sw.js`'s `SHELL`.
- **`npm run check` must pass before a push** (132 page loads, 33 screens).
  `npm run check:data` walks 99 screens with a seeded course; `check:doors`
  follows every link off the landing screens.
- **Show before you change.** "When change anything and send me first." Make
  the change, send him screenshots, wait for "go" or "push". Images you open
  with the Read tool are not shown to him — send the file.
- **Store deploys never make a "New deployment".** Deploy → Manage
  deployments → pencil → Version: New version → Deploy. A new deployment
  mints a new URL and every link in circulation points at the old code. With
  clasp that means `clasp deploy -i <existing deployment id>`, never a bare
  `clasp deploy`.
- The film is tabled: "We can't deal with the films here, so stop asking me
  about that."
- Keep the printed documents (CELTA 5, records, certificates) alone unless he
  asks: they are Cambridge-facing.
- Never commit a working key. `.owner-key` and `.library-key` are gitignored
  and read by the scripts from the repo root; this repo is public.

## Where things are

- Screens are numbered HTML files at the root; `index.html` is the trainee's
  home, `5_` the tutor, `6_` course admin, `14_` the owner console.
- Shared code is `hub-*.js` and `hub-*.css`; `hub-sync.js` caches a course in
  localStorage and renders from cache (`hub:booted` must equal
  `mode + ':' + token`).
- `store/` holds the store's history as dated patch notes and the scripts that
  talk to it with the owner key. `store/README.md` explains the store.
- `walk-with-data.mjs` is the data walker; `check-screens.mjs` the page check.

## How Ramy works

Talk plainly, no lists of options when one will do, no re-asking what he has
already decided. He walks the site role by role and gives notes in batches;
fix the batch, show it, wait. He says "push" when he means it. He does not
want to be asked about the film, and he does not want to paste code into
editors — the Mac session exists so that stops.
