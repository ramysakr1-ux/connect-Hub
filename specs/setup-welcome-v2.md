# Setup welcome v2: complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `2ecd8ee85879`), read 7 Oct 2026.
Screen: `5_tutor_dashboard.html`, the first-run card for the tutor who sets the course up (`paintSetup`).
Design: `Course Setup Welcome v2.dc.html`. Drop-in: `5_tutor_dashboard.html` in this folder.

This file is meant to be complete enough to rebuild the card without opening anything else. Sections 1–9 describe every element: frame, fonts, sizes, colours, hover, focus, motion and logic. The appendices hold the exact CSS, HTML and JS, copied verbatim from the drop-in. Where the two differ, the appendix wins.

---

## 1. Scope

- **Changes:** what `paintSetup(s)` writes into `#rows` while `!s.ready && isSetter(s)`.
- **Unchanged:** the joining tutor's card (`paintJoin`) and its v1 `.welcome` rules (Appendix F, kept). The same goes for `setupState`, `isSetter`, `paint`, `paintTodo`, `drawSig`, every storage key and every id.
- **The three edits in the drop-in:**
  1. The `.wv2` CSS block, inserted above `/* once the course has people:`.
  2. `ready: true` added to the Assignments and Observations steps.
  3. `paintSetup()` replaced.

## 2. Fonts

There is one Google Fonts request, already in the page's `<head>`. Nothing new to load:

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@600;700&family=Karla:wght@400;500;600;700&family=Instrument+Serif:ital@1&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Family | Weights / style | Used for |
|---|---|---|
| Newsreader | 600, 700 | H1, the "2" count, card numbers, group heads, sheet name input |
| Instrument Serif | italic 400 | kicker line, "What this page becomes", the "Connect" wordmark |
| Instrument Sans | 500, 600, 700 | eyebrow, labels, tags, dot labels, "Lite" |
| Karla | 400, 500, 600, 700 | all body text, buttons |
| (hubHand) | drawn SVG script, from `hub-hand.js` | the signature. Not a font. |

Fallbacks: `Georgia, serif` for both serifs, `'Karla', sans-serif` for Instrument Sans.

## 3. Colour tokens

All from `hub-tokens.css`, which is linked first on the page (full list in Appendix A). The tokens the card uses:

| Token | Value | Where |
|---|---|---|
| `--teal-deep` | `oklch(31% 0.055 195)` | hero background; done card title; done dot label |
| `--teal` | `oklch(37.5% 0.058 195)` | count; CTA fill; done dot/tag; rail gradient start; door links; input focus underline; dot hover |
| `--teal-lifted` | `oklch(44% 0.062 195)` | CTA hover; done dot hover |
| `--gold` | `oklch(63% 0.096 72)` | next card border; next dot hover; queue card left edge |
| `--gold-lifted` | `oklch(70% 0.12 72)` | next dot; next tag; rail gradient end; big mark left C; focus ring |
| `--gold-deep` | `oklch(52% 0.098 70)` | next card number; next dot label; "What this page becomes"; next card hover border |
| `--gold-wash` | `oklch(94.5% 0.035 78)` | next card background |
| `--paper` | `oklch(99.5% 0.004 90)` | H1; sheet; rail panel; done card; big mark right C; text on teal |
| `--surface` | `oklch(95.2% 0.018 84)` | to-do card; signature well; queue cards |
| `--box` | `oklch(91.2% 0.03 80)` | to-do tag |
| `--sand` | `oklch(98.8% 0.006 85)` | page ground (body) |
| `--sand-line` | `oklch(85.5% 0.02 80)` | rail panel border; card border; dot ring; input underline; group-head rule; future dashed border |
| `--row-line` | `oklch(90% 0.016 82)` | rail track |
| `--ink` | `oklch(23.5% 0.017 65)` | card text; input text |
| `--ink-warm` | `oklch(30% 0.042 58)` | signing line; how-line; done card line; next tag text; next dot digit |
| `--grey` | `oklch(51% 0.017 70)` | labels, notes, to-do line, dot labels, count suffix |
| `--field-ph` | `oklch(49% 0.017 70)` | input placeholder; signature placeholder |

New literals (not tokens; they read on `--teal-deep` and clear 4.5:1):

| Value | Where |
|---|---|
| `oklch(80% 0.1 75)` | hero eyebrow |
| `oklch(80% 0.11 75)` | hero kicker |
| `oklch(91% 0.018 190)` | hero lede |
| `oklch(78% 0.04 195)` | done card border |
| `oklch(70% 0.02 75)` | to-do card number |
| `oklch(70% 0.12 72 / .16)` | hero glow |
| `oklch(15% 0.04 195 / .7)`, `/ .2` | sheet shadow |
| `oklch(37.5% 0.058 195 / .8)` | CTA shadow |
| `oklch(52% 0.098 70 / .55)`, `/ .65` | next card shadow, at rest and on hover |
| `oklch(70% 0.12 72 / .55` → `/ 0)` | next dot pulse ring |

Fallback-only vars the page already uses: `--sand-line-deep` (`oklch(78% 0.02 80)`) and `--shade-far` (`rgba(40,30,15,.35)`).

## 4. Frame (the page around the card)

- `body`: margin 0, Karla, `--ink` on `--sand`, padding `0 20px 90px`.
- `.board`: max-width 1080px, centred. The card fills this width.
- **Chrome bar:** 64px tall, flex, space-between, gap 24.
  - Lockup: a 30×30 `--ink-warm` tile with radius 7, holding the 20×12 mark (`wordmark-spin`, 90s).
  - Wordmark: "Connect" in Instrument Serif italic 21px `--gold`, and "Lite" in Instrument Sans 500 9px with 0.24em tracking, uppercase, `--ink`.
  - Right side: the role "Tutor" in Instrument Sans 600 10px with 0.22em tracking, `--grey`.
  - Under `body.firstrun`, the header name input is hidden, along with the title, the title buttons, online rooms, stream, shelf, install hint, queue and the "coming" line.
- **Foot:** "How Connect Lite works" line, then the credit footer, both unchanged.
- The exact rules are in Appendix B.

## 5. The card, element by element

Sizes are CSS px unless marked. *lh* = line-height, *ls* = letter-spacing.

### 5.1 Wrapper `.wv2`
margin-top 18px. No background.

### 5.2 Hero `.wv2-hero`

| Property | Value |
|---|---|
| position / overflow | relative / hidden |
| background | `--teal-deep` |
| radius | 16px |
| padding | 64 64 60 |
| layout | grid, `repeat(auto-fit, minmax(min(100%,400px), 1fr))`, gap 48 (rows) × 64 (cols), align-items center. Two columns at ≥ ~930px of board width, stacked below. |

**Big mark `.wv2-bigmark`.** An inline SVG, `viewBox="8 30 104 60"`, 980px wide. Absolute, right −220, top −120, opacity .13, pointer-events none.
- Paths: left C in `--gold-lifted`, right C in `--paper`, stroke-width 9, round caps.
- Animation `wv2-drift`: 18s, ease-in-out, infinite. Rotates −8° → −4° → −8° and scales 1 → 1.04 → 1.

**Glow `.wv2-glow`.** Absolute inset 0, `radial-gradient(120% 90% at 0% 100%, oklch(70% 0.12 72 / .16), transparent 55%)`.

**Intro `.wv2-intro`** (relative; animation `wv2-in` .9s `cubic-bezier(.2,.7,.2,1)`):

| Element | Font | Size | Weight | lh | ls | Colour | Other |
|---|---|---|---|---|---|---|---|
| `.wv2-eyebrow` | Instrument Sans | 11 | 600 | — | 0.26em | `oklch(80% 0.1 75)` | uppercase, margin 0 0 22 |
| `h2.wv2-h` | Newsreader | clamp(56, 7vw, 96) | 700 | 0.98 | −0.02em | `--paper` | text-wrap balance |
| `.wv2-kicker` | Instrument Serif *italic* | clamp(26, 2.6vw, 34) | 400 | 1.15 | — | `oklch(80% 0.11 75)` | margin-top 22 |
| `.wv2-lede` | Karla | 17 | 400 | 1.6 | — | `oklch(91% 0.018 190)` | max-width 520, margin-top 16, text-wrap pretty |

