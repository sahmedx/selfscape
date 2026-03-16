"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import BirthdatePicker from "@/components/BirthdatePicker";
import WorldMap from "@/components/WorldMap";
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
    removeFromSession(SESSION_KEYS.enneagramResult);
    removeFromSession(SESSION_KEYS.mbtiResult);
  }

  return (
    <div className="min-h-svh">
      {displayResult ? (
        <WorldMap result={displayResult} onReset={handleReset} />
      ) : (
        <div className="flex min-h-svh items-center justify-center px-4">
          <BirthdatePicker onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
