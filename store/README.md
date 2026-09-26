# The store (Apps Script)

The Connect Lite store is an Apps Script web app, **not** a file in this repo.
Its source of truth is the Apps Script project "Connect Lite store":

https://script.google.com/home/projects/16l_gwb2Dlei1rxAzDGXFzmuGSHV_WxTv4znZMXltzAFgx0XMSo_dn4w2/edit

One file, `Code.gs`. Its deployed `/exec` URL is the `URL` in `hub-store.js`.
To change it: edit in the Apps Script editor → Save → **Deploy → Manage
deployments → pencil → Version: New version → Deploy**. Do NOT make a "New
deployment": that mints a new URL and every link in circulation keeps
pointing at the old code.

Changes are recorded here as patches, with the anchors they were applied to,
so the editor's text and this folder can be reconciled.

## 26 Sep 2026 — the teaching-practice history, one row per TP
See `2026-09-26-tpHistory-per-row.md`. Deployed as version 20.

## 26 Sep 2026 — any record too big for one cell, split across rows
See `2026-09-26-chunked-records.md`. Deployed as version 21. The per-TP change
above fixed two TPs sharing a cell; this fixes one record that is itself too
big, which tagging the demo's feedback points with their criteria made real.
Proven live by `node store/verify-chunks.mjs` (ten checks).

## 26 Sep 2026 — critLearn, a course record for what its tutors tag
See `2026-09-26-critlearn.md`. Deployed as version 22. One more course kind,
handed to a tutor only. Proven by `node check-crit-learn.mjs`.

## 26 Sep 2026 — seedCritLearn, a centre's next course starts from its last
See `2026-09-26-seed-critlearn.md`. Deployed as version 23. Proven by
`node store/verify-seed.mjs`, which makes its own courses and deletes them.
