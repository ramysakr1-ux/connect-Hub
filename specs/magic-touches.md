# Magic touches: three moments, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `2ecd8ee85879`), read 7 Oct 2026.
Design: `Magic Touches.dc.html` (1a, 1b, 1c). Drop-ins: `index.html` and `4_feedback_returned.html` in this folder.

Ramy picked seven screens and asked for the three with the most impact. They are:

| | Moment | Screen | State |
|---|---|---|---|
| 1a | The trainee's first open | `index.html` hero | `beforeStart` |
| 1b | Feedback coming back | `4_feedback_returned.html` | `currentHeld` (sealed) and `currentOpen` (opening) |
| 1c | The end of the course | `index.html` hero | `afterEnd`, or the last day with `tpDone` |

Every other state of both screens is untouched. Sections 1–4 cover every element: frame, fonts, sizes, colours, hover, focus, motion and logic. The appendices hold the exact CSS and JS, copied verbatim from the drop-ins. Where the two differ, the appendix wins.

**Not built from the design.** These are things the store doesn't hold; nothing is invented to fill them.
- **1a:** no done ticks on the pre-course cards, because Lite doesn't record that the task was checked or an activity picked.
- **1b:** no "What worked" card, because the strengths list key in `fb.state.lists` isn't fixed. Only starred items are read.
- **1c:**
  - No observation-hours stat, since the trainee's observation store isn't read on the home page.
  - No "first vs last" pairing on one criterion. Only "Where you started" is shown, which is TP1's first starred point.
  - No grace-period line. Lite's own copy says the link keeps working; that line belongs to celta-connect.
  - No end-of-course feedback button. Lite has no survey page.

---

## 0. Shared language

**Fonts.** All are already loaded on both pages, so nothing new is needed.
- **Newsreader 700:** headings and big numbers.
- **Instrument Serif italic:** kickers, plus the "to" line and the tutors label.
- **Instrument Sans 600/700:** eyebrows, labels and stamp text.
- **Karla:** body text and buttons.

**Tokens.** From `hub-tokens.css`:

| Token | Value |
|---|---|
| `--teal-deep` | `oklch(31% 0.055 195)` |
| `--teal` | `oklch(37.5% 0.058 195)` |
| `--teal-lifted` | `oklch(44% 0.062 195)` |
| `--gold` | `oklch(63% 0.096 72)` |
| `--gold-lifted` | `oklch(70% 0.12 72)` |
| `--gold-deep` | `oklch(52% 0.098 70)` |
| `--gold-wash` | `oklch(94.5% 0.035 78)` |
| `--paper` | `oklch(99.5% 0.004 90)` |
| `--surface` | `oklch(95.2% 0.018 84)` |
| `--box` | `oklch(91.2% 0.03 80)` |
| `--sand-line` | `oklch(85.5% 0.02 80)` |
| `--ink` | `oklch(23.5% 0.017 65)` |
| `--ink-warm` | `oklch(30% 0.042 58)` |
| `--grey` | `oklch(51% 0.017 70)` |

**Literals for text on teal-deep.** These are the same as on the setup welcome, so all three moments and the welcome share one look:

| Value | Used for |
|---|---|
| `oklch(80% 0.1 75)` | eyebrow |
| `oklch(80% 0.11 75)` | kicker |
| `oklch(91% 0.018 190)` | body text |
| `oklch(84% 0.02 190)` | small note |
| `oklch(15% 0.04 195 / .8)` | shadows |

**The mark.** An inline SVG, `viewBox="8 30 104 60"`. The paths are the lockup's:
- Left C: `M56.1 42.2 A 24 24 0 1 0 56.1 77.8`
- Right C: `M96.1 42.2 A 24 24 0 1 0 96.1 77.8`
- Round caps.

**Easing.** `cubic-bezier(.2,.7,.2,1)` throughout. Hover lifts are 3px.

**Reduced motion.** `prefers-reduced-motion: reduce` turns off every animation and transition these moments add, and hides the confetti.

---

## 1a. Before the course (`index.html`, `.hero.hv2.pre`)

### When
Inside the hero IIFE, after the existing code has set `kind/title/when/list/door/note` and shown the card, `beforeStart && START` adds `hv2 pre`. All of the existing wording stays the source:
- "Before the course"
- "Welcome, {firstName}."
- "Your course starts on {day} — N days from today. Before then:"
- the pre-course list
- "Start here"
- the timetable note

### Frame
- `.hero.hv2`: position relative, overflow hidden, radius 16, padding 44/44/38. Children are position relative.
- `.pre` background: `--teal-deep`, replacing the hero's `--teal`.
- `.hv2-mark`: absolute, right −160, top −90, width 620, opacity .13. Strokes are gold-lifted and paper, width 9. It runs `hv2-drift` over 18s: rotate −8° → −4°, scale 1 → 1.04.

### Type, top to bottom

| Element | Spec |
|---|---|
| `.k` eyebrow | Instrument Sans 600, 11px, tracking 0.26em, uppercase, `oklch(80% 0.1 75)`, opacity 1, margin 0 0 14 |
| `h2` | Newsreader 700, `clamp(40px,6vw,64px)`, line-height 1, tracking −0.02em, `--paper`, balanced wrap |
| `.hv2-kicker` (new) | Instrument Serif italic, `clamp(22px,2.4vw,28px)`, line-height 1.2, `oklch(80% 0.11 75)`, margin-top 16. Text: "Your course starts in" |
| `.hv2-count` (new) | flex, gap 12, wraps, margin-top 14 |
| …each cell | min-width 96, padding 14/12/10, radius 12, `--teal` fill, 1px `--teal-lifted` border, centred |
| …number `b` | Newsreader 700, 40px, line-height 1, `--paper`, tabular numbers |
| …unit `span` | Instrument Sans 600, 10px, tracking 0.16em, uppercase, `oklch(80% 0.1 75)`, margin-top 6. "days" ("day" when 1) / "hours" / "minutes" / "seconds" |
| `.when` | 16px, `oklch(91% 0.018 190)`, `b` in `--paper`, max-width 620, margin-top 20 |

