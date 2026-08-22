# Archived: original Apps Script build (superseded 22 Aug 2026)

This is the Connect Hub build that was live on `main` before the 22 Aug 2026
design handoff (`design_handoff_connect_hub/`) replaced it. Kept here for
reference — nothing from the earlier work is discarded, but it is not part of
the active build.

**What it was:** a Google Apps Script web app — one deployment, per-trainee
tokenized links (no separate login), Google Sheets as the data store, fronted
by a `celta-hub-wrapper` GitHub Pages redirector. `CELTA_hub_single_file.txt`
is `Code.gs`; `index.html`, `1_trainee_plan_and_analysis.html`,
`2_trainee_self_evaluation.html`, `3_tutor_feedback.html` are the four Apps
Script HTML Service templates (`Index`, `Plan`, `Self`, `Feedback`).

**Why superseded:** the current design (see the repo root and
`specs/for-claude-code-assignment-compliance-audit.md`) is `localStorage`-only
with no backend, no login, no Apps Script deployment — a deliberately
different architecture, not an iteration on this one. Screen wording,
structure, and the written-assignments loop (screens 5–11) don't exist in
this earlier version at all.

**If reviving any of this:** the token-link/no-login identification approach
and the Apps Script + Sheets storage model are the reusable ideas here — check
with Ramy before treating any of this code as current, since the active specs
in the repo root take precedence over anything in this archive.
