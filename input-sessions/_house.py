#!/usr/bin/env python3
"""Put one of Ramy's input sessions on Lite's desk.

Each session was written for Google Classroom in IH Istanbul's look. The
script and the body are kept; the page's own <style> is dropped for
session.css plus a short block of the parts only that page has; the navy top
bar, progress bar, hero and watermark go, and the paper header, the house
nav and the brand foot take their place. Run from the connect-Hub folder:

    python3 input-sessions/_house.py

Every recipe below names its source (the live IH copy where one exists,
since those carry the review fixes; otherwise the Desktop file) and what
is particular to the page. Nothing in a script is rewritten except the
line that fed the progress bar, which no longer exists.
"""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from _notes import NOTES   # the trainer's side of each session, one block per slug
from _alias import ALIAS   # made-up names and examples, per slug
from _tl import TL         # the target language, marked in green, per slug

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
DESKTOP = pathlib.Path('/Users/work/Desktop/Ramy- materials-interactive/CELTA')

FOOT = '''  <footer class="hub-brand-foot">
    <span class="hub-lockup"><span class="hub-lockup-tile"><svg viewBox="8 30 104 60" width="12" height="7" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="oklch(70% 0.12 72)" stroke-width="13" stroke-linecap="round"/><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="oklch(99.5% 0.004 90)" stroke-width="13" stroke-linecap="round"/></svg></span><span class="hub-lockup-c">Connect</span><span class="hub-lockup-l">Lite</span></span>
    <span>designed and built by <b>Ramy</b></span>
  </footer>'''

# The tutor-link gate (Ramy, 13 Oct 2026: "trainer notes that only trainers
# can see", checked "against the store, not a URL flag"). hub-store.js reads
# ?k= from the link or the key this browser already holds; the store's ping
# answers tutor:true only for a key that opens a course. Nothing else on the
# page talks to the store.
GATE = '''<script src="../../hub-store.js"></script>
<script src="../../hub-notebook.js"></script>
<script>
(function(){
  if (window.InputLib) InputLib.gate();
  if (!window.HubStore || !HubStore.isTutor()) return;
  HubStore.ping().then(function(r){
    if (!r || !r.tutor) return;
    document.body.classList.add('tutor');
    var s = document.getElementById('trainer'); if (s) s.hidden = false;
    var a = document.querySelector('nav.sticky-nav a.tn-link'); if (a) a.hidden = false;
    var b = document.querySelector('.print-btn'); if (b) b.textContent = 'Print with the trainer notes';
    var r = document.getElementById('roleLabel'); if (r) r.textContent = 'Tutor';
  }).catch(function(){});
})();
</script>'''

# Every film starts closed and can be hidden again (Ramy, 14 Oct 2026).
FILM_JS = '''<script>
(function(){
  /* A film with an end time in its address (end=108) is cut there by the
     page itself: YouTube's own end parameter ran on into the rest of the
     video and then into the next one (14 Oct 2026). The player is asked to
     report its clock; at the end time, or when it ends by itself, the frame
     closes, so nothing follows. */
  var open = null;
  window.addEventListener('message', function(e){
    if (!open || !open.iframe || e.source !== open.iframe.contentWindow) return;
    var d; try { d = JSON.parse(e.data); } catch (x) { return; }
    if (!d || d.event !== 'infoDelivery' || !d.info) return;
    var t = d.info.currentTime, st = d.info.playerState;
    if ((open.end && t != null && t >= open.end) || st === 0) { open.close(); return; }
    /* data-skip="26.5-89": a stretch of the film the session does not need
       (Ramy, 20 Oct 2026: the Hamlet sketch's first conversation). The
       player jumps past it; nothing is cut from the film itself. */
    if (open.skip && t != null && t >= open.skip[0] && t < open.skip[1]) {
      try { open.iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [open.skip[1], true] }), '*'); } catch (x) {}
    }
  });
  /* A film kept beside the page: a native player in the same frame. */
  document.querySelectorAll('.film[data-video]').forEach(function(f){
    var btn = f.querySelector('.film-btn'); if (!btn) return;
    var hide = (btn.textContent || '').replace(/^Watch/, 'Hide');
    function close(){ var v = f.querySelector('video'); if (v) { try { v.pause(); } catch (x) {} } f.innerHTML = ''; f.classList.add('closed'); f.appendChild(btn); var a = f.parentNode.querySelector('.film-acts'); if (a) a.remove(); }
    btn.addEventListener('click', function(){
      f.classList.remove('closed'); f.innerHTML = '';
      var v = document.createElement('video'); v.src = f.dataset.video; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata'; v.title = f.dataset.title || 'Film';
      v.addEventListener('ended', close); f.appendChild(v);
      var acts = document.createElement('p'); acts.className = 'film-acts';
      var c = document.createElement('button'); c.type = 'button'; c.className = 'btn'; c.textContent = hide; c.addEventListener('click', close);
      acts.appendChild(c); f.parentNode.insertBefore(acts, f.nextSibling);
    });
  });
  document.querySelectorAll('.film[data-src]').forEach(function(f){
    var btn = f.querySelector('.film-btn'); if (!btn) return;
    var end = (f.dataset.src.match(/[?&]end=(\\d+)/) || [])[1];
    var skip = (f.dataset.skip || '').split('-').map(Number); if (skip.length !== 2 || isNaN(skip[0]) || isNaN(skip[1])) skip = null;
    function close(){ try { if (open && open.iframe) open.iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }), '*'); } catch (x) {} open = null; f.innerHTML = ''; f.classList.add('closed'); f.appendChild(btn); var a = f.parentNode.querySelector('.film-acts'); if (a) a.remove(); }
    btn.addEventListener('click', function(){
      f.classList.remove('closed'); f.innerHTML = '';
      var i = document.createElement('iframe'); i.src = f.dataset.src + (f.dataset.src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1&enablejsapi=1&origin=' + encodeURIComponent(location.origin); i.title = f.dataset.title || 'Film';
      i.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture'; i.allowFullscreen = true; f.appendChild(i);
      open = { iframe: i, end: end ? +end : 0, skip: skip, close: close };
      i.addEventListener('load', function(){ try { i.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'); } catch (x) {} });
      var acts = document.createElement('p'); acts.className = 'film-acts';
      var c = document.createElement('button'); c.type = 'button'; c.className = 'btn'; c.textContent = 'Hide the film'; c.addEventListener('click', close);
      acts.appendChild(c); f.parentNode.insertBefore(acts, f.nextSibling);
    });
  });
})();
</script>'''

def films_closed(page):
    """<div class="film"><iframe src=... title=...></iframe></div> becomes a closed frame with a button."""
    return re.sub(r'<div class="film"><iframe src="([^"]+)" title="([^"]+)"( data-skip="[^"]+")?[^>]*></iframe></div>',
                  lambda m: '<div class="film%s closed" %s="%s" data-title="%s"%s><button type="button" class="btn teal film-btn">Watch the film</button></div>' % (' sd' if m.group(1).endswith('.mp4') else '', 'data-video' if m.group(1).endswith('.mp4') else 'data-src', m.group(1), m.group(2), m.group(3) or ''), page)

def alias(page, slug):
    """Swap in the made-up names and examples; every old string must be there."""
    # a broken bar in an alias string stands for a backslash-u2019 written inside a script string
    esc = chr(92) + 'u2019'
    for old, new in ALIAS.get(slug, []):
        old, new = old.replace('\u00a6', esc), new.replace('\u00a6', esc)
        if old.startswith('re:'):     # a whole array or block, matched by pattern
            pat = old[3:]
            assert re.search(pat, page, flags=re.S), f"{slug}: alias pattern not found: {pat[:70]!r}"
            page = re.sub(pat, lambda m: new, page, count=1, flags=re.S)
            continue
        assert old in page, f"{slug}: alias target not found: {old[:70]!r}"
        page = page.replace(old, new)
    return page

def strip_lengths(page):
    """Ramy, 15 Oct 2026: "remove the lengths from the library's inputs". No page
    states how long a session or a stage runs: the time pills, the minutes in the
    eyebrows and section tags, and the Time chip are all taken out here, in one
    place, so the recipes and the hand-built pages cannot put them back."""
    page = re.sub(r'\s*<span class="time">[^<]*</span>', '', page)
    def eyebrow(m):
        return re.sub(r' \u00b7 \d+(?:(?: to |[\u2013-])\d+)? minutes?', '', m.group(0))
    page = re.sub(r'<(?:p|div) class="eyebrow">[^<]*</(?:p|div)>', eyebrow, page)
    page = re.sub(r'<span class="section-tag">[^<]*</span>', eyebrow, page)
    page = re.sub(r'\s*<div class="su"><div class="k">Time</div><div class="v">\d+ minutes</div></div>', '', page)
    page = page.replace('About 40 minutes: a lead-in,', 'A lead-in,')
    return page

def number_from_nav(page):
    """The workbook (20 Oct 2026): each task shows, in its margin, the number
    its nav label carries ("2 · Word stress" puts a 2 beside #s2). The number
    lives on the section as data-n, so the margin and the nav cannot
    disagree; a label with no number (Lead-in, Debrief) leaves none. Run on
    every page, including the two kept by hand; it is safe to run twice."""
    page = re.sub(r'(<section\b[^>]*?) data-n="\d+"', r'\1', page)
    nav = re.search(r'<nav class="sticky-nav"[^>]*>(.*?)</nav>', page, flags=re.S)
    if not nav:
        return page
    for h, label in re.findall(r'<a href="#([^"]+)"[^>]*>\s*(\d+)\s*\u00b7', nav.group(1)):
        page = re.sub(r'<section id="%s"(?![^>]*data-n)' % re.escape(h), '<section id="%s" data-n="%s"' % (h, label), page, count=1)
    # the numeral is drawn from the card's own attribute: attr() reads only
    # the element it decorates, so the card carries the number too
    page = re.sub(r'<div class="card" data-n="\d+">', '<div class="card">', page)
    page = re.sub(r'(<section [^>]*data-n="(\d+)"[^>]*>\s*<div class="card")>', r'\1 data-n="\2">', page)
    return page

def notes_block(slug):
    """The trainer's side: hidden until the gate opens it."""
    return ('\n\n  <section id="trainer" class="trainer-notes" hidden>\n    <div class="card">\n'
            '      <div class="stage-title">Trainer notes <span class="badge">Tutor only</span></div>\n'
            + '      <div class="guide-box gb-plain tn-box"><div class="gb">\n'
            + NOTES[slug].strip() + '\n      </div></div>\n    </div>\n  </section>')

HEAD = '''<!DOCTYPE html>
<html lang="en" class="gating">
<head>
<!--
  Connect Lite — input session: {title}
  © 2026 Ramy Sakr. All rights reserved.

  Ramy's own session, first written for Google Classroom in IH Istanbul's
  look. This is the same session on Lite's desk: the house header, nav,
  cards and foot come from ../session.css; the parts below are this page's
  own. The script is the source's, untouched. Built by _house.py; edit the
  recipe there, not this file.
-->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="../library.js"></script>
<script src="../voices.js"></script>
<link rel="icon" href="../../brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../../brand/apple-touch-icon.png">
<title>{title} — Connect Lite</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Karla:wght@400;500;600;700&family=Instrument+Serif:ital@1&family=Instrument+Sans:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../hub-tokens.css">
<link rel="stylesheet" href="../session.css">
<style>
{css}
</style>
</head>
<body>
<div class="wrap">

  <div class="chrome">
    <a class="lockup" href="../index.html" title="The library">
      <span class="tile"><svg viewBox="8 30 104 60" width="20" height="12" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"/><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"/></svg></span>
      <span class="hub-pair"><span class="word">Connect</span><span class="hub-word">Lite</span></span>
    </a>
    <div class="role" id="roleLabel">Trainee</div>
  </div>
  <a class="back" href="../index.html">Back to the library</a>

  <header class="header">
    <p class="eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    <p class="sub">{sub}</p>
  </header>

  <nav class="sticky-nav" id="stickyNav">
{nav}
    <a href="#trainer" class="tn-link" hidden>Trainer notes</a>
    <button class="print-btn" onclick="window.print()">Print the handout</button>
  </nav>

'''


def mark_tl(page, slug):
    """Wrap the target language in the examples; every old string must be there."""
    for old, new in TL.get(slug, []):
        assert old in page, f"{slug}: TL target not found: {old[:70]!r}"
        page = page.replace(old, new)
    return page

def build(r):
    src = (ROOT / r['src']).read_text(encoding='utf-8') if not r['src'].startswith('desktop:') \
        else (DESKTOP / r['src'][8:]).read_text(encoding='utf-8')
    # the body between the hero and the script, minus the IH footer line
    root = r.get('open') or ('<div class="%s">' % r.get('root', 'wrap'))
    at = src.index(r['start']) if r.get('start') else 0
    body = src[src.index(root, at) + len(root):src.index(r.get('end', '<script>'))]
    for a, c in r.get('hex', {}).items():      # the drawings' own colours
        body = body.replace(a, c).replace(a.lower(), c)
    body = body.replace('font-family="Nunito,sans-serif"', 'font-family="Karla,sans-serif"')
    body = body[:body.rindex('</div>')]           # the root's own close
    if r.get('h2_sections'):                      # a page of bare h2s becomes sections of cards
        n = [0]
        def sec(m):
            n[0] += 1
            close = '</div></section>\n' if n[0] > 1 else ''
            return close + '<section id="s%d">\n<div class="card">\n<div class="stage-title">%s</div>' % (n[0], m.group(2))
        body = re.sub(r'<h2>(\d+)\. (.*?)</h2>', sec, body)
        body = body + '</div></section>\n'
    if r.get('number_sections'):                  # sections with no id get s1, s2 ...
        n = [0]
        def num(m):
            n[0] += 1
            return '<section id="s%d">' % n[0]
        body = re.sub(r'<section>', num, body)
    body = re.sub(r'\s*<footer class="note">.*?</footer>', '', body, flags=re.S)
    body = re.sub(r' style="--accent:[^"]*"', '', body)   # the IH per-card hues
    for a, c in r.get('swap', []):               # (regex, file in _art/): the drawings redrawn
        art = (HERE / '_art' / c).read_text(encoding='utf-8').strip()
        assert re.search(a, body, flags=re.S), f"{r['slug']}: swap not found: {a[:60]}"
        body = re.sub(a, lambda m: art, body, count=1, flags=re.S)
    for pat in r.get('drop', []):
        assert re.search(pat, body, flags=re.S), f"{r['slug']}: drop not found: {pat[:60]}"
        body = re.sub(pat, '', body, flags=re.S)
    for a, b in r.get('body', []):
        assert a in body, f"{r['slug']}: body edit not found: {a[:60]}"
        body = body.replace(a, b)
    script = src[src.index('<script>'):src.rindex('</script>') + 9]
    for a, c in r.get('script', []):
        assert a in script, f"{r['slug']}: script edit not found: {a[:60]}"
        script = script.replace(a, c)
    # THE SAME ORDER FOR EVERYONE (Ramy, 21 Oct 2026: "make sure the order of
    # the activities is the same for everyone"). The sessions shuffled their
    # matching pills, games and sequences with Math.random, so each trainee in
    # the room saw a different order and the class could not go through it
    # together. Every shuffle now draws from a generator seeded by the
    # session's own name: still mixed, but identical on every device and every
    # reload. A Reshuffle button still moves on through the same sequence.
    seed = sum((i + 1) * ord(ch) for i, ch in enumerate(r['slug'])) % 2147483647 or 1
    script = script.replace('Math.random()', '__lr()')
    script = script.replace('<script>', '<script>\nvar __lrS = ' + str(seed) + '; function __lr(){ __lrS = (__lrS * 16807) % 2147483647; return (__lrS - 1) / 2147483646; }', 1)
    # the progress bar is gone: drop the statement that fed it, not the line
    script = re.sub(r"\s*document\.getElementById\('progressFill'\)\.style\.width\s*=[^;]*;", '', script)
    assert 'progressFill' not in script, f"{r['slug']}: progressFill still referenced"
    nav = '\n'.join('    <a href="#%s">%s</a>' % (h, t) for h, t in r['nav'])
    sources = ('\n\n  <p class="sources"><b>Sources.</b> ' + r['sources'] + '</p>') if r.get('sources') else ''
    page = HEAD.format(title=r['title'], sub=r['sub'], eyebrow=r.get('eyebrow', 'Input session · CELTA'),
                       css=r['css'].strip('\n'), nav=nav) + films_closed(body.strip('\n')) + notes_block(r['slug']) + sources + '\n\n' + FOOT + '\n</div>\n\n' + script + '\n' + FILM_JS + '\n' + GATE + '\n</body>\n</html>\n'
    for bad in ('Nunito', 'Playfair', 'progressFill', 'class="watermark"', 'International House Istanbul'):
        assert bad not in page.replace(sources, '').replace(notes_block(r['slug']), ''), f"{r['slug']}: {bad} still in the page"
    page = number_from_nav(strip_lengths(mark_tl(alias(page, r['slug']), r['slug'])))
    out = HERE / r['slug'] / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(page, encoding='utf-8')
    print('built', out.relative_to(ROOT), len(page))


RECIPES = []

# ---- Eliciting and CCQs ----------------------------------------------------
CLASSROOM = '<section id="s2b">\n<div class="card">\n<div class="stage-title">In the classroom: a dialogue the students build <span class="badge">Watch, then name it</span></div>\n<p class="lead">A teacher gets a whole dialogue out of a class without reading them a line of it. Watch once, with the eleven techniques in front of you. Which do you see, and what do the students say that the teacher never said?</p>\n<div class="film"><iframe src="elicited-dialogue.mp4" title="An elicited dialogue"></iframe></div>\n<p class="lead" style="margin-top:12px"><b>Write as you watch.</b> The techniques you spotted, in order, and the moment you would have given up and told them.</p>\n<textarea class="write-area" rows="4" aria-label="What you saw" placeholder="The techniques, in order, and the moment you would have told them"></textarea>\n<details class="reveal">\n  <summary>Afterwards, in pairs</summary>\n  <div class="content">Compare your lists. Where did the teacher drill before moving on? What did the board look like at the end, and who wrote it? Keep one thing from this film for your next TP, and say what it is.</div>\n</details>\n</div></section>\n'
RECIPES.append(dict(
    slug='eliciting-and-ccqs',
    sources="""The sentences, tasks and examples are made up for this session, on the pattern of the tutor's Concept Checking Techniques handout; the technique of concept questions and time lines follows Graham Workman, <i>Concept Questions and Time Lines</i> (Gem Publishing, 2005). The eleven ways to elicit are the tutor's own list; the classroom moments for the game and the practice words are made up. The classroom film is from the <i>Learning Teaching</i> DVD (Macmillan), held by the tutor.""", src='eliciting-and-ccqs/index.html',
    title='Eliciting and CCQs', sub='Getting language out of students instead of putting it in: why we elicit, a game on eleven ways to do it, a dialogue elicited on film, how a CCQ is built, a worksheet, other ways to check meaning, then your turn.',
    nav=[('s1', '1 · Lead-in'), ('s1b', '2 · Why elicit?'), ('s2', '3 · Technique game'), ('s2b', '4 · In the classroom'), ('s3', '5 · Building CCQs'), ('s5', '6 · CCQ worksheet'), ('s5b', '7 · Checking meaning'), ('s6', '8 · Your turn')],
    css='''
  .word-card{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px 14px; margin:0 0 10px;}
  .word-card .wname{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; color:var(--ink); margin:0 0 4px;}
  .word-card label{display:block; margin-top:8px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600;}
  .word-card .text-block{margin:8px 0 0;}
  .pair-tag{display:inline-flex; align-items:center; font-family:'Karla',sans-serif; font-size:.66rem; font-weight:700; letter-spacing:.04em;
    border-radius:999px; padding:2px 8px; vertical-align:middle; margin-left:6px;
    background:var(--box); border:1px solid var(--sand-line); color:oklch(45% 0.02 70);}
  .game-box{background:var(--surface); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:16px; margin-top:10px;}
  .game-top{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--grey);}
  .game-score{color:var(--teal);}
  .game-scene{font-family:'Newsreader',Georgia,serif; font-size:1.08rem; line-height:1.55; background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--teal); border-radius:var(--r-strip); padding:12px 14px; margin:12px 0;}
  .game-opts{display:flex; flex-wrap:wrap; gap:8px;}
  .tech-btn{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:7px 13px; font-family:'Karla',sans-serif; font-size:.84rem; font-weight:600; color:var(--ink); cursor:pointer; min-height:36px;}
  .tech-btn:hover{border-color:var(--gold);}
  .tech-btn.right{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .tech-btn.miss{border-color:var(--brick); color:var(--brick);}
  .tech-btn:disabled{cursor:default;}
  .game-result{margin-top:12px; font-weight:600; font-size:.92rem; min-height:1.4em;}
  .game-result.good{color:var(--teal);} .game-result.bad{color:var(--brick);}
  .model-steps{display:grid; gap:8px; margin:10px 0;}
  .model-step{display:grid; grid-template-columns:170px 1fr; gap:12px; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:10px 14px; font-size:.92rem; line-height:1.5;}
  .model-step .k{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); padding-top:3px;}
  @media(max-width:640px){ .model-step{grid-template-columns:1fr; gap:2px;} }
  .task-label{font-family:'Newsreader',Georgia,serif; font-weight:600; color:var(--ink); font-size:1.08rem; margin:22px 0 4px;}
  .ccq-list{margin:6px 0 0; padding-left:18px; font-size:.92rem; line-height:1.6;}
  @media print{ .game-box{display:none;} }
''',
    body=[
        ('<section id="s3">', CLASSROOM + '<section id="s3">'),
        ('Spot the Elicitor', 'Spot the elicitor'),
        ('then click to reveal who\'s actually eliciting — and who\'s just telling.', 'then click to reveal who is eliciting and who is telling.'),
        ('Why Do We Elicit? <span', 'Why do we elicit? <span'),
        ('Name the Technique <span', 'Name the technique <span'),
        ('CCQ Worksheet <span', 'CCQ worksheet <span'),
        ('Other Ways to Check Meaning <span', 'Other ways to check meaning <span'),
        ('For items 2&#8211;7,', 'For items 2 to 7,'),
        ('Your Turn <span class="badge">Practice</span>', 'Your turn <span class="badge">Teaching practice</span>'),
        ('For each one: plan how you would elicit it (which technique?), then write one CCQ to check it. Take turns eliciting and CCQ-ing each other\'s words.',
         'For each one, plan how you would elicit it (which technique?), then write one CCQ to check it. Take turns eliciting and checking each other\'s words.'),
    ],
    script=[("font-family:\\'Nunito\\';", "font-family:\\'Karla\\',sans-serif;")],
))

# ---- Error correction ------------------------------------------------------
RECIPES.append(dict(
    slug='error-correction',
    sources="""The attitude statements, the error examples ("Give me one butterbread!", "I'm going to heat you") and the practice tables follow Mark Bartram and Richard Walton, <i>Correction: Mistake Management</i> (Language Teaching Publications, 1991). The decision flow and the correction ideas draw on Jim Scrivener, <i>Learning Teaching</i> (Macmillan), chapter on feedback and correction. Lead-in video: <i>That Mitchell and Webb Look</i>, series 4 (BBC).""", src='desktop:Error-Correction-Input-Session.html',
    title='Error correction', sub='Facilitating self and peer correction of oral errors. Watch the lead-in film first, then work through the six parts.',
    nav=[('s0', 'Lead-in'), ('s2', '1 · Attitudes'), ('s3', '2 · Decision flow'), ('s4', '3 · Match errors'), ('s5', '4 · How to correct'), ('s6', '5 · Practice 1'), ('s7', '6 · Practice 2')],
    css='''
  .header .sub a{color:var(--teal); font-weight:600; text-decoration:underline; text-underline-offset:3px; text-decoration-color:var(--gold);}
  .answer-key{display:none; margin-top:14px; padding:14px 18px; border-radius:var(--r-strip); background:var(--gold-wash); border:1px solid var(--amber-edge);}
  .answer-key.shown{display:block;}
  .answer-key h4{font-family:'Newsreader',Georgia,serif; font-weight:600; margin:0 0 6px; color:var(--gold-deep); font-size:1rem;}
  .answer-key ol{margin:0; padding-left:20px; font-size:.88rem; line-height:1.6;}
  .fill-row > span{flex:1; min-width:200px !important;}
  .flash-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:12px 0 0;}
  @media(max-width:640px){ .flash-grid{grid-template-columns:1fr;} }
  .flash{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; cursor:pointer;
    font-size:.88rem; user-select:none; transition:border-color .12s ease;}
  .flash:hover{border-color:var(--gold);}
  .flash b{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  .flash div{color:var(--grey) !important;}
  .practice-table{width:100%; border-collapse:collapse; margin:12px 0 0; font-size:.86rem;}
  .practice-table th, .practice-table td{border:1px solid var(--sand-line); padding:8px 10px; text-align:left; vertical-align:top; background:var(--paper);}
  .practice-table th{background:var(--gold-wash); color:var(--gold-deep); font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.1em; text-transform:uppercase; font-weight:600;}
  .practice-table input.cell{width:100%; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:6px 8px; font-family:'Karla',sans-serif; font-size:.84rem; background:var(--field); min-width:120px;}
  .practice-table input.cell:focus{outline:none; border-color:var(--gold); background:var(--field-focus);}
  @media(max-width:640px){
    .practice-table, .practice-table tbody, .practice-table tr, .practice-table td{display:block; width:100%;}
    .practice-table tr:first-child{display:none;}
    .practice-table tr{border:1px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:var(--r-control); margin:0 0 10px; padding:8px 10px; background:var(--paper);}
    .practice-table td{border:0; padding:4px 0;}
    .practice-table td:first-child{display:inline; padding-right:6px;}
    .practice-table td:nth-child(2){display:inline; font-weight:500;}
    .practice-table input.cell{min-width:0;}
  }
''',
    body=[
        ('<button class="btn" style="background:linear-gradient(135deg,var(--blue),#5a8fc0);" onclick="checkErrorMatch()">Check answers</button>',
         '<button class="btn teal" onclick="checkErrorMatch()">Check answers</button>'),
        ('<div class="divider"><span>H/O 1</span></div>\n\n', '<section id="s0">\n    <div class="card">\n      <div class="stage-title">Lead-in <span class="badge">Watch</span></div>\n      <p class="lead">Before you watch, read the two questions. Then watch the sketch with them in mind.</p>\n      <ol class="lead">\n        <li>What errors do the speakers make?</li>\n        <li>What do you think of the correction technique?</li>\n      </ol>\n      <div class="film"><iframe src="https://www.youtube-nocookie.com/embed/c3y0CD2CoCs?rel=0&modestbranding=1" title="That Mitchell and Webb Look: Grammar Nazi" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>\n      <p class="film-link">If the frame stays black, <a href="https://youtu.be/c3y0CD2CoCs" target="_blank" rel="noopener">watch it on YouTube</a>.</p>\n      <p class="lead" style="margin-top:10px">After watching, compare your answers with a partner.</p>\n    </div>\n  </section>\n\n  <div class="divider"><span>attitudes</span></div>\n\n'),
        ('<span>H/O 2 — flowchart</span>', '<span>the flowchart</span>'),
        ('<span>H/O 2</span>', '<span>types of error</span>'),
        ('<span>H/O 3</span>', '<span>techniques</span>'),
        ('<span>practice table — 1/2</span>', '<span>practice table, part 1</span>'),
        ('<span>practice table — 2/2</span>', '<span>practice table, part 2</span>'),
        ('Attitudes to Errors &amp; Mistakes', 'Attitudes to errors and mistakes'),
        ('Error Correction — Decision Flow', 'The decision flow'),
        ('Match the Errors with Their Descriptions', 'Match the errors with their descriptions'),
        ('How to Correct — A Few Ideas', 'How to correct: a few ideas'),
        ('<span class="badge">Practice · Part 1</span>', '<span class="badge">Part 1</span>'),
        ('<span class="badge">Practice · Part 2</span>', '<span class="badge">Part 2</span>'),
        ('<div class="stage-title">Facilitating Correction of Oral Errors <span class="badge">Part 1</span>', '<div class="stage-title">Facilitating correction of oral errors <span class="badge">Part 1</span>'),
        ('<div class="stage-title">Facilitating Correction of Oral Errors <span class="badge">Part 2</span>', '<div class="stage-title">Facilitating correction of oral errors <span class="badge">Part 2</span>'),
        ('Part A — The decision flow.', 'Part A, the decision flow.'),
        ('Part B — The correction technique.', 'Part B, the correction technique.'),
        ('Answer key — Decision flow', 'Answer key: the decision flow'),
        ('Answer key — Correction technique', 'Answer key: the correction technique'),
    ],
    script=[
        ("fb.textContent = ok ? 'Perfect order! ✓' : 'Not quite right — try Reset, or check the answer key.';",
         "fb.textContent = ok ? 'Right order' : 'Not quite. Reset and try again, or open the answer key.';"),
        ('<div style="display:none;margin-top:8px;font-weight:400;color:var(--sub);font-style:italic;">',
         '<div style="display:none;margin-top:6px;font-weight:400;font-style:italic;">'),
    ],
))