### The to-do list as cards
- **Grid:** `.todo` is a grid, `repeat(auto-fill,minmax(240px,1fr))`, gap 12, margin-top 20, with `counter-reset:hv2`. The bullet dot is hidden.
- **Card `li a`:**
  - Flex column, gap 10, full height, padding 18/18/16, radius 12, `--paper` fill.
  - Text: Karla 700, 15px, line-height 1.4, `--ink`, no underline.
  - Shadow: `0 18px 30px -20px oklch(15% 0.04 195 / .8)`.
  - Transition: transform .3s plus box-shadow .3s.
- **Number (`a:before`):** the counter, in Newsreader 700, 36px, `--gold-deep`.
- **Door (`a:after`):** "Open →", margin-top auto, 13px, `--teal`.
- **First card (the next thing):** `--gold-wash` fill with an inset 2px `--gold` ring.
- **Hover:** lifts 3px, shadow deepens to `0 24px 36px -20px … / .9`, and the door is underlined (offset 3).
- **Focus-visible:** 2px `--gold-lifted` outline, offset 3.
- External links (`it.out`) keep `target=_blank` as before.

### Button (`.go`, "Start here")
- Shape and type: 48px tall, padding 0 26, inline-flex with gap 10, 15px. Colour: `--gold-lifted` fill with `--ink-warm` text. A trailing "→" comes from `:after`.
- Hover fill: `--gold`.
- Focus-visible: 2px `--paper` outline, offset 3.

### Tutors line (`.hv2-tutors`, new)
- **When:** only shown when `CS.tutorNames` has names.
- **Frame:** flex, gap 14, wraps, margin-top 22, padding 14/18, radius 12, fill `oklch(37.5% 0.058 195 / .55)`.
- **Label `i`:** Instrument Serif 22px, `oklch(80% 0.11 75)`. "Your tutor" or "Your tutors".
- **Initials:** up to four 34px tiles, radius 9, Karla 700 13px. Tiles alternate between `--paper` with `--teal-deep` text and `--gold-lifted` with `--ink-warm` text. Each tile's `title` is the full name.
- **Names `em`:** 14px, `oklch(91% 0.018 190)`. Joined as "A, B and C." When `hub:me.group` exists it adds ". Your TP group is **G**."

### Note
`.tiny`: 13px, `oklch(84% 0.02 190)`, margin-top 18.

### Countdown logic
- **Start time:** the earliest `TT.slots[].from` that looks like `H:MM` or `HH:MM`, padded. If there is none, 09:00.
- **Demo clock:** the gap between `hubToday()` and the machine's date is subtracted (`shift = TODAY − realToday`, both at noon), so the countdown agrees with the "N days from today" line.
- **Ticking:** a `setInterval` of 1s. It clears at 0, which leaves "0 days 00 00 00".
- **Accessibility:** `role="timer"`, `aria-live="off"`, and an `aria-label` of "N days, HH hours to go".

### Phone (≤560px)
- Padding 30/20/26, radius 12. The mark shrinks to 420px at right −170, top −50.
- Count cells use `flex:1 1 60px`, min-width 0, padding 12/6/8, with 30px numbers.

---

## 1b. Feedback returned (`4_feedback_returned.html`)

### Shared values
- `V2_ME = hub:me`
- `V2_F = fb.state.f`
- `V2_N`: the first number in `fTP` or `fb.label`
- `V2_TUTOR = fTutor`

### Grade reading
`v2Grade()` copies `20_celta5.html:657`:

| Match | Mark | Word | Tone |
|---|---|---|---|
| `/above|^S\+$/i` | S+ | Above standard | teal |
| `/not|^N$/i` | N | Not to standard | `--ink-warm` (not brick: this is a reading moment, not an alarm) |
| `/standard|^S$/i` | S | To standard | teal |
| anything else | first three characters | the value itself | teal |

### State A: sealed (`currentHeld`)
This replaces both of the old grey `.empty` sentences.
- **Placement:** the section is added *first* in `#content`, so the earlier sheets sit under it.
- **Behaviour:** the same gate (`selfIn`) and the same link (`2_trainee_self_evaluation.html`). The old empty-message branch is kept in source under `if(false)`; delete it when merging.

| Element | Spec |
|---|---|
| `.fv2-env` | centred, padding 34/20/40, `--surface` fill, radius 16 |
| `.kk` | Instrument Sans 700, 10px, tracking 0.16em, uppercase, `--grey`. "Teaching practice N" |
| `h2` | Newsreader 700, `clamp(28px,4vw,40px)`, line-height 1.1, `--teal-deep`. "{Tutor first name}’s feedback is in.", or "Your tutor’s feedback is in." |
| `.fv2-paper` | width `min(420px,100%)`, aspect ratio 420/270, margin 32 auto 0. Floats with `fv2-float`: 5s, translateY 0 ↔ −8px, rotate −2° ↔ −1° |
| …`.body` | `--paper`, 1px `--sand-line`, radius 10, shadow `0 30px 50px -28px oklch(30% 0.042 58 / .5)` |
| …`.flap` | top 56% of the height, `clip-path: polygon(0 0,100% 0,50% 100%)`, `--box` |
| …`.seal` | 72px circle in `--gold`, centred at 44% from the top, holding the mark at 42px (strokes `--ink-warm` and `--paper`, width 13). Glows with `fv2-glow`: 2.4s, a box-shadow ring 0 → 18px fading from `oklch(70% 0.12 72 / .5)` |
| …`.to` | at 8% from the bottom, Instrument Serif italic 20px, `--gold-deep`. "for {hub:me.name}", shown only when a name is set |
| `.why` | margin 30 auto 0, max-width 480, 15px, line-height 1.6, `--ink-warm`. "Teach, reflect, then read the feedback. It opens the moment your self-evaluation is in." |
| `.go` | "Write my self-evaluation →". 48px pill, padding 0 26, `--teal` fill, `--paper` text, Karla 700 15px. Hover: `--teal-lifted`. Focus-visible: 2px `--gold-lifted` outline, offset 3 |
| `.fv2-env + .doc` | margin-top 28 |

