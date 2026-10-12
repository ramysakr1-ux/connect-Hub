# Connect Lite — TP points tour, Film 1 "Thirteen books", re-cut from REAL Lite screens (12 Oct 2026).
# Keeps the designer's frame, captions, timing and music; the screens are the real library page and
# the course's TP point sets screen, shot by shoot1.mjs on the scratch course with every write blocked.
# The page cutter runs on a placeholder book whose pages carry only their numbers.
#
#   python3 build-film1.py <shots dir> <designer's fixed bundle> <out.html>
import sys, re, json, base64, gzip, io
from PIL import Image
SHOTS, SRC, OUT = sys.argv[1:4]
M = json.load(open(f'{SHOTS}/meta.json'))
VW, VH = 560, 657
K = 900 / VW                    # film pixels per CSS pixel in the window
X0, Y0 = 90, 320 + 44           # the window's page area, under its 44px address bar

def uri(name, q=84):
    im = Image.open(f'{SHOTS}/{name}.png').convert('RGB')
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
def tap(r, dx=None):
    return round(X0 + (r['x'] + (r['w'] / 2 if dx is None else dx)) * K), round(Y0 + (r['y'] + r['h'] / 2) * K)

names = ['sets', 'library', 'lesson', 'take-a', 'take-b', 'pages-a', 'pages-b', 'pages-c', 'pages-d',
         'yours-a', 'yours-b', 'yours-c', 'yours-d', 'import-a', 'import-b']
IMG = {n: uri(n) for n in names}; IMG['card'] = uri('card', 88)
cw, ch = M['card']['width'], M['card']['height']
V = dict(IMG=json.dumps(IMG), K=f'{K:.6f}',
  LIBS=round(M['library']['h'] - VH), LESS=round(M['lesson']['h'] - VH), IMPS=round(M['import-b']['h'] - VH),
  CARDH=round(900 * ch / cw),
  TX=tap(M['takeBtn'])[0], TY=tap(M['takeBtn'])[1], SX=tap(M['subIn'], 120)[0], SY=tap(M['subIn'], 120)[1],
  MX=tap(M['minsIn'], 40)[0], MY=tap(M['minsIn'], 40)[1], IX=tap(M['impBtn'])[0], IY=tap(M['impBtn'])[1],
  PX=tap(M['pdfBtn'])[0], PY=tap(M['pdfBtn'])[1], Y1X=tap(M['yes1'])[0], Y1Y=tap(M['yes1'])[1], Y2X=tap(M['yes2'])[0], Y2Y=tap(M['yes2'])[1])