# ---- Classroom management --------------------------------------------------
RECIPES.append(dict(
    slug='classroom-management',
    sources=""""Spot the problem" (the fourteen moments) and the yes-no-maybe statements follow Jim Scrivener, <i>Learning Teaching</i> (Macmillan), the chapter on classroom management. The rest of the session is the tutor's own.""", src='ih-istanbul-classroom-management/index.html',
    title='Classroom management', sub='Everything you do so that the learners can get on with learning. Seven parts, about an hour: would you rather, who is talking, the wheel, yes or no, spot the problem, grade your language, then into TP.',
    nav=[('s1', '1 · Would you rather?'), ('s2', '2 · Who is talking?'), ('s3', '3 · The wheel'), ('s4', '4 · Yes, no or maybe'), ('s5', '5 · Spot the problem'), ('s6', '6 · Grade your language'), ('s7', '7 · Into TP')],
    css=r"""
  /* would you rather */
  .wyr{display:grid; grid-template-columns:1fr auto 1fr; gap:12px; align-items:stretch; margin:12px 0 6px;}
  @media(max-width:700px){ .wyr{grid-template-columns:1fr;} }
  .wyr .opt{border-radius:var(--r-strip); padding:18px 16px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.08rem; line-height:1.35;
    display:flex; align-items:center; justify-content:center; text-align:center; min-height:110px; cursor:pointer;
    background:var(--paper); border:1.5px solid var(--sand-line); transition:border-color .12s ease;}
  .wyr .opt:hover{border-color:var(--gold);}
  .wyr .opt.picked{border-color:var(--teal); color:var(--teal);}
  .wyr .or{display:flex; align-items:center; justify-content:center; font-family:'Newsreader',Georgia,serif; font-style:italic; color:var(--grey); font-size:1.05rem;}
  .wyr-say{font-size:.86rem; color:var(--gold-deep); font-weight:600; min-height:1.3em;}
  /* who is talking */
  .calc{display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:8px;}
  @media(max-width:700px){ .calc{grid-template-columns:1fr;} }
  .calc label{font-weight:600; font-size:.86rem; display:block; margin-bottom:4px;}
  .calc input[type=range]{width:100%; accent-color:var(--teal);}
  .calc .val{font-weight:700; color:var(--teal);}
  .bars{margin-top:14px; display:flex; flex-direction:column; gap:10px;}
  .barrow .lab{font-weight:600; font-size:.86rem; margin-bottom:4px; display:flex; justify-content:space-between; gap:10px;}
  .bar{height:26px; border-radius:999px; background:var(--paper); border:1px solid var(--sand-line); overflow:hidden;}
  .bar i{display:block; height:100%; border-radius:999px; transition:width .4s;}
  .bar.open i{background:var(--gold);}
  .bar.pair i{background:var(--teal);}
  .big{font-family:'Newsreader',Georgia,serif; font-size:1.2rem; color:var(--teal); margin-top:10px; font-weight:600;}
  /* the wheel */
  .wheel-wrap{display:grid; grid-template-columns:280px 1fr; gap:22px; align-items:center; margin-top:8px;}
  @media(max-width:760px){ .wheel-wrap{grid-template-columns:1fr; justify-items:center;} }
  .wheel-box{position:relative; width:280px; height:280px; max-width:100%;}
  .wheel{width:280px; height:280px; border-radius:50%; transition:transform 3.2s cubic-bezier(.17,.67,.2,1); border:5px solid var(--paper); box-shadow:0 1px 2px oklch(58% 0.03 70 / 0.11), 0 7px 16px -7px oklch(58% 0.03 70 / 0.18);}
  .pointer{position:absolute; top:-6px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:13px solid transparent; border-right:13px solid transparent; border-top:22px solid var(--ink-warm); z-index:2;}
  .hub{position:absolute; inset:0; margin:auto; width:66px; height:66px; border-radius:50%; background:var(--paper); border:1.5px solid var(--sand-line);
    display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--teal); font-size:.78rem; letter-spacing:.06em; cursor:pointer;}
  .hub:hover{border-color:var(--gold);}
  .landed{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; min-height:140px; width:100%;}
  .landed .t{font-family:'Newsreader',Georgia,serif; font-size:1.2rem; color:var(--teal); font-weight:600; margin-bottom:6px;}
  .landed ul{margin:0; padding-left:18px; font-size:.9rem; line-height:1.6;}
  .chips{display:flex; flex-wrap:wrap; gap:6px; margin-top:12px;}
  /* yes, no or maybe */
  .ynm{display:flex; flex-direction:column; gap:8px; margin-top:6px;}
  .ynm-row{border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; background:var(--paper);}
  .ynm-row .s{font-weight:500; font-size:.92rem; line-height:1.45;}
  .ynm-btns{display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;}
  .ynm-btns button{border:1.5px solid var(--sand-line); background:var(--field); border-radius:999px; padding:5px 14px; font-weight:700; font-size:.78rem; cursor:pointer; color:var(--grey); min-height:34px;}
  .ynm-btns button:hover{border-color:var(--gold);}
  .ynm-btns button.mine{background:var(--teal); color:var(--paper); border-color:var(--teal);}
  .ynm-btns button.reveal{margin-left:auto; color:var(--teal); border-color:var(--teal); background:none;}
  .ynm-ans{display:none; margin-top:8px; font-size:.86rem; line-height:1.5; background:color-mix(in oklab, var(--teal) 9%, transparent); border-radius:var(--r-control); padding:8px 12px; color:var(--ink);}
  .ynm-ans b{color:var(--teal);}
  .ynm-row.shown .ynm-ans{display:block;}
  /* spot the problem */
  .match{display:grid; grid-template-columns:1.25fr 1fr; gap:14px; margin-top:6px;}
  @media(max-width:760px){ .match{grid-template-columns:1fr;} }
  .quote{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; min-height:130px; font-size:.95rem; line-height:1.6;}
  .quote .n{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600; margin-bottom:6px;}
  .quote .ln{margin:3px 0;}
  .quote .who{display:inline-block; min-width:26px; font-weight:700; color:var(--teal);}
  .defs{display:flex; flex-direction:column; gap:6px;}
  .def{border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:7px 11px; font-size:.84rem; font-weight:500; cursor:pointer; background:var(--field); transition:border-color .12s ease;}
  .def:hover{border-color:var(--gold);}
  .def.used{opacity:.4; cursor:default; text-decoration:line-through;}
  .def.wrong{animation:shake .3s; border-color:var(--brick);}
  .def.right{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:var(--teal); color:var(--teal); font-weight:600;}
  @keyframes shake{0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);}}
  .score{display:flex; gap:14px; align-items:center; margin-top:12px; font-weight:600;}
  .score .pill{cursor:default;}
  .why{margin-top:10px; font-size:.88rem; line-height:1.5; color:var(--teal); font-weight:600; min-height:1.4em;}
  /* grade your language */
  .fix-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:10px 0;}
  @media(max-width:700px){ .fix-grid{grid-template-columns:1fr;} }
  .fix{border-radius:var(--r-strip); border:1.5px solid var(--sand-line); background:var(--paper); overflow:hidden; cursor:pointer; transition:border-color .12s ease;}
  .fix:hover{border-color:var(--gold);}
  .fix .bad{padding:11px 14px; font-size:.9rem; font-weight:500; color:var(--brick);}
  .fix .good{display:none; padding:11px 14px 4px; font-size:.92rem; font-weight:700; color:var(--teal); border-top:1px solid var(--row-line);}
  .fix .tip{display:none; padding:0 14px 11px; font-size:.8rem; color:var(--grey);}
  .fix.open{border-color:var(--teal);}
  .fix.open .good, .fix.open .tip{display:block;}
  .ramble{background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--brick); border-radius:var(--r-control); padding:12px 16px; font-style:italic; line-height:1.6; margin:10px 0;}
  textarea.write-area{min-height:110px;}
  .model{display:none; margin-top:12px; background:color-mix(in oklab, var(--teal) 9%, transparent); border-radius:var(--r-strip); padding:12px 16px; line-height:1.7; font-size:.92rem;}
  .model.open{display:block;}
  .model ol{margin:4px 0 6px; padding-left:20px;}
  /* into TP */
  .checks{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:10px;}
  @media(max-width:700px){ .checks{grid-template-columns:1fr;} }
  .checks li{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; font-size:.9rem; line-height:1.5; display:flex; gap:10px; align-items:flex-start; cursor:pointer; transition:border-color .12s ease;}
  .checks li:hover{border-color:var(--gold);}
  .checks li .box{width:20px; height:20px; border-radius:5px; border:1.5px solid var(--teal); flex:0 0 auto; margin-top:1px; display:flex; align-items:center; justify-content:center; color:transparent; font-size:.8rem;}
  .checks li.on{border-color:var(--teal);}
  .checks li.on .box{background:var(--teal); color:var(--paper);}
  .checks li b{color:var(--ink);}
  @media print{ .fix .good, .fix .tip, .model, .ynm-ans, .flip-back{display:none !important;} .wheel-wrap, .calc, .bars, .big{display:none;} }
""",
    body=[
        ('Would you rather…? <span class="badge">Pick one, then tell your partner why</span>', 'Would you rather? <span class="badge">Pick one, then tell your partner why</span>'),
        ('<button class="btn" id="wyrNext">Next dilemma ▶</button>', '<button class="btn" id="wyrNext">Next dilemma</button>'),
        ("Who's talking? <span", "Who is talking? <span"),
        ('<span>👩‍🏫 Open class, one at a time</span>', '<span>Open class, one at a time</span>'),
        ('<span>👥 Pairs</span>', '<span>Pairs</span>'),
        ('<div class="stage-title" style="font-size:1.05rem;margin-top:16px">So why pairs and groups?', '<div class="stage-title" style="margin-top:16px">So why pairs and groups?'),
        ('<div style="color:var(--sub);font-size:.9rem">Thirteen areas.', '<div style="color:var(--grey);font-size:.9rem">Thirteen areas.'),
        ('<div class="stage-title" style="font-size:1.05rem;margin-top:18px">Your turn: rescue this teacher', '<div class="stage-title" style="margin-top:18px">Your turn: rescue this teacher'),
        ('<button class="btn" id="modelBtn">Compare with a model</button>', '<button class="btn teal" id="modelBtn">Compare with a model</button>'),
    ],
    script=[
        ("const fill=document.getElementById('progressFill'); const links=", "const links="),
        ("const h=document.documentElement; fill.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';", ""),
        ("const cols=['#1F497D','#2a8c82','#c98a1c','#7a4a9c','#b8433a','#3b6ea8','#5aa197'];",
         "const cols=['oklch(37.5% 0.058 195)','oklch(63% 0.096 72)','oklch(30% 0.042 58)','oklch(70% 0.12 72)','oklch(44% 0.062 195)','oklch(52% 0.098 70)','oklch(51% 0.017 70)'];"),
        ("<div style=\"font-family:Playfair Display;font-size:1.3rem;color:var(--navy-deep)\">All fourteen matched.</div>", "<div style=\"font-family:Newsreader,Georgia,serif;font-size:1.3rem;color:var(--teal)\">All fourteen matched.</div>"),
        ("'<div style=\"margin-top:10px;font-weight:800;color:var(--teal-deep)\">All thirteen. Well done!</div>'", "'<div style=\"margin-top:10px;font-weight:700;color:var(--teal)\">All thirteen.</div>'"),
        ("document.getElementById('why').textContent='✓ '+q.w;", "document.getElementById('why').textContent=q.w;"),
        ("c.style.setProperty('--c',i%2?'#2a8c82':'#1F497D');c.style.setProperty('--c-soft',i%2?'#dff1ee':'#e3ebf5');", ""),
    ],
))

# ---- Functional language -----------------------------------------------------
RECIPES.append(dict(
    slug='functional-language',
    sources="""The three exponents and the twelve functions are the tutor's CELTA input materials.""", src='functional-language/index.html',
    title='Functional language', sub='What a sentence does, not only what it says. Three exponents to analyse (form, phonology, function, CCQs, context), twelve functions to match, and the other side of a request.',
    nav=[('s1', '1 · Analyse'), ('s2', '2 · Key 1'), ('s3', '3 · Exponent 2'), ('s4', '4 · Exponent 3'), ('s5', '5 · Functions'), ('s6', '6 · Matching'), ('s7', '7 · Key'), ('s8', '8 · Requests'), ('s9', '9 · Responding'), ('s10', '10 · Key 2'), ('s11', '11 · Key 3')],
    css=r"""
  .analysis-row{display:grid; grid-template-columns:130px 1fr; gap:10px; align-items:start; margin:8px 0;}
  @media(max-width:560px){ .analysis-row{grid-template-columns:1fr; gap:4px;} .analysis-label{background:none; border:0; padding:4px 0 0; text-align:left;} }
  .analysis-label{background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep); border-radius:var(--r-control); padding:9px 12px;
    font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; font-weight:600; text-align:center;}
  .analysis-row .write-area{margin-top:0;}
  .key-row{display:grid; grid-template-columns:130px 1fr; gap:10px; align-items:start; margin:8px 0; font-size:.9rem; line-height:1.55;}
  @media(max-width:560px){ .key-row{grid-template-columns:1fr; gap:4px;} }
  .key-box{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-control); padding:9px 12px;}
  .chip-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:12px 0;}
  @media(max-width:700px){ .chip-grid{grid-template-columns:repeat(2,1fr);} }
  .chip-grid .chip{display:block; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-control); padding:10px; text-align:center; font-weight:600; color:var(--ink); font-size:.86rem;}
  .reveal-block{background:none; border:0; padding:0;}
  #keyR .key-box{line-height:1.8;}
  .two-col .analysis-label{margin-bottom:0;}
""",
    body=[
        ('Analysing Functional Exponents <span class="badge">Practice</span>', 'Analysing functional exponents <span class="badge">Exponent 1</span>'),
        ('<ol style="font-size:.95rem;line-height:1.9;color:var(--ink);">', '<ol style="font-size:.95rem;line-height:1.9;">'),
        ('Answer Key — Exponent 1', 'Answer key: exponent 1'),
        ('Analyse the Following Sentence <span class="badge">Exponent 2</span>', 'Analyse the sentence <span class="badge">Exponent 2</span>'),
        ('Analyse the Following Sentence <span class="badge">Exponent 3</span>', 'Analyse the sentence <span class="badge">Exponent 3</span>'),
        ("Functions We'll Cover Today <span class=\"badge\">Handouts</span>", "The functions in this session <span class=\"badge\">Think first</span>"),
        ('<span>handouts — matching activity</span>', '<span>matching</span>'),
        ('<span>handouts</span>', '<span>the functions</span>'),
        ('Match Each Exponent to a Function', 'Match each exponent to a function'),
        ('<a href="https://wordwall.net/resource/64517127" target="_blank">Open Wordwall ↗</a>', '<a href="https://wordwall.net/resource/64517127" target="_blank" rel="noopener">Open on Wordwall</a>'),
        ('Matching — Answer Key', 'Matching: answer key'),
        ('Requests — What Else Do Learners Need to Know?', 'Requests: what else do learners need to know?'),
        ("Don't Forget the Other Side of the Conversation! <span", "The other side of the conversation <span"),
        ('<div class="analysis-label" style="background:var(--teal);">Accepting</div>', '<div class="analysis-label">Accepting</div>'),
        ('<div class="analysis-label" style="background:var(--red);">Declining</div>', '<div class="analysis-label">Declining</div>'),
        ('<button class="btn" onclick="checkGap()">Check</button>', '<button class="btn teal" onclick="checkGap()">Check</button>'),
        ('Answer Key — Exponent 2', 'Answer key: exponent 2'),
        ('Answer Key — Exponent 3', 'Answer key: exponent 3'),
    ],
    script=[
        ("fb.textContent=done===pairs.length?'All matched! ✓':done+' / '+pairs.length+' matched';", "fb.textContent=done===pairs.length?'All twelve matched':done+' / '+pairs.length+' matched';"),
        ("fb.textContent= ok ? 'Yes — respond!' : 'Not quite — think about the other side of the conversation.';", "fb.textContent= ok ? 'Yes: respond.' : 'Not quite. Think about the other side of the conversation.';"),
    ],
))

# ---- Phonology: sounds -------------------------------------------------------
RECIPES.append(dict(
    slug='phonology-sounds',
    sources="""The terminology and the voiced-unvoiced task follow the tutor's CELTA input materials; the phonemic chart is the standard British English chart of 44 phonemes (Adrian Underhill, <i>Sound Foundations</i>, Macmillan).""", src='phonology-sounds/index.html',
    title='Phonology: sounds', sub='Sounds against letters, consonants and vowels, the phonemic chart, and phonemic script. The words are recorded, so turn the sound on.',
    nav=[('s1', '1 · Sounds and letters'), ('s2', '2 · Terms'), ('s3', '3 · Consonants'), ('s4', '4 · Voicing'), ('s5', '5 · The chart'), ('s6', '6 · Script'), ('s7', '7 · Film titles')],
    css=r"""
  .play{display:inline-flex; align-items:center; justify-content:center; gap:6px; background:var(--teal); color:var(--paper); border:none; border-radius:999px; padding:5px 12px; font-weight:700; font-size:.76rem; cursor:pointer; min-height:30px;}
  .play:hover{background:var(--teal-lifted);}
  .sound-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:12px 0;}
  @media(max-width:700px){ .sound-grid{grid-template-columns:repeat(2,1fr);} }
  .sound-card{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px; text-align:center;}
  .sound-card .sym{font-size:1.7rem; font-weight:700; color:var(--teal);}
  .sound-card .eg{font-size:.8rem; color:var(--grey); margin:2px 0 8px;}
  .sound-card select{width:100%; font-size:.78rem; padding:5px 26px 5px 8px; min-height:34px;}
  .chart{display:grid; gap:12px; margin:12px 0;}
  .chart-block{border:2px solid var(--c); border-radius:var(--r-strip); padding:10px; background:var(--paper);}
  .chart-block h5{margin:0 0 8px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--c); font-weight:600;}
  .chart-row{display:grid; grid-template-columns:repeat(var(--cols),1fr); gap:5px; margin-bottom:5px;}
  .ph{border:1.5px solid var(--c); border-radius:var(--r-control); padding:6px 2px; text-align:center; cursor:pointer; background:var(--field); transition:background .12s ease; user-select:none;}
  .ph:hover{background:var(--gold-wash);}
  .ph .s{font-size:1.3rem; font-weight:700; color:var(--ink); line-height:1.1;}
  .ph .w{font-size:.66rem; color:var(--grey);}
  .ph.blank{border:none; cursor:default; background:transparent;}
  .chart-top{display:grid; grid-template-columns:4fr 3fr; gap:12px;}
  @media(max-width:640px){ .chart-top{grid-template-columns:1fr;} .chart-row{gap:3px;} .ph .s{font-size:1.05rem;} .ph .w{font-size:.58rem;} }
  .legend{display:flex; gap:8px; flex-wrap:wrap; font-size:.72rem; font-weight:700; margin-top:8px;}
  .legend span{padding:3px 10px; border-radius:999px; border:1.5px solid var(--c); color:var(--c);}
  .ipa-keys{display:flex; flex-wrap:wrap; gap:6px; margin:10px 0 14px;}
  .ipa-keys button{border:1.5px solid var(--sand-line); background:var(--field); border-radius:var(--r-control); padding:5px 9px; font-size:1rem; font-weight:700; cursor:pointer; color:var(--teal); min-width:36px; min-height:36px;}
  .ipa-keys button:hover{border-color:var(--gold);}
  .ipa-keys .sep{width:100%; height:0;}
  .fill-row .ipa{font-size:1.15rem; font-weight:600; min-width:180px;}
  .fill-row .ipa + input.blank{flex:1;}
  table.grid td.ipa{font-size:1.1rem; font-weight:600;}
  @media(max-width:640px){
    table.grid, table.grid tbody, table.grid tr, table.grid td{display:block; width:100%;}
    table.grid tr:first-child{display:none;}
    table.grid tr{border:1px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:var(--r-control); margin:0 0 10px; padding:8px 10px; background:var(--paper);}
    table.grid td{border:0; padding:4px 0;}
    table.grid td:first-child, table.grid td:nth-child(2){display:inline-block; width:auto; margin-right:8px; vertical-align:middle;}
    table.grid input.blank{width:100%;}
  }
""",
    body=[
                ('Sounds vs Letters <span', 'Sounds against letters <span'),
        ('<p class="lead" style="font-size:.85rem;"><b>Example:</b>', '<p class="lead"><b>Example:</b>'),
        ('<button class="btn" onclick="checkLeadIn()">Check answers</button>', '<button class="btn teal" onclick="checkLeadIn()">Check answers</button>'),
        ('<button class="play" onclick="say(\'letter\')">▶ Play</button>', '<button class="play" onclick="say(\'letter\')">Play</button>'),
        ('<button class="play" onclick="say(\'sound\')">▶ Play</button>', '<button class="play" onclick="say(\'sound\')">Play</button>'),
        ('<button class="play" onclick="say(\'vowel\')">▶ Play</button>', '<button class="play" onclick="say(\'vowel\')">Play</button>'),
        ('<button class="play" onclick="say(\'consonant\')">▶ Play</button>', '<button class="play" onclick="say(\'consonant\')">Play</button>'),
        ('<button class="play" onclick="say(\'phoneme\')">▶ Play</button>', '<button class="play" onclick="say(\'phoneme\')">Play</button>'),
        ('Match the Terminology <span', 'Match the terminology <span'),
        ('Consonant Sounds — Where Is the Obstruction? <span', 'Consonant sounds: where is the obstruction? <span'),
        ('<button class="btn" onclick="checkObstruction()">Check answers</button>', '<button class="btn teal" onclick="checkObstruction()">Check answers</button>'),
        ('<a href="https://www.seeingspeech.ac.uk/ipa-charts/" target="_blank">Open Seeing Speech ↗</a>', '<a href="https://www.seeingspeech.ac.uk/ipa-charts/" target="_blank" rel="noopener">Open Seeing Speech</a>'),
        ('Voiced or Unvoiced? <span class="badge">Practice</span>', 'Voiced or unvoiced? <span class="badge">Try it</span>'),
        ('The Phonemic Chart <span', 'The phonemic chart <span'),
        ('<span style="--c:#1F497D">long vowels</span><span style="--c:#7a4a8a">short vowels</span><span style="--c:#d9772a">diphthongs</span><span style="--c:#2a8c82">voiced consonants</span><span style="--c:#8a9a2a">unvoiced consonants</span>',
         '<span style="--c:var(--a-slate, #4B5A7A)">long vowels</span><span style="--c:var(--gold-deep)">short vowels</span><span style="--c:var(--ink-warm)">diphthongs</span><span style="--c:var(--teal)">voiced consonants</span><span style="--c:var(--grey)">unvoiced consonants</span>'),
        ('Write These Words in Phonemic Script <span class="badge">Practice</span>', 'Write these words in phonemic script <span class="badge">Try it</span>'),
        ('Decipher the Film Titles <span', 'Decipher the film titles <span'),
        ('<button class="btn" style="background:var(--amber);" onclick="checkFilms()">Check answers</button>', '<button class="btn teal" onclick="checkFilms()">Check answers</button>'),
    ],
    script=[
        ("fb.textContent = done===items.length ? 'All matched! ✓' : done+' / '+items.length+' matched';", "fb.textContent = done===items.length ? 'All six matched' : done+' / '+items.length+' matched';"),
        ("""function pickVoice(){
  const vs = speechSynthesis.getVoices();
  gbVoice = vs.find(v=>/en-GB/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || null;
}""", """// The words are recorded once (OpenAI's sage voice, standard British English:
// tools/make-phonology-audio.mjs), one small file each, kept on the device once
// played (Ramy, 22 Oct 2026: "I don't want a million voices"). The device's own
// voice speaks only a word that has no file.
function pickVoice(){
  const vs = speechSynthesis.getVoices();
  gbVoice = vs.find(v=>/en-GB/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || null;
}"""),
        ("""function say(text){
  if(!('speechSynthesis' in window)){ alert('Audio is not supported in this browser.'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB'; if(gbVoice) u.voice = gbVoice; u.rate = 0.85;
  speechSynthesis.speak(u);
}""", """// Lite's four house voices (../voices.js): the chart is British, so an American voice gets a note.
LiteVoice.set({ britishChart: true });
function say(text){ LiteVoice.say(text); }"""),
        ("const NAVY='#1F497D', PURPLE='#7a4a8a', ORANGE='#d9772a', TEALC='#2a8c82', OLIVE='#8a9a2a';",
         "const NAVY='var(--a-slate, #4B5A7A)', PURPLE='var(--gold-deep)', ORANGE='var(--ink-warm)', TEALC='var(--teal)', OLIVE='var(--grey)';"),
        ("block('Vowels',vowels,4,'#e0b500')+block('Diphthongs',diph,3,ORANGE)+'</div>'+block('Consonants',cons,8,'#c0392b');",
         "block('Vowels',vowels,4,'var(--gold)')+block('Diphthongs',diph,3,ORANGE)+'</div>'+block('Consonants',cons,8,'var(--teal)');"),
        ("<button class=\"play\" style=\"padding:3px 8px;font-size:.7rem\" onclick=\"say(\\''+o.eg+'\\')\">▶</button>", "<button class=\"play\" style=\"padding:3px 10px;font-size:.7rem;min-height:26px\" onclick=\"say(\\''+o.eg+'\\')\">Play</button>"),
        ("'<td class=\"ipa\" style=\"font-size:1.1rem;font-weight:700;\">'+v.ipa+'</td><td><button class=\"play\" onclick=\"say(\\''+v.word+'\\')\">▶</button></td>'", "'<td class=\"ipa\">'+v.ipa+'</td><td><button class=\"play\" onclick=\"say(\\''+v.word+'\\')\">Play</button></td>'"),
        ("<button class=\"play\" onclick=\"say(\\''+s.w+'\\')\">▶</button><span style=\"font-weight:800;color:var(--sub)\">/</span><input class=\"blank\" id=\"sc'+i+'\" style=\"width:180px;font-size:1.05rem\" autocomplete=\"off\"><span style=\"font-weight:800;color:var(--sub)\">/</span>",
         "<button class=\"play\" onclick=\"say(\\''+s.w+'\\')\">Play</button><span style=\"font-weight:700;color:var(--grey)\">/</span><input class=\"blank\" id=\"sc'+i+'\" style=\"width:180px;font-size:1.05rem\" autocomplete=\"off\"><span style=\"font-weight:700;color:var(--grey)\">/</span>"),
    ],
))

