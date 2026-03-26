# Selfscape Build Status

- [x] Step 1: Birthdate input + zodiac/Ba Zi calculation
- [x] Step 2: Swipe interaction engine
- [x] Step 3: Big Five world (first complete world)
- [x] Step 4: Enneagram world
- [x] Step 5: MBTI optional input
- [ ] ~~Step 6: World map hub + navigation~~ (skipped — simplified to inline home page)
- [ ] ~~Step 7: Visual compositing system~~ (skipped — no world map)
- [x] Step 8: LLM synthesis narrative (simplified — inline on home page)
- [ ] Step 9: Shareable portrait card + share flow
- [ ] Step 10: Polish, animations, transitions




# What's Built

### Birthdate Picker (Step 1)
- Three CSS scroll-snap wheels (month/day/year) — no external picker library
- Auto-computes Western zodiac, Chinese zodiac (with lunar new year adjustment), and Ba Zi day master
- Results display with staggered fadeUp animations
- Year range: 1920–2026; lunar new year lookup table in `src/data/lunar-new-year.ts`

### Swipe Interaction Engine (Step 2)
- `SwipeCard`: drag gesture with Hinge-style rotation + opacity, direction labels fade in/out
- `SwipeDeck`: card stack manager with peek-behind next card, progress dots, keyboard (arrow keys) and tap button fallbacks
- Cards animate off-screen via `useAnimation` controls, then fire `onSwipe` callback — no AnimatePresence needed
- Demo page at `/swipe-demo` with 5 sample cards
- Thresholds: 100px offset or 500px/s velocity to trigger swipe

### Big Five World (Step 3)
- 10 binary swipe cards (2 per dimension) interleaved across O/C/E/A/N
- `SwipeCard` drag labels are now dynamic per card (`leftDragLabel`/`rightDragLabel` with fallback)
- Scoring: each swipe is +1 (right) or -1 (left) on the card's dimension, range -2 to +2
- Results display with evocative labels (e.g., "Boundlessly curious", "Powered by solitude")
- `BigFiveResults` component with staggered fade-up animations
- Session persistence via `sessionStorage` helpers (`src/lib/session.ts`) — birthdate results survive cross-route navigation
- "Discover Your Nature" link on results page navigates to `/big-five`
- "Back to Results" from Big Five returns to `/` with birthdate results restored

### Enneagram World (Step 4)
- Three-screen flow: center selection (Body/Heart/Head), type selection (3 types per center), confirmation swipes (4 cards)
- `CardSelector`: reusable tap-to-select component with motion animations and staggered entry
- Scoring: primary type from paragraph selection, optional suggestion when confirmation swipes point to a different type
- Session persistence via `sessionStorage` (`selfscape:enneagramResult`)
- "Discover Your Inner World" link on results page navigates to `/enneagram`
- "Back to Results" from Enneagram returns to `/`

### MBTI Optional Input (Step 5)
- Self-reported 4-letter type via toggle buttons (E/I, S/N, T/F, J/P)
- Skip option for users who don't know their type
- Results display with dimension breakdown and evocative type description
- Session persistence via `sessionStorage`
- "Enter Your Type" link on results page navigates to `/mbti`

### LLM Personality Narrative (Step 8 — simplified)
- "Generate My Portrait" button on home page, available immediately after birthdate entry (no minimum assessment requirement)
- Next.js API route (`/api/narrative`) calls Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) with streaming
- API key stored server-side in `.env.local` (`ANTHROPIC_API_KEY`), never exposed to browser
- Full BaZi chart calculated client-side via `src/lib/bazi-calculator.ts` and sent to the API — includes ten gods, elemental balance, Na Yin, and luck pillars
- Structured system prompt produces six labeled sections: Your Portrait, What Drives You, How You Think, Relationship Style, Internal Conflict, Misread As
- Each section displayed as an individual card with gold uppercase label, matching existing card styling
- Narrative streams token-by-token via `ReadableStream` / `TextDecoder`; cards appear progressively as sections complete
- Completed narrative cached in `sessionStorage` (`selfscape:narrativeResult`); "Regenerate" button re-reads current session data (picking up newly completed assessments) and streams fresh narrative
- "Start Over" and "Change Birthdate" buttons clear all data including narrative cache
- Ref-based guard prevents double-tap concurrent requests
- Dependencies added: `@anthropic-ai/sdk`

