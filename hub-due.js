/* Deadlines: one place that knows what one means.
 *
 * Ramy, 24 Sep 2026, with a real cohort on Lite in two weeks and the links
 * going out through Classroom: "is there a way we can set up deadlines also in
 * here... once they pass that line, they can't submit without the trainer's
 * override... the pill goes red. Some kind of a countdown. A reminder, not a
 * warning."
 *
 * A REMINDER, NOT A WARNING, is the whole tone of this file. Nothing here
 * scolds. It says when a thing is due and how long is left, it goes quiet when
 * there is plenty of time, and it is plain rather than red until the day.
 *
 * Three things worth knowing:
 *
 * 1. A DEADLINE IS AN INSTANT, not a wall-clock time. It is stored as an ISO
 *    string with an offset, taken from the tutor's own browser when they set
 *    it, and rendered in each reader's local time. A tutor setting 23:00 in
 *    Istanbul and a candidate reading it in London see the same moment, each
 *    in their own clock. There is no timezone setting to get wrong, and
 *    nobody's phone being in the wrong place moves the deadline.
 *
 * 2. THE CHECK IS HONEST, NOT LOCKED. Lite is a static site: this runs in the
 *    browser, off the device's own clock, so a determined candidate could get
 *    past it by changing their clock. Making it real means the Apps Script
 *    store refusing a late write, which is a separate job on the store. For a
 *    deadline that is a professional expectation rather than an exam
 *    condition, this is the honest version -- and it is why nothing here ever
 *    claims a submission was "blocked", only that it is closed and the tutor
 *    can open it.
 *
 * 3. AN EXTENSION IS PER CANDIDATE and belongs to the tutor. It lives in that
 *    candidate's `tracker` record, which hub-sync lists as TUTOR_ONLY -- the
 *    tutor writes it, the candidate reads it and cannot write it back. Giving
 *    one person more time must never quietly give it to everyone.
 */
(function(){
  var MIN = 60000, HOUR = 60 * MIN, DAY = 24 * HOUR;

  function parse(v){
    if (!v) return null;
    var t = (v instanceof Date) ? v.getTime() : Date.parse(v);
    return isFinite(t) ? t : null;
  }

  /* What a <input type="datetime-local"> gives back is wall-clock text with no
     zone. It is read as the SETTER's local time, which is the intended
     meaning, and stored with that offset so it stays the same instant
     everywhere afterwards. */
  function fromLocalInput(s){
    if (!s) return '';
    var d = new Date(s);
    return isFinite(d.getTime()) ? d.toISOString() : '';
  }
  /* ...and back again, for the same box. toISOString() would show UTC, which
     is how a 23:00 deadline turns into 20:00 in the field that set it. */
  function toLocalInput(iso){
    var t = parse(iso); if (t === null) return '';
    var d = new Date(t - d0(t));
    return d.toISOString().slice(0, 16);
  }
  function d0(t){ return new Date(t).getTimezoneOffset() * MIN; }

  function fmt(iso){
    var t = parse(iso); if (t === null) return '';
    var d = new Date(t);
    return d.toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short' })
      + ', ' + d.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' });
  }

  /* "3 days left", "4 hours left", "closed yesterday". Rounded the way a person
     reads a clock, and never to the minute at a distance -- "2 days and 7
     hours" is not how anyone thinks about Thursday. */
  function left(ms){
    var a = Math.abs(ms), s;
    if (a >= 2 * DAY)      s = Math.round(a / DAY) + ' days';
    else if (a >= DAY)     s = Math.floor(a / DAY) + ' day';
    else if (a >= 2 * HOUR) s = Math.round(a / HOUR) + ' hours';
    else if (a >= HOUR)    s = '1 hour';
    else if (a >= 2 * MIN) s = Math.round(a / MIN) + ' minutes';
    else                   s = 'a minute';
    return s;
  }

  /* The state a thing is in, and nothing more: what to SAY about it is each
     screen's business. `soon` is the last 24 hours -- the point at which a
     reminder is useful rather than noise. */
  function state(iso, now){
    var t = parse(iso);
    if (t === null) return { has:false, past:false, soon:false, due:'', text:'' };
    now = now || Date.now();
    var ms = t - now, past = ms <= 0;
    return {
      has: true, at: t, past: past,
      soon: !past && ms <= DAY,
      due: fmt(iso),
      ms: ms,
      text: past ? 'closed ' + left(ms) + ' ago' : left(ms) + ' left'
    };
  }

  /* The deadline that actually applies to one person: their own extension
     wherever the tutor has given one, otherwise the course's. An extension
     EARLIER than the deadline is ignored -- it can only ever give time, never
     take it away, whatever is in the record. */
  function forPerson(iso, extensionIso){
    var base = parse(iso), ext = parse(extensionIso);
    if (base === null) return { iso: extensionIso || '', extended: !!ext };
    if (ext === null || ext <= base) return { iso: iso, extended: false };
    return { iso: extensionIso, extended: true };
  }

  /* Days from when the tutor returned it, which is how a resubmission window
     actually works: the return date differs per candidate, so a fixed date
     cannot serve them all, and Handbook 9.2.3 wants the resubmission inside
     the span of the course. */
  function windowFrom(returnedAt, days){
    var t = parse(returnedAt), n = parseFloat(days);
    if (t === null || !isFinite(n) || n <= 0) return '';
    return new Date(t + n * DAY).toISOString();
  }

  window.HubDue = {
    parse: parse, state: state, fmt: fmt, left: left,
    fromLocalInput: fromLocalInput, toLocalInput: toLocalInput,
    forPerson: forPerson, windowFrom: windowFrom,
    DAY: DAY, HOUR: HOUR, MIN: MIN
  };
})();
