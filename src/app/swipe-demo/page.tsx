"use client";

import { useState } from "react";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import { SwipeCardData, SwipeResponse } from "@/lib/types";

const SAMPLE_CARDS: SwipeCardData[] = [
  {
    id: "1",
    prompt: "Which feels more like you?",
    leftLabel: "I recharge by spending a quiet evening alone with a book",
    rightLabel: "I recharge by going out with a group of friends",
  },
  {
    id: "2",
    prompt: "When making a big decision...",
    leftLabel: "I trust my gut feeling and go with what feels right",
    rightLabel: "I make a list of pros and cons and analyze carefully",
  },
  {
    id: "3",
    prompt: "On a free weekend...",
    leftLabel: "I'd rather explore somewhere I've never been before",
    rightLabel: "I'd rather revisit a favorite spot I already love",
  },
  {
    id: "4",
    prompt: "In a group project...",
    leftLabel: "I naturally take charge and organize the team",
    rightLabel: "I prefer to contribute my part without leading",
  },
  {
    id: "5",
    prompt: "When someone disagrees with me...",
    leftLabel: "I enjoy debating and defending my position",
    rightLabel: "I try to find common ground and avoid conflict",
  },
];

export default function SwipeDemoPage() {
  const [results, setResults] = useState<SwipeResponse[] | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-2xl font-serif text-gold mb-2">Swipe Demo</h1>
      <p className="text-foreground/40 text-sm mb-8 text-center">
        Drag cards left or right · Arrow keys · Tap buttons
      </p>

      {results ? (
        <div className="text-center space-y-4">
          <p className="text-gold font-serif text-lg">Results</p>
          <ul className="space-y-2 text-sm text-foreground/70">
            {results.map((r) => (
              <li key={r.cardId}>
                Card {r.cardId}: <span className="text-gold">{r.direction}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setResults(null)}
            className="mt-4 px-4 py-2 border border-gold/30 rounded-lg text-gold/70 hover:text-gold hover:border-gold transition-colors font-serif"
          >
            Try Again
          </button>
        </div>
      ) : (
        <SwipeDeck
          cards={SAMPLE_CARDS}
          onComplete={(responses) => setResults(responses)}
        />
      )}
    </main>
  );
}
