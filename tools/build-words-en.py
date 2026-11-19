# Builds library/words-en.txt for Lite's tutor autocorrect: one word per line, commonest first.
# Source: pyspellchecker 0.8.1 en.json.gz (MIT). Adds British spellings and CELTA terms, so neither is ever "fixed".
import gzip, json, re, sys
d = json.load(gzip.open(sys.argv[1]))
d = {w: c for w, c in d.items() if re.fullmatch(r"[a-z]+(?:'[a-z]+)?", w) and c >= 2}
add = {}
def br(a, b):
    if a in d and b not in d: add[b] = max(add.get(b, 0), d[a])
for w, c in list(d.items()):
    for s1, s2 in (('ization', 'isation'), ('izations', 'isations'), ('ize', 'ise'), ('izes', 'ises'), ('ized', 'ised'), ('izing', 'ising'), ('izer', 'iser'), ('izers', 'isers'),
                   ('yze', 'yse'), ('yzed', 'ysed'), ('yzes', 'yses'), ('yzing', 'ysing')):
        if w.endswith(s1) and len(w) > len(s1) + 2: br(w, w[:-len(s1)] + s2)
OUR = 'color favor behavior neighbor honor labor humor rumor flavor harbor vapor savor endeavor armor odor vigor rigor splendor valor clamor parlor'.split()
for w in list(d):
    for st in OUR:
        if w.startswith(st): br(w, st[:-2] + 'our' + w[len(st):])
for st in 'travel cancel label model signal fuel counsel level equal dial duel marvel quarrel tunnel total channel shovel'.split():
    for a, b in (('ed', 'led'), ('ing', 'ling'), ('er', 'ler'), ('ers', 'lers')): br(st + a, st + b)
PAIRS = '''center centre|centers centres|centered centred|theater theatre|theaters theatres|meter metre|meters metres|liter litre|liters litres|fiber fibre|caliber calibre|
defense defence|offense offence|license licence|catalog catalogue|dialog dialogue|analog analogue|gray grey|mold mould|plow plough|tire tyre|tires tyres|check cheque|
aluminum aluminium|maneuver manoeuvre|program programme|programs programmes|jewelry jewellery|pajamas pyjamas|mom mum|moms mums|math maths|cozy cosy|skeptical sceptical|
judgment judgement|aging ageing|enroll enrol|enrollment enrolment|fulfill fulfil|skillful skilful|willful wilful|installment instalment|practice practise|practiced practised|
practicing practising|learned learnt|spelled spelt|dreamed dreamt|burned burnt|among amongst|while whilst|story storey|draft draught|airplane aeroplane|curb kerb|
focused focussed|focusing focussing|neighborhood neighbourhood|traveling travelling|favorite favourite|favorites favourites|organization organisation|apologize apologise|
mustache moustache|gage gauge|ax axe|donut doughnut|whiskey whisky|tidbit titbit|sulfur sulphur|esthetic aesthetic|pediatric paediatric|encyclopedia encyclopaedia|
anemia anaemia|fetus foetus|estrogen oestrogen|routing routeing|annex annexe|artifact artefact|cookie biscuit|toward towards|afterward afterwards'''.replace('\n', '').split('|')
for p in PAIRS:
    a, b = p.split(); br(a, b)
CELTA = '''ccq ccqs icq icqs ocfb ttt stt pw gw ss elicit elicits elicited eliciting elicitation lexis lexical lexically fossilisation fossilization fossilised fossilized
homeschooled homeschooling timeline timelines chunked chunking mingle mingles mingling drillable boardwork gapfill gapfills jigsaw substage substages subskill subskills
subaim subaims prestage pretask posttask prereading postreading prelistening postlistening scaffolded scaffolding realia monolingual multilingual tefl celta delta tesol
plenary plenaries nominate nominates nominated nominating nomination wh contrastive phonemic phonemically schwa diphthong diphthongs monophthong intonation contractions
contracted connected collocation collocations collocate collocates colligation gerund gerunds infinitive infinitives modals modal premodified deixis anaphoric catenative
ind oc todo org gapped gapfill gapfills pairwork groupwork pairs groupings regroup regrouping minimal appropriacy tellings meetup meetups resize usernames username bulleted kilometre kilometres centimetre centimetres millimetre millimetres metre metres sceptic sceptics tumour tumours vapour vapours rumour rumours odour odours etc min mins intro intros vocab tech admin info approx max app apps eg ie vs esp sth smth sb smb pron adj adv prep conj tbc asap hr hrs sec secs wk wks ex exs pp ok youtube gif gifs wifi peer peers trainee trainees tutee mct act assessor assessors tp tps la las mfp ppp tbl ttt eslo cefr ielts toefl cambridge ok okay email emails online'''.split()
top = max(d.values())
for w in CELTA: add[w] = max(add.get(w, 0), d.get(w, 0), 5000)
d.update(add)
words = sorted(d, key=lambda w: -d[w])
open(sys.argv[2], 'w').write('\n'.join(words) + '\n')
print(len(words), 'words |', len(add), 'added |', sum(len(w) + 1 for w in words), 'bytes')
for t in ['colour', 'realise', 'centre', 'licence', 'travelled', 'favourite', 'behaviour', 'organisation', 'practise', 'learnt', 'ccq', 'elicitation', 'grey', 'judgement']:
    print(t, t in d, end=' | ')
