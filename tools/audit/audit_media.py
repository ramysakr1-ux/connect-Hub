"""The library audit's measurements of the files themselves: page scans and recordings.

    python3 audit_media.py images <cache>/img <out.json>
    python3 audit_media.py audio  <cache>/aud <out.json>

Ramy, 11 Oct 2026: every set in the Connect library -- ours and a contributor's -- has to
pass one audit, and the scans are part of it: "some of those scanned copies ... the side
sort of part ... we should clean that up". This file only MEASURES; audit.mjs decides what
a measurement means for a set. Results are cached by file id, so a re-run measures only
what is new.
"""
import json, os, re, subprocess, sys, statistics
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OCR = os.path.join(HERE, '..', 'ocr')

# ---------------------------------------------------------------- pages
def lum(img):
    return np.asarray(img.convert('L'), dtype=np.float32)

def edges(g):
    """Mean brightness of a strip 2.5% wide along each side, against the page's
    paper. A spine shadow or the scanner bed shows as one side far darker than
    the paper; a photograph that runs to the edge is darker too, which is why
    it is reported against the page's own paper, and read by a person."""
    h, w = g.shape
    sw, sh = max(4, int(w * 0.025)), max(4, int(h * 0.025))
    return {'left': float(g[:, :sw].mean()), 'right': float(g[:, -sw:].mean()),
            'top': float(g[:sh, :].mean()), 'bottom': float(g[-sh:, :].mean())}

def paper(g):
    """The commonest bright value is the paper (the same reading clean.py uses)."""
    h = np.bincount(g[g > 120].astype(np.uint8).ravel(), minlength=256)
    return float(np.argmax(h[120:]) + 120) if h[120:].max() else 255.0

def blur(g):
    """Variance of a Laplacian on a page brought to 1000px wide: low means soft."""
    h, w = g.shape
    s = 1000 / w
    small = np.asarray(Image.fromarray(g.astype(np.uint8)).resize((1000, max(1, int(h * s)))), dtype=np.float32)
    lap = (-4 * small[1:-1, 1:-1] + small[:-2, 1:-1] + small[2:, 1:-1] + small[1:-1, :-2] + small[1:-1, 2:])
    return float(lap.var())

def skew(g):
    """The angle that makes the rows of ink most distinct (a projection profile),
    searched from -3 to +3 degrees on a small copy of the page."""
    img = Image.fromarray((255 - g).astype(np.uint8))
    img = img.resize((600, max(1, int(img.height * 600 / img.width))))
    best, best_a = -1, 0.0
    for a in np.arange(-3, 3.01, 0.25):
        r = np.asarray(img.rotate(a, resample=Image.BILINEAR, fillcolor=0), dtype=np.float32)
        score = float(np.var(r.sum(axis=1)))
        if score > best:
            best, best_a = score, float(a)
    return best_a

def ocr_many(paths):
    out = {p: [] for p in paths}
    for i in range(0, len(paths), 40):
        r = subprocess.run([OCR] + paths[i:i + 40], capture_output=True, text=True)
        cur = None
        for line in r.stdout.splitlines():
            if line.startswith('###PAGE\t'):
                cur = line.split('\t', 1)[1]; continue
            parts = line.split('\t', 2)
            if cur and len(parts) == 3:
                out[cur].append((float(parts[0]), float(parts[1]), parts[2]))
    return out

WATERMARK = re.compile(r'(download|www\.|\.ir\b|\.ru\b|telegram|t\.me|@[a-z0-9_]{3,}|scan(ned)? by|pdf)', re.I)

def folios(lines):
    """Bare page numbers printed in the top or bottom margin."""
    return sorted({int(t) for x, y, t in lines if re.fullmatch(r'\d{1,3}', t.strip()) and (y > 0.9 or y < 0.06)})

def images(src, out_path):
    done = json.load(open(out_path)) if os.path.exists(out_path) else {}
    todo = [f for f in sorted(os.listdir(src)) if f.endswith('.jpg') and f[:-4] not in done]
    if todo:
        texts = ocr_many([os.path.join(src, f) for f in todo])
    for f in todo:
        p = os.path.join(src, f)
        try:
            img = Image.open(p); g = lum(img)
        except Exception as e:
            done[f[:-4]] = {'error': str(e)}; continue
        lines = texts.get(p, [])
        done[f[:-4]] = {
            'w': img.width, 'h': img.height, 'std': float(g.std()),
            'paper': paper(g), 'edges': edges(g), 'blur': blur(g), 'skew': skew(g),
            'folios': folios(lines), 'words': len(lines),
            'watermark': sorted({m.group(0) for _, _, t in lines for m in [WATERMARK.search(t)] if m and not re.fullmatch(r'pdf', m.group(0), re.I)} |
                                {t.strip() for _, _, t in lines if re.search(r'download|\.ir\b|www\.', t, re.I)}),
        }
        if len(done) % 50 == 0:
            json.dump(done, open(out_path, 'w'))
    json.dump(done, open(out_path, 'w'))
    print(f'{len(todo)} pages measured, {len(done)} in all')

# ---------------------------------------------------------------- recordings
def afinfo(p):
    r = subprocess.run(['afinfo', p], capture_output=True, text=True).stdout
    dur = re.search(r'estimated duration:\s*([\d.]+)', r)
    br = re.search(r'bit rate:\s*(\d+)', r)
    fmt = re.search(r'File type ID:\s*(\S+)', r)
    return (float(dur.group(1)) if dur else None, int(br.group(1)) if br else None, fmt.group(1) if fmt else None)

def pcm(p):
    """Decode to 16-bit mono 22.05 kHz with the system's own converter."""
    wav = p + '.wav'
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@22050', '-c', '1', p, wav], capture_output=True)
    if not os.path.exists(wav):
        return None
    with open(wav, 'rb') as fh:
        data = fh.read()
    os.remove(wav)
    i = data.find(b'data')
    if i < 0:
        return None
    return np.frombuffer(data[i + 8:], dtype='<i2').astype(np.float32) / 32768.0

def audio(src, out_path):
    done = json.load(open(out_path)) if os.path.exists(out_path) else {}
    todo = [f for f in sorted(os.listdir(src)) if not f.endswith('.wav') and f.rsplit('.', 1)[0] not in done]
    for n, f in enumerate(todo):
        p = os.path.join(src, f); fid = f.rsplit('.', 1)[0]
        dur, br, fmt = afinfo(p)
        x = pcm(p)
        rec = {'duration': dur, 'bitrate': br, 'format': fmt, 'bytes': os.path.getsize(p)}
        if x is None or not len(x):
            rec['error'] = 'could not be decoded'
        else:
            sr = 22050
            win = sr // 10
            frames = x[: len(x) // win * win].reshape(-1, win)
            rms = np.sqrt((frames ** 2).mean(axis=1)) + 1e-9
            db = 20 * np.log10(rms)
            loud = db > -45
            rec.update({
                'rms_db': float(20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)),
                'peak': float(np.abs(x).max()),
                'clipped': float((np.abs(x) > 0.995).mean()),
                'lead_silence': float(np.argmax(loud) / 10) if loud.any() else dur,
                'silent': bool(not loud.any()),
            })
        done[fid] = rec
        if n % 20 == 0:
            json.dump(done, open(out_path, 'w'))
    json.dump(done, open(out_path, 'w'))
    print(f'{len(todo)} recordings measured, {len(done)} in all')

if __name__ == '__main__':
    kind, src, out = sys.argv[1:4]
    (images if kind == 'images' else audio)(src, out)
