#!/usr/bin/env python3
"""The parts added to the input sessions that ran under 75 minutes.

Ramy, 27 Oct 2026: "build the under-75 session additions". Each session in
ADD gets one more part: a task the trainees do, with a worked key behind
Reveal answer. The content lives in _adds_a.py, _adds_b.py and _adds_c.py; this
file puts it on the page.

A part is put in the finished page (not in the recipe), after the section
named in `after`, with its nav link; the numbers in the nav are then made
sequential again and the margin numbers follow. It is safe to run twice: an
earlier copy of the part (its section and its nav link) is taken out first.
Run from the connect-Hub folder:

    python3 input-sessions/_adds_all.py              every session
    python3 input-sessions/_adds_all.py error-correction ppp

and _house.py runs it at the end of a rebuild, so a rebuilt page keeps its part.
The trainer notes of the same sessions are written by _notes.py; this file
also puts them in the store's own file (store/gas/TrainerNotes.js).
"""
import re, sys, json, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent

ADD = {}


def area(placeholder, rows=3):
    return '<textarea class="write-area" rows="%d" placeholder="%s"></textarea>' % (rows, placeholder)


def reveal(kid, inner, show='Reveal answer', hide='Hide answer'):
    """A key behind a button: the same control the other sessions use."""
    return ('<div class="btn-row"><button class="btn secondary" type="button" '
            'onclick="this.textContent=document.getElementById(\'%s\').classList.toggle(\'shown\')?\'%s\':\'%s\'">%s</button></div>\n'
            '<div class="reveal-block" id="%s">%s</div>' % (kid, hide, show, show, kid, inner))


def slips(items):
    """items: (who, html) or (who, html, 'wide'). Cards in a grid."""
    out = []
    for it in items:
        cls = ' wide' if len(it) > 2 and it[2] == 'wide' else ''
        out.append('<div class="slip%s"><span class="who">%s</span>%s</div>' % (cls, it[0], it[1]))
    return '<div class="slips">\n' + '\n'.join(out) + '\n</div>'


def lead(text):
    return '<p class="lead">%s</p>' % text


def section_html(a):
    if a.get('style', 'A') == 'A':
        return ('  <section id="%s">\n    <div class="card">\n      <div class="stage-title">%s <span class="badge">%s</span></div>\n%s\n    </div>\n  </section>'
                % (a['id'], a['title'], a['badge'], a['html'].strip('\n')))
    return ('  <section id="%s">\n    <span class="section-tag">%s</span>\n    <h2>%s</h2>\n    <div class="card">\n%s\n    </div>\n  </section>'
            % (a['id'], a['badge'], a['title'], a['html'].strip('\n')))


def apply_add(slug, number_from_nav):
    a = ADD.get(slug)
    if not a:
        return
    p = HERE / slug / 'index.html'
    page = p.read_text(encoding='utf-8')
    kid = a['id']
    # an earlier copy goes first
    # (number_from_nav has put data-n on an earlier copy, so the tag may carry attributes)
    page = re.sub(r'\n*  <section id="%s"[^>]*>.*?</section>' % re.escape(kid), '', page, flags=re.S)
    page = re.sub(r'\n    <a href="#%s">[^<]*</a>' % re.escape(kid), '', page)
    after = a.get('after')
    if after:
        m = re.search(r'<section id="%s"[^>]*>' % re.escape(after), page)
        assert m, f'{slug}: no section {after} to put the part after'
        end = page.index('</section>', m.end()) + len('</section>')
    else:
        m = re.search(r'\n*  <section id="trainer"', page)
        assert m, f'{slug}: no trainer section'
        end = m.start()
    page = page[:end] + '\n\n' + section_html(a) + page[end:]
    nav = re.search(r'(<nav class="sticky-nav"[^>]*>)(.*?)(</nav>)', page, flags=re.S)
    assert nav, f'{slug}: no nav'
    body = nav.group(2)
    label = ('0 · ' if a.get('numbered', True) else '') + a['label']
    link = '\n    <a href="#%s">%s</a>' % (kid, label)
    if after:
        lm = re.search(r'<a href="#%s"[^>]*>[^<]*</a>' % re.escape(after), body)
        assert lm, f'{slug}: no nav link for {after}'
        body = body[:lm.end()] + link + body[lm.end():]
    else:
        body = body.replace('\n    <a href="#trainer"', link + '\n    <a href="#trainer"', 1)
    # the numbered labels run 1, 2, 3 ... again, in the order of the nav
    firsts = [int(x) for x in re.findall(r'<a href="#[^"]+"[^>]*>(\d+) \u00b7 ', body) if int(x) > 0]
    n = [(min(firsts) if firsts else 1) - 1]     # a page whose numbers start at 2 keeps starting at 2
    def renum(m):
        n[0] += 1
        return '%s%d · ' % (m.group(1), n[0])
    body = re.sub(r'(<a href="#[^"]+"[^>]*>)\d+ · ', renum, body)
    page = page[:nav.start(2)] + body + page[nav.end(2):]
    page = number_from_nav(page)
    p.write_text(page, encoding='utf-8')
    print('part added:', p.relative_to(ROOT), '(%s)' % a['label'])


def store_notes(slugs, NOTES, american):
    """The trainer notes of these sessions into the store's own file."""
    f = ROOT / 'store' / 'gas' / 'TrainerNotes.js'
    m = re.search(r'var TRAINER_NOTES_ = (\{.*\});', f.read_text(encoding='utf-8'), re.S)
    held = json.loads(m.group(1))
    for s in slugs:
        held[s] = american(NOTES[s].strip(), s, HERE).strip()
    f.write_text('// Generated by input-sessions/_house.py (externalize_notes). Do not edit here: edit _notes.py and rebuild.\n'
                 "// The input sessions' trainer notes, served by the store op trainerNotes to tutors only.\n"
                 'var TRAINER_NOTES_ = ' + json.dumps(held, ensure_ascii=False, indent=0) + ';\n', encoding='utf-8')
    print('trainer notes written to the store file for', ', '.join(slugs))


def apply_all(want, number_from_nav, NOTES, american):
    done = [s for s in ADD if not want or s in want]
    for s in done:
        apply_add(s, number_from_nav)
    return done
