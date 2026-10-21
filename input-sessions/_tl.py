# The target language, marked in green (Ramy, 21 Oct 2026: "make sure the
# marker sentences are highlighted in a different colour, e.g. green. Today the
# trainees were analysing certain examples of language but the TL was not
# highlighted"). TL[slug] is a list of (old, new) literal strings applied to a
# built page after the aliases; every `old` must be there. The wrap is
# <span class="hl-tl">, styled in session.css. Inside the pages' scripts the
# curly apostrophe is written as a backslash-u2019, so those strings are raw.
def tl(s):
    return '<span class="hl-tl">' + s + '</span>'

TL = {}

TL['eliciting-and-ccqs'] = [
    # the model on the slide
    ('<b>He managed to open the jar.</b>', 'He ' + tl('managed to') + ' open the jar.'),
    # Task A: the answers the CCQs point to
    ("answer:'He’s been working there for two years. (Not: He’s worked there",
     "answer:'" + tl("He’s been working") + " there for two years. (Not: " + tl("He’s worked") + " there"),
    ("answer:'She had her car washed. (or: She got her car washed.)'",
     "answer:'She " + tl('had her car washed') + ". (or: She " + tl('got her car washed') + ".)'"),
    ("answer:'We needn’t have cooked so much food.",
     "answer:'We " + tl('needn’t have cooked') + " so much food."),
    # Task B: the sentences the weak CCQs were written for
    ("sentence:'She’s known Tomás since school.'", "sentence:'" + tl('She’s known') + " Tomás " + tl('since') + " school.'"),
    ("sentence:'If he hadn’t lost his keys, he would have caught the train.'",
     "sentence:'" + tl('If') + " he " + tl('hadn’t lost') + " his keys, he " + tl('would have caught') + " the train.'"),
    ("sentence:'She’s always losing her phone!'", "sentence:'" + tl('She’s always losing') + " her phone!'"),
    # the worksheet: seven sentences to analyse
    ("'1. He used to bite his nails.'", "'1. He " + tl('used to bite') + " his nails.'"),
    ("'2. She felt embarrassed when", "'2. She " + tl('felt embarrassed') + " when"),
    ("'3. I wish I was on a beach.'", "'3. I " + tl('wish I was') + " on a beach.'"),
    (r"'4. He\u2019s looking forward to the school trip.'", r"'4. " + tl(r"He\u2019s looking forward to") + " the school trip.'"),
    (r"'5. She\u2019s been to Reykjavik.'", r"'5. " + tl(r"She\u2019s been to") + " Reykjavik.'"),
    (r"'6. She couldn\u2019t stand his snoring.'", r"'6. She " + tl(r"couldn\u2019t stand") + " his snoring.'"),
    ("it had been snowing.'", "it " + tl('had been snowing') + ".'"),
]

TL['functional-language'] = [
    ('<li>Can you pass me the salt, please?</li>', '<li>' + tl('Can you pass me') + ' the salt, ' + tl('please') + '?</li>'),
    ('<li>You should rest at home.</li>', '<li>You ' + tl('should rest') + ' at home.</li>'),
    ("<li>If only I'd been more patient with him.</li>", '<li>' + tl("If only I'd been") + ' more patient with him.</li>'),
    ('“Can you pass me the salt, please?”', '“' + tl('Can you pass me') + ' the salt, ' + tl('please') + '?”'),
    ('“You should rest at home.”', '“You ' + tl('should rest') + ' at home.”'),
    ("“If only I'd been more patient with him.”", '“' + tl("If only I'd been") + ' more patient with him.”'),
]

TL['lesson-framework'] = [
    ('example: "used to / play / basketball / I / every day."', 'example: "' + tl('used to') + ' / play / basketball / I / every day."'),
    ('example: "I used to / would play basketball."', 'example: "I ' + tl('used to / would play') + ' basketball."'),
    ('example: "I used playing basketball every day."', 'example: "I ' + tl('used playing') + ' basketball every day."'),
]
