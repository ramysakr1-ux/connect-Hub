# Build link-card direction 1b (the ticket) next to 1a

Repo: `ramysakr1-ux/connect-Hub` @ `main` (68555d08722c), 7 Oct 2026.

**Where things stand:**
- 1a (the welcome family) is built in `invite.html` and `offer.html`.
- **Ramy wants 1b built as well.** It doesn't replace 1a; both stay.

The full visual spec for 1b is already in the repo: **`specs/link-cards.md` §4.1 (invitation), §4.2 (offer, web), §4.3 (console "ticket book"), and §5 (email, 1b column).**
- Build it exactly as written there.
- Use the shared tokens and wording in §1–§2, which 1a already uses.

## 1. How the two live side by side

- **One setting per course: card style.** Values: `welcome` (1a) or `ticket` (1b). Default `welcome`, so every existing course is unchanged.
- **Where it's set:** Course admin › Settings, next to the TP count. It's a two-option control with a small thumbnail of each.
- **Stored on the course record:** `cardStyle`. Add it to the boot payload, so `invite.html` / `offer.html` can read it without an extra call.
- **URL override for previews:** `&card=ticket` or `&card=welcome` on any invite or offer link wins over the course setting. It isn't stored.
- **Role logic is unchanged:**
  - Role still comes from the URL alone.
  - `DEST`, `paint()`, `hub:ready` + re-paint, Print and `sendCard` are all unchanged.
  - Only the frame differs.

## 2. Pages

| Page | 1b work |
|---|---|
| `invite.html` | Add the 1b frame (§4.1): role-tone top border, admit line, perforation, stub, seal with `lc-seal`, "Admit one →" button. Choose the frame from `cardStyle` / `?card=`. Keep one `COPY` table and fill both frames from it. The seal words come from §2. |
| `offer.html` | Add the 1b frame (§4.2): the letter (`ctx.note`) and doors on the face; "Per course, not per trainee" and the two lines on the stub, **no figure**; the contact link on the right. |
| `14_owner.html` | Add the 1b console card (§4.3, "the ticket book"): four ticket buttons in a 2-column grid; each whole ticket is the copy target; "Copied ✓" for 1.8s. "Someone new" keeps Email it / See the card (stop propagation). Choose the card from the course's `cardStyle`. |
| `hub-card-mail.js` | Add the 1b email frame (§5): 6px gold top border on the face `<td>`, and a 2px dashed `C.line` border-top on the stub cell. No seal, no perforation, hex only. `ctx.cardStyle` picks the frame. |

## 3. Volunteer on 1b

- Same as 1a: the language line under keep (12px `--grey`, mt 8), from `hubVolunteerI18n` `invite*` strings, with `aria-pressed` on each language.
- RTL languages flip direction.
- **The seal stays put** in RTL (right 26). The keep max-width of 300px still clears it.

## 4. Print

As in §1:
- The stub prints without fill.
- The seal prints as an outline.
- The perforation prints as the dashed line only, with no notches.
- The button prints as a 2px teal outline.

## 5. Test

1. `?card=ticket` on `invite.html?t=`, `?k=`, `?ak=` and the volunteer link: the 1b frame, the right tone per role (trainee gold, tutor teal, assessor warm ink, volunteer lifted teal), the right seal word, and the button goes to the same `DEST`.
2. Set Course admin › card style to Ticket: every link for that course opens on 1b with no URL parameter. Switch back to Welcome: 1a returns.
3. At 375px: the seal doesn't cover the keep text, and there's no sideways scroll.
4. Console: the ticket book copies the same URLs as the 1a rows.
5. `sendCard` with `cardStyle: 'ticket'`: renders in Gmail and Outlook, with the dashed stub line, no images and no £ figure.
6. Reduced motion: no seal pop.
7. Print: matches §4.
