import numpy as np
from PIL import Image
"""MAKE A PHOTOCOPY LOOK LIKE A PAGE.

Three of the five books are digital PDFs and come out clean. The two Macmillan
Straightforward files are scans of paper and they show it: a grey-yellow cast
instead of white paper, the reverse side faintly showing through, and the dark
edge of the scanner bed down one side. Ramy, 4 Oct 2026: "it's like a really
old-looking page ... that frame ... it doesn't look original, does it?"

TWO WRONG TURNS, BOTH WORTH REMEMBERING. Whitening every pale colourless
pixel punched holes through a green vocabulary box and through the sky of a
photograph. Fencing off the blocks that carry something then left the page a
patchwork, white paper beside grey paper with the block grid showing at every
seam. The fix is not to choose pixels at all: find what colour the PAPER is,
per channel, and rescale the whole page so that colour becomes white. It is
one smooth curve over every pixel, so nothing can show a seam, the yellow cast
goes with the grey, and show-through -- which is always a little lighter than
the ink and a little darker than the paper -- clips away on its own."""

def paper_white(ch):
    """The commonest bright value IS the paper: it covers more of a book page
    than any photograph or block of text does."""
    h = np.bincount(ch[ch > 120].astype(np.uint8).ravel(), minlength=256)
    return float(np.argmax(h[120:]) + 120) if h[120:].max() else 255.0

def clean(path, out=None, quality=84):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)

    # 1. the scanner's dark edge, trimmed from the outside in, and only where a
    #    band is genuinely dark -- a timid threshold here eats the folio.
    lum = a.max(axis=2)
    page = float(np.percentile(lum, 60))
    def trim(prof, span):
        lo, hi = 0, len(prof)
        while lo < span and prof[lo] < page * 0.55: lo += 1
        while hi > len(prof) - span and prof[hi-1] < page * 0.55: hi -= 1
        return lo, hi
    r0, r1 = trim(lum.mean(axis=1), int(lum.shape[0] * 0.03))
    c0, c1 = trim(lum.mean(axis=0), int(lum.shape[1] * 0.03))
    a = a[r0:r1, c0:c1]

    # 2. one curve per channel: paper to white (which also neutralises the
    #    yellow), darkest ink to black. 0.94 puts the clip just under the paper
    #    so the show-through sitting just below it goes with it.
    # A greyscale scan has no tint to lose, so its clip can sit harder against
    # the paper and take the last of the show-through with it. A colour page
    # cannot: at 0.90 a pale green vocabulary box clips to white along with it.
    grey = float((a.max(axis=2) - a.min(axis=2)).mean()) < 6
    k = 0.90 if grey else 0.94
    out_a = np.empty_like(a)
    for c in range(3):
        ch = a[:, :, c]
        wp = max(paper_white(ch) * k, 60.0)
        bp = min(float(np.percentile(ch, 0.5)), wp - 40)
        out_a[:, :, c] = np.clip((ch - bp) * (255.0 / (wp - bp)), 0, 255)

    img = Image.fromarray(out_a.astype(np.uint8))
    if out: img.save(out, quality=quality)
    return img

if __name__ == '__main__':
    import sys
    clean(sys.argv[1], sys.argv[2])
    print('cleaned', sys.argv[2])
