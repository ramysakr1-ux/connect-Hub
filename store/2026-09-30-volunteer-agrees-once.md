# Version 46 — the one write a volunteer may make

Ramy, 30 Sep 2026: "we can always get them to sign something when they join…
Disclaimer, it can also come from Connect."

A volunteer's page (`26_volunteer.html`) now opens with the centre's joining
note — Connect's own volunteer sign-up consent, word for word — and an
"I agree" button. The click is kept on the device and stamped on the
register, so the tutor can see who has agreed.

## What changed in `Code.gs`

- The volunteer gate lets a third op through: `boot`, `ping` and now
  `volunteerAgree`. Everything else is still "This link only opens your own
  page".
- `case 'volunteerAgree'`: only a volunteer token; takes `at` (an ISO
  instant, the browser's; anything else becomes now); under the lock, sets
  `agreed` on THEIR OWN register row if it is empty. A second click, or a
  second device, never moves the date. Returns `{ agreed }`.
- The volunteer boot sends `agreed` alongside `name, here, marks, level,
  note` (marks + level were version 45, the same morning: without them the
  student's page and certificate showed zero hours).

## Proved on c5

boot before: `agreed: ""` → agree #1 stamps → agree #2 with a later time
returns the first → boot after shows the first → `putCourse` with a `v`
token still refused → an unknown token still "no longer opens the course".
