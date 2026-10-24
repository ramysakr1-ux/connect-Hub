#!/usr/bin/env python3
"""One-off: replace raw hex in CSS value positions in pages with the token that carries
the same value in hub-tokens.css's notebook block (colour-map.py). Never touches SVG
attributes, JavaScript strings, or printed documents. Dry run unless --write."""
import re, pathlib, sys
from colour_map import MAP
PRINTED = {'12_assessor_pack.html', '16_final_report.html', '22_fail_letter.html', '15_course_record.html', '11_assignment_record.html', '13_grades_report.html', 'celta-c17-timetable.html'}
HEX = re.compile(r'(?<=[:\s(,])(#[0-9a-fA-F]{6})\b')
write = '--write' in sys.argv
total = 0
for p in sorted(pathlib.Path('.').glob('*.html')):
    if p.name in PRINTED: continue
    out = []; n = 0
    for line in p.read_text().split('\n'):
        if re.search(r'fill=|stroke=|stop-color|<svg|data:|url\(|<path', line):
            out.append(line); continue
        def rep(m):
            global n
            h = m.group(1).lower()
            if h in MAP:
                n += 1; return 'var(--' + MAP[h] + ')'
            return m.group(0)
        out.append(HEX.sub(rep, line))
    if n:
        total += n; print(f'{p.name}: {n}')
        if write: p.write_text('\n'.join(out))
print('total', total, 'written' if write else 'dry run')