### State B: opening (`currentOpen`)
- **Placement:** the panel `.fv2-open` goes in before the front sheet. It is only drawn when there is a grade or at least one starred point.
- **Panel:** margin 0 0 26, padding 26/28, `--paper`, 1px `--sand-line`, radius 16.
- **`.row`:** flex, space-between, gap 20.
  - Left: `.kk` "Teaching practice N · returned by {fTutor}", then `h2` "Before you read it all" (Newsreader 700, `clamp(26px,3.4vw,36px)`, `--teal-deep`).
  - Right: the stamp.
- **Stamp `.fv2-stamp`:** 112px circle, a 3px border in `currentColor` (teal, or `--ink-warm` for N), rotated −8°.
  - `b`: Newsreader 700, 34px.
  - `span`: Instrument Sans 700, 9px, tracking 0.14em, uppercase, max-width 86px.
  - `role="img"` with the grade word as its label.
- **Stars `.fv2-stars`:** margin-top 20, padding 18/20, radius 12, `--gold-wash`, 2px `--gold`.
  - Label: "★ Carried into TP{N+1}", or "your next TP" past `HUB_MAX_TP`. Instrument Sans 700, 10px, tracking 0.14em, `--gold-deep`.
  - Each `li`: 14px, line-height 1.55, `--ink-warm`, with a ★ marker in `--gold-deep`.
  - The items are every `it.star` across `fb.state.lists`, as text (HTML stripped).
- **First open only:**
  - **Trigger:** `chub:fbOpened:{N}` is not yet `'1'`, so the panel gets `.fresh`. The flag is then set.
  - **Panel:** `fv2-in`, .8s (rises 24px).
  - **Stamp:** `fv2-stamp`, .7s with a .3s delay. Scale 2.2 → .92 → 1 while rotating −14° → −8°.
  - **Stars:** `fv2-in`, .6s with a .55s delay.
  - **Front sheet (`.doc.current`):** `fv2-in`, .7s with a .75s delay.
  - **Later opens:** the panel is static.
- **Print:** the envelope is hidden, and the panel prints without a border or motion, above the document.
- **Phone (≤560px):** the panel padding drops to 20/18, the row stacks with the stamp first, and the stamp shrinks to 92px with a 28px mark.

Existing hover, stack, print and "Start next TP" behaviour is untouched.

---

## 1c. The end (`index.html`, `.hero.hv2.fin`)

### When
`afterEnd`, or `TODAY === END && tpDone`. On the last day with work still waiting, the normal "Today" hero stays, because there is still work to do.

### Frame
- The same `.hv2` frame and drifting mark as 1a.
- `quiet` is removed, and the fill is `--teal-deep` (changed from the brown in the first draft, per Ramy).

### Words
- **After the end:** keeps "The course is over" / "That is your CELTA finished." / the existing "It ended on…" line.
- **Last day:** `.k` reads "The last day" and `h2` reads "You did it, {firstName}." (or "You did it.").

### Elements

| Element | Spec |
|---|---|
| `.hv2-kicker` | "{days} days, in numbers." when the timetable has days, otherwise "The course, in numbers." |
| `.hv2-stats` | grid, `repeat(auto-fit,minmax(140px,1fr))`, gap 12, margin-top 24 |
| …each cell | padding 18/16, radius 12, `--teal` fill, 1px `--teal-lifted` border. Rises with `hv2-in` (.7s), staggered 0 / .15 / .3 / .45s |
| …`b` | Newsreader 700, 44px, `--paper` |
| …`span` | 13px, line-height 1.4, `oklch(91% 0.018 190)` |
| `.when` | `oklch(91% 0.018 190)` |
| `.hv2-start` | margin-top 24, padding 20/24, radius 12, `--paper`, rotated −1° (none on phones), shadow `0 30px 50px -28px oklch(15% 0.04 195 / .8)`, max-width 640 |
| …`small` | "Where you started · TP n". Instrument Sans 700, 10px, tracking 0.14em, `--grey` |
| …`q` | Instrument Serif italic, 20px, line-height 1.4, `--teal-deep` |
| `.go` | as in 1a (gold pill). "Read your whole record" → `4_feedback_returned.html` |
| remaining `.todo li` | `oklch(91% 0.018 190)` |

### The numbers
All are read from what is already in this browser, with singular wording when the value is 1:
- **Days:** `TT.days.length`. This stat is shown only when there are days.
- **TPs:** `chub:tpHistory` entries that have `docHTML`.
- **Assignments:** entries in `connect_assignment_submissions_v1` with `stage === 'closed'`.
- **Action points:** the count of `it.star` across every filed TP's `state.lists`.

**Where you started:** the first starred point of the lowest-numbered filed TP, as text.

### Confetti
- **When:** once per browser (`chub:finSeen`).
- **Pieces:** 32 `<i>` inside `.hv2-confetti` (absolute, inset 0, clipped).
- **Placement:** left at `(i × 37) % 100` percent.
- **Size:** 6×12 normally, 10×6 for every third piece.
- **Colours:** `--gold-lifted`, `--paper`, `oklch(55% 0.07 195)`, `oklch(80% 0.1 75)`, cycling.
- **Animation:** `hv2-fall`, falling 560px with a 540° spin, fading in by 8% and out by the end. Duration 3.5–5.9s, delay 0–1.8s.
- **Clean-up:** the layer is removed after 8s.

---

## 2. Storage keys

