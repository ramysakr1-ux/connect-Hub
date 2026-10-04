import fitz, sys, re, collections
# The printed page number sits in the outer margin, low on the page. Read the
# words, keep the bare integers in the bottom eighth, and see which offset from
# the PDF index they agree on.
path, lo, hi = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
d = fitz.open(path)
votes = collections.Counter()
for i in range(lo, min(hi, d.page_count)):
    pg = d[i]; H = pg.rect.height
    for x0, y0, x1, y1, w, *_ in pg.get_text('words'):
        if y0 > H * 0.88 and re.fullmatch(r'\d{1,3}', w):
            votes[int(w) - i] += 1
for off, n in votes.most_common(5):
    print(f'  offset {off:+4}  {n} pages agree   (book page N is PDF index N{-off:+d})')
