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
 *   A teaching practice group is 4-6 candidates. There are no sub-groups. The
 *   group splits into two TEACHING SETS which take alternate days -- ABC on
 *   one day, DEF on the next -- so each candidate teaches every other day and
 *   the whole group attends both. A course of twelve is two such groups, a
 *   course of twenty-four is four. Six per group is the ceiling (7.1).
 *
 * THE NAMING: letters are people, never days. Each candidate carries a letter
 * within their own group; a teaching day is named by its date and by who
 * teaches on it ("TP 3 · ABC"), which is what Ramy writes on his own
 * timetables. `set` below is an internal handle so the software survives
 * somebody joining or leaving; it is never shown.
 *
 * THE ROTATION: seven aim types, six assessed practices before the last two
 * (which the candidates choose for themselves on the planning grid). Each
 * candidate starts at their own offset and steps one place per practice, so
 *   - nobody in the group teaches the same type on the same day;
 *   - each candidate's six are six DIFFERENT types out of the seven, and the
 *     one they miss is the only one they miss;
 *   - because six of seven always includes at least two of the three
 *     language-focus types, the "must include language-focus lessons" is
 *     satisfied for every candidate by construction, not by luck;
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

  /* The letter is the candidate's place in their own group, by name, so it is
     stable for everyone else when one person leaves. */
  function lettersFor(people) {
    const sorted = people.slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
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

  /* The aim for one candidate at one practice. `groupOffset` keeps two groups
     apart; `idx` is the candidate's place; `tp` is 1-based. */
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

  /* BOTH sets teach every practice, on consecutive days: "TP 1 · ABC" on one
     day and "TP 1 · DEF" on the next, then TP 2 the same way. The practice
     number does not alternate -- the DAY does. (Read off Ramy's own C/17
     timetable, 29 Sep 2026, after I first had the sets alternating practices.)
     So a practice occupies two teaching days, and this says which day within
     that pair a set teaches: 0 for the first, 1 for the second. */
  const dayOfSet = (setIndex) => setIndex;

  /* Does every candidate get a language-focus lesson? This is the MUST, so it
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

  /* Two candidates in the same set teaching the same type on the same day.
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

  const api = { AIMS, LANGUAGE_FOCUS, LETTERS, lettersFor, setsFor, setName, aimFor, rotate, dayOfSet, languageFocusCheck, clashes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubRotation = api;
})(typeof window !== 'undefined' ? window : globalThis);
