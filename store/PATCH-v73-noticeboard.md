# Code.gs v73 — the noticeboard: posts that go out later, and posts that travel

Ramy, 6 Oct 2026, walking the tutor's dashboard: *"Can I set a time for the
announcement to go off? Can I do this with more than one announcement? And can
I have announcements from the previous course travelling when I duplicate the
course, like Google Classroom does?"*

Several at once was always true. The other two are the store's. This is the
whole change, in five pastes. The pages that use it (5_tutor_dashboard.html's
noticeboard, the owner console's clone dialog) are already on the site and do
nothing different until the store answers.

**Deploy:** Save → Deploy → **Manage deployments** → the pencil → Version:
**New version** → Deploy. Never "New deployment" — that mints a new URL.

---

## 1 · `case 'post'` — an optional `publishAt`

Find (Ctrl+F): `if (req.due) post.due = String(req.due).slice(0, 40);`

Add directly under it:

```js
      /* v73 (6 Oct 2026): a post may be written to go out later. `publishAt`
         is when; until then streamFor_ keeps it out of every candidate's
         boot. A date already gone means now. */
      if (req.publishAt && /^\d{4}-\d{2}-\d{2}T/.test(String(req.publishAt))) {
        var pAt = new Date(String(req.publishAt));
        if (!isNaN(pAt.getTime()) && pAt.getTime() > Date.now()) post.publishAt = pAt.toISOString();
      }
```

## 2 · a new op, `postAt` — post it now, or move the date

Find: `case 'unpost': {` — and paste this **above** it:

```js
    /* v73: a held-back post (scheduled, or carried from the last course by
       cloneCourse) is posted now, or given a date. publishAt '' means now:
       the post is stamped afresh so it reads as posted today. */
    case 'postAt': {
      requireTutor_(tutor);
      var paId = String(req.id || '');
      var paWhen = '';
      if (req.publishAt && /^\d{4}-\d{2}-\d{2}T/.test(String(req.publishAt))) {
        var paD = new Date(String(req.publishAt));
        if (!isNaN(paD.getTime()) && paD.getTime() > Date.now()) paWhen = paD.toISOString();
      }
      var paList = courseUpdate_(course.id, 'stream', function (list) {
        return list.map(function (p) {
          if (!p || String(p.id) !== paId) return p;
          delete p.draft;
          if (paWhen) { p.publishAt = paWhen; } else { delete p.publishAt; p.at = new Date().toISOString(); }
          return p;
        });
      });
      return { saved: true, stream: paList };
    }
```

## 3 · the boot and the `course` op — hand each reader their stream

There are **two** lines to change, both reading
`stream: courseRead_(course.id, 'stream'),` — one inside `case 'boot'` (the
long `var boot = { course: { ... } }` line) and one inside `case 'course'`.
In **both**, replace

```js
stream: courseRead_(course.id, 'stream'),
```

with

```js
stream: streamFor_(course, courseRead_(course.id, 'stream'), tutor),
```

## 4 · `cloneCourse` — the posts come across, held back

Find: `var o = courseRead_(fromId, 'observations'); if (o) courseWrite_(nid, 'observations', o);`

Add directly under it:

```js
      /* v73: the noticeboard travels (Ramy, 6 Oct 2026: "like Google
         Classroom"). Every post comes across as a draft -- no group, no
         date, no publishAt -- that the new course's tutors post when the
         time comes, from the dashboard (postAt). Groups and dates belong to
         the course that is over. */
      var stSrc = courseRead_(fromId, 'stream');
      var stCarried = Array.isArray(stSrc) ? stSrc.filter(function (p) { return p && p.text; }).map(function (p) {
        return { id: newKey_().slice(0, 12), at: new Date().toISOString(), by: String(p.by || ''), to: '', text: p.text, draft: true, from: String(s.courseName || fromId) };
      }) : [];
      if (stCarried.length) courseWrite_(nid, 'stream', stCarried);
```

And in the `return { id: nid, ... copied: { settings: ..., wording: !!w, observations: !!o } ...` line of the same case, change

```js
copied: { settings: Object.keys(keep).length, wording: !!w, observations: !!o },
```

to

```js
copied: { settings: Object.keys(keep).length, wording: !!w, observations: !!o, posts: stCarried.length },
```

## 5 · the helper — paste above `function pinnedAt_(course, at) {`

```js
/* v73 (6 Oct 2026). What of the stream each reader gets. The tutor key sees
   everything: posts scheduled for later (`publishAt` ahead) and posts carried
   from the last course (`draft`). A candidate, and the assessor, see only
   what has gone out. A demo course pinned to a day (settings.demoToday) is
   "now" at the end of that day, so a seeded post scheduled for it shows. */
function streamFor_(course, list, tutor) {
  list = Array.isArray(list) ? list : [];
  if (tutor) return list;
  var s = course ? courseRead_(course.id, 'settings') : null;
  var now = (s && s.demoToday && /^\d{4}-\d{2}-\d{2}$/.test(String(s.demoToday)))
    ? new Date(String(s.demoToday) + 'T23:59:59Z').getTime() : Date.now();
  return list.filter(function (p) {
    if (!p || p.draft) return false;
    if (!p.publishAt) return true;
    var t = new Date(String(p.publishAt)).getTime();
    return isNaN(t) || t <= now;
  });
}
```

---

## What to expect afterwards

- On the dashboard, the composer has **Post on** beside **By when**. Leave it
  empty and the post goes out as it always did; set it and the confirm says
  *"It goes out on Thu 9 Oct, 09:00; until then only the tutors see it"* and
  the button reads **Schedule it**.
- Held-back posts sit above the live ones under *Held back — the trainees do
  not see these yet*, each with **Post now** and **Post on a date…**.
- **Start the next course from this** on the console carries every post
  across as *Not posted · from <the old course>*; the new course's tutor
  posts them, or dates them, from the same place.
- Trainees see nothing until a post is live. Their home loads the stream on
  every visit, so a scheduled post appears the first time they open it after
  the moment; nothing is pushed to a page that is already open.
- One re-run of `node check-live.mjs` or a walk of c1 after the deploy is
  enough to prove it: post something for ten minutes ahead as the tutor, open
  a trainee link, and see it absent, then present.
