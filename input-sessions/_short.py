#!/usr/bin/env python3
"""THE SHORT SESSIONS (Ramy, 15 Nov 2026, the eve of C/21): "we're gonna need to have those 45-minute and short input
sessions that we have on Connect ... on Connect Lite as well. So we'll have sort of a variation of long and short input
sessions ... In our Lite format."

Each short session is Connect's 45-minute session (src/app/input-sessions/sessions/<connect-slug>.tsx in the Connect
repo), its content word for word in American spelling, rebuilt on Lite's desk. This file holds the parts every short
page shares, taken from a long page so the two cannot drift: the head, the chrome (lockup, role, back link), the brand
foot and the closing scripts (the library's gate, and the trainer notes from the store for a tutor's link). Each
session is a recipe in _short_recipes/<slug>.py with TITLE, SUB, NAV, BODY, STYLE, SCRIPT, SOURCES.

  python3 input-sessions/_short.py [slug ...]     rebuild one, some, or all

Pages land in input-sessions/<slug>-short/index.html. Their trainer notes live in store/gas/TrainerNotes.js under
"<slug>-short", like every other session's.
"""
import importlib.util, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
# HOW LONG EACH ONE RUNS: Connect's own figure for it (its registry and agenda). Most are 45; these are not.
# NO LENGTH SHOWN (Ramy, 20 Nov 2026, of Drilling techniques: "It reads 65 minutes, and it's most definitely not 65 ... just remove
#   the timing"): no pill under the title, no minutes in the tab's title, none on the parts.
UNTIMED = {'drilling-techniques'}
MINUTES = {'classroom-management': 60, 'connected-speech': 50, 'drilling-techniques': 65, 'eliciting-and-concept-checking': 60,
           'language-practice': 72, 'phonology-sounds': 60, 'professional-development': 30, 'teaching-exam-classes': 50}
FROM = os.path.join(HERE, 'classroom-management', 'index.html')   # the long page the shared parts are read from


def parts():
    s = open(FROM, encoding='utf-8').read()
    head_end = s.index('<style>')
    head = s[:head_end]
    chrome = s[s.index('<body>'):s.index('<header class="header">')]
    foot = s[s.index('<footer class="hub-brand-foot">'):s.index('</footer>') + len('</footer>')]
    tail = s[s.index('<script src="../../hub-store.js"></script>'):]
    return head, chrome, foot, tail


def build(slug):
    path = os.path.join(HERE, '_short_recipes', slug.replace('-', '_') + '.py')
    spec = importlib.util.spec_from_file_location('r_' + slug.replace('-', '_'), path)
    r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
    head, chrome, foot, tail = parts()
    title = r.TITLE
    mins = MINUTES.get(slug, 45)
    untimed = slug in UNTIMED
    head = re.sub(r'<!--.*?-->', '<!--\n  Connect Lite — input session, the short one: ' + title + '\n  © 2026 Ramy Sakr. All rights reserved.\n\n'
                  '  Connect\'s 45-minute session on Lite\'s desk. Built by _short.py from _short_recipes/' + slug.replace('-', '_') + '.py;\n'
                  '  edit the recipe there, not this file.\n-->', head, count=1, flags=re.S)
    head = re.sub(r'<title>.*?</title>', '<title>' + title + ('' if untimed else ' · %d minutes' % mins) + ' — Connect Lite</title>', head, count=1)
    nav = '\n'.join('    <a href="#%s">%s</a>' % (a, t) for a, t in r.NAV)
    page = (head + '<style>\n' + SHARED_STYLE + r.STYLE + '\n</style>\n</head>\n' + chrome
            + '<header class="header">\n    <p class="eyebrow">Input session · CELTA</p>\n    <h1>' + title + '</h1>\n'
            + '    <p class="len">' + ('' if untimed else '<span class="lenpill">' + str(mins) + ' minutes</span>') +(('<a class="lenlink" href="../' + r.LONG + '/index.html">The longer session</a>') if getattr(r, 'LONG', '') else '') + '</p>\n'
            + '    <p class="sub">' + r.SUB + '</p>\n  </header>\n\n'
            + '  <nav class="sticky-nav" id="stickyNav">\n' + nav + '\n    <a href="#trainer" class="tn-link" hidden>Trainer notes</a>\n'
            + '    <button class="print-btn" onclick="window.print()">Print the handout</button>\n  </nav>\n\n'
            + (re.sub(r' <span class="badge">\d+ minutes?</span>', '', r.BODY) if untimed else r.BODY).strip('\n') + '\n\n'
            + '  <section id="trainer" class="trainer-notes" data-slug="' + slug + '-short" hidden>\n    <div class="card">\n'
            + '      <div class="stage-title">Trainer notes <span class="badge">Tutor only</span></div>\n'
            + '      <div class="guide-box gb-plain tn-box"><div class="gb" id="tnBody"></div></div>\n    </div>\n  </section>\n\n'
            + ('  <p class="sources"><b>Sources.</b> ' + r.SOURCES + '</p>\n\n' if getattr(r, 'SOURCES', '') else '')
            + '  ' + foot + '\n</div>\n\n<script>\n' + r.SCRIPT.strip('\n') + '\n</script>\n' + tail)
    for bad in ('Nunito', 'Playfair', '▾', '→', '←', 'practise', 'behaviour', 'colour', 'organis', 'minimis', 'recognis', 'centre'):
        assert bad not in page, (slug, bad)
    out = os.path.join(HERE, slug + '-short'); os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(page)
    print('built', slug + '-short', len(page), 'bytes')


