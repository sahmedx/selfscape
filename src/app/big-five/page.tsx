"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import BigFiveResults from "@/components/BigFiveResults";
import { BIG_FIVE_CARDS } from "@/data/big-five-cards";
import { scoreBigFive, getBigFiveProfile } from "@/lib/big-five-scoring";
import { saveToSession, SESSION_KEYS } from "@/lib/session";
import { BigFiveDimension, SwipeResponse } from "@/lib/types";

export default function BigFivePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<BigFiveDimension[] | null>(null);

  function handleComplete(responses: SwipeResponse[]) {
    const scores = scoreBigFive(BIG_FIVE_CARDS, responses);
    saveToSession(SESSION_KEYS.bigFiveScores, scores);
    setProfile(getBigFiveProfile(scores));
  }

  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-4 py-12">
      {profile ? (
        <BigFiveResults
          profile={profile}
          onBack={() => router.push("/")}
        />
      ) : (
        <>
          <h1 className="text-2xl font-serif text-gold mb-2">
            Discover Your Nature
          </h1>
          <p className="text-foreground/40 text-sm mb-8 text-center">
            Swipe toward whichever feels more like you
          </p>
          <SwipeDeck
            cards={BIG_FIVE_CARDS}
            onComplete={handleComplete}
          />
        </>
      )}
    </main>
  );
}
