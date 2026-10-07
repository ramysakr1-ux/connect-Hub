# Trainee tracker: reading the grid, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Design: `Magic Touches.dc.html`, 8a. Drop-in: `7_candidate_tracker.html` in this folder.

Display only. `render()`, `renderDetail()`, the chips, the filters, the DM strip and every key are unchanged. The page's rule still holds: **colour only marks what needs you; everything fine stays quiet.** The new bars follow it. Sections 1–3 cover the changes and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`.
2. An IIFE goes at the end of the last script. It watches `#gridwrap` (childList) and re-applies after every `render()`.

No markup or `render()` changes.

## 2. The three touches

### 2.1 Crosshair

- **On `mouseover` inside `#gridwrap`:**
  - The hovered `.grid.row` gets `.tk-row`: background `--sand-deep` (fallback `oklch(94.8% 0.01 85)`). An at-risk row (`.row.risk.tk-row`) uses `oklch(95% 0.02 40)` instead, so it stays warm.
  - Every `.cell[data-col=X]` in the hovered cell's column gets `.tk-col`: background `color-mix(--teal 5%, transparent)`.
  - The matching `.colhead .col` gets `.tk-col`, and its `b` turns `var(--deep)`.
- **`mouseleave`** on the wrap clears both.
- **Transition:** `.row` background, .12s.
- **Touch screens** (`@media (hover:none)`): no crosshair.
- **Print:** none.

### 2.2 Column bars (`.tk-bar`)

**Placement.** Appended inside each `.colhead .col`, under "mark / DM". Each bar is built once per render (guarded).

**Counting.** For column *i*, each `.grid.row`'s *i*th `.cell .chip` is counted by class:

| Chip class | Counts as |
|---|---|
| `.wrong` | wrong |
| `.work` | work |
| `.wait` | wait |
| `.nd` | not counted |
| anything else (`.fine`, `.above`, plain) | fine |

**Bar.**
- Flex, 4px tall, margin 6px auto 0, width `min(80%, 92px)`, radius 2, overflow hidden.
- Track: `oklch(91% 0.012 82)`.
- Segments, in this order, each with width = count ÷ rows shown × 100%:
  - wrong: `var(--red)` = `oklch(46% 0.17 25)`
  - work: `var(--amb)` = `oklch(45% 0.11 65)`
  - wait: `var(--blu)` = `oklch(40% 0.09 235)`
  - fine: `var(--line)` = `oklch(89.5% 0.012 82)`, the quiet colour

**Tooltip.** `title` and `aria-label` read, e.g., "1 needs attention · 2 to do · 1 waiting · 3 fine", or "nothing yet".

**Follows the filter.** The bars are computed from the rows actually shown, so "To mark" or "At risk" redraws them for that subset.

**Print:** hidden.

### 2.3 Detail strip opening

`.detail` runs `tk-open` (.32s `cubic-bezier(.2,.7,.2,1)`, from opacity 0, translateY −8px, scaleY .98). It plays every time a cell opens it.

**Reduced motion:** no row transition and no animation.

## 3. Test

1. **Assignments tab:**
   - Hover LRT for Ben: Ben's row goes sand, the LRT column goes faint teal, and the LRT heading darkens.
   - Moving to another cell moves both. Leaving the grid clears them.
2. **Bars:** each column's bar shows red, amber and blue for what needs the tutor and the quiet line for the rest. Hovering a bar shows the counts.
3. **Filter "To mark":** the bars redraw for the filtered rows.
4. **Teaching practice tab:** the bars sit under TP1–8, and the stage bands are unchanged.
5. **Click a cell:** the detail strip slides open. Close works as before.
6. **Trainee's own view** (`?me=1`): one row. The bars still draw; with one row, the crosshair is just the row.
7. **Touch device:** no crosshair. **Print:** no bars.

---

