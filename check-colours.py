#!/usr/bin/env python3
"""Colours: pages use the tokens in hub-tokens.css, not raw hex (see COLOURS.md).

Ratchet: each page has a ceiling of raw hex colours in colour-baseline.json. A page
that goes above its ceiling fails; a page below it is told so, and may lower it.
Run by bump-assets.py before every commit.  --write  resets the baseline to today's counts.
"""
import re, json, pathlib, sys
HEX = re.compile(r'#[0-9a-fA-F]{6}\b')
EXEMPT = {'hub-tokens.css', 'hub-house.css', 'hub-qr.js', 'hub-ink.js', 'hub-hand.js', 'hub-say.js', 'hub-pin.js', 'hub-shared.js', 'hub-sync.js', 'hub-card-mail.js', 'fol-interview.js'}
PRINTED = {'12_assessor_pack.html', '16_final_report.html', '22_fail_letter.html', '15_course_record.html', '11_assignment_record.html', '13_grades_report.html', 'celta-c17-timetable.html'}
BASE = pathlib.Path('colour-baseline.json')

def scan():
    out = {}
    for p in sorted(pathlib.Path('.').glob('*.html')) + sorted(pathlib.Path('.').glob('*.css')) + sorted(pathlib.Path('.').glob('*.js')):
        if p.name in EXEMPT or p.name in PRINTED: continue
        n = len(HEX.findall(p.read_text(errors='ignore')))
        if n: out[p.name] = n
    return out

now = scan()
if '--write' in sys.argv:
    BASE.write_text(json.dumps(now, indent=1, sort_keys=True) + '\n'); print('baseline written:', len(now), 'files'); sys.exit(0)
base = json.loads(BASE.read_text()) if BASE.exists() else {}
bad = [(f, base.get(f, 0), n) for f, n in now.items() if n > base.get(f, 0)]
lower = [(f, base[f], now.get(f, 0)) for f in base if now.get(f, 0) < base[f]]
for f, was, n in bad: print(f'FAIL {f}: {n} raw colours, ceiling {was}. Use a token from hub-tokens.css (COLOURS.md).')
for f, was, n in lower: print(f'lower {f}: {was} -> {n}. Run check-colours.py --write to lock it in.')
print(f'colours: {sum(now.values())} raw in {len(now)} files; ceiling {sum(base.values())}')
sys.exit(1 if bad else 0)
