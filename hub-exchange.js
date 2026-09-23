/* The exchange: the plan OUT to any AI, the feedback BACK into the boxes.
 *
 * Ramy, 24 Sep 2026: "I would prefer if I can just have a link that I can
 * paste into another AI model and it will have access to the plan and then I
 * can dictate and it will write... like an API, but through an AI model."
 *
 * What this is: a BRIEF. The plan and analysis rendered as plain Markdown,
 * followed by a template with one labelled slot for every box on the feedback
 * form -- the grade, each stage, each vocabulary item or analysis section, the
 * four lists, the three comments. Paste it into any model, dictate, and the
 * model writes into the slots. Paste the result back here and each slot lands
 * in its box. The model never needs to know Lite exists; it only needs to keep
 * the headings, and models are good at keeping headings.
 *
 * Why the slots are labelled by NAME and matched by name, not by position: a
 * model that drops an empty section, reorders two, or adds a heading of its
 * own must not shift every comment one stage down. Matching is on the heading
 * text, case-insensitive, punctuation-insensitive, and the original headings
 * are carried inside the brief so what comes back is compared against what
 * went out, not against whatever the form happens to show now.
 *
 * Why nothing here is "smart": the parse is a heading scanner, not an
 * interpreter. If a slot is missing it is left alone. If a heading is
 * unrecognised it is reported, not guessed. The tutor sees exactly what
 * landed before anything is saved, because a feedback sheet filled by a
 * machine and returned to a candidate unread is the one outcome this must
 * never produce.
 *
 * FORMAT IS NEVER TOUCHED. The plan goes out as text, the feedback comes back
 * as text; the document the candidate receives is built from the form as it
 * always was. This is a way of getting words into boxes, not a new document.
 */
