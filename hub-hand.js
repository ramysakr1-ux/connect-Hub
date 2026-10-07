/* Connect Lite — a signature, written from a name.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 6 Oct 2026: "You cannot have a consistent signature with your finger
 * on a trackpad." He is right, and the arithmetic makes it worse: a candidate
 * signs seven times on a course and a tutor four times per candidate plus one
 * per volunteer certificate — seventy-one signatures on a six-candidate
 * course, no two of them alike. On a Cambridge document that reads as wrong.
 *
 * So a signature is written, not traced, and three rules hold it together:
 *
 *   IT IS NOT TYPED.      The name comes from the roster the centre keeps,
 *                         so a candidate never writes it and cannot vary it.
 *   IT IS DERIVED.        The hand comes from the signer — a candidate's own
 *                         token, a tutor's course key and name — so two people
 *                         called Mehmet Yilmaz sign differently and each signs
 *                         identically every time, on any device, for ever.
 *   IT CANNOT BE CHANGED. Ramy, 6 Oct 2026: "there's no option to change it
 *                         there shouldn't be one." Nothing is stored that
 *                         could be edited; there is no pad and no second
 *                         choice. Re-signing a rewritten document applies the
 *                         same signature again, with a new date.
 *
 *   hubHand.spec(seed)            -> '@face,slant', or '' if nothing is known
 *   hubHand.html(spec, name, cls) -> the signature, for the screen
 *   hubHand.face(spec)            -> the face a spec names, for the PDF
 *   hubHand.written(ink)          -> is this a written signature or drawn ink?
 *
 * A written signature travels in the record's `ink` field, where a drawn path
 * used to go, so the store, hub-sync, the assessor's pack and the booklet all
 * carry it unchanged. A spec begins with '@', which no SVG path does, and
 * signatures drawn before this still render as the paths they are.
 *
 * THE FACES are five open-licensed scripts, subsetted in fonts/ to the
 * characters a name holds. All five write Turkish — ş ğ ı İ ö ü ç — which is
 * why four prettier ones are not here: Mr De Haviland, Mrs Saint Delafield,
 * Herr Von Muellerhoff and Homemade Apple have no ş, ğ or İ at all, and a
 * centre in Istanbul cannot use a signature that drops letters out of a name.
 * See fonts/README.md for the licences.
 */
(function(){
  'use strict';

  var FACES = ['allura', 'caveat', 'parisienne', 'sacramento', 'zeyada'];
  /* THE TUTORS' HAND (8 Oct 2026). Ramy, of the signatures on C/17's final
     reports: "really cool, you can do something like that". They were Great
     Vibes in a dark navy ink, #141e50, matched letter for letter. A tutor's
     seed (staff: 'k:' + course key + name) writes in it; trainees keep the
     five above, dealt from their token, so no signature already on a record
     changes. ALL is every face a spec may name. */
  var STAFF = 'greatvibes', ALL = FACES.concat([STAFF]);
  var INK = { greatvibes: '#141e50' };
  /* Each face sits differently on a line, and a signature has to look like it
     was written on the one the form draws. Measured on screen, not guessed. */
  var FIT = { allura: 1.00, caveat: 0.82, parisienne: 0.94, sacramento: 0.92, zeyada: 0.86, greatvibes: 1.00 };

  function hash32(str){
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  /* Two traits, each off its own hash of the seed. Successive draws from one
     generator stay close together on seeds that differ by a character, which
     gave four near-identical hands the first time (6 Oct 2026). */
  function trait(seed, salt){ return hash32(salt + '\u0001' + seed) / 4294967296; }

  function spec(seed){
    var k = String(seed == null ? '' : seed);
    if (!k) return '';
    if (k.indexOf('k:') === 0) return '@' + STAFF + ',0';
    var face = FACES[Math.floor(trait(k, 'face') * FACES.length) % FACES.length];
    var slant = Math.round(trait(k, 'slant') * 10) - 5;      /* -5 to +4 degrees */
    return '@' + face + ',' + slant;
  }
  function written(ink){ return typeof ink === 'string' && ink.charAt(0) === '@'; }
  function parse(s){
    if (!written(s)) return null;
    var bits = String(s).slice(1).split(','), face = bits[0];
    if (ALL.indexOf(face) === -1) face = FACES[0];
    var slant = parseFloat(bits[1]); if (!isFinite(slant)) slant = 0;
    return { face: face, slant: Math.max(-8, Math.min(8, slant)) };
  }
  function face(s){ var p = parse(s); return p ? p.face : ''; }

  var injected = false;
  function css(){
    if (injected || typeof document === 'undefined') return;
    injected = true;
    var rules = ALL.map(function(f){
      return "@font-face{font-family:'hand-" + f + "';src:url('fonts/" + f + ".ttf') format('truetype');font-display:swap;}";
    }).join('');
    var el = document.createElement('style');
    el.textContent = rules
      + ".hand{display:inline-block; line-height:1; white-space:nowrap; color:var(--ink,#1f1a14);"
      + " font-size:2.6rem; transform-origin:left bottom;}"
      + ".hand.sm{font-size:1.9rem;} .hand.lg{font-size:3.2rem;}";
    document.head.appendChild(el);
  }

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }

  function html(s, name, cls){
    var p = parse(s); if (!p || !String(name || '').trim()) return '';
    css();
    return '<span class="hand' + (cls ? ' ' + cls : '') + '" style="font-family:\'hand-' + p.face + '\',cursive;'
      + 'font-size:calc(2.6rem * ' + FIT[p.face] + ');'
      + (INK[p.face] ? 'color:' + INK[p.face] + ';' : '')
      + (p.slant ? 'transform:skewX(' + (-p.slant) + 'deg);' : '')
      + '" aria-label="Signature">' + esc(name) + '</span>';
  }

  window.hubHand = { spec: spec, html: html, face: face, written: written, parse: parse, css: css, FACES: FACES, ALL: ALL, INK: INK };
  if (typeof module !== 'undefined' && module.exports) module.exports = window.hubHand;
})();
