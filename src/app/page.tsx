"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import BirthdatePicker from "@/components/BirthdatePicker";
import ResultsDisplay from "@/components/ResultsDisplay";
import { getWesternZodiac } from "@/lib/western-zodiac";
import { getChineseZodiac } from "@/lib/chinese-zodiac";
import { getDayMaster } from "@/lib/day-master";
import { BirthdateResult } from "@/lib/types";
import {
  saveToSession,
  loadFromSession,
  removeFromSession,
  SESSION_KEYS,
} from "@/lib/session";

const emptySubscribe = () => () => {};

function useSessionResult() {
  const getSnapshot = useCallback(
    () => loadFromSession<BirthdateResult>(SESSION_KEYS.birthdateResult),
    []
  );
  const getServerSnapshot = useCallback(() => null, []);
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}

export default function Home() {
  const savedResult = useSessionResult();
  const [result, setResult] = useState<BirthdateResult | null>(null);

  // Use local state if set, otherwise fall back to session
  const displayResult = result ?? savedResult;

  function handleSubmit(month: number, day: number, year: number) {
    const western = getWesternZodiac(month, day);
    const chinese = getChineseZodiac(year, month, day);
    const dayMaster = getDayMaster(year, month, day);
    const res = { month, day, year, western, chinese, dayMaster };
    setResult(res);
    saveToSession(SESSION_KEYS.birthdateResult, res);
  }

  function handleReset() {
    setResult(null);
    removeFromSession(SESSION_KEYS.birthdateResult);
    removeFromSession(SESSION_KEYS.bigFiveScores);
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      {displayResult ? (
        <ResultsDisplay result={displayResult} onReset={handleReset} />
      ) : (
        <BirthdatePicker onSubmit={handleSubmit} />
      )}
    </div>
  );
}
