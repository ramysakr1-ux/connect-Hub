# Assignment & feedback compliance audit — v4 (final, gaps closed)

Written 22 Aug 2026, for Claude Code. Supersedes v3. This closes out nearly every gap
flagged in v1–v3 — read this one; the earlier three are history.

## Closed this pass

- **Live word-count validation** — `9_assignment_submission.html` now counts words across
  all text/field answers live and shows it against the assignment's `wordMin`–`wordMax`.
  **Correction (23 Aug): changed from a hard gate to a visible warning.** The Handbook only
  states the centre *sets* this range (8.2.1) — it doesn't require blocking submission
  outside it. Word count now shows red/amber when out of range but never disables Submit.
- **Materials/TP-lesson overlap check** — the submission form has a "Materials link"
  field; the tutor marking screen (`10_tutor_assignment_marking.html`) compares it against
  the trainee's TP lesson-plan materials link (`chub:plan.matsLink`) and shows a flag
  banner on an exact match. Soft flag, not a block — matches the "note, not an accusation"
  treatment already used elsewhere in the design.
- **Double-marking record** — marking screen now has 1st/2nd marker name fields
  (`sub.markers.first/second`); a 2nd marker name sets `doubleMarked: true`. Centre admin
  (`6_centre_admin_dashboard.html`) has a new "Double-marking" tab listing every assignment's
  status, both markers, and double-marked yes/no, with the Handbook's required-proportion
  note (3 of each up to 9 candidates, 4 up to 16, 5 up to 24) for later wiring once real
  rosters exist.
- **Resubmission deadline check** — course start/end dates in centre admin now persist
  (`connect_course_settings`); the marking screen warns if sending a first-round Not-met
  back for resubmission would put a realistic resubmission window past the course end date.

## Still explicitly out of scope (unchanged, deliberate)

- **Language-error/proofreading scanner and text-similarity/plagiarism scanner** — both
  need real backend logic (text diffing, error detection), not UI. Designed in
  `Assignment Flow.dc.html` as reference but not part of this build.
- **Conflated assignments** — merging two of the four assignments into one submission with
  two recorded grades. Wording builder and marking screen are single-assignment only.

## What's solid

Everything from v3 still holds: per-field criteria tied to sections, lock-and-carry-forward
on resubmission, fresh declaration every round, per-criterion tutor comments, the exact
outcome vocabulary, Assignment 5's framing, and the printable record. No contradictions
found against Handbook §8.2 in this pass.
