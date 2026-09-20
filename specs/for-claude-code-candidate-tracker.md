# Build spec — Candidate Tracker

For Claude Code. Target repo `ramysakr1-ux/celta-connect`, with a Connect Hub (static/offline) variant.

## 1. What this screen is

One grid, two tabs, same candidate rows:

- **Assignments** — FOL, LRT, LSRT, LFC, in that order. Not alphabetical, not by deadline. FOL first.
- **Teaching practice** — TP1…TP8, grouped Stage 1 (TP1–2), Stage 2 (TP3–5), Stage 3 (TP6–8).

It is read-only. Every action opens an existing record; nothing is edited in the grid.

## 2. Data shape

```
Candidate {
  id, name,
  assignments: {
    fol | lrt | lsrt | lfc: {
      state: 'not_due' | 'due' | 'missing' | 'submitted' | 'pass'
           | 'resubmit_required' | 'resubmitted' | 'pass_on_resubmission' | 'fail',
      firstMarker: initials | null,
      doubleMark: null | { state: 'in_progress' | 'agreed' | 'differs', marker: initials, grade }
    }
  },
  tps: {
    tp1..tp8: {
      grade: 'not_taught' | 'taught' | 'above' | 'to_standard' | 'not_to_standard' | 'absent',
      tutor: initials | null,
      doubleMark: null | { state: 'in_progress' | 'agreed' | 'differs', marker: initials, grade }
    }
  }
}
```

### Grade vocabulary — do not extend
TP grades are **above standard / to standard / not to standard**. There is no "below standard". `taught` is not a grade; it means the lesson happened and the written feedback is not yet signed off. `absent` means the TP was not taught and needs rescheduling.

Assignment outcomes are pass or fail, with the resubmission states in between. One resubmission only, and it unlocks only the failed sections — the grid does not show sections, but `pass_on_resubmission` must be distinguishable from `pass` because it means the resubmission has been spent.

## 3. Derived values

```
toMark(c)      = assignments in {submitted, resubmitted} + TPs in {taught}
doubleMark(c)  = items whose doubleMark.state is in_progress or differs
atRisk(c)      = any assignment in {fail, missing}
                 OR count(TPs with grade == not_to_standard) >= 2
passedTail(c)  = count(assignments in {pass, pass_on_resubmission}) + " / 4"
stdTail(c)     = count(TP1..TP6 in {to_standard, above}) + " / 6"
```

The TP tail counts TP1–6 only, not 7–8 — the final two are usually still running when the trainer is using this screen.

## 4. Cell rendering

Two parts, always both once the item exists:

```
<first mark> / <second mark>
```

| doubleMark | second part |
| --- | --- |
| null | `—` (faint) |
| in_progress | `DM …` |
| agreed | `DM <same token as first>` |
| differs | `DM <their token>`, bold purple, ring on the cell |

Not-yet-due cells render `·` and no second part at all.

## 5. Filters

`Everyone` · `To mark` · `Double marking` · `At risk`. Single selection. Counts are live: To mark and Double marking count *items*, At risk counts *candidates*. A zero count renders no number.

## 6. Detail strip

Opens under the grid on cell click, replacing whatever was open. Content is generated from the cell, not stored:

- **Facts** — assignment: brief name, deadline, first marker, second marker state. TP: stage, tutor, lesson length (40 min for TP1–2, 60 min from TP3), blind second-mark state.
- **Outstanding / Action points** — only when the item needs work (resubmit, resubmitted, fail, missing, not to standard). Assignment criteria come from the brief; TP action points come from the last signed feedback.
- **Trail** — time-ordered events already logged elsewhere. Do not invent entries; if the Hub has no event, show nothing.
- **Actions** — one primary, one optional secondary:
  - submitted / resubmitted → Open the mark sheet
  - missing → Send a reminder
  - not due / due → Open the brief
  - marked → Open the marked record
  - taught → Sign off the feedback
  - doubleMark.differs → Standardise (secondary)
  - no doubleMark and a first marker exists → Assign a second marker (secondary)

## 7. Connect Hub integration

The Hub already holds assignment submissions and TP records. This screen is a projection over them:

- Assignment state comes from the submission record plus the mark sheet, not a separate field. `resubmit_required` is the presence of an open resubmission window; `pass_on_resubmission` is a mark sheet whose submission is the second one.
- TP grade comes from the signed TP record. Unsigned → `taught`.
- Double-marking state comes from the second-marker assignment record. For TP the second mark is **blind**: the second marker must not see the first mark. This grid is the trainer/course-tutor view and shows both — enforce the blind rule in the marking screen, not here.
- Known Hub gaps that block this screen: the multi-trainee and double-marking gaps in the Hub review, and the three critical bugs (resubmission spending, record printing, starred action points split across file/localStorage). Fix those before wiring the grid, or the counts here will be wrong.

## 8. Colour rule

Colour marks only what needs the trainer. Passes, above standard, and to standard carry no fill and a quiet grey-green ink. Blue = waiting on the trainer. Amber = candidate has work to do. Red = wrong. Purple = double marking, and nothing else. Exact values in the README token table.

## 9. Accessibility

Colour is never the only signal — every state carries a word. The ring on a disputed cell is paired with bold purple text. At-risk rows carry the words "at risk" beside the name, not just the tint.
