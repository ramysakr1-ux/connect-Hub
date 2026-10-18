/* THE MARKING PAGE'S HELP (17 Oct 2026).
 *
 * Ramy: "everything started with me wanting to improve the assignments...
 * use all the innovation that you can think of... as you're typing, the
 * screen is not crowded, but it will just show what you should watch out
 * for... the guideline would just appear over you while you're making a
 * comment... not fixed there, but just there as a reminder."
 *
 * One rule: the help comes to where you are, then gets out of the way.
 *   - Reading: a small card at the top of the marking panel shows what a Met
 *     answer looks like for the section you are reading, and its shortfalls.
 *   - Typing a criterion's note: its guidance floats beside the box, and goes
 *     when you leave it.
 *   - Margin comments, as in the Google Docs: select words in the work and a
 *     bar offers Comment, plus one-tap comments taken from the shortfalls for
 *     that section. A comment can be tied to a criterion; it is then listed
 *     under that criterion as evidence.
 *   - A note is a link until it is wanted, and an empty one never shows.
 *
 * Data: sub.margin = { sub1: [...], sub2: [...] }, each
 *   { id, loc, quote, text, crit, by, at }. A comment belongs to the round it
 *   was written on, so first-round comments stay on the first submission.
 *   loc is "t<section>" for a written section, "f:<field key>" for a table
 *   cell. The page calls hubMarking.afterRender(ctx) after every draw.
 */
