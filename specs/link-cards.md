# The link cards: complete build spec

Design: `Link Cards.dc.html`, 1a (the welcome family) and 1b (the ticket). Both are specified here in full.
**Ramy picks one before build. Build only the chosen direction.** Shared rules come first, then each direction's cards.
Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Contact address on every card that carries one: **lite@celtaconnect.com**. This is also the envelope `sendCard` sends from, once it is a verified send-as (`store/2026-10-02-send-card.md`).

---

## 0. What exists and what each card replaces

| Card | Today | Builds into |
|---|---|---|
| Trainee invitation | `invite.html?t=` | `invite.html`, ROLE `trainee` |
| Tutor invitation | `invite.html?k=` | `invite.html`, ROLE `tutor` |
| Assessor invitation | `invite.html?ak=` | `invite.html`, ROLE `assessor` |
| Volunteer invitation | **none**: the volunteer link opens `26_volunteer.html` bare | `invite.html`, new ROLE `volunteer`, on the volunteer page's own link parameter. Claude Code: read the param `25_volunteer_register.html`'s "Copy their link" builds, and route it the same way. |
| Offer card (web) | `offer.html` | `offer.html`, the front of the card |
| Offer card (email) | `hub-card-mail.js` (`hubCardMail(ctx)`) | same file. Email constraints in §4. |
| Console course card | `14_owner.html`, the per-course links panel | `14_owner.html` |

**Logic that doesn't change:**
- Role from the URL alone, never the store.
- `DEST` per role.
- `paint()` fills course, centre, dates and name when known, and hides empty rows.
- `hub:ready`, plus the 700ms × 20 re-paint.
- Print / Save as PDF.
- The `sendCard` op.
- The console's Copy and Email actions.

**Tightened wording.** Ramy asked for it and is checking it. It's below, verbatim per role. Use it in place of the current `COPY` strings.

## 1. Shared tokens and type

**Fonts.** Already loaded on these pages: Newsreader 600/700, Karla 400–700, Instrument Serif italic, Instrument Sans 500–700.

| Token | Value | Use |
|---|---|---|
| `--teal-deep` | `oklch(31% 0.055 195)` | 1a panel; 1b course name, button |
| `--teal` | `oklch(37.5% 0.058 195)` | buttons, links, the tutor tone |
| `--teal-lifted` | `oklch(44% 0.062 195)` | hover, the volunteer tone |
| `--gold` | `oklch(63% 0.096 72)` | the trainee tone, the offer edge |
| `--gold-lifted` | `oklch(70% 0.12 72)` | the mark's left C |
| `--gold-deep` | `oklch(52% 0.098 70)` | the seal, eyebrows on paper |
| `--gold-wash` | `oklch(94.5% 0.035 78)` | the seal fill, the price box (1a) |
| `--amber-edge` | `oklch(84% 0.08 78)` | price box border |
| `--paper` | `oklch(99.5% 0.004 90)` | sheets |
| `--surface` | `oklch(95.2% 0.018 84)` | 1b stub, console rows |
| `--sand` | `oklch(98.8% 0.006 85)` | page ground |
| `--sand-line` | `oklch(85.5% 0.02 80)` | rules, perforation |
| `--ink` | `oklch(23.5% 0.017 65)` | body |
| `--ink-warm` | `oklch(30% 0.042 58)` | emphasis, the assessor tone |
| `--grey` | `oklch(51% 0.017 70)` | secondary |

**Literals on teal** (1a), all ≥ 4.5:1:

| Literal | Use |
|---|---|
| `oklch(80% 0.1 75)` | eyebrow, role chip |
| `oklch(80% 0.11 75)` | the "For …" line |
| `oklch(91% 0.018 190)` | meta |

**The mark** is two arcs, `viewBox="8 30 104 60"`:
- `M56.1 42.2 A 24 24 0 1 0 56.1 77.8` (left C)
- `M96.1 42.2 A 24 24 0 1 0 96.1 77.8` (right C)
- Round caps.

**Wordmark:** "Connect" in Instrument Serif italic 21px, plus "Lite" in Instrument Sans 500 9px, ls .24em, uppercase.

**Credit line:** "designed and built by **Ramy**", 11px, `oklch(50% 0.09 62)`.

