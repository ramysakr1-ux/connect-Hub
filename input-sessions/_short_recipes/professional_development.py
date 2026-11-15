# Connect's 45-minute "Professional development & career advice" (src/app/input-sessions/sessions/professional-development.tsx),
# on Lite's desk. Content word for word, American spelling; the four topic cards (pick one, or Previous and Next) work as
# they do on Connect, and the resource sheet below them lists everything. Connect gives this session no agenda and no
# trainer notes, only the Running this session box.
TITLE = 'Professional development &amp; career advice: life after the certificate'
LONG = 'life-after-celta'
SUB = ('Lighter than the rest of this course, on purpose. Four groups, four topic cards, each group reads theirs and comes back with two things '
       'worth telling the room. Everyone leaves with the full resource sheet below to keep.')
NAV = [('s1', '1 · Topic cards'), ('s2', '2 · Share-back'), ('s3', '3 · Resource sheet')]

NOTES = '''<h4>Running this session</h4>
<p>Split into four groups, assign one card each (click a card below to claim it). ~10 minutes to read and discuss, ~10 minutes to share back: one interesting thing, one question the group couldn't answer for the room to help with. No formal task, no marking. Print or share the resource sheet at the bottom afterwards: that's the actual takeaway.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Pick a card, or click through all four yourself</div>
      <div class="picks" id="picks"></div>
      <div class="topic" id="topic"></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Whole-group share-back <span class="badge">~10 minutes</span></div>
      <p class="lead">Each group: one thing worth telling the room, one question you couldn’t answer. See if another group’s card answers it.</p>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Take-away resource sheet: everything above, on one page</div>
      <p class="lead">Print this section, or scroll it on your own device. No login, no course-specific info: just links.</p>
      <div id="sheet"></div>
      <div class="caution">
        <span class="cl">A general caution, not specific to any site above</span>
        <p>A legitimate school pays your salary: it never asks you to pay it for a job, a visa, or a “placement fee” upfront. Get any contract reviewed before signing, and don’t hand over an original passport or degree certificate for someone else to hold: copies only, unless a consulate itself requires the original.</p>
      </div>
      <p class="small">This list points to third-party websites Lite doesn’t control: check details directly with each one, rules and fees change.</p>
    </div>
  </section>
'''