### BaZi Calculator
- Full BaZi chart calculation from birthdate in `src/lib/bazi-calculator.ts`
- Calculates three pillars (year, month, day) with heavenly stems, earthly branches, and Na Yin elements
- Derives day master, hidden stems (weighted by qi strength), ten gods, elemental balance (percentage breakdown with dominant/scarce/absent), and eight luck pillars
- Solar term dates approximated; hour pillar excluded (no birth time collected)
- Output passed to the narrative API for richer, BaZi-grounded personality profiles

### Home Page Enhancements
- Western zodiac card: shows element + modality descriptor (e.g., "Air · Driven through connection and balance")
- Chinese zodiac pillar cards: heading shows "Element Animal" (e.g., "Wood Pig"), subtitle shows stem descriptor + polarity (e.g., "The Garden · Yin")
- Enneagram card: now displays core fear, core desire, and growth direction below the type label
- "Change Birthdate" button between Day Pillar and assessment cards
- "Start Over" button moved to bottom of page, after the narrative section

### Routes
- `/` — birthdate picker → results display → narrative portrait
- `/api/narrative` — POST endpoint, streams Claude-generated personality narrative
- `/big-five` — Big Five personality assessment → results
- `/enneagram` — Enneagram assessment (center → type → confirmation swipes → results)
- `/mbti` — MBTI self-report (toggle selection → results)
- `/swipe-demo` — swipe card interaction demo


# Selfscape Build Plan

This document outlines the step-by-step build sequence for Selfscape. Each step is scoped to be a single focused Claude Code session. Complete them in order, as each step builds on the previous one.

---

## Step 1: Birthdate Input + Zodiac/Ba Zi Calculation

**Goal:** A single screen where the user selects their birthdate and instantly sees their Western zodiac sun sign, Chinese zodiac animal year, and Ba Zi day master.

**What to build:**
- A mobile-first page with a birthdate picker (scroll wheels or droppers for month, day, year). No free text input.
- Western zodiac sun sign calculation. Simple date-range lookup table. Return the sign name and element (fire/earth/air/water).
- Chinese zodiac animal year calculation. Mod-12 operation on the year with an offset table for lunar new year dates (important for January/February births). Return the animal and element cycle.
- Ba Zi day master calculation. The day pillar follows a 60-day sexagenary cycle. Given a reference date with a known day pillar, count the number of days between the reference date and the target date, mod by 60, and look up the heavenly stem. Return the element (wood/fire/earth/metal/water) and polarity (yin/yang).
- Display the results on screen: sun sign, Chinese zodiac animal, day master element and polarity.
- Style with a clean, dark, atmospheric background. Serif typography (find something distinctive, not generic). Mobile-first layout.

**Key references:**
- The sexagenary cycle: https://en.wikipedia.org/wiki/Sexagenary_cycle
- Ba Zi day master is the heavenly stem of the day pillar
- Lunar new year dates vary by year, need a lookup table for accurate Chinese zodiac year calculation

**Definition of done:** User selects a birthdate, taps a button, and sees their three zodiac/Ba Zi results displayed beautifully on screen. All calculations are correct, including edge cases for January/February births.

---

## Step 2: Swipe Interaction Engine

**Goal:** A reusable swipe card component that presents binary choices and records the user's selections.

**What to build:**
- A card stack component that displays two option cards side by side (or overlapping).
- Swipe left to choose the left option, swipe right to choose the right option. Touch-based on mobile, drag-based on desktop.
- Satisfying animation on swipe: the chosen card flies off screen, the rejected card fades, the next pair appears with a smooth transition.
- A progress indicator (subtle, not a progress bar. Maybe dots or a gentle counter).
- The component accepts an array of card pairs (each pair has a left statement and right statement) and returns an array of choices when complete.
- Background color or atmosphere should shift subtly with each swipe to give a sense of progression.
- Test with 5 placeholder card pairs to validate the interaction.

**Design notes:**
- The swipe should feel physical and responsive. Use spring physics if possible (framer-motion or similar).
- Cards should have rounded corners, a slight shadow, and clean typography.
- On mobile, the swipe gesture should require minimal distance to register (not a full screen drag).
- On desktop, allow click-and-drag or simple left/right click on the cards.