**Sheet `.wv2-sheet`.**

| Property | Value |
|---|---|
| background | `--paper` |
| radius | 14 |
| padding | 28 30 24 |
| transform | rotate(−1.4deg). Deliberate, confirmed with Ramy. |
| shadow | `0 30px 60px -24px oklch(15% 0.04 195 / .7), 0 2px 4px oklch(15% 0.04 195 / .2)` |
| animation | `wv2-sheet` 1.1s `cubic-bezier(.2,.7,.2,1)` .25s both. Rises 40px and keeps the tilt. |

Inside the sheet:

| Element | Spec |
|---|---|
| Label "Your name" | Instrument Sans 600 10px, ls 0.14em, uppercase, `--grey`, margin-bottom 6 |
| `#welcomeName` | full width; Newsreader 600 24px `--ink`; padding 6 0 8; border 0 except a 1.5px `--sand-line` bottom; transparent; radius 0 |
| …focus | outline none; bottom border `--teal` |
| …placeholder | "As it will sign your feedback", `--field-ph` |
| `small` | 13px `--grey`, margin-top 7: "Typed once. It signs your posts, your feedback and your marking." |
| `#welcomeSig.wsig` | margin-top 22; background `--surface`; no border; no shadow; radius 10; padding 16 18 14 |
| …`.wsig-line` | flex, align-items end, min-height 84; bottom border 1.5px `--ink-warm`; padding 0 4 4 |
| …`.wsig-mark` | 3.4rem; the hubHand SVG |
| …`.wsig-who` | Instrument Sans 700 0.72rem, ls 0.12em, uppercase, `--ink-warm`, then "· Tutor" in `--grey` 600 |
| …`.wsig-note` | 0.76rem `--grey` lh 1.45: "Your signature, written from your name: the one on the CELTA 5 and everything you sign here." |
| `#welcomeSigPh.wv2-sigph` | shown only when `#welcomeSig` is hidden (no name). Same well as `.wsig`. Inner `i`: flex end, min-height 84, padding 0 4 12, 1.5px `--ink-warm` bottom border, Instrument Serif italic 20px `--field-ph`: "Your signature appears here as you type" |

### 5.3 Progress rail `.wv2-rail`

| Property | Value |
|---|---|
| margin-top | 20 |
| background / border | `--paper` / 1px `--sand-line` |
| radius / padding | 16 / 28 36 |
| grid | columns `auto minmax(0,1fr)`; areas `'count cta' 'rail rail'`; gap 28 × 40; align-items center |

| Element | Spec |
|---|---|
| `.wv2-count b` | Newsreader 700 64px lh 1 `--teal`: the number of steps done |
| `.wv2-count span` | Karla 15px lh 1.3 `--grey`: "of 7" / "done" on two lines |
| `.wv2-cta` | justify-self end; column, align end, gap 8 |
| CTA `.btn.primary` | height 48; padding 0 26; radius 999; Karla 700 15px; fill and border `--teal`; text `--paper`; gap 10; shadow `0 10px 24px -12px oklch(37.5% 0.058 195 / .8)`; trailing "→" |
| …hover | fill and border `--teal-lifted`, text `--paper` |
| …focus-visible | 2px `--gold-lifted` outline, offset 3 |
| `.wv2-cta small` | 13px `--grey`, right-aligned, max-width 260 |
| `.wv2-track` | grid-area rail; padding 0 11 40 |
| track line (`::before`) | absolute; left and right 11; top 11; height 3; radius 3; `--row-line` |
| `#wv2Fill` | the same geometry; `linear-gradient(90deg, --teal, --gold-lifted)`; width starts at 0 and is set by JS; `transition: width 1.4s cubic-bezier(.2,.7,.2,1)` |
| `.wv2-dots` | flex, space-between |

**Dot `a.wv2-dot`.** 24×24, margin −1, round, 2px border, Karla 700 11px, centred digit, no underline.
- Transitions: background .4s, border-color .4s, transform .2s.
- Label `span`: absolute, top 32, centred. `max-width: clamp(56px, 11vw, 130px)`, text-align centre, lh 1.25, text-wrap balance. Instrument Sans 600 10.5px, ls 0.04em.

| State | Fill | Ring | Digit | Label | Hover |
|---|---|---|---|---|---|
| to do | `--paper` | `--sand-line` | `--grey` | `--grey` | ring and digit `--teal`, label `--teal`, scale 1.12 |
| done | `--teal` | `--teal` | `--paper` | `--teal-deep` | fill and ring `--teal-lifted`, scale 1.12 |
| next | `--gold-lifted` | `--gold-lifted` | `--ink-warm` | `--gold-deep` | fill and ring `--gold`, scale 1.12 |

The next dot also runs `wv2-pulse`: 2s ease-out infinite, a box-shadow ring growing from 0 to 14px while fading from `oklch(70% 0.12 72 / .55)` to 0.

### 5.4 How-it-works `.wv2-how`
Margin 36 4 0; max-width 720; Karla 15px lh 1.6 `--ink-warm`; text-wrap pretty. The text is v1's lede, with "below" changed to "above".

### 5.5 Group heads `.wv2-ghead`
Flex, baseline, gap 14; padding 0 4 10; bottom border 1px `--sand-line`; margin-top 28 (36 for the second).
- `b`: Newsreader 600 20px.
- `span`: 13px `--grey`.
- The two heads read "Course admin" with "four tabs", then "Three pages of their own".

### 5.6 Step cards `a.wv2-card`

| Grid | Value |
|---|---|
| `.wv2-grid` (steps 1–4) | margin-top 16; `repeat(auto-fill, minmax(240px,1fr))`; gap 14 |
| `.wv2-grid.pages` (steps 5–7) | `repeat(auto-fill, minmax(300px,1fr))` |

**Card base.** Flex column, gap 10; min-height 220 (200 in `.pages`); padding 22 22 18; radius 12; background `--surface`; 1px `--sand-line`; text `--ink`; no underline.
- Transition: transform .3s `cubic-bezier(.2,.7,.2,1)`, box-shadow .3s.
- Entrance: `wv2-in` .5s, with inline `animation-delay: 0.35 + index × 0.07`s.

| Part | Spec |
|---|---|
| `.top` | flex, space-between, centre |
| `.num` | Newsreader 700 44px lh 1 |
| `.tag` | Instrument Sans 700 10px, ls 0.14em, uppercase, padding 5 10, radius 999 |
| `b` (title) | Karla 700 17px |
| `p` (line) | 14px lh 1.55, text-wrap pretty |
| `.door` | margin-top auto; Karla 700 13px `--teal` |

| State | Background | Border | Shadow | Number | Title | Line | Tag (bg / text) | Door |
|---|---|---|---|---|---|---|---|---|
| to do | `--surface` | 1px `--sand-line` | none | `oklch(70% 0.02 75)` | `--ink` | `--grey` | "To do": `--box` / `--ink-warm` | "Open →" |
| done | `--paper` | 1px `oklch(78% 0.04 195)` | none | `--teal` | `--teal-deep` | `--ink-warm` | "Done ✓" or "Ready ✓": `--teal` / `--paper` | "Open to change →" |
| next | `--gold-wash` | 2px `--gold` | `0 18px 36px -18px oklch(52% 0.098 70 / .55)` | `--gold-deep` | `--ink` | `--grey` | "Next": `--gold-lifted` / `--ink-warm` | "Open →" |

**Hover:**
- All cards: translateY(−3px); border `--sand-line-deep`; shadow `0 14px 28px -18px --shade-far`; door text underlined with offset 3.
- Done cards: border `--teal` instead.
- Next card: border `--gold-deep`, shadow `0 22px 40px -18px oklch(52% 0.098 70 / .65)`.

**Focus-visible:** 2px `--gold-lifted` outline, offset 3. This applies to cards, dots and the CTA alike.

