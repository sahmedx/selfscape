"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import BirthdatePicker from "@/components/BirthdatePicker";
import ResultsDisplay from "@/components/ResultsDisplay";
import { getWesternZodiac } from "@/lib/western-zodiac";
import { getChineseZodiac } from "@/lib/chinese-zodiac";
import { getDayMaster } from "@/lib/day-master";
import { BirthdateResult } from "@/lib/types";
import {
  saveToSession,
  removeFromSession,
  SESSION_KEYS,
} from "@/lib/session";

const emptySubscribe = () => () => {};

function getSessionSnapshot(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEYS.birthdateResult);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export default function Home() {
  const raw = useSyncExternalStore(emptySubscribe, getSessionSnapshot, getServerSnapshot);
  const savedResult = useMemo<BirthdateResult | null>(
    () => (raw ? JSON.parse(raw) : null),
    [raw]
  );

  const [result, setResult] = useState<BirthdateResult | null>(null);
  const [hasReset, setHasReset] = useState(false);

  // Use local state if set, otherwise fall back to session (unless user has reset)
  const displayResult = result ?? (hasReset ? null : savedResult);

  function handleSubmit(month: number, day: number, year: number) {
    const western = getWesternZodiac(month, day);
    const chinese = getChineseZodiac(year, month, day);
    const dayMaster = getDayMaster(year, month, day);
    const res = { month, day, year, western, chinese, dayMaster };
    setResult(res);
    setHasReset(false);
    saveToSession(SESSION_KEYS.birthdateResult, res);
  }

  function handleReset() {
    setResult(null);
    setHasReset(true);
    removeFromSession(SESSION_KEYS.birthdateResult);
    removeFromSession(SESSION_KEYS.bigFiveScores);
    removeFromSession(SESSION_KEYS.enneagramResult);
    removeFromSession(SESSION_KEYS.mbtiResult);
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
