/* Connect Lite — who teaches what, and on which day.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Handbook 9.1.2 is a MUST, twice over: "Centres must ensure that all
 * candidates have practice in a range of lessons covering all aspects of
 * language teaching and must include language-focus lessons. The type of
 * lesson must be recorded in the CELTA 5." A centre satisfies that by
 * rotating the lesson types round the group rather than letting them fall
 * where they may, and Lite already knows enough to do the rotation itself.
 *
 * THE STRUCTURE (Ramy, 29 Sep 2026, correcting me):
 *   A teaching practice group is 4-6 trainees. There are no sub-groups. The
 *   group splits into two TEACHING SETS which take alternate days -- ABC on
 *   one day, DEF on the next -- so each trainee teaches every other day and
 *   the whole group attends both. A course of twelve is two such groups, a
 *   course of twenty-four is four. Six per group is the ceiling (7.1).
 *
 * THE NAMING: letters are people, never days. Each trainee carries a letter
 * within their own group; a teaching day is named by its date and by who
 * teaches on it ("TP 3 · ABC"), which is what Ramy writes on his own
 * timetables. `set` below is an internal handle so the software survives
 * somebody joining or leaving; it is never shown.
 *
 * THE ROTATION: seven aim types, six assessed practices before the last two
 * (which the trainees choose for themselves on the planning grid). Each
 * trainee starts at their own offset and steps one place per practice, so
 *   - nobody in the group teaches the same type on the same day;
 *   - each trainee's six are six DIFFERENT types out of the seven, and the
 *     one they miss is the only one they miss;
 *   - because six of seven always includes at least two of the three
 *     language-focus types, the "must include language-focus lessons" is
 *     satisfied for every trainee by construction, not by luck;
 *   - the second group starts three places along, so two groups running in
 *     parallel are never teaching the same thing on the same day.
 * Everything it decides is a proposal: the tutor edits any cell, and the
 * rule that anything the system decides can be overridden stands.
 */
