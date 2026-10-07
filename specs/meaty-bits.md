# The meaty bits: timetable and feedback writer, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `2ecd8ee85879`), read 7 Oct 2026.
Design: `Magic Touches.dc.html`, turn 2 (2a, 2b). Drop-ins: `23_timetable.html` and `3_tutor_feedback.html` in this folder.

Both changes are display only: nothing new is stored, and every existing id, key, handler and print rule stays as it is. Sections 1 and 2 describe every element, state, hover, focus, motion, phone and print rule, and the logic. The appendices hold the exact code, copied verbatim from the drop-ins. Where the two differ, the appendix wins.

---

## 0. Shared language

- **Fonts** (already loaded on both pages):
  - Newsreader 600/700 for numbers and headings
  - Karla for body text and controls
- **Tokens** (`hub-tokens.css`):

  | Token | Value |
  |---|---|
  | `--teal-deep` | `oklch(31% 0.055 195)` |
  | `--teal` | `oklch(37.5% 0.058 195)` |
  | `--teal-lifted` | `oklch(44% 0.062 195)` |
  | `--gold` | `oklch(63% 0.096 72)` |
  | `--gold-lifted` | `oklch(70% 0.12 72)` |
  | `--gold-deep` | `oklch(52% 0.098 70)` |
  | `--gold-wash` | `oklch(94.5% 0.035 78)` |
  | `--amber-edge` | `oklch(84% 0.08 78)` |
  | `--paper` | `oklch(99.5% 0.004 90)` |
  | `--surface` | `oklch(95.2% 0.018 84)` |
  | `--box` | `oklch(91.2% 0.03 80)` |
  | `--field` | `oklch(99% 0.004 90)` |
  | `--sand-line` | `oklch(85.5% 0.02 80)` |
  | `--ink` | `oklch(23.5% 0.017 65)` |
  | `--ink-warm` | `oklch(30% 0.042 58)` |
  | `--grey` | `oklch(51% 0.017 70)` |
  | `--brick` | `oklch(45% 0.15 27)` |

  Fallback only: `--garnet`, which defaults to `oklch(42% 0.13 27)` and is the action-point colour on screen 3.
- **Motion.** Gold means "now" or "next", matching the welcome and the hero. Every animation and transition here is off under `prefers-reduced-motion`.

---

## 1. Timetable (`23_timetable.html`)

### 1.1 What changes in the drop-in (three edits)

1. **Slot times on the rows.** In `cellHTML`, the `t` span gains `data-from` and `data-to` from `slot.from` / `slot.to`. These are the only change to existing markup.
   - The day-one demonstration and unassessed rows build their own span and carry no times, so they are never lit.
2. **CSS.** A `.tv2-*` block inserted after `.due.late`.
3. **JS.** An IIFE after the `SCROLLED` listeners at the end of the app script.
   - It watches `#app` with a `MutationObserver` (`childList`), coalesced into one `requestAnimationFrame`.
   - After every `render()` it re-applies three things: `ribbon()`, `nowLine()` and `duePills()`.
   - Each one is guarded so its own additions don't trigger another pass.
   - `nowLine()` also runs every 30s.

### 1.2 The course ribbon (`.tv2-rib`)

**When.** `TT.days` is not empty and a `.wk` exists. The ribbon goes in just before the first week, after the head, zone line, tutor bar and rooms strip.

**Frame.** Margin 0 0 18, padding 16/18/14, `--paper`, 1px `--sand-line`, radius 12.

**Head row (`.top`).** Flex, baseline, space-between, wraps, gap 12, margin-bottom 12.

| Element | Spec |
|---|---|
| `b` | Newsreader 700, 1.35rem, `--teal-deep`. The number sits in `em`, upright, `--gold-deep`. |
| `span` | 0.78rem, `--grey`. "{N} days · {M} with teaching practice" (M = days with `d.tp`) |

The heading depends on where today falls:

| Today | Heading |
|---|---|
| On a course day | "Day **7** of 20" |
| Before the first day | "Starts in **N** day(s)" |
| After the last day | "The course is finished" |

**Segments (`.tv2-segs`).** A grid with `grid-auto-flow:column` and `grid-auto-columns:minmax(0,1fr)`, gap 4: one column per course day.

**Each segment (`button.tv2-seg`).**
- Height 30, radius 5, no border, `--box` fill. Karla 700 10px `--grey` showing the day number.
- Transitions: transform .15s, background .2s.

| State | Rule |
|---|---|
| Monday (not day 1) | `inset 2px 0 0 --sand-line`, a quiet week break |
| Past (`date < TODAY`) | `--teal` fill, `--paper` text |
| Today | `--gold-lifted` fill, `--ink-warm` text, `tv2-pulse` (2.2s, a box-shadow ring 0 → 8px from `oklch(70% 0.12 72 / .55)`) |
| Hover | lifts 2px, `--teal-lifted` fill, `--paper` text |
| Hover on today | `--gold` fill |
| Focus-visible | 2px `--gold-lifted` outline, offset 2 |

- **TP day:** a `.tp` bar centred under the segment: 60% of its width, 3px, `--teal-lifted`, bottom −8.
- **Deadline:** a `.du` dot, 5px, `--gold-deep`. Bottom −10, or −15 when there is also a TP bar.
- **Title and aria-label:** "Day N · Tue 6 Oct · TP 3 · LRT due" (the parts that apply).
- **Click:** scrolls to `#d-{date}` with `window.scrollTo` (smooth), 64px above the card so the sticky week heading doesn't cover it. `scrollIntoView` is not used, on purpose.

