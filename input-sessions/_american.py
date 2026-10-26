# American spelling for the input sessions (Ramy, 26 Oct 2026: "input sessions are also American. Instructions are
# from me. They're not from Cambridge. If there is a British word, fine. Some of the phonology sessions I understand").
# Run by _house.py on every page it builds, and once on the hand-made pages. Touches only visible words: text between
# tags, placeholder/title/aria-label/alt/content attributes, and prose inside script strings; never a code name, a
# class, a CSS variable (--grey), a word joined to a hyphen, or a string holding CSS. Two things keep their spelling:
# the sessions that teach British English sounds (BRITISH), and any sentence the house voices have recorded, because
# a recording is found by its exact words (audio/lines.json); changing one would hand it to the robot voice.
import re, json, pathlib
BRITISH = {'phonology-sounds', 'word-and-sentence-stress', 'connected-speech'}
VOICED = []          # the recorded lines of the page being treated, normalised
def _norm(t): return re.sub(r'[^a-z0-9]+', ' ', str(t).lower()).strip()
W = {
 'centre':'center','centres':'centers','colour':'color','colours':'colors','coloured':'colored','behaviour':'behavior','behaviours':'behaviors',
 'favourite':'favorite','favourites':'favorites','organise':'organize','organised':'organized','organising':'organizing','organisation':'organization','organisations':'organizations',
 'recognise':'recognize','recognised':'recognized','recognising':'recognizing','realise':'realize','realised':'realized','practise':'practice','practised':'practiced','practising':'practicing',
 'programme':'program','programmes':'programs','licence':'license','enrol':'enroll','enrolled':'enrolled','enrolment':'enrollment','travelling':'traveling','travelled':'traveled',
 'cancelled':'canceled','cancelling':'canceling','labelled':'labeled','labelling':'labeling','modelled':'modeled','modelling':'modeling','grey':'gray','greyed':'grayed',
 'catalogue':'catalog','analyse':'analyze','analysed':'analyzed','analysing':'analyzing','summarise':'summarize','summarised':'summarized','prioritise':'prioritize',
 'emphasise':'emphasize','apologise':'apologize','personalise':'personalize','personalised':'personalized','minimise':'minimize','maximise':'maximize','specialise':'specialize',
 'specialised':'specialized','categorise':'categorize','memorise':'memorize','finalise':'finalize','finalised':'finalized','criticise':'criticize','utilise':'utilize',
 'authorise':'authorize','authorised':'authorized','customise':'customize','customised':'customized','optimise':'optimize','standardise':'standardize','visualise':'visualize',
 'synchronise':'synchronize','synchronised':'synchronized','defence':'defense','judgement':'judgment','ageing':'aging','fulfil':'fulfill','enquiry':'inquiry','enquiries':'inquiries',
 'learnt':'learned','spelt':'spelled','whilst':'while','amongst':'among','cheque':'check','jewellery':'jewelry','travellers':'travelers','traveller':'traveler',
 'counselling':'counseling','levelled':'leveled','signalled':'signaled','fuelled':'fueled','towards':'toward','afterwards':'afterward','storey':'story','tonne':'ton',
 'colourful':'colorful','honour':'honor','humour':'humor','neighbour':'neighbor','neighbours':'neighbors','labour':'labor','rumour':'rumor','flavour':'flavor','harbour':'harbor',
 'favour':'favor','favours':'favors','endeavour':'endeavor','theatre':'theater','metre':'meter','metres':'meters','litre':'liter','fibre':'fiber','manoeuvre':'maneuver',
 'aluminium':'aluminum','mum':None,'pyjamas':'pajamas','plough':'plow','tyre':'tire','kerb':'curb','sceptical':'skeptical','dialled':'dialed','enrols':'enrolls',
 'acknowledgement':'acknowledgment','ensures':None,'focussed':'focused','focussing':'focusing','skilful':'skillful','instalment':'installment','wilful':'willful',
}
W = {k:v for k,v in W.items() if v}
# keep: words used as dialogue examples, ELT terms written the same both ways
PAT = re.compile(r"(?<![-\w])(" + "|".join(sorted(W, key=len, reverse=True)) + r")(?![-\w])", re.I)
def amer(m):
    if VOICED:
        seg = _norm(m.string[max(0, m.start()-40):m.end()+40])
        mid = ' '.join(seg.split()[1:-1]) if len(seg.split()) > 2 else seg
        if any(mid in v for v in VOICED): return m.group(0)
    w = m.group(0); a = W[w.lower()]
    before = m.string[max(0, m.start()-9):m.start()]
    if w == 'Centre' and re.search(r'(English|Language|Training) $', before): return w     # a proper name
    if w.isupper(): return a.upper()
    if w[0].isupper(): return a[0].upper() + a[1:]
    return a
