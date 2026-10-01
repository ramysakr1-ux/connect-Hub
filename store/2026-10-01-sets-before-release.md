# A candidate's timetable gets the sets before the points are released (1 Oct 2026) — version 55

**Why.** The timetable draws its letters — who teaches with whom, in which
order — from the roster, which only a tutor has. A candidate's timetable
therefore showed a dash in every teaching slot (found making the timetable
mock, 1 Oct 2026). The one thing a candidate does get that holds the sets is
the TP points record, and that came back as `{released:false}` until their
tutor released the points.

**What.** `tpPointsFor_` for a candidate whose group is not yet released now
returns `{ released:false, group, sets, me }` — the sets (tokens in letter
order, first set then second) and their own token, never the points. The
released branch is unchanged. `23_timetable.html` builds a candidate's letters
from `tppoints.sets` when the roster is absent, and lifts their own letter.

**Proved** on a scratch course with unreleased points (sets and me present, no
points), and on the visit demo where the points are released (unchanged).
