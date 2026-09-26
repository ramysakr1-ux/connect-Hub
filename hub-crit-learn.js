/* Connect Lite — what this course's tutors have tagged, and what that suggests.
 *
 * The criteria suggester on the feedback screen matches a point's words against
 * the CELTA 5 wording. That is a fixed rule and it has a ceiling: the wording of
 * 1d says "rapport", so "warm with the group from the first minute" reaches it
 * only if the tutor happens to use the word; and 2a says "adjusting their own
 * use of language", which the same point matches on "language" and should not.
 * Measured on one course's sixteen points it was right about half the time.
 *
 * This is the other half of the answer: a tutor's own tagging is evidence about
 * what points like this one are. When feedback is returned, every point the
 * tutor actually tagged is one example — its words, and the codes they settled
 * on — and any code the wording had suggested and the tutor did not keep is one
 * counter-example. The next suggestion on that course is the wording rule plus
 * what the course has done.
 *
 * Five things it deliberately is not:
 *
 * - It is not a grader and never touches one. It suggests which criterion a
 *   sentence is about; the tutor writes the sentence and chooses the tag.
 * - It never tags anything by itself. A suggestion is still a chip to click.
 * - It is per course, not per centre and not global: the record lives beside
 *   the course's settings, so one course's habits cannot leak into another
 *   centre's, and a new course starts from the wording alone.
 * - It learns only from points a tutor tagged. An untagged point is a point
 *   the tutor did not think about, not a point where every criterion is wrong.
 * - It cannot be read by a trainee or an assessor: the store hands the record
 *   to a tutor only.
 *
 * The model is counts, so it merges by addition and stays small: for each code,
 * how many tagged points carried it and how often each word appeared in them,
 * capped at the commonest MAX_WORDS. A course of eight TPs by twelve candidates
 * is about 1,100 tagged points and still a few tens of KB.
 */