# ---- PPP (loop input) --------------------------------------------------------
# PPP and Text-based teaching share one template: a Connect-style loop input
# page with section tags and h2s, no sticky nav. The nav is built from the ids.
LOOP_CSS = r"""
  section{margin:0 0 26px;}
  .section-tag{display:block; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-deep); font-weight:600; margin:0 0 4px;}
  h2{font-family:'Newsreader',Georgia,serif; font-size:1.3rem; font-weight:600; margin:0 0 10px; line-height:1.25;}
  .prompt{font-size:.95rem; margin:0 0 10px;}
  .hint{font-size:.84rem; color:var(--grey); font-style:italic;}
  textarea.notes{width:100%; min-height:70px; margin-top:6px; padding:10px 12px; border-radius:var(--r-control); border:1.5px solid var(--sand-line); background:var(--field);
    font-family:'Karla',sans-serif; font-size:.9rem; color:var(--ink); resize:vertical; line-height:1.5;}
  textarea.notes:focus{outline:none; border-color:var(--gold); background:var(--field-focus);}
  textarea.notes::placeholder{color:var(--field-ph); opacity:1;}
  .reflect-box{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; font-size:.92rem;}
  .reveal-card{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:26px 22px; text-align:center;
    font-family:'Newsreader',Georgia,serif; font-size:1.3rem; font-weight:600; cursor:pointer; user-select:none; transition:border-color .12s ease;}
  .reveal-card:hover{border-color:var(--gold);}
  .reveal-card.open{border-color:var(--teal);}
  .reveal-card .answer{display:none; font-family:'Karla',sans-serif; font-size:.92rem; font-weight:400; margin-top:12px; line-height:1.6; color:var(--teal);}
  .reveal-card.open .answer{display:block;}
  .reveal-card .tap{font-family:'Karla',sans-serif; font-size:.72rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--grey); margin-top:10px;}
  .reveal-card.open .tap{display:none;}
  .match-status{font-size:.8rem; font-weight:600; color:var(--gold-deep); margin:0 0 12px;}
  .match-grid{display:grid; grid-template-columns:1fr 1.35fr; gap:10px 16px;}
  .match-col-label{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600; margin-bottom:2px;}
  .match-col{display:flex; flex-direction:column; gap:8px;}
  .match-col > div:not(.match-col-label){display:flex; flex-direction:column; gap:8px;}
  .match-item{border:1.5px solid var(--sand-line); background:var(--field); border-radius:var(--r-control); padding:10px 12px; font-size:.9rem; cursor:pointer; transition:border-color .12s ease, background .12s ease;}
  .match-item:hover{border-color:var(--gold);}
  .match-item.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  .match-item.def{color:var(--ink); font-size:.88rem;}
  .match-item.selected{border-color:var(--gold); background:var(--field-focus);}
  .match-item.correct{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal); cursor:default;}
  .match-item.wrong{animation:shake .3s ease; border-color:var(--brick);}
  @keyframes shake{0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);}}
  .passage{font-size:.97rem; line-height:1.75;}
  .passage strong{color:var(--teal);}
  .tf-item{border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin-bottom:8px; background:var(--paper);}
  .tf-statement{font-size:.92rem; margin-bottom:8px;}
  .tf-buttons{display:flex; gap:8px;}
  .tf-buttons button{font-family:'Karla',sans-serif; font-weight:700; font-size:.8rem; padding:5px 14px; border-radius:999px; border:1.5px solid var(--sand-line); background:var(--field); cursor:pointer; color:var(--grey); min-height:34px;}
  .tf-buttons button:hover{border-color:var(--gold);}
  .tf-buttons button:disabled{cursor:default;}
  .tf-buttons button.picked-correct{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal);}
  .tf-buttons button.picked-wrong{background:color-mix(in oklab, var(--brick) 10%, transparent); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .tf-feedback{display:none; margin-top:9px; font-size:.86rem; color:var(--grey); border-top:1px solid var(--row-line); padding-top:9px;}
  .tf-feedback.show{display:block;}
  .debrief-pool{display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;}
  .debrief-chip{border:1.5px solid var(--gold); background:var(--field); color:var(--gold-deep); font-weight:600; font-size:.88rem; padding:9px 14px; border-radius:var(--r-control); cursor:pointer; transition:background .12s ease;}
  .debrief-chip:hover{background:var(--gold-wash);}
  .debrief-chip.used{opacity:.3; pointer-events:none;}
  .debrief-order{display:flex; flex-direction:column; gap:8px; min-height:56px;}
  .debrief-slot{border:1.5px dashed var(--sand-line); border-radius:var(--r-control); padding:10px 14px; font-size:.9rem; color:var(--grey); display:flex; align-items:center; gap:10px;}
  .debrief-slot.filled{border-style:solid; border-color:var(--teal); background:color-mix(in oklab, var(--teal) 9%, transparent); color:var(--ink); font-weight:600;}
  .debrief-slot .num{font-family:'Newsreader',Georgia,serif; font-weight:700; color:var(--teal); width:18px;}
  .debrief-status{margin-top:12px; font-size:.86rem; font-weight:600;}
  .debrief-status.ok{color:var(--teal);}
  .debrief-status.pending{color:var(--grey);}
  .reset-btn{margin-top:10px; background:none; border:none; color:var(--grey); font:600 .82rem 'Karla',sans-serif; text-decoration:underline; text-underline-offset:4px; text-decoration-color:var(--gold); cursor:pointer; padding:0;}
  .reset-btn:hover{color:var(--ink-warm);}
  @media(max-width:600px){ .match-grid{grid-template-columns:1fr;} }
  @media print{ .tf-feedback, .reveal-card .answer, .debrief-order, .debrief-status, .reset-btn{display:none !important;} .reveal-card.open .tap{display:block;} }
"""
RECIPES.append(dict(
    slug='ppp', src='desktop:PPP_Input_Session.html', eyebrow='Input session · Loop input · 45 minutes',
    title='Presentation, Practice, Production', sub='Taught the way you will teach it. This session is staged exactly like the lesson framework it teaches: do the tasks first, and the debrief at the end is where it gets named.',
    nav=[('leadin', 'Lead-in'), ('whatisppp', 'What is PPP?'), ('match', 'Terms'), ('predict', 'Predict'), ('read', 'Read'), ('detail', 'Detail'), ('debrief', 'Debrief')],
    css=LOOP_CSS,
    drop=[r'\s*<div class="eyebrow">.*?</div>\s*<h1>.*?</h1>\s*<div class="sub">.*?</div>'],
    body=[
        ('<span class="section-tag">Lead-in · 2 minutes</span>', '<span class="section-tag">Lead-in · 2 minutes</span>'),
        ('Jot a one-line reaction if you like — this is just for you, nothing is checked.', 'Jot a one-line reaction if you like. This is just for you; nothing is checked.'),
        ('<div class="prompt">Discuss with your partner, about a minute — no wrong answers yet.</div>', '<div class="prompt">Discuss with your partner, about a minute. No wrong answers yet.</div>'),
        ('<div class="prompt hint" style="margin-bottom:14px;">More time now — answer these from the text, then check with your partner.</div>', '<div class="prompt hint" style="margin-bottom:14px;">More time now. Answer these from the text, then check with your partner.</div>'),
        ('<span class="section-tag">Debrief — put the stages back in order</span>', '<span class="section-tag">Debrief · put the stages back in order</span>'),
        ('This is a loop input — the session modelled PPP instead of only describing it.', 'This is a loop input: the session modelled PPP instead of only describing it.'),
        ('0 of 4 placed — click the one that comes next.', '0 of 4 placed. Click the one that comes next.'),
    ],
    script=[
        ('status.textContent = debriefPlaced.length + " of 4 placed — click the one that comes next.";', 'status.textContent = debriefPlaced.length + " of 4 placed. Click the one that comes next.";'),
        ('? "That\'s the order — PPP, modelled: pre-teach terms, predict the staging, read to check, then detail check."', '? "That is the order. PPP, modelled: pre-teach terms, predict the staging, read to check, then detail check."'),
        (': "Not quite that order — reset and try again, thinking about when you\'d check meaning of new terms.";', ': "Not quite that order. Reset and try again, thinking about when you would check the meaning of new terms.";'),
    ],
))

# ---- Text-based teaching (loop input) ---------------------------------------
RECIPES.append(dict(
    slug='text-based-teaching', src='desktop:Text-Based_Teaching_Input_Session.html', eyebrow='Input session · Loop input · 45 minutes',
    title='Text-based teaching', sub='Taught the way you will teach it. The session is staged exactly like the lesson framework it teaches: do the tasks first, and the debrief at the end is where it gets named.',
    nav=[('leadin', 'Lead-in'), ('whatis', 'What is it?'), ('predict', 'Predict'), ('read', 'Read'), ('detail', 'Detail'), ('debrief', 'Debrief')],
    css=LOOP_CSS,
    drop=[r'\s*<div class="eyebrow">.*?</div>\s*<h1>.*?</h1>\s*<div class="sub">.*?</div>'],
    body=[
        ('Jot a one-line reaction if you like — this is just for you, nothing is checked.', 'Jot a one-line reaction if you like. This is just for you; nothing is checked.'),
        ('<div class="prompt">Discuss with your partner, about a minute — no wrong answers yet.</div>', '<div class="prompt">Discuss with your partner, about a minute. No wrong answers yet.</div>'),
        ('<div class="prompt hint" style="margin-bottom:14px;">More time now — answer these from the text, then check with your partner.</div>', '<div class="prompt hint" style="margin-bottom:14px;">More time now. Answer these from the text, then check with your partner.</div>'),
        ('<span class="section-tag">Debrief — put the stages back in order</span>', '<span class="section-tag">Debrief · put the stages back in order</span>'),
        ('This is a loop input — the session modelled text-based teaching instead of only describing it.', 'This is a loop input: the session modelled text-based teaching instead of only describing it.'),
        ('0 of 4 placed — click the one that comes next.', '0 of 4 placed. Click the one that comes next.'),
    ],
    script=[
        ('" of 4 placed — click the one that comes next."', '" of 4 placed. Click the one that comes next."'),
    ],
))

# ---- Guided to less-guided practice ----------------------------------------
RECIPES.append(dict(
    slug='guided-to-less-guided-practice',
    sources="""The drilling techniques follow Donn Byrne, <i>Teaching Oral English</i> (Longman, 1986). The jazz chant is Carolyn Graham's (<i>Jazz Chants</i>, Oxford University Press). Video: <i>The Pink Panther</i> (2006, MGM), the dialect-coach scene, on the Movieclips channel.""", src='guided-to-less-guided-practice/index.html',
    title='Guided to less-guided practice', sub='Drilling, and what comes after it. A cued dialogue to start, a video, why and how we drill, thirteen types of drill, meaningful drills, a jazz chant, and an information gap.',
    nav=[('s9', 'Cued dialogue'), ('s0', 'Video'), ('s1', '1 · Why drill?'), ('s2', '2 · Techniques'), ('s2b', 'Your turn'), ('s3', '3 · Types'), ('s4', '4 · Meaningful drills'), ('s5', '5 · Jazz chants'), ('s6', '6 · Transform'), ('s8', '7 · Info gap')],
    css=r"""
  .cue-card{background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--teal); border-radius:var(--r-control); padding:10px 14px 12px; margin:0 0 8px;}
  .cue-card.studentB{border-left-color:var(--gold); margin-left:8%;}
  @media(max-width:560px){ .cue-card.studentB{margin-left:0;} }
  .cue-who{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600;}
  .cue-instruction{font-size:.92rem; margin:2px 0 6px;}
  .cue-card input{width:100%; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:8px 10px; font-family:'Karla',sans-serif; font-size:.9rem; background:var(--field); color:var(--ink); min-height:38px;}
  .cue-card input:focus{outline:none; border-color:var(--gold); background:var(--field-focus);}
  .text-block a{color:var(--teal); font-weight:600; text-decoration:underline; text-underline-offset:3px; text-decoration-color:var(--gold);}
  .dialogue-line{margin:3px 0; line-height:1.6;}
  .dialogue-line .who{font-weight:700; color:var(--teal); margin-right:4px;}
  .checklist.reveal-block{background:none; border:0; padding:0; margin-top:10px;}
  .checklist.reveal-block.shown{display:block;}
  .flash-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:12px 0 0;}
  @media(max-width:640px){ .flash-grid{grid-template-columns:1fr;} }
  .flash{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; cursor:pointer; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem; transition:border-color .12s ease;}
  .flash:hover{border-color:var(--gold);}
  .flash .detail{display:none; margin-top:6px; font-family:'Karla',sans-serif; font-weight:400; font-size:.86rem; color:var(--ink); line-height:1.55;}
  .tryit-card{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px 14px; margin:0 0 10px;}
  .tryit-card h4{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.02rem; margin:0 0 2px;}
  .tryit-example{font-size:.88rem; color:var(--ink); line-height:1.55;}
  .tryit-example b{color:var(--teal);}
  .answer-key{margin-top:14px; padding:14px 18px; border-radius:var(--r-strip); background:var(--gold-wash); border:1px solid var(--amber-edge);}
  .answer-key h4{font-family:'Newsreader',Georgia,serif; font-weight:600; margin:0 0 6px; color:var(--gold-deep); font-size:1rem;}
  .fill-row > span{flex:0 0 190px;}
  .info-gap-cols{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:10px;}
  @media(max-width:600px){ .info-gap-cols{grid-template-columns:1fr;} }
  .info-gap-col{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-strip); padding:12px 16px;}
  .info-gap-col h4{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem; margin:0 0 6px;}
  .info-gap-col ul{margin:0; padding-left:18px; line-height:1.7;}
  @media print{ .flash .detail, .answer-key, .tryit-answer{display:none !important;} }
""",
    body=[
        ('Cued Dialogue — Phone Call <span', 'Cued dialogue: a phone call <span'),
        ('<div class="divider"><span>let\'s begin</span></div>\n\n  <!-- 0: VIDEO -->', '<div class="divider"><span>watch first</span></div>\n\n  <!-- 0: VIDEO -->'),
        ('<div class="stage-title">Click to Watch the Video</div>', '<div class="stage-title">Watch the video</div>'),
        ('<div class="text-block">\n        <a href="https://www.youtube.com/watch?v=lz0IT4Uk2xQ" target="_blank">▶ Click to watch the video</a>\n      </div>',
         '<p class="lead">Inspector Clouseau and his dialect coach: a drill, taken to the limit. Two minutes.</p>\n      <div class="film"><iframe src="https://www.youtube-nocookie.com/embed/Z6oeAdemFZw?rel=0&modestbranding=1" title="The Pink Panther (2006): I would like to buy a hamburger" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>\n      <p class="film-link">If the frame stays black, <a href="https://www.youtube.com/watch?v=Z6oeAdemFZw" target="_blank" rel="noopener">watch it on YouTube</a>.</p>'),
        ('<div class="divider"><span>let\'s begin</span></div>', '<div class="divider"><span>why drill</span></div>'),
        ('Guided Practice: Why Drill? <span', 'Guided practice: why drill? <span'),
        ('<div class="checklist reveal-block" id="whyDrillReveal">', '<ul class="checklist reveal-block" id="whyDrillReveal">'),
        ('<li>Sometimes also useful at the pre-practice stage</li>\n      </div>', '<li>Sometimes also useful at the pre-practice stage</li>\n      </ul>'),
        ('Gives students confidence with new forms — weaker students can hide behind stronger ones', 'Gives students confidence with new forms; weaker students can hide behind stronger ones'),
        ('Drilling Techniques <span', 'Drilling techniques <span'),
        ('<p class="lead" style="margin-top:14px;font-size:.8rem;font-style:italic;">Source: Teaching Oral English — Donn Byrne</p>', '<p class="lead" style="margin-top:14px;font-size:.8rem;font-style:italic;">Source: Donn Byrne, Teaching Oral English</p>'),
        ('Now You Try <span class="badge">Trainer models, you create</span>', 'Now you try <span class="badge">Tutor models, you create</span>'),
        ('For each technique, the trainer will demonstrate one example live.', 'For each technique, your tutor will demonstrate one example live.'),
        ('<button class="btn" style="background:linear-gradient(135deg,var(--teal),#4a998c);" onclick="revealTryItAnswers(this)">Reveal answers</button>', '<button class="btn" onclick="revealTryItAnswers(this)">Reveal answers</button>'),
        ('<div class="text-block" style="margin-top:20px;border-left:4px solid var(--teal);">\n        <b>Exit Ticket:</b> Before we move on — write down', '<div class="text-block" style="margin-top:20px;border-left:4px solid var(--gold);">\n        <b>Exit ticket:</b> Before we move on, write down'),
        ('Types of Drill <span', 'Types of drill <span'),
        ("Let's look at <b>one</b> together first — a chain drill.", "Let's look at <b>one</b> together first: a chain drill."),
        ('<b>Chain drill:</b> practice passes from student to student like a chain — one asks', '<b>Chain drill:</b> practice passes from student to student like a chain. One asks'),
        ('Before you check, try to guess what each one means from the name alone — discuss with your group.', 'Before you check, try to guess what each one means from the name alone; discuss with your group.'),
        ('<button class="btn" style="background:linear-gradient(135deg,var(--gold),#c9a24f);" onclick="checkDrillMatch()">Check answers</button>', '<button class="btn teal" onclick="checkDrillMatch()">Check answers</button>'),
        ('More Meaningful Drills <span', 'More meaningful drills <span'),
        ('These drills are slower — the teacher is less concerned with 100% correct responses.', 'These drills are slower; the teacher is less concerned with 100% correct responses.'),
        ('<p class="lead" style="margin-top:14px;"><b>Example — Guessing drill:</b></p>', '<p class="lead" style="margin-top:14px;"><b>Example: a guessing drill</b></p>'),
        ('<span>rhythm &amp; fun</span>', '<span>rhythm</span>'),
        ('Jazz Chants <span class="badge">Fun practice</span>', 'Jazz chants <span class="badge">Rhythm</span>'),
        ('A fun way of drilling sentences, often set to music — published by Carolyn Graham (Oxford American English), most famously "Small Talk" and "Jazz Chants." Usually chanted in American English. Easy to create your own — just follow the beat!', 'A way of drilling sentences to a beat, often set to music, published by Carolyn Graham (Oxford American English), most famously "Small Talk" and "Jazz Chants". Usually chanted in American English. Easy to create your own: follow the beat.'),
        ('Transformation &amp; Substitution Drills <span', 'Transformation and substitution drills <span'),
        ('<b>Transformation drill</b> — the teacher gives a cue, learners transform the sentence.', '<b>Transformation drill:</b> the teacher gives a cue, learners transform the sentence.'),
        ('<b>Substitution drill</b> — the teacher gives a new word, learners substitute it into the sentence.', '<b>Substitution drill:</b> the teacher gives a new word, learners substitute it into the sentence.'),
        ('Try it yourself — write two more', 'Try it yourself: write two more'),
        ('<input type="text" style="width:100%;border:2px solid var(--teal);border-radius:8px;padding:8px 10px;font-family:\'Nunito\';margin-bottom:8px;" placeholder="Cue 1...">', '<input type="text" class="blank" style="width:100%;margin-bottom:8px;" placeholder="Cue 1">'),
        ('<input type="text" style="width:100%;border:2px solid var(--teal);border-radius:8px;padding:8px 10px;font-family:\'Nunito\';" placeholder="Cue 2...">', '<input type="text" class="blank" style="width:100%;" placeholder="Cue 2">'),
        ('Peter and Anne — Shopping Info-Gap <span', 'Peter and Anne: a shopping information gap <span'),
        ("Now try the information gap yourselves — don't show your partner your list!", 'Now try the information gap yourselves. Keep your list from your partner.'),
        ('<h4>A — You are going shopping</h4>', '<h4>A: you are going shopping</h4>'),
        ('<h4>B — You are staying at home. You need:</h4>', '<h4>B: you are staying at home. You need:</h4>'),
    ],
    script=[
        ("fb.textContent = 'All matched! ✓';", "fb.textContent = 'All nine matched';"),
        ("'<option value=\"\">— choose a definition —</option>'", "'<option value=\"\">Choose a definition</option>'"),
        ("row.innerHTML = '<span style=\"min-width:190px;font-weight:800;color:var(--terracotta-deep);\">'+d.term+'</span>", "row.innerHTML = '<span style=\"font-weight:600;\">'+d.term+'</span>"),
        ("'<div class=\"answer-key shown\" style=\"margin-top:18px;\"><h4>Examples</h4>", "'<div class=\"answer-key shown\" style=\"margin-top:18px;\"><h4>An example of each</h4>"),
    ],
))