| | Keys |
|---|---|
| Read | `connect_course_settings` (start, end, tutorNames), `connect_timetable_v1` (days, slots), `hub:me` (name, group), `chub:feedback` (state.f.fGrade/fTP/fTutor, state.lists), `chub:tpHistory`, `connect_assignment_submissions_v1` |
| Written (new, display-only flags) | `chub:fbOpened:{N}`, `chub:finSeen` |

Nothing that a record depends on is written.

## 3. Test

1. **Before the start (demo `?day` before day one):**
   - The countdown's days match "N days from today", and the hours count down to the first slot.
   - Pre-course items show as numbered cards, the first in gold.
   - The tutors line appears once tutors are named on Settings.
   - "Start here" is a gold pill.
2. **Day one onward:** the hero is unchanged from `main`.
3. **TP returned, self-evaluation not in:**
   - The envelope shows with the tutor's first name and "for {name}".
   - The button opens screen 2, and earlier sheets sit below.
4. **Self-evaluation turned in, first open:**
   - The panel rises and the stamp lands, with the starred points carried into TP N+1.
   - Reloading shows the panel still, with no motion.
5. **Grade N:** the stamp is ink-warm, not teal.
6. **Print screen 4:** no envelope, the panel prints plainly, and the documents are unchanged.
7. **Last day with every TP filed:** "You did it, {name}." with the stats, "Where you started" and confetti once. A second visit shows no confetti.
8. **After the end:** the same, with the existing title.
9. **Reduced motion:** no drift, float, glow, stamp, rise, confetti or countdown animation. The countdown still ticks, because it is text.
10. **375px:** no sideways scroll; the countdown cells shrink, and the stamp stacks above the heading.

---

## Appendix A: existing hero rules these build on (`index.html`, verbatim)
```css
  /* ---- the hero: what today is for ------------------------------------- */
  .hero{background:var(--teal); color:var(--paper); border-radius:var(--r-card); padding:22px 24px 20px; margin:22px 0 0;}
  .hero[hidden]{display:none;}
  .hero .k{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600;
    letter-spacing:0.2em; text-transform:uppercase; opacity:.78; margin:0;}
  .hero h2{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.5rem; line-height:1.22;
    margin:6px 0 0; color:inherit; text-wrap:pretty;}
  .hero .when{font-size:0.95rem; line-height:1.6; opacity:.93; margin:7px 0 0; text-wrap:pretty;}
  .hero .when:empty{display:none;}
  .hero .todo{list-style:none; margin:14px 0 0; padding:0; display:flex; flex-direction:column; gap:8px;}
  .hero .todo:empty{display:none;}
  .hero .todo li{position:relative; padding-left:18px; font-size:0.9rem; line-height:1.5; opacity:.95;}
  .hero .todo li:before{content:""; position:absolute; left:1px; top:7px; width:6px; height:6px;
    border-radius:50%; background:var(--gold-lifted);}
  .hero .todo a{color:inherit; font-weight:700; text-decoration:underline; text-underline-offset:3px;}
  .hero .go{display:inline-block; margin:17px 0 0; background:var(--paper); color:var(--teal);
    font-family:'Karla',sans-serif; font-weight:700; font-size:0.9rem; padding:11px 22px;
    border-radius:999px; text-decoration:none;}
  .hero .go[hidden]{display:none;}
  .hero .go:hover{background:var(--sand);}
  .hero .tiny{font-size:0.8rem; line-height:1.55; opacity:.78; margin:14px 0 0; text-wrap:pretty;}
  .hero .tiny:empty{display:none;}
  /* finished, or nothing waiting: the same card, no longer shouting */
  .hero.quiet{background:var(--box); color:var(--ink);}
  .hero.quiet .k{color:var(--grey); opacity:1;}
  .hero.quiet h2{color:var(--ink-warm);}
  .hero.quiet .when, .hero.quiet .tiny{color:var(--grey); opacity:1;}
  .hero.quiet .todo li:before{background:var(--gold);}
  .hero.quiet .todo a{color:var(--teal);}
  .hero.quiet .go{background:var(--teal); color:var(--paper);}
  .hero.quiet .go:hover{background:var(--teal-lifted);}
```

