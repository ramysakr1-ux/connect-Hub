# Connect Lite — TP points tour, Film 3 "On the day", re-cut from REAL Lite screens (12 Oct 2026).
# Ramy, 11 Oct: "there's no picture of this library ... They don't show the trainee card ... even
# when the screen says we will embed the PDF inside, it doesn't show it." The designer's cut drew
# every phone screen; this keeps its frame, captions, timing and music and puts the real screens
# in the phone, shot on the scratch course by shoot3.mjs (writes blocked, book pages placeholders).
#
#   python3 build-film3.py <shots dir> <designer's fixed bundle> <out.html>
import sys, re, json, base64, gzip, io
from PIL import Image
SHOTS, SRC, OUT = sys.argv[1:4]
meta = json.load(open(f'{SHOTS}/meta.json'))
K = 612 / 390          # film pixels per CSS pixel: the phone's screen is 612 wide, the page 390
X0, Y0 = 234, 338      # the phone screen's top-left in the 1080 x 1920 frame, under the 54px status bar
VH = 713

def uri(name, q=84):
    im = Image.open(f'{SHOTS}/{name}.png').convert('RGB')
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

def tap(css_x, css_y, top):   # a point on the page -> the film frame
    return round(X0 + css_x * K), round(Y0 + (css_y - top) * K)

M = meta
# every target was measured on screen at the moment of its shot, so its y is already the shot's own
mid = lambda r, dx=None: tap(r['x'] + (r['w'] / 2 if dx is None else dx), r['y'] + r['h'] / 2, 0)
hx, hy = mid(M['homeLink'], 70)
px, py = mid(M['printme'])
plx, ply = mid(M['play'], 50)
cx, cy = mid(M['copyLink'])
fr = M['pagesFrame']; fx, fy = tap(fr['x'] + fr['w'] / 2, fr['y'] + fr['h'] * 0.45, 0)   # the zoom's centre, on the frame
ox, oy = mid(M['openDrive'])
sx, sy = mid(M['tpStartV'], min(M['tpStartV']['w'], 240) / 2)
day_h = M['day']['h']; lesson_h = M['lesson']['h']; others_h = M['others']['h']; planb_h = M['plan-b']['h']

IMG = {n: uri(n) for n in ['invite', 'home', 'day', 'lesson', 'pages', 'track-a', 'track-b', 'print-a', 'others', 'plan-a', 'plan-b']}
IMG['print-sheet'] = uri('print-sheet', 88)

