/* Connect Lite — the words tutors use, for the criteria suggester.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 24 Oct 2026: "build the tutor vocabulary layer". The suggester on the
 * feedback screen matches a point's words against the CELTA 5 wording, and a
 * course then learns from what its own tutors tag (hub-crit-learn.js). A new
 * course has nothing learned, and the wording alone misses how tutors write:
 * the criterion says "monitoring", a tutor writes "walk round"; it says
 * "maintaining an appropriate learning pace", a tutor writes "it ran long".
 * Measured on 273 checked points, the wording alone offered the right criterion
 * a third of the time and only wrong ones another third.
 *
 * This is the third half: the everyday words of a CELTA tutor, written from
 * what each criterion means (Cambridge's own wording and Appendix 1), not from
 * any course's sentences. Each entry is a code, the side it belongs to
 * (teaching or planning, as the feedback form divides them) and a pattern. A
 * specific word ("monitor", "ICQ", "gist") is strong; a common one ("time",
 * "board", "pairs") is light, so it tips a close call without deciding one.
 *
 * It adds to the wording and to what the course has learned; it never tags
 * anything, and it is the same for every course.
 */
(function(root){
  'use strict';
  /* Weighted to sit beside the wording's scores (2.5 to 6 for a good match):
     measured on held-out points, x1.5 of the 3 / 1.5 first written did best. */
  var S = 4.5, L = 2.25;   // strong, light
  /* teaching: Cambridge topics 1, 2, 3, 5. planning: topic 4. */
  var T = [
    ['1a', L, /\b(their own (lives|life|families|friends|town|experience)|personal(i[sz]ed)?|relevant to (them|the class)|interests?)\b/],
    ['1b', S, /\b(learning (preferences?|styles?)|cultur(e|al)|first languages?|\bl1\b)/],
    ['1c', S, /\b(backgrounds?|previous learning|what they (already )?know from)\b/],
    ['1d', S, /\b(rapport|warm(th|ly)?|friendly|patient|encouraging|manner|by name|uses? (their |the learners' |learners' )?names|nominat\w*|quiet(er)? (students|ones|learners)|involved|presence|engaging)\b/],
    ['2a', S, /\b(teacher talk|ttt|grad(e|ed|ing) (your|the) language|your (own )?(voice|speech|talk(ing)?)|speak(ing)? (more )?slowly|slow (down )?your|volume|project your voice|calmer and clearer|talk(ed)? too much)\b/],
    ['2b', S, /\b(correct(ion|ed|ing|s)?|errors?|mistakes?|recast\w*|slips?)\b/],
    ['2c', L, /\b(contexts?|situation|way in|lead-in)\b/],
    ['2d', S, /\b(model(led|ling)? (the )?(language|sentence|stress|pronunciation|precisely|accurately)|accurate models?|your own (english|language) (was|is) accurate)\b/],
    ['2e', S, /\b(clarif\w*|concept (check\w*|questions?)|ccqs?|timeline|drill\w*|weak forms?|intonation|word stress|the stress|meaning and form|board work|contrast(ed)?)\b/],
    ['2f', S, /\b(register|formal|informal|polite(ness)?|tentative|appropriac\w*)\b/],
    ['2g', L, /\b(practice of|practis(e|ed|ing) (the|it|them)|controlled practice|freer practice|genuine practice)\b/],
    ['3a', S, /\b(gist|detail(ed)? (task|question|play|reading)|specific information|reason to (read|listen)|predict\w*|reading (task|time)|listening (task|stage)|the (recording|track|text)|(second|third) play)\b/],
    ['3b', S, /\b(speaking (task|stage)?|discussion|fluency|writing (task|stage|time)|role[ -]?play|freer stage|response (stage)?|told|retell\w*|real talk|genuine (speaking|discussion|stories))\b/],
    ['5a', S, /\b(seating|horseshoe|the (room|space)|arrange(d)? the (room|chairs))\b/],
    ['5b', S, /\b(set up|managed|fast finishers?|finish(ed)? early|extension|grouping|regroup\w*|mingle|hand (the )?(tasks?|it|the pen) to)\b/],
    ['5b', L, /\b(pairs?|groups?)\b/],
    ['5c', S, /\b(techniques?)\b/],
    ['5d', S, /\b(aims? (was|were)? ?(met|achieved)|achiev\w*|protect\w*|respond(ed)? to (the class|what)|drift\w*|the (stage|part) the lesson (was|is) for|teach the gap)\b/],
    ['5e', S, /\b(handouts?|equipment|video|cue(d)?|slides?|visuals?|materials? (ready|marked)|board (was )?ready|prepare the board|the page)\b/],
    ['5e', L, /\b(board|materials?)\b/],
    ['5f', S, /\b(instructions?|icqs?|demonstrat\w*|example (first|before|together)|the task (was )?clear|clear (task|model)|reading time|explain(ed)? the task)\b/],
    ['5g', S, /\b(elicit\w*|questions? (to|that)|asked (them )?what|wait(ed)? (longer|for)|count to five|supplying)\b/],
    ['5h', S, /\b(feedback|check(ed|ing)? (the )?answers|content (feedback|question)|collected|boarded|praise\w*)\b/],
    ['5i', S, /\b(pace|clock|ran (long|over)|rushed|move (on|faster)|tighten|too long|overran|minutes? (left|went|for a)|the time (went|for))\b/],
    ['5i', L, /\b(time|minutes?)\b/],
    ['5j', S, /\b(monitor\w*|walk(ed|ing)? (round|between)|go(ing)? round|sat with one)\b/],
    ['5k', S, /\b(on time|finish(ed)? (on time|early)|start(ed)? (on time|late))\b/],
    ['5l', S, /\b(portfolio|records?)\b/],
    ['5m', S, /\b(self[- ]evaluation|strengths and weaknesses|reflect\w*)\b/],
    ['5n', S, /\b(responds? to feedback|action points? (from|met)|took (the )?feedback)\b/],
  ];
  var P = [
    ['4a', S, /\b(aims?)\b/],
    ['4b', S, /\b(sequenc\w*|stag(e|es|ing) follow|route|order|link\w*|flow\w*|logical|structure|shape of)\b/],
    ['4b', L, /\b(stag(e|es|ing))\b/],
    ['4c', S, /\b(material\w*|task design|designed|jigsaw|handouts?|grid|slips|cards|adapt\w*|model text|well[- ]chosen)\b/],
    ['4d', S, /\b(professional|copyright|appearance|referenc\w*|sources?)\b/],
    ['4e', S, /\b(procedure|in(to)? the plan|script\w*|written (down|out)|word for word|note in)\b/],
    ['4f', S, /\b(interaction|group size|grouping|pairs? (first|work)|alone, then)\b/],
    ['4g', S, /\b(balance|variety|communicative)\b/],
    ['4h', S, /\b(tim(e|ing|ings)|minutes?|ran long|realistic|protect\w*|cut|hold (it|the time))\b/],
    ['4i', S, /\b(analys\w*|form|meaning|phonology|pronunciation|stress|intonation|weak forms?|marked|terminology|word class|collocation|prepositions?)\b/],
    ['4j', S, /\b(anticipat\w*|predict\w*|problems?|difficult\w*|fast finishers?|finish(ing)? early|stuck|stronger students|error (that|they))\b/],
    ['4k', S, /\b(solutions?|solve|deal(t)? with|the exact words)\b/],
    ['4l', S, /\b(subskills?|gist|detail|specific information|skim\w*|scan\w*)\b/],
    ['4m', S, /\b(colleagues?|with (me|your tutor|the other trainees)|together)\b/],
    ['4n', S, /\b(reflect\w*|evaluat\w*|improvements?)\b/],
  ];
  function score(text, scope){
    var t = String(text || '').toLowerCase().replace(/[‘’]/g, "'");
    var list = scope === 'planning' ? P : T, out = {};
    /* two different signals for a criterion ("warm" and "names") count twice,
       never more: one long sentence should not run away with it */
    list.forEach(function(e){
      var seen = {}, n = 0, m, re = new RegExp(e[2].source, 'g');
      while ((m = re.exec(t)) && n < 2) { if (!seen[m[0]]) { seen[m[0]] = 1; n++; } }
      if (n) out[e[0]] = (out[e[0]] || 0) + e[1] * n;
    });
    return out;
  }
  root.HubCritVocab = { score: score };
})(typeof window !== 'undefined' ? window : globalThis);