## Appendix B: `index.html` v2 CSS (verbatim)
```css
  /* ---- the hero, v2 moments (7 Oct 2026) --------------------------------
     Ramy: "add some of your magic touches." Two states of the same card get
     an event: BEFORE THE COURSE (.hv2.pre: a countdown to day one, the things
     to do as numbered cards, the tutors by name) and THE END (.hv2.fin: the
     course in numbers, where you started, one burst of confetti the first
     time). Every other state of the hero is untouched. Design: Magic
     Touches.dc.html, 1a and 1c. */
  .hero.hv2{position:relative; overflow:hidden; border-radius:16px; padding:44px 44px 38px;}
  .hero.hv2 > *{position:relative;}
  .hero.hv2 .hv2-mark{position:absolute; right:-160px; top:-90px; width:620px; height:auto; opacity:.13; pointer-events:none;
    animation:hv2-drift 18s ease-in-out infinite; transform-origin:50% 50%;}
  .hero.hv2.pre{background:var(--teal-deep);}
  .hero.hv2 .k{font-size:11px; letter-spacing:0.26em; opacity:1; color:oklch(80% 0.1 75); margin:0 0 14px;}
  .hero.hv2 h2{font-size:clamp(40px,6vw,64px); line-height:1; letter-spacing:-0.02em; margin:0; color:var(--paper); text-wrap:balance;}
  .hv2-kicker{margin:16px 0 0; font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:clamp(22px,2.4vw,28px); line-height:1.2; color:oklch(80% 0.11 75);}
  .hv2-count{display:flex; gap:12px; flex-wrap:wrap; margin:14px 0 0;}
  .hv2-count div{min-width:96px; padding:14px 12px 10px; border-radius:12px; background:var(--teal); border:1px solid var(--teal-lifted); text-align:center;}
  .hv2-count b{display:block; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:40px; line-height:1; color:var(--paper); font-variant-numeric:tabular-nums;}
  .hv2-count span{display:block; margin-top:6px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:oklch(80% 0.1 75);}
  .hero.hv2 .when{margin:20px 0 0; font-size:16px; color:oklch(91% 0.018 190); opacity:1; max-width:620px;}
  .hero.hv2 .when b{color:var(--paper);}
  /* the things to do, as numbered cards on the teal */
  .hero.hv2.pre .todo{counter-reset:hv2; display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:12px; margin:20px 0 0;}
  .hero.hv2.pre .todo li{counter-increment:hv2; padding:0; opacity:1;}
  .hero.hv2.pre .todo li:before{display:none;}
  .hero.hv2.pre .todo a{display:flex; flex-direction:column; gap:10px; height:100%; padding:18px 18px 16px; border-radius:12px;
    background:var(--paper); color:var(--ink); text-decoration:none; font-size:15px; font-weight:700; line-height:1.4;
    box-shadow:0 18px 30px -20px oklch(15% 0.04 195 / .8); transition:transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s;}
  .hero.hv2.pre .todo a:before{content:counter(hv2); font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:36px; line-height:1; color:var(--gold-deep);}
  .hero.hv2.pre .todo a:after{content:'Open \2192'; margin-top:auto; font-size:13px; color:var(--teal);}
  .hero.hv2.pre .todo a:hover{transform:translateY(-3px); box-shadow:0 24px 36px -20px oklch(15% 0.04 195 / .9); color:var(--ink);}
  .hero.hv2.pre .todo a:hover:after{text-decoration:underline; text-underline-offset:3px;}
  .hero.hv2.pre .todo a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:3px;}
  .hero.hv2.pre .todo li:first-child a{background:var(--gold-wash); box-shadow:inset 0 0 0 2px var(--gold), 0 18px 30px -20px oklch(15% 0.04 195 / .8);}
  .hero.hv2 .go{margin:22px 0 0; height:48px; padding:0 26px; display:inline-flex; align-items:center; gap:10px; font-size:15px;
    background:var(--gold-lifted); color:var(--ink-warm);}
  .hero.hv2 .go:after{content:'\2192';}
  .hero.hv2 .go:hover{background:var(--gold); color:var(--ink-warm);}
  .hero.hv2 .go:focus-visible{outline:2px solid var(--paper); outline-offset:3px;}
  .hv2-tutors{display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin:22px 0 0; padding:14px 18px; border-radius:12px; background:oklch(37.5% 0.058 195 / .55);}
  .hv2-tutors i{font-family:'Instrument Serif',Georgia,serif; font-size:22px; color:oklch(80% 0.11 75);}
  .hv2-tutors .who{display:flex; gap:6px;}
  .hv2-tutors .who span{width:34px; height:34px; border-radius:9px; display:inline-flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; background:var(--paper); color:var(--teal-deep);}
  .hv2-tutors .who span:nth-child(2n){background:var(--gold-lifted); color:var(--ink-warm);}
  .hv2-tutors em{font-style:normal; font-size:14px; color:oklch(91% 0.018 190);}
  .hero.hv2 .tiny{margin:18px 0 0; font-size:13px; color:oklch(84% 0.02 190); opacity:1;}
  /* the end */
  .hero.hv2.fin{background:var(--teal-deep); color:var(--paper);}
  .hero.hv2.fin .when{color:oklch(91% 0.018 190);}
  .hv2-stats{display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin:24px 0 0;}
  .hv2-stats div{padding:18px 16px; border-radius:12px; background:var(--teal); border:1px solid var(--teal-lifted); animation:hv2-in .7s cubic-bezier(.2,.7,.2,1) both;}
  .hv2-stats div:nth-child(2){animation-delay:.15s;} .hv2-stats div:nth-child(3){animation-delay:.3s;} .hv2-stats div:nth-child(4){animation-delay:.45s;}
  .hv2-stats b{display:block; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:44px; line-height:1; color:var(--paper);}
  .hv2-stats span{display:block; margin-top:8px; font-size:13px; line-height:1.4; color:oklch(91% 0.018 190);}
  .hv2-start{margin:24px 0 0; padding:20px 24px; border-radius:12px; background:var(--paper); color:var(--ink); transform:rotate(-1deg);
    box-shadow:0 30px 50px -28px oklch(15% 0.04 195 / .8); max-width:640px;}
  .hv2-start small{display:block; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--grey); margin-bottom:6px;}
  .hv2-start q{font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:20px; line-height:1.4; color:var(--teal-deep);}
  .hero.hv2.fin .todo li{color:oklch(91% 0.018 190);}
  .hv2-confetti{position:absolute; inset:0; pointer-events:none; overflow:hidden;}
  .hv2-confetti i{position:absolute; top:-14px; border-radius:2px; opacity:0; animation:hv2-fall linear both;}
  @keyframes hv2-drift{0%,100%{transform:rotate(-8deg) scale(1);}50%{transform:rotate(-4deg) scale(1.04);}}
  @keyframes hv2-in{from{opacity:0; transform:translateY(24px);}to{opacity:1; transform:none;}}
  @keyframes hv2-fall{0%{opacity:0; transform:translateY(0) rotate(0);}8%{opacity:1;}100%{opacity:0; transform:translateY(560px) rotate(540deg);}}
  @media(prefers-reduced-motion:reduce){ .hero.hv2 *, .hero.hv2 *:before, .hero.hv2 *:after{animation:none !important; transition:none !important;} .hv2-confetti{display:none;} }
  @media(max-width:560px){
    .hero.hv2{padding:30px 20px 26px; border-radius:12px;} .hero.hv2 .hv2-mark{width:420px; right:-170px; top:-50px;}
    .hv2-count div{min-width:0; flex:1 1 60px; padding:12px 6px 8px;} .hv2-count b{font-size:30px;}
    .hv2-start{transform:none;}
  }
```

