# The role-by-role review, fixed (night of 31 Oct to 1 Nov 2026)

All ten findings are fixed and committed on `main` locally (d8f2b179 to a5cb98d1, plus the asset stamps). Nothing has been pushed. check-screens says "Nothing screamed."

## What Ramy does in the morning

1. Deploy the store. R2, R3 and R4 are in `store/gas/Code.js`:

   ```
   cd /Users/work/connect-Hub/store/gas && clasp push && clasp deploy -i AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA -d "v189 review privacy fixes"
   ```

2. Run `npm run check:roles`. The new R2 to R4 checks should say ok. The matrix will report changes on `me` (a tutor's or an assessor's key is now refused). Read them, then run `npm run check:roles -- --write`.
3. Say "push" for the pages.

## Each finding

| | What was wrong | What it does now | Proof |
|---|---|---|---|
| R1 | An older page could save under a link opened later in the same browser. | A page remembers the link it loaded with. If another Lite link has been opened since, a save is refused with "reload this page" and nothing is sent. The leaving-page beacon is held back too. | Browser test: page A (token A), then page B (token B). A's save was refused and no request was sent; B saved normally. |
| R2 | `me` gave a trainee's whole record, notebook included, to a tutor's or assessor's key sent with the trainee's token. | `me` is for the trainee only. No page calls it any other way. | check-roles, after the deploy. |
| R3 | The assessor's `course` read carried the volunteers' emails. | Emails are taken out, as boot already did. | check-roles (the scratch students now have emails to test with). |
| R4 | Unpublished timetable drafts reached trainees, volunteers and the assessor. | Only tutors get the draft. An unpublished timetable reaches everyone else as "not published". | check-roles puts a marked draft on the scratch course and looks for it in each role's reply. |
| R5 | The assessor's TP points page showed Earlier, Later, Own lesson, Deal TP points again, the set pickers and Your own set (a dead end into a tutor page). | The page decides by role, not by the words on a button. On the assessor's link every control that changes the rotation, the sets or the materials is hidden and refused, the fields are plain values, and nothing saves. The assessor keeps the rotation, Materials (read-only) and Print the practice map. | As the C/1 assessor: no changing control on screen; a forced click on a hidden one sent nothing; 0 editable fields in Materials. As the tutor: all 144 move buttons, 88 pickers and 14 Materials fields still work. |
| R6 | After an assessor visit, the owner's entry page was locked (the owner key box was read-only). | The owner page is left out of the assessor lock. | Before the fix: the box was locked. After: it can be typed in. |
| R7 | The timetable's session panel and the volunteer's information note let the keyboard walk out behind them. | Focus moves in, Tab and Shift+Tab stay inside, the page behind is inert, Escape closes, and focus goes back to the tile or button that opened it. It is one shared helper, `hubTrapFocus`. | Tested as tutor, trainee and volunteer, with 8 to 12 Shift+Tabs: focus stayed inside each time, and Escape returned it to the tile or to "You agreed…". |
| R8 | The data walk seeded a demo course without the visit marker, so the seed was wiped on the first page and every screen walked an empty course. Its records were also in September's shapes. | The tab is marked as a visit already under way. The records are in today's shapes, taken from what the demo store returns. Each screen is checked for the right role, the right trainee and the expected record before its layout is checked. The walk's server now serves folder links. | Full walk: every state check passes. The plan and self-evaluation are loaded and locked, TP2's feedback is there, and the LSRT shows Pass. |
| R9 | The self-evaluation told trainees to bring action points in "from the file your tutor returned". The old handoff said Lite has no volunteer role. | The guide now says what the button does. The handoff line is struck through and marked superseded. | — |
| R10 | On a phone, the timetable's last day in view could be cut in half. | The week still scrolls sideways (by design), but it now comes to rest on a whole day. | At 390px, scrolls of 60, 200 and 400 settled on the day edges. |

## What the fixed data walk found

Now that the walk sees a real course, it reports 12 items that were never visible before. None of them comes from tonight's changes, and none is fixed yet:

- The notebook pen covers a button on the tutor dashboard ("waiting on you"), the trainee home (Lesson plan) and the observation tasks (tutor and trainee).
- The tutor's CELTA 5 runs 96px off the right edge at phone width.
- On the walk's seed, `34_handover.html` and `40_tp_feedback.html` stay on "Loading the course…". The seed probably lacks a record they wait for. Not checked on a real course.
- `invite.html` has almost nothing on it without a link. This is expected: it is a card page.
- On the trainee home, the Cloudflare visitor-count script is refused by the local server. This is harmless.

Trainees run the course on a laptop, so the phone items matter less. Each is a quick look.

## Not done

- The R1 to R6 privacy checks for pages are browser tests I ran tonight (scripts in the session scratchpad). They are not yet in `npm run check`. The store side of R2 to R4 is in check-roles.
