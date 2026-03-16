# Chinese Zodiac / Ba Zi Framework Reference

## Overview

Chinese astrology uses a system of heavenly stems and earthly branches in a 60-year (and 60-day) cycle called the sexagenary cycle. For Selfscape, the key computation is the **day master** (the heavenly stem of the day pillar), which determines the user's base world.

## The 12 Animal Years (Earthly Branches)

| Branch | Animal |
|--------|--------|
| Zi | Rat |
| Chou | Ox |
| Yin | Tiger |
| Mao | Rabbit |
| Chen | Dragon |
| Si | Snake |
| Wu | Horse |
| Wei | Goat |
| Shen | Monkey |
| You | Rooster |
| Xu | Dog |
| Hai | Pig |

**Calculation:** Year mod 12, with an offset. The cycle repeats every 12 years. Important: the Chinese zodiac year starts at Lunar New Year, NOT January 1. For births in January or February, check whether the date falls before or after that year's Lunar New Year.

**Lunar New Year dates (sample, need full table in implementation):**
- 2024: Feb 10
- 2025: Jan 29
- 1990: Jan 27
- 1995: Jan 31
- 2000: Feb 5

## The 10 Heavenly Stems (Day Master)

The heavenly stems cycle through 10 values, each combining an element with a polarity:

| Stem | Element | Polarity | Chinese Name |
|------|---------|----------|-------------|
| 1 | Wood | Yang | Jia |
| 2 | Wood | Yin | Yi |
| 3 | Fire | Yang | Bing |
| 4 | Fire | Yin | Ding |
| 5 | Earth | Yang | Wu |
| 6 | Earth | Yin | Ji |
| 7 | Metal | Yang | Geng |
| 8 | Metal | Yin | Xin |
| 9 | Water | Yang | Ren |
| 10 | Water | Yin | Gui |

## Day Master Calculation

The day pillar follows a 60-day sexagenary cycle (10 stems x 12 branches, but they cycle together, not as a full matrix). For the day master, we only need the heavenly stem (the element+polarity).

**Method:**
1. Choose a reference date with a known day stem. For example: January 1, 2000 = Stem 6 (Ji, Yin Earth). Verify this reference against a Ba Zi calculator.
2. Calculate the number of days between the reference date and the target birthdate.
3. Day stem index = (reference_stem_index + day_difference) mod 10
4. Look up the element and polarity from the stem table.

**Important:** This calculation is deterministic and computationally trivial. Standard date arithmetic, one modular operation, one table lookup.

## Day Master Base Worlds (10 total)

These are the visual themes for the world map base illustration:

### Yang Wood (Jia)
**Visual:** Towering ancient forest, massive trees reaching upward, strong vertical energy, sunlight breaking through canopy from above. Redwoods or sequoias.
**Mood:** Expansive, ambitious, upward-reaching, leadership
**Archetype:** The tall tree. Stands firm, provides shelter, reaches for the sky.

### Yin Wood (Yi)
**Visual:** Delicate garden, winding vines, wildflowers, bamboo groves, dappled light. Things growing around obstacles.
**Mood:** Flexible, graceful, adaptive, gentle persistence
**Archetype:** The vine or flower. Finds a way to grow no matter the obstacle.

### Yang Fire (Bing)
**Visual:** Blazing sunlit landscape, Mediterranean or desert city at high noon, everything saturated and vivid, bold shadows.
**Mood:** Generous, radiant, dramatic, commanding attention
**Archetype:** The sun. Illuminates everything, impossible to ignore.

### Yin Fire (Ding)
**Visual:** Candlelit, lantern-lit nighttime scene, fireflies, paper lanterns, glowing embers. Intimate warmth.
**Mood:** Intimate, flickering, revealing, transformative
**Archetype:** The candle flame. Small but mesmerizing, illuminates what's close.

### Yang Earth (Wu)
**Visual:** Grand mountain plateau, massive rock formations, terraced landscapes, ancient stone architecture.
**Mood:** Stable, immovable, monumental, reliable
**Archetype:** The mountain. Unshakable, provides perspective from the summit.

### Yin Earth (Ji)
**Visual:** Rolling farmland, gentle hills, soft clay paths, quiet village with gardens and pottery.
**Mood:** Nurturing, fertile, grounded, productive
**Archetype:** The garden soil. Nourishes everything planted in it.

### Yang Metal (Geng)
**Visual:** Crystalline cityscape, sharp geometric architecture, reflective surfaces, cold clear light.
**Mood:** Precise, decisive, austere, powerful
**Archetype:** The sword or axe. Cuts through confusion with decisive action.

### Yin Metal (Xin)
**Visual:** Intricate metalwork, moonlit scene, silver light, delicate bridges, ornate gates, frost.
**Mood:** Refined, precise, beautiful, exacting
**Archetype:** The jewel. Polished, valued, quietly radiant.

### Yang Water (Ren)
**Visual:** Ocean scene, massive waves, port city in storm, deep blues and greens, powerful currents.
**Mood:** Forceful, unstoppable, vast, adventurous
**Archetype:** The ocean. Goes everywhere, cannot be contained.

### Yin Water (Gui)
**Visual:** Misty lake, gentle rain, reflections everywhere, riverside village, morning fog, dew.
**Mood:** Intuitive, dreamy, perceptive, quietly deep
**Archetype:** The mist or dew. Subtle, pervasive, nourishing in ways you don't notice.

## Chinese Zodiac Animal Motifs

The user's Chinese zodiac animal appears as a motif in the world map scene (separate from the Western zodiac creature overlay):

| Animal | Motif Ideas |
|--------|------------|
| Rat | Small, clever figure near buildings. Market/trade elements. |
| Ox | Strong figure in agricultural/working context. |
| Tiger | Bold figure on a ridge or rooftop. Stripes in architectural patterns. |
| Rabbit | Gentle figure in a garden. Moon motifs. |
| Dragon | Sculptural/architectural dragon element. Cloud patterns. |
| Snake | Winding path or river element. Coiled decorative motif. |
| Horse | Figure in motion on open ground. Wind elements. |
| Goat | Figure among flowers/hills. Artistic/creative motifs. |
| Monkey | Playful figure in trees or on rooftops. |
| Rooster | Proud figure at dawn. Sun/morning motifs. |
| Dog | Loyal figure near a home/gate. Guardian motif. |
| Pig | Abundant/feast elements. Warm, generous scene details. |
