# Step 1: Birthdate Input + Zodiac/Ba Zi Calculation

## Context

Selfscape is a greenfield project — no code exists yet. This plan covers the first build step: scaffolding the Next.js project and building the birthdate picker screen that computes Western zodiac, Chinese zodiac animal, and Ba Zi day master from a selected date.

The goal: user selects birthdate via scroll wheels, taps "Discover Your World", and sees their three zodiac/Ba Zi results displayed beautifully.

---

## File Structure

```
selfscape/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout: Cormorant Garamond font, dark bg, metadata
│   │   ├── page.tsx              # Single page: picker → results
│   │   └── globals.css           # Tailwind directives, scrollbar hiding, fadeUp keyframe
│   ├── components/
│   │   ├── ScrollWheel.tsx       # Generic single-column scroll wheel (CSS scroll-snap)
│   │   ├── BirthdatePicker.tsx   # Three ScrollWheels (month/day/year) + submit button
│   │   └── ResultsDisplay.tsx    # Animated results card with staggered fade-in
│   ├── lib/
│   │   ├── types.ts              # Shared TypeScript types
│   │   ├── western-zodiac.ts     # Sun sign date-range lookup
│   │   ├── chinese-zodiac.ts     # Animal year calculation with lunar new year handling
│   │   └── day-master.ts         # Heavenly stem calculation (sexagenary cycle)
│   └── data/
│       └── lunar-new-year.ts     # Lunar New Year dates 1920–2030
├── tailwind.config.ts            # Extended with custom colors + serif font
├── next.config.ts
└── package.json
```

---

## Implementation Sequence

### Phase A: Scaffold

1. **Initialize Next.js** — `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*"`
2. **Configure font** — Cormorant Garamond via `next/font/google` (weights 300–700). Better mobile rendering and lighter feel than Playfair Display.
3. **Set dark theme** — body bg `#0a0a14`, text `#e8e4dc`, accent gold `#c4a35a`. Extend Tailwind config with these colors + serif font family.
4. **globals.css** — Tailwind directives, scrollbar hiding (`::-webkit-scrollbar { display: none }`), `fadeUp` keyframe animation.

### Phase B: Calculation Utilities (pure functions, no React)

5. **`types.ts`** — `WesternZodiacResult`, `ChineseZodiacResult`, `DayMasterResult`, `BirthdateResult` interfaces.

6. **`western-zodiac.ts`** — `getWesternZodiac(month, day)` → `{ sign, element, modality }`. Static array of 12 signs with date ranges. Handle Capricorn Dec 22–Jan 19 wraparound.

7. **`lunar-new-year.ts`** — Lookup table of `year → [month, day]` for 1920–2030 (111 entries). Source from Wikipedia's Chinese New Year table.

8. **`chinese-zodiac.ts`** — `getChineseZodiac(year, month, day)` → `{ animal }`.
   - If birthdate is before that year's Lunar New Year → use `year - 1` as effective year
   - `animalIndex = ((effectiveYear - 4) % 12 + 12) % 12`
   - Animals array: Rat(0), Ox(1), Tiger(2), Rabbit(3), Dragon(4), Snake(5), Horse(6), Goat(7), Monkey(8), Rooster(9), Dog(10), Pig(11)

9. **`day-master.ts`** — `getDayMaster(year, month, day)` → `{ stemIndex, element, polarity, chineseName }`.
   - Reference: Jan 1, 2000 = stem index 5 (Ji, Yin Earth)
   - `daysDiff = Math.round((targetDate - refDate) / 86_400_000)`
   - `stemIndex = ((5 + daysDiff) % 10 + 10) % 10`
   - 10 heavenly stems: Jia(0), Yi(1), Bing(2), Ding(3), Wu(4), Ji(5), Geng(6), Xin(7), Ren(8), Gui(9)

### Phase C: Scroll Wheel Component

10. **`ScrollWheel.tsx`** — Custom CSS scroll-snap wheel (no library).
    - Fixed-height container showing 5 items, selected item centered
    - `scroll-snap-type: y mandatory` + `scroll-snap-align: center` for native feel
    - Debounced scroll handler (100ms) fires `onChange` with selected value
    - Visual barrel effect: items fade/scale based on distance from center
    - `useEffect` to programmatically scroll to `selectedValue` on mount/change

11. **`BirthdatePicker.tsx`** — Three ScrollWheels (month / day / year) in a flex row.
    - Month: 1–12 with full names
    - Day: 1–N (dynamic based on month/year, handles leap years)
    - Year: 1920–2026, default ~1995
    - Day clamping: when month/year changes and current day exceeds max, clamp down
    - "Discover Your World" button below wheels (gold accent, serif text)

### Phase D: Results Display

12. **`ResultsDisplay.tsx`** — Three stacked sections with staggered CSS fade-up animation (0s, 0.3s, 0.6s delay).
    - Western: sign name (large) + "Element Modality" (small)
    - Chinese: animal name (large)
    - Day Master: "Polarity Element" (large) + Chinese name in italic (small)
    - "Start Over" text button at bottom

### Phase E: Wire It Together

13. **`page.tsx`** — `useState<BirthdateResult | null>(null)`. Show `BirthdatePicker` when null, `ResultsDisplay` when set. Submit handler calls all three calculation functions.

14. **`layout.tsx`** — Font loading, body classes, metadata.

---

## Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Scroll wheel | Custom CSS scroll-snap | No well-maintained library; CSS snap gives native mobile feel in ~100 LOC |
| Font | Cormorant Garamond | Lighter than Playfair, true italics, good mobile readability |
| Animation | CSS keyframes only | Only need fade-in; Framer Motion adds 30KB+ (save for Step 2 swipe physics) |
| State | useState | Single page, minimal state; no global store needed yet |
| Date math | Native JS Date | Adequate for day counting; no dayjs/luxon overhead |

---

## Verification

### Calculation Correctness (verify against online Ba Zi calculators)

| Birthdate | Western | Chinese Animal | Day Master |
|-----------|---------|---------------|------------|
| Jan 1, 2000 | Capricorn | Rabbit (before Feb 5 LNY) | Ji, Yin Earth (stem 5) |
| Feb 4, 2000 | Aquarius | Rabbit (still before LNY) | Gui, Yin Water (stem 9) |
| Feb 5, 2000 | Aquarius | Dragon (LNY day) | Jia, Yang Wood (stem 0) |
| Mar 21, 1985 | Aries (boundary) | Ox | Verify against calculator |
| Feb 29, 2000 | Pisces | Dragon | Verify against calculator |

### Scroll Wheel Behavior
- Month change from Jan 31 → Feb: day clamps to 28/29
- Year change on Feb 29 (leap → non-leap): day clamps to 28
- Smooth momentum scrolling on iOS Safari and Android Chrome
- Mouse wheel works on desktop

### Visual/UX
- Dark bg fills viewport, no horizontal scroll on mobile
- Font loads without fallback flash
- Results animate in smoothly
- "Start Over" returns to picker