**Layout:**
- Card max-width 460px, full width under that. Page padding: 6vh top, 18px sides (unchanged).
- At ≤420px: panel and sheet side padding drops to 20px, and type steps down one size (course name 32 → 26, the "For" line 26 → 22, the 1b admit line 30 → 24).

**Reduced motion:** all animation off.

**Print:** keep today's rule. Plain page, no colour panel, no shadows; the button becomes a 2px teal outline; no print button. For 1a, the teal panel prints as paper with teal type. For 1b, the stub prints without fill, and the seal prints as an outline.

## 2. The wording (tightened, verbatim)

| Role | eyebrow | role chip (1a) | for line (1a) / admit (1b) | seal (1b) |
|---|---|---|---|---|
| trainee | Course invitation | Trainee | For {name} / {name} | Yours alone |
| tutor | Tutor access | Tutors | For the teaching team / The teaching team | Tutors only |
| assessor | Assessor access | Assessor | For the Cambridge assessor / The Cambridge assessor | Read only |
| volunteer | Free English classes | Volunteer | For {name} / {name} | Free classes |

**what:**
- **trainee:** "Your own space on the course: your lesson plans and language analysis, your self-evaluations, the feedback your tutors return, and your written assignments."
- **tutor:** "The course as the tutors see it: every trainee’s plans and self-evaluations, the feedback sheets, the assignment marking and the tracker."
- **assessor:** "The assessment pack: each trainee’s teaching practice record, their grades and their written assignments, in one place."
- **volunteer:** "Your page for the classes: the next one to come to, which days you came, and your certificate at the end."

**keep** (the bold lead, then the rest):
- **trainee:** **This link is yours alone.** Whoever opens it is you, and can read your feedback and submit work in your name. Keep it to yourself and your own devices.
- **tutor:** **Every tutor opens this same link.** Keep it to the teaching team. If it gets out, course admin can change it, and every old copy stops working.
- **assessor:** **Read-only, and yours for this assessment.** Nothing you do here changes the record. The link works to the end of the last day of the course.
- **volunteer:** **This link is just for you.** Open it on your phone before each class.

**Volunteer language line.** "Also in Türkçe · العربية · Русский · فارسی · Українська". Build it from `hubVolunteerI18n.languages` natives. Tapping a language re-renders `what` / `keep` / `go` from that file's strings; add them there, `invite*` keys, and mark them as unreviewed translations like the existing ones.

**go:**

| Role | Button |
|---|---|
| trainee | Open my workspace |
| tutor | Open the course |
| assessor | Open the assessment pack |
| volunteer | Open my page |

**Fallbacks:**
- A trainee or volunteer with no known name hides the line, as today.
- The volunteer's course and meta read "English with the CELTA trainees" and "{centreName} · {class days and times from the timetable}". Without a timetable: just the centre.

---

## 3. Direction 1a: the welcome family

### 3.1 Invitation card (all four roles)

**Card.**
- radius 18, overflow hidden, `--paper`
- shadow `0 24px 48px -28px oklch(25% 0.04 195 / .45)`
- hover: translateY(−4px), shadow `0 32px 56px -26px … / .55`, .3s `cubic-bezier(.2,.7,.2,1)`

**Entrance (not in the design file).** `lc-in`: opacity 0 → 1 and translateY 18px → 0, .6s, on load.

**Panel.**
- `--teal-deep`, padding 26/30/30, colour `--paper`, position relative, overflow hidden.
- **Big mark:** an SVG 460px wide, absolutely positioned at right −150, top −70, opacity .13. Strokes: left C `--gold-lifted`, right C `--paper`, width 9. Animated with `lc-drift` (18s ease-in-out infinite: rotate −8° → −4°, scale 1 → 1.04).
- **Glow:** absolute, inset 0, `radial-gradient(120% 90% at 0% 100%, oklch(70% 0.12 72 / .16), transparent 55%)`.

**Panel content, top to bottom:**

| Element | Spec |
|---|---|
| top row | flex, space-between, margin-bottom 26 |
| wordmark | "Connect" in `--gold-lifted`, "Lite" in `--paper` |
| role chip | Instrument Sans 700 10px, ls .16em, uppercase; padding 5/11; radius 999; 1px `oklch(80% 0.1 75 / .6)` border; text `oklch(80% 0.1 75)` |
| eyebrow | Instrument Sans 600 11px, ls .24em, uppercase, `oklch(80% 0.1 75)`, mb 6 |
| course name | Newsreader 700 32px, lh 1.08, balanced wrap. Falls back to "Your CELTA course". |
| meta | 13.5px `oklch(91% 0.018 190)`, mt 8. Hidden if empty. |
| for line | Instrument Serif italic 26px, lh 1.1, `oklch(80% 0.11 75)`, mt 20. Hidden if empty. |

