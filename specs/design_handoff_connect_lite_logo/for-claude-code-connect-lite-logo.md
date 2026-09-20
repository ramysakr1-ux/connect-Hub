# Build spec — Connect Lite identity

For Claude Code. Applies to the `connect-lite` static build (formerly connect-Hub) and to any Connect surface that links to it.

## 1. Rename

The product is **Connect Lite**. "Connect Hub" and "connect-Hub" are retired. Rename in this order, and do not leave the two names co-existing in the UI:

- Repo / folder: `connect-lite`
- Entry point stays `index.html` — centres are told "open index.html", so the filename must not change.
- Page `<title>`: `Connect Lite`
- Any in-app string containing "Hub": replace with "Lite". Check the download page, the close-out screens, the print headers and the footer credit.
- `localStorage` keys: leave them alone. Renaming keys orphans every centre's existing data. Add a migration only if a key is user-visible.

## 2. SVG assets to cut

Cut these from the identity sheet as real files. All use viewBox `8 30 126 60` with the two paths below; only stroke colour and width change.

```
gold C:  M56.1 42.2 A 24 24 0 1 0 56.1 77.8
black C: M118.1 42.2 A 24 24 0 1 0 118.1 77.8
stroke-linecap="round" on both, fill="none" on the svg
```

| File | Arc 1 | Arc 2 | Stroke |
| --- | --- | --- | --- |
| `mark.svg` | #B98B2A | #16150F | 11 |
| `mark-reversed.svg` | #D8A93A | #F6F1E7 | 11 |
| `mark-mono.svg` | #16150F @ 45% | #16150F | 11 |
| `mark-header.svg` | #B98B2A | #16150F | 12 |
| `avatar.svg` | #D8A93A | #F6F1E7 | 13 — inside an 84×84 rect, radius 22, fill #16150F |
| `favicon.svg` | #D8A93A | #F6F1E7 | 15 — inside a 28×28 rect, radius 7, fill #16150F |

Do not scale one stroke weight to cover all sizes. The weights in this table are the design; a single 11-weight asset shrunk to favicon closes the gap between the Cs and the mark reads as one blob.

Also emit `favicon.ico` (16 and 32) and a 180×180 `apple-touch-icon.png` from the favicon geometry.

## 3. Where each lockup goes

- **App header** — configuration A at 26px minimum mark width, `mark-header.svg` + wordmark. Never the avatar tile in the header; the tile is for identity surfaces, not chrome.
- **Sign-in / launch screen** — configuration D, the primary: 84px tile + wordmark at 48px/18px.
- **Print headers on candidate records** — configuration F, single colour. The mark must survive a monochrome laser printer, which is what most centres have.
- **Footer** — configuration C, wordmark only, plus the "Designed by Ramy" credit in the existing treatment.
- **Folder / download label on the Connect side** — `mark-header.svg` beside `connect-lite` in IBM Plex Mono, with "open index.html" beneath it.

## 4. Wordmark markup

Two elements, not one string, because the two halves take different fonts and weights:

```html
<span class="wordmark">
  <span class="wordmark-connect">Connect</span>
  <span class="wordmark-lite">Lite</span>
</span>
```

```css
.wordmark { display: flex; align-items: baseline; gap: 16px; }
.wordmark-connect {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic; font-size: 48px; line-height: .9;
  letter-spacing: -.01em; color: #B98B2A;
}
.wordmark-lite {
  font-family: 'Instrument Sans', Helvetica, sans-serif;
  font-weight: 400; font-size: 18px;
  letter-spacing: .22em; text-transform: uppercase; color: #16150F;
}
```

Scale both sizes and the gap proportionally; the 48 : 18 : 16 ratio holds at every size. `.wordmark-lite` never goes above weight 400.

## 5. Fonts offline

Connect Lite runs with no network, so Google Fonts will not resolve at a centre. Self-host:

- Instrument Serif Italic (400)
- Instrument Sans 400, 600
- IBM Plex Mono 400, 500

WOFF2 in the build, declared with `@font-face` and `font-display: swap`. Fallbacks `Georgia, serif` and `Helvetica, sans-serif` are already in the design and are load-bearing — check the lockup does not reflow badly when the webfont is missing, because for some centres it will be.

## 6. Do not

- Interlock the Cs. That is the Connect mark. If a surface needs the parent mark, use the parent asset.
- Introduce a colour outside ivory / matte black / gold / lifted gold.
- Add "offline", "static", "no server", or a wifi glyph to the lockup.
- Put the avatar tile in the app header.
- Set "Lite" in Semibold or tighter than 0.22em.
- Use a single SVG at all sizes. See the stroke table.

## 7. Check before shipping

- Favicon at 16px: the gap between the two Cs still reads.
- Header lockup with webfonts blocked: no overlap, no reflow past its container.
- A candidate record printed on a mono laser: the mark is legible and the 45% arc has not vanished.
- No occurrence of "Hub" in any user-facing string, page title, or print header.