## Appendix C: `index.html` v2 JS (verbatim, inside the hero IIFE after `host.hidden = false;`)
```js
  /* ---- v2 moments (7 Oct 2026) ------------------------------------------
     Layered on what was just said, so every line above stays the source of
     the words. Before the course: a countdown to the first slot of day one.
     At the end -- the course is over, or it is the last day and everything
     is in -- the course in numbers. Nothing here is written to the store
     except the one flag that keeps the confetti to a first sight. */
  (function(){
    const lastDay = !!(END && TODAY && TODAY === END);
    const MARK = '<svg class="hv2-mark" viewBox="8 30 104 60" fill="none" aria-hidden="true">'
      + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="9" stroke-linecap="round"></path>'
      + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="9" stroke-linecap="round"></path></svg>';
    const p2 = n => String(n).padStart(2, '0');
    const initials = s => String(s).trim().split(/\s+/).map(x => x.charAt(0)).join('').slice(0, 2).toUpperCase();

    if (beforeStart && START) {
      host.classList.add('hv2', 'pre');
      host.insertAdjacentHTML('afterbegin', MARK);
      /* Day one begins at the first slot on the timetable, 09:00 when there
         is none. The demo clock (hubToday) may say a different day from the
         machine, so the gap between them is taken off: the countdown agrees
         with "N days from today" in the line under it. */
      const first = (TT.slots || []).map(x => x && x.from).filter(x => /^\d{1,2}:\d{2}/.test(String(x || ''))).sort()[0] || '09:00';
      const hhmm = first.length === 4 ? '0' + first : first.slice(0, 5);
      const now = new Date(), realYmd = now.getFullYear() + '-' + p2(now.getMonth() + 1) + '-' + p2(now.getDate());
      const shift = TODAY ? Date.parse(TODAY + 'T12:00:00') - Date.parse(realYmd + 'T12:00:00') : 0;
      const target = Date.parse(START + 'T' + hhmm + ':00') - (isNaN(shift) ? 0 : shift);
      h.insertAdjacentHTML('afterend', '<p class="hv2-kicker">Your course starts in</p><div class="hv2-count" id="hv2Count" role="timer" aria-live="off"></div>');
      const box = document.getElementById('hv2Count');
      const tick = () => {
        let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        const parts = [[Math.floor(s / 86400), 'days'], [p2(Math.floor(s % 86400 / 3600)), 'hours'], [p2(Math.floor(s % 3600 / 60)), 'minutes'], [p2(s % 60), 'seconds']];
        box.innerHTML = parts.map(x => '<div><b>' + x[0] + '</b><span>' + (x[0] === 1 && x[1] === 'days' ? 'day' : x[1]) + '</span></div>').join('');
        box.setAttribute('aria-label', parts[0][0] + ' days, ' + parts[1][0] + ' hours to go');
        if (s === 0) clearInterval(t);
      };
      const t = setInterval(tick, 1000); tick();
      /* who they will meet on the first morning, when Course admin names them */
      const tutors = String(CS.tutorNames || '').split(',').map(x => x.trim()).filter(Boolean);
      if (tutors.length) {
        const names = tutors.length === 1 ? tutors[0] : tutors.slice(0, -1).join(', ') + ' and ' + tutors[tutors.length - 1];
        tiny.insertAdjacentHTML('beforebegin', '<p class="hv2-tutors"><i>Your tutor' + (tutors.length === 1 ? '' : 's') + '</i>'
          + '<span class="who">' + tutors.slice(0, 4).map(n => '<span title="' + esc2(n) + '">' + esc2(initials(n)) + '</span>').join('') + '</span>'
          + '<em>' + esc2(names) + (ME.group ? '. Your TP group is <b>' + esc2(ME.group) + '</b>.' : '.') + '</em></p>');
      }
      return;
    }

    if (afterEnd || (lastDay && tpDone)) {
      host.classList.remove('quiet');
      host.classList.add('hv2', 'fin');
      host.insertAdjacentHTML('afterbegin', MARK);
      if (lastDay) { k.textContent = 'The last day'; h.textContent = firstName ? 'You did it, ' + firstName + '.' : 'You did it.'; }
      /* the numbers, all from the records already in this browser */
      const H = rec('chub:tpHistory') || {};
      const tps = Object.keys(H).map(Number).filter(n => H[n] && H[n].docHTML).sort((a, b) => a - b);
      const subs = rec('connect_assignment_submissions_v1') || {};
      const closed = Object.keys(subs).filter(x => subs[x] && subs[x].stage === 'closed').length;
      const textOf = html => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent.trim(); };
      const starsOf = r => { const L = (r && r.state && r.state.lists) || {}; return Object.keys(L).reduce((a, x) => a.concat((L[x] || []).filter(it => it && it.star)), []); };
      const starTotal = tps.reduce((a, n) => a + starsOf(H[n]).length, 0);
      const days = (TT.days || []).length;
      const stats = [[tps.length, tps.length === 1 ? 'teaching practice taught' : 'teaching practices taught'],
        [closed, closed === 1 ? 'assignment closed' : 'assignments closed'],
        [starTotal, starTotal === 1 ? 'action point worked on' : 'action points worked on']];
      if (days) stats.unshift([days, 'days on the course']);
      h.insertAdjacentHTML('afterend', '<p class="hv2-kicker">' + (days ? days + ' days' : 'The course') + ', in numbers.</p>'
        + '<div class="hv2-stats">' + stats.map(x => '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') + '</div>');
      /* where they started: the first thing a tutor asked them to work on */
      const firstStar = tps.length ? starsOf(H[tps[0]]).map(it => textOf(it.html)).filter(Boolean)[0] : '';
      if (firstStar) w.insertAdjacentHTML('afterend', '<div class="hv2-start"><small>Where you started · TP ' + tps[0] + '</small><q>' + esc2(firstStar) + '</q></div>');
      go.href = '4_feedback_returned.html'; go.textContent = 'Read your whole record'; go.hidden = false;
      /* confetti, once in this browser */
      let seen = false; try { seen = localStorage.getItem('chub:finSeen') === '1'; localStorage.setItem('chub:finSeen', '1'); } catch (e) {}
      if (!seen) {
        const C = ['var(--gold-lifted)', 'var(--paper)', 'oklch(55% 0.07 195)', 'oklch(80% 0.1 75)'];
        const c = document.createElement('div'); c.className = 'hv2-confetti'; c.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 32; i++) {
          const el = document.createElement('i');
          el.style.cssText = 'left:' + ((i * 37) % 100) + '%;width:' + (i % 3 ? 6 : 10) + 'px;height:' + (i % 3 ? 12 : 6) + 'px;background:' + C[i % 4]
            + ';animation-duration:' + (3.5 + (i % 5) * 0.6) + 's;animation-delay:' + ((i * 0.13) % 1.8).toFixed(2) + 's';
          c.appendChild(el);
        }
        host.insertBefore(c, host.firstChild);
        setTimeout(() => c.remove(), 8000);
      }
    }
  })();
```

