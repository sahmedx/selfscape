# Western Zodiac Framework Reference

## Overview

Western zodiac assigns one of 12 sun signs based on birthdate. Each sign belongs to an element (fire, earth, air, water) and a modality (cardinal, fixed, mutable).

## Signs

| Sign | Dates | Element | Modality |
|------|-------|---------|----------|
| Aries | Mar 21 - Apr 19 | Fire | Cardinal |
| Taurus | Apr 20 - May 20 | Earth | Fixed |
| Gemini | May 21 - Jun 20 | Air | Mutable |
| Cancer | Jun 21 - Jul 22 | Water | Cardinal |
| Leo | Jul 23 - Aug 22 | Fire | Fixed |
| Virgo | Aug 23 - Sep 22 | Earth | Mutable |
| Libra | Sep 23 - Oct 22 | Air | Cardinal |
| Scorpio | Oct 23 - Nov 21 | Water | Fixed |
| Sagittarius | Nov 22 - Dec 21 | Fire | Mutable |
| Capricorn | Dec 22 - Jan 19 | Earth | Cardinal |
| Aquarius | Jan 20 - Feb 18 | Air | Fixed |
| Pisces | Feb 19 - Mar 20 | Water | Mutable |

## Creature Overlays for World Map

Each sign's animal or symbol becomes a creature/motif in the world map scene:

| Sign | Creature/Motif |
|------|---------------|
| Aries | Ram |
| Taurus | Bull |
| Gemini | Twins (two figures) |
| Cancer | Crab |
| Leo | Lion |
| Virgo | Maiden (figure with wheat/harvest) |
| Libra | Scales (architectural/sculptural element) |
| Scorpio | Scorpion |
| Sagittarius | Archer (centaur) |
| Capricorn | Sea-goat |
| Aquarius | Water bearer (figure with vessel) |
| Pisces | Fish (pair) |

## Display in Selfscape

Since Western zodiac is auto-computed from birthdate, the user's world shows:
- Their zodiac creature as an overlay element in the world map scene
- A brief evocative description (not a horoscope, but an archetypal sketch)
- Their element and modality as contextual flavor

## Calculation

Simple date range lookup. No edge cases beyond confirming the exact cutoff dates (which vary slightly by year for those born on cusp dates). For MVP, use the standard date ranges above.