STYLE = r'''
  .picks{display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin:6px 0 14px;}
  @media(max-width:700px){ .picks{grid-template-columns:1fr 1fr;} }
  .pick{display:flex; flex-direction:column; gap:4px; text-align:left; background:transparent; border:1.5px solid var(--sand-line); padding:10px 14px; cursor:pointer; color:var(--ink);}
  .pick:hover{border-color:var(--gold);}
  .pick.on{border-color:var(--teal); background:var(--paper);}
  .pick .tg, .topic .tg{font-size:.68rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  .pick .tg.red, .topic .tg.red{color:var(--a-red);}
  .pick .tt{font-weight:600; font-size:.92rem; line-height:1.3;}
  .topic{background:var(--paper); border:1.5px solid var(--sand-line); border-top:3px solid var(--teal); border-radius:var(--r-strip); padding:16px 18px;}
  .topic .th{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .topic h3{margin:0; font:600 1.35rem/1.25 'Newsreader',Georgia,serif;}
  .topic .of{font-size:.76rem; color:var(--grey);}
  .topic .intro{margin:8px 0 10px; font-size:.9rem; line-height:1.55; color:var(--grey);}
  .item{background:var(--box); border-radius:8px; padding:9px 14px; margin:0 0 8px;}
  .item b{display:block; font-size:.92rem;} .item span{display:block; font-size:.86rem; line-height:1.5; color:var(--grey);}
  .bring{border-top:1px solid var(--row-line); margin-top:10px; padding-top:8px; font-size:.88rem;}
  .bring b{display:block; color:var(--grey); font-size:.84rem;}
  .sheetgroup h4{margin:16px 0 4px; font:600 1.05rem 'Newsreader',Georgia,serif; color:var(--ink);}
  .srow{display:flex; gap:12px; align-items:baseline; padding:8px 0; border-bottom:1px solid var(--row-line);}
  .srow b{min-width:190px; flex:none; font-size:.9rem;} .srow span{flex:1; font-size:.86rem; line-height:1.5; color:var(--grey);}
  @media(max-width:560px){ .srow{flex-direction:column; gap:2px;} .srow b{min-width:0;} }
  .caution{margin-top:18px; border:1.5px solid color-mix(in oklab, var(--a-red) 35%, var(--paper)); background:color-mix(in oklab, var(--a-red) 4%, var(--paper)); border-radius:var(--r-strip); padding:12px 16px;}
  .caution .cl{display:block; font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--a-red); margin-bottom:4px;}
  .caution p{margin:0; font-size:.88rem; line-height:1.55;}
  .small{text-align:center; font-size:.78rem; color:var(--grey); margin:14px 0 0;}
  @media print{ #picks, #topic .btn-row{display:none !important;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// [tag, title, intro, items [name, note], prompt, accent]
const CARDS = [
  ['Finding work', 'Job boards & recruiters', 'Where actual vacancies get posted: general boards, and country-specific ones for popular destinations.', [
    ['tefl.com', 'The longest-running dedicated TEFL job board: updated daily, searchable by country and by online/in-person.'],
    ['Dave’s ESL Café', 'One of the oldest ESL community sites: job board plus a long-running forum of teachers discussing specific schools and cities.'],
    ['TEFL Jobs Centre (tefl.org)', 'Weekly-updated listings across dozens of countries, plus write-ups of what a normal contract looks like in each.'],
    ['Teast', 'Aggregates listings from schools and recruiters worldwide, including a lot of Asia and Southeast Asia postings.']],
    'Pick one listing on any of these sites and check: does it name a real school, or just a vague “teach abroad” recruiter? That distinction matters.', false],
  ['Before you go', 'Visas & country requirements', 'Requirements vary enormously by country: degree requirements, sponsorship, and how the process actually works.', [
    ['Degree usually required', 'Most of Asia (China, South Korea, Japan, Vietnam) and the Middle East legally require a bachelor’s degree for a teaching work visa, regardless of TEFL/CELTA. The subject of the degree doesn’t matter.'],
    ['Countries that don’t require one', 'Cambodia, parts of Latin America, and some private academies in Spain will hire on a TEFL/CELTA certificate alone: worth knowing if you don’t have a degree.'],
    ['Get the job first, in most of Asia', 'Work visas there are usually employer-sponsored and issued only once you have a signed contract: you generally shouldn’t travel first hoping to find work locally.'],
    ['Ask the embassy directly if unsure', 'Country guides online are a starting point, but rules change: the destination country’s embassy or consulate website is the actual source of truth before you commit to anything.']],
    'Whoever picked this card: name one country in the group where a degree is required, and one where it isn’t.', false],
  ['Staying sharp', 'Keep developing after CELTA', 'CELTA is a start, not an endpoint: real growth mostly comes from what you do in the first year or two after it.', [
    ['DELTA', 'Cambridge’s advanced diploma: the natural next qualification once you have real teaching experience (usually a year or more), aimed at senior teacher / trainer / academic manager roles.'],
    ['IATEFL', 'The main international ELT association: an annual conference plus year-round Special Interest Groups (SIGs) on specific areas like young learners, technology, or teacher training.'],
    ['“What They Don’t Teach You on CELTA”', 'A well-known blog/resource project addressing exactly the gaps a one-month course can’t cover, genuinely written for teachers a few months past CELTA, not before it.'],
    ['A supportive Director of Studies', 'The single biggest factor in whether your first year actually develops you: worth asking about mentoring and observation support directly in any job interview, not just salary and hours.']],
    'Whoever picked this card: what’s one thing you’d actually ask a new employer about, based on this list, that you wouldn’t have thought to ask before?', false],
  ['Staying safe', 'Red flags & scams to watch for', 'Most jobs are legitimate, but the industry has enough of a scam fringe that it’s worth a checklist before signing anything.', [
    ['Never pay for a job', 'A legitimate employer pays you, not the other way round. Any “placement fee,” “registration fee,” or “visa processing fee” charged to you directly is a warning sign.'],
    ['Get the contract in writing, in a language you read', 'Salary, hours, notice period, and who pays for flights/housing should all be explicit: verbal promises from a recruiter aren’t the contract.'],
    ['Don’t surrender original documents', 'Some disreputable employers hold a teacher’s original passport or degree certificate as informal leverage. Copies only, unless an actual consulate requires the original for a visa step.'],
    ['Search the school’s name before accepting', 'A quick search for “[school name] + reviews” or checking it on Dave’s ESL Café forums surfaces most patterns of past teachers’ complaints.']],
    'Whoever picked this card: which of these four would you never have thought to check yourself before this?', true]
];

let idx = 0;
function draw(){
  $('picks').innerHTML = CARDS.map((c, i) => '<button type="button" class="pick' + (i === idx ? ' on' : '') + '" data-c="' + i + '"><span class="tg' + (c[5] ? ' red' : '') + '">' + esc(c[0]) + '</span><span class="tt">' + esc(c[1]) + '</span></button>').join('');
  const c = CARDS[idx];
  $('topic').innerHTML = '<div class="th"><h3>' + esc(c[1]) + '</h3><span class="of">Card ' + (idx + 1) + ' of 4</span></div>'
    + '<p class="intro">' + esc(c[2]) + '</p>'
    + c[3].map(it => '<div class="item"><b>' + esc(it[0]) + '</b><span>' + esc(it[1]) + '</span></div>').join('')
    + '<div class="bring"><b>Bring back to the room</b>' + esc(c[4]) + '</div>'
    + '<div class="btn-row"><button type="button" class="btn" data-step="-1">Previous</button><button type="button" class="btn" data-step="1">Next</button></div>';
}
$('picks').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; idx = +b.dataset.c; draw(); });
$('topic').addEventListener('click', e => { const b = e.target.closest('[data-step]'); if (!b) return; idx = (idx + +b.dataset.step + CARDS.length) % CARDS.length; draw(); });
draw();

$('sheet').innerHTML = CARDS.map(c => '<div class="sheetgroup"><h4>' + esc(c[1]) + '</h4>' + c[3].map(it => '<div class="srow"><b>' + esc(it[0]) + '</b><span>' + esc(it[1]) + '</span></div>').join('') + '</div>').join('');
'''
