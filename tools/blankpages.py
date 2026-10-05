"""Every page attached to a slot, checked against its source PDF for blankness.

The Speakout A1 Student's Book PDF has eleven blank pages where its Additional
material should be (book pp. 140-150), so a citation into that range attached a
white sheet to the card and printed one into the day's PDF. Nothing complained:
the file existed, the url worked, the page count was right.
"""
import json, io, importlib.util, fitz, subprocess
spec = importlib.util.spec_from_file_location('sp', 'scanpages.py')
sp = importlib.util.module_from_spec(spec); spec.loader.exec_module(sp)
PRE = {'s1': 'LH', 's2': 'RM', 's3': 'SF', 's4': 'SO', 's5': 'SOB1'}

m = json.loads(subprocess.run(['node', '-e', '''
import { buildMap } from "./pagemap.mjs";
const { map } = await buildMap();
console.log(JSON.stringify(map));
'''], capture_output=True, text=True).stdout)

docs = {}
def blank(bk, p):
    if bk not in docs: docs[bk] = fitz.open(sp.BOOKS[bk][0])
    d = docs[bk]
    try:
        i = sp.index(bk, p)
    except ValueError as e:
        return 'NOT IN THE FILE' if 'skips it' in str(e) else 'OUT OF RANGE'
    pg = d[i]
    if pg.get_text().strip() or pg.get_images(full=True) or len(pg.get_drawings()) > 8:
        return None
    return 'BLANK'

bad = {}
for sid, slots in m.items():
    for k, lst in slots.items():
        for src, p in lst:
            bk = f'{PRE[sid]}_{src}'
            why = blank(bk, int(p))
            if why: bad.setdefault(f'{sid} {k.replace("|","·")}', []).append(f'{src} p.{p} {why}')
if not bad:
    print('no slot carries a blank or out-of-range page')
else:
    for k in sorted(bad): print(f'  {k}: ' + ', '.join(bad[k]))
    print(f'\n{len(bad)} slots carry a page that is blank in the source PDF')
