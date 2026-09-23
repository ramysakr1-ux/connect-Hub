# Tracker test harness

The C/17 candidate tracker is a standalone Apps Script with no repository of
its own, so this is where its tests live. `_`-prefixed, so Jekyll does not
publish it.

    npx @google/clasp clone 14ZHkyw5TRKcJIfbXd4rZvPF-8FX4_eD5h4uxsvxaq9cAP-ttsrEeNhwZ
    TRACKER_SRC=/path/to/that/Code.js node run.mjs

## What it is

`run.mjs` loads the tracker's **real `Code.js`** into a VM and runs it against
`fake.mjs`, a stand-in for the Apps Script sheet API. The fake implements only
the methods `Code.js` actually calls, so reaching for anything else throws
rather than being quietly absorbed — which is how it caught `ss.getId()` and
`Range.setValue()` on the first two runs.

## Why it exists

`startNewCourse` clears every grade on a course. Written 23 Sep 2026 with the
real C/17 mid-course and an assessment five days away, so there was nothing
safe to run it against — Ramy: *"just make sure nothing happens to this
course."* Its first execution would otherwise have been on live data.

It covers the guard (a wrong confirmation code, an empty one, no new course
code, an empty roster, duplicate candidates — and that **none of them writes
anything**), the wipe itself, and that the course is usable afterwards: a grade
saves against a new candidate, a stale id is still refused with
`STALE_ROSTER`, the health check is clean, and the confirmation now demands the
NEW course code.

## What it does not cover

Google's API surface. The fake matches Apps Script's shapes as closely as the
calls require, but only a real run proves the real API. Everything it *can*
test — the ordering, the locking sequence, the guard, the roster write, the id
handling — it does, against the shipped source.

## Keeping it honest

It reads the source from disk, never from the deployment, and refuses to run
without `TRACKER_SRC` rather than testing a stale copy. Clone the tracker
fresh before trusting a run.
