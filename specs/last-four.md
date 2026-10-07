# The last four: volunteer page, certificate, final report, owner console: complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Design: `Magic Touches.dc.html`, turn 4 (4a–4d). Drop-ins in this folder:
- `26_volunteer.html`
- `27_volunteer_certificate.html`
- `16_final_report.html`
- `14_owner.html`

No data, rule or storage changes. Sections 1–4 cover every element, state, hover, focus, motion, phone and print rule. The appendices hold the exact code, copied verbatim from the drop-ins. Where the two differ, the appendix wins.

**Shared language.** These match turns 1–3:
- `--teal-deep` grounds, the drifting mark at opacity .13, gold for now and next.
- Easing `cubic-bezier(.2,.7,.2,1)`.
- Reduced motion turns every animation off.

**Literals on teal-deep:**

| Value | Used for |
|---|---|
| `oklch(80% 0.1 75)` | eyebrow |
| `oklch(91% 0.018 190)` | body text |
| `oklch(84% 0.02 190)` | small text |

---

## 1. Volunteer page (`26_volunteer.html`, 4a)

### Markup edits in `render()`

| Edit | Change |
|---|---|
| `.next` (upcoming class only) | gains `v4`, and `going` when `reply.coming === 'yes'` |
| The mark | an inline SVG `.v4-mark` goes first inside it (gold-lifted and paper strokes, width 9) |
| `.cert` | gains `earned` when `earned` is true |
| Under `.track` | a new `p.trk-l`: "**h** of T hours towards your certificate" (h is capped at T) |

### Next class (`.next.v4`)

| Element | Spec |
|---|---|
| Card | relative, overflow hidden, `--teal-deep`, radius 16, padding 24/24/22 |
| Mark | absolute, right −120, top −70, 420px wide, opacity .13, `v4-drift` 18s (rotate −8° ↔ −4°, scale 1 ↔ 1.04) |
| `.k` | `oklch(80% 0.1 75)`, tracking .2em, opacity 1 |
| `h2` | `clamp(1.6rem,5vw,2.1rem)`, line-height 1.1, margin 8 0 6, `--paper` |
| `.when` | `oklch(91% 0.018 190)` |
| `.tiny` | `oklch(84% 0.02 190)` |
| `.room` | `--gold-lifted` fill, `--ink-warm` text, padding 12/22. Hover: `--gold`. Focus-visible: 2px `--paper` outline, offset 3 |
| `.ask` top border | `oklch(99.5% 0.004 90 / .2)` |
| `.yn` | min-height 44. Hover: the border goes full `--paper`. Focus-visible: 2px `--gold-lifted` outline. When `.on`, a "✓ " prefix |

### The ticket (`.next.v4.going .ask small`)
- The existing "Thank you, see you then." line is restyled as an inline-flex stub: padding 7/14, radius 8, `--gold-lifted` fill, `--ink-warm` text, 700.
- A 5px radial mask cuts a notch on each side.
- It enters with `v4-ticket`, .6s (rise 8px, −3° → 0).
- A "No" keeps the existing quiet line.

### Attendance
- `.track` is 9px tall. Its fill `i` is a gradient from `--teal` to `--gold-lifted`, radius 99, width transition .8s.
- `.trk-l`: margin 0 0 10, 0.82rem `--grey`; `b` in Newsreader 1rem `--ink`.

### Certificate earned (`.cert.earned`)
- **Card:** relative, overflow hidden, 2px `--gold` border, `--gold-wash` fill, `--ink-warm` text, padding 18/18/16. `b` is `--ink`.
- **`.certlink`** ("Open it"): becomes an inline-flex pill. Margin-top 12, padding 11/20, `--teal` fill, `--paper` text, a trailing "→".
  - Hover: `--teal-lifted`.
  - Focus-visible: 2px `--gold-lifted` outline.
- **Sheen:** `::after` is a 40%-wide white sheen (`oklch(100% 0 0 / .55)`) that crosses the card once (`v4-sheen`, 1.6s, .4s delay).

---

## 2. Volunteer certificate (`27_volunteer_certificate.html`, 4b)