## Appendix A: v8 CSS (verbatim)
```css
  /* ---- v8 (7 Oct 2026): reading the grid ------------------------------------
     A crosshair under the cursor (the row and the column it sits in), a thin
     bar under each column heading that says how that column stands across the
     cohort, and the detail strip opening rather than appearing. Colour keeps
     the page's rule: only what needs you is coloured; fine is the quiet line.
     Display only. Design: Magic Touches, 8a. */
  .row{transition:background-color .12s ease;}
  .row.tk-row{background:var(--sand-deep, oklch(94.8% 0.01 85));}
  .row.risk.tk-row{background:oklch(95% 0.02 40);}
  .cell.tk-col{background:color-mix(in oklab, var(--teal) 5%, transparent);}
  .col.tk-col b{color:var(--deep);}
  .tk-bar{display:flex; height:4px; margin:6px auto 0; width:min(80%, 92px); border-radius:2px; overflow:hidden; background:oklch(91% 0.012 82);}
  .tk-bar i{display:block; height:100%;}
  .tk-bar .wrong{background:var(--red);} .tk-bar .work{background:var(--amb);} .tk-bar .wait{background:var(--blu);}
  .tk-bar .fine{background:var(--line);}
  .detail{animation:tk-open .32s cubic-bezier(.2,.7,.2,1) both; transform-origin:50% 0;}
  @keyframes tk-open{from{opacity:0; transform:translateY(-8px) scaleY(.98);}to{opacity:1; transform:none;}}
  @media(prefers-reduced-motion:reduce){ .row{transition:none;} .detail{animation:none;} }
  @media(hover:none){ .row.tk-row{background:none;} .cell.tk-col{background:none;} }
  @media print{ .tk-bar{display:none;} .row.tk-row, .cell.tk-col{background:none;} }
```

## Appendix B: v8 JS (verbatim)
```js
/* ---- v8 (7 Oct 2026): crosshair + column bars ---------------------------------
   Layered on render(): a MutationObserver on #gridwrap re-applies after every
   render. Reads the chips' own classes; stores nothing. */
(function(){
  const wrap = document.getElementById('gridwrap'); if (!wrap) return;
  const TONES = ['wrong', 'work', 'wait'];
  const NAMES = { wrong: 'needs attention', work: 'to do', wait: 'waiting' };
  function bars(){
    const head = wrap.querySelector('.grid.colhead'); if (!head) return;
    const heads = [...head.querySelectorAll('.col')];
    const rows = [...wrap.querySelectorAll('.grid.row')];
    heads.forEach((h, i) => {
      if (h.querySelector('.tk-bar')) return;
      const counts = { wrong: 0, work: 0, wait: 0, fine: 0, nd: 0 };
      rows.forEach(r => {
        const c = r.querySelectorAll('.cell')[i]; const chip = c && c.querySelector('.chip'); if (!chip) return;
        const k = TONES.find(t => chip.classList.contains(t)) || (chip.classList.contains('nd') ? 'nd' : 'fine');
        counts[k]++;
      });
      const n = rows.length || 1;
      const seg = k => counts[k] ? '<i class="' + k + '" style="width:' + (counts[k] / n * 100).toFixed(2) + '%"></i>' : '';
      const tip = [...TONES, 'fine'].filter(k => counts[k]).map(k => counts[k] + ' ' + (NAMES[k] || 'fine')).join(' \u00b7 ') || 'nothing yet';
      h.insertAdjacentHTML('beforeend', '<span class="tk-bar" title="' + tip + '" aria-label="' + tip + '">' + seg('wrong') + seg('work') + seg('wait') + seg('fine') + '</span>');
    });
  }
  let lastRow = null, lastCol = null;
  function clear(){
    if (lastRow) lastRow.classList.remove('tk-row');
    if (lastCol) wrap.querySelectorAll('.tk-col').forEach(el => el.classList.remove('tk-col'));
    lastRow = lastCol = null;
  }
  wrap.addEventListener('mouseover', e => {
    const cell = e.target.closest('.cell'), row = e.target.closest('.grid.row');
    if (!row) { clear(); return; }
    if (row !== lastRow) { if (lastRow) lastRow.classList.remove('tk-row'); row.classList.add('tk-row'); lastRow = row; }
    const col = cell ? cell.dataset.col : null;
    if (col !== lastCol) {
      wrap.querySelectorAll('.tk-col').forEach(el => el.classList.remove('tk-col'));
      if (col) {
        wrap.querySelectorAll('.cell[data-col="' + col + '"]').forEach(el => el.classList.add('tk-col'));
        const cells = [...row.querySelectorAll('.cell')], i = cells.indexOf(cell);
        const h = wrap.querySelectorAll('.grid.colhead .col')[i]; if (h) h.classList.add('tk-col');
      }
      lastCol = col;
    }
  });
  wrap.addEventListener('mouseleave', clear);
  new MutationObserver(() => { lastRow = lastCol = null; bars(); }).observe(wrap, { childList: true });
  bars();
})();
```