## Appendix D: `4_feedback_returned.html` v2 CSS (verbatim)
```css
  /* ---- v2 moments (7 Oct 2026) ------------------------------------------
     THE SEALED ENVELOPE: the reflect-first gate drawn as an envelope with the
     mark as its wax seal, for the TP that is back but not yet open. THE
     OPENING: once it opens, a panel above the stack -- the grade as a stamp,
     the tutor, and the starred action points that carry forward. Its motion
     runs the first time a TP is opened in this browser, and then it is
     simply the top of the page. Design: Magic Touches.dc.html, 1b. Print
     keeps the panel and drops the motion. */
  .fv2-env{text-align:center; padding:34px 20px 40px; background:var(--surface); border-radius:16px;}
  .fv2-env .kk{margin:0 0 8px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:var(--grey);}
  .fv2-env h2{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:clamp(28px,4vw,40px); line-height:1.1; color:var(--teal-deep); text-wrap:balance;}
  .fv2-paper{position:relative; width:min(420px,100%); aspect-ratio:420/270; margin:32px auto 0; animation:fv2-float 5s ease-in-out infinite;}
  .fv2-paper .body{position:absolute; inset:0; border-radius:10px; background:var(--paper); border:1px solid var(--sand-line); box-shadow:0 30px 50px -28px oklch(30% 0.042 58 / .5);}
  .fv2-paper .flap{position:absolute; left:0; right:0; top:0; height:56%; clip-path:polygon(0 0,100% 0,50% 100%); background:var(--box); border-radius:10px 10px 0 0;}
  .fv2-paper .seal{position:absolute; left:50%; top:44%; transform:translate(-50%,-50%); width:72px; height:72px; border-radius:50%; background:var(--gold);
    display:flex; align-items:center; justify-content:center; animation:fv2-glow 2.4s ease-in-out infinite;}
  .fv2-paper .seal svg{width:42px; height:auto;}
  .fv2-paper .to{position:absolute; left:0; right:0; bottom:8%; margin:0; font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:20px; color:var(--gold-deep);}
  .fv2-env .why{margin:30px auto 0; max-width:480px; font-size:15px; line-height:1.6; color:var(--ink-warm); text-wrap:pretty;}
  .fv2-env .go{display:inline-flex; align-items:center; gap:10px; margin-top:18px; height:48px; padding:0 26px; border-radius:999px; background:var(--teal); color:var(--paper);
    font-family:'Karla',sans-serif; font-size:15px; font-weight:700; text-decoration:none; transition:background .15s;}
  .fv2-env .go:hover{background:var(--teal-lifted); color:var(--paper);}
  .fv2-env .go:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:3px;}
  .fv2-env + .doc{margin-top:28px;}

  .fv2-open{margin:0 0 26px; padding:26px 28px; border-radius:16px; background:var(--paper); border:1px solid var(--sand-line);}
  .fv2-open .row{display:flex; justify-content:space-between; align-items:flex-start; gap:20px;}
  .fv2-open .kk{margin:0 0 6px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:var(--grey);}
  .fv2-open h2{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:clamp(26px,3.4vw,36px); line-height:1.1; color:var(--teal-deep);}
  .fv2-stamp{flex-shrink:0; width:112px; height:112px; border-radius:50%; border:3px solid currentColor; color:var(--teal); transform:rotate(-8deg);
    display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:2px;}
  .fv2-stamp b{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:34px; line-height:1;}
  .fv2-stamp span{font-family:'Instrument Sans','Karla',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; max-width:86px; line-height:1.2;}
  .fv2-stamp.n{color:var(--ink-warm);}
  .fv2-stars{margin:20px 0 0; padding:18px 20px; border-radius:12px; background:var(--gold-wash); border:2px solid var(--gold);}
  .fv2-stars p{margin:0 0 8px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold-deep);}
  .fv2-stars ul{margin:0; padding:0 0 0 18px; display:flex; flex-direction:column; gap:6px;}
  .fv2-stars li{font-size:14px; line-height:1.55; color:var(--ink-warm);}
  .fv2-stars li::marker{content:'\2605  '; color:var(--gold-deep);}
  .fv2-open.fresh .fv2-stamp{animation:fv2-stamp .7s cubic-bezier(.2,.7,.2,1) .3s both;}
  .fv2-open.fresh{animation:fv2-in .8s cubic-bezier(.2,.7,.2,1) both;}
  .fv2-open.fresh .fv2-stars{animation:fv2-in .6s cubic-bezier(.2,.7,.2,1) .55s both;}
  .fv2-open.fresh ~ .doc.current{animation:fv2-in .7s cubic-bezier(.2,.7,.2,1) .75s both;}
  @keyframes fv2-float{0%,100%{transform:translateY(0) rotate(-2deg);}50%{transform:translateY(-8px) rotate(-1deg);}}
  @keyframes fv2-glow{0%,100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .5);}50%{box-shadow:0 0 0 18px oklch(70% 0.12 72 / 0);}}
  @keyframes fv2-in{from{opacity:0; transform:translateY(24px);}to{opacity:1; transform:none;}}
  @keyframes fv2-stamp{0%{opacity:0; transform:scale(2.2) rotate(-14deg);}60%{opacity:1; transform:scale(.92) rotate(-8deg);}100%{transform:scale(1) rotate(-8deg);}}
  @media(prefers-reduced-motion:reduce){ .fv2-env *, .fv2-open, .fv2-open *, .fv2-open ~ .doc{animation:none !important;} }
  @media(max-width:560px){ .fv2-open{padding:20px 18px;} .fv2-open .row{flex-direction:column-reverse;} .fv2-stamp{width:92px; height:92px;} .fv2-stamp b{font-size:28px;} }
  @media print{ .fv2-env{display:none;} .fv2-open{border:0; padding:0 0 12px; animation:none !important;} .fv2-open *{animation:none !important;} }
  @keyframes wordmark-spin{0%,11.11%{transform:rotateY(0deg);}100%{transform:rotateY(360deg);}}
  .wordmark-spin{animation:wordmark-spin 90s linear infinite; transform-origin:50% 50%; transform-style:preserve-3d;}
  @media(prefers-reduced-motion:reduce){ .wordmark-spin{animation:none;} }
```

