/* Connect Lite — a signature written from a typed name.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 6 Oct 2026: "It's just it's clumsy. It doesn't look like a signature.
 * You cannot have a consistent signature with your finger on a trackpad."
 * He is right, and the arithmetic makes it worse: a candidate signs seven
 * times on a course and a tutor four times per candidate plus one per
 * volunteer certificate -- seventy-one signatures on a six-candidate course,
 * no two of them alike. On a Cambridge document that reads as wrong.
 *
 * So the name is drawn instead of traced. One cursive alphabet, one stroke
 * per word, and the SAME name always produces the SAME signature -- not
 * remembered, DERIVED, so it is identical on the trainee's phone, the tutor's
 * laptop and the booklet, this week and in March.
 *
 *   hubHand.path(name) -> an SVG path in hub-ink's 300 x 100 box, or ''
 *
 * The output is the same `ink` a drawn signature produces, so nothing
 * downstream changes: hub-ink's svg() shows it, and celta5-pdf's drawInk
 * hands it to pdf-lib's drawSvgPath for Cambridge's booklet.
 *
 * WHAT IT CANNOT DO. It draws Latin letters, the Turkish set among them
 * (ş ğ ı İ ö ü ç), and strips accents off anything else European (é -> e).
 * A name in Arabic, Cyrillic or Chinese returns '' -- and '' is already a
 * valid signature everywhere in Lite: the typed name and the moment are what
 * the record keeps and what proves anything. It must never invent a mark for
 * a name it cannot write.
 *
 * THE GLYPHS. Designed on a baseline at y=0 with y UP, x-height 10, cap 18,
 * ascender 19, descender -7, joined at y=2. Each glyph starts at (0, i) and
 * ends at (a, o); the engine draws a connector between one letter's exit and
 * the next one's entry, which is what makes a word one stroke. 'm' lifts the
 * pen inside a glyph, for a dot, a crossbar or a crossing diagonal.
 */
