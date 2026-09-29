# The assessor link ends when the course ends (29 Sep 2026) — version 39

**Why.** Ramy, 29 Sep 2026: "let's just end it when the course ends." The
window had been the course end date **plus fourteen days** — ours, chosen to
match the assessor's two-week reporting deadline (Handbook 15.2); Cambridge
sets no expiry on assessor access at all. He weighed the real end of the
assessor's need — the final grades reach them and they approve, "like 48 hours
after or something" — and decided not to carry a fortnight for it: "the
assessor can always get another link, it's not really like a biggie."

**What.** One rule, in one place: the expiry is the **end of the course's last
day** instead of fourteen days after it. Nothing else changes — no new op, no
new field, the same `expires` in the boot answer, the same refusal when a link
is used after it.

## The change

In `Code.gs`, find the assessor expiry arithmetic. It is the only place that
adds fourteen days to the course end date; search the file for `14`.

It reads something close to this (the variable names are whatever the file
uses — keep them):

```js
  var d = new Date(end + 'T23:59:59');
  d.setDate(d.getDate() + 14);
```

Delete the second line:

```js
  var d = new Date(end + 'T23:59:59');
```

If the fourteen is written as a constant or added inline, the same rule
applies: **the expiry is the end date at 23:59:59, with nothing added.** Keep
the 23:59:59 — it is what makes the link work through the whole of the last
day, and the pages read the date at the front of the stamp as a day rather
than a moment (that is the fix from 21 Sep 2026; do not disturb it).

If any comment in the file explains the fourteen days, it now says the wrong
thing. Replace it with: `the link ends at the end of the course's last day
(Ramy, 29 Sep 2026)`.

## Deployed

**Version 39, 29 Sep 2026, 21:52** — as a new version of the existing
deployment (never "New deployment": that mints a new URL and every link in
circulation keeps pointing at the old code). The comment above
`assessorExpiry_` was rewritten at the same time; `d.setDate(d.getDate() + 14)`
is gone and the 23:59:59 stays.

**Parse before deploying.** In the editor tab's console:
`new Function(monaco.editor.getModels()[0].getValue())` — a stray comment that
swallows a brace saves happily and fails the deploy with "An error occurred"
(cost a deploy on 28 Sep 2026).

## The pages are already done (commit follows this file)

`12_assessor_pack.html`, `6_centre_admin_dashboard.html`, `invite.html` and
`offer.html` state the new rule and work the date out from the course end date
themselves, taking the store's stamped `expires` only as a fallback. That way
round is deliberate: a page that preferred the store's value would go on
announcing a fortnight that is no longer the rule.

They agree: checked against the live store after the deploy, every course
with an end date reports an assessor expiry equal to that date (c1 30 Oct,
c5 23 Oct); a course with no end date still reports none, as designed.

## Checked after the deploy

Store answers `ping`, `ownerCourses` (5), the C/17 grades page's course still
holds its ten grade rows, a tutor boot answers, and an assessor key is still
refused a write ("The assessor link is read-only"). Assessor expiry equals the
course end date on every course that has one.
