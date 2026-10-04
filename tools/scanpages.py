import fitz, sys, json, os
from clean import clean
"""Render book pages: single 150 dpi JPEGs for the card, or one 300 dpi PDF
for the printer.

EVERY OFFSET BELOW WAS READ OFF THE PRINTED PAGE NUMBERS, never guessed. The
folio in the outer margin was compared with the PDF index across 13-59 pages
per book, the two image-only Macmillan files were OCR'd, and one page from
each book was then looked at to confirm it is the lesson the TP point cites.
Straightforward's Student's Book runs to printed p. 175 and its
second-edition Teacher's Book to p. 189, so the photocopiables Ramy's own
documents cite at pp. 223-233 are in neither file.
"""
D = '/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Course books'
BOOKS = {
  'RM_SB': (f'{D}/Pre-Intermediate /Roadmap A2+/Roadmap_a2+_student_s_book.pdf', -4),
  'SF_SB': (f'{D}/Upper- Intermediate /Straightforward/- Straightforward Upper Intermediate. Student_s Book.pdf', 0),
  'SF_WB': (f'{D}/Upper- Intermediate /Straightforward/- Straightforward Upper-Intermediate. Workbook .pdf', 0),
  'SO_SB': (f'{D}/Beginner/Speakout 3rd ed A1/SO A1 SB.pdf', -1),
  'SO_WB': (f'{D}/Beginner/Speakout 3rd ed A1/SO A1 WB.pdf', -1),
}
_open = {}

def doc(k):
    if k not in _open:
        _open[k] = fitz.open(BOOKS[k][0])
    return _open[k]

def index(k, page):
    i = page + BOOKS[k][1]
    d = doc(k)
    if i < 0 or i >= d.page_count:
        raise ValueError(f'{k} p.{page} is outside that PDF (index {i}, {d.page_count} pages)')
    return i

# The two Macmillan files are scans of paper; the other three are digital and
# come out clean, so they are left exactly as the publisher set them.
SCANNED = ('SF_SB', 'SF_WB')

def render(k, page, dpi, quality, out):
    doc(k)[index(k, page)].get_pixmap(dpi=dpi).save(out, jpg_quality=quality)
    if k in SCANNED:
        clean(out, out, quality=max(quality, 82))

def main():
    mode, spec, out = sys.argv[1], json.loads(sys.argv[2]), sys.argv[3]
    if mode == 'jpg':
        os.makedirs(out, exist_ok=True)
        for k, p in spec:
            f = f'{out}/{k}-p{p}.jpg'
            if os.path.exists(f):
                continue
            render(k, p, 150, 78, f)
        print(f'{len(spec)} page(s) in {out}')
    elif mode == 'pdf':
        CAP = 8 * 1024 * 1024      # the store takes 9 MB from a tutor; leave headroom
        for dpi, q in ((300, 80), (300, 72), (300, 60), (250, 65), (200, 60)):
            pdf, tmp = fitz.open(), []
            for i, (k, p) in enumerate(spec):
                f = f'/tmp/_sp{i}.jpg'
                render(k, p, dpi, q, f)
                tmp.append(f)
                img = fitz.open(f)
                r = img[0].rect
                pg = pdf.new_page(width=r.width, height=r.height)
                pg.insert_image(pg.rect, filename=f)
            pdf.save(out, deflate=True)
            for f in tmp:
                os.remove(f)
            if os.path.getsize(out) <= CAP:
                print(f'{dpi} dpi q{q}')
                break

if __name__ == '__main__':
    main()