jsx = r'''// TP points · the tour — Film 3, "On the day", RE-CUT FROM REAL SCREENS (12 Oct 2026).
// The designer's frame, captions and timing; in the phone, the real Lite trainee screens, shot on
// the scratch course with every write blocked. No publisher's page is in shot: each page frame
// and the printed sheet carry a placeholder with only its page number. Nothing is audible but the
// film's music. Built by film/recut/build-film3.py from shoot3.mjs's pictures.

const { T_SAND, T_LINE, T_PAPER, T_INK, T_GREY, T_TEAL, T_GOLD, T_SERIF, T_SANS, BAND, Press, Scene } = window.TT_UI;
const { Phone } = window.TP_UI;
const { TourOpen, TourEnd } = window.TOUR_UI;
const IMG = __IMG__;
const KX = __K__;
const ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const prog = (t, a, b) => ease(clamp((t - a) / Math.max(0.01, b - a), 0, 1));
// one real screen in the phone, scrolled from y0 to y1 CSS pixels between a and b seconds
const Shot = ({ src, t, y0 = 0, y1 = 0, a = 0, b = 1, op = 1 }) => {
  const y = y0 + (y1 - y0) * prog(t, a, b);
  return <img src={src} alt="" style={{ position: 'absolute', left: 0, top: 54, width: 612, display: 'block', opacity: op,
    transform: `translateY(${-y * KX}px)` }} />;
};
const fadeIn = (t, at, d = 0.45) => clamp((t - at) / d, 0, 1);

// 1 · the invite card a trainee gets at the start, then home
function R3a({ t, dur }) {
  const home = fadeIn(t, 1.9);
  return <Scene t={t} dur={dur} say="Monday. What am I teaching?">
    <Phone>
      <Shot src={IMG['invite']} t={t} op={1 - home} />
      <Shot src={IMG['home']} t={t} op={home} />
    </Phone>
    <Press x={__HX__} y={__HY__} t={t} at={2.9} />
  </Scene>;
}
// 2 · the day: their TP, the slot, the topic
function R3b({ t, dur }) {
  return <Scene t={t} dur={dur} say="The day, the slot, the topic. Mine first.">
    <Phone><Shot src={IMG['day']} t={t} y0={0} y1={__DAYS__} a={1.2} b={4.3} /></Phone>
  </Scene>;
}
// 3 · their lesson and the procedure
function R3c({ t, dur }) {
  return <Scene t={t} dur={dur} say="The aim, the shape, every stage and its minutes.">
    <Phone><Shot src={IMG['lesson']} t={t} y0={0} y1={__LESS__} a={1.0} b={5.3} /></Phone>
  </Scene>;
}
// 4 · the pages, in the frame on the page
function R3d({ t, dur }) {
  const z = 1 + 0.38 * prog(t, 1.4, 2.3) * (1 - prog(t, 3.3, 3.9));
  return <Scene t={t} dur={dur} say="The pages themselves, right there. Zoom in, or open them in Drive.">
    <Phone>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${__FX__ - 234}px ${__FY__ - 284}px` }}>
        <Shot src={IMG['pages']} t={t} />
      </div>
    </Phone>
    <Press x={__OX__} y={__OY__} t={t} at={4.2} />
  </Scene>;
}
// 5 · the track plays on the page; the link goes with them
function R3e({ t, dur }) {
  const on = fadeIn(t, 1.45, 0.3);
  return <Scene t={t} dur={dur} say="The recording plays here, and the link goes wherever your materials live.">
    <Phone>
      <Shot src={IMG['track-a']} t={t} op={1 - on} />
      <Shot src={IMG['track-b']} t={t} op={on} />
    </Phone>
    <Press x={__PLX__} y={__PLY__} t={t} at={0.8} />
    <Press x={__CX__} y={__CY__} t={t} at={3.2} />
  </Scene>;
}
// 6 · three ways to print; the printed TP point comes out
function R3f({ t, dur }) {
  const sheet = MOTION.enter(t, 1.9, 0.8);
  return <Scene t={t} dur={dur} say="Print the point. Print the pages. Or the whole day as one PDF.">
    <Phone><Shot src={IMG['print-a']} t={t} /></Phone>
    <Press x={__PX__} y={__PY__} t={t} at={1.0} />
    <div style={{ position: 'absolute', left: 150, top: 470, width: 780, height: 980, overflow: 'hidden', borderRadius: 6,
      background: T_PAPER, boxShadow: '0 40px 80px -30px oklch(25% 0.04 60 / .55)', opacity: sheet,
      transform: `translateY(${(1 - sheet) * 60}px)`, zIndex: 25 }}>
      <img src={IMG['print-sheet']} alt="" style={{ width: 780, display: 'block' }} />
    </div>
  </Scene>;
}
// 7 · the other two lessons, marked not theirs
function R3g({ t, dur }) {
  return <Scene t={t} dur={dur} say="The other two lessons too, so the day makes sense. Marked not yours.">
    <Phone><Shot src={IMG['others']} t={t} y0={0} y1={__OTHS__} a={1.0} b={4.9} /></Phone>
  </Scene>;
}
// 8 · into the plan: the skeleton comes across
function R3h({ t, dur }) {
  const on = fadeIn(t, 1.35, 0.35);
  return <Scene t={t} dur={dur} say="Then into the plan. The skeleton comes across. The thinking is still yours.">
    <Phone>
      <Shot src={IMG['plan-a']} t={t} op={1 - on} />
      <Shot src={IMG['plan-b']} t={t} op={on} y0={0} y1={__PLANS__} a={1.9} b={4.6} />
    </Phone>
    <Press x={__SX__} y={__SY__} t={t} at={0.7} />
  </Scene>;
}

function R3Open({ t, dur }) {
  return <TourOpen t={t} dur={dur} title="TP points · on the day">
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img src={IMG['lesson']} alt="" style={{ width: 620, display: 'block' }} />
    </div>
  </TourOpen>;
}
function R3End({ t, dur }) { return <TourEnd t={t} dur={dur} n="3" line="Your lesson, your pages, your slot. Nothing that isn’t yours to plan." />; }

window.TourFilm3 = window.TT_UI.makeRoot(
  { Open: R3Open, Home: R3a, Day: R3b, Lesson: R3c, Pages: R3d, Track: R3e, Print: R3f, Others: R3g, Plan: R3h, End: R3End },
  ['Open', 'End']);
'''
vals = dict(IMG=json.dumps(IMG), K=f'{K:.6f}', HX=hx, HY=hy, DAYS=day_h - VH, LESS=lesson_h - VH, FX=fx, FY=fy, OX=ox, OY=oy,
            PLX=plx, PLY=ply, CX=cx, CY=cy, PX=px, PY=py, OTHS=round(others_h - VH), PLANS=planb_h - VH, SX=sx, SY=sy)
for k, v in vals.items(): jsx = jsx.replace(f'__{k}__', str(v))
assert '__' not in re.sub(r'__(resources|bundler)', '', jsx.replace('window.__', '')), [x for x in re.findall(r'__[A-Z]+__', jsx)]

s = open(SRC, encoding='utf-8').read()
m = re.search(r'(<script type="__bundler/manifest"[^>]*>)(.*?)(</script>)', s, re.S)
man = json.loads(m.group(2).strip()); hit = 0
for k, v in man.items():
    if not v.get('compressed'): continue
    try: txt = gzip.decompress(base64.b64decode(v['data'])).decode('utf-8')
    except Exception: continue
    if 'window.TourFilm3 =' in txt:
        v['data'] = base64.b64encode(gzip.compress(jsx.encode('utf-8'))).decode('ascii'); hit += 1
assert hit == 1, hit
s = s[:m.start(2)] + json.dumps(man, separators=(',', ':')) + s[m.end(2):]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, f'{len(s)/1048576:.1f} MB', {k: v for k, v in vals.items() if k not in ('IMG',)})