### Markup
`<span class="v4-seal">`, holding a `.ring` and the mark (ink-warm and paper, width 11), goes inside `.sheet`, before the corners.

### Seal

| Element | Spec |
|---|---|
| Position | absolute, right 8.5%, bottom 11% (6% / 6% at ≤640px) |
| Size | `clamp(64px,9vw,96px)`, square, round, rotated −8° |
| Fill | `radial-gradient(circle at 35% 30%, oklch(82% 0.11 80), --gold 55%, --gold-deep)` |
| Shadow | `0 2px 6px oklch(40% 0.06 70 / .35)` plus an inset 2px `oklch(88% 0.08 82 / .7)` |
| `.ring` | inset 7%, 1.5px dashed `oklch(97% 0.03 85 / .75)` |
| Mark | 52% of the seal's width |

### Print and screen
- **Print:** the seal **prints**, with `print-color-adjust:exact`. There is no animation in print.
- **Screen only:**
  - `.sheet::after` sweeps a 30%-wide sheen across the sheet once (`v4-sheen`, 1.8s, .5s delay).
  - The seal lands with `v4-seal`, .8s with a .9s delay: scale 1.8 → .94 → 1 while rotating −30° → −8°.

---

## 3. Final report (`16_final_report.html`, 4c)

**Screen only.** The printed document is Cambridge-facing and unchanged (Ramy, 23 Sep 2026: leave the printed documents alone). Every rule is inside `@media screen`, and there are no markup changes.

| Element | Animation |
|---|---|
| `.sheet.cover` | `v4-rise`, .9s (36px rise), plus the shadow `0 1px 2px oklch(58% 0.03 70 / .11), 0 18px 40px -22px oklch(40% 0.04 70 / .35)` |
| The reverse sheet (`.sheet.cover + .sheet`) | `v4-rise`, .25s delay |
| Cover `.corner`s | `v4-corner`, .7s with a .5s delay; they draw from 0 to 22px |
| `.name` | `v4-in`, .7s with a .7s delay (10px rise) |
| `.badge` | `v4-stamp`, .7s with a 1s delay: scale 1.9 → .95 → 1 while rotating −6° → 1° → 0. It also gets a `--paper` fill on screen |

---

## 4. Owner console (`14_owner.html`, 4d)

### Markup
Under the existing `.minted-line` (words unchanged), an `ol.v4-steps` (`aria-label="What happens next"`) with three items:
1. `li.done`: "Course made"
2. `li.now`: "Send the tutor link"
3. `li`: "The centre sets it up and adds its trainees"

### Styles

| Element | Spec |
|---|---|
| `.course.minted` | `v4-land`, .7s (drops 18px, scale .98 → 1), and `v4-ring` ×2, 1.4s with a .5s delay (gold ring 0 → 16px from `oklch(70% 0.12 72 / .6)`) |
| `.v4-steps` | grid of three equal columns (one at ≤640px), gap 8, margin 0 0 14 |
| `li` | relative, padding 10/12/10/38, radius 10, `--paper`, 1px `--sand-line`, 0.8rem 600, line-height 1.35, `--grey` |
| `li::before` | the counter in a 20px circle at left 11, centred vertically, 11px 700, `--box` fill, `--ink-warm` text |
| `.done` | text `--teal-deep`, border `oklch(78% 0.04 195)`. The circle shows "✓" in `--teal` with `--paper` text |
| `.now` | text `--ink`, 2px `--gold` border, `--gold-wash` fill, padding 9/11/9/37. The circle is `--gold-lifted` with `--ink-warm` text and pulses with `v4-dot` (2s, ring 0 → 8px) |

**Behaviour.** The repo's own `hubScrollIntoView` already moves to the new card. The animation replays whenever the list re-renders while the card is still marked minted.

---

## 5. Test

1. **26, next class:**
   - The card is deep teal with the drifting mark, and Join is a gold pill.
   - Tap Yes: "✓ Yes", and the thanks turns into a notched gold ticket.
   - Tap No: the quiet line.
   - The email link (`?coming=yes`) gives the same result.