# ---- Teaching speaking -------------------------------------------------------
RECIPES.append(dict(
    slug='teaching-speaking',
    sources="""Lesson Shape (F) and the staging task follow the International House CELTA lesson shapes. The fluency principles follow Jim Scrivener, <i>Learning Teaching</i> (Macmillan).""", src='desktop:Teaching-Speaking.html', eyebrow='Input session · 75 to 90 minutes',
    title='Teaching speaking', sub='A loop input: you do the tasks first, the way your students would, before the framework gets its name. Lesson Shape (F), productive skills.',
    nav=[('s1', '1 · Warm-up'), ('s2', '2 · Fluency or accuracy'), ('s3', '3 · What makes it work'), ('s4', '4 · Stage order'), ('s5', '5 · The framework'), ('s6', '6 · Problems'), ('s7', '7 · Plan a stage'), ('s8', '8 · Wrap-up')],
    css=r"""
  .phrase-list{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:12px 0;}
  @media(max-width:680px){ .phrase-list{grid-template-columns:1fr;} }
  .phrase{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-strip); padding:12px 14px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600;}
  .phrase span{display:block; font-family:'Karla',sans-serif; font-weight:400; letter-spacing:0; text-transform:none; color:var(--ink); font-size:.95rem; margin-top:4px;}
  .fill-row > span{flex:0 0 220px;}
  @media(max-width:560px){ .fill-row > span{flex:1 1 100%;} .fill-row select.blank{width:100%;} }
  .reveal-box{display:none; margin-top:16px; padding:16px 20px; border-radius:var(--r-strip); background:var(--gold-wash); border:1px solid var(--amber-edge);}
  .reveal-box.shown{display:block;}
  .reveal-box h4{font-family:'Newsreader',Georgia,serif; font-weight:600; margin:0 0 8px; color:var(--gold-deep); font-size:1.1rem;}
  table.framework{width:100%; border-collapse:collapse; margin:12px 0; font-size:.9rem;}
  table.framework th, table.framework td{border:1px solid var(--sand-line); padding:10px 12px; text-align:left; vertical-align:top; background:var(--paper);}
  table.framework th{background:var(--gold-wash); color:var(--gold-deep); font-weight:600; white-space:nowrap; width:200px;}
  @media(max-width:560px){ table.framework th{white-space:normal; width:110px;} }
  textarea.text-area{width:100%; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:10px 12px; font-family:'Karla',sans-serif; font-size:.92rem; resize:vertical; min-height:50px; background:var(--field); color:var(--ink);}
  textarea.text-area:focus{outline:none; border-color:var(--gold); background:var(--field-focus);}
  label.field-label{display:block; margin:12px 0 4px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600;}
  @media print{ .reveal-box{display:none !important;} textarea.text-area{background:none; min-height:60px;} }
""",
    body=[
        ('<div class="stage-title">Warm-up <span class="badge">5 min</span><span class="time">Discuss</span></div>', '<div class="stage-title">Warm-up <span class="badge">Discuss</span><span class="time">5 min</span></div>'),
        ('Before we start — think about your own experience as a learner or teacher.', 'Before we start, think about your own experience as a learner or teacher.'),
        ('What kills a speaking activity — makes students go quiet?', 'What kills a speaking activity and makes students go quiet?'),
        ('Keep your ideas in mind — we\'ll come back to them.', 'Keep your ideas in mind; we\'ll come back to them.'),
        ('<span>H/O 1 — sorting task</span>', '<span>sorting</span>'),
        ('<div class="stage-title">Free Speaking or Controlled Speaking? <span class="badge">10 min</span><span class="time">Sort the features</span></div>', '<div class="stage-title">Free speaking or controlled speaking? <span class="badge">Sort the features</span><span class="time">10 min</span></div>'),
        ('<button class="btn" style="background:linear-gradient(135deg,var(--teal),#3d8a7e);" onclick="checkSort()">Check answers</button>', '<button class="btn teal" onclick="checkSort()">Check answers</button>'),
        ('<span>H/O 2 — reading</span>', '<span>reading</span>'),
        ('<div class="stage-title">What Makes a Fluency Task Work? <span class="badge">10 min</span><span class="time">Read &amp; discuss</span></div>', '<div class="stage-title">What makes a fluency task work? <span class="badge">Read and discuss</span><span class="time">10 min</span></div>'),
        ('with a real communicative aim — a task that has to be completed.', 'with a real communicative aim: a task that has to be completed.'),
        ('The activity is interactive — everyone gets a chance to speak.', 'The activity is interactive; everyone gets a chance to speak.'),
        ('<span>H/O 3 — staging task</span>', '<span>staging</span>'),
        ('<div class="stage-title">Put the Stages in Order <span class="badge">15 min</span><span class="time">Order &amp; reveal</span></div>', '<div class="stage-title">Put the stages in order <span class="badge">Order, then reveal</span><span class="time">15 min</span></div>'),
        ('<h4>This is Lesson Shape (F): Productive Skills</h4>', '<h4>This is Lesson Shape (F): productive skills</h4>'),
        ('<p style="margin:0;color:var(--ink);font-size:.92rem;">What you just ordered is a full staging sequence for teaching speaking. It maps onto a five-part lesson shape — let\'s look at it properly in the next section.</p>', '<p style="margin:0;font-size:.92rem;">What you just ordered is a full staging sequence for teaching speaking. It maps onto a five-part lesson shape; the next section looks at it properly.</p>'),
        ('<div class="stage-title">Lesson Shape (F): Productive Skills <span class="badge">10 min</span><span class="time">Presentation</span></div>', '<div class="stage-title">Lesson Shape (F): productive skills <span class="badge">The framework</span><span class="time">10 min</span></div>'),
        ('Stages are chosen as necessary — not every lesson needs all five.', 'Stages are chosen as necessary; not every lesson needs all five.'),
        ('<b>NB: this is NOT target language</b> — it\'s there to help them, not something they must use.', '<b>This is not target language.</b> It is there to help them, not something they must use.'),
        ('<span>H/O 4 — matching task</span>', '<span>matching</span>'),
        ('<div class="stage-title">Common Speaking Problems <span class="badge">10 min</span><span class="time">Match &amp; discuss</span></div>', '<div class="stage-title">Common speaking problems <span class="badge">Match and discuss</span><span class="time">10 min</span></div>'),
        ('<button class="btn" style="background:linear-gradient(135deg,var(--blue),#5a8fc0);" onclick="checkProblems()">Check answers</button>', '<button class="btn teal" onclick="checkProblems()">Check answers</button>'),
        ('<div class="stage-title">Plan a Speaking Lesson <span class="badge">15 min</span><span class="time">Apply the framework</span></div>', '<div class="stage-title">Plan a speaking lesson <span class="badge">Apply the framework</span><span class="time">15 min</span></div>'),
        ('Keep it brief — a sentence or two per stage is enough.', 'Keep it brief; a sentence or two per stage is enough.'),
        ('<div class="stage-title">Key Takeaways <span class="badge">5 min</span></div>', '<div class="stage-title">Key takeaways <span class="time">5 min</span></div>'),
        ('"Useful language" helps students — it is never target language they must use.', '"Useful language" helps students; it is never target language they must use.'),
        ('Not every stage of Lesson Shape (F) is needed every time — choose as necessary.', 'Not every stage of Lesson Shape (F) is needed every time; choose as necessary.'),
    ],
    script=[
        ("'<option value=\"\">— choose —</option>'", "'<option value=\"\">Choose</option>'"),
        ("row.innerHTML = '<span style=\"min-width:210px;font-weight:700;\">'+item.term+'</span>'", "row.innerHTML = '<span style=\"font-weight:600;\">'+item.term+'</span>'"),
        ("fb.textContent = 'Perfect order! ✓';", "fb.textContent = 'Right order';"),
        ("fb.textContent = 'Not quite right — click Reset and try again.';", "fb.textContent = 'Not quite. Reset and try again.';"),
        ("'<option value=\"\">— choose a solution —</option>'", "'<option value=\"\">Choose a solution</option>'"),
        # Ramy, 13 Oct 2026: the key as written was one step out of place; these are the pairs he confirmed
        ('{problem:"Lack of confidence", answer:"Coping strategies"},', '{problem:"Lack of confidence", answer:"Classroom atmosphere, small groups"},'),
        ('{problem:"Not enough vocabulary", answer:"Choose topics carefully and personalise"},', '{problem:"Not enough vocabulary", answer:"Preparation and task language"},'),
        ('{problem:"Pronunciation problems", answer:"Preparation"},', '{problem:"Pronunciation problems", answer:"Coping strategies"},'),
        ('{problem:"Can\'t think quickly enough", answer:"Classroom atmosphere, small groups"},', '{problem:"Can\'t think quickly enough", answer:"Preparation"},'),
        ('{problem:"Topic isn\'t interesting", answer:"Preparation and task language"}', '{problem:"Topic isn\'t interesting", answer:"Choose topics carefully and personalise"}'),
        ("row.innerHTML = '<span style=\"min-width:230px;font-weight:700;\">'+p.problem+'</span>", "row.innerHTML = '<span style=\"font-weight:600;\">'+p.problem+'</span>"),
    ],
))

# ---- Teaching exam classes ---------------------------------------------------
RECIPES.append(dict(
    slug='teaching-exam-classes',
    sources="""Exam facts are from Cambridge English, IELTS, ETS and Pearson's own published descriptions of each exam.""", src='desktop:Teaching-Exam-Classes-Input-Session.html',
    title='Teaching exam classes', sub='Young learners to C2: Cambridge, IELTS, TOEFL and PTE, which exam to recommend, and how to become an examiner yourself.',
    nav=[('s1', '1 · The CEFR ladder'), ('s2', '2 · Acronyms'), ('s3', '3 · The exams'), ('s4', '4 · Which exam?'), ('s5', '5 · Be an examiner'), ('s6', '6 · Wrap-up')],
    css=r"""
  .ladder{display:flex; flex-direction:column-reverse; gap:8px; margin:12px 0;}
  .rung{border-radius:var(--r-strip); padding:12px 16px; cursor:pointer; border:1.5px solid var(--sand-line); background:var(--paper); transition:border-color .12s ease; display:flex; align-items:center; gap:14px;}
  .rung:hover{border-color:var(--gold);}
  .rung.open{border-color:var(--teal);}
  .rung .lvl{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.2rem; color:var(--paper); background:var(--teal); border-radius:var(--r-control); padding:6px 12px; min-width:52px; text-align:center;}
  .rung .rtext{flex:1;}
  .rung .rname{font-weight:600;}
  .rung .rdetail{display:none; font-size:.86rem; color:var(--ink); margin-top:6px; line-height:1.5;}
  .rung.open .rdetail{display:block;}
  .exam-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:12px 0;}
  @media(max-width:800px){ .exam-grid{grid-template-columns:repeat(2,1fr);} }
  @media(max-width:560px){ .exam-grid{grid-template-columns:1fr;} }
  .exam-card{border-radius:var(--r-strip); border:1.5px solid var(--sand-line); background:var(--paper); cursor:pointer; overflow:hidden; transition:border-color .12s ease;}
  .exam-card:hover{border-color:var(--gold);}
  .exam-card.open{border-color:var(--teal);}
  .exam-front{padding:14px 14px 12px; text-align:center;}
  .exam-front .acro{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.3rem; color:var(--teal);}
  .exam-front .full{font-size:.78rem; color:var(--grey); margin-top:2px;}
  .exam-front .lvltag{display:inline-block; margin-top:8px; font-size:.68rem; font-weight:700; background:var(--box); border:1px solid var(--sand-line); color:oklch(45% 0.02 70); padding:2px 9px; border-radius:999px;}
  .exam-back{display:none; padding:12px 14px; font-size:.84rem; line-height:1.6; border-top:1px solid var(--row-line);}
  .exam-back b{color:var(--teal);}
  .exam-card.open .exam-back{display:block;}
  .scenario{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; margin:10px 0;}
  .scenario .sc-text{font-size:.92rem; margin-bottom:8px; font-style:italic;}
  .examiner-grid{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:12px 0;}
  @media(max-width:640px){ .examiner-grid{grid-template-columns:1fr;} }
  .examiner-panel{border-radius:var(--r-strip); border:1.5px solid var(--sand-line); overflow:hidden; background:var(--paper); transition:border-color .12s ease;}
  .examiner-panel:hover{border-color:var(--gold);}
  .examiner-panel.open{border-color:var(--teal);}
  .examiner-head{padding:14px 16px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:10px;}
  .examiner-head h4{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; color:var(--ink);}
  .examiner-head .chev{width:8px; height:8px; border-right:2px solid var(--gold-deep); border-bottom:2px solid var(--gold-deep); transform:rotate(45deg); transition:transform .2s; flex:none; margin-right:4px;}
  .examiner-panel.open .chev{transform:rotate(225deg);}
  .examiner-body{display:none; padding:0 16px 14px; font-size:.88rem; line-height:1.65;}
  .examiner-body p{margin:0 0 6px;}
  .examiner-panel.open .examiner-body{display:block;}
  .examiner-body ul{margin:8px 0 0; padding-left:18px;}
  .certificate{text-align:center; border:2px dashed var(--gold); border-radius:var(--r-card); padding:26px 22px; background:var(--gold-wash);}
  .certificate h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.4rem; color:var(--teal); margin:0 0 6px;}
  .certificate p{color:var(--ink); font-size:.92rem; margin:0; max-width:52ch; margin-inline:auto;}
  .card > ul{font-size:.92rem; line-height:1.7; padding-left:20px;}
  @media print{ .rung .rdetail{display:block !important;} .exam-back{display:block !important;} .examiner-body{display:block !important;} }
""",
    body=[
        ('Climb the CEFR Ladder <span', 'Climb the CEFR ladder <span'),
        ('Every exam we\'ll meet today sits somewhere on this ladder.', 'Every exam in this session sits somewhere on this ladder.'),
        ('<span>a bit of fun</span>', '<span>the names</span>'),
        ('Decode the Acronyms <span', 'Decode the acronyms <span'),
        ('<span>student-centred exploration</span>', '<span>the exams</span>'),
        ('Exam Explorer <span', 'The exams <span'),
        ('Wander at your own pace. Click any card to flip it open — level, age group, skills tested, format, and one fun fact.', 'Wander at your own pace. Click any card to open it: level, age group, skills tested, format, and one fact worth knowing.'),
        ('Which Exam Would You Recommend? <span', 'Which exam would you recommend? <span'),
        ('<button class="btn" style="background:var(--amber);" onclick="checkScenarios()">Check my recommendations</button>', '<button class="btn teal" onclick="checkScenarios()">Check my recommendations</button>'),
        ('Fancy Being an Examiner? <span', 'Being an examiner <span'),
        ('Teaching exam classes is one path. Marking and examining them is another — many CELTA and DELTA-qualified teachers do both.', 'Teaching exam classes is one path. Marking and examining them is another; many CELTA and DELTA-qualified teachers do both.'),
        ('<span>the end (of the course!)</span>', '<span>wrap-up</span>'),
        ('<div class="stage-title">Wrap-up <span class="badge">You made it</span></div>', '<div class="stage-title">Wrap-up</div>'),
        ('<div class="seal">🏆</div>\n', ''),
        ('<h3>Certificate of Exam-Awareness</h3>', '<h3>Certificate of exam awareness</h3>'),
        ('your IELTS band from your TOEFL score — and that you might just fancy a go at examining one day.', 'your IELTS band from your TOEFL score, and that you might fancy a go at examining one day.'),
        ('<p class="lead" style="margin-top:18px;"><b>Before you go — discuss:</b></p>\n      <ul style="font-size:.9rem;color:var(--sub);line-height:1.7;">', '<p class="lead" style="margin-top:18px;"><b>Before you go, discuss:</b></p>\n      <ul>'),
        ('Would you ever consider training as an examiner — speaking or writing?', 'Would you ever consider training as an examiner, for speaking or for writing?'),
    ],
    script=[
        ("fb.textContent = done===items.length ? 'All matched! ✓' : done+' / '+items.length+' matched';", "fb.textContent = done===items.length ? 'All eleven matched' : done+' / '+items.length+' matched';"),
        ("'<option value=\"\">— choose an exam —</option>'", "'<option value=\"\">Choose an exam</option>'"),
        ("sel.style.borderColor = sel.value ? (r?'#2a8c82':'#b8433a') : '';", "sel.classList.remove('ok','no'); if(sel.value) sel.classList.add(r?'ok':'no');"),
        ("<span class=\"chev\">▾</span>", "<span class=\"chev\"></span>"),
        ("{acro:'C2 Proficiency', full:'CPE — Certificate of Proficiency', c:'#b8433a', csoft:'#f8e1de', level:'C2', age:'18+', skills:'Reading, Writing, Listening, Use of English, Speaking', format:'Paper or computer', fact:'Near-native level — some questions trip up native speakers too!'},",
         "{acro:'C2 Proficiency', full:'CPE — Certificate of Proficiency', c:'#b8433a', csoft:'#f8e1de', level:'C2', age:'18+', skills:'Reading, Writing, Listening, Use of English, Speaking', format:'Paper or computer', fact:'Near-native level: some questions trip up native speakers too.'},"),
        ("fact:'The Speaking test is a real face-to-face conversation with an examiner — no computer involved.'", "fact:'The Speaking test is a real face-to-face conversation with an examiner; no computer involved.'"),
        ("fact:'Speaking answers are recorded and sent off for scoring — you never talk to a live examiner.'", "fact:'Speaking answers are recorded and sent off for scoring; you never talk to a live examiner.'"),
        ("fact:'Results are often ready in under 48 hours — the fastest of the major exams.'", "fact:'Results are often ready in under 48 hours, the fastest of the major exams.'"),
        ("fact:'No pass or fail — candidates earn 1–5 shields, so every child feels successful.'", "fact:'No pass or fail: candidates earn 1 to 5 shields, so every child feels successful.'"),
        ("fact:'The single most widely taken Cambridge exam in the world.'", "fact:'The most widely taken Cambridge exam in the world.'"),
        ("text:'\"I\\u2019m 9 and I want to learn English through games — nothing scary!\"'", "text:'\"I\\u2019m 9 and I want to learn English through games, nothing scary.\"'"),
        ("text:'\"I need a fast result — I have a visa deadline in one week and I\\u2019m comfortable on a computer.\"'", "text:'\"I need a fast result. I have a visa deadline in one week and I\\u2019m comfortable on a computer.\"'"),
        ("text:'\"I\\u2019m B2 and I want a widely recognised certificate that doesn\\u2019t expire.\"'", "text:'\"I\\u2019m B2 and I want a widely recognised certificate that doesn\\u2019t expire.\"'"),
        ("often from home — a popular route for teachers who want flexible, exam-season income.", "often from home, a popular route for teachers who want flexible, exam-season income."),
        ("Full paid training, followed by standardisation — practice sessions scored against a benchmark until you\\u2019re reliably consistent", "Full paid training, followed by standardisation: practice sessions scored against a benchmark until you\\u2019re reliably consistent"),
        ("Training focuses on applying the mark scheme consistently — lots of sample scripts, lots of moderation", "Training focuses on applying the mark scheme consistently: lots of sample scripts, lots of moderation"),
    ],
))

# ---- the cork-board pages: Writing, Lesson framework ------------------------
# Both were pinned notes on a cork board (Kalam, rotated paper, red pins). On
# the desk they are the same sections as cards. Their sort activities share
# one pattern: a bank of chips, zones to tap, a progress line and a reset.
BOARD_CSS = r"""
  .wrap .wrap{max-width:none; padding:18px 20px 20px; margin:0 0 14px; background:var(--surface); border-left:5px solid var(--gold); border-radius:var(--r-control);}
  @media(max-width:560px){ .wrap .wrap{padding:14px 14px 16px;} }
  section{margin:0 0 24px;}
  .section-label{display:block; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.25rem; margin:0 0 10px; line-height:1.25;}
  .wrap p.intro, .sort-instructions, .pacing-intro{color:var(--grey); font-size:.92rem; margin:0 0 14px; line-height:1.55;}
  .note-card{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; margin:0 0 12px; font-size:.9rem; line-height:1.6;}
  .note-card h4{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; margin:0 0 6px;}
  .note-card ul{margin:6px 0 0; padding-left:20px;}
  .note-card.flag{border-left:4px solid var(--gold);}
  .sort-bank, .stage-tray, .seq-bank{display:flex; flex-wrap:wrap; gap:8px; margin:0 0 16px; min-height:44px;}
  .sort-chip, .stage-card, .seq-chip{background:var(--field); border:1.5px solid var(--sand-line); padding:8px 12px; border-radius:var(--r-control); font-weight:500; font-size:.88rem; cursor:pointer; user-select:none; transition:border-color .12s ease, opacity .2s; min-height:38px; display:inline-flex; align-items:center;}
  .sort-chip:hover, .stage-card:hover, .seq-chip:hover{border-color:var(--gold);}
  .sort-chip.selected, .stage-card.selected{border-color:var(--gold); background:var(--field-focus); outline:2px solid var(--gold-wash);}
  .sort-chip.placed, .stage-card.placed{display:none;}
  .seq-chip.used{opacity:.3; pointer-events:none;}
  .sort-zones, .zone-grid{display:grid; grid-template-columns:repeat(auto-fit, minmax(170px,1fr)); gap:10px;}
  .sort-zone, .zone{min-height:90px; border-radius:var(--r-strip); border:1.5px dashed var(--sand-line); background:var(--paper); padding:10px; cursor:pointer; transition:border-color .12s ease;}
  .sort-zone:hover, .zone:hover{border-color:var(--gold);}
  .sort-zone-title, .zone-title{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem; margin:0 0 6px; text-align:center;}
  .sort-zone .dropped, .zone .dropped-card{background:color-mix(in oklab, var(--teal) 10%, transparent); border:1px solid color-mix(in oklab, var(--teal) 26%, transparent); color:var(--teal); padding:6px 9px; border-radius:var(--r-control); font-size:.82rem; font-weight:600; margin:0 0 6px; text-align:left;}
  .zone.correct{border-style:solid; border-color:var(--teal);}
  .sort-zone.wrong, .zone.wrong{animation:shake .35s; border-color:var(--brick);}
  @keyframes shake{0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);}}
  .sort-progress, .progress-note, .seq-feedback{font-weight:600; font-size:.86rem; color:var(--gold-deep); margin:12px 0 0;}
  .sort-reset, .reset-btn, .seq-reset-btn, .seq-check-btn, .seq-reveal-btn, .reveal-btn, .flaw-toggle, .pacing-reveal-btn{display:inline-flex; align-items:center; justify-content:center; font-family:'Karla',sans-serif;
    font-size:.84rem; font-weight:600; padding:8px 16px; border-radius:var(--r-control); cursor:pointer; background:none; color:var(--grey); border:1.5px solid var(--sand-line); min-height:38px; margin-top:10px; box-shadow:none;}
  .sort-reset:hover, .reset-btn:hover, .seq-reset-btn:hover, .reveal-btn:hover, .flaw-toggle:hover, .pacing-reveal-btn:hover, .seq-reveal-btn:hover{border-color:var(--grey); color:var(--ink);}
  .seq-check-btn{background:var(--teal); color:var(--paper); border-color:var(--teal);}
  .seq-check-btn:hover{background:var(--teal-lifted); border-color:var(--teal-lifted);}
  .reveal-box, .flaw-fix, .pacing-answer, .seq-answer{display:none; margin-top:12px; padding:12px 16px; background:var(--gold-wash); border:1px solid var(--amber-edge); border-radius:var(--r-strip); font-size:.88rem; line-height:1.6;}
  .reveal-box.open, .flaw-fix.open, .pacing-answer.open, .seq-answer.open{display:block;}
  .reveal-box ul, .seq-answer ol{margin:6px 0 0; padding-left:20px;}
  .reveal-box strong, .seq-answer strong{color:var(--gold-deep);}
  @media(max-width:560px){ .sort-zones, .zone-grid{grid-template-columns:1fr 1fr;} }
  @media print{ .reveal-box, .flaw-fix, .pacing-answer, .seq-answer, .sort-reset, .reset-btn, .reveal-btn, .flaw-toggle, .seq-btn-row, .pacing-reveal-btn{display:none !important;} }
"""

RECIPES.append(dict(
    slug='teaching-writing',
    sources="""The Ali and Fatma text, the Joe and Barbara parallel-writing task and the product-process contrast are from the tutor's CELTA input materials; the thank-you letter activity is the tutor's own.""", src='desktop:writing_input_session_1.html', root='board', number_sections=True,
    title='Teaching writing', sub='Finding the words. A mystery present and a thank-you letter, attitudes to writing, what we think about before we write, product and process, a wall dictation, parallel writing, and the road from controlled to freer.',
    nav=[('s1', '1 · Warm-up'), ('s2', '2 · The letter'), ('s3', '3 · Attitudes'), ('s4', '4 · Before we write'), ('s5', '5 · Product or process'), ('s6', '6 · Dictation'), ('s7', '7 · Parallel writing'), ('s8', '8 · Controlled to freer'), ('s9', '9 · Wrap-up')],
    css=BOARD_CSS + r"""
  .letter-card{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-strip); padding:20px 24px; max-width:460px; margin:0 auto 14px;
    font-family:'Newsreader',Georgia,serif; font-style:italic; font-size:1.08rem; line-height:1.7;}
  .dictation-line{background:var(--paper); border:1px solid var(--sand-line); padding:9px 14px; border-radius:var(--r-control); margin:0 0 6px; font-size:.92rem; opacity:.18; transition:opacity .3s;}
  .dictation-line.shown{opacity:1;}
  .dictation-btn-row{display:flex; gap:10px; flex-wrap:wrap; margin:0 0 12px;}
  .dictation-btn-row button{margin-top:0;}
  .term-display{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:26px; text-align:center; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.8rem; color:var(--teal); max-width:420px; margin:0 auto 10px;}
  .term-def{font-size:.9rem; color:var(--grey); margin:0 0 10px; text-align:center;}
  @media print{ .dictation-line{opacity:1;} .term-display, .term-def{display:none;} }
""",
    drop=[r'\s*<div class="header-pin-wrap">.*?</h1>\s*</div>\s*</div>'],
    body=[
        ('<span class="section-label">1 · Warm-up — the mystery present</span>', '<span class="section-label">1 · Warm-up: the mystery present</span>'),
        ('<h4>Live activity (no screen needed)</h4>', '<h4>A live activity, no screen needed</h4>'),
        ('<span class="section-label">4 · What do we think about when we write?</span>', '<span class="section-label">4 · What do we think about before we write?</span>'),
        ('<h4>Live activity — bring your own copy</h4>', '<h4>A live activity, with your own copy of the strip</h4>'),
        ('<button class="sort-reset" id="attReset">↺ Reset</button>', '<button class="sort-reset" id="attReset">Reset</button>'),
        ('<button class="sort-reset" id="ppReset">↺ Reset</button>', '<button class="sort-reset" id="ppReset">Reset</button>'),
        ('<button class="sort-reset" id="subReset">↺ Reset</button>', '<button class="sort-reset" id="subReset">Reset</button>'),
        ('<button class="sort-reset" id="dictResetBtn">↺ Hide all</button>', '<button class="sort-reset" id="dictResetBtn">Hide all</button>'),
        ('<span class="section-label">6 · Wall dictation — Ali &amp; Fatma</span>', '<span class="section-label">6 · Wall dictation: Ali and Fatma</span>'),
        ('<span class="section-label">7 · Now you write — parallel writing</span>', '<span class="section-label">7 · Now you write: parallel writing</span>'),
        ('<span class="section-label">8 · Controlled → semi-controlled → freer</span>', '<span class="section-label">8 · Controlled, semi-controlled, freer</span>'),
        ('<span class="section-label">9 · Wrap-up — backs to the board</span>', '<span class="section-label">9 · Wrap-up: backs to the board</span>'),
        ('<li>Where are Ali and Fatma from? — They\'re from Ankara.</li>', '<li>Where are Ali and Fatma from? They\'re from Ankara.</li>'),
        ('<li>Where do they live? — They live in Istanbul.</li>', '<li>Where do they live? They live in Istanbul.</li>'),
        ('<li>Where do they work? — They work for Efes, the beer factory.</li>', '<li>Where do they work? They work for Efes, the beer factory.</li>'),
        ('<li>Do they like television? — Yes, they do.</li>', '<li>Do they like television? Yes, they do.</li>'),
        ('<li>Do they like football? — The text says volleyball, not football — check students catch this.</li>', '<li>Do they like football? The text says volleyball, not football; check students catch this.</li>'),
        ('<li>Do they drink beer? — No, they don\'t. They don\'t like it.</li>', '<li>Do they drink beer? No, they don\'t. They don\'t like it.</li>'),
        ('<em>Optional speaking follow-up: turn this into an info-gap — one student has', '<em>Optional speaking follow-up: turn this into an information gap. One student has'),
        ('<li>Coherence vs. cohesion</li>', '<li>Coherence and cohesion</li>'),
        ('<span class="section-label">5 · Product vs. process writing</span>', '<span class="section-label">5 · Product or process writing</span>'),
        ('<h4>A live activity, no screen needed</h4>\n        Each trainee writes, on a scrap of paper, an interesting present they could give someone in the room — without saying who it\'s for (online: type it in the chat instead). Collect all the "presents" and redistribute them so nobody gets their own back (online: copy/paste the chat messages and reassign them anonymously, or use breakout room pairs). Ask: what do you do when you receive a present? Elicit: <em>say thank you.</em> Since nobody knows who their present is from, they\'re going to write a thank-you letter to find out.',
         '<h4>A live activity, no screen needed</h4>\n        On a scrap of paper, write an interesting present you could give someone in the room, without saying who it is for (online: type it in the chat). The presents are collected and handed out again, so nobody gets their own back. What do you do when you receive a present? You say thank you. Nobody knows who their present is from, so you are going to write a thank-you letter to find out.'),
        ('<p class="intro">Show the model letter below. Ask: how does it start? What other features does it have? Is the present actually named — or only implied?</p>',
         '<p class="intro">Read the model letter. How does it start? What other features does it have? Is the present actually named, or only implied?</p>'),
        ('<h4>Task</h4>\n        Trainees write their own thank-you letter for the present they received — implying what it is, never naming it outright. Then everyone mingles, holding their letters up, reading others\' letters aloud until they can "deliver" theirs to the person whose present they described (online: post letters in the chat, or read them aloud in breakout room pairs/trios and swap until everyone finds their match).',
         "<h4>Task</h4>\n        Write your own thank-you letter for the present you received, implying what it is and never naming it outright. Then everyone mingles, letters held up, reading each other's aloud until you can deliver yours to the person whose present you described (online: post the letters in the chat, or read them aloud in breakout rooms and swap until everyone finds their match)."),
        ("<h4>A live activity, with your own copy of the strip</h4>\n        This is where the session uses a short SpongeBob cartoon strip: trainees order the panels and discuss his attitude to writing (what was the task? what's the purpose?). I can't reproduce the strip here since it's copyrighted — bring your printed panels for this part, then come back to this page to brainstorm and check the list below.",
         '<h4>A live activity, on paper</h4>\n        Your tutor hands out a short SpongeBob cartoon strip. Put the panels in order, then talk about his attitude to writing: what was the task, and what was it for? The strip is copyrighted, so it is not on this page.'),
        ('<p class="intro">Brainstorm as a group first: what do we need to think about before we write anything? Then reveal the checklist.</p>',
         '<p class="intro">As a group: what do we need to think about before we write anything? Make your list first, then reveal the checklist and compare.</p>'),
        ('<p class="intro">Run this as a running dictation (post the text on a wall outside, students run back and forth to relay it) or reveal it here line by line as a reading text (online: share it line by line on screen, or drop it into a breakout room for one student to relay to their group by voice).</p>',
         '<p class="intro">A running dictation: the text is on a wall outside the room, and one of you runs to it, remembers a line, and comes back to dictate it to your partner, who writes. Swap roles. On screen, the text appears line by line instead.</p>'),
        ('<p class="intro">One trainee sits with their back to the board. Tap "New term" to show a word to everyone else, who must describe it (without saying the word) until the guesser gets it (online: the "guesser" turns their camera off or looks away from the screen while everyone else describes the word in the chat or out loud).</p>',
         '<p class="intro">One of you sits with your back to the board. New term shows a word to everyone else, who describe it without saying it until the guesser gets it (online: the guesser looks away from the screen while the others describe the word in the chat or out loud).</p>'),
    ],
    script=[
        ('{text:"More global — purpose, theme, reader in mind", zone:"Process"},', '{text:"More global: purpose, theme, reader in mind", zone:"Process"},'),
        ('{word: "Purpose", def: "Why the text is being written — the goal behind it."},', '{word: "Purpose", def: "Why the text is being written; the goal behind it."},'),
    ],
))