### 5.7 What this page becomes `.wv2-future`
- Panel: margin-top 48; radius 16; 1.5px dashed `--sand-line`; padding 28 32 30.
- `.fhead`: flex, baseline, space-between, wrap, gap 16.
  - `i`: Instrument Serif italic 28px `--gold-deep`, reading "What this page becomes".
  - `span`: Instrument Sans 700 10px, ls 0.16em, uppercase, `--grey`, reading "Comes into focus as you set up".
- Inner `.queue`: the dashboard's own `.queue` and `.qcard` rules (Appendix B), margin-top 18, pointer-events none, opacity and filter transitions of 1s each.
  - Three cards, each showing the value 0: "Teaching practice" / "lessons ready for your feedback", "Assignments" / "waiting to be marked", "Trainees" / "on the course".
  - `qcard` look: `--surface` fill, 1px `--sand-line`, a 5px `--gold` left edge, radius 10, padding 14 16. Title: Instrument Sans 600 10px, ls 0.1em, grey. Number: Newsreader 600 1.6rem. Line: 0.85rem grey.
- **Inline focus:** `opacity = 0.35 + 0.35 × done/7` and `filter: blur(3 − 2.5 × done/7 px)`. At 2 of 7 that is about .45 and 2.3px; at 7 of 7 it is .70 and 0.5px.

## 6. Motion

| Name | Keyframes | Used by | Timing |
|---|---|---|---|
| `wv2-in` | opacity 0 → 1, translateY 24px → 0 | intro, cards | .9s intro / .5s cards, `cubic-bezier(.2,.7,.2,1)`, both |
| `wv2-sheet` | opacity 0 → 1, translateY 40px → 0, rotate −1.4° throughout | sheet | 1.1s, .25s delay |
| `wv2-drift` | rotate −8° → −4° → −8°, scale 1 → 1.04 → 1 | big mark | 18s ease-in-out infinite |
| `wv2-pulse` | box-shadow ring 0 → 14px, alpha .55 → 0 | next dot | 2s ease-out infinite |
| `wordmark-spin` | rotateY 0 (held for 10s) → 360° | chrome lockup (existing) | 90s linear infinite |
| rail fill | width transition | `#wv2Fill` | 1.4s, set two animation frames after paint |

Under `prefers-reduced-motion: reduce`, every animation and transition inside `.wv2` is off.

## 7. Responsive

- **Board width ~930px or less:** the hero stacks to one column.
- **560px or less:**
  - Hero padding 36 22 32, radius 12; big mark 560px wide at right −200, top −60.
  - Rail: one column, areas `count / cta / rail`; CTA left-aligned; track bottom padding 30.
  - Only the next dot shows its label.
  - Future panel padding 20 18.
- The chrome bar's existing phone rules apply unchanged.

## 8. Logic

### 8.1 When the card shows

`paint()` calls `setupState()`. If `!s.ready && isSetter(s)`, it sets `chub:setsUp = '1'` and calls `paintSetup(s)`. Otherwise the normal dashboard renders (the join card, if relevant, then the to-do line, queue and rows).

- **`s.ready`:** `people().length > 0`, meaning at least one trainee in `connect_roster_v1`. Adding the first trainee replaces this card with the dashboard, so the "trainees on" state of the design file can't appear in production.
- **`isSetter(s)`, in order:**
  1. `chub:setsUp === '1'` → true.
  2. `chub:joined === '1'` → false.
  3. Otherwise, true if the course has no name or this browser already has `chub:tutorName`.

### 8.2 What it reads (`setupState`)

| Field | Source |
|---|---|
| `cs` | `connect_course_settings` |
| `named` | `!!cs.courseName` |
| `dated` | `cs.start && cs.end` |
| `tutors` | `cs.tutorNames`, comma-split |
| `agreement` | `cs.agreement` keys or `cs.docs.docAgreement` |
| `logo` | `!!cs.logo` |
| `rooms` | `cs.onlineRooms` entries that have a `url` |
| `trainees`, `groups` | `connect_roster_v1` via `people()` |
| `days`, `published` | `connect_timetable_v1` |
| `setLib`, `built` | `connect_tp_points_v1` (`set.library`, or `set.sessions` counting as 1; `groups` non-empty) |
| `volunteers` | `connect_volunteers_v1.students.length` |

### 8.3 The seven steps (`setupSteps`)

| # | Short / title | Done when | Opens | Line, undone | Line, done |
|---|---|---|---|---|---|
| 1 | Settings / Settings | `named && dated` | `6_centre_admin_dashboard.html#settings` | "The centre and the course, the dates, the candidate agreement, the tutors. The dates also decide when the assessor’s link stops working." | "{course} · {d Month – d Month yyyy} · agreement written / no agreement yet · N tutor(s) named / no tutors named yet[ · your logo on every printed record]" |
| 2 | Roster and links | `trainees > 0` | `…#roster` | "Paste the class list in one go. Each one gets a personal link — no accounts, no passwords." | "N trainee(s) on the course[ in N group(s)], each with a personal link to be sent to them" |
| 3 | Assignments (`ready`) | always | `…#assignments` | "Connect’s four Cambridge assignments, briefs and criteria, ready as they are. Rewrite any of them, or choose when the trainees see each one." | same |
| 4 | Observations (`ready`) | always | `…#observations` | "Connect’s fifteen observation sheets, ready as they are. Change the wording on any of them if you want to." | same |
| 5 | Timetable / The timetable | `published` | `23_timetable.html` | "The spreadsheet you already have, read once. Or built here, day by day." If days are drafted: "N day(s) drafted — not yet set for the course to see" | "N day(s) laid out[, N online room(s) on them] — the course can see it" |
| 6 | TP points | `built` | `24_tp_points.html` | "Take a set from the library, or write your own; the rotation does the rest." If there are sets: "N set(s) on the course — the rotation is not built yet" | "Every practice staged and timed, for every trainee[, from N set(s)]" |
| 7 | Volunteer students / The volunteer students | `volunteers > 0` | `25_volunteer_register.html` | "The people who come in to be taught. Their register, their reminders, their certificates." | "N student(s) on the register, each with their own page" |

### 8.4 What `paintSetup` computes

| Value | Rule |
|---|---|
| `done` | the count of steps with `done` true |
| `nextIdx`, `next` | the first step not done, or none |
| `begun` | any step that is done and not `ready` |
| CTA label | `begun ? "Next: " + short with its first letter lower-cased : "Start setting up the course"`. The CTA is omitted when there is no next step. |
| CTA href | `next.href` |
| CTA note | "Each step opens where it is done." while there is a next step; otherwise "All seven done — add the trainees and this page becomes your working list." |
| step state class | `done`, or `next` if the index is `nextIdx`, otherwise none |
| tag text | done: "Ready ✓" if `ready`, else "Done ✓"; next: "Next"; else "To do" |
| rail fill | `reach` = the last index of the unbroken done run from 0; `fill = steps[0].done ? reach/6 : 0`; width = `calc((100% - 22px) * fill)` |
| H1 | `s.named ? "Welcome to " + courseName : "Welcome."` |
| eyebrow | `cs.centreName || "Connect Lite"` |
| name prefill | `s.named ? chub:tutorName : ""`. A course with no name never shows a remembered name (Ramy, 6 Oct). |
| autofocus | `#welcomeName` focuses after 60ms with `preventScroll` when the prefill is empty |
| future focus | opacity and blur as in §5.7 |

All user text goes through `esc()`. The step `line`s already escape their own interpolations.

### 8.5 Name and signature

When `#welcomeName` fires `input`:
1. `nameInput.value = w.value`. This is the header field, which every other screen reads.
2. `localStorage['chub:tutorName'] = w.value`.
3. `drawSig(#welcomeSig, value)` draws the `hubHand.html(hubInk.mine(name), name)` signature and stores `chub:tutorSigKept`. It hides the host when the name is empty or hubHand is missing.
4. `#welcomeSigPh.hidden = !#welcomeSig.hidden`, so exactly one of the signature and the placeholder shows.

The same `draw` runs once on paint.