2. **26, attendance:** the track is gradient and the line reads "8.5 of 12 hours…". Once earned, the certificate card is gold, sheens once, and "Open it →" is a teal pill.
3. **26, before and after:** nothing scheduled, and the course finished, keep the plain `.next.done` card.
4. **27:**
   - The seal sits bottom right inside the rules and lands on open, with one sheen.
   - Print: the seal prints in colour, with no sheen.
5. **16:**
   - On screen, the cover rises, the corners draw in, and the grade stamps.
   - Print preview is identical to `main`.
6. **14:**
   - Make a course: the card drops in with two gold rings, and the three steps show step 2 pulsing.
   - Reopen the console: no minted card.
7. **Reduced motion:** all still.

---

## Appendix A: `26_volunteer.html` v4 CSS (verbatim)
```css
  /* ---- v4 (7 Oct 2026): the volunteer's moments ----------------------------
     The next class on deep teal with the drifting mark, as on the trainee's
     hero; a Yes turns the thanks into a gold ticket; the certificate, once
     earned, is a card you want to press. Design: Magic Touches, 4a. */
  .next.v4{position:relative; overflow:hidden; background:var(--teal-deep); border-radius:16px; padding:24px 24px 22px;}
  .next.v4 > *{position:relative;}
  .next.v4 .v4-mark{position:absolute; right:-120px; top:-70px; width:420px; height:auto; opacity:.13; pointer-events:none; animation:v4-drift 18s ease-in-out infinite; transform-origin:50% 50%;}
  .next.v4 .k{opacity:1; color:oklch(80% 0.1 75); letter-spacing:.2em;}
  .next.v4 h2{font-size:clamp(1.6rem,5vw,2.1rem); line-height:1.1; margin:8px 0 6px; color:var(--paper);}
  .next.v4 .when{color:oklch(91% 0.018 190); opacity:1;}
  .next.v4 .room{background:var(--gold-lifted); color:var(--ink-warm); padding:12px 22px; transition:background-color .15s;}
  .next.v4 .room:hover{background:var(--gold);}
  .next.v4 .room:focus-visible{outline:2px solid var(--paper); outline-offset:3px;}
  .next.v4 .tiny{color:oklch(84% 0.02 190); opacity:1;}
  .next.v4 .ask{border-top-color:oklch(99.5% 0.004 90 / .2);}
  .next.v4 .ask .yn{min-height:44px; transition:background-color .15s, color .15s, border-color .15s;}
  .next.v4 .ask .yn:hover{border-color:var(--paper);}
  .next.v4 .ask .yn:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:3px;}
  .next.v4 .ask .yn.on::before{content:'\2713  ';}
  /* a Yes: the thanks becomes a ticket stub */
  .next.v4.going .ask small{flex-basis:auto; display:inline-flex; align-items:center; gap:6px; margin-left:4px; padding:7px 14px; border-radius:8px;
    background:var(--gold-lifted); color:var(--ink-warm); font-weight:700; opacity:1; animation:v4-ticket .6s cubic-bezier(.2,.7,.2,1) both;
    -webkit-mask:radial-gradient(circle 5px at 0 50%, transparent 98%, #000) , radial-gradient(circle 5px at 100% 50%, transparent 98%, #000);
    -webkit-mask-composite:source-in; mask-composite:intersect;}
  .track{height:9px;} .track i{background:linear-gradient(90deg, var(--teal), var(--gold-lifted)); border-radius:99px; transition:width .8s cubic-bezier(.2,.7,.2,1);}
  .trk-l{margin:0 0 10px; font-size:0.82rem; color:var(--grey);} .trk-l b{font-family:'Newsreader',Georgia,serif; font-size:1rem; color:var(--ink);}
  /* the certificate, earned */
  .cert.earned{position:relative; overflow:hidden; border:2px solid var(--gold); background:var(--gold-wash); color:var(--ink-warm); padding:18px 18px 16px;}
  .cert.earned b{color:var(--ink);}
  .cert.earned .certlink{display:inline-flex; align-items:center; gap:8px; margin:12px 0 0; padding:11px 20px; border-radius:999px; background:var(--teal); color:var(--paper); text-decoration:none; transition:background-color .15s;}
  .cert.earned .certlink::after{content:'\2192';}
  .cert.earned .certlink:hover{background:var(--teal-lifted); text-decoration:none;}
  .cert.earned .certlink:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:3px;}
  .cert.earned::after{content:''; position:absolute; top:0; bottom:0; width:40%; left:-50%; background:linear-gradient(100deg, transparent, oklch(100% 0 0 / .55), transparent); animation:v4-sheen 1.6s ease-out .4s 1 both;}
  @keyframes v4-drift{0%,100%{transform:rotate(-8deg) scale(1);}50%{transform:rotate(-4deg) scale(1.04);}}
  @keyframes v4-ticket{from{opacity:0; transform:translateY(8px) rotate(-3deg);}to{opacity:1; transform:none;}}
  @keyframes v4-sheen{from{left:-50%;}to{left:120%;}}
  @media(prefers-reduced-motion:reduce){ .next.v4 *, .cert.earned::after, .track i{animation:none !important; transition:none !important;} .cert.earned::after{display:none;} }
```

