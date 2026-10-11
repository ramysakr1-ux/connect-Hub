"""MAKE A RENDERED PAGE FIT TO HAND OUT: straight, no scanner edge, no pirate stamp.

Ramy, 11 Oct 2026, setting the library audit: "some of those scanned copies kind of
are really, like you can tell, the side sort of part ... we should clean that up".
The audit found 130 pages with a grey band down a side, 33 tilted more than a
degree and 277 carrying the stamp of the site a PDF was taken from. clean.py
already whitens the paper of a scanned book; this runs after it, on every page
the renderer makes at any dpi, so the card and the printed day get the same page.

Three jobs, each only where it is needed:
  1. deskew   -- the angle that makes the rows of ink most distinct, searched to a
                 quarter of a degree; a page is rotated only past half a degree.
  2. bands    -- a GREY strip along most of a side (the scanner bed, the spine
                 shadow) is cropped off. A photograph that runs to the edge is dark
                 but coloured and patchy, and is left alone.
  3. stamps   -- a box, in page-relative coordinates from tools/stamps.json, painted
                 the colour of the paper around it. The boxes come from reading the
                 stamp's position once (audit_media.py / the OCR); they are never
                 guessed.
"""
import json, os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
_stamps = None
def stamps_for(book, page):
    global _stamps
    if _stamps is None:
        p = os.path.join(HERE, 'stamps.json')
        _stamps = json.load(open(p)) if os.path.exists(p) else {}
    return _stamps.get(book, {}).get(str(page), [])

def paper_of(g):
    h = np.bincount(g[g > 120].astype(np.uint8).ravel(), minlength=256)
    return float(np.argmax(h[120:]) + 120) if h[120:].max() else 255.0

def skew_of(g):
    img = Image.fromarray((255 - g).astype(np.uint8))
    img = img.resize((600, max(1, int(img.height * 600 / img.width))))
    best, best_a = -1, 0.0
    for a in np.arange(-4, 4.01, 0.25):
        r = np.asarray(img.rotate(a, resample=Image.BILINEAR, fillcolor=0), dtype=np.float32)
        score = float(np.var(r.sum(axis=1)))
        if score > best:
            best, best_a = score, float(a)
    return best_a