(function(){
  var GRADES = ['Above standard', 'To standard', 'Not to standard'];

  function norm(s){
    return String(s || '').toLowerCase().replace(/[‘’“”"'`]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function lines(v){
    return String(v || '').split(/\r?\n/).map(function(l){ return l.replace(/^\s*[•\-*–]\s*/, '').trim(); })
      .filter(Boolean);
  }
  function bullets(v){ return lines(v).map(function(l){ return '- ' + l; }).join('\n'); }

  /* ---------- OUT ---------- */

  /* Every slot on the form, in order, each with the heading that will name it
     in the brief and the id it maps back to. Built from the plan the tutor is
     looking at, so a plan with six stages gets six stage slots. */
  function slots(doc){
    var p = (doc && doc.plan) || {}, l = (doc && doc.la) || {};
    var out = [];
    out.push({ id: 'fGrade', kind: 'grade', heading: 'Grade' });
    (p.rows || []).forEach(function(r, i){
      var name = String(r.stage || '').split(':')[0].trim() || ('Stage ' + (i + 1));
      out.push({ id: 'st' + i, kind: 'tc', heading: 'Stage ' + (i + 1) + ' — ' + name });
    });
    if (l.type === 'vocab') {
      (l.vocab || []).forEach(function(r, i){
        var item = lines(r.item)[0] || ('Item ' + (i + 1));
        out.push({ id: 'vo' + i, kind: 'tc', heading: 'Vocabulary — ' + item });
      });
    } else {
      (l.blocks || []).forEach(function(b, bi){
        (b.fields || []).forEach(function(f){
          var has = f.pairs ? (f.pairs.length > 0) : !!(f.value || '').trim();
          if (!has) return;
          out.push({ id: 'la' + bi + '_' + f.key, kind: 'tc', heading: 'Analysis ' + (bi + 1) + ' — ' + f.label });
        });
      });
    }
    out.push({ id: 'lSP', kind: 'list', heading: 'Strengths in planning' });
    out.push({ id: 'lAP', kind: 'list', heading: 'Action points in planning' });
    out.push({ id: 'lST', kind: 'list', heading: 'Strengths in teaching' });
    out.push({ id: 'lAT', kind: 'list', heading: 'Action points in teaching' });
    out.push({ id: 'tOverall', kind: 'text', heading: 'Overall comment' });
    out.push({ id: 'tSelf', kind: 'text', heading: 'On their self-evaluation' });
    out.push({ id: 'tLA', kind: 'text', heading: 'On the language analysis' });
    return out;
  }

  function planMarkdown(doc){
    var m = doc.meta || {}, p = doc.plan || {}, l = doc.la || {};
    var md = [];
    md.push('# Lesson plan — ' + (m.name || 'candidate') + ', ' + (m.tp || 'TP'));
    var meta = [];
    if (m.level) meta.push('Level: ' + m.level);
    if (m.date) meta.push('Date: ' + m.date);
    if (m.length) meta.push('Length: ' + m.length + ' min');
    if (m.framework) meta.push('Shape: ' + m.framework);
    if (meta.length) md.push(meta.join(' · '));
    md.push('');
    var box = function(title, v){ if (lines(v).length) { md.push('## ' + title); md.push(bullets(v)); md.push(''); } };
    box('Main aims', p.main); box('Subsidiary aims', p.sub); box('Personal aims', p.pers);
    var probs = (p.probs || []).filter(function(x){ return lines(x.problem).length || lines(x.solution).length; });
    if (probs.length) {
      md.push('## Anticipated problems and solutions');
      probs.forEach(function(x, i){
        md.push('**Problem ' + (i + 1) + ':** ' + lines(x.problem).join(' / '));
        md.push('**Solution:** ' + lines(x.solution).join(' / '));
      });
      md.push('');
    }
    if ((p.profile || '').trim()) { md.push('## Class profile'); md.push(p.profile.trim()); md.push(''); }
    box('Materials', p.mats);
    if ((p.rows || []).length) {
      md.push('## Procedure');
      p.rows.forEach(function(r, i){
        md.push('### Stage ' + (i + 1) + ' — ' + (r.stage || '—') + (r.time ? ' (' + r.time + ' min' + (r.int ? ', ' + r.int : '') + ')' : (r.int ? ' (' + r.int + ')' : '')));
        if (r.aim) md.push('_' + r.aim + '_');
        md.push(bullets(r.proc) || '_(nothing written)_');
        md.push('');
      });
    }
    var laLabel = l.type === 'vocab' ? 'Vocabulary' : (l.type === 'grammar' ? 'Grammar' : 'Functional language');
    if (l.type === 'vocab' && (l.vocab || []).length) {
      md.push('## ' + laLabel + ' analysis');
      if (l.context) md.push('Context: ' + l.context);
      l.vocab.forEach(function(r, i){
        md.push('### Vocabulary — ' + (lines(r.item)[0] || ('Item ' + (i + 1))));
        var f = function(t, v){ if (lines(v).length) md.push('**' + t + ':** ' + lines(v).join(' / ')); };
        f('Definition', r.def); f('Conveying meaning', r.convey); f('Clarification', r.clar); f('Form', r.form); f('Problems', r.prob);
        md.push('');
      });
    } else if ((l.blocks || []).length) {
      md.push('## ' + laLabel + ' analysis');
      if (l.context) md.push('Context: ' + l.context);
      l.blocks.forEach(function(b, bi){
        md.push('### Analysis ' + (bi + 1) + (b.title ? ' — ' + b.title : ''));
        (b.fields || []).forEach(function(f){
          if (f.pairs) { if (f.pairs.length) f.pairs.forEach(function(x){ md.push('**' + f.label + ':** P: ' + lines(x.problem).join(' / ') + ' — S: ' + lines(x.solution).join(' / ')); }); }
          else if ((f.value || '').trim()) md.push('**' + f.label + ':** ' + lines(f.value).join(' / '));
        });
        md.push('');
      });
    }
    if (doc.self) {
      var s = doc.self;
      md.push('## Their self-evaluation');
      var sf = function(t, v){ if (lines(v).length) { md.push('**' + t + ':** ' + lines(v).join(' / ')); } };
      sf('What went well', s.well); sf('What did not', s.not); sf('What they learned', s.learn); sf('What they found difficult', s.diff); sf('Next time', s.next);
      md.push('');
    }
    return md.join('\n');
  }

  /* The brief. The plan, then the slots, then the rule for filling them. The
     headings are repeated exactly in a manifest at the end so a model that
     rewrites one can still be matched by the reader, and so that what comes
     back is checked against what went out. */
  function brief(doc, tutor){
    var sl = slots(doc);
    var md = [];
    md.push(planMarkdown(doc));
    md.push('---');
    md.push('');
    md.push('# Feedback — fill in below');
    md.push('');
    md.push('You are helping a CELTA tutor write feedback on the lesson plan above. The tutor will dictate; write what they say into the slots, in the second person to the candidate ("you"), concise and specific. Keep every heading exactly as it is. Leave a slot empty if there is nothing to say. One point per line in the four lists; start a point with a star (★) if the tutor wants it prioritised next time. For Grade write exactly one of: ' + GRADES.join(' / ') + '.');
    md.push('');
    sl.forEach(function(s){
      md.push('## ' + s.heading);
      md.push('');
      md.push('');
    });
    md.push('<!-- lite:slots ' + JSON.stringify(sl.map(function(s){ return [s.id, s.heading]; })) + ' -->');
    return md.join('\n');
  }

  /* ---------- IN ---------- */

  /* Splits the pasted text into headed sections. Only H2 headings ("## ...")
     open a section; anything above the first one is ignored, so a model that
     echoes the plan back is harmless. */
  function sections(text){
    var out = [], cur = null;
    String(text || '').split(/\r?\n/).forEach(function(raw){
      var h = raw.match(/^\s*(#{1,3})\s+(.+?)\s*#*\s*$/);
      if (h) { cur = { level: h[1].length, heading: h[2].trim(), body: [] }; out.push(cur); return; }
      if (cur) cur.body.push(raw);
    });
    out.forEach(function(s){ s.text = s.body.join('\n').replace(/^\s+|\s+$/g, ''); });
    return out;
  }

  /* The manifest that went out with the brief, if the model kept it; else the
     form's own slots now. Prefer what went out: it is what the headings mean. */
  function manifest(text, doc){
    var m = String(text || '').match(/<!--\s*lite:slots\s*(\[[\s\S]*?\])\s*-->/);
    if (m) { try { return JSON.parse(m[1]).map(function(x){ return { id: x[0], heading: x[1] }; }); } catch (e) {} }
    return slots(doc).map(function(s){ return { id: s.id, heading: s.heading }; });
  }

  /* Reads the filled brief. Returns what would land, and what could not be
     placed, and writes nothing. */
  function read(text, doc){
    var man = manifest(text, doc);
    /* Only the feedback half is read. A model that echoes the plan back above
       its answers is the common case, and the plan's own headings ("Stage 1 --
       Lead-in", "Vocabulary -- get by") are the same words as the slots. So:
       from the marker onward if the model kept it; otherwise the LAST section
       under each heading, which is the answer, not the echo. The manifest
       comment is removed first or the final slot swallows it. */
    text = String(text || '').replace(/<!--\s*lite:slots[\s\S]*?-->/g, '');
    var at = text.search(/^\s*#\s+Feedback\b/m);
    var scoped = at >= 0;
    if (scoped) text = text.slice(at);
    var byName = {};
    man.forEach(function(s){ byName[norm(s.heading)] = s.id; });
    // a stage heading may come back as just the stage's name, or "Stage 3"
    man.forEach(function(s){
      var mm = s.heading.match(/^(Stage \d+|Vocabulary|Analysis \d+)\s+—\s+(.+)$/);
      if (mm) { byName[norm(mm[1])] = byName[norm(mm[1])] || s.id; byName[norm(mm[2])] = byName[norm(mm[2])] || s.id; }
    });
    var kinds = {}; slots(doc).forEach(function(s){ kinds[s.id] = s.kind; });
    var found = {}, unplaced = [];
    var secs = sections(text);
    if (!scoped) {
      // keep only the last section per heading
      var last = {}; secs.forEach(function(sec, i){ last[norm(sec.heading)] = i; });
      secs = secs.filter(function(sec, i){ return last[norm(sec.heading)] === i; });
    }
    secs.forEach(function(sec){
      /* Slots are H2. The plan's own headings are H3, and the marker is H1:
         a model that echoes the plan and strips the marker must not have its
         "### Stage 2 -- First test" read as an answer for stage 2. */
      if (sec.level !== 2) return;
      var id = byName[norm(sec.heading)];
      if (!id) {
        // the model dropped the dash? try the text after any dash
        var tail = sec.heading.split(/\s[—\-–]\s/).pop();
        id = byName[norm(tail)];
      }
      if (!id) { if (sec.text) unplaced.push(sec.heading); return; }
      if (!sec.text) return;                       // an empty slot leaves the box alone
      var kind = kinds[id] || 'text';
      if (kind === 'grade') {
        var g = GRADES.filter(function(x){ return norm(sec.text).indexOf(norm(x)) === 0 || norm(sec.text) === norm(x); })[0]
             || GRADES.filter(function(x){ return norm(sec.text).indexOf(norm(x)) >= 0; })[0];
        if (g) found[id] = g;
      } else if (kind === 'list') {
        found[id] = lines(sec.text).map(function(l){
          var star = /^[★☆*]\s*/.test(l);
          return { text: l.replace(/^[★☆*]\s*/, ''), star: star };
        });
      } else {
        found[id] = lines(sec.text).join('\n');
      }
    });
    return { found: found, unplaced: unplaced, manifest: man };
  }

  window.HubExchange = { brief: brief, planMarkdown: planMarkdown, slots: slots, read: read, sections: sections };
})();