## Appendix B: `26_volunteer.html` markup edits (verbatim lines)
```js
    ? `<div class="next v4${reply && reply.coming === 'yes' ? ' going' : ''}"><svg class="v4-mark" viewBox="8 30 104 60" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="9" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="9" stroke-linecap="round"></path></svg><div class="k">Your next class</div>
      <div class="cert${earned ? ' earned' : ''}">${earned
  .trk-l{margin:0 0 10px; font-size:0.82rem; color:var(--grey);} .trk-l b{font-family:'Newsreader',Georgia,serif; font-size:1rem; color:var(--ink);}
```

## Appendix C: `27_volunteer_certificate.html` v4 CSS (verbatim)
```css
  /* ---- v4 (7 Oct 2026): the seal and the sheen -------------------------------
     A gold medallion with the mark, low on the right inside the rules: the
     certificate's own seal. It prints. On screen only, one sheen crosses the
     sheet the first time it opens. Design: Magic Touches, 4b. */
  .v4-seal{position:absolute; right:8.5%; bottom:11%; width:clamp(64px,9vw,96px); aspect-ratio:1; border-radius:50%; z-index:1;
    background:radial-gradient(circle at 35% 30%, oklch(82% 0.11 80), var(--gold) 55%, var(--gold-deep));
    box-shadow:0 2px 6px oklch(40% 0.06 70 / .35), inset 0 0 0 2px oklch(88% 0.08 82 / .7);
    display:flex; align-items:center; justify-content:center;}
  .v4-seal .ring{position:absolute; inset:7%; border-radius:50%; border:1.5px dashed oklch(97% 0.03 85 / .75);}
  .v4-seal .v4-mark{position:relative; width:52%; height:auto;}
  @media screen{
    .sheet::after{content:''; position:absolute; top:0; bottom:0; width:30%; left:-40%; pointer-events:none; z-index:2;
      background:linear-gradient(100deg, transparent, oklch(100% 0 0 / .5), transparent); animation:v4-sheen 1.8s ease-out .5s 1 both;}
    .v4-seal{animation:v4-seal .8s cubic-bezier(.2,.7,.2,1) .9s both;}
  }
  @keyframes v4-sheen{from{left:-40%;}to{left:130%;}}
  @keyframes v4-seal{0%{opacity:0; transform:scale(1.8) rotate(-30deg);}70%{opacity:1; transform:scale(.94) rotate(-6deg);}100%{transform:scale(1) rotate(-8deg);}}
  .v4-seal{transform:rotate(-8deg);}
  @media(prefers-reduced-motion:reduce){ .sheet::after{display:none;} .v4-seal{animation:none !important;} }
  @media (max-width:640px){ .v4-seal{right:6%; bottom:6%;} }
  @media print{ .sheet::after{display:none;} .v4-seal{animation:none !important; -webkit-print-color-adjust:exact; print-color-adjust:exact;} }
```

## Appendix D: `27_volunteer_certificate.html` seal markup (verbatim)
```html
  .v4-seal{position:absolute; right:8.5%; bottom:11%; width:clamp(64px,9vw,96px); aspect-ratio:1; border-radius:50%; z-index:1;
```

## Appendix E: `16_final_report.html` v4 CSS (verbatim)
```css
  /* ---- v4 (7 Oct 2026): opening the report, on screen only -----------------
     The printed document is Cambridge-facing and is left exactly as it is
     (Ramy, 23 Sep 2026). On screen, once: the cover rises, the gold corners
     draw in, and the grade lands as a stamp. Print is untouched -- every rule
     here sits inside @media screen. Design: Magic Touches, 4c. */
  @media screen{
    .sheet.cover{animation:v4-rise .9s cubic-bezier(.2,.7,.2,1) both; box-shadow:0 1px 2px oklch(58% 0.03 70 / .11), 0 18px 40px -22px oklch(40% 0.04 70 / .35);}
    .sheet.cover + .sheet{animation:v4-rise .9s cubic-bezier(.2,.7,.2,1) .25s both;}
    .sheet.cover .corner{animation:v4-corner .7s cubic-bezier(.2,.7,.2,1) .5s both;}
    .sheet.cover .badge{animation:v4-stamp .7s cubic-bezier(.2,.7,.2,1) 1s both; background:var(--paper);}
    .sheet.cover .name{animation:v4-in .7s cubic-bezier(.2,.7,.2,1) .7s both;}
  }
  @keyframes v4-rise{from{opacity:0; transform:translateY(36px);}to{opacity:1; transform:none;}}
  @keyframes v4-in{from{opacity:0; transform:translateY(10px);}to{opacity:1; transform:none;}}
  @keyframes v4-corner{from{width:0; height:0; opacity:0;}to{width:22px; height:22px; opacity:1;}}
  @keyframes v4-stamp{0%{opacity:0; transform:scale(1.9) rotate(-6deg);}65%{opacity:1; transform:scale(.95) rotate(1deg);}100%{transform:none;}}
  @media(prefers-reduced-motion:reduce){ .sheet, .sheet *{animation:none !important;} }
```

## Appendix F: `14_owner.html` v4 CSS (verbatim)
```css
  /* ---- v4 (7 Oct 2026): a course is born ------------------------------------
     The card just made lands with a gold ring (twice, then still), and under
     its line the three steps of what happens next, the middle one lit. Same
     words, same buttons. Design: Magic Touches, 4d. */
  .course.minted{animation:v4-land .7s cubic-bezier(.2,.7,.2,1) both, v4-ring 1.4s ease-out .5s 2;}
  .v4-steps{list-style:none; counter-reset:v4; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin:0 0 14px; padding:0;}
  .v4-steps li{counter-increment:v4; position:relative; padding:10px 12px 10px 38px; border-radius:10px; background:var(--paper); border:1px solid var(--sand-line);
    font-size:0.8rem; font-weight:600; line-height:1.35; color:var(--grey);}
  .v4-steps li::before{content:counter(v4); position:absolute; left:11px; top:50%; transform:translateY(-50%); width:20px; height:20px; border-radius:50%;
    display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; background:var(--box); color:var(--ink-warm);}
  .v4-steps li.done{color:var(--teal-deep); border-color:oklch(78% 0.04 195);}
  .v4-steps li.done::before{content:'\2713'; background:var(--teal); color:var(--paper);}
  .v4-steps li.now{color:var(--ink); border:2px solid var(--gold); background:var(--gold-wash); padding:9px 11px 9px 37px;}
  .v4-steps li.now::before{background:var(--gold-lifted); color:var(--ink-warm); animation:v4-dot 2s ease-out infinite;}
  @keyframes v4-land{from{opacity:0; transform:translateY(-18px) scale(.98);}to{opacity:1; transform:none;}}
  @keyframes v4-ring{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 16px oklch(70% 0.12 72 / 0);}}
  @keyframes v4-dot{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .55);}70%{box-shadow:0 0 0 8px oklch(70% 0.12 72 / 0);}100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .course.minted, .v4-steps li.now::before{animation:none !important;} }
  @media(max-width:640px){ .v4-steps{grid-template-columns:1fr;} }
```

## Appendix G: `14_owner.html` minted markup (verbatim line)
```js
  .v4-steps{list-style:none; counter-reset:v4; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin:0 0 14px; padding:0;}
```