SAFE_ATTR = re.compile(r'(\b(?:placeholder|title|aria-label|alt|content|data-say|data-title)\s*=\s*)("([^"]*)"|\'([^\']*)\')', re.I)
def fix_markup(t, count):
    # tags: only safe attributes; text between tags: everything
    out = []; pos = 0
    for m in re.finditer(r'<[^<>]*>', t):
        txt = t[pos:m.start()]
        new = PAT.sub(amer, txt); count[0] += len(PAT.findall(txt)); out.append(new)
        tag = m.group(0)
        def fa(a):
            q = a.group(2); inner = q[1:-1]; n = PAT.sub(amer, inner); count[0] += len(PAT.findall(inner)); return a.group(1) + q[0] + n + q[-1]
        out.append(SAFE_ATTR.sub(fa, tag)); pos = m.end()
    txt = t[pos:]; out.append(PAT.sub(amer, txt)); count[0] += len(PAT.findall(txt))
    return ''.join(out)
STR = re.compile(r"""('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)""")
def fix_js(code, count):
    # skip comments: only touch string literals
    def fs(m):
        s = m.group(0); q = s[0]; inner = s[1:-1]
        if ' ' not in inner: return s
        if re.match(r'^\s*[\.#\[]?[a-z-]+\s*\{', inner): return s           # CSS in a string
        if re.search(r'[\w\]\)\*]\s*\{[^{}]*:[^{}]*\}', inner) or re.search(r'(?:^|[;{\s])[a-z-]+\s*:\s*var\(', inner): return s   # CSS rules or declarations
        if re.search(r'(?:querySelector|getElementById|classList)\s*$', code[max(0, m.start()-40):m.start()]): return s
        if q == '`' and '${' in inner:
            # only the literal parts between ${...}
            parts = re.split(r'(\$\{[^}]*\})', inner)
            parts = [p if p.startswith('${') else fix_markup(p, count) for p in parts]
            return q + ''.join(parts) + q
        return q + fix_markup(inner, count) + q
    return STR.sub(fs, code)
def fix_html(t, count):
    out = []; pos = 0
    for m in re.finditer(r'(<script\b[^>]*>)(.*?)(</script>)|(<style\b[^>]*>.*?</style>)|(<!--.*?-->)', t, re.S):
        out.append(fix_markup(t[pos:m.start()], count))
        if m.group(1): out.append(m.group(1) + fix_js(m.group(2), count) + m.group(3))
        else: out.append(m.group(0))
        pos = m.end()
    out.append(fix_markup(t[pos:], count))
    return ''.join(out)

def american(page, slug, here=None):
    """The page in American spelling, unless the session teaches British English."""
    global VOICED
    if slug in BRITISH: return page
    VOICED = []
    lj = (here or pathlib.Path(__file__).resolve().parent) / slug / 'audio' / 'lines.json'
    if lj.exists():
        try: VOICED = [_norm(l.get('text', '')) for l in json.loads(lj.read_text(encoding='utf-8')).get('lines', [])]
        except Exception: VOICED = []
    count = [0]
    out = fix_html(page, count)
    VOICED = []
    return out