## Appendix E: `4_feedback_returned.html` v2 JS (verbatim): shared bits and the envelope
```js
/* ---- v2 moments: shared bits (7 Oct 2026) ---- */
const V2_ME = rec('hub:me') || {};
const V2_F = (fb && fb.state && fb.state.f) || {};
const V2_N = (function(){ const m = String(V2_F.fTP || (fb && fb.label) || '').match(/\d+/); return m ? m[0] : ''; })();
const V2_TUTOR = String(V2_F.fTutor || '').trim();
const v2esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const V2_MARK = '<svg viewBox="8 30 104 60" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--ink-warm)" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"></path></svg>';
/* The same reading of the grade as the CELTA 5 (20_celta5.html:657). */
function v2Grade(g){
  g = String(g || '').trim(); if (!g) return null;
  if (/above|^S\+$/i.test(g)) return { mark: 'S+', word: 'Above standard', n: false };
  if (/not|^N$/i.test(g)) return { mark: 'N', word: 'Not to standard', n: true };
  if (/standard|^S$/i.test(g)) return { mark: 'S', word: 'To standard', n: false };
  return { mark: g.slice(0, 3), word: g, n: false };
}

if(currentHeld){
  /* THE SEALED ENVELOPE. Same rule, same link, same words as before; drawn
     as a letter with the mark as its seal, so a gate reads as a gift. */
  const envelope = '<section class="fv2-env">'
    + '<p class="kk">' + (V2_N ? 'Teaching practice ' + v2esc(V2_N) : 'Teaching practice feedback') + '</p>'
    + '<h2>' + (V2_TUTOR ? v2esc(V2_TUTOR.split(/\s+/)[0]) + '\u2019s feedback is in.' : 'Your tutor\u2019s feedback is in.') + '</h2>'
    + '<div class="fv2-paper" aria-hidden="true"><span class="body"></span><span class="flap"></span><span class="seal">' + V2_MARK + '</span>'
    + (V2_ME.name ? '<p class="to">for ' + v2esc(V2_ME.name) + '</p>' : '') + '</div>'
    + '<p class="why">Teach, reflect, then read the feedback. It opens the moment your self-evaluation is in.</p>'
    + '<a class="go" href="2_trainee_self_evaluation.html">Write my self-evaluation <span aria-hidden="true">\u2192</span></a>'
    + '</section>';
  content.insertAdjacentHTML('afterbegin', envelope);
}
```

## Appendix F: `4_feedback_returned.html` v2 JS (verbatim): the opening panel
```js
/* THE OPENING. A panel above the front sheet: the grade as a stamp and the
   starred action points that carry into the next TP. Motion the first time
   this TP is opened in this browser (chub:fbOpened:<n>), still after that. */
if(currentOpen){
  const g = v2Grade(V2_F.fGrade);
  const L = (fb.state && fb.state.lists) || {};
  const stars = Object.keys(L).reduce((a, k) => a.concat((L[k] || []).filter(it => it && it.star)), [])
    .map(it => { const d = document.createElement('div'); d.innerHTML = it.html || ''; return d.textContent.trim(); }).filter(Boolean);
  let fresh = false; const key = 'chub:fbOpened:' + (V2_N || 'x');
  try { fresh = localStorage.getItem(key) !== '1'; localStorage.setItem(key, '1'); } catch (e) {}
  if (g || stars.length) {
    const nextN = V2_N ? (parseInt(V2_N, 10) + 1) : 0;
    content.insertAdjacentHTML('beforeend', '<section class="fv2-open' + (fresh ? ' fresh' : '') + '">'
      + '<div class="row"><div><p class="kk">' + (V2_N ? 'Teaching practice ' + v2esc(V2_N) : 'Teaching practice') + (V2_TUTOR ? ' \u00b7 returned by ' + v2esc(V2_TUTOR) : '') + '</p>'
      + '<h2>Before you read it all</h2></div>'
      + (g ? '<div class="fv2-stamp' + (g.n ? ' n' : '') + '" role="img" aria-label="' + v2esc(g.word) + '"><b>' + v2esc(g.mark) + '</b><span>' + v2esc(g.word) + '</span></div>' : '')
      + '</div>'
      + (stars.length ? '<div class="fv2-stars"><p>\u2605 Carried into ' + (nextN && nextN <= HUB_MAX_TP ? 'TP' + nextN : 'your next TP') + '</p><ul>' + stars.map(s => '<li>' + v2esc(s) + '</li>').join('') + '</ul></div>' : '')
      + '</section>');
  }
}
```