### 8.6 Storage keys touched
- Read: `connect_course_settings`, `connect_roster_v1`, `connect_timetable_v1`, `connect_tp_points_v1`, `connect_volunteers_v1`, `chub:tutorName`, `chub:setsUp`, `chub:joined`.
- Written: `chub:tutorName`, `chub:tutorSigKept`, `chub:setsUp`.
- No new keys.

### 8.7 Scripts the card depends on

Already on the page: `hub-shared.js` (`hubAvatar`, `hubFadeAway`), `hub-hand.js` (`hubHand`), `hub-ink.js` (`hubInk`). Full load order:

```html
<script src="hub-due.js?v=202610071940"></script>
<script src="observation-defaults.js?v=202610071940"></script>
<script src="hub-shared.js?v=202610071940"></script>
<script src="hub-store.js?v=202610071940"></script>
<script src="hub-say.js?v=202610071940"></script>
<script src="hub-hand.js?v=202610071940"></script>
<script src="hub-ink.js?v=202610071940"></script>
<script src="hub-shelf.js?v=202610071940"></script>
<script src="assignment-defaults.js?v=202610071940"></script>
<script src="hub-sync.js?v=202610071940"></script>
<script src="hub-tracker.js?v=202610071940"></script>
<script src="hub-feedback.js?v=202610071940"></script>
```

## 9. Two behaviour changes from v1

1. **Start versus Next.** v1 tested `done === 0`, which can never be true because steps 3 and 4 are always done. v2 tests `begun` instead.
2. **The how-line** now says "the button above", because the button sits in the rail above the cards.

## 10. Test

1. **Fresh browser, course with no name:**
   - H1 reads "Welcome.", the name field is empty and focused, and the signature placeholder shows.
   - The count reads 2 and the rail fill is 0.
   - Dot 1 is gold and pulsing, dots 3–4 are teal, and the CTA reads "Start setting up the course" and opens Settings.
2. **Typing a name:** the signature draws and the placeholder hides. The header field (hidden) and `chub:tutorName` update. Clearing the field brings the placeholder back.
3. **Saving Settings, then returning:**
   - H1 reads "Welcome to {course}", card 1 is done (teal), card 2 is next (gold), and the CTA reads "Next: roster and links".
   - The fill reaches dot 1 only, because dot 2 is undone and the run breaks there.
4. **Publishing the timetable before the roster:** card 5 turns done, but the fill doesn't move past dot 1.
5. **Adding one trainee:** the card is gone, and the to-do line, queue and rows render.
6. **A second tutor** (`chub:joined = '1'`) sees the v1 join card.
7. **Hover** on each card state, each dot state and the CTA matches §5. Tabbing through shows the gold focus ring on the CTA, the seven dots and the seven cards.
8. **Reduced motion:** nothing animates, and the rail fill jumps straight to its width.
9. **375px phone:** the hero stacks, the rail stacks, only the next dot's label shows, and nothing scrolls sideways.

---

## Appendix A: `hub-tokens.css` `:root` (as on `main`)
```css
:root{
  --sand:oklch(98.8% 0.006 85); --sand-deep:oklch(94.8% 0.01 85); --sand-line:oklch(85.5% 0.02 80);
  --row-line:oklch(90% 0.016 82); --paper:oklch(99.5% 0.004 90);
  --surface:oklch(95.2% 0.018 84); --card:var(--surface); --box:oklch(91.2% 0.03 80);
  --field:oklch(99% 0.004 90); --field-focus:oklch(98.5% 0.008 84); --field-ph:oklch(49% 0.017 70);
  --ink:oklch(23.5% 0.017 65); --ink-warm:oklch(30% 0.042 58);
  --grey:oklch(51% 0.017 70); --faint:oklch(54% 0.012 75);
  --teal:oklch(37.5% 0.058 195); --teal-lifted:oklch(44% 0.062 195); --teal-deep:oklch(31% 0.055 195);
  --gold:oklch(63% 0.096 72); --gold-lifted:oklch(70% 0.12 72); --gold-deep:oklch(52% 0.098 70);
  --gold-wash:oklch(94.5% 0.035 78); --amber-edge:oklch(84% 0.08 78);
  --brick:oklch(45% 0.15 27);
  --r-control:6px; --r-strip:10px; --r-card:12px;
}
```

## Appendix B: inherited page rules the card sits on (verbatim)
```css
  *{box-sizing:border-box;}
  body{margin:0; font-family:'Karla',sans-serif; color:var(--ink); background:var(--sand); padding:0 20px 90px;}
  .board{max-width:1080px; margin:0 auto;}
  a{color:var(--teal);} a:hover{color:var(--ink-warm);}
  input{font-family:'Karla',sans-serif; color:var(--ink);}
  input:focus{outline:none; border-color:var(--teal);}

  /* ---- chrome ---------------------------------------------------------- */
  .chrome{display:flex; align-items:center; justify-content:space-between; gap:24px; height:64px;}
  .lockup{display:flex; align-items:center; gap:9px;}
  .lockup .tile{width:30px; height:30px; border-radius:7px; background:var(--ink-warm);
    display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;}
  .lockup .word{font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:21px;
    line-height:0.85; letter-spacing:-0.012em; color:var(--gold);}
  /* Ramy, 20 Sep 2026: "Lite" sits on Connect's baseline, close to it; the credit stays on this screen (index, 5, 12). */
  .hub-pair{display:inline-flex;align-items:baseline;gap:4px;}
  .hub-word{font-family:'Instrument Sans','Karla',sans-serif; font-weight:500; font-size:9px;
    letter-spacing:0.24em; text-transform:uppercase; color:var(--ink); line-height:1; margin-left:1px;}
  .chrome .right{display:flex; align-items:center; gap:14px;}

  @keyframes wordmark-spin{0%,11.11%{transform:rotateY(0deg);}100%{transform:rotateY(360deg);}}
  .wordmark-spin{animation:wordmark-spin 90s linear infinite; transform-origin:50% 50%; transform-style:preserve-3d;}
  @media(prefers-reduced-motion:reduce){ .wordmark-spin{animation:none;} }

  /* Every control in this row is the same height; only the fill differs. */
  .btn{display:inline-flex; align-items:center; justify-content:center; height:34px; padding:0 14px;
    font-family:'Karla',sans-serif; font-size:0.82rem; font-weight:600; border-radius:6px;
    border:1.5px solid var(--sand-line); background:var(--box); color:var(--ink);
    text-decoration:none; cursor:pointer; transition:border-color .15s,color .15s;}
  .btn.primary{border-color:var(--teal); background:var(--teal); color:var(--paper); font-weight:700; padding:0 15px;}

  /* ---- queue ----------------------------------------------------------- */
  .queue{display:flex; gap:10px; margin-top:24px; flex-wrap:wrap;}
  .qcard{flex:1 1 200px; min-width:0; text-align:left; font-family:'Karla',sans-serif;
    background:var(--card); border:1px solid var(--sand-line); border-left:5px solid var(--gold); border-radius:10px;
    padding:14px 16px; cursor:pointer;} /* gold edges the card, as everywhere a tutor works */
  .qcard .t{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--grey); margin-bottom:8px;}
  .qcard .n{font-family:'Newsreader',Georgia,serif; font-size:1.6rem; font-weight:600;
    line-height:1; color:var(--ink);}
  .qcard .sub{font-size:0.78rem; font-weight:700; margin-top:8px;}
  .qcard .sub.wait{color:var(--pill-wait-text);}
  .qcard .l{font-size:0.85rem; color:var(--grey); margin-top:5px; text-wrap:pretty;}
  .qcard.stuck{border-color:color-mix(in oklab, var(--brick) 32%, transparent);}
  .qcard.stuck .n{color:var(--tone-stuck);}
  .qcard.wait{border-color:var(--pill-wait-line);}
  .qcard.wait .n{color:var(--pill-wait-text);}
  .qcard.zero{background:none;}
  .qcard.zero .n{color:var(--grey);}
  .qcard.zero{border-color:var(--sand-line);}
  .qcard.zero.stuck{border-color:var(--sand-line);}
  /* the card you are on: the list below is its list */
  .qcard.on{background:var(--paper); border-color:var(--teal); box-shadow:0 1px 2px var(--shade-near, rgba(40,30,15,.06)), 0 6px 16px -10px var(--shade-far, rgba(40,30,15,.25));}
  .qcard.on .t{color:var(--teal);}
  .qcard:not(.on):hover{border-color:var(--sand-line-deep, oklch(78% 0.02 80));}
```

