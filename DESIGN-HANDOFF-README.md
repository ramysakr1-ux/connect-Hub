# Handoff: Connect Lite (formerly Connect Hub; TP + assignments paperwork tool)

## Overview
Connect Hub is a separate, standalone tool from the main Connect app (`ramysakr1-ux/celta-connect`) — its own repo (`ramysakr1-ux/connect-Hub`), static HTML, no build step, no login/backend. It replaces a folder of shared Word docs and email threads for one purpose: a trainee's teaching-practice paperwork (lesson plan → self-evaluation → tutor feedback) and their five written assignments (LRT, LSRT, FOL, LFC, Assignment 5), end to end, self-contained in the browser (`localStorage`, no server).

None of this has been shared with the main Connect repo or discussed there — treat everything in this package as new context.

> **Amendment, 22 Aug 2026:** per a follow-up spec, `7_ramy_command_center.html`
> does *not* belong in this product — it's been removed. The platform-owner
> command center is being built as a real route inside `celta-connect`
> instead (owner-role-gated, querying Connect's own database), where a copy
> of this file lives on as the visual reference. Wherever this doc still
> describes screen 7 below, treat it as historical.

## About the design files
These are **design references built in HTML** — functioning prototypes (open any file directly in a browser) showing intended structure, wording, and behavior. They also happen to be close to production-ready static HTML/JS, since Connect Hub has no build step or framework — recreate in whatever stack the actual Connect Hub repo uses, matching this behavior and wording exactly.

## Fidelity
High-fidelity. Copy, color, layout, and interaction logic are final. The written assignment content (LRT/LSRT/FOL/LFC instructions, Assignment 5 plagiarism-reflection wording) is real course material — do not rewrite it.

## Structure: two loops sharing one shell

**Loop 1 — Teaching practice (screens 1–4).** Trainee writes a lesson plan + language analysis (1), teaches, writes a self-evaluation (2) — before reading feedback, which matters pedagogically — tutor writes feedback assembling the whole TP into one document with a grade (3), and the trainee reads it all back read-only once returned (4). Each stage autosaves to `localStorage` (`chub:plan`, `chub:selfeval`, `chub:feedback`) and carries data forward (e.g. the self-eval form pulls in what the trainee actually planned).

**Loop 2 — Written assignments (screens 8–11).** A centre admin builds/edits each of the 5 assignments' wording, sections, and marking criteria (8) — including importing wording from a file to replace it entirely, since centres can rewrite these as their own. A trainee fills out whatever the centre built (9). A tutor marks it against **per-field** criteria — each criterion is tied to a specific section, not the whole assignment (10). On resubmission, only sections tied to a Not-met criterion reopen; Met sections lock read-only, carried forward, with the tutor's per-criterion comment shown inline. The declaration (own work + AI use) is retaken fresh every round. Everything assembles into a printable record (11).

**Shell / navigation:** `index.html` is the trainee's home — links to whichever TP stage is next (badges show Not started / Draft / Turned in / Returned) plus the assignments entry point. `5_tutor_dashboard.html` is the tutor's queue across trainees for both TP and assignments. `6_centre_admin_dashboard.html` is where a centre sets up its course, invites tutors/trainees (personal links + status: Invited/Not invited/Opened), and edits assignment wording. `7_ramy_command_center.html` is the platform-owner view across centres.

## Data model
All client-side, `localStorage`-only, no auth:
- `chub:plan`, `chub:selfeval`, `chub:feedback` — one TP's paperwork, `{status: 'draft'|'turned_in'|'returned', ...}`.
- `connect_assignment_wording_v2` — per-centre, per-assignment structure: `{title, wordMin, wordMax, format: 'prose'|'structured', criteria: [{text, sectionIndex}], sections: [...]}`. `sectionIndex` ties a criterion to one section (or `null` for a whole-assignment criterion) — this is what makes the per-field lock-on-resubmission mechanism work. A section is one of: `text` (instructions/prose prompt), `picker` (pick-N-per-category chips, e.g. LRT's item selection), `fields` (a repeatable analysis block keyed to whatever was picked), `declaration` (own-work + AI-use, always re-rendered blank on every round).
- `connect_assignment_submissions_v1` — per-assignment state machine: `stage: 'draft'|'submitted'|'returned_unmarked'|'resubmission_needed'|'resubmitted'|'closed'` (`returned_unmarked`, added 20 Sep 2026, is still round one: the tutor sent it back without marking, the trainee submits it again, and `usedResubmission` stays false), `sub1`/`sub2` snapshots, `criteriaMarks: {sub1:[], sub2:[]}` and `criteriaComments: {sub1:[], sub2:[]}` indexed by criterion, `usedResubmission` flag, `feedback: {outcome, generalComment1, generalComment2}`.
- Both wording and submission readers include an inline migration that upgrades old flat-string `criteria` arrays to `{text, sectionIndex:null}` objects on load — needed because the data model changed mid-project; keep this migration if porting the raw localStorage schema forward.

## Assignment outcome logic (the core mechanism — port this exactly)
Outcome is **derived, never chosen**: all criteria Met → Pass (or "Pass (on resubmission)" on round 2); any criterion Not met on round 1 → "Resubmission needed"; any Not met on round 2 → "Fail (on resubmission)" — final, no further attempts. A separate "Return unmarked" tutor action exists for incomplete/wrong submissions — it does **not** spend the trainee's one resubmission, unlike "Resubmission needed" which does. This distinction (spends vs. doesn't spend the one allowed resubmission) must be preserved exactly — it is a Cambridge CELTA requirement (Administration Handbook §8.2.3: one resubmission per assignment).

## Design tokens
- Ink: `oklch(23.5% 0.017 65)` · Ink-warm (headings/wordmark): `oklch(30% 0.042 58)`
- Teal (primary/trainee-before): `oklch(37.5% 0.058 195)` · Terracotta (tutor-facing): `oklch(37.5% 0.058 195)` / dark `oklch(30% 0.06 195)`
- Gold/ochre (flagged/returned): `oklch(63% 0.096 72)`, lifted `oklch(70% 0.12 72)`
- Grey (muted text): `oklch(51% 0.017 70)` · Brick (fail/alert): `oklch(45% 0.15 27)`
- Sand (page bg): `oklch(92.5% 0.012 85)` · Sand-deep: `oklch(94.8% 0.01 85)` · Sand-line (borders): `oklch(89.5% 0.012 82)`
- Paper (cards): `oklch(99.5% 0.004 90)` in the assignment screens, `oklch(96.4% 0.014 85)` in the admin/wording screens — check which shade a given screen already uses before changing it.
- Fonts: Karla (UI, 400–700), Newsreader (headings, 600/700), Instrument Serif italic (wordmark "Connect" only), Instrument Sans (small caps label under wordmark). All Google Fonts.
- Status-pill palette is reused across dashboards: pass/done = green tint, resub/warning = amber tint, fail = brick tint, draft/not-started = sand-deep neutral.

## Interactions & behavior
- Every form autosaves on input (no save button) — a small "Saved" status flashes near the submit control.
- The trainee's "Turn in" / "Submit" is **hard-gated** on the declaration: own-work checkbox(es) + the AI-use radio (and, if "used AI", a link + purpose) must all be filled before the button enables.
- The assignment picker pills at the top of screens 9/10 switch between the 5 assignments via `?a=lrt|lsrt|fol|lfc|a5` query param.
- Screen 4 (feedback returned) shows a "Start next TP" button that clears the three TP localStorage keys after a confirm dialog — this is a deliberate reset, not a bug.
- Locked/read-only content (Met sections on resubmission, submitted forms awaiting marking) is visually distinguished with a light-green "✓ Already met — carried forward" box or simple disabled fields — never hidden.

## Assets
No external images or icon library. The Connect Hub mark is inline SVG (two overlapping teal/gold arcs, same mark as main Connect, with a slow Y-axis spin animation — `@keyframes wordmark-spin`, 90s, holds face-on for the first ~11% then completes a full turn, `prefers-reduced-motion` disables it). No other icons.

## Deliberately out of scope (do not build unless separately asked)
Per the compliance audit (attached): a Google Drive picker (materials currently take a pasted link, not an OAuth-connected picker), an automatic language-error/proofreading scanner and a text-similarity/malpractice scanner (both are real backend logic — text diffing, error detection — not just UI), live word-count validation against the stored min/max, a resubmission deadline check against course end date, double-marking identity (first/second marker names), materials/TP-lesson overlap detection, and conflated-assignment support (two assignments merged into one submission with two grades). All are flagged, none are silent gaps.

## Files
- `assignment-defaults.js` — the five assignments' standard wording, shared by screens 6, 8, 9, 10 and 11 (added 20 Sep 2026: the readers fall back to it when the browser holds no saved wording, so a trainee or tutor on a fresh device is never told the assignment "isn't set up yet"). A centre's *customised* wording still lives only in the browser it was saved in — see the open question below.
- `hub-shared.js` — the styled confirm modal (every screen, replacing the browser's `confirm()`) and `niceDate()` for the assembled documents.
- `index.html` — trainee home / TP + assignments launcher.
- `1_trainee_plan_and_analysis.html` through `4_feedback_returned.html` — the TP loop.
- `5_tutor_dashboard.html` — tutor's cross-trainee queue.
- `6_centre_admin_dashboard.html` — centre setup, invites, assignment wording entry point.
- `7_ramy_command_center.html` — platform-owner view across centres.
- `8_assignment_wording.html` — per-centre assignment wording/structure/criteria editor.
- `9_assignment_submission.html` — trainee assignment form, both rounds.
- `10_tutor_assignment_marking.html` — tutor per-criterion marking + derived outcome.
- `11_assignment_record.html` — printable/PDF assignment record, both rounds.
- `for-claude-code-assignment-compliance-audit.md` — Cambridge Administration Handbook §8.2 compliance check against this build, current gaps, and what's confirmed solid. Read this alongside the files — it documents *why* several mechanisms (per-field criteria, return-unmarked vs. resubmission-needed, fresh declaration per round) are shaped the way they are.

## Wording distribution (decided 20 Sep 2026)
Screen 8 has "Export wording for trainees and tutors", which writes a `connect-hub-wording-v1` file of all five assignments. Trainees import it on the home page ("Import centre's wording"), tutors on the tutor dashboard ("Import centre wording"); either screen's other import button also accepts it. Nobody off the admin's device sees customised wording until they import the file; until then they work from `assignment-defaults.js`.

## Assignment 5 is out of sight until set (20 Sep 2026)
The plagiarism reflection is a centre sanction, not one of the four. No screen lists it until a tutor sets it for that candidate ("Set Assignment 5" on the marking screen of the assignment where the plagiarism was found; "Withdraw it" while nothing is submitted). `subs.a5.assigned = true` (with `assignedAt`, `assignedAfter`) is the flag; `a5InPlay()` in `hub-shared.js` is the one test, and a submission already on file counts as set. The home badge counts four assignments, five once it is set. Its wording stays editable on screen 8.

## Order, typefaces and shell (20 Sep 2026)
- The four assignments run in course order everywhere: **FOL, LRT, LSRT, LFC** (`ORDER` arrays on screens 6, 8, 9, 10; `ASSIGN_NAMES` on 5; `TYPES` on the home page).
- Typefaces are Newsreader (headings) and Karla (everything else) on every screen, including the assembled TP documents and the print view, which used Georgia/Calibri with terracotta headings before; the dictation bar used Inter; Kalam was loaded and never used. A document assembled before this date keeps the styles it was assembled with (the HTML is stored at return time).
- `hub-theme.css` is loaded last on screens 8-11 and gives them the shell every other screen has: paper header card with the terracotta rule, an eyebrow, a centred Newsreader title in teal, 6px-radius buttons and tabs, one board width.
- The tutor dashboard greets by the name the tutor types once there (`chub:tutorName`); it also prefills the Tutor field on screen 3 and the first-marker field on screen 10. No name, no fabricated greeting. The course name reads from course settings, and says so when none is set (20 Sep 2026).

## Tracker tab on the tutor dashboard (20 Sep 2026)
Ramy: the Classroom-side candidate tracker is manual; the Hub's must not be. `hub-tracker.js` carries the C17/2026 Candidate Tracker's rule engine (`readCandidate`, ported unchanged: Handbook 10.2 and 11.6, CELTA 5 p22, Ramy's rulings of 12-15 Sep 2026) and builds each candidate's record from the Hub's own data: TP grade and main aim from every feedback the tutor has returned (`roster.trainees[id].tp.history[n]`, kept across re-imports), assignment outcome, round and double marking from `assignments`. Only Stage 1/2/3, the Fail letter and withdrawal are set by hand on the tab (`roster.trainees[id].tracker`). Per browser, like the rest of the tutor dashboard: it shows the trainees this tutor has imported.

## Candidate tracker, screen 7 (design_handoff_candidate_tracker, 20 Sep 2026)
`7_candidate_tracker.html`, linked from the tutor dashboard. The handoff's grid (two tabs, filters with live counts, stage bands, tail column, legend, detail strip) with the Hub's colour-coded chips in the cells, by Ramy's choice. Every cell is a projection of the Hub's records via `hub-tracker.js`; the tutorial verdicts, Fail letter and withdrawal are set by hand in the detail strip. Departures from the handoff, all because the Hub holds no such data: no `due`/`missing` (no deadlines), no blind or disputed second marks (one outcome per assignment; the second marker's initials show as DM), no `absent`; the filter is "Double marked" (items with a second marker) rather than pending/disputed; "at risk" is the tracker rule engine's potential Fail. Submissions and marks now carry timestamps (`sub1At`, `sub2At`, `marked1At`, `marked2At`) so the trail can show real events; earlier records show none.
- Trainee side (20 Sep 2026): the home page's "Your progress" card opens `7_candidate_tracker.html?me=1`, one read-only row built from the browser's own records. The tutor's return file now carries every returned TP (`tp.history`) and the tutor's Stage/letter/withdrawal records (`tracker`); the home page stores them as `chub:tpHistory` and `chub:tracker`.

## The store (20 Sep 2026)
Ramy: "the whole point of not to have download, upload... they submit, the trainer sees it, marks it, it goes back, like Connect." So the records now live in a Google Sheet behind an Apps Script web app ("Connect Hub store", on Ramy's account; source in `store/` of the Claude session that built it, redeployed with clasp). Access is by link, as in Connect: a trainee's link is `index.html?t=<token>` and reaches only their own records; the tutor link is `5_tutor_dashboard.html?k=<course key>`. Course admin's Roster tab (opened from the tutor link) adds trainees and hands out their links. `hub-store.js` is the client; `hub-sync.js` fills the browser's storage from the store before each page's own script (now a `<script type="text/x-hub-app">` block) runs, and pushes every write back a moment later, so the pages themselves did not change. Opened with no link, the site is still the solo one-browser tool with its export/import; in store mode those controls hide. Kinds a trainee may write: plan, selfeval, assignments (and clearing feedback on Start next TP); tutors write everything. Page loads take one store call (`boot`), two to four seconds on Apps Script.

## Assignment cycle and TP gates, Connect-shaped (Ramy, 20 Sep 2026)
- **Order is per centre.** Screen 8 has up/down arrows on each assignment; the order is saved as `wording._order` and `hubAssignmentOrder(wording)` in `hub-shared.js` is the one reader (home badges and pills, 5, 6, 7's columns, 9's picker, 10). Default when nothing is set: FOL, LRT, LSRT, LFC; Assignment 5 always last.
- **Resubmission takes Connect's shape.** When a criterion is Not met, the first submission stays above each reopened section read-only and the resubmission is written in its own amber box, empty until the trainee starts it or presses "Start the resubmission from it", which copies the first attempt down. A fresh declaration is required, as on the first round. Round two's record shows both.
- **Two TP gates, as in Connect.** The self-evaluation opens only once the plan is turned in (screen 2 says so and locks every field); the returned feedback opens only once the self-evaluation is turned in (home badge "Returned — turn in your self-evaluation to read it", screen 4 says so; the candidate's tracker row reads "taught" for that TP until then).
- **Scripted steps on every screen.** A numbered `.hub-steps` strip under each header says what to do here, for trainees and tutors alike.
- **Structured answers bullet themselves.** On assignments whose wording is `structured` (LRT, LSRT), every answer box behaves like Connect's bullet fields (`hubBullets`): focus seeds a bullet, Enter starts a new one, Backspace on an empty bullet removes it. Prose assignments stay prose. The tutor's overall comment is not bulleted, by Ramy's rule.
- **One hover rule.** Cards lift by 1px with a teal ring; pills, tabs, chips, buttons and links get the same ring (`--hub-ring`) and plain buttons a teal wash (`--hub-wash`). Defined once in `hub-shared.js`.
- **Cache-busting.** `bump-assets.py` stamps `?v=` on every shared asset reference; run it before each push so a page never runs against a stale shared script.

## The assessor link (Ramy, 20 Sep 2026: "build the assessor link")
A third link, read-only: `12_assessor_pack.html?ak=<assessor key>`. Course admin's Roster and links tab shows it, with Copy and "Rotate the assessor link"; it stops working 14 days after the course end date set on the Settings tab (no end date = no expiry yet, and the tab says so). The store (`@7`) answers `boot`, `roster`, `get` and `course` to the key and refuses every other op with "The assessor link is read-only", even when a trainee's token comes with it; `hub-sync.js` in assessor mode drops every local write before it reaches the store. What the assessor sees: the pack's list (every candidate: TPs returned and the latest grade, each assignment's state in the centre's order, standing, cap, letter), the double-marking record with the Handbook 8.2.3 sample size for the cohort, and the briefs as the centre set them; per candidate, the tutorial records, each TP with the document the candidate received (`tpHistory[n].docHTML`, shown in place), the current TP's state, and each assignment with markers, dates and a door to the marked record (screen 11). The candidate tracker (screen 7) opens read-only with doors back into the pack; the tutor's prompts (potential Fail, letter advised, Stage due) stay the tutor's. Not included, because the Hub does not hold it: attendance, timetable, input sessions, the CELTA 5.

## The centre on the documents (Ramy, 20 Sep 2026)
Course admin's Settings (centre name, Cambridge centre number, logo) now show on every page header that carried the dashed "Centre logo" box (screens 1-4: the box becomes the logo, the centre-name line reads the setting and locks) and as a letterhead on both assembled documents: the TP feedback document built on screen 3 (so screens 4 and 12 show it as returned) and the assignment record on screen 11. `hubCentre()`, `hubLetterheadHTML(eyebrow)` and `hubApplyCentre()` live in `hub-shared.js`; the letterhead is inline-styled so it survives print and the stored `docHTML`. A document assembled before the settings were filled keeps the letterhead it was assembled with. With no name and no logo set, nothing changes.

## The name (Ramy, 20 Sep 2026: "let's go with Connect Lite")
Every screen title, the wordmark tag and every visible mention now say **Connect Lite**. Internal names stay as they were, on purpose: the repo and URL (`connect-Hub`), the Apps Script "Connect Hub store", the localStorage keys (`hub:*`, `chub:*`), the `HubStore`/`HubSync`/`HubTracker` globals and the `hub-*.js` files. Renaming those would break every link in circulation for no visible gain.

## The mark (Ramy, 20 Sep 2026: "we just want our old logo back")
A "Connect Lite identity" handoff (two Cs standing apart, a bare mark in the header, Instrument Sans "Lite") was built and then REJECTED by Ramy the same hour and reverted (4b32980): the mark is the Connect mark as it always was -- the interlocked Cs in the dark tile, gold-lifted and paper arcs, the slow spin on the home page -- with "Connect" in gold italic and "Lite" as the small teal tracked tag. The handoff was removed from `specs/`; do not rebuild it. What survived from that hour: no eyebrow under the lockup and none on screens 1 and 3 ("it's not just about teaching practice any more"), the home intro naming both loops, and a favicon set in `brand/` (favicon.svg, favicon.ico 16+32, apple-touch-icon.png 180) drawn from the old mark and linked on every page.

## Pages open at once (Ramy, 20 Sep 2026: "fix the lag issue")
Apps Script answers even a bare ping in 1.5-13 s (measured), so waiting for the boot on every page load was the lag. `hub-sync.js` now boots cache-first: once a link has booted in a browser (`hub:booted` = mode + credential), the page runs immediately from the localStorage keys it already holds (~250 ms), the boot runs behind it ("Checking the course…"), and if the course has moved on and nothing was written on this page meanwhile the page reloads itself, instantly, from the fresh copy ("The course has moved on — refreshing"). A write made before the boot answers wins: the boot then refreshes only the untouched keys and leaves the page alone. The roster is compared record by record (a page rewrites it in its own shape). First load on a new link still waits, since there is nothing to show yet. Measured: first load 3.0 s, cached 0.24 s, a roster change detected and refreshed within the boot's own time.

## The lockup, settled (Ramy's PDF, 20 Sep 2026)
Tile 40px with the Connect mark, "Connect" 27px gold italic, "LITE" in Instrument Sans 500 at 10px, 0.24em tracking, ink, no box. Same on the home, tutor dashboard, course admin and assessor pack.

## Trainee walk in store mode, 20 Sep 2026 (after the day's changes)
Walked live: home → plan turned in → self-evaluation (gate lifts) → tutor returns TP1 with the letterhead → home badge "Returned" → screen 4 → Start next TP → starred point into the next plan → FOL submitted → Not met → Connect-shaped resubmission (copy-down, fresh declaration) → Pass (on resubmission), double-marked → record with the letterhead → own tracker row. Fixed on the way: the assessor link used `?a=`, which is the assignment key on screens 9-11, so opening FOL stored "fol" as an assessor key and every later page opened read-only, silently dropping writes — the assessor key is now `?ak=` and a stray value is cleared; the own tracker row gated the current TP for ever because the candidate view never passed the self-evaluation in; the tutor's card on the home said "Waiting for trainee" after the plan was in (now "With your tutor" / "Waiting for your plan"); screen 4 said "in this browser" in store mode; the banner after a resubmission said "Submitted". Also the cache-first design's write race, seen for real: "Start next TP" left the page before the store answered and the clears were lost, so `hub-sync.js` now keeps every unconfirmed write in `hub:pending`, re-sends it from the next page, keeps the boot off those keys, and a page waits at most 2.5 s before moving on.

## Tutor walk in store mode, 20 Sep 2026 (after the day's changes)
Walked live with two seeded trainees: dashboard (Submissions / Assignments / Trainees, "Your name" greeting), course admin (Settings from the store, Roster and links with the tutor and assessor links, Tutors, Assignments in order, Double-marking), wording editor (order arrows → `wording._order` both ways), feedback with `?trainee=`, marking, record, tracker (filters with counts, detail strip, Stage 1 record → store). Fixed on the way: the Submissions table's TP column was the literal "TP" and its Grade column read a field that never existed (now the TP number from the plan and `state.f.fGrade`); the dashboard had no door to course admin (only screen 8 had one); a closed assignment's row opened the mark sheet, now the record; the record never printed who marked it (a "Marking record" section: first and second marker, dates, double-marked); the unconfirmed-writes ledger could hold a poison job for ever (a trainee write queued after the link was removed from the browser) — the ledger is now per link, a write without a token is never queued, and a write the store refuses is dropped. Both course keys were rotated at the end of the walk because a screenshot of the Roster tab put the old ones on the record: never screenshot that tab.

## Assessor walk in store mode, 20 Sep 2026 (after the day's changes)
Entered through the real link (`?ak=`), which cleared the tutor key from the browser as the last-link rule says. Verified live with two seeded candidates, one withdrawn with a Fail letter: the pack's header (course, centre and number, dates, the expiry line from the course end date), the candidates table with standing, cap and letter, the double-marking record with the 8.2.3 sample size, the briefs; a candidate's view with the tutorial records, each returned TP's document shown in place, the next TP's plan state, and every assignment with its markers and a door to the record; the tracker read-only (no record buttons, the tutor's advisory prompts hidden, the recorded letter and withdrawal shown, doors back into the pack); the record with the marking section and a back link to the pack; a write sent with the assessor key refused by the store. Fixed on the way: the pack read the next TP's plan from a field screen 1 never writes, so a turned-in plan for the next TP showed "not yet taught" (it now reads the plan's label).