RECIPES.append(dict(
    slug='lesson-framework',
    sources="""The six shapes and the decision tree follow the International House CELTA lesson shapes; the MFPA table is the course's own.""", src='lesson-framework/index.html', root='board', number_sections=True,
    title='Lesson frameworks: finding your shape', sub='Which shape fits which lesson. A decision tree, the six shapes, then nine ways to test yourself on them: sorting, a quiz, scenarios, meaning or form, flawed plans, pacing, sequencing, and a coursebook page.',
    nav=[('s1', '1 · Decision tree'), ('s2', '2 · Six shapes'), ('s3', '3 · Card sort'), ('s4', '4 · Quiz'), ('s5', '5 · Scenarios'), ('s6', '6 · Meaning or form'), ('s7', '7 · The flaw'), ('s8', '8 · Pacing'), ('s9', '9 · Sequence'), ('s10', '10 · Coursebook')],
    css=BOARD_CSS + r"""
  .flow, .sort-wrap{background:var(--surface); border-left:5px solid var(--gold); border-radius:var(--r-control); padding:18px 20px 20px; margin:0 0 14px;}
  @media(max-width:560px){ .flow, .sort-wrap{padding:14px 14px 16px;} }
  .flow{max-width:none;}
  .flow-row{display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-bottom:16px;}
  .flow-card{background:var(--paper); border:1px solid var(--sand-line); padding:10px 16px; border-radius:var(--r-control); font-weight:600; font-size:.9rem; text-align:center; min-width:150px;}
  .flow-card.q{background:var(--gold-wash); border-color:var(--amber-edge); font-family:'Newsreader',Georgia,serif; font-size:1.05rem;}
  .flow-card.branch{font-weight:400; font-size:.86rem;}
  .flow-card.ppp-mini{background:var(--paper) !important; color:var(--teal); border-color:color-mix(in oklab, var(--teal) 30%, transparent); font-size:.82rem !important;}
  .flow-card[style*="--orange"]{background:var(--paper) !important; color:var(--teal);}
  .flow-arrow{text-align:center; margin:-2px 0 6px; font-size:0; height:12px; position:relative;}
  .flow-arrow::after{content:""; position:absolute; left:50%; top:0; width:8px; height:8px; border-right:1.5px solid var(--gold-deep); border-bottom:1.5px solid var(--gold-deep); transform:translateX(-50%) rotate(45deg);}
  .fork{display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:20px; justify-items:center; align-items:start;}
  .fork-branch{display:flex; flex-direction:column; align-items:center; gap:8px; width:100%; max-width:320px;}
  .fork-tag{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-deep); font-weight:600;}
  .fw-grid{display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:12px;}
  .fw-card{background:var(--surface); border-left:5px solid var(--gold); border-radius:var(--r-control); padding:16px 18px 18px; font-size:.9rem; transform:none !important; min-height:0; box-shadow:none;}
  .fw-card .pin{display:none;}
  .fw-card h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.15rem; margin:0 0 8px; color:var(--teal);}
  .fw-card ol{margin:0; padding-left:18px; line-height:1.6;}
  .fw-card.ppp, .fw-card.ttt, .fw-card.text, .fw-card.practice, .fw-card.receptive, .fw-card.productive{background:var(--surface); color:var(--ink);}
  .quiz-grid{display:grid; grid-template-columns:repeat(auto-fit, minmax(230px,1fr)); gap:12px;}
  .quiz-grid .flip-card{perspective:1000px; height:160px; cursor:pointer; border:0; background:none; border-radius:0; overflow:visible;}
  .flip-inner{position:relative; width:100%; height:100%; transition:transform .5s; transform-style:preserve-3d;}
  .flip-card.flipped .flip-inner{transform:rotateY(180deg);}
  .quiz-grid .flip-face{position:absolute; inset:0; border-radius:var(--r-strip); padding:16px; backface-visibility:hidden; display:flex; align-items:center; justify-content:center; text-align:center; font-size:.9rem; border:1.5px solid var(--sand-line);}
  .quiz-grid .flip-front{background:var(--paper); font-family:'Karla',sans-serif; font-weight:500; color:var(--ink);}
  .quiz-grid .flip-back{display:flex; background:var(--paper); border-color:var(--teal); color:var(--teal); font-weight:600; transform:rotateY(180deg);}
  .quiz-num{position:absolute; top:8px; left:12px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.95rem; color:var(--gold-deep);}
  .scenario-card, .mf-card, .flaw-card, .pacing-stage-row, .pacing-question{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; margin:0 0 10px;}
  .scenario-text{font-size:.92rem; margin:0 0 10px; line-height:1.55;}
  .scenario-options, .mf-options{display:flex; flex-wrap:wrap; gap:8px;}
  .opt-btn{background:var(--field); border:1.5px solid var(--sand-line); padding:6px 14px; border-radius:999px; font-family:'Karla',sans-serif; font-weight:700; font-size:.8rem; cursor:pointer; color:var(--grey); min-height:34px; transition:border-color .12s ease;}
  .opt-btn:hover{border-color:var(--gold);}
  .opt-btn.correct-pick{background:var(--teal); border-color:var(--teal); color:#F0EEE9;}
  .opt-btn.wrong-pick{background:color-mix(in oklab, var(--brick) 10%, transparent); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .opt-btn[disabled]{cursor:default;}
  .mf-card{display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;}
  .mf-example{font-size:.9rem; font-weight:500; flex:1; min-width:200px;}
  .mf-example em{display:block; font-style:italic; font-weight:400; font-size:.82rem; color:var(--grey); margin-top:2px;}
  .flaw-title{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; margin:0 0 6px;}
  .flaw-plan{font-size:.9rem; margin:0 0 8px; line-height:1.55;}
  .flaw-toggle{margin-top:0;}
  .pacing-stage-row{display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;}
  .pacing-stage-name{font-size:.9rem; font-weight:500; flex:1; min-width:200px;}
  .pacing-input-wrap{display:flex; align-items:center; gap:6px; font-size:.86rem; color:var(--grey);}
  .pacing-input{width:64px; padding:6px 8px; border-radius:var(--r-control); border:1.5px solid var(--sand-line); font-size:.9rem; font-family:'Karla',sans-serif; text-align:center; background:var(--field); min-height:38px;}
  .pacing-input:focus{outline:none; border-color:var(--gold);}
  .pacing-total-bar{margin-top:12px; padding:10px 16px; border-radius:var(--r-control); background:var(--paper); border:1px solid var(--sand-line); font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; text-align:center;}
  .pacing-total-bar.ok{border-color:var(--teal); color:var(--teal);}
  .pacing-total-bar.over{border-color:var(--brick); color:var(--brick);}
  .pacing-question{margin-top:16px;}
  .pacing-question p{font-size:.92rem; font-weight:500; margin:0 0 8px;}
  .pacing-reveal-btn{margin-top:0;}
  .pacing-table{width:100%; border-collapse:collapse; margin-top:12px; font-size:.84rem;}
  .pacing-table th, .pacing-table td{border:1px solid var(--sand-line); padding:6px 10px; text-align:left; background:var(--paper);}
  .pacing-table th{background:var(--gold-wash); color:var(--gold-deep); font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.1em; text-transform:uppercase; font-weight:600;}
  .seq-framework-select{display:flex; gap:8px; flex-wrap:wrap; margin:0 0 16px;}
  .seq-fw-btn{background:var(--field); border:1.5px solid var(--sand-line); padding:7px 14px; border-radius:999px; font-family:'Karla',sans-serif; font-weight:700; font-size:.82rem; cursor:pointer; color:var(--grey); min-height:36px;}
  .seq-fw-btn:hover{border-color:var(--gold);}
  .seq-fw-btn.active{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .aim-label{font-family:'Instrument Sans','Karla',sans-serif !important; font-size:10px !important; letter-spacing:.18em; text-transform:uppercase; color:var(--grey) !important; font-weight:600; margin:0 0 6px;}
  .seq-build{min-height:60px; border-radius:var(--r-strip); border:1.5px dashed var(--sand-line); background:var(--paper); padding:12px; display:flex; flex-direction:column; gap:6px; margin:0 0 12px;}
  .seq-slot{display:flex; align-items:center; gap:10px; background:var(--field); border:1.5px solid var(--sand-line); padding:8px 12px; border-radius:var(--r-control); font-size:.88rem; font-weight:500; cursor:pointer;}
  .seq-slot.correct{border-color:var(--teal); color:var(--teal);}
  .seq-slot.wrong{border-color:var(--brick); color:var(--brick);}
  .seq-slot .seq-num{font-family:'Newsreader',Georgia,serif; font-weight:600; background:var(--gold-wash); color:var(--gold-deep); width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.82rem; flex-shrink:0;}
  .seq-btn-row{display:flex; gap:10px; flex-wrap:wrap;}
  .seq-btn-row button{margin-top:0;}
  .cb-grid{display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:12px;}
  .cb-flip-card{perspective:1000px; height:230px; cursor:pointer;}
  .cb-flip-inner{position:relative; width:100%; height:100%; transition:transform .5s; transform-style:preserve-3d;}
  .cb-flip-card.flipped .cb-flip-inner{transform:rotateY(180deg);}
  .cb-flip-face{position:absolute; inset:0; border-radius:var(--r-strip); padding:14px 16px; backface-visibility:hidden; display:flex; flex-direction:column; justify-content:center; border:1.5px solid var(--sand-line); background:var(--paper);}
  .cb-flip-front{text-align:center;}
  .cb-flip-front .cb-page{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600; margin:0 0 6px;}
  .cb-flip-front h4{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem; margin:0 0 6px;}
  .cb-flip-front .cb-topic{font-size:.8rem; color:var(--grey); margin:0 0 10px; line-height:1.45;}
  .cb-flip-front .cb-tap{font-size:.72rem; color:var(--gold-deep); font-style:italic; margin:0;}
  .cb-flip-back{border-color:var(--teal); transform:rotateY(180deg); overflow-y:auto; font-size:.78rem; line-height:1.5; justify-content:flex-start;}
  .cb-flip-back strong{display:block; margin-bottom:4px; color:var(--teal);}
  .cb-flip-back.cb-dense{font-size:.7rem; line-height:1.4; padding:12px 14px;}
  @media print{ .quiz-grid .flip-card{height:auto;} .flip-inner{transform:none !important;} .quiz-grid .flip-back, .cb-flip-back{display:none !important;} .quiz-grid .flip-face, .cb-flip-face{position:static; transform:none;} .cb-flip-card{height:auto;} }
""",
    drop=[r'\s*<div class="header-pin-wrap">.*?</h1>\s*</div>\s*</div>'],
    body=[
        ('<div class="flow-card q">Is the MAIN aim language or skills?</div>', '<div class="flow-card q">Is the main aim language or skills?</div>'),
        ('<span class="fork-tag">LANGUAGE</span>', '<span class="fork-tag">Language</span>'),
        ('<span class="fork-tag">SKILLS</span>', '<span class="fork-tag">Skills</span>'),
        ('<div class="flow-card branch">Clarification / Practice / Both?</div>', '<div class="flow-card branch">Clarification, practice, or both?</div>'),
        ('<div class="flow-card branch">Does TL arise from a text? (Y/N)</div>', '<div class="flow-card branch">Does the target language arise from a text?</div>'),
        ('<div class="flow-card ppp-mini" style="background:var(--pink); font-size:0.8rem;">NO → PPP / TTT</div>', '<div class="flow-card ppp-mini">No: PPP or TTT</div>'),
        ('<div class="flow-card ppp-mini" style="background:var(--teal); font-size:0.8rem;">YES → Text-Based</div>', '<div class="flow-card ppp-mini">Yes: text-based</div>'),
        ('<div class="flow-card branch" style="background:var(--orange);">PRACTICE only → Language Practice</div>', '<div class="flow-card ppp-mini">Practice only: language practice</div>'),
        ('<div class="flow-card branch">Listening / Reading? (Y/N)</div>', '<div class="flow-card branch">Listening or reading?</div>'),
        ('<div class="flow-card ppp-mini" style="background:var(--blue); font-size:0.8rem;">YES → Receptive Skills</div>', '<div class="flow-card ppp-mini">Yes: receptive skills</div>'),
        ('<div class="flow-card ppp-mini" style="background:var(--purple); font-size:0.8rem;">NO → check Speaking/Writing → Productive Skills</div>', '<div class="flow-card ppp-mini">No, speaking or writing: productive skills</div>'),
        ('<div class="flow-arrow">↓</div>', '<div class="flow-arrow"></div>'),
        ('<li>Gist → Detail → Specific info</li>', '<li>Gist, then detail, then specific information</li>'),
        ('<span class="section-label">3 · Card sort — pin the stage to its shape</span>', '<span class="section-label">3 · Card sort: put the stage with its shape</span>'),
        ('<button class="reset-btn" id="resetSort">↺ Reset the tray</button>', '<button class="reset-btn" id="resetSort">Reset the tray</button>'),
        ('<span class="section-label">4 · Quick quiz — tap a card to flip</span>', '<span class="section-label">4 · Quick quiz: tap a card to turn it</span>'),
        ('<span class="section-label">5 · Scenario challenge — name that framework</span>', '<span class="section-label">5 · Scenarios: name the framework</span>'),
        ('Read the mini lesson, tap the framework you think it is. Cards flash green if you\'re right, red if not — try again either way.', 'Read the mini lesson, then tap the framework you think it is. Teal means right, red means try again.'),
        ('<span class="section-label">6 · Meaning or Form? — quick fire</span>', '<span class="section-label">6 · Meaning or form? Quick fire</span>'),
        ('<span class="section-label">7 · Error analysis — spot the stage flaw</span>', '<span class="section-label">7 · Spot the flaw in the staging</span>'),
        ('<span class="section-label">8 · Stage timer — pacing challenge</span>', '<span class="section-label">8 · Pacing: budget the minutes</span>'),
        ('Budget the minutes across the three stages below — the total should land close to 45.', 'Budget the minutes across the three stages below; the total should land on 45.'),
        ('<span class="section-label">9 · Stage sequencer — build the lesson in order</span>', '<span class="section-label">9 · Sequence: build the lesson in order</span>'),
        ('<p class="aim-label" style="color:var(--paper); font-family:\'Kalam\',cursive; font-size:1rem;">Your sequence:</p>', '<p class="aim-label">Your sequence</p>'),
        ('<button class="seq-reset-btn" id="seqResetBtn">↺ Reshuffle</button>', '<button class="seq-reset-btn" id="seqResetBtn">Reshuffle</button>'),
        ('<span class="section-label">10 · Final activity — build your own lessons</span>', '<span class="section-label">10 · Build your own lessons from a coursebook page</span>'),
        ('The clarification stage (meaning, form, pronunciation) is where the actual learning happens — cutting it short undermines the lesson aim.', 'The clarification stage (meaning, form, pronunciation) is where the learning happens; cutting it short undermines the lesson aim.'),
    ],
    script=[
        ('{text:"Useful language???", zone:"Productive Skills"}', '{text:"Useful language (optional)", zone:"Productive Skills"}'),
        ('a:"Diagnostic — to see what students already know and where the gaps are."', 'a:"Diagnostic: to see what students already know and where the gaps are."'),
        ('a:"False — that\'s recognition, not production."', 'a:"False. That is recognition, not production."'),
        ('a:"It\'s not the target language — it\'s optional support, students don\'t have to use it."', 'a:"It is not the target language. It is optional support; students don\'t have to use it."'),
        ('a:"No time — the next teacher covers it as a Language Practice lesson."', 'a:"No time: the next teacher covers it as a language practice lesson."'),
        ('seqBuild.innerHTML = \'<span style="color:#8a7455; font-size:0.85rem;">Tap stages above to add them here, in order.</span>\';', 'seqBuild.innerHTML = \'<span style="color:var(--grey); font-size:0.85rem;">Tap stages above to add them here, in order.</span>\';'),
        ('title: "Scenario A — Productive Skills",', 'title: "Scenario A: productive skills",'),
        ('title: "Scenario B — Receptive Skills",', 'title: "Scenario B: receptive skills",'),
        ('is not target language to be formally presented — it\'s optional support', 'is not target language to be formally presented; it is optional support'),
        ('isn\'t a reading sub-skill at all — it skips straight', 'isn\'t a reading sub-skill at all; it skips straight'),
        ('Standard receptive skills staging moves from Gist → Detail → Specific Information comprehension tasks first.', 'Standard receptive skills staging moves from gist to detail to specific-information comprehension tasks first.'),
    ],
))