## Appendix C: chrome markup (verbatim)
```html
  <div class="chrome">
    <div class="lockup">
      <span class="tile">
        <svg viewBox="8 30 104 60" width="20" height="12" fill="none" class="wordmark-spin">
          <path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"></path>
          <path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"></path>
        </svg>
      </span>
      <span class="hub-pair"><span class="word">Connect</span><span class="hub-word">Lite</span></span>
    </div>
    <div class="right">
      <input id="tutorName" type="text" placeholder="Your name" title="Signs your marking and your feedback">
      <div class="role">Tutor</div>
    </div>
  </div>
```

## Appendix D: the v2 card CSS (verbatim, the whole block)
```css
  /* ---- the welcome, v2 (7 Oct 2026) -----------------------------------
     Ramy: "I want this to be a bit of a wow card." The setter's first-run
     card only (paintSetup); the joining tutor's card (paintJoin) keeps the
     .welcome rules above. Scoped under .wv2 so nothing else moves. Design:
     Course Setup Welcome v2.dc.html. */
  .wv2{margin:18px 0 0;}
  .wv2-hero{position:relative; overflow:hidden; border-radius:16px; background:var(--teal-deep);
    padding:64px 64px 60px; display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr)); gap:48px 64px; align-items:center;}
  .wv2-bigmark{position:absolute; right:-220px; top:-120px; width:980px; height:auto; opacity:.13; pointer-events:none;
    transform-origin:50% 50%; animation:wv2-drift 18s ease-in-out infinite;}
  .wv2-glow{position:absolute; inset:0; pointer-events:none; background:radial-gradient(120% 90% at 0% 100%, oklch(70% 0.12 72 / .16), transparent 55%);}
  .wv2-intro, .wv2-sheet{position:relative;}
  .wv2-intro{animation:wv2-in .9s cubic-bezier(.2,.7,.2,1) both;}
  .wv2-eyebrow{margin:0 0 22px; font-family:'Instrument Sans','Karla',sans-serif; font-weight:600; font-size:11px;
    letter-spacing:0.26em; text-transform:uppercase; color:oklch(80% 0.1 75);}
  .wv2-h{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:clamp(56px,7vw,96px); line-height:0.98;
    letter-spacing:-0.02em; color:var(--paper); text-wrap:balance;}
  .wv2-kicker{margin:22px 0 0; font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:clamp(26px,2.6vw,34px);
    line-height:1.15; color:oklch(80% 0.11 75);}
  .wv2-lede{margin:16px 0 0; max-width:520px; font-size:17px; line-height:1.6; color:oklch(91% 0.018 190); text-wrap:pretty;}
  /* the sheet of paper, laid on the teal at a slight angle -- on purpose */
  .wv2-sheet{background:var(--paper); border-radius:14px; padding:28px 30px 24px; transform:rotate(-1.4deg);
    box-shadow:0 30px 60px -24px oklch(15% 0.04 195 / .7), 0 2px 4px oklch(15% 0.04 195 / .2);
    animation:wv2-sheet 1.1s cubic-bezier(.2,.7,.2,1) .25s both;}
  .wv2-name{display:block;}
  .wv2-name > span{display:block; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600;
    letter-spacing:0.14em; text-transform:uppercase; color:var(--grey); margin-bottom:6px;}
  .wv2-name input{width:100%; font-family:'Newsreader',Georgia,serif; font-size:24px; font-weight:600; color:var(--ink);
    padding:6px 0 8px; border:0; border-bottom:1.5px solid var(--sand-line); background:transparent; border-radius:0;}
  .wv2-name input:focus{outline:none; border-bottom-color:var(--teal);}
  .wv2-name input::placeholder{color:var(--field-ph);}
  .wv2-name small{display:block; margin-top:7px; font-size:13px; color:var(--grey);}
  .wv2 .wsig{margin-top:22px; background:var(--surface); border:0; box-shadow:none; border-radius:10px; padding:16px 18px 14px;}
  .wv2 .wsig-line{min-height:84px; display:flex; align-items:flex-end;}
  .wv2 .wsig-mark{font-size:3.4rem;}
  .wv2-sigph{display:block; margin-top:22px; padding:16px 18px 14px; border-radius:10px; background:var(--surface);}
  .wv2-sigph[hidden]{display:none;}
  .wv2-sigph i{display:flex; align-items:flex-end; min-height:84px; padding:0 4px 12px; border-bottom:1.5px solid var(--ink-warm);
    font-family:'Instrument Serif',Georgia,serif; font-size:20px; color:var(--field-ph);}

  .wv2-rail{margin-top:20px; background:var(--paper); border:1px solid var(--sand-line); border-radius:16px; padding:28px 36px;
    display:grid; grid-template-columns:auto minmax(0,1fr); grid-template-areas:'count cta' 'rail rail'; gap:28px 40px; align-items:center;}
  .wv2-count{grid-area:count; display:flex; align-items:baseline; gap:8px;}
  .wv2-count b{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:64px; line-height:1; color:var(--teal);}
  .wv2-count span{font-size:15px; color:var(--grey); line-height:1.3;}
  .wv2-cta{grid-area:cta; justify-self:end; display:flex; flex-direction:column; align-items:flex-end; gap:8px;}
  .wv2-cta .btn.primary{height:48px; padding:0 26px; border-radius:999px; font-size:15px; gap:10px;
    box-shadow:0 10px 24px -12px oklch(37.5% 0.058 195 / .8);}
  .wv2-cta .btn.primary:hover{background:var(--teal-lifted); border-color:var(--teal-lifted); color:var(--paper);}
  .wv2-cta small{font-size:13px; color:var(--grey); text-align:right; max-width:260px;}
  .wv2-track{grid-area:rail; position:relative; padding:0 11px 40px;}
  .wv2-track::before, .wv2-fill{content:''; position:absolute; left:11px; top:11px; height:3px; border-radius:3px;}
  .wv2-track::before{right:11px; background:var(--row-line);}
  .wv2-fill{width:0; background:linear-gradient(90deg, var(--teal), var(--gold-lifted)); transition:width 1.4s cubic-bezier(.2,.7,.2,1);}
  .wv2-dots{position:relative; display:flex; justify-content:space-between;}
  .wv2-dot{position:relative; width:24px; height:24px; margin:-1px; border-radius:50%; border:2px solid var(--sand-line);
    background:var(--paper); color:var(--grey); font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center;
    text-decoration:none; transition:background .4s, border-color .4s, transform .2s;}
  .wv2-dot span{position:absolute; top:32px; left:50%; transform:translateX(-50%); width:max-content; max-width:clamp(56px,11vw,130px);
    text-align:center; line-height:1.25; text-wrap:balance; font-family:'Instrument Sans','Karla',sans-serif; font-size:10.5px;
    font-weight:600; letter-spacing:0.04em; color:var(--grey);}
  .wv2-dot.done{background:var(--teal); border-color:var(--teal); color:var(--paper);} .wv2-dot.done span{color:var(--teal-deep);}
  .wv2-dot.next{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm); animation:wv2-pulse 2s ease-out infinite;}
  .wv2-dot.next span{color:var(--gold-deep);}
  .wv2-dot:hover{border-color:var(--teal); color:var(--teal); transform:scale(1.12);}
  .wv2-dot.done:hover{background:var(--teal-lifted); border-color:var(--teal-lifted); color:var(--paper);}
  .wv2-dot.next:hover{background:var(--gold); border-color:var(--gold); color:var(--ink-warm);}
  .wv2-dot:hover span{color:var(--teal);}

  .wv2-how{margin:36px 4px 0; max-width:720px; font-size:15px; line-height:1.6; color:var(--ink-warm); text-wrap:pretty;}
  .wv2-ghead{margin-top:28px; display:flex; align-items:baseline; gap:14px; padding:0 4px 10px; border-bottom:1px solid var(--sand-line);}
  .wv2-ghead b{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:20px;}
  .wv2-ghead span{font-size:13px; color:var(--grey);}
  .wv2-ghead + .wv2-grid + .wv2-ghead{margin-top:36px;}
  .wv2-grid{margin-top:16px; display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px;}
  .wv2-grid.pages{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));}
  .wv2-card{display:flex; flex-direction:column; gap:10px; min-height:220px; padding:22px 22px 18px; border-radius:12px;
    background:var(--surface); border:1px solid var(--sand-line); color:var(--ink); text-decoration:none;
    transition:transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s; animation:wv2-in .5s cubic-bezier(.2,.7,.2,1) both;}
  .wv2-grid.pages .wv2-card{min-height:200px;}
  .wv2-card:hover{transform:translateY(-3px); color:var(--ink); border-color:var(--sand-line-deep, oklch(78% 0.02 80));
    box-shadow:0 14px 28px -18px var(--shade-far, rgba(40,30,15,.35));}
  .wv2-card:hover .door{text-decoration:underline; text-underline-offset:3px;}
  .wv2-card.done:hover{border-color:var(--teal);}
  .wv2-card.next:hover{border-color:var(--gold-deep); box-shadow:0 22px 40px -18px oklch(52% 0.098 70 / .65);}
  .wv2-card:focus-visible, .wv2-dot:focus-visible, .wv2-cta .btn.primary:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:3px;}
  .wv2-card .top{display:flex; align-items:center; justify-content:space-between;}
  .wv2-card .num{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:44px; line-height:1; color:oklch(70% 0.02 75);}
  .wv2-card .tag{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em;
    text-transform:uppercase; padding:5px 10px; border-radius:999px; background:var(--box); color:var(--ink-warm);}
  .wv2-card b{font-size:17px; font-weight:700;}
  .wv2-card p{margin:0; font-size:14px; line-height:1.55; color:var(--grey); text-wrap:pretty;}
  .wv2-card .door{margin-top:auto; font-size:13px; font-weight:700; color:var(--teal);}
  .wv2-card.done{background:var(--paper); border-color:oklch(78% 0.04 195);}
  .wv2-card.done .num{color:var(--teal);} .wv2-card.done b{color:var(--teal-deep);} .wv2-card.done p{color:var(--ink-warm);}
  .wv2-card.done .tag{background:var(--teal); color:var(--paper);}
  .wv2-card.next{background:var(--gold-wash); border:2px solid var(--gold); box-shadow:0 18px 36px -18px oklch(52% 0.098 70 / .55);}
  .wv2-card.next .num{color:var(--gold-deep);} .wv2-card.next .tag{background:var(--gold-lifted);}

  .wv2-future{margin-top:48px; border-radius:16px; border:1.5px dashed var(--sand-line); padding:28px 32px 30px;}
  .wv2-future .fhead{display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;}
  .wv2-future .fhead i{font-family:'Instrument Serif',Georgia,serif; font-size:28px; color:var(--gold-deep);}
  .wv2-future .fhead span{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.16em;
    text-transform:uppercase; color:var(--grey);}
  /* the dashboard it turns into, out of focus; sharper with every step done */
  .wv2-future .queue{margin-top:18px; pointer-events:none; transition:opacity 1s, filter 1s;}
  .wv2-future .qcard{cursor:default;}

  @keyframes wv2-in{from{opacity:0; transform:translateY(24px);}to{opacity:1; transform:none;}}
  @keyframes wv2-sheet{from{opacity:0; transform:translateY(40px) rotate(-1.4deg);}to{opacity:1; transform:rotate(-1.4deg);}}
  @keyframes wv2-drift{0%,100%{transform:rotate(-8deg) scale(1);}50%{transform:rotate(-4deg) scale(1.04);}}
  @keyframes wv2-pulse{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .55);}70%{box-shadow:0 0 0 14px oklch(70% 0.12 72 / 0);}100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .wv2 *, .wv2-dot{animation:none !important; transition:none !important;} }
  @media(max-width:560px){
    .wv2-hero{padding:36px 22px 32px; border-radius:12px;} .wv2-bigmark{width:560px; right:-200px; top:-60px;}
    .wv2-rail{padding:22px 18px; grid-template-areas:'count' 'cta' 'rail'; grid-template-columns:1fr;} .wv2-cta{justify-self:start; align-items:flex-start;}
    .wv2-dot span{display:none;} .wv2-dot.next span{display:block;} .wv2-track{padding-bottom:30px;}
    .wv2-future{padding:20px 18px;}
  }
```