**Sheet.** Padding 22/30/24.

| Element | Spec |
|---|---|
| what | 14.5px, lh 1.65, `--ink`, pretty wrap |
| keep | mt 16, pt 12, 1px `--sand-line` top border; 13px, lh 1.6, `--grey`; bold lead in `--ink-warm` |
| languages (volunteer) | 12.5px `--grey`, mt 10. Each language is a button (see §2). |
| button | mt 20; flex centred, gap 10; height 50; radius 999; `--teal` fill; `--paper` text, Karla 700 15.5px; shadow `0 10px 24px -12px oklch(37.5% 0.058 195 / .8)`; text is "{go} →". Hover `--teal-lifted`; focus-visible 2px `--gold-lifted` outline, offset 3. |
| foot | flex, space-between, mt 16: the credit, and "Print / Save as PDF" (11px `--grey`, the existing `#printBtn`) |

### 3.2 Offer card (web: `offer.html` front)

**Card and panel.** Same card as 3.1. The panel has padding 26/30/30 and the same mark and glow. The role chip reads "For a centre".

| Element | Spec |
|---|---|
| headline | Newsreader 700 30px, lh 1.1, balanced wrap: "Everything your trainees write, and everything you write back" |
| sub | 14px, lh 1.6, `oklch(91% 0.018 190)`, mt 12: "A CELTA course's assessed paperwork in one place. No accounts, no passwords, nothing to install. A course is three links." |

**Sheet.** Padding 20/30/24.

**"See it working"** (Newsreader 600 17px `--ink-warm`), then the note at 13px `--grey`: "Real courses. Open one as a tutor, a trainee, the assessor or a volunteer, and type in it."

**Doors.** One row per demo course from `ctx.doors`, plus the film when `ctx.film` is set.
- Row: flex, gap 14, padding 12/0, 1px `--sand-line` top border.
- Label: 14px 700 `--ink-warm`. Note: 12.5px `--grey`.
- Pill button: Karla 700 13px `--teal`, 1.5px `--teal` border, radius 999, padding 6/14. Hover: fill `--teal`, text `--paper`. Text is "Open", or "Watch" for the film.

**Pricing box. No figure** (Ramy, 7 Oct 2026: no price on the cards; there are packages, and the rates come by email).
- mt 16, padding 16/18, radius 12, `--gold-wash` fill, 1px `--amber-edge` border.
- Head: "Priced per course, not per trainee", Newsreader 700 20px `--ink-warm`.
- A list (13px, lh 1.6, `--ink`, padding-left 18):
  - "Packages from one course to twenty: the more you take, the less each costs."
  - "Duplicate a finished course and run it again."
  - "Up to 24 trainees, all their tutors and your course admin. Volunteer students and the assessor are never counted."
- **`ctx.price` is no longer shown on this card**, and `showPrice` is retired. The figure lives only in `priceDoc` (§5), sent when someone asks.

**Sign-off.**
- "Ramy" in Instrument Serif italic 24px `--ink-warm`, mt 18.
- **Contact line:** 13.5px `--ink`, mt 6: "For the rates and demo links: **lite@celtaconnect.com**". It's a `mailto:` link, 700, `--teal`.
- Credit: "designed and built by **Ramy** · celtaconnect.com".

### 3.3 Console course card (`14_owner.html`)

**Card.** As 3.1, without the entrance animation.

**Panel.**
- `--teal-deep`, padding 22/26/24.
- Mark 340px wide at right −110, top −50, opacity .13, static.
- Eyebrow "In your console": 10.5px, ls .22em, `oklch(80% 0.1 75)`.
- Course: "{course id} · {made date}", Newsreader 700 28px.
- Meta: "{centre} · {n} trainees" (or "· 0 trainees yet"), 13.5px `oklch(91% 0.018 190)`.

**Body.** Padding 16/18/18; a grid with gap 10.

**Link rows.** Four, in this order:

