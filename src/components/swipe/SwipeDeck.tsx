"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SwipeCard, { SwipeCardHandle } from "./SwipeCard";
import { SwipeCardData, SwipeDirection, SwipeResponse } from "@/lib/types";

interface SwipeDeckProps {
  cards: SwipeCardData[];
  onSwipe?: (response: SwipeResponse) => void;
  onComplete: (responses: SwipeResponse[]) => void;
}

export default function SwipeDeck({ cards, onSwipe, onComplete }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<SwipeResponse[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const topCardRef = useRef<SwipeCardHandle>(null);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      const card = cards[currentIndex];
      if (!card) return;

      const response: SwipeResponse = { cardId: card.id, direction };
      const newResponses = [...responses, response];
      setResponses(newResponses);
      onSwipe?.(response);

      // Advance to next card and unlock interactions
      setCurrentIndex((i) => i + 1);
      setIsAnimating(false);

      if (currentIndex + 1 >= cards.length) {
        onComplete(newResponses);
      }
    },
    [cards, currentIndex, responses, onSwipe, onComplete]
  );

  const triggerSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (isAnimating || currentIndex >= cards.length) return;
      setIsAnimating(true);
      topCardRef.current?.triggerSwipe(direction);
    },
    [isAnimating, currentIndex, cards.length]
  );

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        triggerSwipe("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        triggerSwipe("right");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerSwipe]);

  const isDone = currentIndex >= cards.length;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Card stack */}
      <div className="relative w-[80vw] max-w-[320px] aspect-[5/7]">
        {!isDone && (
          <>
            {/* Next card (peeking behind) */}
            {currentIndex + 1 < cards.length && (
              <div className="absolute inset-0 flex items-center justify-center scale-95 translate-y-[10px]">
                <SwipeCard
                  key={cards[currentIndex + 1].id}
                  card={cards[currentIndex + 1]}
                  onSwipe={() => {}}
                  draggable={false}
                />
              </div>
            )}

            {/* Top card (draggable) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <SwipeCard
                key={cards[currentIndex].id}
                ref={topCardRef}
                card={cards[currentIndex]}
                onSwipe={handleSwipe}
                draggable={!isAnimating}
              />
            </div>
          </>
        )}

        {isDone && (
          <div className="flex items-center justify-center h-full">
            <p className="text-foreground/40 font-serif italic text-center">
              All cards complete
            </p>
          </div>
        )}
      </div>

      {/* Tap fallback buttons */}
      {!isDone && (
        <div className="flex gap-12">
          <button
            onClick={() => triggerSwipe("left")}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full border border-gold/30 text-gold/60 hover:text-gold hover:border-gold transition-colors flex items-center justify-center disabled:opacity-30"
            aria-label="Swipe left"
          >
            ←
          </button>
          <button
            onClick={() => triggerSwipe("right")}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full border border-gold/30 text-gold/60 hover:text-gold hover:border-gold transition-colors flex items-center justify-center disabled:opacity-30"
            aria-label="Swipe right"
          >
            →
          </button>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < currentIndex
                ? "bg-gold"
                : i === currentIndex
                  ? "bg-gold/60"
                  : "bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