**Key (`.tv2-key`).** Flex, gap 16, margin-top 18, 0.72rem `--grey`. "teaching practice" with a 12×3 `--teal-lifted` bar, and "a deadline" with a 6px `--gold-deep` dot.

**Phone (≤640px):** segments are 24px tall with no numbers, and the panel padding is 14/12/12.

**Print:** hidden.

### 1.3 The now line (today's card only, `.day.today`)

- **Clock.** `.tv2-clock` is added to `.dh`: Karla 700, 0.7rem, `--gold-deep`, tabular numbers, "HH:MM" from `hubNow()`, which follows the demo clock.
- **Each `.sl` with `.t[data-from][data-to]`:**
  - `now ≥ from && now < to` → `.tv2-now`: `--gold-wash` fill, an inset 3px `--gold` left bar, the time in `--gold-deep`, and a "Now" label under it (0.58rem, tracking 0.1em, uppercase, `--gold-deep`).
  - `now ≥ to` → `.tv2-past`: opacity .45.
  - Both transition over .4s.
- **Not lit:** breaks without times, notes, and the day-one demonstration rows.
- **Updates:** every 30s.
- **Print:** full opacity, no fill, no bar, no label.

### 1.4 Due pills (`.due .tv2-in`)

- **Which dues:** every `.due` on a day from today onward. Past and late dues are left alone, and `.due.late` hides the pill.
- **Text:** "today", "tomorrow", or "in N days".
- **Pill:** inline-block, margin-left 6, padding 1/7, radius 999, 0.64rem 700. `--gold-wash` fill, `--gold-deep` text, 1px `--amber-edge` border.
- **Two days or fewer (`.soon`):** `--gold-lifted` fill and border, `--ink-warm` text.
- **Tutor edit mode:** the pill sits inside the existing `button.due.asbtn`, so it still opens the move-deadline panel.
- **Print:** hidden.

### 1.5 Logic notes

- `TODAY` is the page's own (`hubToday()` or the real date). `DUES` and `TT` are the page's globals, read fresh on every pass.
- Day differences are counted at noon, so DST changes can't shift a day.
- `esc` is the page's own.

---

## 2. Tutor feedback writer (`3_tutor_feedback.html`)

### 2.1 What changes in the drop-in (four edits)

1. **CSS.** A `.gv2` / `.sv2` block inserted after `.grade-select.not`.
2. **Markup.** `#gv2` grade tiles inserted above `.house-sel` in the grade card.
3. **Markup.** `#sv2` strip inserted at the start of the action bar's `.rhs`.
4. **JS.** An IIFE after the `fGrade` change handler.

### 2.2 Grade tiles (`#gv2`)

**Frame.**
- Grid of three equal columns, gap 10, max-width 560, centred, margin-top 10. `role="radiogroup"`, `aria-label="Lesson grade"`.
- **The select stays the value.** `.gv2 + .house-sel` is visually hidden with the clip pattern. It remains in the DOM and in the a11y tree, and drafts, records and the document still read `#fGrade`.

**Tile (`button`).**
- Flex column, centred, gap 4, padding 14/10/12, radius 10.
- `--field` fill, 2px `--sand-line` border, `--ink` text.
- Transitions: transform .15s plus border, background and shadow.
- `role="radio"` with `aria-checked`.
- Content: `b` (Newsreader 700, 1.7rem, line-height 1; 1.4rem at ≤600px), then `span` (0.78rem 700).

| Tile | Mark | Word | When chosen (`.on`) |
|---|---|---|---|
| `.above` | S+ | Above standard | `--gold` fill and border, `--ink-warm` text |
| `.to` | S | To standard | `--teal` fill and border, `--paper` text |
| `.not` | N | Not to standard | `--brick` fill and border, `--paper` text |

These colours are the select's own `.above` / `.to` / `.not` colours. A chosen tile also gets the shadow `0 12px 22px -14px oklch(30% 0.04 60 / .6)`.

- **Hover:** lifts 2px, border `--sand-line-deep`, shadow `0 10px 20px -14px oklch(30% 0.04 60 / .5)`.
- **Focus-visible:** 2px `--teal` outline, offset 3.
- **Click:**
  - Sets `#fGrade.value` to the tile's `data-v`. Clicking the chosen tile again clears it to "".
  - Dispatches `change`, so the existing handler colours the select and sets `dirty`.
  - Ignored while `#fGrade.disabled`, the returned and locked state. The tiles are disabled too.
- **Sync:** the tiles re-read `#fGrade.value` on every repaint, so a restored draft or record shows the right tile.
- **Print:** hidden. The document is built from the form as before.

### 2.3 The shape strip (`#sv2`, in the action bar)

**Frame.** Flex, centred, gap 14, Karla 0.78rem `--grey`, `aria-live="polite"`.