# ---- Alternative teaching techniques ----------------------------------------
# A lesson taught through a story (the third conditional), written as nine
# steps for the teacher with the students' tasks inside each one. Its .tutor
# and .note boxes are the trainer's asides; the gate for them comes with the
# trainer-notes pass. The drawings (the map, the timeline, the five people)
# keep their shapes and take the house colours.
RECIPES.append(dict(
    slug='alternative-teaching-techniques',
    sources="""The story adapts "The Alligator River Story" from Sidney Simon, Leland Howe and Howard Kirschenbaum, <i>Values Clarification</i> (Hart, 1972), and the five-values reading that has travelled with it since. The lesson built on it is the tutor's own.""", src='alternative-teaching-techniques/index.html', start='<div id="bar"></div>', end='<footer>',
    eyebrow='Input session · 60 minutes', title='Alternative teaching techniques',
    sub='Teaching the third conditional through a story, at B1. Nine steps: the story, eliciting the sentence, meaning, form, drilling, then controlled, semi-controlled and freer practice, and the twist.',
    nav=[('before', 'Before you start'), ('story', '1 · Story'), ('elicit', '2 · Elicit'), ('meaning', '3 · Meaning'), ('form', '4 · Form'), ('pron', '5 · Drilling'), ('controlled', '6 · Controlled'), ('semi', '7 · Semi-controlled'), ('freer', '8 · Freer'), ('twist', '9 · The twist')],
    swap=[(r'<svg class="scene".*?</svg>', 'story-map.svg')],
    hex={'#1F497D': '#2B5C5C', '#2A8C82': '#4E8A84', '#E6F2F0': '#E8EFEE', '#B3524A': '#A43A2E', '#C8912F': '#B98A3F', '#8FB6CE': '#B9C9C9',
         '#DCEBF3': '#E4ECEC', '#A9CBDE': '#C3D3D3', '#FBFCFE': '#FDFCF9', '#64748B': '#7A7268', '#8FA3B8': '#9A9284', '#1F6B65': '#2B5C5C',
         '#FBEDEC': '#F6E7E4', '#8E3B34': '#A43A2E', '#F4F8FB': '#FBF9F4'},
    css=r"""
  /* the page's own names for the IH palette, pointed at the house */
  :root{--navy:var(--teal); --navy-d:var(--teal-deep); --rose:var(--brick); --warm:var(--gold); --muted:var(--grey); --line:var(--sand-line);
    --ok:var(--teal); --ok-l:color-mix(in oklab, var(--teal) 10%, transparent); --no:var(--brick); --no-l:color-mix(in oklab, var(--brick) 9%, transparent);
    --warm-l:var(--gold-wash); --teal-l:color-mix(in oklab, var(--teal) 9%, transparent); --bg:var(--paper);}
  section{padding:0; margin:0 0 14px;}
  .card{padding:20px 22px 22px;}
  .card .eyebrow{margin:0 0 4px;}
  h2{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.3rem; margin:0 0 8px; line-height:1.25;}
  h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem; margin:20px 0 6px;}
  h4{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem; margin:14px 0 6px;}
  p{margin:8px 0; font-size:.95rem; line-height:1.6;}
  .lead{margin:0 0 10px;}
  ul, ol{margin:8px 0; padding-left:22px; font-size:.95rem;} li{margin:4px 0;}
  .tutor, .note, .key{border-radius:var(--r-control); padding:12px 16px; margin:14px 0; font-size:.9rem; line-height:1.6; background:var(--paper); border:1px solid var(--sand-line);}
  .tutor{border-left:4px solid var(--teal);} .note{border-left:4px solid var(--gold);} .key{border-left:4px solid var(--gold); background:var(--gold-wash); border-color:var(--amber-edge);}
  .tutor b:first-child, .note b:first-child, .key b:first-child{display:block; margin-bottom:3px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; font-weight:600;}
  .tutor b:first-child{color:var(--teal);} .note b:first-child, .key b:first-child{color:var(--gold-deep);}
  .btn.t{background:var(--teal); color:var(--paper); border-color:var(--teal);} .btn.t:hover{background:var(--teal-lifted); border-color:var(--teal-lifted);}
  .btn.ghost{background:none;}
  .btns{display:flex; gap:9px; flex-wrap:wrap; margin-top:12px;}
  .hidden{display:none;}
  .scene{width:100%; height:auto; display:block; border:1px solid var(--sand-line); border-radius:var(--r-strip); margin-top:14px; background:var(--paper);}
  .legend{display:grid; grid-template-columns:repeat(auto-fit,minmax(215px,1fr)); gap:10px; margin-top:12px;}
  .lg{display:flex; gap:9px; align-items:flex-start; font-size:.86rem; line-height:1.45;}
  .lg .num{flex:none; width:21px; height:21px; line-height:21px; text-align:center; background:var(--teal); color:var(--paper); border-radius:50%; font-size:12px; font-weight:700; margin-top:1px;}
  .lg b{color:var(--ink); display:block;} .lg span{color:var(--grey); font-size:.82rem;}
  .setup{display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:10px; margin-top:12px;}
  .su{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-control); padding:11px 14px;}
  .su .k{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-deep); font-weight:600;}
  .su .v{font-size:.9rem; margin-top:3px;}
  .people{display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin-top:12px;}
  .who{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 12px; text-align:center; cursor:pointer; user-select:none; transition:border-color .12s ease;}
  .who:hover{border-color:var(--gold);}
  .who.pick{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .who .ic{line-height:0;}
  .pt{width:44px; height:44px; display:block; margin:0 auto; overflow:visible;}
  .pt path, .pt circle{fill:none; stroke:var(--teal); stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round;}
  .pt .ring{stroke:var(--sand-line); stroke-width:1.4;}
  .who:hover .pt .ring, .flip:hover .pt .ring{stroke:var(--gold);}
  .who .nm, .flip .nm{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; margin-top:6px;}
  .who .rl{font-size:.8rem; color:var(--grey);}
  .board{background:var(--ink-warm); color:var(--paper); border-radius:var(--r-strip); padding:22px 20px; margin:14px 0; text-align:center;}
  .board .mk{font-family:'Newsreader',Georgia,serif; font-size:1.4rem; line-height:1.5;}
  .board .mk u{text-decoration:none; border-bottom:2px solid var(--gold); padding-bottom:1px;}
  .board small{display:block; color:oklch(80% 0.03 80); font-size:.78rem; margin-top:8px;}
  .ccq{border-bottom:1px solid var(--row-line); padding:12px 0;} .ccq:last-child{border-bottom:0;}
  .q{font-weight:600; margin-bottom:8px; font-size:.95rem;}
  .opts{display:flex; gap:8px; flex-wrap:wrap;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:5px 14px; font-size:.82rem; font-weight:700; color:var(--grey); cursor:pointer; min-height:34px; transition:border-color .12s ease;}
  .opt:hover{border-color:var(--gold);}
  .opt.good{background:var(--ok-l); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal);}
  .opt.bad{background:var(--no-l); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .opt.dim{opacity:.45;}
  .tl{width:100%; max-width:660px; margin:12px auto; display:block;}
  .frame{background:var(--paper); border:1px dashed var(--sand-line); border-radius:var(--r-strip); padding:16px; text-align:center; font-size:1.05rem; line-height:2.5; margin:12px 0;}
  .gap{display:inline-block; min-width:120px; border-bottom:2px solid var(--gold); margin:0 5px; padding:2px 8px; cursor:pointer; font-weight:600; color:var(--teal); border-radius:4px 4px 0 0;}
  .gap:hover{background:var(--gold-wash);}
  .gap.sel{background:var(--gold-wash); box-shadow:0 0 0 1.5px var(--gold) inset;}
  .gap.good{color:var(--teal); border-bottom-color:var(--teal); background:var(--ok-l);}
  .gap.bad{color:var(--brick); border-bottom-color:var(--brick); background:var(--no-l);}
  .gap:empty::after{content:'______'; color:var(--sand-line); font-weight:400;}
  .bank{display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:10px;}
  .bank .chip{background:var(--teal); color:var(--paper); border:0; border-radius:var(--r-control); padding:7px 14px; font-size:.88rem; font-weight:600; cursor:pointer; min-height:36px;}
  .bank .chip:hover{background:var(--teal-lifted);}
  .bank .chip.used{opacity:.25; pointer-events:none;}
  .ladder{list-style:none; padding:0; margin:10px 0;}
  .ladder li{background:var(--paper); border:1px solid var(--sand-line); border-left:3px solid var(--teal); border-radius:var(--r-control); padding:9px 13px; margin:6px 0; font-size:.95rem; opacity:.25; transition:opacity .25s;}
  .ladder li.show{opacity:1;}
  .ladder li .ph{color:var(--teal); font-size:.86rem; display:block; margin-top:2px;}
  .match{display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:12px;}
  .mcol h4{margin:0 0 8px;}
  .mstack{display:flex; flex-direction:column; gap:8px;}
  .mi{border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:10px 12px 10px 40px; background:var(--field); font-size:.9rem; cursor:pointer; position:relative; line-height:1.45; transition:border-color .12s ease;}
  .mi:hover{border-color:var(--gold);}
  .mi.sel{border-color:var(--gold); background:var(--field-focus);}
  .mi.done{background:var(--paper);}
  .mi.good{border-color:color-mix(in oklab, var(--teal) 30%, transparent); background:var(--ok-l);}
  .mi.bad{border-color:color-mix(in oklab, var(--brick) 28%, transparent); background:var(--no-l);}
  .mi .tag{position:absolute; left:10px; top:50%; transform:translateY(-50%); width:22px; height:22px; border-radius:50%; background:var(--box); color:var(--grey); font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;}
  .mi.done .tag{background:var(--teal); color:var(--paper);} .mi.good .tag{background:var(--teal); color:var(--paper);} .mi.bad .tag{background:var(--brick); color:var(--paper);}
  .stem{background:var(--paper); border:1px solid var(--sand-line); border-left:3px solid var(--gold); border-radius:var(--r-control); padding:11px 14px; margin:10px 0;}
  .stem .s{font-weight:600; font-size:.95rem;}
  textarea{width:100%; font-family:'Karla',sans-serif; font-size:.9rem; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:9px 11px; margin-top:7px; resize:vertical; color:var(--ink); background:var(--field); line-height:1.6;}
  textarea:focus{outline:none; border-color:var(--gold); background:var(--field-focus);}
  .rank{display:grid; grid-template-columns:74px 1fr; gap:12px; align-items:center; margin:10px 0;}
  .rank select{appearance:none; -webkit-appearance:none; font-family:'Karla',sans-serif; font-size:1rem; font-weight:700; color:var(--ink); padding:9px 28px 9px 12px; border:1.5px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:var(--r-control); width:100%; background:var(--field);
    background-image:linear-gradient(45deg, transparent 50%, var(--gold-deep) 50%), linear-gradient(135deg, var(--gold-deep) 50%, transparent 50%); background-position:calc(100% - 15px) 55%, calc(100% - 10px) 55%; background-size:5px 5px; background-repeat:no-repeat;}
  .rank .rb{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-control); padding:10px 14px;}
  .rank .rn{font-weight:600; font-size:.95rem;} .rank .rd{font-size:.84rem; color:var(--grey);}
  .flips{display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin-top:12px;}
  .flip{border-radius:var(--r-strip); padding:20px 12px; text-align:center; cursor:pointer; min-height:132px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--paper); border:1.5px solid var(--sand-line); user-select:none; transition:border-color .12s ease;}
  .flip:hover{border-color:var(--gold);}
  .flip .hint{font-size:.74rem; color:var(--grey); margin-top:5px;}
  .flip.open{background:var(--teal); border-color:var(--teal);}
  .flip .val{display:none; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.5rem; color:var(--paper); letter-spacing:.06em;}
  .flip.open .val{display:block;} .flip.open .ic, .flip.open .nm, .flip.open .hint{display:none;}
  .fb{margin-top:12px; font-weight:600; font-size:.9rem;} .fb.ok{color:var(--teal);} .fb.no{color:var(--brick);}
  .grid2{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
  .mini{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px;}
  .mini h4{margin-top:0;}
  .mini p{font-size:.92rem;}
  details{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:12px 0;}
  summary{cursor:pointer; font-weight:600; font-size:.92rem; color:var(--teal);}
  details[open] summary{margin-bottom:8px;}
  table{width:100%; border-collapse:collapse; margin:12px 0; font-size:.88rem;}
  th, td{border:1px solid var(--sand-line); padding:8px 12px; text-align:left; vertical-align:top; background:var(--paper);}
  th{background:var(--gold-wash); color:var(--gold-deep); font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.1em; text-transform:uppercase; font-weight:600;}
  @media(max-width:780px){ .grid2, .match{grid-template-columns:1fr;} .frame{font-size:.95rem; line-height:2.3;} }
  /* The teal asides are the tutor's; a trainee link never shows them (13 Oct 2026). */
  .tutor{display:none;} body.tutor .tutor{display:block;}
  @media print{ .hidden{display:block !important;} .tutor, .note, .key{display:none !important;} body.tutor .tutor, body.tutor .key{display:block !important;} .ladder li{opacity:1;} .flip .val{display:block; color:#000;} .board{background:none; color:#000; border:1px solid #999;} }
""",
    body=[
        ('Somebody dies in it. Nothing is described in any detail, but read the beats in step 1 before class and decide whether it suits your group. If you\'d rather soften it, say she was attacked and badly hurt — every sentence in the lesson still works.',
         'Somebody dies in it. Nothing is described in any detail. A class that would rather not hear that can be told she was attacked and badly hurt, and every sentence in the lesson still works.'),
        ("<h2>How to run this lesson</h2>\n    <p>You are going to teach the third conditional without writing a rule on the board first. Instead you tell your students a story, ask them one question they can't answer without the structure, and take the sentence from them. Everything after that — the meaning, the form, the drilling and all three practice stages — stays inside the same story.</p>\n    <p>Work through the nine steps in order. Each one tells you what to do, what to say and roughly how long it should take. The activities on this page are the ones your students will do, so try them yourself as you read — you'll teach them better if you've done them.</p>",
         '<h2>A lesson taught through a story</h2>\n    <p>This is a third conditional lesson for a B1 class, and nobody writes a rule on the board first. The class hears a story, is asked one question they cannot answer without the structure, and the sentence comes from them. Everything after that, the meaning, the form, the drilling and the three practice stages, stays inside the same story.</p>\n    <p>Go through the nine steps in order as the students would. Do each activity yourself; you will see what the technique asks of a class, and why it holds together, better than by reading about it.</p>'),
        ('<div class="su"><div class="k">You need</div><div class="v">The picture on screen or printed; the cut-ups, one set per pair; the answer key</div></div>',
         '<div class="su"><div class="k">Materials</div><div class="v">The picture, and the sentence halves for step 6</div></div>'),
        ('<h2>Tell your students the story</h2>',
         '<h2>The story</h2>'),
        ('<p class="lead">Books closed, nothing on the board. Put the picture up and tell the story — don\'t read it out. Six minutes, no longer.</p>',
         '<p class="lead">Books closed, nothing on the board. The picture goes up and the story is told, not read. Listen to it with the map in front of you.</p>'),
        ('<h2>Get the sentence out of them</h2>\n    <p class="lead">Ask the question the story was built for. They can\'t answer it properly without the target language, which is why they will reach for it themselves.</p>',
         '<h2>The question</h2>\n    <p class="lead">One question, the one the story was built for. Try to answer it properly: you will find you need a structure to do it.</p>'),
        ('<p class="lead">The sentence is on the board. Ask these questions and let your students answer — don\'t explain it for them.</p>',
         '<p class="lead">The sentence is on the board. Answer these questions about it; nobody explains it first.</p>'),
        ('<p class="lead">Point back at the sentence on the board and get your students to build the pattern from it. Click a word, then click a gap.</p>',
         '<p class="lead">Build the pattern from the sentence on the board. Click a word, then click a gap.</p>'),
        ('<p class="lead">Say each chunk yourself and have them repeat, building from the last chunk back to the first so the rhythm survives. Click to build.</p>',
         '<p class="lead">The sentence is drilled from its last chunk back to its first, so the rhythm survives. Click to build it, and say each chunk as it appears.</p>'),
        ('<p class="lead">Hand out the cut-ups face up, one set per pair, and let them match each beginning to its ending. Every sentence comes from the story, so it checks the grammar and the plot at once. On screen, click one from each column to join them.</p>',
         '<p class="lead">In pairs, match each beginning to its ending. Every sentence comes from the story, so it checks the grammar and the plot at once. On screen, click one from each column to join them.</p>'),
        ('<h2>Let them finish the sentences their own way</h2>\n    <p class="lead">Same story, but now the ending belongs to them. Give them the first half and let them complete it however they like, as long as the grammar holds. Pairs first, then take a few aloud.</p>',
         '<h2>Finish the sentences your own way</h2>\n    <p class="lead">Same story, but now the ending is yours. Complete each beginning however you like, as long as the grammar holds. In pairs first, then a few aloud.</p>'),
        ('<p class="lead">Groups of three or four. They agree an order from 1 (most responsible) to 5 (least). One condition: they may only defend a position with a third conditional. Nothing to write — this stage is for talking.</p>',
         '<p class="lead">Groups of three or four. Agree an order from 1 (most responsible) to 5 (least). One condition: you may only defend a position with a third conditional. Nothing to write; this stage is for talking.</p>'),
        ('<h2>Tell them the twist</h2>\n    <p class="lead">Hold this back until the ranking is finished. The story reached the news not because of how it ended, but because psychologists built a questionnaire around it — the five characters aren\'t people at all. Click each one.</p>',
         '<h2>The twist</h2>\n    <p class="lead">Only once the ranking is finished. The story reached the news not because of how it ended, but because psychologists built a questionnaire around it: the five characters are not people at all. Click each one.</p>'),
        ('<h2>Model it and drill it — backwards</h2>', '<h2>Model it and drill it, backwards</h2>'),
        ('<div class="eyebrow">Step 6 · 6 minutes · Controlled practice</div>', '<div class="eyebrow">Step 6 · 6 minutes · Controlled practice</div>'),
    ],
    script=[
        ("document.querySelectorAll('#nv a')", "document.querySelectorAll('#stickyNav a')"),
    ],
))

# ---- Word and sentence stress ------------------------------------------------
# Ramy, 20 Oct 2026, after running it: "it's good, but it was short". From the
# old Phonology 1 plan and handouts: stress in context (the fold-the-page
# task), the barman (here a café), stress marked as bubbles with a pattern
# sort, the turn from receptive to productive, and a round-up. The "open
# door" drill was left out on his word. Every line below is written for Lite.
def _pat(*marks):
    return '<span class="pat">' + ''.join('<span class="circle %s"></span>' % {'O': 'primary', 'S': 'secondary', 'o': 'unstressed'}[m] for m in marks) + '</span>'

STRESS_SORT = """
  <div class="sort-block">
    <p class="instr"><b>First, sort them.</b> Before you click anything, say each word and put it under its pattern. Big bubble for the main stress, small for the rest. Then click the words to check.</p>
    <div class="pat-grid">
      <div class="pat-row">""" + _pat('O','o') + """<input class="blank" aria-label="Words with this pattern"></div>
      <div class="pat-row">""" + _pat('o','O') + """<input class="blank" aria-label="Words with this pattern"></div>
      <div class="pat-row">""" + _pat('O','o','o') + """<input class="blank" aria-label="Words with this pattern"></div>
      <div class="pat-row">""" + _pat('o','O','o') + """<input class="blank" aria-label="Words with this pattern"></div>
      <div class="pat-row">""" + _pat('o','O','o','o') + """<input class="blank" aria-label="Words with this pattern"></div>
      <div class="pat-row">""" + _pat('S','o','O') + """<input class="blank" aria-label="Words with this pattern"></div>
    </div>
    <details class="reveal">
      <summary>Check the sort</summary>
      <div class="content">
        <b>Oo</b> London, Turkey &middot; <b>oO</b> Brazil, Japan, Torquay &middot; <b>Ooo</b> Hungary, Italy, Germany, India, Switzerland &middot; <b>oOo</b> Australia, Chicago &middot; <b>oOoo</b> America, Slovakia &middot; <b>small, then O</b> Pakistan, Montreal (a secondary stress on the first syllable).<br><br>
        Australia and America may not fit. The key gives Australia three syllables, aus-TRA-lia; some speakers say four, aus-TRA-li-a. America can lose a syllable in fast speech. The main stress does not move; the count does. Accept both.
      </div>
    </details>
    <details class="reveal">
      <summary>How to mark stress on the board</summary>
      <div class="content">Use bubbles or boxes above the word, a big one on the stressed syllable. Not an accent mark and not an underline: Ss read an accent as a letter in their own language, and underlines are already doing other jobs on your board. Mark it the same way every lesson so Ss know it on sight.</div>
    </details>
  </div>"""

STRESS_CONTEXT = """<section id="s3b">
<div class="card">
<div class="stage-title">Stress in context: say it, then see it in a conversation <span class="badge">Two steps</span></div>
  <p class="instr"><b>Step 1.</b> Say each question on its own and mark the word that carries the main stress.</p>
  <p class="chant-line">What's your name?</p>
  <p class="chant-line">Nice to meet you.</p>
  <p class="chant-line">How are you?</p>
  <p class="chant-line">Where are you from?</p>
  <p class="chant-line">Where do you live?</p>
  <div class="btn-row"><button class="btn secondary" onclick="this.closest('.card').querySelector('.unfold').classList.add('shown'); this.parentNode.remove()">Now open the conversation</button></div>
  <div class="unfold">
    <p class="instr"><b>Step 2.</b> Fill in the gaps with your own details. Read the conversation aloud with a partner, then mark the stress again. Has it moved?</p>
    <div class="convo">
      <p><b>A</b> Hi, I'm <input class="blank short" aria-label="A's name">. What's your name?</p>
      <p><b>B</b> I'm <input class="blank short" aria-label="B's name">.</p>
      <p><b>A</b> Nice to meet you.</p>
      <p><b>B</b> Nice to meet you too.</p>
      <p><b>A</b> How are you?</p>
      <p><b>B</b> Fine, thanks. How are you?</p>
      <p><b>A</b> Good. Where are you from?</p>
      <p><b>B</b> <input class="blank short" aria-label="B's country">. And where are you from?</p>
      <p><b>A</b> <input class="blank short" aria-label="A's country">. Where do you live now?</p>
      <p><b>B</b> In <input class="blank short" aria-label="B's town">. And where do you live?</p>
    </div>
    <details class="reveal">
      <summary>Reveal: what moved, and why</summary>
      <div class="content">On their own: what's your <b>NAME</b>, nice to <b>MEET</b> you, how <b>ARE</b> you, where are you <b>FROM</b>, where do you <b>LIVE</b>.<br><br>
      Asked back, the stress jumps to <b>YOU</b>: nice to meet <b>YOU</b> too, how are <b>YOU</b>, and where are <b>YOU</b> from, where do <b>YOU</b> live. The question is old news by then; the person is the new information.<br><br>
      So a phrase taught on its own can teach the wrong stress. Give Ss the conversation, not the list.</div>
    </details>
  </div>
  </div></section>
<section id="s3c">
<div class="card">
<div class="stage-title">The café: one answer, five times <span class="badge">Mark the main stress</span></div>
  <p class="instr">The server says exactly the same words every time. Read each exchange, decide where the main stress falls in the answer, then check. Better still, read it aloud with a partner and argue.</p>
  <div class="paris-block"><p class="qline"><b>Customer</b> A flat white with oat milk, please.</p><p class="aline"><b>Server</b> We don't have any oat milk.</p><details class="reveal"><summary>Where is the stress?</summary><div class="content">On <b>OAT MILK</b>. It is the news: everything else is fine, this one thing is missing.</div></details></div>
  <div class="paris-block"><p class="qline"><b>Customer</b> Oh, never mind. Just a splash, then.</p><p class="aline"><b>Server</b> We don't have any oat milk.</p><details class="reveal"><summary>Where is the stress?</summary><div class="content">On <b>ANY</b>. Not even a splash: the answer corrects how much.</div></details></div>
  <div class="paris-block"><p class="qline"><b>Customer</b> Is it in the fridge? Let me have a look.</p><p class="aline"><b>Server</b> We don't have any oat milk.</p><details class="reveal"><summary>Where is the stress?</summary><div class="content">On <b>HAVE</b>. It isn't hidden somewhere; it isn't in the building.</div></details></div>
  <div class="paris-block"><p class="qline"><b>Customer</b> You must have some. You always have some!</p><p class="aline"><b>Server</b> We don't have any oat milk.</p><details class="reveal"><summary>Where is the stress?</summary><div class="content">On <b>DON'T</b>. A flat denial of what the customer insists on.</div></details></div>
  <div class="paris-block"><p class="qline"><b>Customer</b> Every café in town has oat milk!</p><p class="aline"><b>Server</b> We don't have any oat milk.</p><details class="reveal"><summary>Where is the stress?</summary><div class="content">On <b>WE</b>. Maybe every other café does; this one doesn't.</div></details></div>
  <details class="reveal"><summary>What the café shows</summary><div class="content">The words never change; the conversation decides where the weight goes. Each time, the stress lands on the part of the answer that pushes back against what was just said.</div></details>
  </div></section>
"""

STRESS_END = """
<section id="s6">
<div class="card">
<div class="stage-title">Make it productive <span class="badge">Plan it</span></div>
  <p class="instr">Look back at the tasks above. Your Ss would only <i>hear</i> stress in most of them: listen, mark, check. That is receptive work. Pick one task and write how you would get Ss to <i>say</i> it in a lesson.</p>
  <textarea class="write-area" rows="4" aria-label="How you would make one task productive" placeholder="The task, and what your Ss would do"></textarea>
  <details class="reveal">
    <summary>Some ways in</summary>
    <div class="content"><ul>
      <li>Drill it: clap or tap the beat, back-chain a long phrase from the end, then say it at natural speed.</li>
      <li>The café in pairs, then again with a new item and a new customer of their own.</li>
      <li>Ss write a sentence, stress one word, and their partner says what it implies.</li>
      <li>Board the bubbles first, have Ss say the words before you model them, then correct.</li>
      <li>Noun or verb: Ss write one sentence with each and read them to the group, who say which they heard.</li>
    </ul>
    When you plan pronunciation for TP, plan the moment Ss say it, not only the moment they notice it.</div>
  </details>
  </div></section>
<section id="s7">
<div class="card">
<div class="stage-title">Round-up <span class="badge">Three things</span></div>
  <p class="instr">Before you open it, write the three things this session showed about stress.</p>
  <textarea class="write-area" rows="3" aria-label="Your three things" placeholder="One, two, three"></textarea>
  <details class="reveal">
    <summary>Check</summary>
    <div class="content"><ol>
      <li><b>English is stress-timed.</b> Stressed words keep the beat; grammar words get squashed to fit.</li>
      <li><b>Sentence stress moves</b> with the context and with the speaker's attitude. Teach it in a conversation, not a list.</li>
      <li><b>Word stress has patterns,</b> and they can change with the part of speech: a REcord, to reCORD.</li>
    </ol></div>
  </details>
  </div></section>
"""

HAMLET = """<section id="s0">
<div class="card">
<div class="stage-title">Lead-in: one line, nine readings <span class="badge">Watch twice</span><span class="time">8 min</span></div>
<p class="lead">Nine actors, one line from <i>Hamlet</i>, and a disagreement about where the stress goes. First time through, tick the word each one lands on. Second time, in pairs: what does the line mean each time, and which reading would you choose?</p>
<div class="film"><iframe src="https://www.youtube-nocookie.com/embed/iQULEW2JwHE?rel=0&modestbranding=1" title="Shakespeare Live! From the RSC: To be, or not to be" data-skip="26.5-89" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>
<p class="film-link">From <i>Shakespeare Live! From the RSC</i> (BBC Two, 23 April 2016). If the frame stays black, <a href="https://www.youtube.com/watch?v=iQULEW2JwHE" target="_blank" rel="noopener">watch it on YouTube</a>; the RSC's own <a href="https://www.youtube.com/watch?v=6gZtW-U6qG4" target="_blank" rel="noopener">short cut</a> has the ending.</p>
<div id="hamlet"></div>
<div class="btn-row"><button class="btn secondary" onclick="toggleReveal('hamletKey',this)">Reveal</button></div>
<div class="reveal-block" id="hamletKey"><h4>What the sketch does</h4>Each actor is handed a different word and a different reading: a contrast, a doubt, a question of identity. The Prince of Wales ends it by landing on <b>question</b>, the one word nobody else had used. One line, nine meanings, and the stress did all the work. That is the whole of this session: in English, where the weight falls is part of what you mean.</div>
</div>
</section>
<div class="divider"><span>rhythm</span></div>
"""
RECIPES.append(dict(
    slug='word-and-sentence-stress', src='desktop:../../../connect-Hub/_mock/sessions/Word_and_Sentence_Stress.html', h2_sections=True,
    eyebrow='Input session · Phonology 2 of 3', title='Word and sentence stress',
    sub='Where the weight falls, and what it changes. The rhythm of English, primary and secondary stress, one sentence with seven meanings, stress that moves in a conversation, five questions about Paris, nouns that turn into verbs, and how to get Ss saying it.',
    nav=[('s0', 'Lead-in'), ('s1', '1 · Rhythm'), ('s2', '2 · Word stress'), ('s3', '3 · Contrastive'), ('s3b', '4 · In context'), ('s3c', '5 · The café'), ('s4', '6 · Attitudinal'), ('s5', '7 · Noun or verb'), ('s6', '8 · Make it productive'), ('s7', 'Round-up')],
    sources="""The film is <i>Shakespeare Live! From the RSC</i> (BBC and the Royal Shakespeare Company, 2016). The rhythm chant, the countries, the roses sentence and the Paris question are classic CELTA input material; the noun-or-verb quiz is the tutor's own.""",
    css=r"""
  .instr{color:var(--grey); font-size:.92rem; margin:0 0 12px; line-height:1.55;}
  .chant-line{font-family:'Newsreader',Georgia,serif; font-size:1.25rem; margin:6px 0; line-height:1.6;}
  .stress{color:var(--teal); font-weight:700;}
  .dim{color:var(--grey); font-size:.9em;}
  details.reveal{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:10px 14px; margin:12px 0 6px;}
  details.reveal > summary{cursor:pointer; font-weight:600; color:var(--teal); font-size:.9rem; list-style:none;}
  details.reveal > summary::-webkit-details-marker{display:none;}
  details.reveal > summary::before{content:''; display:inline-block; width:7px; height:7px; border-right:1.5px solid var(--gold-deep); border-bottom:1.5px solid var(--gold-deep); transform:rotate(-45deg); margin:0 10px 2px 2px; transition:transform .15s;}
  details.reveal[open] > summary::before{transform:rotate(45deg);}
  details.reveal .content{margin-top:8px; font-size:.9rem; line-height:1.6;}
  .legend{display:flex; gap:16px; flex-wrap:wrap; font-size:.82rem; color:var(--grey); margin:0 0 12px; align-items:center;}
  .legend span{display:inline-flex; align-items:center; gap:6px;}
  .legend .dot{display:inline-block; border-radius:50%;}
  .word-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:8px; align-items:start;}  /* four by four; an open card no longer stretches its row */
  .word-card{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:10px 12px; transition:border-color .12s ease;}
  .word-card:hover{border-color:var(--gold);}
  .word-card[open]{border-color:var(--teal);}
  .word-card summary{cursor:pointer; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; list-style:none;}
  .word-card summary::-webkit-details-marker{display:none;}
  .bubbles{margin-top:8px;}
  .syll-row{display:flex; gap:10px; align-items:flex-end;}
  .syll{display:flex; flex-direction:column; align-items:center; gap:4px; min-width:32px;}
  .circle{border-radius:50%;}
  .circle.primary{width:16px; height:16px; background:var(--teal);}
  .circle.secondary{width:11px; height:11px; background:var(--gold);}
  .circle.unstressed{width:7px; height:7px; background:var(--sand-line);}
  .syll .txt{font-size:.82rem; color:var(--ink);}
  .rose-line{font-family:'Newsreader',Georgia,serif; font-size:1.15rem; margin:12px 0 0;}
  .paris-block{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:0 0 10px;}
  .paris-block .qline{font-size:.95rem;}
  .paris-block .aline{font-size:.95rem; color:var(--grey); margin:4px 0 0;}
  .paris-block details.reveal{margin:8px 0 0;}
  .quiz-word{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:0 0 10px;}
  .quiz-word h3{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--gold-deep); font-weight:600; margin:0 0 4px;}
  .quiz-sentence{font-size:.95rem; margin:0 0 8px;}
  .quiz-options{display:flex; gap:8px; flex-wrap:wrap;}
  .opt-btn{background:var(--field); border:1.5px solid var(--sand-line); padding:6px 14px; border-radius:999px; font-family:'Karla',sans-serif; font-weight:700; font-size:.82rem; cursor:pointer; color:var(--grey); min-height:34px; transition:border-color .12s ease;}
  .opt-btn:hover{border-color:var(--gold);}
  .opt-btn.correct{background:var(--teal); border-color:var(--teal); color:#F0EEE9;}
  .opt-btn.incorrect{background:var(--brick); border-color:var(--brick); color:#fff;}
  .opt-btn[disabled]{cursor:default;}
  .quiz-feedback{margin-top:8px; font-size:.86rem; color:var(--grey);}
  /* the lead-in table */
  .hm{display:grid; grid-template-columns:150px 1fr; gap:6px 12px; align-items:center; padding:7px 0; border-top:1px solid var(--row-line); font-size:.9rem;}
  .hm:first-child{border-top:0;}
  .hm .who{font-weight:600;}
  .hm .picks{display:flex; gap:6px; flex-wrap:wrap;}
  .hm .pick{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:4px 11px; font-family:'Karla',sans-serif; font-weight:600; font-size:.78rem; color:var(--grey); cursor:pointer; min-height:32px;}
  .hm .pick:hover{border-color:var(--gold);}
  .hm .pick.on{background:var(--teal); border-color:var(--teal); color:#F0EEE9;}
  @media(max-width:560px){ .hm{grid-template-columns:1fr; gap:4px;} .word-grid{grid-template-columns:1fr 1fr;} }
  @media print{ details.reveal, .quiz-feedback{display:none !important;} .word-card .bubbles{display:none;} }
  /* the pattern sort, the conversation, the unfolded half */
  .sort-block{margin:0 0 16px;}
  .pat-grid{display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; margin:0 0 6px;}
  @media(max-width:700px){ .pat-grid{grid-template-columns:1fr;} }
  .pat-row{display:grid; grid-template-columns:96px 1fr; gap:12px; align-items:center;}
  .pat{display:inline-flex; gap:7px; align-items:center;}
  .pat-row input.blank{width:100%;}
  .unfold{display:none; margin-top:14px;}
  .unfold.shown{display:block;}
  .convo p{margin:4px 0; font-size:.95rem; line-height:1.9;}
  .convo b{display:inline-block; width:22px; color:var(--gold-deep);}
  input.blank.short{width:9em; max-width:60%;}
  @media print{ .unfold{display:block !important;} }
""",
    drop=[r'\s*<div class="masthead">.*?</div>\s*<h1>.*?</h1>\s*<p class="tagline">.*?</p>', r'\s*<footer>.*?</footer>'],
    body=[
        ('<section id="s1">', HAMLET + '<section id="s1">'),
        ('<div class="word-grid" id="wordGrid"></div>', STRESS_SORT + '\n  <div class="word-grid" id="wordGrid"></div>'),
        ('<section id="s4">', STRESS_CONTEXT + '<section id="s4">'),
        ('<div id="quizBlock"></div>\n</div></section>\n', '<div id="quizBlock"></div>\n</div></section>\n' + STRESS_END),
        ('<div class="stage-title">The Rhythm of English</div>', '<div class="stage-title">The rhythm of English <span class="badge">Say it aloud</span></div>'),
        ('<div class="stage-title">Word Stress: Primary and Secondary</div>', '<div class="stage-title">Word stress: primary and secondary <span class="badge">Click each word</span></div>'),
        ('<div class="stage-title">Contrastive Stress: One Sentence, Seven Meanings</div>', '<div class="stage-title">Contrastive stress: one sentence, seven meanings <span class="badge">Say it seven ways</span></div>'),
        ('<div class="stage-title">Attitudinal Stress: Are You Flying to Paris on Tuesday?</div>', '<div class="stage-title">Attitudinal stress: are you flying to Paris on Tuesday? <span class="badge">Decide, then reveal</span></div>'),
        ('<div class="stage-title">Noun or Verb? Choose the Stress</div>', '<div class="stage-title">Noun or verb? Choose the stress <span class="badge">Quiz</span></div>'),
        ('<span><span class="dot" style="width:7px;height:7px;background:#C7D1DB;"></span> unstressed</span>', '<span><span class="dot" style="width:7px;height:7px;background:var(--sand-line);"></span> unstressed</span>'),
        ('Say each line below out loud. However many extra words you pack in, try to keep the beat exactly the same length &mdash; like a drumbeat', 'Say each line below out loud. However many extra words you pack in, try to keep the beat exactly the same length, like a drumbeat'),
        ('The same question, asked five times &mdash; but each time, the answer corrects something different.', 'The same question, asked five times, but each time the answer corrects something different.'),
        ("Some words are spelled the same whether they're a noun or a verb &mdash; but the stress moves.", "Some words are spelled the same whether they're a noun or a verb, but the stress moves."),
    ],
    script=[
        ("// ---------- 2. Word stress bubbles ----------", """// ---------- the lead-in ----------
function toggleReveal(id,btn){ const el=document.getElementById(id); el.classList.toggle('shown'); btn.textContent = el.classList.contains('shown') ? 'Hide' : 'Reveal'; }
var ACTORS = ['Paapa Essiedu','Tim Minchin','Benedict Cumberbatch','David Tennant','Rory Kinnear','Ian McKellen','Harriet Walter','Judi Dench','The Prince of Wales'];
var WORDS_HAMLET = ['To be','not','that','is','the question'];
var hm = document.getElementById('hamlet');
ACTORS.forEach(function(a){
  var row = document.createElement('div'); row.className = 'hm';
  row.innerHTML = '<div class="who">' + a + '</div><div class="picks">' + WORDS_HAMLET.map(function(w){ return '<button class="pick" type="button">' + w + '</button>'; }).join('') + '</div>';
  row.querySelectorAll('.pick').forEach(function(b){ b.onclick = function(){ row.querySelectorAll('.pick').forEach(function(x){ x.classList.toggle('on', x === b && !x.classList.contains('on')); }); }; });
  hm.appendChild(row);
});
// ---------- 2. Word stress bubbles ----------"""),
        ("'a strong denial &mdash; I did NOT do this',", "'a strong denial: I did not do this',"),
        ("'implies I did something else with them &mdash; stole them, found them, was given them',", "'implies I did something else with them: stole them, found them, was given them',"),
        ("reveal:'The stress is on <b>ARE</b> &mdash; an emphatic, confirming answer to reassure someone who doubts it.'", "reveal:'The stress is on <b>ARE</b>: an emphatic, confirming answer to reassure someone who doubts it.'"),
        ("reveal:'The stress is on <b>YOU</b> &mdash; the answer corrects <i>who</i> is flying.'", "reveal:'The stress is on <b>YOU</b>: the answer corrects <i>who</i> is flying.'"),
        ("reveal:\"The stress is on <b>FLYING</b> &mdash; the answer corrects <i>how</i> they\\u2019re travelling.\"", "reveal:\"The stress is on <b>FLYING</b>: the answer corrects <i>how</i> they\\u2019re travelling.\""),
        ("reveal:\"The stress is on <b>PARIS</b> &mdash; the answer corrects <i>where</i> they\\u2019re going.\"", "reveal:\"The stress is on <b>PARIS</b>: the answer corrects <i>where</i> they\\u2019re going.\""),
        ("reveal:'The stress is on <b>TUESDAY</b> &mdash; the answer corrects <i>when</i>.'", "reveal:'The stress is on <b>TUESDAY</b>: the answer corrects <i>when</i>.'"),
        ("explain:'A noun &mdash; stress the <b>first</b> syllable: <b>RE</b>cord.'", "explain:'A noun: stress the <b>first</b> syllable, <b>RE</b>cord.'"),
        ("explain:'A verb &mdash; stress the <b>second</b> syllable: re<b>CORD</b>.'", "explain:'A verb: stress the <b>second</b> syllable, re<b>CORD</b>.'"),
        ("explain:'A noun &mdash; stress the <b>first</b> syllable: <b>PRE</b>sent.'", "explain:'A noun: stress the <b>first</b> syllable, <b>PRE</b>sent.'"),
        ("explain:'A verb &mdash; stress the <b>second</b> syllable: pre<b>SENT</b>.'", "explain:'A verb: stress the <b>second</b> syllable, pre<b>SENT</b>.'"),
        ("explain:'A noun &mdash; stress the <b>first</b> syllable: <b>CON</b>tract.'", "explain:'A noun: stress the <b>first</b> syllable, <b>CON</b>tract.'"),
        ("explain:'A verb &mdash; stress the <b>second</b> syllable: con<b>TRACT</b>.'", "explain:'A verb: stress the <b>second</b> syllable, con<b>TRACT</b>.'"),
        ("explain:'A noun &mdash; stress the <b>first</b> syllable: <b>OB</b>ject.'", "explain:'A noun: stress the <b>first</b> syllable, <b>OB</b>ject.'"),
        ("explain:'A verb &mdash; stress the <b>second</b> syllable: ob<b>JECT</b>.'", "explain:'A verb: stress the <b>second</b> syllable, ob<b>JECT</b>.'"),
        ("feedback.innerHTML = '\\u2713 ' + q.explain;", "feedback.innerHTML = q.explain;"),
        ("feedback.innerHTML = '\\u2717 Not quite. ' + q.explain;", "feedback.innerHTML = 'Not quite. ' + q.explain;"),
    ],
))