(function () {
  var CTX = null;
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var $ = function (id) { return document.getElementById(id); };

  /* ---- the guidance, cut into blocks ---------------------------------- */
  function blocks(text) {
    return String(text || '').split(/\n{2,}/).map(function (b) {
      var lines = b.split('\n'); return { head: lines[0].trim(), body: lines.slice(1).join('\n'), all: b };
    }).filter(function (x) { return x.head; });
  }
  function letterOf(label) { var m = String(label || '').match(/^\s*([A-H])\b[.\u00b7\s]/); return m ? m[1] : ''; }
  /* The block for one place in the work: a written section by its letter
     ("A.  Choosing Your Text" -> "A \u00b7 Choosing the text"), a table row by its
     field name ("Clarification of meaning" -> "Meaning and clarification"). */
  function blockFor(loc) {
    var g = CTX && CTX.guide; if (!g || !g.sections || !loc) return null;
    var bl = blocks(g.sections), sec = CTX.a.sections[+loc.getAttribute('data-sec')] || {}, field = loc.getAttribute('data-field');
    if (field) { var w = field.toLowerCase().split(/\s+/)[0]; return bl.filter(function (b) { return b.head.toLowerCase().indexOf(w) >= 0 && !/^model/i.test(b.head); })[0] || null; }
    var L = letterOf(sec.label);
    return L ? (bl.filter(function (b) { return letterOf(b.head) === L; })[0] || null) : null;
  }
  /* THE "WHILE YOU READ" GUIDANCE, ON TOP OF THE SECTION IT IS FOR (18 Oct 2026).
     Ramy: "while you read A should sit on top of A... and before you mark
     underneath the front page, next to each other." The guidance for the first
     section sits beside "Before you mark" just under the front page; each
     later section carries its own, shut, on top of it. For a table section
     (LRT) it holds the row-by-row guidance in one box. */
  function sectionGuide(i) {
    var g = CTX && CTX.guide; if (!g || !g.sections) return null;
    var sec = CTX.a.sections[i]; if (!sec) return null;
    var bl = blocks(g.sections);
    if (sec.type === 'text') {
      var L = letterOf(sec.label), b = L ? bl.filter(function (x) { return letterOf(x.head) === L; })[0] : null;
      return b ? { head: b.head, body: b.body } : null;
    }
    if (sec.type === 'fields') {
      var rows = bl.filter(function (x) { return !/^model/i.test(x.head) && !letterOf(x.head); });
      return rows.length ? { head: String(sec.label || 'This section').replace(/\s+/g, ' ').trim(), body: rows.map(function (x) { return x.head + '\n' + x.body; }).join('\n\n') } : null;
    }
    return null;
  }
  var OPENSET = {};
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.dataset && d.dataset.bk) OPENSET[d.dataset.bk] = d.open; }, true);
  /* The yellow guidance boxes close when you click outside them, like a note (Ramy,
     18 Oct 2026). "Before you mark" is left alone: it opens by itself when a check
     is flagged, and the flag should stay in view. */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var inPanel = t.closest('#mkHelpPanel');
    [].forEach.call(document.querySelectorAll('details.mk-hbox[open], details.mk-sbox[open]'), function (d) { if (!d.contains(t) && !(inPanel && inPanel.firstChild && inPanel.firstChild.__home === d)) d.open = false; });
  });
  function gbox(key, title, bodyHtml, cls) { return '<details class="guide-box ' + (cls || '') + '" data-bk="' + key + '"' + (OPENSET[key] ? ' open' : '') + '><summary>' + esc(title) + '</summary><div class="gb">' + bodyHtml + '</div></details>'; }
  function firstGuidedSection() {
    var seen = {}, out = [];
    [].forEach.call(document.querySelectorAll('#mkWork .roundlabel[data-sec]'), function (l) { var i = l.getAttribute('data-sec'); if (!seen[i]) { seen[i] = l; out.push([+i, l]); } });
    return out;
  }
  function paintSectionHelp() {
    [].forEach.call(document.querySelectorAll('.mk-sbox'), function (x) { x.remove(); });
    if (!CTX || !CTX.marking || helpHidden()) return;
    firstGuidedSection().forEach(function (pair, n) {
      if (n === 0) return;   /* the first one lives under the front page */
      var g = sectionGuide(pair[0]); if (!g) return;
      pair[1].insertAdjacentHTML('beforebegin', gbox('sec' + pair[0], 'While you read: ' + g.head, hubGuidanceHTML(g.body), 'mk-sbox'));
    });
  }
  function firstSectionBox() {
    var f = firstGuidedSection()[0]; if (!f) return '';
    var g = sectionGuide(f[0]); if (!g) return '';
    return gbox('sec' + f[0], 'While you read: ' + g.head, hubGuidanceHTML(g.body), 'mk-hbox');
  }

  /* ---- the criterion's guidance, inline above its note ------------------ */
  /* It used to float and could sit over the note box (Ramy, 18 Oct 2026: "it
     should not cover the note... on top of the note so you can still write and
     maybe look at the criteria"). It is a panel in the row now, between the
     criterion and its note, open until pressed again. */
  var OPENTIP = null;
  function paintTipIn() {
    [].forEach.call(document.querySelectorAll('.mk-tipin'), function (x) { x.remove(); });
    var i = OPENTIP, g = CTX && CTX.guide, t = g && g.crit && g.crit[i];
    if (i == null || !t || (document.body.className || '').indexOf('mk-nohelp') >= 0) return;
    var link = document.querySelector('[data-tip="' + i + '"]'); if (!link) return;
    link.insertAdjacentHTML('afterend', '<div class="mk-tipin" role="note"><div class="mkt-h"><span>Watch out for: criterion ' + (+i + 1) + '</span></div>' + (window.hubGuidanceHTML ? hubGuidanceHTML(t) : esc(t)) + '</div>');
  }
  function hideTip() { if (OPENTIP != null) { OPENTIP = null; paintTipIn(); } }
  /* Closes the way an empty note does: click outside it (Ramy, 18 Oct 2026:
     "I don't have to close on the word close"). The criterion's own row counts
     as inside, so you can still write in its note with the guidance open. */
  document.addEventListener('click', function (e) {
    if (OPENTIP == null) return;
    var t = e.target; if (!t || !t.closest) return;
    var row = t.closest('.critrow'), mine = row && row.querySelector('[data-tip="' + OPENTIP + '"]');
    /* inside: the panel, its own Guidance link, and its own note. Anything else, even a blank part of the same row, closes it. */
    if (t.closest('.mk-tipin') || t.closest('[data-tip="' + OPENTIP + '"]') || (mine && t.closest('[data-crit-comment], [data-addnote]')) || t.closest('.dictbar')) return;
    hideTip();
  });

  /* ---- margin comments -------------------------------------------------- */
  function list(round) { var s = CTX.sub; s.margin = s.margin || {}; return (s.margin[round] = s.margin[round] || []); }
  function canWrite(round) {
    if (secondMode()) return round === secondRound();
    return CTX.marking && round === CTX.round;
  }
  function writeRound() { return secondMode() ? secondRound() : CTX.round; }
  function mine(c) { return !c.by || c.by === CTX.me; }
  function critShort(i) { var c = (CTX.a.criteria || [])[i]; var t = c ? (c.text || c) : ''; return (+i + 1) + '. ' + (t.length > 60 ? t.slice(0, 58) + '…' : t); }
  function newId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function evidenceFor(i, round) { return list(round || CTX.round).filter(function (c) { return c.crit != null && c.crit !== '' && String(c.crit) === String(i); }); }
  var SEL = null, JUST_TICKED = null, RESEL = null;

  function paintMargin() {
    [].forEach.call(document.querySelectorAll('#mkWork .mloc'), function (loc) {
      var round = loc.getAttribute('data-round'), here = loc.getAttribute('data-loc');
      var items = list(round).filter(function (c) { return c.loc === here; });
      var gut = loc.querySelector('.mgut'); if (!gut) return;
      var box = loc.querySelector('.readonly');
      /* ticks first: n of them, spread over the words (hubTickSpots) */
      items.filter(function (c) { return c.tick; }).forEach(function (c) {
        var at = hubHighlight(box, c.quote, c.id, 'mc mc-tick');
        if (at < 0) return;
        hubTickSpots(c.quote, c.n || 1).forEach(function (sp) {
          var span = document.createElement('span'); span.className = 'tickmark'; span.setAttribute('role', 'img'); span.setAttribute('aria-label', 'ticked');
          span.innerHTML = hubTickSVG(c.id === JUST_TICKED ? 'draw' : ''); hubInsertAt(box, at + sp, span);
        });
      });
      var cm = items.filter(function (c) { return !c.tick; });
      gut.innerHTML = cm.map(function (c) {
        hubHighlight(box, c.quote, c.id, 'mc' + (c.tone ? ' mc-' + c.tone : ''));
        return '<div class="mcard' + (c.tone ? ' tone-' + c.tone : '') + (c.role === 'second' ? ' by-second' : '') + '" data-mcard="' + c.id + '">' +
          (c.crit != null && c.crit !== '' ? '<span class="mc-crit">Criterion ' + (+c.crit + 1) + '</span>' : '') +
          '<p>' + esc(c.text) + '</p>' +
          '<span class="mc-by">' + esc(c.by || '') + '</span>' +
          (canWrite(round) && mine(c) ? '<span class="mc-acts"><button type="button" data-medit="' + c.id + '">Edit</button><button type="button" data-mdel="' + c.id + '">Delete</button></span>' : '') +
          '</div>';
      }).join('');
      loc.classList.toggle('has-mc', cm.length > 0);
    });
    paintEvidence();
  }
  /* under each criterion on the front page: what you tied to it, as you read */
  function paintEvidence() {
    [].forEach.call(document.querySelectorAll('[data-linked]'), function (el) {
      var i = el.getAttribute('data-linked'), ev = evidenceFor(i);
      if (!ev.length) { el.innerHTML = ''; return; }
      var cm = ev.filter(function (c) { return !c.tick; }), tk = ev.filter(function (c) { return c.tick; });
      var nt = tk.reduce(function (a, c) { return a + (c.n || 1); }, 0);
      var head = [cm.length ? cm.length + ' comment' + (cm.length > 1 ? 's' : '') : '', tk.length ? nt + ' tick' + (nt > 1 ? 's' : '') : ''].filter(Boolean).join(', ') + ' under this criterion';
      var q = function (t) { return esc(t.length > 56 ? t.slice(0, 54) + '…' : t); };
      el.innerHTML = '<div class="mk-tied"><span>' + head + '</span>' +
        cm.map(function (c) { return '<button type="button" data-goto="' + c.id + '">“' + q(c.quote) + '”: ' + esc(c.text) + '</button>'; }).join('') +
        tk.map(function (c) { return '<button type="button" data-goto="' + c.id + '">' + hubTickSVG() + ' “' + q(c.quote) + '”' + ((c.n || 1) > 1 ? ' ×' + c.n : '') + '</button>'; }).join('') + '</div>';
    });
  }

  /* what was selected, as one flat string (a line break is a space) */
  function flatText(frag) {
    var out = '', w = document.createTreeWalker(frag, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) out += n.nodeValue; else if (n.nodeName === 'BR') out += ' '; }
    return out;
  }
  function selectionInfo(range) {
    var node = range.commonAncestorContainer; node = node.nodeType === 1 ? node : node.parentNode;
    var loc = node.closest && node.closest('#mkWork .mloc'); if (!loc) return null;
    var box = loc.querySelector('.readonly');
    if (!box || !box.contains(range.startContainer) || !box.contains(range.endContainer)) return null;
    var pre = document.createRange(); pre.setStart(box, 0); pre.setEnd(range.startContainer, range.startOffset);
    var st = flatText(pre.cloneContents()).length, en = st + flatText(range.cloneContents()).length;
    var full = hubFlat(box).all, isW = /[\p{L}\p{N}]/u;
    /* whole words: a selection that stops mid-word takes the rest of the word */
    while (st > 0 && isW.test(full[st - 1]) && isW.test(full[st])) st--;
    while (en < full.length && isW.test(full[en]) && isW.test(full[en - 1])) en++;
    var q = full.slice(st, en).replace(/^\s+|\s+$/g, '');
    return q.length < 2 ? null : { loc: loc, quote: q.slice(0, 2000) };
  }

  /* the bar that appears over a selection */
  function bar() { var b = $('mkSelBar'); if (!b) { b = document.createElement('div'); b.id = 'mkSelBar'; b.className = 'mk-selbar'; b.hidden = true; document.body.appendChild(b); } return b; }
  function tickRec() { return SEL && SEL.tickId ? list(writeRound()).filter(function (x) { return x.id === SEL.tickId; })[0] : null; }
  function showBar(r) {
    var b = bar(), cr = CTX.a.criteria || [], ex = tickRec(), n = ex ? (ex.n || 1) : 0;
    b.innerHTML = '<div class="sb-row"><button type="button" class="sb-main" data-sb="">Comment</button>' +
      '<button type="button" class="sb-good" data-tick>' + hubTickSVG() + ' Good' + (n ? '<span class="sb-n">×' + n + '</span>' : '') + '</button>' +
      (n ? '<button type="button" class="sb-minus" data-untick title="One tick fewer" aria-label="One tick fewer">−</button>' : '') + '</div>' +
      (cr.length ? '<div class="sb-row sb-ties"><span class="sb-lab">Tie to criterion</span>' + cr.map(function (c, i) { return '<button type="button" class="sb-c' + (SEL.crit === i ? ' on' : '') + '" data-bcrit="' + i + '" title="' + esc(critShort(i)) + '">' + (i + 1) + '</button>'; }).join('') + '</div>' : '');
    b.hidden = false;
    var rr = r.getBoundingClientRect(), w = Math.min(b.offsetWidth, innerWidth - 24);
    b.style.left = Math.max(12, Math.min(rr.left, innerWidth - w - 12)) + 'px';
    b.style.top = (rr.bottom + 8 + b.offsetHeight > innerHeight ? Math.max(70, rr.top - b.offsetHeight - 8) : rr.bottom + 8) + 'px';
  }
  function onSelect() {
    var s = window.getSelection(), b = bar();
    if (!CTX || !s || s.isCollapsed || !s.rangeCount) { b.hidden = true; return; }
    var r = s.getRangeAt(0), info = selectionInfo(r);
    if (!info || !canWrite(info.loc.getAttribute('data-round'))) { b.hidden = true; return; }
    SEL = { loc: info.loc, quote: info.quote, crit: null, tickId: null };
    /* the same words already ticked: Good adds another tick to them */
    var here = info.loc.getAttribute('data-loc');
    var ex = list(writeRound()).filter(function (c) { return c.tick && c.loc === here && c.quote === info.quote; })[0];
    if (ex) { SEL.tickId = ex.id; SEL.crit = ex.crit == null || ex.crit === '' ? null : +ex.crit; }
    showBar(r);
  }
  /* after a redraw, the same words are selected again so Good can be pressed again */
  function reselect(id) {
    var ms = document.querySelectorAll('#mkWork mark[data-mc="' + id + '"]'); if (!ms.length) return;
    var rec = list(writeRound()).filter(function (x) { return x.id === id; })[0], loc = ms[0].closest('.mloc'); if (!rec || !loc) return;
    var r = document.createRange(); r.setStartBefore(ms[0]); r.setEndAfter(ms[ms.length - 1]);
    var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    SEL = { loc: loc, quote: rec.quote, crit: rec.crit == null || rec.crit === '' ? null : +rec.crit, tickId: id };
    showBar(r);
  }

  /* CLICK TO SELECT (Ramy, 18 Oct 2026): one click takes the word, a second
     click on it takes the whole paragraph (the whole line if it stands alone),
     a third the whole answer. Dragging still picks an exact phrase. The
     browser's own double and triple click did the same thing a click late. */
  var PICK = null, DOWN = null;
  function inUI(t) { return t.closest && t.closest('#mkSelBar, #mkEditor, #mkDock, #mkDrop, #mkTip, #mkPreview, .dictbar'); }
  function readonlyOf(t) { return t.closest && t.closest('#mkWork .mloc .readonly'); }
  function caretAt(x, y) {
    if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); return p ? { node: p.offsetNode, offset: p.offset } : null; }
    if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); return r ? { node: r.startContainer, offset: r.startOffset } : null; }
    return null;
  }
  function paragraphRange(node, box) {
    var top = node; while (top.parentNode && top.parentNode !== box) top = top.parentNode;
    var first = top, last = top, n = top.previousSibling;
    while (n) { if (n.nodeName === 'BR' && (!n.previousSibling || n.previousSibling.nodeName === 'BR')) break; first = n; n = n.previousSibling; }
    n = top.nextSibling;
    while (n) { if (n.nodeName === 'BR' && (!n.nextSibling || n.nextSibling.nodeName === 'BR')) break; last = n; n = n.nextSibling; }
    var r = document.createRange(); r.setStartBefore(first); r.setEndAfter(last); return r;
  }
  /* ONE CLICK, ONE WORD; the same word again, its paragraph; again, the whole
     answer. It widens only when you click the SAME WORD again: a click on any
     other word starts over at that word, and a click on a blank part of the
     page, outside the highlight, clears it (Ramy, 18 Oct 2026). */
  function clickPick(e, box) {
    var loc = box.closest('.mloc'); if (!canWrite(loc.getAttribute('data-round'))) return false;
    var pos = caretAt(e.clientX, e.clientY); if (!pos || pos.node.nodeType !== 3 || !box.contains(pos.node)) return false;
    var t = pos.node.nodeValue, a = pos.offset, z = pos.offset, isW = /[\p{L}\p{N}'’\-]/u;
    while (a > 0 && isW.test(t[a - 1])) a--;
    while (z < t.length && isW.test(t[z])) z++;
    if (a === z) return false;
    var word = document.createRange(); word.setStart(pos.node, a); word.setEnd(pos.node, z);
    /* clicks count only when they come one right after another on the same word,
       like any double or triple click; a click later, or after clicking out,
       starts again at one word (Ramy, 18 Oct 2026: "I click back again on one,
       I get the whole section. Not just one word") */
    var same = false, now = Date.now();
    try { same = !!(PICK && PICK.box === box && now - PICK.t < 650 && PICK.word && PICK.word.compareBoundaryPoints(Range.START_TO_START, word) === 0 && PICK.word.compareBoundaryPoints(Range.END_TO_END, word) === 0); } catch (x) {}
    var level = same ? Math.min(3, PICK.level + 1) : 1;   /* no fourth click: clicking OUTSIDE the highlight lets go (Ramy, 18 Oct 2026) */
    var range = level === 1 ? word : level === 2 ? paragraphRange(pos.node, box) : (function () { var r = document.createRange(); r.selectNodeContents(box); return r; })();
    PICK = { box: box, level: level, word: word.cloneRange(), t: now };
    var sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    onSelect();
    return true;
  }
  document.addEventListener('mousedown', function (e) {
    DOWN = { x: e.clientX, y: e.clientY };
    if (!(e.target.closest && e.target.closest('#mkSelBar'))) { var ro = readonlyOf(e.target); if (!ro) PICK = null; else if (e.detail > 1) e.preventDefault(); }
  });
  document.addEventListener('mouseup', function (e) {
    if (inUI(e.target)) return;
    var ro = readonlyOf(e.target), moved = DOWN && Math.hypot(e.clientX - DOWN.x, e.clientY - DOWN.y) > 4;
    if (ro && CTX && !moved && !e.target.closest('mark.mc, .mcard, a, button') && clickPick(e, ro)) return;
    PICK = null;
    setTimeout(onSelect, 10);
  });

  /* the small editor, for a new comment or an old one */
  function editor(opts) {
    var ed = $('mkEditor'); if (!ed) { ed = document.createElement('div'); ed.id = 'mkEditor'; ed.className = 'mk-editor'; document.body.appendChild(ed); }
    var crit = (CTX.a.criteria || []), tied = opts.crit == null || opts.crit === '' ? null : +opts.crit;
    ed.innerHTML = '<div class="me-h">' + (opts.id ? 'Edit your comment' : 'Your comment') + '</div>' +
      '<blockquote class="me-q">\u201C' + esc(opts.quote.length > 240 ? opts.quote.slice(0, 238) + '\u2026' : opts.quote) + '\u201D</blockquote>' +
      '<textarea id="meText" rows="8" placeholder="Write it to the trainee, in your own words. They read it beside these words.">' + esc(opts.text || '') + '</textarea>' +
      (opts.fromBar
        ? ''   /* the chips in the dark box already did it (Ramy, 18 Oct 2026: "keep the one in the chip, delete the one in the comment box") */
        : (crit.length ? '<div class="me-chips"><span>Tied to criterion</span>' + crit.map(function (c, i) { return '<button type="button" class="sb-c' + (tied === i ? ' on' : '') + '" data-mecrit="' + i + '" title="' + esc(critShort(i)) + '">' + (i + 1) + '</button>'; }).join('') + '</div>' : '')) +
      '<div class="me-foot"><div class="me-tone" role="group" aria-label="What kind of comment"><button type="button" class="tn-good' + (opts.tone === 'good' ? ' on' : '') + '" data-tone="good"><i></i>Good</button><button type="button" class="tn-fix' + (opts.tone === 'fix' ? ' on' : '') + '" data-tone="fix"><i></i>To work on</button></div>' +
      '<div class="me-acts"><button type="button" class="me-cancel">Cancel</button><button type="button" class="me-save" title="Ctrl or \u2318 + Enter">Save</button></div></div>';
    ed.hidden = false;
    var t = $('meText'); setTimeout(function () { t.focus(); t.setSelectionRange(t.value.length, t.value.length); }, 30);
    t.addEventListener('keydown', function (ev) { if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') { ev.preventDefault(); ed.querySelector('.me-save').click(); } });
    ed.querySelector('.me-cancel').onclick = function () { if (window.hubMic) hubMic.stop(); ed.hidden = true; };
    [].forEach.call(ed.querySelectorAll('[data-mecrit]'), function (b) { b.onclick = function () { var i = +b.getAttribute('data-mecrit'); tied = tied === i ? null : i; [].forEach.call(ed.querySelectorAll('[data-mecrit]'), function (x) { x.classList.toggle('on', +x.getAttribute('data-mecrit') === tied); }); }; });
    [].forEach.call(ed.querySelectorAll('[data-tone]'), function (b) { b.onclick = function () { var was = b.classList.contains('on'); [].forEach.call(ed.querySelectorAll('[data-tone]'), function (x) { x.classList.remove('on'); }); if (!was) b.classList.add('on'); }; });
    ed.querySelector('.me-save').onclick = function () {
      if (window.hubMic) hubMic.stop();
      var text = t.value.trim(), cv = tied == null ? '' : String(tied), onTone = ed.querySelector('[data-tone].on'), tone = onTone ? onTone.getAttribute('data-tone') : null;
      ed.hidden = true;
      if (!text) { if (opts.id) remove(opts.id); return; }   /* an empty comment is no comment */
      var l = list(writeRound());
      if (opts.id) { var c = l.filter(function (x) { return x.id === opts.id; })[0]; if (c) { c.text = text; c.crit = cv === '' ? null : +cv; c.tone = tone; } }
      else l.push({ id: newId('m'), loc: opts.loc, quote: opts.quote, text: text, crit: cv === '' ? null : +cv, tone: tone, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() });
      CTX.save(); CTX.rerender();
    };
  }
  function remove(id) { var l = list(writeRound()); var k = l.findIndex(function (x) { return x.id === id; }); if (k >= 0) l.splice(k, 1); CTX.save(); CTX.rerender(); }

  /* ---- wiring ---------------------------------------------------------- */
  document.addEventListener('selectionchange', function () { var s = window.getSelection(); if (!s || s.isCollapsed) { var b = $('mkSelBar'); if (b && !b.matches(':hover')) setTimeout(function () { var s2 = window.getSelection(); if (!s2 || s2.isCollapsed) b.hidden = true; }, 200); } });
  document.addEventListener('touchend', function (e) { if (!inUI(e.target) && !readonlyOf(e.target)) setTimeout(onSelect, 350); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    /* Good: one tick; press again for another, spread over the words */
    var tk = t.closest('[data-tick]');
    if (tk && SEL) {
      var wl = list(writeRound()), rec = tickRec();
      if (rec) rec.n = Math.min(9, (rec.n || 1) + 1);
      else { rec = { id: newId('t'), loc: SEL.loc.getAttribute('data-loc'), quote: SEL.quote, text: '', tick: true, n: 1, crit: SEL.crit == null ? null : SEL.crit, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() }; wl.push(rec); }
      JUST_TICKED = rec.id; RESEL = rec.id; CTX.save(); CTX.rerender(); return;
    }
    var ut = t.closest('[data-untick]');
    if (ut && SEL) { var r0 = tickRec(); if (r0) { if ((r0.n || 1) > 1) { r0.n--; RESEL = r0.id; CTX.save(); CTX.rerender(); } else { bar().hidden = true; remove(r0.id); } } return; }
    var bc = t.closest('[data-bcrit]');
    if (bc && SEL) {
      var ci = +bc.getAttribute('data-bcrit'); SEL.crit = SEL.crit === ci ? null : ci;
      var r1 = tickRec();
      if (r1) { r1.crit = SEL.crit; RESEL = r1.id; CTX.save(); CTX.rerender(); }
      else [].forEach.call(bar().querySelectorAll('[data-bcrit]'), function (x) { x.classList.toggle('on', +x.getAttribute('data-bcrit') === SEL.crit); });
      return;
    }
    var mt = t.closest('mark.mc-tick');
    if (mt) {
      var tc = list(writeRound()).filter(function (x) { return x.id === mt.dataset.mc; })[0];
      var locEl = mt.closest('.mloc');
      if (tc && locEl && canWrite(locEl.getAttribute('data-round')) && mine(tc) && !getSelection().toString()) { (window.confirmModal ? confirmModal('Take the ' + ((tc.n || 1) > 1 ? (tc.n + ' ticks') : 'tick') + ' off these words?', 'Take off') : Promise.resolve(confirm('Take the tick off?'))).then(function (ok) { if (ok) remove(tc.id); }); }
      return;
    }
    var sb = t.closest('[data-sb]');
    if (sb && SEL) { bar().hidden = true; editor({ loc: SEL.loc.getAttribute('data-loc'), quote: SEL.quote, text: '', crit: SEL.crit, fromBar: true }); window.getSelection().removeAllRanges(); return; }
    var ed = t.closest('[data-medit]');
    if (ed) { var c = list(writeRound()).filter(function (x) { return x.id === ed.getAttribute('data-medit'); })[0]; if (c) editor({ id: c.id, loc: c.loc, quote: c.quote, text: c.text, crit: c.crit, tone: c.tone }); return; }
    var del = t.closest('[data-mdel]'); if (del) { remove(del.getAttribute('data-mdel')); return; }
    var go = t.closest('[data-goto]');
    if (go) { DROP = null; paintDrop(); var m = document.querySelector('mark[data-mc="' + go.getAttribute('data-goto') + '"]'); if (m) { m.scrollIntoView({ block: 'center', behavior: 'smooth' }); m.classList.remove('mc-hit'); void m.offsetWidth; m.classList.add('mc-hit'); } return; }
    var mk = t.closest('mark.mc');
    if (mk) { var card = document.querySelector('[data-mcard="' + mk.dataset.mc + '"]'); if (card) { card.classList.remove('mc-hit'); void card.offsetWidth; card.classList.add('mc-hit'); card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } return; }
    var add = t.closest('[data-addnote]');
    if (add) { var i = add.getAttribute('data-addnote'); var ta = document.querySelector('[data-crit-comment="' + i + '"]'); add.hidden = true; ta.hidden = false; ta.focus(); return; }
    var tl = t.closest('[data-tip]');
    if (tl) { var ti = +tl.getAttribute('data-tip'); OPENTIP = OPENTIP === ti ? null : ti; paintTipIn(); return; }
  });
  /* The guidance opens only when "Guidance" is pressed. It used to open as soon
     as you started a note (Ramy, 18 Oct 2026: "clicking on add a note should
     not open the guidance box"). */
  /* It folds on the click itself, like the guidance (Ramy, 18 Oct 2026: "when you
     click to close add a note... it's not as smooth as closing guidance"). It
     used to wait 180ms after losing focus. Its own Guidance link and panel count
     as inside. Tabbing away folds it too. */
  function foldNote(ta) {
    if (!ta || ta.hidden || ta.value.trim()) return;
    ta.hidden = true; var a = document.querySelector('[data-addnote="' + ta.getAttribute('data-crit-comment') + '"]'); if (a) a.hidden = false;
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    [].forEach.call(document.querySelectorAll('[data-crit-comment]:not([hidden])'), function (ta) {
      var i = ta.getAttribute('data-crit-comment');
      if (t === ta || t.closest('.dictbar') || t.closest('[data-addnote="' + i + '"], [data-tip="' + i + '"]') || (String(OPENTIP) === i && t.closest('.mk-tipin'))) return;
      foldNote(ta);
    });
  });
  document.addEventListener('focusout', function (e) {
    var ta = e.target.closest && e.target.closest('[data-crit-comment]');
    if (ta && e.relatedTarget && !e.relatedTarget.closest('[data-tip="' + ta.getAttribute('data-crit-comment') + '"], .mk-tipin')) foldNote(ta);
  });


  /* ======================= STEP TWO (17 Oct 2026) ======================= */

  /* ---- the checks Lite can do before you mark ----------------------------
     Only what can be told from the text. Each line is ticked, flagged for a
     look, or just information; a flag is never a mark. */
  function snapNow() { var s = CTX.sub; return CTX.marking ? s[CTX.round] : (s.sub2 || s.sub1); }
  /* BEFORE YOU MARK = THE REQUIREMENTS (Ramy, 19 Oct 2026: "this is done by Lite,
     this one needs to be clear... it's a requirement, not an assessment
     criteria... we don't need to duplicate things... people don't like to read
     too much"). One teal box: what Lite checked, then the few things only a
     reader can check, each one line, then the hidden word. The guidance's own
     "Before you mark" block moves here, so How to mark no longer repeats it. */
  function splitGeneral(text) {
    var blocks = String(text || '').split(/\n{2,}/), before = [], rest = [];
    blocks.forEach(function (bl) {
      var lines = bl.split('\n');
      if (/^\s*before you mark\s*$/i.test(lines[0])) lines.slice(1).forEach(function (l) { var m = l.match(/^\s*[\u2022\-]\s+(.*)$/); if (m) before.push(m[1]); });
      else rest.push(bl);
    });
    return { before: before, rest: rest.join('\n\n') };
  }
  /* what Lite already checks is not repeated: the word count, the AI declaration, a source cited in the text */
  var LITE_CHECKS = /word count|\bAI\b|published source quoted/i;
  function oneLine(t) { var m = String(t).match(/^.*?[.!?](?=\s|$)/); return (m ? m[0] : String(t)).trim(); }
  function checksHTML() {
    var snap = snapNow(); if (!snap || !window.hubWorkChecks) return '';
    var items = hubWorkChecks(CTX.a, snap, CTX.key, 'tutor');
    var looks = items.filter(function (x) { return x.state === 'look'; }).length;
    var mine = splitGeneral(CTX.guide && CTX.guide.general).before.filter(function (b) { return !LITE_CHECKS.test(b); }).map(oneLine);
    var trap = String(CTX.a.trap || '').replace(/[^A-Za-z]/g, '');
    /* A light first (Ramy, 19 Oct 2026: "Lite is giving you the green light: you're
       good to go, the requirements have been met. Or watch out, they haven't.
       And then you make a decision"). */
    var go = !looks;
    return '<details class="guide-box mk-checks ' + (go ? 'go' : 'watch') + '" data-bk="checks"' + (OPENSET.checks === undefined ? (looks ? ' open' : '') : (OPENSET.checks ? ' open' : '')) + '><summary><span class="mkc-light"></span>' + (go ? 'Good to go' : 'Watch out: ' + looks + ' to look at') + '<span class="mkc-sub">Before you mark</span></summary><div class="gb">' +
      '<p class="mkc-lead">' + (go ? 'Every requirement Lite can check is in place. Mark it.' : (looks === 1 ? 'One requirement is' : looks + ' requirements are') + ' missing or unclear. You decide: mark it, or return it unmarked so the trainee can fix it.') + '</p>' +
      '<p class="mkc-note">Requirements, not criteria: they decide whether the work is ready to mark, not whether it passes.</p>' +
      '<h4 class="mkc-h">Checked by Lite</h4><ul class="mkc">' +
      items.map(function (x) { return '<li class="' + x.state + '"><b>' + (x.state === 'ok' ? 'Done' : x.state === 'look' ? 'Look' : 'Note') + '</b><span>' + esc(x.label) + (x.detail ? '<small>' + esc(x.detail) + '</small>' : '') + '</span></li>'; }).join('') + '</ul>' +
      (mine.length ? '<h4 class="mkc-h">Check yourself</h4><ul class="mkc-mine">' + mine.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
      (trap ? '<p class="mkc-trap">The hidden word is <b>' + esc(trap) + '</b>. If it is in the work, it was probably produced from a copy of the brief. Look more closely, and follow the centre\u2019s usual process.</p>' : '') +
      '</div></details>';
  }

  /* ---- double marking (not blind: the second marker sees everything) ---- */
  function allMarked(r) { var cr = CTX.a.criteria || [], m = CTX.sub.criteriaMarks[r] || []; return cr.length > 0 && cr.every(function (c, i) { return m[i] === true || m[i] === false; }); }
  function secondRound() {
    if (CTX.marking) return allMarked(CTX.round) ? CTX.round : null;
    if (CTX.sub.sub2 && allMarked('sub2')) return 'sub2';
    return allMarked('sub1') ? 'sub1' : null;
  }
  function modeKey() { return 'mk2:' + (CTX.trainee || '') + ':' + CTX.key; }
  function secondMode() { try { return sessionStorage.getItem(modeKey()) === '1'; } catch (e) { return false; } }
  function setSecondMode(on) { try { on ? sessionStorage.setItem(modeKey(), '1') : sessionStorage.removeItem(modeKey()); } catch (e) {} }
  function secRec(r) { var s = CTX.sub; s.second = s.second || {}; return (s.second[r] = s.second[r] || { by: '', at: '', crit: {}, done: false }); }
  function secondHTML() {
    var r = secondRound(); if (!r) return '';
    var s = CTX.sub, cr = CTX.a.criteria || [], first = (s.markers && s.markers.first) || 'the first marker';
    var rec = (s.second || {})[r], mode = secondMode();
    var disagree = rec ? cr.map(function (c, i) { return i; }).filter(function (i) { return rec.crit[i] && rec.crit[i].agree === false; }) : [];
    var decided = rec ? cr.filter(function (c, i) { return rec.crit[i] && typeof rec.crit[i].agree === 'boolean'; }).length : 0;
    var roundWord = r === 'sub2' ? 'the resubmission' : 'the first submission';
    if (!mode) {
      if (!rec || !decided) return '<div class="card mk-second"><h2>Double marking</h2><p class="mk-how">First marker: <b>' + esc(first) + '</b>. If this one is in the double-marked sample, the second marker sees every mark and note on ' + roundWord + ', agrees or disagrees with each, and initials it.</p><button type="button" class="mk-btn" data-second="on">Second-mark this</button></div>';
      return '<div class="card mk-second"><h2>Double marking</h2><p class="mk-how">First marker <b>' + esc(first) + '</b>, second marker <b>' + esc(rec.by) + '</b>' + (rec.done ? '' : ' (not finished: ' + decided + ' of ' + cr.length + ')') + '.</p>' +
        (disagree.length ? '<div class="mk-disagree"><b>The markers disagree on criterion ' + disagree.map(function (i) { return i + 1; }).join(' and ') + '.</b> ' + (CTX.marking ? 'Settle it between you before it goes back to the trainee.' : 'Talk it through and record what you agree.') + disagree.map(function (i) { var n = rec.crit[i].note; return n ? '<span>' + (i + 1) + ': ' + esc(n) + '</span>' : ''; }).join('') + '</div>' : (rec.done ? '<p class="mk-agree">Agreed on all ' + cr.length + ' criteria.</p>' : '')) +
        '<button type="button" class="mk-btn quiet" data-second="on">' + (rec.done ? 'Open the second marking' : 'Carry on second marking') + '</button></div>';
    }
    var me = CTX.me || '';
    var m = s.criteriaMarks[r] || [], notes = (s.criteriaComments || {})[r] || [];
    return '<div class="card mk-second on"><h2>Second marking</h2>' +
      '<p class="mk-how">You see ' + esc(first) + '’s marks and notes on ' + roundWord + '. Agree or disagree with each; a note is optional. Your margin comments show in teal with your name.' + (me && me === first ? ' <b>You were the first marker: the second should be another tutor.</b>' : '') + (me ? '' : ' <b>Put your name in the header first: it initials the record.</b>') + '</p>' +
      cr.map(function (c, i) {
        var x = (rec && rec.crit[i]) || {}, note = x.note || '';
        return '<div class="sm-row"><div class="sm-c"><span class="mk-n">' + (i + 1) + '</span>' + esc(c.text || c) + '</div>' +
          '<div class="sm-first"><span class="crit-toggle ' + (m[i] === true ? 'met' : 'not') + '" style="cursor:default">' + (m[i] === true ? 'Met' : 'Not met') + '</span>' + (notes[i] ? '<span class="sm-fn">' + esc(notes[i]) + '</span>' : '') + '</div>' +
          '<div class="sm-acts"><button type="button" class="sm-b' + (x.agree === true ? ' on' : '') + '" data-agree="' + i + '" aria-pressed="' + (x.agree === true) + '">Agree</button><button type="button" class="sm-b no' + (x.agree === false ? ' on' : '') + '" data-disagree="' + i + '" aria-pressed="' + (x.agree === false) + '">Disagree</button>' +
          '<button type="button" class="mk-addnote" data-snote="' + i + '"' + (note ? ' hidden' : '') + '>Add a note</button></div>' +
          '<textarea class="sm-note" data-snotebox="' + i + '" rows="2" placeholder="Why, briefly. The first marker reads this."' + (note ? '' : ' hidden') + '>' + esc(note) + '</textarea></div>';
      }).join('') +
      '<button type="button" class="mk-btn quiet" data-second="off">Done</button></div>';
  }
  function secondSet(i, patch) {
    var r = secondRound(); if (!r) return;
    var rec = secRec(r), cr = CTX.a.criteria || [];
    rec.crit[i] = Object.assign({}, rec.crit[i] || {}, patch);
    rec.by = CTX.me || rec.by || 'Second marker'; rec.at = new Date().toISOString();
    rec.done = cr.every(function (c, k) { return rec.crit[k] && typeof rec.crit[k].agree === 'boolean'; });
    var mk = CTX.sub.markers = CTX.sub.markers || { first: '', second: '', doubleMarked: false };
    if (rec.done) { mk.second = rec.by; mk.doubleMarked = true; }
    CTX.save();
  }
  /* the first marker sees a disagreement under the criterion itself */
  function paintDisagreements() {
    var r = CTX.marking ? CTX.round : null; if (!r) return;
    var rec = (CTX.sub.second || {})[r]; if (!rec) return;
    Object.keys(rec.crit || {}).forEach(function (i) {
      var x = rec.crit[i]; if (x.agree !== false) return;
      var host = document.querySelector('[data-linked="' + i + '"]'); if (!host) return;
      host.insertAdjacentHTML('beforebegin', '<div class="mk-disagree small"><b>' + esc(rec.by) + ' disagrees.</b>' + (x.note ? ' ' + esc(x.note) : '') + '</div>');
    });
  }

  /* ---- keys: M met, N not met, J and K next and previous ---------------- */
  var CURI = 0;
  function markCur() { [].forEach.call(document.querySelectorAll('.critrow.mk-cur'), function (r) { r.classList.remove('mk-cur'); }); var b = document.querySelector('.crit-toggle[data-crit="' + CURI + '"]'); if (b) { var row = b.closest('.critrow'); row.classList.add('mk-cur'); } }
  document.addEventListener('keydown', function (e) {
    if (!CTX || !CTX.marking || secondMode()) return;
    var t = e.target; if (t && (t.matches('input, textarea, select, [contenteditable]') || (t.closest && t.closest('#mkEditor')))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var n = (CTX.a.criteria || []).length; if (!n) return;
    var key = e.key.toLowerCase();
    if (key === 'm' || key === 'n') { e.preventDefault(); var v = key === 'm'; var i = CURI; var next = i; var marks = CTX.sub.criteriaMarks[CTX.round] || []; for (var k = 1; k <= n; k++) { var j = (i + k) % n; if (j !== i && marks[j] !== true && marks[j] !== false) { next = j; break; } } CURI = next; CTX.setMark(i, v); return; }
    if (key === 'j' || e.key === 'ArrowDown') { if (key !== 'j' && !document.querySelector('.critrow.mk-cur')) return; e.preventDefault(); CURI = Math.min(n - 1, CURI + 1); markCur(); var r1 = document.querySelector('.critrow.mk-cur'); if (r1) r1.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (key === 'k' || e.key === 'ArrowUp') { if (key !== 'k' && !document.querySelector('.critrow.mk-cur')) return; e.preventDefault(); CURI = Math.max(0, CURI - 1); markCur(); var r2 = document.querySelector('.critrow.mk-cur'); if (r2) r2.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
  });

  /* ---- preview as the trainee will see it ------------------------------- */
  function preview() {
    var a = CTX.a, r = CTX.round, cr = a.criteria || [], m = CTX.sub.criteriaMarks[r] || [];
    var notes = cr.map(function (c, i) { var ta = document.querySelector('[data-crit-comment="' + i + '"]'); return ta ? ta.value.trim() : (((CTX.sub.criteriaComments || {})[r] || [])[i] || ''); });
    var gen = (($('comment') || {}).value || '').trim(), out = CTX.outcome();
    var mc = list(r).filter(function (c) { return !c.tick; }), ticks = list(r).filter(function (c) { return c.tick; });
    var ov = $('mkPreview'); if (!ov) { ov = document.createElement('div'); ov.id = 'mkPreview'; ov.className = 'mk-prev-wrap'; document.body.appendChild(ov); }
    ov.className = 'mk-prev-wrap as-' + CTX.key;
    ov.innerHTML = '<div class="mk-prev" role="dialog" aria-label="What the trainee will see">' +
      '<div class="mkp-top"><span>What the trainee will see when you save and return it</span><button type="button" data-prevclose>Close</button></div>' +
      '<div class="mkp-band"><p>' + esc(a.title) + '</p><h3>' + (out ? esc(out) : 'Not decided yet: mark every criterion first') + '</h3></div>' +
      (gen ? '<div class="mkp-gen">' + esc(gen).replace(/\n/g, '<br>') + '</div>' : '') +
      '<ul class="mkp-crit">' + cr.map(function (c, i) { return '<li><span class="crit-toggle ' + (m[i] === true ? 'met' : m[i] === false ? 'not' : '') + '" style="cursor:default">' + (m[i] === true ? 'Met' : m[i] === false ? 'Not met' : 'Not marked') + '</span><div><b>' + esc(c.text || c) + '</b>' + (notes[i] ? '<p>' + esc(notes[i]) + '</p>' : '') + '</div></li>'; }).join('') + '</ul>' +
      (ticks.length ? '<h4>Ticked</h4><ul class="mkp-mc">' + ticks.map(function (c) { return '<li><q class="tk">' + esc(c.quote) + '</q>' + (window.hubTickSVG ? hubTickSVG() : ' \u2713') + ((c.n || 1) > 1 ? ' \u00d7' + c.n : '') + '</li>'; }).join('') + '</ul>' : '') +
      (mc.length ? '<h4>Comments on her text</h4><ul class="mkp-mc">' + mc.map(function (c) { return '<li><q>' + esc(c.quote) + '</q><p>' + esc(c.text) + '</p></li>'; }).join('') + '</ul>' : '') +
      '</div>';
    ov.hidden = false;
  }

  function paintStep2() {
    var panel = $('mkPanel'); if (!panel) return;
    /* double marking, above the marker record */
    var sh = secondHTML();
    if (sh) { var marker = panel.querySelector('.mk-marker'); var box = document.createElement('div'); box.innerHTML = sh; panel.insertBefore(box.firstChild, marker || null); }
    if (secondMode()) { var crit = $('mkCrit'); if (crit) crit.classList.add('mk-dim'); var sec = panel.querySelector('.mk-second.on'); if (sec) sec.scrollIntoView({ block: 'start' }); }
    paintDisagreements();
    /* the preview, beside Save; the keys, under the instructions */
    var acts = document.querySelector('#mkCrit .actions');
    if (acts && !$('mkPrevBtn')) acts.insertAdjacentHTML('afterbegin', '<button type="button" class="btn btn-quiet" id="mkPrevBtn">Preview as trainee</button>');
    var how = document.querySelector('#mkCrit .mk-how');
    if (how && CTX.marking && innerWidth >= 1080) how.insertAdjacentHTML('afterend', '<p class="mk-keys">On a keyboard: M for Met, N for Not met, J and K for the next and the previous criterion.</p>');
    markCur();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    var sm = t.closest('[data-second]'); if (sm) { setSecondMode(sm.getAttribute('data-second') === 'on'); CTX.rerender(); return; }
    var ag = t.closest('[data-agree]'); if (ag) { secondSet(ag.getAttribute('data-agree'), { agree: true }); CTX.rerender(); return; }
    var dg = t.closest('[data-disagree]'); if (dg) { var i = dg.getAttribute('data-disagree'); secondSet(i, { agree: false }); CTX.rerender(); setTimeout(function () { var b = document.querySelector('[data-snote="' + i + '"]'); if (b && !b.hidden) b.click(); }, 30); return; }
    var sn = t.closest('[data-snote]'); if (sn) { var j = sn.getAttribute('data-snote'), ta = document.querySelector('[data-snotebox="' + j + '"]'); sn.hidden = true; ta.hidden = false; ta.focus(); return; }
    if (t.closest('#mkPrevBtn')) { preview(); return; }
    if (t.closest('[data-prevclose]') || t.id === 'mkPreview') { var ov = $('mkPreview'); if (ov) ov.hidden = true; return; }
    var crit = t.closest('.crit-toggle[data-crit]'); if (crit) CURI = +crit.getAttribute('data-crit');
  });
  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('[data-snotebox]'); if (!ta) return;
    secondSet(ta.getAttribute('data-snotebox'), { note: ta.value });
  });
  document.addEventListener('focusout', function (e) {
    var ta = e.target.closest && e.target.closest('[data-snotebox]'); if (!ta || ta.value.trim()) return;
    ta.hidden = true; var b = document.querySelector('[data-snote="' + ta.getAttribute('data-snotebox') + '"]'); if (b) b.hidden = false;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var ov = $('mkPreview'); if (ov && !ov.hidden) ov.hidden = true; var ed = $('mkEditor'); if (ed && !ed.hidden) { if (window.hubMic) hubMic.stop(); ed.hidden = true; } } });

  /* ---- THE TEXTS TO READ (Ramy, 18 Oct 2026: "when the trainee says I chose text B,
     I should be able to click on Text B and see what it is... the text chosen
     should be a link"). The assignment carries its texts as reading sections
     ("Text A \u2014 ...", "Text B \u2014 ..."); each mention of one, and the "Text
     chosen" headline, opens it in a reader, the chosen one first. */
  /* The reader itself lives in hub-shared.js (hubTexts), shared with the trainee's page. */
  function textsOf() { return CTX && CTX.a ? hubTexts.of(CTX.a) : []; }
  function linkTexts() {
    var snap = CTX.sub[CTX.round] || CTX.sub.sub2 || CTX.sub.sub1;
    hubTexts.link(document.getElementById('mkWork'), '.mloc .readonly', CTX.a, CTX.key, hubTexts.chosen(snap), 'Read the text they chose');
  }

  /* ---- THE FRONT PAGE THAT STAYS WITH YOU (Ramy, 18 Oct 2026: "as you scroll
     down, the criteria stays with you... the front page is like still there").
     Once the criteria have scrolled out of sight a thin bar holds them: each
     criterion as a chip with its state and how much you have tied to it.
     Tap a chip and it opens over the work with its Met and Not met, its note
     and everything tied to it; tap away and it folds back. */
  /* No Criteria tab (Ramy, 19 Oct 2026: "get rid of it and keep the ones on top on top... we don't need it if we can see the ones on top all the time"): once the front page scrolls away, the criteria ride along the top by themselves, on a phone too. */
  var DROP = null, DOCK_OPEN = true;
  function tabEl() { var t = $('mkDockTab'); if (!t) { t = document.createElement('button'); t.id = 'mkDockTab'; t.type = 'button'; t.className = 'mk-dock-tab'; t.setAttribute('data-dktab', ''); t.hidden = true; document.body.appendChild(t); } return t; }
  function dockEl() { var d = $('mkDock'); if (!d) { d = document.createElement('div'); d.id = 'mkDock'; d.className = 'mk-dock'; d.hidden = true; document.body.appendChild(d); } return d; }
  function dropEl() { var d = $('mkDrop'); if (!d) { d = document.createElement('div'); d.id = 'mkDrop'; d.className = 'mk-drop'; d.hidden = true; document.body.appendChild(d); } return d; }
  function dockShould() { var c = $('mkCrit'); if (!c) return false; return c.getBoundingClientRect().top < -40; }   /* once you have scrolled past the top of the criteria */
  function paintDock() {
    var d = dockEl(), dr = dropEl(), cr = (CTX && CTX.a && CTX.a.criteria) || [];
    if (!CTX || !CTX.marking || !cr.length || !$('mkCrit')) { d.hidden = true; dr.hidden = true; tabEl().hidden = true; return; }
    var m = CTX.sub.criteriaMarks[CTX.round] || [], done = cr.filter(function (c, i) { return m[i] === true || m[i] === false; }).length;
    d.innerHTML = '<button type="button" class="dk-up" data-dkup>Front page</button><div class="dk-chips">' + cr.map(function (c, i) {
      var st = m[i] === true ? 'met' : m[i] === false ? 'not' : '', word = st === 'met' ? 'Met' : st === 'not' ? 'Not met' : 'To mark';
      var nt = evidenceFor(i).reduce(function (a, x) { return a + (x.tick ? (x.n || 1) : 1); }, 0);
      return '<button type="button" class="dk-chip ' + st + (DROP === i ? ' open' : '') + '" data-dk="' + i + '" aria-label="Criterion ' + (i + 1) + ': ' + word + (nt ? ', ' + nt + ' marks in the text' : '') + '"><b>' + (i + 1) + '</b><span>' + word + '</span>' + (nt ? '<em>' + nt + '</em>' : '') + '</button>';
    }).join('') + '</div><span class="dk-prog">' + done + ' of ' + cr.length + ' marked</span>';
    tabEl().innerHTML = 'Criteria \u00b7 ' + done + ' of ' + cr.length;
    placeDock();
  }
  function placeDock() {
    var d = $('mkDock'); if (!d || !CTX || !CTX.marking) return;
    var show = dockShould(), tab = tabEl();
    d.hidden = !show; tab.hidden = true;
    if (d.hidden) { var dr = $('mkDrop'); if (dr) dr.hidden = true; return; }
    paintDrop();
  }
  function paintDrop() {
    var dr = dropEl(), d = $('mkDock'), i = DROP;
    if (i == null || !d || d.hidden || !CTX || !CTX.marking) { dr.hidden = true; return; }
    var c = CTX.a.criteria[i]; if (!c) { dr.hidden = true; return; }
    var mk = (CTX.sub.criteriaMarks[CTX.round] || [])[i], note = ((CTX.sub.criteriaComments || {})[CTX.round] || [])[i] || '', ev = evidenceFor(i);
    var q = function (t) { return esc(t.length > 60 ? t.slice(0, 58) + '…' : t); };
    dr.innerHTML = '<div class="dr-h"><b>Criterion ' + (i + 1) + '</b><button type="button" data-drclose>Close</button></div><p class="dr-t">' + esc(c.text || c) + '</p>' +
      '<div class="dr-btns"><button type="button" class="dr-met' + (mk === true ? ' on' : '') + '" data-drmark="1">Met</button><button type="button" class="dr-not' + (mk === false ? ' on' : '') + '" data-drmark="0">Not met</button></div>' +
      (note ? '' : '<button type="button" class="mk-addnote" data-drnote>Add a note</button>') +
      '<textarea class="dr-note" data-drnotebox rows="2" placeholder="Why, in a sentence or two. The trainee reads this."' + (note ? '' : ' hidden') + '>' + esc(note) + '</textarea>' +
      (ev.length ? '<div class="dr-ev"><span>Under this criterion</span>' + ev.map(function (x) { return '<button type="button" data-goto="' + x.id + '">' + (x.tick ? hubTickSVG() + ' ' : '') + '“' + q(x.quote) + '”' + (x.tick ? ((x.n || 1) > 1 ? ' ×' + x.n : '') : ': ' + esc(x.text)) + '</button>'; }).join('') + '</div>' : '<p class="dr-none">Nothing tied to this yet. Select words in the work and tie them to it.</p>');
    dr.hidden = false;
    var chip = d.querySelector('[data-dk="' + i + '"]'), cr = chip ? chip.getBoundingClientRect() : { left: 12 }, db = d.getBoundingClientRect();
    /* the bar is at the top on every screen now, so the panel opens under it */
    dr.style.top = db.bottom + 'px'; dr.style.bottom = 'auto';
    dr.style.left = (innerWidth >= 1080 ? Math.max(12, Math.min(cr.left, innerWidth - dr.offsetWidth - 12)) : 8) + 'px';
  }
  var RAF = 0;
  function onScroll() { if (RAF) return; RAF = requestAnimationFrame(function () { RAF = 0; placeDock(); }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    if (t.closest('[data-dktab]')) { DOCK_OPEN = true; placeDock(); return; }
    if (t.closest('[data-dkhide]')) { DOCK_OPEN = false; DROP = null; paintDock(); return; }
    if (t.closest('[data-dkup]')) { var c = $('mkCrit'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    var dk = t.closest('[data-dk]'); if (dk) { var i = +dk.getAttribute('data-dk'); DROP = DROP === i ? null : i; paintDock(); return; }
    if (t.closest('[data-drclose]')) { DROP = null; paintDock(); return; }
    var dm = t.closest('[data-drmark]');
    if (dm && DROP != null) { var v = dm.getAttribute('data-drmark') === '1', cur = (CTX.sub.criteriaMarks[CTX.round] || [])[DROP]; CTX.setMark(DROP, cur === v ? null : v); return; }
    var dn = t.closest('[data-drnote]'); if (dn) { var ta = document.querySelector('[data-drnotebox]'); dn.hidden = true; ta.hidden = false; ta.focus(); return; }
    if (DROP != null && !t.closest('#mkDock, #mkDrop, #mkTip, .dictbar')) { DROP = null; paintDrop(); var chips = document.querySelectorAll('.dk-chip.open'); [].forEach.call(chips, function (x) { x.classList.remove('open'); }); }
  });
  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('[data-drnotebox]'); if (!ta || DROP == null) return;
    CTX.setNote(DROP, ta.value);
    var cov = document.querySelector('[data-crit-comment="' + DROP + '"]'), add = document.querySelector('[data-addnote="' + DROP + '"]');
    if (cov) { cov.value = ta.value; if (ta.value.trim()) { cov.hidden = false; if (add) add.hidden = true; } }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && DROP != null) { DROP = null; paintDock(); } });

  /* ---- the help, in collapsibles ("it just needs to disappear eventually") */
  /* How Lite marks (Ramy, 18 Oct 2026: "a small section in how to mark this
     assignment... the clicks... the mechanics of the marking online"). */
  var HOWTO = ['Marking in Lite',
    '- Click a word in the work to select it. Click it again quickly for the line or paragraph, and a third time for the whole section. Click outside to clear it. You can also drag over any stretch.',
    '- A bar appears over the selection. Comment writes a note in the margin. Good adds a tick; press it again for another, and the minus takes one away.',
    '- Tie to criterion links the selection to a criterion. It shows under that criterion on the front page, and in the trainee\u2019s feedback.',
    '- In a comment, choose Good, To work on, or neither. Ctrl or \u2318 and Enter saves it.',
    '- Click marked words to find their comment in the margin. Each comment has Edit and Delete.',
    '- Text A, B or C in the writing, and Text chosen, open the texts. Read the texts opens all of them.',
    '- On the front page, M marks a criterion met and N not met, and J and K move between criteria.',
    '- The Criteria tab, bottom right, keeps the criteria with you as you read.'].join('\n');
  /* THE OPEN BOX READS ACROSS (Ramy, 19 Oct 2026: "instead of the box opening
     vertically, it could just open horizontally... it covers the whole... easier
     to read"). On a laptop the row of boxes stays put and the open one's text
     moves into one panel under the row, the full width, in columns. One box at
     a time. On a phone the boxes are already full width and open in place. */
  var WIDE = window.matchMedia ? window.matchMedia('(min-width: 900px)') : { matches: true };
  function syncPanel() {
    var panel = $('mkHelpPanel'); if (!panel) return;
    var boxes = [].slice.call(document.querySelectorAll('#mkHelp .mk-help-grid > details'));
    var open = WIDE.matches ? boxes.filter(function (d) { return d.open; }) : [];
    var owner = open[open.length - 1] || null;
    boxes.forEach(function (d) {
      var gb = d.querySelector(':scope > .gb') || (panel.firstChild && panel.firstChild.__home === d ? panel.firstChild : null);
      if (d !== owner && gb && gb.parentNode === panel) d.appendChild(gb);
      if (d !== owner && WIDE.matches && d.open) d.open = false;
    });
    if (owner) { var g = owner.querySelector(':scope > .gb'); if (g) { g.__home = owner; panel.innerHTML = ''; panel.appendChild(g); } panel.className = 'mk-help-panel ' + owner.className.replace(/\bguide-box\b/, ''); panel.hidden = false; }
    else { panel.hidden = true; }
  }
  document.addEventListener('toggle', function (e) {
    var d = e.target; if (!d || !d.closest || !d.closest('#mkHelp .mk-help-grid')) return;
    if (d.open && WIDE.matches) [].forEach.call(document.querySelectorAll('#mkHelp .mk-help-grid > details[open]'), function (x) { if (x !== d) x.open = false; });
    if (d.open) { var p = $('mkHelpPanel'); if (p) { var cur = p.firstChild; if (cur && cur.__home && cur.__home !== d) cur.__home.appendChild(cur); } }
    else { var p2 = $('mkHelpPanel'); if (p2 && p2.firstChild && p2.firstChild.__home === d) d.appendChild(p2.firstChild); }
    syncPanel();
  }, true);
  if (WIDE.addEventListener) WIDE.addEventListener('change', syncPanel);
  function helpHidden() { try { return localStorage.getItem('mk:hideHelp') === '1'; } catch (e) { return false; } }
  function paintHelp() {
    var host = $('mkHelp'); if (!host) return;
    var hidden = helpHidden();
    document.body.classList.toggle('mk-nohelp', hidden && !!CTX.marking);
    if (!CTX.marking) { host.innerHTML = ''; return; }
    var g = CTX.guide, parts = [];
    var ch = checksHTML(); if (ch) parts.push(ch);
    var fs = firstSectionBox(); if (fs) parts.push(fs);
    var gen = g ? splitGeneral(g.general).rest : '';
    if (gen) parts.push(gbox('how', 'How to mark this assignment', hubGuidanceHTML(gen), 'mk-hbox'));
    if (g && g.sections) parts.push(gbox('bysec', 'Section by section', hubGuidanceHTML(g.sections), 'mk-hbox'));
    /* its own box (Ramy, 19 Oct 2026), so How to mark is only about the assignment */
    parts.push(gbox('lite', 'Marking in Lite', hubGuidanceHTML(HOWTO.split('\n').slice(1).join('\n')), 'mk-hbox'));
    var hasTexts = textsOf().length > 0;
    if (!parts.length && !hasTexts) { host.innerHTML = ''; return; }
    host.innerHTML = '<div class="mk-help-bar"><span>Marking help</span><span class="hb-acts">' + (hasTexts ? '<button type="button" data-readtexts>Read the texts</button>' : '') + (parts.length ? '<button type="button" data-helptoggle>' + (hidden ? 'Show the guidance' : 'Hide the guidance') + '</button>' : '') + '</span></div>' + (hidden || !parts.length ? '' : '<div class="mk-help-grid">' + parts.join('') + '</div><div class="mk-help-panel" id="mkHelpPanel" hidden></div>');
    syncPanel();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-helptoggle]')) { try { localStorage.setItem('mk:hideHelp', helpHidden() ? '' : '1'); } catch (x) {} paintHelp(); hideTip(); }
  });

  /* ---- COMMENTS BROUGHT BACK (Ramy, 19 Oct 2026: a tutor marks in a Google Doc
     or Word, on the side or underneath, or an AI does, and it comes back into
     Lite). Each comment arrives with the words it is about; those words are
     found in the trainee's work (curly quotes, dashes and spacing forgiven,
     capitals ignored) and the comment goes in the margin beside them. A
     comment whose words cannot be found is handed back, never guessed. */
  function normCh(c) { return /[\u2018\u2019\u02bc]/.test(c) ? "'" : /[\u201c\u201d]/.test(c) ? '"' : /[\u2013\u2014]/.test(c) ? '-' : /\s/.test(c) ? ' ' : c.toLowerCase(); }
  function findWords(words) {
    var want = ''; String(words || '').split('').forEach(function (c) { if (/[\u2713\u2714\u221a]/.test(c)) return; var n = normCh(c); if (n === ' ' && (!want || want[want.length - 1] === ' ')) return; want += n; });
    want = want.trim(); if (want.length < 3) return null;
    var round = writeRound(), hit = null;
    [].some.call(document.querySelectorAll('#mkWork .mloc[data-round="' + round + '"]'), function (loc) {
      var box = loc.querySelector('.readonly'); if (!box) return false;
      var all = hubFlat(box).all, flat = '', map = [];
      for (var i = 0; i < all.length; i++) { var n = normCh(all[i]); if (n === ' ' && (!flat || flat[flat.length - 1] === ' ')) continue; flat += n; map.push(i); }
      var at = flat.indexOf(want); if (at < 0) return false;
      hit = { loc: loc.getAttribute('data-loc'), quote: all.slice(map[at], map[at + want.length - 1] + 1) }; return true;
    });
    return hit;
  }
  function placeComments(items) {
    var l = list(writeRound()), ids = [], placed = 0, unplaced = [];
    (items || []).forEach(function (it) {
      var text = String(it.text || '').trim(); if (!text) return;
      var tkm = text.match(/^((?:[\u2713\u2714\u221a]\s*)+|tick|ticked)\.?$/i), tone = null, tick = !!tkm, tn = tick ? Math.max(1, (tkm[1].match(/[\u2713\u2714\u221a]/g) || []).length) : 0;
      var mt = text.match(/^(good|to work on)\s*[:\-\u2013\u2014]\s*([\s\S]+)$/i); if (mt) { tone = /^good/i.test(mt[1]) ? 'good' : 'fix'; text = mt[2].trim(); }
      /* the whole paragraph when it is short; a long one is found by its first sentence and highlighted whole */
      var hit = findWords(it.anchor);
      if (!hit && it.anchor) { var first = String(it.anchor).split(/(?<=[.!?])\s/)[0]; if (first && first !== it.anchor) hit = findWords(first); }
      if (!hit) { unplaced.push(text); return; }
      var rec = tick
        ? { id: newId('t'), loc: hit.loc, quote: hit.quote, text: '', tick: true, n: tn, crit: null, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() }
        : { id: newId('m'), loc: hit.loc, quote: hit.quote, text: text, crit: null, tone: tone, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() };
      l.push(rec); ids.push(rec.id); placed++;
    });
    if (placed) { CTX.save(); CTX.rerender(); }
    return { placed: placed, unplaced: unplaced, ids: ids };
  }
  function removeIds(ids) {
    var l = list(writeRound()), had = l.length;
    for (var k = l.length - 1; k >= 0; k--) if ((ids || []).indexOf(l[k].id) >= 0) l.splice(k, 1);
    if (l.length !== had) { CTX.save(); CTX.rerender(); }
  }

  window.hubMarking = {
    placeComments: function (items) { return CTX ? placeComments(items) : { placed: 0, unplaced: [], ids: [] }; },
    removeIds: function (ids) { if (CTX) removeIds(ids); },
    afterRender: function (ctx) {
      CTX = ctx;
      paintMargin();
      linkTexts();
      if (window.hubMic) hubMic.bar('#meText, #comment, [data-crit-comment], [data-drnotebox]');
      paintStep2();
      paintHelp();
      paintSectionHelp();
      paintTipIn();
      paintDock();
      if (RESEL) { var id = RESEL; RESEL = null; reselect(id); }
    }
  };

  /* styles, once */
  if (!document.getElementById('hub-marking-css')) {
    var st = document.createElement('style'); st.id = 'hub-marking-css';
    st.textContent = [
      '.mloc{position:relative;}',
      '.mloc .readonly{margin-bottom:10px;}',
      /* the colours of a comment: green is good, terracotta is to work on, a calm blue-grey is neither (Ramy, 18 Oct 2026: the yellow is gone) */
      ':root{--tone-good:oklch(46% 0.1 158); --tone-good-w:oklch(70% 0.1 158 / .22); --tone-fix:oklch(52% 0.13 40); --tone-fix-w:oklch(72% 0.11 40 / .24); --tone-note:oklch(52% 0.045 250); --tone-note-w:oklch(72% 0.035 250 / .2);}',
      'mark.mc{background:var(--tone-note-w); color:inherit; border-bottom:2px solid var(--tone-note); border-radius:2px; cursor:pointer; padding:0 1px;}',
      'mark.mc.mc-good{background:var(--tone-good-w); border-bottom-color:var(--tone-good);} mark.mc.mc-fix{background:var(--tone-fix-w); border-bottom-color:var(--tone-fix);}',
      '.mgut:empty{display:none;}',
      '.mgut{display:flex; flex-direction:column; gap:8px; margin:-2px 0 12px;}',
      '.mcard{background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--tone-note); border-radius:12px; padding:12px 16px 11px; font-size:0.95rem; line-height:1.55; box-shadow:0 2px 8px oklch(30% 0.03 70 / .06);}',
      '.mcard p{margin:4px 0 6px;} .mcard.tone-good{border-left-color:var(--tone-good);} .mcard.tone-fix{border-left-color:var(--tone-fix);}',
      '.me-tied{margin:10px 0 0; font-size:0.8rem; font-weight:700; color:var(--teal);}',
      '.me-chips{display:flex; align-items:center; gap:8px; margin:10px 0 0; font-size:0.8rem; font-weight:700;} .me-chips .sb-c{min-width:34px; padding:6px 0; border-radius:14px; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); font:700 0.8rem Karla,sans-serif; cursor:pointer; text-align:center;} .me-chips .sb-c.on{background:var(--teal); border-color:var(--teal); color:var(--paper);} .me-chips .sb-c:not(.on):hover{background:var(--paper) !important; border-color:var(--teal) !important; box-shadow:none !important;} .me-chips .sb-c.on:hover{background:var(--teal) !important; box-shadow:none !important;}',
      '.me-tone{display:flex; align-items:center; gap:8px; margin:10px 0 0; font-size:0.8rem; font-weight:700;} .me-tone span{margin-right:2px;}',
      '.me-tone button{font:700 0.8rem Karla,sans-serif; border-radius:14px; padding:6px 14px; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); cursor:pointer; min-height:34px;}',
      '.me-tone .tn-good.on{background:var(--tone-good-w); border-color:var(--tone-good); color:var(--tone-good);} .me-tone .tn-fix.on{background:var(--tone-fix-w); border-color:var(--tone-fix); color:var(--tone-fix);}',
      '.me-tone button:not(.on):hover{background:var(--paper) !important; border-color:var(--teal) !important; box-shadow:none !important;} .me-tone button.on:hover{box-shadow:none !important;}',
      '.mc-crit{display:inline-block; font-size:0.7rem; font-weight:700; color:var(--teal); text-transform:uppercase; letter-spacing:.06em;}',
      '.mc-by{font-size:0.8rem; color:var(--grey);}',
      '.mc-acts{float:right;} .mc-acts button{background:none; border:none; padding:0 0 0 10px; font:600 0.76rem Karla,sans-serif; color:var(--teal); cursor:pointer; text-decoration:underline; text-decoration-color:var(--sand-line);}',
      '.mc-acts button:hover{background:none !important; box-shadow:none !important;}',
      /* Which comment is it? The card gives a little shake: no colour, no gold frame (Ramy, 18 Oct 2026). The words, when you jump to them, get a faint ink outline that fades. */
      '.mcard.mc-hit{animation:mcShake .5s ease-in-out 1;} @keyframes mcShake{0%,100%{transform:translateX(0);}18%{transform:translateX(-5px);}36%{transform:translateX(5px);}54%{transform:translateX(-3px);}72%{transform:translateX(3px);}}',
      'mark.mc.mc-hit{animation:mcWords .9s ease-out 1;} @keyframes mcWords{0%{outline:2px solid oklch(40% 0.02 60 / .55); outline-offset:2px;}100%{outline:2px solid transparent; outline-offset:2px;}}',
      '@media (prefers-reduced-motion: reduce){ .mcard.mc-hit, mark.mc.mc-hit{animation:none;} }',
      '.mk-pair .mloc.has-mc{display:block !important;}',
      '@media (min-width:1080px){ .mloc.has-mc{display:grid; grid-template-columns:minmax(0,1fr) minmax(320px,30%); gap:12px; align-items:start;} .mloc.has-mc .mgut{margin:0;} .mloc.has-mc .readonly{margin-bottom:0;} }',
      '.mk-selbar{position:fixed; z-index:60; display:flex; flex-wrap:wrap; gap:6px; max-width:min(560px, calc(100vw - 24px)); padding:7px; background:var(--ink); border-radius:12px; box-shadow:0 10px 30px oklch(20% 0.02 60 / .3);}',
      '.mk-selbar button{font:600 0.78rem Karla,sans-serif; color:var(--paper); background:oklch(32% 0.02 65); border:none; border-radius:8px; padding:7px 10px; cursor:pointer; text-align:left;}',
      '.mk-selbar button.sb-main{background:var(--gold); color:var(--ink); font-weight:700;}',
      '.mk-selbar .sb-lab{flex-basis:100%; font:600 0.72rem Karla,sans-serif; color:oklch(80% 0.02 70); padding:2px 2px 0;}',
      '.mk-selbar button.sb-good{background:oklch(38% 0.06 160); color:var(--paper);}',
      'mark.mc-tick{background:color-mix(in oklab, oklch(70% 0.1 158) 22%, transparent); border-bottom:2px solid oklch(46% 0.1 158);} .tickmark{white-space:nowrap;}',
      '.mk-selbar .hub-tick{width:1.05em; height:1.05em; margin:0 3px 0 0; filter:none;}',
      '.mkp-mc q.tk{background:color-mix(in oklab, var(--mark-met-line) 30%, transparent);}',
      '.mk-selbar button:hover{box-shadow:none !important; outline:1.5px solid oklch(82% 0.02 70); outline-offset:-1.5px;}',
      '.mk-editor{position:fixed; z-index:61; left:50%; top:50%; transform:translate(-50%,-50%); width:min(460px, calc(100vw - 32px)); background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-card); padding:16px; box-shadow:0 18px 50px oklch(20% 0.02 60 / .28);}',
      '.me-q{font-size:0.84rem; color:var(--grey); font-style:italic; margin:0 0 10px; line-height:1.45;}',
      '.mk-editor textarea{width:100%; box-sizing:border-box; font:inherit; font-size:0.9rem; padding:9px 11px; border:1.5px solid var(--row-line); border-radius:6px; resize:vertical;}',
      '.me-c{display:block; margin:10px 0 0; font-size:0.8rem; font-weight:700;} .me-c select{display:block; width:100%; margin-top:5px; font:inherit; font-weight:400; padding:7px; border:1.5px solid var(--row-line); border-radius:6px; background:var(--field);}',
      '.me-acts{display:flex; justify-content:flex-end; gap:10px; margin-top:14px;}',
      '.me-acts button{font:700 0.86rem Karla,sans-serif; border-radius:var(--r-control); padding:9px 16px; cursor:pointer; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink);}',
      '.me-acts .me-save{background:var(--teal); border-color:var(--teal); color:var(--paper);}',
      '.mk-float{position:relative; margin:0 0 12px; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--as, var(--teal)); border-radius:var(--r-strip); box-shadow:0 6px 18px oklch(30% 0.02 70 / .08); max-height:42vh; overflow:auto; font-size:0.82rem; line-height:1.5;}',
      '.mkf-top{display:flex; justify-content:space-between; align-items:center; gap:10px; padding:8px 12px; font-weight:700; color:var(--as, var(--teal)); border-bottom:1px solid var(--sand-line); position:sticky; top:0; background:var(--sand);}',
      '.mkf-x{background:none; border:none; font:600 0.76rem Karla,sans-serif; color:var(--grey); cursor:pointer; text-decoration:underline;} .mkf-x:hover{background:none !important; box-shadow:none !important;}',
      '.mkf-body{padding:4px 12px 10px;} .mkf-body p{margin:5px 0;} .mkf-body h4{margin:8px 0 2px; font-size:0.82rem;}',
      '@media (max-width:1079px){ .mk-float{display:none;} }',
      '.mk-tip{position:fixed; z-index:59; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--teal); border-radius:var(--r-strip); padding:9px 13px 10px; font-size:0.82rem; line-height:1.5; box-shadow:0 12px 34px oklch(25% 0.02 60 / .18); max-height:60vh; overflow:auto;}',
      '.mkt-h{font-weight:700; color:var(--teal); margin:0 0 4px;} .mk-tip p{margin:4px 0;}',
      '.mk-tipin{margin:8px 0 6px; padding:8px 12px 9px; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--as, var(--teal)); border-radius:var(--r-strip); font-size:0.82rem; line-height:1.5;}',
      '.mk-tipin .mkt-h{display:flex; justify-content:space-between; align-items:center; gap:10px; font-weight:700; color:var(--as, var(--teal)); margin:0 0 4px;} .mk-tipin .mkt-h button{font:600 0.76rem Karla,sans-serif; background:none; border:none; color:var(--grey); text-decoration:underline; cursor:pointer;} .mk-tipin .mkt-h button:hover{background:none !important; box-shadow:none !important;}',
      '.mk-tipin p{margin:4px 0;} .mk-tipin ul{margin:3px 0 5px; padding-left:18px;} .mk-tipin li{margin:2px 0;}',
      '.mk-tied{margin:8px 0 0; padding:7px 10px; border-radius:var(--r-strip); background:var(--gold-wash); font-size:0.8rem;}',
      '.mk-tied span{display:block; font-weight:700; font-size:0.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--gold-deep); margin:0 0 3px;}',
      '.mk-tied button{display:block; text-align:left; background:none; border:none; padding:3px 0; font:inherit; color:var(--ink); cursor:pointer;} .mk-tied button:hover{background:none !important; box-shadow:none !important; text-decoration:underline;}',
      '.mcard.by-second{border-color:color-mix(in oklab, var(--teal) 40%, var(--sand-line)); border-left-color:var(--teal);}',
      '.mk-checks{margin:0 0 12px;} .mkc{list-style:none; margin:4px 0 0; padding:0;} .mkc li{display:flex; gap:10px; align-items:flex-start; padding:6px 0; border-top:1px solid var(--row-line); font-size:0.82rem; line-height:1.45;} .mkc li:first-child{border-top:none;}',
      '.mkc b{flex:none; width:40px; font-size:0.7rem; text-transform:uppercase; letter-spacing:.06em; padding-top:1px;} .mkc .ok b{color:var(--mark-met-text);} .mkc .look b{color:var(--gold-deep);} .mkc .info b{color:var(--grey);}',
      '.mkc small{display:block; color:var(--grey); font-size:0.78rem;} .mkc-foot{font-size:0.76rem; color:var(--grey); margin:6px 0 0;}',
      /* teal, not yellow: it says where the work stands, it is not guidance to read */
      '.mk-checks{background:color-mix(in oklab, var(--teal) 6%, var(--paper)) !important; border-color:color-mix(in oklab, var(--teal) 32%, transparent) !important; border-top:3px solid var(--teal) !important;}',
      '.mk-checks[open] > summary{border-bottom-color:color-mix(in oklab, var(--teal) 22%, transparent) !important;}',
      '.mk-checks.watch{border-top-color:var(--amber, oklch(70% 0.14 70)) !important; background:color-mix(in oklab, var(--amber, oklch(70% 0.14 70)) 7%, var(--paper)) !important; border-color:color-mix(in oklab, var(--amber, oklch(70% 0.14 70)) 35%, transparent) !important;}',
      '.mk-checks > summary{display:flex !important; align-items:center; gap:9px; flex-wrap:wrap;} .mkc-light{width:11px; height:11px; border-radius:50%; flex:none; background:var(--teal); box-shadow:0 0 0 3px color-mix(in oklab, var(--teal) 18%, transparent);}',
      '.mk-checks.watch .mkc-light{background:var(--amber, oklch(70% 0.14 70)); box-shadow:0 0 0 3px color-mix(in oklab, var(--amber, oklch(70% 0.14 70)) 22%, transparent);} .mk-checks.watch > summary{color:var(--ink);}',
      '.mkc-sub{font-size:0.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--grey);}',
      '.mkc-note{margin:0 0 6px; font-size:0.78rem; color:var(--grey);}',
      '.mkc-lead{margin:4px 0 4px; font-weight:700; font-size:0.86rem; color:var(--ink);} .mkc-h{margin:10px 0 2px; font:700 0.7rem Karla,sans-serif; letter-spacing:.08em; text-transform:uppercase; color:var(--teal);}',
      '.mkc-mine{margin:4px 0 0; padding-left:18px; font-size:0.82rem; line-height:1.45;} .mkc-mine li{margin:3px 0;} .mkc-trap{margin:10px 0 0; padding-top:8px; border-top:1px solid var(--row-line); font-size:0.8rem; line-height:1.45;}',
      '.mk-btn{font:700 0.86rem Karla,sans-serif; border-radius:var(--r-control); padding:9px 16px; cursor:pointer; border:1.5px solid var(--teal); background:var(--paper); color:var(--teal);} .mk-btn.quiet{border-color:var(--sand-line); color:var(--ink); margin-top:10px;}',
      '.mk-second.on{border-left-color:var(--teal);} .mk-second .mk-agree{color:var(--mark-met-text); font-weight:600; font-size:0.86rem; margin:0;}',
      '.mk-disagree{margin:8px 0; padding:8px 11px; border-radius:var(--r-strip); background:var(--gold-wash); border:1px solid var(--amber-edge); border-left:4px solid var(--amber-edge); font-size:0.84rem; line-height:1.5;} .mk-disagree span{display:block; margin-top:4px;} .mk-disagree.small{margin:6px 0 0; font-size:0.8rem;}',
      '.sm-row{padding:10px 0; border-top:1px solid var(--row-line);} .sm-c{font-size:0.86rem; line-height:1.45; margin:0 0 6px;}',
      '.sm-first{display:flex; gap:10px; align-items:flex-start; font-size:0.82rem; color:var(--grey); margin:0 0 8px;} .sm-fn{line-height:1.45;}',
      '.sm-acts{display:flex; gap:8px; flex-wrap:wrap; align-items:center;} .sm-b{font:700 0.8rem Karla,sans-serif; border-radius:14px; padding:6px 14px; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); cursor:pointer; min-height:34px;}',
      '.sm-b.on{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);} .sm-b.no.on{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}',
      '.sm-note{width:100%; box-sizing:border-box; margin-top:8px; font:inherit; font-size:0.86rem; padding:8px 10px; border:1.5px solid var(--row-line); border-radius:6px;}',
      '.mk-dim{opacity:.55;} .mk-dim:hover{opacity:1;}',
      '.critrow.mk-cur{box-shadow:inset 3px 0 0 var(--as, var(--teal)); padding-left:10px !important; border-radius:4px;}',
      '.mk-keys{font-size:0.76rem; color:var(--grey); margin:-6px 0 12px;}',
      '.mk-prev-wrap{position:fixed; inset:0; z-index:70; background:oklch(20% 0.02 60 / .38); display:flex; align-items:flex-start; justify-content:center; padding:5vh 16px; overflow:auto;}',
      '.mk-prev{width:min(640px, 100%); background:var(--paper); border-radius:var(--r-card); box-shadow:0 24px 70px oklch(20% 0.02 60 / .35); overflow:hidden;}',
      '.mkp-top{display:flex; justify-content:space-between; align-items:center; gap:12px; padding:10px 16px; font-size:0.8rem; color:var(--grey); border-bottom:1px solid var(--sand-line);} .mkp-top button{font:700 0.82rem Karla,sans-serif; background:none; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:6px 12px; cursor:pointer;}',
      '.mkp-band{padding:16px 20px; background:color-mix(in oklab, var(--as) 8%, var(--surface)); border-top:4px solid var(--as);} .mkp-band p{margin:0; font-size:0.78rem; text-transform:uppercase; letter-spacing:.08em; color:var(--as); font-weight:700;} .mkp-band h3{margin:4px 0 0; font-family:Newsreader,Georgia,serif; font-size:1.4rem; color:var(--ink);}',
      '.mkp-gen{padding:14px 20px 0; font-size:0.9rem; line-height:1.6;} .mkp-crit,.mkp-mc{list-style:none; margin:0; padding:10px 20px 14px;} .mkp-crit li{display:flex; gap:12px; align-items:flex-start; padding:9px 0; border-top:1px solid var(--row-line); font-size:0.88rem;} .mkp-crit li:first-child{border-top:none;} .mkp-crit p{margin:4px 0 0; color:var(--ink);}',
      '.mk-prev h4{margin:0; padding:4px 20px 0; font-size:0.82rem; text-transform:uppercase; letter-spacing:.07em; color:var(--grey);} .mkp-mc li{padding:8px 0; border-top:1px solid var(--row-line); font-size:0.86rem;} .mkp-mc q{display:block; background:color-mix(in oklab, var(--gold-lifted) 25%, transparent); padding:2px 5px; border-radius:3px;} .mkp-mc p{margin:4px 0 0;}',
      '.mk-selbar{flex-direction:column; gap:6px;} .sb-row{display:flex; gap:6px; align-items:center; flex-wrap:wrap;}',
      '.sb-lab{font:600 0.72rem Karla,sans-serif; color:oklch(80% 0.02 70); margin-right:2px;}',
      '.sb-n{margin-left:6px; font-weight:700; opacity:.9;} .mk-selbar button.sb-minus{background:oklch(32% 0.02 65); padding:7px 11px; font-weight:700;}',
      '.mk-selbar button.sb-c{min-width:34px; text-align:center; padding:6px 0; border:1.5px solid oklch(46% 0.02 65); background:transparent;} .mk-selbar button.sb-c.on{background:var(--gold); border-color:var(--gold); color:var(--ink); font-weight:700;}',
      '.mk-dock{position:fixed; left:0; right:0; top:0; z-index:50; display:flex; align-items:center; gap:12px; padding:8px 28px; background:color-mix(in oklab, var(--paper) 95%, transparent); -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); border-bottom:1px solid var(--sand-line); box-shadow:0 6px 20px oklch(25% 0.02 60 / .10);}',
      '.dk-up{background:none; border:none; font:700 0.8rem Karla,sans-serif; color:var(--as, var(--teal)); cursor:pointer; text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px; white-space:nowrap; padding:4px 0;} .dk-up:hover{background:none !important; box-shadow:none !important;}',
      '.dk-chips{display:flex; gap:6px; flex:1; overflow-x:auto; padding:2px 0; scrollbar-width:none;} .dk-chips::-webkit-scrollbar{display:none;}',
      '.dk-chip{display:flex; align-items:center; gap:7px; font:600 0.78rem Karla,sans-serif; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); border-radius:18px; padding:5px 12px; cursor:pointer; white-space:nowrap; min-height:36px;}',
      '.dk-chip b{font:700 0.82rem Karla,sans-serif;} .dk-chip.met{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);} .dk-chip.not{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}',
      '.dk-chip.open{box-shadow:0 0 0 2px var(--as, var(--teal));} .dk-chip em{font-style:normal; font-size:0.7rem; font-weight:700; background:var(--as, var(--teal)); color:var(--paper); border-radius:9px; padding:1px 6px; min-width:18px; text-align:center;}',
      '.dk-prog{font-size:0.78rem; color:var(--grey); white-space:nowrap;}',
      '.dk-hide{background:none; border:none; font:600 0.8rem Karla,sans-serif; color:var(--grey); text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px; cursor:pointer; padding:4px 0;} .dk-hide:hover{background:none !important; box-shadow:none !important;}',
      /* THE COMMENT BOX, TIDIED (Ramy, 18 Oct 2026: "make the comment box itself a little bigger and tidy up the rest") */
      /* THE COMMENT BOX (Ramy, 18 Oct 2026: "the comment box is now too big... go back to the size we had before, but the part where we write will be bigger... the pills need to be designed better... maybe on one line"). */
      '.mk-editor{width:min(460px, calc(100vw - 24px)); padding:16px 16px 14px; border-radius:14px; border-top:4px solid var(--as, var(--teal)); max-height:calc(100vh - 32px); overflow:auto;}',
      '.me-h{font:700 0.72rem Karla,sans-serif; letter-spacing:.09em; text-transform:uppercase; color:var(--grey); margin:0 0 8px;}',
      '.mk-editor .me-q{margin:0 0 10px; padding:7px 12px; border-left:3px solid var(--tone-note); background:var(--sand); border-radius:0 8px 8px 0; font-size:0.86rem; line-height:1.45; font-style:italic; color:var(--ink-warm); max-height:4.4em; overflow:auto;}',
      '.mk-editor textarea{min-height:200px; font-size:1rem; line-height:1.6; padding:12px 14px; border-radius:10px; border:1.5px solid var(--row-line); background:var(--field);} .mk-editor textarea:focus{outline:none; border-color:var(--as, var(--teal)); box-shadow:0 0 0 3px color-mix(in oklab, var(--as, var(--teal)) 14%, transparent);}',
      '.me-chips{margin:10px 0 0;}',
      '.me-foot{display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:12px;}',
      '.me-foot .me-tone{display:inline-flex; gap:0; margin:0; padding:3px; border-radius:20px; background:var(--sand); border:1px solid var(--sand-line);}',
      '.me-foot .me-tone button{display:inline-flex; align-items:center; gap:7px; min-height:32px; padding:5px 13px; border:1.5px solid transparent; border-radius:17px; background:transparent; color:var(--grey); font:700 0.8rem Karla,sans-serif; cursor:pointer;}',
      '.me-foot .me-tone button i{width:8px; height:8px; border-radius:50%; background:var(--sand-line);} .me-foot .tn-good i{background:color-mix(in oklab, var(--tone-good) 45%, transparent);} .me-foot .tn-fix i{background:color-mix(in oklab, var(--tone-fix) 45%, transparent);}',
      '.me-foot .me-tone .tn-good.on{background:var(--paper); border-color:var(--tone-good); color:var(--tone-good);} .me-foot .me-tone .tn-good.on i{background:var(--tone-good);}',
      '.me-foot .me-tone .tn-fix.on{background:var(--paper); border-color:var(--tone-fix); color:var(--tone-fix);} .me-foot .me-tone .tn-fix.on i{background:var(--tone-fix);}',
      '.me-foot .me-tone button:not(.on):hover{background:transparent !important; border-color:var(--sand-line) !important; box-shadow:none !important;} .me-foot .me-tone button.on:hover{background:var(--paper) !important; box-shadow:none !important;}',
      '.me-foot .me-acts{margin:0 0 0 auto; gap:8px;} .me-foot .me-acts button{padding:8px 16px; min-height:38px;}',
      '@media (max-width:560px){ .mk-editor textarea{min-height:160px;} }',
      /* HOVER ON THESE BUTTONS: ONLY THE BORDER MOVES (Ramy, 18 Oct 2026: "the hover is too much, like a flashlight... only the borders should move and not the whole thing"). The shared button hover washes a fill out; each of these keeps its own fill. */
      '.me-acts .me-save:hover{background:var(--teal) !important; color:var(--paper) !important; border-color:var(--teal-deep) !important; box-shadow:0 0 0 1px var(--teal-deep) !important;}',
      '.me-acts .me-cancel:hover, .dr-h button:hover, .mkp-top button:hover{background:var(--paper) !important; border-color:var(--teal) !important; box-shadow:none !important;}',
      '.mk-btn:hover{background:var(--paper) !important; border-color:var(--teal-deep) !important; box-shadow:none !important;}',
      '.sm-b:not(.on):hover, .dr-btns button:not(.on):hover{background:var(--paper) !important; border-color:var(--teal) !important; box-shadow:none !important;}',
      '.sm-b.on:hover, .dr-btns button.on:hover{box-shadow:none !important; filter:none !important;}',
      '.dk-chip:not(.met):not(.not):hover{background:var(--paper) !important; border-color:var(--as, var(--teal)) !important; box-shadow:none !important;} .dk-chip.met:hover, .dk-chip.not:hover{box-shadow:none !important; border-color:currentColor !important;}',
      '.mk-dock-tab{position:fixed; right:18px; bottom:18px; z-index:60; font:700 0.8rem Karla,sans-serif; color:var(--as, var(--teal)); background:var(--paper); border:1.5px solid var(--as, var(--teal)); border-radius:20px; padding:9px 16px; cursor:pointer; box-shadow:0 8px 24px oklch(25% 0.02 60 / .16);} .mk-dock-tab:hover{background:var(--paper) !important; border-color:var(--teal-deep) !important; box-shadow:0 8px 24px oklch(25% 0.02 60 / .16) !important;}',
      '@media (max-width:1079px){ .mk-dock-tab{right:12px; bottom:calc(14px + env(safe-area-inset-bottom));} }',
      /* the Dictate button sits above the Criteria tab, never on it */
      '@media (max-width:1079px){ .dictbar{bottom:calc(66px + env(safe-area-inset-bottom)) !important;} }',
      '.mk-drop{position:fixed; z-index:51; width:min(440px, calc(100vw - 16px)); background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--as, var(--teal)); border-radius:var(--r-card); padding:12px 14px 14px; box-shadow:0 18px 50px oklch(20% 0.02 60 / .25); max-height:70vh; overflow:auto;}',
      '.dr-h{display:flex; justify-content:space-between; align-items:center;} .dr-h button{font:700 0.78rem Karla,sans-serif; background:none; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:4px 10px; cursor:pointer;}',
      '.dr-t{font-size:0.88rem; line-height:1.5; margin:6px 0 10px;} .dr-btns{display:flex; gap:8px; margin:0 0 4px;}',
      '.dr-btns button{flex:1; font:700 0.88rem Karla,sans-serif; padding:10px; border-radius:var(--r-control); border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); cursor:pointer; min-height:44px;}',
      '.dr-btns .dr-met.on{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);} .dr-btns .dr-not.on{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}',
      '.dr-note{width:100%; box-sizing:border-box; margin-top:8px; font:inherit; font-size:0.86rem; padding:8px 10px; border:1.5px solid var(--row-line); border-radius:6px;}',
      '.dr-ev{margin-top:10px; padding:7px 10px; border-radius:var(--r-strip); background:var(--gold-wash); font-size:0.8rem;} .dr-ev span{display:block; font-weight:700; font-size:0.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--gold-deep); margin:0 0 3px;}',
      '.dr-ev button{display:block; text-align:left; background:none; border:none; padding:3px 0; font:inherit; color:var(--ink); cursor:pointer;} .dr-ev button:hover{background:none !important; box-shadow:none !important; text-decoration:underline;} .dr-none{font-size:0.8rem; color:var(--grey); margin:10px 0 0;}',
      '.mk-help-bar{display:flex; justify-content:space-between; align-items:center; margin:0 0 6px; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--grey);} .mk-help-bar button{background:none; border:none; font:600 0.8rem Karla,sans-serif; letter-spacing:0; text-transform:none; color:var(--teal); text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px; cursor:pointer;} .mk-help-bar button:hover{background:none !important; box-shadow:none !important;}',
      '.mk-help-panel{margin:8px 0 0; border:1px solid var(--sand-line); border-radius:var(--r-strip); background:var(--sand); font-size:0.88rem; line-height:1.6;} .mk-help-panel[hidden]{display:none;}',
      '.mk-help-panel > .gb{padding:12px 20px 14px; column-width:340px; column-gap:36px; column-rule:1px solid color-mix(in oklab, var(--sand-line) 70%, transparent);} .mk-help-panel h4{break-after:avoid;} .mk-help-panel li, .mk-help-panel p{break-inside:avoid;}',
      '.mk-help-panel.mk-checks.go{background:color-mix(in oklab, var(--teal) 6%, var(--paper)); border-color:color-mix(in oklab, var(--teal) 32%, transparent); border-top:3px solid var(--teal);} .mk-help-panel.mk-checks.watch{background:color-mix(in oklab, oklch(70% 0.14 70) 7%, var(--paper)); border-color:color-mix(in oklab, oklch(70% 0.14 70) 35%, transparent); border-top:3px solid oklch(70% 0.14 70);}',
      '.mk-help-panel .mkc-lead, .mk-help-panel .mkc-note{column-span:all;}',
      '.mk-help-panel.mk-hbox{background:var(--gold-wash); border-color:var(--amber-edge);}',
      /* THE BOXES ARE PILLS (Ramy, 19 Oct 2026: "treat those boxes as pills, so they change colour when you click on them"). The open one fills with the assignment's colour; Before you mark fills teal when it is good to go, amber when it says watch out. Hover moves the border only. */
      '@media (min-width:900px){ .mk-help-grid > details{border-radius:999px; overflow:hidden;} .mk-help-grid > details > summary{border-bottom:none !important; min-height:44px; display:flex !important; align-items:center;} }',
      '.mk-help-grid > details:not([open]):hover{border-color:var(--as, var(--teal)) !important;}',
      '.mk-help-grid > details[open]{background:var(--as, var(--teal)) !important; border-color:var(--as, var(--teal)) !important;} .mk-help-grid > details[open] > summary{color:var(--paper) !important;} .mk-help-grid > details[open] > summary::after{border-color:var(--paper) !important;}',
      '.mk-help-grid > details.mk-checks.go[open]{background:var(--teal) !important; border-color:var(--teal) !important;}',
      '.mk-help-grid > details.mk-checks.watch[open]{background:oklch(70% 0.14 70) !important; border-color:oklch(70% 0.14 70) !important;} .mk-help-grid > details.mk-checks.watch[open] > summary{color:var(--ink-warm) !important;} .mk-help-grid > details.mk-checks.watch[open] > summary::after{border-color:var(--ink-warm) !important;}',
      '.mk-help-grid > details[open] .mkc-light{background:var(--paper) !important; box-shadow:none !important;} .mk-help-grid > details[open] .mkc-sub{color:inherit; opacity:.8;}',
      '@media (max-width:899px){ .mk-help-grid > details[open] > .gb{background:var(--paper); color:var(--ink);} .mk-help-grid > details.mk-checks[open] > .gb{background:var(--paper);} }',
      '.mk-help-grid{display:flex; flex-wrap:wrap; gap:8px; align-items:flex-start;} .mk-help-grid .guide-box{flex:1 1 220px; margin:0;}',
      '.mk-help-grid .guide-box, .mk-sbox{background:var(--gold-wash); border-color:var(--amber-edge);} .mk-help-grid .guide-box[open] > summary, .mk-sbox[open] > summary{border-bottom-color:var(--amber-edge);}',
      '.mk-nohelp .mk-tiplink{display:none;}',
      '.mk-tied svg.hub-tick, .dr-ev svg.hub-tick{width:1em; height:1em; vertical-align:-0.18em; margin:0 2px 0 0; filter:none;}',
      '@media (max-width:1079px){ .mk-dock{top:0; bottom:auto; padding:6px 10px; gap:8px;} .mk-dock .dk-prog{display:none;} .mk-dock .dk-up{font-size:0.74rem;} }',
      '.hb-acts{display:flex; gap:18px;}',
      'body .hub-brand-foot{margin-bottom:96px;}',
      '.mk-sbox{margin:2px 0 10px;} .mk-sbox > summary{font-size:0.8rem;}',
      /* While you read B, C, D are pills like While you read A (Ramy, 19 Oct 2026: "so it's consistent"). The pill sits on its own, the width of its words; open, it fills with the assignment's colour and the text opens full width under it. */
      '.mk-sbox{background:none !important; border:none !important;} .mk-sbox > summary{display:inline-flex !important; align-items:center; min-height:44px; padding:8px 40px 8px 16px !important; border:1px solid var(--amber-edge) !important; border-radius:999px; background:var(--gold-wash); font-size:0.86rem !important; max-width:100%; box-sizing:border-box;}',
      '.mk-sbox:not([open]) > summary:hover{border-color:var(--as, var(--teal)) !important;}',
      '.mk-sbox[open] > summary{background:var(--as, var(--teal)); border-color:var(--as, var(--teal)) !important; color:var(--paper) !important;} .mk-sbox[open] > summary::after{border-color:var(--paper) !important;}',
      '.mk-sbox > .gb{margin-top:8px; background:var(--gold-wash); border:1px solid var(--amber-edge); border-radius:var(--r-strip); padding:12px 20px 14px !important; column-width:340px; column-gap:36px; column-rule:1px solid color-mix(in oklab, var(--sand-line) 70%, transparent);} .mk-sbox > .gb li, .mk-sbox > .gb p{break-inside:avoid;} .mk-sbox > .gb h4{break-after:avoid;}',
      '@media print{ .mk-dock-tab,.mk-selbar,.mk-editor,.mk-tip,.mk-dock,.mk-drop,.mk-prev-wrap,.mk-checks,.mk-keys,.mk-help,.mk-help-panel,.mk-sbox,.mk-texts-wrap,.mk-tiplink,.mk-tipin,.mk-addnote{display:none !important;} }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
})();