| Abbrev | Title | Note |
|---|---|---|
| T | Tutor link | "Send it to the centre. Their tutors and course admin all use it." |
| A | Assessor link | "Read-only, for the visit. The centre can find and change it too." |
| V | Volunteer link | "One student’s own page: the next class, their days, their certificate." |
| £ | Send this course | "The offer card: what Lite is, how it’s priced, three ways in." |

**Each row.**
- Flex, gap 14, padding 12/14, radius 12, `--surface` fill, 1px `--sand-line` border.
- Hover: translateX 3px (.2s).
- Badge: a 36px tile, radius 10, `--teal-deep`, Newsreader 700 13px `oklch(80% 0.11 75)`.
- Title: 13.5px 700. Note: 12px, lh 1.45, `--grey`.
- Button: "Copy", Karla 700 12.5px, padding 7/14, radius 999, 1.5px `--teal` border, `--teal` text, min-width 78.

**Copied state** (1.8s after a successful clipboard write):
- Button fills `--teal`, reads "Copied ✓", text `--paper`.
- Row gets `--gold-wash` fill and `--amber-edge` border.

**Keep from today:**
- The "Send this course" row keeps its "Email it" and "See the card" links, under the note.
- Delete and "Start the next course from this" stay in the card's top row, as today.
- The chips (candidates, materials, made date) move into the panel meta line.

---

## 4. Direction 1b: the ticket

### 4.1 Invitation card (all four roles)

**Wrapper.**
- `filter: drop-shadow(0 18px 26px oklch(30% 0.04 60 / .18))`
- hover: translateY(−4px) rotate(−.4deg), .3s `cubic-bezier(.2,.7,.2,1)`

**Top (the ticket face).** `--paper`, radius 16 16 0 0, padding 24/28/22, and a **6px top border in the role tone**:

| Role | Tone |
|---|---|
| trainee | `--gold` |
| tutor | `--teal` |
| assessor | `--ink-warm` |
| volunteer | `--teal-lifted` |

Face content, top to bottom:

| Element | Spec |
|---|---|
| top row | flex, space-between, mb 22 |
| lockup | a 30px `--ink-warm` tile, radius 7, holding the 20×12 mark (stroke 13); "Connect" in `--gold`; "Lite" |
| eyebrow | Instrument Sans 700 10px, ls .18em, uppercase, `--grey` |
| admit line | Instrument Serif italic 30px, lh 1.05. Colour: trainee `--gold-deep`, tutor `--teal`, assessor `--ink-warm`, volunteer `--teal`. |
| course name | Newsreader 700 24px, lh 1.15, `--teal-deep`, mt 10 |
| meta | 13px `--grey`, mt 4 |
| what | 14.5px, lh 1.65, mt 16 |

**Perforation.** 22px tall.
- The background is two radial gradients, each cutting an 11px half-circle notch, at the left and right edges, over `--surface`.
- Plus a 2px dashed `--sand-line` line, inset 18px from each side, at top 10.

**Stub.** `--surface`, radius 0 0 16 16, padding 16/28/22, position relative.

**Seal.**
- A 76px circle, absolutely positioned at right 26, top −34, so it straddles the perforation.
- `--gold-wash` fill, 2px `--gold-deep` border, rotate(−8deg).
- Inside: the mark (34×20, stroke 11; left C `--gold-deep`, right C `--teal-deep`), then the seal word in Instrument Sans 700 7.5px, ls .14em, uppercase, `--gold-deep`.
- On load, `lc-seal`: .7s `cubic-bezier(.3,1.4,.5,1)`, .3s delay, from scale 1.8 / −20° to −8°.

| Stub element | Spec |
|---|---|
| keep | max-width 300px, so it clears the seal; 12.5px, lh 1.6, `--grey`; bold lead in `--ink-warm` |
| languages (volunteer) | 12px `--grey`, mt 8 |
| button | mt 16; flex, space-between; height 50; padding 0/22; radius 12; `--teal-deep`. Left: the go text, Karla 700 15px `--paper`. Right: "Admit one →", Instrument Sans 600 11px, ls .16em, uppercase, `oklch(80% 0.1 75)`. Hover `--teal`; focus-visible 2px `--gold-lifted` outline, offset 3. |
| foot | the credit, mt 12. The print button sits beside it, as in 1a. |

