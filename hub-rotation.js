/* Connect Lite — who teaches what, and on which day.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Handbook 9.1.2 is a MUST, twice over: "Centers must ensure that all
 * candidates have practice in a range of lessons covering all aspects of
 * language teaching and must include language-focus lessons. The type of
 * lesson must be recorded in the CELTA 5." A center satisfies that by
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
     another language lesson." He was explicit that this is the center's
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
  /* AND IT MUST SURVIVE A STALE TAB. The same evening the order vanished from
     C/18's settings -- a screen opened before it existed saved the whole
     settings record back -- and the letters fell back to name order while the
     sets already dealt still said ABC = Billur, Iris, Kian. So when settings
     carry no order, the sets as they were last dealt are the order: they live
     with the TP points, which only the TP points screen writes. (A tutor's copy
     keys them by group; the copy a trainee is handed is their group's bare
     list.) */
  /* LETTERS ARE FIXED PLACES (Ramy, 10 Oct 2026). A group has six places, A B C
     on the first day and D E F on the next -- the shape a TP point set is
     written in -- and a group of five simply leaves F empty. Lite used to split
     a group by head count, so four people were AB and CD and a fifth joining
     made it ABC and DE: the old C moved to the other day, with their order and
     their deadlines, and nobody was told. Now four are AB and DE, and anyone
     joining takes a free place in the smaller set: nobody already placed moves.
     Where a person sits is read, first to last, from the places a tutor chose
     (settings.slotOf, token -> letter), the old letter order, the sets as last
     dealt, and only for a group never placed, from name order. */
  const SLOTS = 6;
  function readJSON(k){ try { const ls = root.localStorage; return ls ? JSON.parse(ls.getItem(k) || 'null') : null; } catch (e) { return null; } }
  function knownPlaces(people){
    const toks = people.map((p) => String(p.token));
    const here = (t) => toks.indexOf(String(t)) !== -1;
    const out = {};
    const s = readJSON('connect_course_settings');
    if (s && s.slotOf && typeof s.slotOf === 'object') {
      Object.keys(s.slotOf).forEach((t) => { const i = LETTERS.indexOf(String(s.slotOf[t])); if (here(t) && i >= 0 && Object.values(out).indexOf(i) === -1) out[t] = i; });
      if (Object.keys(out).length) return out;
    }
    let sets = null;
    if (s && Array.isArray(s.letterOrder) && s.letterOrder.length) {
      const o = s.letterOrder.map(String).filter(here), h = Math.ceil(o.length / 2);
      if (o.length) sets = [o.slice(0, h), o.slice(h)];
    }
    if (!sets) {
      const p = readJSON('connect_tp_points_v1'), all = p && p.sets;
      const pairs = !all ? [] : Array.isArray(all) ? [all] : Object.values(all);
      let best = null, score = 0;
      pairs.forEach((pr) => { const n = (pr || []).reduce((a, set) => a.concat(set || []), []).filter(Boolean).map(String).filter(here).length; if (n > score) { score = n; best = pr; } });
      /* the dealt sets keep their gaps ([A, null, C] once B has left): read each
         person's place where it stands, so nobody slides into a free one */
      if (best) { [0, 1].forEach((si) => (best[si] || []).forEach((t, i) => { if (t && here(t) && i < 3) out[String(t)] = si * 3 + i; })); return out; }
    }
    if (sets) sets.forEach((set, si) => set.forEach((t, i) => { if (i < 3) out[t] = si * 3 + i; }));
    return out;
  }
  function lettersFor(people) {
    const known = knownPlaces(people);
    const taken = {};
    Object.keys(known).forEach((t) => { taken[known[t]] = true; });
    const place = Object.assign({}, known);
    const byName = (a, b) => String(a.name || '').localeCompare(String(b.name || ''));
    const rest = people.filter((p) => place[String(p.token)] === undefined).slice().sort(byName);
    let over = SLOTS;
    if (!Object.keys(known).length) {
      /* a group never placed: name order, the first half on the first day */
      const h = Math.ceil(Math.min(rest.length, SLOTS) / 2);
      rest.forEach((p, i) => { place[String(p.token)] = i < h ? i : i - h < 3 ? 3 + (i - h) : over++; });
    } else {
      /* a newcomer takes the first free place in the smaller set */
      rest.forEach((p) => {
        const n0 = [0, 1, 2].filter((i) => taken[i]).length, n1 = [3, 4, 5].filter((i) => taken[i]).length;
        const order = n0 <= n1 ? [0, 1, 2, 3, 4, 5] : [3, 4, 5, 0, 1, 2];
        let i = order.find((k) => !taken[k]);
        if (i === undefined) i = over++;
        taken[i] = true; place[String(p.token)] = i;
      });
    }
    return people.map((p) => { const i = place[String(p.token)]; return Object.assign({}, p, { letter: LETTERS[i] || String(i + 1), idx: i }); })
      .sort((a, b) => a.idx - b.idx);
  }

  /* Two teaching sets that take alternate days: A B C, then D E F. A place
     past F (a seventh person, which 7.1 does not allow) goes with the second. */
  function setsFor(people) {
    const lettered = lettersFor(people);
    return [lettered.filter((p) => p.idx < 3), lettered.filter((p) => p.idx >= 3)];
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

  /* THE ORDER FOLLOWS THE DEAL (11 Oct 2026). Each dealt cell remembers the
     slot it came from ("2A·3"), and the slot IS the time: a set's lessons are
     written in teaching order, the grammar after the text it is drawn from. A
     tutor who deals a day by hand -- C/18's own deal, so that every trainee has
     two language and two skills lessons before the level changes -- moves a
     trainee to another slot, and the timetable went on naming whoever the
     rotation would have put there. So: when every member of the set holds a
     different slot of that practice, that is the order; otherwise the
     rotation's. `cellOf(token, tp)` returns the trainee's cell or nothing.
     Works on lettered people and on bare tokens alike. */
  function orderDealt(set, tp, cellOf) {
    const base = orderFor(set, tp);
    if (typeof cellOf !== 'function' || !base.length) return base;
    const n = base.length;
    const pos = base.map((p) => {
      const c = cellOf(p && typeof p === 'object' ? p.token : p, tp);
      /* a time set by hand on the TP points grid (28 Oct 2026: "rearrange the order ... without swapping lessons") */
      if (c && Number.isInteger(c.at)) return c.at;
      const m = c && /\u00b7(\d+)$/.exec(String(c.from || ''));
      return m ? +m[1] - 1 : -1;
    });
    /* by the lesson's place in the day, whichever places are in use: a pair may teach the first and the third lesson
       (13 Nov 2026), so a place past the number of people is not a reason to fall back on the rotation */
    if (pos.some((x) => x < 0) || new Set(pos).size !== n) return base;
    return base.map((p, i) => ({ p: p, k: pos[i] })).sort((a, b) => a.k - b.k).map((x) => x.p);
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
     rotation guaranteed, and then the center needs telling. */
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

  /* THE ORDER A TUTOR READS THE COHORT IN (Ramy, 21 Oct 2026: the tracker, the
     assignments and teaching practice "are in alphabetical order instead of
     A, B, C, D, E, F"). Group by group, each group in letter order, so the list
     reads like the TP points screen and the timetable. A trainee with no group
     goes last, in name order. Takes roster trainees ({ id|token, name, group }). */
  function inLetterOrder(trainees) {
    const list = (trainees || []).filter(Boolean);
    const by = {};
    list.forEach((t) => { const g = String(t.group || ''); (by[g] = by[g] || []).push(t); });
    const place = {};
    Object.keys(by).forEach((g) => {
      if (g === '') return;
      lettersFor(by[g].map((t) => ({ token: String(t.id || t.token), name: t.name }))).forEach((p) => { place[p.token] = p.idx; });
    });
    const grp = (t) => String(t.group || '');
    return list.slice().sort((a, b) => {
      const ga = grp(a), gb = grp(b);
      if ((ga === '') !== (gb === '')) return ga === '' ? 1 : -1;
      if (ga !== gb) return ga.localeCompare(gb, undefined, { numeric: true });
      const pa = place[String(a.id || a.token)], pb = place[String(b.id || b.token)];
      if (pa !== undefined && pb !== undefined && pa !== pb) return pa - pb;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
  }

  /* ONE LEVEL, ONE TYPE ONCE (Ramy, 28 Oct 2026: "it's fine if they repeat grammar over two levels, but not in one level
     unless they fail the grammar lesson ... they can do grammar at, say, A2 and B2").

     THE DEAL, AS AGREED WITH RAMY ON 13 NOV 2026. C/21's group of four had two trainees a day, and the deal only ever
     gave them a day's first two lessons, never the third: "Group one is shit. This is not rotation." The set fixes WHAT
     a session's three lessons are; dealSet(day, n, opts) chooses, for a teaching set of n trainees, WHICH of them are
     taught at each practice and WHO takes which.

     Never broken:
       1. a day's lessons run in the book's order (the page orders the day by the lesson's place, orderDealt);
       2. a lesson built on another is dealt only when that one is taught the same day, before it (opts.needs), and a
          lesson built on one from the other set's day only when that one was dealt (opts.closed).
     Then, in this order:
       3. no aim twice inside a level;
       4. a mix of language and skills inside a level: two and two across four practices, one of each across two;
       5. the teaching order even: everyone goes first about as often;
       6. the trainees who share a day do not share an aim;
       7. everyone meets a productive lesson (speaking or writing) somewhere, when it costs nothing above.
     Not counted: the same aim at both levels, the last practice of one and the first of the next included ("that's not
     a concern at all"). With three on a day all three lessons are taught; with two, the best two; with one, the best one.

       day[t][s]      the type of lesson s at practice t+1 ('' when unwritten)
       opts.levelAt   the first practice of the second level (the change of class); default none
       opts.fixed     { t: [aim or '' per trainee] } where a tutor's own cell stands, and opts.held { t: [its place or -1] }
       opts.needs     needs[t][s] = the lesson of the same day that lesson s follows (0-based), or -1
       opts.closed    closed[t][s] = true where lesson s may not be dealt at practice t+1
     Returns { perms: perms[t][i] = the lesson trainee i takes at practice t+1, rep, mix, spread, shared, noProd }.
     Exhaustive: six practices of six ways is 46,656 deals. */
  function dealSet(day, n, opts) {
    opts = opts || {};
    const T = (day || []).length, levelAt = opts.levelAt || 0, fixed = opts.fixed || {}, needs = opts.needs || [], closed = opts.closed || [];
    const levelOf = (t) => (levelAt && t + 1 >= levelAt ? 1 : 0);
    const rot = (t) => Array.from({ length: n }, (_, i) => (((i - t) % n) + n) % n);
    const isLang = (ty) => LANGUAGE_FOCUS.indexOf(ty) >= 0, isProd = (ty) => FAMILY[ty] === 'productive';
    /* every way of giving n trainees n different lessons out of a day's three */
    const all = [];
    (function gen(a) { if (a.length === n) { all.push(a.slice()); return; }
      for (let s = 0; s < Math.max(3, n); s++) if (a.indexOf(s) < 0) { a.push(s); gen(a); a.pop(); } })([]);
    const held = opts.held || {};
    const choices = (t) => {
      const types = day[t] || [], written = [0, 1, 2].filter((s) => types[s]), fx = fixed[t] || [], hd = held[t] || [];
      if (written.length < n) return [rot(t)];                       /* nothing to choose between: the rotation's own order */
      /* a tutor's own cell keeps its lesson (opts.held: the place it holds, -1 where it has none); the others on that
         day are dealt round it, so nobody is handed the lesson a classmate was given by hand */
      const ok = all.filter((perm) => perm.every((s, i) => {
        if (fx[i]) return !(hd[i] >= 0) || s === hd[i];
        const nd = (needs[t] || [])[s];
        return types[s] && !((closed[t] || [])[s]) && (nd === undefined || nd < 0 || perm.indexOf(nd) >= 0);
      }));
      return ok.length ? ok : [rot(t)];
    };
    const typeOf = (t, i, perm) => { const f = (fixed[t] || [])[i]; return f || ((day[t] || [])[perm[i]] || ''); };
    /* how many practices each level holds, for the two-and-two */
    const span = [0, 0]; for (let t = 0; t < T; t++) if ((day[t] || []).some(Boolean)) span[levelOf(t)]++;
    const seen = Array.from({ length: n }, () => [{}, {}]);
    const lang = Array.from({ length: n }, () => [0, 0]), prod = Array.from({ length: n }, () => 0), lead = Array.from({ length: n }, () => 0);
    let best = null; const cur = [];
    function walk(t, rep, shared, dist) {
      if (best && rep > best.rep) return;
      if (t === T) {
        let mix = 0;
        for (let i = 0; i < n; i++) for (let lv = 0; lv < 2; lv++) { if (!span[lv]) continue;
          const lo = Math.floor(span[lv] / 2), hi = Math.ceil(span[lv] / 2), k = lang[i][lv];
          mix += k < lo ? lo - k : k > hi ? k - hi : 0; }
        const spread = Math.max.apply(null, lead) - Math.min.apply(null, lead), noProd = prod.filter((x) => !x).length;
        const score = rep * 100000 + mix * 5000 + spread * 300 + shared * 40 + noProd * 6 + dist;
        if (!best || score < best.score) best = { score: score, rep: rep, mix: mix, spread: spread, shared: shared, noProd: noProd, perms: cur.slice() };
        return;
      }
      const r = rot(t), lv = levelOf(t);
      choices(t).forEach((perm) => {
        let add = 0, d = 0, sh = 0; const undo = [], types = [];
        const first = perm.indexOf(Math.min.apply(null, perm));
        for (let i = 0; i < n; i++) {
          const ty = typeOf(t, i, perm);
          if (ty) { if (seen[i][lv][ty]) add++; seen[i][lv][ty] = (seen[i][lv][ty] || 0) + 1; undo.push([i, ty]);
            if (types.indexOf(ty) >= 0) sh++; types.push(ty);
            if (isLang(ty)) lang[i][lv]++; if (isProd(ty)) prod[i]++; }
          if (perm[i] !== r[i]) d++;
        }
        lead[first]++;
        cur[t] = perm.slice(); walk(t + 1, rep + add, shared + sh, dist + d);
        lead[first]--;
        undo.forEach((u) => { seen[u[0]][lv][u[1]]--; if (isLang(u[1])) lang[u[0]][lv]--; if (isProd(u[1])) prod[u[0]]--; });
      });
    }
    walk(0, 0, 0, 0);
    return best || { perms: [], rep: 0, mix: 0, spread: 0, shared: 0, noProd: 0, score: 0 };
  }

  /* The types a trainee meets twice inside one level, for the page's warning and the set page's paths:
     path = [type per practice]; returns the repeated types. A level is every practice before levelAt, and from it on. */
  function repeatsInLevel(path, levelAt) {
    const out = [];
    [[0, levelAt ? levelAt - 1 : path.length], [levelAt ? levelAt - 1 : path.length, path.length]].forEach((rg) => {
      const seen = {}; for (let t = rg[0]; t < rg[1]; t++) { const ty = path[t]; if (!ty) continue; if (seen[ty] && out.indexOf(ty) < 0) out.push(ty); seen[ty] = 1; }
    });
    return out;
  }

  const api = { inLetterOrder, dealSet, repeatsInLevel, AIMS, LANGUAGE_FOCUS, LETTERS, FAMILY, FAMILY_WORD, familyOf, aimsInFamily,
                lettersFor, setsFor, setName, aimFor, rotate, orderFor, orderDealt, dayOfSet,
                languageFocusCheck, clashes, afterFail };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubRotation = api;
})(typeof window !== 'undefined' ? window : globalThis);
