# A volunteer carries hours from earlier courses — version 52, 1 Oct 2026

Ramy: the certificate is "160 hours across the centre", and partial counts as
"half a tick".

Two rules changed in `hub-attendance.js`:

* a day marked **partial** credits **half** the day's minutes. It credited
  nothing, which made coming for part of an evening worth the same as not
  coming at all.
* `certificate(hours, target, lessonsInDay, lessonMinutes, carried)` takes a
  fifth argument: the hours a student already had at this centre. It is added
  before the target is tested, and the result reports `carried` and `total`.

160 hours cannot be earned on one course — a volunteer attends about
thirty-six — and Lite has no identity across courses, because a volunteer is a
token on one course. So the centre carries the figure by hand: a small "h
before" box on each row of the volunteer register (`st.carried`), and version
52 adds `carried` to the volunteer boot so their own page and their
certificate can add it on.

The default target changes from 20 to 160 on both pages.

Proved live after deploying: the volunteer boot now answers
`agreed, carried, cert, here, level, marks, name, note`.
