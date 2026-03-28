"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [result, setResult] = useState<BirthdateResult | null>(null);

  useEffect(() => {
    const saved = loadFromSession<BirthdateResult>(SESSION_KEYS.birthdateResult);
    if (saved) setResult(saved);
  }, []);

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
    removeFromSession(SESSION_KEYS.enneagramResult);
    removeFromSession(SESSION_KEYS.mbtiResult);
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {result ? (
        <ResultsDisplay result={result} onReset={handleReset} />
      ) : (
        <BirthdatePicker onSubmit={handleSubmit} />
      )}
    </main>
  );
}
