# Shareable Portrait Card — Design Spec

## Overview

A full-screen portrait card page that displays all of a user's personality type labels in a clean, screenshot-friendly layout. Users share by screenshotting or using the native Web Share API to send a link. No image generation libraries needed.

## What the Card Shows

The portrait card displays these sections in a vertical stack, each with a gold uppercase label, a large serif type name, and an italic descriptor beneath:

1. **Sun Sign** — e.g., "Pisces" / "Water · Adaptable through intuition and fluidity"
2. **Year Pillar** — e.g., "Wood Pig" / "The Garden · Yin"
3. **Month Pillar** — e.g., "Earth Ox" / "The Meadow · Yin"
4. **Day Pillar** — e.g., "Wood Snake" / "The Garden · Yin"
5. **Enneagram** (if completed) — e.g., "Type 5" / "The Investigator"
6. **MBTI** (if completed) — e.g., "INFJ"
7. **Big Five** (if completed) — five trait labels listed vertically, e.g., "Boundlessly curious", "Powered by solitude", etc.
8. **"Discover Yours"** — a prominent gold link at the bottom pointing to the Selfscape homepage

Header: "Your Personal SelfScape" in italic gold.

Sections for incomplete assessments are simply omitted (no "locked" or placeholder state).

## Styling

Matches the existing Selfscape design language exactly:
- Background: `#0a0a14` (CSS var `--color-background`)
- Type names: `--color-foreground` (#e8e4dc), ~24px, font-weight 300
- Labels: gold/60 opacity, 11px uppercase, wide letter-spacing, sans-serif
- Descriptors: foreground/35 opacity, ~13px, italic
- "Discover Yours": full gold (#c4a35a), 16px, uppercase, wide letter-spacing
- Font: Cormorant Garamond (already loaded globally)
- Spacing: 24px gap between sections

## Route & Navigation

- **New route:** `/portrait`
- **Entry point:** A "Share Your Portrait" button on the home page results display, visible once birthdate results exist
- **Back navigation:** A back arrow or "Back to Results" link at the top (hidden when the page is being viewed via a share link by someone else)

## Data Flow

### For the person creating the portrait:
1. User taps "Share Your Portrait" on the home page
2. `/portrait` page loads, reads all data from `sessionStorage` using existing helpers:
   - `SESSION_KEYS.birthdateResult` → sun sign, pillars, day master
   - `SESSION_KEYS.bigFiveScores` → Big Five trait labels (via `getBigFiveProfile`)
   - `SESSION_KEYS.enneagramResult` → type name, label
   - `SESSION_KEYS.mbtiResult` → 4-letter code
3. Page also encodes a compact version of this data into the URL hash
4. Card renders with fade-up animations matching the home page style

### For someone receiving a shared link:
1. Recipient opens the URL (e.g., `selfscape.com/portrait#...`)
2. `/portrait` page detects no sessionStorage data but finds URL hash data
3. Decodes the hash and renders the card with the shared person's results
4. "Discover Yours" link at the bottom navigates to `/` to start their own journey

### URL encoding strategy:
Encode only the display-relevant data as compact URL params in the hash:
- `s` = sun sign (e.g., "pisces")
- `yp` = year pillar element + animal (e.g., "wood-pig")
- `mp` = month pillar element + animal (e.g., "earth-ox")
- `dp` = day pillar element + animal (e.g., "wood-snake")
- `en` = enneagram type number (e.g., "5")
- `mb` = mbti code (e.g., "infj")
- `bf` = big five scores as 5 digits (e.g., "21201" for o=2,c=1,e=2,a=0,n=1)

This keeps URLs short enough to share cleanly. The descriptors (element/modality for sun sign, stem descriptor/polarity for pillars, enneagram name/label, Big Five trait labels) are all derived from lookup tables that already exist in the codebase, so they don't need to be in the URL.

## Share Button

A "Share" button on the portrait page that:
1. Calls `navigator.share({ title: 'My Selfscape Portrait', url: currentUrlWithHash })` on supported browsers (iOS Safari, Chrome on Android)
2. Falls back to copying the URL to clipboard with a "Link copied!" confirmation on unsupported browsers

## Existing Code to Reuse

- `src/lib/session.ts` — `loadFromSession`, `SESSION_KEYS`
- `src/lib/big-five-scoring.ts` — `getBigFiveProfile()` to convert scores to labels
- `src/components/ResultsDisplay.tsx` — `STEM_DESCRIPTORS` and `SIGN_DESCRIPTIONS` lookup tables (will need to be extracted to a shared location or imported)
- `src/data/enneagram-data.ts` — type names and labels
- `src/data/mbti-data.ts` — `MBTI_TYPE_DESCRIPTIONS`
- `src/lib/western-zodiac.ts`, `src/lib/chinese-zodiac.ts` — for re-deriving descriptors from URL data

## Components to Build

1. **`/src/app/portrait/page.tsx`** — the portrait page (client component)
   - Reads session data or URL hash data
   - Encodes session data into URL hash on first load
   - Renders the `PortraitCard` component
   - Includes Share button and Back navigation

2. **`/src/components/PortraitCard.tsx`** — the visual card component
   - Receives typed props with all display data
   - Renders the vertical stack layout
   - Fade-up animations on mount
   - Designed to fill the viewport height on mobile

3. **Share/copy URL utility** — small helper for the share button behavior

## Animations

- Staggered fade-up on each section (matching home page pattern)
- Share button subtle entrance after card finishes animating

## What This Does NOT Include

- Image generation or download (users screenshot instead)
- Server-side rendering or database storage
- Narrative text on the card
- Any new dependencies
