# The volunteer register and a volunteer's own link (30 Sep 2026) — versions 41, 42, 43

**Why.** Ramy: "you have no idea how big a problem finding volunteer students
is for a course." The register is native and counted against the timetable;
each student gets their own link to a page that says when the next class is,
which room to join, what their teachers have shared, and how far they are
from a certificate of attendance.

## Version 41 — the course kind `volunteers`
`putCourse` accepts `kind: 'volunteers'`. In `course` and `boot` it is served
as `volunteers: reader ? courseRead_(course.id, 'volunteers') : null` —
**tutors and the assessor only, a candidate gets null.** These are members of
the public; a candidate has no business holding a list of their names and who
turned up when. The assessor does need it (Handbook 14.1 lists attendance
registers for the visit).

## Version 42 — a volunteer's link
In `handle_`, after the assessor block and before the trainee token:
```js
  var vol = null;
  if (!course && req.v) {
    var vs = String(req.v);
    var cut = vs.indexOf('-');
    var vc = cut > 0 ? courseById_(vs.slice(0, cut)) : null;
    if (!vc) throw new Error('This link is not on a course');
    var reg = courseRead_(vc.id, 'volunteers') || {};
    var found = (reg.students || []).filter(function (s) { return s && s.token === vs; })[0];
    if (!found) throw new Error('This link no longer opens the course');
    course = vc; vol = found;
  }
  if (vol && op !== 'boot' && op !== 'ping') throw new Error('This link only opens your own page');
```
The token is `"<courseId>-<20 hex>"`: the course half is a direct lookup, the
random half is the secret. At the top of `case 'boot'`, a volunteer gets its
own small answer and nothing else:
```js
      if (vol) {
        var vset = courseRead_(course.id, 'settings') || {};
        return { volunteer: { name: vol.name, here: vol.here || [], note: vol.note || '' },
                 course: { settings: { centreName: vset.centreName, courseName: vset.courseName,
                                       start: vset.start, end: vset.end, logo: vset.logo,
                                       timeZone: vset.timeZone, onlineRooms: vset.onlineRooms || [],
                                       tutorNames: vset.tutorNames || '' },
                           timetable: courseRead_(course.id, 'timetable') } };
      }
```
Never the roster, the wording, the points, the observations, the stream, or
another volunteer's row. Verified live: writes refused ("Tutors only"),
`course` refused, an unknown token refused, a candidate still gets `null`.

## Version 43 — the course id in a tutor's boot
`boot.course.id = course.id` for a tutor/assessor. The register mints each
student's link in the tutor's browser and had no other way to learn which
course it was on. Not a secret: the key already proves the course.

## The rollback in between — do not repeat
Two deploys between 41 and 42 **re-deployed version 40** while the dialog
said "Deployment successfully updated." The register's course kind vanished
from live for about twenty minutes. Cause: in the Manage deployments dialog,
**typing the description resets the Version dropdown to the current
version.** Order that works: pencil → type the description → open Version →
click "New version" → `find "Version"` and confirm the HEADER reads "New
version" → Deploy → confirm the success panel names the new number → probe
the live store from Node. A ref click on the option can also land one row
off when the pane is hidden; always confirm the header before Deploy.

**Parsing before deploy:** `new Function(text)` is now blocked by the
editor's CSP. Use Monaco's markers instead:
`monaco.editor.getModelMarkers({resource: monaco.editor.getModels()[0].uri}).filter(m => m.severity >= 8)`.
