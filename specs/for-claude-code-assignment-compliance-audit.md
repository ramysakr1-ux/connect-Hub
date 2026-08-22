# Assignment & feedback compliance audit — v3 (per-field mechanism, final before handoff)

Written 22 Aug 2026, for Claude Code. Supersedes v1 and v2 — the structural gap they both
flagged (#9: criteria tied to the whole assignment rather than individual fields) is now
fixed. This is the state to build from.

## What changed since v2

Rebuilt `8_assignment_wording.html`, `9_assignment_submission.html`,
`10_tutor_assignment_marking.html` and `11_assignment_record.html` on the same mechanism
already designed for Connect proper (see `Assignment Flow.dc.html` in this project — treat
it as the reference for exact wording, tone and states).

**Data model.** `criteria` on an assignment is now `[{text, sectionIndex}]` — each
criterion is tied to a specific section (or `sectionIndex: null` for a general,
whole-assignment criterion). Set from the admin wording builder, where each criterion has a
dropdown of the assignment's own sections to attach to.

**Tutor marking (`10_tutor_assignment_marking.html`).** Each criterion gets its own
Met/Not-met toggle *and* its own comment box (`criteriaMarks` and `criteriaComments`,
both keyed `{sub1: [], sub2: []}`, indexed by criterion). A separate general comment field
still exists for anything that doesn't fit under one criterion. Outcome is derived, not
picked: all criteria Met → Pass; any Not met on the first round → Resubmission needed; any
Not met on the second round → Fail (on resubmission). "Return unmarked" stays separate and
does not spend the resubmission.

**Trainee resubmission (`9_assignment_submission.html`).** On entering
`resubmission_needed`, the draft is reseeded once (`round2Seeded` flag) from the first
submission, EXCEPT: sections whose tied criteria are all Met stay locked and render
read-only (a "✓ Already met — carried forward" box, sourced straight from `sub1`, never
copied into the editable draft) and the declaration section is never seeded — it renders
blank so the trainee makes a fresh own-work/AI declaration every round. Sections with a
Not-met criterion reopen editable, with the tutor's per-criterion comment shown inline
above the field ("Your tutor, on '\u2026'"") — pulled from `criteriaComments.sub1`.

**Record (`11_assignment_record.html`).** Assembles both rounds' answers, a criteria table
with per-criterion Met/Not-met per round AND the tutor's per-criterion comment shown inline
under a Not-met cell, plus the separate general comments. This is the file just fixed to
match the new data shape — it was still on the old flat-string criteria format.

## Anything still open (unchanged from v2, not touched by this rebuild)

- **Materials/TP-lesson overlap check** (Handbook 8.2.1) — soft flag to the tutor if an
  LRT/LSRT material link matches a lesson-plan material link. Not built.
- **Double-marking record** (Handbook 8.2.3) — no first-marker/second-marker identity
  anywhere in the flow yet. Needs a "who is marking this" concept before the required
  double-marked proportion can be tracked or displayed.
- **Conflated assignments** — two assignments merged into one submission with two grades.
  Deliberately deferred; note it rather than build it unless asked.
- **Resubmission deadline check** — nothing validates a resubmission against the course's
  end date. Needs a course end-date value from centre admin settings, which isn't wired to
  real data yet.
- **Live word-count validation** — `wordMin`/`wordMax` show on the submission form but
  nothing counts what's actually been typed and blocks submission outside the range.
- **Language-error / plagiarism scanners** — `Assignment Flow.dc.html` also designs an
  automatic proofreading check (blocks a too-error-dense first submission from reaching a
  tutor, one-hour fix window near the deadline) and a text-similarity/malpractice scanner.
  Both are real backend logic (error detection, text diffing), explicitly out of scope for
  this build. Flagging so it isn't mistaken for an oversight — it's a deliberate line drawn
  to keep the build small and matched to what this project actually needs.

## What's solid

Assignment 5's framing as a centre sanction outside the four Cambridge assignments, the
hard-gated declaration (including the joint-preparation clarification), the exact outcome
vocabulary (Pass / Resubmission needed / Pass or Fail on resubmission / Fail), the
per-field lock-and-carry-forward mechanism, and the printable record all check out against
Handbook §8.2 and the real Connect design. No contradictions found.
