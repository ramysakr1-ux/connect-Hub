# Assignment schedule — rule + final dates, for Claude Code

Written 17 Aug 2026. Consolidates today's timetable revisions (SRT, LRT, LFC, FOL) plus the general rule that governs how these dates get generated.

## The rule
**A group's submission or resubmission date must always fall on a day that group is not teaching TP** — i.e. on the day the *other* TP group has their session. Groups (currently ABC / DEF) are assigned per-course and can change course to course, so this must be computed from the actual TP roster for that course instance, not hard-coded to a weekday. Whenever the roster changes which candidates are in which group, or the TP rotation shifts, assignment due dates for that course should recompute off it — never keyed to a fixed calendar date independent of the roster.

Where both groups can reasonably share one due date (e.g. neither group is teaching that day — a demo-lesson or GTKY day), one shared date is fine; see LRT below.

## Final four-week shape dates (calendar dates shown = 6 Nov 2023 course start, Mon–Fri, for illustration — actual dates always derive from the course's own start date)

| Assignment | Released | Due | Resubmission |
|---|---|---|---|
| Assignment 1 — Focus on the Learner (FOL) | Day 1 (Mon) | Day 12 (Tue) | Day 15 (Fri) |
| Assignment 2 — Language Related Tasks (LRT) | Day 9 (Thu) | Day 10 (Fri) · both groups | Day 19 (Thu) |
| Assignment 3 — Skills Related Task (SRT) | Day 4 (Thu) | ABC: Day 7 (Tue) · DEF: Day 8 (Wed) | Day 13 (Wed) · both groups |
| Assignment 4 — Language and Focus Component (LFC) | Day 14 (Thu) | DEF: Day 16 (Mon) · ABC: Day 17 (Tue) | Day 19 (Thu) |

Notes:
- FOL's Day 10 is the divergence session (candidate-led, comparing pooled observation notes before submitting claims) — not a submission deadline. It's the only "comparing notes together" slot; the other Friday supervised-time slots that week are ordinary independent assignment-writing time, not a group session — don't relabel those.
- LFC releases Thursday (Day 14), not Friday, so it doesn't compete with that week's Stage 3 tutorial slots — most candidates aren't in a tutorial that day and can start on the assignment instead.
- LRT shares one due date across both groups because Day 10 is a demo-lesson/GTKY day — neither group is in graded TP, so the "non-teaching day" rule is satisfied for both at once.
- LFC and LRT resubmissions land on the same day (Day 19) — both already existed there; flagging in case that clustering needs spreading out once real course pacing is tested.

## Five-week shape — same rule, dates not finalized
The five-week ("Fridays off") shape's week-by-week summary (`FIVE_FRIDAY` in `Timetable Refresh.dc.html`) still has stale assignment labels from before today's renaming/re-dating, and — unlike the four-week shape's `WEEK2_DAYS`–`WEEK4_DAYS` — was never designed session-by-session, so its TP rotation isn't detailed enough yet to place SRT/LRT/LFC due dates against real non-teaching days with confidence. Treat as a design gap, not a build task: needs the same day-by-day pass as the four-week grid before dates can be set. The same non-teaching-day rule applies once that pass happens.

## Build implication
This is a scheduling *rule*, not a fixed table — implement it as: for each assignment, resolve "non-teaching day for group X" from that course's TP roster/rotation, then place due/resubmission dates accordingly. The table above is the four-week worked example, not a hard-coded date map.
