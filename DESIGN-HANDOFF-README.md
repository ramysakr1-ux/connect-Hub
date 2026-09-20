# Handoff: Connect Hub (offline TP + assignments paperwork tool)

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
