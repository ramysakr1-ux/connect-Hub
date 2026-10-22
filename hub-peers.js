/* Connect Lite — who was teaching when a trainee watched.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 23 Oct 2026: "Lite knows who's 1, 2, 3 from the rotation, right?" It
 * does. A peer observation sheet is done for a TP and a sitting: sitting a is
 * the day the group's first teaching set teaches (A B C), sitting b the day the
 * second one does (D E F), and within a set the order turns every TP, or
 * follows the deal where a tutor dealt the day by hand (hub-rotation
 * orderDealt). So Teacher 1, 2 and 3 on a sheet are three known people, and
 * nobody has to type their names.
 *
 *   hubPeerTeachers(group, tp, sit) -> [{ token, name, letter }] in teaching
 *   order, or null when the course has not got that far.
 *
 * A tutor's browser has the roster, so the names come with it. A trainee's
 * has only their group's two sets as tokens (store: boot's TP points), so
 * they get letters, as on the timetable, and their own token to say "You".
 */
(function(root){
  'use strict';
  function rd(k){ try { return JSON.parse(root.localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function setsOf(group){
    var R = root.hubRotation; if (!R) return null;
    var roster = (rd('connect_roster_v1') || {}).trainees || {};
    var people = Object.keys(roster).map(function(id){ return roster[id]; })
      .filter(function(t){ return t && String(t.group || '') === String(group || ''); })
      .map(function(t){ return { token: String(t.id || t.token), name: t.name || '' }; });
    if (people.length) return R.setsFor(people);
    var P = rd('connect_tp_points_v1') || {};
    if (Array.isArray(P.sets) && P.sets.length) {
      return P.sets.map(function(st, si){
        return (st || []).map(function(tok, i){ return tok ? { token: String(tok), name: '', letter: R.LETTERS[si * 3 + i] || String(si * 3 + i + 1), idx: si * 3 + i } : null; })
          .filter(Boolean);
      });
    }
    return null;
  }
  function hubPeerTeachers(group, tp, sit){
    var R = root.hubRotation; if (!R || !tp) return null;
    var sets = setsOf(group); if (!sets) return null;
    var set = sets[sit === 'b' ? 1 : 0] || [];
    if (!set.length) return null;
    var P = rd('connect_tp_points_v1') || {};
    var rows = (P.groups && P.groups[group]) || P.points || {};
    return R.orderDealt(set, +tp, function(t, n){ return (rows[t] || {})['tp' + n]; });
  }
  root.hubPeerTeachers = hubPeerTeachers;
})(typeof window !== 'undefined' ? window : globalThis);