### 4.2 Offer card (web)

**A letter on the ticket face, the doors on the face, the price on the stub.**

**Face.** `--paper`, radius 16 16 0 0, padding 26/30/22, 6px `--gold` top border.

| Element | Spec |
|---|---|
| note | `ctx.note` paragraphs, Newsreader 16.5px, lh 1.7. Shown only when there's a note. |
| signature | "Ramy", Instrument Serif italic 26px `--ink-warm`, mt 10 |
| eyebrow | "For a CELTA centre": Instrument Sans 700 10px, ls .22em, uppercase, `--grey`, mt 18 |
| headline | Newsreader 700 25px, lh 1.15, `--teal-deep` |
| doors | as 1a, but rows are separated by 1px **dashed** `--sand-line` and the first has mt 14. The button is a filled `--teal-deep` rectangle: radius 8, padding 7/14, Karla 700 12.5px `--paper`. |

**Perforation.** As 4.1.

**Stub.** `--surface`, padding 14/30/22; flex, align-items end, space-between, gap 16.
- **Left:** "Per course, not per trainee", Newsreader 700 21px `--ink-warm`. Under it, 12.5px `--grey`, lh 1.5, on two lines: "The more courses, the less each costs." / "Duplicate one and run it again." **No figure.**
- **Right:** **lite@celtaconnect.com**, a `mailto:` link in Karla 600 12px `--gold-deep`.

### 4.3 Console course card: "the ticket book"

**Card.** `--paper`, radius 16, padding 20/22/22, 6px `--teal` top border, shadow `0 18px 30px -22px oklch(30% 0.04 60 / .35)`.

**Head.**
- Course: Newsreader 700 24px. Centre: 12.5px `--grey`, on the same row, flex space-between.
- Line: "The course's tickets. Each copies a link that opens its card.", 12.5px `--grey`, mb 14.

**Grid.** Two columns, gap 10, of four ticket buttons:

| Ticket | Tone | Note |
|---|---|---|
| The teaching team | `--teal` | as 3.3 |
| The assessor | `--ink-warm` | as 3.3 |
| A volunteer | `--teal-lifted` | as 3.3 |
| Someone new | `--gold` | as 3.3 |

**Each ticket button.**
- Left-aligned; padding 14/14/12; radius 10; `--surface` fill; 1px `--sand-line` border, plus a 4px left border in the tone.
- Ticket name: Instrument Serif italic 20px, in the tone. Note: 12px, lh 1.45, `--grey`.
- State: Instrument Sans 700 11px, ls .14em, uppercase, `--grey`, reading "Copy the card".
- Hover: translateY(−2px) rotate(−.5deg), shadow `0 10px 18px -12px oklch(30% 0.04 60 / .5)`.
- Copied (1.8s): the state reads "Copied ✓" in `--teal`.
- The whole ticket is the copy target.
- "Someone new" also needs "Email it" and "See the card": two small links under its note. They stop propagation, so they don't trigger the copy.

---

## 5. The offer card as an email (`hub-card-mail.js`), both directions

Email clients drop SVG, animation, `oklch`, radial gradients and `filter`. So:
- **Colours:** hex only, using the file's `C` table. Add:

  | Key | Hex |
  |---|---|
  | `tealDeep` | `#0b3a3b` |
  | `goldWash` | `#f6ead3` |
  | `amber` | `#e5c98f` |
  | `goldDeep` | `#8a6534` |
  | `paper` | `#fffdf9` |
  | `onTealGold` | `#d9b47a` |
  | `onTealMeta` | `#d7e6e5` |

- **1a:** the panel is a `<td bgcolor="#0b3a3b">` with no mark (not even in type), which keeps it clean. Everything else is as 3.2, in tables. The button is the existing bulletproof `<td bgcolor>` pattern.
- **1b:** there's no seal or perforation. The face/stub split is a 2px dashed `C.line` border-top on the stub cell. The 6px gold top border goes on the face `<td>`.
- **Both:**
  - The contact line "For the rates and demo links: lite@celtaconnect.com" is a `mailto:` link and replaces "Any questions, just reply." when there's no note.
  - **No price figure in the main card.** Remove the `price` block and the "Per course, not per trainee." paragraph. In their place goes the pricing box from 3.2: the three lines, with no figure. Retire `ctx.price` and `showPrice` for this document.
  - The `replyTo` stays `FROM_`.
  - The plain-text alternative gains "Questions, or a demo: lite@celtaconnect.com".
