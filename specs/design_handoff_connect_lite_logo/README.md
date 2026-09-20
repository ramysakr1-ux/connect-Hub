# Handoff: Connect Lite — identity

## Overview
Connect Lite is the sister product to Connect: the same course records, running as static files on one machine with no server. This is its mark, built as a sibling of the Connect identity rather than a new one.

**The idea in one line:** the Connect mark is two Cs interlocked; Connect Lite is the same two Cs standing apart.

Nothing else changes. Same geometry, same arcs, same stroke weight, same three colours, same typefaces. The gap between the Cs is the entire distinction, and it is also the product's meaning — the same records, held separately, rejoined when the centre is ready.

## About the Design Files
`Connect Lite Logo.dc.html` is the identity sheet: primary lockup, comparison against the parent, six lockup configurations, avatar/favicon/header sizes, in-use panels, and the rules. `CELTA Connect Logo.dc.html` is included as the parent reference so the two can be checked side by side.

These are **design references built in HTML**, not production assets. Redraw the mark as an SVG file for the codebase using the exact path data below.

## Fidelity
**Final.** Geometry, palette, typography, lockups and small-size weights are all settled. The primary lockup is configuration D, avatar plus wordmark.

## The mark — exact geometry

ViewBox `8 30 126 60`. Two arc paths, both round-capped:

```svg
<svg viewBox="8 30 126 60" fill="none">
  <path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8"
        stroke="#B98B2A" stroke-width="11" stroke-linecap="round"/>
  <path d="M118.1 42.2 A 24 24 0 1 0 118.1 77.8"
        stroke="#16150F" stroke-width="11" stroke-linecap="round"/>
</svg>
```

Gold C: centre (40, 60), radius 24. Black C: centre (102, 60), radius 24. Centres are 62 units apart, which leaves a 10-unit gap between the gold C's caps and the black C's arc at a stroke of 11.

**The parent mark for comparison** — viewBox `8 30 104 60`, black C centred at (80, 60), centres 40 apart, so the two Cs overlap. Do not use the parent viewBox for Lite; the mark will clip.

## Primary lockup (configuration D)

Avatar tile plus wordmark, horizontally aligned, 22px gap.

- Tile: 84 × 84px, radius 22px, background matte black `#16150F`.
- Mark inside: 66 × 31px, gold arc `#D8A93A` (the lifted gold for dark grounds), second arc ivory `#F6F1E7`, stroke 12.
- Wordmark: "Connect" in Instrument Serif Italic 48px, line-height 0.9, gold `#B98B2A`, letter-spacing −0.01em. Then "Lite" in Instrument Sans Regular 18px, uppercase, letter-spacing 0.22em, matte black. 16px baseline gap between the two words.

No descriptor line. The lockup is the mark and two words.

## Other configurations
- **A — Horizontal.** Bare mark 92 × 44px, 11px gap, wordmark at 34px / 13px.
- **B — Stacked, centered.** Mark above, "Connect" 30px, "Lite" 11px at 0.34em tracking with matching left padding so it stays optically centred.
- **C — Wordmark only.** 38px / 14px. For body copy, legal lines, and anywhere the mark would be under 26px.
- **E — Reversed.** On `#16150F`: arcs in `#D8A93A` and `#F6F1E7`, wordmark in `#D8A93A` and `#F6F1E7`.
- **F — Single colour, stamp.** Both arcs `#16150F`, the first at 45% opacity. For certificates, embossing, single-plate print.

## Small sizes — weight compensation
The stroke thickens as the mark shrinks so the gap between the Cs stays open instead of closing up. Geometry never changes.

| Context | Mark size | Stroke |
| --- | --- | --- |
| Primary, print, large | 100px + | 11 |
| App header (26px minimum) | 56 × 27 | 12 |
| Avatar | 40 × 19 in a 50px tile | 13 |
| Favicon | 24 × 11 in a 28px tile | 15 |

Avatar tiles: 50px tile takes radius 13; 28px favicon takes radius 7; the 84px primary takes radius 22.

## Palette
Inherited from Connect with no additions.

| Name | Hex | Use |
| --- | --- | --- |
| Ivory | `#F6F1E7` | Page ground, second arc on dark |
| Off-white | `#FDFAF3` | Panel ground |
| Matte black | `#16150F` | Second arc, "Lite", avatar tile |
| Gold | `#B98B2A` | First arc, "Connect" wordmark |
| Lifted gold | `#D8A93A` | First arc and wordmark on dark grounds only |

## Typography
- **Instrument Serif Italic** — "Connect", always, always in gold.
- **Instrument Sans Regular 400** — "Lite", uppercase, 0.22em tracking. Never Semibold; it must not outweigh the gold.
- **Instrument Sans Semibold 600** — headings and UI.
- **IBM Plex Mono** — labels, codes, file names, data.

## Rules
1. The gap is the mark. At least 10 units at a stroke of 11, and the gold C's caps never touch the black arc.
2. Never interlock the Cs — that is the parent mark, and the two must never be interchangeable.
3. No colour of its own. The three Connect colours only.
4. "Lite" stays Regular weight at 0.22em tracking.
5. Thicken the stroke at small sizes per the table; never change the geometry.
6. No descriptor line, no "offline" tag, no wifi glyph.
7. Minimum mark size 26px wide in the app header. Below that, wordmark only.

## Files
- `Connect Lite Logo.dc.html` — the identity sheet.
- `CELTA Connect Logo.dc.html` — parent identity, for reference.
- `for-claude-code-connect-lite-logo.md` — build spec: SVG assets to cut, where each lockup goes, favicon and manifest notes.
