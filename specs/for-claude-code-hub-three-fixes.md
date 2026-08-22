# Connect Hub — three fixes to port

Written 22 Aug 2026, for Claude Code. Three targeted fixes made after reviewing the live
deploy (`ramysakr1-ux.github.io/connect-Hub`). Apply to `1_trainee_plan_and_analysis.html`
and `3_tutor_feedback.html`.

## 1. Native `confirm()` dialogs replaced with a styled modal
`1_trainee_plan_and_analysis.html` used the browser's native `confirm()` for three
warnings (turn-in with missing fields, switching lesson framework, switching analysis
type). Native dialogs show the page's URL/origin in the chrome, which read as broken/ugly
in review. Replaced with a custom modal: brick-red top border, "Cancel" / "[action] anyway"
buttons, no browser chrome. Also added visible disabled-state styling (`background:
var(--sand-deep); color:var(--grey); cursor:not-allowed; opacity:0.75`) so a turned-in,
locked plan reads as locked at a glance instead of looking editable while silently
rejecting input.

## 2. Suggestion-chip tooltips: native `title` → custom instant tooltip
`3_tutor_feedback.html`'s criteria-suggestion chips (the up-to-3 chips that appear under a
strength/action point as the tutor types) used the native `title` attribute to show the
full criterion text on hover. Native tooltips have a long delay and are easy to miss —
read as "hovering does nothing." Replaced with a CSS-only custom tooltip (`data-tip`
attribute + `::before`/`::after` on hover) that appears instantly above the chip.

## 3. Strengths/action points now render as real bullet lists
In the printed/returned feedback document, `pointsTable()` was joining each
strength/action point with a literal `"• "` character prefix and `<br>` — not a real list.
Confirmed policy: every free-text field in both the lesson plan and the tutor feedback
renders as a bulleted list EXCEPT four specific fields, which stay plain paragraphs:
**candidate/class profile**, **overall tutor comment**, **tutor's comment on the language
analysis**, and **tutor's comment on the self-evaluation**. Strengths/action points were
the one place still using a bullet-character-in-text hack instead of a real `<ul><li>` —
now fixed to match every other bulleted field (main/sub/personal aims, materials,
procedure, anticipated problems, self-evaluation answers).

## Not a bug, flagging so it isn't re-reported
Tutor's comment on the self-evaluation / language analysis only appears in the assembled
feedback once (a) the trainee has actually turned in that section, and (b) the tutor has
typed something in the corresponding comment box — an empty comment box is deliberately
omitted from the printed document (the on-screen guide text says this explicitly). Confirm
both conditions before treating an absent comment as broken.