| Part | Spec |
|---|---|
| Strengths | `b` Newsreader 1.05rem `--teal`, then "strength(s)". The count is `.pt` rows with text in `#lSP` + `#lST`. |
| Action points | `b` in `--garnet`, then "action point(s)". The count is `#lAP` + `#lAT`. |
| Stars | `b` in `--gold-deep`, then "★". The count is `.star.on` in `#lAP` and `#lAT`. |
| Topics | five 7px bars, radius 2, aligned to the bottom of a 22px box. For each CELTA topic 1–5, count the `.tag[data-c]` whose code starts with that digit. Height = 6 + 16 × n / max (4px and `--box` when 0, `--teal` when tagged), animated over .3s. The title lists "Topic N: n" for all five. |
| Ready checks | "Grade" and "Overall", each with an 8px ring (1.5px `--sand-line`). When ticked: filled `--teal`, label `--teal-deep`. Grade = `#fGrade.value`; Overall = `#tOverall` not empty. |

**Ready** means a grade, at least one strength, at least one action point, and an overall comment. The first time it becomes true, `#returnBtn` gets `.fv2-ready`: one `sv2-ready` pulse over 1.6s (box-shadow 0 → 12px from `oklch(70% 0.12 72 / .6)`). It is removed if ready becomes false again.

**Repaint triggers:**
- `input`, `click`, `change` and `keyup` on the document (capture), debounced to 150ms.
- A `MutationObserver` on `.board` (childList and subtree), for rows added and removed and tags inserted.
- Once at load, and again at 800ms after draft restore.

**Responsive:**
- ≤900px: the topic bars and ready checks hide.
- ≤600px: the whole strip hides, because the bar is already full.

**Print:** hidden.

---

## 3. Test

1. **Timetable on day 7:**
   - The ribbon reads "Day 7 of 20" with six teal segments, the seventh gold and pulsing.
   - TP ticks sit under TP days and gold dots under deadline days.
   - Hovering a segment lifts it and turns it teal. Clicking scrolls to the card below the sticky week heading.
2. **Today's card:** at 10:15 the 09:45–10:30 slot is gold with "Now", the 09:00 slot is faded, and the header shows 10:15. Within 30s of the slot ending, the next one lights.
3. **Deadlines:** today's says "today" in the gold-lifted pill, tomorrow's "tomorrow", and further ones "in N days" in the wash pill. Late dues show no pill.
4. **Tutor edit mode:** the ribbon and pills show. Clicking a due still opens the move panel. Editing an input re-renders and everything re-applies.
5. **Print the timetable:** no ribbon, pills or now styling; the weeks paginate as before.
6. **Feedback writer:**
   - Clicking S selects To standard. The hidden select's value is "To standard" and the select is coloured, so `dirty` is set.
   - Clicking S again clears it.
   - Reloading with a draft shows the restored tile.
7. **Strip:**
   - Adding a strength point with text makes "1 strength". Starring an action point makes "1 ★". Tagging 5f raises bar 5.
   - Writing the overall comment with a grade, a strength and an action point gives one gold pulse on Return to trainee.
8. **After returning (locked):** the tiles are disabled and can't change the grade.
9. **Narrow widths:** at 900px the bars and checks hide; at 600px the strip hides.
10. **Reduced motion:** no pulse, no lift and no bar animation.

---