- **filmDoc** takes the same frame, plus the contact line, which replaces "email me for a demo link" with "email lite@celtaconnect.com for the rates and a demo link".
- **priceDoc** is the only place a figure appears. It's sent on request, and it keeps its rates table. Ramy to confirm whether it stays.
- **The live `offer.html` and the console wording:** check every place a figure appears and remove it, except `price.html` / `priceDoc`. The spots I know of:
  - the main offer card's price block (`hub-card-mail.js`)
  - `offer.html`'s front
  - the console's "Send this course" description ("what it costs" becomes "how it’s priced")

## 6. Accessibility

- Contrast on teal: the literals in §1 are ≥ 4.5:1.
- The role chip and seal words are decorative: `aria-hidden`. The eyebrow carries the role for screen readers.
- The big mark and the seal are `aria-hidden`.
- Buttons are real `<a>`s with their `href` set from `DEST`, as today.
- Focus rings on every control, 2px `--gold-lifted`.
- The language buttons get `aria-pressed`.

## 7. Test

1. `invite.html?t=…`, `?k=…`, `?ak=…` and the volunteer link: right role, right wording, the button goes to the same `DEST` as today.
2. A first visit with nothing in `localStorage`: the fallback course name; no meta, no "for" line; filled in when the boot answers.
3. A trainee with `hub:name`: the name appears in the for line (1a) or admit line (1b).
4. Volunteer: the language buttons switch the copy, and RTL languages flip direction.
5. 375px: no sideways scroll, and type steps down as in §1. 1b: the seal doesn't cover the keep text.
6. Print: the plain page, as today, with the button outlined.
7. Console: each Copy copies the card link (unchanged URLs) and shows "Copied ✓" for 1.8s. Email it and See the card still work.
8. `sendCard`: arrives in Gmail and Outlook with the chosen frame. The contact line links to lite@celtaconnect.com. There are no broken images, because there are none. There's no £ figure anywhere in the main card.
9. Reduced motion: no drift, entrance or seal animation.

---

## 8. Price wording audit: where a figure appears today (`main`, 7 Oct 2026)

Ramy's rule, 7 Oct 2026: **no figure on the cards.**
- Say it's affordable, priced per course and not per candidate, with packages that get cheaper the more you take, and that a course can be duplicated and run again.
- The rates come by email (lite@celtaconnect.com).

**The figures also disagree today:** £240 in some places and £300 in others. Fix both while removing them.

| Where | What it says now | Change |
|---|---|---|
| `offer.html` 236–237 | "per course, paid once" / "£240 a course, less when you buy several…" | Replace with the pricing box (§3.2 / §4.2), with no figure. Remove `pricePer` / `priceAsk` and their fill logic (281–282). |
| `offer.html` 245 | "**Per course, not per trainee.** One price covers the whole course…" | Keep the point; it becomes the box's third line. |
| `hub-card-mail.js` 113–114, 154 | `ctx.price || '£240'`, "per course, paid once", "One price covers…" | §5: the pricing box, no figure |
| `hub-card-mail.js` 68–69, 91–92 (`priceDoc`, `rateRows`) | £240 / £1,000 / £1,750 / £3,200, and £240 headline | The **only** place figures remain, sent on request. **Ramy to confirm** these are the current packages; they disagree with the £300 below. |
| `hub-front.js` 77 | "£300 a course, paid once, with everything in it. Less when you buy several…" | Remove the figure: "Priced per course, not per trainee. Packages get cheaper the more you take, and a finished course can be duplicated and run again. Email lite@celtaconnect.com for the rates." Keep the "rates in full" link only if `price.html` stays public. |
| `14_owner.html` 614 | the price-mail intro, "one price per course, everything included, and less when you buy several" | Fine as it is: it's the on-request price mail. |
| `14_owner.html` 997–1000 | the `priceText` box: "£240, or leave empty" … "the card states £300 and links to the rates" | The card no longer shows a figure, so this box is for `priceDoc` only. Relabel it "Quote for the price email (optional)" and drop "the card states £300". |
| `price.html` 112 | "per course, paid once" | The public rates page. **Ramy to confirm** whether it stays public or is mail-only. |
