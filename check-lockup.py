#!/usr/bin/env python3
"""THE LOGO IS FIXED, AND IT IS THE FILMS' (Ramy, 24 Oct 2026: "Is there a reason
why the logo keeps changing every time? Do we need to have a rule that the logo is
fixed" ... "make it consistent with the film so we don't have to change the films
again").

Connect Lite's logo is the one every film has carried since 9 Oct: the cream tile,
"Connect" in gold Instrument Serif italic, and LITE BESIDE it on the same line, on the
word's baseline -- Instrument Sans 600, uppercase, 8/21 of the word's size, tracked
0.24em, 0.19 of the word after it. Not under the word, not spread across it.

It kept changing because it is drawn by hand in a dozen places and each decision
reached some of them. This reads every place and fails if one differs; bump-assets.py
runs it before every push. To change the logo, change the films first, then this file
and every place it names, together.   Run: python3 check-lockup.py"""
import re, sys, pathlib

bad = []
def text(path): return pathlib.Path(path).read_text(encoding='utf-8')
def need(path, pattern, what, count=None):
    n = len(re.findall(pattern, text(path), re.S))
    if n == 0 or (count is not None and n != count):
        bad.append(f"{path}: {what} (found {n}{', wanted ' + str(count) if count is not None else ''})")
def never(path, pattern, what):
    if re.search(pattern, text(path), re.S): bad.append(f"{path}: {what}")

LITE_SIZE = r"font-size:calc\(var\(--w\) \* 8 / 21\)"

# the house sheet: every page's header, the shared credit lockup, the front page, the invitation and offer cards
need('hub-house.css', r"\.lockup \.hub-pair, \.lockup > \.word, \.fp-mark \.fp-word\{display:inline-flex !important; align-items:baseline", "the name and LITE share one baseline")
need('hub-house.css', LITE_SIZE + r" !important; line-height:1 !important; text-transform:uppercase !important;\s*letter-spacing:0\.24em !important; margin:0 0 0 calc\(var\(--w\) \* 0\.19\)", "LITE is 8/21 of the word, 0.24em, 0.19 of the word after it", 1)
need('hub-house.css', r"font-weight:600 !important;\s*" + LITE_SIZE, "LITE is weight 600", 1)
never('hub-house.css', r"\.hub-word[^{]*\{[^}]*grid-row:2|\.l\{[^}]*grid-row:2", "LITE must not drop under the word (grid-row:2)")
# pages that draw their own, under the house rule
for p in ('offer.html', 'invite.html'):
    need(p, r"\.word\{display:inline-flex; align-items:baseline", "one line, on the baseline", 1)
    need(p, r"\.word \.l\{[^}]*font-weight:600; font-size:8px; letter-spacing:0\.24em", "LITE 600 / 8px / 0.24em", 1)
need('hub-front.js', r"\.fp-word\{display:inline-flex; align-items:baseline", "one line, on the baseline", 1)
need('hub-front.js', r"\.fp-word \.l\{[^}]*font-weight:600; font-size:8px; letter-spacing:0\.24em", "LITE 600 / 8px / 0.24em", 1)
for p in ('13_grades_report.html', '14_owner.html', '17_how_it_works.html', '6_centre_admin_dashboard.html', '5_tutor_dashboard.html', '7_candidate_tracker.html'):
    need(p, r"\.hub-word\{\s*font-family:[^;]*; font-weight:600; font-size:8px;", "page-local .hub-word 600 / 8px")
# the emailed cards: header (welcome and ticket) and the sign-off, LITE beside the word
need('hub-card-mail.js', r">Connect<span style=\"font-family:' \+ SANS \+ '; font-style:normal; font-size:8px; font-weight:600; line-height:1; letter-spacing:0\.24em; text-transform:uppercase; color:' \+ C\.\w+ \+ '; margin-left:4px;\">Lite</span></div>", "every emailed lockup is one line, LITE 8px / 600 / 0.24em", 3)
never('hub-card-mail.js', r">Lite</div>", "no LITE on a line of its own")
never('hub-card-mail.js', r">Connect Lite</div>", "no one-line 'Connect Lite' caption")
# the share card and the trainers' card, the same logo at 44px
for p in ('brand/share-card.html', 'brand/trainers-card.html'):
    need(p, r"\.mark \{ display: flex;", "tile and word in one row", 1)
    need(p, r"\.word \{ display: inline-flex; align-items: baseline; \}", "one line, on the baseline", 1)
    need(p, r"font-weight: 600; font-size: calc\(var\(--w\) \* 8 / 21\);.{0,160}?letter-spacing: \.24em; margin-left: calc\(var\(--w\) \* 0\.19\)", "LITE 8/21, 600, 0.24em, 0.19 after", 1)
    never(p, r"grid-row", "no grid rows: LITE is not under the word")

# the input sessions (their own sheet) and the assessor pack (a 27px word)
need('input-sessions/session.css', r"\.hub-word\{font-family:[^;]*; font-weight:600; font-size:8px; letter-spacing:0\.24em", "session LITE 600 / 8px / 0.24em", 1)
need('input-sessions/session.css', r"\.hub-pair\{display:inline-flex; align-items:baseline", "session logo on one baseline", 1)
need('input-sessions/session.css', r"\.hub-lockup-l\{[^}]*font-weight:600; font-size:6\.5px; letter-spacing:\.24em", "session credit LITE 600 / 8/21 of 17px", 1)
need('12_assessor_pack.html', r"\.hub-word\{font-family:[^;]*;font-weight:600;font-size:10\.3px;letter-spacing:0\.24em", "pack LITE 600 / 8/21 of 27px", 1)

if bad:
    print("LOGO CHECK FAILED -- Connect LITE is not the films' logo everywhere:")
    for b in bad: print("  " + b)
    sys.exit(1)
print("logo check: Connect LITE is the films' logo on every page, card and email.")
