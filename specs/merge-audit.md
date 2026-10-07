# Magic Touches: merge audit against `main` (7 Oct 2026)

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `29e91545f0a1`), read 7 Oct 2026 19:23Z.
Scope: every page with a drop-in in a `design_handoff_*` folder from the Magic Touches round.

## Method

For each drop-in, I pulled the current `main` version and compared them line by line, ignoring `?v=` cache stamps:
- **Lines only in `main`:** what replacing the file would throw away.
- **Lines only in the drop-in:** the touch itself.

I also searched `main` for each touch's own CSS and comment markers, to see whether it has already landed.

## 1. One real clash, now fixed: `4_feedback_returned.html`

**What was wrong.** `main` has two fixes from after the drop-in was built:
1. **The declaration order fix.** The `V2_*` values are now declared before the opening panel reads them; as delivered, a returned TP opened to a blank page (ReferenceError on `V2_F`).
2. **No stamp for Not to standard.** `const g0 = v2Grade(V2_F.fGrade), g = g0 && !g0.n ? g0 : null;`

The "What worked" drop-in in `design_handoff_magic_touches/` was built before both. Replacing the file with it would have brought back the blank page and the N stamp.

**Fixed.** `design_handoff_magic_touches/4_feedback_returned.html` is now **`main` + What worked only**:
- **CSS:** the `/* What worked … */` rules (`.fv2-pair`, `.fv2-good`, `.fv2-code`, and the `.fv2-good` entrance) are inserted after `.fv2-open.fresh ~ .doc.current`.
- **JS:** the `if(currentOpen){ … }` opening-panel block is replaced with the What worked version, keeping `main`'s `g0` / no-N-stamp line and its comment.

Compared with `main`, exactly four lines go, all of them the old stars-only panel lines that the new block replaces:
- `const stars = …`
- its `.map` line
- `if (g || stars.length)`
- the old stars `<ul>` line

Nothing else in `main` is touched. The declaration-order fix stays where `main` has it.

**Test after merging:**
1. A returned TP graded To standard: stamp, "What worked", and the starred points, with no blank page.
2. Not to standard: no stamp; "What worked" and the stars still show.
3. A TP with no strengths and no stars, graded N: no opening panel at all.

## 2. Already in `main`: nothing to do

These drop-ins match `main`, or their markers are present:
- `index.html` (1a)
- `12_assessor_pack.html` (9b)
- `25_volunteer_register.html` (9a)
- `2_trainee_self_evaluation.html` (5a)
- `7_candidate_tracker.html` (8a)
- `13_grades_report.html` (10a)
- `18_observation_tasks.html` (12b)
- `19_observation_wording.html` (13a)
- `21_tp_grid.html` (11a)
- `24_tp_points.html` (11b)
- `28_tp_point_sets.html` (11c)
- `31_getting_to_know_you.html` (12a)

## 3. Not yet in `main`: safe to drop in whole

For each of these, `main` has no lines beyond the ones the drop-in edits on purpose (listed). They were built on the current `main`, so replacing the file loses nothing.

| File | Use the copy in | Lines in `main` it replaces (intended) |
|---|---|---|
| `1_trainee_plan_and_analysis.html` | `design_handoff_assignments_and_plan/` | none |
| `9_assignment_submission.html` | `design_handoff_assignments_and_plan/` | the old word-count line (two copies), replaced by the meter |
| `10_tutor_assignment_marking.html` | `design_handoff_assignments_and_plan/` | none |
| `5_tutor_dashboard.html` | `design_handoff_tutor_daily/` | `paintQueue(); paintTabsCounts(); paintRows();`, now with the day line |
| `3_tutor_feedback.html` | `design_handoff_meaty_bits/` | none |
| `23_timetable.html` | `design_handoff_meaty_bits/` | the slot time span, which gains `data-from` / `data-to` |
| `14_owner.html` | `design_handoff_last_four/` | the `minted-line` line |
| `16_final_report.html` | `design_handoff_last_four/` | none |
| `26_volunteer.html` | `design_handoff_last_four/` | the next-class, track and certificate lines (the v4 moments) |
| `27_volunteer_certificate.html` | `design_handoff_last_four/` | none |
| `20_celta5.html` | `design_handoff_celta5/` | the `nav.jump` line, replaced by the route |
| `8_assignment_wording.html` | `design_handoff_assignment_wording_v2/` | none |
| `17_how_it_works.html` | `design_handoff_last_two_v2/` | none |
| `30_precourse_key.html` | `design_handoff_last_two_v2/` | none |
| `4_feedback_returned.html` | `design_handoff_magic_touches/` (fixed, §1) | see §1 |

**The rule:** if `main` moves on before these are merged, apply each touch as the blocks its spec lists, not as a whole-file replacement. Every spec's appendices hold those blocks verbatim.

## 4. Older copies that are superseded: do not use

Several pages appear in more than one handoff folder. These older copies predate the current `main` and must not be dropped in:

| File | Superseded copies | Current |
|---|---|---|
| `5_tutor_dashboard.html` | `design_handoff_connect_hub/`, `design_handoff_tutor_dashboard_v2/`, `design_handoff_setup_welcome/` (its welcome is already in `main`, and the tutor_daily copy contains it too) | `design_handoff_tutor_daily/` |
| `12_assessor_pack.html` | `design_handoff_assessor_pack/` | `main` (9b landed) |
| `3_tutor_feedback.html`, `4_feedback_returned.html`, `1_…`, `2_…`, `8_…`, `9_…`, `10_tutor_assignment_marking.html`, `6_centre_admin_dashboard.html` | `design_handoff_connect_hub/` (Sept) | per §2 and §3; `6` is `main` |
| `6_centre_admin_dashboard.html` | `design_handoff_course_admin_v2/` | `main` |

## 5. Nothing else found

- No two Magic Touches drop-ins edit the same page.
- No drop-in removes a fix that is in `main`, apart from the one in §1, which is now fixed.
