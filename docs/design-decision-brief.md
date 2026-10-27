# Design direction — decision brief

**Status:** awaiting client decision · **Date:** 2026-10-27
**Blocks:** all component and page work in `apps/storefront`
**Related:** [`design.md`](../design.md) · [`copy-design.md`](../copy-design.md) · [`prd.md`](../prd.md)

Two documents in the repo ask for opposite visual systems. Tokens are currently written for
**A (`design.md`)**. Nothing visual has been built, so switching to B costs a token rewrite,
not a rebuild — but it has to be decided before components exist.

---

## The two candidates

| | **A — `design.md`** (warm quiet luxury) | **B — `copy-design.md`** (vibrant dark) |
|---|---|---|
| Stated vibe | editorial, calm, magazine-like | vibrant, modern, retail-promo |
| Background | `#F7F3EC` warm ivory | `#000000` pure black |
| Accent | `#B08D57` gold, decorative only | `#E01A2B` red, used for CTAs |
| Type | Cormorant Garamond + Inter, Noto Naskh / IBM Plex Sans Arabic | "Macys Sans" 25px/14px, no Arabic face specified |
| Shape | sharp corners, thin rules | 5px buttons, 8px cards, 63px pill inputs, `scale(1.1)` hover |
| Density | generous whitespace, full-bleed imagery | 4px grid, max-width 1480, soft elevation |
| Contrast | all text pairs ≥ 4.9:1 | body text pairs at 4.1–4.2:1 (fails AA) |

---

## Evidence that B is not a client brief

`copy-design.md` reads as an automated design-token extraction from `macys.com`, not a
direction written for Zaya Luxe. Four tells:

1. It contains ~25 `--chat-messenger-*` tokens (Google Messages' in-page chat widget variables)
   and a `#0b57d0` blue that appears nowhere in the stated palette.
2. It ends with "Attach the screenshot from this page as a visual reference" and
   "This is for my personal project" — extraction-tool boilerplate.
3. "Macys Sans" is Macy's licensed corporate typeface and is not licensable for us; the brief
   specifies no Arabic typeface at all, which cannot ship a bilingual storefront.
4. The component list describes Macy's structure (skinny dropdown, holiday wardrobe slideshow),
   not a Qatar luxury retailer's.

This matters because B is being treated as a client instruction in the task list. If the client
genuinely wants a dark, high-energy direction, it should be re-briefed in our own terms —
palette, Arabic type, radii, motion — not adopted from a scraped token dump.

---

## Accessibility, measured

Contrast ratios computed from the hex values (WCAG 2.1, AA needs 4.5:1 for body text, 3:1 for
large text and UI components):

| Pair | Ratio | AA body | AA large |
|---|---|---|---|
| A: `#14110F` ink on `#F7F3EC` ivory | 17.0:1 | pass | pass |
| A: `#5C554C` muted on `#F7F3EC` | 6.1:1 | pass | pass |
| A: `#B08D57` gold on `#F7F3EC` | 2.4:1 | **fail** — documented as decorative-only | **fail** — never used for text |
| B: `#ECEFF1` text on `#000000` | 18.2:1 | pass | pass |
| B: `#6E6E6E` muted on `#000000` | 4.1:1 | **fail** | pass |
| B: `#ECEFF1` on `#E01A2B` (white on red button) | 4.2:1 | **fail** | pass |
| B: `#E01A2B` on `#000000` | 4.4:1 | **fail** | pass |

B is shippable, but not as specified: the muted grey and the white-on-red button need darkening
or resizing before they can be used for real copy. A's only failure is already handled — gold is
excluded from text roles in the token file.

---

## Recommendation

**Build on A (`design.md`).** Reasons, in order of weight:

1. It is the only one of the two written as a direction for this business — bilingual, QAR,
   delivery-and-duties transparency, mobile-first in a hot climate with heavy WhatsApp traffic.
2. Its contrast maths hold; B's do not without edits.
3. Luxury positioning in Qatar reads warm and restrained. Pure black with a red CTA reads
   discounted, which fights the `prd.md` price positioning.
4. It survives Arabic. B's display type has no Arabic counterpart, so the RTL layout — half the
   product — would fall back to a generic system font.

**What to borrow from B if the client wants more energy** (all compatible with A's tokens):
the 1480px max-width, the 4/8px spacing rhythm, soft elevation on product cards at hover, and a
single full-bleed gradient moment on the hero — using A's ink→clay ramp rather than `#E01A2B`.

**If the client picks B instead**, these change before component work starts: palette and
radii tokens, the display typeface (needs a licensed sans with an Arabic sibling — Inter + IBM
Plex Sans Arabic both work in dark), button contrast, `prefers-reduced-motion` handling for the
`scale(1.1)` hover, and the photography brief (bright cut-outs, not editorial light). Estimate:
half a day of token work, then the same component build either way.

---

## Decision needed

- [ ] Client confirms **A**, or re-briefs a dark direction in our own terms
- [ ] If A: adopt the four borrowings above, or drop them — say which
- [ ] On decision: rewrite `design.md` §2/§3 to the agreed numbers and delete `copy-design.md`
      from the repo (it is a scraped artifact, not an input we should keep alongside the source
      of truth)
