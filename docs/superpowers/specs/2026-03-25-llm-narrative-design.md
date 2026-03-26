# Simplified LLM Personality Narrative

## Context

Selfscape has birthdate-derived zodiac results (Western, Chinese, Ba Zi day master) and three optional assessments (Big Five, Enneagram, MBTI). The original plan called for a world map hub and visual compositing before the LLM narrative, but the project is simplifying: skip the world map and visual layers entirely, and add a personality narrative directly on the home page. The "2+ worlds completed" requirement from the original Step 8 is removed to reduce friction — users get immediate value from their birthdate alone.

## What We're Building

A "Generate My Portrait" button on the home page that calls Claude via a Next.js API route and streams a short personality narrative inline. The narrative uses whatever results the user has accumulated — zodiac data at minimum, assessment results if completed.

## User Flow

1. User enters birthdate, sees zodiac results and assessment cards (existing behavior)
2. Below the assessment cards, a "Generate My Portrait" button appears
3. User taps the button — button is disabled, replaced by "Composing your portrait..." indicator
4. Narrative text streams in token-by-token, appearing inline on the home page
5. Once complete, a "Regenerate" button appears below the narrative
6. Tapping "Regenerate" clears the displayed narrative, re-reads current session data (picking up any newly completed assessments), and streams a fresh narrative
7. The completed narrative is cached in `sessionStorage` — revisiting the page shows it instantly without re-generating
8. "Start Over" clears everything including the cached narrative (clear `selfscape:narrativeResult` inside the existing `onReset` handler in `ResultsDisplay`)

## Architecture

### API Route: `src/app/api/narrative/route.ts`

- POST endpoint
- Model: `claude-sonnet-4-20250514`
- Accepts a JSON body with the user's profile data:

```typescript
interface NarrativeRequest {
  westernZodiac: { sign: string; element: string; modality: string };
  chineseZodiac: { animal: string; yearPillar: PillarResult; monthPillar: PillarResult; dayPillar: PillarResult };
  dayMaster: { element: string; polarity: string };
  bigFive?: { o: number; c: number; e: number; a: number; n: number }; // raw scores, -2 to +2
  enneagram?: { primaryType: number; primaryName: string; suggestion?: number };
  mbti?: string; // 4-letter code like "INFJ", or omitted
}
```

- Uses `@anthropic-ai/sdk` (new dependency to install) with `stream: true`
- Pipes Anthropic SDK `text_delta` events into a `ReadableStream` returned to the client
- API key: `ANTHROPIC_API_KEY` env variable (`.env.local`, server-side only)
- If `ANTHROPIC_API_KEY` is not set, returns 500 with `{ error: "API key not configured" }`

### System Prompt

```
You are writing a personality portrait for someone. You will receive their results from one or more personality frameworks (Western zodiac, Chinese zodiac/Ba Zi, Big Five, Enneagram, MBTI). Weave together whatever data is available into a single cohesive narrative. Do not list frameworks separately — find the threads that connect them and tell the person who they are in a way that feels both true and surprising. Write in second person ("You..."). Be specific and concrete, not vague. Use literary language but stay grounded. If only zodiac data is available, craft a compelling portrait from that alone. The last line should be a single memorable sentence that captures their essence. Keep it between 100 and 200 words.
```

### Frontend Changes: `src/components/ResultsDisplay.tsx`

New section at the bottom of results, after the MBTI card:

**States:**
- `idle` — shows "Generate My Portrait" button
- `loading` — shows "Composing your portrait..." with subtle pulse animation
- `streaming` — narrative text appears token-by-token as chunks arrive from the ReadableStream
- `complete` — full narrative displayed with "Regenerate" button below
- `error` — brief error message ("Something went wrong") with "Try Again" button

**Streaming on the client:** Use `fetch` with the streaming response, read via `response.body.getReader()`, decode chunks with `TextDecoder`, and append to displayed text via React state.

**Button disabled during loading/streaming** to prevent concurrent requests.

### Session Storage

- New key: `selfscape:narrativeResult` added to `SESSION_KEYS` in `src/lib/session.ts`
- Stores the completed narrative string
- Loaded on mount — if present, skip to `complete` state
- Cleared by "Start Over" (in existing `onReset` flow) and "Regenerate"

## What's NOT Included

- No world map or visual compositing
- No separate /portrait route — everything inline on home page
- No share card generation (future step)
- No minimum assessment requirement — works with zodiac data alone
- No retry count / fallback logic — single "Try Again" button on error

## Verification

1. Enter a birthdate, tap "Generate My Portrait" — narrative streams in token-by-token
2. Navigate to /big-five, complete it, return home — narrative is still cached and shown
3. Tap "Regenerate" — new narrative streams in incorporating Big Five results
4. Tap "Start Over" — everything resets including narrative
5. Check that API key is not exposed in browser network tab (only in server-side route)
6. Test with only zodiac data (no assessments) — narrative should still be substantive
7. Double-tap "Generate" quickly — button should be disabled, only one request fires
8. Disconnect network mid-stream — error state should appear, "Try Again" button works