(function (root) {
  'use strict';

  /* Language focus first, then receptive, then productive. The order matters:
     it is what makes a six-of-seven window always carry a language lesson. */
  const AIMS = ['Grammar', 'Vocabulary', 'Functional language', 'Reading', 'Listening', 'Speaking', 'Writing'];
  const LANGUAGE_FOCUS = ['Grammar', 'Vocabulary', 'Functional language'];
  const LETTERS = 'ABCDEF';

  /* The three families a lesson type belongs to. They carry the failed-lesson
     rule: Ramy, 29 Sep 2026 -- "if they fail a receptive skill, they should
     get another receptive skill. Doesn't have to be the same receptive, but a
     receptive nonetheless. And if they fail language, they should also get
     another language lesson." He was explicit that this is the centre's
     recommendation and NOT a Cambridge rule, so it suggests and says why; it
     never overrides a tutor and never goes red. */
  const FAMILY = {
    'Grammar': 'language', 'Vocabulary': 'language', 'Functional language': 'language',
    'Reading': 'receptive', 'Listening': 'receptive',
    'Speaking': 'productive', 'Writing': 'productive'
  };
  const FAMILY_WORD = { language: 'language focus', receptive: 'receptive skills', productive: 'productive skills' };
  const familyOf = (aim) => FAMILY[aim] || '';
  const aimsInFamily = (fam) => AIMS.filter((a) => FAMILY[a] === fam);

  /* The letter is the trainee's place in their own group, by name, so it is
     stable for everyone else when one person leaves.

     A COURSE CAN FIX ITS OWN LETTERS. Ramy, 10 Oct 2026: C/18's teaching sets
     were decided outside Lite -- ABC is Billur, Iris and Kian, DEF is Koray,
     Hiba and Ebru -- and alphabetical order put Ebru and Hiba on ABC's days.
     So the course settings may carry `letterOrder`, the trainees' tokens in
     letter order, and it wins; anyone it does not name follows in name order,
     so a trainee added later still gets a letter. Read here rather than at
     each caller, because five screens work out the sets and a candidate's
     timetable must agree with the tutor's. */
  function fixedOrder() {
    try {
      const ls = root.localStorage;
      const s = ls && JSON.parse(ls.getItem('connect_course_settings') || 'null');
      return (s && Array.isArray(s.letterOrder)) ? s.letterOrder.map(String) : null;
    } catch (e) { return null; }
  }
  function lettersFor(people) {
    const order = fixedOrder();
    const at = (p) => { const i = order ? order.indexOf(String(p.token)) : -1; return i < 0 ? 1e9 : i; };
    const sorted = people.slice().sort((a, b) => (at(a) - at(b)) || String(a.name || '').localeCompare(String(b.name || '')));
    return sorted.map((p, i) => Object.assign({}, p, { letter: LETTERS[i] || String(i + 1), idx: i }));
  }

  /* Two teaching sets that take alternate days. Six splits 3 and 3, five
     splits 3 and 2, four splits 2 and 2 -- the first set is never smaller,
     because it teaches first. */
  function setsFor(people) {
    const lettered = lettersFor(people);
    const half = Math.ceil(lettered.length / 2);
    return [lettered.slice(0, half), lettered.slice(half)];
  }
  /* What a set is CALLED: its members' letters. "ABC", "DE". Never "Day A". */
  const setName = (set) => set.map((p) => p.letter).join('');

  /* The aim for one trainee at one practice. `groupOffset` keeps two groups
     apart; `idx` is the trainee's place; `tp` is 1-based. */
  function aimFor(idx, tp, groupOffset) {
    return AIMS[(idx + (tp - 1) + (groupOffset || 0)) % AIMS.length];
  }

  /* The whole rotation for one group.
     people: [{token,name}], tps: how many practices to rotate (default 6).
     Returns { letters, sets, setNames, rows: { token: { tp1: aim, ... } } }. */
  function rotate(people, opts) {
    opts = opts || {};
    const tps = opts.tps || 6;
    const groupOffset = opts.groupOffset || 0;
    const lettered = lettersFor(people);
    const sets = setsFor(people);
    const rows = {};
    lettered.forEach((p) => {
      const row = {};
      for (let tp = 1; tp <= tps; tp++) row['tp' + tp] = aimFor(p.idx, tp, groupOffset);
      rows[p.token] = row;
    });
    return { letters: lettered, sets: sets, setNames: sets.map(setName), rows: rows };
  }

  /* The teaching ORDER within a set rotates too. Ramy, 29 Sep 2026: "the order
     within the subgroup is not always going to be A, B, C. So one time it's
     A, B, C, another time B, C, A, C, B, A." Rotating the aims alone left the
     same person going first for eight practices running. The order steps one
     place each practice, so over a set of three everyone leads, goes second
     and goes last. */
  function orderFor(set, tp) {
    const n = (set || []).length;
    if (!n) return [];
    const shift = ((tp - 1) % n + n) % n;
    return set.slice(shift).concat(set.slice(0, shift));
  }

  /* BOTH sets teach every practice, on consecutive days: "TP 1 · ABC" on one
     day and "TP 1 · DEF" on the next, then TP 2 the same way. The practice
     number does not alternate -- the DAY does. (Read off Ramy's own C/17
     timetable, 29 Sep 2026, after I first had the sets alternating practices.)
     So a practice occupies two teaching days, and this says which day within
     that pair a set teaches: 0 for the first, 1 for the second. */
  const dayOfSet = (setIndex) => setIndex;

  /* Does every trainee get a language-focus lesson? This is the MUST, so it
     is checked rather than assumed -- a tutor's overrides can break what the
     rotation guaranteed, and then the centre needs telling. */
  function languageFocusCheck(rows, tps) {
    tps = tps || 6;
    const out = [];
    Object.keys(rows || {}).forEach((token) => {
      let has = false;
      for (let tp = 1; tp <= tps; tp++) if (LANGUAGE_FOCUS.indexOf(rows[token]['tp' + tp]) >= 0) has = true;
      if (!has) out.push(token);
    });
    return out;   // tokens with no language-focus lesson; empty is the pass
  }

  /* Two trainees in the same set teaching the same type on the same day.
     The planning grid already warns about this for the last two practices;
     the rotation prevents it for the first six, and this is what proves it. */
  function clashes(rows, sets, tps) {
    tps = tps || 6;
    const out = [];
    for (let tp = 1; tp <= tps; tp++) {
      (sets || []).forEach((set) => {
        const seen = {};
        (set || []).forEach((p) => {
          const a = (rows[p.token] || {})['tp' + tp];
          if (!a) return;
          if (seen[a]) out.push({ tp: tp, aim: a, set: setName(set), who: [seen[a], p.letter] });
          else seen[a] = p.letter;
        });
      });
    }
    return out;
  }

  /* After a practice graded Not to standard, the next one should be in the
     same family -- another receptive lesson after a failed receptive one, and
     another language lesson after a failed language one. `taught` is what the
     tracker knows: { 1: {grade,aim}, 2: {...} } per practice number, read
     from the returned feedback. Returns one entry per suggestion, each saying
     which practice failed, which family it was, and what the next practice is
     currently set to -- so the screen can say why rather than just nudge.
     A recommendation: nothing here changes a cell on its own. */
  function afterFail(taught, rows, tps) {
    tps = tps || 6;
    const out = [];
    Object.keys(taught || {}).forEach((token) => {
      const mine = taught[token] || {};
      Object.keys(mine).forEach((k) => {
        const n = parseInt(k, 10);
        if (!n || n >= tps) return;                       // nothing follows the last one
        const t = mine[n] || {};
        if (String(t.grade || '').toUpperCase() !== 'NOTSTD') return;
        const fam = familyOf(t.aim);
        if (!fam) return;
        const next = ((rows || {})[token] || {})['tp' + (n + 1)];
        if (familyOf(next) === fam) return;               // already what it should be
        out.push({ token: token, failed: n, family: fam, familyWord: FAMILY_WORD[fam] || fam,
                   failedAim: t.aim, next: n + 1, nextAim: next || '', suggest: aimsInFamily(fam) });
      });
    });
    return out;
  }

  const api = { AIMS, LANGUAGE_FOCUS, LETTERS, FAMILY, FAMILY_WORD, familyOf, aimsInFamily,
                lettersFor, setsFor, setName, aimFor, rotate, orderFor, dayOfSet,
                languageFocusCheck, clashes, afterFail };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubRotation = api;
})(typeof window !== 'undefined' ? window : globalThis);