# ---- Connected speech ---------------------------------------------------------
RECIPES.append(dict(
    slug='connected-speech', src='connected-speech/index.html',
    eyebrow='Input session · Phonology 3 of 3', title='Connected speech',
    sub='Five features, five activities, then the full picture: elision, assimilation, intrusive sounds, linking, and weak forms.',
    nav=[('s1', 'Lead-in'), ('s2', '1 · Elision'), ('s3', '2 · Assimilation'), ('s4', '3 · Intrusive sounds'), ('s5', '4 · Linking'), ('s6', '5 · Weak forms'), ('s7', 'All together')],
    sources="""The dictation-computer sentences and the Sherlock Holmes linking text are classic CELTA input material (the computer puzzle follows Mark Hancock, <i>Pronunciation Games</i>, Cambridge University Press, 1995); the link maze and the elision trivia are the tutor's own.""",
    css=r"""
  .reveal-card .q{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.02rem;}
  .pill-col .pill .dc-real{color:var(--teal) !important;}
  .pill-col .pill .dc-real div{color:var(--grey) !important;}
  .maze-legend{display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;}
  .maze-legend span{font-size:.78rem; font-weight:700; padding:4px 11px; border-radius:999px; border:1.5px solid var(--sand-line); background:var(--box); color:oklch(45% 0.02 70);}
  .maze-grid{display:grid; grid-template-columns:repeat(var(--cols,5),1fr); gap:5px; margin:12px 0;}
  .maze-cell{border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:8px 4px; font-size:.72rem; font-weight:600; text-align:center; line-height:1.3; cursor:pointer; background:var(--paper); min-height:60px; display:flex; align-items:center; justify-content:center; transition:border-color .12s ease; color:var(--ink);}
  .maze-cell:hover{border-color:var(--gold);}
  .maze-cell.wall{background:var(--sand-deep); border:1.5px dashed var(--sand-line); cursor:default;}
  .maze-cell.wall:hover{border-color:var(--sand-line);}
  .maze-cell.start{background:var(--ink-warm); color:var(--paper); border-color:var(--ink-warm); font-size:.66rem;}
  .maze-cell.start div{line-height:1.5;}
  .maze-cell.current{box-shadow:0 0 0 3px var(--gold); border-color:var(--gold);}
  .maze-cell.visited{background:color-mix(in oklab, var(--teal) 11%, var(--paper)); border-color:var(--teal); color:var(--teal);}
  .maze-cell.start.visited{background:var(--ink-warm); color:var(--paper);}
  .maze-cell.finish{border-color:var(--brick); color:var(--brick); font-weight:700;}
  .maze-cell.finish.visited{background:color-mix(in oklab, var(--brick) 10%, var(--paper));}
  .maze-cell.wrong{animation:shake .3s; border-color:var(--brick);}
  @keyframes shake{0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);}}
  @media(max-width:560px){ .maze-cell{font-size:.6rem; min-height:52px; padding:6px 2px;} .maze-grid{gap:3px;} }
  .linking-para{font-size:1rem; line-height:2.3; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; margin:10px 0;}
  .word-plain{font-size:1rem;}
  .link-gap{display:inline-block; width:20px; text-align:center; cursor:pointer; color:var(--sand-line); font-weight:700; font-size:1.15rem; transition:.15s; vertical-align:middle;}
  .link-gap:hover{color:var(--gold-deep);}
  .link-gap.marked{color:var(--gold-deep); transform:scale(1.5);}
  .link-gap.linked{color:var(--teal); transform:scale(1.5);}
  .word-link{display:inline-block; padding:3px 2px; margin:1px; border-radius:4px; cursor:pointer; font-size:.95rem; transition:.15s;}
  .word-link.marked{background:var(--gold-wash); box-shadow:0 2px 0 var(--gold);}
  .word-link.weak{background:color-mix(in oklab, var(--teal) 12%, transparent); box-shadow:0 2px 0 var(--teal);}
  .feat-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:12px 0 0;}
  @media(max-width:640px){ .feat-grid{grid-template-columns:1fr;} }
  .feat-card{border-radius:var(--r-strip); border:1.5px solid var(--sand-line); overflow:hidden; cursor:pointer; background:var(--paper); transition:border-color .12s ease;}
  .feat-card:hover{border-color:var(--gold);}
  .feat-card.open{border-color:var(--teal);}
  .feat-front{padding:12px 14px;}
  .feat-front .fname{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; text-transform:none; letter-spacing:0;}
  .feat-card.open .fname{color:var(--teal);}
  .feat-say-label{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--grey); font-weight:600; margin-top:8px;}
  .feat-say-item{font-size:.92rem; font-weight:600; margin-top:3px;}
  .feat-back{display:none; padding:12px 14px; font-size:.86rem; line-height:1.6; border-top:1px solid var(--row-line);}
  .feat-card.open .feat-back{display:block;}
  .feat-examples{margin-top:8px;}
  .feat-ex-row{display:flex; align-items:baseline; gap:8px; margin-top:6px; font-size:.84rem; flex-wrap:wrap;}
  .feat-written{color:var(--grey); text-decoration:line-through; text-decoration-color:var(--sand-line);}
  .feat-arrow{font-family:'Instrument Sans','Karla',sans-serif; font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--gold-deep); font-weight:600;}
  .feat-heard{font-weight:600;}
  @media print{ .feat-back, .reveal-card .a, .dc-real{display:none !important;} .maze-grid{display:none;} }
""",
    body=[
        ('Can You Read These? <span', 'Can you read these? <span'),
        ('They look strange written down — but say them fast, and listen for the real sentence hiding inside.', 'They look strange written down, but say them fast and listen for the real sentence hiding inside.'),
        ('Elision Trivia <span', 'Elision trivia <span'),
        ('Here\'s the same phrase written two ways — how it "should" sound, and how it actually sounds when a sound gets dropped.', 'Here\'s the same phrase written two ways: how it "should" sound, and how it actually sounds when a sound gets dropped.'),
        ('The Dictation Computer <span', 'The dictation computer <span'),
        ('A dictation computer prints exactly what it hears — and connected speech confuses it.', 'A dictation computer prints exactly what it hears, and connected speech confuses it.'),
        ('<p class="lead" style="font-size:.82rem;font-style:italic;">', '<p class="lead" style="font-size:.84rem;font-style:italic;">'),
        ('<span class="feedback" id="dcFeedback" style="color:var(--sub);"></span>', '<span class="feedback" id="dcFeedback"></span>'),
        ('The Link Maze <span', 'The link maze <span'),
        ('Your phrase is already waiting in the navy start cell. Say it out loud — which sound joins the two words: /j/, /w/, or /r/? That tells you which direction to click. Land on a new cell, say its phrase, and move again. Reach the red FINISH cell to win.', 'Your phrase is waiting in the dark start cell. Say it out loud: which sound joins the two words, /j/, /w/ or /r/? That tells you which way to click. Land on a new cell, say its phrase, and move again. Reach the red finish cell to win.'),
        ('<span style="--c:#7a4a9c">/j/ → move LEFT</span>', '<span>/j/ moves left</span>'),
        ('<span style="--c:#2a8c82">/w/ → move UP</span>', '<span>/w/ moves up</span>'),
        ('<span style="--c:#1F497D">/r/ → move RIGHT</span>', '<span>/r/ moves right</span>'),
        ('Mark the Links <span class="badge">Sherlock Holmes</span>', 'Mark the links <span class="badge">Sherlock Holmes</span>'),
        ('Your marks show in amber. Suggested links (when revealed) show in teal.', 'Your marks show in gold. Suggested links, when revealed, show in teal.'),
        ('Spot the Weak Forms <span', 'Spot the weak forms <span'),
        ('Click the word or words you think get "swallowed" — weakened so the listener mainly hears the content words.', 'Click the word or words you think get "swallowed": weakened, so the listener mainly hears the content words.'),
        ('All Five, Together <span class="badge">H/O7 — the reference</span>', 'All five, together <span class="badge">The reference</span>'),
        ("You've now done one activity for each. Say the examples on each card out loud first — then click the card", "You've now done one activity for each. Say the examples on each card out loud first, then click the card"),
    ],
    script=[
        ("{puzzle:'Hour jump a risen may jet.', answer:'Say it aloud and compare with your group — listen for the sounds!'},", "{puzzle:'Hour jump a risen may jet.', answer:\"Our jumper isn't made yet.\"},"),
        ("{puzzle:'Mine ease ark why tall write.', answer:\"Say it aloud and compare with your group!\"},", "{puzzle:'Mine ease ark why tall write.', answer:'My knees are quite all right.'},"),
        ("{puzzle:'Hearse is to Scot a taught us.', answer:\"Say it aloud and compare with your group!\"}", "{puzzle:'Hearse is to Scot a taught us.', answer:'Her sister has got a tortoise.'}"),
        ("fb.textContent = 'You escaped the maze! ✓';", "fb.textContent = 'You escaped the maze.';"),
        ("fb.textContent = 'Correct — now say the phrase in this new cell!';", "fb.textContent = 'Right. Now say the phrase in this new cell.';"),
        ("fb.textContent = 'Not quite — say the phrase in your CURRENT (gold-outlined) cell out loud, work out /j/, /w/, or /r/, then click that direction.';", "fb.textContent = 'Not quite. Say the phrase in your current cell (the gold outline) out loud, work out /j/, /w/ or /r/, then click that way.';"),
        ("d.innerHTML='<div>▶ START<br>'+cell.text+'</div>';", "d.innerHTML='<div>START<br>'+cell.text+'</div>';"),
        ("dcFb.textContent = dcDone===dcItems.length ? 'All ten \\u2014 every sentence recovered. \\u2713' : dcDone+' / '+dcItems.length+' correct';", "dcFb.textContent = dcDone===dcItems.length ? 'All ten: every sentence recovered.' : dcDone+' / '+dcItems.length+' correct';"),
        ("dcFb.textContent='Not that one \\u2014 read the reply again and ask what it tells you about the real sentence.';", "dcFb.textContent='Not that one. Read the reply again and ask what it tells you about the real sentence.';"),
        ('<div class="dc-real" style="display:none;margin-top:6px;font-weight:700;color:var(--teal-deep);">\\u2192 \'+it.real+\'<div style="font-weight:600;color:var(--sub);font-size:.78rem;margin-top:3px;">', '<div class="dc-real" style="display:none;margin-top:6px;font-weight:700;">\'+it.real+\'<div style="font-weight:500;font-size:.78rem;margin-top:3px;">'),
        ('<span class="feat-arrow">\\u2192</span>', '<span class="feat-arrow">sounds like</span>'),
        ("{name:'ELISION',", "{name:'Elision',"), ("{name:'ASSIMILATION',", "{name:'Assimilation',"), ("{name:'INTRUSIVE SOUNDS',", "{name:'Intrusive sounds',"), ("{name:'LINKING / LIAISON',", "{name:'Linking (liaison)',"), ("{name:'STRONG & WEAK FORMS',", "{name:'Strong and weak forms',"),
        ("c.style.setProperty('--c',f.c); c.style.setProperty('--c-soft',f.csoft);", ""),
    ],
))

# ---- the IH guide pages: Receptive skills, Life after CELTA, Drama ----------
# Three pages on the same template as Alternative techniques: a navy header,
# a pill nav, sections of .card with an .eyebrow and an h2, .tip and .note
# asides. The same aliases and base rules, shared.
IH_CSS = r"""
  :root{--navy:var(--teal); --navy-d:var(--teal-deep); --rose:var(--brick); --warm:var(--gold); --muted:var(--grey); --line:var(--sand-line);
    --ok:var(--teal); --ok-l:color-mix(in oklab, var(--teal) 10%, transparent); --no:var(--brick); --no-l:color-mix(in oklab, var(--brick) 9%, transparent);
    --warm-l:var(--gold-wash); --teal-l:color-mix(in oklab, var(--teal) 9%, transparent); --bg:var(--paper);}
  section{padding:0; margin:0 0 14px;}
  .card{padding:20px 22px 22px;}
  .card .eyebrow{margin:0 0 4px;}
  h2{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.3rem; margin:0 0 8px; line-height:1.25;}
  h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem; margin:20px 0 6px;}
  h4{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem; margin:14px 0 6px;}
  p{margin:8px 0; font-size:.95rem; line-height:1.6;}
  .lead{margin:0 0 10px;}
  ul, ol{margin:8px 0; padding-left:22px; font-size:.95rem;} li{margin:4px 0;}
  .tip, .note, .key{border-radius:var(--r-control); padding:12px 16px; margin:14px 0; font-size:.9rem; line-height:1.6; background:var(--paper); border:1px solid var(--sand-line);}
  .tip{border-left:4px solid var(--teal);} .note{border-left:4px solid var(--gold);} .key{border-left:4px solid var(--gold); background:var(--gold-wash); border-color:var(--amber-edge);}
  .tip b:first-child, .note b:first-child, .key b:first-child{display:block; margin-bottom:3px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; font-weight:600;}
  .tip b:first-child{color:var(--teal);} .note b:first-child, .key b:first-child{color:var(--gold-deep);}
  .btn.t{background:var(--teal); color:var(--paper); border-color:var(--teal);} .btn.t:hover{background:var(--teal-lifted); border-color:var(--teal-lifted);}
  .btn.ghost{background:none;}
  .btns{display:flex; gap:9px; flex-wrap:wrap; margin-top:12px;}
  .hidden{display:none;}
  .grid2, .two{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
  .mini{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px;}
  .mini h4{margin-top:0;} .mini p{font-size:.92rem;} .mini ol{margin:0; padding-left:20px;}
  table{width:100%; border-collapse:collapse; margin:12px 0; font-size:.88rem;}
  th, td{border:1px solid var(--sand-line); padding:8px 12px; text-align:left; vertical-align:top; background:var(--paper);}
  th{background:var(--gold-wash); color:var(--gold-deep); font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.1em; text-transform:uppercase; font-weight:600;}
  a{color:var(--teal);}
  .fb{margin-top:12px; font-weight:600; font-size:.9rem;} .fb.ok{color:var(--teal);} .fb.no{color:var(--brick);}
  .chk label{display:flex; gap:10px; align-items:flex-start; padding:8px 11px; border-radius:var(--r-control); cursor:pointer; font-size:.92rem;}
  .chk label:hover{background:var(--paper);}
  .chk input{margin-top:5px; width:16px; height:16px; accent-color:var(--teal); flex:none;}
  .chk input:checked + span{color:var(--grey); text-decoration:line-through;}
  @media(max-width:780px){ .grid2, .two{grid-template-columns:1fr;} }
  @media print{ .hidden{display:block !important;} .tip, .note{break-inside:avoid;} }
"""

RECIPES.append(dict(
    slug='receptive-skills', src='receptive-skills/index.html', start='<div id="bar"></div>', open='<main class="wrap">', end='<footer>',
    eyebrow='Input session · Loop input · 45 minutes', title='Receptive skills',
    sub='Taught the way you will teach it: pre-taught vocabulary, a gist read against the clock, detail questions, then the debrief where it all gets named. Reading and listening.',
    nav=[('leadin', 'Lead-in'), ('terms', 'Pre-teach'), ('predict', 'Predict'), ('read', 'Read'), ('detail', 'Detail'), ('debrief', 'Debrief'), ('tasks', 'Task types'), ('key', 'Answer key')],
    sources="""The session follows Connect's own Receptive skills input; the task-type bank follows the tutor's "Receptive Skills Task Types" handout.""",
    css=IH_CSS + r"""
  .agenda{display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 2px;}
  .agenda span{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--teal); border-radius:var(--r-control); padding:7px 11px; font-size:.78rem; min-width:92px;}
  .agenda span b{display:block; color:var(--grey); font-weight:700; font-size:.66rem; letter-spacing:.08em; margin-bottom:2px;}
  .reveal{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:22px 20px; text-align:center; margin:12px 0; transition:border-color .12s ease;}
  .reveal.open{border-color:var(--teal);}
  .reveal h3{margin:0 0 10px;}
  .reveal .ans{display:none; font-family:'Newsreader',Georgia,serif; font-size:1.2rem; color:var(--teal); font-weight:600; margin-top:8px;}
  .reveal.open .ans{display:block;} .reveal.open .btn{display:none;}
  .match{display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; margin-top:10px;}
  .match .col{display:flex; flex-direction:column; gap:8px;}
  .mt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:9px 12px; font-size:.88rem; cursor:pointer; text-align:left; line-height:1.45; transition:border-color .12s ease; font-family:'Karla',sans-serif; color:var(--ink);}
  .mt.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  .mt:hover{border-color:var(--gold);}
  .mt.pick{border-color:var(--gold); background:var(--field-focus);}
  .mt.good{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal); cursor:default;}
  .mt.bad{border-color:var(--brick);}
  .count{font-size:.82rem; color:var(--gold-deep); font-weight:600; margin-top:10px;}
  .timer{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin:12px 0 4px;}
  .timer .clock{font-family:'Newsreader',Georgia,serif; font-size:1.9rem; color:var(--teal); min-width:84px; font-weight:600;}
  .timer .clock.up{color:var(--brick);}
  .order{display:flex; flex-direction:column; gap:8px; margin-top:10px;}
  .ob{display:flex; align-items:center; gap:12px; background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:9px 12px; font-size:.92rem; font-weight:500; color:var(--ink); cursor:pointer; text-align:left; transition:border-color .12s ease; font-family:'Karla',sans-serif;}
  .ob:hover{border-color:var(--gold);}
  .ob .n{flex:none; width:26px; height:26px; border-radius:50%; background:var(--box); color:var(--grey); font-size:.78rem; font-weight:700; display:flex; align-items:center; justify-content:center;}
  .ob.done{border-color:var(--teal); color:var(--teal); cursor:default;} .ob.done .n{background:var(--teal); color:var(--paper);}
  .ob.bad{border-color:var(--brick);}
  .qrow{border-top:1px solid var(--row-line); padding:12px 0;} .qrow:first-child{border-top:0; padding-top:0;}
  .qrow .q{font-size:.95rem; line-height:1.6; margin-bottom:8px;}
  .opts{display:flex; gap:8px; flex-wrap:wrap;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:5px 14px; font-size:.82rem; font-weight:700; color:var(--grey); cursor:pointer; min-height:34px; transition:border-color .12s ease; font-family:'Karla',sans-serif;}
  .opt:hover{border-color:var(--gold);}
  .opt.good{background:var(--ok-l); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal);}
  .opt.bad{background:var(--no-l); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .opt.dim{opacity:.45;}
  .why{margin-top:8px; font-size:.86rem; color:var(--grey); display:none;} .why.show{display:block;}
  .types{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;}
  .types .t{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-strip); padding:12px 14px;}
  .types .t.teal{border-top-color:var(--teal);} .types .t.warm{border-top-color:var(--gold-deep);}
  .types h4{margin:0 0 6px;} .types ul{margin:4px 0 0; padding-left:18px; font-size:.88rem;}
  .card.key{background:var(--gold-wash);}
  .key table{margin:8px 0 14px; font-size:.88rem;}
  .key td:first-child{font-weight:600; width:32%;}
  @media(max-width:780px){ .match, .types{grid-template-columns:1fr;} }
  @media print{ .timer, .count{display:none;} .reveal .ans, .why, .key.hidden, .ob, .mt{display:none !important;} }
""",
    body=[
        ('A gist read, so a time limit: three minutes, silently, for the main ideas.', 'A gist read, so a time limit: one minute, silently, for the main ideas.'),
        ('<div class="clock" id="clock">3:00</div>', '<div class="clock" id="clock">1:00</div>'),
        ('Start the 3-minute gist read', 'Start the 1-minute gist read'),
        ('<p class="lead" style="font-size:14px">Pairs with: Speakout B2, TP1.1 — Identity &amp; personality</p>', '<p class="lead" style="font-size:.86rem">Pairs with: Speakout B2, TP1.1, Identity and personality.</p>'),
        ('<div class="tip"><b>The shape to remember</b>Lead-in → pre-teach the essential words → gist task → peer check → detail task → peer check → a speaking or writing task that grows out of the text.', '<div class="tip"><b>The shape to remember</b>Lead-in, pre-teach the essential words, gist task, peer check, detail task, peer check, then a speaking or writing task that grows out of the text.'),
    ],
    script=[("left = 180, tick = null;", "left = 60, tick = null;"), ("tick = null; left = 180; show();", "tick = null; left = 60; show();"), ("document.querySelectorAll('#nv a')", "document.querySelectorAll('#stickyNav a')")],
))

