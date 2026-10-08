# The candidate tracker (Apps Script) — C/17's, restored for C/18

On 8 Oct 2026 the C/17 tracker's Apps Script project was found deleted (its
web app answered 404). Its code was recovered from the session logs:

- `history/index-2026-09-07.html` — the page as first pasted into Apps Script
- `history/Code-2026-09-12.js` — the server file as printed on 12 Sep
- `history/edits/` — every later edit, as logged (12 Sep → 27 Sep)
- `history/replay.py` — replays those edits, in order, in a sandbox
  (no clasp, no git, no writes outside the two files). Five edits fail on
  replay exactly as they failed when first run; the replay output says so.

`index.html` and `Code.js` here are that replay's result, plus the C/18
changes only: course code C18/2026, the C/18 data sheet as the default,
the C/18 names as the roster seed, and `COURSE_LEVELS = ['B1','A1']` (both
groups B1 for TP1–4, A1 from TP5; null restores C/17's swapping levels).

**Keep the source here.** The last one lived only in Google.

- Script `12mjqQF58FtQAeK1aCQPUvna4HKgDiPfIIltk9N8OvI5gfNARR7FEKkYn`
- Deployment `AKfycbzgWOkURwyfR_0rKXf82milZ5Lfm4VsuhX91hc2voDNUWHsnAdJnYx5d5YMSSrPhI9w`
  (opened by `c17-candidate-tracker/index.html`, Classroom's button page)
- Data sheet `1e-m_PWv3i6qdFZenCFBk5OJggGUhAjHO7jsod3PEG6s` (C/18 folder)

    node test.mjs        # Code.js in a VM + index.html in Chromium
    npx @google/clasp@latest push --force
    npx @google/clasp@latest deploy -i AKfycbzgWOkURwyfR_0rKXf82milZ5Lfm4VsuhX91hc2voDNUWHsnAdJnYx5d5YMSSrPhI9w -d "what changed"

Never a bare `clasp deploy`: it mints a new URL and the button page goes stale.
The project file must be called `index.html` (lower case): `doGet` serves 'index'.