(function(){
  'use strict';

  var XH = 10, JOIN = 2, JW = 2.4, SLANT = 0.20, PAD = 10;

  /* a: advance, i: entry height, o: exit height, s: segments.
     ['c',x1,y1,x2,y2,x,y] curve · ['l',x,y] line · ['m',x,y] pen up. */
  var G = {
    a: { a: 8,    i: 2, o: 2,  s: [['c',1.6,0.6,4.2,0.4,6.4,1.4],['c',7.4,4,7.2,7.4,6.8,9.4],['c',4.6,10.8,1,10,1,5.4],['c',1,1.2,4,-0.6,6.2,1.6],['c',7.2,1.6,7.6,1.8,8,2]] },
    b: { a: 8,    i: 2, o: 9,  s: [['c',1,8,2.5,15,3.2,19],['c',3.8,13,3.6,6,3.4,1.5],['c',5,0.2,7.8,2,7.3,5],['c',6.9,7.2,5,7.6,4,6.4],['c',5.5,7.6,7,8.4,8,9]] },
    c: { a: 7,    i: 2, o: 5,  s: [['c',1.5,5,3.5,8.5,6.2,9.6],['c',4.5,11,1,10.2,0.9,5.5],['c',0.9,1,4,-0.9,6.2,1.3],['c',6.6,2,6.9,3.5,7,5]] },
    d: { a: 8,    i: 2, o: 2,  s: [['c',1.6,0.6,4.2,0.4,6.3,1.4],['c',7,4,6.9,7,6.6,9.2],['c',4.4,10.8,0.8,10,0.8,5.4],['c',0.8,1.2,4.2,-0.6,6.3,1.5],['c',6.9,6,6.9,13,6.6,19],['c',7.3,13,7.8,5,8,2]] },
    e: { a: 6.5,  i: 2, o: 4,  s: [['c',1.2,4.6,2.8,8.2,4.6,9.4],['c',3,10.6,0.8,9,0.8,4.8],['c',0.9,1.4,2.6,-0.4,4.8,1],['c',5.6,1.6,6.1,2.8,6.5,4]] },
    f: { a: 7,    i: 2, o: 2,  s: [['c',1,8,2.8,15,3.6,19],['c',2.2,20.5,1.2,19,2.4,16],['c',3.1,10,3.4,4,3,-3],['c',2.6,-6.5,0.4,-6,0.8,-3.2],['c',1.2,-1,4,1.4,7,2]] },
    g: { a: 8,    i: 2, o: 2,  s: [['c',1.6,0.6,4.2,0.4,6.4,1.4],['c',7.1,4,7,7,6.7,9.3],['c',4.5,10.8,0.8,10,0.8,5.4],['c',0.8,1.2,4.2,-0.6,6.4,1.5],['c',6.3,-1,6,-2.6,5.4,-4.5],['c',4.8,-7.5,1.4,-7,1.8,-4.2],['c',2.2,-1.8,5.5,1,8,2]] },
    h: { a: 8,    i: 2, o: 2,  s: [['c',1,8,2.6,15,3.2,19],['c',3.7,13,3.5,6,3.3,1.2],['c',3.6,7,5.2,10.6,6.6,9.4],['c',7.3,8.4,7,4.5,6.9,1.4],['c',7.2,1.6,7.7,1.9,8,2]] },
    i: { a: 5,    i: 2, o: 2,  s: [['c',1.2,5,2.6,8.8,3.4,10],['c',3.9,7.5,4.4,4,5,2],['m',3.3,13.6],['c',3.8,13.7,4.2,14,4.6,14.2]] },
    j: { a: 5.5,  i: 2, o: 2,  s: [['c',1.2,5,2.6,8.8,3.4,10],['c',3.4,5,3.2,-1,2.6,-4.3],['c',2,-7.2,-0.6,-6.8,-0.2,-4],['c',0.3,-1.6,3,0.9,5.5,2],['m',3.3,13.6],['c',3.8,13.7,4.2,14,4.6,14.2]] },
    k: { a: 8,    i: 2, o: 2,  s: [['c',1,8,2.6,15,3.2,19],['c',3.7,13,3.5,6,3.3,1.2],['c',4.6,3.2,6.4,6.6,7.2,9.6],['c',6.2,7.6,4.4,6,3.6,5.2],['c',5,4.4,6.4,2.6,6.9,1.2],['c',7.2,1.5,7.7,1.9,8,2]] },
    l: { a: 5.5,  i: 2, o: 2,  s: [['c',1,8,2.6,15,3.2,19],['c',3.8,13,3.6,5,3.6,1.6],['c',4.2,1.8,5,1.9,5.5,2]] },
    m: { a: 11.5, i: 2, o: 2,  s: [['c',0.8,5,1.8,9.6,2.6,9.4],['c',3.4,8.6,3.2,4.5,3.1,1.3],['c',3.5,6.5,5.2,10.4,6.4,9.4],['c',7.1,8.6,6.9,4.5,6.8,1.3],['c',7.2,6.5,8.9,10.4,10.1,9.4],['c',10.8,8.6,10.6,4,10.4,1.4],['c',10.8,1.6,11.2,1.9,11.5,2]] },
    n: { a: 8,    i: 2, o: 2,  s: [['c',0.8,5,1.8,9.6,2.6,9.4],['c',3.4,8.6,3.2,4.5,3.1,1.3],['c',3.5,6.5,5.3,10.4,6.6,9.4],['c',7.3,8.6,7.1,4.2,6.9,1.4],['c',7.2,1.6,7.7,1.9,8,2]] },
    o: { a: 7.5,  i: 2, o: 9,  s: [['c',1.8,0.6,3.8,0.4,5.8,1.2],['c',7,3.6,7,6.4,6.6,8.4],['c',4.6,10.6,0.9,10,1,5.6],['c',1,1.2,3.6,-0.6,6,1.4],['c',7.4,2.6,7.6,6.4,7.5,9]] },
    p: { a: 8,    i: 2, o: 2,  s: [['c',1,5,2.4,9.2,3.1,10],['c',3.3,4,2.9,-2,2.5,-5.4],['c',3,-1.4,3.4,3.5,3.5,7.4],['c',5,9.6,8,8,7.4,5],['c',6.9,2.2,4.6,1,3.4,2.2],['c',5,1.8,6.8,1.9,8,2]] },
    q: { a: 9,    i: 2, o: 2,  s: [['c',1.6,0.6,4.2,0.4,6.4,1.4],['c',7.1,4,7,7,6.7,9.3],['c',4.5,10.8,0.8,10,0.8,5.4],['c',0.8,1.2,4.2,-0.6,6.4,1.5],['c',6.3,-1,6.1,-3,5.9,-5.2],['c',6.4,-6.6,7.4,-5.4,8,-4.2],['c',8.6,-2.5,9,0,9,2]] },
    r: { a: 7,    i: 2, o: 2,  s: [['c',1,5.2,2.2,9,3,10],['c',3.8,10.6,4.6,9.6,5.2,9.2],['c',5.6,6.4,5.5,4,5.4,2],['c',6,1.9,6.6,1.9,7,2]] },
    s: { a: 6.5,  i: 2, o: 4,  s: [['c',1,4.8,2.4,8.4,3.6,9.8],['c',3.2,10.8,1.2,9.4,1.4,6.4],['c',1.6,3.4,2.6,0.4,4.2,1.2],['c',5.4,1.8,6,3,6.5,4]] },
    t: { a: 6.5,  i: 2, o: 2,  s: [['c',1.2,8,2.6,13.5,3.2,16],['c',3.8,11,3.6,5,3.5,1.4],['c',4.2,1.6,5.6,1.9,6.5,2],['m',1.5,12.2],['l',5.2,12.8]] },
    u: { a: 8,    i: 2, o: 2,  s: [['c',1,5,2.2,9.2,3,10],['c',3.2,6,3,2,3.4,1.2],['c',4.2,0,6,2.2,6.4,10],['c',6.9,6.5,7.2,3.5,7.4,1.4],['c',7.6,1.6,7.9,1.9,8,2]] },
    v: { a: 7,    i: 2, o: 9,  s: [['c',1,5,2.2,9.2,3,10],['c',3.4,6,3.2,1.8,3.8,1.2],['c',4.8,0.6,5.8,5,6.2,9.6],['c',6.6,9.9,6.9,9.4,7,9]] },
    w: { a: 10,   i: 2, o: 9,  s: [['c',1,5,2.2,9.2,3,10],['c',3.4,6,3.2,1.8,3.8,1.2],['c',4.6,1,5.2,5.6,5.6,9.6],['c',6,6,5.8,1.8,6.4,1.2],['c',7.4,0.8,8.8,5,9.2,9.6],['c',9.6,9.9,9.9,9.4,10,9]] },
    x: { a: 7,    i: 2, o: 2,  s: [['c',1.4,4.6,4.4,8,6,9.8],['m',0.8,9.8],['c',2.2,7,4.8,3.4,6.2,1.4],['c',6.5,1.6,6.8,1.9,7,2]] },
    y: { a: 8,    i: 2, o: 2,  s: [['c',1,5,2.2,9.2,3,10],['c',3.4,6,3.2,1.8,3.8,1.2],['c',4.8,0.8,6,4.6,6.4,10],['c',6.2,4,5.8,-2,5.2,-5.2],['c',4.6,-7.6,1.4,-7,1.8,-4.2],['c',2.2,-1.8,5.4,1,8,2]] },
    z: { a: 7.5,  i: 2, o: 2,  s: [['c',1.2,5.4,2.2,9.4,2.8,10.2],['c',3.8,10.6,4.6,9.4,5.6,9.8],['c',4.6,7,3,4,2,1.8],['c',3.4,1.4,5,0.6,5.6,-2.4],['c',5.8,-5.4,3.4,-6,3.2,-3.6],['c',3.6,-1,6,1.2,7.5,2]] },

    /* Italic capitals, print-shaped: that is how capitals sit in most people's
       signatures, and it keeps a name legible where a flourish would not.
       `st` is where the pen comes down. A capital is NOT joined to the letter
       before it -- the first pass at this drew every capital up from the
       baseline first, and the lead-in stroke turned Y into N and doubled the
       stem on J, L, S, T, U, V, W and Z. */
    A: { a: 11,   st:[0,1.4],    o: 2,  s: [['c',1.6,8,3.4,14,5,18],['c',6.6,13,8.4,7,9.4,1.6],['c',9.9,1.7,10.5,1.9,11,2],['m',2.6,8],['l',7.8,8.4]] },
    B: { a: 10,   st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['c',4.2,18.6,8,17,7.2,13.6],['c',6.6,11,3.6,10.2,2,10.4],['c',5.2,10,9,9.4,8.6,5.2],['c',8.2,1.6,4.4,1,2.2,1.6],['c',4.8,1.4,8.2,1.8,10,2]] },
    C: { a: 10,   st:[9.2,15.4], o: 5,  s: [['c',7.6,18.6,1.8,18.2,1.3,10.8],['c',0.8,3.4,5.6,-0.8,8.8,2.6],['c',9.2,3.2,9.7,4.2,10,5]] },
    D: { a: 10,   st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['c',6,18.8,10,15,9.4,9.6],['c',8.8,4.2,5,1,1.8,1.6],['c',4.6,1.4,8,1.8,10,2]] },
    E: { a: 9,    st:[8.4,17.8], o: 2,  s: [['l',2,17.4],['c',1.6,12,1.4,6,1.4,1.8],['l',7.8,2.2],['m',1.7,9.8],['l',6.4,10.1],['m',9,2]] },
    F: { a: 8,    st:[3.4,18],   o: 4,  s: [['c',5.6,18.4,7.4,18.2,8.4,17.6],['m',3.4,18],['c',3.6,13,3.4,6,3.4,1.6],['c',5,2,7,3,8,4],['m',2.6,10.4],['l',6.8,10.8],['m',8,4]] },
    G: { a: 10,   st:[9.2,15.4], o: 2,  s: [['c',7.6,18.6,1.8,18.2,1.3,10.8],['c',0.8,3.4,5.8,-1,9,2.6],['c',9.4,4.6,9.4,7.2,9.2,9.2],['c',8,9.4,6.6,9.4,5.6,9.2],['c',6.8,9.4,8.4,9.2,9.2,9],['c',9.2,6,9.4,3.4,9.6,1.6],['c',9.8,1.7,9.9,1.9,10,2]] },
    H: { a: 10.5, st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['m',1.7,10],['l',8,10.6],['m',7.2,18],['c',7.6,13,7.6,6,7.8,1.4],['c',8.6,1.6,9.8,1.9,10.5,2]] },
    I: { a: 6,    st:[2.6,18],   o: 2,  s: [['c',3,13,2.9,6,2.8,1.4],['c',3.8,1.6,5.2,1.9,6,2]] },
    J: { a: 7.5,  st:[4.4,18],   o: 2,  s: [['c',4.4,12,4.2,4,3.6,-1.6],['c',3,-5.6,0.2,-5.6,0.4,-2.6],['c',0.8,-0.4,4,1.2,7.5,2]] },
    K: { a: 10.5, st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['m',8.8,18],['c',6.8,14.6,4,11.4,2.2,10],['c',4.4,9.4,7.2,5.6,8.6,1.4],['c',9.3,1.6,10,1.9,10.5,2]] },
    L: { a: 9,    st:[3.2,18],   o: 2,  s: [['c',3.2,13,2.8,6,2.4,1.8],['c',4.6,1.4,7.2,1.6,9,2]] },
    M: { a: 13,   st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['c',2.6,13.4,4,8.6,5,4.6],['c',6.4,8.8,8,13.6,9.2,18],['c',9.6,13,9.8,6,10,1.4],['c',11,1.6,12.2,1.9,13,2]] },
    N: { a: 11,   st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['c',3.4,12.4,6,6.4,8,1.8],['c',8.4,6.6,8.8,13,9.2,18],['c',9.4,13,9.4,6,9.4,1.6],['c',10,1.7,10.6,1.9,11,2]] },
    O: { a: 10.5, st:[9,16],     o: 9,  s: [['c',7.6,18.6,1.8,18.2,1.3,10.8],['c',0.8,3.4,5.6,-0.8,8.8,2.6],['c',10.2,5.6,10.2,12,9,16],['c',9.6,14.6,10.2,11.4,10.5,9]] },
    P: { a: 9.5,  st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['c',4.4,18.6,8.6,17.4,8,13.4],['c',7.4,9.6,3.8,8.8,2,9.4],['m',2,9.4],['c',2.2,6,2.2,3.6,2.2,1.4],['c',4.4,1.6,7.8,1.9,9.5,2]] },
    Q: { a: 10.5, st:[9,16],     o: 2,  s: [['c',7.6,18.6,1.8,18.2,1.3,10.8],['c',0.8,3.4,5.6,-0.8,8.8,2.6],['c',10.2,5.6,10.2,12,9,16],['m',6.2,5],['c',7.4,2.6,8.8,0.2,9.6,-1.6],['c',10,0.2,10.4,1.2,10.5,2]] },
    R: { a: 10,   st:[0.6,1.4],  o: 2,  s: [['c',1,8,1.4,14,1.6,18],['c',4.4,18.6,8.6,17.4,8,13.4],['c',7.4,9.6,3.8,8.8,2,9.4],['c',4.2,8.6,6.4,5,7.6,1.4],['c',8.4,1.6,9.4,1.9,10,2]] },
    S: { a: 8.5,  st:[7.6,15.6], o: 4,  s: [['c',5.8,18.4,1.6,18,1.8,14.4],['c',2,10.8,6.2,9.4,6.6,5.8],['c',6.8,2.4,3.4,0.2,1.4,2.2],['c',2.8,3.1,5.8,3.8,8.5,4]] },
    T: { a: 9,    st:[1,17.6],   o: 2,  s: [['l',8.4,18.2],['m',4.2,17.9],['c',4.6,13,4.4,6,4.4,1.4],['c',5.8,1.6,7.9,1.9,9,2]] },
    U: { a: 11,   st:[1.6,18],   o: 2,  s: [['c',1.6,12,1.4,4.4,3.4,2],['c',5.6,-0.6,8,1.6,8.6,7.4],['c',8.8,11,8.8,15,8.8,18],['m',8.8,18],['c',9,13,9.2,6,9.4,1.6],['c',10,1.7,10.6,1.9,11,2]] },
    V: { a: 10,   st:[1.8,18],   o: 9,  s: [['c',3,13,4.6,7.4,5.8,2],['c',7,7,8.4,13.4,9.2,18],['c',9.5,15,9.8,11,10,9]] },
    W: { a: 13.5, st:[1.6,18],   o: 9,  s: [['c',2.6,13,3.6,7.4,4.6,2],['c',5.6,7,6.4,13,7,17.6],['c',7.8,12.6,8.8,7,9.6,2],['c',10.8,7,12.2,13.4,13,18],['c',13.2,15,13.4,11,13.5,9]] },
    X: { a: 10,   st:[0.4,1.6],  o: 2,  s: [['c',2.6,6.4,6.4,13,9.2,17.8],['m',1,17.8],['c',3.2,13,6.4,6.2,8.6,1.6],['c',9.1,1.7,9.6,1.9,10,2]] },
    Y: { a: 10,   st:[1.4,18],   o: 2,  s: [['c',2.6,14,4,11,5.4,8.8],['m',9.6,18],['c',8,13.6,6.2,10,5,6.6],['c',4.6,4.4,4.4,2.8,4.4,1.4],['c',6,1.6,8.4,1.9,10,2]] },
    Z: { a: 9.5,  st:[1.6,17.8], o: 2,  s: [['l',8.6,18.2],['c',6.6,13,4,6.6,2,1.8],['c',4.4,1.4,7.4,1.6,9.5,2]] },

    ' ': { a: 7, i: 2, o: 2, s: [] },
    '-': { a: 6, i: 2, o: 2, s: [['m',0.6,5.4],['l',5.4,5.8],['m',6,2]] },
    "'": { a: 3, i: 2, o: 2, s: [['m',1,18],['c',1.6,16.4,1.8,15,1.8,14],['m',3,2]] },
    '.': { a: 3.5, i: 2, o: 2, s: [['m',1,0.6],['c',1.5,0.7,1.9,1,2.2,1.2],['m',3.5,2]] }
  };

  /* A mark that rides above or below a letter, so Turkish names are written
     rather than approximated. The base letter is drawn, then the mark at the
     base's own advance. ı is i with the dot taken off; İ is I with one put on. */
  var MARKS = {
    /* Two short near-vertical ticks, well apart. Drawn as two flat dashes
       they merged into a macron at signature size -- every Turkish o and u
       came out wrong (6 Oct 2026). */
    diaeresis: function(a){ return [['m', a*0.22, XH+2.8],['l', a*0.27, XH+4.6],['m', a*0.62, XH+2.8],['l', a*0.67, XH+4.6]]; },
    cedilla:   function(a){ return [['m', a*0.46, 0.2],['c', a*0.50, -2.2, a*0.30, -2.6, a*0.24, -4.2]]; },
    breve:     function(a){ return [['m', a*0.22, XH+3.2],['c', a*0.34, XH+1.6, a*0.62, XH+1.6, a*0.74, XH+3.4]]; },
    acute:     function(a){ return [['m', a*0.34, XH+3],['l', a*0.70, XH+5]]; },
    grave:     function(a){ return [['m', a*0.34, XH+5],['l', a*0.70, XH+3]]; },
    circum:    function(a){ return [['m', a*0.26, XH+3.2],['l', a*0.48, XH+5],['l', a*0.72, XH+3.2]]; },
    tilde:     function(a){ return [['m', a*0.22, XH+3.4],['c', a*0.34, XH+5, a*0.50, XH+2, a*0.62, XH+3.4],['c', a*0.68, XH+4.2, a*0.72, XH+4.2, a*0.76, XH+4]]; },
    ring:      function(a){ return [['m', a*0.38, XH+3],['c', a*0.30, XH+3, a*0.30, XH+5.2, a*0.46, XH+5.2],['c', a*0.62, XH+5.2, a*0.62, XH+3, a*0.46, XH+3]]; }
  };
  /* base letter + the mark it takes. Capitals carry their mark higher by the
     cap-to-x-height difference, which addMark handles. */
  var ACCENT = {
    'ç':['c','cedilla'], 'Ç':['C','cedilla'], 'ş':['s','cedilla'], 'Ş':['S','cedilla'],
    'ğ':['g','breve'],   'Ğ':['G','breve'],
    'ı':['i','dotless'], 'İ':['I','dot'],
    'ö':['o','diaeresis'], 'Ö':['O','diaeresis'], 'ü':['u','diaeresis'], 'Ü':['U','diaeresis'],
    'ä':['a','diaeresis'], 'Ä':['A','diaeresis'], 'ë':['e','diaeresis'], 'ï':['i','diaeresis'],
    'á':['a','acute'], 'é':['e','acute'], 'í':['i','acute'], 'ó':['o','acute'], 'ú':['u','acute'], 'ý':['y','acute'],
    'Á':['A','acute'], 'É':['E','acute'], 'Í':['I','acute'], 'Ó':['O','acute'], 'Ú':['U','acute'],
    'à':['a','grave'], 'è':['e','grave'], 'ì':['i','grave'], 'ò':['o','grave'], 'ù':['u','grave'],
    'À':['A','grave'], 'È':['E','grave'],
    'â':['a','circum'], 'ê':['e','circum'], 'î':['i','circum'], 'ô':['o','circum'], 'û':['u','circum'],
    'Â':['A','circum'], 'Ê':['E','circum'], 'Î':['I','circum'], 'Ô':['O','circum'], 'Û':['U','circum'],
    'ñ':['n','tilde'], 'Ñ':['N','tilde'], 'ã':['a','tilde'], 'õ':['o','tilde'],
    'å':['a','ring'], 'Å':['A','ring'],
    'ő':['o','diaeresis'], 'ű':['u','diaeresis'],
    'ß':['s','none'], 'ć':['c','acute'], 'č':['c','circum'], 'š':['s','circum'], 'ž':['z','circum'],
    'ø':['o','none'], 'Ø':['O','none'], 'ł':['l','none'], 'Ł':['L','none'],
    'ę':['e','cedilla'], 'ą':['a','cedilla'], 'ż':['z','none'], 'ń':['n','acute']
  };

  /* Which marks sit under the letter. A capital's mark is lifted to clear a
     cap rather than an x-height -- but lifting a cedilla put it through the
     middle of a capital S, so every Turkish \u015e came out as a plain S. */
  var BELOW = { cedilla: 1 };

  function glyphFor(ch){
    if (G[ch]) return { g: G[ch], mark: null };
    var acc = ACCENT[ch];
    if (acc && G[acc[0]]) return { g: G[acc[0]], mark: acc[1], cap: acc[0] === acc[0].toUpperCase() && acc[0] !== acc[0].toLowerCase() };
    return null;
  }

  /* ------------------------------------------------------------------ *
   * The hand.
   *
   * Ramy, 6 Oct 2026: "Each one obviously a unique signature, even if the
   * names are the same. We have two people have the same first and last
   * name. It should also be different." So the alphabet above is the shapes
   * and this is the handwriting: slant, width, height, the drift off the
   * baseline and the flourish at the end all come from a seed, which is the
   * SIGNER, not their name. Two Mehmet Yilmazes get two hands.
   *
   * The seed is a token, not a secret: it decides what the signature looks
   * like and nothing else, and the signature is public on the record anyway.
   * ------------------------------------------------------------------ */
  function hash32(str){
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  /* Each trait gets its own hash of the seed rather than the next draw from
     one generator: four tokens that differ in the last character gave four
     hands that all joined and three of which had no flourish, because
     successive xorshift draws off a short seed stay close together. */
  function trait(seed, salt, lo, hi){ return lo + (hash32(salt + '\u0001' + seed) / 4294967296) * (hi - lo); }

  function hand(seed){
    var k = String(seed || '');
    return {
      slant:  trait(k, 'slant', -0.06, 0.34),     /* a backhand through to a steep italic */
      wide:   trait(k, 'wide',   0.76, 1.30),     /* cramped through to loose */
      rise:   trait(k, 'rise',   0.82, 1.18),     /* small and neat through to large */
      reach:  trait(k, 'reach',  0.72, 1.38),     /* short ascenders through to long loops */
      caps:   trait(k, 'caps',   0.80, 1.35),     /* modest capitals through to towering ones */
      waver:  trait(k, 'waver',  0,    2.0),      /* a ruled hand through to a rolling one */
      phase:  trait(k, 'phase',  0,    6.283),
      joined: trait(k, 'join',   0,    1),        /* under a third of hands print rather than join */
      flour:  trait(k, 'flour',  0,    1)         /* nothing, a sweep off the end, or an underline */
    };
  }

  /* Letters are designed with y UP; the box hub-ink and pdf-lib both read has
     y DOWN. The flip happens once, at the end, with the italic shear. */
  function path(name, seed){
    var text = String(name == null ? '' : name).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    var H = hand(seed == null || seed === '' ? text : seed);

    /* An ascender is stretched from the x-height up, a descender from the
       baseline down, so a tall hand does not also become a fat one. */
    function ty(y, atX){
      var v = y <= 0 ? y * H.reach : y <= XH ? y : XH + (y - XH) * H.reach;
      return v * H.rise + H.waver * Math.sin(H.phase + atX * 0.07);
    }
    var cmds = [], pen = 0, last = null, drew = 0, JWh = JW * (0.7 + H.wide * 0.5), MY = 1;
    function put(head){
      var c = [head], i;
      for (i = 1; i < arguments.length; i += 2) {
        var x = arguments[i] * H.wide, y = arguments[i + 1];
        c.push(x, ty(y > XH ? XH + (y - XH) * MY : y, x));
      }
      cmds.push(c);
    }

    for (var i = 0; i < text.length; i++) {
      var ch = text[i], found = glyphFor(ch);
      if (!found) { var base = ch.normalize ? ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ch; found = glyphFor(base); }
      if (!found) continue;                       /* undrawable: left out, never invented */
      var g = found.g, enter = g.st ? null : (g.i == null ? JOIN : g.i);
      MY = g.st ? H.caps : 1;                     /* capitals carry the hand's own cap height */

      if (ch === ' ') { last = last && [pen + g.a, g.o]; pen += g.a; continue; }

      if (g.st) put('M', pen + g.st[0], g.st[1]);                       /* a capital comes down where it starts */
      else if (last === null) put('M', pen, enter);
      else if (H.joined < 0.32) put('M', pen, enter);                    /* a printed hand lifts between letters */
      else {
        var dx = pen - last[0];                                          /* the join: what makes a word one stroke */
        put('C', last[0] + dx * 0.4, last[1], pen - dx * 0.4, enter, pen, enter);
      }

      var cx = g.st ? pen + g.st[0] : pen, cy = g.st ? g.st[1] : enter;
      for (var k = 0; k < g.s.length; k++) {
        var seg = g.s[k];
        if (seg[0] === 'm') { put('M', pen + seg[1], seg[2]); cx = pen + seg[1]; cy = seg[2]; }
        else if (seg[0] === 'l') { put('L', pen + seg[1], seg[2]); cx = pen + seg[1]; cy = seg[2]; }
        else { put('C', pen + seg[1], seg[2], pen + seg[3], seg[4], pen + seg[5], seg[6]); cx = pen + seg[5]; cy = seg[6]; }
      }

      if (found.mark && found.mark !== 'none' && found.mark !== 'dotless') {
        var lift = (found.cap && !BELOW[found.mark]) ? 7 : 0, ms = found.mark === 'dot'
          ? [['m', g.a * 0.42, XH + 3.0], ['l', g.a * 0.48, XH + 4.6]]
          : (MARKS[found.mark] || function(){ return []; })(g.a);
        for (var j = 0; j < ms.length; j++) {
          var t = ms[j];
          if (t[0] === 'm') put('M', pen + t[1], t[2] + lift);
          else if (t[0] === 'l') put('L', pen + t[1], t[2] + lift);
          else put('C', pen + t[1], t[2] + lift, pen + t[3], t[4] + lift, pen + t[5], t[6] + lift);
        }
        cx = -1e9;                                 /* the pen is up and far from the exit */
      }
      /* A glyph whose last stroke is a dot or a bar leaves the pen somewhere
         other than its exit, so put it back before the next letter joins. */
      if (Math.abs(cx - (pen + g.a)) > 0.4 || Math.abs(cy - g.o) > 0.4) put('M', pen + g.a, g.o);
      last = [pen + g.a, g.o]; drew++;
      pen += g.a + JWh;
    }
    if (!drew) return '';

    /* How the hand finishes. Some stop dead, some sweep off the end, and
       some run a line back under the whole name. */
    if (last && H.flour > 0.34 && H.flour <= 0.70) {
      var reach = 3 + (H.flour - 0.34) * 18;
      put('C', last[0] + reach * 0.4, last[1] + 1.5, last[0] + reach * 0.7, last[1] - 2.5 - H.flour * 4, last[0] + reach, last[1] - 1 - H.flour * 3);
    } else if (last && H.flour > 0.70) {
      var under = -3.5 - (H.flour - 0.70) * 9;
      put('M', last[0] + 1.5, last[1] - 0.5);
      put('C', last[0] + 3, under + 2.5, pen * 0.6, under, pen * 0.3, under + 0.5);
      put('C', pen * 0.12, under + 1, -0.5, under + 2.6, -1.5, under + 4.5);
    }

    /* Measure in sheared, y-down space, then fit the box with room to spare. */
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    function shear(x, y){ return [x + y * H.slant, -y]; }
    cmds.forEach(function(c){ for (var j = 1; j < c.length; j += 2) { var q = shear(c[j], c[j + 1]);
      if (q[0] < minX) minX = q[0]; if (q[0] > maxX) maxX = q[0];
      if (q[1] < minY) minY = q[1]; if (q[1] > maxY) maxY = q[1]; } });
    var w = maxX - minX, h = maxY - minY;
    if (!(w > 0) || !(h > 0)) return '';
    var scale = Math.min((300 - PAD * 2) / w, (100 - PAD * 2) / h);
    var ox = PAD - minX * scale, oy = (100 - h * scale) / 2 - minY * scale;
    var r1 = function(v){ return Math.round(v * 10) / 10; };

    return cmds.map(function(c){
      var parts = [];
      for (var j = 1; j < c.length; j += 2) { var q = shear(c[j], c[j + 1]); parts.push(r1(q[0] * scale + ox) + ' ' + r1(q[1] * scale + oy)); }
      return c[0] + parts.join(' ');
    }).join(' ');
  }

  window.hubHand = { path: path, glyphs: G, hand: hand };
  if (typeof module !== 'undefined' && module.exports) module.exports = window.hubHand;
})();
