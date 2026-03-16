# Selfscape

## What This Is

Selfscape is a mobile-first, visually immersive personality profile experience. Users enter their birthdate and explore a painterly illustrated world map where each personality framework (Chinese zodiac, Western zodiac, Big Five, Enneagram, MBTI) is a distinct "world" to visit. Completing each world transforms the map and builds toward a unified personality portrait that users can share, like Spotify Wrapped for self-knowledge.

## Core Principles

- **No free text fields anywhere.** Every input is a tap, swipe, or scroll-wheel selection.
- **Binary card swiping** for all assessments. Two options, swipe left or right, Hinge-style. No spectrum, no Likert scales.
- **Mobile first**, responsive to desktop.
- **Painterly aesthetic.** Full-bleed illustrated backgrounds in an impressionistic, Simile-inspired style. The world IS the profile.
- **Game-like experience.** World map hub (like Super Mario Bros. world select), progressive reveal, character-creation feel.
- **The illustration is the profile.** The user's results shape the visual world they see, not charts or readouts.
- **Instant gratification.** Birthdate entry immediately unlocks zodiac layers before any quiz begins.

## Tech Stack

- **Framework:** React with Next.js
- **Styling:** Tailwind CSS
- **Swipe interactions:** `motion` (v12) for drag gestures and card animations
- **Zodiac/Ba Zi calculations:** Client-side JavaScript (lookup tables + modular arithmetic)
- **LLM synthesis:** Claude API for real-time narrative generation
- **Image compositing:** CSS filters, blend modes, absolutely positioned transparent overlays
- **Share card generation:** HTML Canvas or server-side image generation
- **No backend for MVP.** No accounts, no persistence. All state lives in the browser session.

## Visual Design

- See @docs/design-decisions.md

## Architecture Overview

### Input Flow
1. Birthdate picker (scroll wheels for month/day/year, no typing)
2. Auto-compute: Western sun sign, Chinese zodiac animal year, Ba Zi day master (element + polarity)
3. Day master determines which of 10 base world illustrations to show

### World Map Hub
- Central navigation screen styled as a painterly illustrated map
- Five world nodes: Western Zodiac, Chinese Zodiac, Big Five, Enneagram, MBTI
- Zodiac worlds auto-complete from birthdate (already "discovered")
- Other worlds start muted/fog-covered, illuminate when completed
- Map visually transforms as worlds are completed via layered compositing

### Framework Worlds

**Western Zodiac** (auto-completed)
- Adds zodiac animal creature overlay to world map
- Tap in to read sign profile

**Chinese Zodiac** (auto-completed)
- Day master sets the base world (1 of 10)
- Chinese zodiac animal appears as motif/sculpture in scene
- Tap in to read Ba Zi profile

**Big Five** (~10 binary swipe cards)
- Simplified TIPI-inspired instrument
- Each card: two evocative scenario statements, swipe toward the one that fits
- Scores five dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- Results modify world map atmosphere via overlays and CSS filters

**Enneagram** (~6-7 interactions)
- Screen 1: Three illustrated cards for gut/heart/head centers, pick one
- Screen 2: Three cards for types within chosen center, pick one
- Screen 3: 3-4 binary confirmation swipes to validate typing
- Results add thematic detail overlays to world map

**MBTI** (optional)
- Four rows of two-letter toggles (E/I, S/N, T/F, J/P)
- Tap to select, no swipe assessment
- Skip option always visible

### Visual Compositing System (layering order)
1. Day master base world (1 of 10 pre-rendered illustrations)
2. Western zodiac animal creature (transparent PNG overlay)
3. Chinese zodiac animal motif (transparent PNG overlay)
4. Big Five atmospheric modifications (CSS filters + overlay elements)
5. Enneagram thematic details (overlay elements)
6. MBTI subtle touch (if provided)

### Synthesis Narrative
- After completing 2+ worlds, user can view their unified profile
- Claude API call with full profile data generates integrated personality narrative
- Narrative weaves all frameworks together (not separate sections per framework)
- Displayed as text floating over the user's personalized world illustration

### Shareable Portrait
- Phone-screen-sized image card
- Contains: personalized world illustration, key types, one synthesized line
- Generated via HTML Canvas or equivalent
- Native share sheet integration (text message, Instagram story, etc.)
- Includes "Discover yours" link back to Selfscape entry point

## Day Master Base Worlds (10 total)

| Day Master | Visual Theme |
|---|---|
| Yang Wood | Towering ancient forest, redwoods, strong vertical energy, sunlight through canopy |
| Yin Wood | Delicate garden, winding vines, wildflowers, bamboo, dappled light |
| Yang Fire | Blazing sunlit city at high noon, saturated, bold shadows, dramatic warmth |
| Yin Fire | Candlelit/lantern-lit nighttime scene, fireflies, paper lanterns, glowing embers |
| Yang Earth | Grand mountain plateau, massive rock formations, terraced landscapes, ancient stone |
| Yin Earth | Rolling farmland, gentle hills, clay paths, quiet village with gardens |
| Yang Metal | Crystalline cityscape, sharp geometry, reflective surfaces, cold clear light |
| Yin Metal | Intricate metalwork, moonlit scene, silver light, delicate bridges, frost |
| Yang Water | Ocean scene, massive waves, port city in storm, deep blues and greens |
| Yin Water | Misty lake, gentle rain, reflections, riverside village, morning fog |

## Project Status
See @docs/master-plan.md

## Conventions

- All interactive components use `"use client"`
- Tailwind CSS exclusively for styling (no CSS modules, no styled-components)
- Font: Cormorant Garamond via `next/font/google`
- Theme colors defined as CSS variables in `globals.css`: background `#0a0a14`, foreground `#e8e4dc`, gold `#c4a35a`
- Types centralized in `src/lib/types.ts`
- Calculation functions are pure (no side effects): `getWesternZodiac`, `getChineseZodiac`, `getDayMaster`
- Motion library imports from `"motion/react"` (not `"framer-motion"`)
- No test framework set up yet
- No backend, no persistence — all state in React `useState`
- When writing a plan, use the superpowers plugin (writing-plans skill).
- After drafting a plan, spin up some sub-agents to review the plan that was created also using the superpowers plugin. Also create a separate sub-agent to check that the plan aligns to @docs/design-decisions.md

## Deferred (Post-MVP)
- Audio/ambient sound per world
- Accounts and persistence
- Birth time input (hour pillar)
- Birth location input (Western rising sign)
- Additional personality framework worlds
