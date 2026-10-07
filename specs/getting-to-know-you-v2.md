# Getting to know you: three cards, dealt, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `f868e7bc87aa`), read 7 Oct 2026 18:53Z.
Design: `Magic Touches.dc.html`, 12a. Drop-in: `31_getting_to_know_you.html` in this folder.

Trainee view only, display only:
- **Unchanged:** `render()`, `offered()` (the three dealt by token hash), the bands, `pickIt` and `unpick` (`shareMaterial` / `unshareMaterial`), the shelf, and the copy.
- **Tutor and assessor views:** they see the whole pool, and nothing applies there (`IS_TRAINEE` gate).

Sections 1–3 cover the edits, the four behaviours and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`. All its rules are scoped under `#app.gk`.
2. An IIFE goes after the `hub:ready` listener. It adds `.gk` to `#app` and re-applies after every `render()` via a `MutationObserver` (childList).

## 2. Behaviour

### 2.1 The deal (first paint only)

- **Animation:** each `.act` runs `gk-deal`, .55s `cubic-bezier(.2,.7,.2,1)`, from opacity 0, translateY 18px and rotate −1.2°.
- **Stagger:** `--gk-i` × 110ms.
- **Once only:** after `400 + n × 110`ms the deal is marked done, and later renders set `animation:none`, so picking and unpicking never re-deal.

### 2.2 Numbering and hover

- **Number:** each `h2` gains a leading `span.gk-n`, "1 of 3": Instrument Sans 700 10px, ls 0.16em, uppercase, `--gold-deep`. The `h2` becomes flex, baseline, gap 10.
- **Card hover:** border `--sand-line-deep`, shadow `0 14px 26px -20px oklch(30% 0.04 60 / .55)`, .2s.
- **"Pick this one" hover:** lifts 1px, shadow `0 8px 16px -10px oklch(37.5% 0.058 195 / .8)`.
- **Focus-visible** on buttons, the peek and the band chips: 2px `--gold-lifted` outline, offset 2.

### 2.3 The pick

**The chosen card** (`.act.chosen`, which the page already sets):
- Background `--paper`. The page's gold inset edge is kept.
- **Stamp:** `::after` "Your pick", absolutely positioned at top 14 / right 16.
  - Padding 5/12/4, 2px `--gold-deep` border, radius 6, `--paper` background.
  - Newsreader 700 0.95rem `--gold-deep`, rotate −6°.
- **On phones (≤560px):** the stamp is static, sits above the title, and is aligned left.

**The stamp animation.** `gk-stamp`, .5s, from scale 2 / −14° to −6°. It plays only when a pick appears after the deal, i.e. when the trainee has just picked; a pick that was already there on load doesn't animate.

**The other two cards** (when `#app` has `.gk-picked`):
- Opacity .82.
- Steps (`ol`) and `.online` hidden, so each card folds to its title and meta.
- A `button.gk-peek` goes first in `.row`: "Read the steps", or "Fold it away" once open. 0.78rem 600 `--teal`, underlined on hover. `aria-expanded` is set.
- **Open state:** per card, held in memory as a set of ids. It survives re-renders and is not stored.
- **Copy:** the page's own "Take your pick back to choose this instead." stays beside it.

**Taking the pick back.** `.gk-picked` comes off, all three unfold, and the peek buttons are removed.

### 2.4 Reduced motion and print

- **Reduced motion:** no deal, stamp or hover transitions.
- **Print:** no animation, every card's steps shown, and no peek buttons.

## 3. Test

1. **Trainee, no pick:** three cards deal in one after another, each numbered "n of 3", and hover lifts the shadow.
2. **Picking card 2:**
   - "Your pick" stamps onto card 2.
   - Cards 1 and 3 fold to their titles with "Read the steps".
   - The pick box at the top updates as before.
3. **"Read the steps" on card 3:** it opens, and the button reads "Fold it away".
4. **Reload with a pick:** the cards deal, card 2 is stamped without the stamp animation, and the others are folded.
5. **Take it back:** all three unfold and nothing re-deals.
6. **The level band changes** (chips): the three re-render without dealing again.
7. **Tutor view:** the whole pool, unchanged, with no numbers or folding.
8. **375px:** the stamp sits above the title.
9. **Reduced motion:** static.