## Appendix E: signature rules the v2 block overrides (verbatim v1)
```css
  /* The signature as a signing line (8 Oct 2026: "make those two boxes look
     better"): the hand large on a rule, the name and role under it, the
     note last and quiet. */
  .wsig{display:block; margin-top:16px; padding:18px 22px 14px; background:#fff; border:1px solid var(--sand-line); border-radius:12px; box-shadow:0 1px 2px rgba(40,30,10,0.05);}
  .wsig[hidden]{display:none !important;}
  .wsig-line{display:block; border-bottom:1.5px solid var(--ink-warm); padding:0 4px 4px; min-height:54px;}
  .wsig-mark{display:inline-block; font-size:2.4rem; line-height:1.15; color:var(--ink); max-width:100%; overflow:hidden; white-space:nowrap;}
  .wsig-who{display:block; margin-top:8px; font-family:'Instrument Sans','Karla',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink-warm);}
  .wsig-who span{color:var(--grey); font-weight:600;}
  .wsig-note{display:block; margin-top:6px; font-size:0.76rem; color:var(--grey); line-height:1.45;}
  .wsig.head{display:inline-flex; align-items:center; margin:0 0 0 8px; padding:2px 10px; box-shadow:none; border-radius:8px;}
  .wsig.head .wsig-line{border:none; min-height:0; padding:0;} .wsig.head .wsig-who, .wsig.head .wsig-note{display:none;} .wsig.head .wsig-mark{font-size:1.15rem;}
```

