# The signature faces

Five open-licensed script faces. `hub-hand.js` gives each signer one of them,
chosen from their own token, so a signature belongs to the person rather than
to their name.

**All five write Turkish.** That is why they are the five. Four prettier
signature faces were tried and dropped because they have no `ş`, `ğ` or `İ` at
all, and a centre in Istanbul cannot hand a candidate a signature with letters
missing from their name: Mr De Haviland, Mrs Saint Delafield, Herr Von
Muellerhoff and Homemade Apple.

Every one is licensed under the **SIL Open Font License, Version 1.1**. Each
face's own licence, with its own copyright line, is in `OFL-<face>.txt`.

| file | family | copyright | shipped as |
|---|---|---|---|
| `allura.ttf` | Allura | 2010 The Allura Project Authors | subset |
| `caveat.ttf` | Caveat | 2014 The Caveat Project Authors | subset, **layout features removed** |
| `parisienne.ttf` | Parisienne | 2012 Brian J. Bonislawsky, Astigmatic (AOETI) | **whole** |
| `sacramento.ttf` | Sacramento | 2012 Brian J. Bonislawsky, Astigmatic (AOETI) | **whole** |
| `zeyada.ttf` | Zeyada | 2010 Kimberly Geswein | subset |
| `greatvibes.ttf` | Great Vibes | 2015 The Great Vibes Pro Project Authors | subset, `--layout-features='*'`; the tutors' face since 8 Oct 2026, in #141e50 |

## Why two of them are not subsetted

The OFL lets anyone bundle, subset and modify these fonts. It also says a
**Modified Version must not use a Reserved Font Name**. Parisienne and
Sacramento each declare one — "Parisienne" and "Sacramento" — and subsetting
makes a modified version, so a subset of either could not keep its own name.
They are therefore shipped exactly as they arrived from Google Fonts, which
makes them unmodified and the name theirs to keep. The other three declare no
reserved name, so they are subsetted to the characters a name holds.

The cost of that decision is about 70 KB. All five together are ~258 KB.

## Why Caveat has its layout features stripped

Caveat's own contextual rules break names. Set through pdf-lib and fontkit —
the pair that draws Cambridge's booklet — `Gül Öztürk` came out as `Özt ürk`,
`Mustafa` as `Must afa` and `Şebnem` as `Şebn em`: a blank where a letter
should be, with the total width unchanged, so a substituted glyph was being
drawn as nothing. The unsubsetted original does it too, so this is Caveat's,
not the subsetter's. Subsetting with `--layout-features=` (none) fixes every
case, on screen and on the booklet alike.

The other four were checked the same way — every face against every character
of the set, and five Turkish names rendered and looked at in both the browser
and a PDF — and none of them has the fault, so they keep their kerning.

Found 6 Oct 2026, by rasterising the PDF and looking at it. Nothing in the
glyph-coverage check caught it: every face reports that it can write every
character, because the glyph is there and it is the layout that loses it.

## Rebuilding these files

```
pyftsubset <Family>.ttf --unicodes=<the Latin + Turkish + European set> \
    --layout-features='*' --output-file=fonts/<face>.ttf      # allura, zeyada
pyftsubset Caveat.ttf   --unicodes=<same> --layout-features= \
    --output-file=fonts/caveat.ttf                            # no features
```

Parisienne and Sacramento are copied in whole, unmodified. See above.