**Definition of done:** A standalone swipe card screen that presents 5 binary pairs, records all choices, and calls a completion callback with the results array. Feels smooth and satisfying on mobile.

---

## Step 3: Big Five World (First Complete End-to-End World)

**Goal:** Wire together Steps 1 and 2 into the first complete user flow: enter birthdate, see results, enter a world, swipe through assessment, see Big Five results.

**What to build:**
- 10 binary card pairs for the Big Five assessment. Each pair maps to one of the five dimensions. Two cards per dimension to improve reliability.
  - Openness: e.g., "You enjoy exploring unfamiliar ideas" vs. "You prefer what's tried and tested"
  - Conscientiousness: e.g., "You plan before you act" vs. "You figure it out as you go"
  - Extraversion: e.g., "You recharge around other people" vs. "You recharge with time alone"
  - Agreeableness: e.g., "You prioritize harmony in disagreements" vs. "You prioritize honesty in disagreements"
  - Neuroticism: e.g., "Your mood shifts easily with circumstances" vs. "Your mood stays steady regardless"
- Scoring logic: each swipe maps to a +1 or -1 on the relevant dimension. Two swipes per dimension gives a score of -2 to +2. Normalize to a simple high/medium/low for each dimension.
- A results screen that displays the Big Five profile in an evocative, non-clinical way. Not "Openness: High" but something like "Boundlessly curious" for high openness.
- Navigation: birthdate screen -> results -> "explore your worlds" -> Big Five world -> swipe assessment -> Big Five results -> back to hub.
- Placeholder hub screen (even just a simple menu for now, the full world map comes later).

**Card content guidance:**
- Statements should be short (under 10 words), concrete, and feel like self-descriptions, not test questions.
- Avoid clinical language. No "strongly agree/disagree" framing.
- Both options in each pair should feel equally valid. Neither should feel like the "right" answer.

**Definition of done:** Complete flow from birthdate entry through Big Five assessment to results display. Scoring is correct. The experience feels cohesive, not like separate disconnected screens.

---

## Step 4: Enneagram World

**Goal:** Build the Enneagram assessment world with the hybrid paragraph-selection plus confirmation-swipe approach.

**What to build:**
- Screen 1 (Center Selection): Three illustrated cards representing gut (types 8, 9, 1), heart (types 2, 3, 4), and head (types 5, 6, 7) centers. Each card has a short evocative paragraph describing the center's core orientation. User swipes away two, keeps one. Or taps to select.
- Screen 2 (Type Selection): Based on chosen center, three cards for the specific types within that center. Each card has a paragraph describing the type's core motivation and fear. User selects one.
- Screen 3 (Confirmation): 3-4 binary swipe cards designed to discriminate between the three types in the chosen center. These serve as a check on the paragraph selection.
- Scoring logic: Primary type is determined by the paragraph selections. Confirmation swipes either validate or suggest an adjacent type within the same center. If confirmation swipes conflict with the paragraph selection, present the confirmation result as "you might also resonate with Type X."
- Results screen showing primary Enneagram type with a brief, evocative description of core motivation, fear, and growth direction.

**Center descriptions (starting points, refine the voice):**
- Gut (8, 9, 1): "You lead with instinct. Your first response to the world is physical, a gut reaction. You know what's right before you can explain why, and your challenge is what to do with that certainty."
- Heart (2, 3, 4): "You lead with feeling. Your first response to the world is emotional. You're tuned to how others see you and how you see yourself, and your challenge is finding who you are beneath those reflections."
- Head (5, 6, 7): "You lead with thinking. Your first response to the world is to analyze, question, or plan. You need to understand before you act, and your challenge is trusting that you know enough to move forward."

**Definition of done:** Complete Enneagram assessment flow with center selection, type selection, confirmation swipes, and results display. Accessible from the placeholder hub alongside Big Five.

---

## Step 5: MBTI Optional Input

**Goal:** A simple, elegant MBTI input screen for users who already know their type.

**What to build:**
- Four rows, each with two letter options as toggle buttons:
  - E / I (Extraversion / Introversion)
  - S / N (Sensing / Intuition)
  - T / F (Thinking / Feeling)
  - J / P (Judging / Perceiving)
