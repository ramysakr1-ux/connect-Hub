"""Every page in every book that is not actually there, as book page numbers.

A page with no text, no image and almost no vector drawing is a page the
publisher's file left blank. The Speakout A1 Student's Book PDF has eleven of
them where its Additional material should be, and seven of those reached
trainees' cards as white sheets because nothing checked.

A page the file skips over altogether counts the same way and is worse, because
every page after it shifts: the Speakout B1 Student's Book goes straight from
folio 145 to folio 150. Those live in scanpages.ABSENT, read off the folios,
and are merged in here so one list answers "can we show this page".
"""
import json, io, importlib.util, fitz
spec = importlib.util.spec_from_file_location('sp', 'scanpages.py')
sp = importlib.util.module_from_spec(spec); spec.loader.exec_module(sp)
out = {}
for bk, (path, off) in sp.BOOKS.items():
    d = fitz.open(path)
    blanks = []
    for i in range(d.page_count):
        pg = d[i]
        if pg.get_text().strip(): continue
        if pg.get_images(full=True): continue
        if len(pg.get_drawings()) > 8: continue
        blanks.append(i - off)                      # back to a book page number
    missing = sp.ABSENT.get(bk, [])
    blanks = sorted(set(blanks) | set(missing))
    out[bk] = blanks
    print(f'{bk:8} {d.page_count:4} pdf pages · {len(blanks):3} not available'
          + (f'  book pp. {blanks[0]}–{blanks[-1]}' if blanks else '')
          + (f'  ({len(missing)} skipped by the file)' if missing else ''))
json.dump(out, io.open('blank-pages.json', 'w'), indent=1)
