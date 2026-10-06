# 6 Oct 2026 — a shared material carries its lesson's aim

Ramy, walking the volunteer student's page: *"can it read the lesson, like the
main aim of the lesson instead? Just the word maybe reading, listening,
grammar."*

## Why it cannot be worked out on the page

A volunteer's page receives four things and no more: their own register row,
the course settings, the timetable, and the share list. The aim lives on the
TP point cell (`rows[token]['tp' + n].aim`, one of hub-rotation's seven —
Grammar, Vocabulary, Functional language, Reading, Listening, Speaking,
Writing), and a volunteer never receives TP points and never should: they are
the candidates' own teaching record.

The trainee's own browser **does** hold it at the moment they share the file.
So the aim rides along with the share rather than being looked up later.

## The client half (already live)

`1_trainee_plan_and_analysis.html` gains `aimForTP(n)`, which reads the cell
this browser already has, and `shareMaterial` is called with one more field:

```js
const r = await window.HubStore.call({ op: 'shareMaterial', token: window.HubStore.token(),
  name: m.name, url: m.url, by: ($('fName').value || '').trim(), tp: tp, kind: 'materials',
  aim: aimForTP(tpNumberOf(tp)) });
```

`26_volunteer.html` shows it in place of the practice number, because "TP6" is
the course's own word and that page is read by language learners in five
languages who have never heard it. A material shared before this still shows
"TP6"; the fallback is deliberate.

## The store half

`shareMaterial` builds its row from named parameters, so `aim` is accepted and
silently dropped until the row keeps it. Nothing breaks in the meantime — the
card simply goes on showing the practice number.

**The anchor.** This line appears exactly once in `Code.gs`, as the last line
of the `item` object inside `case 'shareMaterial'`:

```js
                   kind: String(req.kind || '').slice(0, 20) };
```

**Replace that one line with these two:**

```js
                   kind: String(req.kind || '').slice(0, 20),
                   aim: String(req.aim || '').slice(0, 40) };
```

The `};` moves to the end of the new line. Nothing else in the function
changes, and no other op is touched.

Then: Save → Deploy → Manage deployments → pencil → Version: **New version** →
Deploy. Never "New deployment": that mints a new URL and every link in
circulation keeps pointing at the old code.

Once deployed, the volunteer boot already carries the share list
(`shared: courseRead_(course.id, 'shared')`), so the aim reaches the card with
no further change. Materials shared before the deploy keep showing their
practice number; the fallback in `26_volunteer.html` is deliberate.

**Why it is given as a whole line and not a description.** On the morning of
6 Oct 2026 an instruction to add a field "right beside" another one was typed
adjacent to it rather than after the comma — `celta5agreement:1` — which
destroyed the `celta5` and `celta5t` record kinds on every live course and
broke CELTA 5 saving until it was found. No data was lost, because the guard
throws before `write_()` is called. Exact lines, never descriptions of where.