- Tap one letter in each row to select it. The other dims.
- A prominent "Skip" option that's not hidden or deprioritized. Frame it positively: "I'll discover this later" or similar.
- Brief, non-clinical labels under each letter pair. Not "Extraversion vs. Introversion" but something like "Energy from others / Energy from within."
- Results stored as a four-letter string or null if skipped.

**Definition of done:** MBTI input screen accessible from hub. Saves selection or skip. Displays result on a simple profile summary alongside Big Five and Enneagram results.

---

## Step 6: World Map Hub + Navigation

**Goal:** Replace the placeholder hub with the actual illustrated world map. This is where the game-like experience comes together.

**What to build:**
- A full-screen illustrated world map as the central navigation screen. For MVP, this can be a stylized illustrated or designed map (not necessarily Midjourney art yet). Five distinct world nodes positioned on the map.
- Each world node has a visual state: locked/fog (not yet available), available (can enter), completed (fully illuminated).
- Western Zodiac and Chinese Zodiac worlds are auto-completed on arrival (since birthdate already computed them). They glow/pulse subtly. Tapping them shows the zodiac profile.
- Big Five, Enneagram, and MBTI worlds start as available (not locked, since we want low friction). They appear muted or partially obscured.
- Tap a world node to enter that world's assessment flow.
- On completing a world, animate the return to the map with the world node transforming to its completed state.
- A central element on the map (island, frame, portal) represents the unified portrait. It becomes more visible/complete as more worlds are finished.
- Mobile: worlds are tappable nodes. Consider gentle floating/bobbing animation on nodes.
- Desktop: same layout scaled up, click to enter worlds.

**Design notes:**
- The map should feel like a place, not a menu. Atmospheric background, subtle animations (clouds moving, water rippling, light shifting).
- Use the day master result to set the map's overall color palette and mood, even before the full illustrated base worlds are ready.
- Completed worlds should feel alive compared to uncompleted ones.

**Definition of done:** A visually compelling world map that serves as the hub for all five framework worlds. Navigation in and out of each world works. Visual state reflects completion status. Day master influences the overall aesthetic.

---

## Step 7: Visual Compositing System

**Goal:** Implement the layered visual system where quiz results modify the world map's appearance.

**What to build:**
- A compositing engine that takes the user's full result set and computes which visual layers to apply to the world map.
- Layer 1 (Base): Select 1 of 10 base world backgrounds based on day master. For MVP, these can be placeholder images or gradient-based atmospheric backgrounds until Midjourney art is ready.
- Layer 2 (Zodiac creatures): Position Western zodiac animal overlay on the map. Transparent PNG positioned absolutely. For MVP, these can be silhouettes or simple illustrated icons.
- Layer 3 (Chinese zodiac motif): Similar to Layer 2.
- Layer 4 (Big Five atmosphere): CSS filter adjustments based on Big Five scores.
  - High Openness: increase saturation, add subtle surreal color shifts
  - High Extraversion: warmer tones, brighter lighting
  - High Conscientiousness: sharper contrast, more defined edges
  - High Agreeableness: softer overall tone, warmer palette
  - High Neuroticism: more dramatic lighting contrast, moodier atmosphere
- Layer 5 (Enneagram details): Overlay elements based on Enneagram type. Pre-rendered transparent PNGs. For MVP, can be CSS-based atmospheric effects (color overlays, gradient shifts) instead of illustrated elements.
- A transition animation when returning from a completed world: the new layers fade or paint in over 1-2 seconds.

**Definition of done:** The world map visually changes based on the user's accumulated results. Each completed world adds a visible layer. The overall mood of the map feels personalized.

---

## Step 8: LLM Synthesis Narrative

**Goal:** Generate a unified personality narrative using Claude API that weaves all completed frameworks together.

**What to build:**
- A "View Your Portrait" button on the world map that becomes active after completing at least 2 framework worlds (beyond the auto-completed zodiac).
- On tap, collect all the user's results into a structured profile object.
- Call the Claude API (Sonnet for speed and cost) with a carefully crafted system prompt that instructs it to:
  - Write a 150-250 word integrated personality narrative in second person ("You...")
  - Weave the frameworks together thematically, not as separate sections
  - Use evocative, literary language (not clinical)
  - Reference specific combinations and how they interact
  - End with a single memorable line that could serve as the shareable tagline