## Appendix F: v1 welcome rules, kept for the join card (verbatim)
```css
  /* ---- the welcome: a course with nobody on it yet ----------------------
     Ramy, 6 Oct 2026, opening a fresh course as its admin: "there should be a
     separate page that you just land on. There's no course noticeboard,
     there's no From the course... only welcome, please type your name, and
     then let's start -- walking someone through it step by step... I want
     this to be a window into this futuristic course that is so easy to use."
     Same address, so the link they were sent is the link they keep; a
     different screen while the course has no trainees. Everything that talks
     to a course with people on it is off until then. */
  body.firstrun .title, body.firstrun .titleacts, body.firstrun #onlineRooms, body.firstrun #stream,
  body.firstrun #shelf, body.firstrun #installHint, body.firstrun #queue, body.firstrun #comingLine,
  body.firstrun .chrome .right input{display:none !important;}
  .welcome{background:var(--surface); border-radius:var(--r-card); border-top:3px solid var(--teal);
    padding:26px 28px 24px; max-width:640px; margin:22px auto 0;}
  .welcome .eyebrow{font-family:'Instrument Sans','Karla',sans-serif; font-weight:600; font-size:10px;
    letter-spacing:0.22em; text-transform:uppercase; color:var(--grey); margin:0 0 6px;}
  .welcome h2{margin:0 0 8px; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.7rem; line-height:1.15; color:var(--teal);}
  .welcome .lede{margin:0; font-size:0.92rem; color:var(--ink); line-height:1.6; text-wrap:pretty;}
  .wname{display:block; margin:20px 0 24px; max-width:460px;}
  .wname > span:not(.wsig){display:block; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; color:var(--grey); margin-bottom:5px;}
  .wname input{width:100%; box-sizing:border-box; font-family:'Karla',sans-serif; font-size:1rem; padding:10px 12px;
    border:1.5px solid var(--sand-line); border-radius:var(--r-control); background:var(--field); color:var(--ink);}
  .wname input:focus{outline:none; border-color:var(--teal); background:#fff; box-shadow:0 0 0 3px rgba(31,111,107,0.12);}
  .wname small{display:block; margin-top:5px; font-size:0.78rem; color:var(--grey);}
  .welcome.join{margin-bottom:22px;}
  body.joining .chrome .right input{display:none !important;}
  .welcome.join .wgo{display:flex; gap:16px; align-items:center; flex-wrap:wrap;}
  .welcome .linkbtn{background:none; border:none; padding:0; font:inherit; font-size:0.85rem; font-weight:600; color:var(--teal); cursor:pointer; text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px;}
  .welcome .linkbtn:hover{text-decoration-color:var(--teal);}
  /* The signature as a signing line (8 Oct 2026: "make those two boxes look
     better"): the hand large on a rule, the name and role under it, the
     note last and quiet. */
  .wsig{display:block; margin-top:16px; padding:18px 22px 14px; background:#fff; border:1px solid var(--sand-line); border-radius:12px; box-shadow:0 1px 2px rgba(40,30,10,0.05);}
  .wsig[hidden]{display:none !important;}
  .wsig-line{display:block; border-bottom:1.5px solid var(--ink-warm); padding:0 4px 4px; min-height:54px;}
  .wsig-mark{display:inline-block; font-size:2.4rem; line-height:1.15; color:var(--ink); max-width:100%; overflow:hidden; white-space:nowrap;}
  .wsig-who{display:block; margin-top:8px; font-family:'Instrument Sans','Karla',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink-warm);}
  .wsig-who span{color:var(--grey); font-weight:600;}
  .wsig-note{display:block; margin-top:6px; font-size:0.76rem; color:var(--grey); line-height:1.45;}
  .wsig.head{display:inline-flex; align-items:center; margin:0 0 0 8px; padding:2px 10px; box-shadow:none; border-radius:8px;}
  .wsig.head .wsig-line{border:none; min-height:0; padding:0;} .wsig.head .wsig-who, .wsig.head .wsig-note{display:none;} .wsig.head .wsig-mark{font-size:1.15rem;}
```

