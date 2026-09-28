# The course stream (28 Sep 2026) — deployed as version 34

**Why.** Ramy, 28 Sep 2026: *"I think the only thing missing now is an
announcement stream? MCT to whole course/TP group. ACT to TP group."* Lite had
no way for a tutor to say one thing to the course — a room change, a deadline,
where a file is — except outside Lite.

**What.** One course-level list, kind `stream`, read by everyone on the course
with `boot` and `course` (both now return `stream` beside `settings`, `wording`
and `observations`). Written **one post at a time** by two tutor-only ops, never
whole through `putCourse`, so two tutors posting in the same moment cannot
overwrite each other:

```js
    case 'post': {
      requireTutor_(tutor);
      var ptext = String(req.text || '').trim();
      if (!ptext) throw new Error('Nothing to post');
      if (ptext.length > 2000) throw new Error('A post is at most 2000 characters');
      var post = { id: newKey_().slice(0, 12), at: new Date().toISOString(), by: String(req.by || '').slice(0, 80), to: String(req.to || '').slice(0, 12), text: ptext };
      var after = courseUpdate_(course.id, 'stream', function (list) { list.push(post); return list.length > 200 ? list.slice(list.length - 200) : list; });
      return { posted: post, stream: after };
    }
    case 'unpost': {
      requireTutor_(tutor);
      var pid = String(req.id || '');
      var left = courseUpdate_(course.id, 'stream', function (list) { return list.filter(function (p) { return p && String(p.id) !== pid; }); });
      return { removed: true, stream: left };
    }
```

`courseUpdate_(courseId, kind, fn)` is new: read, change, write under ONE
script lock. The lock is not re-entrant, so `courseWrite_` was split into the
locking wrapper and `courseWriteRaw_` (the body), and `courseUpdate_` calls the
raw one. A post is `{id, at, by, to, text}`; `to` is `''` for the whole course
or a TP group as the roster spells it. The list is capped at the last 200.

**Who.** Tutors post and delete (any tutor any post — one key is one key). A
candidate's token gets *Tutors only*; the assessor link gets *read-only* (the
op is not in the assessor allow-list). Candidates read it with their link and
filter to the whole course + their own group on the page; the assessor's boot
carries it and the pack does not draw it.

**Client.** `hub-sync.js` maps `course.stream` → `connect_course_stream_v1`
(read-only in every mode). `5_tutor_dashboard.html` composes and deletes
through `HubStore.call({op:'post'|'unpost'})` and replaces the local copy with
the list the store hands back. `index.html` shows the candidate's view; the
tab title carries the unseen count.

**Proved on c5**, 28 Sep 2026: three posts by the dashboard; Marta (group 1)
saw the whole-course and group-1 posts and not group 2's; a candidate token
and the assessor key were refused; deletes went through; the stream was
cleared afterwards.
