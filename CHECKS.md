# Lite's checks: what runs, and when

Lite has no build and no server, so these are its whole test suite. Three run by themselves; the rest are a command.

## Before every commit (inside `python3 bump-assets.py`)
- `check-lockup.py`: the logo is the same everywhere (the tile, the arcs, LITE at 8/21, Ramy in gold).
- `check-colours.py`: a page uses tokens, never raw hex; a page may not gain raw colours (`COLOURS.md`).

## Before every push (`hooks/pre-push`, installed with `git config core.hooksPath hooks`)
- `check-screens.mjs`: every screen, every link, in a real browser, offline, against a neutralised store. No page error, no dead link.

## After every push, by hand (`npm run check:deployed`)
- `check-live.mjs`: every screen on the live site, in every role, against the real store.
- `check-phone.mjs`: today's screens at phone width: nothing runs off the right edge.

## Before every `clasp deploy` of the store (`npm run check:roles`)
- `store/check-roles.mjs`: every op, as nobody, a trainee, a volunteer, the assessor, a tutor, the owner, and a tutor of another course. The answers are a matrix in `store/role-matrix.json`; a change fails the run until it is read and written in (`-- --write`). And the secrets: nothing a trainee, a volunteer or nobody gets back carries another person's key. Runs on its own scratch course, "Role check — not a course".

## Now and then
- `check-criteria.mjs <tutor key>`: every criterion tagged on a course, with the wording it claims.
- `check-crit-learn.mjs`: does the criteria suggester still learn from what tutors tag.

## When one fails
Fix the page, not the check. A check that is wrong is changed in a commit that says why.
