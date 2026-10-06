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

## The store half (NOT YET APPLIED)

`shareMaterial` builds its row from named parameters, so `aim` is accepted and
silently dropped until the row keeps it. Nothing breaks in the meantime — the
card simply goes on showing the practice number.

One field to add to the row `shareMaterial` appends, beside `tp` and `kind`:

```js
aim: String(b.aim || '').slice(0, 40),
```

**Paste the whole `shareMaterial` function here before changing it**, and take
the replacement line by line number. On 6 Oct 2026 an instruction to add a
field "right beside" another one was typed adjacent to it instead of after the
comma — `celta5agreement:1` — and it destroyed two record kinds on every live
course. Exact lines, never descriptions of where.
