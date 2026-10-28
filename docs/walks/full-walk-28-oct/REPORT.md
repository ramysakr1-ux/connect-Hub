# Connect Lite: the full walk, night of 28–29 October 2026

Every role, every door reachable by link, on the mid-course demo (C/1, Elmswood, store c1) and the day-one demo (c9), read through the store's read operations only. Nothing was written and nothing was clicked that writes. Each page was loaded twice, at 1512 px and at 390 px (a phone). 281 page loads in all; the screenshots sit beside this file, one folder per role, numbered in the order they were opened. Nothing has been changed since the last push (77068afc); everything below is a finding, not a fix.

## The short version

1. **The slowness is the boot.** Every page, every role, downloads the whole course when it opens: 2.5 MB, 4 to 6 seconds, and a plain `ping` alone is 1.6 to 2.7 seconds on Apps Script. The page draws from the browser's copy first, so what you feel is the "Checking the course…" pill on every page, a blank first visit on a new device, and a page that reloads itself mid-read when anything changed. Details and a recommendation below.
2. **The day-one demo (c9) has lost its clock and its timetable.** Its `demoToday` is unset and it has no timetable in the store, while its dates and deadlines are March 2026. So today it reads as a course that ended seven months ago: every assignment MISSING on the tracker, the home page on the real date, the timetable page showing the three empty-state cards. This looks like a casualty of the store incident on 28 October. Nothing was touched; the fix is one setting and one record, and it is yours to say.
3. **Otherwise clean.** No JavaScript errors on any page except the day-one trainee's agreement gate, which is by design. No sideways scroll on a phone on any of the 281 pages. No broken links. No "undefined", "NaN" or placeholder text. The UI spelling is American; what the walk flagged as British is Cambridge's own text, trainees' written work in the demo, and a few pieces of demo course data (listed below).

## 1. Speed

Measured from this Mac, four calls each, straight at the store:

| Call | Payload | Time |
|---|---|---|
| ping | 0 KB | 1.6 – 2.7 s |
| course | 611 KB | 2.2 – 3.6 s |
| boot | 2,488 KB | 4.0 – 6.2 s |

What is in the 2.5 MB boot of the mid-course demo: the roster is 1.9 MB, about 195 KB per trainee, of which about 130 KB each is `tpHistory` (every returned TP document's HTML) and 41 KB the current feedback. The course is 605 KB, of which TP points are 495 KB: the dealt `groups` (253 KB) duplicate what is already in `set.library` (241 KB).

How a page uses it: `hub-sync.js` renders from the browser's copy at once and boots behind it; if the boot differs, it reloads the page. So:
- a device's first visit to any course waits the full 4 to 6 seconds on a blank page;
- every page after that shows "Checking the course…" for 4 to 6 seconds, and the volunteer's page then makes a second 3.6 s call for their cards (Self-study and Build up your vocab arrive 8 to 10 seconds in, one call after the other, not side by side);
- when anyone has changed anything, the page reloads itself while the reader is on it;
- the last page took 12 seconds for the tutor (it reads every trainee's records to find the warm phrases).

Recommendation, when you want it: a cheap version check before the boot (the store answers with the course's version stamp; the page boots only when it has moved), the roster's `tpHistory` fetched per trainee when a page needs it rather than in every boot, and the dealt TP points sent as references to the set rather than copies. That takes the usual page from 2.5 MB to a few KB and the pill from seconds to under one. It is a store change plus `hub-sync.js`, so not something to do at night without you.

## 2. The day-one demo

| | c1 mid-course demo | c9 day-one demo |
|---|---|---|
| settings.demoToday | 2026-03-13 | **unset** |
| timetable | 20 days, published | **none** |
| start – end | 2 – 27 March 2026 | 2 – 27 March 2026 |
| assignment deadlines | March 2026 | March 2026 |

With no demo clock, c9 runs on the real date, 29 October 2026, so the whole course is in the past: tracker all MISSING, no TP open, the home on "Thursday 29 October", the timetable page empty. The scratchpad still holds the timetable that was built for it (`c9-timetable.json`). To restore: set `demoToday` to 2026-03-02 and put the timetable back. Say the word and I do it, or do it from Course admin.

## 3. Consistencies and small things seen on the way

- **The demo seals the input session library for tutors too.** On the mid-course demo a tutor can open only the day's session; every other library page says "This is a demo course … the sessions open on the day". That is the demo clock rule applied to the tutor; on a real course the tutor sees the whole library. Worth deciding whether the demo should show a tutor everything.
- **The day-one trainee cannot be walked past the agreement** without signing, which is a write, so the walk stopped at the agreement, as it should.
- **Reads the walk could not make.** To be safe it allowed only the plain read operations; a few panels fetch through their own (peer sheets on the feedback record, the course feedback answers, the notebook's pins, the trainer notes, the volunteer's cards). Those panels show their empty state in the screenshots. Each was checked by hand earlier today or tonight (the volunteer's cards: present, after 8–10 s).
- **Arrows** appear only inside session content, as notation ("T → S1", "would have → /ˈwʊdə/", "Model → whole class"), not on any label or button.
- **British spellings on screen, none in Lite's own words:** Cambridge's CELTA 5 and criteria ("Organisation", "analysing"); trainees' written assignments and tutors' feedback in the demo ("organised", "recognise", "behaviour", "favourite"); demo course data: the agreement text ("Cambridge requires every centre…"), a course document labelled "Centre handbook and policies", a timetable session titled "Analysing language and context", a shared material "A favourite place". These live in the course records, not the code; the agreement wording and the document label are the two a center would see as Lite's.
- **Cloudflare Insights** logs a CORS error on localhost only; on the live site it is fine.

## 4. What was walked

| Role | Pages | Errors | Phone overflow |
|---|---|---|---|
| tutor (c1) | 70 | 0 | 0 |
| trainee, Aiko (c1) | 68 | 0 | 0 |
| assessor (c1) | 70 | 0 | 0 |
| volunteer, Lei (c1) | 1 (the page has no further doors) | 0 | 0 |
| tutor (c9, day one) | 70 | 0 | 0 |
| trainee (c9, day one) | 2 (stopped by the agreement gate, by design) | gate only | 0 |

Pages per role were capped at 70; on the big roles that reached every page and most input sessions. Each folder has `pages.json` with the per-page load time, errors, console lines, failed requests and the phone's overflow. The walk script is `walk.mjs` in the session scratchpad; the store timings came from direct calls (`node`), since a routed request does not report its timing.
