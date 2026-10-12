# Connect Lite — read this first

Connect Lite ("Lite") is a static site at **lite.celtaconnect.com** for running a
CELTA course's paperwork. There is no build: the HTML files at the root are the
site, and a push to `main` is live through GitHub Pages in about a minute and a
half. Its data lives in an Apps Script web app ("the store") in Ramy's Google
account. Ramy Sakr is the only user who matters: a CELTA tutor and assessor, who
runs real courses on it.

This repo is **public**. Nothing private goes in it: no keys, no tokens, no
trainee's or colleague's details, no link to a Drive folder of scans.

## Where you are running

Lite is worked on from two places, with GitHub between them.

- **Ramy's Mac** has what a cloud session never will: the Drive mount, Classroom,
  the Desktop film folders, `clasp` with his login (store deploys), the gitignored
  keys (`.owner-key`, `.library-key`), and any script that reads or writes the
  store. Work that needs those happens on the Mac.
- **A cloud session** sees only this repo. It may change pages, shared code and
  checks, and run `npm run check`. It must not call the store with a key, deploy
  the store, or touch Drive. Work on a branch and open a pull request; never push
  to `main` from the cloud.
- On the Mac, `main` is pushed directly, and only when Ramy says **"push"**.

## Rules that stand

### Real courses and the store

- **Never touch a live course without asking.** `c5` is C/18 2026 at
  International House Istanbul, from 12 October 2026: real trainees, real
  students. Nothing scripted reads or writes it; everything on it goes through the
  page, and only when Ramy asks. `c1` is the scratch course. `c3` is the TP point
  library: never touched by a script.
- **localhost talks to the LIVE store.** A local page is a real client of the
  real store. Never seed a test course from localhost: it once wiped the whole TP
  point library. The walkers neutralise the store URL themselves; a script that
  does not must not be run against it.
- **Clearing localStorage under a syncing page is a write.** On a tutor screen,
  local storage is one side of a two-way sync: empty it and the page pushes the
  emptiness to the store. To look at another course, open a new tab or use the
  assessor link (`?ak=`), which writes nothing.
- **Edit data through the page that owns it.** Set the field, fire `change`, let
  `persist()` save. A tab that loaded a record before a script wrote it will
  overwrite that write on its next save, and the store answers "ok" both times.
- **A short read is a failed read, and "ok" can come with no record.** Never
  conclude data is gone, or write a fix, from one empty answer. Read again, read
  the sheet, compare sizes.
- **Never probe with a delete.** No destructive act to "see what happens".
- **Store deploys never make a new deployment.** `clasp deploy -i <existing
  deployment id>`, never a bare `clasp deploy`: a new deployment mints a new URL
  and every link in circulation points at the old code. (Mac only.)
- Large records are split into 50,000-character cells. Since store v85 the store
  moves a cut so no piece starts with `=`, `+` or `'` (a cell starting with `=`
  became a formula and the text was lost). An older store needs that checked by
  the client.

### Before every push

- `npm run check` must pass. `npm run check:data` walks the screens with a seeded
  course; `check:doors` follows every link off the landing screens.
- Run **`python3 bump-assets.py` as the last step before the commit**, and add any
  new shared file to both its `assets` list and `sw.js`'s `SHELL`.
- **Show before you change.** Make the change, show Ramy the result (screenshots
  at the size he uses, or the live page), and wait for "push". Pictures you only
  read yourself are not shown to him: send them.
- Never commit a working key, a trainee's link token, or a tutor key, not even in
  a test script. Scripts read keys from the environment or the gitignored files.

### Words

- Call the product **Lite**. Never "Hub" or "connect-Hub" in anything he reads,
  even though the repo, the folder and the `hub-*` file prefixes keep the old
  name (do not rename them: the repo name is in every link ever sent).
- **Candidate** while applying (and inside Cambridge's own documents),
  **trainee** once on the course, **Ss** only for the language students inside a
  lesson's stages.
- Never "practice" on its own: say **TP** or **teaching practice**. Lesson-shape
  names, Cambridge's criteria and "controlled / freer practice" keep the word.
- No arrows on labels or pills ("Change dates", not "Change dates →"). An arrow
  that shows a real flow inside a sentence may stay.
- Plain sentences, one idea each. A label must read as a sentence; one that needs
  explaining has failed.

### Cambridge

- The printed documents (CELTA 5, records, certificates, the assessor pack) are
  Cambridge-facing: leave them alone unless he asks.
- Check a Cambridge question against the Handbook and syllabus yourself, and
  quote the section; do not ask him what Cambridge says. "Should" and "must" are
  different and are reported as written.

### The TP point library

- Never copy a TP point verbatim from a source document. An import is raw
  material: every stage is re-judged against the book and rewritten in our words.
- Pre-teaching in a reading or listening lesson is **meaning only**: no drill, no
  stress, no boarding of form. Say what to do, never "don't".
- Every set, ours included, passes the library compliance checks
  (`tools/check-library.sh` and friends). The checks judge completeness and
  accuracy, never the teaching content.
- The formula for writing TP points is Ramy's to teach. Do not invent rules.

### The timetable

- The ground rules are settled; follow them, do not reopen them. A tile's colour
  comes from its kind, never set by hand. Down the page, length is time; across,
  a tile widens to cover its slots and shows its time only when it is off the
  slot edges. The layout is the course's choice, made once on Course admin.
- When a tile looks wrong, check the data against the rules before proposing code.

### The look

- `hub-tokens.css` is the one palette, linked first on every screen;
  `hub-house.css` is linked last and wins. Gold carries structure; teal is the
  action; the field fill is near-white.
- One filled button per screen. `.btn-quiet` is an undo; `.btn-add` adds a row.
- Every screen works on a phone: no sideways scroll, nothing over the content.

## Where things are

- Screens are numbered HTML files at the root: `index.html` is the trainee's
  home, `5_` the tutor, `6_` Course admin, `8_` the assignment editor, `14_` the
  owner console, `24_` TP points, `28_` TP point sets. `library/` is the public
  library page.
- Shared code is `hub-*.js` and `hub-*.css`. `hub-sync.js` caches a course in
  localStorage and renders from that cache (`hub:booted` must equal
  `mode + ':' + token`). `hub-store.js` is the only door to the store.
- `store/` holds the store's history as dated patch notes and the scripts that
  talk to it with the owner key; `store/README.md` explains the store.
- `film/` holds the films, their watch pages and the recorders
  (`journey-mp4.mjs`, `upright-mp4.mjs`). `film/recut/` re-shoots a tour film on
  real Lite screens with every store write blocked and book pages replaced by
  placeholders; keys come from the environment.
- `check-screens.mjs` is the page check; `walk-with-data.mjs` the data walker.

## How Ramy works

Talk plainly. One recommendation, not a list of options; no re-asking what he
has decided. He walks the site role by role and gives notes in batches: fix the
batch, show it, wait. "Push" means push. He watches on his phone as often as on
a desktop, so show both when a change touches layout.