- Display the narrative as text floating over the user's personalized world map, scrolling down from the map into the profile view.
- Cache the result in session so re-viewing doesn't re-generate.
- Handle loading state with a "composing your portrait" animation.
- Handle errors gracefully (retry once, then show a fallback message).

**System prompt guidance (starting point, iterate on voice):**
"You are writing a personality portrait for someone. Weave together their results from multiple personality frameworks into a single cohesive narrative. Do not list frameworks separately. Instead, find the threads that connect them and tell the person who they are in a way that feels both true and surprising. Write in second person. Be specific and concrete, not vague. Use literary language but stay grounded. The last line should be a single memorable sentence that captures their essence, something they would want to share. Keep it between 150 and 250 words."

**Definition of done:** User taps "View Your Portrait," sees a loading animation, then reads an LLM-generated narrative that integrates their results from all completed worlds. The narrative feels personal, not generic.

---

## Step 9: Shareable Portrait Card + Share Flow

**Goal:** Generate a beautiful, phone-screen-sized image that summarizes the user's profile and can be shared via native share sheet.

**What to build:**
- A portrait card component that composites:
  - A cropped/styled version of the user's personalized world map as background
  - The user's key types overlaid in elegant serif typography (e.g., "Virgo Sun. Year of the Tiger. Yin Fire. Type 5. INFJ.")
  - The synthesized tagline from the LLM narrative (the final memorable line)
  - The Selfscape logo/wordmark and "Discover yours" URL
- Render this card to an image using HTML Canvas (html2canvas or similar library) or a server-side rendering approach.
- A "Share Your Portrait" button that triggers the native Web Share API (navigator.share) on mobile, with the generated image as a shared file.
- Fallback for desktop or browsers without Web Share API: download the image, or copy a link.
- The shared link should point to the Selfscape entry screen.
- Portrait card dimensions: 1080x1920 (Instagram story / phone screen) as primary format.

**Definition of done:** User can generate a portrait card image and share it via text message or social media. The card looks polished and is legible across platforms. The "Discover yours" link works.

---

## Step 10: Polish, Animations, and Transitions

**Goal:** Elevate the entire experience from functional to delightful.

**What to focus on:**
- Screen transitions: smooth, themed animations between the map and each world. Not just fade-in/out but directional movement that reinforces the journey metaphor.
- Swipe card physics: refine the spring constants, drag threshold, and release animations to feel natural and satisfying.
- Birthdate reveal: when the user enters their birthdate, the initial zodiac results should appear with drama. Text animating in, background shifting, a moment of ceremony.
- World map ambient animation: subtle movement on the map even when the user isn't interacting. Clouds, water, light, particles.
- World completion celebration: when returning from a completed world, a brief moment of transformation as new visual layers paint in.
- Typography refinement: ensure the serif typeface renders well at all sizes on mobile and desktop. Consider loading a web font (something distinctive like Playfair Display, Cormorant, or similar).
- Loading states: any moment of waiting (LLM generation, image rendering) should have a beautiful, on-brand animation, not a spinner.
- Responsive refinement: test and fix layout issues across phone sizes and desktop viewports.

**Definition of done:** The experience feels polished, cohesive, and intentional. Every transition and interaction has been considered. Nothing feels broken or janky.

---

## Art Production Guide (Parallel Track)

This work happens in Midjourney alongside the code build. It is not blocking for Steps 1-6, which can use placeholder art.

**Phase 1 (needed by Step 7):**
- 10 base day master world illustrations (16:9 for desktop, 9:16 for mobile)
- Use Simile screenshots as style reference (upload directly to Midjourney)
- Suggested Midjourney parameters: --ar 16:9 --s 500 --exp 22
- Generate one base world you love, then use it as --sref for the remaining nine to maintain consistency

**Phase 2 (needed by Step 7):**
- 12 Western zodiac animal elements (extractable from backgrounds)
- 12 Chinese zodiac animal motif elements
- Render in painterly style matching base worlds

**Phase 3 (needed by Step 7):**
- 30-50 atmospheric and detail overlay elements for Big Five and Enneagram
- These can be simpler: fog textures, light effects, architectural details, nature elements
- Must have transparent or easily removable backgrounds

**Phase 4 (needed by Step 9):**
- Portrait card template/frame design
- Selfscape logo/wordmark