## Appendix A: existing timetable day rules (verbatim, `main`)
```css
  .days{display:grid; grid-template-columns:repeat(5,1fr); gap:10px;}
  .day{background:var(--surface); border:1px solid var(--sand-line); border-radius:10px; padding:0 0 8px; overflow:hidden; min-width:0;}
  .day.today{border-color:var(--gold); border-width:2px;}
  .day .dh{display:flex; justify-content:space-between; align-items:baseline; gap:6px; border-bottom:1px solid var(--sand-line); padding:9px 11px 7px;}
  /* One row per slot: the time in its own narrow column so the clock reads
     straight down the day, whatever the content beside it does. */
  .sl{display:grid; grid-template-columns:44px 1fr; gap:7px; padding:3px 10px; align-items:start; font-size:0.76rem; line-height:1.32; min-width:0;}
  /* The rooms strip (1 Oct 2026). */
  .rooms{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin:0 0 16px; padding:11px 14px; border:1px solid var(--sand-line); border-radius:12px; background:var(--paper);}
  .rooms .rl{font-size:0.64rem; letter-spacing:.12em; text-transform:uppercase; font-weight:700; color:var(--grey); margin-right:4px;}
  .rooms .rm{display:inline-flex; flex-direction:column; gap:2px; text-decoration:none; padding:8px 14px; border-radius:9px; border:1.5px solid var(--sand-line); color:var(--teal); line-height:1.1;}
  .rooms .rm b{font-size:0.88rem; font-weight:700;}
  .rooms .rm small{font-size:0.64rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--grey);}
  .rooms .rm:hover{border-color:var(--teal);}
  .rooms .rm.live{background:var(--teal); border-color:var(--gold); color:var(--paper);}
  .rooms .rm.live small{color:var(--paper); opacity:.85;}
  .sl.tp .tpline{display:flex; flex-wrap:wrap; align-items:baseline; gap:0 8px;}
  .sl.tp .tpline .lab{display:inline; margin-right:2px;}
  .sl.tp.first .tpline .lab{color:var(--ink-warm); letter-spacing:.06em;}
  .sl.tp .line.me .who{color:var(--teal); text-decoration:underline; text-underline-offset:2px;}
  .sl.demo{color:var(--ink);}
  @media print{ .rooms{display:none;} }
  .sl .t{color:var(--faint); font-size:0.66rem; font-weight:700; padding-top:2px; font-variant-numeric:tabular-nums;}
  .sl .t .lt{display:block; color:var(--teal); font-weight:600; font-size:0.62rem; margin-top:1px;}
  .zone .ingreen{color:var(--teal);}
  /* The day lifts under the cursor. Ramy's motion rule: a card answers by
     moving, never by changing colour. */
  .day{transition:transform 160ms ease, box-shadow 160ms ease;}
  .day:hover{transform:translateY(-3px); box-shadow:0 10px 22px -14px oklch(30% 0.04 60 / .55);}
  @media (prefers-reduced-motion: reduce){ .day{transition:none;} .day:hover{transform:none;} }
  .sl .lab{font-size:0.62rem; letter-spacing:.09em; text-transform:uppercase; color:var(--faint); font-weight:700; display:block; line-height:1.4;}
  .sl.brk{color:var(--faint); font-style:italic; font-size:0.71rem; padding-top:2px; padding-bottom:2px;}
  .sl.fix{color:var(--grey);}
  .sl .dash{color:var(--faint);}
  .sl.tp{background:var(--box);}
  .sl.tp .who{color:var(--gold-deep); font-weight:700;}
  /* One teaching line is a row of small parts that should break as a unit
     rather than mid-phrase: the letter, the group, the length, the door. */
  .sl.tp .line{display:inline-flex; align-items:baseline; gap:0 3px; line-height:1.4;}
  .sl.tp .mn{color:var(--grey); font-size:0.72rem; white-space:nowrap;}
  /* One meaning per colour, and a mark rather than a painted cell: the grid
     has to stay readable when nothing is wrong. */
  .mk{font-size:0.7rem; line-height:1; flex:none;}
  .mk.done{color:var(--teal); opacity:.55;}
  .mk.watch{color:var(--gold);}
  .mk.alarm{color:var(--brick);}
  .keyline{display:flex; gap:0 14px; flex-wrap:wrap; align-items:center;}
  .keyline .sp{color:var(--sand-line);}
  .sl.tp .gl{color:var(--grey); font-weight:500;}
  .sl.note{color:var(--grey); font-size:0.73rem;}
  .sl input{font-family:inherit; font-size:0.76rem; width:100%; padding:3px 6px; border:1px solid var(--sand-line); border-radius:5px; background:var(--paper); color:var(--ink); min-width:0;}
  .sl input:focus{outline:2px solid var(--teal); outline-offset:-1px;}
  .room{color:var(--teal); text-decoration:none; font-weight:600; font-size:0.71rem;}
  .room:hover{text-decoration:underline;}
```

