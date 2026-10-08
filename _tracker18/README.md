# C18/2026 Candidate Tracker (Apps Script)

Rebuilt 8 Oct 2026 after the C/17 tracker's Apps Script project was deleted
(its web app answered 404; the project was gone from Drive and clasp). Its
rules survived in `hub-tracker.js` (ported there 20 Sep 2026) and its sheet
layout in the C/17 data sheet; this is the tracker rebuilt on both.

**Keep the source here.** The last one lived only in Google and was lost.

- Script: `12mjqQF58FtQAeK1aCQPUvna4HKgDiPfIIltk9N8OvI5gfNARR7FEKkYn`
- Web app (deployment): `AKfycbzgWOkURwyfR_0rKXf82milZ5Lfm4VsuhX91hc2voDNUWHsnAdJnYx5d5YMSSrPhI9w`
  — opened by `c17-candidate-tracker/index.html` (the Classroom button page)
- Data sheet: `1e-m_PWv3i6qdFZenCFBk5OJggGUhAjHO7jsod3PEG6s` ("C18/2026 Candidate Tracker (data)", C/18 folder)

## Change it

    # Index.html = Index.src.html with __LOGO__ replaced by ih-small.png as a data URI
    python3 -c "import base64;s=open('Index.src.html').read();open('Index.html','w').write(s.replace('__LOGO__','data:image/png;base64,'+base64.b64encode(open('ih-small.png','rb').read()).decode()))"
    node test.mjs                                   # server in a VM + the page in Chromium; must be all passed
    npx @google/clasp@latest push --force
    npx @google/clasp@latest deploy -i AKfycbzgWOkURwyfR_0rKXf82milZ5Lfm4VsuhX91hc2voDNUWHsnAdJnYx5d5YMSSrPhI9w -d "what changed"

Always `deploy -i <that id>`: a bare `deploy` mints a new URL and the button
page goes stale.
