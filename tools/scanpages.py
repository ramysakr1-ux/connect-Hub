import fitz, sys, json, os
from clean import clean
from polish import polish
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
D = '/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books'
D_MAT = '/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Course Materials'
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
  # Set five. The B1 books live in Course Materials, not Course books with
  # every other book (Downloads/B1 SpeakOut was cleared on 8 Oct 2026).
  # Speakout B1 moved to the shelf on 11 Oct 2026: B1- Materials now holds Empower B1 (C/18's book)
  'SOB1_SB': (f'{D}/Intermediate/Speakout B1 (3rd ed)/SO B1 SB.pdf', -1),
  'SOB1_WB': (f'{D}/Intermediate/Speakout B1 (3rd ed)/SO B1 WB.pdf', -1),
  # Set six (Empower B1, 10 Oct 2026): SB and WB printed page = index - 1; TB printed page = index + 16.
  'EMP_SB': (f'{D}/Pre-Intermediate /Empower /Empower_B1_Pre-Intermediate Students\' Book.pdf', 1),
  'EMP_WB': (f'{D}/Pre-Intermediate /Empower /Empower_B1_Pre-Intermediate_Workbook.pdf', 1),
  'EMP_TB': (f'{D}/Pre-Intermediate /Empower /Empower_B1_Pre-Intermediate_Teachers\' Book.pdf', -16),
  # Sets seven to thirteen (overnight build, 11 Oct 2026). Offsets read off the printed folios; see the build's books.json for the proof.
  # A SPREAD book (two printed pages per PDF page) is listed in SPREADS below: index = (N + off) // 2, left half when N + off is even.
  'EFP_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Pre-Intermediate /English File/English File Pre-Intermediate. SB.pdf', 0),
  'EFP_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Pre-Intermediate /English File/English File Pre-Intermediate WB.pdf', 0),
  'SOE_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Elementary/Speakout 2nd ed Elementary/Speakout_2ndEd_Elementary_SB.pdf', -1),
  'SOE_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Elementary/Speakout 2nd ed Elementary/Speakout_2ed_Elementary_WB.pdf', 0),
  'SOE_TB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Elementary/Speakout 2nd ed Elementary/Speakout_2ndEd_Elementary_TB.pdf', 0),
  'LHU_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /Language Hub/Language_Hub_Upper_Intermediate_Students_Book.pdf', 5),
  'LHU_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /Language Hub/Language_Hub_Upper_Intermediate_Workbook.pdf', -1),
  'NTI_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Intermediate/New Total English/New_Total_English_Intermediate_SB.pdf', 2),
  'NTI_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Intermediate/New Total English/New_Total_English_Intermediate_WB.pdf', -1),
  'EB2_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /Empower B2/Empower_B2_Upper_Intermediate_SB.pdf', 1),
  'EB2_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /Empower B2/Empower_B2_Upper_Intermediate_WB.pdf', 0),
  'EB2_TB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /Empower B2/Empower_B2_Upper Intermediate_Teacher\'s Book_PDF.PDF', -1),
  'EFU_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /English File (3rd edition)/English File Upper-Int SB.pdf', 0),
  'EFU_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Upper- Intermediate /English File (3rd edition)/English File Upper Int WB.pdf', 0),
  'NTP_SB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Pre-Intermediate /New Total English/New_Total_Eng_Pre-Intermediate_SB.pdf', 0),
  'NTP_WB': ('/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Connect Lite/Do not delete/Course books/Pre-Intermediate /New Total English/New_Total_Eng_Pre-Intermediate_WB.pdf', -4),
  'EFP_TB': (f'{D}/Pre-Intermediate /English File/English File Pre-Intermediate TB (1).pdf', -1),   # printed = index + 1: folio 249 sits at index 248, 'At an art gallery' (p. 211) at 210 -- checked 11 Oct 2026 after the cards had carried the next worksheet along
  'EFU_TB': (f'{D}/Upper- Intermediate /English File (3rd edition)/English File Upper Int TB .pdf', 0),   # folio 188 at index 188
  'NTP_TB': (f'{D}/Pre-Intermediate /New Total English/NTE_Pre-Intermediate_TB.pdf', 0),   # folio 125 at index 125
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

# A SPREAD SCAN WHOSE OFFSET DRIFTS (a unit opener scanned on its own, a repeated page): an explicit map read off
# the printed folios, tools/spreadmaps.json {BOOK: {page: [index, side]}}, wins over the offset arithmetic (11 Oct 2026).
import json as _json, os as _os
SPREADMAPS = _json.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'spreadmaps.json'))) if _os.path.exists(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'spreadmaps.json')) else {}
def spread_side(k, page):
    m = SPREADMAPS.get(k, {}).get(str(page))
    if m: return m[1]
    return (page + offset(k, page)) % 2
def index(k, page):
    if page in ABSENT.get(k, []):
        raise ValueError(f'{k} p.{page} is not in that PDF at all -- the file skips it')
    m = SPREADMAPS.get(k, {}).get(str(page))
    if m: return m[0]
    if k in SPREADMAPS: raise ValueError(f'{k} p.{page} is not in that PDF at all -- the file skips it')
    i = page + offset(k, page)
    if k in SPREADS: i //= 2
    d = doc(k)
    if i < 0 or i >= d.page_count:
        raise ValueError(f'{k} p.{page} is outside that PDF (index {i}, {d.page_count} pages)')
    return i

# The two Macmillan files are scans of paper; the other three are digital and
# come out clean, so they are left exactly as the publisher set them.
SCANNED = ('SF_SB', 'SF_WB', 'SF_TB', 'SOB1_SB', 'LHU_SB', 'LHU_WB', 'NTI_SB', 'NTI_WB', 'EB2_SB', 'EB2_WB', 'NTP_SB', 'NTP_WB')
SPREADS = ('SOE_WB', 'NTI_SB', 'NTP_SB',)

def render(k, page, dpi, quality, out, floor=82):
    pg = doc(k)[index(k, page)]
    if k in SPREADS:
        r = pg.rect; right = spread_side(k, page)
        clip = fitz.Rect(r.x0 + (r.width / 2 if right else 0), r.y0, r.x0 + (r.width if right else r.width / 2), r.y1)
        pg.get_pixmap(dpi=dpi, clip=clip).save(out, jpg_quality=quality)
        if k in SCANNED:
            clean(out, out, quality=max(quality, floor))
        polish(out, k, page, out, quality=max(quality, floor)); return
    pg.get_pixmap(dpi=dpi).save(out, jpg_quality=quality)
    if k in SCANNED:
        # The card keeps its floor of 82; a day PDF passes its own step's quality,
        # or stepping down never shrank a scanned page (11 Oct 2026: New Total
        # English days stayed at 8-13 MB through every step).
        clean(out, out, quality=max(quality, floor))
    # Every page, at every dpi: straightened, scanner edge off, pirate stamp
    # painted out (polish.py, 11 Oct 2026 -- the library audit's scan standard).
    polish(out, k, page, out, quality=max(quality, floor))

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
        for dpi, q in ((300, 80), (300, 72), (300, 60), (250, 65), (200, 60), (200, 50), (150, 55)):
            pdf, tmp = fitz.open(), []
            for i, (k, p) in enumerate(spec):
                f = f'/tmp/_sp{i}.jpg'
                render(k, p, dpi, q, f, floor=q)
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
