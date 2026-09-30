# Version 48 — the demo clock, and the certificate threshold reaches the student

Ramy, 30 Sep 2026: "a demo for a course that has no end date so it would
last… one showing the beginning of the course and one towards the end
before the assessor visit."

## The clock (client side, `hub-shared.js`)

`settings.demoToday` (YYYY-MM-DD) pins a course to a day. `hubToday()` and
`hubNow()` return that day (with the real time of day) when it is set, and
the real clock otherwise. Read by the timetable, the register, the
volunteer's page and hub-due (deadline states). Stamps on records stay
real. The sync pill turns gold and says "Demo, today is …". Course admin has
the field ("Pin today to — demo courses only"). Never set on a real course.

## What changed in `Code.gs`

- `assessorExpiry_`: returns null when `settings.demoToday` is set, so a
  pinned demo's assessor link never expires.
- The volunteer boot's settings subset gains `demoToday` and
  `volunteerCertificateHours`. The second is a bug fix found on the way: the
  centre's threshold never reached the student's page, which fell back to
  the default of 20 whatever the centre had set.