# the parts every short page adds to session.css: the length pill under the title, the stage's minutes, a list row
SHARED_STYLE = r'''
  .len{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin:2px 0 10px;}
  .lenpill{display:inline-flex; align-items:center; font-family:'Karla',sans-serif; font-size:.74rem; font-weight:700; letter-spacing:.04em; padding:3px 11px; border-radius:999px; background:var(--teal); color:var(--paper);}
  .lenlink{font-size:.84rem; font-weight:600; color:var(--teal); text-decoration:none;} .lenlink:hover{text-decoration:underline; text-underline-offset:3px;}
  .btn[hidden], [hidden]{display:none !important;}   /* .btn is inline-flex in session.css, which beat [hidden] */
  .mins{font-family:'Karla',sans-serif; font-weight:600; font-size:.8rem; color:var(--grey); margin-left:6px;}
  .stack{display:flex; flex-direction:column; gap:8px; margin:12px 0 0;}
  .tagrow{display:flex; flex-wrap:wrap; align-items:center; gap:10px; background:var(--paper); border:1.5px dashed var(--sand-line); border-radius:var(--r-strip); padding:11px 14px; font-weight:600; font-size:.9rem;}
  .tagrow .pill{font-size:.72rem; font-weight:700; padding:2px 9px; border-radius:999px; color:var(--teal); border:1px solid color-mix(in oklab, var(--teal) 35%, var(--paper)); background:var(--paper);}
'''

def notes_to_store(slugs):
    """The trainer notes go to the store, like every long session's (store/gas/TrainerNotes.js, op trainerNotes, a tutor's
    link only): "<slug>-short" from each recipe's NOTES. The file keeps every other session's notes as they are."""
    import json
    f = os.path.join(HERE, '..', 'store', 'gas', 'TrainerNotes.js')
    src = open(f, encoding='utf-8').read()
    m = re.search(r'var TRAINER_NOTES_ = (\{.*\});', src, re.S)
    held = json.loads(m.group(1))
    for slug in slugs:
        path = os.path.join(HERE, '_short_recipes', slug.replace('-', '_') + '.py')
        spec = importlib.util.spec_from_file_location('n_' + slug.replace('-', '_'), path)
        r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
        if getattr(r, 'NOTES', '').strip(): held[slug + '-short'] = r.NOTES.strip()
    head = src[:src.index('var TRAINER_NOTES_')]
    open(f, 'w', encoding='utf-8').write(head + 'var TRAINER_NOTES_ = ' + json.dumps(held, ensure_ascii=False, indent=0) + ';\n')
    print('trainer notes held by the store:', len(held))


if __name__ == '__main__':
    names = sys.argv[1:] or sorted(f[:-3].replace('_', '-') for f in os.listdir(os.path.join(HERE, '_short_recipes')) if f.endswith('.py'))
    for n in names: build(n)
    notes_to_store(names)
