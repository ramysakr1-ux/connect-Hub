# A course needs its Cambridge centre number (version 60, 1 Oct 2026)

Ramy, from his console: "all I'm entering is the course number and the name
of the centre... it should also have to enter the centre number, because
that's the only way to ensure that this is actually a certified CELTA centre.
I don't want a shady centre to pretend to be a CELTA centre and use Connect
Lite. It should not work without a centre number."

## createCourse
Requires `centreNumber` — two letters and three to five digits (`TR001`),
upper-cased, spaces dropped — and refuses otherwise:
`A course needs its Cambridge centre number, e.g. TR001`. Takes an optional
`centreName`. Writes the course's first `settings` record:
`{ centreNumber, centreLocked: true, centreName? }`.

Anchor: `case 'createCourse': {` … after `requireOwner_(owner);` and after
`sheet_(SHEET_COURSES).appendRow([cid, cname, new Date()]);`.

## putCourse, kind settings
If the stored settings carry `centreLocked` and a `centreNumber`, the
incoming data's `centreNumber` is replaced by the stored one and
`centreLocked` stays true — Course admin shows the number read-only and
could not change it even by hand.

Anchor: `case 'putCourse': {` … before `courseWrite_(course.id, ck, …)`.

## ownerList_
Each course carries `centreNumber` (from settings) for the console's cards.

## cloneCourse
`centreLocked` joins the list of settings that carry over.

## Proved live
- `createCourse` with no number and with `nope` → refused.
- A throwaway course made as `zz 123` → stored `ZZ123`, locked; the tutor key
  then sent `centreNumber: 'XX999'` through `putCourse` → read back `ZZ123`,
  still locked; deleted afterwards.
- `ownerCourses`: c1 TR073, c4/c6/c7 TR999, c2 none (made before this).

Screens: `14_owner.html` asks for the number (button off until it is one)
and shows it on the card; `6_centre_admin_dashboard.html` makes the field
read-only with "Set by Connect when the course was made". The seeds and the
scratch-course tool pass `TR999`.
