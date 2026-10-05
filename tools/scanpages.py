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
  'LH_SB': (f'{D}/Elementary/Language Hub/Language_Hub_Elementary_SBpdf.pdf', 5),
  'RM_SB': (f'{D}/Pre-Intermediate /Roadmap A2+/Roadmap_a2+_student_s_book.pdf', -4),
  'SF_SB': (f'{D}/Upper- Intermediate /Straightforward/- Straightforward Upper Intermediate. Student_s Book.pdf', 0),
  'SF_WB': (f'{D}/Upper- Intermediate /Straightforward/- Straightforward Upper-Intermediate. Workbook .pdf', 0),
  'SO_SB': (f'{D}/Beginner/Speakout 3rd ed A1/SO A1 SB.pdf', -1),
  'SO_WB': (f'{D}/Beginner/Speakout 3rd ed A1/SO A1 WB.pdf', -1),
  # Ramy found this on 4 Oct and it is the one the TP points were written
  # from: 1B is "Paintballing", first published 2007, ISBN 978-1-4050-1092-4,
  # and its imprint licenses photocopies of pp. 211-258 -- the resource pages
  # the second-edition copy in the library does not have at all.
  'SF_TB': (f'{D}/Upper- Intermediate /Straightforward/Straightforward Upper-Intermediate Teacher’s Book — 1st edition 2007.pdf', 15),
  # Set five. These three still sit in Ramy's Downloads folder, not in Course
  # books/Intermediate with every other book -- they want moving, and this path
  # will break when they are.
  'SOB1_SB': ('/Users/work/Downloads/B1 SpeakOut/SO B1 SB.pdf', -1),
  'SOB1_WB': ('/Users/work/Downloads/B1 SpeakOut/SO B1 WB.pdf', -1),
}
_open = {}

# A PUBLISHER'S FILE CAN BE MISSING PAGES IN THE MIDDLE, which moves every page
# after them. The Speakout B1 Student's Book PDF has no Additional material:
# its folio reads 145 on PDF page 145 and 150 on PDF page 146, so book pp.
# 146-149 -- the pairwork prompts, the quiz answers and the jigsaw texts the
# lessons point at -- are simply not in the file, and from p. 150 the offset is
# four pages deeper. Without this, asking for p. 150 rendered p. 146: a real
# page, with real text, from the wrong part of the book, which no check could
# have caught. Every folio below was read off the page.
ABSENT = {'SOB1_SB': [146, 147, 148, 149]}
SHIFTS = {'SOB1_SB': [(150, -5)]}          # from this book page, use this offset

def doc(k):
    if k not in _open:
        _open[k] = fitz.open(BOOKS[k][0])
    return _open[k]

def offset(k, page):
    off = BOOKS[k][1]
    for frm, o in SHIFTS.get(k, []):
        if page >= frm:
            off = o
    return off

def index(k, page):
    if page in ABSENT.get(k, []):
        raise ValueError(f'{k} p.{page} is not in that PDF at all -- the file skips it')
    i = page + offset(k, page)
    d = doc(k)
    if i < 0 or i >= d.page_count:
        raise ValueError(f'{k} p.{page} is outside that PDF (index {i}, {d.page_count} pages)')
    return i

# The two Macmillan files are scans of paper; the other three are digital and
# come out clean, so they are left exactly as the publisher set them.
SCANNED = ('SF_SB', 'SF_WB', 'SF_TB', 'SOB1_SB')

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