# ---- Writing the lesson plan -------------------------------------------------
RECIPES.append(dict(
    slug='writing-the-lesson-plan', src='writing-the-lesson-plan/index.html', end='<footer>', number_sections=True,
    title='Writing the lesson plan', sub='Four decisions you make on every plan: your aims, your procedure, your interaction patterns, and what could go wrong.',
    nav=[('s1', '1 · Aims'), ('s2', '2 · Procedure'), ('s3', '3 · Interaction'), ('s4', '4 · Anticipated problems'), ('s5', 'Recap')],
    sources="""The aims, procedures and problems to judge are the tutor's own, written for this course's lesson plan and language analysis sheets.""",
    css=r"""
  section{background:var(--surface); border-left:5px solid var(--gold); border-radius:var(--r-control); padding:20px 22px 22px; margin:0 0 14px;}
  @media(max-width:560px){ section{padding:16px 16px;} }
  h2{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.3rem; margin:0 0 8px; line-height:1.25;}
  .lead{color:var(--grey); font-size:.92rem; margin:0 0 14px; line-height:1.55; max-width:none;}
  .criteria{display:flex; flex-wrap:wrap; gap:6px; margin:0 0 14px;}
  .criteria span{display:inline-flex; align-items:center; border-radius:999px; border:1px solid var(--sand-line); padding:3px 10px; font-size:.72rem; font-weight:700; background:var(--box); color:oklch(45% 0.02 70);}
  .scorebar{display:flex; justify-content:space-between; align-items:center; gap:10px; background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--gold); padding:8px 14px; border-radius:var(--r-control); margin:0 0 12px; font-size:.84rem; font-weight:600; position:sticky; top:46px; z-index:5;}
  .scorebar button{font-family:'Karla',sans-serif; font-size:.78rem; font-weight:600; cursor:pointer; background:none; color:var(--grey); border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:5px 10px; min-height:32px;}
  .scorebar button:hover{color:var(--ink); border-color:var(--grey);}
  .card{background:var(--paper); border:1px solid var(--sand-line); border-left:1px solid var(--sand-line); border-radius:var(--r-strip); padding:0; margin:0 0 10px; transition:border-color .12s ease;}
  .card .cat{display:inline-block; margin:12px 0 0 16px; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-deep); font-weight:600;}
  .card .body{padding:8px 16px 0; font-size:.95rem; white-space:pre-line; line-height:1.55;}
  .card .btns{display:flex; gap:8px; padding:12px 16px 14px; flex-wrap:wrap;}
  .card .btns button, .srow button{font-family:'Karla',sans-serif; font-size:.82rem; font-weight:700; cursor:pointer; border:1.5px solid var(--sand-line); background:var(--field); color:var(--grey); border-radius:999px; padding:6px 14px; min-height:34px; transition:border-color .12s ease;}
  .card .btns button:hover:not(:disabled), .srow button:hover:not(:disabled){border-color:var(--gold);}
  .card .btns button.pick-ok, .srow button.pick-ok{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal);}
  .card .btns button.pick-no, .srow button.pick-no{background:color-mix(in oklab, var(--brick) 10%, transparent); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .card .btns button:disabled, .srow button:disabled{cursor:default;}
  .card .fb{display:none; padding:11px 16px; font-size:.88rem; border-top:1px solid var(--row-line); line-height:1.55;}
  .card .fb.on{display:block;}
  .card .fb.ok{color:var(--ink);} .card .fb.no{color:var(--ink);}
  .card .fb b{display:block; margin-bottom:2px; color:var(--teal);} .card .fb.no b{color:var(--brick);}
  .row{display:grid; grid-template-columns:1fr 200px; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid var(--row-line); font-size:.92rem;}
  .row:last-of-type{border-bottom:none;}
  .row select{appearance:none; -webkit-appearance:none; font-family:'Karla',sans-serif; font-size:.88rem; font-weight:600; color:var(--ink); padding:7px 28px 7px 10px; border:1.5px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:var(--r-control); background:var(--field); width:100%; min-height:38px;
    background-image:linear-gradient(45deg, transparent 50%, var(--gold-deep) 50%), linear-gradient(135deg, var(--gold-deep) 50%, transparent 50%); background-position:calc(100% - 15px) 55%, calc(100% - 10px) 55%; background-size:5px 5px; background-repeat:no-repeat;}
  .row select.ok{border-color:var(--teal); background-color:color-mix(in oklab, var(--teal) 9%, var(--field));}
  .row select.no{border-color:var(--brick); background-color:color-mix(in oklab, var(--brick) 8%, var(--field));}
  @media(max-width:560px){ .row{grid-template-columns:1fr; gap:6px;} }
  .srow{display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid var(--row-line);}
  .srow .d{font-size:.92rem; line-height:1.5;}
  .srow .c{display:flex; gap:8px; flex-wrap:wrap;}
  .snote{display:none; font-size:.86rem; color:var(--grey); padding:0 0 10px; border-bottom:1px solid var(--row-line); margin-top:-4px;}
  .snote.on{display:block;}
  @media(max-width:560px){ .srow{grid-template-columns:1fr; gap:6px;} }
  .recap{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
  @media(max-width:640px){ .recap{grid-template-columns:1fr;} }
  .recap div{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-strip); padding:12px 14px;}
  .recap h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem; margin:0 0 6px;}
  .recap ul{margin:0; padding-left:18px; font-size:.88rem; line-height:1.55;}
  @media print{ .scorebar, .card .btns, .srow .c{display:none !important;} .card .fb, .snote{display:none !important;} }
""",
    drop=[r'\s*<header class="top">.*?</header>'],
    body=[
        ('<div class="scorebar"><span>Aims &mdash; <span id="s1">0</span> of <span id="t1">0</span></span>', '<div class="scorebar"><span>Aims: <span id="s1">0</span> of <span id="t1">0</span></span>'),
        ('<div class="scorebar"><span>Procedure &mdash; <span id="s2">0</span> of <span id="t2">0</span></span>', '<div class="scorebar"><span>Procedure: <span id="s2">0</span> of <span id="t2">0</span></span>'),
        ('<div class="scorebar"><span>Sorting &mdash; <span id="s3">0</span> of <span id="t3">0</span></span>', '<div class="scorebar"><span>Sorting: <span id="s3">0</span> of <span id="t3">0</span></span>'),
        ("teach the stage without you in the room — which is why it's bullet points,", "teach the stage without you in the room, which is why it's bullet points,"),
    ],
))

# ---- Life after CELTA ----------------------------------------------------------
RECIPES.append(dict(
    slug='life-after-celta', src='life-after-celta/index.html', start='<div id="bar"></div>', end='<footer>',
    eyebrow='End-of-course session', title='Life after CELTA',
    sub='Finding work, settling in, and carrying on developing. Where next, your CV, where the jobs are, Istanbul, the interview, the paperwork, and a first-year plan to take with you.',
    nav=[('next', 'Where next'), ('cv', 'CV'), ('jobs', 'Jobs'), ('istanbul', 'Istanbul'), ('interview', 'Interview'), ('legal', 'Paperwork'), ('cpd', 'Developing'), ('resources', 'Resources'), ('plan', 'Plan')],
    sources="""The links were checked when the session was written; the interview questions and the Istanbul table are the tutor's own. The books to own are listed under their authors.""",
    css=IH_CSS + r"""
  .links{display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:8px; margin:8px 0 4px;}
  .lk{display:block; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:10px 12px; text-decoration:none; color:inherit; transition:border-color .12s ease;}
  .lk:hover{border-color:var(--gold);}
  .lk .u{font-weight:700; color:var(--teal); font-size:.9rem; display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
  .lk .d{font-size:.82rem; color:var(--grey); margin-top:2px; line-height:1.45;}
  .tagx{display:inline-flex; align-items:center; border-radius:999px; border:1px solid var(--sand-line); padding:1px 8px; font-size:.66rem; font-weight:700; background:var(--box); color:oklch(45% 0.02 70); letter-spacing:.02em;}
  .tagx.free{background:color-mix(in oklab, oklch(34% 0.09 155) 10%, transparent); border-color:color-mix(in oklab, oklch(34% 0.09 155) 26%, transparent); color:oklch(34% 0.09 155);}
  .tagx.paid{background:var(--gold-wash); border-color:var(--amber-edge); color:var(--gold-deep);}
  .plan{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:10px 0;}
  @media(max-width:640px){ .plan{grid-template-columns:1fr;} }
  .pl{background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-strip); padding:12px 14px;}
  .pl h4{margin:0 0 2px;}
  .pl .w{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--grey); font-weight:600; margin:0 0 6px;}
  textarea{width:100%; font-family:'Karla',sans-serif; font-size:.9rem; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:9px 11px; margin-top:4px; resize:vertical; min-height:84px; color:var(--ink); background:var(--field); line-height:1.5;}
  textarea:focus{outline:none; border-color:var(--gold); background:var(--field-focus);}
  .status{font-size:.8rem; color:var(--gold-deep); font-weight:600;}
  .gone{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; font-size:.88rem; margin-top:10px;}
  .gone ul{font-size:.86rem;}
  .gone code{background:var(--box); padding:1px 6px; border-radius:4px; font-size:.82rem;}
  .mini ol{font-size:.92rem;}
  @media print{ .links{grid-template-columns:1fr 1fr;} textarea{min-height:100px;} }
""",
    body=[
        ('<h2>So — where next?</h2>', '<h2>So, where next?</h2>'),
        ('<li>Where do you want to be in a year — same job, different country, further qualification?</li>', '<li>Where do you want to be in a year: same job, different country, further qualification?</li>'),
        ('Almost everything that makes someone good at this job is learned in the two or three years after the course — which is what the second half of this session is about.', 'Almost everything that makes someone good at this job is learned in the two or three years after the course, which is what the second half of this session is about.'),
        ('You\'ll also need referees — your tutors are normally happy to act as one', 'You\'ll also need referees; your tutors are normally happy to act as one'),
        ('<li>Name the school and say why <i>that</i> school — one sentence of evidence', '<li>Name the school and say why <i>that</i> school: one sentence of evidence'),
        ('Write the CV this week, before the details fade — your levels,', 'Write the CV this week, before the details fade: your levels,'),
        ('Dave\'s ESL Cafe — job boards plus long-running forums', 'Dave\'s ESL Cafe: job boards plus long-running forums'),
        ('Recruitment agency — international schools and government programmes.', 'A recruitment agency: international schools and government programmes.'),
        ('Reviews of schools and programmes — read these before you sign anything.', 'Reviews of schools and programmes. Read these before you sign anything.'),
        ('Japan. The government scheme — applications open roughly a year ahead.', 'Japan. The government scheme; applications open roughly a year ahead.'),
        ('International House — 140-odd schools worldwide,', 'International House: 140-odd schools worldwide,'),
        ('EF — large, recruits heavily at entry level across many countries.', 'EF: large, and recruits heavily at entry level across many countries.'),
        ('Ask to speak to a teacher who already works there — a school with nothing to hide will put you in touch.', 'Ask to speak to a teacher who already works there; a school with nothing to hide will put you in touch.'),
        ('where teachers name schools that pay late — or pay properly.', 'where teachers name schools that pay late, or pay properly.'),
        ('That doesn\'t mean don\'t apply — it means apply anyway,', 'That doesn\'t mean you shouldn\'t apply. It means apply anyway,'),
        ('It is normal — don\'t be caught out by it.', 'It is normal; expect it.'),
        ('Then plan something you can actually deliver — a clear context,', 'Then plan something you can actually deliver: a clear context,'),
        ('Name one real thing from your TPs — timing, instructions, error correction — and say what you\'re doing about it.', 'Name one real thing from your TPs (timing, instructions, error correction) and say what you\'re doing about it.'),
        ('Outside state institutions and the larger schools it is less common than it should be — and without one', 'Outside state institutions and the larger schools it is less common than it should be, and without one'),
        ('The main Turkish classifieds site — flats, flatmates, furniture.', 'The main Turkish classifieds site: flats, flatmates, furniture.'),
        ('Ask your tutors for the current ones — they change names more often than websites do.', 'Ask your tutors for the current ones; they change names more often than websites do.'),
        ('Not a book a month — that never happens.', 'Not a book a month; that never happens.'),
        ('Volunteer to give one in your first year — it\'s the fastest way to be taken seriously.', 'Volunteer to give one in your first year; it\'s the fastest way to be taken seriously.'),
        ('The US equivalent — conventions, journals, online courses.', 'The US equivalent: conventions, journals, online courses.'),
        ('The English language educators\' association in Turkey — local conferences and events,', 'The English language educators\' association in Turkey: local conferences and events,'),
        ('<td>Any time — and they make your CV distinctive early on.</td>', '<td>Any time, and they make your CV distinctive early on.</td>'),
        ('<div class="u">Delta — official information</div>', '<div class="u">Delta: official information</div>'),
        ('The learner-facing companion — give this one to your students.', 'The learner-facing companion; give this one to your students.'),
        ('Lanternfish — printables, flashcards and young-learner material.', 'Lanternfish: printables, flashcards and young-learner material.'),
        ('Oxford — course materials, teacher\'s books and free downloads.', 'Oxford: course materials, teacher\'s books and free downloads.'),
        ('Macmillan — courses, teacher resources and webinars.', 'Macmillan: courses, teacher resources and webinars.'),
        ('Everything about the Cambridge exams — essential if you end up teaching exam classes.', 'Everything about the Cambridge exams; essential if you end up teaching exam classes.'),
        ('News about the industry — who\'s hiring, which sectors are growing, what\'s changing.', 'News about the industry: who\'s hiring, which sectors are growing, what\'s changing.'),
        ('Made for learners — a good listening source to point students towards.', 'Made for learners; a good listening source to point students towards.'),
        ('<li><b>Learning Teaching</b> — Jim Scrivener. The one to buy first.</li>', '<li><b>Learning Teaching</b>, Jim Scrivener. The one to buy first.</li>'),
        ('<li><b>The Practice of English Language Teaching</b> — Jeremy Harmer. Broader, more reference-like.</li>', '<li><b>The Practice of English Language Teaching</b>, Jeremy Harmer. Broader, more reference-like.</li>'),
        ('<li><b>How to Teach Grammar</b> / <b>How to Teach Vocabulary</b> — Scott Thornbury. Short, and they answer the questions you\'ll actually have.</li>', '<li><b>How to Teach Grammar</b> and <b>How to Teach Vocabulary</b>, Scott Thornbury. Short, and they answer the questions you\'ll actually have.</li>'),
        ('<li><b>Practical English Usage</b> — Michael Swan. For the moment a student asks something you can\'t answer.</li>', '<li><b>Practical English Usage</b>, Michael Swan. For the moment a student asks something you can\'t answer.</li>'),
        ('<li><b>Teaching Unplugged</b> — Thornbury &amp; Meddings. For when you\'re ready to teach with less.</li>', '<li><b>Teaching Unplugged</b>, Thornbury and Meddings. For when you\'re ready to teach with less.</li>'),
        ('<p style="margin:0 0 4px"><b>Checked and no longer working</b> — worth knowing, because these addresses still circulate on old handouts:</p>', '<p style="margin:0 0 4px"><b>Checked and no longer working.</b> Worth knowing, because these addresses still circulate on old handouts:</p>'),
        ('<li><code>tesol.edu</code> — domain no longer resolves. TESOL is now at <b>tesol.org</b>.</li>', '<li><code>tesol.edu</code>: the domain no longer resolves. TESOL is now at <b>tesol.org</b>.</li>'),
        ('<li><code>cambridge-efl.org</code> — gone. Cambridge exams are at <b>cambridgeenglish.org</b>.</li>', '<li><code>cambridge-efl.org</code>: gone. Cambridge exams are at <b>cambridgeenglish.org</b>.</li>'),
        ('<li><code>britcoun.org</code> — serves an archived 1990s page. Use <b>britishcouncil.org</b>.</li>', '<li><code>britcoun.org</code>: serves an archived 1990s page. Use <b>britishcouncil.org</b>.</li>'),
        ('<li><code>eslpartyland.com</code> — now redirects to a private tutoring marketplace.</li>', '<li><code>eslpartyland.com</code>: now redirects to a private tutoring marketplace.</li>'),
        ('<li><code>edufind.com</code> — redirects into EF\'s learner resources.</li>', '<li><code>edufind.com</code>: redirects into EF\'s learner resources.</li>'),
        ('<li><code>jobsabroad.com</code> — folded into GoAbroad\'s job board.</li>', '<li><code>jobsabroad.com</code>: folded into GoAbroad\'s job board.</li>'),
        ('<li><code>besig.org</code> — no longer serving; the Business English SIG sits under <b>iatefl.org</b>.</li>', '<li><code>besig.org</code>: no longer serving; the Business English SIG sits under <b>iatefl.org</b>.</li>'),
        ('<li><code>onestopenglish.com</code> — Macmillan announced its closure;', '<li><code>onestopenglish.com</code>: Macmillan announced its closure;'),
        ('<li>Anything on <code>geocities.com</code> — the whole service closed in 2009.</li>', '<li>Anything on <code>geocities.com</code>: the whole service closed in 2009.</li>'),
        ('<li><code>asiaweek.com</code>, <code>worth1000.com</code>, the CompuServe bookshop address — long gone.</li>', '<li><code>asiaweek.com</code>, <code>worth1000.com</code>, the CompuServe bookshop address: long gone.</li>'),
        ('Be specific and be realistic — one or two things per box, not ten.', 'Be specific and be realistic: one or two things per box, not ten.'),
    ],
    script=[("document.querySelectorAll('#nv a')", "document.querySelectorAll('#stickyNav a')")],
))

# ---- Drama in the ELT classroom --------------------------------------------------
RECIPES.append(dict(
    slug='drama-in-the-elt-classroom', src='drama-in-the-elt-classroom/index.html', start='<div class="navin" id="nv">', end='<footer>',
    swap=[(r'<div class="pic monster"><img[^>]*></div>', 'drama-monster.svg'), (r'<div class="pic frog"><img[^>]*></div>', 'drama-frog.svg')],
    eyebrow='Input session · Activities and materials', title='Drama in the ELT classroom',
    sub='Warm-ups, getting started, cooling down, and a party to finish. Activities to try on each other first, with the Activity Evaluation Sheet open beside them.',
    nav=[('what', 'Drama in ELT'), ('warm', 'Warm-ups'), ('start', 'Getting started'), ('cool', 'Cooling down'), ('party', 'The birthday party')],
    sources="""The opening quotations are from Alan Maley and Alan Duff, <i>Drama Techniques in Language Learning</i> (Cambridge University Press). "Miming a monster" and "Listen and mime" are adapted from Sarah Phillips, <i>Drama with Children</i> (Oxford University Press); "Rod the frog" is by Carol Read and Ana Soberón. The warm-ups and cooling-down exercises are classic drama-in-ELT activities from the tutor's own collection.""",
    css=IH_CSS + r"""
  .act{padding:14px 0 4px; border-top:1px solid var(--row-line); margin-top:10px;}
  .act:first-of-type{border-top:0; margin-top:0; padding-top:4px;}
  .act h3{margin:0 0 6px;}
  .meta{display:flex; gap:6px; flex-wrap:wrap; margin:0 0 8px;}
  .meta span{display:inline-flex; align-items:center; gap:5px; border-radius:999px; border:1px solid var(--sand-line); padding:3px 10px; font-size:.74rem; font-weight:600; background:var(--box); color:oklch(45% 0.02 70);}
  .meta span b{font-family:'Instrument Sans','Karla',sans-serif; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  .creditline{font-size:.8rem; color:var(--grey); margin:8px 0 0; font-style:italic;}
  .quote{font-family:'Newsreader',Georgia,serif; font-style:italic; font-size:1.02rem; line-height:1.55; background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:var(--r-control); padding:10px 14px; margin:8px 0;}
  svg[aria-label]{float:right; width:min(220px, 40%); height:auto; margin:0 0 10px 16px; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:8px;}
  .clear{clear:both;}
  .song{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; font-family:'Newsreader',Georgia,serif; font-size:1.02rem; line-height:1.7; margin:8px 0;}
  .song .ch{font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-deep); font-weight:600; margin:10px 0 2px;}
  .story{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0;}
  .story p{margin:4px 0; font-size:.95rem;}
  .story .n{font-style:italic; color:var(--grey);}
  .link{background:var(--gold-wash); border:1px solid var(--amber-edge); border-radius:var(--r-control); padding:10px 14px; font-size:.9rem; margin:12px 0 0;}
  .link b{color:var(--gold-deep);}
  @media(max-width:560px){ svg[aria-label]{float:none; width:60%; margin:0 auto 10px; display:block;} }
""",
    body=[
        ('<h2>Drama in the ELT classroom is ……</h2>', '<h2>Drama in the ELT classroom is…</h2>'),
        ('<li>Make the instructions more sedate — <i>', '<li>Make the instructions more sedate: <i>'),
        ('<li>One group organises itself to form a ‘grotto\' — a shape with holes in it.</li>', '<li>One group organises itself to form a ‘grotto\', a shape with holes in it.</li>'),
        ('<li>Distribute ‘obstacles\' around the room — chairs, tables, books, bags, etc.</li>', '<li>Distribute ‘obstacles\' around the room: chairs, tables, books, bags, and so on.</li>'),
        ('<li>Get the children to stand in a circle — or behind their desks if the room is too small — and join them.</li>', '<li>Get the children to stand in a circle, or behind their desks if the room is too small, and join them.</li>'),
        ('to make sure the actions are practical — not too long or difficult, boring, dangerous, etc.</li>', 'to make sure the actions are practical: not too long or difficult, boring or dangerous.</li>'),
        ('<div class="creditline">Adapted from <i>Drama with Children</i>, Phillips, S. — Oxford Resource Books for Teachers</div>', '<div class="creditline">Adapted from Sarah Phillips, <i>Drama with Children</i> (Oxford Resource Books for Teachers)</div>'),
        ('<li>Students lie — ideally — or sit, with their eyes closed.</li>', '<li>Students lie, ideally, or sit, with their eyes closed.</li>'),
        ('<li>You can also use classical music — Sibelius or Brahms.</li>', '<li>You can also use classical music: Sibelius or Brahms.</li>'),
    ],
    script=[("document.querySelectorAll('#nv a')", "document.querySelectorAll('#stickyNav a')")],
))



# ---- the two pages built by hand take the same notes and gate --------------
HAND = ('teaching-literacy', 'teaching-productive-skills', 'guided-discovery-vs-ppp')

CHROME = '''  <div class="chrome">
    <a class="lockup" href="../index.html" title="The library">
      <span class="tile"><svg viewBox="8 30 104 60" width="20" height="12" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"/><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"/></svg></span>
      <span class="hub-pair"><span class="word">Connect</span><span class="hub-word">Lite</span></span>
    </a>
    <div class="role" id="roleLabel">Trainee</div>
  </div>
  <a class="back" href="../index.html">Back to the library</a>

'''

def hand(slug):
    p = HERE / slug / 'index.html'
    page = p.read_text(encoding='utf-8')
    if '<div class="chrome">' not in page:
        page = page.replace('<div class="wrap">\n\n  <header class="header">', '<div class="wrap">\n\n' + CHROME + '  <header class="header">', 1)
        assert '<div class="chrome">' in page, slug + ': no header to put the chrome before'
    if 'class="back"' not in page:
        page = page.replace('    <div class="role" id="roleLabel">Trainee</div>\n  </div>\n', '    <div class="role" id="roleLabel">Trainee</div>\n  </div>\n  <a class="back" href="../index.html">Back to the library</a>\n', 1)
        assert 'class="back"' in page, slug + ': no chrome to put the back link under'
    page = re.sub(r"\s*<!-- The trainer's notes\. Hidden until the tutor-link gate exists\. -->\s*<section id=\"trainer\" hidden>.*?</section>", '', page, count=1, flags=re.S)
    page = re.sub(r"\n\n  <section id=\"trainer\" class=\"trainer-notes\" hidden>.*?</section>", '', page, count=1, flags=re.S)
    page = page.replace('\n  <footer class="hub-brand-foot">', notes_block(slug) + '\n\n  <footer class="hub-brand-foot">', 1)
    if 'class="tn-link"' not in page:
        page = page.replace('    <button class="print-btn"', '    <a href="#trainer" class="tn-link" hidden>Trainer notes</a>\n    <button class="print-btn"', 1)
    page = re.sub(r"\n<script src=\"\.\./\.\./hub-store\.js\"></script>\n<script>\n\(function\(\)\{\n(?:  if \(window\.InputLib\) InputLib\.gate\(\);\n)?  if \(!window\.HubStore.*?</script>", '', page, count=1, flags=re.S)
    if 'class="gating"' not in page:
        page = page.replace('<html lang="en">', '<html lang="en" class="gating">', 1)
    if '../library.js' not in page:
        page = re.sub(r'(<meta name="viewport"[^>]*>)', r'\1\n<script src="../library.js"></script>', page, count=1)
    page = films_closed(page)
    page = re.sub(r"\n<script>\n\(function\(\)\{\n  document\.querySelectorAll\('\.film\[data-src\]'\).*?</script>", '', page, count=1, flags=re.S)
    # every earlier copy of the film script goes, so a rebuild adds one, not one more
    page = re.sub(r"\n<script>\n\(function\(\)\{\n  /\* A film with an end time.*?</script>", '', page, flags=re.S)
    page = page.replace('\n</body>', '\n' + FILM_JS + '\n' + GATE + '\n</body>', 1)
    assert page.count('id="trainer"') == 1 and page.count('hub-store.js') == 1 and page.count('hub-notebook.js') == 1, slug
    assert page.count('A film with an end time') == 1, slug + ': the film script is not there once'
    page = number_from_nav(strip_lengths(alias(page, slug)))
    p.write_text(page, encoding='utf-8')
    print('patched', p.relative_to(ROOT), len(page))


if __name__ == '__main__':
    want = sys.argv[1:]
    for r in RECIPES:
        if not want or r['slug'] in want:
            build(r)
    for slug in HAND:
        if not want or slug in want:
            hand(slug)