jsx = r'''// TP points · the tour — Film 1, "Thirteen books", RE-CUT FROM REAL SCREENS (12 Oct 2026).
// The designer's frame, captions and timing; the screens are the real library page and the course's
// TP point sets screen, shot on the scratch course with every write blocked. The page cutter runs on
// a placeholder book whose pages carry only their page numbers. Built by film/recut/build-film1.py.

const { T_LINE, T_PAPER, T_SURF, T_BOX, T_INKW, T_GREY, T_TEALD, T_SANS, BAND, Press, Scene } = window.TT_UI;
const { TourOpen, TourEnd } = window.TOUR_UI;
const IMG = __IMG__;
const KX = __K__;
const ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const prog = (t, a, b) => ease(clamp((t - a) / Math.max(0.01, b - a), 0, 1));
const fadeIn = (t, at, d = 0.4) => clamp((t - at) / d, 0, 1);
// a browser window with the page's real address; the page itself is a real screen
const Win = ({ url, children, op = 1 }) => <div style={{ position: 'absolute', left: 90, top: 320, width: 900, height: 1100,
  borderRadius: 16, overflow: 'hidden', background: T_PAPER, border: `1px solid ${T_LINE}`, opacity: op,
  boxShadow: '0 50px 90px -40px oklch(25% 0.04 60 / .55)' }}>
  <div style={{ height: 44, boxSizing: 'border-box', background: 'oklch(93% 0.012 84)', borderBottom: `1px solid ${T_LINE}`,
    display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px' }}>
    {[0, 1, 2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(82% 0.02 80)' }} />)}
    <span style={{ marginLeft: 14, flex: 1, height: 28, borderRadius: 8, background: T_PAPER, display: 'flex', alignItems: 'center',
      padding: '0 12px', font: `500 15px ${T_SANS}`, color: T_GREY, whiteSpace: 'nowrap', overflow: 'hidden' }}>{url}</span>
  </div>
  <div style={{ position: 'absolute', left: 0, top: 44, width: 900, height: 1056, overflow: 'hidden' }}>{children}</div>
</div>;
const Shot = ({ src, t, y0 = 0, y1 = 0, a = 0, b = 1, op = 1 }) => {
  const y = y0 + (y1 - y0) * prog(t, a, b);
  return <img src={src} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 900, display: 'block', opacity: op,
    transform: `translateY(${-y * KX}px)` }} />;
};
const SETS = 'lite.celtaconnect.com/28_tp_point_sets.html', LIB = 'lite.celtaconnect.com/library/';

// 1 · the desk, then the course's TP point sets screen
function R1a({ t, dur }) {
  const desk = 1 - MOTION.enter(t, 1.6, 0.7), win = MOTION.enter(t, 1.9, 0.8);
  return <Scene t={t} dur={dur} say="Every teaching practice needs a lesson. Every lesson needs a page in a book.">
    {/* A quiet desk: a closed plain notebook, a pen, a mug. Nothing with a cover on it. */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: BAND - 300, height: 600, opacity: desk,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 44 }}>
      <div style={{ width: 420, height: 300, borderRadius: 14, background: T_SURF, border: `1px solid ${T_LINE}`,
        boxShadow: '0 30px 60px -36px oklch(25% 0.04 60 / .5)', transform: 'rotate(-3deg)' }}>
        <div style={{ width: 8, height: '100%', background: T_TEALD, borderRadius: '14px 0 0 14px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
        <div style={{ width: 210, height: 10, borderRadius: 6, background: T_INKW, transform: 'rotate(8deg)' }} />
        <div style={{ width: 150, height: 150, borderRadius: '12px 12px 60px 60px', background: T_BOX, border: `1px solid ${T_LINE}` }} />
      </div>
    </div>
    <Win url={SETS} op={win}><Shot src={IMG['sets']} t={t} /></Win>
  </Scene>;
}
// 2 · the public library page
function R1b({ t, dur }) {
  return <Scene t={t} dur={dur} say="Thirteen books. Thirteen sets. Every level a centre runs.">
    <Win url={LIB}><Shot src={IMG['library']} t={t} y0={0} y1={__LIBS__} a={1.1} b={5.0} /></Win>
  </Scene>;
}
// 3 · one card, close
function R1c({ t, dur }) {
  const a = MOTION.enter(t, 0.2, 0.8);
  return <Scene t={t} dur={dur} say="Thirty-six lessons a set. Grammar, vocabulary, the four skills, all in proportion.">
    <div style={{ position: 'absolute', left: 90, width: 900, top: BAND, transform: `translateY(-50%) scale(${0.96 + 0.04 * a})`, opacity: a,
      borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 80px -36px oklch(25% 0.04 60 / .5)' }}>
      <img src={IMG['card']} alt="" style={{ width: 900, height: __CARDH__, display: 'block' }} />
    </div>
  </Scene>;
}
// 4 · inside one lesson of the set: the aims, the stages, the watch-outs, the clock
function R1d({ t, dur }) {
  return <Scene t={t} dur={dur} say="Each one staged, timed, with the traps marked.">
    <Win url={SETS}><Shot src={IMG['lesson']} t={t} y0={0} y1={__LESS__} a={1.2} b={6.0} /></Win>
  </Scene>;
}
// 5 · taking a set onto the course
function R1e({ t, dur }) {
  const on = fadeIn(t, 2.6, 0.35);
  return <Scene t={t} dur={dur} say="One press, and the whole course of lessons is on your course.">
    <Win url={SETS}>
      <Shot src={IMG['take-a']} t={t} op={1 - on} />
      <Shot src={IMG['take-b']} t={t} op={on} />
    </Win>
    <Press x={__TX__} y={__TY__} t={t} at={1.9} />
  </Scene>;
}
// 6 · and it is yours: an aim rewritten, a timing trimmed, the clock follows
function R1f({ t, dur }) {
  const b = fadeIn(t, 1.3, 0.3), c = fadeIn(t, 2.7, 0.35), d = fadeIn(t, 3.8, 0.3);
  return <Scene t={t} dur={dur} say="And it’s yours. Change a stage, a timing, an aim. Nothing goes back to the library.">
    <Win url={SETS}>
      <Shot src={IMG['yours-a']} t={t} op={(1 - b) * (1 - c)} />
      <Shot src={IMG['yours-b']} t={t} op={b * (1 - c)} />
      <Shot src={IMG['yours-c']} t={t} op={c * (1 - d)} />
      <Shot src={IMG['yours-d']} t={t} op={d} />
    </Win>
    <Press x={__SX__} y={__SY__} t={t} at={0.6} />
    <Press x={__MX__} y={__MY__} t={t} at={3.1} />
  </Scene>;
}
// 7 · bring your own: a Word document, read into stages
function R1g({ t, dur }) {
  const on = fadeIn(t, 1.7, 0.35);
  return <Scene t={t} dur={dur} say="Already have your own? Bring the file. Lite reads it into stages.">
    <Win url={SETS}>
      <Shot src={IMG['import-a']} t={t} op={1 - on} />
      <Shot src={IMG['import-b']} t={t} op={on} y0={0} y1={__IMPS__} a={2.2} b={4.7} />
    </Win>
    <Press x={__IX__} y={__IY__} t={t} at={0.8} />
  </Scene>;
}
// 8 · the pages, cut from the centre's own copy of the book (a placeholder book here)
function R1h({ t, dur }) {
  const b = fadeIn(t, 1.3, 0.3), c = fadeIn(t, 2.6, 0.3), d = fadeIn(t, 3.8, 0.3);
  return <Scene t={t} dur={dur} say="Point it at your copy of the book, and it cuts out exactly the pages the set teaches from.">
    <Win url={SETS}>
      <Shot src={IMG['pages-a']} t={t} op={(1 - b)} />
      <Shot src={IMG['pages-b']} t={t} op={b * (1 - c)} />
      <Shot src={IMG['pages-c']} t={t} op={c * (1 - d)} />
      <Shot src={IMG['pages-d']} t={t} op={d} />
    </Win>
    <Press x={__PX__} y={__PY__} t={t} at={0.6} />
    <Press x={__Y1X__} y={__Y1Y__} t={t} at={1.9} />
    <Press x={__Y2X__} y={__Y2Y__} t={t} at={3.2} />
  </Scene>;
}

function R1Open({ t, dur }) {
  return <TourOpen t={t} dur={dur} title="TP points · the library">
    <div style={{ display: 'flex', justifyContent: 'center' }}><img src={IMG['library']} alt="" style={{ width: 760, display: 'block' }} /></div>
  </TourOpen>;
}
function R1End({ t, dur }) { return <TourEnd t={t} dur={dur} n="1" line="Pick the book. The course of lessons is already written." />; }

window.TourFilm1 = window.TT_UI.makeRoot(
  { Open: R1Open, Desk: R1a, Library: R1b, Card: R1c, Lesson: R1d, Take: R1e, Yours: R1f, Import: R1g, Pages: R1h, End: R1End },
  ['Open', 'End']);
'''
for k, v in V.items(): jsx = jsx.replace(f'__{k}__', str(v))
left = re.findall(r'__[A-Z0-9]+__', jsx); assert not left, left
s = open(SRC, encoding='utf-8').read()
m = re.search(r'(<script type="__bundler/manifest"[^>]*>)(.*?)(</script>)', s, re.S)
man = json.loads(m.group(2).strip()); hit = 0
for k, v in man.items():
    if not v.get('compressed'): continue
    try: txt = gzip.decompress(base64.b64decode(v['data'])).decode('utf-8')
    except Exception: continue
    if 'window.TourFilm1 =' in txt:
        v['data'] = base64.b64encode(gzip.compress(jsx.encode('utf-8'))).decode('ascii'); hit += 1
assert hit == 1, hit
s = s[:m.start(2)] + json.dumps(man, separators=(',', ':')) + s[m.end(2):]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, f'{len(s)/1048576:.1f} MB', {k: v for k, v in V.items() if k != 'IMG'})