## Appendix G: logic (verbatim, in call order)
```js
function paint(){
  const s = setupState();
  if (!s.ready && isSetter(s)) { try { localStorage.setItem('chub:setsUp', '1'); } catch (e) {} paintSetup(s); return; }
  if (!isSetter(s)) { try { localStorage.setItem('chub:joined', '1'); } catch (e) {} }
  paintJoin(s);
  document.body.classList.remove('firstrun');
  document.getElementById('queue').style.display = '';
  document.querySelector('.titleacts').style.display = '';
  paintTodo(s);
  paintQueue(); paintTabsCounts(); paintRows();
}


function isSetter(s){
  const ls = k => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } };
  if (ls('chub:setsUp') === '1') return true;
  if (ls('chub:joined') === '1') return false;
  return !s.named || !!ls('chub:tutorName');
}

function setupState(){
  const rd = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const cs = rd('connect_course_settings') || {};
  const tt = rd('connect_timetable_v1'), pts = rd('connect_tp_points_v1'), reg = rd('connect_volunteers_v1');
  const ppl = people();
  const named = !!cs.courseName, dated = !!(cs.start && cs.end);
  const tutors = String(cs.tutorNames || '').split(',').map(x => x.trim()).filter(Boolean);
  /* the set library is `set.library`; a single set written before the
     library existed is `set.sessions` and counts as one (24_tp_points.html) */
  const setLib = pts && pts.set ? ((pts.set.library && Object.keys(pts.set.library).length) || (pts.set.sessions ? 1 : 0)) : 0;
  const built = !!(pts && pts.groups && Object.keys(pts.groups).some(g => Object.keys(pts.groups[g] || {}).length));
  return {
    cs, named, dated,
    trainees: ppl.length, groups: [...new Set(ppl.map(t => t.group).filter(Boolean))],
    days: (tt && Array.isArray(tt.days)) ? tt.days.length : 0, published: !!(tt && tt.published),
    rooms: Array.isArray(cs.onlineRooms) ? cs.onlineRooms.filter(r => r && r.url).length : 0,
    tutors, setLib, built,
    volunteers: (reg && Array.isArray(reg.students)) ? reg.students.length : 0,
    agreement: !!((cs.agreement && Object.keys(cs.agreement).length) || (cs.docs && cs.docs.docAgreement)),
    logo: !!cs.logo,
    /* THE TRAINEES ARE THE HINGE, and nothing else. It used to be "named and
       trainees"; c1, the scratch course, has six trainees, a timetable and a
       register and has never had a course name, so the dashboard greeted
       Ramy with the welcome on a running course (6 Oct 2026). A roster is a
       course whatever it is called; a missing name is one line on the
       still-to-do strip. */
    ready: ppl.length > 0
  };
}

function setupSteps(s){
  /* SEVEN STEPS, ONE DOOR EACH (five until 8 Oct 2026), matching what is built (Ramy, 8 Oct 2026:
     "those seven things should be seven tabs... if you combine them then
     it'd be five"). Settings and Roster and links are Course admin's tabs;
     the timetable, the TP points and the volunteer register are pages of
     their own. The agreement and the tutors live on Settings and are named
     inside that step rather than as steps of their own. */
  const n = (k, one, many) => k + ' ' + (k === 1 ? one : many);
  const span = (a, b) => { try { const f = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }); return f(a) + ' – ' + f(b) + ' ' + String(b).slice(0, 4); } catch (e) { return a + ' – ' + b; } };
  const settingsLine = () => {
    if (!(s.named && s.dated)) return 'The centre and the course, the dates, the candidate agreement, the tutors. The dates also decide when the assessor’s link stops working.';
    const bits = [esc(s.cs.courseName) + ' · ' + esc(span(s.cs.start, s.cs.end))];
    bits.push(s.agreement ? 'agreement written' : 'no agreement yet');
    bits.push(s.tutors.length ? n(s.tutors.length, 'tutor', 'tutors') + ' named' : 'no tutors named yet');
    if (s.logo) bits.push('your logo on every printed record');
    return bits.join(' · ');
  };
  return [
    { done: s.named && s.dated, short: 'Settings', title: 'Settings', href: '6_centre_admin_dashboard.html#settings', line: settingsLine() },
    { done: s.trainees > 0, short: 'Roster and links', title: 'Roster and links', href: '6_centre_admin_dashboard.html#roster',
      line: s.trainees ? n(s.trainees, 'trainee', 'trainees') + ' on the course' + (s.groups.length ? ' in ' + n(s.groups.length, 'group', 'groups') : '') + ', each with a personal link to be sent to them'
            : 'Paste the class list in one go. Each one gets a personal link — no accounts, no passwords.' },
    /* Assignments and Observations are Course admin's other two tabs. They
       come ready -- Connect's briefs and sheets -- so they are ticked from the
       start, and each still opens its tab to change the wording (Ramy, 8 Oct
       2026: the card named two of the four tabs). */
    { done: true, ready: true, short: 'Assignments', title: 'Assignments', href: '6_centre_admin_dashboard.html#assignments',
      line: 'Connect\u2019s four Cambridge assignments, briefs and criteria, ready as they are. Rewrite any of them, or choose when the trainees see each one.' },
    { done: true, ready: true, short: 'Observations', title: 'Observations', href: '6_centre_admin_dashboard.html#observations',
      line: 'Connect\u2019s fifteen observation sheets, ready as they are. Change the wording on any of them if you want to.' },
    { done: s.published, short: 'Timetable', title: 'The timetable', href: '23_timetable.html',
      line: s.published ? n(s.days, 'day', 'days') + ' laid out' + (s.rooms ? ', ' + n(s.rooms, 'online room', 'online rooms') + ' on them' : '') + ' — the course can see it'
            : s.days ? n(s.days, 'day', 'days') + ' drafted — not yet set for the course to see'
            : 'The spreadsheet you already have, read once. Or built here, day by day.' },
    { done: s.built, short: 'TP points', title: 'TP points', href: '24_tp_points.html',
      line: s.built ? 'Every practice staged and timed, for every trainee' + (s.setLib ? ', from ' + n(s.setLib, 'set', 'sets') : '')
            : s.setLib ? n(s.setLib, 'set', 'sets') + ' on the course — the rotation is not built yet'
            : 'Take a set from the library, or write your own; the rotation does the rest.' },
    { done: s.volunteers > 0, short: 'Volunteer students', title: 'The volunteer students', href: '25_volunteer_register.html',
      line: s.volunteers ? n(s.volunteers, 'student', 'students') + ' on the register, each with their own page'
            : 'The people who come in to be taught. Their register, their reminders, their certificates.' }
  ];
}

function drawSig(host, name){
  if (!host) return;
  const n = String(name || '').trim(), spec = n && window.hubInk && hubInk.mine ? hubInk.mine(n) : '';
  if (!spec || !window.hubHand) { host.innerHTML = ''; host.hidden = true; return; }
  host.hidden = false;
  host.innerHTML = '<span class="wsig-line"><span class="wsig-mark">' + hubHand.html(spec, n) + '</span></span>'
    + '<span class="wsig-who">' + esc(n) + ' <span>\u00b7 Tutor</span></span>'
    + '<span class="wsig-note">Your signature, written from your name: the one on the CELTA 5 and everything you sign here.</span>';
  try { localStorage.setItem('chub:tutorSigKept', n); } catch (e) {}
}

function paintSetup(s){
  document.body.classList.add('firstrun');
  const steps = setupSteps(s), done = steps.filter(x => x.done).length;
  /* NO GREETING, and the field starts empty on a course nobody has named
     yet (Ramy, 6 Oct 2026) -- unchanged from v1. */
  const stored = localStorage.getItem('chub:tutorName') || '';
  const name = s.named ? stored : '';
  const nextIdx = steps.findIndex(x => !x.done), next = steps[nextIdx];
  /* "Start" until the centre has done one of its own -- the two that come
     ready do not count (v1 tested done === 0, which two ready steps made
     unreachable). */
  const begun = steps.some(x => x.done && !x.ready);
  /* the rail fills to the furthest step done in an unbroken run from 1 */
  let reach = 0; for (let i = 0; i < steps.length && steps[i].done; i++) reach = i;
  const fill = steps[0].done ? reach / (steps.length - 1) : 0;
  const MARK = (cls, w, sw) => '<svg class="' + cls + '" viewBox="8 30 104 60" width="' + w + '" fill="none" aria-hidden="true">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="' + sw + '" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="' + sw + '" stroke-linecap="round"></path></svg>';
  const state = (st, i) => st.done ? 'done' : i === nextIdx ? 'next' : '';
  const card = (st, i) => '<a class="wv2-card ' + state(st, i) + '" href="' + st.href + '" style="animation-delay:' + (0.35 + i * 0.07).toFixed(2) + 's">'
    + '<span class="top"><span class="num">' + (i + 1) + '</span><span class="tag">'
    + (st.done ? (st.ready ? 'Ready \u2713' : 'Done \u2713') : i === nextIdx ? 'Next' : 'To do') + '</span></span>'
    + '<b>' + st.title + '</b><p>' + st.line + '</p>'
    + '<span class="door">' + (st.done ? 'Open to change \u2192' : 'Open \u2192') + '</span></a>';
  const ghost = (t, l) => '<div class="qcard"><div class="t">' + t + '</div><div class="n">0</div><div class="l">' + l + '</div></div>';
  document.getElementById('rows').innerHTML =
    '<section class="wv2">' +
      '<div class="wv2-hero">' + MARK('wv2-bigmark', 980, 9) + '<div class="wv2-glow"></div>' +
        '<div class="wv2-intro">' +
          '<p class="wv2-eyebrow">' + esc(s.cs.centreName || 'Connect Lite') + '</p>' +
          '<h2 class="wv2-h">' + (s.named ? 'Welcome to ' + esc(s.cs.courseName) : 'Welcome.') + '</h2>' +
          '<p class="wv2-kicker">This is your course\u2019s home page.</p>' +
          '<p class="wv2-lede">For now it sets the course up. The moment the trainees are on it, it becomes your working list: the teaching practices waiting for your feedback, the assignments waiting to be marked, what is due today.</p>' +
        '</div>' +
        '<div class="wv2-sheet">' +
          '<label class="wv2-name"><span>Your name</span><input id="welcomeName" type="text" value="' + esc(name) + '" placeholder="As it will sign your feedback" autocomplete="name"><small>Typed once. It signs your posts, your feedback and your marking.</small></label>' +
          '<span class="wsig" id="welcomeSig"></span>' +
          '<span class="wv2-sigph" id="welcomeSigPh"><i>Your signature appears here as you type</i></span>' +
        '</div>' +
      '</div>' +
      '<div class="wv2-rail">' +
        '<div class="wv2-count"><b>' + done + '</b><span>of ' + steps.length + '<br>done</span></div>' +
        '<div class="wv2-cta">' +
          (next ? '<a class="btn primary" href="' + next.href + '">' + (begun ? 'Next: ' + next.short.charAt(0).toLowerCase() + next.short.slice(1) : 'Start setting up the course') + ' <span aria-hidden="true">\u2192</span></a>' : '') +
          '<small>' + (next ? 'Each step opens where it is done.' : 'All seven done \u2014 add the trainees and this page becomes your working list.') + '</small>' +
        '</div>' +
        '<div class="wv2-track"><span class="wv2-fill" id="wv2Fill"></span><div class="wv2-dots">' +
          steps.map((st, i) => '<a class="wv2-dot ' + state(st, i) + '" href="' + st.href + '" title="' + esc(st.title) + '">' + (i + 1) + '<span>' + st.short + '</span></a>').join('') +
        '</div></div>' +
      '</div>' +
      '<p class="wv2-how">Seven things set it up: Course admin\u2019s four tabs, then three pages of their own. Two come ready. Each ticks itself off here when it is done, each opens where it is done, and the button above goes to the next one.</p>' +
      '<div class="wv2-ghead"><b>Course admin</b><span>four tabs</span></div>' +
      '<div class="wv2-grid">' + steps.slice(0, 4).map((st, i) => card(st, i)).join('') + '</div>' +
      '<div class="wv2-ghead"><b>Three pages of their own</b></div>' +
      '<div class="wv2-grid pages">' + steps.slice(4).map((st, i) => card(st, i + 4)).join('') + '</div>' +
      '<section class="wv2-future"><div class="fhead"><i>What this page becomes</i><span>Comes into focus as you set up</span></div>' +
        '<div class="queue" style="opacity:' + (0.35 + 0.35 * done / steps.length).toFixed(2) + ';filter:blur(' + (3 - 2.5 * done / steps.length).toFixed(1) + 'px)">' +
          ghost('Teaching practice', 'lessons ready for your feedback') + ghost('Assignments', 'waiting to be marked') + ghost('Trainees', 'on the course') +
        '</div></section>' +
    '</section>';
  /* the rail fills after the first frame, so it draws rather than appears */
  requestAnimationFrame(() => requestAnimationFrame(() => { const el = document.getElementById('wv2Fill'); if (el) el.style.width = 'calc((100% - 22px) * ' + fill.toFixed(3) + ')'; }));
  /* one name, two fields: the welcome's is the one on screen now, the header's
     is what every other screen reads */
  const w = document.getElementById('welcomeName');
  const sig = document.getElementById('welcomeSig'), ph = document.getElementById('welcomeSigPh');
  const draw = v => { drawSig(sig, v); ph.hidden = !sig.hidden; };
  w.addEventListener('input', () => { nameInput.value = w.value; localStorage.setItem('chub:tutorName', w.value); draw(w.value); });
  draw(w.value);
  if (!name) setTimeout(() => { try { w.focus({ preventScroll: true }); } catch (e) {} }, 60);
}
```
