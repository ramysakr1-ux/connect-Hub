# The TP7 & TP8 planning grid (28 Sep 2026) — deployed as version 35

**Why.** Ramy, with the centre's Word sheet ("TP7-TP8 Planning Grid — A1 and
B1"): the last two teaching practices are the candidates' own to plan — a main
aim, a sub aim and the material for each — "they fill it out… they don't have
to turn it in, but everyone should be able to see it", and "it shouldn't live
there until the MCT releases it".

**What.** One course-level object, kind `grid`:

    { rows: { <token>: { tp7: {main, sub, material, at}, tp8: {…} } },
      released: { <group>: true } }

Two ops, both writing one row / one flag at a time under the script lock
(`courseUpdateObj_`, the object twin of `courseUpdate_`):

- `gridSet {tp, main, sub, material}` — a candidate (their own token only)
  or a tutor (`token` names the row).
- `gridRelease {group, released}` — tutors only.

`boot` and `course` return `grid` **shaped per reader** by `gridFor_`: tutors
and the assessor get the whole object, rows by token; a candidate gets
`{released:false}` until their group is released, then `{released:true,
group, rows:[{name, mine, plan}]}` — their group's rows BY NAME, never a
token, never another group. The assessor's allow-list is unchanged (reads
via boot/course; gridSet/gridRelease are refused).

**Client.** `hub-sync.js` maps `course.grid` → `connect_tp_grid_v1` (read-only;
never put whole). `21_tp_grid.html` is the page: the two TPs are the last two
off `settings.tpCount` (default 8); a candidate edits their own row, reads the
group's; a tutor edits any row and releases per group through a gold "Are you
sure?" card; the assessor reads. A clash (same main aim, same TP, same group)
marks both cells amber; each candidate's earlier main aims sit beside their
name, read through hub-tracker's `tp<n>_aim`. Doors: a card on the candidate
home (only once released), a button on the tutor dashboard, a row in the
assessor pack.

**Proved on c5**, 28 Sep 2026: not released → no card, page says so, and the
candidate's copy carries no tokens; released to Group 1 → card, badge,
13 rows by name with one editable; Marta's TP7 saved to the store; Defne saw
Marta's row read-only; two Grammar picks marked a clash on the tutor's view;
rows blanked and the release taken back afterwards.
