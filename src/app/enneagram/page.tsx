"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardSelector from "@/components/enneagram/CardSelector";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import EnneagramResults from "@/components/EnneagramResults";
import {
  ENNEAGRAM_CENTERS,
  ENNEAGRAM_TYPES,
  ENNEAGRAM_CONFIRM_CARDS,
} from "@/data/enneagram-data";
import { scoreEnneagram } from "@/lib/enneagram-scoring";
import { saveToSession, SESSION_KEYS } from "@/lib/session";
import { EnneagramResult, SwipeResponse } from "@/lib/types";

type Phase = "center-select" | "type-select" | "confirm-swipes" | "results";

export default function EnneagramPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("center-select");
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [selectedTypeNumber, setSelectedTypeNumber] = useState<number | null>(null);
  const [result, setResult] = useState<EnneagramResult | null>(null);

  function handleCenterSelect(centerId: string) {
    setSelectedCenterId(centerId);
    setPhase("type-select");
  }

  function handleTypeSelect(typeId: string) {
    const typeNumber = Number(typeId);
    setSelectedTypeNumber(typeNumber);
    setPhase("confirm-swipes");
  }

  const confirmCards = selectedCenterId
    ? ENNEAGRAM_CONFIRM_CARDS[selectedCenterId] ?? []
    : [];

  function handleConfirmComplete(responses: SwipeResponse[]) {
    if (selectedTypeNumber === null || !confirmCards.length) return;
    const enneagramResult = scoreEnneagram(selectedTypeNumber, confirmCards, responses);
    saveToSession(SESSION_KEYS.enneagramResult, enneagramResult);
    setResult(enneagramResult);
    setPhase("results");
  }

  const selectedCenter = ENNEAGRAM_CENTERS.find((c) => c.id === selectedCenterId);
  const centerTypes = selectedCenter
    ? ENNEAGRAM_TYPES.filter((t) => t.centerId === selectedCenter.id)
    : [];

  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-4 py-12">
      {phase === "center-select" && (
        <CardSelector
          heading="Where Do You Lead From?"
          subheading="Choose the center that feels most like home"
          cards={ENNEAGRAM_CENTERS.map((c) => ({
            id: c.id,
            title: c.name,
            description: c.description,
          }))}
          onSelect={handleCenterSelect}
        />
      )}

      {phase === "type-select" && (
        <CardSelector
          heading="Which Resonates Most?"
          subheading="Read each description and choose the one that fits"
          cards={centerTypes.map((t) => ({
            id: String(t.number),
            title: t.name,
            subtitle: `Type ${t.number}`,
            description: t.description,
          }))}
          onSelect={handleTypeSelect}
        />
      )}

      {phase === "confirm-swipes" && (
        <>
          <h1 className="text-2xl font-serif text-gold mb-2">
            A Few More Questions
          </h1>
          <p className="text-foreground/40 text-sm mb-8 text-center">
            Swipe toward whichever feels more like you
          </p>
          <SwipeDeck
            cards={confirmCards}
            onComplete={handleConfirmComplete}
          />
        </>
      )}

      {phase === "results" && result && (
        <EnneagramResults
          result={result}
          onBack={() => router.push("/")}
        />
      )}
    </main>
  );
}
