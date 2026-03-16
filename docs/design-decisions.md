# Selfscape Design Decisions Log

This document captures key design decisions and their rationale. Update as decisions evolve.

---

## Name
- **Decision:** Selfscape
- **Rationale:** Evocative, captures the concept of your self as a landscape. Clean, memorable, works as a URL.

## Visual Aesthetic
- **Decision:** Painterly, impressionistic, Simile-inspired full-bleed illustrations
- **References:** Simile (simile.com) for the painterly style and immersive full-bleed approach. The General Intelligence Company of New York for whimsical, art-first web design.
- **Rationale:** The gap in personality/zodiac sites is that they either look clinical (Big Five research sites) or kitschy (most astrology sites). Selfscape should feel elevated and beautiful.

## Base World System
- **Decision:** Day master (Ba Zi heavenly stem of the day pillar) determines the base world illustration, not Western zodiac sign.
- **10 base worlds:** Yang/Yin variations of Wood, Fire, Earth, Metal, Water.
- **Rationale:** Chinese zodiac elements provide a more natural visual vocabulary for world-building. The five elements with yin/yang polarity give 10 distinct environments that are visually differentiated by inherent qualities (fire vs. water vs. metal, etc.). The day master is arguably the most important element in Ba Zi.

## Input Strategy
- **Decision:** Birthdate only (month/day/year). No birth time, no birth location for MVP.
- **Rationale:** Birth time adds the hour pillar but many people don't know their exact birth time, so making it required loses users. Birth location is needed for Western rising sign and Ba Zi solar time correction, but the added complexity and perceived invasiveness aren't worth it for MVP. Can be added later as optional inputs.

## Interaction Model
- **Decision:** Binary card swiping (Hinge-style) for all assessments. No free text fields anywhere. No spectrum swipes.
- **Rationale:** Free text fields create cognitive load and lose users. Spectrum swipes add complexity without proportional value. Binary choices are familiar from dating apps, require zero instruction, and keep momentum high. Two options only, no "slight preference" vs. "strong preference" distinction.

## Framework Selection and Input Cost
- **Western Zodiac:** Auto-computed from birthdate (zero input)
- **Chinese Zodiac / Ba Zi:** Auto-computed from birthdate (zero input)
- **Big Five:** ~10 binary swipe cards using simplified TIPI-inspired instrument
- **Enneagram:** ~6-7 interactions using hybrid approach (paragraph selection for center and type, then confirmation swipes)
- **MBTI:** Optional, self-reported. Four letter-pair toggles. User enters their known type or skips.
- **Rationale:** MBTI was made optional (not a swipe assessment) because most people who know their type know it by heart, and Big Five covers similar ground with more nuance. Enneagram uses paragraph selection because it plays to the framework's strength of self-recognition ("oh, that's me") rather than survey-style questions.

## Enneagram Assessment Approach
- **Decision:** Hybrid of paragraph selection (Option C) and targeted confirmation swipes (Option B).
- **Flow:** Center selection via three illustrated paragraph cards, type selection within center via three more cards, then 3-4 binary confirmation swipes.
- **Rationale:** Paragraph selection gives the user that intuitive recognition moment. Confirmation swipes add rigor and can catch misidentified centers. Combined, this gives decent typing fidelity in under 90 seconds.

## Navigation Model
- **Decision:** World map hub with individual framework worlds (Super Mario Bros. world select style), not a linear scroll.
- **Rationale:** Removes pressure of a long linear flow. Users can do one world, leave, come back. Creates collectibility mechanic (completed worlds illuminate on the map). Each world is a self-contained module, which is cleaner architecturally. The map itself becomes part of the personalized visual experience.

## Visual Compositing Approach
- **Decision:** Layered compositing with pre-rendered assets, not real-time AI image generation.
- **Layers:** Base world (1 of 10) + zodiac creature overlays + atmospheric CSS modifications + thematic detail overlays.
- **Rationale:** Real-time AI generation (calling Midjourney/DALL-E per user) has 10-30 second latency, inconsistent quality, and cost-per-user issues. Pre-rendered compositing is instant, controllable, and art-directable. The combinatorial problem is managed by using a modest library of overlay elements rather than fully unique illustrations per user.

## World Map Transformation
- **Decision:** Map visually changes as the user completes each world, reflecting their results.
- **How:** Layered transparent overlays composited on top of the base world illustration, plus CSS filter adjustments for atmosphere. All happens instantly in the browser, no API calls or loading screens.

## Synthesis Narrative
- **Decision:** LLM-generated in real time via Claude API.
- **Rationale:** Pre-written narratives for every combination of results across frameworks would require an unmanageable number of text variants. LLM generation scales effortlessly and can produce genuinely integrated narratives. The tradeoff is less control over exact wording, but a well-crafted system prompt can maintain consistent tone and quality.

## Shareable Output
- **Decision:** Spotify Wrapped-style portrait card. A precomposed image (1080x1920) containing the personalized world illustration, key types, and a synthesized one-liner. Shared via native share sheet.
- **Rationale:** Visual, not textual. Nobody shares a paragraph over text message. A beautiful image with a personality summary is an identity statement that people want to share. The "Discover yours" link creates the viral loop.

## Video Game Mechanics
- **Decision:** Draw from RPG character creation (invisible trait mapping), progressive reveal (map fills in like an explored game world), and reveal ceremony (dramatic profile unveiling).
- **Rationale:** The experience should feel like discovery and self-reflection, not performance. The game mechanics serve immersion and momentum.

## Scope Boundaries (MVP)
- **In scope:** Birthdate input, world map hub, Big Five world, Enneagram world, MBTI input, visual compositing, LLM synthesis, shareable portrait card.
- **Deferred:** Audio/ambient sound, accounts/persistence, birth time input, birth location input, Western rising sign, additional framework worlds, desktop-specific optimizations.
