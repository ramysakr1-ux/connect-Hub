# Lite's colours: the rules

One file holds every colour: `hub-tokens.css`. The notebook block at the bottom of it is the live palette. Pages use a token, never a raw hex.

## The rules

1. **Use a token.** `color:var(--ink)`, not `color:#232220`. A hex in a page is a bug waiting for the next repaint.
2. **Forest is Lite's voice** (`--teal`): buttons, cover panels, done stamps, where something stands.
3. **Oxblood is the pen** (`--brick`): where you are, what is due, what is wrong. Sparingly.
4. **Butter is the one thing to do next** (`--a-lemon`). One per screen.
5. **Gold is the mark only.** Never a button, never a fill. (`--gold` has the same value as forest on Lite; it exists for the printed documents.)
6. **Text on a dark fill** is white (`--paper`). Never a grey on forest.
7. **Fields are the only edged things**: `--field` with a border. Cards have no border; they have `--nb-shadow`.
8. **Corners**: `--r-control` for a control, `--r-strip` for a strip, `--r-card` for a card.
9. **Printed documents keep their own house** (the record, the pack, the final report, the fail letter, the certificate, CELTA 5). They are not Lite's look and are exempt.
10. **The mark never changes** (`--mark-tile`, `--mark-a`, `--mark-b`). Exempt.

## Checked

`python3 check-colours.py` runs inside `bump-assets.py` before every commit.

- A page may not gain raw hex colours. Each file has a ceiling in `colour-baseline.json`; the check fails when a file goes above it. Lowering a ceiling is good; raising one needs a reason in the commit.
- Exempt: `hub-tokens.css`, the printed documents, the mark, and the JavaScript that draws QR codes and canvases (those need real colours, not `var()`).

## When you change a colour

Change the token in `hub-tokens.css`, not the page. Then re-stamp (`bump-assets.py`) and walk two screens at phone and desktop size.
