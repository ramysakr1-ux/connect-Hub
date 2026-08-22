# Handoff: Connect Hub (offline TP + assignments paperwork tool)

## Overview
Connect Hub is a separate, standalone tool from the main Connect app (`ramysakr1-ux/celta-connect`) — its own repo (`ramysakr1-ux/connect-Hub`), static HTML, no build step, no login/backend. It replaces a folder of shared Word docs and email threads for one purpose: a trainee's teaching-practice paperwork (lesson plan → self-evaluation → tutor feedback) and their five written assignments (LRT, LSRT, FOL, LFC, Assignment 5), end to end, self-contained in the browser (`localStorage`, no server).

None of this has been shared with the main Connect repo or discussed there — treat everything in this package as new context.

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
- `connect_assignment_submissions_v1` — per-assignment state machine: `stage: 'draft'|'submitted'|'resubmission_needed'|'resubmitted'|'closed'`, `sub1`/`sub2` snapshots, `criteriaMarks: {sub1:[], sub2:[]}` and `criteriaComments: {sub1:[], sub2:[]}` indexed by criterion, `usedResubmission` flag, `feedback: {outcome, generalComment1, generalComment2}`.
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