window.HubCritLearn = (function () {
  'use strict';

  var VERSION = 1;
  /* Enough room for the vocabulary of a criterion without letting one code's
     long tail dominate the record's size. */
  var MAX_WORDS = 48;
  /* How much evidence before the course's own habits count for as much as the
     wording. Four points on a code is a tutor doing something consistently;
     one is a coincidence. The curve is n²/(n²+K²) rather than n/(n+K) so that
     the first example is damped hard (0.06) while the fourth is already at a
     half -- a habit should take hold quickly once it is a habit, and a single
     tagged point should do almost nothing. */
  var K = 4;
  /* The wording half of the score is a sum of how much each matched word
     narrows the criteria down, and lands between about 2.5 and 6. The learned
     half is a coverage fraction and lands between 0 and about 4. This puts
     them on the same scale, so that a code the wording cannot see at all can
     still be suggested once the course has tagged it four or five times, and
     a code the course keeps turning down can be pushed below the floor. */
  var GAIN = 2;

  function empty() { return { v: VERSION, n: 0, codes: {}, words: {} }; }

  /* Anything read back from the store is data, not shape: a hand-edited or
     half-written record must degrade to "no evidence", never throw. */
  function normalise(raw) {
    var m = empty();
    if (!raw || typeof raw !== 'object') return m;
    m.n = Math.max(0, Number(raw.n) || 0);
    /* Where a seeded course got its head start, kept through every later
       observe so the evidence line never overstates what this course did. */
    if (raw.seed && typeof raw.seed === 'object') m.seed = raw.seed;
    if (raw.words && typeof raw.words === 'object') {
      Object.keys(raw.words).forEach(function (w) {
        var c = Number(raw.words[w]); if (c > 0) m.words[w] = c;
      });
    }
    if (raw.codes && typeof raw.codes === 'object') {
      Object.keys(raw.codes).forEach(function (code) {
        var e = raw.codes[code]; if (!e || typeof e !== 'object') return;
        var kept = { n: Math.max(0, Number(e.n) || 0), noN: Math.max(0, Number(e.noN) || 0), w: {}, no: {} };
        ['w', 'no'].forEach(function (bag) {
          if (!e[bag] || typeof e[bag] !== 'object') return;
          Object.keys(e[bag]).forEach(function (w) {
            var c = Number(e[bag][w]); if (c > 0) kept[bag][w] = c;
          });
        });
        if (kept.n || kept.noN || Object.keys(kept.w).length || Object.keys(kept.no).length) m.codes[code] = kept;
      });
    }
    return m;
  }

  function bump(bag, key, by) { bag[key] = (bag[key] || 0) + (by || 1); }

  function trimBag(bag, cap) {
    var keys = Object.keys(bag);
    if (keys.length <= cap) return bag;
    keys.sort(function (a, b) { return bag[b] - bag[a] || (a < b ? -1 : 1); });
    var out = {};
    keys.slice(0, cap).forEach(function (w) { out[w] = bag[w]; });
    return out;
  }

  /* observations: [{ words: [...], codes: [...], suggested: [...] }] — one per
     point the tutor tagged. `suggested` is what the wording rule had offered,
     so a code in it that is not in `codes` is a suggestion the tutor turned
     down, on those words.
     Returns a NEW model; the caller decides whether to keep it. */
  function observe(model, observations) {
    var m = normalise(model);
    (observations || []).forEach(function (o) {
      var words = uniq(o && o.words), codes = uniq(o && o.codes);
      if (!words.length || !codes.length) return;   /* an untagged point teaches nothing */
      m.n++;
      words.forEach(function (w) { bump(m.words, w); });
      codes.forEach(function (code) {
        var e = m.codes[code] || (m.codes[code] = { n: 0, w: {}, no: {} });
        e.n++;
        words.forEach(function (w) { bump(e.w, w); });
      });
      uniq(o && o.suggested).forEach(function (code) {
        if (codes.indexOf(code) >= 0) return;
        var e = m.codes[code] || (m.codes[code] = { n: 0, w: {}, no: {} });
        /* Counted separately from e.n: a code that has only ever been turned
           down has no examples, and if the turning-down were weighed by e.n it
           would weigh nothing -- which is exactly backwards. */
        e.noN = (e.noN || 0) + 1;
        words.forEach(function (w) { bump(e.no, w); });
      });
    });
    Object.keys(m.codes).forEach(function (code) {
      m.codes[code].w = trimBag(m.codes[code].w, MAX_WORDS);
      m.codes[code].no = trimBag(m.codes[code].no, MAX_WORDS);
    });
    m.words = trimBag(m.words, MAX_WORDS * 8);
    return m;
  }

  function uniq(a) {
    if (!a || !a.length) return [];
    var seen = {}, out = [];
    for (var i = 0; i < a.length; i++) {
      var v = String(a[i]);
      if (v && !seen[v]) { seen[v] = 1; out.push(v); }
    }
    return out;
  }

  /* What the course's own tagging says about each code, for these words.
     Returns { code: score } in the same units as the wording score, so the two
     can simply be added.
     For one word and one code: how much likelier that word is inside points
     tagged with this code than in the course's points at large. A word that
     appears in every point says nothing and scores about zero; a word that
     appears only in points tagged 1d is worth a lot. Words the tutor has
     turned this code down on pull the other way. The whole thing is then
     damped by how much evidence the code has, so a course that has tagged
     three points barely moves the wording's answer. */
  function confidence(n) { return n ? (n * n) / (n * n + K * K) : 0; }

  function score(model, words, allowed) {
    var m = normalise(model);
    var out = {};
    if (!m.n || !words || !words.length) return out;
    var ws = uniq(words);
    var codes = allowed && allowed.length ? allowed : Object.keys(m.codes);
    codes.forEach(function (code) {
      var e = m.codes[code];
      if (!e) return;
      var s = 0;
      if (e.n) {
        var covered = 0;
        ws.forEach(function (w) {
          var seenHere = e.w[w] || 0;
          if (!seenHere) return;
          /* Three things have to be true for a word to count. It has to be
             one this code's points usually contain (coverage); it has to
             belong to this code rather than to every point on the course
             (exclusivity); and it has to be worth saying at all -- a word in
             every point the course has ever tagged tells you nothing, which
             is the same argument the wording half makes with idf, measured
             here against the course instead of the criteria. */
          var coverage = seenHere / e.n;
          var exclusivity = seenHere / (m.words[w] || seenHere);
          var worth = Math.log(1 + m.n / (m.words[w] || 1));
          covered += coverage * exclusivity * worth;
        });
        s += GAIN * confidence(e.n) * covered;
      }
      if (e.noN) {
        var against = 0;
        ws.forEach(function (w) {
          var turned = e.no[w] || 0;
          if (turned) against += Math.log(1 + turned / ((e.w[w] || 0) + 1));
        });
        s -= GAIN * confidence(e.noN) * against;
      }
      if (s) out[code] = s;
    });
    return out;
  }

  /* A short line for the tutor, so a suggestion that came from the course's own
     habits says so rather than appearing from nowhere. */
  function evidence(model, code) {
    var m = normalise(model);
    var e = m.codes[code];
    if (!e || !e.n) return '';
    var many = e.n + ' point' + (e.n === 1 ? '' : 's');
    /* A seeded course must not claim the evidence as its own: half of it was
       carried over, and a tutor reading "12 points tagged 5f" should be able
       to find twelve points on this course. */
    return m.seed
      ? many + ' tagged ' + code + ', counting what carried over from ' + (m.seed.name || 'the last course')
      : 'this course has tagged ' + many + ' ' + code;
  }


  function size(model) { return JSON.stringify(normalise(model)).length; }

  return { VERSION: VERSION, MAX_WORDS: MAX_WORDS, K: K,
           empty: empty, normalise: normalise, observe: observe, score: score,
           evidence: evidence, size: size };
})();