def flatten_edge(a, side, span_frac=0.10):
    """Lift a spine shadow: the page darkens towards the gutter over the last
    few per cent of its width (Empower B1's right-hand edge runs 120 -> 180
    over forty pixels), and a scanned spread leaves a darker stripe a little
    way in from the edge (Roadmap). Per column (or row), the background level
    is the 90th percentile of luminance -- paper or panel, not ink -- and any
    column in the edge zone whose background sits more than 15 below the
    zone's interior is scaled up to meet it, every channel alike, so ink and
    colour keep their relation. A design that is simply dark along an edge is
    left alone: the zone's deepest point has to fall under 85% of the interior
    and the dip has to be at least eight pixels wide."""
    H, W = a.shape[:2]
    lum = a.mean(axis=2)
    horizontal = side in ('left', 'right')
    n = int((W if horizontal else H) * span_frac)
    if n < 12: return False
    idx = (list(range(n)) if side in ('left', 'top') else list(range((W if horizontal else H) - 1, (W if horizontal else H) - 1 - n, -1)))
    def col(i): return lum[:, i] if horizontal else lum[i, :]
    b = np.array([np.percentile(col(i), 90) for i in idx], dtype=np.float32)
    k = 5; bs = np.convolve(np.pad(b, (k // 2, k // 2), mode='edge'), np.ones(k) / k, mode='valid')
    ref = float(np.median(bs[-max(10, n // 5):]))
    if ref < 60: return False
    dip = bs < ref - 15
    if dip.sum() < 8 or bs.min() > 0.85 * ref: return False
    # A DIP THAT TOUCHES THE EDGE IS THE GUTTER ITSELF -- the curve of the page
    # into the spine, staples and all. Lightening it left the seam showing
    # (Empower B1 p. 10, seen on Lite, 11 Oct 2026); it is cut off instead, and
    # only a dip that sits inside the page (Roadmap's stripe) is lifted.
    lead = 0
    while lead < len(dip) and dip[lead]: lead += 1
    if lead == 0 and len(dip) > 2 and dip[1] and dip[2]: lead = 2          # a one-pixel white border before it
    while lead < len(dip) and dip[lead]: lead += 1
    # Only a SIDE is cut, at most 5% of the width, and only when the strip is
    # grey: a dark header or a photograph along the top or bottom of a page
    # dipped the same way and was cut off on seventy pages (11 Oct 2026).
    if lead >= 8 and horizontal and lead <= int(W * 0.05):
        cols = idx[:lead]
        strip = a[:, min(cols):max(cols) + 1, :]
        if float((strip.max(axis=2) - strip.min(axis=2)).mean()) < 40:
            return ('cut', min(lead + 3, n))
    for j, i in enumerate(idx):
        if not dip[j]: continue
        f = min(2.2, max(1.0, ref / max(bs[j], 1.0)))
        if horizontal: a[:, i, :] = np.minimum(255.0, a[:, i, :] * f)
        else: a[i, :, :] = np.minimum(255.0, a[i, :, :] * f)
    return True

def band_width(lum, sat, paper, side):
    """How many pixels of grey band to take off one side, 0 when there is none.
    Walks inward while the line of pixels is dark along most of its length and
    colourless where dark; stops at 6% of the page so a dark-bordered design
    is never eaten."""
    H, W = lum.shape
    limit = int((W if side in ('left', 'right') else H) * 0.06)
    def line(i):
        if side == 'left': return lum[:, i], sat[:, i]
        if side == 'right': return lum[:, W - 1 - i], sat[:, W - 1 - i]
        if side == 'top': return lum[i, :], sat[i, :]
        return lum[H - 1 - i, :], sat[H - 1 - i, :]
    n = 0
    for i in range(limit):
        l, s = line(i)
        dark = l < paper - 50
        if dark.mean() < 0.7 or (s[dark].mean() if dark.any() else 99) > 40:
            break
        n += 1
    return n + 3 if n else 0       # three pixels of the soft edge go with it

def polish(path, book=None, page=None, out=None, quality=None):
    img = Image.open(path).convert('RGB')
    a = np.asarray(img, dtype=np.float32)
    g = a.mean(axis=2)
    paper = paper_of(g)
    did = []

    # stamps first: they are placed by page-relative coordinates of the page as rendered
    for (x0, y0, x1, y1) in stamps_for(book, page):
        H, W = g.shape
        X0, Y0, X1, Y1 = int(x0 * W), int(y0 * H), int(np.ceil(x1 * W)), int(np.ceil(y1 * H))
        pad = max(2, int(0.004 * W))
        X0, Y0, X1, Y1 = max(0, X0 - pad), max(0, Y0 - pad), min(W, X1 + pad), min(H, Y1 + pad)
        ring = np.concatenate([a[max(0, Y0 - 6):Y0, X0:X1].reshape(-1, 3), a[Y1:min(H, Y1 + 6), X0:X1].reshape(-1, 3)]) if Y1 > Y0 else a[Y0:Y1, X0:X1].reshape(-1, 3)
        fill = np.median(ring, axis=0) if len(ring) else np.array([255, 255, 255], dtype=np.float32)
        a[Y0:Y1, X0:X1] = fill
        did.append('stamp')
    if did:
        img = Image.fromarray(a.astype(np.uint8)); g = a.mean(axis=2)

    # tilt
    angle = skew_of(g)
    if abs(angle) >= 0.5:
        # TURNED, THEN MEASURED AGAIN. The projection profile reads most pages
        # one way and a few the other (Empower B1 p. 70 read -2.25 and came
        # straight turned by -2.25; eighteen other pages came straight turned
        # by +angle). So both turns are tried and the straighter page kept --
        # and a page that neither turn straightens is left as it was.
        best, best_s = None, abs(angle)
        for turn in (angle, -angle):
            cand = img.rotate(turn, resample=Image.BICUBIC, expand=False, fillcolor=(int(paper),) * 3)
            s_ = abs(skew_of(np.asarray(cand, dtype=np.float32).mean(axis=2)))
            if s_ < best_s - 0.2: best, best_s = (cand, turn), s_
        if best:
            img = best[0]; a = np.asarray(img, dtype=np.float32); g = a.mean(axis=2)
            did.append(f'deskew {best[1]:+.2f} -> {best_s:.2f}')

    # the shadow towards the gutter, lifted before any band is measured
    lifted, cut = [], {}
    for sd in ('left', 'right', 'top', 'bottom'):
        r_ = flatten_edge(a, sd)
        if r_ is True: lifted.append(sd)
        elif r_: cut[sd] = r_[1]
    if lifted or cut:
        img = Image.fromarray(a.astype(np.uint8))
        if cut:
            H, W = a.shape[:2]
            img = img.crop((cut.get('left', 0), cut.get('top', 0), W - cut.get('right', 0), H - cut.get('bottom', 0)))
            a = np.asarray(img, dtype=np.float32)
        g = a.mean(axis=2)
        if lifted: did.append('shadow ' + ','.join(lifted))
        if cut: did.append('gutter ' + ','.join(f'{k}{v}' for k, v in cut.items()))

    # bands
    sat = a.max(axis=2) - a.min(axis=2)
    cut = {s: band_width(g, sat, paper, s) for s in ('left', 'right', 'top', 'bottom')}
    if any(cut.values()):
        H, W = g.shape
        img = img.crop((cut['left'], cut['top'], W - cut['right'], H - cut['bottom']))
        did.append('bands ' + ','.join(f'{s}{n}' for s, n in cut.items() if n))

    if out:
        img.save(out, quality=quality or 84)
    return img, did

if __name__ == '__main__':
    import sys
    _, src, dst = sys.argv[:3]
    book = sys.argv[3] if len(sys.argv) > 3 else None
    page = int(sys.argv[4]) if len(sys.argv) > 4 else None
    _, did = polish(src, book, page, dst)
    print(dst, did or 'nothing to do')
