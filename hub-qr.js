/* Connect Lite — a QR code of a link, drawn in the house style.
 *
 * Ramy, 15 Oct 2026: the QR "travels with the link cards", all of them. Every
 * card carries the person's own link, so the code on it opens that link: a
 * trainee scans the card on a laptop screen (or a printed one) and lands in
 * their workspace on their phone; a volunteer student scans theirs and has
 * their page; the tutors' and the assessor's cards likewise.
 *
 * hubQr(url, opts) -> an <svg> element. Rounded ink modules, the three finder
 * eyes solid with a gold centre, the Lite mark on a plate in the middle
 * (error correction Q leaves room for it). The encoder is vendor/qrcode.js
 * (Kazuhiko Arase, MIT). Checked 15 Oct 2026 with a reader at phone size:
 * the same drawing, from the Connect repo's scripts/front/qr.py, decodes at
 * 150-200 px; keep the eyes solid -- dotted eyes did not scan.
 */
(function () {
  'use strict';
  function hubQr(url, opts) {
    opts = opts || {};
    var ink = opts.ink || 'var(--ink)', bg = opts.bg || 'var(--paper)', gold = opts.gold || 'var(--gold)';
    // Level Q, not H: a token link is long, and H would add a third more
    // modules; Q still leaves the middle free for the mark.
    var q = qrcode(0, 'Q'); q.addData(url); q.make();
    var n = q.getModuleCount(), quiet = 3, size = n + quiet * 2;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'QR code for your link');
    var el = function (tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; };
    svg.appendChild(el('rect', { x: 0, y: 0, width: size, height: size, rx: 1.5, fill: bg }));
    var isEye = function (r, c) { return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7); };
    // the eyes: solid, continuous, so a reader locks on
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (p) {
      var y = p[0] + quiet, x = p[1] + quiet;
      svg.appendChild(el('rect', { x: x, y: y, width: 7, height: 7, rx: 1.4, fill: ink }));
      svg.appendChild(el('rect', { x: x + 1, y: y + 1, width: 5, height: 5, rx: 1, fill: bg }));
      svg.appendChild(el('rect', { x: x + 2, y: y + 2, width: 3, height: 3, rx: 0.7, fill: gold }));
    });
    var d = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (isEye(r, c) || !q.isDark(r, c)) continue;
      var x = c + quiet + 0.04, y = r + quiet + 0.04, s = 0.92, k = 0.22;
      d += 'M' + (x + k) + ' ' + y + 'h' + (s - 2 * k) + 'a' + k + ' ' + k + ' 0 0 1 ' + k + ' ' + k + 'v' + (s - 2 * k) + 'a' + k + ' ' + k + ' 0 0 1 -' + k + ' ' + k + 'h-' + (s - 2 * k) + 'a' + k + ' ' + k + ' 0 0 1 -' + k + ' -' + k + 'v-' + (s - 2 * k) + 'a' + k + ' ' + k + ' 0 0 1 ' + k + ' -' + k + 'z';
    }
    svg.appendChild(el('path', { d: d, fill: ink }));
    // the mark on a plate in the middle: the two arcs, gold and paper on ink
    var side = Math.round(size * 0.17), plate = side + 2, px = (size - plate) / 2;
    svg.appendChild(el('rect', { x: px, y: px, width: plate, height: plate, rx: plate / 5, fill: bg }));
    var g = el('g', { transform: 'translate(' + (size - side) / 2 + ' ' + (size - side) / 2 + ')' });
    // Lite's mark: the cream tile with gold and ink arcs, as in every other
    // place it appears (21 Oct 2026; it was a dark tile here)
    g.appendChild(el('rect', { x: 0.15, y: 0.15, width: side - 0.3, height: side - 0.3, rx: side / 4.5, fill: '#f8f6f1', stroke: '#d9d2c4', 'stroke-width': 0.3 }));
    var inner = el('svg', { viewBox: '8 30 104 60', x: side * 0.14, y: side * 0.14, width: side * 0.72, height: side * 0.72 });
    inner.appendChild(el('path', { d: 'M56.1 42.2 A 24 24 0 1 0 56.1 77.8', stroke: '#a8803f', 'stroke-width': 13, 'stroke-linecap': 'round', fill: 'none' }));
    inner.appendChild(el('path', { d: 'M96.1 42.2 A 24 24 0 1 0 96.1 77.8', stroke: '#2b2218', 'stroke-width': 13, 'stroke-linecap': 'round', fill: 'none' }));
    g.appendChild(inner);
    svg.appendChild(g);
    return svg;
  }
  window.hubQr = hubQr;
})();