---

## Appendix A: existing card rules (verbatim, `main`)
```css
  .act{background:var(--surface); border:1px solid var(--sand-line); border-radius:10px; padding:16px 20px; margin-top:12px;}
  .act.chosen{border-color:var(--gold); box-shadow:inset 4px 0 0 var(--gold);}
  .act h2{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.15rem;}
  .act .meta{margin:3px 0 10px; font-size:0.78rem; color:var(--grey); letter-spacing:0.04em;}
  .act ol{margin:0; padding-left:20px; font-size:0.9rem; line-height:1.6;}
  .act .online{margin:10px 0 0; font-size:0.84rem; color:var(--ink-warm); background:var(--field); border-left:3px solid var(--teal); padding:8px 12px;}
  .act .row{margin-top:12px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;}
  .btn{font:inherit; font-size:0.82rem; font-weight:600; padding:8px 14px; border-radius:8px; border:1.5px solid var(--teal); background:var(--teal); color:#fff; cursor:pointer;}
  .btn.ghost{background:var(--field); color:var(--ink); border-color:var(--sand-line);}
  .btn:disabled{opacity:0.55; cursor:default;}
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): three cards, dealt ----------------------------------
     For the trainee: the three activities arrive as three numbered cards,
     dealt one after another. Picking one stamps it "Your pick" and folds the
     other two to their titles (a tap opens them again), so the page says what
     it is for: one choice, made. The tutor's view of the whole pool is left
     as it is. Display only. Design: Magic Touches, 12a. */
  .gk .act{position:relative; animation:gk-deal .55s cubic-bezier(.2,.7,.2,1) both; animation-delay:calc(var(--gk-i, 0) * 110ms);}
  .gk .act h2{display:flex; align-items:baseline; gap:10px;}
  .gk .act h2 .gk-n{font-family:'Instrument Sans',sans-serif; font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--gold-deep);}
  .gk .act:hover{border-color:var(--sand-line-deep, oklch(78% 0.02 80)); box-shadow:0 14px 26px -20px oklch(30% 0.04 60 / .55);}
  .gk .act{transition:box-shadow .2s ease, border-color .2s ease, opacity .3s ease;}
  .gk .act .btn:not(.ghost){transition:transform .15s ease, box-shadow .15s ease;}
  .gk .act .btn:not(.ghost):hover{transform:translateY(-1px); box-shadow:0 8px 16px -10px oklch(37.5% 0.058 195 / .8);}
  .gk .act.chosen{background:var(--paper);}
  .gk .act.chosen::after{content:'Your pick'; position:absolute; top:14px; right:16px; padding:5px 12px 4px; border:2px solid var(--gold-deep); border-radius:6px;
    font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:0.95rem; color:var(--gold-deep); transform:rotate(-6deg); background:var(--paper);}
  .gk .act.chosen.gk-new::after{animation:gk-stamp .5s cubic-bezier(.3,1.5,.5,1) both;}
  .gk.gk-picked .act:not(.chosen){opacity:.82;}
  .gk.gk-picked .act:not(.chosen):not(.gk-open) ol, .gk.gk-picked .act:not(.chosen):not(.gk-open) .online{display:none;}
  .gk.gk-picked .act:not(.chosen):not(.gk-open) .meta{margin-bottom:0;}
  .gk-peek{font:inherit; font-size:0.78rem; font-weight:600; color:var(--teal); background:none; border:0; padding:0; cursor:pointer;}
  .gk-peek:hover{text-decoration:underline; text-underline-offset:3px;}
  .gk .act .btn:focus-visible, .gk-peek:focus-visible, .chip:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  @keyframes gk-deal{from{opacity:0; transform:translateY(18px) rotate(-1.2deg);}to{opacity:1; transform:none;}}
  @keyframes gk-stamp{0%{opacity:0; transform:scale(2) rotate(-14deg);}60%{opacity:1; transform:scale(.94) rotate(-5deg);}100%{transform:rotate(-6deg);}}
  @media(prefers-reduced-motion:reduce){ .gk .act, .gk .act.chosen.gk-new::after{animation:none;} .gk .act, .gk .act .btn{transition:none;} }
  @media(max-width:560px){ .gk .act.chosen::after{position:static; display:inline-block; margin:0 0 8px;} .gk .act.chosen{display:flex; flex-direction:column;} .gk .act.chosen::after{order:-1; align-self:flex-start;} }
  @media print{ .gk .act{animation:none;} .gk.gk-picked .act:not(.chosen) ol{display:block;} .gk-peek{display:none;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): three cards, dealt ----------------------------------
     For the trainee: the three activities arrive as three numbered cards,
     dealt one after another. Picking one stamps it "Your pick" and folds the
     other two to their titles (a tap opens them again), so the page says what
     it is for: one choice, made. The tutor's view of the whole pool is left
     as it is. Display only. Design: Magic Touches, 12a. */
  .gk .act{position:relative; animation:gk-deal .55s cubic-bezier(.2,.7,.2,1) both; animation-delay:calc(var(--gk-i, 0) * 110ms);}
  .gk .act h2{display:flex; align-items:baseline; gap:10px;}
  .gk .act h2 .gk-n{font-family:'Instrument Sans',sans-serif; font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--gold-deep);}
  .gk .act:hover{border-color:var(--sand-line-deep, oklch(78% 0.02 80)); box-shadow:0 14px 26px -20px oklch(30% 0.04 60 / .55);}
  .gk .act{transition:box-shadow .2s ease, border-color .2s ease, opacity .3s ease;}
  .gk .act .btn:not(.ghost){transition:transform .15s ease, box-shadow .15s ease;}
  .gk .act .btn:not(.ghost):hover{transform:translateY(-1px); box-shadow:0 8px 16px -10px oklch(37.5% 0.058 195 / .8);}
  .gk .act.chosen{background:var(--paper);}
  .gk .act.chosen::after{content:'Your pick'; position:absolute; top:14px; right:16px; padding:5px 12px 4px; border:2px solid var(--gold-deep); border-radius:6px;
    font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:0.95rem; color:var(--gold-deep); transform:rotate(-6deg); background:var(--paper);}
  .gk .act.chosen.gk-new::after{animation:gk-stamp .5s cubic-bezier(.3,1.5,.5,1) both;}
  .gk.gk-picked .act:not(.chosen){opacity:.82;}
  .gk.gk-picked .act:not(.chosen):not(.gk-open) ol, .gk.gk-picked .act:not(.chosen):not(.gk-open) .online{display:none;}
  .gk.gk-picked .act:not(.chosen):not(.gk-open) .meta{margin-bottom:0;}
  .gk-peek{font:inherit; font-size:0.78rem; font-weight:600; color:var(--teal); background:none; border:0; padding:0; cursor:pointer;}
  .gk-peek:hover{text-decoration:underline; text-underline-offset:3px;}
  .gk .act .btn:focus-visible, .gk-peek:focus-visible, .chip:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  @keyframes gk-deal{from{opacity:0; transform:translateY(18px) rotate(-1.2deg);}to{opacity:1; transform:none;}}
  @keyframes gk-stamp{0%{opacity:0; transform:scale(2) rotate(-14deg);}60%{opacity:1; transform:scale(.94) rotate(-5deg);}100%{transform:rotate(-6deg);}}
  @media(prefers-reduced-motion:reduce){ .gk .act, .gk .act.chosen.gk-new::after{animation:none;} .gk .act, .gk .act .btn{transition:none;} }
  @media(max-width:560px){ .gk .act.chosen::after{position:static; display:inline-block; margin:0 0 8px;} .gk .act.chosen{display:flex; flex-direction:column;} .gk .act.chosen::after{order:-1; align-self:flex-start;} }
  @media print{ .gk .act{animation:none;} .gk.gk-picked .act:not(.chosen) ol{display:block;} .gk-peek{display:none;} }
</style>
</head>
<body>
<div class="board">
  <a class="back" id="back" href="index.html">&#8592; Back</a>
  <div id="app"></div>
</div>
<script src="hub-shared.js?v=202610072151">
```