## Appendix B: timetable v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): the course ribbon, the now line, due pills -------
     Ramy: "anything regarding the meaty bits". Three things the page already
     knows and did not show: where in the course today is, what is happening
     in the room right now, and how far off each deadline is. Display only --
     nothing here writes to the store. Design: Magic Touches.dc.html, 2a. */
  .tv2-rib{margin:0 0 18px; padding:16px 18px 14px; background:var(--paper); border:1px solid var(--sand-line); border-radius:12px;}
  .tv2-rib .top{display:flex; align-items:baseline; justify-content:space-between; gap:12px; flex-wrap:wrap; margin:0 0 12px;}
  .tv2-rib .top b{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.35rem; color:var(--teal-deep);}
  .tv2-rib .top b em{font-style:normal; color:var(--gold-deep);}
  .tv2-rib .top span{font-size:0.78rem; color:var(--grey);}
  .tv2-segs{display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); gap:4px;}
  .tv2-seg{position:relative; height:30px; padding:0; border:0; border-radius:5px; background:var(--box); cursor:pointer;
    font:700 10px 'Karla',sans-serif; color:var(--grey); transition:transform .15s ease, background-color .2s;}
  .tv2-seg.wk1{margin-left:0;} .tv2-seg.mon{box-shadow:inset 2px 0 0 var(--sand-line);}
  .tv2-seg.past{background:var(--teal); color:var(--paper);}
  .tv2-seg.today{background:var(--gold-lifted); color:var(--ink-warm); animation:tv2-pulse 2.2s ease-out infinite;}
  .tv2-seg:hover{transform:translateY(-2px); background:var(--teal-lifted); color:var(--paper);}
  .tv2-seg.today:hover{background:var(--gold); color:var(--ink-warm);}
  .tv2-seg:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  /* a TP day has a tick under it, a deadline a gold dot */
  .tv2-seg .tp, .tv2-seg .du{position:absolute; left:50%; transform:translateX(-50%); bottom:-8px; height:3px; border-radius:2px;}
  .tv2-seg .tp{width:60%; background:var(--teal-lifted);}
  .tv2-seg .du{width:5px; height:5px; border-radius:50%; bottom:-10px; background:var(--gold-deep);}
  .tv2-seg .tp + .du{bottom:-15px;}
  .tv2-key{display:flex; gap:16px; flex-wrap:wrap; margin:18px 0 0; font-size:0.72rem; color:var(--grey);}
  .tv2-key i{display:inline-block; vertical-align:middle; margin-right:5px;}
  .tv2-key .k-tp{width:12px; height:3px; border-radius:2px; background:var(--teal-lifted);}
  .tv2-key .k-du{width:6px; height:6px; border-radius:50%; background:var(--gold-deep);}
  /* the now line, on today's card only */
  .day.today .dh .tv2-clock{font-family:'Karla',sans-serif; font-size:0.7rem; font-weight:700; color:var(--gold-deep); font-variant-numeric:tabular-nums;}
  .day.today .sl.tv2-past{opacity:.45;}
  .day.today .sl.tv2-now{position:relative; background:var(--gold-wash); box-shadow:inset 3px 0 0 var(--gold);}
  .day.today .sl.tv2-now .t{color:var(--gold-deep);}
  .day.today .sl.tv2-now .t:after{content:'Now'; display:block; margin-top:2px; font-size:0.58rem; letter-spacing:.1em; text-transform:uppercase; color:var(--gold-deep);}
  .day.today .sl{transition:opacity .4s ease, background-color .4s ease;}
  /* how far off a deadline is */
  .due .tv2-in{display:inline-block; margin-left:6px; padding:1px 7px; border-radius:999px; font-size:0.64rem; font-weight:700;
    background:var(--gold-wash); color:var(--gold-deep); border:1px solid var(--amber-edge); vertical-align:1px;}
  .due .tv2-in.soon{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm);}
  .due.late .tv2-in{display:none;}
  @keyframes tv2-pulse{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .55);}70%{box-shadow:0 0 0 8px oklch(70% 0.12 72 / 0);}100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .tv2-seg, .day.today .sl{animation:none !important; transition:none !important;} }
  @media(max-width:640px){ .tv2-seg{height:24px; font-size:0;} .tv2-rib{padding:14px 12px 12px;} }
  @media print{ .tv2-rib{display:none;} .day.today .sl.tv2-past{opacity:1;} .day.today .sl.tv2-now{background:none; box-shadow:none;} .day.today .sl.tv2-now .t:after{content:none;} .due .tv2-in{display:none;} }
  .due.asbtn{display:block; width:100%; text-align:left; font-family:inherit; background:none; border:0;
    border-top:1px dashed var(--sand-line); cursor:pointer;}
  .due.asbtn:hover{background:var(--sand-deep);}
  .bar{display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin:0 0 18px;}
  .status{font-size:0.8rem; color:var(--grey);}
  .chip{font-size:0.72rem; font-weight:700; padding:3px 9px; border-radius:999px; background:var(--box); color:var(--grey);}
  .chip.on{background:var(--teal); color:var(--paper);}
  .empty{background:var(--surface); border:1px dashed var(--sand-line); border-radius:10px; padding:26px 22px; color:var(--grey); font-size:0.9rem; line-height:1.6;}
  .legend{font-size:0.76rem; color:var(--grey); margin:14px 0 0; line-height:1.6;}
  /* Said once, at the top: somebody reading from another country needs it
     before they read a single time, not after four weeks of grid (Ramy,
     seeing it on a New York capture, 29 Sep 2026). */
  .zone{font-size:0.8rem; color:var(--ink); background:var(--sand-deep); border:1px solid var(--sand-line);
    border-left:4px solid var(--teal); border-radius:8px; padding:9px 13px; margin:0 0 16px; line-height:1.55;}
  .imp{background:var(--surface); border:1px solid var(--sand-line); border-radius:10px; padding:14px 16px; margin:0 0 18px;}
  .imp h3{font-family:'Newsreader',Georgia,serif; font-size:1.02rem; margin:0 0 4px;}
  .imp p{font-size:0.8rem; color:var(--grey); margin:0 0 10px; line-height:1.55;}
  .imp textarea{font-family:ui-monospace,Menlo,monospace; font-size:0.76rem; width:100%; min-height:90px; padding:8px 10px; border:1px solid var(--sand-line); border-radius:7px; background:var(--paper); color:var(--ink);}
  .imp .row{display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:10px;}
  .review{background:var(--surface); border:1px solid var(--sand-line); border-left:5px solid var(--gold); border-radius:10px; padding:16px 18px; margin:0 0 18px;}
  .review h3{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; margin:0 0 6px;}
  .review .n{font-size:0.82rem; color:var(--grey); line-height:1.55; margin:0 0 10px;}
  .review .found{background:var(--paper); border:1px solid var(--sand-line); border-radius:7px; padding:7px 10px; margin:0 0 6px; font-size:0.79rem;}
  .review .skipped{font-size:0.78rem; color:var(--brick); margin:8px 0 0;}
  .review .acts{display:flex; gap:10px; justify-content:flex-end; margin-top:12px; flex-wrap:wrap;}
  @media (max-width:980px){ .days{grid-template-columns:repeat(2,1fr);} }
  @media (max-width:560px){ .board{padding:18px 12px 60px;} .days{grid-template-columns:1fr;} }
  .printbtn{font-size:0.72rem; font-weight:700; padding:5px 12px; margin-left:14px; vertical-align:middle;}
  /* On paper: one week to a page, the furniture gone, and nothing split. */
  @media print{
    .back,.bar,#hubSync,.printbtn,.zone .ingreen{display:none !important;}
    body{background:#fff; padding:0;}
    .board{max-width:none; padding:0;}
    .wk{break-before:page; page-break-before:always; margin:0 0 10px;}
    .wk:first-of-type{break-before:auto; page-break-before:auto;}
    .wk h2{position:static; background:none;}
    .days{grid-template-columns:repeat(5,1fr); gap:6px;}
    .day{break-inside:avoid; page-break-inside:avoid; border-color:#bbb;}
    .day.today{border-width:1px;}
    h1{font-size:1.4rem;}
  }
```

## Appendix C: timetable v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): ribbon, now line, due pills -----------------------
   Layered on whatever render() last drew, so render stays the one source.
   A MutationObserver on the page re-applies after every render; the guards
   below mean its own additions never trigger another pass. */
(function(){
  const host = document.getElementById('app'); if (!host) return;
  const p2 = n => String(n).padStart(2, '0');
  const mins = s => { const m = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); return m ? +m[1] * 60 + +m[2] : null; };
  const nowD = () => { const n = window.hubNow ? hubNow() : new Date(); return n instanceof Date ? n : new Date(n); };
  const daysBetween = (a, b) => Math.round((Date.parse(b + 'T12:00:00') - Date.parse(a + 'T12:00:00')) / 864e5);
  const jump = date => { const el = document.getElementById('d-' + date); if (!el) return; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' }); };

  function ribbon(){
    const days = (TT && TT.days) || []; if (!days.length || host.querySelector('.tv2-rib')) return;
    const firstWk = host.querySelector('.wk'); if (!firstWk) return;
    const idx = days.findIndex(d => d.date === TODAY);
    const before = days[0] && TODAY < days[0].date, after = days[days.length - 1] && TODAY > days[days.length - 1].date;
    const head = idx >= 0 ? 'Day <em>' + (idx + 1) + '</em> of ' + days.length
      : before ? 'Starts in <em>' + daysBetween(TODAY, days[0].date) + '</em> day' + (daysBetween(TODAY, days[0].date) === 1 ? '' : 's')
      : after ? 'The course is finished' : days.length + ' days';
    const tps = days.filter(d => d.tp).length;
    const sub = days.length + ' days \u00b7 ' + tps + ' with teaching practice';
    const segs = days.map((d, i) => {
      const dt = new Date(d.date + 'T12:00:00'), mon = dt.getDay() === 1 && i > 0;
      const cls = ['tv2-seg', d.date < TODAY ? 'past' : '', d.date === TODAY ? 'today' : '', mon ? 'mon' : ''].filter(Boolean).join(' ');
      const due = (typeof DUES !== 'undefined' && DUES[d.date] && DUES[d.date].length) ? DUES[d.date].map(x => x.title).join(', ') : '';
      const tip = 'Day ' + (i + 1) + ' \u00b7 ' + dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + (d.tp ? ' \u00b7 TP ' + d.tp : '') + (due ? ' \u00b7 ' + due + ' due' : '');
      return '<button type="button" class="' + cls + '" data-go="' + esc(d.date) + '" title="' + esc(tip) + '" aria-label="' + esc(tip) + '">' + (i + 1)
        + (d.tp ? '<span class="tp"></span>' : '') + (due ? '<span class="du"></span>' : '') + '</button>';
    }).join('');
    firstWk.insertAdjacentHTML('beforebegin', '<div class="tv2-rib"><div class="top"><b>' + head + '</b><span>' + sub + '</span></div>'
      + '<div class="tv2-segs">' + segs + '</div>'
      + '<div class="tv2-key"><span><i class="k-tp"></i>teaching practice</span><span><i class="k-du"></i>a deadline</span></div></div>');
    host.querySelector('.tv2-segs').addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) jump(b.dataset.go); });
  }

  function nowLine(){
    const card = host.querySelector('.day.today'); if (!card) return;
    const n = nowD(), m = n.getHours() * 60 + n.getMinutes();
    const dh = card.querySelector('.dh');
    let clock = dh && dh.querySelector('.tv2-clock');
    if (dh && !clock) { clock = document.createElement('span'); clock.className = 'tv2-clock'; dh.appendChild(clock); }
    if (clock) clock.textContent = p2(n.getHours()) + ':' + p2(n.getMinutes());
    card.querySelectorAll('.sl').forEach(row => {
      const t = row.querySelector('.t[data-from]');
      const a = t ? mins(t.dataset.from) : null, b = t ? mins(t.dataset.to) : null;
      row.classList.toggle('tv2-now', a != null && b != null && m >= a && m < b);
      row.classList.toggle('tv2-past', b != null && m >= b);
    });
  }

  function duePills(){
    host.querySelectorAll('.day .due').forEach(el => {
      if (el.querySelector('.tv2-in')) return;
      const day = el.closest('.day'); const date = day && day.id.replace(/^d-/, ''); if (!date || date < TODAY) return;
      const n = daysBetween(TODAY, date);
      el.insertAdjacentHTML('beforeend', '<span class="tv2-in' + (n <= 2 ? ' soon' : '') + '">' + (n === 0 ? 'today' : n === 1 ? 'tomorrow' : 'in ' + n + ' days') + '</span>');
    });
  }

  let q = null;
  const apply = () => { q = null; try { ribbon(); nowLine(); duePills(); } catch (e) {} };
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(apply); }).observe(host, { childList: true });
  apply();
  setInterval(nowLine, 30000);
})();

render();
```

## Appendix D: existing feedback card and grade rules (verbatim, `main`)
```css
  .card{background:var(--surface); border-radius:6px; padding:20px 24px; margin-bottom:16px; border-left:5px solid var(--gold);}
  .card.good{border-left-color:var(--teal);}
  /* Action points garnet, strengths teal: Connect's own pairing (Ramy, 24 Sep 2026). Not gold for strengths -- gold is the neutral edge on this form, and Overall comment sits right under them. */
  .card.action{border-left-color:var(--garnet, oklch(42% 0.13 27));}
  .card.grade{border-left-color:var(--gold);}
  .card.xchg{border-left-color:var(--gold);}
  .xchg-acts{display:flex; gap:8px; flex-wrap:wrap; align-items:center;}
  /* Both of these are the way in and out of the exchange, and they were the
     smallest controls on the page: Copy 31px tall, "Paste something back" 15
     (Ramy, 24 Sep 2026). The rest of Lite came up to 44 today; so do they. */
  .xchg-acts #xCopy{min-height:44px; padding:0 22px;}
  .xchg-acts #xPasteToggle{min-height:44px; display:inline-flex; align-items:center; padding:0 4px;}
  #xText{width:100%; font-family:ui-monospace,Menlo,monospace; font-size:0.8rem; line-height:1.5;
    padding:10px 12px; border:1.5px solid var(--sand-line); border-radius:6px; background:var(--field);}
    /* Read-only, and the only card on this screen that is not yours to fill
     in -- so a neutral edge rather than one of the meaning colours (gold
     structure, teal strength, garnet action point). It used to be a
     hardcoded #F6F0E3, a shade off the --surface every other card uses,
     with an edge too pale to read as an edge at all; between them they
     made the top of the page look like a different form (Ramy, 26 Sep
     2026: "it feels like they have one sort of colours and palette and
     then... it changes"). */
  .card.seen{border-left-color:var(--grey); background:var(--surface);}
  .card.selfc{border-left-color:var(--gold);}
  .card.selfc textarea{background:var(--field); border-color:var(--gold);}
  .card h2{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; margin:0 0 4px; color:var(--teal);}
  .card .guide{font-size:0.8rem; color:var(--grey); font-style:italic; margin:0 0 12px; line-height:1.5;}

  textarea{width:100%; font-family:'Karla',sans-serif; font-size:0.9rem; padding:10px 12px;
    border:2px solid var(--sand-line); border-radius:6px; background:var(--field); color:var(--ink);
    line-height:1.65; resize:vertical; overflow:hidden; min-height:56px;}
  textarea:focus{outline:none; border-color:var(--teal);}

  /* Deliberately NOT the house .house-sel treatment: this select carries the
     grade in its own fill (.above / .to / .not below), and the house rule sets
     a background, which would erase it. A coloured control is already a
     control. Checked 23 Sep 2026 while carrying the house style across. */
  .grade-select{display:inline-block; width:auto; min-width:260px; margin-top:6px;
    font-family:'Karla',sans-serif; font-size:1rem; font-weight:700; text-align:center;
    padding:11px 18px; border:2px solid var(--sand-line); border-radius:6px;
    background:var(--field); color:var(--ink); cursor:pointer;}
  .grade-select:focus{outline:none; border-color:var(--teal);}
  .grade-select.above{background:var(--gold); border-color:var(--gold); color:var(--ink-warm);}
  .grade-select.to{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .grade-select.not{background:var(--brick); border-color:var(--brick); color:var(--paper);}
```

## Appendix E: feedback v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): grade tiles, the shape of the feedback ------------
     Ramy: "anything regarding the meaty bits". The grade as three tiles you
     press (the select stays, hidden, and stays the source of the value), and
     a strip in the action bar that shows the feedback's shape as it is
     written: points per list, stars, which criteria topics it touches, and
     whether it is ready to return. Display only. Design: Magic Touches, 2b. */
  .gv2{display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; max-width:560px; margin:10px auto 0;}
  .gv2 button{display:flex; flex-direction:column; align-items:center; gap:4px; padding:14px 10px 12px; border-radius:10px; cursor:pointer;
    background:var(--field); border:2px solid var(--sand-line); color:var(--ink); font-family:'Karla',sans-serif;
    transition:transform .15s ease, border-color .15s, background-color .15s, box-shadow .15s;}
  .gv2 b{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.7rem; line-height:1;}
  .gv2 span{font-size:0.78rem; font-weight:700;}
  .gv2 button:hover{transform:translateY(-2px); border-color:var(--sand-line-deep, oklch(78% 0.02 80)); box-shadow:0 10px 20px -14px oklch(30% 0.04 60 / .5);}
  .gv2 button:focus-visible{outline:2px solid var(--teal); outline-offset:3px;}
  .gv2 .above.on{background:var(--gold); border-color:var(--gold); color:var(--ink-warm);}
  .gv2 .to.on{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .gv2 .not.on{background:var(--brick); border-color:var(--brick); color:var(--paper);}
  .gv2 button.on{box-shadow:0 12px 22px -14px oklch(30% 0.04 60 / .6);}
  .gv2 + .house-sel{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap;}
  .card.grade{position:relative;}

  .sv2{display:flex; align-items:center; gap:14px; font-family:'Karla',sans-serif; font-size:0.78rem; color:var(--grey);}
  .sv2 .n{display:inline-flex; align-items:baseline; gap:4px;}
  .sv2 .n b{font-family:'Newsreader',Georgia,serif; font-size:1.05rem; color:var(--ink);}
  .sv2 .n.good b{color:var(--teal);} .sv2 .n.act b{color:var(--garnet, oklch(42% 0.13 27));} .sv2 .n.star b{color:var(--gold-deep);}
  .sv2 .topics{display:inline-flex; gap:3px; align-items:flex-end; height:22px;} 
  .sv2 .topics i{width:7px; border-radius:2px; background:var(--box); transition:height .3s cubic-bezier(.2,.7,.2,1), background-color .3s;}
  .sv2 .topics i.on{background:var(--teal);}
  .sv2 .ready{display:inline-flex; gap:8px;}
  .sv2 .ready span{display:inline-flex; align-items:center; gap:4px;}
  .sv2 .ready span:before{content:''; width:8px; height:8px; border-radius:50%; border:1.5px solid var(--sand-line);}
  .sv2 .ready span.ok{color:var(--teal-deep);} .sv2 .ready span.ok:before{background:var(--teal); border-color:var(--teal);}
  #returnBtn.fv2-ready{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6); animation:sv2-ready 1.6s ease-out 1;}
  @keyframes sv2-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .gv2 button, .sv2 .topics i{transition:none;} #returnBtn.fv2-ready{animation:none;} }
  @media(max-width:900px){ .sv2 .topics, .sv2 .ready{display:none;} }
  @media(max-width:600px){ .sv2{display:none;} .gv2 b{font-size:1.4rem;} }
  @media print{ .gv2, .sv2{display:none;} }
```

## Appendix F: grade tiles markup (verbatim)
```html
    <div class="gv2" id="gv2" role="radiogroup" aria-label="Lesson grade">
      <button type="button" class="above" data-v="Above standard" role="radio" aria-checked="false"><b>S+</b><span>Above standard</span></button>
      <button type="button" class="to" data-v="To standard" role="radio" aria-checked="false"><b>S</b><span>To standard</span></button>
      <button type="button" class="not" data-v="Not to standard" role="radio" aria-checked="false"><b>N</b><span>Not to standard</span></button>
    </div>
```

## Appendix G: feedback v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): grade tiles + the shape strip -----------------------
   The select is still the value: a tile sets it and fires its change event,
   so the record, the draft and the colouring above all run as before. The
   tiles and the strip read the page; nothing new is stored. */
(function(){
  const sel = $('fGrade'), tiles = $('gv2'), strip = $('sv2'); if (!sel || !tiles || !strip) return;
  tiles.addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b || sel.disabled) return;
    sel.value = sel.value === b.dataset.v ? '' : b.dataset.v;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    paint();
  });
  const filled = id => [...document.querySelectorAll('#' + id + ' .pt')].filter(r => (r.querySelector('.pt-text') || {}).textContent && r.querySelector('.pt-text').textContent.trim()).length;
  let wasReady = false;
  function paint(){
    tiles.querySelectorAll('[data-v]').forEach(b => { const on = b.dataset.v === sel.value; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); b.disabled = sel.disabled; });
    const good = filled('lSP') + filled('lST'), act = filled('lAP') + filled('lAT');
    const stars = document.querySelectorAll('#lAP .star.on, #lAT .star.on').length;
    const per = { '1':0, '2':0, '3':0, '4':0, '5':0 };
    document.querySelectorAll('#lSP .tag[data-c], #lAP .tag[data-c], #lST .tag[data-c], #lAT .tag[data-c]').forEach(t => { const k = String(t.dataset.c).charAt(0); if (k in per) per[k]++; });
    const max = Math.max(1, ...Object.values(per));
    const overall = !!($('tOverall') && $('tOverall').value.trim());
    const ready = !!sel.value && good > 0 && act > 0 && overall;
    strip.innerHTML =
      '<span class="n good" title="Strengths"><b>' + good + '</b>strength' + (good === 1 ? '' : 's') + '</span>'
      + '<span class="n act" title="Action points"><b>' + act + '</b>action point' + (act === 1 ? '' : 's') + '</span>'
      + '<span class="n star" title="Starred: carried into the next plan"><b>' + stars + '</b>\u2605</span>'
      + '<span class="topics" title="' + Object.keys(per).map(k => 'Topic ' + k + ': ' + per[k]).join(' \u00b7 ') + '">'
      + Object.keys(per).map(k => '<i class="' + (per[k] ? 'on' : '') + '" style="height:' + (per[k] ? 6 + Math.round(16 * per[k] / max) : 4) + 'px"></i>').join('') + '</span>'
      + '<span class="ready"><span class="' + (sel.value ? 'ok' : '') + '">Grade</span><span class="' + (overall ? 'ok' : '') + '">Overall</span></span>';
    const btn = $('returnBtn');
    if (btn) { if (ready && !wasReady) { btn.classList.remove('fv2-ready'); void btn.offsetWidth; btn.classList.add('fv2-ready'); } if (!ready) btn.classList.remove('fv2-ready'); }
    wasReady = ready;
  }
  let t = null; const soon = () => { clearTimeout(t); t = setTimeout(paint, 150); };
  ['input', 'click', 'change', 'keyup'].forEach(ev => document.addEventListener(ev, soon, true));
  new MutationObserver(soon).observe(document.querySelector('.board') || document.body, { childList: true, subtree: true });
  paint(); setTimeout(paint, 800);
})();
```
